"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("[components/auth/LogoutButton]", error);
        setIsPending(false);
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (logoutError) {
      console.error("[components/auth/LogoutButton]", logoutError);
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-70"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? "Logging out..." : "Log out"}
    </button>
  );
}
