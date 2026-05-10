import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

export const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

authRouter.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const passwordHash = await bcrypt.hash('demo12345', 10);
  const ok = await bcrypt.compare(password, passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { sub: email, role: 'admin', companyId: 'cmp_demo', permissions: ['*'] },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '8h' }
  );

  return res.json({ token, user: { email, role: 'admin' } });
});

authRouter.post('/register', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', errors: parsed.error.flatten() });

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  return res.status(201).json({ email: parsed.data.email, passwordHashMasked: `${passwordHash.slice(0, 10)}...` });
});
