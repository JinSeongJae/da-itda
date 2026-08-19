import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../../../_cors';
import { query } from '../../../_db';
import { requireUser } from '../../../_auth';
import { haversineDistanceKm } from '../../../../utils/distance';

const VERIFICATION_MAX_DISTANCE_KM = 0.2;
const VERIFICATION_REWARD_POINTS = 15;

interface PinRow {
  id: string;
  author_id: string;
  lat: number;
  lng: number;
  verifications: { userId: string; verifiedAt: string }[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 지원합니다.' });
    return;
  }

  try {
    const verifierId = requireUser(req);
    const pinId = req.query.id;
    const { lat, lng } = req.body ?? {};
    if (typeof pinId !== 'string' || typeof lat !== 'number' || typeof lng !== 'number') {
      res.status(400).json({ error: 'pinId, lat, lng가 필요합니다.' });
      return;
    }

    const rows = await query<PinRow>(
      'SELECT id, author_id, lat, lng, verifications FROM cultural_pins WHERE id = $1',
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
       RETURNING id, author_id, lat, lng, verifications`,
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
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
