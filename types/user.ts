import type { Skill } from './skill';
import type { VerificationStatus } from './verification';
import type { BadgeId } from './badge';

export type VisaType = 'F-6' | 'F-4' | 'E-2' | 'D-2' | 'F-5' | 'none';

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

export interface User {
  id: string;
  name: string;
  nationality: string;
  isForeignResident: boolean;
  visaType?: VisaType;
  avatarUrl?: string;
  bio: string;
  mbti?: string;
  location: UserLocation;
  languages: LanguageProficiency[];
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: TimeSlot[];
  verification: VerificationStatus;
  badges: BadgeId[];
  points: number;
  volunteerMinutes: number;
  createdAt: string;
}
