"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteDeal } from "@/actions/deals";

type Props = {
    dealId: string;
    dealName: string;
};

type ActionState = Awaited<ReturnType<typeof deleteDeal>>;

const initialState: ActionState = { success: false };

export function DeleteDealButton({ dealId, dealName }: Props) {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(deleteDeal, initialState);

    useEffect(() => {
        if (state.success) {
            router.replace("/dashboard");
        }
    }, [router, state.success]);

    return (
        <form
            action={formAction}
            onSubmit={(event) => {
                if (!window.confirm(`Delete "${dealName}"? This also removes all notes linked to this deal.`)) {
                    event.preventDefault();
                }
            }}
        >
            <input type="hidden" name="dealId" value={dealId} />

            <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-error px-4 py-2 text-sm font-medium text-error-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {pending ? "Deleting..." : "Delete deal"}
            </button>

            {state.error ? <p className="mt-2 text-xs text-error">{state.error}</p> : null}
        </form>
    );
}
