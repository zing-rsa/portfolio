import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  // Same response whether the user is missing or the password is wrong, so the
  // endpoint doesn't leak which emails are registered.
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!ok) {
    return NextResponse.json(
      { error: "invalid credentials" },
      { status: 401 },
    );
  }

  await createSession(user.email);
  return NextResponse.json({ ok: true });
}
