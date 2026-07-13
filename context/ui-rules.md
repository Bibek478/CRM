# UI Rules

Concise rules for building RB CRM UI. There is no delivered design file —
`ui-tokens.md` and this file together *are* the design system. Follow them
exactly so the product looks intentional rather than assembled feature by
feature.

---

## Font

Always import Inter via `next/font/google` in the root layout.

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

Apply the font variable class to the `<html>` tag in root layout. Never use
system fonts as the primary font.

---

## Layout

- Page max-width: 1200px, centered
- Main content area padding: 24px on all sides
- Gap between page sections: 24px
- Navbar height: 64px, full width, white background, padding 0 24px
- Product pages (dashboard, contacts, billing) use top navbar only — no
  sidebar
- The marketing page (`/`) has no app navbar — it has its own header with
  Login / Sign Up buttons, not the Dashboard/Contacts/Billing nav

---

## Navbar (Logged-In / Product Pages)

Three nav items: Dashboard, Contacts, Billing.

- Active item: `text-accent`, font-weight 500, 14px
- Inactive item: `text-text-secondary`, font-weight 500, 14px
- No underline — active state is color change only
- Always white background (`bg-surface`), full viewport width
- Right side: user email/avatar + logout, not part of the three nav items

---

## Cards

Every content section lives in a card.

```
background: bg-surface
border: 1px solid border-border
border-radius: 12px (rounded-xl)
padding: 24px (p-6)
box-shadow: 0px 1px 2px rgba(0,0,0,0.05)
```

Never use colored card backgrounds — always white. Color goes inside cards
via badges, borders, and text, never on the card surface itself. The one
exception is deal cards on the pipeline board, which use a colored **left
border** per stage (see ui-tokens.md) — this is a border accent, not a
background fill, and does not violate this rule.

---

## Typography Hierarchy

**Page heading** — one per page, top of the page

```
font-size: 24px
font-weight: 600
color: text-text-primary
```

**Section headings** — card titles, page section titles

```
font-size: 16px
font-weight: 600
color: text-text-primary
```

**Body / primary content text**

```
font-size: 14px
font-weight: 500
color: text-text-primary
```

**Secondary / muted text** — labels, timestamps, subtitles

```
font-size: 12px
font-weight: 400
color: text-text-muted
```

---

## Buttons

**Primary** — main action per page (Add Contact, Upgrade to Pro, Save)

```
background: bg-accent
color: text-accent-foreground
border-radius: rounded-md
padding: px-4 py-2
font-size: 14px
font-weight: 500
```

**Secondary** — cancel, back, non-primary actions

```
background: bg-surface
border: 1px solid border-border
color: text-text-primary
border-radius: rounded-md
padding: px-4 py-2
```

**Destructive** — delete contact, delete deal, cancel subscription

```
background: bg-error
color: text-error-foreground
border-radius: rounded-md
padding: px-4 py-2
```

Every destructive action opens a confirmation dialog before executing —
never a bare button that deletes on click. This applies to deleting
contacts, deleting deals, and cancelling a subscription.

---

## Form Inputs

```
background: bg-surface
border: 1px solid border-border
border-radius: rounded-md
padding: px-3 py-2
font-size: 14px
color: text-text-primary
placeholder color: text-text-muted
focus: ring-1 ring-accent border-accent
```

- Required fields marked with a red asterisk next to the label, not just a
  placeholder hint
- Inline validation errors show below the field in `text-error`, 12px —
  never a separate error summary block

---

## Contacts Table

- No alternating row colors — white rows only, separated by border
- Row border: `1px solid border-border` between rows
- Column headers: uppercase, 12px, font-weight 500, `text-text-secondary`
- Row text: 14px, `text-text-primary`
- Hover state: `bg-surface-secondary`
- Entire row is clickable (navigates to contact detail) — not just a
  separate "view" link

---

## Pipeline Board

- 5 fixed columns, equal width, horizontal scroll on narrow viewports
  rather than stacking vertically
- Column header: stage name, deal count in that stage, stage color token
  from ui-tokens.md as a small dot next to the name
- Deal cards inside each column: deal name (body text), contact name
  (secondary/muted text), value (deal card value token, right-aligned)
- Empty column state: centered muted text, "No deals in this stage"

---

## Badges

All badges use `border-radius: rounded-full` (pill shape).

```
padding: px-2 py-0.5
font-size: 12px
font-weight: 500
```

Used for: pipeline stage labels wherever shown outside the board itself,
subscription status on the billing page.

---

## Empty States

Every section that can be empty must have an empty state. Keep it minimal:

- Short descriptive text in `text-text-muted`
- CTA button if there's a logical next action (e.g. no contacts yet → "Add
  your first contact")

The one required exception: the free-tier contact limit is **not** an
empty state, it's a full-state — see Contact Limit Banner below.

---

## Contact Limit Banner

Shown on the Contacts page only when a free-plan user has reached 10
contacts.

```
background: bg-warning-light
border: 1px solid border-border
border-radius: rounded-lg
padding: p-4
text: text-warning-foreground, 14px
```

Contains the message and a single "Upgrade to Pro" primary button linking
to `/billing`. The "Add Contact" button elsewhere on the page is disabled
(not hidden) while this banner is showing, so the user understands why
they can't add more rather than wondering where the button went.

---

## Marketing Page

The one page allowed visual flourish beyond the flat product UI:

- Hero background may use a subtle gradient using `--color-accent` at low
  opacity — never a gradient on product-page cards
- Pricing table: 2 cards side by side (Starter / Pro), Pro card visually
  distinguished with an `border-accent` border and a small "Popular" badge,
  Starter card uses the standard `border-border`
- Every pricing card CTA links to `/signup`, pre-selecting the
  corresponding plan via a query param (`/signup?plan=pro`) so the billing
  page can pre-select Stripe checkout after signup completes

---

## Tailwind v4 Note

This project uses Tailwind v4. Tokens are defined with `@theme` in
globals.css — no `tailwind.config.ts` needed. Never define colors in a
config file. Always use `@theme` for new tokens.

---

## Do Nots

- Never use Tailwind's built-in color classes (`bg-blue-500`,
  `text-gray-600`) — use project tokens only
- Never define colors in `tailwind.config.ts` — use `@theme` in globals.css
- Never add gradients to card backgrounds on product pages (marketing hero
  is the sole exception)
- Never use more than one font weight in a single UI element
- Never show raw error messages to users — always show human readable text
- Never stack more than 2 levels of border radius inside each other
- Never use `position: fixed` for UI elements — use normal flow layout
- Never let a destructive action (delete, cancel subscription) execute
  without a confirmation step
