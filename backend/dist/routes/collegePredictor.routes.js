"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collegePredictor_controller_1 = require("../controllers/collegePredictor.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authMiddleware);
router.post('/predict', collegePredictor_controller_1.predictColleges);
router.get('/college/:collegeId', collegePredictor_controller_1.getCollegeDetails);
router.post('/compare', collegePredictor_controller_1.compareColleges);
router.post('/what-if', collegePredictor_controller_1.getWhatIfScenarios);
exports.default = router;
