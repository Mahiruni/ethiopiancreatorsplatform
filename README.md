# Linqo — Ethiopian Creator Link Platform

**One identity. One link. Everything connected.**

Linqo is a production-oriented creator identity and commerce platform built for Ethiopian creators, professionals, freelancers, businesses, artists, organizations and online sellers. It is a full-stack Next.js application backed by Supabase/PostgreSQL with row-level security, server-side payment verification, private digital-product delivery, analytics, QR codes, bilingual UI architecture and role-based administration.

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS 4
- Supabase Auth, PostgreSQL, Storage and RLS
- `@supabase/ssr` for cookie-based authentication
- dnd-kit for accessible link reordering
- Zod validation
- Chapa payment adapter with verification/webhooks
- Telebirr adapter boundary for merchant integration
- Vitest + Playwright
- Vercel deployment configuration

## Main routes

### Public

`/`, `/features`, `/pricing`, `/explore`, `/about`, `/contact`, `/login`, `/signup`, `/[username]`, `/terms`, `/privacy`, `/report`

### Creator application

`/onboarding`, `/dashboard`, `/dashboard/links`, `/dashboard/appearance`, `/dashboard/store`, `/dashboard/analytics`, `/dashboard/payments`, `/dashboard/qr-code`, `/dashboard/settings`

### Administration

`/admin`, `/admin/users`, `/admin/categories`, `/admin/verification`, `/admin/reports`, `/admin/products`, `/admin/transactions`

## Supabase

The production schema is versioned under `supabase/migrations/`.

The currently connected deployment target used during development is the Supabase project **Ethiopian Creators Platform Project**. The schema contains 25 application tables plus protected storage buckets and server functions.

### Security model

- RLS is enabled on every application table in the exposed `public` schema.
- Public reads are narrowly scoped to published profiles, currently visible links and eligible published products.
- Ownership policies use `auth.uid()` rather than user-editable metadata.
- Roles live in `user_roles` and are not derived from `raw_user_meta_data`.
- Financial tables are server-managed and browser writes are revoked.
- Subscription activation and product fulfillment occur only after server-side provider verification.
- Paid digital files are held in the private `digital-products` bucket and delivered through short-lived signed URLs after purchase-token validation.
- Account onboarding, username changes and deletion are executed through service-only transactional functions called by authenticated Next.js routes.
- Admin authorization is enforced on the server, not by hiding UI.
- Rate limiting uses a server-only database bucket keyed with a secret salt.

## Environment variables

Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

Required for a real deployment:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.example
NEXT_PUBLIC_APP_NAME=Linqo
NEXT_PUBLIC_ENABLE_DEMO_DATA=false

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...

RATE_LIMIT_SALT=use-a-long-random-value
```

`SUPABASE_SECRET_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_` and never commit it.

## Authentication configuration

In Supabase Auth:

1. Set the Site URL to your production Linqo URL.
2. Add local and production callback URLs ending in `/auth/callback`.
3. Enable Email/Password and email verification.
4. Enable Google OAuth and configure the provider credentials if Google sign-in is wanted.
5. Configure an SMS provider before enabling phone OTP in production. The frontend validates Ethiopian `+251` numbers, but SMS delivery still requires a real provider account.

## Database deployment

For a new Supabase project, apply migrations in order using the Supabase CLI or dashboard migration tooling:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Do not run the seed script against production.

### Development demo data

Demo profiles are fictional and are isolated behind explicit flags.

```env
NEXT_PUBLIC_ENABLE_DEMO_DATA=true
ALLOW_DEMO_SEED=true
```

Then:

```bash
npm run seed:demo
```

Clear them with:

```bash
npm run seed:clear
```

## Payments

Linqo uses a provider interface rather than embedding provider-specific logic throughout the application.

### Chapa

Set:

```env
PAYMENT_DEFAULT_PROVIDER=chapa
CHAPA_SECRET_KEY=...
CHAPA_WEBHOOK_SECRET=...
```

Configure the merchant webhook to:

```text
https://YOUR_DOMAIN/api/payments/chapa/webhook
```

Both digital-product purchases and Linqo Pro/Business subscriptions use a unique transaction reference. The webhook signature is checked, then Linqo calls Chapa's verification API and compares amount and currency before settling the database transaction.

### Telebirr

The adapter intentionally fails closed until the merchant account, credentials and official integration mode are known. Do not replace it with simulated success responses.

### Subscription pricing

Default server-side catalog values are:

- Pro: ETB 499 / 30 days
- Business: ETB 1,499 / 30 days

Override with:

```env
LINQO_PRO_PRICE_ETB=499
LINQO_BUSINESS_PRICE_ETB=1499
```

Keep the marketing pricing page synchronized if you change these values.

## Local development

Node.js 22+ is recommended.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality commands:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

For Playwright the configuration enables fictional demo mode only inside the test web server.

## Vercel deployment

1. Import the GitHub repository into Vercel.
2. Add all production environment variables in **Project Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_APP_URL` to the canonical Vercel/custom-domain URL.
4. Add that URL to Supabase Auth redirect URLs.
5. If Chapa is enabled, configure the production webhook URL and secret.
6. Deploy from `main`.
7. After deployment, test signup → onboarding → public profile → link click → analytics and, in a merchant test environment, a real checkout/webhook verification cycle.

`vercel.json` targets Frankfurt (`fra1`) to reduce latency relative to Ethiopia while retaining Vercel's edge delivery for static/public assets.

## Admin bootstrap

New users receive only the `user` role. Promote the first trusted administrator directly in the database using a known authenticated user UUID:

```sql
update public.user_roles
set role = 'super_administrator', updated_at = now()
where user_id = 'USER_UUID';
```

Never expose an endpoint that lets a user promote their own role.

## Production readiness checklist

Before opening the platform publicly:

- Configure the production Supabase URL, publishable key and server secret.
- Configure Auth redirect URLs and email templates.
- Connect an SMS provider if phone OTP is enabled.
- Configure a real payment provider before allowing commerce.
- Verify Chapa webhook signing/verification using the merchant test flow.
- Choose and configure the final public domain.
- Run the full CI/build/test suite.
- Run Supabase security and performance advisors after every schema migration.
- Replace default legal copy with counsel-reviewed Ethiopia-specific Terms and Privacy Policy where required.
- Establish operational policies for moderation, verification, refunds, data retention and abuse reports.
- Configure error monitoring and production logging without recording secrets or unnecessary personal data.

## Repository structure

```text
src/app/                 Next.js pages, API routes and protected surfaces
src/components/          Reusable UI and application components
src/lib/                 Auth, billing, payments, validation, data and analytics logic
supabase/migrations/     Versioned PostgreSQL/RLS/storage schema
tests/                   Unit tests
e2e/                     Playwright critical-flow tests
scripts/                 Development seed utilities
```

## Notes

No real creators are used as demo identities. Production analytics never fabricate metrics. Payment success is never trusted from a browser redirect. Private paid files are never exposed through permanent public storage URLs.
