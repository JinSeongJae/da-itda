import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { query, testConnection } from '../_db';

/**
 * GET /api/debug/db — quick diagnostic for DATABASE_URL connectivity.
 * Reports the exact Postgres/driver error (not the connection string itself)
 * so a misconfigured pooler/direct-connection setting shows up immediately
 * instead of surfacing only as a generic 500 during Kakao login.
 *
 * GET /api/debug/db?list=1 — TEMP: lists app_users so stray test/debug accounts can be
 * identified. Folded into this existing function (not a new file) because Hobby caps
 * @vercel/node projects at 12 Vercel Functions per deployment — remove this branch after use.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (typeof req.query.relatedTo === 'string') {
    const id = req.query.relatedTo;
    const [threads, messages, appointments, pins] = await Promise.all([
      query<{ count: string }>(
        'SELECT count(*) FROM threads WHERE user_a_id = $1 OR user_b_id = $1',
        [id]
      ),
      query<{ count: string }>('SELECT count(*) FROM messages WHERE sender_id = $1', [id]),
      query<{ count: string }>('SELECT count(*) FROM appointments WHERE created_by = $1', [id]),
      query<{ count: string }>('SELECT count(*) FROM cultural_pins WHERE author_id = $1', [id]),
    ]);
    res.status(200).json({
      id,
      threads: Number(threads[0].count),
      messages: Number(messages[0].count),
      appointments: Number(appointments[0].count),
      culturalPins: Number(pins[0].count),
    });
    return;
  }

  if (req.method === 'DELETE' && typeof req.query.deleteUser === 'string') {
    const id = req.query.deleteUser;
    await query('DELETE FROM messages WHERE sender_id = $1', [id]);
    await query('DELETE FROM threads WHERE user_a_id = $1 OR user_b_id = $1', [id]);
    await query('DELETE FROM appointments WHERE created_by = $1', [id]);
    await query('DELETE FROM cultural_pins WHERE author_id = $1', [id]);
    const deleted = await query<{ id: string }>('DELETE FROM app_users WHERE id = $1 RETURNING id', [id]);
    res.status(200).json({ deleted: deleted.length > 0, id });
    return;
  }

  if (req.query.list) {
    const rows = await query<{ id: string; kakao_id: string; name: string; created_at: string; profile: unknown }>(
      'SELECT id, kakao_id, name, created_at, profile FROM app_users ORDER BY created_at ASC'
    );
    res.status(200).json({
      users: rows.map((r) => ({
        id: r.id,
        kakaoId: r.kakao_id,
        name: r.name,
        createdAt: r.created_at,
        hasProfile: r.profile !== null,
      })),
    });
    return;
  }

  const result = await testConnection();
  res.status(result.ok ? 200 : 500).json(result);
}
