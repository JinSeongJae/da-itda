const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface IdAnalysisResult {
  found: boolean;
  birthDate?: string; // "YYYY-MM-DD"
  box?: { xMin: number; yMin: number; xMax: number; yMax: number };
}

/**
 * Server-only (never bundled into the client app). Asks Gemini to locate the 13-digit
 * resident/foreign-registration number on an ID photo, so the caller can black it out before
 * ever persisting the image, and to read the birth date off the front 6 digits for the age
 * gate — this call always runs before anything touching that image is stored anywhere.
 */
export async function analyzeIdDocument(base64Image: string, mimeType: string): Promise<IdAnalysisResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI API 키가 설정되지 않았습니다.');
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                '다음은 한국의 주민등록증 또는 외국인등록증 사진입니다. 이미지 안에서 13자리 번호' +
                '(주민등록번호 또는 외국인등록번호, "######-#######" 형식)를 찾아주세요.\n\n' +
                '찾았다면:\n' +
                '1. 앞 6자리(생년월일)와 뒷자리 첫 숫자로 생년월일을 YYYY-MM-DD 형식으로 계산하세요. ' +
                '뒷자리 첫 숫자 1,2 → 1900년대, 3,4 → 2000년대, 5,6 → 1900년대(외국인), 7,8 → 2000년대(외국인).\n' +
                '2. 번호 13자리 전체(하이픈 포함)가 이미지에서 차지하는 사각형 영역을, 이미지 전체 가로/세로를 ' +
                '각각 0~1로 정규화한 좌표(xMin, yMin, xMax, yMax)로 알려주세요. 카드가 기울어져 있거나 여유가 ' +
                '필요하면 숫자를 넉넉히 감싸는 사각형으로 주세요. 번호를 못 찾았으면 found를 false로 응답하세요.',
            },
            { inlineData: { mimeType, data: base64Image } },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 300,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            found: { type: 'boolean' },
            birthDate: { type: 'string' },
            box: {
              type: 'object',
              properties: {
                xMin: { type: 'number' },
                yMin: { type: 'number' },
                xMax: { type: 'number' },
                yMax: { type: 'number' },
              },
              required: ['xMin', 'yMin', 'xMax', 'yMax'],
            },
          },
          required: ['found'],
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((p: any) => (typeof p?.text === 'string' ? p.text : '')).join('').trim()
    : '';
  if (!text) {
    throw new Error('Gemini 응답에서 신분증 분석 결과를 찾을 수 없어요.');
  }

  return JSON.parse(text) as IdAnalysisResult;
}
