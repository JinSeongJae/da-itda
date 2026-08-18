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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 지원합니다.' });
    return;
  }

  try {
    const userId = requireUser(req);
    const { appointmentId } = req.body ?? {};
    if (!appointmentId) {
      res.status(400).json({ error: 'appointmentId가 필요합니다.' });
      return;
    }

    const rows = await query<AppointmentRow>(
      `SELECT a.id, a.thread_id, a.match_id, a.date, a.time, a.safe_zone_id, a.purpose,
              a.status, a.created_by, a.created_at, a.qr_token, a.check_ins
       FROM appointments a
       JOIN threads t ON t.id = a.thread_id
       WHERE a.id = $1 AND (t.user_a_id = $2 OR t.user_b_id = $2)`,
      [appointmentId, userId]
    );
    const appointment = rows[0];
    if (!appointment) {
      res.status(403).json({ error: '이 약속에 접근할 권한이 없습니다.' });
      return;
    }

    const alreadyCheckedIn = appointment.check_ins.some((c) => c.userId === userId);
    const checkIns = alreadyCheckedIn
      ? appointment.check_ins
      : [...appointment.check_ins, { userId, checkedInAt: new Date().toISOString() }];

    const updated = await query<AppointmentRow>(
      `UPDATE appointments SET status = 'checked-in', check_ins = $2::jsonb
       WHERE id = $1
       RETURNING id, thread_id, match_id, date, time, safe_zone_id, purpose, status, created_by, created_at, qr_token, check_ins`,
      [appointmentId, JSON.stringify(checkIns)]
    );

    res.status(200).json({ appointment: toAppointmentJson(updated[0]) });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
