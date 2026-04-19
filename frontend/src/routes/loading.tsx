import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DashboardSkeleton, TableSkeleton, BlockLoader } from "@/components/Skeletons";
import { useState } from "react";

export const Route = createFileRoute("/loading")({
  head: () => ({
    meta: [
      { title: "Loading States — DevOps Collaborator" },
      { name: "description", content: "Skeleton loading states preview." },
    ],
  }),
  component: LoadingPreview,
});

type Mode = "dashboard" | "table" | "loader";

function LoadingPreview() {
  const [mode, setMode] = useState<Mode>("dashboard");

  return (
    <AppShell>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            // skeleton states · loading preview
          </div>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Loading States
          </h2>
        </div>
        <div className="flex border border-border panel-notched-sm overflow-hidden">
          {(["dashboard", "table", "loader"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                mode === m
                  ? "bg-plasma text-primary-foreground"
                  : "text-muted-foreground hover:text-plasma"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "dashboard" && <DashboardSkeleton />}
      {mode === "table" && <TableSkeleton rows={10} cols={6} />}
      {mode === "loader" && (
        <div className="panel panel-notched p-12">
          <BlockLoader />
        </div>
      )}
    </AppShell>
  );
}
