"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllScholarshipSectors = exports.getSectorDistribution = exports.getScholarshipStats = exports.deleteScholarship = exports.updateScholarship = exports.bulkAddScholarships = exports.addScholarship = exports.getEligibleScholarships = exports.getScholarshipById = exports.getScholarships = void 0;
const Scholarship_1 = __importDefault(require("../models/Scholarship"));
const logger_1 = require("../utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Get all scholarships with comprehensive filtering and user profile matching
 */
const getScholarships = async (req, res) => {
    try {
        const { 
        // Filter parameters
        search, type, sector, minAmount, maxAmount, 
        // User profile for eligibility calculation
        userProfile, 
        // Pagination
        limit = 50, page = 1, sort = 'amount', sortOrder = 'desc', } = req.query;
        // Build query
        const query = {};
        // Search filter (name, description, provider) - using regex for better partial matching
        if (search && typeof search === 'string') {
            const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
            query.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { provider: searchRegex }
            ];
        }
        // Type filter
        if (type && type !== 'All') {
            query.type = type;
        }
        // Sector filter - handle undefined/null sectors by treating them as 'Private'
        if (sector && sector !== 'All') {
            if (sector === 'Private') {
                // Include scholarships with sector='Private' OR undefined/null sector
                const sectorConditions = [
                    { sector: 'Private' },
                    { sector: { $exists: false } },
                    { sector: null }
                ];
                if (query.$or) {
                    // If there's already an $or condition (like search), combine them with $and
                    query.$and = [
                        { $or: query.$or },
                        { $or: sectorConditions }
                    ];
                    delete query.$or;
                }
                else {
                    query.$or = sectorConditions;
                }
            }
            else {
                query.sector = sector;
            }
        }
        // Amount range filter
        if (minAmount || maxAmount) {
            query.amount = {};
            if (minAmount)
                query.amount.$gte = Number(minAmount);
            if (maxAmount)
                query.amount.$lte = Number(maxAmount);
        }
        // Get total count for pagination
        const total = await Scholarship_1.default.countDocuments(query);
        // Build sort object
        const sortObj = {};
        if (sort === 'amount') {
            sortObj.amount = sortOrder === 'asc' ? 1 : -1;
        }
        else if (sort === 'deadline') {
            sortObj.applicationDeadline = sortOrder === 'asc' ? 1 : -1;
        }
        else if (sort === 'name') {
            sortObj.name = sortOrder === 'asc' ? 1 : -1;
        }
        else {
            sortObj.amount = -1; // Default sort by amount descending
        }
        // Execute query with pagination and sorting
        let scholarships = await Scholarship_1.default.find(query)
            .sort(sortObj)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .lean();
        // Calculate eligibility and match scores if user profile is provided
        if (userProfile && typeof userProfile === 'string') {
            try {
                const profile = JSON.parse(userProfile);
                scholarships = scholarships.map((scholarship) => {
                    const eligibilityResult = calculateEligibility(scholarship, profile);
                    return {
                        ...scholarship,
                        matchScore: eligibilityResult.matchScore,
                        eligibilityStatus: eligibilityResult.eligibilityStatus,
                    };
                });
                // Re-sort by match score if user profile is provided
                scholarships.sort((a, b) => {
                    const scoreDiff = (b.matchScore || 0) - (a.matchScore || 0);
                    if (scoreDiff !== 0)
                        return scoreDiff;
                    return b.amount - a.amount;
                });
            }
            catch (error) {
                logger_1.logger.warn('Failed to parse user profile:', error);
            }
        }
        // Calculate statistics
        const stats = {
            total,
            eligible: userProfile ? scholarships.filter((s) => s.eligibilityStatus === 'Eligible').length : 0,
            totalFunding: scholarships.reduce((sum, s) => sum + s.amount, 0),
            avgAmount: scholarships.length > 0 ? Math.round(scholarships.reduce((sum, s) => sum + s.amount, 0) / scholarships.length) : 0,
        };
        res.status(200).json({
            success: true,
            count: scholarships.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            stats,
            data: scholarships,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting scholarships:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get scholarships',
            error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
        });
    }
};
exports.getScholarships = getScholarships;
/**
 * Calculate eligibility and match score for a scholarship based on user profile
 */
function calculateEligibility(scholarship, userProfile) {
    let score = 0;
    let eligible = true;
    // Check percentage requirement (30 points)
    if (userProfile.percentage >= scholarship.eligibility.minPercentage) {
        score += 30;
    }
    else {
        eligible = false;
    }
    // Check category eligibility (25 points)
    if (scholarship.eligibility.categories.includes(userProfile.category) ||
        scholarship.eligibility.categories.includes('All') ||
        scholarship.eligibility.categories.includes('General')) {
        score += 25;
    }
    else {
        eligible = false;
    }
    // Check income limit (20 points)
    if (scholarship.eligibility.incomeLimit) {
        if (userProfile.familyIncome <= scholarship.eligibility.incomeLimit) {
            score += 20;
        }
        else {
            eligible = false;
        }
    }
    else {
        score += 20; // No income limit specified
    }
    // Check course eligibility (15 points)
    if (scholarship.eligibility.courses.includes(userProfile.course) ||
        scholarship.eligibility.courses.includes('All')) {
        score += 15;
    }
    else {
        eligible = false;
    }
    // Check gender requirement (5 points)
    if (scholarship.eligibility.gender) {
        if (userProfile.gender === scholarship.eligibility.gender) {
            score += 5;
        }
        else {
            eligible = false;
        }
    }
    else {
        score += 5; // No gender restriction
    }
    // Check PWD requirement (5 points)
    if (scholarship.eligibility.pwd !== undefined) {
        if (userProfile.pwd === scholarship.eligibility.pwd) {
            score += 5;
        }
        else {
            eligible = false;
        }
    }
    else {
        score += 5; // No PWD restriction
    }
    // Determine eligibility status
    let eligibilityStatus;
    if (eligible) {
        eligibilityStatus = 'Eligible';
    }
    else if (score >= 50) {
        eligibilityStatus = 'Partially Eligible';
    }
    else {
        eligibilityStatus = 'Not Eligible';
    }
    return { matchScore: score, eligibilityStatus };
}
/**
 * Get scholarship by ID
 */
const getScholarshipById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userProfile } = req.query;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid scholarship ID',
            });
        }
        let scholarship = await Scholarship_1.default.findById(id).lean();
        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found',
            });
        }
        // Calculate eligibility if user profile is provided
        if (userProfile && typeof userProfile === 'string') {
            try {
                const profile = JSON.parse(userProfile);
                const eligibilityResult = calculateEligibility(scholarship, profile);
                scholarship = {
                    ...scholarship,
                    matchScore: eligibilityResult.matchScore,
                    eligibilityStatus: eligibilityResult.eligibilityStatus,
                };
            }
            catch (error) {
                logger_1.logger.warn('Failed to parse user profile:', error);
            }
        }
        res.status(200).json({
            success: true,
            data: scholarship,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting scholarship by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get scholarship',
        });
    }
};
exports.getScholarshipById = getScholarshipById;
/**
 * Get scholarships by eligibility criteria - Simplified version that uses the main getScholarships with eligibilityOnly filter
 */
const getEligibleScholarships = async (req, res) => {
    try {
        const { userProfile, limit = 20, page = 1 } = req.body;
        if (!userProfile) {
            return res.status(400).json({
                success: false,
                message: 'User profile is required',
            });
        }
        // Use the main getScholarships function with user profile
        req.query = {
            ...req.query,
            userProfile: JSON.stringify(userProfile),
            limit: limit.toString(),
            page: page.toString(),
            sort: 'matchScore',
            sortOrder: 'desc',
        };
        return (0, exports.getScholarships)(req, res);
    }
    catch (error) {
        logger_1.logger.error('Error getting eligible scholarships:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get eligible scholarships',
        });
    }
};
exports.getEligibleScholarships = getEligibleScholarships;
/**
 * Add scholarship (admin only in a real app)
 */
const addScholarship = async (req, res) => {
    try {
        // In a real app, check if user is admin
        const scholarshipData = req.body;
        // Auto-detect sector based on provider if not provided
        if (!scholarshipData.sector) {
            scholarshipData.sector = detectSector(scholarshipData.provider, scholarshipData.type);
        }
        const newScholarship = new Scholarship_1.default(scholarshipData);
        await newScholarship.save();
        res.status(201).json({
            success: true,
            message: 'Scholarship added successfully',
            data: newScholarship,
        });
    }
    catch (error) {
        logger_1.logger.error('Error adding scholarship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add scholarship',
            error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
        });
    }
};
exports.addScholarship = addScholarship;
/**
 * Bulk add scholarships
 */
const bulkAddScholarships = async (req, res) => {
    try {
        const { scholarships } = req.body;
        if (!Array.isArray(scholarships) || scholarships.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Scholarships array is required',
            });
        }
        // Auto-detect sector for each scholarship if not provided
        const processedScholarships = scholarships.map((scholarship) => ({
            ...scholarship,
            sector: scholarship.sector || detectSector(scholarship.provider, scholarship.type),
        }));
        const result = await Scholarship_1.default.insertMany(processedScholarships, { ordered: false });
        res.status(201).json({
            success: true,
            message: `${result.length} scholarships added successfully`,
            count: result.length,
            data: result,
        });
    }
    catch (error) {
        logger_1.logger.error('Error bulk adding scholarships:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to bulk add scholarships',
            error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
        });
    }
};
exports.bulkAddScholarships = bulkAddScholarships;
/**
 * Auto-detect sector based on provider and type
 */
function detectSector(provider, type) {
    const providerLower = provider.toLowerCase();
    // Government indicators
    if (type === 'Central' ||
        type === 'State' ||
        providerLower.includes('government') ||
        providerLower.includes('ministry') ||
        providerLower.includes('department') ||
        providerLower.includes('ugc') ||
        providerLower.includes('aicte') ||
        providerLower.includes('csir') ||
        providerLower.includes('icmr') ||
        providerLower.includes('dst')) {
        return 'Government';
    }
    // Corporate indicators
    if (providerLower.includes('foundation') ||
        providerLower.includes('limited') ||
        providerLower.includes('ltd') ||
        providerLower.includes('corporation') ||
        providerLower.includes('company') ||
        providerLower.includes('reliance') ||
        providerLower.includes('tata') ||
        providerLower.includes('infosys') ||
        providerLower.includes('wipro')) {
        return 'Corporate';
    }
    // Default to Private (NGOs, trusts, universities, etc.)
    return 'Private';
}
/**
 * Update scholarship (admin only in a real app)
 */
const updateScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid scholarship ID',
            });
        }
        const scholarship = await Scholarship_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Scholarship updated successfully',
            data: scholarship,
        });
    }
    catch (error) {
        logger_1.logger.error('Error updating scholarship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update scholarship',
        });
    }
};
exports.updateScholarship = updateScholarship;
/**
 * Delete scholarship (admin only in a real app)
 */
const deleteScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid scholarship ID',
            });
        }
        const scholarship = await Scholarship_1.default.findByIdAndDelete(id);
        if (!scholarship) {
            return res.status(404).json({
                success: false,
                message: 'Scholarship not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Scholarship deleted successfully',
        });
    }
    catch (error) {
        logger_1.logger.error('Error deleting scholarship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete scholarship',
        });
    }
};
exports.deleteScholarship = deleteScholarship;
/**
 * Get scholarship statistics
 */
const getScholarshipStats = async (req, res) => {
    try {
        const { userProfile } = req.query;
        // Basic statistics
        const totalCount = await Scholarship_1.default.countDocuments();
        const totalFunding = await Scholarship_1.default.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        // Statistics by type
        const typeStats = await Scholarship_1.default.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
            { $sort: { count: -1 } }
        ]);
        // Statistics by sector
        const sectorStats = await Scholarship_1.default.aggregate([
            { $group: { _id: '$sector', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
            { $sort: { count: -1 } }
        ]);
        const stats = {
            total: totalCount,
            totalFunding: totalFunding[0]?.total || 0,
            averageAmount: totalCount > 0 ? Math.round((totalFunding[0]?.total || 0) / totalCount) : 0,
            byType: typeStats,
            bySector: sectorStats,
        };
        // If user profile is provided, calculate personalized stats
        if (userProfile && typeof userProfile === 'string') {
            try {
                const profile = JSON.parse(userProfile);
                const allScholarships = await Scholarship_1.default.find({}).lean();
                let eligibleCount = 0;
                let partiallyEligibleCount = 0;
                let eligibleFunding = 0;
                allScholarships.forEach((scholarship) => {
                    const eligibilityResult = calculateEligibility(scholarship, profile);
                    if (eligibilityResult.eligibilityStatus === 'Eligible') {
                        eligibleCount++;
                        eligibleFunding += scholarship.amount;
                    }
                    else if (eligibilityResult.eligibilityStatus === 'Partially Eligible') {
                        partiallyEligibleCount++;
                    }
                });
                stats.personalizedStats = {
                    eligible: eligibleCount,
                    partiallyEligible: partiallyEligibleCount,
                    eligibleFunding,
                    eligibilityRate: totalCount > 0 ? Math.round((eligibleCount / totalCount) * 100) : 0,
                };
            }
            catch (error) {
                logger_1.logger.warn('Failed to calculate personalized stats:', error);
            }
        }
        res.status(200).json({
            success: true,
            data: stats,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting scholarship statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get scholarship statistics',
        });
    }
};
exports.getScholarshipStats = getScholarshipStats;
/**
 * Get sector-wise scholarship distribution
 */
const getSectorDistribution = async (req, res) => {
    try {
        const distribution = await Scholarship_1.default.aggregate([
            {
                $group: {
                    _id: '$sector',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    avgAmount: { $avg: '$amount' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        // Also count scholarships without sector
        const withoutSector = await Scholarship_1.default.countDocuments({
            $or: [
                { sector: { $exists: false } },
                { sector: null },
                { sector: '' }
            ]
        });
        res.status(200).json({
            success: true,
            data: {
                distribution,
                withoutSector,
                total: await Scholarship_1.default.countDocuments()
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting sector distribution:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get sector distribution',
        });
    }
};
exports.getSectorDistribution = getSectorDistribution;
/**
 * Update all scholarships with proper sector assignment
 */
const updateAllScholarshipSectors = async (req, res) => {
    try {
        const scholarships = await Scholarship_1.default.find({});
        let updated = 0;
        for (const scholarship of scholarships) {
            const detectedSector = detectSector(scholarship.provider, scholarship.type);
            // Update if sector is missing or if it's a force update
            if (!scholarship.sector || req.query.force === 'true') {
                await Scholarship_1.default.findByIdAndUpdate(scholarship._id, { sector: detectedSector });
                updated++;
            }
        }
        res.status(200).json({
            success: true,
            message: `Updated ${updated} scholarships with sector assignments`,
            data: { updated, total: scholarships.length }
        });
    }
    catch (error) {
        logger_1.logger.error('Error updating scholarship sectors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update scholarship sectors',
        });
    }
};
exports.updateAllScholarshipSectors = updateAllScholarshipSectors;
