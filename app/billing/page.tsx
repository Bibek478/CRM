import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import { PlanCard } from "@/components/billing/PlanCard";

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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("plan, subscription_status, current_period_end")
    .eq("id", user.id)
    .single();

  if (error || !profile) redirect("/login");

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-text-primary">Billing</h1>

        <PlanCard
          plan={profile.plan ?? "free"}
          subscriptionStatus={profile.subscription_status ?? "none"}
          currentPeriodEnd={profile.current_period_end ?? null}
        />
      </div>
    </main>
  );
}