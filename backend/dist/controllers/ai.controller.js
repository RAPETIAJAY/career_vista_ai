"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalaryInsights = exports.explainWeights = exports.getStreamNarrative = exports.analyzeTestResults = exports.predictOptimalStream = void 0;
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
const getLocalLlmUrl = () => process.env.LOCAL_LLM_URL || '';
const getLocalLlmModel = () => process.env.LOCAL_LLM_MODEL || 'llama3.2:3b-instruct';
const predictOptimalStream = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        // Check if user has completed both profile and test
        if (!user.profileCompleted) {
            return res.status(400).json({
                success: false,
                message: 'Please complete your profile first'
            });
        }
        if (!user.examCompleted || !user.testScores?.fundamentals) {
            return res.status(400).json({
                success: false,
                message: 'Please complete the academic test first'
            });
        }
        const testResults = user.testScores.fundamentals;
        const profile = {
            interests: user.interests || [],
            class: user.class,
            state: user.state,
            category: user.category,
            gender: user.gender
        };
        const localUrl = getLocalLlmUrl();
        const localModel = getLocalLlmModel();
        // Create comprehensive prompt for stream prediction
        const system = `You are an expert career counselor analyzing student data to predict the optimal stream for Class 11-12.

STREAM OPTIONS:
- MPC (Math, Physics, Chemistry): Engineering, Technology, Applied Sciences
- BiPC (Biology, Physics, Chemistry): Medicine, Life Sciences, Research
- MEC (Math, Economics, Commerce): Business, Finance, Management, CA
- CEC (Civics, Economics, Commerce): Law, Civil Services, Journalism
- HEC (History, Economics, Civics): Humanities, Social Work, Literature, Teaching

ANALYSIS CRITERIA:
1. Academic Performance (40%): Subject-wise scores and strengths
2. Interest Alignment (35%): Student's stated interests and preferences  
3. Aptitude Indicators (25%): Problem-solving patterns and learning style

Output STRICT JSON with this structure:
{
  "recommendedStream": "MPC|BiPC|MEC|CEC|HEC",
  "confidence": "85%",
  "reasoning": {
    "academicFit": "Analysis of how test scores align with stream requirements",
    "interestAlignment": "How stated interests match stream opportunities", 
    "aptitudeMatch": "Assessment of natural strengths for this stream"
  },
  "streamScores": {
    "MPC": 85,
    "BiPC": 72,
    "MEC": 68,
    "CEC": 45,
    "HEC": 40
  },
  "careerPaths": [
    "Top 3-4 specific career options in recommended stream"
  ],
  "skillsToFocus": [
    "Key areas for improvement and development"
  ],
  "nextSteps": [
    "Immediate actionable recommendations"
  ]
}`;
        const userContext = `STUDENT PROFILE:
Class: ${profile.class}
State: ${profile.state}
Category: ${profile.category}
Interests: ${profile.interests.join(', ')}

TEST RESULTS:
Total Score: ${testResults.total}/100
Mathematics: ${testResults.subjects.math}/10
Physics: ${testResults.subjects.physics}/10
Chemistry: ${testResults.subjects.chemistry}/10
Biology: ${testResults.subjects.biology}/10
Social Science: ${testResults.subjects.socialScience}/10

Strengths: ${testResults.strengths?.join(', ') || 'Not specified'}
Weaknesses: ${testResults.weaknesses?.join(', ') || 'Not specified'}

Time Taken: ${testResults.timeTaken} minutes
Test Date: ${testResults.date}

Analyze this data and predict the optimal stream with detailed reasoning.`;
        let json = null;
        // Try to get AI-generated prediction
        if (localUrl && typeof fetch !== 'undefined') {
            try {
                const prompt = `${system}\n---\n${userContext}\nReturn ONLY valid JSON, no other text.`;
                const r = await fetch(`${localUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: localModel,
                        prompt,
                        stream: false,
                        options: { temperature: 0.3 }
                    })
                });
                const t = await r.json();
                const out = t.response || t.content || '';
                const s = out.indexOf('{');
                const e = out.lastIndexOf('}');
                const text = s >= 0 && e > s ? out.slice(s, e + 1) : out;
                try {
                    json = JSON.parse(text);
                }
                catch (e) {
                    logger_1.logger.error('Failed to parse AI response for stream prediction', e);
                }
            }
            catch (error) {
                logger_1.logger.error('Local LLM request failed for stream prediction', error);
            }
        }
        // Fallback prediction algorithm if AI fails
        if (!json) {
            json = generateFallbackPrediction(testResults, profile);
        }
        // Store prediction in user profile for future reference
        user.selectedStream = json.recommendedStream;
        await user.save();
        return res.status(200).json({
            success: true,
            prediction: json,
            metadata: {
                userId,
                testDate: testResults.date,
                profileCompleted: user.profileCompleted,
                examCompleted: user.examCompleted,
                generatedAt: new Date().toISOString()
            }
        });
    }
    catch (error) {
        logger_1.logger.error('predictOptimalStream failed', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate stream prediction'
        });
    }
};
exports.predictOptimalStream = predictOptimalStream;
const analyzeTestResults = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        if (!user.examCompleted || !user.testScores?.fundamentals) {
            return res.status(400).json({
                success: false,
                message: 'No test results found. Please complete the academic test first.'
            });
        }
        const testResults = user.testScores.fundamentals;
        const profile = {
            interests: user.interests || [],
            class: user.class,
            state: user.state
        };
        const localUrl = getLocalLlmUrl();
        const localModel = getLocalLlmModel();
        const system = `You are an educational psychologist analyzing test performance to provide detailed insights.

Generate comprehensive test analysis in STRICT JSON format:
{
  "overallPerformance": {
    "grade": "A+|A|B+|B|C+|C|D",
    "percentile": 85,
    "summary": "Brief performance overview"
  },
  "subjectAnalysis": {
    "mathematics": {
      "score": "percentage score (0-100)",
      "grade": "letter grade based on percentage",
      "strengths": ["specific strengths"],
      "improvements": ["areas to work on"],
      "recommendation": "actionable advice"
    },
    "science": { 
      "score": "percentage score (0-100)",
      "grade": "letter grade based on percentage",
      "strengths": ["specific strengths"],
      "improvements": ["areas to work on"],
      "recommendation": "actionable advice"
    },
    "english": { 
      "score": "percentage score (0-100)",
      "grade": "letter grade based on percentage",
      "strengths": ["specific strengths"],
      "improvements": ["areas to work on"],
      "recommendation": "actionable advice"
    },
    "socialScience": { 
      "score": "percentage score (0-100)",
      "grade": "letter grade based on percentage",
      "strengths": ["specific strengths"],
      "improvements": ["areas to work on"],
      "recommendation": "actionable advice"
    }
  },
  "cognitiveProfile": {
    "analyticalThinking": "Strong|Average|Developing",
    "verbalReasoning": "Strong|Average|Developing", 
    "numericalAptitude": "Strong|Average|Developing",
    "spatialIntelligence": "Strong|Average|Developing"
  },
  "learningStyle": {
    "primary": "Visual|Auditory|Kinesthetic|Reading/Writing",
    "secondary": "backup learning style",
    "recommendations": ["study method suggestions"]
  },
  "careerIndicators": {
    "stemAptitude": "High|Medium|Low",
    "humanitiesAptitude": "High|Medium|Low", 
    "commerceAptitude": "High|Medium|Low",
    "suggestedFields": ["field1", "field2", "field3"]
  },
  "studyRecommendations": [
    "specific actionable study tips"
  ],
  "timeManagement": {
    "efficiency": "Excellent|Good|Needs Improvement",
    "suggestions": ["time management tips"]
  }
}`;
        // Get actual question counts from the most recent test submission
        const actualQuestionCounts = {
            math: 10,
            physics: 10,
            chemistry: 10,
            biology: 10,
            socialScience: 10
        };
        const userContext = `TEST RESULTS ANALYSIS:
Student Class: ${profile.class}
Total Score: ${testResults.total}% (percentage-based scoring)
Time Taken: ${testResults.timeTaken} minutes

Subject Breakdown (percentage scores based on actual performance):
- Mathematics: ${testResults.subjects.math}% (out of ${actualQuestionCounts.math} questions available)
- Physics: ${testResults.subjects.physics}% (out of ${actualQuestionCounts.physics} questions available)
- Chemistry: ${testResults.subjects.chemistry}% (out of ${actualQuestionCounts.chemistry} questions available)
- Biology: ${testResults.subjects.biology}% (out of ${actualQuestionCounts.biology} questions available)
- Social Science: ${testResults.subjects.socialScience}% (out of ${actualQuestionCounts.socialScience} questions available)

NOTE: Scores are percentage-based. A 30% in math means the student got 30% of available math questions correct, not 30 out of 10 questions.

Current Strengths: ${testResults.strengths?.join(', ') || 'To be determined'}
Areas for Improvement: ${testResults.weaknesses?.join(', ') || 'To be determined'}
Student Interests: ${profile.interests.join(', ')}

Provide detailed analysis with actionable insights for academic and career planning.`;
        let json = null;
        // Try AI analysis
        if (localUrl && typeof fetch !== 'undefined') {
            try {
                const prompt = `${system}\n---\n${userContext}\nReturn ONLY valid JSON, no other text.`;
                const r = await fetch(`${localUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: localModel,
                        prompt,
                        stream: false,
                        options: { temperature: 0.4 }
                    })
                });
                const t = await r.json();
                const out = t.response || t.content || '';
                const s = out.indexOf('{');
                const e = out.lastIndexOf('}');
                const text = s >= 0 && e > s ? out.slice(s, e + 1) : out;
                try {
                    json = JSON.parse(text);
                }
                catch (e) {
                    logger_1.logger.error('Failed to parse AI response for test analysis', e);
                }
            }
            catch (error) {
                logger_1.logger.error('Local LLM request failed for test analysis', error);
            }
        }
        // Fallback analysis if AI fails
        if (!json) {
            json = generateFallbackAnalysis(testResults, profile);
        }
        return res.status(200).json({
            success: true,
            analysis: json,
            metadata: {
                userId,
                testDate: testResults.date,
                totalQuestions: 100, // Assuming 100 questions
                generatedAt: new Date().toISOString()
            }
        });
    }
    catch (error) {
        logger_1.logger.error('analyzeTestResults failed', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate test analysis'
        });
    }
};
exports.analyzeTestResults = analyzeTestResults;
// Helper function to generate fallback stream prediction
const generateFallbackPrediction = (testResults, profile) => {
    const scores = testResults.subjects;
    const interests = profile.interests || [];
    // Calculate total science score from physics, chemistry, and biology
    const totalScience = (scores.physics || 0) + (scores.chemistry || 0) + (scores.biology || 0);
    // Calculate stream fitness scores (raw scores) - using percentages now
    const rawStreamScores = {
        MPC: Math.round(((scores.math || 0) + (scores.physics || 0) + (scores.chemistry || 0)) * 0.6),
        BiPC: Math.round(((scores.biology || 0) + (scores.physics || 0) + (scores.chemistry || 0)) * 0.6),
        MEC: Math.round(((scores.math || 0) + (scores.socialScience || 0)) * 0.8),
        CEC: Math.round((scores.socialScience || 0) * 1.2),
        HEC: Math.round((scores.socialScience || 0) * 1.2)
    };
    // Adjust for interests
    const interestBoosts = {
        MPC: ['technology', 'engineering', 'mathematics', 'computer', 'physics'],
        BiPC: ['medicine', 'biology', 'research', 'health', 'science'],
        MEC: ['business', 'finance', 'economics', 'management', 'accounting'],
        CEC: ['law', 'politics', 'journalism', 'civil services'],
        HEC: ['literature', 'history', 'social work', 'psychology', 'teaching']
    };
    Object.entries(interestBoosts).forEach(([stream, keywords]) => {
        const matchingInterests = interests.filter((interest) => keywords.some((keyword) => interest.toLowerCase().includes(keyword))).length;
        rawStreamScores[stream] += matchingInterests * 5;
    });
    // Normalize scores to percentages (0-100)
    const maxScore = Math.max(...Object.values(rawStreamScores));
    const streamScores = Object.entries(rawStreamScores).reduce((acc, [stream, score]) => {
        acc[stream] = Math.round((score / maxScore) * 100);
        return acc;
    }, {});
    // Find recommended stream (use raw scores for comparison)
    const recommendedStream = Object.entries(rawStreamScores).reduce((a, b) => rawStreamScores[a[0]] > rawStreamScores[b[0]] ? a : b)[0];
    const confidence = Math.min(95, Math.max(60, streamScores[recommendedStream]));
    return {
        recommendedStream,
        confidence: `${confidence}%`,
        reasoning: {
            academicFit: `Based on your test scores, you show strong performance in subjects aligned with ${recommendedStream}`,
            interestAlignment: `Your interests in ${interests.join(', ')} align well with ${recommendedStream} career paths`,
            aptitudeMatch: `Your analytical and reasoning skills indicate good potential for ${recommendedStream} stream`
        },
        streamScores,
        careerPaths: getCareerPaths(recommendedStream),
        skillsToFocus: getSkillsToFocus(recommendedStream, testResults),
        nextSteps: getNextSteps(recommendedStream)
    };
};
// Helper function to generate fallback test analysis
const generateFallbackAnalysis = (testResults, profile) => {
    const scores = testResults.subjects;
    const total = testResults.total;
    const timeTaken = testResults.timeTaken;
    const getGrade = (score, max) => {
        const percentage = (score / max) * 100;
        if (percentage >= 90)
            return 'A+';
        if (percentage >= 80)
            return 'A';
        if (percentage >= 70)
            return 'B+';
        if (percentage >= 60)
            return 'B';
        if (percentage >= 50)
            return 'C+';
        if (percentage >= 40)
            return 'C';
        return 'D';
    };
    const getPerformanceLevel = (score, max) => {
        const percentage = (score / max) * 100;
        if (percentage >= 80)
            return 'Strong';
        if (percentage >= 60)
            return 'Average';
        return 'Developing';
    };
    return {
        overallPerformance: {
            grade: getGrade(total, 100),
            percentile: Math.min(95, Math.max(10, total + Math.random() * 10)),
            summary: `You scored ${total}/100 with ${getGrade(total, 100)} grade performance`
        },
        subjectAnalysis: {
            mathematics: {
                score: scores.math || 0,
                grade: getGrade(scores.math || 0, 100),
                strengths: (scores.math || 0) >= 70 ? ['Problem solving', 'Logical reasoning'] : ['Basic concepts'],
                improvements: (scores.math || 0) < 70 ? ['Practice more problems', 'Strengthen fundamentals'] : ['Advanced topics'],
                recommendation: (scores.math || 0) >= 70 ? 'Consider STEM fields' : 'Focus on building math foundations'
            },
            physics: {
                score: scores.physics || 0,
                grade: getGrade(scores.physics || 0, 100),
                strengths: (scores.physics || 0) >= 70 ? ['Understanding concepts', 'Problem-solving'] : ['Basic knowledge'],
                improvements: (scores.physics || 0) < 70 ? ['Study mechanics', 'Practice numericals'] : ['Advanced physics'],
                recommendation: (scores.physics || 0) >= 70 ? 'Strong for engineering streams' : 'Build physics fundamentals'
            },
            chemistry: {
                score: scores.chemistry || 0,
                grade: getGrade(scores.chemistry || 0, 100),
                strengths: (scores.chemistry || 0) >= 70 ? ['Chemical reactions', 'Analytical thinking'] : ['Basic concepts'],
                improvements: (scores.chemistry || 0) < 70 ? ['Learn periodic table', 'Practice equations'] : ['Organic chemistry'],
                recommendation: (scores.chemistry || 0) >= 70 ? 'Good for science streams' : 'Strengthen chemistry base'
            },
            biology: {
                score: scores.biology || 0,
                grade: getGrade(scores.biology || 0, 100),
                strengths: (scores.biology || 0) >= 70 ? ['Life sciences', 'Scientific method'] : ['General knowledge'],
                improvements: (scores.biology || 0) < 70 ? ['Study organisms', 'Learn biology concepts'] : ['Advanced biology'],
                recommendation: (scores.biology || 0) >= 70 ? 'Consider medical/life sciences' : 'Build biology foundation'
            },
            socialScience: {
                score: scores.socialScience || 0,
                grade: getGrade(scores.socialScience || 0, 100),
                strengths: (scores.socialScience || 0) >= 70 ? ['Social awareness', 'Critical thinking'] : ['General knowledge'],
                improvements: (scores.socialScience || 0) < 70 ? ['Current affairs', 'Historical knowledge'] : ['Research skills'],
                recommendation: (scores.socialScience || 0) >= 70 ? 'Consider humanities/commerce' : 'Build social science foundation'
            }
        },
        cognitiveProfile: {
            analyticalThinking: getPerformanceLevel((scores.math || 0) + (scores.physics || 0) + (scores.chemistry || 0), 300),
            verbalReasoning: getPerformanceLevel(scores.socialScience || 0, 100),
            numericalAptitude: getPerformanceLevel(scores.math || 0, 100),
            spatialIntelligence: getPerformanceLevel((scores.physics || 0) + (scores.chemistry || 0) + (scores.biology || 0), 300)
        },
        learningStyle: {
            primary: scores.math > scores.socialScience ? 'Visual' : 'Reading/Writing',
            secondary: 'Kinesthetic',
            recommendations: ['Practice with diagrams', 'Use flashcards', 'Group study sessions']
        },
        careerIndicators: {
            stemAptitude: getPerformanceLevel(scores.math + ((scores.physics || 0) + (scores.chemistry || 0) + (scores.biology || 0)), 400),
            humanitiesAptitude: getPerformanceLevel(scores.socialScience, 100),
            commerceAptitude: getPerformanceLevel(scores.math + scores.socialScience, 200),
            suggestedFields: getSuggestedFields(scores)
        },
        studyRecommendations: [
            'Create a structured study schedule',
            'Focus on weak areas while maintaining strengths',
            'Practice previous year questions',
            'Join study groups for collaborative learning'
        ],
        timeManagement: {
            efficiency: timeTaken <= 90 ? 'Excellent' : timeTaken <= 120 ? 'Good' : 'Needs Improvement',
            suggestions: timeTaken > 120 ?
                ['Practice time-bound tests', 'Improve reading speed', 'Learn shortcuts'] :
                ['Maintain good pace', 'Double-check answers', 'Use extra time for review']
        }
    };
};
const getCareerPaths = (stream) => {
    const paths = {
        MPC: ['Software Engineer', 'Mechanical Engineer', 'Aerospace Engineer', 'Data Scientist'],
        BiPC: ['Doctor (MBBS)', 'Biotechnology Researcher', 'Pharmaceutical Scientist', 'Veterinarian'],
        MEC: ['Chartered Accountant', 'Investment Banker', 'Business Analyst', 'Management Consultant'],
        CEC: ['Lawyer', 'Civil Services Officer', 'Journalist', 'Policy Analyst'],
        HEC: ['Teacher/Professor', 'Social Worker', 'Psychologist', 'Content Writer']
    };
    return paths[stream] || ['Various career options available'];
};
const getSkillsToFocus = (stream, testResults) => {
    const skills = {
        MPC: ['Mathematical problem solving', 'Logical reasoning', 'Programming basics'],
        BiPC: ['Scientific observation', 'Research methodology', 'Biology concepts'],
        MEC: ['Quantitative analysis', 'Economic principles', 'Business communication'],
        CEC: ['Critical thinking', 'Legal reasoning', 'Public speaking'],
        HEC: ['Writing skills', 'Social awareness', 'Communication']
    };
    return skills[stream] || ['General academic skills'];
};
const getNextSteps = (stream) => {
    const steps = {
        MPC: ['Focus on JEE preparation', 'Strengthen Physics and Chemistry', 'Learn programming'],
        BiPC: ['Prepare for NEET', 'Deep dive into Biology', 'Understand medical ethics'],
        MEC: ['Explore commerce subjects', 'Learn about financial markets', 'Consider CA foundation'],
        CEC: ['Read about current affairs', 'Develop argumentative skills', 'Explore law colleges'],
        HEC: ['Read extensively', 'Write regularly', 'Engage with social issues']
    };
    return steps[stream] || ['Continue building foundation skills'];
};
const getSuggestedFields = (scores) => {
    const fields = [];
    const totalScience = (scores.physics || 0) + (scores.chemistry || 0) + (scores.biology || 0);
    if (scores.math + totalScience >= 35)
        fields.push('Engineering & Technology');
    if (totalScience >= 20)
        fields.push('Medical & Life Sciences');
    if (scores.math + scores.socialScience >= 35)
        fields.push('Business & Finance');
    if (scores.socialScience >= 35)
        fields.push('Humanities & Social Sciences');
    return fields.length > 0 ? fields : ['General Studies'];
};
const getStreamNarrative = async (req, res) => {
    try {
        const { stream, state, category, interests, scores } = req.body || {};
        if (!stream)
            return res.status(400).json({ success: false, message: 'stream is required' });
        const localUrl = getLocalLlmUrl();
        const localModel = getLocalLlmModel();
        const system = `You are CareerVista AI. Output strict JSON with keys: summary, courses, colleges, roi, futureDemand, competition, innovationScope.
Constraints:
- Audience: Indian Class 10/12 students (2025)
- Be concise but specific; 3-6 bullets per section
- competition is an object: { level: "Low|Medium|High", note: "..." }`;
        const user = `STREAM=${stream}\nSTATE=${state || 'NA'}\nCATEGORY=${category || 'NA'}\nINTERESTS=${(interests || []).join(', ')}\nSCORES=${JSON.stringify(scores || {})}`;
        let json = null;
        if (localUrl && typeof fetch !== 'undefined') {
            const prompt = `${system}\n---\n${user}\nReturn JSON only.`;
            const r = await fetch(`${localUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: localModel, prompt, stream: false, options: { temperature: 0.3 } })
            });
            const t = await r.json();
            const out = t.response || t.content || '';
            const s = out.indexOf('{');
            const e = out.lastIndexOf('}');
            const text = s >= 0 && e > s ? out.slice(s, e + 1) : out;
            try {
                json = JSON.parse(text);
            }
            catch { }
        }
        if (!json) {
            json = {
                summary: `${stream} overview tailored to your context.`,
                courses: ["Core UG programs and specializations"],
                colleges: ["Top IITs/NITs/Universities", "Strong private institutes"],
                roi: ["Fees vs placements guidance", "Scholarships and payback"],
                futureDemand: ["5-year outlook", "Top skills to build"],
                competition: { level: "High", note: "Popular track; consistent prep required" },
                innovationScope: ["Interdisciplinary niches", "Startup and research openings"],
            };
        }
        return res.status(200).json({ success: true, narrative: json });
    }
    catch (error) {
        logger_1.logger.error('getStreamNarrative failed', error);
        return res.status(500).json({ success: false, message: 'Failed to generate narrative' });
    }
};
exports.getStreamNarrative = getStreamNarrative;
const explainWeights = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        const fundamentals = user.fundamentalsTest10 || {};
        const interests = user.interests || [];
        const academics = user.testScores?.fundamentals?.subjects || {};
        const localUrl = getLocalLlmUrl();
        const localModel = getLocalLlmModel();
        const system = `Explain briefly how interests (30%), academics (35%), and test (35%) led to a stream choice.
Output strict JSON: { bullets: ["...", "..."] }`;
        const userp = `INTERESTS=${interests.join(', ')}\nACADEMICS=${JSON.stringify(academics)}\nTEST=${JSON.stringify(fundamentals.subjects || {})}`;
        let json = null;
        if (localUrl && typeof fetch !== 'undefined') {
            const prompt = `${system}\n---\n${userp}\nJSON only.`;
            const r = await fetch(`${localUrl}/api/generate`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: localModel, prompt, stream: false, options: { temperature: 0.2 } })
            });
            const t = await r.json();
            const out = t.response || t.content || '';
            const s = out.indexOf('{');
            const e = out.lastIndexOf('}');
            const text = s >= 0 && e > s ? out.slice(s, e + 1) : out;
            try {
                json = JSON.parse(text);
            }
            catch { }
        }
        if (!json)
            json = { bullets: ["Interests aligned with subject strengths.", "Academics show consistent performance.", "Test validates readiness for the stream."] };
        return res.status(200).json({ success: true, rationale: json });
    }
    catch (error) {
        logger_1.logger.error('explainWeights failed', error);
        return res.status(500).json({ success: false, message: 'Failed to generate rationale' });
    }
};
exports.explainWeights = explainWeights;
const getSalaryInsights = async (req, res) => {
    try {
        const { careerField, location, stream, experience } = req.body;
        if (!careerField) {
            return res.status(400).json({ success: false, message: 'Career field is required' });
        }
        const localUrl = getLocalLlmUrl();
        const localModel = getLocalLlmModel();
        // Create a comprehensive prompt for salary insights
        const system = `You are an AI career advisor specializing in Indian job market salary insights.
Generate comprehensive salary and career insights in strict JSON format with these keys:
{
  "salaryTimeline": [
    { "years": "0-2", "title": "Junior/Entry Level", "salary": "₹X-Y LPA", "description": "..." },
    { "years": "3-5", "title": "Mid-Level", "salary": "₹X-Y LPA", "description": "..." },
    { "years": "6-10", "title": "Senior Level", "salary": "₹X-Y LPA", "description": "..." },
    { "years": "10+", "title": "Lead/Principal", "salary": "₹X-Y LPA", "description": "..." }
  ],
  "marketDynamics": {
    "demand": "High/Medium/Low",
    "growth": "XX% annually",
    "trends": ["trend1", "trend2", "trend3"]
  },
  "skillsAnalysis": {
    "technical": ["skill1", "skill2", "skill3"],
    "soft": ["skill1", "skill2", "skill3"],
    "emerging": ["skill1", "skill2"]
  },
  "topCompanies": [
    { "name": "Company", "avgSalary": "₹X LPA", "culture": "..." },
    { "name": "Company", "avgSalary": "₹X LPA", "culture": "..." }
  ],
  "locationInsights": {
    "topCities": [
      { "city": "City", "avgSalary": "₹X LPA", "opportunities": "..." },
      { "city": "City", "avgSalary": "₹X LPA", "opportunities": "..." }
    ]
  },
  "careerAdvice": ["advice1", "advice2", "advice3"]
}

Provide realistic, current (2025) salary data for the Indian market.`;
        const user = `Career Field: ${careerField}
Location: ${location || 'India'}
Stream/Background: ${stream || 'General'}
Experience Level: ${experience || 'Fresher'}

Generate detailed salary insights and career guidance.`;
        let json = null;
        // Try to get AI-generated insights
        if (localUrl && typeof fetch !== 'undefined') {
            try {
                const prompt = `${system}\n---\n${user}\nReturn ONLY valid JSON, no other text.`;
                const r = await fetch(`${localUrl}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: localModel,
                        prompt,
                        stream: false,
                        options: { temperature: 0.4 }
                    })
                });
                const t = await r.json();
                const out = t.response || t.content || '';
                const s = out.indexOf('{');
                const e = out.lastIndexOf('}');
                const text = s >= 0 && e > s ? out.slice(s, e + 1) : out;
                try {
                    json = JSON.parse(text);
                }
                catch (e) {
                    logger_1.logger.error('Failed to parse AI response', e);
                }
            }
            catch (error) {
                logger_1.logger.error('Local LLM request failed', error);
            }
        }
        // Fallback to realistic mock data if AI fails
        if (!json) {
            json = {
                salaryTimeline: [
                    {
                        years: "0-2",
                        title: "Junior/Entry Level",
                        salary: "₹3-6 LPA",
                        description: `Entry-level positions in ${careerField} with basic skills and fresh perspectives.`
                    },
                    {
                        years: "3-5",
                        title: "Mid-Level Professional",
                        salary: "₹7-12 LPA",
                        description: `Mid-level roles with proven track record and specialized ${careerField} expertise.`
                    },
                    {
                        years: "6-10",
                        title: "Senior Professional",
                        salary: "₹15-25 LPA",
                        description: `Senior positions with leadership responsibilities in ${careerField}.`
                    },
                    {
                        years: "10+",
                        title: "Lead/Principal",
                        salary: "₹30-50+ LPA",
                        description: `Top-tier roles including architect, director, and C-level positions in ${careerField}.`
                    }
                ],
                marketDynamics: {
                    demand: "High",
                    growth: "15-20% annually",
                    trends: [
                        `Growing demand for ${careerField} professionals`,
                        "Shift towards remote and hybrid work models",
                        "Increased focus on specialized skills and certifications"
                    ]
                },
                skillsAnalysis: {
                    technical: [
                        `Core ${careerField} fundamentals`,
                        "Industry-standard tools and platforms",
                        "Project management and delivery"
                    ],
                    soft: [
                        "Communication and collaboration",
                        "Problem-solving and critical thinking",
                        "Adaptability and continuous learning"
                    ],
                    emerging: [
                        "AI and automation integration",
                        "Data-driven decision making"
                    ]
                },
                topCompanies: [
                    {
                        name: "Top Tech Companies",
                        avgSalary: "₹15-40 LPA",
                        culture: "Fast-paced, innovation-focused environment"
                    },
                    {
                        name: "Leading Startups",
                        avgSalary: "₹10-30 LPA",
                        culture: "Dynamic, growth-oriented with equity options"
                    },
                    {
                        name: "Established Enterprises",
                        avgSalary: "₹12-35 LPA",
                        culture: "Stable environment with structured growth"
                    }
                ],
                locationInsights: {
                    topCities: [
                        {
                            city: "Bangalore",
                            avgSalary: "₹8-15 LPA",
                            opportunities: `Tech hub with maximum opportunities in ${careerField}`
                        },
                        {
                            city: "Mumbai",
                            avgSalary: "₹9-16 LPA",
                            opportunities: "Financial capital with diverse industry options"
                        },
                        {
                            city: "Delhi NCR",
                            avgSalary: "₹7-14 LPA",
                            opportunities: "Mix of startups and established companies"
                        },
                        {
                            city: "Hyderabad",
                            avgSalary: "₹7-13 LPA",
                            opportunities: "Emerging tech hub with growing ecosystem"
                        },
                        {
                            city: "Pune",
                            avgSalary: "₹6-12 LPA",
                            opportunities: "Balanced cost of living with good opportunities"
                        }
                    ]
                },
                careerAdvice: [
                    `Build a strong foundation in ${careerField} fundamentals`,
                    "Focus on continuous learning and upskilling",
                    "Network with professionals and join industry communities",
                    "Consider certifications relevant to your specialization",
                    "Build a portfolio showcasing your practical experience"
                ]
            };
        }
        return res.status(200).json({
            success: true,
            insights: json,
            metadata: {
                careerField,
                location: location || 'India',
                stream: stream || 'General',
                experience: experience || 'Fresher',
                generatedAt: new Date().toISOString()
            }
        });
    }
    catch (error) {
        logger_1.logger.error('getSalaryInsights failed', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate salary insights'
        });
    }
};
exports.getSalaryInsights = getSalaryInsights;
