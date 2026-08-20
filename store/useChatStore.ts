import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIContextHeaderData, ChatMessage, ChatThread, CulturalGuideTip } from '../types';
import { CULTURAL_GUIDE_TIPS } from '../mocks/chatMessages';
import { generateId } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';
import { useMatchStore } from './useMatchStore';
import { useUserStore } from './useUserStore';

/** Best-effort sync to the Vercel backend — never blocks or breaks the local-only demo flow. */
function syncMessageToServer(message: ChatMessage): void {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const token = useAuthStore.getState().sessionToken;
  if (!backendUrl || !token) return;

  fetch(`${backendUrl}/api/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      id: message.id,
      threadId: message.threadId,
      senderId: message.senderId,
      text: message.text,
      type: message.type,
      appointmentId: message.appointmentId,
      createdAt: message.createdAt,
    }),
  }).catch(() => {});
}

interface ChatState {
  threadsById: Record<string, ChatThread>;
  messagesByThread: Record<string, ChatMessage[]>;
  culturalTips: CulturalGuideTip[];
  sendMessage: (threadId: string, senderId: string, text: string) => ChatMessage;
  attachAppointmentMessage: (threadId: string, appointmentId: string, summaryText: string) => void;
  unlockDirectChannel: (threadId: string) => void;
  getContextHeader: (matchId: string) => AIContextHeaderData | undefined;
  /** Gets (or creates, via the backend) the real shared thread with another real user. */
  createOrFetchThreadWithUser: (counterpartId: string) => Promise<ChatThread>;
  /** Lists every thread the current user participates in, from the backend. No-op if not configured. */
  fetchThreads: () => Promise<void>;
  /** Hydrates a thread's messages from the Vercel backend, if configured. No-op otherwise. */
  syncMessagesFromServer: (threadId: string) => Promise<void>;
}

function detectCulturalTip(text: string, tips: CulturalGuideTip[]): CulturalGuideTip | undefined {
  return tips.find((tip) => text.includes(tip.triggerPhrase));
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threadsById: {},
      messagesByThread: {},
      culturalTips: CULTURAL_GUIDE_TIPS,

      sendMessage: (threadId, senderId, text) => {
        const message: ChatMessage = {
          id: generateId('msg'),
          threadId,
          senderId,
          type: 'text',
          text,
          createdAt: new Date().toISOString(),
        };

        const tip = detectCulturalTip(text, get().culturalTips);
        const extraMessages: ChatMessage[] = [message];
        if (tip) {
          extraMessages.push({
            id: generateId('msg'),
            threadId,
            senderId: 'system',
            type: 'cultural-guide',
            text: tip.explanation,
            createdAt: new Date().toISOString(),
          });
        }

        set((state) => ({
          messagesByThread: {
            ...state.messagesByThread,
            [threadId]: [...(state.messagesByThread[threadId] ?? []), ...extraMessages],
          },
          threadsById: {
            ...state.threadsById,
            [threadId]: {
              ...state.threadsById[threadId],
              lastMessagePreview: text,
              lastMessageAt: message.createdAt,
            },
          },
        }));

        syncMessageToServer(message);
        return message;
      },

      attachAppointmentMessage: (threadId, appointmentId, summaryText) => {
        const message: ChatMessage = {
          id: generateId('msg'),
          threadId,
          senderId: 'system',
          type: 'appointment',
          text: summaryText,
          appointmentId,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          messagesByThread: {
            ...state.messagesByThread,
            [threadId]: [...(state.messagesByThread[threadId] ?? []), message],
          },
          threadsById: {
            ...state.threadsById,
            [threadId]: {
              ...state.threadsById[threadId],
              lastMessagePreview: summaryText,
              lastMessageAt: message.createdAt,
            },
          },
        }));

        syncMessageToServer(message);
      },

      unlockDirectChannel: (threadId) =>
        set((state) => ({
          threadsById: {
            ...state.threadsById,
            [threadId]: { ...state.threadsById[threadId], isDirectChannel: true },
          },
        })),

      getContextHeader: (matchId) => {
        const match = useMatchStore.getState().getMatchById(matchId);
        if (!match) return undefined;
        const userA = useUserStore.getState().getUserById(match.userAId);
        const userB = useUserStore.getState().getUserById(match.userBId);
        if (!userA || !userB) return undefined;

        const skillsA = userA.skillsOffered.map((s) => s.label).slice(0, 2).join(', ');
        const skillsB = userB.skillsOffered.map((s) => s.label).slice(0, 2).join(', ');

        return {
          matchId,
          purposeSummary: `${userA.name}님은 "${skillsA}"를(을), ${userB.name}님은 "${skillsB}"를(을) 나누는 교환이에요.`,
          compatibilityScore: match.compatibilityScore,
        };
      },

      createOrFetchThreadWithUser: async (counterpartId) => {
        const currentUserId = useAuthStore.getState().currentUserId;
        if (!currentUserId) throw new Error('로그인이 필요합니다.');

        // 호환 지수/활동 코스 표시용 매칭 기록은 로컬 계산으로 충분 — 서버엔 스레드만 저장한다.
        const match = useMatchStore.getState().confirmMatch(currentUserId, counterpartId);

        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const token = useAuthStore.getState().sessionToken;
        if (backendUrl && token) {
          try {
            const res = await fetch(`${backendUrl}/api/threads`, {
              method: 'POST',
              headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
              body: JSON.stringify({ counterpartId }),
            });
            if (res.ok) {
              const { thread: serverThread } = (await res.json()) as {
                thread: { id: string; participantIds: [string, string]; createdAt: string };
              };
              const thread: ChatThread = {
                id: serverThread.id,
                matchId: match.id,
                participantIds: serverThread.participantIds,
                isDirectChannel: false,
                createdAt: serverThread.createdAt,
              };
              set((state) => ({
                threadsById: { ...state.threadsById, [thread.id]: thread },
                messagesByThread: { ...state.messagesByThread, [thread.id]: state.messagesByThread[thread.id] ?? [] },
              }));
              return thread;
            }
          } catch {
            // 백엔드 미배포/오프라인 — 아래에서 로컬 전용 스레드로 폴백
          }
        }

        // 백엔드가 없거나 실패한 경우: 이 기기에서만 보이는 로컬 스레드로 계속 진행.
        const existing = Object.values(get().threadsById).find(
          (t) => t.participantIds.includes(currentUserId) && t.participantIds.includes(counterpartId)
        );
        if (existing) return existing;

        const localThread: ChatThread = {
          id: generateId('thread'),
          matchId: match.id,
          participantIds: [currentUserId, counterpartId],
          isDirectChannel: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          threadsById: { ...state.threadsById, [localThread.id]: localThread },
          messagesByThread: { ...state.messagesByThread, [localThread.id]: [] },
        }));
        return localThread;
      },

      fetchThreads: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const token = useAuthStore.getState().sessionToken;
        if (!backendUrl || !token) return;

        try {
          const res = await fetch(`${backendUrl}/api/threads`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;

          const { threads } = (await res.json()) as {
            threads: { id: string; participantIds: [string, string]; createdAt: string }[];
          };

          set((state) => {
            // GET /api/threads is exhaustive for the current user, so replace rather than merge —
            // otherwise a thread deleted server-side (or a stale local-only demo thread from long
            // before the backend existed, e.g. with a mock counterpart like Jasmin/이지은) lingers
            // forever and can be tapped into with no real counterpart/thread data behind it.
            const fresh: typeof state.threadsById = {};
            for (const t of threads) {
              const existing = state.threadsById[t.id];
              fresh[t.id] = {
                id: t.id,
                // 서버는 matchId를 모른다 — 이미 로컬에 있으면 유지하고, 처음 보는 스레드면 빈 문자열로 둔다
                // (컨텍스트 헤더는 해당 매칭 기록이 없으면 자연히 표시되지 않을 뿐 기능은 그대로 동작).
                matchId: existing?.matchId ?? '',
                participantIds: t.participantIds,
                isDirectChannel: existing?.isDirectChannel ?? false,
                createdAt: t.createdAt,
                lastMessagePreview: existing?.lastMessagePreview,
                lastMessageAt: existing?.lastMessageAt,
              };
            }
            return { threadsById: fresh };
          });
        } catch {
          // 오프라인이거나 백엔드 미배포 — 로컬 상태 그대로 유지
        }
      },

      syncMessagesFromServer: async (threadId) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const token = useAuthStore.getState().sessionToken;
        if (!backendUrl || !token) return;

        try {
          const res = await fetch(`${backendUrl}/api/messages?threadId=${encodeURIComponent(threadId)}`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;

          const { messages } = (await res.json()) as {
            messages: {
              id: string;
              senderId: string;
              text: string;
              type: ChatMessage['type'];
              appointmentId?: string;
              createdAt: string;
            }[];
          };

          set((state) => {
            const existingById = new Map(
              (state.messagesByThread[threadId] ?? []).map((m) => [m.id, m])
            );
            for (const m of messages) {
              if (!existingById.has(m.id)) {
                existingById.set(m.id, {
                  id: m.id,
                  threadId,
                  senderId: m.senderId,
                  type: m.type,
                  text: m.text,
                  appointmentId: m.appointmentId,
                  createdAt: m.createdAt,
                });
              }
            }
            const merged = [...existingById.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            return { messagesByThread: { ...state.messagesByThread, [threadId]: merged } };
          });
        } catch {
          // 오프라인이거나 백엔드 미배포 — 로컬 상태 그대로 유지
        }
      },
    }),
    {
      name: 'daitda-chat',
      storage: asyncStorageAdapter,
    }
  )
);
