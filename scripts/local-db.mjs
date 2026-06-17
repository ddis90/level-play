// Boots a throwaway embedded PostgreSQL for local verification only.
// Not used in dev/prd runs — those use the real DATABASE_URL. Run:
//   node scripts/local-db.mjs start   # starts pg, prints DATABASE_URL
//   node scripts/local-db.mjs stop    # stops it
import EmbeddedPostgres from 'embedded-postgres';
import path from 'node:path';
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

const action = process.argv[2];

if (action === 'start') {
  const fs = await import('node:fs');
  if (!fs.existsSync(dataDir)) {
    await pg.initialise();
  }
  await pg.start();
  try {
    await pg.createDatabase('levelplay');
  } catch {
    // already exists — fine
  }
  console.log(
    `DATABASE_URL=postgresql://postgres:postgres@localhost:${PORT}/levelplay?schema=public`,
  );
  process.exit(0);
} else if (action === 'stop') {
  try {
    await pg.stop();
  } catch {}
  process.exit(0);
} else {
  console.error('usage: node scripts/local-db.mjs start|stop');
  process.exit(1);
}
