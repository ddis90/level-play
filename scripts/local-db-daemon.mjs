// Starts embedded PostgreSQL and KEEPS RUNNING until killed (for local verify).
// Use via: node scripts/local-db-daemon.mjs   (run in background)
import EmbeddedPostgres from 'embedded-postgres';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', '.localpg');
const PORT = 55432;

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: PORT,
  persistent: true,
});

if (!fs.existsSync(dataDir)) {
  await pg.initialise();
}
await pg.start();
try {
  await pg.createDatabase('levelplay');
} catch {}

console.log(`READY postgresql://postgres:postgres@localhost:${PORT}/levelplay?schema=public`);

// Stay alive and shut down cleanly on signal.
async function shutdown() {
  try { await pg.stop(); } catch {}
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
setInterval(() => {}, 1 << 30); // keep the event loop busy
