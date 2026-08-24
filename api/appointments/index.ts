import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { query } from '../_db';
import { requireUser } from '../_auth';
import { sendPushToUser } from '../_push';

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

async function assertParticipant(threadId: string, userId: string): Promise<string[]> {
  const rows = await query<{ id: string; user_a_id: string; user_b_id: string }>(
    'SELECT id, user_a_id, user_b_id FROM threads WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2)',
    [threadId, userId]
  );
  if (!rows[0]) {
    throw Object.assign(new Error('이 채팅방에 접근할 권한이 없습니다.'), { statusCode: 403 });
  }
  return [rows[0].user_a_id, rows[0].user_b_id];
}

async function notifyAppointmentEvent(
  actorId: string,
  recipientId: string,
  title: string,
  bodyTemplate: (actorName: string) => string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const rows = await query<{ name: string | null }>(
      "SELECT profile->>'name' AS name FROM app_users WHERE id = $1",
      [actorId]
    );
    const actorName = rows[0]?.name ?? '이웃';
    await sendPushToUser(recipientId, title, bodyTemplate(actorName), data);
  } catch {
    // 알림 발송 실패는 약속 처리 자체를 막지 않는다.
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
      const participantIds = await assertParticipant(threadId, userId);

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

      const recipientId = participantIds.find((pid) => pid !== userId);
      if (recipientId) {
        await notifyAppointmentEvent(
          userId,
          recipientId,
          '새로운 약속 제안',
          (name) => `${name}님이 ${date} ${time}에 만나자고 제안했어요.`,
          { type: 'appointment-proposed', appointmentId: rows[0].id }
        );
      }

      res.status(201).json({ appointment: toAppointmentJson(rows[0]) });
      return;
    }

    if (req.method === 'PATCH') {
      const { id, action } = req.body ?? {};
      if (!id || (action !== 'accept' && action !== 'reject' && action !== 'checkin')) {
        res.status(400).json({ error: "id와 action('accept'|'reject'|'checkin')이 필요합니다." });
        return;
      }

      const rows = await query<AppointmentRow & { user_a_id: string; user_b_id: string }>(
        `SELECT a.id, a.created_by, a.status, a.check_ins, t.user_a_id, t.user_b_id
         FROM appointments a
         JOIN threads t ON t.id = a.thread_id
         WHERE a.id = $1 AND (t.user_a_id = $2 OR t.user_b_id = $2)`,
        [id, userId]
      );
      const appointment = rows[0];
      if (!appointment) {
        res.status(403).json({ error: '이 약속에 접근할 권한이 없습니다.' });
        return;
      }
      const counterpartId = appointment.user_a_id === userId ? appointment.user_b_id : appointment.user_a_id;

      if (action === 'checkin') {
        const alreadyCheckedIn = appointment.check_ins.some((c) => c.userId === userId);
        const checkIns = alreadyCheckedIn
          ? appointment.check_ins
          : [...appointment.check_ins, { userId, checkedInAt: new Date().toISOString() }];

        const updated = await query<AppointmentRow>(
          `UPDATE appointments SET status = 'checked-in', check_ins = $2::jsonb WHERE id = $1
           RETURNING id, thread_id, match_id, date, time, safe_zone_id, purpose, status, created_by, created_at, qr_token, check_ins`,
          [id, JSON.stringify(checkIns)]
        );
        if (!alreadyCheckedIn) {
          await notifyAppointmentEvent(
            userId,
            counterpartId,
            '현장 인증 완료',
            (name) => `${name}님이 QR 체크인을 완료했어요. 상대방도 체크인해주세요.`,
            { type: 'appointment-checkin', appointmentId: id }
          );
        }
        res.status(200).json({ appointment: toAppointmentJson(updated[0]) });
        return;
      }

      // accept/reject: 약속을 제안한 본인은 스스로 응답할 수 없다 — 상대방만 응답할 수 있다.
      if (appointment.created_by === userId) {
        res.status(400).json({ error: '본인이 제안한 약속은 응답할 수 없습니다.' });
        return;
      }
      if (appointment.status !== 'pending') {
        res.status(409).json({ error: '이미 응답이 처리된 약속입니다.' });
        return;
      }

      const newStatus = action === 'accept' ? 'confirmed' : 'cancelled';
      const updated = await query<AppointmentRow>(
        `UPDATE appointments SET status = $2 WHERE id = $1
         RETURNING id, thread_id, match_id, date, time, safe_zone_id, purpose, status, created_by, created_at, qr_token, check_ins`,
        [id, newStatus]
      );
      await notifyAppointmentEvent(
        userId,
        appointment.created_by,
        action === 'accept' ? '약속이 확정됐어요!' : '약속이 거절됐어요',
        (name) =>
          action === 'accept' ? `${name}님이 약속을 수락했어요.` : `${name}님이 약속을 수락하지 않았어요.`,
        { type: action === 'accept' ? 'appointment-accepted' : 'appointment-rejected', appointmentId: id }
      );
      res.status(200).json({ appointment: toAppointmentJson(updated[0]) });
      return;
    }

    res.status(405).json({ error: 'GET, POST 또는 PATCH 요청만 지원합니다.' });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
