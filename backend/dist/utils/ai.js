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
exports.getAIStreamRecommendations = getAIStreamRecommendations;
exports.generateAIInterests = generateAIInterests;
exports.getCollegePredictions = getCollegePredictions;
const logger_1 = require("./logger");
// Lazy-load OpenAI only when an API key is present to avoid ESM/CJS and env issues
async function getOpenAIClient() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey)
        return null;
    const mod = await Promise.resolve().then(() => __importStar(require('openai')));
    const OpenAI = mod.default;
    // Configure for OpenRouter if base URL is set
    const config = { apiKey };
    if (process.env.OPENAI_BASE_URL) {
        config.baseURL = process.env.OPENAI_BASE_URL;
        config.defaultHeaders = {
            'HTTP-Referer': 'https://careervista.ai',
            'X-Title': 'CareerVista AI'
        };
    }
    return new OpenAI(config);
}
// OpenRouter Free Models Configuration
const FREE_MODELS = [
    'google/gemini-2.0-flash-exp:free', // Latest Gemini Flash (Best for general tasks)
    'google/gemini-flash-1.5:free', // Gemini Flash 1.5
    'meta-llama/llama-3.2-3b-instruct:free', // Meta Llama 3.2 3B
    'meta-llama/llama-3.2-1b-instruct:free', // Meta Llama 3.2 1B  
    'microsoft/phi-3-mini-128k-instruct:free', // Microsoft Phi-3 Mini
    'microsoft/phi-3-medium-128k-instruct:free', // Microsoft Phi-3 Medium
    'qwen/qwen-2-7b-instruct:free', // Alibaba Qwen 2
    'huggingfaceh4/zephyr-7b-beta:free', // Zephyr 7B
    'openchat/openchat-7b:free', // OpenChat 7B
    'nousresearch/hermes-3-llama-3.1-405b:free', // Hermes 3 405B
    'liquid/lfm-40b:free', // Liquid Foundation Model 40B
    'mistralai/mistral-7b-instruct:free' // Mistral 7B
];
// Central AI config and helpers
const AI_CONFIG = {
    enabled: (process.env.AI_ENABLED ?? 'true') !== 'false',
    model: process.env.OPENAI_MODEL || FREE_MODELS[0], // Default to best free model
    freeModels: FREE_MODELS,
    temperature: 0.2,
    timeoutMs: Number(process.env.AI_TIMEOUT_MS || 15000),
    maxRetries: Number(process.env.AI_MAX_RETRIES || 2),
};
function safeJsonParse(input) {
    try {
        return JSON.parse(input);
    }
    catch {
        return null;
    }
}
function extractJsonBlock(text) {
    if (!text)
        return null;
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start)
        return text.slice(start, end + 1);
    return null;
}
async function withRetry(fn) {
    let lastErr;
    for (let attempt = 0; attempt <= AI_CONFIG.maxRetries; attempt++) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);
            const result = await fn();
            clearTimeout(timer);
            return result;
        }
        catch (err) {
            lastErr = err;
            if (attempt === AI_CONFIG.maxRetries)
                break;
            await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        }
    }
    throw lastErr;
}
async function getAIStreamRecommendations(input) {
    const system = `You are CareerVista AI, an expert counselor for Indian students (2025). Provide comprehensive stream recommendations for 10th graders with detailed fit analysis.

Your task:
1. Analyze the student's academic test scores and interests
2. Rank Science (MPC/BiPC), Commerce (MEC), and Humanities (CEC/HEC) streams by fit score
3. Provide detailed strengths/weaknesses analysis for each stream
4. Give specific feedback on why each stream is suitable/unsuitable

Constraints:
- Use 2025 realities: 70% stream regret, 57% unemployability, affordability concerns
- Consider category/quota impacts but focus on aptitude + interests
- For 10th graders, emphasize fundamentals over current performance
- Provide actionable insights to help students make informed choices
- Confidence must be 0-100 (fit score)
- Include specific subject-wise analysis

Output strict JSON format:
{
  "recommendations": [
    {
      "stream": "MPC",
      "confidence": 88,
      "rationale": "Strong mathematical and scientific aptitude with excellent problem-solving skills",
      "strengths": ["Advanced mathematics", "Physics concepts", "Logical reasoning"],
      "weaknesses": ["Biology concepts", "Memorization skills"],
      "fitScore": 88,
      "careerAlignment": "Engineering, Technology, Research",
      "subjectAnalysis": {
        "mathematics": {"score": 85, "feedback": "Excellent numerical reasoning"},
        "physics": {"score": 82, "feedback": "Strong conceptual understanding"},
        "chemistry": {"score": 78, "feedback": "Good but needs improvement in organic chemistry"}
      }
    }
  ]
}`;
    const user = `INPUT\nclassLevel: ${input.classLevel}\nstate: ${input.state || 'NA'}\ncategory: ${input.category || 'NA'}\nscores: ${JSON.stringify(input.scores || {})}\ninterests: ${(input.interests || []).join(', ')}`;
    try {
        const openai = await getOpenAIClient();
        // If OpenAI is not configured, provide a simple deterministic fallback
        if (!openai) {
            logger_1.logger.warn('OPENAI_API_KEY missing. Using fallback recommendations.');
            const scores = input.scores || {};
            const interests = (input.interests || []).map((s) => s.toLowerCase());
            const picks = [];
            // Basic heuristics
            const math = Number(scores.math || 0);
            const physics = Number(scores.physics || 0);
            const chemistry = Number(scores.chemistry || 0);
            const biology = Number(scores.biology || 0);
            const totalScience = physics + chemistry + biology;
            const avgScience = totalScience / 3;
            const sst = Number(scores.socialScience || 0);
            if (math >= 70 && avgScience >= 70)
                picks.push({
                    stream: 'MPC',
                    confidence: Math.min(95, Math.round((math + avgScience) / 2)),
                    rationale: 'Strong math and science fundamentals with excellent problem-solving abilities.',
                    strengths: ['Mathematical reasoning', 'Scientific thinking', 'Logical analysis'],
                    weaknesses: ['Memorization', 'Biology concepts'],
                    fitScore: Math.min(95, Math.round((math + avgScience) / 2)),
                    careerAlignment: 'Engineering, Technology, Research, Medicine'
                });
            if (interests.some((i) => ['biology', 'medical', 'doctor', 'health'].some(k => i.includes(k))))
                picks.push({
                    stream: 'BiPC',
                    confidence: 80,
                    rationale: 'Interests aligned with biology/medical fields with strong scientific aptitude.',
                    strengths: ['Biology interest', 'Medical aptitude', 'Scientific curiosity'],
                    weaknesses: ['Physics concepts', 'Advanced mathematics'],
                    fitScore: 80,
                    careerAlignment: 'Medicine, Biotechnology, Research, Healthcare'
                });
            if (math >= 60 && sst >= 60)
                picks.push({
                    stream: 'MEC',
                    confidence: Math.round((math + sst) / 2),
                    rationale: 'Good numerical and verbal aptitude suitable for commerce and business.',
                    strengths: ['Numerical skills', 'Communication', 'Business thinking'],
                    weaknesses: ['Advanced science', 'Memorization'],
                    fitScore: Math.round((math + sst) / 2),
                    careerAlignment: 'Business, Finance, Accounting, Management'
                });
            if (sst >= 70)
                picks.push({
                    stream: 'CEC',
                    confidence: sst,
                    rationale: 'Strong humanities/communication foundation with creative potential.',
                    strengths: ['Communication', 'Critical thinking', 'Creative expression'],
                    weaknesses: ['Advanced mathematics', 'Scientific concepts'],
                    fitScore: sst,
                    careerAlignment: 'Journalism, Law, Social Sciences, Arts'
                });
            if (picks.length < 3)
                picks.push({
                    stream: 'HEC',
                    confidence: 65,
                    rationale: 'Balanced profile with potential to excel in humanities with proper guidance.',
                    strengths: ['Balanced skills', 'Adaptability', 'Broad interests'],
                    weaknesses: ['Specialized focus', 'Advanced concepts'],
                    fitScore: 65,
                    careerAlignment: 'General Arts, Social Work, Education, Public Service'
                });
            return picks.slice(0, 3);
        }
        if (!AI_CONFIG.enabled)
            throw new Error('AI disabled via env');
        const resp = await withRetry(() => openai.chat.completions.create({
            model: AI_CONFIG.model,
            temperature: AI_CONFIG.temperature,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ]
        }));
        const content = resp.choices?.[0]?.message?.content || '';
        const jsonText = extractJsonBlock(content) || content;
        const parsed = safeJsonParse(jsonText) || { recommendations: [] };
        const recs = (parsed.recommendations || []).map((r) => ({
            stream: r.stream,
            confidence: Math.max(0, Math.min(100, Number(r.confidence) || 0)),
            rationale: String(r.rationale || ''),
            strengths: r.strengths || [],
            weaknesses: r.weaknesses || [],
            fitScore: Math.max(0, Math.min(100, Number(r.fitScore) || r.confidence)),
            careerAlignment: String(r.careerAlignment || ''),
            subjectAnalysis: r.subjectAnalysis || {}
        }));
        return recs.slice(0, 3);
    }
    catch (error) {
        logger_1.logger.error('OpenAI stream recommendations failed', error);
        // Fallback to simple heuristic on error as well
        const scores = input.scores || {};
        const math = Number(scores.math || 0);
        const physics = Number(scores.physics || 0);
        const chemistry = Number(scores.chemistry || 0);
        const biology = Number(scores.biology || 0);
        const totalScience = physics + chemistry + biology;
        const avgScience = totalScience / 3;
        const sst = Number(scores.socialScience || 0);
        const picks = [];
        if (math >= 70 && avgScience >= 70)
            picks.push({
                stream: 'MPC',
                confidence: Math.min(95, Math.round((math + avgScience) / 2)),
                rationale: 'Strong math and science fundamentals with excellent problem-solving abilities.',
                strengths: ['Mathematical reasoning', 'Scientific thinking', 'Logical analysis'],
                weaknesses: ['Memorization', 'Biology concepts'],
                fitScore: Math.min(95, Math.round((math + avgScience) / 2)),
                careerAlignment: 'Engineering, Technology, Research, Medicine'
            });
        if (math >= 60 && sst >= 60)
            picks.push({
                stream: 'MEC',
                confidence: Math.round((math + sst) / 2),
                rationale: 'Good numerical and verbal aptitude suitable for commerce and business.',
                strengths: ['Numerical skills', 'Communication', 'Business thinking'],
                weaknesses: ['Advanced science', 'Memorization'],
                fitScore: Math.round((math + sst) / 2),
                careerAlignment: 'Business, Finance, Accounting, Management'
            });
        if (sst >= 70)
            picks.push({
                stream: 'CEC',
                confidence: sst,
                rationale: 'Strong humanities/communication foundation with creative potential.',
                strengths: ['Communication', 'Critical thinking', 'Creative expression'],
                weaknesses: ['Advanced mathematics', 'Scientific concepts'],
                fitScore: sst,
                careerAlignment: 'Journalism, Law, Social Sciences, Arts'
            });
        if (picks.length === 0)
            picks.push({
                stream: 'HEC',
                confidence: 60,
                rationale: 'Balanced profile with potential to excel in humanities with proper guidance.',
                strengths: ['Balanced skills', 'Adaptability', 'Broad interests'],
                weaknesses: ['Specialized focus', 'Advanced concepts'],
                fitScore: 60,
                careerAlignment: 'General Arts, Social Work, Education, Public Service'
            });
        return picks.slice(0, 3);
    }
}
/**
 * Generate AI-powered interest suggestions based on user responses
 */
async function generateAIInterests(input) {
    const system = `You are CareerVista AI, an expert at identifying student interests from responses. Generate 5-8 relevant interests based on user data.
Constraints:
- Focus on academic subjects, career domains, and activity preferences
- Use Indian education context (CBSE/ICSE/State boards)
- Consider class level, academic performance, and any provided responses
- Output as JSON array: ["interest1", "interest2", ...]
- Interests should be specific and actionable (e.g., "Mathematics Problem Solving", "Creative Writing", "Laboratory Research")`;
    const user = `INPUT:
Class: ${input.userClass || 'NA'}
Board: ${input.board || 'NA'}
State: ${input.state || 'NA'}
Category: ${input.category || 'NA'}
Gender: ${input.gender || 'NA'}
Existing Interests: ${(input.existingInterests || []).join(', ') || 'None'}
Academic Performance: ${JSON.stringify(input.academicPerformance || {})}
Quick Responses: ${JSON.stringify(input.responses || [])}`;
    try {
        const openai = await getOpenAIClient();
        if (!openai) {
            logger_1.logger.warn('OPENAI_API_KEY missing. Using fallback interests.');
            return [
                'Mathematics',
                'Science Research',
                'Creative Writing',
                'Technology',
                'Social Sciences',
            ];
        }
        if (!AI_CONFIG.enabled)
            throw new Error('AI disabled via env');
        const resp = await withRetry(() => openai.chat.completions.create({
            model: AI_CONFIG.model,
            temperature: 0.3,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ]
        }));
        const content = resp.choices?.[0]?.message?.content || '';
        const start = content.indexOf('[');
        const end = content.lastIndexOf(']');
        const jsonText = start >= 0 && end > start ? content.slice(start, end + 1) : '[]';
        const parsed = safeJsonParse(jsonText) || [];
        return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
    }
    catch (error) {
        logger_1.logger.error('OpenAI interest generation failed', error);
        // Fallback to basic interests
        return [
            'Mathematics',
            'Science Research',
            'Creative Writing',
            'Technology',
            'Social Sciences',
        ];
    }
}
/**
 * Generate college predictions based on entrance scores and preferences
 */
async function getCollegePredictions(input) {
    const system = `You are CareerVista AI, expert in Indian college admissions (2025). Predict college admission chances based on entrance scores.
Constraints:
- Use 2025 cutoffs for JEE/NEET/EAMCET/CLAT/CUET
- Consider category quotas (General/OBC/SC/ST/EWS)
- Factor in home state vs other state quotas
- Classify as Ambitious (30% chance), Moderate (70% chance), Safe (90% chance)
- Include fee structure and placement data
- Output JSON: { "predictions": [{ "college": "...", "course": "...", "category": "Safe/Moderate/Ambitious", "fees": "...", "placement": "..." }] }`;
    const user = `INPUT:
Entrance Scores: ${JSON.stringify(input.entranceScores)}
Category: ${input.category}
State: ${input.state}
Preferences: ${JSON.stringify(input.preferences)}`;
    try {
        const openai = await getOpenAIClient();
        if (!openai) {
            logger_1.logger.warn('OPENAI_API_KEY missing. Returning empty college predictions.');
            return [];
        }
        if (!AI_CONFIG.enabled)
            throw new Error('AI disabled via env');
        const resp = await withRetry(() => openai.chat.completions.create({
            model: AI_CONFIG.model,
            temperature: 0.2,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ]
        }));
        const content = resp.choices?.[0]?.message?.content || '';
        const jsonText = extractJsonBlock(content) || '{}';
        const parsed = safeJsonParse(jsonText) || { predictions: [] };
        return parsed.predictions || [];
    }
    catch (error) {
        logger_1.logger.error('OpenAI college predictions failed', error);
        return [];
    }
}
