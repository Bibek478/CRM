<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- BEGIN:nextjs-version-check -->

# Check Your Assumptions About the Installed Versions

Training data lags behind what's actually installed in this repo — Next.js,
Supabase's SDKs, and Stripe's SDK all ship breaking changes between minor
versions. Before writing any code against one of these libraries, check the
version actually installed (`package.json` / `node_modules/<pkg>/package.json`)
rather than assuming the API shape from memory. This applies especially to
Stripe's API version string (see library-docs.md) and Supabase's `@supabase/ssr`
cookie handling pattern, both of which have changed shape across versions.

<!-- END:nextjs-version-check -->

## Read Before Anything Else

Read in this exact order before any implementation:

1. context/project-overview.md
2. context/architecture.md
3. context/ui-tokens.md
4. context/ui-rules.md
5. context/ui-registry.md
6. context/code-standards.md
7. context/library-docs.md
8. context/build-plan.md
9. context/progress-tracker.md

If this is a continuing session (not the first one on this project), read
`progress-tracker.md` first to see what's already done before re-reading
everything else in full.

---

## Rules That Never Change

- Never use hardcoded hex values or raw Tailwind color classes — always use
  tokens from `context/ui-tokens.md`
- Update `progress-tracker.md` after every completed feature — mark the
  checkbox, update Current Status, log any deviation from the plan under
  Notes
- Update `ui-registry.md` after every new UI component — before building a
  new component, check this file first for an existing pattern to match
- Before any third party library call — read `context/library-docs.md` for
  the project-specific pattern before relying on general knowledge
- `profiles.plan`, `subscription_status`, `stripe_subscription_id`, and
  `current_period_end` are only ever written by the Stripe webhook handler
  — this is the single most important invariant in the project, re-check
  `architecture.md` before touching billing state anywhere else
- If the same problem persists after one corrective prompt, stop and
  diagnose from first principles instead of trying small variations of the
  same fix — re-read the relevant context file, check the actual error
  output, and check installed library versions before trying again

---

## Suggested Workflow

This project follows a plan → build → verify → record loop for every
feature in `build-plan.md`, regardless of which AI coding tool is doing the
building:

1. **Plan** — before starting a feature with real logic (auth, Stripe,
   RLS, cascading deletes), state the plan back before writing code: what
   tables/routes/actions are touched, what could go wrong. Catching a wrong
   assumption here costs two minutes; catching it after building costs a
   refactor.
2. **Build** — implement UI and logic together for the feature (see
   build-plan.md's Core Principle — this project does not do a separate
   mock-UI pass), following code-standards.md conventions exactly.
3. **Verify** — every feature in build-plan.md has an explicit "test before
   moving on" step. Run it. Don't move to the next feature on the
   assumption that it works.
4. **Record** — update `progress-tracker.md` and, if new UI was built,
   `ui-registry.md`.

---

## Important Reminders

- Deployment happens in Phase 1, not at the end — see build-plan.md Feature
  01. Do not build features against localhost only and defer deployment.
- The Stripe webhook cannot be meaningfully tested until the app is
  deployed (or the Stripe CLI is forwarding to localhost) — see
  library-docs.md for both paths.
- The full Phase 6 checklist in build-plan.md is effectively the grading
  rubric — treat every unchecked box there as a submission-blocking bug,
  not a polish item.

<!-- END:nextjs-agent-rules -->
