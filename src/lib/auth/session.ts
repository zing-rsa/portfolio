/**
 * Cookie-backed session helpers for Node route handlers and server components.
 * Wraps the pure JWT helpers in `./jwt` with the httpOnly session cookie.
 */
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  type SessionPayload,
} from "./jwt";

export async function createSession(email: string): Promise<void> {
  const token = await signSession(email);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Returns the session payload if a valid cookie is present, else null. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * Wraps a route handler so it only runs with a valid session, which is passed
 * in as the last argument; otherwise responds 401. Middleware already blocks
 * unauthenticated mutations at the edge — this is the defence-in-depth check at
 * the handler itself, expressed once rather than repeated per route.
 */
export function withAuth<C>(
  handler: (
    req: NextRequest,
    ctx: C,
    session: SessionPayload,
  ) => Promise<Response>,
): (req: NextRequest, ctx: C) => Promise<Response> {
  return async (req, ctx) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return handler(req, ctx, session);
  };
}
