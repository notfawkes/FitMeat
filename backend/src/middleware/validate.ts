import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const validateBody = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
  }

  req.body = parsed.data;
  next();
};
