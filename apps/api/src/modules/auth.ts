import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const ok = await bcrypt.compare(password, passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: email, role: 'admin' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
  return res.json({ token, user: { email, role: 'admin' } });
});
