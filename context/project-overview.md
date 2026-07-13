# Project Overview

## About the Project

RB CRM is a lightweight CRM built for solopreneurs and freelancers who need
somewhere real to track contacts and deals instead of a spreadsheet. A user
signs up, adds contacts, creates deals against those contacts, and moves
deals through a fixed pipeline from first contact to won or lost. Every
contact and deal is private to the account that created it.

The product is free to start and paid to scale — the free tier is capped at
10 contacts, the Pro tier is unlimited. Upgrading is a real Stripe Checkout
flow in test mode, confirmed server-side via webhook, not a flag flipped in
the UI.

This is a hackathon submission. The bar is: a stranger can land on the
marketing page, sign up, hit the contact limit, pay with a Stripe test card,
and keep working — with zero human intervening at any step.

---

## The Problem It Solves

Solopreneurs juggling client relationships on spreadsheets or notes apps
lose track of who they last talked to and where a deal stands. Dedicated
CRMs (HubSpot, Pipedrive) are built for sales teams and are overkill —
too many settings, too much configuration before it's useful.

RB CRM is intentionally narrow: contacts, deals, a fixed pipeline, notes.
Nothing to configure. Sign up and it's already the right shape for one
person running their own client list.

---

## Pages

```
/                     → Marketing / landing page
/login                → Sign in (email+password or Google)
/signup               → Sign up (email+password or Google)
/dashboard            → Pipeline board — deals grouped by stage
/contacts             → Contacts list
/contacts/[id]        → Single contact — details, notes, associated deals
/deals/[id]           → Single deal — stage, value, notes, linked contact
/billing              → Current plan, upgrade button, cancel button
```

---

## Navigation

Top navbar, logged-in state only. Three items:

```
Dashboard   Contacts   Billing
```

Logged-out visitors on `/` see the marketing page navbar instead: Login /
Sign Up buttons only, no product nav.

---

## Core User Flow

### Landing Page (Logged Out)

- Hero section — value prop, primary CTA ("Start Free")
- Feature highlights — 3 value props (contacts, pipeline, notes)
- Pricing table — Starter (free) vs Pro ($X/mo), feature gates listed
  explicitly on each tier
- Every CTA on this page links into `/signup`, never a dead button

### Signup / Login

- Supabase Auth — email+password AND Google OAuth, both available on both
  pages
- On successful signup — a `profiles` row is created (via DB trigger, see
  architecture.md) with `plan: 'free'`
- On successful login — redirect to `/dashboard`
- Session persists across reload — Supabase session cookie, checked in
  middleware on every protected route
- Logout clears session, redirects to `/`

### Dashboard — Pipeline Board

- Five fixed columns: Lead, Contacted, Proposal, Won, Lost
- Each column shows deal cards — deal name, linked contact name, value
- "New Deal" button — opens a form (contact picker, deal name, value,
  starting stage)
- Moving a deal between stages updates `deals.stage` in the DB immediately
- Empty state per column when no deals are in that stage

### Contacts

- Table: Name, Email, Company, Phone, # of open deals, date added
- "Add Contact" button — opens a form (name, email, company, phone)
- If user is on the free plan and already has 10 contacts — "Add Contact"
  button is disabled, replaced with an inline upgrade prompt linking to
  `/billing`
- Clicking a row → `/contacts/[id]`

### Contact Detail

- Contact fields, editable inline
- List of deals linked to this contact, each showing stage + value
- Notes section — timestamped free-text notes, newest first, add-note input
  at the top
- Delete contact button — requires confirmation, cascades to delete linked
  deals and notes

### Deal Detail

- Deal name, value, stage (dropdown — moves it on the pipeline board too),
  linked contact (link back to contact detail)
- Notes section — same pattern as contact notes
- Delete deal button — requires confirmation

### Billing

- Current plan shown clearly — "Starter (Free)" or "Pro"
- Free plan — contact count shown ("7 of 10 contacts used"), Upgrade to Pro
  button
- Pro plan — "Manage Subscription" — cancel button, confirmation dialog
- After Stripe Checkout completes — user is redirected back here, plan
  reflects Pro immediately (webhook must have already written to DB before
  redirect lands, or page must refetch on load — see build-plan.md Feature
  12)
- Cancelling — calls Stripe to cancel at period end, DB updated via webhook,
  UI shows "Pro (cancels on [date])" until the period actually ends

---

## Data Architecture

### Contacts & Deals

- Live in `contacts` and `deals` tables, both scoped to `user_id`
- A deal always references exactly one contact (`contact_id`, required)
- Notes live in a single `notes` table with a polymorphic-ish reference
  (`contact_id` OR `deal_id`, never both — see architecture.md schema)
- Never modified by any billing operation

### Subscription State

- Lives on the `profiles` table — `plan`, `stripe_customer_id`,
  `stripe_subscription_id`, `subscription_status`, `current_period_end`
- The single source of truth for plan state is this table, written only by
  the Stripe webhook handler — never written directly by client-side code
- The UI reads `profiles.plan` to gate features; it never asks Stripe
  directly at render time

---

## Features In Scope

- Marketing page — hero, features, pricing table (2 tiers), all CTAs wired
  to real signup
- Supabase Auth — email+password and Google OAuth, persistent sessions
- Contacts — create, list, view, edit, delete (cascades to deals/notes)
- Deals — create, view, edit stage, delete, fixed 5-stage pipeline
- Notes — add to contacts and deals, timestamped, newest first
- Free tier contact cap (10), enforced server-side not just hidden in UI
- Stripe Checkout — real test-mode checkout flow for Pro upgrade
- Stripe webhook — `checkout.session.completed` and
  `customer.subscription.deleted` handled server-side, updates `profiles`
- Billing page — current plan, upgrade, cancel
- Public deployment on Vercel

## Features Out of Scope

- Deal/pipeline customization (renaming, reordering, adding stages)
- Multiple pipelines per user
- Team accounts / multi-user access to the same contact list
- Email sending or reminders
- Contact import (CSV upload)
- Activity timeline / audit log beyond notes
- Search or filtering on contacts/deals (table shows everything, sorted by
  date added)
- Deal value currency selection — USD only
- Any AI features — this idea has none, and none should be invented
- Annual billing tier — monthly only
- Proration handling beyond what Stripe does by default
- Invoicing or payment collection from the CRM's own contacts (this product
  charges its own subscribers, it does not send invoices to clients)

---

## Target User

A freelancer or solopreneur who:

- Currently tracks clients in a spreadsheet or notes app
- Runs their own client relationships end to end, no team
- Wants a fixed, opinionated pipeline with zero setup
- Would pay a small monthly fee once they outgrow the free contact limit

---

## Success Criteria

- A stranger can sign up, add contacts, hit the 10-contact wall, upgrade via
  real Stripe test checkout, and immediately add an 11th contact — with no
  manual intervention
- Reloading any page never logs the user out
- Every contact/deal/note is scoped to the account that created it —
  verified by testing with two separate accounts
- Cancelling a subscription is reflected correctly and doesn't silently
  break access mid-period
- The whole thing is reachable at a public URL, not localhost
- UI is visually consistent across every page
