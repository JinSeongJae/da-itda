import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../../_cors';
import { query } from '../../_db';
import { requireUser } from '../../_auth';
import { haversineDistanceKm } from '../../../utils/distance';

const VERIFICATION_MAX_DISTANCE_KM = 0.2;
const VERIFICATION_REWARD_POINTS = 15;

interface PinRow {
  id: string;
  author_id: string;
  title: string;
  story: string;
  category: string;
  lat: number;
  lng: number;
  address: string | null;
  created_at: string;
  verifications: { userId: string; verifiedAt: string }[];
}

function toPinJson(row: PinRow) {
  return {
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    story: row.story,
    category: row.category,
    lat: row.lat,
    lng: row.lng,
    address: row.address ?? undefined,
    createdAt: row.created_at,
    verifications: row.verifications,
  };
}

interface PostRow {
  id: string;
  author_id: string;
  category: string;
  title: string;
  body: string;
  created_at: string;
}

function toPostJson(row: PostRow) {
  return {
    id: row.id,
    authorId: row.author_id,
    category: row.category,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
  };
}

interface MicroGroupRow {
  id: string;
  author_id: string;
  title: string;
  location: string;
  meetup_date: string;
  category: string;
  max_participants: number;
  interested_user_ids: string[];
  created_at: string;
}

function toMicroGroupJson(row: MicroGroupRow) {
  return {
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    location: row.location,
    date: row.meetup_date,
    category: row.category,
    maxParticipants: row.max_participants,
    interestedUserIds: row.interested_user_ids,
  };
}

/**
 * Vercel Hobby의 함수 12개 제한 때문에, 커뮤니티 게시판 글쓰기와 동네 소모임 만들기 기능도
 * 새 파일 대신 이 엔드포인트에 resource 파라미터로 합쳤다 — api/verification.ts에서 이미
 * verification/report를 같은 방식으로 합친 것과 동일한 패턴.
 */
type Resource = 'cultural-pin' | 'post' | 'micro-group';

function resolveResource(value: unknown): Resource {
  return value === 'post' || value === 'micro-group' ? value : 'cultural-pin';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  try {
    const userId = requireUser(req);

    if (req.method === 'GET') {
      const resource = resolveResource(req.query.resource);

      if (resource === 'post') {
        const rows = await query<PostRow>(
          `SELECT id, author_id, category, title, body, created_at
           FROM community_posts ORDER BY created_at DESC LIMIT 200`
        );
        res.status(200).json({ posts: rows.map(toPostJson) });
        return;
      }

      if (resource === 'micro-group') {
        const rows = await query<MicroGroupRow>(
          `SELECT id, author_id, title, location, meetup_date, category, max_participants, interested_user_ids, created_at
           FROM micro_groups ORDER BY meetup_date ASC`
        );
        res.status(200).json({ microGroups: rows.map(toMicroGroupJson) });
        return;
      }

      const rows = await query<PinRow>(
        `SELECT id, author_id, title, story, category, lat, lng, address, created_at, verifications
         FROM cultural_pins ORDER BY created_at DESC`
      );
      res.status(200).json({ pins: rows.map(toPinJson) });
      return;
    }

    if (req.method === 'POST') {
      const resource = resolveResource((req.body ?? {}).resource);

      if (resource === 'post') {
        const { id, category, title, body } = req.body ?? {};
        if (!id || !category || !title || !body) {
          res.status(400).json({ error: 'id, category, title, body가 필요합니다.' });
          return;
        }

        const rows = await query<PostRow>(
          `INSERT INTO community_posts (id, author_id, category, title, body)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING
           RETURNING id, author_id, category, title, body, created_at`,
          [id, userId, category, title, body]
        );

        if (!rows[0]) {
          const existing = await query<PostRow>(
            `SELECT id, author_id, category, title, body, created_at FROM community_posts WHERE id = $1`,
            [id]
          );
          res.status(200).json({ post: toPostJson(existing[0]) });
          return;
        }

        res.status(201).json({ post: toPostJson(rows[0]) });
        return;
      }

      if (resource === 'micro-group') {
        const { id, title, location, date, category, maxParticipants } = req.body ?? {};
        if (!id || !title || !location || !date || !category || typeof maxParticipants !== 'number') {
          res.status(400).json({ error: 'id, title, location, date, category, maxParticipants가 필요합니다.' });
          return;
        }

        const rows = await query<MicroGroupRow>(
          `INSERT INTO micro_groups (id, author_id, title, location, meetup_date, category, max_participants, interested_user_ids)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
           ON CONFLICT (id) DO NOTHING
           RETURNING id, author_id, title, location, meetup_date, category, max_participants, interested_user_ids, created_at`,
          [id, userId, title, location, date, category, maxParticipants, JSON.stringify([userId])]
        );

        if (!rows[0]) {
          const existing = await query<MicroGroupRow>(
            `SELECT id, author_id, title, location, meetup_date, category, max_participants, interested_user_ids, created_at
             FROM micro_groups WHERE id = $1`,
            [id]
          );
          res.status(200).json({ microGroup: toMicroGroupJson(existing[0]) });
          return;
        }

        res.status(201).json({ microGroup: toMicroGroupJson(rows[0]) });
        return;
      }

      const { id, title, story, category, lat, lng, address } = req.body ?? {};
      if (!id || !title || !story || !category || typeof lat !== 'number' || typeof lng !== 'number') {
        res.status(400).json({ error: 'id, title, story, category, lat, lng가 필요합니다.' });
        return;
      }

      const rows = await query<PinRow>(
        `INSERT INTO cultural_pins (id, author_id, title, story, category, lat, lng, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING
         RETURNING id, author_id, title, story, category, lat, lng, address, created_at, verifications`,
        [id, userId, title, story, category, lat, lng, address ?? null]
      );

      if (!rows[0]) {
        const existing = await query<PinRow>(
          `SELECT id, author_id, title, story, category, lat, lng, address, created_at, verifications
           FROM cultural_pins WHERE id = $1`,
          [id]
        );
        res.status(200).json({ pin: toPinJson(existing[0]) });
        return;
      }

      res.status(201).json({ pin: toPinJson(rows[0]) });
      return;
    }

    if (req.method === 'PATCH') {
      const resource = resolveResource((req.body ?? {}).resource);

      if (resource === 'post') {
        const { id, action } = req.body ?? {};
        if (typeof id !== 'string' || action !== 'delete') {
          res.status(400).json({ error: "id와 action('delete')이 필요합니다." });
          return;
        }
        const rows = await query<PostRow>('SELECT id, author_id FROM community_posts WHERE id = $1', [id]);
        if (!rows[0]) {
          res.status(404).json({ error: '글을 찾을 수 없습니다.' });
          return;
        }
        if (rows[0].author_id !== userId) {
          res.status(403).json({ error: '본인이 쓴 글만 삭제할 수 있습니다.' });
          return;
        }
        await query('DELETE FROM community_posts WHERE id = $1', [id]);
        res.status(200).json({ ok: true });
        return;
      }

      if (resource === 'micro-group') {
        const { id, action } = req.body ?? {};
        if (typeof id !== 'string' || (action !== 'join' && action !== 'leave' && action !== 'delete')) {
          res.status(400).json({ error: "id와 action('join'|'leave'|'delete')이 필요합니다." });
          return;
        }

        const rows = await query<MicroGroupRow>(
          `SELECT id, author_id, title, location, meetup_date, category, max_participants, interested_user_ids, created_at
           FROM micro_groups WHERE id = $1`,
          [id]
        );
        const group = rows[0];
        if (!group) {
          res.status(404).json({ error: '소모임을 찾을 수 없습니다.' });
          return;
        }

        if (action === 'delete') {
          if (group.author_id !== userId) {
            res.status(403).json({ error: '본인이 만든 소모임만 삭제할 수 있습니다.' });
            return;
          }
          await query('DELETE FROM micro_groups WHERE id = $1', [id]);
          res.status(200).json({ ok: true });
          return;
        }

        const alreadyIn = group.interested_user_ids.includes(userId);
        const nextInterested =
          action === 'join'
            ? alreadyIn
              ? group.interested_user_ids
              : [...group.interested_user_ids, userId]
            : group.interested_user_ids.filter((uid) => uid !== userId);

        const updated = await query<MicroGroupRow>(
          `UPDATE micro_groups SET interested_user_ids = $2::jsonb WHERE id = $1
           RETURNING id, author_id, title, location, meetup_date, category, max_participants, interested_user_ids, created_at`,
          [id, JSON.stringify(nextInterested)]
        );
        res.status(200).json({ microGroup: toMicroGroupJson(updated[0]) });
        return;
      }

      if ((req.body ?? {}).action === 'delete') {
        const { pinId: deletePinId } = req.body ?? {};
        if (typeof deletePinId !== 'string') {
          res.status(400).json({ error: 'pinId가 필요합니다.' });
          return;
        }
        const rows = await query<PinRow>('SELECT id, author_id FROM cultural_pins WHERE id = $1', [deletePinId]);
        if (!rows[0]) {
          res.status(404).json({ error: '핀을 찾을 수 없습니다.' });
          return;
        }
        if (rows[0].author_id !== userId) {
          res.status(403).json({ error: '본인이 등록한 핀만 삭제할 수 있습니다.' });
          return;
        }
        await query('DELETE FROM cultural_pins WHERE id = $1', [deletePinId]);
        res.status(200).json({ ok: true });
        return;
      }

      // 방문 인증 — Vercel Hobby의 함수 12개 제한 때문에 별도 파일 대신 이 엔드포인트에 합쳤다.
      const verifierId = userId;
      const { pinId, lat, lng } = req.body ?? {};
      if (typeof pinId !== 'string' || typeof lat !== 'number' || typeof lng !== 'number') {
        res.status(400).json({ error: 'pinId, lat, lng가 필요합니다.' });
        return;
      }

      const rows = await query<PinRow>(
        `SELECT id, author_id, title, story, category, lat, lng, address, created_at, verifications
         FROM cultural_pins WHERE id = $1`,
        [pinId]
      );
      const pin = rows[0];
      if (!pin) {
        res.status(404).json({ error: '핀을 찾을 수 없습니다.' });
        return;
      }

      if (pin.author_id === verifierId) {
        res.status(400).json({ error: '본인이 등록한 핀은 인증할 수 없습니다.' });
        return;
      }

      if (pin.verifications.some((v) => v.userId === verifierId)) {
        res.status(409).json({ error: '이미 인증한 핀입니다.' });
        return;
      }

      const distanceKm = haversineDistanceKm({ lat, lng }, { lat: pin.lat, lng: pin.lng });
      if (distanceKm > VERIFICATION_MAX_DISTANCE_KM) {
        res.status(403).json({ error: '핀 장소 근처에서만 인증할 수 있어요.' });
        return;
      }

      const verifications = [...pin.verifications, { userId: verifierId, verifiedAt: new Date().toISOString() }];

      const updated = await query<PinRow>(
        `UPDATE cultural_pins SET verifications = $2::jsonb WHERE id = $1
         RETURNING id, author_id, title, story, category, lat, lng, address, created_at, verifications`,
        [pinId, JSON.stringify(verifications)]
      );

      // 등록자(글쓴이)의 points만 부분 패치 — 다른 필드는 건드리지 않아 클라이언트의 전체 프로필
      // 덮어쓰기(PUT /api/users/me)와 충돌할 여지를 최소화한다.
      await query(
        `UPDATE app_users
         SET profile = jsonb_set(profile, '{points}', to_jsonb(COALESCE((profile->>'points')::int, 0) + $2))
         WHERE id = $1`,
        [pin.author_id, VERIFICATION_REWARD_POINTS]
      );

      res.status(200).json({
        pin: { id: updated[0].id, verifications: updated[0].verifications },
        pointsAwarded: VERIFICATION_REWARD_POINTS,
      });
      return;
    }

    res.status(405).json({ error: 'GET, POST 또는 PATCH 요청만 지원합니다.' });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
