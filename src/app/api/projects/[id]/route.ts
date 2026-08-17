import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/db/queries";
import { withAuth } from "@/lib/auth/session";
import { parseProjectInput } from "@/lib/validation";
import { log, withRequestLog } from "@/lib/log";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withRequestLog(
  withAuth(async (req: NextRequest, { params }: Ctx, session) => {
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
  }),
);

export const DELETE = withRequestLog(
  withAuth(async (_req: NextRequest, { params }: Ctx, session) => {
    const { id } = await params;
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    log.info("project deleted", { id, actor: session.sub });
    return NextResponse.json({ ok: true });
  }),
);
