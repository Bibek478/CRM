# Architecture

## Stack

| Layer         | Tool                        | Purpose                                   |
| ------------- | ---------------------------- | ------------------------------------------ |
| Framework     | Next.js 16 (App Router)      | Full stack framework — pages, API routes  |
| Auth + DB     | Supabase                     | Postgres database + Auth (email + Google) |
| Payments      | Stripe (test mode)           | Checkout, subscriptions, webhooks         |
| Styling       | Tailwind CSS + shadcn/ui     | UI components and styling                 |
| Deployment    | Vercel                       | Hosting, serverless functions, public URL |
| Language      | TypeScript strict            | Throughout                                |

---

## Folder Structure

```
/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── app/
│   ├── layout.tsx                          → Root layout
│   ├── page.tsx                            → Marketing / landing page
│   ├── (auth)/
│   │   ├── login/page.tsx                  → Login page
│   │   ├── signup/page.tsx                 → Signup page
│   │   └── callback/route.ts               → OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx                        → Pipeline board
│   ├── contacts/
│   │   ├── page.tsx                        → Contacts list
│   │   └── [id]/page.tsx                   → Contact detail
│   ├── deals/
│   │   └── [id]/page.tsx                   → Deal detail
│   ├── billing/
│   │   └── page.tsx                        → Billing / plan management
│   └── api/
│       ├── stripe/
│       │   ├── checkout/route.ts           → Creates Stripe Checkout session
│       │   ├── portal/route.ts             → Creates Stripe billing portal session
│       │   └── webhook/route.ts            → Stripe webhook handler
│       └── contacts/
│           └── check-limit/route.ts        → Server-side contact cap check
├── actions/
│   ├── contacts.ts                         → Create/update/delete contact
│   ├── deals.ts                            → Create/update/delete deal, move stage
│   └── notes.ts                            → Create/delete note
├── components/
│   ├── ui/                                 → shadcn/ui components only
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── marketing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── PricingTable.tsx
│   ├── dashboard/
│   │   ├── PipelineBoard.tsx
│   │   ├── PipelineColumn.tsx
│   │   └── DealCard.tsx
│   ├── contacts/
│   │   ├── ContactsTable.tsx
│   │   ├── ContactForm.tsx
│   │   └── ContactLimitBanner.tsx
│   ├── shared/
│   │   ├── NotesList.tsx
│   │   └── NoteInput.tsx
│   └── billing/
│       └── PlanCard.tsx
├── lib/
│   ├── supabase-client.ts                  → Supabase browser client
│   ├── supabase-server.ts                  → Supabase server client
│   ├── stripe.ts                           → Stripe SDK instance
│   └── utils.ts                            → Shared utility functions (incl. FREE_CONTACT_LIMIT)
└── types/
    └── index.ts                            → Global TypeScript types
```

---

## System Boundaries

| Folder        | Owns                                                                                   |
| -------------- | --------------------------------------------------------------------------------------- |
| `app/`         | Pages and API routes only. No business logic beyond request parsing.                    |
| `actions/`     | Server Actions for UI-triggered mutations. Contact/deal/note CRUD. Nothing Stripe here. |
| `app/api/stripe/` | All Stripe interaction — creating sessions, handling webhooks. Never called from `actions/`. |
| `components/`  | UI only. No direct DB or Stripe calls.                                                  |
| `lib/`         | Third-party client initialisation and shared utilities only.                            |
| `types/`       | TypeScript types shared across the project.                                             |

---

## Data Flow

### Auth

```
User submits signup form (email+password or Google OAuth)
        ↓
Supabase Auth creates auth.users row
        ↓
DB trigger (see Database section) creates matching profiles row, plan='free'
        ↓
Session cookie set — middleware checks it on every protected route
        ↓
Redirect to /dashboard
```

### Contact / Deal / Note Mutations (Server Actions)

```
User interaction in component (e.g. "Add Contact" form submit)
        ↓
Server Action in actions/
        ↓
Server Action re-checks contact limit server-side if relevant (never trust client)
        ↓
Supabase server client write, scoped to auth.uid()
        ↓
revalidatePath()
```

### Stripe Checkout (Upgrade Flow)

```
User clicks "Upgrade to Pro" on /billing
        ↓
POST /api/stripe/checkout
        ↓
Server creates/reuses a Stripe Customer for this user (stores stripe_customer_id on profiles if new)
        ↓
Server creates a Stripe Checkout Session (mode: subscription, one Pro price)
        ↓
Client redirected to Stripe-hosted Checkout page
        ↓
User pays with Stripe test card
        ↓
Stripe redirects back to /billing?checkout=success
        ↓
(Actual plan upgrade happens via webhook below, not this redirect)
```

### Stripe Webhook (Source of Truth for Subscription State)

```
Stripe sends event to POST /api/stripe/webhook
        ↓
Handler verifies event signature using STRIPE_WEBHOOK_SECRET (raw body, not parsed JSON)
        ↓
Switch on event.type:
  checkout.session.completed
    → look up user by client_reference_id or stripe_customer_id
    → update profiles: plan='pro', stripe_subscription_id, subscription_status='active', current_period_end
  customer.subscription.updated (cancel_at_period_end: true)
    → update profiles: subscription_status='canceling'
  customer.subscription.deleted
    → update profiles: plan='free', subscription_status='canceled'
        ↓
Return 200 to Stripe (required — Stripe retries on non-2xx)
```

### Stripe Billing Portal (Cancel Flow)

```
User clicks "Manage Subscription" on /billing
        ↓
POST /api/stripe/portal
        ↓
Server creates a Stripe Billing Portal session for this user's stripe_customer_id
        ↓
Client redirected to Stripe-hosted portal
        ↓
User cancels (sets cancel_at_period_end: true on Stripe's side)
        ↓
Stripe fires customer.subscription.updated webhook
        ↓
Webhook handler updates profiles.subscription_status = 'canceling'
        ↓
User redirected back to /billing — UI shows "Pro (cancels on [date])"
```

---

## Supabase Database Schema

### `profiles`

One row per user, created automatically by a DB trigger on `auth.users` insert.

| Column                   | Type        | Notes                                              |
| ------------------------ | ----------- | --------------------------------------------------- |
| id                        | uuid        | Primary key. Same value as `auth.users.id`.         |
| email                     | text        | Copied from auth on creation.                        |
| full_name                 | text        | Optional, from OAuth profile if available.           |
| plan                      | text        | `'free'` \| `'pro'`. Default `'free'`.               |
| stripe_customer_id        | text        | Null until first checkout attempt.                   |
| stripe_subscription_id    | text        | Null until subscribed.                                |
| subscription_status       | text        | `'none'` \| `'active'` \| `'canceling'` \| `'canceled'`. Default `'none'`. |
| current_period_end        | timestamptz | When the current paid period ends. Null if never subscribed. |
| created_at                | timestamptz | Default `now()`.                                      |

### `contacts`

| Column      | Type        | Notes                          |
| ----------- | ----------- | -------------------------------- |
| id           | uuid        | Primary key, default `gen_random_uuid()`. |
| user_id      | uuid        | References `profiles.id`. Required. |
| name         | text        | Required.                        |
| email        | text        | Optional.                        |
| company      | text        | Optional.                        |
| phone        | text        | Optional.                        |
| created_at   | timestamptz | Default `now()`.                 |

### `deals`

| Column      | Type        | Notes                                                          |
| ----------- | ----------- | ------------------------------------------------------------------ |
| id           | uuid        | Primary key, default `gen_random_uuid()`.                          |
| user_id      | uuid        | References `profiles.id`. Required.                                 |
| contact_id   | uuid        | References `contacts.id`. Required — every deal has exactly one contact. |
| name         | text        | Required. E.g. "Website redesign — Acme Co."                       |
| value        | integer     | USD, stored in cents. Optional, default 0.                          |
| stage        | text        | `'lead'` \| `'contacted'` \| `'proposal'` \| `'won'` \| `'lost'`. Default `'lead'`. |
| created_at   | timestamptz | Default `now()`.                                                     |

### `notes`

A single table for notes on either a contact or a deal — never both. Enforced by a check constraint, not just app logic.

| Column      | Type        | Notes                                                            |
| ----------- | ----------- | --------------------------------------------------------------------- |
| id           | uuid        | Primary key, default `gen_random_uuid()`.                              |
| user_id      | uuid        | References `profiles.id`. Required.                                     |
| contact_id   | uuid        | References `contacts.id`. Null if this note belongs to a deal instead.  |
| deal_id      | uuid        | References `deals.id`. Null if this note belongs to a contact instead.  |
| body         | text        | Required.                                                                 |
| created_at   | timestamptz | Default `now()`.                                                          |

```sql
-- Exactly one of contact_id / deal_id must be set, never both, never neither
alter table notes add constraint notes_exactly_one_parent
  check (
    (contact_id is not null and deal_id is null) or
    (contact_id is null and deal_id is not null)
  );
```

---

## Row Level Security (RLS)

RLS is enabled on every table. This is the actual enforcement layer for
per-user data isolation — application code scoping queries by `user_id` is
a UX convenience, RLS is what makes leaking another user's data
structurally impossible even if a query forgets the filter.

```sql
alter table profiles enable row level security;
alter table contacts enable row level security;
alter table deals enable row level security;
alter table notes enable row level security;

-- profiles: user can only read/update their own row
create policy "own profile" on profiles
  for select using (auth.uid() = id);
create policy "update own profile" on profiles
  for update using (auth.uid() = id);

-- contacts: full CRUD, own rows only
create policy "own contacts" on contacts
  for all using (auth.uid() = user_id);

-- deals: full CRUD, own rows only
create policy "own deals" on deals
  for all using (auth.uid() = user_id);

-- notes: full CRUD, own rows only
create policy "own notes" on notes
  for all using (auth.uid() = user_id);
```

The `profiles` table has no insert or delete policy for regular users —
rows are created only by the trigger below and never deleted by the app.
Writes to `plan`, `stripe_customer_id`, `stripe_subscription_id`,
`subscription_status`, `current_period_end` only ever happen from the
webhook handler using the Supabase **service role** client, which bypasses
RLS by design — this is the one place in the codebase allowed to do that.

---

## Auto-create Profile Trigger

```sql
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## Supabase Client Pattern

Two separate instances — never mix them:

```typescript
// lib/supabase-client.ts
// Browser-side — used in Client Components for auth state
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

```typescript
// lib/supabase-server.ts
// Server-side — used in Server Components, API routes, Server Actions
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseServer = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
};
```

The webhook handler uses a **third** client — service role, no cookies,
bypasses RLS — created inline in `app/api/stripe/webhook/route.ts` only,
using `SUPABASE_SERVICE_ROLE_KEY`. This key is never imported anywhere
else in the codebase.

---

## Stripe Webhook Signature Verification

The most common mistake with Stripe webhooks: parsing the request body as
JSON before verifying it. Signature verification requires the **raw**
request body.

```typescript
// app/api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const body = await req.text(); // raw text, not req.json()
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  // handle event.type — see Data Flow > Stripe Webhook above
  return new Response(null, { status: 200 });
}
```

---

## Invariants

Rules the AI agent must never violate:

- API routes contain no UI logic. Components contain no DB or Stripe logic.
- Server Actions never call Stripe. Stripe calls live only in `app/api/stripe/`.
- All Supabase server-side writes use `createSupabaseServer()` — except the
  webhook handler, which uses the service role client and nothing else does.
- No hardcoded hex values or raw Tailwind color classes in components — use
  CSS variables from ui-tokens.md.
- Every table has RLS enabled — no table is ever created without it.
- `profiles.plan`, `subscription_status`, `stripe_subscription_id`, and
  `current_period_end` are only ever written by the webhook handler —
  never by a Server Action, never by client code.
- The Stripe webhook handler always verifies the signature against the raw
  body before processing — never trust an unverified payload.
- The Stripe webhook handler always returns 200 on successful processing —
  a non-2xx response causes Stripe to retry, which can cause duplicate
  processing if the handler isn't idempotent.
- The free-tier contact limit is enforced server-side in the Server Action
  before insert — never only hidden in the UI.
- `deals.stage` is always one of the 5 fixed values — never any other
  string, never user-defined.
- `notes` always has exactly one of `contact_id` / `deal_id` set — enforced
  by DB constraint, never left to app logic alone.
- Always scope Supabase queries to the current user where RLS doesn't
  already guarantee it implicitly (RLS is the backstop, not a reason to
  skip explicit `.eq('user_id', ...)` in queries for clarity).
