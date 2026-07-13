import { DealCard } from "@/components/dashboard/DealCard";

const STAGE_DOT_COLOR: Record<string, string> = {
    lead: "var(--color-text-secondary)",
    contacted: "var(--color-info)",
    proposal: "var(--color-accent-dark)",
    won: "var(--color-success)",
    lost: "var(--color-warning)",
};

const STAGE_LABEL: Record<string, string> = {
    lead: "Lead",
    contacted: "Contacted",
    proposal: "Proposal",
    won: "Won",
    lost: "Lost",
};

type Deal = {
    id: string;
    name: string;
    value: number;
    stage: "lead" | "contacted" | "proposal" | "won" | "lost";
    contacts: { name: string } | null;
};

type Props = {
    stage: "lead" | "contacted" | "proposal" | "won" | "lost";
    deals: Deal[];
};

export function PipelineColumn({ stage, deals }: Props) {
    const dotColor = STAGE_DOT_COLOR[stage] ?? "var(--color-text-muted)";
    const label = STAGE_LABEL[stage] ?? stage;

    return (
        <div className="flex min-w-[220px] flex-1 flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
                <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: dotColor }}
                />
                <span className="text-sm font-semibold text-text-primary">{label}</span>
                <span className="ml-auto rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium text-text-secondary">
                    {deals.length}
                </span>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface-muted p-2 min-h-[120px]">
                {deals.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-8">
                        <p className="text-xs text-text-muted">No deals in this stage</p>
                    </div>
                ) : (
                    deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                )}
            </div>
        </div>
    );
}
