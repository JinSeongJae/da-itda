import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { applyCors } from './_cors';
import { requireUser } from './_auth';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — plenty for a quality:0.7 photo, keeps base64 JSON body small

/** Shared upload endpoint for any real-image-needed feature (avatar, ID verification, etc.). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 지원합니다.' });
    return;
  }

  try {
    const userId = requireUser(req);
    const { base64, contentType } = req.body ?? {};
    if (!base64 || typeof base64 !== 'string' || !contentType || typeof contentType !== 'string') {
      res.status(400).json({ error: 'base64, contentType이 필요합니다.' });
      return;
    }
    if (!contentType.startsWith('image/')) {
      res.status(400).json({ error: '이미지 파일만 업로드할 수 있습니다.' });
      return;
    }

    const buffer = Buffer.from(base64, 'base64');
    if (buffer.byteLength > MAX_BYTES) {
      res.status(413).json({ error: '이미지 용량이 너무 큽니다.' });
      return;
    }

    const ext = contentType.split('/')[1]?.split('+')[0] || 'jpg';
    const blob = await put(`uploads/${userId}/${Date.now()}.${ext}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });

    res.status(200).json({ url: blob.url });
  } catch (error) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500;
    res.status(statusCode).json({ error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.' });
  }
}
