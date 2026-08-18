import type { ChatMessage, ChatThread, CulturalGuideTip } from '../types';
import { MATCH_JASMIN_JIEUN_ID } from './matches';
import { SEED_APPOINTMENT_ID, SEED_THREAD_ID } from './appointments';
import { USER_JASMIN_ID, USER_JIEUN_ID } from './users';

export const SEED_THREAD: ChatThread = {
  id: SEED_THREAD_ID,
  matchId: MATCH_JASMIN_JIEUN_ID,
  participantIds: [USER_JASMIN_ID, USER_JIEUN_ID],
  isDirectChannel: false,
  createdAt: '2026-08-14T09:05:00+09:00',
  lastMessagePreview: '2026-08-20 10:00 · 경산시 로컬푸드 직매장 공유주방에서 만나요!',
  lastMessageAt: '2026-08-14T10:20:00+09:00',
};

export const SEED_THREADS: Record<string, ChatThread> = {
  [SEED_THREAD_ID]: SEED_THREAD,
};

export const CULTURAL_GUIDE_TIPS: CulturalGuideTip[] = [
  {
    id: 'tip_bap_hanbeon_meokja',
    triggerPhrase: '밥 한번 먹자',
    explanation:
      '한국에서 "밥 한번 먹자"는 실제 약속이라기보다 친근함을 표현하는 인사말에 가까워요. ' +
      '진짜 약속을 잡고 싶다면 구체적인 날짜와 시간을 제안해보세요!',
    language: 'ko',
  },
];

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    threadId: SEED_THREAD_ID,
    senderId: 'system',
    type: 'system',
    text: 'AI가 두 분의 매칭 목적을 분석했어요: 언어·요리 교환과 육아·학교 정보 나눔',
    createdAt: '2026-08-14T09:05:00+09:00',
  },
  {
    id: 'msg_2',
    threadId: SEED_THREAD_ID,
    senderId: USER_JIEUN_ID,
    type: 'text',
    text: '안녕하세요 Jasmin님! 반가워요 😊',
    translatedText: { en: 'Hello Jasmin! Nice to meet you 😊' },
    createdAt: '2026-08-14T09:07:00+09:00',
  },
  {
    id: 'msg_3',
    threadId: SEED_THREAD_ID,
    senderId: USER_JASMIN_ID,
    type: 'text',
    text: 'Hi Jieun! Nice to meet you too! I’m excited to learn Korean with you 😊',
    translatedText: { ko: '안녕하세요 지은님! 저도 만나서 반가워요! 한국어를 배우게 되어 기대돼요 😊' },
    createdAt: '2026-08-14T09:09:00+09:00',
  },
  {
    id: 'msg_4',
    threadId: SEED_THREAD_ID,
    senderId: USER_JIEUN_ID,
    type: 'text',
    text: '다음에 밥 한번 먹어요~ 아이들도 소개해드리고 싶어요!',
    translatedText: { en: 'Let’s grab a meal together sometime~ I’d love to introduce you to my kids!' },
    createdAt: '2026-08-14T09:12:00+09:00',
  },
  {
    id: 'msg_5',
    threadId: SEED_THREAD_ID,
    senderId: 'system',
    type: 'cultural-guide',
    text: CULTURAL_GUIDE_TIPS[0].explanation,
    createdAt: '2026-08-14T09:12:30+09:00',
  },
  {
    id: 'msg_6',
    threadId: SEED_THREAD_ID,
    senderId: USER_JASMIN_ID,
    type: 'text',
    text: 'That sounds lovely! Maybe we could also cook Adobo together and I can help translate your kids’ school notices 🙌',
    translatedText: { ko: '좋아요! 아도보도 같이 요리하고, 아이들 학교 알림장 번역도 도와드릴 수 있어요 🙌' },
    createdAt: '2026-08-14T09:20:00+09:00',
  },
  {
    id: 'msg_7',
    threadId: SEED_THREAD_ID,
    senderId: USER_JIEUN_ID,
    type: 'text',
    text: '좋아요! 이번 주 토요일 오전에 로컬푸드 공유주방에서 만날까요?',
    translatedText: { en: 'Great! Shall we meet this Saturday morning at the local food shared kitchen?' },
    createdAt: '2026-08-14T10:15:00+09:00',
  },
  {
    id: 'msg_8',
    threadId: SEED_THREAD_ID,
    senderId: USER_JIEUN_ID,
    type: 'appointment',
    text: '2026-08-20 10:00 · 경산시 로컬푸드 직매장 공유주방에서 만나요!',
    appointmentId: SEED_APPOINTMENT_ID,
    createdAt: '2026-08-14T10:20:00+09:00',
  },
];

export const SEED_MESSAGES_BY_THREAD: Record<string, ChatMessage[]> = {
  [SEED_THREAD_ID]: SEED_MESSAGES,
};
