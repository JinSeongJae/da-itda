import type { SafeZone } from '../types';

function scoreFrom(factors: SafeZone['safetyFactors']): number {
  return Math.round(
    (factors.footTraffic + factors.lighting + factors.crimeRateInverse + factors.cctvCoverage) / 4
  );
}

const rawZones: Omit<SafeZone, 'safetyScore'>[] = [
  {
    id: 'safezone_local_food_kitchen',
    name: '경산시 로컬푸드 직매장 공유주방',
    type: 'shared-kitchen',
    address: '경상북도 경산시 중앙로 123',
    lat: 35.8395,
    lng: 128.755,
    safetyFactors: { footTraffic: 88, lighting: 95, crimeRateInverse: 97, cctvCoverage: 96 },
    hours: { open: '09:00', close: '18:00', days: '화-일 (월요일 휴무)' },
    phone: '053-810-0001',
    isPartnered: true,
  },
  {
    id: 'safezone_jungsan_community_center',
    name: '중산동 주민센터',
    type: 'community-center',
    address: '경상북도 경산시 중산로 45',
    lat: 35.828,
    lng: 128.746,
    safetyFactors: { footTraffic: 82, lighting: 90, crimeRateInverse: 98, cctvCoverage: 94 },
    hours: { open: '09:00', close: '18:00', days: '평일' },
    phone: '053-810-0002',
    isPartnered: true,
  },
  {
    id: 'safezone_daitda_partner_cafe',
    name: '다잇다 협약 카페 경산점',
    type: 'cafe',
    address: '경상북도 경산시 조영로 78',
    lat: 35.842,
    lng: 128.768,
    safetyFactors: { footTraffic: 91, lighting: 93, crimeRateInverse: 88, cctvCoverage: 90 },
    hours: { open: '08:00', close: '22:00', days: '매일' },
    phone: '053-810-0003',
    isPartnered: true,
  },
  {
    id: 'safezone_central_library',
    name: '경산시립 중앙도서관',
    type: 'library',
    address: '경상북도 경산시 강변로 12',
    lat: 35.825,
    lng: 128.738,
    safetyFactors: { footTraffic: 85, lighting: 97, crimeRateInverse: 99, cctvCoverage: 98 },
    hours: { open: '09:00', close: '21:00', days: '화-일 (월요일 휴무)' },
    phone: '053-810-0004',
    isPartnered: true,
  },
];

export const SAFE_ZONES: SafeZone[] = rawZones.map((z) => ({
  ...z,
  safetyScore: scoreFrom(z.safetyFactors),
}));
