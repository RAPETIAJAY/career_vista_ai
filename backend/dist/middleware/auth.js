"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.authMiddleware = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger_1.logger.error('JWT_SECRET not found in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
            });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        catch (error) {
            // Try with fallback secret for backward compatibility
            if (error.name === 'JsonWebTokenError') {
                try {
                    decoded = jsonwebtoken_1.default.verify(token, 'your-super-secret-jwt-key-change-this-in-production');
                    logger_1.logger.warn('Token verified with fallback secret - user should re-login');
                }
                catch (fallbackError) {
                    throw error; // Throw original error if fallback fails
                }
            }
            else {
                throw error;
            }
        }
        // Find user
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Attach user to request
        req.user = user;
        req.userId = user._id.toString();
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
            });
        }
        if (error.name === 'JsonWebTokenError') {
            logger_1.logger.error('JWT Error details:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Invalid token signature',
            });
        }
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }
};
exports.auth = auth;
// For backward compatibility and alias
exports.authMiddleware = exports.auth;
exports.authenticate = exports.auth;
