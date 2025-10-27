"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController = __importStar(require("../controllers/auth.controller"));
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
// Simple test route that doesn't use any controller
router.get('/simple-test', (req, res) => {
    res.json({ success: true, message: 'Simple auth route working!' });
});
// Send OTP for login
router.post('/send-otp', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
], validate_1.validateRequest, authController.sendOtp);
// Verify OTP and login
router.post('/verify-otp', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('otp')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits')
        .isNumeric()
        .withMessage('OTP must contain only numbers'),
], validate_1.validateRequest, authController.verifyOtp);
// Register with password
router.post('/register', [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
], validate_1.validateRequest, authController.registerWithPassword);
// Login with password
router.post('/login', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
], validate_1.validateRequest, authController.loginWithPassword);
// Google Sign In
router.post('/google', 
// Temporarily remove validation to debug
authController.googleSignIn);
// Test route
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Auth routes are working!' });
});
// Get current user
router.get('/me', authController.getCurrentUser);
// Logout
router.post('/logout', authController.logout);
// Get client configuration
router.get('/config', authController.getClientConfig);
exports.default = router;
