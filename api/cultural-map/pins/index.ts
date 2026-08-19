import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../../_cors';
import { query } from '../../_db';
import { requireUser } from '../../_auth';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  try {
    const userId = requireUser(req);

    if (req.method === 'GET') {
      const rows = await query<PinRow>(
        `SELECT id, author_id, title, story, category, lat, lng, address, created_at, verifications
         FROM cultural_pins ORDER BY created_at DESC`
      );
      res.status(200).json({ pins: rows.map(toPinJson) });
      return;
    }

    if (req.method === 'POST') {
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

    res.status(405).json({ error: 'GET 또는 POST 요청만 지원합니다.' });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
