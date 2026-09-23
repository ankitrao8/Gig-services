import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Request logging in development
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    platform: 'Sahakar Seva API',
    tagline: 'Verified Workers. Fair Work. Trusted Services.',
    demoMode: true,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Sahakar Seva Cooperative API Server Running on Port ${PORT}`);
  console.log(`🌟 Tagline: "Verified Workers. Fair Work. Trusted Services."`);
  console.log(`📌 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Demo Personas Loaded:`);
  console.log(`   Customer:  9999999999 (OTP: 123456)`);
  console.log(`   Worker:    8888888888 (OTP: 123456)`);
  console.log(`   Admin:     7777777777 (OTP: 123456)`);
  console.log(`=======================================================`);
});

export default app;
