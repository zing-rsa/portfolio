import { NextResponse } from "next/server";
import {
  getCounter,
  incrementCounter,
  LOVE_COUNTER_KEY,
} from "@/lib/db/queries";
import { withRequestLog } from "@/lib/log";

export const runtime = "nodejs";

/** Current "leave some love" tally. */
export const GET = withRequestLog(async () => {
  const count = await getCounter(LOVE_COUNTER_KEY);
  return NextResponse.json({ count });
});

/** Register one love click and return the new tally. */
export const POST = withRequestLog(async () => {
  const count = await incrementCounter(LOVE_COUNTER_KEY);
  return NextResponse.json({ count });
});
