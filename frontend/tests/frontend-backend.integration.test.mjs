import test from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, "../../backend");

async function waitForHealth(url, retries = 40, intervalMs = 300) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return true;
      }
    } catch {
      // server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}

test("frontend-backend integration: frontend can consume backend /health", async (t) => {
  const buildResult = spawnSync("npm", ["run", "build"], {
    cwd: backendDir,
    env: process.env,
    stdio: "pipe",
  });

  assert.equal(
    buildResult.status,
    0,
    `Backend build failed before integration test.\n${buildResult.stdout.toString()}\n${buildResult.stderr.toString()}`,
  );

  const port = 5900 + Math.floor(Math.random() * 200);
  const serverProcess = spawn("node", ["dist/server.js"], {
    cwd: backendDir,
    env: {
      ...process.env,
      PORT: String(port),
      DATABASE_URL:
        process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/devops_test",
      FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  serverProcess.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  t.after(() => {
    if (!serverProcess.killed) {
      serverProcess.kill("SIGTERM");
    }
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  const ready = await waitForHealth(`${baseUrl}/health`);
  assert.equal(ready, true, `Backend server did not become healthy in time. Stderr: ${stderr}`);

  // Simulates frontend fetch call to backend API
  const response = await fetch(`${baseUrl}/health`, {
    headers: {
      Origin: process.env.FRONTEND_URL || "http://localhost:5173",
    },
  });

  assert.equal(response.status, 200);

  const body = await response.json();
  assert.deepEqual(body, { status: "UP" });
});
