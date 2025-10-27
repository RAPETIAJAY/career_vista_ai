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
const scholarshipController = __importStar(require("../controllers/scholarship.controller"));
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all scholarships with comprehensive filtering
router.get('/', [
    (0, express_validator_1.query)('search').optional().isString().withMessage('Search must be a string'),
    (0, express_validator_1.query)('type').optional().isIn(['All', 'Merit', 'Need-based', 'Category', 'State', 'Central', 'Private']).withMessage('Invalid scholarship type'),
    (0, express_validator_1.query)('sector').optional().isIn(['All', 'Government', 'Corporate', 'Private']).withMessage('Invalid sector'),
    (0, express_validator_1.query)('minAmount').optional().isNumeric().withMessage('Minimum amount must be a number'),
    (0, express_validator_1.query)('maxAmount').optional().isNumeric().withMessage('Maximum amount must be a number'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('sort').optional().isIn(['amount', 'deadline', 'name', 'matchScore']).withMessage('Invalid sort field'),
    (0, express_validator_1.query)('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
    (0, express_validator_1.query)('userProfile').optional().isString().withMessage('User profile must be a JSON string'),
], validate_1.validateRequest, scholarshipController.getScholarships);
// Get scholarship statistics
router.get('/stats', [
    (0, express_validator_1.query)('userProfile').optional().isString().withMessage('User profile must be a JSON string'),
], validate_1.validateRequest, scholarshipController.getScholarshipStats);
// Get sector distribution
router.get('/sectors/distribution', scholarshipController.getSectorDistribution);
// Update all scholarship sectors
router.post('/sectors/update', [
    (0, express_validator_1.query)('force').optional().isBoolean().withMessage('Force must be a boolean'),
], scholarshipController.updateAllScholarshipSectors);
// Get scholarship by ID
router.get('/:id', [
    (0, express_validator_1.query)('userProfile').optional().isString().withMessage('User profile must be a JSON string'),
], validate_1.validateRequest, scholarshipController.getScholarshipById);
// Get scholarships by eligibility criteria (POST for complex user profile)
router.post('/eligible', [
    (0, express_validator_1.body)('userProfile').notEmpty().withMessage('User profile is required'),
    (0, express_validator_1.body)('userProfile.category').notEmpty().withMessage('User category is required'),
    (0, express_validator_1.body)('userProfile.percentage').isNumeric().withMessage('Percentage must be a number'),
    (0, express_validator_1.body)('userProfile.familyIncome').isNumeric().withMessage('Family income must be a number'),
    (0, express_validator_1.body)('userProfile.course').notEmpty().withMessage('Course is required'),
    (0, express_validator_1.body)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.body)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
], validate_1.validateRequest, scholarshipController.getEligibleScholarships);
// Admin routes (would require admin middleware in a real app)
// Add single scholarship
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Scholarship name is required'),
    (0, express_validator_1.body)('provider').notEmpty().withMessage('Provider is required'),
    (0, express_validator_1.body)('amount').isNumeric().withMessage('Amount must be a number'),
    (0, express_validator_1.body)('type').isIn(['Merit', 'Need-based', 'Category', 'State', 'Central', 'Private']).withMessage('Invalid scholarship type'),
    (0, express_validator_1.body)('eligibility').notEmpty().withMessage('Eligibility criteria is required'),
    (0, express_validator_1.body)('eligibility.minPercentage').isNumeric().withMessage('Minimum percentage must be a number'),
    (0, express_validator_1.body)('eligibility.categories').isArray().withMessage('Categories must be an array'),
    (0, express_validator_1.body)('eligibility.courses').isArray().withMessage('Courses must be an array'),
    (0, express_validator_1.body)('applicationDeadline').notEmpty().withMessage('Application deadline is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('website').isURL().withMessage('Website must be a valid URL'),
    (0, express_validator_1.body)('documentsRequired').isArray().withMessage('Documents required must be an array'),
], validate_1.validateRequest, scholarshipController.addScholarship);
// Bulk add scholarships
router.post('/bulk', auth_1.auth, [
    (0, express_validator_1.body)('scholarships').isArray().withMessage('Scholarships must be an array'),
    (0, express_validator_1.body)('scholarships.*.name').notEmpty().withMessage('Each scholarship must have a name'),
    (0, express_validator_1.body)('scholarships.*.provider').notEmpty().withMessage('Each scholarship must have a provider'),
    (0, express_validator_1.body)('scholarships.*.amount').isNumeric().withMessage('Each scholarship amount must be a number'),
    (0, express_validator_1.body)('scholarships.*.type').isIn(['Merit', 'Need-based', 'Category', 'State', 'Central', 'Private']).withMessage('Invalid scholarship type'),
], validate_1.validateRequest, scholarshipController.bulkAddScholarships);
// Update scholarship
router.put('/:id', auth_1.auth, [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Scholarship name cannot be empty'),
    (0, express_validator_1.body)('provider').optional().notEmpty().withMessage('Provider cannot be empty'),
    (0, express_validator_1.body)('amount').optional().isNumeric().withMessage('Amount must be a number'),
    (0, express_validator_1.body)('type').optional().isIn(['Merit', 'Need-based', 'Category', 'State', 'Central', 'Private']).withMessage('Invalid scholarship type'),
    (0, express_validator_1.body)('website').optional().isURL().withMessage('Website must be a valid URL'),
], validate_1.validateRequest, scholarshipController.updateScholarship);
// Delete scholarship
router.delete('/:id', auth_1.auth, scholarshipController.deleteScholarship);
exports.default = router;
