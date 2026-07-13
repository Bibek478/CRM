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
