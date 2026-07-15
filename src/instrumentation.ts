import { registerOTel } from "@vercel/otel";
import type { Instrumentation } from "next";
import { log } from "@/lib/log";

// Exports traces (OTLP/HTTP) to the in-cluster Alloy collector, which forwards them to
// Tempo. Metrics and logs are intentionally not emitted here: pod stdout is tailed to
// Loki by Alloy, and Prometheus scrapes infra metrics. Registers only when an OTLP
// endpoint is set, so local dev is a no-op.
export function register() {
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;

  registerOTel({
    serviceName: process.env.OTEL_SERVICE_NAME ?? "portfolio",
  });
}

// Catch-all for uncaught server errors (route handlers, RSC, SSR). Logs once with request
// context; the active span is still current here, so the line carries the failing trace_id.
export const onRequestError: Instrumentation.onRequestError = (err, request) => {
  log.error("unhandled request error", {
    method: request.method,
    path: request.path,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
};
