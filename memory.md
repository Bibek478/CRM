# Memory - Feature 02 Supabase Setup

Last updated: 2026-07-13

## What was built

- Installed `@supabase/ssr` and `@supabase/supabase-js` and updated `package.json` / `package-lock.json`.
- Created `lib/supabase-client.ts` for the browser Supabase client.
- Created `lib/supabase-server.ts` for the server Supabase client using Next.js 16 async `cookies()`.
- Created `supabase/schema.sql` with the RB CRM schema: `profiles`, `contacts`, `deals`, `notes`, RLS policies, and `handle_new_user` trigger.
- Added local Supabase environment variables in `.env.local`.
- Updated `context/progress-tracker.md` to reflect that Supabase setup work is in place locally and that deployment-side setup is still pending.

## Decisions made

- The database schema is managed through Supabase SQL Editor externally, but the repo keeps a checked-in copy in `supabase/schema.sql` as the source-controlled version.
- Cascade deletes were kept on the foreign keys so later contact/deal deletion flows can rely on database-level cleanup.
- The unsafe `profiles` update policy was removed so billing-related fields are not writable by regular authenticated users.
- Vercel environment variable setup is deferred until git initialization and deployment handoff are done.

## Problems solved

- PowerShell blocked the `npm` shim; package install and verification worked by using `npm.cmd`.
- Sandbox path restrictions broke `lint` and `build`; both were verified successfully with escalated runs.
- The initial `profiles` RLS update policy would have allowed clients to mutate billing state. This was fixed live in Supabase and mirrored in `supabase/schema.sql` by removing the user update policy and revoking `UPDATE` on `public.profiles` from `anon` and `authenticated`.

## Current state

- Local Supabase wiring is complete and `next build` / `eslint` passed after the Feature 02 changes.
- The Supabase SQL was already run in the Supabase dashboard, and the follow-up billing-policy fix was also applied there successfully.
- `.env.local` exists locally with Supabase keys, but those values must not be copied into memory or committed.
- Git initialization, GitHub push, Vercel connection, and Vercel environment variable setup are still pending.
- `context/progress-tracker.md` notes the external deployment/setup gap, and Feature 03 has not started yet.

## Next session starts with

- Decide whether to finish the external deployment handoff first:
  initialize git, connect GitHub/Vercel, and add the Supabase environment variables in Vercel.
- After that, start Feature 03 auth work using the existing Supabase client helpers and the database already created in Supabase.

## Open questions

- Whether to mark Feature 02 complete in the tracker only after Vercel env setup is done, or continue building Feature 03 locally before that external step.
