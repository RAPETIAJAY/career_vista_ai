import mongoose from 'mongoose';
import { logger } from './logger';

let isConnected = false;

export const connectDB = async () => {
  logger.info('🔍 connectDB called. Current state:', {
    isConnected,
    readyState: mongoose.connection.readyState,
    hasMongoUri: !!process.env.MONGODB_URI
  });

  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info('✅ Using existing MongoDB connection');
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    logger.error('❌ MONGODB_URI not found in environment variables');
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  try {
    logger.info('🔄 Connecting to MongoDB...', {
      currentReadyState: mongoose.connection.readyState
    });
    
    // Set mongoose options before connecting
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false); // Disable buffering to fail fast
    
    // Use 8 seconds max for Vercel Hobby's 10-second limit (leave 2s for other operations)
    const result = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 8000, // 8 seconds to stay under Vercel's 10s limit
      socketTimeoutMS: 45000,
      family: 4,
      connectTimeoutMS: 8000, // 8 seconds
      heartbeatFrequencyMS: 10000,
    });

    isConnected = true;
    logger.info('✅ Connected to MongoDB', {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    });
  } catch (error: any) {
    logger.error('❌ MongoDB connection error:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
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
