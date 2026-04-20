export type LogSeverity = "INFO" | "WARN" | "ERROR" | "DEBUG";

export interface LogEntry {
  id: string;
  ts: string; // HH:MM:SS.mmm
  date: string; // YYYY-MM-DD
  severity: LogSeverity;
  service: string;
  message: string;
  code: string;
}

const sevStyle: Record<LogSeverity, string> = {
  INFO: "border-plasma/50 bg-plasma/10 text-plasma",
  WARN: "border-warning/60 bg-warning/10 text-warning",
  ERROR: "border-destructive/60 bg-destructive/15 text-destructive",
  DEBUG: "border-border bg-panel-elevated text-muted-foreground",
};

export function LogRow({ entry }: { entry: LogEntry }) {
  return (
    <li className="group grid grid-cols-[auto_64px_140px_1fr_auto] items-center gap-4 border-b border-border/50 px-4 py-2 font-mono text-xs hover:bg-panel-elevated/60 transition-colors">
      <span className="text-muted-foreground/70 text-[10px] tracking-wider">{entry.date}</span>
      <span className="text-foreground/90">{entry.ts}</span>
      <span
        className={`inline-flex items-center justify-center border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${sevStyle[entry.severity]}`}
      >
        {entry.severity}
      </span>
      <span className="truncate text-foreground/80">
        <span className="text-muted-foreground">[{entry.service}]</span> {entry.message}
      </span>
      <span className="text-[10px] text-muted-foreground/60 group-hover:text-plasma">
        {entry.code}
      </span>
    </li>
  );
}
