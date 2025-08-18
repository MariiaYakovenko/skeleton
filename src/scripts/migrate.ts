import { readFileSync } from 'fs';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'node:path';
import * as process from 'node:process';
import { existsSync } from 'node:fs';

dotenv.config();

async function main() {
  const filePath = [path.resolve(process.cwd(), 'migrations/001_init.sql'),
    path.resolve(process.cwd(), 'src/migrations/001_init.sql')].find((file) => existsSync(file));
  if (!filePath) {
    return;
  }

  const sql = readFileSync(filePath, 'utf8');
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  try {
    await pool.query(sql);
  } catch (e) {
    throw e;
  } finally {
    await pool.end();
    console.log('migration complete');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
