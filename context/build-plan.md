# Build Plan

## Core Principle

Each feature below ships its UI and its real logic together. What is *not* skipped: every feature must still be fully testable the moment it's done, and deployment
happens on day one so every feature after Phase 1 is verified against the
real public URL, not localhost.

---

## Phase 1 — Foundation

### 01 Repo + Deploy Skeleton

Get a blank, deployed app before writing any feature. This is the single
highest-leverage step in a one-day build — every feature after this ships
straight to a real URL instead of accumulating deployment risk for the end.

**Logic:**

- Next.js 16 App Router project, TypeScript strict, Tailwind v4
- Push to GitHub, connect to Vercel, confirm a blank deploy is reachable at
  a public URL
- `app/globals.css` — paste the full token block from ui-tokens.md
- Root layout — Inter font via `next/font/google`

---

### 02 Supabase Project + Database Schema

**Logic:**

- Create Supabase project
- Run the full schema from architecture.md: `profiles`, `contacts`,
  `deals`, `notes` — including the `notes_exactly_one_parent` check
  constraint
- Enable RLS on all four tables, apply all policies from architecture.md
- Create the `handle_new_user` trigger
- `lib/supabase-client.ts` and `lib/supabase-server.ts` created per
  library-docs.md pattern
- Add Supabase env vars to `.env.local` and to Vercel project settings

---

### 03 Auth — Signup, Login, Session Persistence

**UI:**

- `/signup` — email + password fields, "Sign up with Google" button
- `/login` — same, plus "Forgot password" link (can go to Supabase's
  default reset flow, no custom UI required)
- Both pages share a simple centered card layout, no navbar

**Logic:**

- Email+password signup/login via Supabase Auth
- Google OAuth via Supabase Auth, `/callback` route handler completes the
  exchange
- Middleware protects `/dashboard`, `/contacts/*`, `/deals/*`, `/billing` —
  redirects to `/login` if no session
- On successful auth — redirect to `/dashboard`
- Confirm session persists across a hard reload (not just client-side
  navigation) before moving on — this is a named success criterion, test
  it explicitly here, not later
- Logout button (in navbar, built in next feature) clears session,
  redirects to `/`

**Test before moving on:** sign up, close the tab, reopen the deployed URL
directly at `/dashboard` — should still be logged in.

---

## Phase 2 — Marketing Page

### 04 Landing Page + Pricing Table

**UI:**

- Header — logo, Login / Sign Up buttons (no product nav)
- Hero — headline, subheadline, primary CTA → `/signup`
- Features section — 3 value props: Contacts, Pipeline, Notes
- Pricing table — Starter (Free, 10 contacts) / Pro ($9/mo, unlimited
  contacts), per ui-rules.md pricing card styling
- Each pricing CTA links to `/signup?plan=starter` or `/signup?plan=pro`
- Footer

**Logic:**

- If a logged-in user visits `/`, redirect to `/dashboard`
- `/signup?plan=pro` query param is read on the signup page and carried
  through to `/billing` after first login, so a new user who picked Pro on
  the pricing table lands straight into Stripe Checkout rather than having
  to find the upgrade button themselves (small UX touch, not required by
  the brief, but cheap to add here while wiring signup)

---

## Phase 3 — Contacts

### 05 Contacts List + CRUD + Free Tier Limit

**UI:**

- `/contacts` — table per ui-rules.md (Name, Email, Company, Phone, open
  deal count, date added)
- "Add Contact" button → modal/form (name required, email/company/phone
  optional)
- Contact Limit Banner (per ui-rules.md) shown when free-plan user is at
  10/10, Add Contact button disabled in that state
- Empty state when zero contacts

**Logic:**

- Server Action `createContact` in `actions/contacts.ts` — checks
  `FREE_CONTACT_LIMIT` server-side before insert, returns an error the UI
  surfaces if blocked (never rely on the disabled button alone — a direct
  request must also be blocked)
- List query scoped to `user_id`, ordered by `created_at` descending
- Open deal count per contact — count of that contact's deals where stage
  is not `won` or `lost`

**Test before moving on:** as one account, add 11 contacts, confirm the
11th is blocked with a clear message, not a silent failure or crash.

---

### 06 Contact Detail — Edit, Notes, Delete

**UI:**

- `/contacts/[id]` — editable fields, linked deals list (read-only summary
  card per deal, links to deal detail), notes section (NotesList +
  NoteInput shared components), delete button with confirmation dialog

**Logic:**

- Server Actions: `updateContact`, `deleteContact` (cascades to deals and
  notes — confirm the DB foreign keys are set to `on delete cascade` or
  handle the cascade explicitly in the action, be consistent with
  whichever is chosen in architecture.md and don't do both)
- `createNote`, `deleteNote` in `actions/notes.ts` — `contact_id` set,
  `deal_id` left null
- Notes ordered newest first

---

## Phase 4 — Deals & Pipeline

### 07 Pipeline Board (Dashboard)

**UI:**

- `/dashboard` — 5 fixed columns per ui-rules.md, deal cards showing name,
  contact name, value
- "New Deal" button — form with contact picker (searchable dropdown of
  existing contacts), deal name, value, starting stage (defaults to Lead)
- Stage change — a dropdown on each deal card is enough for v1 (no
  drag-and-drop library unless there's spare time at the very end — see
  code-standards.md dependency rule)
- Empty state per column

**Logic:**

- Server Action `createDeal` — requires an existing `contact_id`, cannot
  create a deal without picking a contact first
- Server Action `updateDealStage` — updates `deals.stage`, revalidates
  `/dashboard`
- Query all deals for the user, grouped by stage client-side or via
  separate queries per column — pick whichever is simpler to implement
  correctly, both are fine at this data scale

---

### 08 Deal Detail — Edit, Notes, Delete

**UI:**

- `/deals/[id]` — deal name, value, stage (dropdown, same action as
  pipeline board), linked contact (name links back to `/contacts/[id]`),
  notes section, delete button with confirmation

**Logic:**

- Server Actions: `updateDeal`, `deleteDeal`
- `createNote`/`deleteNote` reused from Feature 06, `deal_id` set instead
  of `contact_id`

---

## Phase 5 — Stripe & Billing

### 09 Stripe Setup + Checkout Flow

**Logic:**

- Create the Pro product + price in the Stripe Dashboard (test mode),
  capture `STRIPE_PRO_PRICE_ID`
- `lib/stripe.ts` per library-docs.md
- `POST /api/stripe/checkout` — creates a Stripe Customer if
  `profiles.stripe_customer_id` is null (saves it immediately via the
  service role client, per the sanctioned exception in library-docs.md),
  then creates a Checkout Session, returns the redirect URL
- Billing page has an "Upgrade to Pro" button that calls this route and
  redirects the browser to the returned URL

**Test before moving on:** click Upgrade, land on Stripe's real hosted
Checkout page in test mode. Do not proceed to the webhook feature until
this redirect works — there is nothing to confirm a payment for otherwise.

---

### 10 Stripe Webhook — Subscription State

**Logic:**

- `POST /api/stripe/webhook` per the exact pattern in library-docs.md —
  raw body, signature verification, service role client
- Handle `checkout.session.completed`, `customer.subscription.updated`,
  `customer.subscription.deleted` exactly as specified in architecture.md
- Configure the webhook endpoint in the Stripe Dashboard pointing at the
  **deployed** Vercel URL (`https://[your-app].vercel.app/api/stripe/webhook`)
  — this only works because deployment happened in Phase 1
- Locally, use `stripe listen --forward-to localhost:3000/api/stripe/webhook`
  to test before relying on the deployed endpoint

**Test before moving on:** complete a real test-mode checkout with card
`4242 4242 4242 4242`, confirm `profiles.plan` flips to `'pro'` in the
Supabase table editor within a few seconds, with no manual DB edit.

---

### 11 Billing Page

**UI:**

- `/billing` — current plan card (Starter or Pro, per ui-tokens.md
  subscription status badges)
- Free plan: contact usage ("7 of 10 contacts used"), Upgrade to Pro button
- Pro plan (active): "Manage Subscription" button → Stripe portal
- Pro plan (canceling): status badge shows "Cancels on [date]", still has
  full Pro access until then

**Logic:**

- `POST /api/stripe/portal` per library-docs.md
- Page reads `profiles.plan`, `subscription_status`, `current_period_end`
  directly — never queries Stripe at render time, per the invariant in
  architecture.md
- After redirect back from Checkout (`?checkout=success`) or the portal,
  refetch profile data on load so the UI reflects the webhook's write —
  don't rely on the redirect alone, the webhook may land a moment after
  the redirect does

**Test before moving on:** cancel via the portal, confirm
`subscription_status` becomes `'canceling'` and the badge updates, confirm
the 11th-contact block is still lifted (Pro access persists until period
end, not revoked immediately).

---

## Phase 6 — Polish & Submission Check

### 12 Full Walkthrough + Fix List

Not a feature — a checklist pass against project-overview.md's Success
Criteria, run start to finish as a stranger would experience it:

- [ ] Land on `/`, read the pricing table, click Sign Up
- [ ] Sign up with email+password (and separately, test Google OAuth)
- [ ] Reload mid-session — still logged in
- [ ] Add contacts up to 10, confirm the 11th is blocked with a real
      message
- [ ] Upgrade to Pro with Stripe test card `4242 4242 4242 4242`
- [ ] Confirm plan flips to Pro without any manual DB edit, add an 11th
      contact successfully
- [ ] Create a deal, move it across all 5 stages, add a note to it
- [ ] Add a note to a contact
- [ ] Delete a contact with linked deals, confirm the cascade behaves as
      designed, not as an error
- [ ] Cancel the subscription via the billing portal, confirm access
      persists until period end
- [ ] Sign up as a second account, confirm zero visibility into the first
      account's data
- [ ] Confirm every page is reachable at the public Vercel URL, not
      localhost

Any box that fails here is a bug, not a nice-to-have — this checklist
**is** the grading rubric from the brief, restated as steps.

---

## Phase 7 — Post-Launch Polish

### 13 Profile Menu + Mobile Responsiveness

Cosmetic pass after the core product is functionally complete. Replaces
the raw email+logout in the navbar with a proper profile dropdown, and
makes the app usable down to 375px width.

**UI:**

- Build `ProfileMenu` per its "Planned" entry in `ui-registry.md` —
  circular avatar (initials), dropdown with email (non-interactive) + Log
  out, replacing the current navbar right side
- Apply the Mobile Responsiveness rules from `ui-rules.md` across: Navbar
  (hamburger below 768px), Pipeline Board (horizontal scroll retained,
  New Deal button collapses to icon-only below 480px), Contacts Table
  (switches to stacked cards below 640px), and all forms/modals (full-screen
  sheets below 640px)

**Logic:**

- None — this is UI-only, no new tables, actions, or routes

**Test before moving on:** resize down to 375px and click through all 8
pages (marketing, login, signup, dashboard, contacts list, contact detail,
deal detail, billing) — nothing should overflow horizontally or become
unusable. Confirm the profile dropdown opens/closes correctly and logout
still works from inside it.

---

## Feature Count

| Phase                      | Features |
| ---------------------------- | ---------- |
| Phase 1 — Foundation           | 3          |
| Phase 2 — Marketing Page          | 1          |
| Phase 3 — Contacts                   | 2          |
| Phase 4 — Deals & Pipeline              | 2          |
| Phase 5 — Stripe & Billing                 | 3          |
| Phase 6 — Polish & Submission Check           | 1          |
| Phase 7 — Post-Launch Polish           | 1          |
| **Total**                                        | **13**     |
