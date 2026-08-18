import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { requireUser } from '../_auth';
import { query } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  try {
    const userId = requireUser(req);

    if (req.method !== 'PUT' && req.method !== 'PATCH') {
      res.status(405).json({ error: 'PUT 또는 PATCH 요청만 지원합니다.' });
      return;
    }

    const profile = req.body ?? {};
    if (profile.id && profile.id !== userId) {
      res.status(400).json({ error: '본인 프로필만 수정할 수 있습니다.' });
      return;
    }

    await query(
      `UPDATE app_users
       SET profile = $2, name = COALESCE($3, name), avatar_url = COALESCE($4, avatar_url)
       WHERE id = $1`,
      [userId, JSON.stringify({ ...profile, id: userId }), profile.name ?? null, profile.avatarUrl ?? null]
    );

    res.status(200).json({ ok: true });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
