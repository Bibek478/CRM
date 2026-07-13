# Library Docs

Project-specific usage patterns for every third party library in this
project. This file only covers how we use each library in this specific
project — rules, patterns, and constraints specific to RB CRM.

Read the relevant section before implementing any feature that touches
these libraries.

---

## Before Using Any Library

1. **Check AGENTS.md** for any installed skill relevant to the library.
2. **Check if an MCP server is configured** for that library — if
   available, use it before falling back to general knowledge.
3. **Read this file** for project-specific patterns that override general
   library knowledge.
4. **Fall back to official docs / general training knowledge last** — and
   treat version-specific API shape with suspicion, especially for Stripe,
   which has changed its SDK shape across versions.

Order of authority:

```
MCP server (real-time docs) → Skills → This file (project rules) → General training knowledge
```

---

## Supabase

### Client vs Server

Two separate instances — never mix them:

```typescript
// lib/supabase-client.ts — browser context only
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

```typescript
// lib/supabase-server.ts — server context only
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

### Auth

```typescript
// Get current user in server context
const supabase = await createSupabaseServer();
const {
  data: { user },
  error,
} = await supabase.auth.getUser();
if (!user) redirect("/login");
```

```typescript
// Email + password signup (client)
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name: fullName } },
});
```

```typescript
// Google OAuth (client)
const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: `${window.location.origin}/callback` },
});
```

**Rules:**

- Middleware checks the session on every route under `/dashboard`,
  `/contacts`, `/deals`, `/billing` — redirect to `/login` if no session
- Use `supabase.auth.getUser()`, not `getSession()`, when the result gates
  access to data — `getUser()` revalidates against Supabase's servers,
  `getSession()` only reads the local cookie and can be stale/spoofed

### DB Queries

```typescript
// Read
const { data, error } = await supabase
  .from("contacts")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

// Insert
const { data, error } = await supabase
  .from("contacts")
  .insert({ user_id: user.id, name, email, company, phone })
  .select()
  .single();

// Update
const { error } = await supabase
  .from("deals")
  .update({ stage: newStage })
  .eq("id", dealId)
  .eq("user_id", user.id); // explicit filter even though RLS also enforces this
```

**Rules:**

- Always scope queries to `user_id` explicitly, even though RLS is the
  real backstop — explicit filters make intent clear and queries testable
- Always handle the `error` return — never assume success
- Use `.single()` when expecting exactly one row
- Contact count check before insert:

```typescript
const { count } = await supabase
  .from("contacts")
  .select("*", { count: "exact", head: true })
  .eq("user_id", user.id);

if (profile.plan === "free" && (count ?? 0) >= FREE_CONTACT_LIMIT) {
  return { success: false, error: "Free plan limit reached. Upgrade to add more contacts." };
}
```

### Service Role Client (Webhook Only)

```typescript
// Used ONLY inside app/api/stripe/webhook/route.ts — nowhere else
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
```

This client bypasses RLS entirely. It exists so the webhook — which has no
logged-in user session, since Stripe calls it server-to-server — can write
`plan`, `subscription_status`, etc. to `profiles`. Never import this
pattern anywhere outside the webhook route.

---

## Stripe

### Client Setup

```typescript
// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia", // pin the version, check for the current one when implementing — do not guess
});
```

Stripe's API version string changes over time — when actually implementing
this file, check the installed `stripe` package's types or the Stripe
dashboard for the current version string rather than trusting a
remembered value, since using a mismatched version string is a common
source of confusing type errors.

### Creating a Checkout Session

```typescript
// app/api/stripe/checkout/route.ts
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  customer: stripeCustomerId, // create one first if it doesn't exist yet, see below
  client_reference_id: user.id,
  line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?checkout=success`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?checkout=cancelled`,
});

return NextResponse.json({ url: session.url });
```

Client redirects the browser to `session.url` directly — this project uses
Stripe-hosted Checkout, not the embedded Payment Element, since hosted
Checkout is the faster path to a working test-mode flow in a one-day build.

### Creating a Stripe Customer (First Time Only)

```typescript
// Only called if profiles.stripe_customer_id is null
const customer = await stripe.customers.create({
  email: user.email,
  metadata: { supabase_user_id: user.id },
});

// Save customer.id to profiles.stripe_customer_id immediately —
// via the service role client, since this write happens outside the
// webhook flow but still needs to bypass the "webhook only" write rule
// for this one column. Document this as the one sanctioned exception.
```

### Billing Portal Session

```typescript
// app/api/stripe/portal/route.ts
const session = await stripe.billingPortal.sessions.create({
  customer: profile.stripe_customer_id,
  return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
});

return NextResponse.json({ url: session.url });
```

Cancellation itself happens inside Stripe's hosted portal UI — this app
never calls `stripe.subscriptions.cancel()` directly, it lets the portal
handle it and reacts to the resulting webhook event.

### Webhook Handler

```typescript
// app/api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[api/stripe/webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "pro",
          stripe_subscription_id: subscription.id,
          subscription_status: "active",
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("id", userId);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: subscription.cancel_at_period_end ? "canceling" : "active",
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from("profiles")
        .update({ plan: "free", subscription_status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return new Response(null, { status: 200 });
}
```

**Rules:**

- Always verify signature against the **raw** body — `req.text()`, never
  `req.json()`, before verification happens
- Always return 200 once processed — non-2xx makes Stripe retry
- Always use the service role Supabase client here — this route has no
  user session to work with
- Look up the profile by `stripe_subscription_id` for
  `subscription.updated`/`deleted` events, and by `client_reference_id`
  (the Supabase user id) only for the initial `checkout.session.completed`
  event, since that's the only event carrying it directly
- Test locally with the Stripe CLI: `stripe listen --forward-to
  localhost:3000/api/stripe/webhook` — this is the only reliable way to
  test webhooks before deploying, do not try to test this flow by hitting
  the route manually with a fake payload, since signature verification
  will always fail without a real Stripe-generated body+signature pair

### Test Mode

- All Stripe keys used in development and for the hackathon submission are
  **test mode** keys (`sk_test_...`, `pk_test_...`) — never live keys
- Test card for successful payment: `4242 4242 4242 4242`, any future
  expiry, any CVC, any postal code
- The Stripe Dashboard has a toggle for Test Mode — webhook secrets differ
  between test and live mode, make sure the webhook endpoint configured in
  the dashboard matches the mode the keys belong to

---

## shadcn/ui

- Components are copied into `components/ui/` via the CLI, not installed
  as an npm dependency — when a component is needed, add it with the
  shadcn CLI rather than hand-writing a primitive from scratch
- Once added, a shadcn component's file belongs to this codebase — it can
  be adjusted to fit ui-tokens.md color variables, but should stay
  structurally close to the original so future shadcn updates aren't
  fighting local edits
- Never restyle a shadcn component with hardcoded colors — swap its
  default Tailwind classes for the project's `@theme` tokens

---

## Environment Variable Checklist

Before any Stripe or Supabase feature can be tested end to end, these must
all be set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_SITE_URL=
```

And on Vercel (production), the same set — plus remembering that
`NEXT_PUBLIC_SITE_URL` must point at the deployed URL, not
`localhost:3000`, or Stripe redirects will send users to a dead link after
checkout.
