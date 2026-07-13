import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ContactDetailForm } from "@/components/contacts/ContactDetailForm";
import { DeleteContactButton } from "@/components/contacts/DeleteContactButton";
import { Navbar } from "@/components/layout/Navbar";
import { NoteInput } from "@/components/shared/NoteInput";
import { NotesList } from "@/components/shared/NotesList";
import { createSupabaseServer } from "@/lib/supabase-server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ContactRecord = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
};

type DealRecord = {
  id: string;
  name: string;
  value: number;
  stage: string;
  created_at: string;
};

type NoteRecord = {
  id: string;
  body: string;
  created_at: string;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});

const stageStyles: Record<string, string> = {
  lead: "bg-surface-secondary text-text-secondary",
  contacted: "bg-info-light text-info-foreground",
  proposal: "bg-accent-light text-accent-dark",
  won: "bg-success-light text-success-foreground",
  lost: "bg-warning-light text-warning-foreground",
};

export default async function ContactDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const [contactResult, dealsResult, notesResult] = await Promise.all([
    supabase
      .from("contacts")
      .select("id, name, email, company, phone, created_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("deals")
      .select("id, name, value, stage, created_at")
      .eq("contact_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("notes")
      .select("id, body, created_at")
      .eq("contact_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (contactResult.error) {
    notFound();
  }

  if (dealsResult.error || notesResult.error) {
    throw new Error("Could not load contact detail.");
  }

  const contact = contactResult.data as ContactRecord;
  const deals = dealsResult.data as DealRecord[];
  const notes = notesResult.data as NoteRecord[];

  return (
    <>
      <Navbar userEmail={user.email} />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent-dark">
              Feature 06 Contact Detail
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-text-primary">{contact.name}</h1>
              <p className="text-sm text-text-secondary">
                Edit contact details, review linked deals, and keep timestamped notes.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-semibold text-text-primary">Contact details</h2>
                  <p className="text-sm text-text-secondary">Update the fields below and save changes.</p>
                </div>

                <DeleteContactButton contactId={contact.id} contactName={contact.name} />
              </div>

              <ContactDetailForm contact={contact} />
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-text-primary">Linked deals</h2>
                <p className="text-sm text-text-secondary">Read-only deal summary cards for this contact.</p>
              </div>

              {deals.length === 0 ? (
                <p className="text-sm text-text-muted">No linked deals yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {deals.map((deal) => (
                    <Link
                      key={deal.id}
                      href={`/deals/${deal.id}`}
                      className="flex items-start justify-between gap-4 rounded-lg border border-border bg-surface p-4 transition hover:bg-surface-secondary"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-medium text-text-primary">{deal.name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stageStyles[deal.stage] ?? stageStyles.lead}`}>
                            {deal.stage}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">Created {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(deal.created_at))}</p>
                      </div>

                      <div className="text-sm font-semibold text-text-primary">
                        {currencyFormatter.format(deal.value / 100)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-text-primary">Notes</h2>
                <p className="text-sm text-text-secondary">Newest notes first.</p>
              </div>

              <NoteInput contactId={contact.id} placeholder="Write a note about this contact..." />

              <NotesList
                notes={notes.map((note) => ({
                  id: note.id,
                  body: note.body,
                  createdAt: note.created_at,
                }))}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}