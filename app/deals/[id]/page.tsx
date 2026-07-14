import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DealDetailForm } from "@/components/deals/DealDetailForm";
import { DeleteDealButton } from "@/components/deals/DeleteDealButton";
import { Navbar } from "@/components/layout/Navbar";
import { NoteInput } from "@/components/shared/NoteInput";
import { NotesList } from "@/components/shared/NotesList";
import { createSupabaseServer } from "@/lib/supabase-server";

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

type DealRecord = {
    id: string;
    name: string;
    value: number;
    stage: string;
    contact_id: string;
    created_at: string;
};

type ContactRecord = {
    id: string;
    name: string;
};

type NoteRecord = {
    id: string;
    body: string;
    created_at: string;
};

const stageStyles: Record<string, string> = {
    lead: "bg-surface-secondary text-text-secondary",
    contacted: "bg-info-light text-info-foreground",
    proposal: "bg-accent-light text-accent-dark",
    won: "bg-success-light text-success-foreground",
    lost: "bg-warning-light text-warning-foreground",
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
});

export default async function DealDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createSupabaseServer();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // user is guaranteed non-null here — redirect() throws above
    const userId = user!.id;
    const userEmail = user!.email;
    const { data: dealData, error: dealError } = await supabase
        .from("deals")
        .select("id, name, value, stage, contact_id, created_at")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

    if (dealError || !dealData) {
        notFound();
    }

    const deal = dealData as DealRecord;

    const [contactResult, notesResult] = await Promise.all([
        supabase
            .from("contacts")
            .select("id, name")
            .eq("id", deal.contact_id)
            .eq("user_id", userId)
            .single(),
        supabase
            .from("notes")
            .select("id, body, created_at")
            .eq("deal_id", id)
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
    ]);

    if (contactResult.error || notesResult.error) {
        throw new Error("Could not load deal detail.");
    }

    const contact = contactResult.data as ContactRecord;
    const notes = notesResult.data as NoteRecord[];

    return (
        <>
            <Navbar userEmail={userEmail} userName={user.user_metadata?.full_name ?? undefined} />
            <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
                <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-semibold text-text-primary">{deal.name}</h1>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${stageStyles[deal.stage] ?? stageStyles.lead}`}
                                >
                                    {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary">
                                Edit deal details, update the stage, and keep timestamped notes.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {/* Deal info card */}
                        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-base font-semibold text-text-primary">Deal details</h2>
                                    <p className="text-sm text-text-secondary">Update the fields below and save changes.</p>
                                </div>
                                <DeleteDealButton dealId={deal.id} dealName={deal.name} />
                            </div>

                            <p className="text-sm text-text-muted">
                                Value:{" "}
                                <span className="font-medium text-text-primary">
                                    {currencyFormatter.format(deal.value / 100)}
                                </span>
                                {" · "}
                                Added{" "}
                                {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(deal.created_at))}
                            </p>

                            <DealDetailForm
                                deal={{
                                    id: deal.id,
                                    name: deal.name,
                                    value: deal.value,
                                    stage: deal.stage,
                                }}
                            />
                        </div>

                        {/* Linked contact card */}
                        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-base font-semibold text-text-primary">Linked contact</h2>
                                <p className="text-sm text-text-secondary">The contact this deal is associated with.</p>
                            </div>

                            <Link
                                href={`/contacts/${contact.id}`}
                                className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition hover:bg-surface-secondary"
                            >
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-text-primary">{contact.name}</p>
                                    <p className="text-xs text-text-muted">View contact detail</p>
                                </div>
                                <span className="text-sm text-accent">&rarr;</span>
                            </Link>
                        </div>

                        {/* Notes card */}
                        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-base font-semibold text-text-primary">Notes</h2>
                                <p className="text-sm text-text-secondary">Newest notes first.</p>
                            </div>

                            <NoteInput dealId={deal.id} placeholder="Write a note about this deal..." />

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
