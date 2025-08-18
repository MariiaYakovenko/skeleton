import { createHmac, timingSafeEqual } from 'crypto';

const b64urlFromObj = (obj: Record<string,any>): string => Buffer.from(JSON.stringify(obj)).toString('base64url')

export const signJWT = (params: {
  userId: string,
  secret: Buffer,
  expiresIn: number;
}): string => {
  const now = Math.trunc(Date.now() / 1000);
  const header = b64urlFromObj({ alg: 'HS256', typ: 'JWT' });
  const payload = b64urlFromObj({
    sub: params.userId,
    iat: now,
    exp: now + params.expiresIn,
  });
  const data = `${header}.${payload}`;

  return `${header}.${payload}.${(createHmac('sha256', params.secret).update(data).digest()).toString('base64url')}`;
}

export const verifyJWT = (
  token: string,
  secret: Buffer
): Record<string, any> | null => {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = createHmac('sha256', secret).update(`${header}.${payload}`).digest();
  const actualSignature = Buffer.from(signature, 'base64url');
  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) {
    return null;
  }

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  const now = Math.floor(Date.now() / 1000);
  if (now >= data?.exp) {
    return null;
  }

  return data;
}
