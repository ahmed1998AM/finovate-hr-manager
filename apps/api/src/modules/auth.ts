import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const forgotSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({ token: z.string().min(10), newPassword: z.string().min(8) });

const issueToken = (email: string) =>
  jwt.sign(
    { sub: email, role: 'admin', companyId: 'cmp_demo', permissions: ['*'], twoFactorVerified: true },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );

authRouter.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const passwordHash = await bcrypt.hash('demo12345', 10);
  const ok = await bcrypt.compare(password, passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  return res.json({
    token: issueToken(email),
    user: { email, role: 'admin', companyId: 'cmp_demo' },
    session: { expiresIn: '8h', twoFactorRequired: false }
  });
});

authRouter.post('/register', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  return res.status(201).json({
    email: parsed.data.email,
    passwordHashMasked: `${passwordHash.slice(0, 10)}...`,
    verificationStatus: 'pending'
  });
});

authRouter.post('/forgot-password', (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload' });
  return res.json({ message: 'Reset link queued', email: parsed.data.email });
});

authRouter.post('/reset-password', (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload' });
  return res.json({ message: 'Password reset successful' });
});
