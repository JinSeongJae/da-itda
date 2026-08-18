import { Pool, type PoolConfig } from 'pg';

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

/**
 * Builds the pg pool config from DATABASE_URL, correcting the most common
 * Supabase misconfiguration: pointing the pooler host (6543 / pooler.supabase.com)
 * at the direct-connection username ("postgres"), which Supabase's PgBouncer
 * layer rejects with "password authentication failed for user 'postgres'" even
 * when the password itself is correct — it expects "postgres.<project-ref>".
 */
function buildPoolConfig(): PoolConfig {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error('DATABASE_URL이 올바른 URL 형식이 아닙니다.');
  }

  const isPooler = url.hostname.includes('pooler.supabase.com') || url.port === '6543';
  const isDirect = url.hostname.startsWith('db.') && url.hostname.includes('supabase.co');

  if (isPooler) {
    if (url.username === 'postgres') {
      console.warn(
        '[db] DATABASE_URL이 Supabase 커넥션 풀러(포트 6543 / pooler.supabase.com)를 ' +
          '가리키는데 사용자명이 "postgres"입니다. 풀러는 "postgres.<프로젝트 참조>" 형식의 ' +
          '사용자명이 필요합니다 — Supabase 대시보드 Project Settings → Database → ' +
          'Connection Pooling 탭에서 연결 문자열을 다시 복사해주세요. 이 값 때문에 비밀번호가 ' +
          '맞아도 "password authentication failed for user \'postgres\'"가 발생할 수 있습니다.'
      );
    }
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true');
    }
  } else if (isDirect && url.port && url.port !== '5432' && url.port !== '') {
    console.warn(
      `[db] DATABASE_URL이 다이렉트 연결 호스트(db.*.supabase.co)인데 포트가 ${url.port}입니다. ` +
        '다이렉트 연결은 5432 포트를 사용해야 합니다.'
    );
  }

  return {
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
  };
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool(buildPoolConfig());
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

    ALTER TABLE app_users ADD COLUMN IF NOT EXISTS profile JSONB;

    CREATE TABLE IF NOT EXISTS threads (
      id TEXT PRIMARY KEY,
      user_a_id TEXT NOT NULL,
      user_b_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS threads_user_a_id_idx ON threads(user_a_id);
    CREATE INDEX IF NOT EXISTS threads_user_b_id_idx ON threads(user_b_id);

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE messages ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'text';
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS appointment_id TEXT;

    CREATE INDEX IF NOT EXISTS messages_thread_id_idx ON messages(thread_id);

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      thread_id TEXT NOT NULL,
      match_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      safe_zone_id TEXT NOT NULL,
      purpose TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      qr_token TEXT,
      check_ins JSONB NOT NULL DEFAULT '[]'
    );

    CREATE INDEX IF NOT EXISTS appointments_thread_id_idx ON appointments(thread_id);
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

interface DbTestResult {
  ok: boolean;
  detail: string;
  code?: string;
}

/** Runs a bare SELECT 1 and reports the exact Postgres/driver error — used by api/debug/db.ts. */
export async function testConnection(): Promise<DbTestResult> {
  try {
    await getPool().query('SELECT 1');
    return { ok: true, detail: 'DB 연결에 성공했습니다.' };
  } catch (error) {
    const pgError = error as { code?: string; message?: string };
    const detail = pgError.message ?? (error instanceof Error ? error.message : String(error));
    console.error('[db] connection test failed:', { code: pgError.code, message: detail });
    return { ok: false, detail, code: pgError.code };
  }
}
