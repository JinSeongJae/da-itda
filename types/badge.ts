export type BadgeId = 'safe-verified' | 'best-friend-neighbor';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  iconName: string;
  earnedAt?: string;
}
