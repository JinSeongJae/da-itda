export type AppointmentStatus = 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled';

export interface CheckIn {
  userId: string;
  checkedInAt: string;
}

export interface Appointment {
  id: string;
  matchId: string;
  threadId: string;
  date: string; // ISO date "yyyy-MM-dd"
  time: string; // "HH:mm"
  safeZoneId: string;
  purpose?: string;
  status: AppointmentStatus;
  createdBy: string;
  createdAt: string;
  qrToken?: string;
  checkIns: CheckIn[];
}
