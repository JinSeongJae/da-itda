import { query } from './_db';

const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

export async function sendExpoPush(
  to: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  await fetch(EXPO_PUSH_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ to, title, body, data, sound: 'default', priority: 'high' }),
  }).catch(() => {});
}

/** Looks up `userId`'s registered push token and sends — a silent no-op if they have none. */
export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    const rows = await query<{ push_token: string | null }>(
      "SELECT profile->>'pushToken' AS push_token FROM app_users WHERE id = $1",
      [userId]
    );
    const token = rows[0]?.push_token;
    if (!token) return;
    await sendExpoPush(token, title, body, data);
  } catch {
    // 알림 발송 실패는 본 기능(메시지/약속 처리 등)을 막지 않는다.
  }
}
