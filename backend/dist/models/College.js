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
const BranchSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    closing_rank_min: {
        type: Number,
        required: true,
    },
    closing_rank_max: {
        type: Number,
        required: true,
    },
});
const CollegeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['government', 'private', 'deemed'],
    },
    collegeType: {
        type: String,
        required: true,
        enum: ['IIT', 'NIT', 'IIIT', 'Medical', 'Law', 'Management', 'Arts', 'Other'],
    },
    stream: {
        type: String,
        required: true,
        enum: ['MPC', 'BiPC', 'MEC', 'CEC', 'HEC'],
    },
    exam_accepted: {
        type: String,
        required: true,
    },
    branches: [BranchSchema],
    courses: [String],
    closing_rank: String,
    closing_percentile: String,
    average_placement_lpa: Number,
    tuition_fees_total_lakhs: Number,
    fees_per_year: String,
    internship_stipend: String,
    pg_residency: String,
    // Legacy fields for backward compatibility
    accreditation: {
        type: String,
        trim: true,
    },
    ranking: {
        type: Number,
    },
    streams: [{
            type: String,
            enum: ['Science', 'Commerce', 'Arts', 'Engineering', 'Medical', 'Law', 'Management'],
        }],
    cutoffs: {
        type: Map,
        of: Number,
    },
    fees: {
        tuition: Number,
        hostel: Number,
        other: Number,
    },
    facilities: [{
            type: String,
        }],
    website: {
        type: String,
        trim: true,
    },
    contactInfo: {
        email: String,
        phone: String,
        address: String,
    },
    admissionProcess: {
        type: String,
    },
    scholarships: [{
            type: String,
        }],
    placements: {
        averageCTC: Number,
        topCTC: Number,
        recruiters: [String],
        placementPercentage: Number,
    },
}, { timestamps: true });
// Create indexes for common queries
CollegeSchema.index({ name: 'text', location: 'text' });
CollegeSchema.index({ state: 1 });
CollegeSchema.index({ stream: 1 });
CollegeSchema.index({ exam_accepted: 1 });
CollegeSchema.index({ collegeType: 1 });
CollegeSchema.index({ 'branches.closing_rank_min': 1 });
CollegeSchema.index({ 'branches.closing_rank_max': 1 });
exports.default = mongoose_1.default.model('College', CollegeSchema);
