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
                '2. 마스킹할 영역의 사각형 좌표를 알려주세요 — 단, 앞 6자리(생년월일)와 하이픈은 절대 가리면 ' +
                '안 되고, **하이픈 뒤 뒷자리 7자리 숫자만** 가려야 합니다. 이미지 전체 가로/세로를 각각 0~1로 ' +
                '정규화한 좌표(xMin, yMin, xMax, yMax)로, 뒷자리 7자리 숫자만 넉넉히 감싸는 사각형을 주세요 ' +
                '(앞 6자리 쪽으로 넘어가면 안 됩니다). 번호를 못 찾았으면 found를 false로 응답하세요.',
            },
            { inlineData: { mimeType, data: base64Image } },
          ],
        },
      ],
      generationConfig: {
        // gemini-3.6-flash는 기본으로 "생각" 토큰을 많이 써서(이미지 분석은 특히 더) 응답이
        // JSON을 완성하기 전에 잘리는 문제가 있었다. 레거시 필드인 thinkingBudget은 이 모델에서
        // 400 에러가 나므로, Gemini 3 계열의 thinkingLevel로 생각 양을 줄인다.
        thinkingConfig: { thinkingLevel: 'low' },
        maxOutputTokens: 1024,
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
    // TEMP: 원인 진단용 — 빈 응답이 안전 필터/차단 때문인지 확인하기 위해 finishReason과
    // promptFeedback을 그대로 로그로 남긴다.
    console.error('[gemini] empty text. finishReason=%s promptFeedback=%j', data?.candidates?.[0]?.finishReason, data?.promptFeedback);
    throw new Error('Gemini 응답에서 신분증 분석 결과를 찾을 수 없어요.');
  }

  // responseMimeType: 'application/json'을 지정해도 최신 모델은 가끔 "Here is the JSON:" 같은
  // 서두를 덧붙인다 — 전체를 파싱하는 대신 첫 '{'부터 마지막 '}'까지만 추출해서 파싱한다.
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
    // TEMP: 원인 진단용 — JSON이 아닌 실제 텍스트 내용을 로그로 남긴다.
    console.error('[gemini] non-JSON text:', text);
    throw new Error('Gemini 응답이 JSON 형식이 아니에요.');
  }

  return JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as IdAnalysisResult;
}
