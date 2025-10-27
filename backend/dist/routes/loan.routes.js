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
const loanController = __importStar(require("../controllers/loan.controller"));
const validate_1 = require("../middleware/validate");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all loans with filtering
router.get('/', auth_1.auth, loanController.getLoans);
// Get loan by ID
router.get('/:id', auth_1.auth, loanController.getLoanById);
// Get loans by eligibility criteria
router.post('/eligible', auth_1.auth, [
    (0, express_validator_1.body)('stream').optional(),
    (0, express_validator_1.body)('amount').optional().isNumeric().withMessage('Amount must be a number'),
    (0, express_validator_1.body)('collateral').optional().isBoolean().withMessage('Collateral must be a boolean'),
], validate_1.validateRequest, loanController.getEligibleLoans);
// Compare loans
router.post('/compare', auth_1.auth, [
    (0, express_validator_1.body)('loanIds')
        .isArray({ min: 2, max: 5 })
        .withMessage('You must provide between 2 and 5 loan IDs'),
], validate_1.validateRequest, loanController.compareLoans);
// Calculate EMI
router.post('/calculate-emi', auth_1.auth, [
    (0, express_validator_1.body)('principal').isNumeric().withMessage('Principal amount is required'),
    (0, express_validator_1.body)('interestRate').isNumeric().withMessage('Interest rate is required'),
    (0, express_validator_1.body)('tenureYears').isNumeric().withMessage('Tenure in years is required'),
], validate_1.validateRequest, loanController.calculateEMI);
// Admin routes (would require admin middleware in a real app)
// Add loan
router.post('/', auth_1.auth, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Loan name is required'),
    (0, express_validator_1.body)('provider').notEmpty().withMessage('Provider is required'),
    (0, express_validator_1.body)('interestRate').isNumeric().withMessage('Interest rate must be a number'),
    (0, express_validator_1.body)('maxAmount').isNumeric().withMessage('Maximum amount must be a number'),
], validate_1.validateRequest, loanController.addLoan);
// Update loan
router.put('/:id', auth_1.auth, loanController.updateLoan);
// Delete loan
router.delete('/:id', auth_1.auth, loanController.deleteLoan);
exports.default = router;
