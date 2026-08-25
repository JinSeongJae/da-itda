const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const BASE_SYSTEM_INSTRUCTION =
  "너는 '다잇다' 앱의 다정한 한국어 동네 이웃 AI 보조야. 사용자와 따뜻하게 한국어로 대화하며 재능 교류와 모임 약속을 도와줘.";

function extractText(data: any): string | undefined {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return undefined;
  const text = parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
  return text.length > 0 ? text : undefined;
}

// responseMimeType: 'application/json'을 지정해도 최신 모델은 가끔 "Here is the JSON:" 같은
// 서두를 덧붙인다 — 전체를 파싱하는 대신 실제 JSON 값(객체 또는 배열)만 추출해서 파싱한다.
function parseJsonValue(text: string): any {
  const objStart = text.indexOf('{');
  const arrStart = text.indexOf('[');
  const isArray = arrStart !== -1 && (objStart === -1 || arrStart < objStart);
  const start = isArray ? arrStart : objStart;
  const end = isArray ? text.lastIndexOf(']') : text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('Gemini 응답이 JSON 형식이 아니에요.');
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function callGemini(apiKey: string, body: Record<string, unknown>): Promise<any> {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  return response.json();
}

export interface AppointmentSuggestion {
  date: string;
  time: string;
  purpose: string;
}

export async function generateAppointmentSuggestion({
  apiKey,
  systemInstruction,
  conversationText,
}: {
  apiKey: string;
  systemInstruction: string;
  conversationText: string;
}): Promise<AppointmentSuggestion> {
  const data = await callGemini(apiKey, {
    systemInstruction: { parts: [{ text: `${BASE_SYSTEM_INSTRUCTION}\n\n${systemInstruction}` }] },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
              `다음은 두 이웃의 대화 내용입니다:\n${conversationText}\n\n` +
              `이 대화와 두 이웃의 프로필을 참고해서 만나기 좋은 날짜(오늘로부터 3~7일 이내), 시간, 만남의 목적을 한국어로 추천해주세요.`,
          },
        ],
      },
    ],
    generationConfig: {
      thinkingConfig: { thinkingLevel: 'low' },
      maxOutputTokens: 800,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          date: { type: 'string', description: 'yyyy-MM-dd 형식' },
          time: { type: 'string', description: 'HH:mm 형식' },
          purpose: { type: 'string', description: '만남의 목적을 한 문장으로' },
        },
        required: ['date', 'time', 'purpose'],
      },
    },
  });

  const text = extractText(data);
  if (!text) {
    throw new Error('Gemini 응답에서 약속 추천 결과를 찾을 수 없어요.');
  }

  const parsed = parseJsonValue(text);
  if (!parsed.date || !parsed.time || !parsed.purpose) {
    throw new Error('Gemini 약속 추천 결과가 올바르지 않아요.');
  }
  return parsed as AppointmentSuggestion;
}

export interface SafeZoneCandidateInput {
  id: string;
  name: string;
  type: string;
  hours: string;
  distanceFromMidpointKm: number;
  footTraffic: number;
  lighting: number;
  crimeRateInverse: number;
  cctvCoverage: number;
}

export interface SafeZoneRecommendationContext {
  meetingDateTime: string;
  userAGender?: string;
  userBGender?: string;
  talkStyleSummary: string;
  commonInterests: string[];
}

export interface SafeZoneRecommendation {
  safeZoneId: string;
  matchScore: number;
  rationale: string;
}

export async function generateSafeZoneRecommendations({
  apiKey,
  candidates,
  context,
}: {
  apiKey: string;
  candidates: SafeZoneCandidateInput[];
  context: SafeZoneRecommendationContext;
}): Promise<SafeZoneRecommendation[]> {
  const candidateLines = candidates
    .map(
      (c, i) =>
        `${i + 1}. id=${c.id} / ${c.name} (${c.type}) · 중간지점에서 ${c.distanceFromMidpointKm.toFixed(1)}km · ` +
        `운영시간 ${c.hours} · 유동인구지수 ${c.footTraffic} · 조명 ${c.lighting} · 치안(범죄율 역지표) ${c.crimeRateInverse} · CCTV ${c.cctvCoverage}`
    )
    .join('\n');

  const data = await callGemini(apiKey, {
    systemInstruction: {
      parts: [
        {
          text:
            `${BASE_SYSTEM_INSTRUCTION}\n\n` +
            '너는 두 이웃의 첫 만남을 위한 "안심 오프라인 스팟"을 추천하는 안전 공간 추천 전문가야. ' +
            '시간대별 유동인구·치안 지표, 장소의 개방성, 두 사람 위치의 중간 지점, 대화 성향(시끄러운 곳 vs 조용한 곳), ' +
            '성별 조합, 공통 관심사를 종합적으로 고려해서 후보 장소 각각에 0~100 사이의 안심 매치 점수를 매기고, ' +
            '한국어로 한 문장씩 추천 이유를 작성해줘. 반드시 주어진 후보의 id만 사용하고, 매치 점수가 높은 순서로 정렬해서 응답해.',
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
              `[만남 정보]\n` +
              `일시: ${context.meetingDateTime}\n` +
              `성별 조합: ${context.userAGender ?? '미공개'} · ${context.userBGender ?? '미공개'}\n` +
              `대화 성향: ${context.talkStyleSummary}\n` +
              `공통 관심사: ${context.commonInterests.join(', ') || '없음'}\n\n` +
              `[후보 장소 목록]\n${candidateLines}`,
          },
        ],
      },
    ],
    generationConfig: {
      thinkingConfig: { thinkingLevel: 'low' },
      maxOutputTokens: 1200,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            safeZoneId: { type: 'string', description: '후보 목록의 id 값 그대로' },
            matchScore: { type: 'number', description: '0-100 사이의 안심 매치 점수' },
            rationale: { type: 'string', description: '추천 이유를 한국어 한 문장으로' },
          },
          required: ['safeZoneId', 'matchScore', 'rationale'],
        },
      },
    },
  });

  const text = extractText(data);
  if (!text) {
    throw new Error('Gemini 응답에서 안심존 추천 결과를 찾을 수 없어요.');
  }

  const parsed = parseJsonValue(text);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Gemini 안심존 추천 결과가 올바르지 않아요.');
  }
  return parsed as SafeZoneRecommendation[];
}

export interface MatchRationaleCandidateInput {
  id: string;
  name: string;
  offeredLabels: string[];
  wantedLabels: string[];
  compatibilityScore: number;
}

export interface MatchRationaleResult {
  candidateId: string;
  rationale: string;
}

/**
 * 홈 화면 추천 이웃 카드에 붙는 한 줄 설명 생성 — 매칭 순위·점수는 그대로 기존 규칙 기반
 * 알고리즘(utils/matchAlgorithm.ts)이 계산한 결과를 쓰고, 이 함수는 "왜" 그 조합이 좋은지
 * 자연어로 설명만 덧붙인다. 순서를 바꾸지 않는다 — 안심존 추천에서 AI가 순서까지 바꾸면
 * "가까운 곳"의 의미가 사라졌던 것과 같은 이유로, 매칭 순위도 알고리즘 결과를 그대로 존중한다.
 */
export async function generateMatchRationales({
  apiKey,
  selfOfferedLabels,
  selfWantedLabels,
  candidates,
}: {
  apiKey: string;
  selfOfferedLabels: string[];
  selfWantedLabels: string[];
  candidates: MatchRationaleCandidateInput[];
}): Promise<MatchRationaleResult[]> {
  const candidateLines = candidates
    .map(
      (c, i) =>
        `${i + 1}. id=${c.id} / ${c.name} · 호환도 ${c.compatibilityScore}% · ` +
        `줄 수 있어요: ${c.offeredLabels.join(', ') || '없음'} · 받고 싶어요: ${c.wantedLabels.join(', ') || '없음'}`
    )
    .join('\n');

  const data = await callGemini(apiKey, {
    systemInstruction: {
      parts: [
        {
          text:
            `${BASE_SYSTEM_INSTRUCTION}\n\n` +
            '너는 이미 계산된 이웃 추천 목록에 "왜 이 조합이 잘 맞는지" 한 문장씩 설명을 붙이는 역할이야. ' +
            '순위나 점수를 새로 매기지 말고, 주어진 점수와 재능 목록을 근거로 구체적으로 설명해. ' +
            '두 사람이 서로 주고받을 수 있는 재능이 겹치면 그 부분을 짚어주고, 겹치는 게 약하면 억지로 미화하지 말고 담백하게 설명해.',
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
              `[내 재능]\n줄 수 있어요: ${selfOfferedLabels.join(', ') || '없음'}\n받고 싶어요: ${selfWantedLabels.join(', ') || '없음'}\n\n` +
              `[추천된 이웃 목록]\n${candidateLines}`,
          },
        ],
      },
    ],
    generationConfig: {
      thinkingConfig: { thinkingLevel: 'low' },
      maxOutputTokens: 1000,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            candidateId: { type: 'string', description: '후보 목록의 id 값 그대로' },
            rationale: { type: 'string', description: '추천 이유를 한국어 한 문장으로' },
          },
          required: ['candidateId', 'rationale'],
        },
      },
    },
  });

  const text = extractText(data);
  if (!text) {
    throw new Error('Gemini 응답에서 매칭 설명 결과를 찾을 수 없어요.');
  }

  const parsed = parseJsonValue(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Gemini 매칭 설명 결과가 올바르지 않아요.');
  }
  return parsed as MatchRationaleResult[];
}
