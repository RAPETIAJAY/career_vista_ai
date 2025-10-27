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
const userController = __importStar(require("../controllers/user.controller"));
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.auth);
// Update user profile
router.put('/profile', [
    (0, express_validator_1.body)('name')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isString()
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    (0, express_validator_1.body)('class')
        .optional()
        .isInt({ min: 9, max: 12 })
        .withMessage('Class must be between 9 and 12'),
    (0, express_validator_1.body)('board')
        .optional()
        .isString()
        .isIn(['CBSE', 'ICSE', 'State Board', 'Other'])
        .withMessage('Board must be one of: CBSE, ICSE, State Board, Other'),
    (0, express_validator_1.body)('state')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('State must be between 2 and 50 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .isString()
        .isIn(['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'])
        .withMessage('Category must be one of: General, OBC, SC, ST, EWS, Other'),
    (0, express_validator_1.body)('interests')
        .optional()
        .isArray()
        .withMessage('Interests must be an array'),
    (0, express_validator_1.body)('interests.*')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Each interest must be between 2 and 50 characters'),
], validate_1.validateRequest, userController.updateProfile);
// Get user test scores
router.get('/test-scores', userController.getTestScores);
// Save academic test and preferences/stream selection
router.post('/save-profile-data', userController.saveTestAndPreferences);
// Consolidated profile summary for dashboard
router.get('/profile-summary', userController.getProfileSummary);
// Get user recommended streams
router.get('/recommended-streams', userController.getRecommendedStreams);
exports.default = router;
