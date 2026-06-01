import { NextResponse } from "next/server";

// Never cached — Kubernetes probes need a live answer.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Liveness/readiness probe. Returns 200 as long as the server can respond.
 * Kept deliberately dependency-free so a transient DB blip doesn't restart the
 * pod; gate readiness on the DB separately if that behaviour is ever wanted.
 */
export function GET() {
  return NextResponse.json({ status: "ok", uptime: process.uptime() });
}
