import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), 'M월 d일 (EEE)', { locale: ko });
}

export function formatDateTime(isoDate: string, time: string): string {
  return `${formatDate(isoDate)} ${time}`;
}

export function formatRelativeTime(isoDateTime: string): string {
  return formatDistanceToNow(parseISO(isoDateTime), { addSuffix: true, locale: ko });
}

export function formatTimeShort(isoDateTime: string): string {
  return format(parseISO(isoDateTime), 'HH:mm');
}

export function formatMinutesAsHours(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}
