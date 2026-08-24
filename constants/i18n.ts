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
  | 'home.noAppointmentPlaceholder'
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
  | 'chatroom.reportButton'
  | 'chatroom.replyLoading'
  | 'chatroom.viewOriginal'
  | 'chatroom.viewTranslation'
  | 'appointmentCard.confirmed'
  | 'appointmentCard.defaultZone'
  | 'appointmentCard.checkinButton'
  | 'appointmentCard.pendingLabel'
  | 'appointmentCard.cancelledLabel'
  | 'appointmentCard.waitingForAccept'
  | 'appointmentCard.acceptButton'
  | 'appointmentCard.rejectButton'
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
  | 'mypage.showLess'
  | 'mypage.viewTutorial'
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
  | 'verification.maskingNotice'
  | 'verification.errorMinor'
  | 'verification.errorNotFound'
  | 'verification.errorGeneric'
  | 'verification.submitting'
  | 'admin.title'
  | 'admin.noAccess'
  | 'admin.verificationSectionTitle'
  | 'admin.verificationSectionSubtitle'
  | 'admin.noVerifications'
  | 'admin.birthDateLabel'
  | 'admin.reportSectionTitle'
  | 'admin.reportSectionSubtitle'
  | 'admin.noReports'
  | 'admin.viewThread'
  | 'admin.dismissReport'
  | 'admin.resolveReport'
  | 'admin.entryLabel'
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
  | 'meetupQr.myQrLabel'
  | 'meetupQr.cameraPermissionNeeded'
  | 'meetupQr.grantPermission'
  | 'meetupQr.invalidQr'
  | 'meetupQr.wrongQr'
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
  | 'skill.skill_multilingual_interpretation'
  | 'skill.skill_pronunciation_study'
  | 'skill.skill_holiday_culture_exchange'
  | 'skill.skill_world_festival_intro'
  | 'skill.skill_baking_dessert'
  | 'skill.skill_vegan_cooking'
  | 'skill.skill_bus_route_help'
  | 'skill.skill_housing_info_share'
  | 'skill.skill_playground_meetup'
  | 'skill.skill_baby_product_info_share'
  | 'skill.skill_basic_literacy_education'
  | 'skill.skill_topik_study_group'
  | 'skill.skill_table_tennis_partner'
  | 'skill.skill_cycling_group'
  | 'skill.skill_board_game_meetup'
  | 'skill.skill_gardening'
  | 'skill.skill_smart_device_help'
  | 'skill.skill_sns_youtube_help'
  | 'skill.skill_lease_contract_info_share'
  | 'skill.skill_tax_year_end_info_share'
  | 'skillSearch.placeholder'
  | 'locationSetup.title'
  | 'locationSetup.subtitle'
  | 'locationSetup.checkingLocation'
  | 'locationSetup.outsideBoundsTitle'
  | 'locationSetup.outsideBoundsBody'
  | 'locationSetup.retryButton'
  | 'locationSetup.insideConfirmed'
  | 'locationSetup.pickDistrictLabel'
  | 'locationSetup.confirmButton'
  | 'chatroom.verificationRequiredTitle'
  | 'chatroom.verificationRequiredBody'
  | 'chatroom.verificationRequiredConfirm'
  | 'chatroom.verificationRequiredCancel'
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
  | 'culturalMap.verifyErrorOffline'
  | 'terms.title'
  | 'terms.intro'
  | 'terms.section1Title'
  | 'terms.section1Body'
  | 'terms.section2Title'
  | 'terms.section2Body'
  | 'terms.section3Title'
  | 'terms.section3Body'
  | 'terms.section4Title'
  | 'terms.section4Body'
  | 'terms.section5Title'
  | 'terms.section5Body'
  | 'terms.section6Title'
  | 'terms.section6Body'
  | 'terms.checkboxLabel'
  | 'terms.continueButton'
  | 'terms.mustAgreeHint'
  | 'report.title'
  | 'report.subtitle'
  | 'report.reasonLabel'
  | 'report.reason.inappropriate'
  | 'report.reason.no-show'
  | 'report.reason.harassment'
  | 'report.reason.scam'
  | 'report.reason.other'
  | 'report.detailLabel'
  | 'report.detailPlaceholder'
  | 'report.submitButton'
  | 'report.submitting'
  | 'report.successTitle'
  | 'report.successBody'
  | 'report.errorMessage'
  | 'report.validationHint'
  | 'tutorial.skip'
  | 'tutorial.next'
  | 'tutorial.start'
  | 'tutorial.slide1Title'
  | 'tutorial.slide1Body'
  | 'tutorial.slide2Title'
  | 'tutorial.slide2Body'
  | 'tutorial.slide3Title'
  | 'tutorial.slide3Body'
  | 'tutorial.slide4Title'
  | 'tutorial.slide4Body'
  | 'community.writeButton'
  | 'community.newGroupButton'
  | 'newPost.title'
  | 'newPost.categoryLabel'
  | 'newPost.titleLabel'
  | 'newPost.titlePlaceholder'
  | 'newPost.bodyLabel'
  | 'newPost.bodyPlaceholder'
  | 'newPost.submitButton'
  | 'newPost.validationHint'
  | 'newGroup.title'
  | 'newGroup.titleLabel'
  | 'newGroup.titlePlaceholder'
  | 'newGroup.locationLabel'
  | 'newGroup.locationPlaceholder'
  | 'newGroup.dateLabel'
  | 'newGroup.timeLabel'
  | 'newGroup.categoryLabel'
  | 'newGroup.categoryPlaceholder'
  | 'newGroup.maxParticipantsLabel'
  | 'newGroup.maxParticipantsPlaceholder'
  | 'newGroup.submitButton'
  | 'newGroup.validationHint';

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
    'home.noAppointmentPlaceholder': '주변 이웃과 필요한 재능을 나눠보세요~!',
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
    'chatroom.reportButton': '신고',
    'chatroom.replyLoading': '답장을 작성 중이에요...',
    'chatroom.viewOriginal': '원문 보기',
    'chatroom.viewTranslation': '번역 보기',
    'appointmentCard.confirmed': '약속이 확정되었어요',
    'appointmentCard.defaultZone': '안심존',
    'appointmentCard.checkinButton': '현장 체크인 하러 가기',
    'appointmentCard.pendingLabel': '약속 제안이 왔어요',
    'appointmentCard.cancelledLabel': '거절된 약속이에요',
    'appointmentCard.waitingForAccept': '상대방의 수락을 기다리는 중이에요',
    'appointmentCard.acceptButton': '수락하기',
    'appointmentCard.rejectButton': '거절하기',
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
    'mypage.showLess': '접기',
    'mypage.viewTutorial': '앱 사용법 다시 보기',
    'edit.title': '프로필 수정',
    'edit.changePhoto': '탭해서 프로필 사진 변경',
    'edit.bioLabel': '소개',
    'edit.bioPlaceholder': '이웃들에게 나를 짧게 소개해보세요',
    'edit.tagHint': '태그를 눌러 빼거나, 아래에서 더 추가해보세요',
    'edit.save': '저장하기',
    'verification.title': '수동 안심인증',
    'verification.cardSubtitle': '신분증·외국인등록증 수동 안심인증',
    'verification.subtitle': 'AI가 주민등록번호·외국인등록번호를 자동으로 가린 뒤, 운영팀이 마스킹된 사진만 확인하고 승인해요.',
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
    'verification.approve': '승인',
    'verification.reject': '반려',
    'verification.maskingNotice': 'AI가 사진에서 번호를 자동으로 가린 뒤에만 저장돼요 — 운영팀도 가려진 사진만 볼 수 있어요.',
    'verification.errorMinor': '만 19세 미만은 다잇다에 가입할 수 없어요.',
    'verification.errorNotFound': '신분증에서 번호를 찾지 못했어요. 번호가 잘 보이도록 다시 촬영해주세요.',
    'verification.errorGeneric': '제출 중 문제가 생겼어요. 다시 시도해주세요.',
    'verification.submitting': '제출 중...',
    'admin.title': '운영자 검토',
    'admin.noAccess': '운영자만 접근할 수 있는 화면이에요.',
    'admin.verificationSectionTitle': '안심인증 검토',
    'admin.verificationSectionSubtitle': 'AI가 번호를 가린 사진만 표시돼요',
    'admin.noVerifications': '검토할 인증 요청이 없어요.',
    'admin.birthDateLabel': '생년월일 {date}',
    'admin.reportSectionTitle': '신고 내역',
    'admin.reportSectionSubtitle': '접수된 신고를 확인하고 처리해주세요',
    'admin.noReports': '접수된 신고가 없어요.',
    'admin.viewThread': '채팅방 보기 →',
    'admin.dismissReport': '무시',
    'admin.resolveReport': '처리 완료',
    'admin.entryLabel': '운영자 검토',
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
    'meetupQr.myQrLabel': '내 QR코드 — 상대방에게 보여주세요',
    'meetupQr.cameraPermissionNeeded': '상대방 QR을 스캔하려면 카메라 권한이 필요해요.',
    'meetupQr.grantPermission': '카메라 권한 허용하기',
    'meetupQr.invalidQr': '인식할 수 없는 QR코드예요.',
    'meetupQr.wrongQr': '이 약속의 상대방 QR코드가 아니에요.',
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
    'skill.skill_multilingual_interpretation': '다국어 통역 도움',
    'skill.skill_pronunciation_study': '발음 교정 스터디',
    'skill.skill_holiday_culture_exchange': '명절 문화 체험 나눔',
    'skill.skill_world_festival_intro': '세계 축제 소개',
    'skill.skill_baking_dessert': '베이킹/디저트 만들기',
    'skill.skill_vegan_cooking': '채식 요리 나눔',
    'skill.skill_bus_route_help': '대중교통·버스 노선 안내',
    'skill.skill_housing_info_share': '부동산/전월세 정보 공유',
    'skill.skill_playground_meetup': '놀이터 동행 육아 품앗이',
    'skill.skill_baby_product_info_share': '이유식·아기용품 정보 공유',
    'skill.skill_basic_literacy_education': '성인 문해교육(한글 기초)',
    'skill.skill_topik_study_group': 'TOPIK 스터디 그룹',
    'skill.skill_table_tennis_partner': '탁구 파트너',
    'skill.skill_cycling_group': '자전거 라이딩 모임',
    'skill.skill_board_game_meetup': '보드게임 모임',
    'skill.skill_gardening': '원예/식물 가꾸기',
    'skill.skill_smart_device_help': '스마트워치·가전제품 사용법',
    'skill.skill_sns_youtube_help': 'SNS/유튜브 활용법',
    'skill.skill_lease_contract_info_share': '임대차 계약 기초 정보 공유',
    'skill.skill_tax_year_end_info_share': '세금·연말정산 기초 안내',
    'skillSearch.placeholder': '재능/관심사 검색하기',
    'locationSetup.title': '지역 설정',
    'locationSetup.subtitle': '경산시 내 위치인지 확인하고, 동네를 선택해주세요',
    'locationSetup.checkingLocation': '위치 확인 중...',
    'locationSetup.outsideBoundsTitle': '경산시 밖에 있는 것 같아요',
    'locationSetup.outsideBoundsBody': '다잇다는 경산시 주민을 위한 서비스라 경산시 내에서만 가입할 수 있어요. 경산시로 이동한 뒤 다시 시도해주세요.',
    'locationSetup.retryButton': '위치 다시 확인하기',
    'locationSetup.insideConfirmed': '경산시 내에 있는 것을 확인했어요',
    'locationSetup.pickDistrictLabel': '동네를 선택해주세요',
    'locationSetup.confirmButton': '완료하고 시작하기',
    'chatroom.verificationRequiredTitle': '안심인증이 필요해요',
    'chatroom.verificationRequiredBody': '약속을 잡으려면 먼저 신분증 인증(안심인증)을 완료해주세요.',
    'chatroom.verificationRequiredConfirm': '인증하러 가기',
    'chatroom.verificationRequiredCancel': '취소',
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
    'terms.title': '이용약관',
    'terms.intro': '다잇다를 이용하기 전에 아래 약관을 꼭 읽어주세요. 계속하시면 아래 내용에 동의하는 것으로 간주됩니다.',
    'terms.section1Title': '1. 서비스의 성격',
    'terms.section1Body':
      '다잇다는 경산시 이웃 간의 재능 교류를 돕는 매칭 플랫폼입니다. 회사는 만남의 장소만 제공할 뿐, 실제 만남과 교류는 이용자 개인 간의 자율적인 약속과 책임 하에 이루어집니다.',
    'terms.section2Title': '2. 책임의 한계',
    'terms.section2Body':
      '회사는 이용자 간 매칭 이후 발생하는 만남, 거래, 대화 등에서 발생하는 사고, 분쟁, 범죄(폭행, 사기, 성범죄 등을 포함하되 이에 한정되지 않음)에 대해 어떠한 법적 책임도 지지 않습니다. 이용자는 낯선 사람과의 만남에 따르는 위험을 스스로 인지하고, 공개된 장소에서의 만남 등 안전 수칙을 준수해야 합니다.',
    'terms.section3Title': '3. 이용 자격',
    'terms.section3Body':
      '본 서비스는 만 19세 이상만 이용할 수 있습니다. 미성년자의 가입 및 이용은 제한되며, 허위로 연령 정보를 제공하여 가입한 경우 회사는 사전 통보 없이 이용을 제한할 수 있습니다.',
    'terms.section4Title': '4. 이용자의 의무',
    'terms.section4Body':
      '이용자는 타인에게 위협, 성희롱, 사기, 차별적 언행 등을 해서는 안 됩니다. 이러한 행위를 목격하거나 겪은 경우 앱 내 신고 기능을 통해 즉시 신고해주세요. 신고된 내용은 운영자가 검토 후 조치합니다.',
    'terms.section5Title': '5. 신원인증 정보 처리',
    'terms.section5Body':
      '안심인증을 위해 제출한 신분증 사진은 AI가 주민등록번호 뒷자리 등 민감정보를 자동으로 가린 뒤에만 저장되며, 마스킹 전 원본 이미지는 서버에 저장되지 않습니다. 인증 승인/반려는 운영자 권한이 있는 담당자만 처리할 수 있습니다.',
    'terms.section6Title': '6. 이용 제한',
    'terms.section6Body':
      '본 약관 또는 관계 법령을 위반한 이용자는 사전 통보 없이 서비스 이용이 제한되거나 계정이 정지될 수 있습니다.',
    'terms.checkboxLabel': '저는 만 19세 이상이며, 위 약관 내용에 모두 동의합니다.',
    'terms.continueButton': '동의하고 계속하기',
    'terms.mustAgreeHint': '약관에 동의해야 다음 단계로 진행할 수 있어요.',
    'report.title': '신고하기',
    'report.subtitle': '신고 내용은 운영자만 확인하며, 신고자 정보는 상대방에게 공개되지 않아요.',
    'report.reasonLabel': '신고 이유',
    'report.reason.inappropriate': '부적절한 행동',
    'report.reason.no-show': '약속 불참',
    'report.reason.harassment': '괴롭힘/불쾌한 언행',
    'report.reason.scam': '사기/금전 요구',
    'report.reason.other': '기타',
    'report.detailLabel': '상세 내용 (선택)',
    'report.detailPlaceholder': '무슨 일이 있었는지 알려주세요.',
    'report.submitButton': '신고 제출하기',
    'report.submitting': '제출 중...',
    'report.successTitle': '신고가 접수됐어요',
    'report.successBody': '운영자가 확인 후 조치할게요. 안전하게 지켜드릴게요.',
    'report.errorMessage': '신고 제출에 실패했어요. 다시 시도해주세요.',
    'report.validationHint': '신고 이유를 선택해주세요.',
    'tutorial.skip': '건너뛰기',
    'tutorial.next': '다음',
    'tutorial.start': '시작하기',
    'tutorial.slide1Title': '이웃과 재능을 나눠요',
    'tutorial.slide1Body':
      '경산시에 사는 이웃들과 서로 가진 재능을 나누고 배워보세요. 언어, 요리, 육아 정보까지 다양하게 교류할 수 있어요.',
    'tutorial.slide2Title': '채팅으로 약속을 잡아요',
    'tutorial.slide2Body':
      '관심 있는 이웃과 채팅을 나누고, 만날 시간과 장소를 함께 정해보세요. 약속은 상대방이 수락해야 확정돼요.',
    'tutorial.slide3Title': '안심하고 만나요',
    'tutorial.slide3Body':
      '안심인증을 마치면 약속을 잡을 수 있어요. 만날 때는 서로 QR을 찍어 현장 인증을 하고, 불편한 상황이 있으면 언제든 신고할 수 있어요.',
    'tutorial.slide4Title': '동네를 더 깊이 알아가요',
    'tutorial.slide4Body':
      '컬처럴 맵에 나만 아는 동네 스팟을 등록하고, 소모임과 게시판에서 이웃들과 더 폭넓게 교류해보세요.',
    'community.writeButton': '글쓰기',
    'community.newGroupButton': '소모임 만들기',
    'newPost.title': '글쓰기',
    'newPost.categoryLabel': '카테고리',
    'newPost.titleLabel': '제목',
    'newPost.titlePlaceholder': '제목을 입력해주세요',
    'newPost.bodyLabel': '내용',
    'newPost.bodyPlaceholder': '이웃들에게 나누고 싶은 이야기를 적어주세요',
    'newPost.submitButton': '게시하기',
    'newPost.validationHint': '제목과 내용을 모두 입력해주세요.',
    'newGroup.title': '소모임 만들기',
    'newGroup.titleLabel': '모임 이름',
    'newGroup.titlePlaceholder': '예: 토요일 다문화 쿠킹 클래스',
    'newGroup.locationLabel': '장소',
    'newGroup.locationPlaceholder': '예: 경산시 공유주방',
    'newGroup.dateLabel': '날짜',
    'newGroup.timeLabel': '시간',
    'newGroup.categoryLabel': '카테고리',
    'newGroup.categoryPlaceholder': '예: 요리, 운동, 교육',
    'newGroup.maxParticipantsLabel': '모집 인원',
    'newGroup.maxParticipantsPlaceholder': '예: 6',
    'newGroup.submitButton': '만들기',
    'newGroup.validationHint': '모든 항목을 입력해주세요.',
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
    'home.noAppointmentPlaceholder': 'Share the skills you have with neighbors nearby~!',
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
    'chatroom.reportButton': 'Report',
    'chatroom.replyLoading': 'Writing a reply...',
    'chatroom.viewOriginal': 'View original',
    'chatroom.viewTranslation': 'View translation',
    'appointmentCard.confirmed': 'Appointment confirmed',
    'appointmentCard.defaultZone': 'Safe zone',
    'appointmentCard.checkinButton': 'Go check in on site',
    'appointmentCard.pendingLabel': 'New appointment request',
    'appointmentCard.cancelledLabel': 'This appointment was declined',
    'appointmentCard.waitingForAccept': "Waiting for the other person's response",
    'appointmentCard.acceptButton': 'Accept',
    'appointmentCard.rejectButton': 'Decline',
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
    'mypage.showLess': 'Show less',
    'mypage.viewTutorial': 'View app tutorial again',
    'edit.title': 'Edit profile',
    'edit.changePhoto': 'Tap to change your photo',
    'edit.bioLabel': 'Bio',
    'edit.bioPlaceholder': 'Give your neighbors a short intro',
    'edit.tagHint': 'Tap a tag to remove it, or add more below',
    'edit.save': 'Save',
    'verification.title': 'Manual safety verification',
    'verification.cardSubtitle': 'Manual safety verification via ID / Foreign Resident Card',
    'verification.subtitle':
      'AI automatically masks your ID/registration number, then our team reviews only the masked photo before approving.',
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
    'verification.maskingNotice':
      'The photo is only saved after AI automatically masks the ID number — the review team only ever sees the masked version.',
    'verification.errorMinor': 'You must be 19 or older to join da-itda.',
    'verification.errorNotFound': "We couldn't find the ID number in that photo. Please retake it with the number clearly visible.",
    'verification.errorGeneric': 'Something went wrong submitting this. Please try again.',
    'verification.submitting': 'Submitting...',
    'admin.title': 'Admin review',
    'admin.noAccess': 'This screen is admin-only.',
    'admin.verificationSectionTitle': 'ID verification review',
    'admin.verificationSectionSubtitle': 'Only the AI-masked photo is ever shown',
    'admin.noVerifications': 'No verification requests to review.',
    'admin.birthDateLabel': 'Born {date}',
    'admin.reportSectionTitle': 'Reports',
    'admin.reportSectionSubtitle': 'Review and act on submitted reports',
    'admin.noReports': 'No open reports.',
    'admin.viewThread': 'View chat →',
    'admin.dismissReport': 'Dismiss',
    'admin.resolveReport': 'Resolve',
    'admin.entryLabel': 'Admin review',
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
    'meetupQr.myQrLabel': 'My QR code — show this to the other person',
    'meetupQr.cameraPermissionNeeded': 'Camera access is needed to scan the other person’s QR code.',
    'meetupQr.grantPermission': 'Allow camera access',
    'meetupQr.invalidQr': "That QR code couldn't be recognized.",
    'meetupQr.wrongQr': "That's not this appointment's counterpart QR code.",
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
    'skill.skill_multilingual_interpretation': 'Multilingual interpretation help',
    'skill.skill_pronunciation_study': 'Pronunciation practice study group',
    'skill.skill_holiday_culture_exchange': 'Holiday culture exchange',
    'skill.skill_world_festival_intro': 'World festival introductions',
    'skill.skill_baking_dessert': 'Baking & desserts',
    'skill.skill_vegan_cooking': 'Vegan/vegetarian cooking',
    'skill.skill_bus_route_help': 'Bus route & transit help',
    'skill.skill_housing_info_share': 'Housing/rental info sharing',
    'skill.skill_playground_meetup': 'Playground playdate co-op',
    'skill.skill_baby_product_info_share': 'Baby food & gear info sharing',
    'skill.skill_basic_literacy_education': 'Adult basic literacy (Korean)',
    'skill.skill_topik_study_group': 'TOPIK study group',
    'skill.skill_table_tennis_partner': 'Table tennis partner',
    'skill.skill_cycling_group': 'Cycling group',
    'skill.skill_board_game_meetup': 'Board game meetup',
    'skill.skill_gardening': 'Gardening',
    'skill.skill_smart_device_help': 'Smartwatch/appliance help',
    'skill.skill_sns_youtube_help': 'Social media/YouTube help',
    'skill.skill_lease_contract_info_share': 'Lease contract basics sharing',
    'skill.skill_tax_year_end_info_share': 'Tax/year-end settlement basics',
    'skillSearch.placeholder': 'Search skills/interests',
    'locationSetup.title': 'Set your location',
    'locationSetup.subtitle': "We'll check you're within Gyeongsan, then pick your neighborhood",
    'locationSetup.checkingLocation': 'Checking your location...',
    'locationSetup.outsideBoundsTitle': "Looks like you're outside Gyeongsan",
    'locationSetup.outsideBoundsBody':
      'Da-itda is a service for Gyeongsan residents, so you can only sign up while inside Gyeongsan. Please move inside the city and try again.',
    'locationSetup.retryButton': 'Check location again',
    'locationSetup.insideConfirmed': "Confirmed you're inside Gyeongsan",
    'locationSetup.pickDistrictLabel': 'Pick your neighborhood',
    'locationSetup.confirmButton': 'Finish and get started',
    'chatroom.verificationRequiredTitle': 'Verification required',
    'chatroom.verificationRequiredBody': 'Please complete ID verification before scheduling a meetup.',
    'chatroom.verificationRequiredConfirm': 'Go verify',
    'chatroom.verificationRequiredCancel': 'Cancel',
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
    'terms.title': 'Terms of Service',
    'terms.intro': 'Please read the terms below before using da-itda. By continuing, you agree to the following.',
    'terms.section1Title': '1. Nature of the Service',
    'terms.section1Body':
      'da-itda is a matching platform that helps neighbors in Gyeongsan exchange skills. The company only provides the platform — actual meetups and exchanges happen at users\' own discretion and responsibility.',
    'terms.section2Title': '2. Limitation of Liability',
    'terms.section2Body':
      'The company bears no legal liability for any accidents, disputes, or crimes (including but not limited to assault, fraud, or sexual offenses) arising from meetups, transactions, or conversations between matched users. Users acknowledge the risks of meeting strangers and must follow safety practices such as meeting in public places.',
    'terms.section3Title': '3. Eligibility',
    'terms.section3Body':
      'This service is available only to users aged 19 and over. Minors may not sign up or use the service. If a user is found to have provided false age information, the company may restrict their access without prior notice.',
    'terms.section4Title': '4. User Obligations',
    'terms.section4Body':
      'Users must not threaten, harass, defraud, or discriminate against others. If you witness or experience such behavior, please report it immediately using the in-app report feature. Reports are reviewed and acted upon by our operators.',
    'terms.section5Title': '5. Handling of Verification Data',
    'terms.section5Body':
      'ID photos submitted for verification are stored only after AI automatically masks sensitive information such as the last digits of the resident registration number. The unmasked original image is never stored on our servers. Only authorized administrators can approve or reject verification requests.',
    'terms.section6Title': '6. Restriction of Use',
    'terms.section6Body':
      'Users who violate these terms or applicable law may have their access restricted or their account suspended without prior notice.',
    'terms.checkboxLabel': 'I am 19 or older and I agree to all of the above terms.',
    'terms.continueButton': 'Agree and continue',
    'terms.mustAgreeHint': 'You must agree to the terms to continue.',
    'report.title': 'Report',
    'report.subtitle': 'Only our operators see report details, and your identity is never shared with the reported user.',
    'report.reasonLabel': 'Reason',
    'report.reason.inappropriate': 'Inappropriate behavior',
    'report.reason.no-show': 'Did not show up',
    'report.reason.harassment': 'Harassment or abuse',
    'report.reason.scam': 'Scam or money request',
    'report.reason.other': 'Other',
    'report.detailLabel': 'Details (optional)',
    'report.detailPlaceholder': 'Tell us what happened.',
    'report.submitButton': 'Submit report',
    'report.submitting': 'Submitting...',
    'report.successTitle': 'Report submitted',
    'report.successBody': "We'll review it and take action. We're here to keep you safe.",
    'report.errorMessage': 'Failed to submit the report. Please try again.',
    'report.validationHint': 'Please choose a reason.',
    'tutorial.skip': 'Skip',
    'tutorial.next': 'Next',
    'tutorial.start': 'Get started',
    'tutorial.slide1Title': 'Share skills with neighbors',
    'tutorial.slide1Body':
      'Exchange and learn skills with neighbors living in Gyeongsan — languages, cooking, parenting tips, and more.',
    'tutorial.slide2Title': 'Set up a meetup by chat',
    'tutorial.slide2Body':
      'Chat with a neighbor you\'re interested in and agree on a time and place. A meetup is confirmed only after the other person accepts.',
    'tutorial.slide3Title': 'Meet safely',
    'tutorial.slide3Body':
      'Complete verification before you can set up a meetup. When you meet, scan each other\'s QR codes to check in, and report anything uncomfortable anytime.',
    'tutorial.slide4Title': 'Get to know your neighborhood',
    'tutorial.slide4Body':
      'Add spots only you know about to the Cultural Map, and connect more broadly through micro-groups and the community board.',
    'community.writeButton': 'Write a post',
    'community.newGroupButton': 'Create a micro-group',
    'newPost.title': 'Write a post',
    'newPost.categoryLabel': 'Category',
    'newPost.titleLabel': 'Title',
    'newPost.titlePlaceholder': 'Enter a title',
    'newPost.bodyLabel': 'Content',
    'newPost.bodyPlaceholder': 'Share something with your neighbors',
    'newPost.submitButton': 'Post',
    'newPost.validationHint': 'Please fill in both the title and content.',
    'newGroup.title': 'Create a micro-group',
    'newGroup.titleLabel': 'Group name',
    'newGroup.titlePlaceholder': 'e.g. Saturday multicultural cooking class',
    'newGroup.locationLabel': 'Location',
    'newGroup.locationPlaceholder': 'e.g. Gyeongsan shared kitchen',
    'newGroup.dateLabel': 'Date',
    'newGroup.timeLabel': 'Time',
    'newGroup.categoryLabel': 'Category',
    'newGroup.categoryPlaceholder': 'e.g. cooking, sports, education',
    'newGroup.maxParticipantsLabel': 'Max participants',
    'newGroup.maxParticipantsPlaceholder': 'e.g. 6',
    'newGroup.submitButton': 'Create',
    'newGroup.validationHint': 'Please fill in every field.',
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
    'home.noAppointmentPlaceholder': 'Ibahagi ang kasanayan mo sa mga kapitbahay malapit sa iyo~!',
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
    'chatroom.reportButton': 'I-report',
    'chatroom.replyLoading': 'Sumusulat ng sagot...',
    'chatroom.viewOriginal': 'Tingnan ang orihinal',
    'chatroom.viewTranslation': 'Tingnan ang salin',
    'appointmentCard.confirmed': 'Nakumpirma ang appointment',
    'appointmentCard.defaultZone': 'Ligtas na zone',
    'appointmentCard.checkinButton': 'Pumunta para mag-check-in',
    'appointmentCard.pendingLabel': 'Bagong panukalang appointment',
    'appointmentCard.cancelledLabel': 'Tinanggihan ang appointment na ito',
    'appointmentCard.waitingForAccept': 'Hinihintay ang sagot ng kabilang panig',
    'appointmentCard.acceptButton': 'Tanggapin',
    'appointmentCard.rejectButton': 'Tanggihan',
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
    'mypage.showLess': 'Ipakita ang mas kaunti',
    'mypage.viewTutorial': 'Tingnan ulit ang tutorial ng app',
    'edit.title': 'I-edit ang profile',
    'edit.changePhoto': 'I-tap para baguhin ang larawan',
    'edit.bioLabel': 'Tungkol sa akin',
    'edit.bioPlaceholder': 'Ipakilala ang sarili sa mga kapitbahay',
    'edit.tagHint': 'I-tap ang tag para tanggalin, o magdagdag pa sa ibaba',
    'edit.save': 'I-save',
    'verification.title': 'Manual na beripikasyon ng kaligtasan',
    'verification.cardSubtitle': 'Manual na safety verification gamit ang ID / Foreign Resident Card',
    'verification.subtitle':
      'Awtomatikong itatago ng AI ang numero ng ID/rehistrasyon mo, tapos susuriin lang ng aming team ang naitagong larawan bago aprubahan.',
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
    'verification.maskingNotice':
      'Ang larawan ay ma-save lang matapos itago ng AI ang numero ng ID — makikita lang ng review team ang naitagong bersyon.',
    'verification.errorMinor': 'Dapat 19 taong gulang pataas para sumali sa da-itda.',
    'verification.errorNotFound': 'Hindi mahanap ang numero ng ID sa larawan. Kunan ulit nang malinaw ang numero.',
    'verification.errorGeneric': 'Nagkaproblema sa pagsumite. Subukan ulit.',
    'verification.submitting': 'Isinusumite...',
    'admin.title': 'Pagsusuri ng admin',
    'admin.noAccess': 'Admin lang ang may access sa screen na ito.',
    'admin.verificationSectionTitle': 'Pagsusuri ng ID verification',
    'admin.verificationSectionSubtitle': 'Ang naitagong larawan lang ang ipinapakita',
    'admin.noVerifications': 'Walang verification request na susuriin.',
    'admin.birthDateLabel': 'Ipinanganak {date}',
    'admin.reportSectionTitle': 'Mga Report',
    'admin.reportSectionSubtitle': 'Suriin at ayusin ang mga isinumiteng report',
    'admin.noReports': 'Walang bukas na report.',
    'admin.viewThread': 'Tingnan ang chat →',
    'admin.dismissReport': 'I-dismiss',
    'admin.resolveReport': 'Ayusin',
    'admin.entryLabel': 'Pagsusuri ng admin',
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
    'meetupQr.myQrLabel': 'Aking QR code — ipakita ito sa kabilang tao',
    'meetupQr.cameraPermissionNeeded': 'Kailangan ng access sa camera para i-scan ang QR code ng kausap mo.',
    'meetupQr.grantPermission': 'Payagan ang camera',
    'meetupQr.invalidQr': 'Hindi nakilala ang QR code na iyon.',
    'meetupQr.wrongQr': 'Hindi iyan ang QR code ng kapareha sa appointment na ito.',
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
    'skill.skill_multilingual_interpretation': 'Tulong sa multilingguwal na interpretasyon',
    'skill.skill_pronunciation_study': 'Pag-aaral ng tamang bigkas',
    'skill.skill_holiday_culture_exchange': 'Palitan ng kultura ng kapistahan',
    'skill.skill_world_festival_intro': 'Pagpapakilala ng mga pandaigdigang pista',
    'skill.skill_baking_dessert': 'Baking at dessert',
    'skill.skill_vegan_cooking': 'Vegan/vegetarian na pagluluto',
    'skill.skill_bus_route_help': 'Tulong sa bus route at transportasyon',
    'skill.skill_housing_info_share': 'Pagbahagi ng impormasyon sa bahay/renta',
    'skill.skill_playground_meetup': 'Playdate sa playground',
    'skill.skill_baby_product_info_share': 'Impormasyon sa pagkain at gamit ng sanggol',
    'skill.skill_basic_literacy_education': 'Batayang literacy ng nasa hustong gulang (Koreano)',
    'skill.skill_topik_study_group': 'Grupo ng pag-aaral ng TOPIK',
    'skill.skill_table_tennis_partner': 'Kasosyo sa table tennis',
    'skill.skill_cycling_group': 'Grupo ng pagbibisikleta',
    'skill.skill_board_game_meetup': 'Meetup ng board game',
    'skill.skill_gardening': 'Paghahalaman',
    'skill.skill_smart_device_help': 'Tulong sa smartwatch/appliance',
    'skill.skill_sns_youtube_help': 'Tulong sa social media/YouTube',
    'skill.skill_lease_contract_info_share': 'Pagbahagi ng batayang impormasyon sa kontrata ng upa',
    'skill.skill_tax_year_end_info_share': 'Batayang impormasyon sa buwis/year-end',
    'skillSearch.placeholder': 'Maghanap ng kasanayan/interes',
    'locationSetup.title': 'I-set ang lokasyon',
    'locationSetup.subtitle': 'Titingnan namin kung nasa Gyeongsan ka, tapos piliin ang iyong kapitbahayan',
    'locationSetup.checkingLocation': 'Sinusuri ang lokasyon mo...',
    'locationSetup.outsideBoundsTitle': 'Mukhang nasa labas ka ng Gyeongsan',
    'locationSetup.outsideBoundsBody':
      'Ang Da-itda ay para sa mga residente ng Gyeongsan, kaya maaari ka lang mag-sign up kapag nasa loob ng Gyeongsan. Pumunta sa loob ng lungsod at subukan muli.',
    'locationSetup.retryButton': 'Suriin ulit ang lokasyon',
    'locationSetup.insideConfirmed': 'Nakumpirma na nasa loob ka ng Gyeongsan',
    'locationSetup.pickDistrictLabel': 'Piliin ang iyong kapitbahayan',
    'locationSetup.confirmButton': 'Tapusin at magsimula',
    'chatroom.verificationRequiredTitle': 'Kailangan ng beripikasyon',
    'chatroom.verificationRequiredBody': 'Pakikumpleto muna ang beripikasyon ng ID bago mag-iskedyul ng pagkikita.',
    'chatroom.verificationRequiredConfirm': 'Pumunta sa beripikasyon',
    'chatroom.verificationRequiredCancel': 'Kanselahin',
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
    'terms.title': 'Mga Tuntunin ng Serbisyo',
    'terms.intro': 'Pakibasa ang mga tuntunin sa ibaba bago gamitin ang da-itda. Sa pagpapatuloy, sumasang-ayon ka sa mga sumusunod.',
    'terms.section1Title': '1. Katangian ng Serbisyo',
    'terms.section1Body':
      'Ang da-itda ay isang matching platform na tumutulong sa mga kapitbahay sa Gyeongsan na magpalitan ng kakayahan. Ang kompanya ay nagbibigay lamang ng plataporma — ang aktwal na pagkikita at pagpapalitan ay nasa sariling pasya at responsibilidad ng mga user.',
    'terms.section2Title': '2. Limitasyon ng Pananagutan',
    'terms.section2Body':
      'Ang kompanya ay walang legal na pananagutan sa anumang aksidente, hidwaan, o krimen (kabilang ang, ngunit hindi limitado sa, pananakit, panloloko, o krimen sekswal) na nagmumula sa pagkikita, transaksyon, o pag-uusap sa pagitan ng mga na-match na user. Kinikilala ng mga user ang panganib ng pagkikita sa mga estranghero at dapat sundin ang mga tuntunin sa kaligtasan tulad ng pagkikita sa mga pampublikong lugar.',
    'terms.section3Title': '3. Kwalipikasyon',
    'terms.section3Body':
      'Ang serbisyong ito ay para lamang sa mga user na 19 taong gulang pataas. Hindi maaaring mag-sign up o gumamit ang mga menor de edad. Kung natuklasan na nagbigay ang isang user ng maling impormasyon ng edad, maaaring paghigpitan ng kompanya ang access nila nang walang paunang abiso.',
    'terms.section4Title': '4. Obligasyon ng User',
    'terms.section4Body':
      'Hindi dapat manakot, manggipit, manloko, o mag-diskriminasyon ang mga user sa iba. Kung nasaksihan o naranasan mo ang ganitong gawi, mangyaring iulat ito kaagad gamit ang report feature sa app. Ang mga ulat ay sinusuri at kikilusan ng aming mga operator.',
    'terms.section5Title': '5. Paghawak sa Verification Data',
    'terms.section5Body':
      'Ang mga larawan ng ID na isinumite para sa verification ay ise-save lamang matapos itago ng AI ang sensitibong impormasyon tulad ng huling mga digit ng resident registration number. Hindi kailanman naiimbak ang orihinal na larawan na walang mask. Tanging mga awtorisadong admin lang ang makakapag-approve o mag-reject ng mga hiling ng verification.',
    'terms.section6Title': '6. Paghihigpit sa Paggamit',
    'terms.section6Body':
      'Ang mga user na lumalabag sa mga tuntuning ito o sa naaangkop na batas ay maaaring paghigpitan ang access o suspindihin ang account nang walang paunang abiso.',
    'terms.checkboxLabel': '19 taong gulang pataas ako at sumasang-ayon ako sa lahat ng tuntunin sa itaas.',
    'terms.continueButton': 'Sumang-ayon at magpatuloy',
    'terms.mustAgreeHint': 'Dapat sumang-ayon sa mga tuntunin para magpatuloy.',
    'report.title': 'I-report',
    'report.subtitle': 'Tanging ang mga operator namin ang makakakita ng detalye ng report, at hindi ipinapakita ang iyong pagkakakilanlan sa na-report na user.',
    'report.reasonLabel': 'Dahilan',
    'report.reason.inappropriate': 'Hindi angkop na pag-uugali',
    'report.reason.no-show': 'Hindi dumating sa tipanan',
    'report.reason.harassment': 'Pang-aabuso o panggigipit',
    'report.reason.scam': 'Panloloko o paghingi ng pera',
    'report.reason.other': 'Iba pa',
    'report.detailLabel': 'Detalye (opsyonal)',
    'report.detailPlaceholder': 'Sabihin sa amin ang nangyari.',
    'report.submitButton': 'Isumite ang report',
    'report.submitting': 'Isinusumite...',
    'report.successTitle': 'Naisumite ang report',
    'report.successBody': 'Susuriin namin ito at kikilos. Nandito kami para protektahan ka.',
    'report.errorMessage': 'Nabigo ang pagsumite ng report. Subukan ulit.',
    'report.validationHint': 'Pumili ng dahilan.',
    'tutorial.skip': 'Laktawan',
    'tutorial.next': 'Susunod',
    'tutorial.start': 'Magsimula',
    'tutorial.slide1Title': 'Magbahagi ng kakayahan sa mga kapitbahay',
    'tutorial.slide1Body':
      'Magpalitan at matuto ng kakayahan mula sa mga kapitbahay sa Gyeongsan — mga wika, pagluluto, tips sa pag-aalaga ng anak, at higit pa.',
    'tutorial.slide2Title': 'Mag-set up ng tipanan sa chat',
    'tutorial.slide2Body':
      'Mag-chat sa kapitbahay na interesado ka at magkasundo sa oras at lugar. Ma-kukumpirma lamang ang tipanan kapag tinanggap ito ng kabilang tao.',
    'tutorial.slide3Title': 'Magkita nang ligtas',
    'tutorial.slide3Body':
      'Kumpletuhin ang verification bago maka-set up ng tipanan. Kapag nagkita kayo, i-scan ang QR code ng isa\'t isa para mag-check in, at mag-report anumang oras kung may hindi komportableng nararamdaman.',
    'tutorial.slide4Title': 'Higit pang kilalanin ang inyong lugar',
    'tutorial.slide4Body':
      'Idagdag sa Cultural Map ang mga spot na tanging ikaw lang ang nakakaalam, at mas lumawak ang pagkonekta sa mga micro-group at community board.',
    'community.writeButton': 'Sumulat ng post',
    'community.newGroupButton': 'Gumawa ng micro-group',
    'newPost.title': 'Sumulat ng post',
    'newPost.categoryLabel': 'Kategorya',
    'newPost.titleLabel': 'Pamagat',
    'newPost.titlePlaceholder': 'Ilagay ang pamagat',
    'newPost.bodyLabel': 'Nilalaman',
    'newPost.bodyPlaceholder': 'Ibahagi ang isang bagay sa iyong mga kapitbahay',
    'newPost.submitButton': 'I-post',
    'newPost.validationHint': 'Pakipuno ang pamagat at nilalaman.',
    'newGroup.title': 'Gumawa ng micro-group',
    'newGroup.titleLabel': 'Pangalan ng grupo',
    'newGroup.titlePlaceholder': 'hal. Sabado multicultural cooking class',
    'newGroup.locationLabel': 'Lokasyon',
    'newGroup.locationPlaceholder': 'hal. Gyeongsan shared kitchen',
    'newGroup.dateLabel': 'Petsa',
    'newGroup.timeLabel': 'Oras',
    'newGroup.categoryLabel': 'Kategorya',
    'newGroup.categoryPlaceholder': 'hal. pagluluto, sports, edukasyon',
    'newGroup.maxParticipantsLabel': 'Pinakamaraming kalahok',
    'newGroup.maxParticipantsPlaceholder': 'hal. 6',
    'newGroup.submitButton': 'Gawin',
    'newGroup.validationHint': 'Pakipuno ang lahat ng field.',
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
    'home.noAppointmentPlaceholder': 'Hãy chia sẻ tài năng bạn có với hàng xóm xung quanh~!',
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
    'chatroom.reportButton': 'Báo cáo',
    'chatroom.replyLoading': 'Đang soạn câu trả lời...',
    'chatroom.viewOriginal': 'Xem bản gốc',
    'chatroom.viewTranslation': 'Xem bản dịch',
    'appointmentCard.confirmed': 'Đã xác nhận lịch hẹn',
    'appointmentCard.defaultZone': 'Khu vực an toàn',
    'appointmentCard.checkinButton': 'Đến check-in tại nơi hẹn',
    'appointmentCard.pendingLabel': 'Có đề xuất lịch hẹn mới',
    'appointmentCard.cancelledLabel': 'Lịch hẹn này đã bị từ chối',
    'appointmentCard.waitingForAccept': 'Đang chờ phản hồi từ đối phương',
    'appointmentCard.acceptButton': 'Đồng ý',
    'appointmentCard.rejectButton': 'Từ chối',
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
    'mypage.showLess': 'Thu gọn',
    'mypage.viewTutorial': 'Xem lại hướng dẫn sử dụng ứng dụng',
    'edit.title': 'Chỉnh sửa hồ sơ',
    'edit.changePhoto': 'Nhấn để đổi ảnh đại diện',
    'edit.bioLabel': 'Giới thiệu',
    'edit.bioPlaceholder': 'Giới thiệu ngắn về bạn với hàng xóm',
    'edit.tagHint': 'Nhấn vào thẻ để xóa, hoặc thêm bên dưới',
    'edit.save': 'Lưu',
    'verification.title': 'Xác minh an toàn thủ công',
    'verification.cardSubtitle': 'Xác minh an toàn thủ công bằng CMND/CCCD hoặc Thẻ người nước ngoài',
    'verification.subtitle': 'AI sẽ tự động che số CMND/số đăng ký, sau đó đội ngũ vận hành chỉ xem ảnh đã che trước khi duyệt.',
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
    'verification.maskingNotice': 'Ảnh chỉ được lưu sau khi AI tự động che số ID — đội ngũ duyệt chỉ thấy bản đã che.',
    'verification.errorMinor': 'Bạn phải từ 19 tuổi trở lên để tham gia da-itda.',
    'verification.errorNotFound': 'Không tìm thấy số ID trong ảnh. Vui lòng chụp lại rõ số.',
    'verification.errorGeneric': 'Có lỗi khi gửi. Vui lòng thử lại.',
    'verification.submitting': 'Đang gửi...',
    'admin.title': 'Xét duyệt của quản trị viên',
    'admin.noAccess': 'Chỉ quản trị viên mới truy cập được màn hình này.',
    'admin.verificationSectionTitle': 'Xét duyệt xác minh danh tính',
    'admin.verificationSectionSubtitle': 'Chỉ hiển thị ảnh đã được AI che số',
    'admin.noVerifications': 'Không có yêu cầu xác minh nào cần xét duyệt.',
    'admin.birthDateLabel': 'Sinh {date}',
    'admin.reportSectionTitle': 'Báo cáo',
    'admin.reportSectionSubtitle': 'Xem xét và xử lý các báo cáo đã gửi',
    'admin.noReports': 'Không có báo cáo nào.',
    'admin.viewThread': 'Xem đoạn chat →',
    'admin.dismissReport': 'Bỏ qua',
    'admin.resolveReport': 'Đã xử lý',
    'admin.entryLabel': 'Xét duyệt của quản trị viên',
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
    'meetupQr.myQrLabel': 'Mã QR của tôi — hãy cho đối phương xem',
    'meetupQr.cameraPermissionNeeded': 'Cần quyền truy cập camera để quét mã QR của đối phương.',
    'meetupQr.grantPermission': 'Cho phép truy cập camera',
    'meetupQr.invalidQr': 'Không nhận dạng được mã QR đó.',
    'meetupQr.wrongQr': 'Đây không phải mã QR của đối phương trong lịch hẹn này.',
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
    'skill.skill_multilingual_interpretation': 'Hỗ trợ phiên dịch đa ngôn ngữ',
    'skill.skill_pronunciation_study': 'Nhóm luyện phát âm',
    'skill.skill_holiday_culture_exchange': 'Giao lưu văn hóa ngày lễ',
    'skill.skill_world_festival_intro': 'Giới thiệu lễ hội các nước',
    'skill.skill_baking_dessert': 'Làm bánh/tráng miệng',
    'skill.skill_vegan_cooking': 'Nấu ăn chay',
    'skill.skill_bus_route_help': 'Hướng dẫn tuyến xe buýt/di chuyển',
    'skill.skill_housing_info_share': 'Chia sẻ thông tin nhà ở/thuê nhà',
    'skill.skill_playground_meetup': 'Cùng đưa con đi công viên/sân chơi',
    'skill.skill_baby_product_info_share': 'Chia sẻ thông tin đồ ăn dặm/đồ trẻ em',
    'skill.skill_basic_literacy_education': 'Giáo dục xóa mù chữ cho người lớn (tiếng Hàn)',
    'skill.skill_topik_study_group': 'Nhóm học TOPIK',
    'skill.skill_table_tennis_partner': 'Bạn chơi bóng bàn',
    'skill.skill_cycling_group': 'Nhóm đạp xe',
    'skill.skill_board_game_meetup': 'Buổi gặp chơi board game',
    'skill.skill_gardening': 'Làm vườn',
    'skill.skill_smart_device_help': 'Hỗ trợ đồng hồ thông minh/thiết bị gia dụng',
    'skill.skill_sns_youtube_help': 'Hỗ trợ mạng xã hội/YouTube',
    'skill.skill_lease_contract_info_share': 'Chia sẻ thông tin cơ bản về hợp đồng thuê nhà',
    'skill.skill_tax_year_end_info_share': 'Thông tin cơ bản về thuế/quyết toán cuối năm',
    'skillSearch.placeholder': 'Tìm kỹ năng/sở thích',
    'locationSetup.title': 'Cài đặt vị trí',
    'locationSetup.subtitle': 'Chúng tôi sẽ kiểm tra bạn có ở Gyeongsan không, sau đó chọn khu vực của bạn',
    'locationSetup.checkingLocation': 'Đang kiểm tra vị trí...',
    'locationSetup.outsideBoundsTitle': 'Có vẻ bạn đang ở ngoài Gyeongsan',
    'locationSetup.outsideBoundsBody':
      'Da-itda là dịch vụ dành cho cư dân Gyeongsan, nên bạn chỉ có thể đăng ký khi ở trong Gyeongsan. Vui lòng di chuyển vào thành phố và thử lại.',
    'locationSetup.retryButton': 'Kiểm tra lại vị trí',
    'locationSetup.insideConfirmed': 'Đã xác nhận bạn đang ở trong Gyeongsan',
    'locationSetup.pickDistrictLabel': 'Chọn khu vực của bạn',
    'locationSetup.confirmButton': 'Hoàn tất và bắt đầu',
    'chatroom.verificationRequiredTitle': 'Cần xác minh',
    'chatroom.verificationRequiredBody': 'Vui lòng hoàn tất xác minh giấy tờ trước khi đặt lịch hẹn.',
    'chatroom.verificationRequiredConfirm': 'Đi xác minh',
    'chatroom.verificationRequiredCancel': 'Hủy',
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
    'terms.title': 'Điều khoản dịch vụ',
    'terms.intro': 'Vui lòng đọc các điều khoản dưới đây trước khi sử dụng da-itda. Khi tiếp tục, bạn đồng ý với những nội dung sau.',
    'terms.section1Title': '1. Tính chất của dịch vụ',
    'terms.section1Body':
      'da-itda là nền tảng kết nối giúp hàng xóm tại Gyeongsan trao đổi kỹ năng. Công ty chỉ cung cấp nền tảng — việc gặp mặt và trao đổi thực tế diễn ra theo quyết định và trách nhiệm riêng của người dùng.',
    'terms.section2Title': '2. Giới hạn trách nhiệm',
    'terms.section2Body':
      'Công ty không chịu trách nhiệm pháp lý đối với bất kỳ tai nạn, tranh chấp hay tội phạm nào (bao gồm nhưng không giới hạn ở hành hung, lừa đảo, hoặc tội phạm tình dục) phát sinh từ các buổi gặp mặt, giao dịch hoặc trò chuyện giữa người dùng đã được ghép cặp. Người dùng tự nhận thức rủi ro khi gặp người lạ và phải tuân theo các quy tắc an toàn như gặp mặt ở nơi công cộng.',
    'terms.section3Title': '3. Điều kiện sử dụng',
    'terms.section3Body':
      'Dịch vụ này chỉ dành cho người dùng từ 19 tuổi trở lên. Người chưa đủ tuổi không được đăng ký hoặc sử dụng dịch vụ. Nếu phát hiện người dùng cung cấp thông tin tuổi sai sự thật, công ty có thể hạn chế quyền truy cập mà không cần thông báo trước.',
    'terms.section4Title': '4. Nghĩa vụ của người dùng',
    'terms.section4Body':
      'Người dùng không được đe dọa, quấy rối, lừa đảo hoặc phân biệt đối xử với người khác. Nếu bạn chứng kiến hoặc gặp phải hành vi như vậy, vui lòng báo cáo ngay qua chức năng báo cáo trong ứng dụng. Các báo cáo sẽ được quản trị viên xem xét và xử lý.',
    'terms.section5Title': '5. Xử lý dữ liệu xác minh',
    'terms.section5Body':
      'Ảnh giấy tờ tùy thân được nộp để xác minh chỉ được lưu trữ sau khi AI tự động che các thông tin nhạy cảm như các số cuối của số đăng ký cư trú. Ảnh gốc chưa che không bao giờ được lưu trên máy chủ. Chỉ quản trị viên được ủy quyền mới có thể phê duyệt hoặc từ chối yêu cầu xác minh.',
    'terms.section6Title': '6. Hạn chế sử dụng',
    'terms.section6Body':
      'Người dùng vi phạm các điều khoản này hoặc pháp luật liên quan có thể bị hạn chế quyền truy cập hoặc khóa tài khoản mà không cần thông báo trước.',
    'terms.checkboxLabel': 'Tôi từ 19 tuổi trở lên và đồng ý với tất cả điều khoản trên.',
    'terms.continueButton': 'Đồng ý và tiếp tục',
    'terms.mustAgreeHint': 'Bạn cần đồng ý với điều khoản để tiếp tục.',
    'report.title': 'Báo cáo',
    'report.subtitle': 'Chỉ quản trị viên của chúng tôi xem được nội dung báo cáo, danh tính của bạn không được chia sẻ với người bị báo cáo.',
    'report.reasonLabel': 'Lý do',
    'report.reason.inappropriate': 'Hành vi không phù hợp',
    'report.reason.no-show': 'Không đến điểm hẹn',
    'report.reason.harassment': 'Quấy rối/hành vi khó chịu',
    'report.reason.scam': 'Lừa đảo/yêu cầu tiền',
    'report.reason.other': 'Khác',
    'report.detailLabel': 'Chi tiết (không bắt buộc)',
    'report.detailPlaceholder': 'Hãy cho chúng tôi biết điều gì đã xảy ra.',
    'report.submitButton': 'Gửi báo cáo',
    'report.submitting': 'Đang gửi...',
    'report.successTitle': 'Đã gửi báo cáo',
    'report.successBody': 'Chúng tôi sẽ xem xét và xử lý. Chúng tôi luôn bảo vệ sự an toàn của bạn.',
    'report.errorMessage': 'Gửi báo cáo không thành công. Vui lòng thử lại.',
    'report.validationHint': 'Vui lòng chọn lý do.',
    'tutorial.skip': 'Bỏ qua',
    'tutorial.next': 'Tiếp theo',
    'tutorial.start': 'Bắt đầu',
    'tutorial.slide1Title': 'Chia sẻ kỹ năng với hàng xóm',
    'tutorial.slide1Body':
      'Trao đổi và học kỹ năng với hàng xóm sống tại Gyeongsan — ngôn ngữ, nấu ăn, kinh nghiệm nuôi dạy con và nhiều hơn nữa.',
    'tutorial.slide2Title': 'Hẹn gặp qua trò chuyện',
    'tutorial.slide2Body':
      'Trò chuyện với người hàng xóm bạn quan tâm và cùng thống nhất thời gian, địa điểm. Cuộc hẹn chỉ được xác nhận khi đối phương đồng ý.',
    'tutorial.slide3Title': 'Gặp mặt an toàn',
    'tutorial.slide3Body':
      'Hoàn tất xác minh trước khi có thể đặt hẹn. Khi gặp nhau, hãy quét mã QR của nhau để check-in, và báo cáo bất cứ khi nào cảm thấy không thoải mái.',
    'tutorial.slide4Title': 'Hiểu thêm về khu phố của bạn',
    'tutorial.slide4Body':
      'Đăng những địa điểm chỉ riêng bạn biết lên Cultural Map, và kết nối rộng hơn qua các nhóm nhỏ và bảng tin cộng đồng.',
    'community.writeButton': 'Viết bài',
    'community.newGroupButton': 'Tạo nhóm nhỏ',
    'newPost.title': 'Viết bài',
    'newPost.categoryLabel': 'Danh mục',
    'newPost.titleLabel': 'Tiêu đề',
    'newPost.titlePlaceholder': 'Nhập tiêu đề',
    'newPost.bodyLabel': 'Nội dung',
    'newPost.bodyPlaceholder': 'Chia sẻ điều gì đó với hàng xóm của bạn',
    'newPost.submitButton': 'Đăng bài',
    'newPost.validationHint': 'Vui lòng nhập cả tiêu đề và nội dung.',
    'newGroup.title': 'Tạo nhóm nhỏ',
    'newGroup.titleLabel': 'Tên nhóm',
    'newGroup.titlePlaceholder': 'VD: Lớp học nấu ăn đa văn hóa thứ Bảy',
    'newGroup.locationLabel': 'Địa điểm',
    'newGroup.locationPlaceholder': 'VD: Nhà bếp chung Gyeongsan',
    'newGroup.dateLabel': 'Ngày',
    'newGroup.timeLabel': 'Giờ',
    'newGroup.categoryLabel': 'Danh mục',
    'newGroup.categoryPlaceholder': 'VD: nấu ăn, thể thao, giáo dục',
    'newGroup.maxParticipantsLabel': 'Số người tối đa',
    'newGroup.maxParticipantsPlaceholder': 'VD: 6',
    'newGroup.submitButton': 'Tạo',
    'newGroup.validationHint': 'Vui lòng điền đầy đủ các trường.',
  },
};
