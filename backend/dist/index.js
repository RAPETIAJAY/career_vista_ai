"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./utils/logger");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const recommender_routes_1 = __importDefault(require("./routes/recommender.routes"));
const college_routes_1 = __importDefault(require("./routes/college.routes"));
const scholarship_routes_1 = __importDefault(require("./routes/scholarship.routes"));
const loan_routes_1 = __importDefault(require("./routes/loan.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const adaptiveTest_routes_1 = __importDefault(require("./routes/adaptiveTest.routes"));
const collegePredictor_routes_1 = __importDefault(require("./routes/collegePredictor.routes"));
const financialAid_routes_1 = __importDefault(require("./routes/financialAid.routes"));
const careerInsights_routes_1 = __importDefault(require("./routes/careerInsights.routes"));
const chatbot_routes_1 = __importDefault(require("./routes/chatbot.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
// CORS configuration for production
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'https://career-vista.github.io',
        'https://career-vista-ai-12.vercel.app', // Your Vercel frontend
        /^https:\/\/.*\.railway\.app$/, // Railway domains
        /^https:\/\/.*\.vercel\.app$/ // All Vercel preview deployments
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Add request logging middleware
app.use((req, res, next) => {
    logger_1.logger.info(`📥 ${req.method} ${req.path}`, {
        body: req.body,
        query: req.query,
        ip: req.ip
    });
    next();
});
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    logger_1.logger.error('MONGODB_URI is not set in environment variables.');
    process.exit(1);
}
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    logger_1.logger.info('Connected to MongoDB');
})
    .catch((error) => {
    logger_1.logger.error('MongoDB connection error:', error);
    process.exit(1);
});
// Routes
logger_1.logger.info('🛣️ Registering auth routes...');
app.use('/api/auth', auth_routes_1.default);
logger_1.logger.info('🛣️ Auth routes registered successfully');
app.use('/api/users', user_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
app.use('/api/tests', test_routes_1.default);
app.use('/api/adaptive-test', adaptiveTest_routes_1.default);
app.use('/api/recommender', recommender_routes_1.default);
app.use('/api/college-predictor', collegePredictor_routes_1.default);
app.use('/api/colleges', college_routes_1.default);
app.use('/api/scholarships', scholarship_routes_1.default);
app.use('/api/loans', loan_routes_1.default);
app.use('/api/financial-aid', financialAid_routes_1.default);
app.use('/api/career-insights', careerInsights_routes_1.default);
app.use('/api/chatbot', chatbot_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Error handler
app.use((err, req, res, next) => {
    logger_1.logger.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message }),
    });
});
// Start server (only in non-serverless environments)
const PORT = process.env.PORT || 8080;
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        logger_1.logger.info(`Server running on port ${PORT}`);
    });
}
exports.default = app;
