import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRouter } from './modules/auth';
import { erpRouter } from './modules/erp';

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: '2mb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

  app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'Finovate ERP Lite' }));
  app.use('/api/auth', authRouter);
  app.use('/api', erpRouter);
  return app;
};

if (process.env.NODE_ENV !== 'test') {
  createApp().listen(process.env.PORT || 4000, () => console.log('API running on 4000'));
}
