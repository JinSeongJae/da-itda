export interface MatchFactorScores {
  skillComplementarity: number; // 0-100
  interestOverlap: number; // 0-100
  distanceScore: number; // 0-100
  mbtiCompat: number; // 0-100
  timeOverlap: number; // 0-100
}

export type MatchStatus = 'suggested' | 'accepted' | 'chatting' | 'completed' | 'directChannel';

export interface MatchResult {
  id: string;
  userAId: string;
  userBId: string;
  compatibilityScore: number; // 0-100
  factorScores: MatchFactorScores;
  status: MatchStatus;
  createdAt: string;
}

export interface ActivitySegment {
  order: number;
  durationMinutes: number;
  title: string;
  description: string;
  ledByUserId: string;
}

export interface ActivityCourse {
  id: string;
  matchId: string;
  totalDurationMinutes: number;
  segments: ActivitySegment[];
}

export interface MicroGroupSuggestion {
  id: string;
  title: string;
  location: string;
  date: string; // ISO date
  category: string;
  maxParticipants: number;
  interestedUserIds: string[];
}
