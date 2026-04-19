import { Sparkline, Gauge, Bar } from "./TechCharts";
import { StatusBadge, type Status } from "./StatusBadge";
import { ChevronRight, Settings2, ExternalLink } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  url: string;
  status: Status;
  cpu: number;
  ram: number;
  latency: number;
  owner: string;
  trend: number[];
};

export const SAMPLE_SERVICES: Service[] = [
  {
    id: "SVC-001",
    name: "API Gateway",
    url: "api.platform.io",
    status: "UP",
    cpu: 42,
    ram: 61,
    latency: 84,
    owner: "Core Platform",
    trend: [40, 42, 38, 44, 41, 43, 45, 42, 39, 41, 44, 42],
  },
  {
    id: "SVC-002",
    name: "Payment Processor",
    url: "pay.platform.io",
    status: "DOWN",
    cpu: 0,
    ram: 0,
    latency: 0,
    owner: "Billing",
    trend: [55, 60, 58, 62, 64, 70, 80, 90, 50, 12, 0, 0],
  },
  {
    id: "SVC-003",
    name: "Auth Service",
    url: "auth.platform.io",
    status: "UP",
    cpu: 31,
    ram: 48,
    latency: 62,
    owner: "Identity",
    trend: [30, 28, 32, 31, 29, 30, 33, 31, 30, 32, 31, 31],
  },
  {
    id: "SVC-004",
    name: "Search Cluster",
    url: "search.platform.io",
    status: "DEGRADED",
    cpu: 78,
    ram: 84,
    latency: 312,
    owner: "Discovery",
    trend: [50, 55, 60, 68, 72, 75, 78, 80, 79, 82, 84, 78],
  },
  {
    id: "SVC-005",
    name: "Notification Hub",
    url: "notify.platform.io",
    status: "UP",
    cpu: 22,
    ram: 35,
    latency: 47,
    owner: "Comms",
    trend: [20, 22, 21, 24, 23, 22, 25, 24, 22, 21, 23, 22],
  },
  {
    id: "SVC-006",
    name: "Analytics Pipeline",
    url: "events.platform.io",
    status: "UP",
    cpu: 56,
    ram: 70,
    latency: 128,
    owner: "Data",
    trend: [50, 52, 54, 58, 56, 55, 57, 56, 58, 56, 57, 56],
  },
];

const statusColor = (s: Status) =>
  s === "UP" ? "var(--success)" : s === "DOWN" ? "var(--destructive)" : "var(--warning)";

export function ServiceCard({ service }: { service: Service }) {
  const c = statusColor(service.status);
  return (
    <div className="group relative panel panel-notched transition-all hover:border-plasma/50 hover:-translate-y-0.5">
      {/* header strip */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
              {service.id}
            </span>
            <span className="h-px w-3 bg-border" />
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground truncate">
              {service.url}
            </span>
          </div>
          <h4 className="truncate font-display text-base font-semibold tracking-wide">
            {service.name}
          </h4>
        </div>
        <StatusBadge status={service.status} pulse={service.status !== "UP"} />
      </div>

      {/* body */}
      <div className="grid grid-cols-3 gap-3 px-4 pt-4">
        <Gauge value={service.cpu} label="CPU" size={80} color={c} />
        <Gauge value={service.ram} label="RAM" size={80} color={c} />
        <div className="flex flex-col items-center justify-end gap-1">
          <div className="font-mono text-base font-semibold tabular-nums" style={{ color: c }}>
            {service.latency}
            <span className="ml-0.5 text-[10px] text-muted-foreground">ms</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            LATENCY P95
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="label-tech">// load · 12h trend</span>
          <span className="font-mono text-[10px] text-muted-foreground">{service.owner}</span>
        </div>
        <Sparkline data={service.trend} color={c} width={300} height={36} />
      </div>

      <div className="flex items-stretch border-t border-border">
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-plasma/10 hover:text-plasma transition-colors">
          <ChevronRight className="h-3.5 w-3.5" />
          Details
        </button>
        <span className="w-px bg-border" />
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-plasma/10 hover:text-plasma transition-colors">
          <Settings2 className="h-3.5 w-3.5" />
          Edit
        </button>
        <span className="w-px bg-border" />
        <button className="flex items-center justify-center px-3 py-2.5 text-muted-foreground hover:bg-plasma/10 hover:text-plasma transition-colors">
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export { Bar };
