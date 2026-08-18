import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIContextHeaderData, ChatMessage, ChatThread, CulturalGuideTip } from '../types';
import { CULTURAL_GUIDE_TIPS, SEED_MESSAGES_BY_THREAD, SEED_THREADS } from '../mocks/chatMessages';
import { generateGeminiReply } from '../utils/gemini';
import { generateId } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';
import { useMatchStore } from './useMatchStore';
import { useUserStore } from './useUserStore';

/** Best-effort sync to the Vercel backend — never blocks or breaks the local-only demo flow. */
function syncMessageToServer(message: ChatMessage): void {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const token = useAuthStore.getState().sessionToken;
  if (!apiBaseUrl || !token) return;

  fetch(`${apiBaseUrl}/api/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      id: message.id,
      threadId: message.threadId,
      senderId: message.senderId,
      text: message.text,
      createdAt: message.createdAt,
    }),
  }).catch(() => {});
}

const COUNTERPART_REPLY_POOL = [
  '네 좋아요! 😊',
  '오 그거 정말 기대돼요!',
  '알겠습니다, 그때 뵐게요!',
  '감사해요! 덕분에 많이 배우고 있어요.',
];

interface ChatState {
  threadsById: Record<string, ChatThread>;
  messagesByThread: Record<string, ChatMessage[]>;
  culturalTips: CulturalGuideTip[];
  createThreadForMatch: (matchId: string) => ChatThread;
  sendMessage: (threadId: string, senderId: string, text: string) => ChatMessage;
  attachAppointmentMessage: (threadId: string, appointmentId: string, summaryText: string) => void;
  unlockDirectChannel: (threadId: string) => void;
  getContextHeader: (matchId: string) => AIContextHeaderData | undefined;
  generateCounterpartReply: (threadId: string, counterpartId: string) => Promise<void>;
  getThreadByMatchId: (matchId: string) => ChatThread | undefined;
  /** Hydrates a thread's messages from the Vercel backend, if configured. No-op otherwise. */
  syncMessagesFromServer: (threadId: string) => Promise<void>;
}

function detectCulturalTip(text: string, tips: CulturalGuideTip[]): CulturalGuideTip | undefined {
  return tips.find((tip) => text.includes(tip.triggerPhrase));
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threadsById: SEED_THREADS,
      messagesByThread: SEED_MESSAGES_BY_THREAD,
      culturalTips: CULTURAL_GUIDE_TIPS,

      createThreadForMatch: (matchId) => {
        const existing = get().getThreadByMatchId(matchId);
        if (existing) return existing;

        const match = useMatchStore.getState().getMatchById(matchId);
        if (!match) throw new Error('매칭 정보를 찾을 수 없습니다.');

        const thread: ChatThread = {
          id: generateId('thread'),
          matchId,
          participantIds: [match.userAId, match.userBId],
          isDirectChannel: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          threadsById: { ...state.threadsById, [thread.id]: thread },
          messagesByThread: { ...state.messagesByThread, [thread.id]: [] },
        }));

        return thread;
      },

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

      generateCounterpartReply: async (threadId, counterpartId) => {
        const fallback = () => {
          const reply = COUNTERPART_REPLY_POOL[Math.floor(Math.random() * COUNTERPART_REPLY_POOL.length)];
          get().sendMessage(threadId, counterpartId, reply);
        };

        const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        const counterpart = useUserStore.getState().getUserById(counterpartId);
        const history = (get().messagesByThread[threadId] ?? [])
          .filter((m) => m.type === 'text')
          .slice(-10)
          .map((m) => ({
            role: (m.senderId === counterpartId ? 'model' : 'user') as 'model' | 'user',
            text: m.text,
          }));

        if (!apiKey || !counterpart || history.length === 0 || history[0].role !== 'user') {
          fallback();
          return;
        }

        try {
          const partnerSkills =
            counterpart.skillsOffered.map((s) => s.label).join(', ') || '동네 이웃과 어울리기';
          const partnerLocation = `${counterpart.location.city} ${counterpart.location.district}`;

          const replyText = await generateGeminiReply({
            apiKey,
            partnerName: counterpart.name,
            partnerSkills,
            partnerLocation,
            history,
          });
          get().sendMessage(threadId, counterpartId, replyText);
        } catch {
          fallback();
        }
      },

      getThreadByMatchId: (matchId) =>
        Object.values(get().threadsById).find((t) => t.matchId === matchId),

      syncMessagesFromServer: async (threadId) => {
        const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
        const token = useAuthStore.getState().sessionToken;
        if (!apiBaseUrl || !token) return;

        try {
          const res = await fetch(`${apiBaseUrl}/api/messages?threadId=${encodeURIComponent(threadId)}`, {
            headers: { authorization: `Bearer ${token}` },
          });
          if (!res.ok) return;

          const { messages } = (await res.json()) as {
            messages: { id: string; senderId: string; text: string; createdAt: string }[];
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
                  type: 'text',
                  text: m.text,
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
