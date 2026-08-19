import type { CulturalPin } from '../types';
import { USER_JASMIN_ID, USER_MINH_ID } from './users';

/** Local-only fallback seed — shown when the backend fetch hasn't succeeded yet (offline/first load). */
export const SEED_CULTURAL_PINS: CulturalPin[] = [
  {
    id: 'pin_spice_market',
    authorId: USER_JASMIN_ID,
    title: '향신료 파는 동네 슈퍼',
    story: '필리핀 요리에 꼭 필요한 향신료를 구할 수 있는 곳이에요. 사장님이 친절하게 재료 설명도 해주셔요.',
    category: 'shopping',
    lat: 35.827,
    lng: 128.743,
    address: '경상북도 경산시 중산로 32',
    createdAt: '2026-07-02T09:00:00+09:00',
    verifications: [],
  },
  {
    id: 'pin_24h_study_cafe',
    authorId: USER_MINH_ID,
    title: '공부하기 좋은 24시 카페',
    story: '조용하고 콘센트가 많아서 유학생들이 밤에 공부하러 자주 가요.',
    category: 'study',
    lat: 35.831,
    lng: 128.748,
    address: '경상북도 경산시 대학로 15',
    createdAt: '2026-07-10T21:00:00+09:00',
    verifications: [],
  },
];
