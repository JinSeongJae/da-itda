import jwt from 'jsonwebtoken';
import type { VercelRequest } from '@vercel/node';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');
  return secret;
}

export function signSessionToken(userId: string): string {
  return jwt.sign({ sub: userId }, getSecret(), { expiresIn: '30d' });
}

export function requireUser(req: VercelRequest): string {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
  if (!token) {
    throw Object.assign(new Error('인증 토큰이 없습니다.'), { statusCode: 401 });
  }

  try {
    const payload = jwt.verify(token, getSecret()) as { sub: string };
    return payload.sub;
  } catch {
    throw Object.assign(new Error('인증 토큰이 유효하지 않습니다.'), { statusCode: 401 });
  }
}
