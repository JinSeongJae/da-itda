import type { SafeZone } from '../types';

function scoreFrom(factors: SafeZone['safetyFactors']): number {
  return Math.round(
    (factors.footTraffic + factors.lighting + factors.crimeRateInverse + factors.cctvCoverage) / 4
  );
}

/**
 * 실제 경산시 소재 공공기관/장소로 구성했다 — 주소·전화번호는 검색으로 확인한 실제 값,
 * 좌표는 해당 지번의 대략적인 위치 추정치다(정밀 지오코딩은 아님). safetyFactors는 각
 * 장소의 실제 성격(관공서=CCTV·직원상주 강함이지만 야간 운영 안 함, 대학가 카페=유동인구는
 * 높지만 치안 공식성은 상대적으로 낮음)을 반영해 개별적으로 매긴 값이지 일괄로 높게 준 게
 * 아니다. "isPartnered"는 실제 업무 제휴가 있는 경우에만 true — 지금은 전부 false다.
 */
const rawZones: Omit<SafeZone, 'safetyScore'>[] = [
  {
    id: 'safezone_seobu1dong_center',
    name: '서부1동 행정복지센터',
    type: 'community-center',
    address: '경상북도 경산시 경산로 135 (사정동 32-11)',
    lat: 35.823,
    lng: 128.734,
    safetyFactors: { footTraffic: 70, lighting: 90, crimeRateInverse: 96, cctvCoverage: 95 },
    hours: { open: '09:00', close: '18:00', days: '평일' },
    phone: '053-804-7728',
    isPartnered: false,
  },
  {
    id: 'safezone_gyeongsan_family_center',
    name: '경산시 가족센터 (다문화가족지원센터)',
    type: 'community-center',
    address: '경상북도 경산시 경산로 131',
    lat: 35.8235,
    lng: 128.7335,
    safetyFactors: { footTraffic: 65, lighting: 88, crimeRateInverse: 96, cctvCoverage: 92 },
    hours: { open: '09:00', close: '18:00', days: '평일' },
    phone: '053-813-4072',
    isPartnered: false,
  },
  {
    id: 'safezone_gyeongsan_city_library',
    name: '경산시립도서관',
    type: 'library',
    address: '경상북도 경산시 하양읍 문화로10길 15',
    lat: 35.907,
    lng: 128.819,
    safetyFactors: { footTraffic: 75, lighting: 92, crimeRateInverse: 97, cctvCoverage: 90 },
    hours: { open: '09:00', close: '18:00', days: '화-일 (월요일 휴관)' },
    phone: '053-804-7296',
    isPartnered: false,
  },
  {
    id: 'safezone_starbucks_yeungnam_art_center',
    name: '스타벅스 영남대아트센터점',
    type: 'cafe',
    address: '경상북도 경산시 대학로 280 (대동, 영남대학교 60주년기념관)',
    lat: 35.828,
    lng: 128.754,
    safetyFactors: { footTraffic: 92, lighting: 85, crimeRateInverse: 82, cctvCoverage: 80 },
    hours: { open: '08:00', close: '22:00', days: '매일' },
    phone: '1522-3232',
    isPartnered: false,
  },
];

export const SAFE_ZONES: SafeZone[] = rawZones.map((z) => ({
  ...z,
  safetyScore: scoreFrom(z.safetyFactors),
}));
