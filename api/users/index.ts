import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { requireUser } from '../_auth';
import { query } from '../_db';

interface UserRow {
  id: string;
  profile: unknown;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  try {
    requireUser(req);

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'GET 요청만 지원합니다.' });
      return;
    }

    // 관심사 설정(온보딩)까지 마쳐 profile이 채워진 유저만 매칭 후보로 노출한다.
    const rows = await query<UserRow>('SELECT id, profile FROM app_users WHERE profile IS NOT NULL');

    res.status(200).json({ users: rows.map((row) => row.profile) });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
