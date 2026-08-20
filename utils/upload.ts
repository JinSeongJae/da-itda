import { useAuthStore } from '../store/useAuthStore';

/** Uploads a base64-encoded image to Vercel Blob via /api/upload, returning its public URL (or null on failure). */
export async function uploadImage(base64: string, contentType: string): Promise<string | null> {
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const token = useAuthStore.getState().sessionToken;
  if (!backendUrl || !token) return null;

  try {
    const res = await fetch(`${backendUrl}/api/upload`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ base64, contentType }),
    });
    if (!res.ok) return null;
    const { url } = (await res.json()) as { url: string };
    return url;
  } catch {
    return null;
  }
}
