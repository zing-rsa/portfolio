import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/jwt";

/**
 * Edge middleware guarding the backoffice. Verifies the signed session cookie
 * (jose is edge-safe) and:
 *  - redirects unauthenticated visitors away from /admin/* to the login page,
 *  - bounces already-authenticated users off the login page,
 *  - rejects unauthenticated mutating calls to /api/projects with 401.
 * Read-only GETs to /api/projects stay public.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authed = (await verifySession(token)) !== null;

  const isLogin = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLogin && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/api/projects") && req.method !== "GET" && !authed) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/projects/:path*"],
};
