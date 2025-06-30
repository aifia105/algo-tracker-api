import express from 'express';
import { login, register } from '../services/auth.service';
import { AppError } from '../exceptions/exceptions';
import { checkTokenStatus } from '../services/jwtService.service';
import { validateBody } from '../middlewares/validation.middleware';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from '../validations/auth.validation';

const router = express.Router();

router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const result = await register({ username, email, password });
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.get('/validate-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : req.body.token || (req.query.token as string);

    if (!token) {
      res.status(400).json({
        message: 'Token is required',
        status: 'invalid',
      });
      return;
    }

    const tokenStatus = await checkTokenStatus(token);

    if (tokenStatus.status === 'valid') {
      res.status(200).json({
        message: 'Token is valid',
        status: 'valid',
        timeUntilExpiry: tokenStatus.timeUntilExpiry,
        user: {
          userId: tokenStatus.payload?.userId,
          email: tokenStatus.payload?.email,
        },
      });
    } else if (tokenStatus.status === 'expired') {
      res.status(401).json({
        message: 'Token has expired',
        status: 'expired',
      });
    } else {
      res.status(401).json({
        message: 'Invalid token',
        status: 'invalid',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Token validation failed',
      status: 'error',
    });
  }
});

router.post(
  '/forgot-password',
  validateBody(forgotPasswordSchema),
  async (req, res) => {
    try {
      const { email } = req.body;

      res.status(200).json({ message: `Password reset link sent to ${email}` });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Failed to send password reset link' });
      }
    }
  },
);

export default router;
