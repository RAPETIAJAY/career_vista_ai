"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollege = exports.updateCollege = exports.addCollege = exports.compareColleges = exports.getCollegesByLocation = exports.getCollegesByStream = exports.getCollegeById = exports.getColleges = exports.predictColleges = void 0;
const College_1 = __importDefault(require("../models/College"));
const logger_1 = require("../utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
// 2025 baseline cutoffs for general category, used if college lacks specific entries
const BASELINES = {
    JEE_percentile: 93, // ~93%ile general
    NEET_marks: 600, // 590-610
    EAMCET_rank: 5000, // ~5K for JNTU Hyderabad
};
function computeFit(exam, score, cutoff, category, isHomeState) {
    // Lower-is-better for ranks
    if (exam === 'EAMCET') {
        const ratio = cutoff / Math.max(score, 1);
        let fit = Math.min(100, Math.max(0, 100 * Math.pow(ratio, 0.5)));
        if (category && category !== 'General')
            fit += 5;
        if (isHomeState)
            fit += 7;
        return Math.max(0, Math.min(100, fit));
    }
    // Higher-is-better for percentile/marks
    const ratio = score / Math.max(cutoff, 1);
    let fit = Math.min(100, Math.max(0, 60 * ratio + 40 * Math.tanh(ratio - 1)));
    if (category && category !== 'General')
        fit += 5;
    if (isHomeState)
        fit += 7;
    return Math.max(0, Math.min(100, fit));
}
function readCutoff(college, exam) {
    const map = {
        JEE: 'JEE_percentile',
        NEET: 'NEET_marks',
        EAMCET: 'EAMCET_rank',
    };
    const key = map[exam];
    const value = (college.cutoffs && college.cutoffs.get?.(key)) || (college.cutoffs?.[key]);
    if (typeof value === 'number')
        return value;
    return null;
}
const predictColleges = async (req, res) => {
    try {
        const { exam, score, category, homeState } = req.body;
        // fetch candidate colleges for exam
        let streamFilter = {};
        if (exam === 'JEE' || exam === 'EAMCET')
            streamFilter = { streams: 'Engineering' };
        if (exam === 'NEET')
            streamFilter = { streams: 'Medical' };
        const colleges = await College_1.default.find(streamFilter).limit(1000);
        const scored = colleges.map((c) => {
            const co = readCutoff(c, exam) ?? BASELINES[exam === 'JEE' ? 'JEE_percentile' : exam === 'NEET' ? 'NEET_marks' : 'EAMCET_rank'];
            const isHome = homeState && c.state && String(c.state).toLowerCase() === String(homeState).toLowerCase();
            const fit = computeFit(exam, score, co, category, !!isHome);
            return { college: c, fit };
        });
        // rank and slice buckets
        const sorted = scored.sort((a, b) => b.fit - a.fit);
        const ambitious = sorted.slice(0, 10);
        const moderate = sorted.slice(10, 25);
        const safe = sorted.slice(25, 45);
        const toDto = (x) => x.map(({ college, fit }) => ({
            id: college._id,
            name: college.name,
            state: college.state,
            city: college.city,
            type: college.type,
            fees: college.fees,
            placements: college.placements,
            accreditation: college.accreditation,
            website: college.website,
            fit: Math.round(fit),
        }));
        res.status(200).json({
            success: true,
            data: {
                exam,
                inputScore: score,
                category: category || 'General',
                homeState: homeState || null,
                ambitious: toDto(ambitious),
                moderate: toDto(moderate),
                safe: toDto(safe),
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error predicting colleges:', error);
        res.status(500).json({ success: false, message: 'Failed to predict colleges' });
    }
};
exports.predictColleges = predictColleges;
/**
 * Get all colleges with filtering
 */
const getColleges = async (req, res) => {
    try {
        const { stream, state, city, type, fees, limit = 20, page = 1, sort = 'name', } = req.query;
        // Build query
        const query = {};
        if (stream)
            query.streams = stream;
        if (state)
            query['location.state'] = state;
        if (city)
            query['location.city'] = city;
        if (type)
            query.type = type;
        if (fees) {
            const [min, max] = fees.split('-');
            query['fees.annual'] = { $gte: parseInt(min), $lte: parseInt(max) };
        }
        // Count total documents for pagination
        const total = await College_1.default.countDocuments(query);
        // Execute query with pagination and sorting
        const colleges = await College_1.default.find(query)
            .sort({ [sort]: sort === 'fees.annual' ? 1 : 1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        res.status(200).json({
            success: true,
            count: colleges.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: colleges,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting colleges:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get colleges',
        });
    }
};
exports.getColleges = getColleges;
/**
 * Get college by ID
 */
const getCollegeById = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid college ID',
            });
        }
        const college = await College_1.default.findById(id);
        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'College not found',
            });
        }
        res.status(200).json({
            success: true,
            data: college,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting college by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get college',
        });
    }
};
exports.getCollegeById = getCollegeById;
/**
 * Get colleges by stream
 */
const getCollegesByStream = async (req, res) => {
    try {
        const { stream } = req.params;
        const { limit = 20, page = 1 } = req.query;
        // Validate stream
        if (![
            'Science',
            'Commerce',
            'Arts',
            'Engineering',
            'Medical',
            'Law',
            'Management',
        ].includes(stream)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stream',
            });
        }
        // Count total documents for pagination
        const total = await College_1.default.countDocuments({ streams: stream });
        // Execute query with pagination
        const colleges = await College_1.default.find({ streams: stream })
            .sort({ name: 1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        res.status(200).json({
            success: true,
            count: colleges.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: colleges,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting colleges by stream:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get colleges',
        });
    }
};
exports.getCollegesByStream = getCollegesByStream;
/**
 * Get colleges by location
 */
const getCollegesByLocation = async (req, res) => {
    try {
        const { state } = req.params;
        const { city, limit = 20, page = 1 } = req.query;
        // Build query
        const query = { 'location.state': state };
        if (city)
            query['location.city'] = city;
        // Count total documents for pagination
        const total = await College_1.default.countDocuments(query);
        // Execute query with pagination
        const colleges = await College_1.default.find(query)
            .sort({ name: 1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        res.status(200).json({
            success: true,
            count: colleges.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: colleges,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting colleges by location:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get colleges',
        });
    }
};
exports.getCollegesByLocation = getCollegesByLocation;
/**
 * Compare colleges
 */
const compareColleges = async (req, res) => {
    try {
        const { collegeIds } = req.body;
        // Validate ObjectIds
        for (const id of collegeIds) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid college ID: ${id}`,
                });
            }
        }
        // Get colleges
        const colleges = await College_1.default.find({ _id: { $in: collegeIds } });
        // Check if all colleges were found
        if (colleges.length !== collegeIds.length) {
            return res.status(404).json({
                success: false,
                message: 'One or more colleges not found',
            });
        }
        // Prepare comparison data
        const comparisonData = colleges.map(college => ({
            id: college._id,
            name: college.name,
            location: college.location,
            type: college.type,
            streams: college.streams,
            courses: college.courses,
            fees: college.fees,
            facilities: college.facilities,
            placements: college.placements,
            website: college.website,
        }));
        res.status(200).json({
            success: true,
            data: comparisonData,
        });
    }
    catch (error) {
        logger_1.logger.error('Error comparing colleges:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to compare colleges',
        });
    }
};
exports.compareColleges = compareColleges;
/**
 * Add college (admin only in a real app)
 */
const addCollege = async (req, res) => {
    try {
        // In a real app, check if admin
        const newCollege = new College_1.default(req.body);
        await newCollege.save();
        res.status(201).json({
            success: true,
            data: newCollege,
        });
    }
    catch (error) {
        logger_1.logger.error('Error adding college:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add college',
        });
    }
};
exports.addCollege = addCollege;
/**
 * Update college (admin only in a real app)
 */
const updateCollege = async (req, res) => {
    try {
        // In a real app, check if admin
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid college ID',
            });
        }
        const college = await College_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'College not found',
            });
        }
        res.status(200).json({
            success: true,
            data: college,
        });
    }
    catch (error) {
        logger_1.logger.error('Error updating college:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update college',
        });
    }
};
exports.updateCollege = updateCollege;
/**
 * Delete college (admin only in a real app)
 */
const deleteCollege = async (req, res) => {
    try {
        // In a real app, check if admin
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid college ID',
            });
        }
        const college = await College_1.default.findByIdAndDelete(id);
        if (!college) {
            return res.status(404).json({
                success: false,
                message: 'College not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'College deleted successfully',
        });
    }
    catch (error) {
        logger_1.logger.error('Error deleting college:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete college',
        });
    }
};
exports.deleteCollege = deleteCollege;
