# UI Registry

Living document. Updated after every component is built. Read this before
building any new component — match existing patterns exactly before
inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it
   here

After building any component — update this file with the component name,
file path, and exact classes used.

---

## Components

### Hero

File: [components/marketing/Hero.tsx](../components/marketing/Hero.tsx)
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm` |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `p-6`, `lg:p-8`, `gap-8`, `gap-5`, `gap-4`, `gap-3`, `px-4 py-2`, `px-3 py-1`, `p-4` |
| Hover state      | `hover:bg-surface-secondary`, `hover:bg-accent-dark` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent-muted`, `text-accent-dark`, `bg-accent`, `text-accent-foreground`, `bg-success-light`, `text-success-foreground` |

**Pattern notes:**
Hero uses soft accent wash only in background shapes, not card surfaces. Primary CTA stays solid accent, secondary CTA stays neutral bordered. Inner callout cards reuse same white card language with smaller radius only for the content stack.

### Features

File: [components/marketing/Features.tsx](../components/marketing/Features.tsx)
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `gap-4`, `gap-2`, `p-6`, `mt-4`, `mt-2` |
| Hover state      | `none` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent-muted`, `text-accent-dark` |

**Pattern notes:**
Feature cards are simple white panels with one accent chip icon and muted copy. No interactive states here; this component is purely informational and should stay visually calm.

### PricingTable

File: [components/marketing/PricingTable.tsx](../components/marketing/PricingTable.tsx)
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border border-border` / `border border-accent` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` / `text-text-muted` |
| Spacing          | `p-6`, `gap-4`, `gap-2`, `mt-6`, `mt-8`, `px-4 py-2` |
| Hover state      | `hover:bg-surface-secondary`, `hover:bg-accent-dark` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent-muted`, `text-accent-dark`, `bg-accent`, `text-accent-foreground`, `bg-accent` bullet dots |

**Pattern notes:**
Starter card stays standard border. Pro card gets accent border plus Popular badge. CTA buttons follow primary and secondary button patterns exactly; this is the main pricing pattern to match for future plans.

### Footer

File: [components/marketing/Footer.tsx](../components/marketing/Footer.tsx)
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `none` |
| Border           | `border-t border-border` |
| Border radius    | `none` |
| Text — primary   | `none` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `pt-4` |
| Hover state      | `none` |
| Shadow           | `none` |
| Accent usage     | `none` |

**Pattern notes:**
Footer stays minimal. No buttons, no accent, no card treatment. This is a simple closing line and should remain visually light.

### ContactFormPanel

File: [components/contacts/ContactFormPanel.tsx](../components/contacts/ContactFormPanel.tsx)
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm`, `absolute inset-0 z-20 flex items-start justify-center bg-overlay/40 px-6 py-10`, `w-full max-w-2xl rounded-xl border border-border bg-surface p-6 shadow-sm` |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `p-6`, `gap-4`, `gap-2`, `gap-3`, `mt-6`, `px-4 py-2`, `px-3 py-2`, `px-6 py-10` |
| Hover state      | `hover:bg-accent-dark`, `hover:bg-surface-secondary` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent`, `text-accent-foreground`, `bg-accent-dark`, `text-success`, `text-error` |

**Pattern notes:**
This is the page-level add-contact modal. Outer surface stays calm and white, modal overlay uses `bg-overlay/40`, and controls keep the same primary accent button plus neutral secondary action. Input treatment matches the project form token pattern exactly.

### ContactsTable

File: [components/contacts/ContactsTable.tsx](../components/contacts/ContactsTable.tsx)
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `px-4 py-3`, `px-4 py-4` |
| Hover state      | `hover:bg-surface-secondary` |
| Shadow           | `shadow-sm` |
| Accent usage     | `none` |

**Pattern notes:**
Contacts table follows the project table pattern: white surface, border between rows, uppercase header, hover row highlight, and clickable rows. Future data tables should match this unless a different table style is explicitly needed.

### ContactLimitBanner

File: [components/contacts/ContactLimitBanner.tsx](../components/contacts/ContactLimitBanner.tsx)
Last updated: 2026-07-13

| Property         | Class |
| ---------------- | ----- |
| Background       | `rounded-lg border border-border bg-warning-light p-4` |
| Border           | `border border-border` |
| Border radius    | `rounded-lg` |
| Text — primary   | `none` |
| Text — secondary | `text-warning-foreground` |
| Spacing          | `p-4`, `ml-3`, `px-4 py-2` |
| Hover state      | `hover:bg-accent-dark` |
| Shadow           | `none` |
| Accent usage     | `bg-accent`, `text-accent-foreground` |

**Pattern notes:**
This is a full-state alert, not an empty state. It uses warning background with a single Pro CTA. Keep it visually distinct from cards while still using the normal button language.

### ContactDetailForm

File: [components/contacts/ContactDetailForm.tsx](../components/contacts/ContactDetailForm.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `none` |
| Border           | `none` |
| Border radius    | `none` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `flex flex-col gap-4`, `grid gap-4`, `px-3 py-2`, `gap-2`, `gap-3` |
| Hover state      | `hover:bg-accent-dark` |
| Shadow           | `none` |
| Accent usage     | `bg-accent`, `text-accent-foreground`, `text-error`, `text-success` |

**Pattern notes:**
This is the editable contact fields form. It stays structurally simple and inherits the shared input pattern exactly, with one primary save button and no extra chrome.

### DeleteContactButton

File: [components/contacts/DeleteContactButton.tsx](../components/contacts/DeleteContactButton.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `none` |
| Border           | `none` |
| Border radius    | `rounded-md` |
| Text — primary   | `text-error-foreground` |
| Text — secondary | `text-error` |
| Spacing          | `px-4 py-2` |
| Hover state      | `hover:opacity-90` |
| Shadow           | `none` |
| Accent usage     | `bg-error`, `text-error-foreground` |

**Pattern notes:**
Destructive action stays explicit and red, with browser confirm before submit. Future destructive buttons should match this direct, high-clarity pattern.

### NoteInput

File: [components/shared/NoteInput.tsx](../components/shared/NoteInput.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `rounded-lg border border-border bg-surface p-4 shadow-sm` |
| Border           | `border border-border` |
| Border radius    | `rounded-lg` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-muted` |
| Spacing          | `gap-3`, `p-4`, `px-3 py-2`, `px-4 py-2` |
| Hover state      | `hover:bg-accent-dark` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent`, `text-accent-foreground`, `text-error` |

**Pattern notes:**
Note input is a compact card-style composer. It uses the standard input token set and a single primary action, with the textarea as the only content entry point.

### NotesList

File: [components/shared/NotesList.tsx](../components/shared/NotesList.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border border-border` |
| Border radius    | `rounded-lg` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-muted` |
| Spacing          | `gap-3`, `p-4`, `px-3 py-1.5` |
| Hover state      | `hover:bg-surface-secondary` |
| Shadow           | `none` |
| Accent usage     | `text-error` |

**Pattern notes:**
Each note is a compact bordered card with a small destructive action. Keep notes visually lighter than primary contact cards and preserve newest-first ordering.

### DealCard

File: [components/dashboard/DealCard.tsx](../components/dashboard/DealCard.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` |
| Border           | `border border-border border-l-4` + `style={{ borderLeftColor }}` via CSS var |
| Border radius    | `rounded-lg` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-muted` |
| Spacing          | `p-4`, `gap-3`, `px-3 py-1.5` |
| Hover state      | `hover:text-accent` (deal name link) |
| Shadow           | `shadow-sm` |
| Accent usage     | `focus:ring-accent`, `focus:border-accent`, `text-accent` |

**Pattern notes:**
Left border color set via `style={{ borderLeftColor: "var(--color-...)" }}` — never dynamic Tailwind arbitrary classes. Stage `<select>` is **controlled** (`value={selectedStage}`) with local state; resets automatically when server re-renders new `deal.stage` and on action failure. Auto-submits via `requestSubmit()` on change. Deal name is a Next.js `<Link>` to `/deals/[id]`.

### PipelineColumn

File: [components/dashboard/PipelineColumn.tsx](../components/dashboard/PipelineColumn.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface-muted` |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary`, `text-text-muted` |
| Spacing          | `gap-3`, `gap-2`, `p-2`, `px-1`, `px-2 py-0.5`, `py-8` |
| Hover state      | none |
| Shadow           | none |
| Accent usage     | none |

**Pattern notes:**
Stage dot color set via `style={{ backgroundColor: "var(--color-...)" }}` — never dynamic Tailwind bg classes. Deal count badge uses `bg-surface-secondary`. Column is a muted background container. Empty state is a centred `py-8` message inside the column body.

### PipelineBoard

File: [components/dashboard/PipelineBoard.tsx](../components/dashboard/PipelineBoard.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `bg-surface` (modal) |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-muted` |
| Spacing          | `gap-6`, `gap-4`, `gap-3`, `gap-2`, `p-6`, `px-4 py-2`, `px-3 py-2`, `py-10`, `pb-4`, `pt-2` |
| Hover state      | `hover:bg-accent-dark`, `hover:bg-surface-secondary`, `hover:text-text-primary` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent`, `text-accent-foreground`, `bg-accent-dark`, `focus:ring-accent`, `text-accent` |

**Pattern notes:**
New Deal modal uses the same overlay pattern as ContactFormPanel (`bg-overlay/40`, click-outside to close). Board uses `overflow-x-auto` with `min-w-[220px]` columns so it scrolls horizontally on narrow viewports rather than stacking. All five stage columns always render; empty state lives inside each column.

### DealDetailForm

File: [components/deals/DealDetailForm.tsx](../components/deals/DealDetailForm.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `none` |
| Border           | `border border-border` (inputs/select) |
| Border radius    | `rounded-md` (inputs, select, button) |
| Text — primary   | `text-text-primary`, `text-sm font-medium` (labels), `text-xs text-error` (required mark) |
| Text — secondary | `text-xs text-success-foreground` (save confirmation), `text-xs text-error` (error) |
| Spacing          | `flex flex-col gap-4` (form), `flex flex-col gap-2` (field), `grid gap-4` (value+stage row), `px-3 py-2` (inputs), `px-4 py-2` (button) |
| Hover state      | `hover:bg-accent-dark` (button) |
| Shadow           | `none` |
| Accent usage     | `bg-accent`, `text-accent-foreground`, `focus:ring-accent`, `focus:border-accent`, `text-success-foreground`, `text-error` |

**Pattern notes:**
Mirrors ContactDetailForm structure. No `useEffect` — server revalidation keeps form in sync after save. Controlled `<select>` for stage using VALID_STAGES constant — same guard as DealCard on pipeline board. Single `updateDeal` action handles name + value + stage together. Inline save confirmation uses `text-success-foreground` (not `text-success`) to match token convention.

### DeleteDealButton

File: [components/deals/DeleteDealButton.tsx](../components/deals/DeleteDealButton.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `none` |
| Border           | `none` |
| Border radius    | `rounded-md` |
| Text — primary   | `text-error-foreground` |
| Text — secondary | `text-xs text-error` (error message below button) |
| Spacing          | `px-4 py-2`, `mt-2` (error message) |
| Hover state      | `hover:opacity-90` |
| Shadow           | `none` |
| Accent usage     | `bg-error`, `text-error-foreground` |

**Pattern notes:**
Mirrors DeleteContactButton exactly — 2-space indent, `window.confirm` before submit, `useActionState(deleteDeal)`, `router.replace("/dashboard")` on success. Error message rendered below button with `mt-2 text-xs text-error`. Future destructive deal actions must match this pattern.

### PlanCard

File: [components/billing/PlanCard.tsx](../components/billing/PlanCard.tsx)
Last updated: 2026-07-14

| Property         | Class |
| ---------------- | ----- |
| Background       | `rounded-xl border border-border bg-surface p-6 shadow-sm` |
| Border           | `border border-border` |
| Border radius    | `rounded-xl` |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-muted`, `text-text-secondary`, `text-warning-foreground` |
| Spacing          | `p-6`, `gap-6`, `gap-4`, `gap-2`, `px-4 py-2`, `px-2 py-0.5`, `h-1.5` |
| Hover state      | `hover:bg-accent-dark`, `hover:bg-surface-secondary` |
| Shadow           | `shadow-sm` |
| Accent usage     | `bg-accent`, `text-accent-foreground`, `bg-accent-dark`, `bg-success-light`, `text-success-foreground`, `bg-warning-light`, `text-warning-foreground`, `bg-surface-secondary`, `text-text-secondary`, `text-error` |

**Pattern notes:**
PlanCard is a client component with four props: `plan`, `subscriptionStatus`, `currentPeriodEnd`, `contactCount`. Owns loading/error state for both upgrade (`/api/stripe/checkout`) and manage (`/api/stripe/portal`) buttons — separate loading booleans, shared error display. Free plan shows a contact usage progress bar (`contactCount / 10`) using a token-colored `bg-accent` fill on a `bg-surface-secondary` track — no hardcoded values. Canceling badge text is `"Cancels on [date]"` (not "Pro — Canceling"). No Stripe SDK calls here; all Stripe logic is in API routes.

