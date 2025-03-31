import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('API is running...');
});

// TODO: Add routes like:
// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);

export default app;
