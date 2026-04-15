import dotenv from 'dotenv';

dotenv.config();

const getEnv = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config = {
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '7d',
  smtpHost: process.env.SMTP_HOST ?? 'localhost',
  smtpPort: Number(process.env.SMTP_PORT ?? '1025'),
  emailFrom: process.env.EMAIL_FROM ?? 'no-reply@fitmeat.local',
  appUrl: process.env.APP_URL ?? 'http://localhost:4000',
};

if (Number.isNaN(config.smtpPort) || config.smtpPort <= 0) {
  throw new Error('Invalid SMTP_PORT value');
}
