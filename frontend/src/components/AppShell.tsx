import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutGrid,
  Server,
  AlertTriangle,
  BellRing,
  Users,
  Search,
  Bell,
  Activity,
  Terminal,
} from "lucide-react";
import { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, code: "01" },
  { to: "/services", label: "Services", icon: Server, code: "02" },
  { to: "/incidents", label: "Incidents", icon: AlertTriangle, code: "03" },
  { to: "/alerting", label: "Alerting", icon: BellRing, code: "04" },
  { to: "/users", label: "Users", icon: Users, code: "05" },
  { to: "/logs", label: "Logs", icon: Terminal, code: "06" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const path = location.pathname;
  const active = navItems.find((n) => (n.to === "/" ? path === "/" : path.startsWith(n.to)));

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="relative flex h-8 w-8 items-center justify-center bg-plasma/10">
            <div className="absolute inset-0 border border-plasma/60 panel-notched-sm" />
            <Activity className="h-4 w-4 text-plasma" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              system / v2.1
            </span>
            <span className="font-display text-sm font-semibold tracking-wide">
              DEVOPS · COLLAB
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="label-tech px-3 pb-3">// navigation</div>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.to === "/" ? path === "/" : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-y-0 left-0 w-[3px] bg-plasma shadow-[0_0_12px_var(--plasma)]" />
                    )}
                    <Icon
                      className={`h-4 w-4 ${isActive ? "text-plasma" : ""}`}
                      strokeWidth={isActive ? 2.4 : 1.8}
                    />
                    <span className="font-medium tracking-wide">{item.label}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                      {item.code}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="label-tech mt-8 px-3 pb-3">// system status</div>
          <div className="mx-2 panel panel-notched-sm p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot text-success" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-success">
                ONLINE
              </span>
            </div>
            <div className="space-y-1 font-mono text-[10px] text-muted-foreground">
              <div className="flex justify-between">
                <span>NODES</span>
                <span className="text-foreground">128/128</span>
              </div>
              <div className="flex justify-between">
                <span>UPTIME</span>
                <span className="text-foreground">99.982%</span>
              </div>
              <div className="flex justify-between">
                <span>REGION</span>
                <span className="text-foreground">EU-WEST-3</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="border-t border-border p-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>build</span>
            <span className="text-plasma">2.1.04-prod</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {active?.code ?? "00"} /
            </span>
            <h1 className="font-display text-base font-semibold tracking-wide">
              {active?.label.toUpperCase() ?? "DEVOPS COLLABORATOR"}
            </h1>
          </div>

          <div className="ml-8 hidden items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot text-success" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              all systems nominal
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 border border-border bg-panel px-3 py-1.5 panel-notched-sm w-72">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                placeholder="// search services, incidents, users..."
                className="flex-1 bg-transparent font-mono text-xs placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <span className="font-mono text-[10px] text-muted-foreground">⌘K</span>
            </div>

            <button className="relative grid h-9 w-9 place-items-center border border-border bg-panel hover:border-plasma/60 hover:text-plasma transition-colors panel-notched-sm">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-destructive shadow-[0_0_10px_var(--destructive)]" />
            </button>

            <div className="flex items-center gap-3 border border-border bg-panel px-3 py-1.5 panel-notched-sm">
              <div className="grid h-7 w-7 place-items-center bg-plasma/15 border border-plasma/50 font-mono text-[11px] font-bold text-plasma">
                AK
              </div>
              <div className="hidden flex-col leading-tight md:flex">
                <span className="font-mono text-[11px] font-medium">A. KOVAC</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  ID · 0x4F2A · LEAD
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
