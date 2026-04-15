import { query } from '../db';

export interface UserRecord {
  id: string;
  email: string;
  hashed_password: string;
  is_verified: boolean;
  created_at: string;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await query<UserRecord>('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  return result.rows[0] ?? null;
}

export async function findUserById(userId: string): Promise<UserRecord | null> {
  const result = await query<UserRecord>('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0] ?? null;
}

export async function createUser(email: string, hashedPassword: string): Promise<UserRecord> {
  const result = await query<UserRecord>(
    'INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING *',
    [email.toLowerCase(), hashedPassword]
  );
  return result.rows[0];
}

export async function markUserVerified(userId: string): Promise<void> {
  await query('UPDATE users SET is_verified = true WHERE id = $1', [userId]);
}

export async function updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
  await query('UPDATE users SET hashed_password = $1 WHERE id = $2', [hashedPassword, userId]);
}
