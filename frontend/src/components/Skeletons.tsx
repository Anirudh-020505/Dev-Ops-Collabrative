import { Activity, Server, AlertTriangle } from "lucide-react";

function Block({
  className = "",
  width = "100%",
  height = "12px",
}: {
  className?: string;
  width?: string;
  height?: string;
}) {
  return (
    <span
      className={`skeleton-block inline-block ${className}`}
      style={{ width, height }}
      aria-hidden
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Block width="180px" height="10px" />
          <Block width="320px" height="22px" />
        </div>
        <Block width="160px" height="36px" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { Icon: Server, label: "TOTAL SERVICES" },
          { Icon: AlertTriangle, label: "ACTIVE INCIDENTS" },
          { Icon: Activity, label: "GLOBAL LATENCY" },
        ].map(({ Icon, label }) => (
          <div key={label} className="panel panel-notched scan-line p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                // {label.toLowerCase()}
              </span>
              <Icon className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="mt-4 space-y-3">
              <Block width="120px" height="34px" />
              <div className="flex gap-1.5">
                <Block width="40%" height="6px" />
                <Block width="25%" height="6px" />
                <Block width="20%" height="6px" />
              </div>
              <Block width="60%" height="10px" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart with radar shimmer */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="panel panel-notched p-5">
          <div className="mb-4 flex items-center justify-between">
            <Block width="160px" height="14px" />
            <Block width="80px" height="10px" />
          </div>
          <div className="relative h-64 overflow-hidden bg-tech-grid border border-border">
            <div className="shimmer-radar absolute inset-0" />
          </div>
        </div>

        <div className="panel panel-notched p-5">
          <div className="mb-4 flex items-center justify-between">
            <Block width="120px" height="14px" />
            <Block width="60px" height="10px" />
          </div>
          <ul className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 border-l-2 border-border pl-3">
                <Block width="56px" height="10px" />
                <Block width={`${50 + ((i * 13) % 35)}%`} height="10px" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Service grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel panel-notched p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Block width="60%" height="14px" />
              <Block width="48px" height="18px" />
            </div>
            <div className="relative h-16 overflow-hidden border border-border bg-panel-elevated">
              <div className="shimmer-radar absolute inset-0" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Block height="28px" />
              <Block height="28px" />
              <Block height="28px" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  // Varied widths to mimic real text lengths
  const widths = ["68%", "84%", "44%", "92%", "56%", "76%"];
  return (
    <div className="panel panel-notched overflow-hidden" role="status" aria-label="Loading table">
      <div
        className="grid items-center gap-4 border-b border-border bg-panel-elevated px-5 py-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Block key={i} width="60%" height="9px" />
        ))}
      </div>
      <ul>
        {Array.from({ length: rows }).map((_, r) => (
          <li
            key={r}
            className="grid items-center gap-4 border-b border-border/60 px-5 py-4 last:border-b-0"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <Block key={c} width={widths[(r + c) % widths.length]} height="11px" />
            ))}
          </li>
        ))}
      </ul>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Mechanical "fetching" indicator: 3 squares lighting sequentially */
export function BlockLoader({ label = "FETCHING HISTORICAL TELEMETRY..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8" role="status" aria-live="polite">
      <div className="flex items-center gap-1.5">
        <span className="block-loader-square" style={{ animationDelay: "0ms" }} />
        <span className="block-loader-square" style={{ animationDelay: "180ms" }} />
        <span className="block-loader-square" style={{ animationDelay: "360ms" }} />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
