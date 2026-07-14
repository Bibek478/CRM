import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { PlanCard } from "@/components/billing/PlanCard";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "Billing — RB CRM",
  description: "Manage your RB CRM subscription and plan.",
};

// Force dynamic so profile data is never stale (e.g. after a checkout redirect backs here)
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [profileResult, countResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan, subscription_status, current_period_end")
      .eq("id", user.id)
      .single(),
    supabase
      .from("contacts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (profileResult.error || !profileResult.data) redirect("/login");

  if (countResult.error) {
    console.error("[billing/page] contact count query failed", countResult.error);
  }

  const profile = profileResult.data;
  const contactCount = countResult.count ?? 0;

  return (
    <>
      <Navbar userEmail={user.email} userName={user.user_metadata?.full_name ?? undefined} />
      <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-semibold text-text-primary">Billing</h1>

          <PlanCard
            plan={profile.plan ?? "free"}
            subscriptionStatus={profile.subscription_status ?? "none"}
            currentPeriodEnd={profile.current_period_end ?? null}
            contactCount={contactCount}
          />
        </div>
      </main>
    </>
  );
}