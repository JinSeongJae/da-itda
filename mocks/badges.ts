import type { Badge } from '../types';

export const BADGES: Record<string, Badge> = {
  'safe-verified': {
    id: 'safe-verified',
    name: '안심인증',
    description: '신분증·외국인등록증 수동 검토를 통과한 회원입니다.',
    iconName: 'shield-check',
  },
  'first-exchange': {
    id: 'first-exchange',
    name: '첫 교류 성공',
    description: '이웃과 첫 번째 1:1 재능 교류를 완료했어요.',
    iconName: 'award',
  },
  'best-friend-neighbor': {
    id: 'best-friend-neighbor',
    name: '단짝 이웃',
    description: '동일 이웃과 3회 이상 꾸준히 교류를 이어가고 있어요.',
    iconName: 'users',
  },
  'local-guide': {
    id: 'local-guide',
    name: '모임 호스트',
    description: '동네 소모임을 직접 개설하거나 참가했어요.',
    iconName: 'map-pin',
  },
};
