import { query } from '../db';

export interface ProfileRecord {
  id: string;
  email: string;
  name: string;
  address: string;
  phone_number: string;
}

export async function createProfile(
  id: string,
  email: string,
  name: string,
  address: string,
  phone_number: string
): Promise<ProfileRecord> {
  const result = await query<ProfileRecord>(
    'INSERT INTO profiles (id, email, name, address, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, email.toLowerCase(), name, address, phone_number]
  );
  return result.rows[0];
}

export async function findProfileByUserId(userId: string): Promise<ProfileRecord | null> {
  const result = await query<ProfileRecord>('SELECT * FROM profiles WHERE id = $1', [userId]);
  return result.rows[0] ?? null;
}
