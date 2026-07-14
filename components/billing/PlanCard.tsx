"use client";

import { useState } from "react";

type Props = {
    plan: string;
    subscriptionStatus: string;
    currentPeriodEnd: string | null;
    contactCount: number;
};

export function PlanCard({
    plan,
    subscriptionStatus,
    currentPeriodEnd,
    contactCount,
}: Props) {
    const [upgradeLoading, setUpgradeLoading] = useState(false);
    const [manageLoading, setManageLoading] = useState(false);
    const [error, setError] = useState("");

    const isPro = plan === "pro";
    const isCanceling = subscriptionStatus === "canceling";

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
        if (isPro && isCanceling && currentPeriodEnd) {
            return `Cancels on ${formatDate(currentPeriodEnd)}`;
        }
        if (isPro) return "Pro";
        return "Starter (Free)";
    }

    async function handleUpgrade() {
        setUpgradeLoading(true);
        setError("");
        try {
            const res = await fetch("/api/stripe/checkout", { method: "POST" });
            const data: { success: boolean; url?: string; error?: string } =
                await res.json();
            if (!data.success || !data.url) {
                setError(data.error ?? "Something went wrong. Please try again.");
                setUpgradeLoading(false);
                return;
            }
            window.location.href = data.url;
        } catch {
            setError("Network error. Please try again.");
            setUpgradeLoading(false);
        }
    }

    async function handleManage() {
        setManageLoading(true);
        setError("");
        try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            const data: { success: boolean; url?: string; error?: string } =
                await res.json();
            if (!data.success || !data.url) {
                setError(data.error ?? "Something went wrong. Please try again.");
                setManageLoading(false);
                return;
            }
            window.location.href = data.url;
        } catch {
            setError("Network error. Please try again.");
            setManageLoading(false);
        }
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

            {/* Free plan: contact usage meter */}
            {!isPro && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span>Contact usage</span>
                        <span className="font-medium text-text-primary">
                            {contactCount} of 10 used
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-secondary overflow-hidden">
                        <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${Math.min((contactCount / 10) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            )}

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
                        disabled={upgradeLoading}
                        className="w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark disabled:opacity-60"
                    >
                        {upgradeLoading ? "Redirecting…" : "Upgrade to Pro"}
                    </button>
                    {error && <p className="text-xs text-error">{error}</p>}
                </div>
            )}

            {/* Pro: manage subscription */}
            {isPro && (
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleManage}
                        disabled={manageLoading}
                        className="w-fit rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-60"
                    >
                        {manageLoading ? "Redirecting…" : "Manage Subscription"}
                    </button>
                    {error && <p className="text-xs text-error">{error}</p>}
                </div>
            )}
        </div>
    );
}
