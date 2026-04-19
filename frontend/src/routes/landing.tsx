import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Zap,
  GitBranch,
  Lock,
  Users,
  ArrowRight,
  Github,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "DevOps Collaborator — Command & Control for Modern Infrastructure" },
      {
        name: "description",
        content:
          "Real-time telemetry, automated incident routing, and encrypted team comms for engineering platforms.",
      },
      { property: "og:title", content: "DevOps Collaborator — Command & Control" },
      {
        property: "og:description",
        content:
          "Sub-millisecond telemetry, automated incident routing, encrypted team comms.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
          <Link to="/landing" className="flex items-center gap-3">
            <div className="relative grid h-8 w-8 place-items-center bg-plasma/10">
              <div className="absolute inset-0 border border-plasma/60 panel-notched-sm" />
              <Activity className="h-4 w-4 text-plasma" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold tracking-wide">
              DEVOPS · COLLAB
            </span>
          </Link>

          <nav className="ml-8 hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:flex">
            <a href="#features" className="hover:text-plasma transition-colors">
              Features
            </a>
            <a href="#telemetry" className="hover:text-plasma transition-colors">
              Telemetry
            </a>
            <a href="#docs" className="hover:text-plasma transition-colors">
              Docs
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              to="/login"
              className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-plasma sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 bg-plasma px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all"
            >
              Launch
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-tech-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 border border-border bg-panel px-3 py-1.5 panel-notched-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot text-success" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                v2.1 · build 2025.04 · operational
              </span>
            </div>

            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              COMMAND AND CONTROL
              <br />
              FOR MODERN
              <br />
              <span className="text-plasma">INFRASTRUCTURE.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Sub-millisecond telemetry, automated incident routing, and
              encrypted team comms — engineered for the operators who keep the
              lights on.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="group flex items-center gap-2 bg-plasma px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all"
              >
                Initialize Dashboard
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 border border-border bg-panel px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground panel-notched-sm hover:border-plasma/60 hover:text-plasma transition-all"
              >
                View Specs
              </a>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                { k: "UPTIME", v: "99.982%" },
                { k: "P99 LATENCY", v: "0.84ms" },
                { k: "EVENTS/SEC", v: "2.4M" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                    {s.k}
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tracking-tight text-plasma">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero graphic — isometric dashboard mock */}
          <HeroIsometric />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              // section.02 · capabilities
            </div>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Built for high-stakes operations.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((f, i) => (
              <FeaturePanel key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-b border-border bg-panel/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              // ready when you are
            </div>
            <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Deploy the console. Ship with confidence.
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 bg-plasma px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all"
            >
              Initialize Dashboard
              <ArrowRight className="h-4 w-4" strokeWidth={3} />
            </Link>
            <Link
              to="/login"
              className="border border-border bg-panel px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] hover:border-plasma/60 hover:text-plasma panel-notched-sm transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="docs" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative grid h-7 w-7 place-items-center bg-plasma/10">
                <div className="absolute inset-0 border border-plasma/60 panel-notched-sm" />
                <Activity className="h-3.5 w-3.5 text-plasma" strokeWidth={2.5} />
              </div>
              <span className="font-display text-sm font-semibold tracking-wide">
                DEVOPS · COLLAB
              </span>
            </div>
            <p className="mt-4 max-w-xs font-mono text-[11px] leading-relaxed text-muted-foreground">
              Industrial-grade observability and incident response, engineered
              for operators.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                // {col.title}
              </div>
              <ul className="mt-4 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 hover:text-plasma transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-5 md:flex-row md:items-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              © 2025 DEVOPS COLLAB · ALL RIGHTS RESERVED
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <a href="#" className="hover:text-plasma">Status</a>
              <a href="#" className="hover:text-plasma">Privacy</a>
              <a href="#" className="hover:text-plasma">Terms</a>
              <a href="#" className="flex items-center gap-1.5 hover:text-plasma">
                <Github className="h-3.5 w-3.5" /> GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Sub-Millisecond Telemetry",
    desc: "Stream metrics from every node with edge-grade precision and zero-lag rendering.",
    Icon: Zap,
    code: "T-01",
  },
  {
    title: "Automated Incident Routing",
    desc: "Severity-aware policies route alerts to the right operator, every time.",
    Icon: GitBranch,
    code: "T-02",
  },
  {
    title: "Encrypted Team Comms",
    desc: "End-to-end secured incident channels with signed audit trails.",
    Icon: Lock,
    code: "T-03",
  },
  {
    title: "Real-Time Collaboration",
    desc: "Live cursors, threaded comments, and coordinated runbooks in one console.",
    Icon: Users,
    code: "T-04",
  },
];

const footerCols = [
  { title: "platform", links: ["Dashboard", "Services", "Incidents", "Alerting"] },
  { title: "developers", links: ["Docs", "API Reference", "Changelog", "Status"] },
  { title: "company", links: ["About", "Security", "Careers", "Contact"] },
];

function FeaturePanel({
  title,
  desc,
  Icon,
  code,
  index,
}: {
  title: string;
  desc: string;
  Icon: typeof Zap;
  code: string;
  index: number;
}) {
  return (
    <div className="panel panel-notched group relative overflow-hidden p-6 transition-all hover:border-plasma/60">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-plasma/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center border border-border bg-panel-elevated transition-colors group-hover:border-plasma/60">
          <Icon className="h-4 w-4 text-plasma" strokeWidth={2} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {String(index + 1).padStart(2, "0")} · {code}
        </span>
      </div>
      <h3 className="mt-6 font-display text-lg font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}

function HeroIsometric() {
  return (
    <div className="relative hidden h-[460px] items-center justify-center lg:flex">
      <div className="absolute inset-0 bg-hex opacity-40" />
      {/* Faux isometric stack */}
      <div
        className="relative w-full max-w-[520px]"
        style={{
          transform: "perspective(1600px) rotateX(22deg) rotateY(-22deg) rotateZ(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* main panel */}
        <div className="panel panel-notched scan-line glow-plasma p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              // dashboard.live
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
              ONLINE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["128", "03", "0.84ms"].map((v, i) => (
              <div key={i} className="border border-border bg-panel-elevated p-2">
                <div className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                  M-{i + 1}
                </div>
                <div className="mt-1 font-display text-base font-semibold text-plasma">
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-3 h-24 overflow-hidden border border-border bg-tech-grid">
            <svg viewBox="0 0 200 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <polyline
                points="0,55 20,42 40,48 60,30 80,35 100,18 120,28 140,12 160,22 180,8 200,16"
                fill="none"
                stroke="var(--plasma)"
                strokeWidth="1.2"
              />
              <polyline
                points="0,65 20,60 40,55 60,58 80,50 100,46 120,42 140,38 160,30 180,28 200,22"
                fill="none"
                stroke="var(--plasma)"
                strokeWidth="0.6"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        {/* floating side card */}
        <div
          className="panel panel-notched absolute -right-12 -top-10 w-44 p-3"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            // incident · #847
          </div>
          <div className="mt-1 font-display text-sm font-semibold">
            payment-gateway
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 border border-destructive/60 bg-destructive/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-destructive">
            <span className="h-1 w-1 rounded-full bg-destructive" /> P1 · DOWN
          </div>
        </div>

        {/* floating bottom card */}
        <div
          className="panel panel-notched absolute -bottom-12 -left-10 w-52 p-3"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
            // log · 14:38:21
          </div>
          <div className="mt-1 font-mono text-[10px] text-foreground/80">
            <span className="text-plasma">[INFO]</span> auto-failover engaged · region eu-west-3
          </div>
        </div>
      </div>
    </div>
  );
}
