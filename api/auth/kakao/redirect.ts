import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Kakao's console only accepts http(s) Redirect URIs — it rejects custom URL schemes like
 * daitda://, so a native app can't register its own scheme directly. This endpoint IS the
 * https URI registered in the Kakao console; Kakao redirects the browser here with ?code=...,
 * and we immediately 302 onward to daitda://oauth/kakao so WebBrowser.openAuthSessionAsync
 * (watching for that scheme) intercepts the navigation and hands control back to the app.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === 'string') params.set(key, value);
    else if (Array.isArray(value) && value[0] !== undefined) params.set(key, value[0]);
  }

  const query = params.toString();
  res.writeHead(302, { Location: `daitda://oauth/kakao${query ? `?${query}` : ''}` });
  res.end();
}
