import type { Skill } from './skill';
import type { VerificationStatus } from './verification';
import type { BadgeId } from './badge';

export type VisaType = 'F-6' | 'F-4' | 'E-2' | 'D-2' | 'F-5' | 'none';

export type Gender = 'male' | 'female' | 'unspecified';

export type TalkStyle = 'quiet' | 'lively' | 'no-preference';

export interface LanguageProficiency {
  language: string;
  level: '초급' | '중급' | '고급' | '원어민';
}

export type Weekday = '월' | '화' | '수' | '목' | '금' | '토' | '일';

export interface TimeSlot {
  day: Weekday;
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export interface UserLocation {
  city: string;
  district: string; // e.g. "중산동", "진량읍"
  lat: number;
  lng: number;
}

/** Foreground-tracked GPS fix, refreshed while the app is open — used for the smart-match push. */
export interface LiveLocation {
  lat: number;
  lng: number;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  nationality: string;
  isForeignResident: boolean;
  visaType?: VisaType;
  avatarUrl?: string;
  bio: string;
  mbti?: string;
  gender?: Gender;
  talkStyle?: TalkStyle;
  location: UserLocation;
  liveLocation?: LiveLocation;
  pushToken?: string;
  languages: LanguageProficiency[];
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: TimeSlot[];
  verification: VerificationStatus;
  badges: BadgeId[];
  /** User ids this person has become "단짝 이웃" (best-friend-neighbor) with — powers the chat list tag. */
  bestFriendNeighborIds?: string[];
  points: number;
  volunteerMinutes: number;
  createdAt: string;
  termsAcceptedAt?: string;
}
