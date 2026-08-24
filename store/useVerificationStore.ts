import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, ReportReason, VerificationDocumentType, VerificationRequest } from '../types';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';
import { useUserStore } from './useUserStore';

type SubmitFailureReason = 'minor' | 'not-found' | 'offline' | 'unknown';
type SubmitResult = { ok: true; request: VerificationRequest } | { ok: false; reason: SubmitFailureReason; message?: string };

function authHeaders(): Record<string, string> | undefined {
  const token = useAuthStore.getState().sessionToken;
  return token ? { authorization: `Bearer ${token}` } : undefined;
}

interface VerificationState {
  requestsByUser: Record<string, VerificationRequest>;
  pendingForAdmin: VerificationRequest[];
  openReports: Report[];

  submitVerification: (
    userId: string,
    documentType: VerificationDocumentType,
    photo: { base64: string; mimeType: string }
  ) => Promise<SubmitResult>;
  fetchMyVerification: (userId: string) => Promise<void>;
  fetchPendingVerifications: () => Promise<void>;
  approveVerification: (id: string) => Promise<boolean>;
  rejectVerification: (id: string) => Promise<boolean>;

  submitReport: (targetUserId: string, reason: ReportReason, detail?: string, threadId?: string) => Promise<boolean>;
  fetchOpenReports: () => Promise<void>;
  resolveReport: (id: string) => Promise<boolean>;
  dismissReport: (id: string) => Promise<boolean>;

  getRequestForUser: (userId: string) => VerificationRequest | undefined;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set, get) => ({
      requestsByUser: {},
      pendingForAdmin: [],
      openReports: [],

      submitVerification: async (userId, documentType, photo) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return { ok: false, reason: 'offline' };

        try {
          const res = await fetch(`${backendUrl}/api/verification`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({
              resource: 'verification',
              documentType,
              base64: photo.base64,
              contentType: photo.mimeType,
            }),
          });

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            if (res.status === 403 && body.reason === 'minor') return { ok: false, reason: 'minor' };
            if (res.status === 422) return { ok: false, reason: 'not-found', message: body.error };
            return { ok: false, reason: 'unknown', message: body.error };
          }

          const { request } = (await res.json()) as { request: VerificationRequest };
          set((state) => ({ requestsByUser: { ...state.requestsByUser, [userId]: request } }));
          useUserStore.getState().updateProfile(userId, { verification: 'pending' });
          return { ok: true, request };
        } catch {
          return { ok: false, reason: 'offline' };
        }
      },

      fetchMyVerification: async (userId) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return;
        try {
          const res = await fetch(`${backendUrl}/api/verification?resource=verification`, { headers });
          if (!res.ok) return;
          const { request } = (await res.json()) as { request: VerificationRequest | null };
          if (!request) return;
          set((state) => ({ requestsByUser: { ...state.requestsByUser, [userId]: request } }));
        } catch {
          // 오프라인 — 로컬 상태 유지
        }
      },

      fetchPendingVerifications: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return;
        try {
          const res = await fetch(`${backendUrl}/api/verification?resource=verification`, { headers });
          if (!res.ok) return;
          const { requests } = (await res.json()) as { requests: VerificationRequest[] };
          set({ pendingForAdmin: requests });
        } catch {
          // 오프라인 — 로컬 상태 유지
        }
      },

      approveVerification: async (id) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return false;
        try {
          const res = await fetch(`${backendUrl}/api/verification`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ resource: 'verification', id, action: 'approve' }),
          });
          if (!res.ok) return false;
          set((state) => ({ pendingForAdmin: state.pendingForAdmin.filter((r) => r.id !== id) }));
          return true;
        } catch {
          return false;
        }
      },

      rejectVerification: async (id) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return false;
        try {
          const res = await fetch(`${backendUrl}/api/verification`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ resource: 'verification', id, action: 'reject' }),
          });
          if (!res.ok) return false;
          set((state) => ({ pendingForAdmin: state.pendingForAdmin.filter((r) => r.id !== id) }));
          return true;
        } catch {
          return false;
        }
      },

      submitReport: async (targetUserId, reason, detail, threadId) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return false;
        try {
          const res = await fetch(`${backendUrl}/api/verification`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ resource: 'report', targetUserId, reason, detail, threadId }),
          });
          return res.ok;
        } catch {
          return false;
        }
      },

      fetchOpenReports: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return;
        try {
          const res = await fetch(`${backendUrl}/api/verification?resource=report`, { headers });
          if (!res.ok) return;
          const { reports } = (await res.json()) as { reports: Report[] };
          set({ openReports: reports });
        } catch {
          // 오프라인 — 로컬 상태 유지
        }
      },

      resolveReport: async (id) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return false;
        try {
          const res = await fetch(`${backendUrl}/api/verification`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ resource: 'report', id, action: 'resolve' }),
          });
          if (!res.ok) return false;
          set((state) => ({ openReports: state.openReports.filter((r) => r.id !== id) }));
          return true;
        } catch {
          return false;
        }
      },

      dismissReport: async (id) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return false;
        try {
          const res = await fetch(`${backendUrl}/api/verification`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ resource: 'report', id, action: 'dismiss' }),
          });
          if (!res.ok) return false;
          set((state) => ({ openReports: state.openReports.filter((r) => r.id !== id) }));
          return true;
        } catch {
          return false;
        }
      },

      getRequestForUser: (userId) => get().requestsByUser[userId],
    }),
    {
      name: 'daitda-verification',
      storage: asyncStorageAdapter,
    }
  )
);
