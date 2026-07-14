# Progress Tracker

Update this file after every completed feature. Any AI agent reading this
should immediately know what is done, what is in progress, and what is
next.

---

## Current Status

**Phase:** Phase 6 - Polish & Submission Check
**Last completed:** Feature 12 Full Walkthrough + Fix List
**Next:** Submission.

---

## Progress

### Phase 1 - Foundation

- [ ] 01 Repo + Deploy Skeleton
- [ ] 02 Supabase Project + Database Schema
- [x] 03 Auth - Signup, Login, Session Persistence

### Phase 2 - Marketing Page

- [x] 04 Landing Page + Pricing Table

### Phase 3 - Contacts

- [x] 05 Contacts List + CRUD + Free Tier Limit
- [x] 06 Contact Detail - Edit, Notes, Delete

### Phase 4 - Deals & Pipeline

- [x] 07 Pipeline Board (Dashboard)
- [x] 08 Deal Detail - Edit, Notes, Delete

### Phase 5 - Stripe & Billing

- [x] 09 Stripe Setup + Checkout Flow
- [x] 10 Stripe Webhook - Subscription State
- [x] 11 Billing Page

### Phase 6 - Polish & Submission Check

- [x] 12 Full Walkthrough + Fix List

---

## Decisions Made During Build

- Feature 01 local skeleton work was completed without git initialization, per
  user request.
- Feature 02 database setup was applied in the Supabase SQL Editor before Vercel
  configuration, because external deployment handoff is still pending.

---

## Notes

- `app/globals.css` already contained the required token block from
  `ui-tokens.md`, so Feature 01 only added minimal global base styles on top
  of it.
- Public GitHub/Vercel deployment is still pending because git initialization
  was intentionally skipped in this session.
- Feature 04 is now implemented locally: logged-in users on `/` redirect to
  `/dashboard`, marketing CTAs point to `/signup?plan=starter` and
  `/signup?plan=pro`, and signup remembers the selected plan in
  `sessionStorage` for later billing handoff.
- Feature 05 implemented locally: `/contacts` lists user contacts, shows
  open deal counts, displays limit banner at 10/10 for free plan, and server
  action blocks insert at limit.
- Feature 06 implemented locally: `/contacts/[id]` now edits contact fields,
  shows linked deals, supports contact notes with delete, and contact delete
  relies on DB cascade for linked deals and notes.
- The original `profiles` update policy was removed from the live Supabase
  project and from `supabase/schema.sql` so billing fields remain writable only
  through trusted server-side/service-role flows.
- `.env.local`, `lib/supabase-client.ts`, `lib/supabase-server.ts`, and
  `supabase/schema.sql` are in place locally for Feature 02.
- Feature 03 code complete: `middleware.ts` protects `/dashboard`, `/contacts/*`,
  `/deals/*`, `/billing` and redirects unauth to `/login`. `components/layout/Navbar.tsx`
  displays nav items with active state, user email, and LogoutButton. Session
  persistence test pending until Feature 01 deployment completes.
- Feature 08 implemented locally: `/deals/[id]` renders deal name/value/stage (editable via `updateDeal`), linked contact card linking back to `/contacts/[id]`, notes section via `NoteInput`/`NotesList` with `deal_id`. Delete button confirms, calls `deleteDeal`, redirects to `/dashboard`. New components: `DealDetailForm`, `DeleteDealButton` in `components/deals/`.
- Feature 09 implemented locally: `stripe@22.3.1` installed with `apiVersion: "2026-06-24.dahlia"`. `lib/stripe.ts` created. `POST /api/stripe/checkout` creates Stripe Customer (service role write for `stripe_customer_id` — sanctioned exception) then creates a Checkout Session. `app/billing/page.tsx` refactored from placeholder to real server component fetching `profiles.plan/subscription_status/current_period_end`. `components/billing/PlanCard.tsx` shows plan badge and Upgrade button. `.env.local` extended with `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`, `NEXT_PUBLIC_SITE_URL` placeholders — user must fill in real Stripe test-mode values before testing.
- Feature 12 walkthrough pass complete. Fixes applied: (1) Removed debug "Feature 05 Contacts" badge from `app/contacts/page.tsx`. (2) Removed debug "Feature 06 Contact Detail" badge from `app/contacts/[id]/page.tsx`. Note: `proxy.ts` + `lib/supabase-proxy.ts` were already present and correctly handling session-cookie refresh and route protection for all four protected prefixes — this is Next.js 16's `proxy` convention, which replaces the standard `middleware.ts` pattern. A `middleware.ts` was briefly created in error and immediately deleted after the dev-server conflict was caught in the post-feature review.

