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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const LoanSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    provider: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['education', 'career', 'skill-development', 'other'],
    },
    description: {
        type: String,
        required: true,
    },
    eligibility: {
        minAge: Number,
        maxAge: Number,
        nationality: [String],
        academicRequirements: String,
        collateral: Boolean,
        cosigner: Boolean,
        other: String,
    },
    amount: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },
    },
    interestRate: {
        type: {
            type: String,
            required: true,
            enum: ['fixed', 'floating'],
        },
        rate: {
            type: Number,
            required: true,
        },
        details: String,
    },
    tenure: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
            enum: ['months', 'years'],
        },
    },
    processingFee: {
        amount: Number,
        percentage: Number,
    },
    repayment: {
        moratorium: String,
        emi: String,
        prepaymentPenalty: String,
    },
    documents: [{
            type: String,
            required: true,
        }],
    applicationProcess: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
        trim: true,
    },
    contactInfo: {
        email: String,
        phone: String,
    },
}, { timestamps: true });
// Create indexes for common queries
LoanSchema.index({ type: 1 });
LoanSchema.index({ provider: 1 });
LoanSchema.index({ 'amount.min': 1, 'amount.max': 1 });
exports.default = mongoose_1.default.model('Loan', LoanSchema);
