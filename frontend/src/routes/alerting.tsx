import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Panel } from "@/components/Panel";
import { useState } from "react";
import { Mail, Plus, Send, Slack, MessageCircle, Webhook, Trash2, X, Check } from "lucide-react";

export const Route = createFileRoute("/alerting")({
  head: () => ({
    meta: [
      { title: "Alerting — DevOps Collaborator" },
      { name: "description", content: "Configure webhooks, Slack, Discord, and email channels for incident alerting." },
      { property: "og:title", content: "Alerting Configuration" },
      { property: "og:description", content: "Configure webhooks, Slack, Discord, and email channels for incident alerting." },
    ],
  }),
  component: AlertingPage,
});

const integrations = [
  {
    id: "wh-1",
    name: "DISCORD · #OPS-ALERTS",
    icon: MessageCircle,
    enabled: true,
    url: "https://discord.com/api/webhooks/8429•••",
    triggers: ["Service Down", "Incident Opened", "High Latency"],
    color: "var(--plasma)",
  },
  {
    id: "wh-2",
    name: "SLACK · #infra-incidents",
    icon: Slack,
    enabled: true,
    url: "https://hooks.slack.com/services/T01•••",
    triggers: ["Service Down", "Incident Opened"],
    color: "var(--success)",
  },
  {
    id: "wh-3",
    name: "GENERIC WEBHOOK · pagerduty-bridge",
    icon: Webhook,
    enabled: false,
    url: "https://events.pagerduty.com/v2/enqueue",
    triggers: ["Service Down"],
    color: "var(--warning)",
  },
];

const allTriggers = [
  "Service Down",
  "Service Recovered",
  "Service Degraded",
  "High Latency",
  "Incident Opened",
  "Incident Resolved",
  "Comment Posted",
  "Deploy Started",
];

function AlertingPage() {
  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            // notification routing · 03 channels
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Alerting Configuration
          </h2>
        </div>
        <button className="flex items-center gap-2 bg-plasma px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all">
          <Plus className="h-4 w-4" strokeWidth={3} />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <div className="label-tech mb-1">// webhook integrations</div>
          {integrations.map((i) => (
            <IntegrationCard key={i.id} integration={i} />
          ))}
        </div>

        <div className="space-y-4">
          <Panel title="Email Alerting" subtitle="// smtp · recipients" scan>
            <div className="space-y-3">
              <Field label="SMTP Server" value="smtp.platform.io:587" />
              <Field label="From Address" value="alerts@platform.io" />
              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Recipients
                </div>
                <ul className="space-y-1.5">
                  {["oncall@platform.io", "leads@platform.io", "alex.kovac@platform.io"].map((e) => (
                    <li
                      key={e}
                      className="flex items-center justify-between border border-border bg-panel-elevated px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-plasma" />
                        <span className="font-mono text-xs">{e}</span>
                      </div>
                      <button className="text-muted-foreground hover:text-destructive">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex">
                  <input
                    placeholder="add recipient@domain.io"
                    className="flex-1 border border-border bg-background px-3 py-2 font-mono text-xs placeholder:text-muted-foreground/50 focus:border-plasma focus:outline-none"
                  />
                  <button className="grid w-9 place-items-center bg-plasma text-primary-foreground hover:glow-plasma">
                    <Plus className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
              </div>

              <button className="w-full bg-plasma px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground panel-notched-sm hover:glow-plasma">
                Save Email Config
              </button>
            </div>
          </Panel>

          <Panel title="Routing Policy" subtitle="// escalation matrix">
            <ul className="space-y-2 font-mono text-xs">
              {[
                { sev: "P1", route: "Discord + Slack + SMS", color: "text-destructive" },
                { sev: "P2", route: "Discord + Slack", color: "text-warning" },
                { sev: "P3", route: "Slack only", color: "text-plasma" },
                { sev: "INFO", route: "No alert", color: "text-muted-foreground" },
              ].map((r) => (
                <li
                  key={r.sev}
                  className="flex items-center justify-between border-l-2 border-border pl-3 py-1 hover:border-plasma transition-colors"
                >
                  <span className={`font-bold ${r.color}`}>{r.sev}</span>
                  <span className="text-muted-foreground">{r.route}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function IntegrationCard({
  integration,
}: {
  integration: (typeof integrations)[number];
}) {
  const [enabled, setEnabled] = useState(integration.enabled);
  const Icon = integration.icon;

  return (
    <div className="panel panel-notched scan-line overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-panel-elevated px-5 py-3">
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 place-items-center border"
            style={{
              borderColor: enabled ? integration.color : "var(--border)",
              backgroundColor: enabled ? `color-mix(in oklab, ${integration.color} 12%, transparent)` : "transparent",
            }}
          >
            <Icon className="h-4 w-4" style={{ color: enabled ? integration.color : "var(--muted-foreground)" }} />
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide">
              {integration.name}
            </h4>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {enabled ? "// active · listening" : "// disabled"}
            </div>
          </div>
        </div>

        <button
          onClick={() => setEnabled((v) => !v)}
          className={`relative h-6 w-12 border transition-all ${
            enabled ? "border-plasma bg-plasma/30" : "border-border bg-panel"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 transition-all ${
              enabled
                ? "left-[26px] bg-plasma shadow-[0_0_8px_var(--plasma)]"
                : "left-0.5 bg-muted-foreground"
            }`}
          />
          <span className="absolute -bottom-5 right-0 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {enabled ? "ON" : "OFF"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Webhook URL
          </div>
          <input
            value={integration.url}
            onChange={() => {}}
            className="w-full border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-plasma focus:outline-none focus:shadow-[0_0_0_1px_var(--plasma)]"
          />
          <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Last Delivery
          </div>
          <div className="mt-1 flex items-center gap-2 border border-border bg-panel-elevated px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot text-success" />
            <span className="font-mono text-xs">14:38:21 · 200 OK · 124ms</span>
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Event Triggers
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allTriggers.map((t) => {
              const on = integration.triggers.includes(t);
              return (
                <button
                  key={t}
                  className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-all ${
                    on
                      ? "border border-plasma/60 bg-plasma/10 text-plasma"
                      : "border border-border text-muted-foreground hover:border-plasma/40 hover:text-plasma"
                  }`}
                >
                  {on && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border bg-panel-elevated px-5 py-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-destructive/80 hover:text-destructive">
          <Trash2 className="h-3 w-3" />
          Remove
        </button>
        <button className="flex items-center gap-2 border border-border bg-panel px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-plasma hover:border-plasma/60 panel-notched-sm">
          <Send className="h-3 w-3" />
          Send Test
        </button>
        <button className="flex items-center gap-2 bg-plasma px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground panel-notched-sm hover:glow-plasma">
          Save
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="block mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        defaultValue={value}
        className="w-full border border-border bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-plasma focus:outline-none focus:shadow-[0_0_0_1px_var(--plasma)]"
      />
    </label>
  );
}
