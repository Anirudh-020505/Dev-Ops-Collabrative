import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { useState } from "react";
import {
  AlertOctagon,
  Flame,
  Search,
  Send,
  UserCircle2,
  GitCommit,
  Zap,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incidents — DevOps Collaborator" },
      { name: "description", content: "Track, triage, and resolve incidents with your team in real time." },
      { property: "og:title", content: "Incident Response Center" },
      { property: "og:description", content: "Track, triage, and resolve incidents with your team in real time." },
    ],
  }),
  component: IncidentsPage,
});

type Urgency = "P1" | "P2" | "P3";
type IncStatus = "OPEN" | "INVESTIGATING" | "RESOLVED";

const urgencyMap: Record<Urgency, { color: string; border: string; bg: string }> = {
  P1: { color: "text-destructive", border: "border-destructive/60", bg: "bg-destructive/10" },
  P2: { color: "text-warning", border: "border-warning/60", bg: "bg-warning/10" },
  P3: { color: "text-plasma", border: "border-plasma/60", bg: "bg-plasma/10" },
};

const statusMap: Record<IncStatus, string> = {
  OPEN: "text-destructive border-destructive/60",
  INVESTIGATING: "text-warning border-warning/60",
  RESOLVED: "text-success border-success/60",
};

const incidents = [
  {
    id: "INC-0123",
    title: "Payment gateway returning 5xx — Stripe webhook timeouts",
    urgency: "P1" as Urgency,
    service: "Payment Processor",
    status: "OPEN" as IncStatus,
    assignee: "A. Kovac",
    opened: "14:38:21",
    duration: "00:04:12",
  },
  {
    id: "INC-0122",
    title: "Search cluster latency degraded above 300ms p95",
    urgency: "P2" as Urgency,
    service: "Search Cluster",
    status: "INVESTIGATING" as IncStatus,
    assignee: "M. Reyes",
    opened: "14:35:02",
    duration: "00:07:44",
  },
  {
    id: "INC-0121",
    title: "Auth tokens expiring earlier than configured TTL",
    urgency: "P3" as Urgency,
    service: "Auth Service",
    status: "INVESTIGATING" as IncStatus,
    assignee: "S. Chen",
    opened: "13:52:14",
    duration: "00:50:30",
  },
  {
    id: "INC-0120",
    title: "Notification delivery delays for SMS provider · APAC",
    urgency: "P3" as Urgency,
    service: "Notification Hub",
    status: "OPEN" as IncStatus,
    assignee: "Unassigned",
    opened: "13:18:00",
    duration: "01:24:30",
  },
  {
    id: "INC-0119",
    title: "Analytics ingestion lag spike during traffic surge",
    urgency: "P2" as Urgency,
    service: "Analytics Pipeline",
    status: "RESOLVED" as IncStatus,
    assignee: "J. Park",
    opened: "11:02:48",
    duration: "01:38:11",
  },
];

const comments = [
  { author: "A. Kovac", role: "Lead", time: "14:42", text: "Stripe ack'd the issue, they're seeing webhook propagation delays globally. Status page incident opened on their side." },
  { author: "M. Reyes", role: "SRE", time: "14:40", text: "Rolled back to v3.0.6 on prod-eu. Connection pool saturation looks healthy now." },
  { author: "auto-bot", role: "System", time: "14:39", text: "Auto-paged oncall rotation. Slack thread created in #payments-incidents." },
  { author: "S. Chen", role: "Eng", time: "14:38", text: "Confirmed reproduction in staging — 5xx rate at 87% on /webhooks/stripe endpoint." },
];

function IncidentsPage() {
  const [selected, setSelected] = useState<string | null>("INC-0123");
  const inc = incidents.find((i) => i.id === selected);

  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            // active queue · 04 open
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Incident Response Center
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Flame className="h-3 w-3 text-destructive" /> 1 P1
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-warning" /> 1 P2
          </span>
          <span className="flex items-center gap-1.5">
            <AlertOctagon className="h-3 w-3 text-plasma" /> 2 P3
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 panel panel-notched-sm flex flex-wrap items-center gap-2 p-3">
        <div className="flex items-center gap-2 border-r border-border pr-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">STATUS</span>
          <Seg active>ALL</Seg>
          <Seg>OPEN</Seg>
          <Seg>INVESTIGATING</Seg>
          <Seg>RESOLVED</Seg>
        </div>
        <div className="flex items-center gap-2 border-r border-border pr-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">URGENCY</span>
          <Seg active>ANY</Seg>
          <Seg className="text-destructive">P1</Seg>
          <Seg className="text-warning">P2</Seg>
          <Seg className="text-plasma">P3</Seg>
        </div>
        <div className="flex items-center gap-2 ml-auto border border-border bg-panel-elevated px-3 py-1.5">
          <Search className="h-3 w-3 text-muted-foreground" />
          <input
            placeholder="// search incidents…"
            className="w-48 bg-transparent font-mono text-xs placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_520px]">
        {/* Incidents list */}
        <div className="space-y-3">
          {incidents.map((i) => {
            const u = urgencyMap[i.urgency];
            const isSel = selected === i.id;
            return (
              <button
                key={i.id}
                onClick={() => setSelected(i.id)}
                className={`group block w-full text-left panel panel-notched transition-all ${
                  isSel
                    ? "border-plasma glow-plasma"
                    : "hover:border-plasma/40 hover:-translate-y-0.5"
                }`}
              >
                <div className="grid grid-cols-[auto_auto_1fr_auto] items-start gap-3 p-4">
                  <div
                    className={`grid h-12 w-12 place-items-center border ${u.border} ${u.bg} ${u.color} font-mono text-sm font-bold`}
                  >
                    {i.urgency}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                      {i.id}
                    </span>
                    <span className={`mt-1 border px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-wider ${statusMap[i.status]}`}>
                      {i.status}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate font-display text-sm font-semibold">{i.title}</h4>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-muted-foreground">
                      <span>SVC · {i.service}</span>
                      <span>·</span>
                      <span>OPENED {i.opened}</span>
                      <span>·</span>
                      <span>DURATION {i.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <UserCircle2 className="h-3 w-3" />
                      <span>{i.assignee}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-plasma transition-colors" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {inc && (
          <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
            <Panel
              title={inc.id}
              subtitle={`// ${inc.urgency} · ${inc.status}`}
              scan
            >
              <h3 className="mb-2 font-display text-base font-semibold leading-snug">
                {inc.title}
              </h3>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Detail label="Service" value={inc.service} />
                <Detail label="Assignee" value={inc.assignee} />
                <Detail label="Opened" value={inc.opened} />
                <Detail label="Duration" value={inc.duration} mono color="text-warning" />
              </div>

              {/* failure visualization */}
              <div className="mt-5 border border-border bg-panel-elevated p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="label-tech">// failure timeline · 5xx rate</span>
                  <span className="font-mono text-[10px] text-destructive">PEAK 87%</span>
                </div>
                <FailureChart />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <ActionBtn label="Assign" />
                <ActionBtn label="Investigate" />
                <ActionBtn label="Resolve" primary />
              </div>
            </Panel>

            <Panel title="Collaboration Thread" subtitle="// secure · authenticated">
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {comments.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center border border-plasma/40 bg-plasma/10 font-mono text-[10px] font-bold text-plasma">
                      {c.author.split(" ").map((p) => p[0]).join("")}
                    </div>
                    <div className="flex-1 border border-border bg-panel-elevated p-3">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold">{c.author}</span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-plasma">
                            · {c.role}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {c.time}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/90">{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center gap-2 border border-border bg-background px-3 py-2 focus-within:border-plasma focus-within:shadow-[0_0_0_1px_var(--plasma)]">
                <GitCommit className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  placeholder="// post update to incident channel…"
                  className="flex-1 bg-transparent font-mono text-xs placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <button className="grid h-7 w-7 place-items-center bg-plasma text-primary-foreground hover:glow-plasma">
                  <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>
            </Panel>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Detail({
  label,
  value,
  mono,
  color = "",
}: {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
}) {
  return (
    <div className="border-l-2 border-plasma/40 pl-3">
      <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 text-sm font-semibold ${mono ? "font-mono tabular-nums" : ""} ${color}`}>
        {value}
      </div>
    </div>
  );
}

function ActionBtn({ label, primary }: { label: string; primary?: boolean }) {
  return (
    <button
      className={`px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] panel-notched-sm transition-all ${
        primary
          ? "bg-plasma text-primary-foreground hover:glow-plasma"
          : "border border-border bg-panel-elevated text-muted-foreground hover:text-plasma hover:border-plasma/60"
      }`}
    >
      {label}
    </button>
  );
}

function Seg({
  children,
  active,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition-all ${
        active
          ? "bg-plasma/20 text-plasma border border-plasma/60"
          : "border border-border text-muted-foreground hover:text-plasma hover:border-plasma/40"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function FailureChart() {
  // Simulated 5xx rate over 30 buckets
  const data = [
    1, 2, 1, 1, 2, 3, 2, 1, 4, 6, 12, 28, 42, 60, 75, 84, 87, 80, 65, 55, 48, 42, 38, 35, 30, 28, 22, 18, 14, 11,
  ];
  const max = 100;
  return (
    <svg viewBox="0 0 300 80" className="w-full h-20 block">
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={0}
          x2={300}
          y1={80 * t}
          y2={80 * t}
          stroke="var(--grid-line)"
          strokeDasharray="2 4"
          strokeWidth={0.5}
        />
      ))}
      {data.map((v, i) => {
        const h = (v / max) * 76;
        const x = i * 10;
        const color =
          v > 50
            ? "var(--destructive)"
            : v > 20
            ? "var(--warning)"
            : "var(--plasma)";
        return (
          <rect
            key={i}
            x={x + 1}
            y={80 - h}
            width={8}
            height={h}
            fill={color}
            opacity={0.85}
          />
        );
      })}
      <line x1={170} x2={170} y1={0} y2={80} stroke="var(--destructive)" strokeDasharray="2 2" strokeWidth={1} />
    </svg>
  );
}
