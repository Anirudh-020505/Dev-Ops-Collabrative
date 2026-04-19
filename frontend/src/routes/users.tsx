import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { Plus, Shield, MoreHorizontal, Mail } from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users — DevOps Collaborator" },
      { name: "description", content: "Manage team members, roles, and access permissions." },
      { property: "og:title", content: "Users & Permissions" },
      { property: "og:description", content: "Manage team members, roles, and access permissions." },
    ],
  }),
  component: UsersPage,
});

const users = [
  { name: "Alex Kovac", id: "0x4F2A", role: "LEAD", team: "Core Platform", status: "ONLINE", initials: "AK" },
  { name: "Marcus Reyes", id: "0x88C1", role: "SRE", team: "Infrastructure", status: "ONLINE", initials: "MR" },
  { name: "Sara Chen", id: "0x12B0", role: "ENGINEER", team: "Identity", status: "ONLINE", initials: "SC" },
  { name: "Jordan Park", id: "0x9F44", role: "ENGINEER", team: "Data", status: "AWAY", initials: "JP" },
  { name: "Ines Volkov", id: "0xA72E", role: "ON-CALL", team: "Billing", status: "ONLINE", initials: "IV" },
  { name: "Daniel Roe", id: "0x5510", role: "VIEWER", team: "Discovery", status: "OFFLINE", initials: "DR" },
];

const statusColor = (s: string) =>
  s === "ONLINE" ? "text-success" : s === "AWAY" ? "text-warning" : "text-muted-foreground";

function UsersPage() {
  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            // access registry · 06 members
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Users &amp; Permissions
          </h2>
        </div>
        <button className="flex items-center gap-2 bg-plasma px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all">
          <Plus className="h-4 w-4" strokeWidth={3} />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
        {[
          { label: "TOTAL", v: 6, color: "text-foreground" },
          { label: "ONLINE", v: 4, color: "text-success" },
          { label: "ON-CALL", v: 1, color: "text-warning" },
          { label: "ADMINS", v: 2, color: "text-plasma" },
        ].map((s) => (
          <div key={s.label} className="panel panel-notched-sm p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className={`mt-1 font-mono text-3xl font-semibold tabular-nums ${s.color}`}>
              {s.v.toString().padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>

      <Panel title="Team Roster" subtitle="// 06 members · access registry" scan>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="group panel panel-notched-sm p-4 hover:border-plasma/50 transition-all"
            >
              <div className="flex items-start gap-3">
                {/* badge avatar */}
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center border border-plasma/60 bg-plasma/10 font-mono text-sm font-bold text-plasma">
                    {u.initials}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background ${
                      u.status === "ONLINE"
                        ? "bg-success pulse-dot text-success"
                        : u.status === "AWAY"
                        ? "bg-warning"
                        : "bg-muted-foreground"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="truncate font-display text-sm font-semibold">{u.name}</h4>
                    <button className="text-muted-foreground hover:text-plasma">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    ID · {u.id} · <span className={statusColor(u.status)}>{u.status}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex items-center gap-1 border border-plasma/40 bg-plasma/10 px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-wider text-plasma">
                      <Shield className="h-2.5 w-2.5" />
                      {u.role}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{u.team}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <button className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-plasma">
                  <Mail className="h-3 w-3" />
                  Message
                </button>
                <span className="font-mono text-[10px] text-muted-foreground">
                  LAST · 2m ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
