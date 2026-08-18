const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const BASE_SYSTEM_INSTRUCTION =
  "너는 '다잇다' 앱의 다정한 한국어 동네 이웃 AI 보조야. 사용자와 따뜻하게 한국어로 대화하며 재능 교류와 모임 약속을 도와줘.";

const WARM_FALLBACK_REPLY = '미안해요, 지금은 답장을 생각하는 중이에요. 조금 있다가 다시 이야기해줄래요? 😊';

export interface GeminiChatTurn {
  role: 'user' | 'model';
  text: string;
}

function extractText(data: any): string | undefined {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return undefined;
  const text = parts
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
  return text.length > 0 ? text : undefined;
}

function buildNeighborSystemInstruction({
  partnerName,
  partnerSkills,
  partnerLocation,
}: {
  partnerName: string;
  partnerSkills: string;
  partnerLocation?: string;
}): string {
  const base =
    `너는 '다잇다' 앱에서 '사용자'와 대화하는 이웃 '${partnerName}'이야. ` +
    `네가 가진 재능/관심사(${partnerSkills})를 바탕으로 다정하고 자연스러운 한국어로 사용자와 대화하며, ` +
    `재능 교류 및 약속 잡기를 도와줘. 로봇이나 AI라는 티를 내지 말고 실제 동네 이웃처럼 친근하게 대화해줘.`;

  return partnerLocation ? `${base} 너는 ${partnerLocation}에 살고 있어.` : base;
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

export async function generateGeminiReply({
  apiKey,
  partnerName,
  partnerSkills,
  partnerLocation,
  history,
}: {
  apiKey: string;
  partnerName: string;
  partnerSkills: string;
  partnerLocation?: string;
  history: GeminiChatTurn[];
}): Promise<string> {
  try {
    const systemInstruction = buildNeighborSystemInstruction({ partnerName, partnerSkills, partnerLocation });
    const data = await callGemini(apiKey, {
      systemInstruction: { parts: [{ text: `${BASE_SYSTEM_INSTRUCTION}\n\n${systemInstruction}` }] },
      contents: history.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
      generationConfig: { maxOutputTokens: 300 },
    });

    return extractText(data) ?? WARM_FALLBACK_REPLY;
  } catch {
    return WARM_FALLBACK_REPLY;
  }
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
      maxOutputTokens: 200,
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

  const parsed = JSON.parse(text);
  if (!parsed.date || !parsed.time || !parsed.purpose) {
    throw new Error('Gemini 약속 추천 결과가 올바르지 않아요.');
  }
  return parsed as AppointmentSuggestion;
}
