"use client";

import { useEffect, useRef, useActionState } from "react";
import { createNote } from "@/actions/notes";

type Props = {
  contactId?: string;
  dealId?: string;
  placeholder?: string;
};

type ActionState = Awaited<ReturnType<typeof createNote>>;

const initialState: ActionState = {
  success: false,
};

export function NoteInput({ contactId, dealId, placeholder }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, pending] = useActionState(createNote, initialState);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-sm">
      <input type="hidden" name="contactId" value={contactId ?? ""} />
      <input type="hidden" name="dealId" value={dealId ?? ""} />

      <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
        Add note<span className="text-error"> *</span>
        <textarea
          name="body"
          rows={4}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          placeholder={placeholder ?? "Write a note about this contact..."}
        />
      </label>

      {state.error ? <p className="text-xs text-error">{state.error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Add note"}
        </button>
      </div>
    </form>
  );
}