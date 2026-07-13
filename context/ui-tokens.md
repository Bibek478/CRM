# UI Tokens

Design tokens for RB CRM. There is no delivered Figma file for this
project — these values are a deliberate starting point, not a spec handed
down from a designer. Use them exactly as written once building starts (no
inventing new ad-hoc colors mid-build), but if the rendered UI looks off,
come back and edit this file first, then rebuild — don't patch around it
with one-off hex values in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using
the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` needed
for colors or tokens.

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border-border"

// Never — hardcoded hex values
className="bg-[#0F172A] text-[#FFFFFF]"

// Never — raw Tailwind color classes
className="bg-blue-500 text-gray-600"
```

---

## Design Direction

A CRM is a work tool, not a marketing product — it's opened dozens of times
a day, so the UI stays calm and legible rather than expressive. Neutral
slate background, a single confident accent color reserved for actions and
active state, status communicated through pipeline-stage color rather than
decoration. The marketing page is allowed slightly more warmth (gradient in
the hero) since it only has to make a strong first impression once.

Accent color is teal, not the purple/indigo most SaaS starter kits reach
for by default — chosen specifically so this doesn't look like a template.

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Inter", sans-serif;

  /* Page and surface backgrounds */
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-secondary: #f1f5f9;
  --color-surface-muted: #f8fafc;

  /* Borders */
  --color-border: #e2e8f0;
  --color-border-light: #eef2f6;

  /* Text */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;

  /* Primary accent — teal */
  --color-accent: #0d9488;
  --color-accent-dark: #0f766e;
  --color-accent-light: #ccfbf1;
  --color-accent-muted: #f0fdfa;
  --color-accent-foreground: #ffffff;

  /* Success — used for Won deals, active subscription */
  --color-success: #16a34a;
  --color-success-light: #dcfce7;
  --color-success-foreground: #15803d;

  /* Warning — used for Lost deals, canceling subscription */
  --color-warning: #ea580c;
  --color-warning-light: #ffedd5;
  --color-warning-foreground: #c2410c;

  /* Error — destructive actions, delete confirmations */
  --color-error: #dc2626;
  --color-error-light: #fee2e2;
  --color-error-foreground: #ffffff;

  /* Info — used for mid-pipeline stages (Contacted, Proposal) */
  --color-info: #2563eb;
  --color-info-light: #dbeafe;
  --color-info-foreground: #1d4ed8;

  /* Overlays */
  --color-overlay: #0f172a;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## Color Usage Guide

### Page Layout

| Element           | Token                  |
| ----------------- | ----------------------- |
| Page background    | `bg-background`          |
| Card / surface      | `bg-surface`              |
| Secondary surface   | `bg-surface-secondary`   |
| Default border      | `border-border`          |

### Typography

| Element                | Token                            |
| ------------------------ | ---------------------------------- |
| Headings, primary text    | `text-text-primary` (#0F172A)    |
| Secondary text, labels     | `text-text-secondary` (#475569)  |
| Placeholder, muted          | `text-text-muted` (#94A3B8)      |

### Accent (Teal)

Used for: primary buttons, active nav item, focus rings, links, the "Pro"
badge.

| Element                  | Token                     |
| --------------------------- | ---------------------------- |
| Button background            | `bg-accent`                 |
| Button text                   | `text-accent-foreground`   |
| Light badge background        | `bg-accent-light`           |
| Subtle background               | `bg-accent-muted`           |

### Pipeline Stage Colors

Each deal stage has one fixed color, used consistently for the column
header, the deal card's left border accent, and any stage badge.

| Stage       | Token                                     |
| ------------- | -------------------------------------------- |
| Lead          | `text-text-secondary` / `bg-surface-secondary` |
| Contacted      | `text-info-foreground` / `bg-info-light`      |
| Proposal        | `text-accent-dark` / `bg-accent-light`        |
| Won               | `text-success-foreground` / `bg-success-light`|
| Lost                | `text-warning-foreground` / `bg-warning-light`|

### Subscription Status Badges

| Status              | Background            | Text                       |
| ---------------------- | ------------------------ | ----------------------------- |
| Free                    | `bg-surface-secondary`    | `text-text-secondary`         |
| Pro (active)              | `bg-success-light`         | `text-success-foreground`      |
| Pro (canceling)             | `bg-warning-light`          | `text-warning-foreground`       |

---

## Typography

| Element              | Size | Weight | Line height | Color token           |
| ---------------------- | ------ | -------- | ------------- | ------------------------ |
| Logo text                | 18px   | 700      | 24px          | `text-text-primary`      |
| Page heading               | 24px   | 600      | 32px          | `text-text-primary`      |
| Section heading              | 16px   | 600      | 24px          | `text-text-primary`      |
| Nav item (active)               | 14px   | 500      | 20px          | `text-accent`             |
| Nav item (inactive)                | 14px   | 500      | 20px          | `text-text-secondary`     |
| Body / primary content                | 14px   | 500      | 20px          | `text-text-primary`       |
| Secondary / muted text                   | 12px   | 400      | 16px          | `text-text-muted`          |
| Deal card value                            | 16px   | 600      | 20px          | `text-text-primary`         |

Font family: **Inter** — import via `next/font/google`.

---

## Spacing

| Token       | Value      | Usage                  |
| ------------- | ------------ | ------------------------- |
| `gap-1`         | 4px          | Tight inline gaps          |
| `gap-2`           | 8px          | Badge and tag gaps          |
| `gap-3`             | 12px         | Form field gaps              |
| `gap-4`               | 16px         | Section internal gaps          |
| `gap-6`                 | 24px         | Between sections                 |
| `gap-8`                   | 32px         | Page section gaps                  |
| `p-4`                       | 16px         | Card padding                         |
| `p-6`                         | 24px         | Large card padding                     |
| `px-4 py-2`                     | 16px / 8px   | Button padding                            |

---

## Component Tokens

### Cards

```
background: bg-surface
border: 1px solid var(--color-border)
border-radius: 12px (rounded-xl)
padding: 24px (p-6)
box-shadow: 0px 1px 2px rgba(0,0,0,0.05)
```

### Buttons

**Primary:**

```
background: bg-accent
text: text-accent-foreground
border-radius: rounded-md
padding: px-4 py-2
font-weight: font-medium
```

**Secondary:**

```
background: bg-surface
border: border border-border
text: text-text-primary
border-radius: rounded-md
padding: px-4 py-2
```

**Destructive:**

```
background: bg-error
text: text-error-foreground
border-radius: rounded-md
padding: px-4 py-2
```

### Input Fields

```
background: bg-surface
border: border border-border
border-radius: rounded-md
padding: px-3 py-2
text: text-text-primary
placeholder: text-text-muted
focus: ring-1 ring-accent
```

### Deal Card (Pipeline Board)

```
background: bg-surface
border: 1px solid var(--color-border)
border-left: 3px solid [stage color token]
border-radius: rounded-lg
padding: p-4
```

### Badges

```
border-radius: rounded-full
padding: px-2 py-0.5
font-size: text-xs
font-weight: font-medium
```

---

## Invariants

- Never use hex values directly in components — always use CSS variables
  via Tailwind tokens
- Font is Inter — always import via `next/font/google`
- Never use raw Tailwind color classes like `bg-blue-500` or
  `text-gray-600` — use project tokens only
- `--color-accent` (teal, #0D9488) is the only accent color — never
  introduce a second accent color
- Pipeline stage colors are fixed per stage as defined above — never vary
  by any other logic
- All borders default to `--color-border` — never use `border-gray-*`
