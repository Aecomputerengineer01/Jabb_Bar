import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import drinksRouter from './routes/drinks.js';
import shiftsRouter from './routes/shifts.js';
import { seed } from './prisma/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'jabb-bar-backend', timestamp: new Date() });
});

// API Routes
app.use('/api/drinks', drinksRouter);
app.use('/api/shift', shiftsRouter);
app.use('/api/shifts', shiftsRouter);

// POST /api/seed - Trigger database seeding
app.post('/api/seed', async (req, res) => {
  try {
    await seed();
    res.json({ success: true, message: 'Seeded 41 mockup drinks to PostgreSQL successfully!' });
  } catch (err) {
    console.error('Error seeding via endpoint:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Jabb Bar Backend (Node.js + Express) running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Connected to PostgreSQL via Prisma ORM`);
});
