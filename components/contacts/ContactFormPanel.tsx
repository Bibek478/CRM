"use client";

import { useMemo, useState, useActionState } from "react";
import { createContact } from "@/actions/contacts";

type ActionState = Awaited<ReturnType<typeof createContact>>;

type Props = {
  disabled: boolean;
};

const initialState: ActionState = {
  success: false,
};

export function ContactFormPanel({ disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createContact, initialState);

  const submitLabel = useMemo(() => {
    if (pending) {
      return "Saving...";
    }

    return "Save contact";
  }, [pending]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-text-primary">Add Contact</h2>
          <p className="text-sm text-text-secondary">
            Add name now. Email, company, and phone optional.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          Add Contact
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay/40 sm:items-start sm:px-6 sm:py-10">
          <div className="w-full max-w-2xl rounded-t-xl border border-border bg-surface p-6 shadow-sm sm:rounded-xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-text-primary">New contact</h3>
                <p className="text-sm text-text-secondary">
                  Add name now. Email, company, and phone optional.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
              >
                Close
              </button>
            </div>

            <form className="mt-6 flex flex-col gap-4" action={formAction}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
                  Name<span className="text-error"> *</span>
                  <input
                    name="name"
                    type="text"
                    required
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="Acme Co."
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
                  Email
                  <input
                    name="email"
                    type="email"
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="contact@acme.com"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
                  Company
                  <input
                    name="company"
                    type="text"
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="Acme"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-text-primary">
                  Phone
                  <input
                    name="phone"
                    type="tel"
                    className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="(555) 123-4567"
                  />
                </label>
              </div>

              {state.success ? (
                <p className="text-xs text-success">Contact saved.</p>
              ) : null}

              {state.error ? <p className="text-xs text-error">{state.error}</p> : null}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}