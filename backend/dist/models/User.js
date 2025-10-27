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
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        select: false, // Don't return password by default in queries
    },
    name: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
    examCompleted: {
        type: Boolean,
        default: false,
    },
    examDate: {
        type: Date,
    },
    class: {
        type: Number,
        enum: [9, 10, 11, 12],
    },
    board: {
        type: String,
        enum: ['CBSE', 'ICSE', 'State Board', 'Other'],
    },
    state: {
        type: String,
    },
    category: {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },
    income: {
        type: Number,
        min: 0,
    },
    interests: [{
            type: String,
        }],
    // Academic Records removed - not in actual MongoDB record
    entranceScores: [{
            examName: {
                type: String,
                enum: ['JEE Main', 'JEE Advanced', 'NEET', 'EAMCET', 'CLAT', 'CUET', 'Other'],
            },
            score: Number,
            rank: Number,
            percentile: Number,
            year: Number,
        }],
    testScores: {
        fundamentals: {
            total: Number,
            subjects: {
                math: Number,
                physics: Number,
                chemistry: Number,
                biology: Number,
                socialScience: Number,
            },
            weaknesses: [String],
            strengths: [String],
            date: Date,
            timeTaken: Number,
        },
        adaptiveTest: {
            questions: [String],
            answers: [String],
            score: Number,
            difficulty: {
                type: String,
                enum: ['Easy', 'Medium', 'Hard'],
            },
            date: Date,
        },
    },
    testSession: {
        currentQuestionIndex: Number,
        answers: [mongoose_1.Schema.Types.Mixed],
        timeRemaining: Number,
        violationCount: { type: Number, default: 0 },
        lastSaved: Date,
        canResume: { type: Boolean, default: true },
        resumeAvailableAt: Date,
    },
    lastCollegePredictionSummary: {
        ambitiousCount: { type: Number, default: 0 },
        moderateCount: { type: Number, default: 0 },
        safeCount: { type: Number, default: 0 },
        examTypes: { type: [String], default: [] },
    },
    collegePreferences: {
        preferredColleges: [String],
        budgetRange: {
            min: Number,
            max: Number,
        },
        locationPreference: [String],
        coursePreferences: [String],
    },
    selectedStream: {
        type: String,
        enum: ['MPC', 'BiPC', 'MEC', 'CEC', 'HEC'],
    },
    // fundamentalsTest10 removed - redundant with testScores.fundamentals
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', UserSchema);
