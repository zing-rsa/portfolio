import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/db/queries";
import { getSession } from "@/lib/auth/session";
import { parseProjectInput } from "@/lib/validation";
import { log, withRequestLog } from "@/lib/log";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withRequestLog(async (req: NextRequest, { params }: Ctx) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = parseProjectInput(await req.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = await updateProject(id, parsed.value);
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  log.info("project updated", { id, actor: session.sub });
  return NextResponse.json(updated);
});

export const DELETE = withRequestLog(async (_req: NextRequest, { params }: Ctx) => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteProject(id);
  if (!deleted) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  log.info("project deleted", { id, actor: session.sub });
  return NextResponse.json({ ok: true });
});
