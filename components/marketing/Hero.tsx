import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-accent-muted/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-12 h-40 w-40 rounded-full bg-surface-secondary opacity-80 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="flex max-w-2xl flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent-dark">
              Built for solopreneurs
            </span>
            <span className="text-sm text-text-secondary">
              Contacts, pipeline, notes, no setup
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-text-primary lg:text-5xl">
              Keep contacts and deals in one calm place.
            </h1>
            <p className="max-w-xl text-sm leading-6 text-text-secondary lg:text-base">
              RB CRM gives freelancers a fixed pipeline, private contact list,
              and timestamped notes without the noise of a bigger sales suite.
              Sign up free, then upgrade only when you outgrow the contact cap.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/signup?plan=starter"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark"
            >
              Start free
            </Link>
            <Link
              href="#pricing"
              className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
            >
              See pricing
            </Link>
          </div>
        </div>

        <div className="relative rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-text-primary">
                What you get
              </span>
              <span className="rounded-full bg-success-light px-2 py-0.5 text-xs font-medium text-success-foreground">
                Ready now
              </span>
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg border border-border bg-surface-secondary p-4">
                <p className="text-sm font-medium text-text-primary">10 free contacts</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Start free. Upgrade only when list grows.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface-secondary p-4">
                <p className="text-sm font-medium text-text-primary">Fixed pipeline</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Lead, Contacted, Proposal, Won, Lost.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface-secondary p-4">
                <p className="text-sm font-medium text-text-primary">Private notes</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Every note stays tied to one contact or one deal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}