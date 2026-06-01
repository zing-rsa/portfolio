import { NextRequest, NextResponse } from "next/server";
import { getTimelinePage, PAGE_SIZE } from "@/lib/projects";
import { createProject } from "@/lib/db/queries";
import { requireAuth } from "@/lib/auth/session";
import { parseProjectInput } from "@/lib/validation";

export const runtime = "nodejs";

/** Public, paginated timeline feed. */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0) || 0);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? PAGE_SIZE) || PAGE_SIZE),
  );

  const page = await getTimelinePage(offset, limit);
  return NextResponse.json(page);
}

/** Create a project (admin only). */
export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = parseProjectInput(await req.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const created = await createProject(parsed.value);
  return NextResponse.json(created, { status: 201 });
}
