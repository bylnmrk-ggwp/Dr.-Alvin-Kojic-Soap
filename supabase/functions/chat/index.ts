// Supabase Edge Function: streams answers from Claude for the "Ask Dr. Alvin"
// chat widget. The Anthropic key lives only here, as a project secret.
//
//   npx supabase functions deploy chat --no-verify-jwt
//   npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { BRAND, FAQ, GUARDRAILS, POLICIES, REGIMEN } from './knowledge.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-5'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const MAX_TURNS = 12
const MAX_MESSAGE_CHARS = 1500
const MAX_OUTPUT_TOKENS = 700
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

let catalogueCache: { text: string; fetchedAt: number } | null = null

async function catalogueText(): Promise<string> {
  if (catalogueCache && Date.now() - catalogueCache.fetchedAt < CATALOGUE_TTL_MS) {
    return catalogueCache.text
  }

  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  const [productsRes, categoriesRes] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,name,summary,price_centavos,size_label,step,in_stock,actives,skin_concerns,category_id&order=name`,
      { headers },
    ),
    fetch(`${SUPABASE_URL}/rest/v1/categories?select=id,slug,name`, { headers }),
  ])

  if (!productsRes.ok || !categoriesRes.ok) {
    throw new Error('Could not load the catalogue')
  }

  const products = (await productsRes.json()) as ProductRow[]
  const categories = (await categoriesRes.json()) as CategoryRow[]
  const categoryById = new Map(categories.map((c) => [c.id, c.name]))

  const lines = products.map((p) => {
    const price = p.price_centavos > 0 ? `₱${(p.price_centavos / 100).toLocaleString('en-PH')}` : 'price on request'
    const availability = p.in_stock ? 'in stock' : 'out of stock'
    const actives = p.actives?.length ? `; actives: ${p.actives.join(', ')}` : ''
    const concerns = p.skin_concerns?.length ? `; for: ${p.skin_concerns.join(', ')}` : ''
    return `- ${p.name} (${categoryById.get(p.category_id) ?? 'product'}, ${p.step} step) — ${price}${p.size_label ? `, ${p.size_label}` : ''}, ${availability}, page /product/${p.slug}${actives}${concerns}. ${p.summary}`
  })

  const text = lines.join('\n')
  catalogueCache = { text, fetchedAt: Date.now() }
  return text
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
  if (!ANTHROPIC_API_KEY) {
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
    catalogue = await catalogueText()
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

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
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
    console.error('Anthropic error', upstream.status, detail)
    return json({ error: 'The assistant could not answer right now. Please try again shortly.' }, 502)
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
            if (!data) continue
            try {
              const event = JSON.parse(data)
              if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`))
              } else if (event.type === 'error') {
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
