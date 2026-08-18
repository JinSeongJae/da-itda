import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { testConnection } from '../_db';

/**
 * GET /api/debug/db — quick diagnostic for DATABASE_URL connectivity.
 * Reports the exact Postgres/driver error (not the connection string itself)
 * so a misconfigured pooler/direct-connection setting shows up immediately
 * instead of surfacing only as a generic 500 during Kakao login.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  const result = await testConnection();
  res.status(result.ok ? 200 : 500).json(result);
}
