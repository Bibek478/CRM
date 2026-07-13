import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <>
      <Navbar userEmail={user.email} />
      <main className="flex min-h-screen flex-col px-6 py-10">
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent-dark">
              Feature 03 Auth
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-text-primary">
                Dashboard access confirmed
              </h1>
              <p className="text-sm text-text-secondary">
                Session persists across reload and hard navigation. Middleware
                guards this route.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-secondary p-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold text-text-primary">
                Next build step
              </h2>
              <p className="text-sm text-text-secondary">
                This protected page exists so signup, login, Google OAuth, route
                guarding, and hard-reload session checks all have a live landing
                target before the pipeline board ships in Feature 07. Deploy and
                test session persistence on public URL next.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
