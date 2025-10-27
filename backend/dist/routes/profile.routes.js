"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authMiddleware);
// Profile management
router.post('/complete', profile_controller_1.completeProfile);
router.put('/update', profile_controller_1.updateProfile);
router.get('/status', profile_controller_1.getProfileStatus);
// AI-powered features
router.post('/interests/suggestions', profile_controller_1.getInterestSuggestions);
// Offline sync
router.post('/sync', profile_controller_1.syncOfflineData);
exports.default = router;
