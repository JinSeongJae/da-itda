import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { query } from '../_db';

/** TEMP debug endpoint — lists app_users rows so stray test/debug accounts can be identified. Delete after use. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  const rows = await query<{
    id: string;
    kakao_id: string;
    name: string;
    created_at: string;
    profile: unknown;
  }>('SELECT id, kakao_id, name, created_at, profile FROM app_users ORDER BY created_at ASC');

  res.status(200).json({
    users: rows.map((r) => ({
      id: r.id,
      kakaoId: r.kakao_id,
      name: r.name,
      createdAt: r.created_at,
      hasProfile: r.profile !== null,
    })),
  });
}
