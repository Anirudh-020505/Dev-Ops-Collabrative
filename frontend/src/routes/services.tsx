import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { StatusBadge, type Status } from "@/components/StatusBadge";
import { SAMPLE_SERVICES } from "@/components/ServiceCard";
import { Sparkline, Bar } from "@/components/TechCharts";
import {
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Activity,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — DevOps Collaborator" },
      { name: "description", content: "Manage and monitor every registered service in your infrastructure." },
      { property: "og:title", content: "Services — DevOps Collaborator" },
      { property: "og:description", content: "Manage and monitor every registered service in your infrastructure." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            // service registry · 06 entries
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Services Management
          </h2>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="group relative flex items-center gap-2 bg-plasma px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
          Register New Service
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SegBtn active>ALL</SegBtn>
        <SegBtn>UP</SegBtn>
        <SegBtn>DEGRADED</SegBtn>
        <SegBtn>DOWN</SegBtn>
        <span className="mx-2 h-5 w-px bg-border" />
        <button className="flex items-center gap-2 border border-border bg-panel px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-plasma hover:border-plasma/50 panel-notched-sm">
          <Filter className="h-3 w-3" /> Filter
        </button>
        <button className="flex items-center gap-2 border border-border bg-panel px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-plasma hover:border-plasma/50 panel-notched-sm">
          <Download className="h-3 w-3" /> Export
        </button>
      </div>

      <Panel title="Service Registry" subtitle="// 06 services · sorted by status" scan>
        <div className="-m-5 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel-elevated">
                {["Name", "URL", "Status", "Latency", "CPU / RAM", "Owner", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_SERVICES.map((s) => {
                const c =
                  s.status === "UP"
                    ? "var(--success)"
                    : s.status === "DOWN"
                    ? "var(--destructive)"
                    : "var(--warning)";
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border/60 transition-colors hover:bg-plasma/5"
                  >
                    <td className="px-4 py-3">
                      <div className="font-display text-sm font-semibold">{s.name}</div>
                      <div className="font-mono text-[10px] text-muted-foreground">{s.id}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.url}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status as Status} pulse={s.status !== "UP"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkline data={s.trend} color={c} width={70} height={22} showMarkers={false} />
                        <span className="font-mono text-sm tabular-nums" style={{ color: c }}>
                          {s.latency}
                          <span className="ml-0.5 text-[9px] text-muted-foreground">ms</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1.5 w-32">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] w-7 text-muted-foreground">
                            CPU
                          </span>
                          <Bar value={s.cpu} color={c} height={4} />
                          <span className="font-mono text-[10px] tabular-nums w-7 text-right" style={{color: c}}>
                            {s.cpu}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] w-7 text-muted-foreground">
                            RAM
                          </span>
                          <Bar value={s.ram} color={c} height={4} />
                          <span className="font-mono text-[10px] tabular-nums w-7 text-right" style={{color: c}}>
                            {s.ram}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{s.owner}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <IconBtn icon={Eye} />
                        <IconBtn icon={Pencil} />
                        <IconBtn icon={Trash2} danger />
                        <IconBtn icon={MoreHorizontal} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {open && <RegisterModal onClose={() => setOpen(false)} />}
    </AppShell>
  );
}

function SegBtn({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] panel-notched-sm transition-all ${
        active
          ? "bg-plasma text-primary-foreground glow-plasma"
          : "border border-border bg-panel text-muted-foreground hover:text-plasma hover:border-plasma/50"
      }`}
    >
      {children}
    </button>
  );
}

function IconBtn({
  icon: Icon,
  danger,
}: {
  icon: typeof Activity;
  danger?: boolean;
}) {
  return (
    <button
      className={`grid h-7 w-7 place-items-center border border-border bg-panel-elevated transition-colors ${
        danger
          ? "hover:border-destructive/60 hover:text-destructive"
          : "hover:border-plasma/60 hover:text-plasma"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl panel panel-notched scan-line overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border bg-panel-elevated px-5 py-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-plasma">
              // new service · registration form
            </div>
            <h3 className="font-display text-base font-semibold tracking-wide">
              REGISTER NEW SERVICE
            </h3>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center border border-border hover:border-destructive/60 hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          <Section title="01 · Core Details">
            <Field label="Service Name" placeholder="e.g. payment-gateway" />
            <Field label="Internal ID" placeholder="SVC-XXX" />
            <Field label="Owner Team" placeholder="Billing" />
          </Section>
          <Section title="02 · Endpoints & Probing">
            <Field label="Base URL" placeholder="https://api.example.io" />
            <Field label="Health Path" placeholder="/healthz" />
            <Field label="Probe Interval" placeholder="30s" />
          </Section>
          <Section title="03 · Alerting Config" wide>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Latency Threshold" placeholder="200ms" />
              <Field label="Error Rate Threshold" placeholder="2%" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Toggle defaultOn /> <span className="font-mono text-xs text-muted-foreground">Notify Discord channel</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Toggle /> <span className="font-mono text-xs text-muted-foreground">Auto-create incident on DOWN</span>
            </div>
          </Section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-panel-elevated px-5 py-3">
          <button onClick={onClose} className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button className="flex items-center gap-2 bg-plasma px-5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all">
            <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            Register Service
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  wide,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`bg-panel p-5 ${wide ? "md:col-span-2" : ""}`}>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-plasma">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="block mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        placeholder={placeholder}
        className="w-full border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-plasma focus:outline-none focus:shadow-[0_0_0_1px_var(--plasma),0_0_12px_-2px_var(--plasma)]"
      />
    </label>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-5 w-10 border transition-colors ${
        on ? "border-plasma bg-plasma/30" : "border-border bg-panel-elevated"
      }`}
    >
      <span
        className={`absolute top-0.5 h-3.5 w-3.5 transition-all ${
          on ? "left-[22px] bg-plasma shadow-[0_0_8px_var(--plasma)]" : "left-0.5 bg-muted-foreground"
        }`}
      />
    </button>
  );
}
