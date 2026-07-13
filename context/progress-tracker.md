# Progress Tracker

Update this file after every completed feature. Any AI agent reading this
should immediately know what is done, what is in progress, and what is
next.

---

## Current Status

**Phase:** Phase 4 - Deals & Pipeline
**Last completed:** Feature 07 pipeline board code complete
**Next:** Build Feature 08 deal detail after validating pipeline board on deployed URL.

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
- [ ] 08 Deal Detail - Edit, Notes, Delete

### Phase 5 - Stripe & Billing

- [ ] 09 Stripe Setup + Checkout Flow
- [ ] 10 Stripe Webhook - Subscription State
- [ ] 11 Billing Page

### Phase 6 - Polish & Submission Check

- [ ] 12 Full Walkthrough + Fix List

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
- Feature 07 implemented locally: `/dashboard` is now a 5-column pipeline board.
  `PipelineBoard` client component handles the New Deal modal (contact picker, name,
  value, stage). `DealCard` shows name, contact, value, and a stage `<select>` that
  auto-submits `updateDealStage`. `PipelineColumn` renders column header with stage
  dot, count badge, and empty state. `actions/deals.ts` includes `createDeal`,
  `updateDealStage`, plus `updateDeal`/`deleteDeal` stubs ready for Feature 08.

