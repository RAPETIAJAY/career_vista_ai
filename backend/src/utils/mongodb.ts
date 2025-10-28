import mongoose from 'mongoose';
import { logger } from './logger';

let isConnected = false;

export const connectDB = async () => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info('✅ Using existing MongoDB connection');
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  try {
    logger.info('🔄 Connecting to MongoDB...');
    
    // Set mongoose options before connecting
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false); // Disable buffering to fail fast
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      // Add these for better serverless performance
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    });

    isConnected = true;
    logger.info('✅ Connected to MongoDB');
  } catch (error: any) {
    logger.error('❌ MongoDB connection error:', error.message);
    isConnected = false;
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
  logger.info('🟢 MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('🔴 MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  logger.error('❌ MongoDB connection error:', err);
});
