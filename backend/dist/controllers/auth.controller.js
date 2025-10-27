"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientConfig = exports.logout = exports.getCurrentUser = exports.googleSignIn = exports.loginWithPassword = exports.registerWithPassword = exports.verifyOtp = exports.sendOtp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const google_auth_library_1 = require("google-auth-library");
// In-memory OTP storage (in production, use Redis or similar)
const otpStore = {};
/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
/**
 * Send OTP to user's email
 */
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        // Generate a 6-digit OTP
        const otp = generateOTP();
        // Store OTP with 10-minute expiration
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);
        otpStore[email] = {
            otp,
            expires: expirationTime,
        };
        // In production, use a proper email service
        if (process.env.NODE_ENV === 'production') {
            // Configure email transport
            const transporter = nodemailer_1.default.createTransport({
                // Configure with your email provider
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            // Send email
            await transporter.sendMail({
                from: `"CareerVista AI" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your CareerVista AI Login OTP',
                text: `Your OTP for CareerVista AI login is: ${otp}. It will expire in 10 minutes.`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4f46e5;">CareerVista AI</h2>
            <p>Hello,</p>
            <p>Your OTP for CareerVista AI login is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; background-color: #f3f4f6; padding: 10px; text-align: center;">${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Best regards,<br>CareerVista AI Team</p>
          </div>
        `,
            });
        }
        else {
            // In development, just log the OTP
            logger_1.logger.info(`[DEV] OTP for ${email}: ${otp}`);
        }
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            // In development, return the OTP for testing
            ...(process.env.NODE_ENV !== 'production' && { otp }),
        });
    }
    catch (error) {
        logger_1.logger.error('Error sending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
        });
    }
};
exports.sendOtp = sendOtp;
/**
 * Verify OTP and login user
 */
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Check if OTP exists and is valid
        const storedOTP = otpStore[email];
        if (!storedOTP) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found. Please request a new OTP.',
            });
        }
        // Check if OTP has expired
        if (new Date() > storedOTP.expires) {
            // Remove expired OTP
            delete otpStore[email];
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new OTP.',
            });
        }
        // Verify OTP
        if (otp !== storedOTP.otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again.',
            });
        }
        // OTP is valid, remove it from store
        delete otpStore[email];
        // Find or create user
        let user = await User_1.default.findOne({ email });
        if (!user) {
            // Create new user
            user = new User_1.default({
                email,
                profileCompleted: false,
            });
            await user.save();
        }
        // Generate JWT token
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: jwtToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profileCompleted: user.profileCompleted,
                examCompleted: user.examCompleted,
                class: user.class,
                board: user.board,
                state: user.state,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
        });
    }
};
exports.verifyOtp = verifyOtp;
/**
 * Register user with password
 */
const registerWithPassword = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long',
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists',
            });
        }
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create new user
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            profileCompleted: false,
        });
        await user.save();
        logger_1.logger.info('New user registered:', email);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profileCompleted: user.profileCompleted,
                examCompleted: user.examCompleted,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register user',
        });
    }
};
exports.registerWithPassword = registerWithPassword;
/**
 * Login user with password
 */
const loginWithPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }
        // Find user by email
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        // Check if user has a password (might be Google-only user)
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: 'Please sign in with Google. This account was created using Google Sign-In.',
            });
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        logger_1.logger.info('User logged in:', email);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profileCompleted: user.profileCompleted,
                examCompleted: user.examCompleted,
                class: user.class,
                board: user.board,
                state: user.state,
                category: user.category,
                gender: user.gender,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
        });
    }
};
exports.loginWithPassword = loginWithPassword;
/**
 * Google Sign In
 */
const googleSignIn = async (req, res) => {
    try {
        logger_1.logger.info('🔍 Google Sign-In Request: Starting function');
        const { token: googleToken, context } = req.body; // Add context parameter
        logger_1.logger.info('🔍 Step 1: Extracted token and context from request body', { context });
        if (!googleToken) {
            logger_1.logger.info('❌ No token provided');
            return res.status(400).json({
                success: false,
                message: 'Google token is required'
            });
        }
        logger_1.logger.info('🔍 Step 2: Token exists');
        const clientId = process.env.GOOGLE_CLIENT_ID || '664830741958-ngfatn727gjfnim44id86gdjlo390rlb.apps.googleusercontent.com';
        logger_1.logger.info('🔍 Step 3: Retrieved client ID from env');
        logger_1.logger.info('🔍 Environment debug:', {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            envKeys: Object.keys(process.env).filter(key => key.startsWith('GOOGLE')),
            usingHardcoded: !process.env.GOOGLE_CLIENT_ID
        });
        if (!clientId) {
            logger_1.logger.info('❌ No client ID found');
            return res.status(500).json({
                success: false,
                message: 'Google client ID not configured on server',
            });
        }
        logger_1.logger.info('🔍 Step 4: Client ID exists (hardcoded fallback active)');
        let email;
        let name;
        logger_1.logger.info('🔍 Step 5: About to start token processing');
        logger_1.logger.info('🔄 Starting token verification process...');
        // Try to parse as JSON first (popup method)
        try {
            logger_1.logger.info('📄 Step 1: Attempting JSON parse...');
            const userData = JSON.parse(googleToken);
            logger_1.logger.info('📄 Step 2: JSON parse successful');
            if (userData.email && userData.verified_email) {
                email = userData.email;
                name = userData.name || '';
                logger_1.logger.info('✅ Using popup method credentials');
            }
            else {
                throw new Error('Invalid popup credentials - missing email or not verified');
            }
        }
        catch (jsonError) {
            logger_1.logger.info('📄 Step 3: JSON parse failed, trying JWT...');
            // If JSON parsing fails, treat as JWT token (One Tap method)
            try {
                logger_1.logger.info('🔐 Step 4: Starting JWT verification...');
                const client = new google_auth_library_1.OAuth2Client(clientId);
                logger_1.logger.info('🔐 Step 5: OAuth2Client created');
                const ticket = await client.verifyIdToken({
                    idToken: googleToken,
                    audience: clientId
                });
                logger_1.logger.info('🔐 Step 6: Token verified');
                const payload = ticket.getPayload();
                logger_1.logger.info('🔐 Step 7: Payload extracted');
                if (!payload?.email || !payload?.email_verified) {
                    return res.status(400).json({
                        success: false,
                        message: 'Google email not verified'
                    });
                }
                email = payload.email;
                name = payload.name || '';
                logger_1.logger.info('✅ Using One Tap method credentials');
            }
            catch (jwtError) {
                logger_1.logger.error('❌ JWT verification failed:', jwtError?.message);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid Google token - both JSON and JWT verification failed'
                });
            }
        }
        // Find or create user
        logger_1.logger.info('👤 Finding/creating user for email:', email);
        let user = await User_1.default.findOne({ email });
        // Handle registration context - check if user already exists
        if (context === 'register' && user) {
            logger_1.logger.info('👤 Registration attempted but user already exists');
            return res.status(409).json({
                success: false,
                message: 'Account already exists',
                code: 'ACCOUNT_EXISTS',
                user: {
                    email: user.email,
                    name: user.name,
                    profileCompleted: user.profileCompleted,
                    examCompleted: user.examCompleted
                }
            });
        }
        if (!user) {
            logger_1.logger.info('👤 Creating new user...');
            user = new User_1.default({ email, name, profileCompleted: false });
            await user.save();
            logger_1.logger.info('👤 New user created successfully');
        }
        else {
            logger_1.logger.info('👤 Existing user found - proceeding with login');
        }
        // Generate JWT token
        logger_1.logger.info('🔑 Generating JWT token...');
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
        logger_1.logger.info('🔑 JWT token generated successfully');
        logger_1.logger.info('✅ Sending successful response for user:', email);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profileCompleted: user.profileCompleted,
                examCompleted: user.examCompleted,
                class: user.class,
                board: user.board,
                state: user.state,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('❌ Google sign-in error:', {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
            code: error?.code
        });
        res.status(500).json({
            success: false,
            message: 'Failed to authenticate with Google',
            // Include error details in development
            ...(process.env.NODE_ENV === 'development' && {
                error: error?.message,
                details: error?.toString()
            })
        });
    }
};
exports.googleSignIn = googleSignIn;
/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
    try {
        // The auth middleware should attach the user to the request
        // For now, we'll extract the user ID from the token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Find user
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profileCompleted: user.profileCompleted,
                examCompleted: user.examCompleted,
                class: user.class,
                board: user.board,
                state: user.state,
                category: user.category,
                interests: user.interests,
                testScores: user.testScores,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting current user:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.getCurrentUser = getCurrentUser;
/**
 * Logout user
 */
const logout = (req, res) => {
    // In a stateless JWT auth system, the client simply discards the token
    // For added security, you could implement a token blacklist using Redis
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};
exports.logout = logout;
/**
 * Get client configuration (safe to expose)
 */
const getClientConfig = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                googleClientId: process.env.GOOGLE_CLIENT_ID,
                apiUrl: process.env.NODE_ENV === 'production'
                    ? `${req.protocol}://${req.get('host')}/api`
                    : 'http://localhost:8080/api'
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting client config:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get client configuration',
        });
    }
};
exports.getClientConfig = getClientConfig;
