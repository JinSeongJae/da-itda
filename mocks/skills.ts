import type { Skill } from '../types';

export const SKILLS = {
  nativeEnglish: {
    id: 'skill_native_english',
    category: 'language',
    label: '네이티브 영어 회화',
    description: '일상 회화부터 발음 교정까지 원어민 영어',
  },
  filipinoCooking: {
    id: 'skill_filipino_cooking',
    category: 'cooking',
    label: '필리핀 가정식 요리 (아도보 등)',
    description: '필리핀 대표 요리 아도보, 시니강 등',
  },
  seAsianCulture: {
    id: 'skill_sea_culture',
    category: 'culture',
    label: '동남아시아 문화 공유',
    description: '필리핀 명절, 생활 문화 이야기',
  },
  koreanLanguage: {
    id: 'skill_korean_language',
    category: 'language',
    label: '한국어 회화',
    description: '생활 한국어, 존댓말 사용법',
  },
  schoolNoticeHelp: {
    id: 'skill_school_notice',
    category: 'education',
    label: '초등학교 알림장·가정통신문 이해 돕기',
    description: '학교에서 오는 안내문 번역 및 설명',
  },
  localInfoGyeongsan: {
    id: 'skill_local_info',
    category: 'local-info',
    label: '경산시 생활 정보 안내',
    description: '병원, 관공서, 마트 등 동네 정보',
  },
  koreanHomeCooking: {
    id: 'skill_korean_cooking',
    category: 'cooking',
    label: '한국 가정식 요리',
    description: '집밥 반찬, 김치찌개 등',
  },
  kidsEnglishExposure: {
    id: 'skill_kids_english',
    category: 'education',
    label: '아이 영어 노출 프로그램',
    description: '어린이 눈높이 영어 놀이 학습',
  },
} as const satisfies Record<string, Skill>;

export const ALL_SKILLS: Skill[] = Object.values(SKILLS);
