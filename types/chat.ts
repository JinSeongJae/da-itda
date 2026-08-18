export interface ChatThread {
  id: string;
  matchId: string;
  participantIds: [string, string];
  isDirectChannel: boolean;
  createdAt: string;
  lastMessagePreview?: string;
  lastMessageAt?: string;
}

export type ChatMessageType = 'text' | 'appointment' | 'system' | 'cultural-guide';

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string; // 'system' for system/cultural-guide messages
  type: ChatMessageType;
  text: string;
  translatedText?: Record<string, string>; // languageCode -> translation
  appointmentId?: string;
  createdAt: string;
}

export interface AIContextHeaderData {
  matchId: string;
  purposeSummary: string;
  compatibilityScore: number;
}

export interface CulturalGuideTip {
  id: string;
  triggerPhrase: string;
  explanation: string;
  language: string;
}
