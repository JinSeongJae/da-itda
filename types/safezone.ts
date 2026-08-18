export type SafeZoneType = 'cafe' | 'library' | 'community-center' | 'shared-kitchen';

export interface SafeZoneHours {
  open: string; // "HH:mm"
  close: string; // "HH:mm"
  days: string; // e.g. "매일" | "평일" | "화-일"
}

export interface SafetyFactors {
  footTraffic: number; // 0-100
  lighting: number; // 0-100
  crimeRateInverse: number; // 0-100 (higher = safer)
  cctvCoverage: number; // 0-100
}

export interface SafeZone {
  id: string;
  name: string;
  type: SafeZoneType;
  address: string;
  lat: number;
  lng: number;
  safetyScore: number; // 0-100, derived from safetyFactors
  safetyFactors: SafetyFactors;
  hours: SafeZoneHours;
  phone?: string;
  isPartnered: boolean;
}
