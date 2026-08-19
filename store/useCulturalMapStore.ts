import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CulturalPin, CulturalPinCategory } from '../types';
import { SEED_CULTURAL_PINS } from '../mocks/culturalPins';
import { generateId } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';

interface CreatePinInput {
  authorId: string;
  title: string;
  story: string;
  category: CulturalPinCategory;
  lat: number;
  lng: number;
  address?: string;
}

type VerifyFailureReason = 'self' | 'duplicate' | 'too-far' | 'not-found' | 'offline';
type VerifyResult = { ok: true; pointsAwarded: number } | { ok: false; reason: VerifyFailureReason };

function authHeaders(): Record<string, string> | undefined {
  const token = useAuthStore.getState().sessionToken;
  return token ? { authorization: `Bearer ${token}` } : undefined;
}

interface CulturalMapState {
  pinsById: Record<string, CulturalPin>;
  createPin: (input: CreatePinInput) => CulturalPin;
  verifyPin: (pinId: string, location: { lat: number; lng: number }) => Promise<VerifyResult>;
  getPinById: (pinId: string) => CulturalPin | undefined;
  fetchPins: () => Promise<void>;
}

export const useCulturalMapStore = create<CulturalMapState>()(
  persist(
    (set, get) => ({
      pinsById: Object.fromEntries(SEED_CULTURAL_PINS.map((pin) => [pin.id, pin])),

      createPin: (input) => {
        const pin: CulturalPin = {
          id: generateId('pin'),
          authorId: input.authorId,
          title: input.title,
          story: input.story,
          category: input.category,
          lat: input.lat,
          lng: input.lng,
          address: input.address,
          createdAt: new Date().toISOString(),
          verifications: [],
        };
        set((state) => ({ pinsById: { ...state.pinsById, [pin.id]: pin } }));

        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (backendUrl && headers) {
          fetch(`${backendUrl}/api/cultural-map/pins`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({
              id: pin.id,
              title: pin.title,
              story: pin.story,
              category: pin.category,
              lat: pin.lat,
              lng: pin.lng,
              address: pin.address,
            }),
          }).catch(() => {});
        }

        return pin;
      },

      verifyPin: async (pinId, location) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return { ok: false, reason: 'offline' };

        try {
          const res = await fetch(`${backendUrl}/api/cultural-map/pins/${pinId}/verify`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify(location),
          });

          if (!res.ok) {
            if (res.status === 400) return { ok: false, reason: 'self' };
            if (res.status === 409) return { ok: false, reason: 'duplicate' };
            if (res.status === 403) return { ok: false, reason: 'too-far' };
            if (res.status === 404) return { ok: false, reason: 'not-found' };
            return { ok: false, reason: 'offline' };
          }

          const { pin, pointsAwarded } = (await res.json()) as {
            pin: { id: string; verifications: CulturalPin['verifications'] };
            pointsAwarded: number;
          };
          set((state) => {
            const existing = state.pinsById[pin.id];
            if (!existing) return state;
            return { pinsById: { ...state.pinsById, [pin.id]: { ...existing, verifications: pin.verifications } } };
          });
          return { ok: true, pointsAwarded };
        } catch {
          return { ok: false, reason: 'offline' };
        }
      },

      getPinById: (pinId) => get().pinsById[pinId],

      fetchPins: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return;

        try {
          const res = await fetch(`${backendUrl}/api/cultural-map/pins`, { headers });
          if (!res.ok) return;

          const { pins } = (await res.json()) as { pins: CulturalPin[] };
          set((state) => {
            const merged = { ...state.pinsById };
            for (const pin of pins) {
              if (pin?.id) merged[pin.id] = pin;
            }
            return { pinsById: merged };
          });
        } catch {
          // 오프라인이거나 백엔드 미배포 — 로컬(시드) 상태 그대로 유지
        }
      },
    }),
    {
      name: 'daitda-cultural-map',
      storage: asyncStorageAdapter,
    }
  )
);
