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
      // gemini-3.6-flash가 기본으로 쓰는 "생각" 토큰 + 서두 문구가 예산을 먹어 응답이 잘리는
      // 문제를 막기 위해 예산을 넉넉히 준다.
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
