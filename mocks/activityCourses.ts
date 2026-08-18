import type { ActivityCourse } from '../types';
import { MATCH_JASMIN_JIEUN_ID } from './matches';
import { USER_JASMIN_ID, USER_JIEUN_ID } from './users';

export const SEED_ACTIVITY_COURSE: ActivityCourse = {
  id: 'course_jasmin_jieun_1',
  matchId: MATCH_JASMIN_JIEUN_ID,
  totalDurationMinutes: 60,
  segments: [
    {
      order: 1,
      durationMinutes: 30,
      title: '필리핀 아도보 함께 요리하기',
      description: 'Jasmin님이 필리핀 대표 가정식 아도보 조리법을 알려드려요.',
      ledByUserId: USER_JASMIN_ID,
    },
    {
      order: 2,
      durationMinutes: 30,
      title: '초등학교 알림장 번역 & 한국어 표현 배우기',
      description: '이지은님이 최근 받은 알림장을 함께 읽고, 관련 생활 한국어 표현을 알려드려요.',
      ledByUserId: USER_JIEUN_ID,
    },
  ],
};

export const SEED_ACTIVITY_COURSES: Record<string, ActivityCourse> = {
  [MATCH_JASMIN_JIEUN_ID]: SEED_ACTIVITY_COURSE,
};
