import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CommunityPost, CommunityPostCategory } from '../types';
import { SEED_COMMUNITY_POSTS } from '../mocks/communityPosts';
import { generateId } from '../utils/id';
import { asyncStorageAdapter } from './storage';
import { useAuthStore } from './useAuthStore';

interface CreatePostInput {
  category: CommunityPostCategory;
  title: string;
  body: string;
}

function authHeaders(): Record<string, string> | undefined {
  const token = useAuthStore.getState().sessionToken;
  return token ? { authorization: `Bearer ${token}` } : undefined;
}

interface CommunityPostState {
  postsById: Record<string, CommunityPost>;
  getAllPosts: () => CommunityPost[];
  fetchPosts: () => Promise<void>;
  createPost: (authorId: string, input: CreatePostInput) => CommunityPost;
}

export const useCommunityPostStore = create<CommunityPostState>()(
  persist(
    (set, get) => ({
      postsById: Object.fromEntries(SEED_COMMUNITY_POSTS.map((post) => [post.id, post])),

      getAllPosts: () =>
        Object.values(get().postsById).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

      fetchPosts: async () => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return;

        try {
          const res = await fetch(`${backendUrl}/api/cultural-map/pins?resource=post`, { headers });
          if (!res.ok) return;
          const { posts } = (await res.json()) as { posts: CommunityPost[] };
          set((state) => {
            const merged = { ...state.postsById };
            for (const post of posts) {
              if (post?.id) merged[post.id] = post;
            }
            return { postsById: merged };
          });
        } catch {
          // 오프라인이거나 백엔드 미배포 — 로컬(시드) 상태 그대로 유지
        }
      },

      createPost: (authorId, input) => {
        const post: CommunityPost = {
          id: generateId('post'),
          authorId,
          category: input.category,
          title: input.title,
          body: input.body,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ postsById: { ...state.postsById, [post.id]: post } }));

        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (backendUrl && headers) {
          fetch(`${backendUrl}/api/cultural-map/pins`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({
              resource: 'post',
              id: post.id,
              category: post.category,
              title: post.title,
              body: post.body,
            }),
          }).catch(() => {});
        }

        return post;
      },
    }),
    {
      name: 'daitda-community-posts',
      storage: asyncStorageAdapter,
    }
  )
);
