import { NextRequest, NextResponse } from "next/server";
import { getTimelinePage, PAGE_SIZE } from "@/lib/projects";
import { createProject } from "@/lib/db/queries";
import { withAuth } from "@/lib/auth/session";
import { parseProjectInput } from "@/lib/validation";
import { log, withRequestLog } from "@/lib/log";

export const runtime = "nodejs";

/** Public, paginated timeline feed. */
export const GET = withRequestLog(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0) || 0);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? PAGE_SIZE) || PAGE_SIZE),
  );

  const page = await getTimelinePage(offset, limit);
  return NextResponse.json(page);
});

/** Create a project (admin only). */
export const POST = withRequestLog(
  withAuth(async (req: NextRequest, _ctx, session) => {
    const parsed = parseProjectInput(await req.json().catch(() => null));
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const created = await createProject(parsed.value);
    log.info("project created", { id: created.id, actor: session.sub });
    return NextResponse.json(created, { status: 201 });
  }),
);
