# Progress Tracker

Update this file after every completed feature. Any AI agent reading this
should immediately know what is done, what is in progress, and what is
next.

---

## Current Status

**Phase:** Phase 1 - Foundation
**Last completed:** Feature 03 code complete (middleware, navbar wired)
**Next:** Complete Feature 01 external deployment (git repo, Vercel deploy, env vars in Vercel settings). Then test Feature 03 session persistence on deployed URL before marking done.

---

## Progress

### Phase 1 - Foundation

- [ ] 01 Repo + Deploy Skeleton
- [ ] 02 Supabase Project + Database Schema
- [x] 03 Auth - Signup, Login, Session Persistence

### Phase 2 - Marketing Page

- [ ] 04 Landing Page + Pricing Table

### Phase 3 - Contacts

- [ ] 05 Contacts List + CRUD + Free Tier Limit
- [ ] 06 Contact Detail - Edit, Notes, Delete

### Phase 4 - Deals & Pipeline

- [ ] 07 Pipeline Board (Dashboard)
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
- The original `profiles` update policy was removed from the live Supabase
  project and from `supabase/schema.sql` so billing fields remain writable only
  through trusted server-side/service-role flows.
- `.env.local`, `lib/supabase-client.ts`, `lib/supabase-server.ts`, and
  `supabase/schema.sql` are in place locally for Feature 02.
- Feature 03 code complete: `middleware.ts` protects `/dashboard`, `/contacts/*`,
  `/deals/*`, `/billing` and redirects unauth to `/login`. `components/layout/Navbar.tsx`
  displays nav items with active state, user email, and LogoutButton. Session
  persistence test pending until Feature 01 deployment completes.
