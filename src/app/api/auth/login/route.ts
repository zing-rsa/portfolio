import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { log, withRequestLog } from "@/lib/log";

export const runtime = "nodejs";

export const POST = withRequestLog(async (req: NextRequest) => {
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

  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!ok) {
    // Never log the password; reason distinguishes enumeration from bad password.
    log.warn("login failed", { email, reason: user ? "bad_password" : "unknown_user" });
    return NextResponse.json(
      { error: "invalid credentials" },
      { status: 401 },
    );
  }

  await createSession(user.email);
  log.info("login succeeded", { email: user.email });
  return NextResponse.json({ ok: true });
});
