"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financialAid_controller_1 = require("../controllers/financialAid.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authMiddleware);
// Financial aid recommendations
router.get('/recommendations', financialAid_controller_1.getFinancialAidRecommendations);
router.post('/loan/calculate-emi', financialAid_controller_1.calculateLoanEMI);
router.get('/scholarship/:scholarshipId', financialAid_controller_1.getScholarshipDetails);
// Financial reports
router.post('/report/generate', financialAid_controller_1.generateFinancialReport);
router.post('/report/export', financialAid_controller_1.exportFinancialReport);
exports.default = router;
