# Code Standards

Implementation rules and conventions for the entire project. The AI agent
must follow these in every session without exception. These rules prevent
pattern drift across sessions.

---

## Engineering Mindset

- **Think before implementing** — understand what is being built and why
  before writing a single line
- **Read context files first** — never assume, always verify against
  architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires.
  Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately
  after implementation, it is incomplete
- **Clean over clever** — simple readable code is always preferred over
  clever abstractions
- **One thing at a time** — complete one feature fully before touching the
  next
- **Failures are expected** — wrap Stripe and Supabase operations in
  try/catch, never let one failure crash the whole request

---

## TypeScript

- Strict mode enabled in tsconfig.json — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and
  commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions — use `interface` only for
  extendable component props
- All async functions must have proper error handling — never let promises
  float unhandled
- Use `const` by default — only use `let` when reassignment is necessary

---

## Next.js 16 Conventions

- App Router only — no Pages Router
- All components are Server Components by default
- Only add `"use client"` when the component requires:
  - useState or useReducer
  - useEffect
  - Browser APIs
  - Event listeners
  - Drag-and-drop on the pipeline board
- Never add `"use client"` to layout files unless absolutely required
- Data fetching happens in Server Components — never fetch in Client
  Components directly
- Route handlers live in `app/api/` — never put business logic directly in
  route handlers, call into a helper if logic is non-trivial
- Server Actions live in `actions/` — never define Server Actions inline in
  components
- Caching is uncached by default — dashboard, contacts, and billing data
  must always reflect the latest DB state, never stale cache
- Always check Next.js documentation before implementing a Next.js-specific
  feature if unsure — APIs shift between versions

---

## File and Folder Naming

- Folders: kebab-case — `contacts`, `deals`
- Component files: PascalCase — `PipelineBoard.tsx`, `ContactsTable.tsx`
- Utility files: camelCase — `supabase-client.ts`, `stripe.ts`
- Type files: camelCase — `index.ts`
- API route files: always `route.ts`
- Server Action files: camelCase — `contacts.ts`, `deals.ts`
- One component per file — never export multiple components from one file
- Index files only in `components/ui/` — never barrel export from other
  folders

---

## Component Structure

Every component follows this exact order:

```typescript
"use client"; // only if needed

// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { DealCard } from "@/components/dashboard/DealCard";

// 3. Type definitions
type Props = {
  dealId: string;
  stage: DealStage;
};

// 4. Component
export function ComponentName({ dealId, stage }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

- Never use default exports for components — always named exports
- Props type defined directly above the component — not in a separate
  types file unless shared across multiple components
- No inline styles — all styling via Tailwind classes using CSS variables
  from ui-tokens.md

---

## API Route Handlers

```typescript
// app/api/stripe/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // validate body
    // do the work
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[api/stripe/checkout]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

- Every route handler has a try/catch
- Every route handler validates the request body before processing
- Errors are logged with the route path as prefix: `[api/stripe/checkout]`
- Always return `{ success: boolean, data?: T, error?: string }` — **except**
  the Stripe webhook route, which returns a bare 200/400 status with no
  body, per Stripe's expected contract (see architecture.md)

---

## Server Actions

```typescript
// actions/contacts.ts

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function createContact(input: ContactInput) {
  try {
    const supabase = await createSupabaseServer();
    // validate
    // check free-tier limit if applicable
    // write to DB
    revalidatePath("/contacts");
    return { success: true };
  } catch (error) {
    console.error("[actions/contacts]", error);
    return { success: false, error: "Failed to create contact" };
  }
}
```

- Every Server Action has a try/catch
- Every Server Action returns `{ success: boolean, error?: string }`
- Always call `revalidatePath` after mutations that affect page data
- Never throw from Server Actions — always return the error
- Server Actions never call Stripe — Stripe logic lives only in
  `app/api/stripe/`

---

## Supabase Client Usage

```typescript
// Browser context — Client Components only
import { supabase } from "@/lib/supabase-client";

// Server context — Server Components, Route Handlers, Server Actions
import { createSupabaseServer } from "@/lib/supabase-server";
const supabase = await createSupabaseServer();
```

- Never use the browser client in server context
- Never use the server client in browser context
- Always await `createSupabaseServer()` — it reads cookies asynchronously
- RLS is the enforcement layer, but still write explicit `.eq('user_id',
  ...)` filters for clarity and defense in depth

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include context prefix: `[folder/file]`
- User-facing errors must be human readable — never expose raw error
  messages or Stripe/Supabase error internals
- API route errors return `status: 500` with generic message — never
  expose internals
- The Stripe webhook handler logs verification failures but never throws —
  it returns 400 and lets Stripe's retry mechanism handle it

---

## Environment Variables

All environment variables defined in `.env.local` for development. Never
hardcode any key, URL, or secret anywhere in the codebase.

| Variable                        | Used In                  |
| --------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`         | lib/supabase-client.ts       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | lib/supabase-client.ts        |
| `SUPABASE_SERVICE_ROLE_KEY`            | app/api/stripe/webhook/route.ts only |
| `STRIPE_SECRET_KEY`                      | lib/stripe.ts                          |
| `STRIPE_WEBHOOK_SECRET`                    | app/api/stripe/webhook/route.ts        |
| `STRIPE_PRO_PRICE_ID`                        | app/api/stripe/checkout/route.ts        |
| `NEXT_PUBLIC_SITE_URL`                         | Stripe redirect URLs (success/cancel)     |

`NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never
add `NEXT_PUBLIC_` to secret keys — `SUPABASE_SERVICE_ROLE_KEY` and
`STRIPE_SECRET_KEY` must never carry that prefix.

---

## Free Tier Contact Limit

Defined once as a constant. Never hardcode `10` anywhere else.

```typescript
// lib/utils.ts
export const FREE_CONTACT_LIMIT = 10;
```

Import and use `FREE_CONTACT_LIMIT` everywhere this value is needed —
Server Action check, UI banner copy, contacts page counter.

---

## Import Aliases

Always use the `@/` alias — never use relative imports that go up more
than one level.

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { FREE_CONTACT_LIMIT } from "@/lib/utils";

// Never
import { Button } from "../../../components/ui/button";
```

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Stripe webhook handler may have brief comments explaining event-type
  branching, since Stripe's event model isn't self-evident
- Never leave TODO comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing
anything check:

1. Does shadcn/ui already have this component?
2. Does Next.js already provide this functionality?
3. Is there a simpler native solution?

Approved dependencies for this project:

- `@supabase/ssr` — Supabase client (browser + server)
- `@supabase/supabase-js` — Supabase JS SDK
- `stripe` — Stripe SDK (server-side)
- `@stripe/stripe-js` — Stripe client-side redirect helper
- `zod` — Schema validation
- `lucide-react` — Icons
- `tailwindcss` — Styling
- `shadcn/ui` components — UI primitives
- `date-fns` — Date formatting (timestamps on notes, period end dates)

Do not install any other packages without updating this list first. In
particular: no drag-and-drop library for the pipeline board unless a
feature explicitly calls for it — check build-plan.md first, a simple
stage-select dropdown may be enough for v1.

---

## Testing the Contact Limit and RLS

Before considering the free-tier gate or data isolation "done," verify with
two separate accounts:

1. Sign up as User A, add 10 contacts, confirm the 11th is blocked
2. Sign up as User B, confirm User B sees zero contacts (not User A's 10)
3. Upgrade User A to Pro via Stripe test checkout, confirm the 11th contact
   can now be added
4. Cancel User A's subscription, confirm access remains Pro until
   `current_period_end`, not revoked immediately
