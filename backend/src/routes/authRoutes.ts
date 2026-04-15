import { Router } from 'express';
import { signupSchema, loginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/authSchemas';
import { validateBody } from '../middleware/validate';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { findProfileByUserId } from '../models/profileModel';
import { findOrdersByUserId, createOrder } from '../models/orderModel';

const router = Router();

router.post('/signup', validateBody(signupSchema), async (req, res, next) => {
  try {
    const { email, password, name, address, phoneNumber } = req.body;
    const result = await authService.signup(email.trim(), password, {
      name,
      address,
      phone_number: phoneNumber,
    });
    res.status(201).json({ user: result, message: 'Verification email sent.' });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login(email.trim(), password);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', validateBody(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/verify-email', async (req, res, next) => {
  try {
    const token = String(req.query.token ?? '');
    if (!token) {
      return res.status(400).json({ error: 'Missing token query parameter' });
    }
    await authService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/forgot-password', validateBody(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email.trim());
    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password', validateBody(resetPasswordSchema), async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const profile = await findProfileByUserId(user.userId);
    const orders = await findOrdersByUserId(user.userId);
    res.json({
      user,
      profile,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/orders', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { items, totalAmount } = req.body;

    if (!items || typeof totalAmount !== 'number') {
      return res.status(400).json({ error: 'Missing order items or total amount' });
    }

    const order = await createOrder(user.userId, totalAmount, items, 'completed');
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
