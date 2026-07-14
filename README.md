# RB CRM

RB CRM is a lightweight, opinionated Customer Relationship Management (CRM) tool built for freelancers and solopreneurs who need a real place to track contacts and deals, outgrowing spreadsheets but without the overhead of enterprise software.

## The Problem It Solves

Solopreneurs juggling client relationships often lose track of deal stages and last touches in chaotic spreadsheets. Complex tools like HubSpot or Pipedrive are overkill for an individual. RB CRM is intentionally narrow: contacts, deals, a fixed pipeline, and notes. No confusing settings—just sign up and start tracking.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Auth & Database**: Supabase (PostgreSQL, Row Level Security)
- **Payments**: Stripe (Test Mode Webhooks & Checkout)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript (Strict Mode)
- **Deployment**: Vercel

## Core Features

- **Authentication**: Email/Password and Google OAuth handling via Supabase Auth with secure session persistence.
- **Contacts Management**: Create, edit, delete contacts and view linked deals/notes. A server-enforced cap of 10-contacts for the free tier.
- **Deal Pipeline**: A Kanban-style pipeline board (Lead, Contacted, Proposal, Won, Lost) to move deals between stages instantaneously.
- **Notes System**: A unified polymorphic note system for both Contacts and Deals.
- **Stripe Billing System**: Real test-mode checkout flow. Upgrading to the Pro tier lifts the 10-contact cap. Subscription state is entirely synchronized through Stripe webhooks, strictly decoupling UI from billing state mutations.

## Architecture & Data Flow

Our architecture enforces strict system boundaries to ensure modularity and security:
- **UI Logic**: Stays strictly in Client Components. No direct DB or Stripe calls are permissible here.
- **Mutations**: Conducted cleanly by Server Actions (`actions/`), scoping every request context via Supabase's `auth.uid()`.
- **Billing Truth**: Handled solely by `app/api/stripe/webhook/route.ts` utilizing a Service Role client to bypass RLS, making it the single source of truth for all subscription status (`profiles` DB changes).
- **Data Security**: Relies deeply on Postgres Row Level Security (RLS) policies guaranteeing per-user data isolation.

## Context Files

The project is governed strictly by the `context/` directory which serves as the "brain" and single source of truth for the AI agent (and developers). Everything built references these core blueprints:

- **`project-overview.md`**: Outlines the target user, product functionality, and explicitly defines what is *out of scope*.
- **`architecture.md`**: Defines stack choices, folder structure, system boundaries, database schema, data flow, and inviolable architectural rules (Invariants).
- **`ui-rules.md`, `ui-tokens.md`, `ui-registry.md`**: Dictates all aesthetic choices—color palettes, border radiuses, responsive patterns, avoiding ad-hoc styling.
- **`code-standards.md`**: TypeScript and Next.js conventions, import ordering, naming logic.
- **`build-plan.md` & `progress-tracker.md`**: Sequential roadmap ensuring features are implemented in isolated, testable stages.

## How Agent Skills Were Utilized

During the development lifecycle, we heavily utilized specific AI automation instructions housed in the `.agents/` folder, most notably the **`review` skill** (`.agents/skills/review/SKILL.md`). 

The standard for this project development was: *Building is not done when the code runs. It is done when the code is correct.* 
After every single feature was implemented, the `review` skill was invoked to perform a rigorous 3-layer audit before moving forward:

1. **Layer 1 (Plan Alignment)**: Ensured the delivered code met the exact scope of the plan without rogue additions or missing requirements.
2. **Layer 2 (System Integrity)**: Verified architecture boundaries were not crossed (e.g. no DB writes bypassing Server Actions, strict adherence to `ui-tokens.md`).
3. **Layer 3 (Production Readiness)**: Checked for proper empty states, error handling robustness, edge cases, and console cleanliness.

This tight review loop prevented compounding technical debt, identified drift from the architectural constraints, and surfaced actionable granular fixes for the AI agent or developer to address. Tools were purely consultative, generating a transparent report before code modifications were made.
