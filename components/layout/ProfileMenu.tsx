"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

type Props = {
    userEmail: string;
    userName?: string;
};

function getInitial(userName: string | undefined, email: string): string {
    const source = userName?.trim() || email;
    return source.charAt(0).toUpperCase();
}

export function ProfileMenu({ userEmail, userName }: Props) {
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClick);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const handleLogout = async () => {
        setIsPending(true);
        setLogoutError(null);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("[ProfileMenu] logout error", error);
                setLogoutError("Sign out failed. Try again.");
                setIsPending(false);
                return;
            }
            router.replace("/");
            router.refresh();
        } catch (err) {
            console.error("[ProfileMenu] logout error", err);
            setLogoutError("Sign out failed. Try again.");
            setIsPending(false);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Avatar trigger */}
            <button
                id="profile-menu-trigger"
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-muted text-base font-bold text-accent transition hover:opacity-80"
            >
                {getInitial(userName, userEmail)}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    id="profile-menu-dropdown"
                    className="absolute right-0 top-10 z-50 w-56 rounded-xl border border-border bg-surface shadow-sm"
                >
                    {/* Email row — non-interactive */}
                    <div className="px-4 py-3">
                        <p className="truncate text-xs text-text-secondary">{userEmail}</p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Log out */}
                    <div className="p-1">
                        <button
                            id="profile-menu-logout"
                            type="button"
                            onClick={handleLogout}
                            disabled={isPending}
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-error transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isPending ? "Logging out…" : "Log out"}
                        </button>
                        {logoutError && (
                            <p className="px-3 pb-2 text-xs text-error">{logoutError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
