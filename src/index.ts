import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db';
import authRoutes from './controllers/auth.controller';
import problemRoutes from './controllers/problem.controller';
import { corsOptions } from './middlewares/cors.middleware';
import { authMiddleware } from './middlewares/auth.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', authMiddleware, problemRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URI: ${process.env.MONGODB_URI}`);
});
