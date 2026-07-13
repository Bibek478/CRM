import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For first clients and lighter lists.",
    cta: "Start free",
    href: "/signup?plan=starter",
    accent: false,
    features: ["10 contacts", "Contacts, deals, notes", "Private workspace"],
  },
  {
    name: "Pro",
    price: "$9/mo",
    description: "For larger lists and heavier use.",
    cta: "Choose Pro",
    href: "/signup?plan=pro",
    accent: true,
    features: ["Unlimited contacts", "Upgrade path to Stripe", "All core CRM tools"],
  },
] as const;

export function PricingTable() {
  return (
    <section id="pricing" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-text-primary">Pricing</h2>
        <p className="text-sm text-text-secondary">
          Start free. Move to Pro when you need unlimited contacts.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-xl border bg-surface p-6 shadow-sm ${plan.accent ? "border-accent" : "border-border"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <p className="text-sm text-text-secondary">{plan.description}</p>
              </div>
              {plan.accent ? (
                <span className="rounded-full bg-accent-muted px-2 py-0.5 text-xs font-medium text-accent-dark">
                  Popular
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-3xl font-semibold text-text-primary">
                {plan.price}
              </span>
              <span className="pb-1 text-sm text-text-muted">per month</span>
            </div>

            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`mt-8 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition ${plan.accent ? "bg-accent text-accent-foreground hover:bg-accent-dark" : "border border-border bg-surface text-text-primary hover:bg-surface-secondary"}`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}