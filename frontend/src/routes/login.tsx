import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, Github, Fingerprint, ScanLine, ArrowRight, Lock } from "lucide-react";
import { FormEvent, useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "System Authentication — DevOps Collaborator" },
      { name: "description", content: "Sign in to the DevOps Collaborator command console." },
      { property: "og:title", content: "System Authentication — DevOps Collaborator" },
      { property: "og:description", content: "Operator authentication portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // UI only — fake auth handshake
    await new Promise((r) => setTimeout(r, 700));
    void navigate({ to: "/" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Layered industrial background */}
      <div className="absolute inset-0 bg-tech-grid opacity-30" />
      <div className="absolute inset-0 bg-hex opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-plasma/5 via-transparent to-transparent" />

      {/* Top brand */}
      <div className="relative z-10 flex h-16 items-center px-6">
        <Link to="/landing" className="flex items-center gap-3">
          <div className="relative grid h-8 w-8 place-items-center bg-plasma/10">
            <div className="absolute inset-0 border border-plasma/60 panel-notched-sm" />
            <Activity className="h-4 w-4 text-plasma" strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-semibold tracking-wide">DEVOPS · COLLAB</span>
        </Link>
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_440px]">
          {/* Decorative side */}
          <div className="hidden lg:block">
            <div className="panel panel-notched scan-line relative h-full overflow-hidden p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                // identity vault · sector 04
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight">
                Operator
                <br />
                <span className="text-plasma">authentication.</span>
              </h2>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Cryptographic handshake with hardware-attested keys. All sessions are signed,
                scoped, and audited.
              </p>

              <div className="mt-10 flex items-center justify-center">
                <div className="relative grid h-48 w-48 place-items-center">
                  <div className="absolute inset-0 border border-plasma/40 panel-notched" />
                  <div
                    className="absolute inset-3 border border-plasma/60 panel-notched"
                    style={{ transform: "rotate(45deg)" }}
                  />
                  <Fingerprint className="h-20 w-20 text-plasma" strokeWidth={1.2} />
                  <div className="shimmer-radar absolute inset-0" />
                </div>
              </div>

              <ul className="mt-10 space-y-2 font-mono text-[11px] text-muted-foreground">
                {[
                  ["HANDSHAKE", "TLS 1.3 · X25519"],
                  ["KEY ROTATION", "24H · AUTO"],
                  ["AUDIT", "SIGNED · IMMUTABLE"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex items-center justify-between border-l-2 border-border pl-3 py-1"
                  >
                    <span>{k}</span>
                    <span className="text-foreground/80">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Auth card */}
          <div className="panel panel-notched scan-line relative overflow-hidden">
            <div className="border-b border-border bg-panel-elevated px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ScanLine className="h-3.5 w-3.5 text-plasma" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    // system authentication required
                  </span>
                </div>
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
                  SECURE
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="block">
                  <span className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Operator ID
                  </span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="operator@platform.io"
                    className="w-full border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-plasma focus:outline-none focus:shadow-[0_0_0_1px_var(--plasma),0_0_18px_-4px_var(--plasma)]"
                  />
                </label>
              </div>

              <div>
                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Access Key</span>
                    <a href="#" className="hover:text-plasma">
                      // recover
                    </a>
                  </span>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full border border-border bg-background px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-plasma focus:outline-none focus:shadow-[0_0_0_1px_var(--plasma),0_0_18px_-4px_var(--plasma)]"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-3.5 w-3.5 accent-[var(--plasma)]"
                />
                Persist session · 24h
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 bg-plasma px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground panel-notched-sm hover:glow-plasma transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Lock className="h-4 w-4 animate-pulse" strokeWidth={3} />
                    Authenticating
                  </>
                ) : (
                  <>
                    Authenticate
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={3}
                    />
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 border border-border bg-panel px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground panel-notched-sm hover:border-plasma/60 hover:text-plasma transition-all"
              >
                <Github className="h-4 w-4" />
                Authenticate via GitHub
              </button>
            </form>

            <div className="border-t border-border bg-panel-elevated px-6 py-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <span>// no credentials?</span>
                <a href="#" className="text-plasma hover:underline">
                  request access →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
