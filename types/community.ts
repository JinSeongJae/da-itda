export type CommunityPostCategory = 'exchange' | 'question' | 'group';

export interface CommunityPost {
  id: string;
  authorId: string;
  category: CommunityPostCategory;
  title: string;
  body: string;
  createdAt: string;
}
