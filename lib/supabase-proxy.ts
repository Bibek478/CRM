import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export type ProxyCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

type SetProxyCookies = (cookiesToSet: ProxyCookie[]) => void;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase proxy environment variables.");
}

export const createSupabaseProxyClient = (
  request: NextRequest,
  setProxyCookies: SetProxyCookies,
): SupabaseClient => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: ProxyCookie[]) => {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        setProxyCookies(cookiesToSet);
      },
    },
  });
};
