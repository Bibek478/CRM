"use client";

import { useActionState, useEffect, useState } from "react";
import { PipelineColumn } from "@/components/dashboard/PipelineColumn";
import { createDeal } from "@/actions/deals";

const STAGES = ["lead", "contacted", "proposal", "won", "lost"] as const;
type DealStage = (typeof STAGES)[number];

type Deal = {
    id: string;
    name: string;
    value: number;
    stage: DealStage;
    contacts: { name: string } | null;
};

type Contact = {
    id: string;
    name: string;
};

type Props = {
    deals: Deal[];
    contacts: Contact[];
};

export function PipelineBoard({ deals, contacts }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const [state, formAction, isPending] = useActionState(createDeal, {
        success: false,
    });

    useEffect(() => {
        if (state.success) {
            setShowModal(false);
            setFormKey((k) => k + 1);
        }
    }, [state]);

    const dealsByStage = STAGES.reduce<Record<DealStage, Deal[]>>(
        (acc, stage) => {
            acc[stage] = deals.filter((d) => d.stage === stage);
            return acc;
        },
        { lead: [], contacted: [], proposal: [], won: [], lost: [] },
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-text-primary">Pipeline</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors"
                >
                    New Deal
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {STAGES.map((stage) => (
                    <PipelineColumn
                        key={stage}
                        stage={stage}
                        deals={dealsByStage[stage]}
                    />
                ))}
            </div>

            {showModal && (
                <div
                    className="absolute inset-0 z-20 flex items-start justify-center bg-overlay/40 px-6 py-10"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowModal(false);
                    }}
                >
                    <div
                        className="w-full max-w-lg rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-text-primary">
                                New Deal
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <form key={formKey} action={formAction} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="deal-name"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Deal name <span className="text-error">*</span>
                                </label>
                                <input
                                    id="deal-name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g. Website redesign — Acme Co."
                                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="deal-contact"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Contact <span className="text-error">*</span>
                                </label>
                                {contacts.length === 0 ? (
                                    <p className="text-sm text-text-muted">
                                        No contacts yet.{" "}
                                        <a href="/contacts" className="text-accent hover:underline">
                                            Add a contact first.
                                        </a>
                                    </p>
                                ) : (
                                    <select
                                        id="deal-contact"
                                        name="contactId"
                                        required
                                        className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                    >
                                        <option value="">Select a contact…</option>
                                        {contacts.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="deal-value"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Value (USD)
                                </label>
                                <input
                                    id="deal-value"
                                    name="value"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="deal-stage"
                                    className="text-sm font-medium text-text-primary"
                                >
                                    Starting stage
                                </label>
                                <select
                                    id="deal-stage"
                                    name="stage"
                                    defaultValue="lead"
                                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                                >
                                    <option value="lead">Lead</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="proposal">Proposal</option>
                                    <option value="won">Won</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>

                            {!state.success && state.error && (
                                <p className="text-sm text-error">{state.error}</p>
                            )}

                            <div className="flex gap-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending || contacts.length === 0}
                                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50"
                                >
                                    {isPending ? "Creating…" : "Create Deal"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
