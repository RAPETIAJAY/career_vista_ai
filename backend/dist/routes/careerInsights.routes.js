"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const careerInsights_controller_1 = require("../controllers/careerInsights.controller");
const ai_controller_1 = require("../controllers/ai.controller");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Get detailed career insights for a specific stream
router.get('/insights/:stream', careerInsights_controller_1.getCareerInsights);
// Get future-proof skills recommendations
router.get('/skills/:stream', careerInsights_controller_1.getFutureProofSkills);
// Get course recommendations for skill gaps
router.get('/courses/:stream', careerInsights_controller_1.getCourseRecommendations);
// Get employability insights by region
router.get('/employability/:stream', careerInsights_controller_1.getEmployabilityInsights);
// AI-enhanced endpoints
router.post('/ai/stream-narrative', ai_controller_1.getStreamNarrative);
router.post('/ai/explain-weights', ai_controller_1.explainWeights);
router.post('/ai/salary-insights', ai_controller_1.getSalaryInsights);
exports.default = router;
