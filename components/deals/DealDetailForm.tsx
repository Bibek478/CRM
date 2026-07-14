"use client";

import { useState, useActionState } from "react";
import { updateDeal } from "@/actions/deals";

const VALID_STAGES = ["lead", "contacted", "proposal", "won", "lost"] as const;
type DealStage = (typeof VALID_STAGES)[number];

const STAGE_LABELS: Record<DealStage, string> = {
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
  stage: string;
};

type Props = {
  deal: Deal;
};

type ActionState = Awaited<ReturnType<typeof updateDeal>>;

const initialState: ActionState = { success: false };

export function DealDetailForm({ deal }: Props) {
  const [name, setName] = useState(deal.name);
  const [value, setValue] = useState(String((deal.value / 100).toFixed(2)));
  const [stage, setStage] = useState<DealStage>(
    VALID_STAGES.includes(deal.stage as DealStage) ? (deal.stage as DealStage) : "lead",
  );

  const [state, formAction, pending] = useActionState(updateDeal, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="dealId" value={deal.id} />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">
          Deal name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          placeholder="e.g. Website redesign — Acme Co."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Value (USD)</label>
          <input
            type="number"
            name="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0"
            step="0.01"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
            placeholder="0.00"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">
            Stage <span className="text-error">*</span>
          </label>
          <select
            name="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value as DealStage)}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          >
            {VALID_STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.error ? <p className="text-xs text-error">{state.error}</p> : null}
      {state.success ? (
        <p className="text-xs text-success-foreground">Deal saved.</p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
