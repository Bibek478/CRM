"use client";

import { useRouter } from "next/navigation";

type ContactRow = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  createdAt: string;
  openDealCount: number;
};

type Props = {
  contacts: ContactRow[];
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function ContactsTable({ contacts }: Props) {
  const router = useRouter();

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-sm text-text-secondary">No contacts yet. Add your first contact.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table — hidden below 640px */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface shadow-sm sm:block">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-surface">
              {[
                "Name",
                "Email",
                "Company",
                "Phone",
                "Open deals",
                "Date added",
              ].map((heading) => (
                <th
                  key={heading}
                  className="border-b border-border px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-text-secondary"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="cursor-pointer transition hover:bg-surface-secondary"
                role="link"
                tabIndex={0}
                onClick={() => router.push(`/contacts/${contact.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/contacts/${contact.id}`);
                  }
                }}
              >
                <td className="border-b border-border px-4 py-4 text-sm font-medium text-text-primary">
                  {contact.name}
                </td>
                <td className="border-b border-border px-4 py-4 text-sm text-text-primary">
                  {contact.email ?? "—"}
                </td>
                <td className="border-b border-border px-4 py-4 text-sm text-text-primary">
                  {contact.company ?? "—"}
                </td>
                <td className="border-b border-border px-4 py-4 text-sm text-text-primary">
                  {contact.phone ?? "—"}
                </td>
                <td className="border-b border-border px-4 py-4 text-sm text-text-primary">
                  {contact.openDealCount}
                </td>
                <td className="border-b border-border px-4 py-4 text-sm text-text-secondary">
                  {dateFormatter.format(new Date(contact.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards — visible below 640px only */}
      <div className="flex flex-col gap-3 sm:hidden">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            type="button"
            onClick={() => router.push(`/contacts/${contact.id}`)}
            className="w-full rounded-xl border border-border bg-surface p-4 text-left shadow-sm transition hover:bg-surface-secondary"
          >
            <p className="text-sm font-medium text-text-primary">{contact.name}</p>
            {contact.email && (
              <p className="mt-1 text-xs text-text-muted">
                <span className="text-text-secondary">Email: </span>
                {contact.email}
              </p>
            )}
            {contact.company && (
              <p className="mt-0.5 text-xs text-text-muted">
                <span className="text-text-secondary">Company: </span>
                {contact.company}
              </p>
            )}
            {contact.phone && (
              <p className="mt-0.5 text-xs text-text-muted">
                <span className="text-text-secondary">Phone: </span>
                {contact.phone}
              </p>
            )}
            <p className="mt-1 text-xs text-text-muted">
              <span className="text-text-secondary">Open deals: </span>
              {contact.openDealCount}
            </p>
          </button>
        ))}
      </div>
    </>
  );
}