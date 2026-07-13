import Link from "next/link";

type BillingPageProps = {
  searchParams?: {
    plan?: string;
  };
};

export default function BillingPage({ searchParams }: BillingPageProps) {
  const selectedPlan = searchParams?.plan === "pro" ? "pro" : "starter";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent-dark">
              Billing handoff
            </span>
            <h1 className="text-2xl font-semibold text-text-primary">
              {selectedPlan === "pro" ? "Pro selected" : "Starter selected"}
            </h1>
            <p className="text-sm text-text-secondary">
              Plan choice survived signup flow. Full Stripe checkout comes in billing feature.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}