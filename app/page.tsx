import Link from "next/link";
import { redirect } from "next/navigation";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { PricingTable } from "@/components/marketing/PricingTable";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function HomePage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen">
      <div className="border-b border-border bg-surface">
        <header className="mx-auto flex h-16 max-w-300 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-text-primary">RB CRM</span>
            <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent-dark">
              Freelance CRM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark"
            >
              Sign up
            </Link>
          </div>
        </header>
      </div>

      <div className="mx-auto flex w-full max-w-300 flex-col gap-8 px-6 py-6">
        <Hero />
        <Features />
        <PricingTable />
        <Footer />
      </div>
    </main>
  );
}
