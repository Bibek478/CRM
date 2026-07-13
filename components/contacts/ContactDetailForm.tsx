"use client";

import { useActionState } from "react";
import { updateContact } from "@/actions/contacts";

type Contact = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
};

type Props = {
  contact: Contact;
};

type ActionState = Awaited<ReturnType<typeof updateContact>>;

const initialState: ActionState = {
  success: false,
};

export function ContactDetailForm({ contact }: Props) {
  const [state, formAction, pending] = useActionState(updateContact, initialState);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <input type="hidden" name="contactId" value={contact.id} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
          Name<span className="text-error"> *</span>
          <input
            name="name"
            type="text"
            defaultValue={contact.name}
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
          Email
          <input
            name="email"
            type="email"
            defaultValue={contact.email ?? ""}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
          Company
          <input
            name="company"
            type="text"
            defaultValue={contact.company ?? ""}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
          Phone
          <input
            name="phone"
            type="tel"
            defaultValue={contact.phone ?? ""}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </label>
      </div>

      {state.error ? <p className="text-xs text-error">{state.error}</p> : null}
      {state.success ? <p className="text-xs text-success">Contact saved.</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save contact"}
        </button>
      </div>
    </form>
  );
}