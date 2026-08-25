/**
 * Hardcoded operator allowlist — a flexible role system would be premature at this scale.
 * Revisit with a real `role` column once the team grows further.
 */
export const ADMIN_USER_IDS: readonly string[] = [
  'user_kakao_5045493039', // 진성재
  'user_kakao_5048530365', // 전동규
  'user_kakao_5048549103', // 경환
  'user_kakao_5047934151', // 이준희
];

export function isAdminUser(userId: string | null | undefined): boolean {
  return !!userId && ADMIN_USER_IDS.includes(userId);
}
