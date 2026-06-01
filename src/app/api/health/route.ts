import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Liveness/readiness probe. Returns 200 while the server can respond. */
export function GET() {
  return NextResponse.json({ status: "ok", uptime: process.uptime() });
}
