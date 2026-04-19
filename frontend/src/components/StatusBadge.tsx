import { ReactNode } from "react";
import { CheckCircle2, AlertOctagon, AlertTriangle } from "lucide-react";

export type Status = "UP" | "DOWN" | "DEGRADED";

const map: Record<
  Status,
  { color: string; bg: string; border: string; icon: typeof CheckCircle2 }
> = {
  UP: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/50",
    icon: CheckCircle2,
  },
  DOWN: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/60",
    icon: AlertOctagon,
  },
  DEGRADED: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/50",
    icon: AlertTriangle,
  },
};

export function StatusBadge({
  status,
  pulse = false,
  children,
}: {
  status: Status;
  pulse?: boolean;
  children?: ReactNode;
}) {
  const cfg = map[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 border ${cfg.border} ${cfg.bg} ${cfg.color} px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em]`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              status === "UP" ? "bg-success" : status === "DOWN" ? "bg-destructive" : "bg-warning"
            }`}
          />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            status === "UP" ? "bg-success" : status === "DOWN" ? "bg-destructive" : "bg-warning"
          }`}
        />
      </span>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {children ?? status}
    </span>
  );
}
