import { spawn } from 'node:child_process';

const procs = [];

const run = (name, cmd, args) => {
  const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env });
  p.stdout.on('data', (d) => process.stdout.write(`[${name}] ${d}`));
  p.stderr.on('data', (d) => process.stderr.write(`[${name}] ${d}`));
  p.on('exit', (code) => {
    process.stdout.write(`[${name}] exited with code ${code}\n`);
    shutdown();
  });
  procs.push(p);
};

const shutdown = () => {
  while (procs.length) {
    const p = procs.pop();
    if (p && !p.killed) p.kill('SIGTERM');
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

run('backend', 'node', ['server.js']);
run('frontend', 'npm', ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '5173']);
