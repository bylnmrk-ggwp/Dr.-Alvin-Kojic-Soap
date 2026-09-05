// Supabase Edge Function: streams answers for the "Ask Dr. Alvin" chat
// widget. Uses Groq when GROQ_API_KEY is set, otherwise Anthropic. The keys
// live only here, as project secrets.
//
//   npx supabase functions deploy chat --no-verify-jwt
//   npx supabase secrets set GROQ_API_KEY=gsk_...   (or ANTHROPIC_API_KEY=sk-ant-...)

import { BRAND, FAQ, GUARDRAILS, POLICIES, REGIMEN } from './knowledge.ts'

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') ?? ''
const GROQ_MODEL = Deno.env.get('GROQ_MODEL') ?? 'openai/gpt-oss-120b'
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-5'
const PROVIDER: 'groq' | 'anthropic' | null = GROQ_API_KEY ? 'groq' : ANTHROPIC_API_KEY ? 'anthropic' : null
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

// Groq's free tier counts prompt + max_tokens against an 8,000 tokens-per-minute
// cap, so the prompt is kept compact: recent turns only, and just the products
// that matter for the question plus a short index of the rest.
const MAX_TURNS = 8
const MAX_MESSAGE_CHARS = 1000
const MAX_OUTPUT_TOKENS = 600
const MAX_DETAILED_PRODUCTS = 28
const CATALOGUE_TTL_MS = 10 * 60 * 1000
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 30 }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ProductRow {
  slug: string
  name: string
  summary: string
  price_centavos: number
  size_label: string
  step: string
  in_stock: boolean
  actives: string[]
  skin_concerns: string[]
  category_id: string
}

interface CategoryRow {
  id: string
  slug: string
  name: string
}

// ---------------------------------------------------------------- catalogue

interface CatalogueProduct extends ProductRow {
  is_featured: boolean
  is_best_seller: boolean
  category: string
}

let catalogueCache: { products: CatalogueProduct[]; fetchedAt: number } | null = null

async function fetchCatalogue(): Promise<CatalogueProduct[]> {
  if (catalogueCache && Date.now() - catalogueCache.fetchedAt < CATALOGUE_TTL_MS) {
    return catalogueCache.products
  }

  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  const [productsRes, categoriesRes] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,name,summary,price_centavos,size_label,step,in_stock,actives,skin_concerns,category_id,is_featured,is_best_seller&order=name`,
      { headers },
    ),
    fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,slug,name`, { headers }),
  ])

  if (!productsRes.ok || !categoriesRes.ok) {
    throw new Error('Could not load the catalogue')
  }

  const rows = (await productsRes.json()) as (ProductRow & { is_featured: boolean; is_best_seller: boolean })[]
  const categories = (await categoriesRes.json()) as CategoryRow[]
  const categoryById = new Map(categories.map((c) => [c.id, c.name]))

  const products = rows.map((row) => ({ ...row, category: categoryById.get(row.category_id) ?? 'product' }))
  catalogueCache = { products, fetchedAt: Date.now() }
  return products
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'what', 'which', 'this', 'that', 'have', 'you', 'your', 'can', 'how', 'much',
  'ang', 'ng', 'mga', 'para', 'ako', 'ito', 'yung', 'magkano', 'ba', 'po', 'sa', 'na', 'ang', 'may', 'meron',
  'good', 'best', 'price', 'product', 'products', 'skin', 'soap', 'set', 'cream', 'toner',
])

/** Words from the latest user turns that are worth matching against the catalogue. */
function queryTerms(messages: ChatMessage[]): string[] {
  const recentUser = messages.filter((m) => m.role === 'user').slice(-2)
  const words = recentUser
    .flatMap((m) => m.content.toLowerCase().split(/[^a-z0-9+]+/))
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
  return [...new Set(words)]
}

function productLine(p: CatalogueProduct, withSummary: boolean): string {
  const price = p.price_centavos > 0 ? `₱${(p.price_centavos / 100).toLocaleString('en-PH')}` : 'price on request'
  const bits = [
    `${p.name} (${p.category}, ${p.step})`,
    price + (p.size_label ? `, ${p.size_label}` : ''),
    p.in_stock ? 'in stock' : 'OUT OF STOCK',
    `/product/${p.slug}`,
  ]
  if (p.actives?.length) bits.push(`actives: ${p.actives.join(', ')}`)
  if (p.skin_concerns?.length) bits.push(`for: ${p.skin_concerns.join(', ')}`)
  let line = `- ${bits.join(' | ')}`
  if (withSummary && p.summary) line += ` — ${p.summary.slice(0, 110)}`
  return line
}

/**
 * The catalogue section of the prompt: full details for products that match
 * the question (or the featured range when nothing matches), and a name-only
 * index of everything else so the assistant knows what exists.
 */
function catalogueSection(products: CatalogueProduct[], messages: ChatMessage[]): string {
  const terms = queryTerms(messages)
  const haystack = (p: CatalogueProduct) =>
    `${p.name} ${p.slug} ${p.category} ${p.step} ${p.actives?.join(' ')} ${p.skin_concerns?.join(' ')}`.toLowerCase()

  const scored = products
    .map((p) => {
      const text = haystack(p)
      const score = terms.reduce((n, term) => n + (text.includes(term) ? 1 : 0), 0)
      return { p, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || Number(b.p.in_stock) - Number(a.p.in_stock) || a.p.name.localeCompare(b.p.name))
    .map((item) => item.p)

  const featured = products.filter((p) => p.is_featured || p.is_best_seller)
  const detailed: CatalogueProduct[] = []
  for (const p of [...scored, ...featured]) {
    if (detailed.length >= MAX_DETAILED_PRODUCTS) break
    if (!detailed.includes(p)) detailed.push(p)
  }

  const detailedSet = new Set(detailed)
  const others = products.filter((p) => !detailedSet.has(p)).map((p) => p.name)

  return [
    'Products relevant to this conversation (name | price | availability | page | actives | concerns):',
    ...detailed.map((p, index) => productLine(p, index < 10)),
    '',
    `Other products in the range (ask the customer which one, or send them to /shop): ${others.join('; ')}`,
  ].join('\n')
}

// -------------------------------------------------------------- rate limit

const hits = new Map<string, number[]>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > RATE_LIMIT.max
}

// ----------------------------------------------------------------- helpers

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function sanitiseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null
  const messages: ChatMessage[] = []
  for (const item of input.slice(-MAX_TURNS)) {
    if (!item || typeof item !== 'object') return null
    const { role, content } = item as Record<string, unknown>
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const trimmed = content.trim().slice(0, MAX_MESSAGE_CHARS)
    if (!trimmed) continue
    messages.push({ role, content: trimmed })
  }
  // Anthropic requires the conversation to start with the user.
  while (messages.length && messages[0].role !== 'user') messages.shift()
  return messages.length && messages[messages.length - 1].role === 'user' ? messages : null
}

// ------------------------------------------------------------------ handler

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }
  if (!PROVIDER) {
    return json({ error: 'The assistant is not configured yet.' }, 503)
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return json({ error: 'Too many messages in a short time. Please try again in a few minutes.' }, 429)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  const messages = sanitiseMessages((payload as { messages?: unknown })?.messages)
  if (!messages) {
    return json({ error: 'Send at least one message.' }, 400)
  }

  let catalogue: string
  try {
    catalogue = catalogueSection(await fetchCatalogue(), messages)
  } catch (error) {
    console.error(error)
    catalogue = '(catalogue temporarily unavailable; direct the customer to /shop)'
  }

  const system = [
    GUARDRAILS,
    `About the brand:\n${BRAND}`,
    `Store policies:\n${POLICIES}`,
    `The routine:\n${REGIMEN}`,
    `Frequently asked questions:\n${FAQ}`,
    `Catalogue (prices in Philippine pesos):\n${catalogue}`,
  ].join('\n\n')

  const upstream =
    PROVIDER === 'groq'
      ? await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            max_tokens: MAX_OUTPUT_TOKENS,
            stream: true,
            // gpt-oss models spend tokens thinking; keep it light for a shop assistant.
            reasoning_effort: 'low',
            messages: [{ role: 'system', content: system }, ...messages],
          }),
        })
      : await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_OUTPUT_TOKENS,
            stream: true,
            system,
            messages,
          }),
        })

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '')
    console.error(`${PROVIDER} error`, upstream.status, detail)
    return json(
      {
        error: 'The assistant could not answer right now. Please try again shortly.',
        // Diagnostic detail is only included when DEBUG_CHAT is set on the project.
        ...(Deno.env.get('DEBUG_CHAT') ? { provider: PROVIDER, status: upstream.status, detail: detail.slice(0, 400) } : {}),
      },
      502,
    )
  }

  /** Pulls the text fragment out of one upstream SSE event, whichever provider sent it. */
  const extractText = (event: Record<string, unknown>): string | null => {
    if (PROVIDER === 'groq') {
      const choices = event.choices as { delta?: { content?: string } }[] | undefined
      return choices?.[0]?.delta?.content ?? null
    }
    const delta = event.delta as { type?: string; text?: string } | undefined
    return event.type === 'content_block_delta' && delta?.type === 'text_delta' ? (delta.text ?? null) : null
  }

  // Re-emit only the text deltas as our own small SSE stream.
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let buffer = ''

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (!data || data === '[DONE]') continue
            try {
              const event = JSON.parse(data) as Record<string, unknown>
              const text = extractText(event)
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
              } else if (event.type === 'error' || event.error) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'The assistant hit a problem.' })}\n\n`))
              }
            } catch {
              // Partial JSON across chunks is handled by the buffer above.
            }
          }
        }
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
})
