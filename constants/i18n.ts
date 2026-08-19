export type Locale = 'ko' | 'en' | 'tl' | 'vi';

export const LOCALES: Locale[] = ['ko', 'en', 'tl', 'vi'];

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  tl: 'Tagalog',
  vi: 'Tiếng Việt',
};

export type TranslationKey =
  | 'welcome.tagline'
  | 'welcome.kakaoLogin'
  | 'welcome.kakaoLoginLoading'
  | 'welcome.errorCancelled'
  | 'welcome.errorNoBackend'
  | 'welcome.errorNoConnection'
  | 'welcome.errorGeneric'
  | 'interestSelection.title'
  | 'interestSelection.subtitle'
  | 'interestSelection.nameLabel'
  | 'interestSelection.namePlaceholder'
  | 'interestSelection.offeredLabel'
  | 'interestSelection.offeredHint'
  | 'interestSelection.wantedLabel'
  | 'interestSelection.wantedHint'
  | 'interestSelection.selectedCount'
  | 'interestSelection.saveButton'
  | 'interestSelection.validationHint'
  | 'profileFields.genderLabel'
  | 'profileFields.genderMale'
  | 'profileFields.genderFemale'
  | 'profileFields.genderUnspecified'
  | 'profileFields.talkStyleLabel'
  | 'profileFields.talkStyleHint'
  | 'profileFields.talkStyleQuiet'
  | 'profileFields.talkStyleLively'
  | 'profileFields.talkStyleNoPreference'
  | 'languagePicker.title'
  | 'tabs.home'
  | 'tabs.community'
  | 'tabs.chat'
  | 'tabs.mypage'
  | 'home.greeting'
  | 'home.recommendedLabel'
  | 'home.recommendedTitle'
  | 'home.noRecommendations'
  | 'home.successFeedLabel'
  | 'home.appointmentWith'
  | 'home.appointmentDefaultPurpose'
  | 'neighborCard.top'
  | 'neighborCard.offers'
  | 'neighborCard.matchButton'
  | 'locationHeader.pickTitle'
  | 'locationHeader.notifTitle'
  | 'microGroup.aiLabel'
  | 'microGroup.title'
  | 'microGroup.interestCount'
  | 'microGroup.joined'
  | 'microGroup.join'
  | 'feed.label'
  | 'feed.title'
  | 'feed.category.exchange'
  | 'feed.category.question'
  | 'feed.category.group'
  | 'feed.neighborFallback'
  | 'chat.emptyTitle'
  | 'chat.emptyDescription'
  | 'chat.startConversation'
  | 'chat.directChannelTag'
  | 'chatroom.defaultCounterpart'
  | 'chatroom.smartReply1'
  | 'chatroom.smartReply2'
  | 'chatroom.smartReply3'
  | 'chatroom.inputPlaceholder'
  | 'chatroom.aiContextLabel'
  | 'chatroom.culturalGuideTitle'
  | 'chatroom.notFound'
  | 'chatroom.replyLoading'
  | 'chatroom.viewOriginal'
  | 'chatroom.viewTranslation'
  | 'appointmentCard.confirmed'
  | 'appointmentCard.defaultZone'
  | 'appointmentCard.checkinButton'
  | 'appointmentForm.title'
  | 'appointmentForm.subtitle'
  | 'appointmentForm.aiSuggestButton'
  | 'appointmentForm.aiSuggesting'
  | 'appointmentForm.dateLabel'
  | 'appointmentForm.timeLabel'
  | 'appointmentForm.purposeLabel'
  | 'appointmentForm.purposePlaceholder'
  | 'appointmentForm.pickPlace'
  | 'appointmentForm.confirmButton'
  | 'appointmentForm.notFound'
  | 'safeZone.aiLabel'
  | 'safeZone.recommended'
  | 'safeZone.scoreLabel'
  | 'safeZone.refreshButton'
  | 'safeZone.refreshing'
  | 'safeZone.analyzing'
  | 'mypage.pointsLabel'
  | 'mypage.volunteerLabel'
  | 'mypage.badgesLabel'
  | 'mypage.earnedBadges'
  | 'mypage.logout'
  | 'mypage.noItems'
  | 'mypage.offeredLabel'
  | 'mypage.wantedLabel'
  | 'edit.title'
  | 'edit.changePhoto'
  | 'edit.bioLabel'
  | 'edit.bioPlaceholder'
  | 'edit.tagHint'
  | 'edit.save'
  | 'verification.title'
  | 'verification.cardSubtitle'
  | 'verification.subtitle'
  | 'verification.stepSubmit'
  | 'verification.stepReview'
  | 'verification.stepDone'
  | 'verification.verifiedTitle'
  | 'verification.verifiedSubtitle'
  | 'verification.startTitle'
  | 'verification.docTypeLabel'
  | 'verification.docIdCard'
  | 'verification.docForeignCard'
  | 'verification.pending'
  | 'verification.rejected'
  | 'verification.submit'
  | 'verification.resubmit'
  | 'verification.devTools'
  | 'verification.approve'
  | 'verification.reject'
  | 'uploader.placeholder'
  | 'meetupWarning.title'
  | 'meetupWarning.headline'
  | 'meetupWarning.item1'
  | 'meetupWarning.item2'
  | 'meetupWarning.item3'
  | 'meetupWarning.item4'
  | 'meetupWarning.checkbox'
  | 'meetupWarning.continue'
  | 'meetupQr.title'
  | 'meetupQr.subtitle'
  | 'meetupQr.checkedInTitle'
  | 'meetupQr.reward'
  | 'meetupQr.reviewButton'
  | 'meetupQr.notFound'
  | 'qrScan.button'
  | 'qrScan.scanning'
  | 'review.title'
  | 'review.headerTitle'
  | 'review.q1'
  | 'review.q2'
  | 'review.q3'
  | 'review.warningHint'
  | 'review.yes'
  | 'review.no'
  | 'review.submit'
  | 'review.submitted'
  | 'review.badgeInfo'
  | 'review.waitingCounterpart'
  | 'review.checkingCounterpart'
  | 'review.simulateButton'
  | 'review.negativeThanks'
  | 'review.backToChat'
  | 'review.notFound'
  | 'badge.confirm'
  | 'badge.notFound'
  | 'badgeUnlock.title'
  | 'badgeUnlock.directChannelInfo'
  | 'skill.skill_native_english'
  | 'skill.skill_filipino_cooking'
  | 'skill.skill_sea_culture'
  | 'skill.skill_korean_language'
  | 'skill.skill_school_notice'
  | 'skill.skill_local_info'
  | 'skill.skill_korean_cooking'
  | 'skill.skill_kids_english'
  | 'skill.skill_multicultural_playdate'
  | 'skill.skill_school_enrollment_help'
  | 'skill.skill_futsal_partner'
  | 'skill.skill_hiking_buddy'
  | 'skill.skill_badminton_partner'
  | 'skill.skill_morning_jogging'
  | 'skill.skill_traditional_craft'
  | 'skill.skill_kpop_dance'
  | 'skill.skill_photography_walk'
  | 'skill.skill_home_country_music'
  | 'skill.skill_smartphone_help'
  | 'skill.skill_online_banking_help'
  | 'skill.skill_document_editing_help'
  | 'skill.skill_basic_coding'
  | 'skill.skill_visa_info_share'
  | 'skill.skill_immigration_office_accompany'
  | 'skill.skill_labor_rights_info'
  | 'skill.skill_admin_document_help'
  | 'skillCategory.language'
  | 'skillCategory.culture'
  | 'skillCategory.cooking'
  | 'skillCategory.local-info'
  | 'skillCategory.parenting'
  | 'skillCategory.education'
  | 'skillCategory.sports'
  | 'skillCategory.hobby-art'
  | 'skillCategory.tech'
  | 'skillCategory.legal-admin'
  | 'culturalMap.title'
  | 'culturalMap.empty'
  | 'culturalMap.entryCardTitle'
  | 'culturalMap.entryCardSubtitle'
  | 'culturalMap.newPinTitle'
  | 'culturalMap.newPinSubtitle'
  | 'culturalMap.titleLabel'
  | 'culturalMap.titlePlaceholder'
  | 'culturalMap.storyLabel'
  | 'culturalMap.storyPlaceholder'
  | 'culturalMap.categoryLabel'
  | 'culturalMap.category.food'
  | 'culturalMap.category.study'
  | 'culturalMap.category.shopping'
  | 'culturalMap.category.culture-spot'
  | 'culturalMap.category.nature'
  | 'culturalMap.category.other'
  | 'culturalMap.addressLabel'
  | 'culturalMap.addressPlaceholder'
  | 'culturalMap.currentLocationHint'
  | 'culturalMap.submitting'
  | 'culturalMap.submitButton'
  | 'culturalMap.locationPermissionDenied'
  | 'culturalMap.locationFetchFailed'
  | 'culturalMap.pinNotFoundTitle'
  | 'culturalMap.pinDetailTitle'
  | 'culturalMap.registeredBy'
  | 'culturalMap.verifiedCount'
  | 'culturalMap.isAuthorLabel'
  | 'culturalMap.alreadyVerifiedLabel'
  | 'culturalMap.verifying'
  | 'culturalMap.verifyButton'
  | 'culturalMap.verifySuccess'
  | 'culturalMap.verifyErrorSelf'
  | 'culturalMap.verifyErrorDuplicate'
  | 'culturalMap.verifyErrorTooFar'
  | 'culturalMap.verifyErrorNotFound'
  | 'culturalMap.verifyErrorOffline';

export const TRANSLATIONS: Record<Locale, Record<TranslationKey, string>> = {
  ko: {
    'welcome.tagline': '이웃과 재능을 나누는\n가장 안전한 하이퍼로컬 커뮤니티',
    'welcome.kakaoLogin': '카카오로 시작하기',
    'welcome.kakaoLoginLoading': '로그인 처리 중...',
    'welcome.errorCancelled': '카카오 로그인이 취소되었거나 실패했어요.',
    'welcome.errorNoBackend': '서버 주소가 설정되지 않았어요.',
    'welcome.errorNoConnection': '백엔드 서버에 연결할 수 없어요. 인터넷 연결과 서버 주소를 확인해주세요.',
    'welcome.errorGeneric': '로그인 처리에 실패했어요.',
    'interestSelection.title': '관심사 설정',
    'interestSelection.subtitle': '이름과 관심사를 알려주시면 AI가 딱 맞는 이웃을 찾아드려요.',
    'interestSelection.nameLabel': '이름',
    'interestSelection.namePlaceholder': '이웃들에게 보여질 이름',
    'interestSelection.offeredLabel': '줄 수 있어요',
    'interestSelection.offeredHint': '내가 이웃에게 나눠줄 수 있는 재능을 골라주세요',
    'interestSelection.wantedLabel': '받고 싶어요',
    'interestSelection.wantedHint': '이웃에게 배우고 싶은 재능을 골라주세요',
    'interestSelection.selectedCount': '{count}개 선택됨',
    'interestSelection.saveButton': '저장하고 이웃 추천받기',
    'interestSelection.validationHint': '이름을 입력하고 줄 수 있어요·받고 싶어요를 각각 1개 이상 선택해주세요',
    'profileFields.genderLabel': '성별 (선택)',
    'profileFields.genderMale': '남성',
    'profileFields.genderFemale': '여성',
    'profileFields.genderUnspecified': '선택 안 함',
    'profileFields.talkStyleLabel': '대화 성향 (선택)',
    'profileFields.talkStyleHint': 'AI가 만남 장소를 추천할 때 참고해요',
    'profileFields.talkStyleQuiet': '조용한 곳이 좋아요',
    'profileFields.talkStyleLively': '활기찬 곳이 좋아요',
    'profileFields.talkStyleNoPreference': '상관없어요',
    'languagePicker.title': '언어 선택',
    'tabs.home': '홈',
    'tabs.community': '커뮤니티',
    'tabs.chat': '채팅',
    'tabs.mypage': '마이페이지',
    'home.greeting': '안녕하세요,\n{name}님',
    'home.recommendedLabel': '오늘의 AI 추천',
    'home.recommendedTitle': '이런 이웃은 어때요?',
    'home.noRecommendations': '아직 추천할 이웃이 없어요.\n곧 새로운 이웃이 가입하면 여기 채워질 거예요!',
    'home.successFeedLabel': '실시간 매칭 성공 소식',
    'home.appointmentWith': '{name} 이웃과의 약속',
    'home.appointmentDefaultPurpose': '이웃 교류',
    'neighborCard.top': 'TOP',
    'neighborCard.offers': '{skill} 나눠줄 수 있어요',
    'neighborCard.matchButton': '매칭하기',
    'locationHeader.pickTitle': '동네 선택',
    'locationHeader.notifTitle': '알림',
    'microGroup.aiLabel': 'AI 추천',
    'microGroup.title': '동네 소모임',
    'microGroup.interestCount': '관심 {count}/{max}명',
    'microGroup.joined': '참여 신청됨',
    'microGroup.join': '관심 있어요',
    'feed.label': '동네 이야기',
    'feed.title': '교류 게시판',
    'feed.category.exchange': '재능교류',
    'feed.category.question': '동네질문',
    'feed.category.group': '소모임',
    'feed.neighborFallback': '이웃',
    'chat.emptyTitle': '아직 대화가 없어요',
    'chat.emptyDescription': '홈에서 매칭하기를 눌러 새로운 이웃을 만나보세요.',
    'chat.startConversation': '대화를 시작해보세요',
    'chat.directChannelTag': '단짝 이웃',
    'chatroom.defaultCounterpart': '대화 상대',
    'chatroom.smartReply1': '{skill} 알려주실 수 있나요?',
    'chatroom.smartReply2': '{skill}은 제가 도와드릴 수 있어요!',
    'chatroom.smartReply3': '이번 주에 시간 괜찮으신 날 있으세요?',
    'chatroom.inputPlaceholder': '메시지를 입력하세요',
    'chatroom.aiContextLabel': 'AI 매칭 목적 · 호환 지수 {score}%',
    'chatroom.culturalGuideTitle': 'AI 문화 맥락 가이드',
    'chatroom.notFound': '대화방을 찾을 수 없어요.',
    'chatroom.replyLoading': '답장을 작성 중이에요...',
    'chatroom.viewOriginal': '원문 보기',
    'chatroom.viewTranslation': '번역 보기',
    'appointmentCard.confirmed': '약속이 확정되었어요',
    'appointmentCard.defaultZone': '안심존',
    'appointmentCard.checkinButton': '현장 체크인 하러 가기',
    'appointmentForm.title': '약속 잡기 (원터치)',
    'appointmentForm.subtitle': '{name}님과의 만남을 날짜·시간·장소까지 한번에 정해보세요.',
    'appointmentForm.aiSuggestButton': 'AI 약속 추천받기',
    'appointmentForm.aiSuggesting': 'AI가 약속을 추천하는 중...',
    'appointmentForm.dateLabel': '날짜',
    'appointmentForm.timeLabel': '시간',
    'appointmentForm.purposeLabel': '약속 목적',
    'appointmentForm.purposePlaceholder': '예: 생활 영어 & 아도보 요리 교류',
    'appointmentForm.pickPlace': '장소를 선택해주세요',
    'appointmentForm.confirmButton': '약속 확정하기',
    'appointmentForm.notFound': '대화 정보를 찾을 수 없어요.',
    'safeZone.aiLabel': 'AI 추천 안심존',
    'safeZone.recommended': '추천',
    'safeZone.scoreLabel': 'AI 안심 지수 {score}점',
    'safeZone.refreshButton': 'AI 재분석',
    'safeZone.refreshing': '분석 중...',
    'safeZone.analyzing': 'AI가 두 분의 동선·시간대·대화 성향을 분석해서 안심존을 고르는 중이에요...',
    'mypage.pointsLabel': '포인트',
    'mypage.volunteerLabel': '봉사 (분)',
    'mypage.badgesLabel': '뱃지',
    'mypage.earnedBadges': '획득한 뱃지',
    'mypage.logout': '로그아웃',
    'mypage.noItems': '아직 등록된 항목이 없어요.',
    'mypage.offeredLabel': '줄 수 있어요',
    'mypage.wantedLabel': '받고 싶어요',
    'edit.title': '프로필 수정',
    'edit.changePhoto': '탭해서 프로필 사진 변경',
    'edit.bioLabel': '소개',
    'edit.bioPlaceholder': '이웃들에게 나를 짧게 소개해보세요',
    'edit.tagHint': '태그를 눌러 빼거나, 아래에서 더 추가해보세요',
    'edit.save': '저장하기',
    'verification.title': '수동 안심인증',
    'verification.cardSubtitle': '신분증·외국인등록증 수동 안심인증',
    'verification.subtitle': '제출하신 서류는 OCR 자동 인식 없이, 운영팀이 직접 육안으로 확인 후 승인해드려요.',
    'verification.stepSubmit': '제출',
    'verification.stepReview': '검토 중',
    'verification.stepDone': '인증 완료',
    'verification.verifiedTitle': '인증 완료',
    'verification.verifiedSubtitle': '안심인증 뱃지가 부여됐어요',
    'verification.startTitle': '안심인증 시작하기',
    'verification.docTypeLabel': '서류 종류',
    'verification.docIdCard': '주민등록증 / 운전면허증',
    'verification.docForeignCard': '외국인등록증',
    'verification.pending': '검토 대기 중이에요. 영업일 기준 1~2일 이내 완료돼요.',
    'verification.rejected': '반려되었어요. 서류를 다시 확인 후 제출해주세요.',
    'verification.submit': '제출하기',
    'verification.resubmit': '재제출하기',
    'verification.devTools': 'DEV TOOLS · 관리자 검토 시뮬레이션',
    'verification.approve': '승인 처리',
    'verification.reject': '반려 처리',
    'uploader.placeholder': '신분증 · 외국인등록증 사진 업로드',
    'meetupWarning.title': '만남 전 안내사항',
    'meetupWarning.headline': '안전한 만남을 위해 꼭 확인해주세요',
    'meetupWarning.item1': '반드시 앱에서 확정된 Safe Zone(안심존)에서만 만나주세요.',
    'meetupWarning.item2': '무단 노쇼(No-show)가 반복될 경우 계정 이용이 제한될 수 있어요.',
    'meetupWarning.item3': '본래 교류 목적과 다른 부적절한 언행이나 접근은 즉시 신고 및 제재 대상이 됩니다.',
    'meetupWarning.item4': '만남 후에는 3초 매너 후기를 꼭 남겨주세요. 안전한 커뮤니티를 함께 만들어가요.',
    'meetupWarning.checkbox': '위 안내사항을 모두 확인했습니다.',
    'meetupWarning.continue': '계속하기',
    'meetupQr.title': '현장 인증',
    'meetupQr.subtitle': 'Safe Zone에 도착했다면 QR을 스캔해서 출석을 인증해주세요.',
    'meetupQr.checkedInTitle': '체크인 완료!',
    'meetupQr.reward': '+{points} 포인트 · +{minutes}분 봉사시간 적립',
    'meetupQr.reviewButton': '3초 후기 남기러 가기',
    'meetupQr.notFound': '약속 정보를 찾을 수 없어요.',
    'qrScan.button': 'QR 스캔하여 체크인',
    'qrScan.scanning': '스캔 중...',
    'review.title': '3초 후기',
    'review.headerTitle': '3초 안전·매너 후기',
    'review.q1': '1. 약속된 Safe Zone에서 만났나요?',
    'review.q2': '2. 상호 재능 교류가 원활하게 이루어졌나요?',
    'review.q3': '3. 불쾌한 언행이나 본래 목적 외 접근이 있었나요?',
    'review.warningHint': '* 3번 질문은 부정적인 상황을 묻는 질문이에요. 안전한 만남이었다면 "아니오"를 선택해주세요.',
    'review.yes': '예',
    'review.no': '아니오',
    'review.submit': '후기 제출하기',
    'review.submitted': '후기 제출 완료!',
    'review.badgeInfo': '상대방의 후기도 함께 확인되면 "단짝 이웃" 뱃지가 발급돼요.',
    'review.waitingCounterpart': '아직 상대방이 후기를 남기지 않았어요.',
    'review.checkingCounterpart': '상대방 후기를 확인하는 중이에요...',
    'review.simulateButton': '상대방 후기 시뮬레이션 (테스트용)',
    'review.negativeThanks': '소중한 의견 감사해요. 안전 관련 응답은 운영팀이 확인할 수 있어요.',
    'review.backToChat': '채팅방으로 돌아가기',
    'review.notFound': '약속 정보를 찾을 수 없어요.',
    'badge.confirm': '확인',
    'badge.notFound': '뱃지 정보를 찾을 수 없어요.',
    'badgeUnlock.title': '{name} 뱃지 획득!',
    'badgeUnlock.directChannelInfo': '이제부터 AI 매칭 절차 없이\n1:1 다이렉트 채널로 자유롭게 대화할 수 있어요.',
    'skill.skill_native_english': '네이티브 영어 회화',
    'skill.skill_filipino_cooking': '필리핀 가정식 요리 (아도보 등)',
    'skill.skill_sea_culture': '동남아시아 문화 공유',
    'skill.skill_korean_language': '한국어 회화',
    'skill.skill_school_notice': '초등학교 알림장·가정통신문 이해 돕기',
    'skill.skill_local_info': '경산시 생활 정보 안내',
    'skill.skill_korean_cooking': '한국 가정식 요리',
    'skill.skill_kids_english': '아이 영어 노출 프로그램',
    'skill.skill_multicultural_playdate': '다문화 가정 아이 놀이 모임',
    'skill.skill_school_enrollment_help': '자녀 학교 입학·전입학 행정 안내',
    'skill.skill_futsal_partner': '풋살/축구 같이 하기',
    'skill.skill_hiking_buddy': '등산 동행',
    'skill.skill_badminton_partner': '배드민턴 파트너',
    'skill.skill_morning_jogging': '아침 조깅 모임',
    'skill.skill_traditional_craft': '전통 공예 나눔',
    'skill.skill_kpop_dance': 'K-POP 커버댄스',
    'skill.skill_photography_walk': '사진 산책',
    'skill.skill_home_country_music': '자국 전통음악·악기 소개',
    'skill.skill_smartphone_help': '스마트폰·행정앱 사용법',
    'skill.skill_online_banking_help': '인터넷/모바일 뱅킹 도움',
    'skill.skill_document_editing_help': '문서 작업 도움',
    'skill.skill_basic_coding': '기초 코딩 배우기',
    'skill.skill_visa_info_share': '비자·체류 절차 정보 공유',
    'skill.skill_immigration_office_accompany': '출입국관리사무소 동행',
    'skill.skill_labor_rights_info': '근로·임금 기초 정보 공유',
    'skill.skill_admin_document_help': '행정 서류 작성 도움',
    'skillCategory.language': '언어',
    'skillCategory.culture': '문화 교류',
    'skillCategory.cooking': '요리',
    'skillCategory.local-info': '생활 정보',
    'skillCategory.parenting': '육아',
    'skillCategory.education': '교육',
    'skillCategory.sports': '스포츠/운동',
    'skillCategory.hobby-art': '취미/예술',
    'skillCategory.tech': 'IT/컴퓨터',
    'skillCategory.legal-admin': '법률/행정 상담',
    'culturalMap.title': '컬처럴 맵',
    'culturalMap.empty': '아직 등록된 핀이 없어요. 첫 스팟을 등록해보세요!',
    'culturalMap.entryCardTitle': '🗺️ 컬처럴 맵 보기',
    'culturalMap.entryCardSubtitle': '이웃이 발견한 동네 숨은 스팟을 지도에서 만나보세요',
    'culturalMap.newPinTitle': '스팟 등록하기',
    'culturalMap.newPinSubtitle': '내가 발견한 동네 스팟을 이웃들에게 소개해주세요',
    'culturalMap.titleLabel': '스팟 이름',
    'culturalMap.titlePlaceholder': '예: 향신료 파는 동네 슈퍼',
    'culturalMap.storyLabel': '나만의 이야기',
    'culturalMap.storyPlaceholder': '이 장소를 어떻게 알게 됐는지, 왜 추천하는지 들려주세요',
    'culturalMap.categoryLabel': '카테고리',
    'culturalMap.category.food': '음식/식료품',
    'culturalMap.category.study': '공부/카페',
    'culturalMap.category.shopping': '쇼핑',
    'culturalMap.category.culture-spot': '문화체험',
    'culturalMap.category.nature': '자연/산책',
    'culturalMap.category.other': '기타',
    'culturalMap.addressLabel': '주소 (선택)',
    'culturalMap.addressPlaceholder': '예: 경상북도 경산시 중산로 32',
    'culturalMap.currentLocationHint': '등록 버튼을 누르면 지금 서 있는 위치가 핀 좌표로 저장돼요',
    'culturalMap.submitting': '등록 중...',
    'culturalMap.submitButton': '현재 위치에 등록하기',
    'culturalMap.locationPermissionDenied': '위치 권한이 필요해요.',
    'culturalMap.locationFetchFailed': '위치를 가져오지 못했어요. 다시 시도해주세요.',
    'culturalMap.pinNotFoundTitle': '핀을 찾을 수 없어요',
    'culturalMap.pinDetailTitle': '스팟 정보',
    'culturalMap.registeredBy': '{name}님이 등록했어요',
    'culturalMap.verifiedCount': '인증 {count}회',
    'culturalMap.isAuthorLabel': '내가 등록한 스팟이에요',
    'culturalMap.alreadyVerifiedLabel': '이미 인증했어요',
    'culturalMap.verifying': '인증 중...',
    'culturalMap.verifyButton': '방문 인증하기',
    'culturalMap.verifySuccess': '인증 완료! {name}님에게 교류 포인트가 적립됐어요',
    'culturalMap.verifyErrorSelf': '본인이 등록한 핀은 인증할 수 없어요.',
    'culturalMap.verifyErrorDuplicate': '이미 인증한 핀이에요.',
    'culturalMap.verifyErrorTooFar': '핀 장소 근처에서만 인증할 수 있어요.',
    'culturalMap.verifyErrorNotFound': '핀을 찾을 수 없어요.',
    'culturalMap.verifyErrorOffline': '인증에 실패했어요. 네트워크를 확인해주세요.',
  },
  en: {
    'welcome.tagline': 'The safest hyperlocal community\nfor sharing talents with your neighbors',
    'welcome.kakaoLogin': 'Continue with Kakao',
    'welcome.kakaoLoginLoading': 'Signing you in...',
    'welcome.errorCancelled': 'Kakao login was cancelled or failed.',
    'welcome.errorNoBackend': "The server address isn't configured.",
    'welcome.errorNoConnection': "Couldn't reach the server. Please check your internet connection.",
    'welcome.errorGeneric': 'Login failed.',
    'interestSelection.title': 'Set your interests',
    'interestSelection.subtitle': 'Tell us your name and interests, and our AI will find the perfect neighbors for you.',
    'interestSelection.nameLabel': 'Name',
    'interestSelection.namePlaceholder': 'The name your neighbors will see',
    'interestSelection.offeredLabel': 'I can offer',
    'interestSelection.offeredHint': 'Pick the skills you can share with your neighbors',
    'interestSelection.wantedLabel': 'I want to learn',
    'interestSelection.wantedHint': "Pick the skills you'd like to learn from neighbors",
    'interestSelection.selectedCount': '{count} selected',
    'interestSelection.saveButton': 'Save & get matched',
    'interestSelection.validationHint': 'Enter your name and pick at least one skill in each category',
    'profileFields.genderLabel': 'Gender (optional)',
    'profileFields.genderMale': 'Male',
    'profileFields.genderFemale': 'Female',
    'profileFields.genderUnspecified': 'Prefer not to say',
    'profileFields.talkStyleLabel': 'Talk style (optional)',
    'profileFields.talkStyleHint': "Helps AI pick the right kind of meetup spot for you",
    'profileFields.talkStyleQuiet': 'I like quiet places',
    'profileFields.talkStyleLively': 'I like lively places',
    'profileFields.talkStyleNoPreference': 'No preference',
    'languagePicker.title': 'Choose a language',
    'tabs.home': 'Home',
    'tabs.community': 'Community',
    'tabs.chat': 'Chat',
    'tabs.mypage': 'My Page',
    'home.greeting': 'Hello,\n{name}',
    'home.recommendedLabel': "Today's AI pick",
    'home.recommendedTitle': 'How about these neighbors?',
    'home.noRecommendations': "No neighbors to recommend yet.\nThis will fill up as new neighbors join!",
    'home.successFeedLabel': 'Live match success stories',
    'home.appointmentWith': 'Meetup with {name}',
    'home.appointmentDefaultPurpose': 'Neighbor exchange',
    'neighborCard.top': 'TOP',
    'neighborCard.offers': 'Can share {skill}',
    'neighborCard.matchButton': 'Match',
    'locationHeader.pickTitle': 'Choose neighborhood',
    'locationHeader.notifTitle': 'Notifications',
    'microGroup.aiLabel': 'AI pick',
    'microGroup.title': 'Neighborhood meetups',
    'microGroup.interestCount': '{count}/{max} interested',
    'microGroup.joined': 'Joined',
    'microGroup.join': "I'm interested",
    'feed.label': 'Neighborhood stories',
    'feed.title': 'Exchange board',
    'feed.category.exchange': 'Skill exchange',
    'feed.category.question': 'Neighborhood Q&A',
    'feed.category.group': 'Meetup',
    'feed.neighborFallback': 'Neighbor',
    'chat.emptyTitle': 'No conversations yet',
    'chat.emptyDescription': 'Tap Match on the Home tab to meet new neighbors.',
    'chat.startConversation': 'Start a conversation',
    'chat.directChannelTag': 'Best neighbor',
    'chatroom.defaultCounterpart': 'Chat partner',
    'chatroom.smartReply1': 'Could you teach me {skill}?',
    'chatroom.smartReply2': 'I can help you with {skill}!',
    'chatroom.smartReply3': 'Any day this week that works for you?',
    'chatroom.inputPlaceholder': 'Type a message',
    'chatroom.aiContextLabel': 'AI match purpose · {score}% compatible',
    'chatroom.culturalGuideTitle': 'AI cultural context guide',
    'chatroom.notFound': "Couldn't find this conversation.",
    'chatroom.replyLoading': 'Writing a reply...',
    'chatroom.viewOriginal': 'View original',
    'chatroom.viewTranslation': 'View translation',
    'appointmentCard.confirmed': 'Appointment confirmed',
    'appointmentCard.defaultZone': 'Safe zone',
    'appointmentCard.checkinButton': 'Go check in on site',
    'appointmentForm.title': 'Schedule a meetup',
    'appointmentForm.subtitle': 'Set the date, time, and place for your meetup with {name} all at once.',
    'appointmentForm.aiSuggestButton': 'Get an AI suggestion',
    'appointmentForm.aiSuggesting': 'AI is suggesting a plan...',
    'appointmentForm.dateLabel': 'Date',
    'appointmentForm.timeLabel': 'Time',
    'appointmentForm.purposeLabel': 'Purpose',
    'appointmentForm.purposePlaceholder': 'e.g. Everyday English & Adobo cooking exchange',
    'appointmentForm.pickPlace': 'Please choose a place',
    'appointmentForm.confirmButton': 'Confirm appointment',
    'appointmentForm.notFound': "Couldn't find this conversation.",
    'safeZone.aiLabel': 'AI-recommended safe zones',
    'safeZone.recommended': 'Recommended',
    'safeZone.scoreLabel': 'AI safety score: {score}',
    'safeZone.refreshButton': 'Re-analyze with AI',
    'safeZone.refreshing': 'Analyzing...',
    'safeZone.analyzing': "AI is analyzing your routes, meeting time, and talk styles to pick a safe zone...",
    'mypage.pointsLabel': 'Points',
    'mypage.volunteerLabel': 'Volunteer (min)',
    'mypage.badgesLabel': 'Badges',
    'mypage.earnedBadges': 'Badges earned',
    'mypage.logout': 'Log out',
    'mypage.noItems': 'Nothing added yet.',
    'mypage.offeredLabel': 'I can offer',
    'mypage.wantedLabel': 'I want to learn',
    'edit.title': 'Edit profile',
    'edit.changePhoto': 'Tap to change your photo',
    'edit.bioLabel': 'Bio',
    'edit.bioPlaceholder': 'Give your neighbors a short intro',
    'edit.tagHint': 'Tap a tag to remove it, or add more below',
    'edit.save': 'Save',
    'verification.title': 'Manual safety verification',
    'verification.cardSubtitle': 'Manual safety verification via ID / Foreign Resident Card',
    'verification.subtitle':
      'Your documents are reviewed by our team in person, with no automatic OCR scanning, before approval.',
    'verification.stepSubmit': 'Submit',
    'verification.stepReview': 'Reviewing',
    'verification.stepDone': 'Verified',
    'verification.verifiedTitle': 'Verified',
    'verification.verifiedSubtitle': "You've received the safety badge",
    'verification.startTitle': 'Start safety verification',
    'verification.docTypeLabel': 'Document type',
    'verification.docIdCard': 'ID card / Driver’s license',
    'verification.docForeignCard': 'Foreign Resident Card',
    'verification.pending': 'Under review — usually done within 1-2 business days.',
    'verification.rejected': 'Rejected. Please double check your documents and resubmit.',
    'verification.submit': 'Submit',
    'verification.resubmit': 'Resubmit',
    'verification.devTools': 'DEV TOOLS · admin review simulation',
    'verification.approve': 'Approve',
    'verification.reject': 'Reject',
    'uploader.placeholder': 'Upload a photo of your ID',
    'meetupWarning.title': 'Before you meet',
    'meetupWarning.headline': 'Please review these for a safe meetup',
    'meetupWarning.item1': 'Only meet at a Safe Zone confirmed in the app.',
    'meetupWarning.item2': 'Repeated no-shows may lead to account restrictions.',
    'meetupWarning.item3':
      'Inappropriate behavior or approaches outside the stated purpose will be reported and penalized immediately.',
    'meetupWarning.item4':
      "Please leave a 3-second manners review after meeting — let's build a safe community together.",
    'meetupWarning.checkbox': "I've read and agree to all of the above.",
    'meetupWarning.continue': 'Continue',
    'meetupQr.title': 'On-site check-in',
    'meetupQr.subtitle': 'Once you arrive at the Safe Zone, scan the QR code to check in.',
    'meetupQr.checkedInTitle': 'Checked in!',
    'meetupQr.reward': '+{points} pts · +{minutes} min volunteer time earned',
    'meetupQr.reviewButton': 'Leave a 3-second review',
    'meetupQr.notFound': "Couldn't find this appointment.",
    'qrScan.button': 'Scan QR to check in',
    'qrScan.scanning': 'Scanning...',
    'review.title': '3-second review',
    'review.headerTitle': '3-second safety & manners review',
    'review.q1': '1. Did you meet at the agreed Safe Zone?',
    'review.q2': '2. Did the skill exchange go smoothly?',
    'review.q3': '3. Was there any uncomfortable behavior or approach outside the original purpose?',
    'review.warningHint': '* Question 3 asks about a negative situation — choose "No" if the meetup was safe.',
    'review.yes': 'Yes',
    'review.no': 'No',
    'review.submit': 'Submit review',
    'review.submitted': 'Review submitted!',
    'review.badgeInfo': 'Once your neighbor\'s review comes in too, you\'ll get the "Best Neighbor" badge.',
    'review.waitingCounterpart': "Your neighbor hasn't left a review yet.",
    'review.checkingCounterpart': "Checking for your neighbor's review...",
    'review.simulateButton': "Simulate neighbor's review (test)",
    'review.negativeThanks': 'Thanks for the feedback — safety-related answers may be reviewed by our team.',
    'review.backToChat': 'Back to chat',
    'review.notFound': "Couldn't find this appointment.",
    'badge.confirm': 'Done',
    'badge.notFound': "Couldn't find this badge.",
    'badgeUnlock.title': '{name} badge earned!',
    'badgeUnlock.directChannelInfo':
      'From now on you can chat freely 1:1,\nwithout going through AI matching.',
    'skill.skill_native_english': 'Native English conversation',
    'skill.skill_filipino_cooking': 'Filipino home cooking (Adobo, etc.)',
    'skill.skill_sea_culture': 'Southeast Asian culture sharing',
    'skill.skill_korean_language': 'Korean conversation',
    'skill.skill_school_notice': 'Help understanding school notices',
    'skill.skill_local_info': 'Gyeongsan living info guide',
    'skill.skill_korean_cooking': 'Korean home cooking',
    'skill.skill_kids_english': "Kids' English exposure program",
    'skill.skill_multicultural_playdate': 'Multicultural family playdates',
    'skill.skill_school_enrollment_help': 'Help with school enrollment/transfer paperwork',
    'skill.skill_futsal_partner': 'Play futsal/soccer together',
    'skill.skill_hiking_buddy': 'Hiking companion',
    'skill.skill_badminton_partner': 'Badminton partner',
    'skill.skill_morning_jogging': 'Morning jogging group',
    'skill.skill_traditional_craft': 'Traditional craft sharing',
    'skill.skill_kpop_dance': 'K-pop cover dance',
    'skill.skill_photography_walk': 'Photography walk',
    'skill.skill_home_country_music': 'Home-country traditional music/instruments',
    'skill.skill_smartphone_help': 'Smartphone & government-app help',
    'skill.skill_online_banking_help': 'Online/mobile banking help',
    'skill.skill_document_editing_help': 'Document editing help',
    'skill.skill_basic_coding': 'Learn basic coding',
    'skill.skill_visa_info_share': 'Visa/residency process info sharing',
    'skill.skill_immigration_office_accompany': 'Immigration office accompaniment',
    'skill.skill_labor_rights_info': 'Basic labor/wage info sharing',
    'skill.skill_admin_document_help': 'Help with admin paperwork',
    'skillCategory.language': 'Language',
    'skillCategory.culture': 'Culture exchange',
    'skillCategory.cooking': 'Cooking',
    'skillCategory.local-info': 'Local info',
    'skillCategory.parenting': 'Parenting',
    'skillCategory.education': 'Education',
    'skillCategory.sports': 'Sports & exercise',
    'skillCategory.hobby-art': 'Hobbies & arts',
    'skillCategory.tech': 'Tech',
    'skillCategory.legal-admin': 'Legal & admin',
    'culturalMap.title': 'Cultural Map',
    'culturalMap.empty': 'No pins yet. Register the first spot!',
    'culturalMap.entryCardTitle': '🗺️ View Cultural Map',
    'culturalMap.entryCardSubtitle': 'Discover hidden neighborhood spots found by your neighbors',
    'culturalMap.newPinTitle': 'Register a spot',
    'culturalMap.newPinSubtitle': 'Introduce a neighborhood spot you discovered to your neighbors',
    'culturalMap.titleLabel': 'Spot name',
    'culturalMap.titlePlaceholder': 'e.g. The corner store that sells spices',
    'culturalMap.storyLabel': 'Your story',
    'culturalMap.storyPlaceholder': 'Tell us how you found this place and why you recommend it',
    'culturalMap.categoryLabel': 'Category',
    'culturalMap.category.food': 'Food & groceries',
    'culturalMap.category.study': 'Study & cafes',
    'culturalMap.category.shopping': 'Shopping',
    'culturalMap.category.culture-spot': 'Culture spot',
    'culturalMap.category.nature': 'Nature & walks',
    'culturalMap.category.other': 'Other',
    'culturalMap.addressLabel': 'Address (optional)',
    'culturalMap.addressPlaceholder': 'e.g. 32 Jungsan-ro, Gyeongsan',
    'culturalMap.currentLocationHint': 'Tapping submit saves the spot where you are standing right now as the pin location',
    'culturalMap.submitting': 'Submitting...',
    'culturalMap.submitButton': 'Register at my current location',
    'culturalMap.locationPermissionDenied': 'Location permission is required.',
    'culturalMap.locationFetchFailed': 'Could not get your location. Please try again.',
    'culturalMap.pinNotFoundTitle': 'Pin not found',
    'culturalMap.pinDetailTitle': 'Spot details',
    'culturalMap.registeredBy': 'Registered by {name}',
    'culturalMap.verifiedCount': 'Verified {count} times',
    'culturalMap.isAuthorLabel': 'This is your spot',
    'culturalMap.alreadyVerifiedLabel': 'Already verified',
    'culturalMap.verifying': 'Verifying...',
    'culturalMap.verifyButton': 'Verify my visit',
    'culturalMap.verifySuccess': 'Verified! {name} earned exchange points',
    'culturalMap.verifyErrorSelf': "You can't verify your own pin.",
    'culturalMap.verifyErrorDuplicate': "You've already verified this pin.",
    'culturalMap.verifyErrorTooFar': 'You can only verify near the pin location.',
    'culturalMap.verifyErrorNotFound': 'Pin not found.',
    'culturalMap.verifyErrorOffline': 'Verification failed. Please check your connection.',
  },
  tl: {
    'welcome.tagline': 'Ang pinakaligtas na hyperlocal na komunidad\npara sa pagbabahagi ng talento sa mga kapitbahay',
    'welcome.kakaoLogin': 'Magpatuloy gamit ang Kakao',
    'welcome.kakaoLoginLoading': 'Nagpapatuloy sa pag-log in...',
    'welcome.errorCancelled': 'Nakansela o nabigo ang pag-login sa Kakao.',
    'welcome.errorNoBackend': 'Hindi na-configure ang address ng server.',
    'welcome.errorNoConnection': 'Hindi makakonekta sa server. Paki-check ang iyong internet connection.',
    'welcome.errorGeneric': 'Nabigo ang pag-login.',
    'interestSelection.title': 'Itakda ang mga interes',
    'interestSelection.subtitle':
      'Sabihin sa amin ang iyong pangalan at interes, at hahanapin ng AI ang tamang kapitbahay para sa iyo.',
    'interestSelection.nameLabel': 'Pangalan',
    'interestSelection.namePlaceholder': 'Pangalan na makikita ng mga kapitbahay',
    'interestSelection.offeredLabel': 'Kaya kong ibigay',
    'interestSelection.offeredHint': 'Piliin ang mga kasanayang maibabahagi mo sa mga kapitbahay',
    'interestSelection.wantedLabel': 'Gusto kong matutunan',
    'interestSelection.wantedHint': 'Piliin ang mga kasanayang nais matutunan mula sa mga kapitbahay',
    'interestSelection.selectedCount': '{count} napili',
    'interestSelection.saveButton': 'I-save at humanap ng katugma',
    'interestSelection.validationHint': 'Ilagay ang iyong pangalan at pumili ng hindi bababa sa isa sa bawat kategorya',
    'profileFields.genderLabel': 'Kasarian (opsyonal)',
    'profileFields.genderMale': 'Lalaki',
    'profileFields.genderFemale': 'Babae',
    'profileFields.genderUnspecified': 'Mas gusto kong hindi sabihin',
    'profileFields.talkStyleLabel': 'Istilo ng pag-uusap (opsyonal)',
    'profileFields.talkStyleHint': 'Tumutulong ito sa AI na pumili ng tamang lugar para sa inyo',
    'profileFields.talkStyleQuiet': 'Mas gusto ko ang tahimik na lugar',
    'profileFields.talkStyleLively': 'Mas gusto ko ang maliksing lugar',
    'profileFields.talkStyleNoPreference': 'Wala akong preference',
    'languagePicker.title': 'Pumili ng wika',
    'tabs.home': 'Home',
    'tabs.community': 'Komunidad',
    'tabs.chat': 'Chat',
    'tabs.mypage': 'Aking Pahina',
    'home.greeting': 'Kumusta,\n{name}',
    'home.recommendedLabel': 'Rekomendasyon ng AI ngayon',
    'home.recommendedTitle': 'Ano sa palagay mo sa mga kapitbahay na ito?',
    'home.noRecommendations': 'Walang irerekomendang kapitbahay pa.\nMapupuno ito kapag may bagong sumali!',
    'home.successFeedLabel': 'Live na kwento ng matagumpay na tugma',
    'home.appointmentWith': 'Pagkikita kasama si {name}',
    'home.appointmentDefaultPurpose': 'Palitan ng kapitbahay',
    'neighborCard.top': 'TOP',
    'neighborCard.offers': 'Maibabahagi ang {skill}',
    'neighborCard.matchButton': 'Itugma',
    'locationHeader.pickTitle': 'Pumili ng lugar',
    'locationHeader.notifTitle': 'Mga Abiso',
    'microGroup.aiLabel': 'Rekomendasyon ng AI',
    'microGroup.title': 'Mga pagtitipon sa kapitbahayan',
    'microGroup.interestCount': '{count}/{max} interesado',
    'microGroup.joined': 'Sumali na',
    'microGroup.join': 'Interesado ako',
    'feed.label': 'Kwento sa kapitbahayan',
    'feed.title': 'Talakayan sa palitan',
    'feed.category.exchange': 'Palitan ng kasanayan',
    'feed.category.question': 'Tanong sa kapitbahayan',
    'feed.category.group': 'Pagtitipon',
    'feed.neighborFallback': 'Kapitbahay',
    'chat.emptyTitle': 'Walang usapan pa',
    'chat.emptyDescription': 'I-tap ang "Itugma" sa Home para makilala ang bagong kapitbahay.',
    'chat.startConversation': 'Simulan ang pag-uusap',
    'chat.directChannelTag': 'Matalik na kapitbahay',
    'chatroom.defaultCounterpart': 'Kapareha sa chat',
    'chatroom.smartReply1': 'Maituturo mo ba ang {skill}?',
    'chatroom.smartReply2': 'Kaya kong tulungan ka sa {skill}!',
    'chatroom.smartReply3': 'May araw ba ngayong linggo na okay sa iyo?',
    'chatroom.inputPlaceholder': 'Mag-type ng mensahe',
    'chatroom.aiContextLabel': 'Layunin ng AI match · {score}% tugma',
    'chatroom.culturalGuideTitle': 'Gabay sa kultura ng AI',
    'chatroom.notFound': 'Hindi mahanap ang chat room na ito.',
    'chatroom.replyLoading': 'Sumusulat ng sagot...',
    'chatroom.viewOriginal': 'Tingnan ang orihinal',
    'chatroom.viewTranslation': 'Tingnan ang salin',
    'appointmentCard.confirmed': 'Nakumpirma ang appointment',
    'appointmentCard.defaultZone': 'Ligtas na zone',
    'appointmentCard.checkinButton': 'Pumunta para mag-check-in',
    'appointmentForm.title': 'Mag-iskedyul ng pagkikita',
    'appointmentForm.subtitle': 'Itakda ang petsa, oras, at lugar ng pagkikita mo kasama si {name}.',
    'appointmentForm.aiSuggestButton': 'Kumuha ng suhestyon ng AI',
    'appointmentForm.aiSuggesting': 'Nag-iisip ang AI ng plano...',
    'appointmentForm.dateLabel': 'Petsa',
    'appointmentForm.timeLabel': 'Oras',
    'appointmentForm.purposeLabel': 'Layunin',
    'appointmentForm.purposePlaceholder': 'hal.: Pang-araw-araw na Ingles at pagluluto ng adobo',
    'appointmentForm.pickPlace': 'Pumili ng lugar',
    'appointmentForm.confirmButton': 'Kumpirmahin ang appointment',
    'appointmentForm.notFound': 'Hindi mahanap ang impormasyon ng pag-uusap.',
    'safeZone.aiLabel': 'Mga inirerekomendang ligtas na lugar',
    'safeZone.recommended': 'Rekomendado',
    'safeZone.scoreLabel': 'AI safety score: {score}',
    'safeZone.refreshButton': 'I-analyze ulit gamit ang AI',
    'safeZone.refreshing': 'Sinusuri...',
    'safeZone.analyzing': 'Sinusuri ng AI ang inyong ruta, oras ng pagkikita, at istilo ng pag-uusap para pumili ng ligtas na lugar...',
    'mypage.pointsLabel': 'Puntos',
    'mypage.volunteerLabel': 'Boluntaryo (min)',
    'mypage.badgesLabel': 'Mga badge',
    'mypage.earnedBadges': 'Mga natanggap na badge',
    'mypage.logout': 'Mag-log out',
    'mypage.noItems': 'Walang naidagdag pa.',
    'mypage.offeredLabel': 'Kaya kong ibigay',
    'mypage.wantedLabel': 'Gusto kong matutunan',
    'edit.title': 'I-edit ang profile',
    'edit.changePhoto': 'I-tap para baguhin ang larawan',
    'edit.bioLabel': 'Tungkol sa akin',
    'edit.bioPlaceholder': 'Ipakilala ang sarili sa mga kapitbahay',
    'edit.tagHint': 'I-tap ang tag para tanggalin, o magdagdag pa sa ibaba',
    'edit.save': 'I-save',
    'verification.title': 'Manual na beripikasyon ng kaligtasan',
    'verification.cardSubtitle': 'Manual na safety verification gamit ang ID / Foreign Resident Card',
    'verification.subtitle':
      'Ang mga dokumentong isinumite mo ay direktang susuriin ng aming team, walang automatic OCR scanning.',
    'verification.stepSubmit': 'Isumite',
    'verification.stepReview': 'Sinusuri',
    'verification.stepDone': 'Naberipika',
    'verification.verifiedTitle': 'Naberipika na',
    'verification.verifiedSubtitle': 'Natanggap mo ang safety badge',
    'verification.startTitle': 'Simulan ang safety verification',
    'verification.docTypeLabel': 'Uri ng dokumento',
    'verification.docIdCard': 'ID / Lisensya sa pagmaneho',
    'verification.docForeignCard': 'Foreign Resident Card',
    'verification.pending': 'Sinusuri pa — karaniwang tapos sa 1-2 araw ng negosyo.',
    'verification.rejected': 'Tinanggihan. Paki-check ulit ang dokumento at isumite muli.',
    'verification.submit': 'Isumite',
    'verification.resubmit': 'Isumite ulit',
    'verification.devTools': 'DEV TOOLS · simulation ng admin review',
    'verification.approve': 'Aprubahan',
    'verification.reject': 'Tanggihan',
    'uploader.placeholder': 'I-upload ang larawan ng ID',
    'meetupWarning.title': 'Bago magkita',
    'meetupWarning.headline': 'Paki-review ang mga ito para sa ligtas na pagkikita',
    'meetupWarning.item1': 'Magkita lamang sa Safe Zone na nakumpirma sa app.',
    'meetupWarning.item2': 'Ang paulit-ulit na no-show ay maaaring maghigpit sa paggamit ng account.',
    'meetupWarning.item3':
      'Ang hindi angkop na asal o hangarin bukod sa orihinal na layunin ay iri-report at parurusahan kaagad.',
    'meetupWarning.item4':
      'Paki-leave ng 3-segundong review pagkatapos magkita — sama-sama nating gawing ligtas ang komunidad.',
    'meetupWarning.checkbox': 'Nabasa at sumasang-ayon ako sa lahat ng nasa itaas.',
    'meetupWarning.continue': 'Magpatuloy',
    'meetupQr.title': 'Pag-check-in sa lugar',
    'meetupQr.subtitle': 'Kapag nakarating ka sa Safe Zone, i-scan ang QR code para mag-check-in.',
    'meetupQr.checkedInTitle': 'Na-check in!',
    'meetupQr.reward': '+{points} puntos · +{minutes} minutong boluntaryo',
    'meetupQr.reviewButton': 'Mag-leave ng 3-segundong review',
    'meetupQr.notFound': 'Hindi mahanap ang appointment.',
    'qrScan.button': 'I-scan ang QR para mag-check-in',
    'qrScan.scanning': 'Sini-scan...',
    'review.title': '3-segundong review',
    'review.headerTitle': '3-segundong review sa kaligtasan at asal',
    'review.q1': '1. Nagkita ba kayo sa napagkasunduang Safe Zone?',
    'review.q2': '2. Maayos ba ang naganap na palitan ng kasanayan?',
    'review.q3': '3. May naranasan ka bang hindi komportableng asal o hangarin bukod sa layunin?',
    'review.warningHint': '* Ang tanong 3 ay tungkol sa negatibong sitwasyon — piliin ang "Hindi" kung ligtas ang pagkikita.',
    'review.yes': 'Oo',
    'review.no': 'Hindi',
    'review.submit': 'Isumite ang review',
    'review.submitted': 'Naisumite ang review!',
    'review.badgeInfo': 'Kapag natanggap na rin ang review ng kapitbahay mo, makukuha ang "Matalik na Kapitbahay" badge.',
    'review.waitingCounterpart': 'Wala pang review ang kapitbahay mo.',
    'review.checkingCounterpart': 'Kinukuha ang review ng kapitbahay mo...',
    'review.simulateButton': 'I-simulate ang review ng kapitbahay (test)',
    'review.negativeThanks': 'Salamat sa feedback — maaaring suriin ng aming team ang sagot tungkol sa kaligtasan.',
    'review.backToChat': 'Bumalik sa chat',
    'review.notFound': 'Hindi mahanap ang appointment.',
    'badge.confirm': 'OK',
    'badge.notFound': 'Hindi mahanap ang impormasyon ng badge.',
    'badgeUnlock.title': 'Natanggap ang badge na {name}!',
    'badgeUnlock.directChannelInfo':
      'Mula ngayon, malibre kang mag-chat 1:1,\nwalang AI matching na proseso.',
    'skill.skill_native_english': 'Katutubong pag-uusap sa Ingles',
    'skill.skill_filipino_cooking': 'Lutong-bahay na Pilipino (Adobo, atbp.)',
    'skill.skill_sea_culture': 'Pagbabahagi ng kultura ng Timog-silangang Asya',
    'skill.skill_korean_language': 'Pag-uusap sa Koreano',
    'skill.skill_school_notice': 'Tulong sa pag-unawa ng mga abiso ng paaralan',
    'skill.skill_local_info': 'Impormasyon sa pamumuhay sa Gyeongsan',
    'skill.skill_korean_cooking': 'Lutong-bahay na Koreano',
    'skill.skill_kids_english': 'Programa sa pagkilala ng Ingles para sa bata',
    'skill.skill_multicultural_playdate': 'Playdate ng mga anak ng multicultural na pamilya',
    'skill.skill_school_enrollment_help': 'Tulong sa paperwork ng pagpapatala/paglipat ng paaralan',
    'skill.skill_futsal_partner': 'Maglaro ng futsal/soccer nang sama-sama',
    'skill.skill_hiking_buddy': 'Kasama sa pag-hiking',
    'skill.skill_badminton_partner': 'Kasosyo sa badminton',
    'skill.skill_morning_jogging': 'Grupo ng umagang jogging',
    'skill.skill_traditional_craft': 'Pagbahagi ng tradisyunal na crafts',
    'skill.skill_kpop_dance': 'K-pop cover dance',
    'skill.skill_photography_walk': 'Paglalakad habang kumukuha ng litrato',
    'skill.skill_home_country_music': 'Tradisyunal na musika/instrumento ng sariling bansa',
    'skill.skill_smartphone_help': 'Tulong sa smartphone at mga government app',
    'skill.skill_online_banking_help': 'Tulong sa online/mobile banking',
    'skill.skill_document_editing_help': 'Tulong sa pag-edit ng dokumento',
    'skill.skill_basic_coding': 'Matuto ng basic coding',
    'skill.skill_visa_info_share': 'Pagbahagi ng impormasyon sa visa/paninirahan',
    'skill.skill_immigration_office_accompany': 'Samahan sa immigration office',
    'skill.skill_labor_rights_info': 'Batayang impormasyon sa paggawa/sahod',
    'skill.skill_admin_document_help': 'Tulong sa administratibong papeles',
    'skillCategory.language': 'Wika',
    'skillCategory.culture': 'Palitan ng kultura',
    'skillCategory.cooking': 'Pagluluto',
    'skillCategory.local-info': 'Lokal na impormasyon',
    'skillCategory.parenting': 'Pag-aaruga ng anak',
    'skillCategory.education': 'Edukasyon',
    'skillCategory.sports': 'Sports at ehersisyo',
    'skillCategory.hobby-art': 'Hobby at sining',
    'skillCategory.tech': 'Teknolohiya',
    'skillCategory.legal-admin': 'Legal at administratibo',
    'culturalMap.title': 'Cultural Map',
    'culturalMap.empty': 'Walang pin pa. Irehistro ang unang spot!',
    'culturalMap.entryCardTitle': '🗺️ Tingnan ang Cultural Map',
    'culturalMap.entryCardSubtitle': 'Tuklasin ang mga tagong spot sa kapitbahayan na natuklasan ng iyong mga kapitbahay',
    'culturalMap.newPinTitle': 'Irehistro ang isang spot',
    'culturalMap.newPinSubtitle': 'Ipakilala sa mga kapitbahay ang spot na natuklasan mo',
    'culturalMap.titleLabel': 'Pangalan ng spot',
    'culturalMap.titlePlaceholder': 'hal. Ang tindahang nagbebenta ng rekado',
    'culturalMap.storyLabel': 'Iyong kwento',
    'culturalMap.storyPlaceholder': 'Sabihin kung paano mo natuklasan ang lugar na ito at kung bakit mo ito irerekomenda',
    'culturalMap.categoryLabel': 'Kategorya',
    'culturalMap.category.food': 'Pagkain at groseri',
    'culturalMap.category.study': 'Pag-aaral at cafe',
    'culturalMap.category.shopping': 'Shopping',
    'culturalMap.category.culture-spot': 'Kultural na spot',
    'culturalMap.category.nature': 'Kalikasan at paglalakad',
    'culturalMap.category.other': 'Iba pa',
    'culturalMap.addressLabel': 'Address (opsyonal)',
    'culturalMap.addressPlaceholder': 'hal. 32 Jungsan-ro, Gyeongsan',
    'culturalMap.currentLocationHint': 'Kapag pinindot ang submit, ang kasalukuyang lokasyon mo ang mai-save bilang pin',
    'culturalMap.submitting': 'Isinusumite...',
    'culturalMap.submitButton': 'Irehistro sa kasalukuyang lokasyon',
    'culturalMap.locationPermissionDenied': 'Kinakailangan ang location permission.',
    'culturalMap.locationFetchFailed': 'Hindi nakuha ang lokasyon. Subukan ulit.',
    'culturalMap.pinNotFoundTitle': 'Hindi nahanap ang pin',
    'culturalMap.pinDetailTitle': 'Detalye ng spot',
    'culturalMap.registeredBy': 'Nirehistro ni {name}',
    'culturalMap.verifiedCount': 'Na-verify {count} na',
    'culturalMap.isAuthorLabel': 'Ito ang iyong spot',
    'culturalMap.alreadyVerifiedLabel': 'Na-verify na',
    'culturalMap.verifying': 'Iniberipika...',
    'culturalMap.verifyButton': 'I-verify ang pagbisita',
    'culturalMap.verifySuccess': 'Na-verify! Nakakuha si {name} ng exchange points',
    'culturalMap.verifyErrorSelf': 'Hindi mo maiveripika ang sariling pin.',
    'culturalMap.verifyErrorDuplicate': 'Na-verify mo na ang pin na ito.',
    'culturalMap.verifyErrorTooFar': 'Maiveripika lang malapit sa lokasyon ng pin.',
    'culturalMap.verifyErrorNotFound': 'Hindi nahanap ang pin.',
    'culturalMap.verifyErrorOffline': 'Nabigo ang pag-verify. Pakisuri ang koneksyon.',
  },
  vi: {
    'welcome.tagline': 'Cộng đồng siêu địa phương an toàn nhất\nđể chia sẻ tài năng với hàng xóm',
    'welcome.kakaoLogin': 'Tiếp tục với Kakao',
    'welcome.kakaoLoginLoading': 'Đang đăng nhập...',
    'welcome.errorCancelled': 'Đăng nhập Kakao đã bị hủy hoặc thất bại.',
    'welcome.errorNoBackend': 'Địa chỉ máy chủ chưa được cấu hình.',
    'welcome.errorNoConnection': 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.',
    'welcome.errorGeneric': 'Đăng nhập không thành công.',
    'interestSelection.title': 'Thiết lập sở thích',
    'interestSelection.subtitle':
      'Cho chúng tôi biết tên và sở thích của bạn, AI sẽ tìm những người hàng xóm phù hợp nhất cho bạn.',
    'interestSelection.nameLabel': 'Tên',
    'interestSelection.namePlaceholder': 'Tên hiển thị với hàng xóm',
    'interestSelection.offeredLabel': 'Tôi có thể chia sẻ',
    'interestSelection.offeredHint': 'Chọn những kỹ năng bạn có thể chia sẻ với hàng xóm',
    'interestSelection.wantedLabel': 'Tôi muốn học',
    'interestSelection.wantedHint': 'Chọn những kỹ năng bạn muốn học từ hàng xóm',
    'interestSelection.selectedCount': 'Đã chọn {count}',
    'interestSelection.saveButton': 'Lưu và tìm hàng xóm phù hợp',
    'interestSelection.validationHint': 'Nhập tên và chọn ít nhất một mục trong mỗi danh mục',
    'profileFields.genderLabel': 'Giới tính (không bắt buộc)',
    'profileFields.genderMale': 'Nam',
    'profileFields.genderFemale': 'Nữ',
    'profileFields.genderUnspecified': 'Không muốn nêu rõ',
    'profileFields.talkStyleLabel': 'Phong cách trò chuyện (không bắt buộc)',
    'profileFields.talkStyleHint': 'Giúp AI chọn địa điểm gặp mặt phù hợp cho bạn',
    'profileFields.talkStyleQuiet': 'Tôi thích nơi yên tĩnh',
    'profileFields.talkStyleLively': 'Tôi thích nơi náo nhiệt',
    'profileFields.talkStyleNoPreference': 'Không có yêu cầu',
    'languagePicker.title': 'Chọn ngôn ngữ',
    'tabs.home': 'Trang chủ',
    'tabs.community': 'Cộng đồng',
    'tabs.chat': 'Trò chuyện',
    'tabs.mypage': 'Trang cá nhân',
    'home.greeting': 'Xin chào,\n{name}',
    'home.recommendedLabel': 'Gợi ý AI hôm nay',
    'home.recommendedTitle': 'Những người hàng xóm này thế nào?',
    'home.noRecommendations': 'Chưa có hàng xóm để gợi ý.\nDanh sách sẽ đầy khi có hàng xóm mới tham gia!',
    'home.successFeedLabel': 'Câu chuyện ghép đôi thành công',
    'home.appointmentWith': 'Lịch hẹn với {name}',
    'home.appointmentDefaultPurpose': 'Giao lưu hàng xóm',
    'neighborCard.top': 'TOP',
    'neighborCard.offers': 'Có thể chia sẻ {skill}',
    'neighborCard.matchButton': 'Kết nối',
    'locationHeader.pickTitle': 'Chọn khu vực',
    'locationHeader.notifTitle': 'Thông báo',
    'microGroup.aiLabel': 'Gợi ý AI',
    'microGroup.title': 'Nhóm gặp mặt hàng xóm',
    'microGroup.interestCount': '{count}/{max} quan tâm',
    'microGroup.joined': 'Đã tham gia',
    'microGroup.join': 'Tôi quan tâm',
    'feed.label': 'Chuyện hàng xóm',
    'feed.title': 'Bảng giao lưu',
    'feed.category.exchange': 'Trao đổi kỹ năng',
    'feed.category.question': 'Hỏi đáp hàng xóm',
    'feed.category.group': 'Nhóm nhỏ',
    'feed.neighborFallback': 'Hàng xóm',
    'chat.emptyTitle': 'Chưa có cuộc trò chuyện',
    'chat.emptyDescription': 'Nhấn "Kết nối" ở trang chủ để gặp hàng xóm mới.',
    'chat.startConversation': 'Bắt đầu cuộc trò chuyện',
    'chat.directChannelTag': 'Hàng xóm thân thiết',
    'chatroom.defaultCounterpart': 'Đối tác trò chuyện',
    'chatroom.smartReply1': 'Bạn có thể dạy tôi {skill} không?',
    'chatroom.smartReply2': 'Tôi có thể giúp bạn về {skill}!',
    'chatroom.smartReply3': 'Tuần này bạn có ngày nào thuận tiện không?',
    'chatroom.inputPlaceholder': 'Nhập tin nhắn',
    'chatroom.aiContextLabel': 'Mục đích ghép đôi AI · {score}% phù hợp',
    'chatroom.culturalGuideTitle': 'Hướng dẫn văn hóa AI',
    'chatroom.notFound': 'Không tìm thấy cuộc trò chuyện này.',
    'chatroom.replyLoading': 'Đang soạn câu trả lời...',
    'chatroom.viewOriginal': 'Xem bản gốc',
    'chatroom.viewTranslation': 'Xem bản dịch',
    'appointmentCard.confirmed': 'Đã xác nhận lịch hẹn',
    'appointmentCard.defaultZone': 'Khu vực an toàn',
    'appointmentCard.checkinButton': 'Đến check-in tại nơi hẹn',
    'appointmentForm.title': 'Đặt lịch gặp mặt',
    'appointmentForm.subtitle': 'Đặt ngày, giờ và địa điểm gặp {name} cùng một lúc.',
    'appointmentForm.aiSuggestButton': 'Nhận gợi ý từ AI',
    'appointmentForm.aiSuggesting': 'AI đang gợi ý...',
    'appointmentForm.dateLabel': 'Ngày',
    'appointmentForm.timeLabel': 'Giờ',
    'appointmentForm.purposeLabel': 'Mục đích',
    'appointmentForm.purposePlaceholder': 'VD: Trao đổi tiếng Anh & nấu ăn Adobo',
    'appointmentForm.pickPlace': 'Vui lòng chọn địa điểm',
    'appointmentForm.confirmButton': 'Xác nhận lịch hẹn',
    'appointmentForm.notFound': 'Không tìm thấy thông tin cuộc trò chuyện.',
    'safeZone.aiLabel': 'Khu vực an toàn AI gợi ý',
    'safeZone.recommended': 'Đề xuất',
    'safeZone.scoreLabel': 'Điểm an toàn AI: {score}',
    'safeZone.refreshButton': 'Phân tích lại bằng AI',
    'safeZone.refreshing': 'Đang phân tích...',
    'safeZone.analyzing': 'AI đang phân tích lộ trình, thời gian gặp mặt và phong cách trò chuyện của hai bạn để chọn khu vực an toàn...',
    'mypage.pointsLabel': 'Điểm',
    'mypage.volunteerLabel': 'Tình nguyện (phút)',
    'mypage.badgesLabel': 'Huy hiệu',
    'mypage.earnedBadges': 'Huy hiệu đã đạt',
    'mypage.logout': 'Đăng xuất',
    'mypage.noItems': 'Chưa có mục nào.',
    'mypage.offeredLabel': 'Tôi có thể chia sẻ',
    'mypage.wantedLabel': 'Tôi muốn học',
    'edit.title': 'Chỉnh sửa hồ sơ',
    'edit.changePhoto': 'Nhấn để đổi ảnh đại diện',
    'edit.bioLabel': 'Giới thiệu',
    'edit.bioPlaceholder': 'Giới thiệu ngắn về bạn với hàng xóm',
    'edit.tagHint': 'Nhấn vào thẻ để xóa, hoặc thêm bên dưới',
    'edit.save': 'Lưu',
    'verification.title': 'Xác minh an toàn thủ công',
    'verification.cardSubtitle': 'Xác minh an toàn thủ công bằng CMND/CCCD hoặc Thẻ người nước ngoài',
    'verification.subtitle': 'Giấy tờ bạn gửi sẽ được đội ngũ vận hành xem xét trực tiếp, không quét OCR tự động.',
    'verification.stepSubmit': 'Gửi',
    'verification.stepReview': 'Đang xem xét',
    'verification.stepDone': 'Đã xác minh',
    'verification.verifiedTitle': 'Đã xác minh',
    'verification.verifiedSubtitle': 'Bạn đã nhận huy hiệu an toàn',
    'verification.startTitle': 'Bắt đầu xác minh an toàn',
    'verification.docTypeLabel': 'Loại giấy tờ',
    'verification.docIdCard': 'CMND/CCCD · Giấy phép lái xe',
    'verification.docForeignCard': 'Thẻ đăng ký người nước ngoài',
    'verification.pending': 'Đang xem xét — thường hoàn tất trong 1-2 ngày làm việc.',
    'verification.rejected': 'Đã bị từ chối. Vui lòng kiểm tra lại giấy tờ và gửi lại.',
    'verification.submit': 'Gửi',
    'verification.resubmit': 'Gửi lại',
    'verification.devTools': 'DEV TOOLS · giả lập xét duyệt của quản trị viên',
    'verification.approve': 'Phê duyệt',
    'verification.reject': 'Từ chối',
    'uploader.placeholder': 'Tải lên ảnh giấy tờ',
    'meetupWarning.title': 'Trước khi gặp mặt',
    'meetupWarning.headline': 'Vui lòng xem để có buổi gặp mặt an toàn',
    'meetupWarning.item1': 'Chỉ gặp mặt tại Khu vực an toàn đã được xác nhận trong ứng dụng.',
    'meetupWarning.item2': 'Việc lỡ hẹn nhiều lần có thể khiến tài khoản của bạn bị hạn chế.',
    'meetupWarning.item3':
      'Hành vi không phù hợp hoặc tiếp cận ngoài mục đích ban đầu sẽ bị báo cáo và xử lý ngay.',
    'meetupWarning.item4':
      'Hãy để lại đánh giá 3 giây sau khi gặp mặt — cùng xây dựng một cộng đồng an toàn.',
    'meetupWarning.checkbox': 'Tôi đã đọc và đồng ý với tất cả nội dung trên.',
    'meetupWarning.continue': 'Tiếp tục',
    'meetupQr.title': 'Xác nhận tại nơi hẹn',
    'meetupQr.subtitle': 'Khi đến Khu vực an toàn, hãy quét mã QR để check-in.',
    'meetupQr.checkedInTitle': 'Đã check-in!',
    'meetupQr.reward': '+{points} điểm · +{minutes} phút tình nguyện',
    'meetupQr.reviewButton': 'Đánh giá 3 giây',
    'meetupQr.notFound': 'Không tìm thấy lịch hẹn.',
    'qrScan.button': 'Quét QR để check-in',
    'qrScan.scanning': 'Đang quét...',
    'review.title': 'Đánh giá 3 giây',
    'review.headerTitle': 'Đánh giá an toàn & thái độ 3 giây',
    'review.q1': '1. Bạn có gặp tại Khu vực an toàn đã hẹn không?',
    'review.q2': '2. Việc trao đổi kỹ năng có diễn ra suôn sẻ không?',
    'review.q3': '3. Có hành vi khó chịu hoặc mục đích khác ngoài dự định không?',
    'review.warningHint': '* Câu hỏi 3 hỏi về tình huống tiêu cực — chọn "Không" nếu buổi gặp an toàn.',
    'review.yes': 'Có',
    'review.no': 'Không',
    'review.submit': 'Gửi đánh giá',
    'review.submitted': 'Đã gửi đánh giá!',
    'review.badgeInfo': 'Khi hàng xóm cũng gửi đánh giá, bạn sẽ nhận huy hiệu "Hàng xóm thân thiết".',
    'review.waitingCounterpart': 'Hàng xóm của bạn chưa gửi đánh giá.',
    'review.checkingCounterpart': 'Đang kiểm tra đánh giá của hàng xóm...',
    'review.simulateButton': 'Giả lập đánh giá hàng xóm (thử nghiệm)',
    'review.negativeThanks': 'Cảm ơn phản hồi — câu trả lời liên quan an toàn có thể được đội ngũ xem xét.',
    'review.backToChat': 'Trở lại trò chuyện',
    'review.notFound': 'Không tìm thấy lịch hẹn.',
    'badge.confirm': 'Xong',
    'badge.notFound': 'Không tìm thấy thông tin huy hiệu.',
    'badgeUnlock.title': 'Đã nhận huy hiệu {name}!',
    'badgeUnlock.directChannelInfo':
      'Từ giờ bạn có thể trò chuyện 1:1 tự do,\nkhông cần qua bước ghép đôi AI.',
    'skill.skill_native_english': 'Hội thoại tiếng Anh bản ngữ',
    'skill.skill_filipino_cooking': 'Nấu ăn gia đình Philippines (Adobo, v.v.)',
    'skill.skill_sea_culture': 'Chia sẻ văn hóa Đông Nam Á',
    'skill.skill_korean_language': 'Hội thoại tiếng Hàn',
    'skill.skill_school_notice': 'Giúp hiểu thông báo của trường',
    'skill.skill_local_info': 'Thông tin sinh hoạt tại Gyeongsan',
    'skill.skill_korean_cooking': 'Nấu ăn gia đình Hàn Quốc',
    'skill.skill_kids_english': 'Chương trình tiếp cận tiếng Anh cho trẻ',
    'skill.skill_multicultural_playdate': 'Buổi chơi cho trẻ gia đình đa văn hóa',
    'skill.skill_school_enrollment_help': 'Hỗ trợ thủ tục nhập học/chuyển trường cho con',
    'skill.skill_futsal_partner': 'Cùng chơi futsal/bóng đá',
    'skill.skill_hiking_buddy': 'Bạn đồng hành leo núi',
    'skill.skill_badminton_partner': 'Bạn chơi cầu lông',
    'skill.skill_morning_jogging': 'Nhóm chạy bộ buổi sáng',
    'skill.skill_traditional_craft': 'Chia sẻ thủ công truyền thống',
    'skill.skill_kpop_dance': 'Nhảy cover K-pop',
    'skill.skill_photography_walk': 'Đi bộ chụp ảnh',
    'skill.skill_home_country_music': 'Giới thiệu âm nhạc/nhạc cụ truyền thống quê hương',
    'skill.skill_smartphone_help': 'Hướng dẫn dùng smartphone & app hành chính',
    'skill.skill_online_banking_help': 'Hỗ trợ ngân hàng trực tuyến/di động',
    'skill.skill_document_editing_help': 'Hỗ trợ soạn tài liệu',
    'skill.skill_basic_coding': 'Học lập trình cơ bản',
    'skill.skill_visa_info_share': 'Chia sẻ thông tin visa/thủ tục cư trú',
    'skill.skill_immigration_office_accompany': 'Đi cùng đến văn phòng xuất nhập cảnh',
    'skill.skill_labor_rights_info': 'Chia sẻ thông tin cơ bản về lao động/lương',
    'skill.skill_admin_document_help': 'Hỗ trợ giấy tờ hành chính',
    'skillCategory.language': 'Ngôn ngữ',
    'skillCategory.culture': 'Giao lưu văn hóa',
    'skillCategory.cooking': 'Nấu ăn',
    'skillCategory.local-info': 'Thông tin địa phương',
    'skillCategory.parenting': 'Nuôi dạy con',
    'skillCategory.education': 'Giáo dục',
    'skillCategory.sports': 'Thể thao & vận động',
    'skillCategory.hobby-art': 'Sở thích & nghệ thuật',
    'skillCategory.tech': 'Công nghệ',
    'skillCategory.legal-admin': 'Pháp lý & hành chính',
    'culturalMap.title': 'Bản đồ văn hóa',
    'culturalMap.empty': 'Chưa có điểm nào. Hãy đăng ký điểm đầu tiên!',
    'culturalMap.entryCardTitle': '🗺️ Xem Bản đồ văn hóa',
    'culturalMap.entryCardSubtitle': 'Khám phá những địa điểm ẩn trong khu phố do hàng xóm phát hiện',
    'culturalMap.newPinTitle': 'Đăng ký địa điểm',
    'culturalMap.newPinSubtitle': 'Giới thiệu địa điểm bạn đã phát hiện cho hàng xóm',
    'culturalMap.titleLabel': 'Tên địa điểm',
    'culturalMap.titlePlaceholder': 'VD: Cửa hàng bán gia vị đầu ngõ',
    'culturalMap.storyLabel': 'Câu chuyện của bạn',
    'culturalMap.storyPlaceholder': 'Hãy kể bạn biết đến nơi này thế nào và vì sao bạn giới thiệu',
    'culturalMap.categoryLabel': 'Danh mục',
    'culturalMap.category.food': 'Thực phẩm/đồ ăn',
    'culturalMap.category.study': 'Học tập/cà phê',
    'culturalMap.category.shopping': 'Mua sắm',
    'culturalMap.category.culture-spot': 'Trải nghiệm văn hóa',
    'culturalMap.category.nature': 'Thiên nhiên/đi bộ',
    'culturalMap.category.other': 'Khác',
    'culturalMap.addressLabel': 'Địa chỉ (không bắt buộc)',
    'culturalMap.addressPlaceholder': 'VD: 32 Jungsan-ro, Gyeongsan',
    'culturalMap.currentLocationHint': 'Khi bạn nhấn đăng ký, vị trí hiện tại của bạn sẽ được lưu làm tọa độ điểm',
    'culturalMap.submitting': 'Đang đăng ký...',
    'culturalMap.submitButton': 'Đăng ký tại vị trí hiện tại',
    'culturalMap.locationPermissionDenied': 'Cần quyền truy cập vị trí.',
    'culturalMap.locationFetchFailed': 'Không lấy được vị trí. Vui lòng thử lại.',
    'culturalMap.pinNotFoundTitle': 'Không tìm thấy điểm',
    'culturalMap.pinDetailTitle': 'Thông tin địa điểm',
    'culturalMap.registeredBy': '{name} đã đăng ký',
    'culturalMap.verifiedCount': 'Đã xác nhận {count} lần',
    'culturalMap.isAuthorLabel': 'Đây là địa điểm của bạn',
    'culturalMap.alreadyVerifiedLabel': 'Đã xác nhận rồi',
    'culturalMap.verifying': 'Đang xác nhận...',
    'culturalMap.verifyButton': 'Xác nhận đã đến',
    'culturalMap.verifySuccess': 'Xác nhận thành công! {name} đã nhận được điểm giao lưu',
    'culturalMap.verifyErrorSelf': 'Bạn không thể xác nhận điểm của chính mình.',
    'culturalMap.verifyErrorDuplicate': 'Bạn đã xác nhận điểm này rồi.',
    'culturalMap.verifyErrorTooFar': 'Bạn chỉ có thể xác nhận khi ở gần địa điểm này.',
    'culturalMap.verifyErrorNotFound': 'Không tìm thấy điểm.',
    'culturalMap.verifyErrorOffline': 'Xác nhận thất bại. Vui lòng kiểm tra kết nối.',
  },
};
