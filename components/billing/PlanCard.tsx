"use client";

import { useState } from "react";

type Props = {
    plan: string;
    subscriptionStatus: string;
    currentPeriodEnd: string | null;
};

export function PlanCard({ plan, subscriptionStatus, currentPeriodEnd }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isPro = plan === "pro";
    const isCanceling = subscriptionStatus === "canceling";

    async function handleUpgrade() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/stripe/checkout", { method: "POST" });
            const data: { success: boolean; url?: string; error?: string } =
                await res.json();
            if (!data.success || !data.url) {
                setError(data.error ?? "Something went wrong. Please try again.");
                setLoading(false);
                return;
            }
            // No setLoading(false) here — browser navigates away immediately.
            // Resetting state would flicker the button text before unload.
            window.location.href = data.url;
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    }

    function formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function statusBadgeClasses(): string {
        if (isPro && isCanceling) {
            return "bg-warning-light text-warning-foreground";
        }
        if (isPro) {
            return "bg-success-light text-success-foreground";
        }
        return "bg-surface-secondary text-text-secondary";
    }

    function statusLabel(): string {
        if (isPro && isCanceling) return "Pro — Canceling";
        if (isPro) return "Pro";
        return "Starter (Free)";
    }

    return (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm flex flex-col gap-6">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-base font-semibold text-text-primary">
                        Current Plan
                    </h2>
                    <p className="text-xs text-text-muted">
                        {isPro
                            ? "You have access to unlimited contacts and all Pro features."
                            : "You are on the free plan — up to 10 contacts."}
                    </p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClasses()}`}
                >
                    {statusLabel()}
                </span>
            </div>

            {/* Period end notice when canceling */}
            {isPro && isCanceling && currentPeriodEnd && (
                <p className="text-sm text-warning-foreground">
                    Your Pro access continues until{" "}
                    <span className="font-medium">{formatDate(currentPeriodEnd)}</span>.
                    After that, your account will revert to the free plan.
                </p>
            )}

            {/* CTA */}
            {!isPro && (
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark disabled:opacity-60"
                    >
                        {loading ? "Redirecting…" : "Upgrade to Pro"}
                    </button>
                    {error && <p className="text-xs text-error">{error}</p>}
                </div>
            )}

            {/* Pro feature list */}
            {isPro && !isCanceling && (
                <p className="text-sm text-text-secondary">
                    To cancel or manage your subscription, use the Stripe billing portal
                    (available in the next release).
                </p>
            )}
        </div>
    );
}
