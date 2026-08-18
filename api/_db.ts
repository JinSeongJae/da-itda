import { Pool } from 'pg';

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

async function createSchema(): Promise<void> {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      kakao_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS messages_thread_id_idx ON messages(thread_id);
  `);
}

/** Idempotent — safe to call on every cold start. Cached per warm instance. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = createSchema();
  }
  return schemaReady;
}

export async function query<T = any>(text: string, params?: unknown[]): Promise<T[]> {
  await ensureSchema();
  const result = await getPool().query(text, params);
  return result.rows as T[];
}
