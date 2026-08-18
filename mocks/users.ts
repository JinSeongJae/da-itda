import type { User } from '../types';
import { SKILLS } from './skills';

export const USER_JASMIN_ID = 'user_jasmin';
export const USER_JIEUN_ID = 'user_jieun';

export const JASMIN: User = {
  id: USER_JASMIN_ID,
  name: 'Jasmin',
  nationality: '필리핀',
  isForeignResident: true,
  visaType: 'F-6',
  avatarUrl: 'https://i.pravatar.cc/300?img=47',
  bio:
    '경산에 정착한 지 3년 된 필리핀 출신 엄마예요. 영어 회화와 필리핀 가정식을 나누고, ' +
    '아이 학교 알림장 이해와 한국어 회화를 배우고 싶어요 🇵🇭🇰🇷',
  mbti: 'ENFP',
  gender: 'female',
  talkStyle: 'lively',
  location: { city: '경산시', district: '중산동', lat: 35.825, lng: 128.741 },
  languages: [
    { language: '영어', level: '원어민' },
    { language: '타갈로그어', level: '원어민' },
    { language: '한국어', level: '중급' },
  ],
  skillsOffered: [SKILLS.nativeEnglish, SKILLS.filipinoCooking, SKILLS.seAsianCulture, SKILLS.visaInfoShare],
  skillsWanted: [SKILLS.koreanLanguage, SKILLS.schoolNoticeHelp, SKILLS.localInfoGyeongsan],
  availability: [
    { day: '화', start: '15:00', end: '18:00' },
    { day: '토', start: '10:00', end: '13:00' },
  ],
  verification: 'pending',
  badges: [],
  points: 40,
  volunteerMinutes: 30,
  createdAt: '2023-05-02T00:00:00+09:00',
};

export const LEE_JIEUN: User = {
  id: USER_JIEUN_ID,
  name: '이지은',
  nationality: '대한민국',
  isForeignResident: false,
  visaType: 'none',
  avatarUrl: 'https://i.pravatar.cc/300?img=32',
  bio:
    '진량읍에 사는 초등학생 두 아이 엄마입니다. 아이들에게 자연스러운 영어 노출 기회를 주고 싶고, ' +
    '집밥 나누는 것도 좋아해요. 한국 생활 정보와 학교 관련 도움도 드릴 수 있어요 🇰🇷',
  mbti: 'INFJ',
  gender: 'female',
  talkStyle: 'quiet',
  location: { city: '경산시', district: '진량읍', lat: 35.86, lng: 128.793 },
  languages: [
    { language: '한국어', level: '원어민' },
    { language: '영어', level: '초급' },
  ],
  skillsOffered: [
    SKILLS.koreanLanguage,
    SKILLS.schoolNoticeHelp,
    SKILLS.localInfoGyeongsan,
    SKILLS.koreanHomeCooking,
  ],
  skillsWanted: [SKILLS.nativeEnglish, SKILLS.kidsEnglishExposure, SKILLS.filipinoCooking, SKILLS.smartphoneHelp],
  availability: [
    { day: '화', start: '16:00', end: '19:00' },
    { day: '토', start: '10:00', end: '12:00' },
  ],
  verification: 'verified',
  badges: ['safe-verified'],
  points: 65,
  volunteerMinutes: 90,
  createdAt: '2022-11-18T00:00:00+09:00',
};

export const USER_MINH_ID = 'user_minh';
export const USER_MINSU_ID = 'user_minsu';
export const USER_SORA_ID = 'user_sora';

export const MINH: User = {
  id: USER_MINH_ID,
  name: 'Minh',
  nationality: '베트남',
  isForeignResident: true,
  visaType: 'D-2',
  avatarUrl: 'https://i.pravatar.cc/300?img=13',
  bio:
    '경산 소재 대학교에서 유학 중인 베트남 학생이에요. 동남아 문화 이야기를 나누는 걸 좋아하고, ' +
    '한국어 회화와 동네 생활 정보를 배우고 싶어요 🇻🇳🇰🇷',
  mbti: 'ISTJ',
  gender: 'male',
  talkStyle: 'quiet',
  location: { city: '경산시', district: '중산동', lat: 35.828, lng: 128.744 },
  languages: [
    { language: '베트남어', level: '원어민' },
    { language: '영어', level: '중급' },
    { language: '한국어', level: '초급' },
  ],
  skillsOffered: [SKILLS.seAsianCulture, SKILLS.futsalPartner, SKILLS.homeCountryMusic],
  skillsWanted: [SKILLS.koreanLanguage, SKILLS.localInfoGyeongsan],
  availability: [
    { day: '수', start: '14:00', end: '17:00' },
    { day: '토', start: '10:00', end: '13:00' },
  ],
  verification: 'pending',
  badges: [],
  points: 20,
  volunteerMinutes: 0,
  createdAt: '2024-03-10T00:00:00+09:00',
};

export const PARK_MINSU: User = {
  id: USER_MINSU_ID,
  name: '박민수',
  nationality: '대한민국',
  isForeignResident: false,
  visaType: 'none',
  avatarUrl: 'https://i.pravatar.cc/300?img=52',
  bio:
    '중산동에서 근무하는 IT 개발자입니다. 외국인 이웃들과 영어로 대화하며 친해지고 싶고, ' +
    '한국어와 동네 생활 정보를 나누는 것도 즐거워요 🇰🇷',
  mbti: 'INTP',
  gender: 'male',
  talkStyle: 'no-preference',
  location: { city: '경산시', district: '중산동', lat: 35.822, lng: 128.739 },
  languages: [
    { language: '한국어', level: '원어민' },
    { language: '영어', level: '중급' },
  ],
  skillsOffered: [SKILLS.koreanLanguage, SKILLS.localInfoGyeongsan, SKILLS.basicCoding],
  skillsWanted: [SKILLS.nativeEnglish, SKILLS.seAsianCulture],
  availability: [
    { day: '화', start: '15:00', end: '18:00' },
    { day: '토', start: '10:00', end: '13:00' },
  ],
  verification: 'verified',
  badges: ['safe-verified'],
  points: 55,
  volunteerMinutes: 60,
  createdAt: '2023-09-01T00:00:00+09:00',
};

export const CHOI_SORA: User = {
  id: USER_SORA_ID,
  name: '최소라',
  nationality: '대한민국',
  isForeignResident: false,
  visaType: 'none',
  avatarUrl: 'https://i.pravatar.cc/300?img=45',
  bio:
    '진량읍에 사는 요가 강사예요. 집밥 나누는 것과 동네 정보 알려주는 걸 좋아하고, ' +
    '필리핀 요리와 아이 영어 놀이 프로그램을 배우고 싶어요 🇰🇷',
  mbti: 'ESFJ',
  gender: 'female',
  talkStyle: 'lively',
  location: { city: '경산시', district: '진량읍', lat: 35.858, lng: 128.79 },
  languages: [
    { language: '한국어', level: '원어민' },
    { language: '영어', level: '초급' },
  ],
  skillsOffered: [SKILLS.koreanHomeCooking, SKILLS.localInfoGyeongsan, SKILLS.hikingBuddy],
  skillsWanted: [SKILLS.filipinoCooking, SKILLS.kidsEnglishExposure],
  availability: [
    { day: '화', start: '16:00', end: '19:00' },
    { day: '일', start: '10:00', end: '12:00' },
  ],
  verification: 'verified',
  badges: ['safe-verified'],
  points: 48,
  volunteerMinutes: 45,
  createdAt: '2023-11-20T00:00:00+09:00',
};

export const SEED_USERS: Record<string, User> = {
  [USER_JASMIN_ID]: JASMIN,
  [USER_JIEUN_ID]: LEE_JIEUN,
  [USER_MINH_ID]: MINH,
  [USER_MINSU_ID]: PARK_MINSU,
  [USER_SORA_ID]: CHOI_SORA,
};
