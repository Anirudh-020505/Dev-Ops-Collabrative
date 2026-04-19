import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { LogRow, LogEntry, LogSeverity } from "@/components/LogRow";
import { BlockLoader } from "@/components/Skeletons";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useMemo, useState, useCallback } from "react";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/logs")({
  head: () => ({
    meta: [
      { title: "System Logs — DevOps Collaborator" },
      { name: "description", content: "Endless system telemetry log stream." },
    ],
  }),
  component: LogsPage,
});

const SERVICES = [
  "auth-svc",
  "payment-gateway",
  "edge-router",
  "metrics-ingest",
  "cdn-egress-eu",
  "scheduler",
  "vault",
  "notifier",
];

const MESSAGES: Record<LogSeverity, string[]> = {
  INFO: [
    "request handled · 200 OK",
    "auto-scaling triggered · +2 replicas",
    "cache warmed · 12.4MB",
    "deploy succeeded · build 2.1.04-prod",
    "node joined cluster",
  ],
  WARN: [
    "p99 latency exceeded threshold · 412ms",
    "memory pressure · 84% utilized",
    "rate limit nearing · 92% of quota",
    "retry attempted · backoff 1.2s",
  ],
  ERROR: [
    "connection refused · upstream timeout",
    "5xx burst detected · 14 errors in 30s",
    "schema migration failed · rolled back",
    "circuit breaker open · disabling route",
  ],
  DEBUG: [
    "trace span emitted · 0x9F32A1",
    "config reload · sha 4e7c…",
    "heartbeat · 14ms",
    "gc pause · 3.2ms",
  ],
};

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length] as T;
}

function pad(n: number, w = 2) {
  return n.toString().padStart(w, "0");
}

function makeBatch(cursor: number, severityFilter: Set<LogSeverity>): LogEntry[] {
  const out: LogEntry[] = [];
  const now = Date.now() - cursor * 1200;
  const sevs: LogSeverity[] = ["INFO", "INFO", "INFO", "DEBUG", "WARN", "ERROR"];
  for (let i = 0; i < 30; i++) {
    const t = new Date(now - i * 1200);
    const sev = pick(sevs, cursor + i * 7);
    if (severityFilter.size > 0 && !severityFilter.has(sev)) continue;
    out.push({
      id: `${cursor}-${i}`,
      ts: `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}.${pad(t.getMilliseconds(), 3)}`,
      date: `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`,
      severity: sev,
      service: pick(SERVICES, cursor + i),
      message: pick(MESSAGES[sev], cursor + i * 3),
      code: `0x${(0xa000 + ((cursor + i) * 137) % 0x5fff).toString(16).toUpperCase()}`,
    });
  }
  return out;
}

const ALL_SEV: LogSeverity[] = ["INFO", "WARN", "ERROR", "DEBUG"];

function LogsPage() {
  const [filters, setFilters] = useState<Set<LogSeverity>>(new Set());

  // Stable fetch function — recreate when filters change
  const fetchMore = useCallback(
    (cursor: number) => makeBatch(cursor, filters),
    [filters],
  );

  const { items, loading, done, sentinelRef } = useInfiniteScroll<LogEntry>(fetchMore, {
    max: 480,
  });

  const counts = useMemo(() => {
    const c: Record<LogSeverity, number> = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0 };
    items.forEach((it) => (c[it.severity] += 1));
    return c;
  }, [items]);

  const toggle = (s: LogSeverity) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            // endless system log · live stream
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            System Logs
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            // filter
          </span>
          {ALL_SEV.map((s) => {
            const on = filters.has(s);
            return (
              <button
                key={s}
                onClick={() => toggle(s)}
                className={`flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-all ${
                  on
                    ? "border-plasma bg-plasma/15 text-plasma"
                    : "border-border bg-panel text-muted-foreground hover:border-plasma/40 hover:text-plasma"
                }`}
              >
                {on && <CheckCircle2 className="h-3 w-3" strokeWidth={3} />}
                {s}
                <span className="text-muted-foreground/70">· {counts[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel panel-notched scan-line overflow-hidden">
        <div className="grid grid-cols-[auto_64px_140px_1fr_auto] gap-4 border-b border-border bg-panel-elevated px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>DATE</span>
          <span>TIME</span>
          <span>SEV</span>
          <span>EVENT</span>
          <span>TRACE</span>
        </div>

        <ul className="max-h-[calc(100vh-260px)] overflow-y-auto">
          {items.map((entry) => (
            <LogRow key={entry.id} entry={entry} />
          ))}

          <li className="border-t border-border/40">
            <div ref={sentinelRef} />
            {loading && <BlockLoader />}
            {done && !loading && (
              <div className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                // end of telemetry buffer · {items.length} events
              </div>
            )}
          </li>
        </ul>
      </div>
    </AppShell>
  );
}
