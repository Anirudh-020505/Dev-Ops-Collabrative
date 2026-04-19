import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { ServiceCard, SAMPLE_SERVICES } from "@/components/ServiceCard";
import { Bar, Gauge, Sparkline } from "@/components/TechCharts";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Activity,
  Flame,
  Server,
  Gauge as GaugeIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  GitBranch,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — DevOps Collaborator" },
      { name: "description", content: "Real-time DevOps service health, incidents, and alerting overview." },
      { property: "og:title", content: "Dashboard — DevOps Collaborator" },
      { property: "og:description", content: "Real-time DevOps service health, incidents, and alerting overview." },
    ],
  }),
  component: DashboardPage,
});

const activities = [
  { time: "14:42:08", type: "DOWN", text: "Service Payment Processor went DOWN", actor: "monitor", urgent: true },
  { time: "14:38:21", type: "INC", text: "User Alice opened Incident #123 — `payment 5xx spike`", actor: "alice@dev" },
  { time: "14:35:02", type: "DEG", text: "Search Cluster degraded — latency 312ms (p95)", actor: "monitor" },
  { time: "14:31:55", type: "DEPLOY", text: "Auth Service v2.4.1 deployed to prod-eu", actor: "ci/cd" },
  { time: "14:29:14", type: "MSG", text: "New comment on Incident #100 — “rolling back deploy”", actor: "marcus@ops" },
  { time: "14:25:37", type: "OK", text: "Notification Hub recovered — back to UP", actor: "monitor" },
  { time: "14:21:02", type: "ACK", text: "Incident #119 acknowledged by oncall-rotation", actor: "auto" },
  { time: "14:18:48", type: "DEPLOY", text: "API Gateway v3.0.7 deployed to prod-eu", actor: "ci/cd" },
];

const typeStyles: Record<string, string> = {
  DOWN: "text-destructive border-destructive/50",
  INC: "text-warning border-warning/50",
  DEG: "text-warning border-warning/50",
  DEPLOY: "text-plasma border-plasma/50",
  MSG: "text-muted-foreground border-border",
  OK: "text-success border-success/50",
  ACK: "text-secondary border-secondary/40",
};

function DashboardPage() {
  const upCount = SAMPLE_SERVICES.filter((s) => s.status === "UP").length;
  const downCount = SAMPLE_SERVICES.filter((s) => s.status === "DOWN").length;
  const degCount = SAMPLE_SERVICES.filter((s) => s.status === "DEGRADED").length;
  const total = SAMPLE_SERVICES.length;

  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            // overview · live telemetry
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Mission Control{" "}
            <span className="text-muted-foreground">— EU·WEST·3</span>
          </h2>
        </div>
        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:flex">
          <span>UTC 14:42:08</span>
          <span className="h-3 w-px bg-border" />
          <span className="text-success">SYNC OK</span>
          <span className="h-3 w-px bg-border" />
          <span>POLL · 5s</span>
        </div>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Total Services" subtitle="// inventory" scan>
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-5xl font-semibold tabular-nums tracking-tight">
                {total.toString().padStart(2, "0")}
              </div>
              <div className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-success">
                <ArrowUpRight className="h-3 w-3" />
                +2 vs last week
              </div>
            </div>
            <Server className="h-10 w-10 text-plasma/40" strokeWidth={1.2} />
          </div>
          <div className="mt-5 space-y-2.5">
            <Row label="UP" count={upCount} total={total} color="var(--success)" />
            <Row label="DEGRADED" count={degCount} total={total} color="var(--warning)" />
            <Row label="DOWN" count={downCount} total={total} color="var(--destructive)" />
          </div>
        </Panel>

        <Panel title="Active Incidents" subtitle="// response queue">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <div className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-warning">
                  04
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-destructive">
                  · 1 critical
                </span>
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                avg ttr · 24m 12s
              </div>
            </div>
            <div className="relative">
              <Flame className="h-10 w-10 text-warning/60" strokeWidth={1.4} />
              <span className="absolute inset-0 rounded-full bg-warning/20 blur-xl" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label: "P1", v: 1, color: "var(--destructive)" },
              { label: "P2", v: 1, color: "var(--warning)" },
              { label: "P3", v: 2, color: "var(--plasma)" },
            ].map((p) => (
              <div key={p.label} className="border border-border bg-panel-elevated px-3 py-2">
                <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  {p.label}
                </div>
                <div
                  className="font-mono text-lg font-semibold tabular-nums"
                  style={{ color: p.color }}
                >
                  {p.v.toString().padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Global Latency" subtitle="// p95 · all services">
          <div className="flex items-center gap-6">
            <Gauge value={142} max={500} unit="ms" label="P95" color="var(--plasma)" size={120} />
            <div className="flex-1 space-y-3">
              <Stat icon={Activity} label="P50" value="64ms" color="text-success" />
              <Stat icon={GaugeIcon} label="P99" value="487ms" color="text-warning" />
              <Stat icon={ArrowDownRight} label="DELTA" value="-12ms" color="text-success" />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 label-tech">// 24h timeline</div>
            <Sparkline
              data={[120, 132, 128, 140, 138, 135, 142, 150, 148, 142, 138, 142]}
              color="var(--plasma)"
              width={420}
              height={42}
            />
          </div>
        </Panel>
      </div>

      {/* Service Health Overview */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <div className="label-tech">// service registry</div>
              <h3 className="font-display text-lg font-semibold tracking-wide">
                SERVICE HEALTH OVERVIEW
              </h3>
            </div>
            <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:flex">
              <StatusBadge status="UP">{upCount} up</StatusBadge>
              <StatusBadge status="DEGRADED">{degCount} deg</StatusBadge>
              <StatusBadge status="DOWN" pulse>{downCount} down</StatusBadge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SAMPLE_SERVICES.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <Panel title="Event Log" subtitle="// recent activity" scan>
          <ul className="space-y-3">
            {activities.map((a, i) => (
              <li
                key={i}
                className="group flex gap-3 border-l-2 border-border pl-3 hover:border-plasma transition-colors"
              >
                <span className="mt-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                  {a.time}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`border px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-wider ${typeStyles[a.type]}`}
                    >
                      {a.type}
                    </span>
                    {a.urgent && (
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive pulse-dot text-destructive" />
                    )}
                  </div>
                  <p className="text-xs leading-snug text-foreground/90">{a.text}</p>
                  <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{a.actor}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
            <button className="flex items-center justify-center gap-1.5 border border-border bg-panel-elevated px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-plasma/60 hover:text-plasma transition-colors">
              <GitBranch className="h-3 w-3" /> Deploys
            </button>
            <button className="flex items-center justify-center gap-1.5 border border-border bg-panel-elevated px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-plasma/60 hover:text-plasma transition-colors">
              <MessageSquare className="h-3 w-3" /> Comments
            </button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function Row({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums" style={{ color }}>
          {count.toString().padStart(2, "0")} / {total.toString().padStart(2, "0")}
        </span>
      </div>
      <Bar value={count} max={total} color={color} />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <span className={`font-mono text-sm font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
