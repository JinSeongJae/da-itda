import type { Skill, SkillCategory } from '../types';

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
    category: 'parenting',
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
    category: 'parenting',
    label: '아이 영어 노출 프로그램',
    description: '어린이 눈높이 영어 놀이 학습',
  },
  multiculturalPlaydate: {
    id: 'skill_multicultural_playdate',
    category: 'parenting',
    label: '다문화 가정 아이 놀이 모임',
    description: '같은 또래 아이를 키우는 이웃과 놀이 모임 열기/참여하기',
  },
  schoolEnrollmentHelp: {
    id: 'skill_school_enrollment_help',
    category: 'parenting',
    label: '자녀 학교 입학·전입학 행정 안내',
    description: '입학·전입학 서류, 방과후 프로그램 신청 등 학교 행정 절차 도움',
  },
  futsalPartner: {
    id: 'skill_futsal_partner',
    category: 'sports',
    label: '풋살/축구 같이 하기',
    description: '주말 풋살·축구 모임 같이 뛸 사람 구하기',
  },
  hikingBuddy: {
    id: 'skill_hiking_buddy',
    category: 'sports',
    label: '등산 동행',
    description: '경산 인근 등산로(갓바위 등) 함께 걷기',
  },
  badmintonPartner: {
    id: 'skill_badminton_partner',
    category: 'sports',
    label: '배드민턴 파트너',
    description: '실내 배드민턴장에서 같이 운동하기',
  },
  morningJogging: {
    id: 'skill_morning_jogging',
    category: 'sports',
    label: '아침 조깅 모임',
    description: '동네 하천길 아침 조깅 같이 하기',
  },
  traditionalCraft: {
    id: 'skill_traditional_craft',
    category: 'hobby-art',
    label: '전통 공예 나눔',
    description: '십자수, 뜨개질 등 손으로 만드는 취미 나누기',
  },
  kpopDance: {
    id: 'skill_kpop_dance',
    category: 'hobby-art',
    label: 'K-POP 커버댄스',
    description: '케이팝 안무 배우기/가르치기',
  },
  photographyWalk: {
    id: 'skill_photography_walk',
    category: 'hobby-art',
    label: '사진 산책',
    description: '동네를 걸으며 사진 찍는 모임',
  },
  homeCountryMusic: {
    id: 'skill_home_country_music',
    category: 'hobby-art',
    label: '자국 전통음악·악기 소개',
    description: '고향 나라의 전통 음악이나 악기를 소개하고 배우기',
  },
  smartphoneHelp: {
    id: 'skill_smartphone_help',
    category: 'tech',
    label: '스마트폰·행정앱 사용법',
    description: '정부24, 배달앱, 은행 앱 등 스마트폰 사용법 안내',
  },
  onlineBankingHelp: {
    id: 'skill_online_banking_help',
    category: 'tech',
    label: '인터넷/모바일 뱅킹 도움',
    description: '계좌 개설, 이체, 공동인증서 등록 도움',
  },
  documentEditingHelp: {
    id: 'skill_document_editing_help',
    category: 'tech',
    label: '문서 작업 도움',
    description: '한글·엑셀로 이력서, 신청서 작성 도움',
  },
  basicCoding: {
    id: 'skill_basic_coding',
    category: 'tech',
    label: '기초 코딩 배우기',
    description: '생활 코딩, 엑셀 함수 등 기초부터 함께 배우기',
  },
  visaInfoShare: {
    id: 'skill_visa_info_share',
    category: 'legal-admin',
    label: '비자·체류 절차 정보 공유',
    description: '체류 연장, 비자 변경 등 경험 기반 정보 공유 (법률 자문 아님)',
  },
  immigrationOfficeAccompany: {
    id: 'skill_immigration_office_accompany',
    category: 'legal-admin',
    label: '출입국관리사무소 동행',
    description: '출입국·외국인청 방문 시 동행 및 서류 안내',
  },
  laborRightsInfo: {
    id: 'skill_labor_rights_info',
    category: 'legal-admin',
    label: '근로·임금 기초 정보 공유',
    description: '근로계약서, 최저임금 등 기초 노동 정보 공유',
  },
  adminDocumentHelp: {
    id: 'skill_admin_document_help',
    category: 'legal-admin',
    label: '행정 서류 작성 도움',
    description: '주민센터·구청 민원 서류 작성 도움',
  },
  multilingualInterpretation: {
    id: 'skill_multilingual_interpretation',
    category: 'language',
    label: '다국어 통역 도움',
    description: '병원, 관공서 등 방문 시 간단한 통역 도움',
  },
  pronunciationStudy: {
    id: 'skill_pronunciation_study',
    category: 'language',
    label: '발음 교정 스터디',
    description: '외국어 발음을 서로 교정해주는 스터디',
  },
  holidayCultureExchange: {
    id: 'skill_holiday_culture_exchange',
    category: 'culture',
    label: '명절 문화 체험 나눔',
    description: '서로 다른 나라의 명절 풍습 체험하고 나누기',
  },
  worldFestivalIntro: {
    id: 'skill_world_festival_intro',
    category: 'culture',
    label: '세계 축제 소개',
    description: '고향 나라의 축제·기념일 소개하기',
  },
  bakingDessert: {
    id: 'skill_baking_dessert',
    category: 'cooking',
    label: '베이킹/디저트 만들기',
    description: '빵, 쿠키, 케이크 등 홈베이킹 나누기',
  },
  veganCooking: {
    id: 'skill_vegan_cooking',
    category: 'cooking',
    label: '채식 요리 나눔',
    description: '채식 위주 식단, 비건 요리 레시피 공유',
  },
  busRouteHelp: {
    id: 'skill_bus_route_help',
    category: 'local-info',
    label: '대중교통·버스 노선 안내',
    description: '경산 시내버스, 대구 지하철 환승 등 이동 정보',
  },
  housingInfoShare: {
    id: 'skill_housing_info_share',
    category: 'local-info',
    label: '부동산/전월세 정보 공유',
    description: '동네 시세, 전월세 계약 시 주의사항 등 경험 공유',
  },
  playgroundMeetup: {
    id: 'skill_playground_meetup',
    category: 'parenting',
    label: '놀이터 동행 육아 품앗이',
    description: '아이와 함께 놀이터 동행, 육아 품앗이 하기',
  },
  babyProductInfoShare: {
    id: 'skill_baby_product_info_share',
    category: 'parenting',
    label: '이유식·아기용품 정보 공유',
    description: '이유식 레시피, 육아용품 추천 정보 나누기',
  },
  basicLiteracyEducation: {
    id: 'skill_basic_literacy_education',
    category: 'education',
    label: '성인 문해교육(한글 기초)',
    description: '한글 읽고 쓰기 기초부터 함께 배우기',
  },
  topikStudyGroup: {
    id: 'skill_topik_study_group',
    category: 'education',
    label: 'TOPIK 스터디 그룹',
    description: '한국어능력시험(TOPIK) 준비 스터디',
  },
  tableTennisPartner: {
    id: 'skill_table_tennis_partner',
    category: 'sports',
    label: '탁구 파트너',
    description: '탁구장에서 같이 운동할 파트너 구하기',
  },
  cyclingGroup: {
    id: 'skill_cycling_group',
    category: 'sports',
    label: '자전거 라이딩 모임',
    description: '동네 하천길·근교 자전거 라이딩 같이 하기',
  },
  boardGameMeetup: {
    id: 'skill_board_game_meetup',
    category: 'hobby-art',
    label: '보드게임 모임',
    description: '보드게임 카페나 집에서 같이 즐기기',
  },
  gardening: {
    id: 'skill_gardening',
    category: 'hobby-art',
    label: '원예/식물 가꾸기',
    description: '화분, 텃밭 등 식물 가꾸기 취미 나누기',
  },
  smartDeviceHelp: {
    id: 'skill_smart_device_help',
    category: 'tech',
    label: '스마트워치·가전제품 사용법',
    description: '스마트워치, 스마트 가전 등 사용법 안내',
  },
  snsYoutubeHelp: {
    id: 'skill_sns_youtube_help',
    category: 'tech',
    label: 'SNS/유튜브 활용법',
    description: '인스타그램, 유튜브 등 SNS 활용 도움',
  },
  leaseContractInfoShare: {
    id: 'skill_lease_contract_info_share',
    category: 'legal-admin',
    label: '임대차 계약 기초 정보 공유',
    description: '전월세 계약서 작성 시 체크포인트 경험 공유 (법률 자문 아님)',
  },
  taxYearEndInfoShare: {
    id: 'skill_tax_year_end_info_share',
    category: 'legal-admin',
    label: '세금·연말정산 기초 안내',
    description: '연말정산, 종합소득세 신고 기초 정보 공유',
  },
} as const satisfies Record<string, Skill>;

export const ALL_SKILLS: Skill[] = Object.values(SKILLS);

export const SKILL_CATEGORY_ORDER: SkillCategory[] = [
  'language',
  'culture',
  'cooking',
  'local-info',
  'parenting',
  'education',
  'sports',
  'hobby-art',
  'tech',
  'legal-admin',
];

export function groupSkillsByCategory(skills: Skill[]): Partial<Record<SkillCategory, Skill[]>> {
  const grouped: Partial<Record<SkillCategory, Skill[]>> = {};
  for (const skill of skills) {
    (grouped[skill.category] ??= []).push(skill);
  }
  return grouped;
}

export const SKILLS_BY_ID: Record<string, Skill> = Object.fromEntries(
  ALL_SKILLS.map((skill) => [skill.id, skill])
);

/** Repairs a persisted skill snapshot (e.g. a stale category from before a taxonomy change) back to its current canonical definition, keyed by id. No-ops for unknown ids. */
export function normalizeSkill(skill: Skill): Skill {
  return SKILLS_BY_ID[skill.id] ?? skill;
}
