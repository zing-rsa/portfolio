import { NextResponse, type NextRequest } from "next/server";
import { getSession, destroySession } from "@/lib/auth/session";
import { log, withRequestLog } from "@/lib/log";

export const runtime = "nodejs";

export const POST = withRequestLog(async (_req: NextRequest) => {
  const session = await getSession();
  await destroySession();
  log.info("logout", { email: session?.sub });
  return NextResponse.json({ ok: true });
});
