import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { query } from '../_db';
import { requireUser } from '../_auth';

interface AppointmentRow {
  id: string;
  thread_id: string;
  match_id: string;
  date: string;
  time: string;
  safe_zone_id: string;
  purpose: string | null;
  status: string;
  created_by: string;
  created_at: string;
  qr_token: string | null;
  check_ins: { userId: string; checkedInAt: string }[];
}

function toAppointmentJson(row: AppointmentRow) {
  return {
    id: row.id,
    matchId: row.match_id,
    threadId: row.thread_id,
    date: row.date,
    time: row.time,
    safeZoneId: row.safe_zone_id,
    purpose: row.purpose ?? undefined,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    qrToken: row.qr_token ?? undefined,
    checkIns: row.check_ins,
  };
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
      // 상대방 기기에서도 홈 배너·채팅 카드·현장 인증이 보이도록, 내가 속한 모든 스레드의 약속을 반환한다.
      const rows = await query<AppointmentRow>(
        `SELECT a.id, a.thread_id, a.match_id, a.date, a.time, a.safe_zone_id, a.purpose,
                a.status, a.created_by, a.created_at, a.qr_token, a.check_ins
         FROM appointments a
         JOIN threads t ON t.id = a.thread_id
         WHERE t.user_a_id = $1 OR t.user_b_id = $1`,
        [userId]
      );
      res.status(200).json({ appointments: rows.map(toAppointmentJson) });
      return;
    }

    if (req.method === 'POST') {
      const { id, threadId, matchId, date, time, safeZoneId, purpose, qrToken } = req.body ?? {};
      if (!id || !threadId || !matchId || !date || !time || !safeZoneId) {
        res.status(400).json({ error: 'id, threadId, matchId, date, time, safeZoneId가 필요합니다.' });
        return;
      }
      await assertParticipant(threadId, userId);

      const rows = await query<AppointmentRow>(
        `INSERT INTO appointments (id, thread_id, match_id, date, time, safe_zone_id, purpose, created_by, qr_token)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING
         RETURNING id, thread_id, match_id, date, time, safe_zone_id, purpose, status, created_by, created_at, qr_token, check_ins`,
        [id, threadId, matchId, date, time, safeZoneId, purpose ?? null, userId, qrToken ?? null]
      );

      if (!rows[0]) {
        const existing = await query<AppointmentRow>(
          `SELECT id, thread_id, match_id, date, time, safe_zone_id, purpose, status, created_by, created_at, qr_token, check_ins
           FROM appointments WHERE id = $1`,
          [id]
        );
        res.status(200).json({ appointment: toAppointmentJson(existing[0]) });
        return;
      }

      res.status(201).json({ appointment: toAppointmentJson(rows[0]) });
      return;
    }

    res.status(405).json({ error: 'GET 또는 POST 요청만 지원합니다.' });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
