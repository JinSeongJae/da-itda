import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { User } from '../../types';
import { findUrgentMatches } from '../../utils/smartMatch';
import { query } from '../_db';
import { sendExpoPush } from '../_push';

interface UserRow {
  id: string;
  profile: User;
}

/**
 * Vercel Cron target (see vercel.json) — runs once daily (18:00 KST), matching the Hobby plan's
 * cron frequency limit. Scans all onboarded users for a
 * currently-nearby, currently-available, highly compatible neighbor and pushes an urgent
 * "지금 만날 수 있어요" notification to each side. Protected by CRON_SECRET so it can't be
 * triggered by arbitrary requests; Vercel automatically sends this as a bearer token for its
 * own cron invocations once the env var is set.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.authorization !== `Bearer ${cronSecret}`) {
    res.status(401).json({ error: '인증되지 않은 요청입니다.' });
    return;
  }

  try {
    const rows = await query<UserRow>(
      "SELECT id, profile FROM app_users WHERE profile IS NOT NULL AND profile->>'pushToken' IS NOT NULL"
    );
    const users = rows.map((row) => row.profile);

    const urgentMatches = findUrgentMatches(users);

    await Promise.all(
      urgentMatches.map((m) =>
        sendExpoPush(
          m.user.pushToken!,
          '지금 급매칭이 떴어요! ⚡',
          `${m.match.name}님과 ${m.distanceKm.toFixed(1)}km 거리, 매칭률 ${m.compatibilityScore}% — 지금 바로 만나보세요.`,
          { type: 'smart-match', matchUserId: m.match.id }
        )
      )
    );

    res.status(200).json({ ok: true, scanned: users.length, pushed: urgentMatches.length });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
