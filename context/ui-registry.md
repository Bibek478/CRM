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
