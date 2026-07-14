import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-accent-muted/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-12 h-40 w-40 rounded-full bg-surface-secondary opacity-80 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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

        <div className="relative rounded-xl border border-border bg-surface-secondary p-1.5 shadow-sm">
          <Image
            src="/images/hero-dashboard-preview.png"
            alt="RB CRM Pipeline Dashboard Preview"
            width={1920}
            height={1080}
            className="block w-full h-auto rounded-lg border border-border bg-surface"
            priority
          />
        </div>
      </div>
    </section>
  );
}
