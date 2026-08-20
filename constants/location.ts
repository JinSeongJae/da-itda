/** Rough bounding box around Gyeongsan-si — good enough to gate onboarding, not a precise administrative boundary. */
export const GYEONGSAN_BOUNDS = { minLat: 35.7, maxLat: 36.0, minLng: 128.55, maxLng: 128.9 };

export function isWithinGyeongsan(lat: number, lng: number): boolean {
  return (
    lat >= GYEONGSAN_BOUNDS.minLat &&
    lat <= GYEONGSAN_BOUNDS.maxLat &&
    lng >= GYEONGSAN_BOUNDS.minLng &&
    lng <= GYEONGSAN_BOUNDS.maxLng
  );
}

export const GYEONGSAN_DISTRICTS = [
  '중산동',
  '진량읍',
  '압량읍',
  '하양읍',
  '자인면',
  '와촌면',
  '남산면',
  '용성면',
  '옥산동',
  '사동',
  '백천동',
  '계양동',
];
