// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: '1d' });
};
