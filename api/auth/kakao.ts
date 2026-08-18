import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from '../_cors';
import { query } from '../_db';
import { signSessionToken } from '../_auth';

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  error?: string;
  error_description?: string;
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

// 카카오 REST API 키(client_id)는 비밀값이 아니라 인가 URL에도 그대로 노출되는 값이라,
// Vercel에 KAKAO_CLIENT_ID/EXPO_PUBLIC_KAKAO_CLIENT_ID가 설정되지 않은 경우를 위한
// 최후 fallback으로 실제 발급받은 키를 명시해둔다.
const DEFAULT_KAKAO_CLIENT_ID = '370ceecb9a042a16a81d317c34c4f972';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 지원합니다.' });
    return;
  }

  const { code, redirectUri } = req.body ?? {};
  if (!code || !redirectUri) {
    res.status(400).json({ error: 'code와 redirectUri가 필요합니다.' });
    return;
  }

  // 서버 전용 KAKAO_CLIENT_ID가 Vercel에 설정되지 않았다면 클라이언트에도 노출되는
  // EXPO_PUBLIC_KAKAO_CLIENT_ID로, 그마저도 없다면 하드코딩된 기본값으로 폴백한다.
  const clientId = (
    process.env.KAKAO_CLIENT_ID ||
    process.env.EXPO_PUBLIC_KAKAO_CLIENT_ID ||
    DEFAULT_KAKAO_CLIENT_ID
  ).trim();
  // client_secret은 카카오 콘솔에서 활성화한 경우에만 의미가 있는 값이라 필수가 아니다 —
  // 설정되어 있지 않으면 아래 스프레드에서 요청 body 자체에 필드가 생기지 않는다.
  const clientSecret = process.env.KAKAO_CLIENT_SECRET?.trim() || undefined;

  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      ...(clientSecret ? { client_secret: clientSecret } : {}),
    });

    console.log('[kakao-auth] token request params:', {
      client_id: clientId,
      redirect_uri: redirectUri,
      code: typeof code === 'string' ? `${code.slice(0, 6)}...(${code.length}자)` : code,
      client_secret: clientSecret ? '(설정됨, 값은 로그에 남기지 않음)' : '(설정 안 됨 — body에서 생략)',
    });

    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: tokenParams.toString(),
    });
    const tokenData = (await tokenResponse.json()) as KakaoTokenResponse;

    if (!tokenResponse.ok || !tokenData.access_token) {
      res.status(401).json({
        error: tokenData.error_description ?? '카카오 토큰 교환에 실패했습니다.',
        kakaoError: tokenData.error,
      });
      return;
    }

    const profileResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = (await profileResponse.json()) as KakaoUserResponse;

    if (!profileResponse.ok || !profileData.id) {
      res.status(401).json({ error: '카카오 프로필 조회에 실패했습니다.' });
      return;
    }

    const kakaoId = String(profileData.id);
    const name = profileData.kakao_account?.profile?.nickname ?? '새 이웃';
    const avatarUrl = profileData.kakao_account?.profile?.profile_image_url ?? null;

    const rows = await query<{ id: string; name: string; avatar_url: string | null }>(
      `INSERT INTO app_users (id, kakao_id, name, avatar_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (kakao_id)
       DO UPDATE SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
       RETURNING id, name, avatar_url`,
      [`user_kakao_${kakaoId}`, kakaoId, name, avatarUrl]
    );

    const user = rows[0];
    const token = signSessionToken(user.id);

    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, avatarUrl: user.avatar_url ?? undefined },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
  }
}
