"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
let isConnected = false;
const connectDB = async () => {
    logger_1.logger.info('🔍 connectDB called. Current state:', {
        isConnected,
        readyState: mongoose_1.default.connection.readyState,
        hasMongoUri: !!process.env.MONGODB_URI
    });
    // If already connected, return immediately
    if (isConnected && mongoose_1.default.connection.readyState === 1) {
        logger_1.logger.info('✅ Using existing MongoDB connection');
        return;
    }
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        logger_1.logger.error('❌ MONGODB_URI not found in environment variables');
        throw new Error('MONGODB_URI is not set in environment variables');
    }
    try {
        logger_1.logger.info('🔄 Connecting to MongoDB...', {
            currentReadyState: mongoose_1.default.connection.readyState
        });
        // Set mongoose options before connecting
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default.set('bufferCommands', false); // Disable buffering to fail fast
        // Use 8 seconds max for Vercel Hobby's 10-second limit (leave 2s for other operations)
        const result = await mongoose_1.default.connect(MONGODB_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 8000, // 8 seconds to stay under Vercel's 10s limit
            socketTimeoutMS: 45000,
            family: 4,
            connectTimeoutMS: 8000, // 8 seconds
            heartbeatFrequencyMS: 10000,
        });
        isConnected = true;
        logger_1.logger.info('✅ Connected to MongoDB', {
            readyState: mongoose_1.default.connection.readyState,
            host: mongoose_1.default.connection.host,
            name: mongoose_1.default.connection.name
        });
    }
    catch (error) {
        logger_1.logger.error('❌ MongoDB connection error:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        isConnected = false;
        throw error;
    }
};
exports.connectDB = connectDB;
// Handle connection events
mongoose_1.default.connection.on('connected', () => {
    isConnected = true;
    logger_1.logger.info('🟢 MongoDB connected');
});
mongoose_1.default.connection.on('disconnected', () => {
    isConnected = false;
    logger_1.logger.warn('🔴 MongoDB disconnected');
});
mongoose_1.default.connection.on('error', (err) => {
    isConnected = false;
    logger_1.logger.error('❌ MongoDB connection error:', err);
});
