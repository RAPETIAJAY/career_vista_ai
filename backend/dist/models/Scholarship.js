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
const ScholarshipSchema = new mongoose_1.Schema({
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
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    type: {
        type: String,
        required: true,
        enum: ['Merit', 'Need-based', 'Category', 'State', 'Central', 'Private'],
    },
    sector: {
        type: String,
        enum: ['Government', 'Corporate', 'Private'],
    },
    eligibility: {
        minPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        categories: [{
                type: String,
                required: true,
            }],
        incomeLimit: {
            type: Number,
            min: 0,
        },
        states: [String],
        courses: [{
                type: String,
                required: true,
            }],
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        pwd: {
            type: Boolean,
            default: false,
        },
    },
    applicationDeadline: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
        trim: true,
    },
    documentsRequired: [{
            type: String,
            required: true,
        }],
    renewalCriteria: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
// Create indexes for efficient querying
ScholarshipSchema.index({ type: 1 });
ScholarshipSchema.index({ sector: 1 });
ScholarshipSchema.index({ 'eligibility.categories': 1 });
ScholarshipSchema.index({ 'eligibility.states': 1 });
ScholarshipSchema.index({ 'eligibility.courses': 1 });
ScholarshipSchema.index({ amount: 1 });
ScholarshipSchema.index({ applicationDeadline: 1 });
ScholarshipSchema.index({ name: 'text', description: 'text', provider: 'text' });
exports.default = mongoose_1.default.model('Scholarship', ScholarshipSchema);
