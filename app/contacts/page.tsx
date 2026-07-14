import { redirect } from "next/navigation";
import { ContactFormPanel } from "@/components/contacts/ContactFormPanel";
import { ContactLimitBanner } from "@/components/contacts/ContactLimitBanner";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { Navbar } from "@/components/layout/Navbar";
import { createSupabaseServer } from "@/lib/supabase-server";
import { FREE_CONTACT_LIMIT } from "@/lib/utils";

type ContactRecord = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
};

type DealRecord = {
  contact_id: string;
  stage: string;
};

export default async function ContactsPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const [profileResult, contactsResult, dealsResult] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase
      .from("contacts")
      .select("id, name, email, company, phone, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("deals")
      .select("contact_id, stage")
      .eq("user_id", user.id),
  ]);

  if (profileResult.error || contactsResult.error || dealsResult.error) {
    throw new Error("Could not load contacts page.");
  }

  const isFreePlan = profileResult.data.plan === "free";
  const contactRows = contactsResult.data as ContactRecord[];
  const dealRows = dealsResult.data as DealRecord[];

  const openDealCounts = dealRows.reduce<Record<string, number>>((counts, deal) => {
    if (deal.stage === "won" || deal.stage === "lost") {
      return counts;
    }

    counts[deal.contact_id] = (counts[deal.contact_id] ?? 0) + 1;
    return counts;
  }, {});

  const contacts = contactRows.map((contact) => ({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    company: contact.company,
    phone: contact.phone,
    createdAt: contact.created_at,
    openDealCount: openDealCounts[contact.id] ?? 0,
  }));

  const contactLimitReached = isFreePlan && contacts.length >= FREE_CONTACT_LIMIT;

  return (
    <>
      <Navbar userEmail={user.email} />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-text-primary">Contacts</h1>
            <p className="text-sm text-text-secondary">
              Keep every client detail in one table. Open deal count excludes won and lost deals.
            </p>
          </div>

          {contactLimitReached ? <ContactLimitBanner /> : null}

          <ContactFormPanel disabled={contactLimitReached} />

          <ContactsTable contacts={contacts} />
        </section>
      </main>
    </>
  );
}