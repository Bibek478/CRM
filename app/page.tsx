export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-3xl rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent-dark">
              Feature 01 Foundation
            </span>
            <span className="text-sm text-text-secondary">
              Next.js 16, TypeScript strict, Tailwind v4
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-text-primary">
              RB CRM skeleton is in place.
            </h1>
            <p className="max-w-2xl text-sm text-text-secondary">
              This placeholder homepage exists only to give the project a clean
              deployed base. The real marketing page, auth flow, data model,
              and billing features are intentionally left for later features.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-secondary p-4">
            <p className="text-sm font-medium text-text-primary">
              Current scope
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Root layout and typography are aligned with project standards,
              design tokens are loaded globally, and the app is ready for the
              next feature once deployment hookup is completed outside this
              workspace.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
