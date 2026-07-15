import { trace } from "@opentelemetry/api";
import type { NextRequest } from "next/server";

// Structured JSON logger. One object per line to stdout (stderr for warn/error), enriched with
// the active span's trace context so Alloy can lift trace_id/span_id into the OTel LogRecord and
// Grafana correlates logs with Tempo traces. Field names (trace_id, span_id, trace_flags, level)
// match the stanza parsers configured in Alloy — keep them in sync.

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const RANK: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = RANK[(process.env.LOG_LEVEL as Level) in RANK
  ? (process.env.LOG_LEVEL as Level)
  : "info"];

function emit(level: Level, msg: string, fields?: Fields): void {
  if (RANK[level] < threshold) return;

  const ctx = trace.getActiveSpan()?.spanContext();
  const line: Record<string, unknown> = {
    time: new Date().toISOString(),
    level,
    msg,
    ...(ctx && {
      trace_id: ctx.traceId,
      span_id: ctx.spanId,
      trace_flags: ctx.traceFlags.toString(16).padStart(2, "0"),
    }),
    ...fields,
  };

  const sink = level === "warn" || level === "error" ? console.error : console.log;
  sink(JSON.stringify(line));
}

export const log = {
  debug: (msg: string, fields?: Fields) => emit("debug", msg, fields),
  info: (msg: string, fields?: Fields) => emit("info", msg, fields),
  warn: (msg: string, fields?: Fields) => emit("warn", msg, fields),
  error: (msg: string, fields?: Fields) => emit("error", msg, fields),
};

type RouteHandler<A extends unknown[]> = (
  req: NextRequest,
  ...args: A
) => Promise<Response>;

/** Wraps a route handler to emit one info line per completed request. Thrown errors propagate
 *  to instrumentation's onRequestError, so they aren't logged twice here. */
export function withRequestLog<A extends unknown[]>(
  handler: RouteHandler<A>,
): RouteHandler<A> {
  return async (req, ...args) => {
    const start = performance.now();
    const res = await handler(req, ...args);
    log.info("request", {
      method: req.method,
      path: req.nextUrl.pathname,
      status: res.status,
      duration_ms: Math.round(performance.now() - start),
    });
    return res;
  };
}
