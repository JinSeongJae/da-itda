import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { query } from '../_db';
import { requireUser } from '../_auth';

interface MessageRow {
  id: string;
  thread_id: string;
  sender_id: string;
  text: string;
  created_at: string;
}

async function assertParticipant(threadId: string, userId: string): Promise<void> {
  const rows = await query<{ id: string }>(
    'SELECT id FROM threads WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2)',
    [threadId, userId]
  );
  if (!rows[0]) {
    throw Object.assign(new Error('이 채팅방에 접근할 권한이 없습니다.'), { statusCode: 403 });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  try {
    const userId = requireUser(req);

    if (req.method === 'GET') {
      const threadId = typeof req.query.threadId === 'string' ? req.query.threadId : undefined;
      if (!threadId) {
        res.status(400).json({ error: 'threadId 쿼리 파라미터가 필요합니다.' });
        return;
      }
      await assertParticipant(threadId, userId);

      const rows = await query<MessageRow>(
        `SELECT id, thread_id, sender_id, text, created_at
         FROM messages WHERE thread_id = $1 ORDER BY created_at ASC`,
        [threadId]
      );

      res.status(200).json({
        messages: rows.map((row) => ({
          id: row.id,
          threadId: row.thread_id,
          senderId: row.sender_id,
          text: row.text,
          createdAt: row.created_at,
        })),
      });
      return;
    }

    if (req.method === 'POST') {
      const { id, threadId, senderId, text, createdAt } = req.body ?? {};
      if (!id || !threadId || !senderId || !text) {
        res.status(400).json({ error: 'id, threadId, senderId, text가 필요합니다.' });
        return;
      }
      await assertParticipant(threadId, userId);

      await query(
        `INSERT INTO messages (id, thread_id, sender_id, text, created_at)
         VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, now()))
         ON CONFLICT (id) DO NOTHING`,
        [id, threadId, senderId, text, createdAt ?? null]
      );

      res.status(201).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'GET 또는 POST 요청만 지원합니다.' });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
