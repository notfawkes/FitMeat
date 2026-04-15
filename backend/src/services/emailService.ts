import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${config.appUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: config.emailFrom,
    to: email,
    subject: 'Verify your FitMeat account',
    text: `Welcome to FitMeat! Verify your email by clicking the link below:\n\n${verificationUrl}\n\nIf you did not request this, ignore this email.`,
    html: `<p>Welcome to <strong>FitMeat</strong>!</p><p>Click the link below to verify your email:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p><p>If you did not request this, ignore this email.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${config.appUrl}/reset-password?token=${encodeURIComponent(token)}`;
  await transporter.sendMail({
    from: config.emailFrom,
    to: email,
    subject: 'FitMeat password reset request',
    text: `A password reset was requested for your FitMeat account. Reset your password using the link below:\n\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    html: `<p>A password reset was requested for your FitMeat account.</p><p>Reset your password using the link below:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, ignore this email.</p>`,
  });
}
