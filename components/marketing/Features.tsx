const features = [
  {
    title: "Contacts",
    description:
      "Keep names, emails, company details, and phone numbers in one table that stays private to each account.",
  },
  {
    title: "Pipeline",
    description:
      "Track deals through a fixed five-stage board so progress is visible at a glance.",
  },
  {
    title: "Notes",
    description:
      "Add timestamped notes to contacts and deals without breaking the flow of work.",
  },
] as const;

export function Features() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Built for the workday, not a demo.
        </h2>
        <p className="max-w-2xl text-sm text-text-secondary">
          Three core pieces, one opinionated flow, no setup maze.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-muted text-sm font-semibold text-accent-dark">
              {feature.title.slice(0, 1)}
            </div>
            <h3 className="mt-4 text-base font-semibold text-text-primary">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}