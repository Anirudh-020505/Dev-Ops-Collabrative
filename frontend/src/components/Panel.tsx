import { ReactNode } from "react";

export function Panel({
  children,
  title,
  subtitle,
  action,
  className = "",
  variant = "default",
  scan = false,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "elevated";
  scan?: boolean;
}) {
  return (
    <div
      className={`relative ${
        variant === "elevated" ? "panel-elevated" : "panel"
      } panel-notched ${scan ? "scan-line overflow-hidden" : ""} ${className}`}
    >
      {/* corner ticks */}
      <span className="pointer-events-none absolute top-2 right-3 h-[6px] w-[6px] border-t border-r border-plasma/60" />
      <span className="pointer-events-none absolute bottom-2 left-3 h-[6px] w-[6px] border-b border-l border-plasma/60" />

      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div>
            {title && (
              <h3 className="font-display text-[13px] font-semibold uppercase tracking-[0.18em]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
