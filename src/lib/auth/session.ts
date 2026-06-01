/**
 * Cookie-backed session helpers for Node route handlers and server components.
 * Wraps the pure JWT helpers in `./jwt` with the httpOnly session cookie.
 */
import { cookies } from "next/headers";
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

/** Convenience boolean guard for route handlers. */
export async function requireAuth(): Promise<boolean> {
  return (await getSession()) !== null;
}
