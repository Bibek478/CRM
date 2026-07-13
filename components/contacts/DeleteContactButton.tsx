"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteContact } from "@/actions/contacts";

type Props = {
  contactId: string;
  contactName: string;
};

type ActionState = Awaited<ReturnType<typeof deleteContact>>;

const initialState: ActionState = {
  success: false,
};

export function DeleteContactButton({ contactId, contactName }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deleteContact, initialState);

  useEffect(() => {
    if (state.success) {
      router.replace("/contacts");
    }
  }, [router, state.success]);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${contactName}? This also removes linked deals and notes.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="contactId" value={contactId} />

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-error px-4 py-2 text-sm font-medium text-error-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Deleting..." : "Delete contact"}
      </button>

      {state.error ? <p className="mt-2 text-xs text-error">{state.error}</p> : null}
    </form>
  );
}