import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

async function waitForHealth(url, retries = 30, intervalMs = 300) {
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

test('backend integration: /health returns UP', async (t) => {
  const port = 5600 + Math.floor(Math.random() * 200);
  const serverProcess = spawn('node', ['dist/server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      DATABASE_URL:
        process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/devops_test',
      FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stderr = '';
  serverProcess.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  t.after(() => {
    if (!serverProcess.killed) {
      serverProcess.kill('SIGTERM');
    }
  });

  const ready = await waitForHealth(`http://127.0.0.1:${port}/health`);
  assert.equal(
    ready,
    true,
    `Server did not become healthy in time. Stderr: ${stderr}`,
  );

  const response = await fetch(`http://127.0.0.1:${port}/health`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.deepEqual(body, { status: 'UP' });
});
