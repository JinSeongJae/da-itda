import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { requireUser } from '../_auth';
import { query } from '../_db';
import { generateId } from '../_id';

interface ThreadRow {
  id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: string;
}

function toThreadJson(row: ThreadRow) {
  return {
    id: row.id,
    participantIds: [row.user_a_id, row.user_b_id],
    createdAt: row.created_at,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  try {
    const userId = requireUser(req);

    if (req.method === 'GET') {
      const rows = await query<ThreadRow>(
        'SELECT id, user_a_id, user_b_id, created_at FROM threads WHERE user_a_id = $1 OR user_b_id = $1',
        [userId]
      );
      res.status(200).json({ threads: rows.map(toThreadJson) });
      return;
    }

    if (req.method === 'POST') {
      const { counterpartId } = req.body ?? {};
      if (!counterpartId || typeof counterpartId !== 'string') {
        res.status(400).json({ error: 'counterpartId가 필요합니다.' });
        return;
      }
      if (counterpartId === userId) {
        res.status(400).json({ error: '자기 자신과는 채팅방을 만들 수 없습니다.' });
        return;
      }

      const existing = await query<ThreadRow>(
        `SELECT id, user_a_id, user_b_id, created_at FROM threads
         WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)`,
        [userId, counterpartId]
      );
      if (existing[0]) {
        res.status(200).json({ thread: toThreadJson(existing[0]) });
        return;
      }

      const rows = await query<ThreadRow>(
        `INSERT INTO threads (id, user_a_id, user_b_id)
         VALUES ($1, $2, $3)
         RETURNING id, user_a_id, user_b_id, created_at`,
        [generateId('thread'), userId, counterpartId]
      );

      res.status(201).json({ thread: toThreadJson(rows[0]) });
      return;
    }

    res.status(405).json({ error: 'GET 또는 POST 요청만 지원합니다.' });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
