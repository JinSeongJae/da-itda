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
  deletePost: (postId: string) => Promise<boolean>;
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
          // 서버 응답을 그대로 정답으로 삼아 통째로 교체한다(merge가 아님) — 그래야 시드/삭제된
          // 글이 로컬에 유령처럼 남지 않는다 (fetchAllUsers에서 이미 겪은 문제와 동일한 패턴).
          set({ postsById: Object.fromEntries(posts.filter((p) => p?.id).map((p) => [p.id, p])) });
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

      deletePost: async (postId) => {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
        const headers = authHeaders();
        if (!backendUrl || !headers) return false;

        const previous = get().postsById[postId];
        set((state) => {
          const next = { ...state.postsById };
          delete next[postId];
          return { postsById: next };
        });

        try {
          const res = await fetch(`${backendUrl}/api/cultural-map/pins`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ resource: 'post', id: postId, action: 'delete' }),
          });
          if (!res.ok && previous) {
            set((state) => ({ postsById: { ...state.postsById, [postId]: previous } }));
            return false;
          }
          return true;
        } catch {
          if (previous) set((state) => ({ postsById: { ...state.postsById, [postId]: previous } }));
          return false;
        }
      },
    }),
    {
      name: 'daitda-community-posts',
      storage: asyncStorageAdapter,
    }
  )
);
