export type CulturalPinCategory = 'food' | 'study' | 'shopping' | 'culture-spot' | 'nature' | 'other';

export interface PinVerification {
  userId: string;
  verifiedAt: string;
}

/** A user-registered "Cultural Map" pin — a migrant's own local knowledge, asset-ized. */
export interface CulturalPin {
  id: string;
  authorId: string;
  title: string;
  story: string;
  category: CulturalPinCategory;
  lat: number;
  lng: number;
  address?: string;
  createdAt: string;
  verifications: PinVerification[];
}
