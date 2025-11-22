import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemsRouter from './routes/items.js';
import subscriptionsRouter from './routes/subscriptions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/items', itemsRouter);
app.use('/api/subscriptions', subscriptionsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for: ${CORS_ORIGIN}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`   To fix this, either:`);
    console.error(`   1. Kill the process using port ${PORT}:`);
    console.error(`      Windows: netstat -ano | findstr :${PORT} (then taskkill /PID <PID> /F)`);
    console.error(`      Mac/Linux: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`   2. Or change the PORT in your .env file`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

