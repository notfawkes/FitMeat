import express, { NextFunction, Request, Response } from 'express';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

import dbRoutes from './routes/dbRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/db', dbRoutes);
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(400).json({ error: message });
});

export default app;
