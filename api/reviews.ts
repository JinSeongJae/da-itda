import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from './_cors';
import { query } from './_db';
import { requireUser } from './_auth';

interface ReviewRow {
  id: string;
  appointment_id: string;
  reviewer_id: string;
  met_at_safe_zone: boolean;
  exchange_went_well: boolean;
  had_uncomfortable_incident: boolean;
  submitted_at: string;
}

function toReviewJson(row: ReviewRow) {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    reviewerId: row.reviewer_id,
    metAtSafeZone: row.met_at_safe_zone,
    exchangeWentWell: row.exchange_went_well,
    hadUncomfortableIncident: row.had_uncomfortable_incident,
    submittedAt: row.submitted_at,
  };
}

async function assertAppointmentParticipant(appointmentId: string, userId: string): Promise<void> {
  const rows = await query<{ id: string }>(
    `SELECT a.id FROM appointments a
     JOIN threads t ON t.id = a.thread_id
     WHERE a.id = $1 AND (t.user_a_id = $2 OR t.user_b_id = $2)`,
    [appointmentId, userId]
  );
  if (!rows[0]) {
    throw Object.assign(new Error('이 약속에 접근할 권한이 없습니다.'), { statusCode: 403 });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  try {
    const userId = requireUser(req);

    if (req.method === 'GET') {
      const appointmentId = req.query.appointmentId;
      if (typeof appointmentId !== 'string') {
        res.status(400).json({ error: 'appointmentId가 필요합니다.' });
        return;
      }
      await assertAppointmentParticipant(appointmentId, userId);

      const rows = await query<ReviewRow>(
        `SELECT id, appointment_id, reviewer_id, met_at_safe_zone, exchange_went_well, had_uncomfortable_incident, submitted_at
         FROM reviews WHERE appointment_id = $1`,
        [appointmentId]
      );
      res.status(200).json({ reviews: rows.map(toReviewJson) });
      return;
    }

    if (req.method === 'POST') {
      const { id, appointmentId, metAtSafeZone, exchangeWentWell, hadUncomfortableIncident } = req.body ?? {};
      if (
        !id ||
        !appointmentId ||
        typeof metAtSafeZone !== 'boolean' ||
        typeof exchangeWentWell !== 'boolean' ||
        typeof hadUncomfortableIncident !== 'boolean'
      ) {
        res.status(400).json({ error: 'id, appointmentId와 체크리스트 답변이 필요합니다.' });
        return;
      }
      await assertAppointmentParticipant(appointmentId, userId);

      const rows = await query<ReviewRow>(
        `INSERT INTO reviews (id, appointment_id, reviewer_id, met_at_safe_zone, exchange_went_well, had_uncomfortable_incident)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (appointment_id, reviewer_id)
         DO UPDATE SET met_at_safe_zone = EXCLUDED.met_at_safe_zone,
                       exchange_went_well = EXCLUDED.exchange_went_well,
                       had_uncomfortable_incident = EXCLUDED.had_uncomfortable_incident,
                       submitted_at = now()
         RETURNING id, appointment_id, reviewer_id, met_at_safe_zone, exchange_went_well, had_uncomfortable_incident, submitted_at`,
        // reviewer_id는 토큰의 userId로 강제한다 — 클라이언트가 남의 이름으로 리뷰를 남길 수 없도록.
        [id, appointmentId, userId, metAtSafeZone, exchangeWentWell, hadUncomfortableIncident]
      );
      res.status(201).json({ review: toReviewJson(rows[0]) });
      return;
    }

    res.status(405).json({ error: 'GET 또는 POST 요청만 지원합니다.' });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
