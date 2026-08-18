import * as Crypto from 'expo-crypto';

export function generateId(prefix?: string): string {
  const uuid = Crypto.randomUUID();
  return prefix ? `${prefix}_${uuid}` : uuid;
}

export function generateQrToken(): string {
  return Crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
}
