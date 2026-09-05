/**
 * Imports the live dr-alvin.com catalogue into this project.
 *
 *   npm run import:catalog
 *
 * Pulls every product from the WooCommerce Store API, downloads and converts
 * the photos to WebP under public/products, and regenerates
 * src/data/products.ts and supabase/seed.sql so the local fallback and the
 * database always carry the same catalogue. Safe to rerun: photos that
 * already exist are skipped.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SOURCE = 'https://dr-alvin.com/index.php/wp-json/wc/store/v1/products?per_page=100'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE_DIR = path.join(ROOT, 'scripts', '.cache')
const IMAGE_DIR = path.join(ROOT, 'public', 'products')
const PRODUCTS_TS = path.join(ROOT, 'src', 'data', 'products.ts')
const SEED_SQL = path.join(ROOT, 'supabase', 'seed.sql')
const MAX_EDGE = 900
const USER_AGENT = 'Mozilla/5.0 (catalogue import for dr-alvin storefront)'

/** Products shown on the live homepage, in order. They become featured and best sellers. */
const HOMEPAGE_SLUGS = [
  'dr-alvin-all-in-1-maintenance-cream',
  'dr-alvin-gluta-kojic-acid-soap',
  'dr-alvin-whitening-sunscreen-cream-gel-spf50-pa',
  'dr-alvin-all-in-1-maintenance-set',
  'dr-alvin-kojic-acid-soap-5',
  'dr-alvin-all-in-1-maintenance-toner-2',
]

/** First matching rule wins. Tests run against lowercase name + woo category slugs. */
const CATEGORY_RULES = [
  { test: /\bsoap\b/, category: 'soaps', step: 'cleanse', tone: 'marigold' },
  { test: /\b(set|bundle)\b/, category: 'sets', step: 'treat', tone: 'violet' },
  { test: /toner/, category: 'toners', step: 'tone', tone: 'leaf' },
  { test: /serum/, category: 'serums', step: 'treat', tone: 'violet' },
  { test: /sunscreen|spf|absorbing film/, category: 'sun-care', step: 'protect', tone: 'marigold' },
  { test: /wash|cleanser|cleansing oil|micellar/, category: 'cleansers', step: 'cleanse', tone: 'chalk' },
  { test: /lotion|deodorant|shampoo|conditioner|minoxidil|lip balm|toilet|body/, category: 'body-and-hair', step: 'protect', tone: 'leaf' },
  { test: /cream/, category: 'creams', step: 'treat', tone: 'sand' },
]

const ACTIVE_RULES = [
  [/kojic/, 'Kojic Acid'],
  [/gluta/, 'Glutathione'],
  [/tretinoin/, 'Tretinoin'],
  [/hydroquinone/, 'Hydroquinone'],
  [/arbutin/, 'Alpha Arbutin'],
  [/niacinamide/, 'Niacinamide'],
  [/vitamin c|beautamin c|ascorb/, 'Vitamin C'],
  [/vitamin e/, 'Vitamin E'],
  [/papaya|papain/, 'Papaya Enzyme'],
  [/calamansi/, 'Calamansi'],
  [/\baha\b|glycolic|multifruit/, 'AHA'],
  [/\bbha\b|salicylic/, 'BHA'],
  [/\btxa\b|tranexamic/, 'Tranexamic Acid'],
  [/ceram/, 'Ceramides'],
  [/spf/, 'SPF 50+'],
  [/placenta/, 'Placenta Extract'],
  [/tea tree/, 'Tea Tree Oil'],
  [/oatmeal/, 'Colloidal Oatmeal'],
  [/honey/, 'Honey'],
  [/minoxidil/, 'Minoxidil 5%'],
  [/charcoal|black soap/, 'Activated Charcoal'],
]

const CONCERN_RULES = [
  [/whiten|lighten|bright|dark spot|melasma|pigment|hydroquinone|kojic|gluta|arbutin/, 'Dark spots'],
  [/acne|pimple|blemish|tea tree|salicylic|bha/, 'Acne'],
  [/even|tone|clarif/, 'Uneven tone'],
  [/moistur|hydrat|dry|ceram|barrier|oatmeal|honey/, 'Dryness'],
  [/oil control|oily|matte|absorbing/, 'Oiliness'],
  [/sensitive|gentle|mild|hypo|barrier/, 'Sensitivity'],
  [/anti-aging|aging|wrinkle|fine line|tretinoin|collagen|placenta/, 'Fine lines'],
  [/spf|sunscreen|sun /, 'Sun damage'],
]

const HOW_TO_USE = {
  soaps: [
    'Work into a lather with water rather than rubbing the bar on skin.',
    'Leave on for 30 seconds, then rinse well.',
    'Use once daily to start, twice once skin adjusts.',
  ],
  cleansers: [
    'Massage onto damp skin for 30 seconds.',
    'Rinse thoroughly and pat dry.',
    'Follow with toner while skin is still damp.',
  ],
  toners: [
    'Sweep over the face with a cotton pad after cleansing.',
    'Let it dry before applying cream or serum.',
    'Use morning and night.',
  ],
  serums: [
    'Apply two or three drops to clean, dry skin.',
    'Press in rather than rubbing.',
    'Follow with sunscreen every morning.',
  ],
  creams: [
    'Apply a pea-sized amount to clean skin.',
    'Use at night, or as directed for your regimen step.',
    'Never skip sunscreen the following morning.',
  ],
  sets: [
    'Follow the numbered order printed on the box.',
    'Introduce actives gradually over the first week.',
    'Wear SPF 50+ every morning for the whole course.',
  ],
  'sun-care': [
    'Apply generously 15 minutes before sun exposure.',
    'Reapply every two hours outdoors.',
    'Use as the last step of the morning routine.',
  ],
  'body-and-hair': [
    'Apply to clean skin or hair as directed on the label.',
    'Use daily for best results.',
  ],
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true })
  await mkdir(IMAGE_DIR, { recursive: true })

  console.log('Fetching catalogue…')
  const raw = await fetchJson(SOURCE)
  console.log(`  ${raw.length} products`)

  const products = []
  const usedNames = new Map()

  for (const item of raw) {
    const product = await toProduct(item)
    products.push(product)
    usedNames.set(product.name, (usedNames.get(product.name) ?? 0) + 1)
  }

  // Same-name variants (different sizes) get the size appended so they are distinguishable.
  for (const product of products) {
    if (usedNames.get(product.name) > 1 && product.sizeLabel) {
      product.name = `${product.name}, ${product.sizeLabel}`
    }
  }

  products.sort(sortForCatalogue)

  await writeFile(PRODUCTS_TS, renderProductsTs(products))
  await writeFile(SEED_SQL, renderSeedSql(products))
  console.log(`Wrote ${products.length} products to src/data/products.ts and supabase/seed.sql`)
}

async function toProduct(item) {
  const wooSlug = item.slug
  const slug = wooSlug.replace(/^dr-alvin-/, '')
  const haystack = `${decode(item.name)} ${item.categories.map((c) => c.slug).join(' ')}`.toLowerCase()
  const rule = CATEGORY_RULES.find((r) => r.test.test(haystack)) ?? CATEGORY_RULES.at(-1)
  const description = htmlToText(item.description)
  const searchable = `${haystack} ${description.toLowerCase()}`

  const images = []
  for (const [index, image] of item.images.entries()) {
    const file = await importImage(image.src, `${slug}-${index + 1}`)
    if (file) images.push(`/products/${file}`)
  }

  const price = Number(item.prices.price)
  const regular = Number(item.prices.regular_price)
  const homepageIndex = HOMEPAGE_SLUGS.indexOf(wooSlug)

  return {
    id: `p-${slug}`,
    slug,
    name: cleanName(item.name),
    summary: summarise(description, item.name),
    description: description || decode(item.name),
    actives: ACTIVE_RULES.filter(([re]) => re.test(searchable)).map(([, label]) => label),
    categorySlug: rule.category,
    step: rule.step,
    priceCentavos: price,
    compareAtCentavos: regular > price ? regular : null,
    sizeLabel: sizeLabel(item.short_description),
    howToUse: HOW_TO_USE[rule.category] ?? [],
    skinConcerns: CONCERN_RULES.filter(([re]) => re.test(searchable)).map(([, label]) => label),
    isFdaRegistered: true,
    isBestSeller: homepageIndex >= 0,
    isFeatured: homepageIndex >= 0,
    featuredOrder: homepageIndex >= 0 ? homepageIndex + 1 : null,
    inStock: price > 0 && item.is_in_stock !== false,
    ratingAverage: 0,
    ratingCount: 0,
    imageTone: rule.tone,
    images,
  }
}

async function importImage(url, baseName) {
  const target = `${baseName}.webp`
  const targetPath = path.join(IMAGE_DIR, target)
  if (await exists(targetPath)) return target

  const cachePath = path.join(CACHE_DIR, path.basename(new URL(url).pathname))
  let buffer
  if (await exists(cachePath)) {
    buffer = await readFile(cachePath)
  } else {
    const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } })
    if (!response.ok) {
      console.warn(`  skip ${url}: HTTP ${response.status}`)
      return null
    }
    buffer = Buffer.from(await response.arrayBuffer())
    await writeFile(cachePath, buffer)
  }

  try {
    await sharp(buffer)
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(targetPath)
    console.log(`  ${target}`)
    return target
  } catch (error) {
    console.warn(`  skip ${url}: ${error.message}`)
    return null
  }
}

// ----------------------------------------------------------------- helpers

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'user-agent': USER_AGENT, accept: 'application/json' } })
  if (!response.ok) throw new Error(`${url} responded ${response.status}`)
  return response.json()
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

function decode(text) {
  return String(text ?? '')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .trim()
}

function htmlToText(html) {
  return decode(
    String(html ?? '')
      .replace(/<\s*(br|\/p|\/li|\/h\d)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n\n')
}

function cleanName(name) {
  return decode(name)
    .replace(/^Dr\.?\s*Alvin®?\s*[-–]?\s*/i, '')
    .replace(/\s*®/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function summarise(description, name) {
  // Guard abbreviations so "Dr. Alvin" and "No. 1" do not end the sentence early.
  const guarded = description.replace(/\b(Dr|No|Mr|Mrs|Ms|vs)\./g, '$1 ')
  const firstSentence = (guarded.split(/(?<=[.!?])\s+/)[0] ?? '').replace(/ /g, '.')
  const summary = firstSentence.length > 140 ? `${firstSentence.slice(0, 137).trimEnd()}…` : firstSentence
  return summary || cleanName(name)
}

function sizeLabel(shortDescription) {
  const text = htmlToText(shortDescription).replace(/\n/g, ' ').trim()
  if (!text) return ''
  if (/^\d/.test(text) || /^bundle$/i.test(text)) {
    return text
      .replace(/(\d)\s*(ml|g|mL|G|ML)\b/gi, (_, n, unit) => `${n} ${unit.toLowerCase()}`)
      .replace(/(\d)\s*sheets/i, '$1 sheets')
      .replace(/^1\s*set$/i, '1 set')
      .replace(/\s*x\s*(\d+)s$/i, ' × $1')
      .replace(/^bundle$/i, 'Bundle')
  }
  return ''
}

function sortForCatalogue(a, b) {
  if (a.featuredOrder !== null || b.featuredOrder !== null) {
    if (a.featuredOrder === null) return 1
    if (b.featuredOrder === null) return -1
    return a.featuredOrder - b.featuredOrder
  }
  if (a.categorySlug !== b.categorySlug) return a.categorySlug.localeCompare(b.categorySlug)
  return a.name.localeCompare(b.name)
}

function renderProductsTs(products) {
  const body = JSON.stringify(products, null, 2)
  return `import type { Product } from '@/types'

/**
 * Seed catalogue, generated from the live dr-alvin.com store by
 * scripts/import-catalog.mjs. Do not edit by hand: run
 * \`npm run import:catalog\` instead. Prices are in centavos.
 */
export const products: Product[] = ${body}
`
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

function sqlArray(values) {
  if (!values.length) return "'{}'::text[]"
  return `array[${values.map(sqlString).join(',')}]`
}

function renderSeedSql(products) {
  const rows = products
    .map((p) =>
      [
        `  (${sqlString(p.slug)}, ${sqlString(p.name)}, ${sqlString(p.summary)}, ${sqlString(p.description)},`,
        `   ${sqlArray(p.actives)}, (select id from c where slug=${sqlString(p.categorySlug)}), ${sqlString(p.step)},`,
        `   ${p.priceCentavos}, ${p.compareAtCentavos ?? 'null'}, ${sqlString(p.sizeLabel)},`,
        `   ${sqlArray(p.howToUse)}, ${sqlArray(p.skinConcerns)},`,
        `   ${p.isBestSeller}, ${p.isFeatured}, ${p.featuredOrder ?? 'null'}, ${p.inStock}, ${p.ratingAverage}, ${p.ratingCount}, ${sqlString(p.imageTone)}, ${sqlArray(p.images)})`,
      ].join('\n'),
    )
    .join(',\n')

  return `-- Dr. Alvin — seed data
-- Generated from the live dr-alvin.com catalogue by scripts/import-catalog.mjs.
-- Mirrors src/data/products.ts so the app looks identical with or without Supabase.
-- Rerunnable: existing products and categories are replaced.

delete from public.products;
delete from public.categories;

insert into public.categories (slug, name, blurb, step, sort_order) values
  ('cleansers',     'Cleansers',   'Lift the day off without stripping the barrier.',                     'cleanse', 1),
  ('soaps',         'Soaps',       'The bars that built the brand — kojic, arbutin, glutathione.',        'cleanse', 2),
  ('toners',        'Toners',      'Rebalance after cleansing and prep skin for actives.',                'tone',    3),
  ('serums',        'Serums',      'High-concentration actives for a single, specific job.',              'treat',   4),
  ('creams',        'Creams',      'Seal in moisture and hold the results you have earned.',              'treat',   5),
  ('sets',          'Sets',        'A full routine in one box, sequenced for you.',                       'treat',   6),
  ('sun-care',      'Sun care',    'Non-negotiable in tropical sun, especially on actives.',              'protect', 7),
  ('body-and-hair', 'Body & hair', 'The same formulations, scaled past the face.',                        'protect', 8);

with c as (select id, slug from public.categories)
insert into public.products
  (slug, name, summary, description, actives, category_id, step, price_centavos, compare_at_centavos, size_label, how_to_use, skin_concerns, is_best_seller, is_featured, featured_order, in_stock, rating_average, rating_count, image_tone, images)
values
${rows};
`
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
