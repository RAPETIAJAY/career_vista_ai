"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileStatus = exports.syncOfflineData = exports.getInterestSuggestions = exports.updateProfile = exports.completeProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const ai_1 = require("../utils/ai");
/**
 * Complete user profile setup with enhanced data collection
 */
const completeProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, class: userClass, board, state, category, gender, income, class10Marks, class12Details, entranceScores, interests, } = req.body;
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Note: AI interest generation removed as field no longer exists
        // Update user profile
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, {
            $set: {
                name,
                phone,
                class: userClass,
                board,
                state,
                category,
                gender,
                income,
                interests: interests || [],
                class10Marks,
                class12Details,
                entranceScores: entranceScores || [],
                profileCompleted: true,
            },
        }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            message: 'Profile completed successfully',
            user: {
                id: updatedUser?._id,
                email: updatedUser?.email,
                name: updatedUser?.name,
                profileCompleted: updatedUser?.profileCompleted,
                class: updatedUser?.class,
                board: updatedUser?.board,
                state: updatedUser?.state,
                category: updatedUser?.category,
                gender: updatedUser?.gender,
                interests: updatedUser?.interests,
                // class10Marks and class12Details removed from model
                entranceScores: updatedUser?.entranceScores,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('Error completing profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete profile',
        });
    }
};
exports.completeProfile = completeProfile;
/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const updateData = req.body;
        // Remove sensitive fields that shouldn't be updated via this endpoint
        delete updateData.email;
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        logger_1.logger.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
        });
    }
};
exports.updateProfile = updateProfile;
/**
 * Get AI-generated interest suggestions
 */
const getInterestSuggestions = async (req, res) => {
    try {
        const { responses } = req.body;
        if (!responses || !Array.isArray(responses)) {
            return res.status(400).json({
                success: false,
                message: 'Responses array is required',
            });
        }
        // Generate interest suggestions based on user responses
        const suggestions = await (0, ai_1.generateAIInterests)({
            responses,
            quick: true,
        });
        res.status(200).json({
            success: true,
            suggestions,
        });
    }
    catch (error) {
        logger_1.logger.error('Error generating interest suggestions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate interest suggestions',
        });
    }
};
exports.getInterestSuggestions = getInterestSuggestions;
/**
 * Sync offline data
 */
const syncOfflineData = async (req, res) => {
    try {
        const userId = req.userId;
        const { offlineData, lastModified } = req.body;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Check if server data is newer
        const serverLastModified = user.updatedAt;
        const clientLastModified = new Date(lastModified);
        let syncResult = 'no_conflict';
        let finalData = offlineData;
        if (serverLastModified > clientLastModified) {
            // Server has newer data, return server data for client to merge
            syncResult = 'server_newer';
            finalData = user.toObject();
        }
        else {
            // Client data is newer or same, update server
            await User_1.default.findByIdAndUpdate(userId, {
                $set: {
                    ...offlineData,
                },
            }, { runValidators: true });
            syncResult = 'client_updated';
        }
        res.status(200).json({
            success: true,
            syncResult,
            data: finalData,
            serverTimestamp: new Date(),
        });
    }
    catch (error) {
        logger_1.logger.error('Error syncing offline data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync offline data',
        });
    }
};
exports.syncOfflineData = syncOfflineData;
/**
 * Get profile completion status
 */
const getProfileStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Calculate completion percentage
        const requiredFields = [
            'name',
            'class',
            'board',
            'state',
            'category',
            'gender',
        ];
        const optionalFields = [
            'phone',
            'income',
            'interests',
            'class10Marks',
            'class12Details',
        ];
        let completedRequired = 0;
        let completedOptional = 0;
        requiredFields.forEach(field => {
            if (user[field]) {
                completedRequired++;
            }
        });
        optionalFields.forEach(field => {
            if (user[field]) {
                completedOptional++;
            }
        });
        const completionPercentage = Math.round(((completedRequired / requiredFields.length) * 70) +
            ((completedOptional / optionalFields.length) * 30));
        const missingRequired = requiredFields.filter(field => !user[field]);
        const missingOptional = optionalFields.filter(field => !user[field]);
        res.status(200).json({
            success: true,
            profileCompleted: user.profileCompleted,
            completionPercentage,
            missingRequired,
            missingOptional,
            canTakeTest: completedRequired === requiredFields.length,
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting profile status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile status',
        });
    }
};
exports.getProfileStatus = getProfileStatus;
