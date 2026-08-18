import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Applies permissive CORS headers and answers preflight requests.
 * Returns true if the caller should stop (the OPTIONS preflight was handled).
 */
export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
