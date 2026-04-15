import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createUser, findUserByEmail, findUserById, markUserVerified, updateUserPassword } from '../models/userModel';
import { createProfile } from '../models/profileModel';
import {
  createVerificationToken,
  findVerificationToken,
  deleteVerificationToken,
  createPasswordResetToken,
  findPasswordResetToken,
  deletePasswordResetToken,
  createRefreshToken,
  findRefreshTokenByTokenId,
  revokeRefreshTokensForUser,
} from '../models/tokenModel';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './jwtService';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService';

const VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

function getExpirationDate(ttlMs: number): Date {
  return new Date(Date.now() + ttlMs);
}

interface SignupProfileInput {
  name: string;
  address: string;
  phone_number: string;
}

export async function signup(email: string, password: string, profile?: SignupProfileInput) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('A user with that email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(email, hashedPassword);

  if (profile) {
    await createProfile(user.id, email, profile.name, profile.address, profile.phone_number);
  }

  await markUserVerified(user.id);
  user.is_verified = true;

  return {
    id: user.id,
    email: user.email,
    is_verified: user.is_verified,
    created_at: user.created_at,
  };
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.hashed_password);
  if (!passwordMatches) {
    throw new Error('Invalid email or password');
  }


  const accessToken = signAccessToken(user.id, user.email);
  const refreshToken = await createRefreshTokenForUser(user.id);

  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const storedToken = await findRefreshTokenByTokenId(payload.tokenId);

  if (!storedToken || storedToken.revoked) {
    throw new Error('Invalid refresh token');
  }

  const expiresAt = new Date(storedToken.expires_at);
  if (expiresAt < new Date()) {
    throw new Error('Refresh token expired');
  }

  const user = await findUserById(payload.userId);
  if (!user) {
    throw new Error('Invalid refresh token payload');
  }

  return {
    accessToken: signAccessToken(user.id, user.email),
  };
}

async function createRefreshTokenForUser(userId: string): Promise<string> {
  const tokenId = crypto.randomUUID();
  const expiresAt = getExpirationDate(1000 * 60 * 60 * 24 * 7); // 7 days
  await createRefreshToken(userId, tokenId, expiresAt);
  return signRefreshToken(tokenId, userId);
}

export async function verifyEmail(token: string) {
  const verificationRecord = await findVerificationToken(token);
  if (!verificationRecord) {
    throw new Error('Invalid or expired verification token');
  }

  const expiresAt = new Date(verificationRecord.expires_at);
  if (expiresAt < new Date()) {
    throw new Error('Email verification token has expired');
  }

  await markUserVerified(verificationRecord.user_id);
  await deleteVerificationToken(verificationRecord.id);
}

export async function forgotPassword(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    // Do not reveal whether the email exists
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  await createPasswordResetToken(user.id, resetToken, getExpirationDate(PASSWORD_RESET_TOKEN_TTL_MS));
  await sendPasswordResetEmail(user.email, resetToken);
}

export async function resetPassword(token: string, newPassword: string) {
  const resetRecord = await findPasswordResetToken(token);
  if (!resetRecord) {
    throw new Error('Invalid or expired password reset token');
  }

  const expiresAt = new Date(resetRecord.expires_at);
  if (expiresAt < new Date()) {
    throw new Error('Password reset token has expired');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(resetRecord.user_id, hashedPassword);
  await revokeRefreshTokensForUser(resetRecord.user_id);
  await deletePasswordResetToken(resetRecord.id);
}
