import type { Appointment } from '../types';
import { MATCH_JASMIN_JIEUN_ID } from './matches';
import { USER_JIEUN_ID } from './users';

export const SEED_THREAD_ID = 'thread_jasmin_jieun';
export const SEED_APPOINTMENT_ID = 'appointment_1';

export const SEED_APPOINTMENT: Appointment = {
  id: SEED_APPOINTMENT_ID,
  matchId: MATCH_JASMIN_JIEUN_ID,
  threadId: SEED_THREAD_ID,
  date: '2026-08-20',
  time: '10:00',
  safeZoneId: 'safezone_local_food_kitchen',
  status: 'confirmed',
  createdBy: USER_JIEUN_ID,
  createdAt: '2026-08-14T10:20:00+09:00',
  qrToken: 'DAITDA1A2B3C',
  checkIns: [],
};

export const SEED_APPOINTMENTS: Record<string, Appointment> = {
  [SEED_APPOINTMENT_ID]: SEED_APPOINTMENT,
};
