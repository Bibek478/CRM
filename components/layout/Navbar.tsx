"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "@/components/layout/ProfileMenu";

type Props = {
  userEmail?: string;
  userName?: string;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contacts", href: "/contacts" },
  { label: "Billing", href: "/billing" },
];

export function Navbar({ userEmail, userName }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close hamburger on route change (handles browser Back navigation)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Left: logo + desktop nav */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-bold text-text-primary">
            RB CRM
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition ${isActive
                      ? "text-accent"
                      : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: hamburger (mobile) + profile avatar */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            id="navbar-hamburger"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-md text-text-secondary transition hover:text-text-primary md:hidden"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${menuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
            />
          </button>

          {/* Profile avatar + name — always visible */}
          {userEmail && (
            <div className="flex items-center gap-2">
              <span className="hidden min-[480px]:block max-w-[120px] truncate text-sm font-medium text-text-secondary">
                {userName ?? userEmail.split("@")[0]}
              </span>
              <ProfileMenu userEmail={userEmail} userName={userName} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div id="navbar-mobile-menu" className="border-t border-border bg-surface md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition ${isActive
                    ? "text-accent"
                    : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
