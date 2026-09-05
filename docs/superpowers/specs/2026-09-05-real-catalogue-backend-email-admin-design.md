# Real catalogue, backend functions, email and admin portal

Date: 2026-09-05. Status: approved by the store owner in chat.

## Goal

Turn the prototype storefront into the store's real system: the live
dr-alvin.com catalogue with real photos, orders written server-side, email
notifications through EmailJS, and an admin portal that controls what the
homepage shows.

## Part 1: Real catalogue and photos

**Source.** The WooCommerce Store API at
`https://dr-alvin.com/index.php/wp-json/wc/store/v1/products?per_page=100`
returns 85 simple products with prices in centavos, HTML descriptions,
category slugs and 144 image URLs.

**Script.** `scripts/import-catalog.mjs` (Node, run with `npm run import:catalog`):

1. Fetch the product list.
2. Download each image once into `scripts/.cache/` and convert with `sharp`
   to WebP, max 900px on the long edge, quality 82, written to
   `public/products/<slug>-<n>.webp`. Skip files that already exist.
3. Map each product to the app's `Product` shape:
   - `slug`: WooCommerce slug with the `dr-alvin-` prefix removed and any
     trailing `-2`, `-3` collision suffix kept so slugs stay unique.
   - `name`: HTML entities decoded, "Dr. Alvin®" prefix removed for
     brevity, brand kept in `description`.
   - `summary`: first sentence of the description, max 140 characters.
   - `description`: HTML stripped, paragraphs joined by blank lines.
   - `categorySlug` and `step`: from the first matching rule in
     `CATEGORY_RULES` (ordered), which checks WooCommerce category slugs and
     name keywords. App categories stay the existing eight: cleansers,
     soaps, toners, serums, creams, sets, sun-care, body-and-hair.
   - `priceCentavos`: `prices.price`. `compareAtCentavos`: `regular_price`
     when greater than `price`, else null.
   - Products with price `0` get `priceCentavos: 0` and `inStock: false`.
     The UI shows "Price on request" and hides the add-to-cart control.
   - `sizeLabel`: from the short description when it looks like a size,
     else an empty string.
   - `actives`, `skinConcerns`, `howToUse`: derived by keyword rules from
     the name and description (kojic, glutathione, tretinoin, arbutin,
     niacinamide, SPF, papaya, AHA, BHA, ceramides, vitamin C). Empty
     arrays are allowed.
   - `isBestSeller`: true for the six products shown on the live homepage.
   - `isFeatured` and `featuredOrder`: same six, in homepage order.
   - `images`: array of local paths `/products/<slug>-<n>.webp`.
   - `imageTone`: chosen from category for the fallback vessel.
   - `ratingAverage`, `ratingCount`: 0 (no fake reviews).
4. Write `src/data/products.ts`, keep `src/data/categories.ts` as is, and
   write `supabase/seed.sql` (delete-then-insert for categories and
   products, matching on slug).

The script is idempotent and safe to rerun.

## Part 2: Professional UI

- `ProductImage` component in `src/components/ui/`: renders the first
  image with `loading="lazy"`, a soft tonal background, `object-contain`,
  and falls back to `ProductVisual` when `images` is empty or the image
  fails to load. Square by default, accepts `className`.
- `ProductGallery` on the product page: main image plus thumbnail strip
  when a product has more than one image. Keyboard accessible.
- Use `ProductImage` in `ProductCard`, `CartDrawer`, `FeaturedProducts`,
  `OrderSummary` and the hero.
- Hero: replace the three drawn tiles with a composition of real
  best-seller photos.
- Header and footer: real Dr. Alvin logo from the live site, saved to
  `public/brand/logo.png` and `public/brand/logo.webp`, with the text
  wordmark kept as the accessible name.
- Cards: consistent 1:1 image area, subtle border, hover lift, price row
  aligned to the bottom. Skeletons match the new dimensions.
- Shop page copy updates from "Twenty products" to a count derived from
  data.

## Part 3: Backend functions (Postgres)

Migration `supabase/migrations/0002_catalogue_and_orders.sql`:

- `alter table products add column images text[] not null default '{}'`,
  `add column is_featured boolean not null default false`,
  `add column featured_order integer`.
- `alter table profiles add column role text not null default 'customer'
  check (role in ('customer','admin'))`.
- `create function public.is_admin() returns boolean` (security definer,
  stable): true when the current user's profile role is `admin`.
- `create function public.place_order(p_items jsonb, p_ship_to jsonb,
  p_payment_method payment_method) returns jsonb` (security definer):
  - `p_items` is `[{product_id, quantity}]`. Reject empty input,
    quantity < 1, unknown product, out of stock, or price 0.
  - Unit price is read from `products.price_centavos`.
  - Shipping: 0 when subtotal is 0 or >= 150000 centavos, else 9900.
    Mirrors `src/config/site.ts`.
  - Reference: `DA-` plus 8 uppercase base32 characters, retried on
    collision.
  - Inserts the order (user_id = auth.uid(), may be null) and its items in
    one transaction. Returns the order as JSON in the same shape
    `get_order_by_reference` returns.
- `create function public.get_order_by_reference(p_reference text) returns
  jsonb` (security definer): the order with items, or null.
- Drop policies "anyone can place an order" and "insert items for own or
  guest order".
- Admin policies: admins can select and update all orders and order
  items, select both inboxes, and update products.
- Grant execute on the two order functions to `anon` and `authenticated`.

Client changes in `src/features/orders/orders.api.ts`: the Supabase path
calls `supabase.rpc('place_order', ...)` and `supabase.rpc(
'get_order_by_reference', ...)`. The local fallback stays.

`src/lib/supabase/database.types.ts` is regenerated from the linked
project after the migration is pushed.

## Part 4: Email with EmailJS

- Dependency `@emailjs/browser`.
- Env vars: `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID`,
  `VITE_EMAILJS_TEMPLATE_ORDER`, `VITE_EMAILJS_TEMPLATE_INBOX`.
  `VITE_STORE_EMAIL` for the store's address.
- `src/lib/email/emailjs.ts` exports `isEmailConfigured` and
  `sendEmail(template, params)`. Missing config means a no-op that
  resolves. Errors are caught and reported through the toast store, never
  thrown to the caller, because the order or message has already been
  saved.
- Order confirmation is sent after `placeOrder` succeeds, to the customer
  with a copy to the store. Template params: `to_email`, `to_name`,
  `order_reference`, `order_date`, `items_html`, `subtotal`, `shipping`,
  `total`, `payment_method`, `ship_to`, `store_email`.
- Inbox forwarding is sent after a contact message or distributor
  application is saved. Template params: `kind`, `from_name`,
  `from_email`, `phone`, `subject`, `message`, `store_email`.
- README gains a section with the two templates' variable lists.

## Part 5: Admin portal

- Auth context exposes `profile.role`. `AdminRoute` in `src/app/routes/`
  redirects non-admins to `/`.
- Routes under `/admin`: index redirects to `/admin/products`;
  `/admin/products`, `/admin/orders`, `/admin/inbox`.
- `src/features/admin/admin.api.ts`: `updateProduct(id, patch)`,
  `fetchAllOrders()`, `updateOrderStatus(id, status)`,
  `fetchContactMessages()`, `fetchDistributorApplications()`,
  `updateApplicationStatus(id, status)`. All require Supabase; the portal
  shows a notice when it's not configured.
- Products screen: table with photo, name, price (inline edit, saved on
  blur or Enter), toggles for featured, best seller, in stock, and
  featured order number. Homepage featured section reads
  `is_featured` ordered by `featured_order`, falling back to best sellers
  when nothing is featured.
- Orders screen: list with reference, date, customer, total, status
  select. Expand to see items and address.
- Inbox screen: two tabs, contact messages and distributor applications,
  newest first, with application status select.
- Admin link appears in the account menu only when role is admin.
- Promotion: the owner registers, then
  `update public.profiles set role = 'admin' where email = '<owner>'` is
  run against the project.

## Out of scope

Payments, stock counts, image upload from the admin, product creation
from the admin, customer-facing reviews.

## Verification

Per part: `npm run build` (type check included), `npm run lint`, and a
Playwright pass on localhost capturing home, shop, product, checkout and
admin screens to `screenshots/`. Part 3 also places a guest order through
`place_order` with curl against the live project and checks the rows.
