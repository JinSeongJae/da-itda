import type { MicroGroupSuggestion } from '../types';
import { USER_JASMIN_ID, USER_JIEUN_ID } from './users';

export const SEED_MICRO_GROUPS: MicroGroupSuggestion[] = [
  {
    id: 'microgroup_multicultural_cooking',
    title: '[이번 주 토요일] 경산시 공유주방 다문화 쿠킹 클래스',
    location: '경산시 공유주방',
    date: '2026-08-22T10:00:00+09:00',
    category: 'cooking',
    maxParticipants: 6,
    interestedUserIds: [USER_JASMIN_ID],
  },
  {
    id: 'microgroup_kids_english_storytelling',
    title: '[주말 산책] 진량읍 어린이 영어 스토리텔링 & 야외 활동',
    location: '진량읍 복지센터 공원',
    date: '2026-08-23T14:00:00+09:00',
    category: 'education',
    maxParticipants: 8,
    interestedUserIds: [USER_JIEUN_ID],
  },
];
