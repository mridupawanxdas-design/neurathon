import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const procs = [];
const isWin = process.platform === 'win32';

const run = (name, cmd, args) => {
  const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env });

  p.stdout.on('data', (d) => process.stdout.write(`[${name}] ${d}`));
  p.stderr.on('data', (d) => process.stderr.write(`[${name}] ${d}`));

  p.on('error', (err) => {
    process.stderr.write(`[${name}] failed to start: ${err.message}\n`);
    shutdown(1);
  });

  p.on('exit', (code) => {
    process.stdout.write(`[${name}] exited with code ${code}\n`);
    if (code && code !== 0) shutdown(code);
  });

  procs.push(p);
};

const shutdown = (exitCode = 0) => {
  while (procs.length) {
    const p = procs.pop();
    if (p && !p.killed) p.kill('SIGTERM');
  }
  process.exitCode = exitCode;
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('backend', 'node', ['server.js']);

const viteBin = path.resolve('node_modules', 'vite', 'bin', 'vite.js');
if (existsSync(viteBin)) {
  run('frontend', 'node', [viteBin, '--host', '0.0.0.0', '--port', '5173']);
} else {
  const npmCmd = isWin ? 'npm.cmd' : 'npm';
  run('frontend', npmCmd, ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '5173']);
}
