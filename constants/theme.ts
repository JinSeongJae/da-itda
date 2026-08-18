export const COLORS = {
  primary: '#10b981',
  primaryDark: '#047857',
  primaryLight: '#d1fae5',
  accent: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  background: '#f9fafb',
  surface: '#ffffff',
};

export function scoreColor(score: number): string {
  if (score >= 90) return COLORS.primary;
  if (score >= 70) return COLORS.accent;
  if (score >= 50) return COLORS.warning;
  return COLORS.danger;
}

export const SAFE_ZONE_TYPE_META: Record<string, { label: string; iconName: string }> = {
  cafe: { label: '협약 카페', iconName: 'coffee' },
  library: { label: '도서관', iconName: 'book-open' },
  'community-center': { label: '주민센터', iconName: 'home' },
  'shared-kitchen': { label: '공유주방', iconName: 'shopping-bag' },
};

export const GYEONGSAN_CENTER = { lat: 35.8395, lng: 128.7413 };
