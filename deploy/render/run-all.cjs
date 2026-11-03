const { spawn } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

const children = new Set();
let stopping = false;

function stop(exitCode) {
  if (stopping) return;
  stopping = true;
  process.exitCode = exitCode;
  for (const child of children) child.kill('SIGTERM');
  const deadline = setTimeout(() => {
    for (const child of children) child.kill('SIGKILL');
  }, 25000);
  deadline.unref();
}

function launch(entry, env) {
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  children.add(child);
  child.on('error', () => {
    console.error(`Failed to launch ${entry}`);
    stop(1);
  });
  child.on('exit', () => {
    children.delete(child);
    if (!stopping) {
      console.error(`${entry} exited unexpectedly`);
      stop(1);
    }
  });
  return child;
}

process.on('SIGTERM', () => stop(0));
process.on('SIGINT', () => stop(0));

launch('dist/main');

async function startWorker() {
  const healthUrl = `http://127.0.0.1:${process.env.NODE_PORT || 3000}/healthz`;
  for (let attempt = 0; attempt < 180 && !stopping; attempt++) {
    try {
      const response = await fetch(healthUrl, {
        signal: AbortSignal.timeout(5000),
      });
      await response.body?.cancel();
      if (response.ok && !stopping) {
        launch('dist/queue-worker/queue-worker', {
          DISABLE_DB_MIGRATIONS: 'true',
          DISABLE_CRON_JOBS_REGISTRATION: 'true',
        });
        return;
      }
    } catch {
      // The worker must wait until web migrations and startup have finished.
    }
    await delay(1000);
  }
  if (!stopping) {
    console.error('Web startup timed out; stopping the combined service');
    stop(1);
  }
}

startWorker().catch(() => stop(1));
