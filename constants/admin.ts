/**
 * Hardcoded operator allowlist — this app has 1-2 real users right now, so a flexible role
 * system would be premature. Revisit with a real `role` column once there are multiple admins.
 */
export const ADMIN_USER_IDS: readonly string[] = ['user_kakao_5045493039'];

export function isAdminUser(userId: string | null | undefined): boolean {
  return !!userId && ADMIN_USER_IDS.includes(userId);
}
