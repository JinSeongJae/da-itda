import type { CommunityPost } from '../types';
import { USER_JIEUN_ID, USER_MINH_ID, USER_MINSU_ID, USER_SORA_ID } from './users';

export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_minsu_exchange_hangul',
    authorId: USER_MINSU_ID,
    category: 'exchange',
    title: '초등학생 자녀 한글 알림장 함께 읽어주실 분 구합니다',
    body: '학교에서 오는 알림장을 아이와 함께 읽고 이해하는 걸 도와주실 이웃을 찾고 있어요. 영어 회화로 답례해드릴게요!',
    createdAt: '2026-08-16T10:00:00+09:00',
  },
  {
    id: 'post_sora_exchange_home_cooking',
    authorId: USER_SORA_ID,
    category: 'exchange',
    title: '주말에 한국 가정식 교환해요',
    body: '집밥 반찬 만드는 걸 좋아해요. 필리핀이나 베트남 가정식 레시피와 교환하고 싶은 분 있으면 연락 주세요.',
    createdAt: '2026-08-15T20:00:00+09:00',
  },
  {
    id: 'post_minh_question_hospital',
    authorId: USER_MINH_ID,
    category: 'question',
    title: '중산동 근처 소아과 추천해주세요',
    body: '이사 온 지 얼마 안 돼서 동네 병원 정보가 부족해요. 야간 진료하는 소아과 아시는 분 계신가요?',
    createdAt: '2026-08-14T14:30:00+09:00',
  },
  {
    id: 'post_jieun_group_cooking_class',
    authorId: USER_JIEUN_ID,
    category: 'group',
    title: '이번 주말 다문화 쿠킹 클래스 같이 하실 분!',
    body: '경산시 공유주방에서 열리는 다문화 쿠킹 클래스에 같이 갈 이웃을 찾고 있어요. 정원이 얼마 안 남았어요.',
    createdAt: '2026-08-13T09:15:00+09:00',
  },
];
