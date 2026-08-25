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
    // TEMPORARY — 운영자가 다른 계정에 admin 권한을 주기 위해 이름으로 user id를 찾아야 하는데
    // 그 계정들 로그인 세션이 없어서, 일회성 비밀키로 우회하는 조회 전용 경로. 사용 후 바로 제거.
    if (req.method === 'GET' && req.query.lookupSecret) {
      const secret = process.env.LOOKUP_SECRET;
      if (!secret || req.query.lookupSecret !== secret) {
        res.status(403).json({ error: '권한이 없습니다.' });
        return;
      }
      const rows = await query<{ id: string; name: string | null }>(
        "SELECT id, profile->>'name' AS name FROM app_users WHERE profile IS NOT NULL"
      );
      res.status(200).json({ users: rows });
      return;
    }

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
