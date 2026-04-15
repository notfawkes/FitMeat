import { query } from '../db';

export interface VerificationTokenRecord {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface PasswordResetTokenRecord {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface RefreshTokenRecord {
  id: string;
  user_id: string;
  token_id: string;
  expires_at: string;
  revoked: boolean;
  created_at: string;
}

export async function createVerificationToken(userId: string, token: string, expiresAt: Date): Promise<void> {
  await query(
    'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt.toISOString()]
  );
}

export async function findVerificationToken(token: string): Promise<VerificationTokenRecord | null> {
  const result = await query<VerificationTokenRecord>('SELECT * FROM email_verification_tokens WHERE token = $1', [token]);
  return result.rows[0] ?? null;
}

export async function deleteVerificationToken(id: string): Promise<void> {
  await query('DELETE FROM email_verification_tokens WHERE id = $1', [id]);
}

export async function createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
  await query(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt.toISOString()]
  );
}

export async function findPasswordResetToken(token: string): Promise<PasswordResetTokenRecord | null> {
  const result = await query<PasswordResetTokenRecord>('SELECT * FROM password_reset_tokens WHERE token = $1', [token]);
  return result.rows[0] ?? null;
}

export async function deletePasswordResetToken(id: string): Promise<void> {
  await query('DELETE FROM password_reset_tokens WHERE id = $1', [id]);
}

export async function createRefreshToken(userId: string, tokenId: string, expiresAt: Date): Promise<void> {
  await query(
    'INSERT INTO refresh_tokens (user_id, token_id, expires_at) VALUES ($1, $2, $3)',
    [userId, tokenId, expiresAt.toISOString()]
  );
}

export async function findRefreshTokenByTokenId(tokenId: string): Promise<RefreshTokenRecord | null> {
  const result = await query<RefreshTokenRecord>('SELECT * FROM refresh_tokens WHERE token_id = $1', [tokenId]);
  return result.rows[0] ?? null;
}

export async function revokeRefreshToken(tokenId: string): Promise<void> {
  await query('UPDATE refresh_tokens SET revoked = true WHERE token_id = $1', [tokenId]);
}

export async function revokeRefreshTokensForUser(userId: string): Promise<void> {
  await query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);
}
