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
const collegeController = __importStar(require("../controllers/college.controller"));
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all colleges with filtering
router.get('/', auth_1.auth, collegeController.getColleges);
// Get college by ID
router.get('/:id', auth_1.auth, collegeController.getCollegeById);
// Get colleges by stream
router.get('/stream/:stream', auth_1.auth, collegeController.getCollegesByStream);
// Get colleges by location
router.get('/location/:state', auth_1.auth, collegeController.getCollegesByLocation);
// Compare colleges
router.post('/compare', auth_1.auth, [
    (0, express_validator_1.body)('collegeIds')
        .isArray({ min: 2, max: 5 })
        .withMessage('You must provide between 2 and 5 college IDs'),
], validate_1.validateRequest, collegeController.compareColleges);
// College predictor (JEE/NEET/EAMCET)
router.post('/predict', auth_1.auth, [
    (0, express_validator_1.body)('exam')
        .isIn(['JEE', 'NEET', 'EAMCET'])
        .withMessage('exam must be JEE, NEET, or EAMCET'),
    (0, express_validator_1.body)('score')
        .isFloat()
        .withMessage('score must be a number (percentile for JEE, marks for NEET, rank for EAMCET)'),
    (0, express_validator_1.body)('category')
        .optional()
        .isIn(['General', 'OBC', 'SC', 'ST', 'EWS'])
        .withMessage('invalid category'),
    (0, express_validator_1.body)('homeState')
        .optional()
        .isString(),
], validate_1.validateRequest, collegeController.predictColleges);
// Admin routes (would require admin middleware in a real app)
// Add college
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('College name is required'),
    (0, express_validator_1.body)('location.state').notEmpty().withMessage('State is required'),
    (0, express_validator_1.body)('location.city').notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)('type').isIn(['Government', 'Private', 'Deemed']).withMessage('Invalid college type'),
    (0, express_validator_1.body)('streams').isArray({ min: 1 }).withMessage('At least one stream is required'),
], validate_1.validateRequest, collegeController.addCollege);
// Update college
router.put('/:id', auth_1.auth, collegeController.updateCollege);
// Delete college
router.delete('/:id', auth_1.auth, collegeController.deleteCollege);
exports.default = router;
