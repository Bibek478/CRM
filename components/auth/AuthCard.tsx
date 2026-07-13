import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
};

export function AuthCard({ title, description, footer, children }: Props) {
  return (
    <section className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-medium text-accent-dark">
            RB CRM
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-text-primary">
              {title}
            </h1>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
        </div>

        {children}

        <div className="border-t border-border pt-4 text-sm text-text-secondary">
          {footer}
        </div>
      </div>
    </section>
  );
}
