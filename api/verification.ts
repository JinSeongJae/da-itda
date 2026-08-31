import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { applyCors } from './_cors';
import { query } from './_db';
import { requireUser } from './_auth';
import { generateId } from './_id';
import { analyzeIdDocument } from './_gemini';
import { maskRegion } from './_imageMask';
import { sendPushToUser } from './_push';
import { isAdminUser } from '../constants/admin';

const MAX_BYTES = 8 * 1024 * 1024;

interface VerificationRow {
  id: string;
  user_id: string;
  document_type: string;
  masked_image_url: string;
  birth_date: string | null;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  applicant_name?: string;
  applicant_avatar_url?: string;
}

interface ReportRow {
  id: string;
  reporter_id: string;
  target_user_id: string;
  reason: string;
  detail: string | null;
  thread_id: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  reporter_name?: string;
  target_name?: string;
}

function toVerificationJson(row: VerificationRow) {
  return {
    id: row.id,
    userId: row.user_id,
    documentType: row.document_type,
    maskedImageUrl: row.masked_image_url,
    birthDate: row.birth_date ?? undefined,
    status: row.status,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at ?? undefined,
    applicantName: row.applicant_name,
    applicantAvatarUrl: row.applicant_avatar_url,
  };
}

function toReportJson(row: ReportRow) {
  return {
    id: row.id,
    reporterId: row.reporter_id,
    targetUserId: row.target_user_id,
    reason: row.reason,
    detail: row.detail ?? undefined,
    threadId: row.thread_id ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    reporterName: row.reporter_name,
    targetName: row.target_name,
  };
}

function calculateAge(birthDateIso: string): number {
  const birth = new Date(birthDateIso);
  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - birth.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  // TEMP(2026-08-31): 일회성 발표용 스크린샷 세팅 — 사용 직후 제거할 것.
  if (req.method === 'POST' && req.body?.resource === 'debug-bestfriend') {
    const { selfId, counterpartId } = req.body ?? {};
    if (!selfId || !counterpartId) {
      res.status(400).json({ error: 'selfId, counterpartId가 필요합니다.' });
      return;
    }

    const existing = await query<{ id: string }>(
      `SELECT id FROM threads WHERE (user_a_id = $1 AND user_b_id = $2) OR (user_a_id = $2 AND user_b_id = $1)`,
      [selfId, counterpartId]
    );
    let threadId = existing[0]?.id;
    if (!threadId) {
      threadId = `thread_${crypto.randomUUID()}`;
      await query(`INSERT INTO threads (id, user_a_id, user_b_id) VALUES ($1, $2, $3)`, [
        threadId,
        selfId,
        counterpartId,
      ]);
    }

    await query(
      `INSERT INTO messages (id, thread_id, sender_id, text) VALUES ($1, $2, $3, $4)`,
      [`msg_${crypto.randomUUID()}`, threadId, counterpartId, '오늘 정말 즐거웠어요! 다음에 또 봐요 :)']
    );

    await query(
      `UPDATE app_users
       SET profile = jsonb_set(
         jsonb_set(profile, '{badges}',
           CASE WHEN profile->'badges' @> '["best-friend-neighbor"]'::jsonb
                THEN profile->'badges'
                ELSE COALESCE(profile->'badges', '[]'::jsonb) || '["best-friend-neighbor"]'::jsonb
           END),
         '{bestFriendNeighborIds}',
         CASE WHEN profile->'bestFriendNeighborIds' @> $2::jsonb
              THEN profile->'bestFriendNeighborIds'
              ELSE COALESCE(profile->'bestFriendNeighborIds', '[]'::jsonb) || $2::jsonb
         END
       )
       WHERE id = $1`,
      [selfId, JSON.stringify([counterpartId])]
    );

    res.status(200).json({ ok: true, threadId });
    return;
  }

  try {
    const userId = requireUser(req);
    const resource = (req.method === 'GET' ? req.query.resource : req.body?.resource) as string | undefined;

    // ---------------- 신원 인증 ----------------
    if (resource === 'verification' || resource === undefined) {
      if (req.method === 'GET') {
        if (isAdminUser(userId)) {
          const rows = await query<VerificationRow>(
            `SELECT v.id, v.user_id, v.document_type, v.masked_image_url, v.birth_date, v.status,
                    v.submitted_at, v.reviewed_at, v.reviewed_by,
                    u.profile->>'name' AS applicant_name, u.profile->>'avatarUrl' AS applicant_avatar_url
             FROM verification_requests v
             LEFT JOIN app_users u ON u.id = v.user_id
             WHERE v.status = 'pending'
             ORDER BY v.submitted_at ASC`
          );
          res.status(200).json({ requests: rows.map(toVerificationJson) });
          return;
        }

        const rows = await query<VerificationRow>(
          `SELECT id, user_id, document_type, masked_image_url, birth_date, status, submitted_at, reviewed_at, reviewed_by
           FROM verification_requests WHERE user_id = $1 ORDER BY submitted_at DESC LIMIT 1`,
          [userId]
        );
        res.status(200).json({ request: rows[0] ? toVerificationJson(rows[0]) : null });
        return;
      }

      if (req.method === 'POST') {
        const { documentType, base64, contentType } = req.body ?? {};
        if (!documentType || !base64 || typeof base64 !== 'string' || !contentType) {
          res.status(400).json({ error: 'documentType, base64, contentType이 필요합니다.' });
          return;
        }

        const buffer = Buffer.from(base64, 'base64');
        if (buffer.byteLength > MAX_BYTES) {
          res.status(413).json({ error: '이미지 용량이 너무 큽니다.' });
          return;
        }

        let analysis;
        try {
          analysis = await analyzeIdDocument(base64, contentType);
        } catch (e) {
          console.error('[verification] analyzeIdDocument failed:', e);
          res.status(502).json({ error: e instanceof Error ? e.message : 'AI 분석에 실패했습니다.' });
          return;
        }

        // 번호를 못 찾으면(=마스킹할 위치를 모르면) 절대로 저장하지 않는다 — fail closed.
        if (!analysis.found || !analysis.box) {
          res.status(422).json({ error: '신분증에서 번호를 찾지 못했어요. 번호가 잘 보이도록 다시 촬영해주세요.' });
          return;
        }

        if (analysis.birthDate) {
          const age = calculateAge(analysis.birthDate);
          if (age < 19) {
            res.status(403).json({ error: '미성년자는 다잇다에 가입할 수 없어요.', reason: 'minor' });
            return;
          }
        }

        const masked = await maskRegion(buffer, analysis.box);
        const blob = await put(`verification/${userId}/${Date.now()}.jpg`, masked, {
          access: 'public',
          contentType: 'image/jpeg',
          addRandomSuffix: true,
        });

        const id = generateId('verification');
        const rows = await query<VerificationRow>(
          `INSERT INTO verification_requests (id, user_id, document_type, masked_image_url, birth_date, status)
           VALUES ($1, $2, $3, $4, $5, 'pending')
           RETURNING id, user_id, document_type, masked_image_url, birth_date, status, submitted_at, reviewed_at, reviewed_by`,
          [id, userId, documentType, blob.url, analysis.birthDate ?? null]
        );

        await query(
          `UPDATE app_users SET profile = jsonb_set(profile, '{verification}', '"pending"') WHERE id = $1`,
          [userId]
        );

        res.status(201).json({ request: toVerificationJson(rows[0]) });
        return;
      }

      if (req.method === 'PATCH') {
        if (!isAdminUser(userId)) {
          res.status(403).json({ error: '운영자만 처리할 수 있습니다.' });
          return;
        }
        const { id, action } = req.body ?? {};
        if (!id || (action !== 'approve' && action !== 'reject')) {
          res.status(400).json({ error: "id와 action('approve'|'reject')이 필요합니다." });
          return;
        }

        const rows = await query<VerificationRow>(
          'SELECT id, user_id, status FROM verification_requests WHERE id = $1',
          [id]
        );
        const request = rows[0];
        if (!request) {
          res.status(404).json({ error: '요청을 찾을 수 없습니다.' });
          return;
        }

        const newStatus = action === 'approve' ? 'verified' : 'rejected';
        await query(
          `UPDATE verification_requests SET status = $2, reviewed_at = now(), reviewed_by = $3 WHERE id = $1`,
          [id, newStatus, userId]
        );

        if (action === 'approve') {
          await query(
            `UPDATE app_users
             SET profile = jsonb_set(
               jsonb_set(profile, '{verification}', '"verified"'),
               '{badges}',
               CASE WHEN profile->'badges' @> '["safe-verified"]'::jsonb
                    THEN profile->'badges'
                    ELSE COALESCE(profile->'badges', '[]'::jsonb) || '["safe-verified"]'::jsonb
               END
             )
             WHERE id = $1`,
            [request.user_id]
          );
          await sendPushToUser(request.user_id, '안심인증 완료!', '신분증 인증이 승인됐어요. 이제 약속을 잡을 수 있어요.', {
            type: 'verification-approved',
          });
        } else {
          await query(
            `UPDATE app_users SET profile = jsonb_set(profile, '{verification}', '"rejected"') WHERE id = $1`,
            [request.user_id]
          );
          await sendPushToUser(request.user_id, '안심인증 반려', '제출한 신분증을 다시 확인하고 재제출해주세요.', {
            type: 'verification-rejected',
          });
        }

        res.status(200).json({ ok: true, status: newStatus });
        return;
      }

      res.status(405).json({ error: 'GET, POST 또는 PATCH 요청만 지원합니다.' });
      return;
    }

    // ---------------- 신고 ----------------
    if (resource === 'report') {
      if (req.method === 'POST') {
        const { targetUserId, reason, detail, threadId } = req.body ?? {};
        if (!targetUserId || !reason) {
          res.status(400).json({ error: 'targetUserId, reason이 필요합니다.' });
          return;
        }
        const id = generateId('report');
        await query(
          `INSERT INTO reports (id, reporter_id, target_user_id, reason, detail, thread_id)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, userId, targetUserId, reason, detail ?? null, threadId ?? null]
        );
        res.status(201).json({ ok: true });
        return;
      }

      if (req.method === 'GET') {
        if (!isAdminUser(userId)) {
          res.status(403).json({ error: '운영자만 볼 수 있습니다.' });
          return;
        }
        const rows = await query<ReportRow>(
          `SELECT r.id, r.reporter_id, r.target_user_id, r.reason, r.detail, r.thread_id, r.status, r.created_at,
                  r.resolved_at, r.resolved_by,
                  ru.profile->>'name' AS reporter_name, tu.profile->>'name' AS target_name
           FROM reports r
           LEFT JOIN app_users ru ON ru.id = r.reporter_id
           LEFT JOIN app_users tu ON tu.id = r.target_user_id
           WHERE r.status = 'open'
           ORDER BY r.created_at ASC`
        );
        res.status(200).json({ reports: rows.map(toReportJson) });
        return;
      }

      if (req.method === 'PATCH') {
        if (!isAdminUser(userId)) {
          res.status(403).json({ error: '운영자만 처리할 수 있습니다.' });
          return;
        }
        const { id, action } = req.body ?? {};
        if (!id || (action !== 'resolve' && action !== 'dismiss')) {
          res.status(400).json({ error: "id와 action('resolve'|'dismiss')이 필요합니다." });
          return;
        }
        await query(
          `UPDATE reports SET status = $2, resolved_at = now(), resolved_by = $3 WHERE id = $1`,
          [id, action === 'resolve' ? 'resolved' : 'dismissed', userId]
        );
        res.status(200).json({ ok: true });
        return;
      }

      res.status(405).json({ error: 'GET, POST 또는 PATCH 요청만 지원합니다.' });
      return;
    }

    res.status(400).json({ error: "resource('verification'|'report')가 필요합니다." });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
