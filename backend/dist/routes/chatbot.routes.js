"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatbot_controller_1 = require("../controllers/chatbot.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Chat with career counselor AI
router.post('/chat', auth_1.auth, chatbot_controller_1.chatWithCounselorBot);
// Get conversation starters and suggestions
router.get('/suggestions', auth_1.auth, chatbot_controller_1.getCounselorSuggestions);
// Get personalized recommendation based on user's test results and profile
router.get('/personalized-recommendation', auth_1.auth, chatbot_controller_1.getPersonalizedRecommendation);
exports.default = router;
