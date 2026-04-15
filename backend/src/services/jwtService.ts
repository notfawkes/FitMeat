import * as jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface AccessTokenPayload {
  userId: string;
  email: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  tokenId: string;
  userId: string;
  type: 'refresh';
}

const secret: Secret = config.jwtSecret;

export function signAccessToken(userId: string, email: string): string {
  return jwt.sign({ userId, email, type: 'access' }, secret, {
    expiresIn: config.jwtAccessExpires as SignOptions['expiresIn'],
  });
}

export function signRefreshToken(tokenId: string, userId: string): string {
  return jwt.sign({ tokenId, userId, type: 'refresh' }, secret, {
    expiresIn: config.jwtRefreshExpires as SignOptions['expiresIn'],
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, secret) as RefreshTokenPayload;
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid refresh token type');
  }
  return decoded;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, secret) as AccessTokenPayload;
  if (decoded.type !== 'access') {
    throw new Error('Invalid access token type');
  }
  return decoded;
}
