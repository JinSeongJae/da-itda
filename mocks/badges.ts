import type { Badge } from '../types';

export const BADGES: Record<string, Badge> = {
  'safe-verified': {
    id: 'safe-verified',
    name: '안심인증',
    description: '신분증·외국인등록증 수동 검토를 통과한 회원입니다.',
    iconName: 'shield-check',
  },
  'best-friend-neighbor': {
    id: 'best-friend-neighbor',
    name: '단짝 이웃',
    description: '동일 이웃과 3회 이상 꾸준히 교류를 이어가고 있어요.',
    iconName: 'users',
  },
};
