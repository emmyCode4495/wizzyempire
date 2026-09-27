# LUME — Next.js Clothing Marketplace

A complete, modern clothing marketplace built with Next.js 16 (App Router),
React 19, TypeScript, Tailwind CSS and Supabase. Includes full authentication,
a persistent cart (guest + synced-to-server), product catalog with
categories, search and sorting, and a checkout flow that writes real orders
to your database.

## Stack

- **Next.js 16** (Active LTS, currently 16.3.x) — App Router, Server
  Components, Route Handlers, `proxy.ts`
- **React 19.3**
- **Supabase** — Postgres database, Auth, Row Level Security
- **Tailwind CSS** — design tokens, no component library lock-in
- **Zustand** — cart state (persisted to `localStorage`, synced to Supabase
  when signed in)
- **Framer-motion-free micro animations** — CSS keyframes + Tailwind for
  performance; swap in Framer Motion where you want richer transitions
- **sonner** — toast notifications
- **lucide-react** — icons

## Features

- 🛍️ Product catalog: categories, product detail pages with galleries,
  size/color selection, related products
- 🔍 Search, category filters and sorting on the shop page
- 🛒 Cart: add/update/remove, guest cart persisted locally, merged and synced
  to Supabase on login, live count in the header, slide-in drawer + full page
- 🔐 Auth: email/password sign up & login via Supabase Auth, protected
  `/account` and `/checkout` routes via middleware, auto-created profile row
  on sign up
- 💳 Checkout: shipping address form, order summary, order + order_items
  written to Supabase on submit (payment step is stubbed — see below)
- 📦 Order history and profile page under `/account`
- 📱 Fully responsive, keyboard-accessible, `prefers-reduced-motion` aware
- 🎨 Distinctive editorial visual identity (not a generic SaaS template)

## Upgraded to Next.js 16

This project targets **Next.js 16.3.x (Active LTS)** and **React 19.3**.
Next.js 16 made several breaking changes since 14, all already handled in
this codebase:

- **`middleware.ts` → `proxy.ts`**. Next.js 16 renames Middleware to Proxy
  and runs it on the Node.js runtime by default (previously Edge). The root
  file is now `proxy.ts`, exporting a `proxy()` function instead of
  `middleware()`. `lib/supabase/middleware.ts` moved to
  `lib/supabase/proxy.ts` accordingly.
- **`params` and `searchParams` are now `Promise`s.** Every page that reads
  a dynamic route segment or a query string (`app/shop/page.tsx`,
  `app/category/[slug]/page.tsx`, `app/product/[slug]/page.tsx`,
  `app/checkout/success/page.tsx`, including `generateMetadata`) now
  declares those props as `Promise<...>` and `await`s them before use.
- **`cookies()` is now async**, and `@supabase/ssr` (0.12+) only supports the
  `getAll`/`setAll` cookie API — the older per-cookie `get`/`set`/`remove`
  API is gone. `lib/supabase/server.ts`'s `createClient()` is now an `async`
  function; every server-side call site (`lib/data.ts`,
  `components/site-header.tsx`, the account pages, and both API routes)
  awaits it.
- **`next lint` was removed.** If you want linting, run
  `npx @next/codemod@canary next-lint-to-eslint-cli .` to generate a
  standalone ESLint config, or set one up manually.
- **Node.js 20.9+ is required.** Check with `node --version` before
  installing.

If you're upgrading a different Next.js 14/15 project by hand, Vercel ships
an automated codemod that handles most of the above:

```bash
npx @next/codemod@canary upgrade latest
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the SQL editor and run the contents of `supabase/schema.sql`. This
   creates all tables, Row Level Security policies, the auth trigger that
   creates a `profiles` row on sign up, and seeds some demo products.
3. In **Project Settings → API**, copy your Project URL and anon public key.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 5. (Optional) Disable email confirmation for local testing

By default Supabase requires email confirmation before login. For quick local
testing, go to **Authentication → Providers → Email** in your Supabase
dashboard and turn "Confirm email" off, or check your inbox for the
confirmation link after signing up.

## Project structure

```
app/
  layout.tsx            Root layout, fonts, header/footer/providers
  page.tsx              Home page
  shop/                 Product listing with filters/search/sort
  category/[slug]/      Category landing pages
  product/[slug]/       Product detail page
  cart/                 Full cart page
  checkout/             Checkout + success page
  login/, signup/       Auth pages
  account/              Profile + order history (protected)
  api/checkout/         Route handler that creates orders in Supabase
  api/auth/callback/    Email confirmation / magic link exchange
components/             All UI components (server + client)
lib/
  supabase/             Browser client, server client, middleware helper
  cart-store.ts         Zustand cart store (local + Supabase sync)
  data.ts               Server-side data fetching (products/categories)
  types.ts              Shared TypeScript types
supabase/
  schema.sql            Full DB schema, RLS policies, triggers, seed data
middleware.ts           Refreshes Supabase session, protects private routes
```

## Extending this

- **Real payments**: the checkout page has a clearly marked stub where a
  Stripe (or similar) payment element should go. Create a PaymentIntent in
  the `/api/checkout` route, confirm it client-side, and only insert the
  order once payment succeeds.
- **Product images**: seed data uses Unsplash URLs for convenience. Replace
  with your own images (e.g. hosted in a Supabase Storage bucket — add that
  bucket's hostname to `next.config.mjs`'s `images.remotePatterns`).
- **Admin/product management**: there's no admin UI yet. The simplest path is
  to manage `products` and `categories` directly from the Supabase Table
  Editor, or build a small `/admin` section gated by a `role` column on
  `profiles`.
- **Generated Supabase types**: `lib/types.ts` ships a minimal, permissive
  `Database` type so the app compiles without your specific schema. For full
  type safety, run:
  ```bash
  npx supabase gen types typescript --project-id your-project-ref > lib/database.types.ts
  ```
  and point `createBrowserClient<Database>` / `createServerClient<Database>`
  at the generated type instead.
- **Wishlists**: the `wishlists` table and RLS policy already exist in the
  schema — wire up a heart/save button using the same pattern as
  `cart-store.ts`.

## License

Provided as-is for you to build on.
