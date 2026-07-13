import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PipelineBoard } from "@/components/dashboard/PipelineBoard";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const [dealsResult, contactsResult] = await Promise.all([
    supabase
      .from("deals")
      .select("id, name, value, stage, contacts(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("contacts")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
  ]);

  type DealRow = {
    id: string;
    name: string;
    value: number;
    stage: "lead" | "contacted" | "proposal" | "won" | "lost";
    contacts: { name: string } | null;
  };

  const rawDeals = (dealsResult.data ?? []) as unknown as (Omit<DealRow, "contacts"> & {
    contacts: { name: string }[] | { name: string } | null;
  })[];

  const deals: DealRow[] = rawDeals.map((d) => ({
    ...d,
    contacts: Array.isArray(d.contacts) ? (d.contacts[0] ?? null) : d.contacts,
  }));

  const contacts = (contactsResult.data ?? []) as {
    id: string;
    name: string;
  }[];

  return (
    <>
      <Navbar userEmail={user.email} />
      <main className="relative min-h-screen px-6 py-10">
        <div className="mx-auto w-full max-w-[1200px]">
          <PipelineBoard deals={deals} contacts={contacts} />
        </div>
      </main>
    </>
  );
}
