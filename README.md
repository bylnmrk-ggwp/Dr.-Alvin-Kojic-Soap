# Dr. Alvin — web app

A rebuild of [dr-alvin.com](https://dr-alvin.com) as a React storefront: catalogue, cart, checkout, accounts, regimen guide, reseller applications and a support inbox.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, RLS) · TanStack Query · Zustand · React Router · react-hook-form + Zod.

## Run it

```bash
npm install
npm run dev
```

That is enough. Without Supabase credentials the app runs on the local seed catalogue, the cart persists in `localStorage`, and checkout writes orders locally so the whole flow can be walked end to end. Account pages explain what is missing.

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
3. Copy `.env.example` to `.env.local` and fill in the Project URL and anon key from *Project Settings → API*.
4. Restart `npm run dev`.

Auth (email + password), persisted orders, the reseller inbox and the contact inbox all switch on automatically. Row-level security is already in the migration: the catalogue is public, users read only their own profile and orders, and both inboxes are insert-only from the client.

To regenerate the database types after changing the schema:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/database.types.ts
```

## Email notifications (EmailJS)

Order confirmations and inbox alerts (contact messages and reseller applications) are sent from the browser through [EmailJS](https://www.emailjs.com). Like Supabase this is optional: without the keys the helpers in `src/lib/email/emailjs.ts` resolve silently and nothing else changes. A failed send is logged with `console.warn` and never blocks the order or message, which has already been saved by then.

1. Create a free EmailJS account and add an **Email Service** (Gmail, Outlook or any SMTP). Note its Service ID.
2. Under *Email Templates* create the two templates below and note each Template ID.
3. Fill in the variables in `.env.local` and restart `npm run dev`. Add the same variables under *Settings → Environment Variables* in the Vercel project and redeploy.

### Template: Order confirmation

| Field | Value |
| --- | --- |
| To email | `{{to_email}}` |
| CC | `{{store_email}}` |
| Subject | `Order {{order_reference}} confirmed` (or anything you like) |

Variables available in the body: `{{to_email}}`, `{{to_name}}`, `{{order_reference}}`, `{{order_date}}`, `{{items_html}}`, `{{items_text}}`, `{{subtotal}}`, `{{shipping}}`, `{{total}}`, `{{payment_method}}`, `{{ship_to}}`, `{{store_email}}`.

`items_html` is a ready-made `<table>` of the order lines (name, size, quantity, line total); write it as `{{{items_html}}}` with triple braces so EmailJS does not escape the markup. `items_text` is the same list as plain lines for a text-only design.

### Template: Inbox notification

| Field | Value |
| --- | --- |
| To email | `{{store_email}}` |
| Reply-To | `{{from_email}}` |
| Subject | `{{subject}}` |

Variables available in the body: `{{kind}}` (`contact` or `distributor`), `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`, `{{store_email}}`.

### Environment variables

| Variable | Where to find it |
| --- | --- |
| `VITE_EMAILJS_PUBLIC_KEY` | *Account → General → Public Key* |
| `VITE_EMAILJS_SERVICE_ID` | *Email Services*, the service you added |
| `VITE_EMAILJS_TEMPLATE_ORDER` | Template ID of *Order confirmation* |
| `VITE_EMAILJS_TEMPLATE_INBOX` | Template ID of *Inbox notification* |
| `VITE_STORE_EMAIL` | The address that receives inbox mail and order copies. Falls back to `site.email` in `src/config/site.ts`. |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint with oxlint |

## Folder structure

```
dr-alvin-web/
├── index.html                  Fonts, meta, root mount
├── public/                     Static assets served as-is
├── supabase/
│   ├── migrations/0001_init.sql  Schema, triggers, RLS policies
│   └── seed.sql                  Catalogue seed mirroring src/data
└── src/
    ├── main.tsx                App entry
    ├── app/                    Composition root — nothing domain-specific lives here
    │   ├── layouts/            RootLayout (header, footer, drawers, toasts)
    │   ├── providers/          QueryClient + Auth
    │   └── routes/             Router, protected route, error boundary
    ├── pages/                  One file per route; pages compose features, hold no logic
    │   ├── account/
    │   └── auth/
    ├── features/               Domain slices — each owns its API, hooks and UI
    │   ├── auth/               Session context + useAuth
    │   ├── catalog/            Products/categories API, queries, filters, cards
    │   ├── cart/               Cart drawer, quantity stepper
    │   ├── orders/             Place/fetch orders, summary components
    │   ├── distributor/        Reseller application API
    │   ├── support/            Contact inbox API
    │   └── marketing/          Home-page sections
    ├── components/
    │   ├── ui/                 Primitives: Button, Field, Badge, Drawer, Accordion…
    │   ├── layout/             Header, Footer, MobileNav, SearchOverlay, Logo
    │   └── common/             PageMeta, SectionHeading, ScrollToTop
    ├── stores/                 Zustand: cart (persisted), toasts
    ├── hooks/                  Generic hooks (scroll lock, escape key)
    ├── lib/
    │   ├── supabase/           Client + generated database types
    │   ├── email/              EmailJS helpers: order confirmation, inbox alerts
    │   ├── validation/         Zod schemas shared by forms and API
    │   └── utils/              cn, money/date formatting, slugs
    ├── config/                 Site constants, navigation
    ├── data/                   Seed catalogue, FAQs, testimonials
    ├── types/                  Domain types (catalog, commerce, account)
    └── styles/globals.css      Tailwind v4 theme tokens and base styles
```

### Conventions

- **Money is integer centavos** everywhere except the formatter. No floats reach a total.
- **Features own their data access.** Pages import from `features/*`, never from `lib/supabase` directly.
- **Every read falls back.** `features/*/api` checks `supabase` and returns seed/local data when it is null, so the UI never has a "not configured" branch of its own.
- **Path alias** `@/` → `src/`.
- **Design tokens** live in `src/styles/globals.css` under `@theme`. Colours are named for their role (`ink`, `paper`, `violet`, `marigold`, `verified`), not their hue.

## Design notes

The brand's real differentiator is that actives and concentrations are printed on the label, so the interface is built like a formulary rather than a spa: an ingredient tag on every product, a numbered four-step regimen (the one place numbering is honest), and an ingredient index on the home page. Marigold — the brand orange — is reserved for primary actions; the brand violet does wayfinding. Familjen Grotesk carries interface and prices, Newsreader carries prose.
