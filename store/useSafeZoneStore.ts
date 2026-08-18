import { create } from 'zustand';
import type { SafeZone } from '../types';
import { SAFE_ZONES } from '../mocks/safeZones';

interface SafeZoneState {
  safeZones: SafeZone[];
  getSafeZoneById: (id: string) => SafeZone | undefined;
}

export const useSafeZoneStore = create<SafeZoneState>()((_set, get) => ({
  safeZones: SAFE_ZONES,
  getSafeZoneById: (id) => get().safeZones.find((z) => z.id === id),
}));
