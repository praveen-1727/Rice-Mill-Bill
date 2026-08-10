import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import billRoutes from './routes/billRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Rice Mill Billing MERN Server',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (offline mode)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/bills', billRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/seed', seedRoutes);

// Serve static frontend production build in single-service mode
const frontendDistPath = path.resolve(__dirname, '../rice-mill-billing-main/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`[Express Single-Service] Serving static frontend build from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Express API Server] Running on http://localhost:${PORT}`);
    console.log(`[Express API Server] Health Check: http://localhost:${PORT}/api/health`);
  });
});
