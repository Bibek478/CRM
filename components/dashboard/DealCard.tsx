"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { updateDealStage } from "@/actions/deals";

const STAGES = [
    { value: "lead", label: "Lead" },
    { value: "contacted", label: "Contacted" },
    { value: "proposal", label: "Proposal" },
    { value: "won", label: "Won" },
    { value: "lost", label: "Lost" },
] as const;

type DealStage = (typeof STAGES)[number]["value"];

const STAGE_BORDER_COLOR: Record<DealStage, string> = {
    lead: "var(--color-text-secondary)",
    contacted: "var(--color-info)",
    proposal: "var(--color-accent-dark)",
    won: "var(--color-success)",
    lost: "var(--color-warning)",
};

type Props = {
    deal: {
        id: string;
        name: string;
        value: number;
        stage: DealStage;
        contacts: { name: string } | null;
    };
};

function formatValue(cents: number): string {
    const dollars = cents / 100;
    return dollars === 0
        ? "—"
        : new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(dollars);
}

export function DealCard({ deal }: Props) {
    const [state, formAction, isPending] = useActionState(updateDealStage, {
        success: false,
    });

    const [selectedStage, setSelectedStage] = useState<DealStage>(deal.stage);

    // Sync when server re-renders with confirmed new stage (after success + revalidate)
    useEffect(() => {
        setSelectedStage(deal.stage);
    }, [deal.stage]);

    // Reset to server stage if action failed
    useEffect(() => {
        if (!isPending && state.error) {
            setSelectedStage(deal.stage);
        }
    }, [isPending, state.error, deal.stage]);

    const borderColor = STAGE_BORDER_COLOR[deal.stage] ?? STAGE_BORDER_COLOR.lead;

    return (
        <div
            className="rounded-lg border border-border bg-surface p-4 shadow-sm border-l-4 flex flex-col gap-3"
            style={{ borderLeftColor: borderColor }}
        >
            <div className="flex items-start justify-between gap-2">
                <Link
                    href={`/deals/${deal.id}`}
                    className="text-sm font-medium text-text-primary hover:text-accent transition-colors leading-snug"
                >
                    {deal.name}
                </Link>
                <span className="text-base font-semibold text-text-primary whitespace-nowrap">
                    {formatValue(deal.value)}
                </span>
            </div>

            {deal.contacts?.name && (
                <p className="text-xs text-text-muted">{deal.contacts.name}</p>
            )}

            <form action={formAction}>
                <input type="hidden" name="dealId" value={deal.id} />
                <select
                    name="stage"
                    value={selectedStage}
                    onChange={(e) => {
                        setSelectedStage(e.target.value as DealStage);
                        const form = e.currentTarget.form;
                        if (form) form.requestSubmit();
                    }}
                    disabled={isPending}
                    className="w-full rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:opacity-50"
                >
                    {STAGES.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>
                {!state.success && state.error && (
                    <p className="mt-1 text-xs text-error">{state.error}</p>
                )}
            </form>
        </div>
    );
}
