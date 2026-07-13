import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createSupabaseProxyClient,
  type ProxyCookie,
} from "@/lib/supabase-proxy";

const applyProxyCookies = (
  response: NextResponse,
  cookiesToSet: ProxyCookie[],
) => {
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
};

export async function proxy(request: NextRequest) {
  let cookiesToSet: ProxyCookie[] = [];

  const supabase = createSupabaseProxyClient(request, (nextCookies) => {
    cookiesToSet = nextCookies;
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    return applyProxyCookies(response, cookiesToSet);
  }

  return applyProxyCookies(NextResponse.next(), cookiesToSet);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/deals/:path*",
    "/billing/:path*",
  ],
};
