import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = clientUrl === '*' ? '*' : clientUrl.split(',').map((origin) => origin.trim());

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRoutes);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected.'))
    .catch((error) => console.error(`MongoDB unavailable; using demo mode. ${error.message}`));
} else {
  console.log('MONGODB_URI not set; using in-memory demo mode.');
}

app.listen(port, '0.0.0.0', () => console.log(`Rangrez API listening on port ${port}`));
