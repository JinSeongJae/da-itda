import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VerificationDocumentType, VerificationRequest } from '../types';
import { generateId } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useUserStore } from './useUserStore';

interface VerificationState {
  requestsByUser: Record<string, VerificationRequest>;
  submitVerification: (
    userId: string,
    documentType: VerificationDocumentType,
    imageUri: string
  ) => VerificationRequest;
  mockAdminApprove: (userId: string) => void;
  mockAdminReject: (userId: string) => void;
  getRequestForUser: (userId: string) => VerificationRequest | undefined;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set, get) => ({
      requestsByUser: {},

      submitVerification: (userId, documentType, imageUri) => {
        const request: VerificationRequest = {
          id: generateId('verification'),
          userId,
          documentType,
          imageUri,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };
        set((state) => ({
          requestsByUser: { ...state.requestsByUser, [userId]: request },
        }));
        useUserStore.getState().setVerificationStatus(userId, 'pending');
        return request;
      },

      mockAdminApprove: (userId) => {
        set((state) => {
          const request = state.requestsByUser[userId];
          if (!request) return state;
          return {
            requestsByUser: {
              ...state.requestsByUser,
              [userId]: { ...request, status: 'verified', reviewedAt: new Date().toISOString() },
            },
          };
        });
        useUserStore.getState().setVerificationStatus(userId, 'verified');
        useUserStore.getState().awardBadge(userId, 'safe-verified');
      },

      mockAdminReject: (userId) => {
        set((state) => {
          const request = state.requestsByUser[userId];
          if (!request) return state;
          return {
            requestsByUser: {
              ...state.requestsByUser,
              [userId]: { ...request, status: 'rejected', reviewedAt: new Date().toISOString() },
            },
          };
        });
        useUserStore.getState().setVerificationStatus(userId, 'rejected');
      },

      getRequestForUser: (userId) => get().requestsByUser[userId],
    }),
    {
      name: 'daitda-verification',
      storage: asyncStorageAdapter,
    }
  )
);
