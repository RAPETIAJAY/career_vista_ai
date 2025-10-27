"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adaptiveTest_controller_1 = require("../controllers/adaptiveTest.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authMiddleware);
// Adaptive test for 10th class students
router.post('/start', adaptiveTest_controller_1.startAdaptiveTest);
router.post('/submit-answer', adaptiveTest_controller_1.submitAnswer);
router.get('/history', adaptiveTest_controller_1.getTestHistory);
exports.default = router;
