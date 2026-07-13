import Link from "next/link";

export function ContactLimitBanner() {
  return (
    <div className="rounded-lg border border-border bg-warning-light p-4 text-sm text-warning-foreground">
      Free plan limit reached. Upgrade to Pro to add more contacts.
      <Link
        href="/billing"
        className="ml-3 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition hover:bg-accent-dark"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}