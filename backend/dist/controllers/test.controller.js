"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeTestSession = exports.saveTestSession = exports.getTestResults = exports.submitAcademicTest = exports.getAcademicQuestions = void 0;
const User_1 = __importDefault(require("../models/User"));
const Question_1 = __importDefault(require("../models/Question"));
const logger_1 = require("../utils/logger");
/**
 * Get questions for academic test
 */
const getAcademicQuestions = async (req, res) => {
    try {
        const userId = req.userId;
        logger_1.logger.info(`Getting academic questions for user: ${userId}`);
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            logger_1.logger.error(`User not found: ${userId}`);
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Check if user has already taken the test
        // Priority: examCompleted should be the main indicator
        if (user.examCompleted) {
            logger_1.logger.info(`User ${userId} has already taken the academic test (examCompleted: true)`);
            return res.status(400).json({
                success: false,
                message: 'You have already taken the academic test',
                examCompleted: user.examCompleted,
                testScores: user.testScores?.fundamentals,
            });
        }
        // If examCompleted is false but testScores exist, allow retaking (this handles data inconsistency)
        if (user.testScores?.fundamentals && !user.examCompleted) {
            logger_1.logger.info(`User ${userId} has testScores but examCompleted is false - allowing retake`);
        }
        // Get ALL questions from database (no limit)
        logger_1.logger.info('Fetching all questions from database...');
        // Get all math questions (subject: "Mathematics")
        const mathQuestions = await Question_1.default.find({
            subject: 'Mathematics',
        })
            .select('-correctAnswer -explanation'); // Don't send answers to client
        // Get all science questions (subject: "Science" or "Physics", "Chemistry", "Biology")
        const scienceQuestions = await Question_1.default.find({
            subject: { $in: ['Science', 'Physics', 'Chemistry', 'Biology'] },
        })
            .select('-correctAnswer -explanation');
        // Get all english questions (subject: "English")
        const englishQuestions = await Question_1.default.find({
            subject: 'English',
        })
            .select('-correctAnswer -explanation');
        // Get all social science questions (subject: "Social Science", "History", "Geography", "Civics")
        const socialScienceQuestions = await Question_1.default.find({
            subject: { $in: ['Social Science', 'History', 'Geography', 'Civics'] },
        })
            .select('-correctAnswer -explanation');
        // Combine all questions
        let questions = [
            ...mathQuestions,
            ...scienceQuestions,
            ...englishQuestions,
            ...socialScienceQuestions,
        ];
        logger_1.logger.info(`Found ${questions.length} questions from DB (Math: ${mathQuestions.length}, Science: ${scienceQuestions.length}, English: ${englishQuestions.length}, Social: ${socialScienceQuestions.length})`);
        // If we have fewer than expected questions from DB, try to get more from all subjects
        if (questions.length < 10) {
            logger_1.logger.info('Not enough questions found, trying to get any available questions...');
            // Get any available questions to reach a minimum count
            const additionalQuestions = await Question_1.default.find({
                _id: { $nin: questions.map(q => q._id) } // Exclude already selected questions
            })
                .limit(50 - questions.length) // Get up to 50 total questions
                .select('-correctAnswer -explanation');
            questions = [...questions, ...additionalQuestions];
            logger_1.logger.info(`After adding additional questions: ${questions.length} total questions`);
        }
        // If still not enough questions in database, use sample questions as fallback
        if (questions.length < 4) {
            logger_1.logger.warn('Very few questions in database, using sample questions as fallback...');
            // Create sample questions for testing
            const sampleQuestions = [
                {
                    _id: 'sample1',
                    id: 1,
                    text: "What is 2 + 2?",
                    options: ["3", "4", "5", "6"],
                    correctAnswer: 1, // Index of correct option (0-based)
                    subject: "Mathematics",
                    difficulty: "Easy",
                    class: 10,
                    board: "All",
                    timeLimit: 60,
                    explanation: "Basic addition: 2 + 2 = 4"
                },
                {
                    _id: 'sample2',
                    id: 2,
                    text: "What is the chemical symbol for water?",
                    options: ["H2O", "CO2", "NaCl", "O2"],
                    correctAnswer: 0, // Index of correct option (0-based)
                    subject: "Science",
                    difficulty: "Easy",
                    class: 10,
                    board: "All",
                    timeLimit: 60,
                    explanation: "Water molecule consists of 2 hydrogen atoms and 1 oxygen atom"
                },
                {
                    _id: 'sample3',
                    id: 3,
                    text: "Who wrote 'Romeo and Juliet'?",
                    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                    correctAnswer: 1, // Index of correct option (0-based)
                    subject: "English",
                    difficulty: "Medium",
                    class: 10,
                    board: "All",
                    timeLimit: 60,
                    explanation: "William Shakespeare wrote Romeo and Juliet in the early part of his career"
                },
                {
                    _id: 'sample4',
                    id: 4,
                    text: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Rome"],
                    correctAnswer: 2, // Index of correct option (0-based)
                    subject: "Social Science",
                    difficulty: "Easy",
                    class: 10,
                    board: "All",
                    timeLimit: 60,
                    explanation: "Paris has been the capital of France since 987 AD"
                }
            ];
            questions = sampleQuestions; // Type assertion for sample questions
            logger_1.logger.warn('Using sample questions because insufficient database questions');
        }
        // Calculate dynamic time limit: number of questions × 0.75 minutes (45 seconds per question)
        const timeLimit = Math.ceil(questions.length * 0.75); // Round up to nearest minute
        // Group questions by subject for better organization
        const groupedQuestions = {
            Mathematics: mathQuestions,
            Science: scienceQuestions,
            English: englishQuestions,
            SocialScience: socialScienceQuestions
        };
        logger_1.logger.info(`Test configured with ${questions.length} questions and ${timeLimit} minutes time limit`);
        return res.status(200).json({
            success: true,
            message: 'Test questions retrieved successfully',
            data: {
                questions,
                groupedQuestions,
                timeLimit, // Dynamic time based on question count
                totalQuestions: questions.length,
                questionsPerSubject: {
                    Mathematics: mathQuestions.length,
                    Science: scienceQuestions.length,
                    English: englishQuestions.length,
                    SocialScience: socialScienceQuestions.length
                }
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting academic questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get questions',
        });
    }
};
exports.getAcademicQuestions = getAcademicQuestions;
/**
 * Submit academic test
 */
const submitAcademicTest = async (req, res) => {
    try {
        const userId = req.userId;
        const { answers, timeSpent } = req.body;
        // Validate answers format and handle empty submissions (auto-submit scenarios)
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid answers format',
            });
        }
        // Handle case where student exits fullscreen (auto-submit with potentially no answers)
        if (answers.length === 0) {
            // Create a zero score result for auto-submit
            const zeroResult = {
                totalQuestions: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                percentageScore: 0,
                subjectScores: {
                    Mathematics: 0,
                    Science: 0,
                    English: 0,
                    'Social Science': 0,
                },
                timeSpent: 0,
                submittedAt: new Date().toISOString()
            };
            // Update user with zero score
            await User_1.default.findByIdAndUpdate(userId, {
                $set: {
                    'testScores.fundamentals': {
                        total: 0,
                        subjects: { math: 0, science: 0, english: 0, socialScience: 0 },
                        weaknesses: ['Mathematics', 'Science', 'English', 'Social Science'],
                        strengths: [],
                        date: new Date(),
                        timeTaken: 0
                    },
                    examCompleted: true,
                    examDate: new Date(),
                },
            });
            return res.status(200).json({
                success: true,
                message: 'Test auto-submitted due to violation',
                data: zeroResult,
                examCompleted: true,
            });
        }
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Check if user has already taken the test
        if (user.examCompleted) {
            return res.status(400).json({
                success: false,
                message: 'You have already taken the academic test',
                examCompleted: user.examCompleted,
                testScores: user.testScores?.fundamentals,
            });
        }
        // Process answers and calculate score
        const correctAnswers = {
            total: 0,
            subjects: {
                math: 0,
                physics: 0,
                chemistry: 0,
                biology: 0,
                socialScience: 0,
            },
        };
        // Track questions by subject for percentage calculation
        const subjectCounts = {
            math: 0,
            physics: 0,
            chemistry: 0,
            biology: 0,
            socialScience: 0,
        };
        const weaknesses = [];
        const strengths = [];
        // Use time from frontend if provided (in seconds), otherwise estimate (fallback)
        const timeTaken = timeSpent
            ? Math.ceil(timeSpent / 60) // Convert seconds to minutes if provided
            : Math.ceil((answers.length * 0.75)); // Fallback: estimate 45 seconds per question
        // First, get total questions available by subject to calculate proper percentages
        const totalQuestionsBySubject = {
            math: 0,
            physics: 0,
            chemistry: 0,
            biology: 0,
            socialScience: 0,
        };
        // Count total questions available in each subject from the test
        // Use the same query logic as in getAcademicQuestions to ensure consistency
        try {
            // Debug: First check what questions exist
            const allQuestions = await Question_1.default.find({}).limit(5);
            console.log('Sample questions for debugging:', allQuestions.map(q => ({
                subject: q.subject,
                class: q.class
            })));
            // Count using the exact same criteria as in getAcademicQuestions
            const mathTotal = await Question_1.default.countDocuments({
                subject: 'Mathematics'
            });
            const physicsTotal = await Question_1.default.countDocuments({
                subject: { $in: ['Physics'] }
            });
            const chemistryTotal = await Question_1.default.countDocuments({
                subject: { $in: ['Chemistry'] }
            });
            const biologyTotal = await Question_1.default.countDocuments({
                subject: { $in: ['Biology'] }
            });
            const socialScienceTotal = await Question_1.default.countDocuments({
                subject: { $in: ['Social Science', 'History', 'Geography', 'Civics'] }
            });
            totalQuestionsBySubject.math = mathTotal;
            totalQuestionsBySubject.physics = physicsTotal;
            totalQuestionsBySubject.chemistry = chemistryTotal;
            totalQuestionsBySubject.biology = biologyTotal;
            totalQuestionsBySubject.socialScience = socialScienceTotal;
            console.log('Total questions by subject (detailed):', totalQuestionsBySubject);
            console.log('Math:', mathTotal, 'Physics:', physicsTotal, 'Chemistry:', chemistryTotal, 'Biology:', biologyTotal, 'Social Science:', socialScienceTotal);
            // If counts are still 0, fallback to the actual questions fetched for this test
            const totalFromAllCounts = mathTotal + physicsTotal + chemistryTotal + biologyTotal + socialScienceTotal;
            if (totalFromAllCounts === 0) {
                console.log('Database count returned 0, using questions from original query...');
                // Use the exact same query that getAcademicQuestions uses to get actual counts
                const mathQuestions = await Question_1.default.find({
                    subject: 'Mathematics'
                });
                const physicsQuestions = await Question_1.default.find({
                    subject: 'Physics'
                });
                const chemistryQuestions = await Question_1.default.find({
                    subject: 'Chemistry'
                });
                const biologyQuestions = await Question_1.default.find({
                    subject: 'Biology'
                });
                const socialScienceQuestions = await Question_1.default.find({
                    subject: { $in: ['Social Science', 'History', 'Geography', 'Civics'] }
                });
                totalQuestionsBySubject.math = mathQuestions.length;
                totalQuestionsBySubject.physics = physicsQuestions.length;
                totalQuestionsBySubject.chemistry = chemistryQuestions.length;
                totalQuestionsBySubject.biology = biologyQuestions.length;
                totalQuestionsBySubject.socialScience = socialScienceQuestions.length;
                console.log('Updated total questions by subject (from actual query):', totalQuestionsBySubject);
            }
        }
        catch (error) {
            console.error('Error counting questions by subject:', error);
            // Use reasonable fallback values: 10 questions per subject
            totalQuestionsBySubject.math = 10;
            totalQuestionsBySubject.physics = 10;
            totalQuestionsBySubject.chemistry = 10;
            totalQuestionsBySubject.biology = 10;
            totalQuestionsBySubject.socialScience = 10;
            console.log('Using fallback values:', totalQuestionsBySubject);
        }
        // Process each answer with position-based subject mapping
        for (let answerIndex = 0; answerIndex < answers.length; answerIndex++) {
            const answer = answers[answerIndex];
            const { questionId, selectedOption } = answer;
            console.log(`Processing answer ${answerIndex + 1}: questionId=${questionId}, selectedOption=${selectedOption}`);
            // Map subject based on question position
            // 1-10: Math, 11-20: Physics, 21-30: Chemistry, 31-40: Biology, 41-50: Social Science
            let subject = 'math';
            if (answerIndex < 10) {
                subject = 'math';
            }
            else if (answerIndex < 20) {
                // Questions 11-20 are Physics
                subject = 'physics';
            }
            else if (answerIndex < 30) {
                // Questions 21-30 are Chemistry
                subject = 'chemistry';
            }
            else if (answerIndex < 40) {
                // Questions 31-40 are Biology
                subject = 'biology';
            }
            else if (answerIndex < 50) {
                // Questions 41-50 are Social Science
                subject = 'socialScience';
            }
            else {
                // For extra questions beyond 50, cycle through subjects
                const extraIndex = (answerIndex - 50) % 5;
                subject = ['math', 'physics', 'chemistry', 'biology', 'socialScience'][extraIndex];
            }
            console.log(`Question ${answerIndex + 1} mapped to subject: ${subject}`);
            // Find question in database for correct answer
            let isCorrect = false;
            try {
                const question = await Question_1.default.findById(questionId);
                if (question) {
                    console.log(`Found question: subject=${question.subject}, correctAnswer=${question.correctAnswer}`);
                    // Check if answer is correct
                    const selectedOptionNum = Number(selectedOption);
                    const correctAnswerNum = Number(question.correctAnswer);
                    isCorrect = selectedOptionNum === correctAnswerNum;
                    console.log(`Answer check: selectedOption=${selectedOptionNum}, correctAnswer=${correctAnswerNum}, isCorrect=${isCorrect}, subject=${subject}`);
                }
                else {
                    console.log(`Question not found in database for ID: ${questionId}`);
                }
            }
            catch (error) {
                logger_1.logger.error(`Error finding question ${questionId}:`, error);
                // Fallback: For sample questions, use position-based correct answers
                const sampleAnswers = [1, 0, 1, 2]; // Correct answers for sample questions
                if (answerIndex < sampleAnswers.length) {
                    isCorrect = Number(selectedOption) === sampleAnswers[answerIndex];
                }
            }
            // Increment subject count (questions attempted in this subject)
            subjectCounts[subject]++;
            // Check if answer is correct
            if (isCorrect) {
                correctAnswers.subjects[subject]++;
                correctAnswers.total++;
            }
            console.log(`After processing: subject=${subject}, isCorrect=${isCorrect}`);
        }
        console.log('Final counts:');
        console.log('correctAnswers:', correctAnswers);
        console.log('subjectCounts (attempted):', subjectCounts);
        console.log('totalQuestionsBySubject (available):', totalQuestionsBySubject);
        console.log('Total answers processed:', answers.length);
        // Calculate total available questions across all subjects
        const totalAvailableQuestions = Object.values(totalQuestionsBySubject).reduce((sum, count) => sum + count, 0);
        // Calculate percentages based on questions attempted per subject
        const subjectPercentages = {};
        Object.keys(correctAnswers.subjects).forEach((subjectKey) => {
            const subject = subjectKey;
            const questionsAttemptedInSubject = subjectCounts[subject];
            if (questionsAttemptedInSubject > 0) {
                // Calculate percentage based on questions attempted in this subject
                const percentage = Math.round((correctAnswers.subjects[subject] / questionsAttemptedInSubject) * 100);
                // Ensure percentage is a valid number
                subjectPercentages[subject] = isNaN(percentage) ? 0 : percentage;
                console.log(`${subject}: ${correctAnswers.subjects[subject]} correct out of ${questionsAttemptedInSubject} attempted = ${percentage}%`);
                // Determine strengths (>= 70%) and weaknesses (< 50%) based on percentage of attempted questions
                if (percentage >= 70) {
                    strengths.push(subject.charAt(0).toUpperCase() + subject.slice(1));
                }
                else if (percentage < 50) {
                    weaknesses.push(subject.charAt(0).toUpperCase() + subject.slice(1));
                }
            }
            else {
                // If no questions attempted in this subject, percentage is 0
                subjectPercentages[subject] = 0;
                console.log(`${subject}: No questions attempted in this subject`);
            }
        });
        // Calculate total percentage based on questions attempted in the test
        const totalQuestionsAttempted = answers.length;
        const totalPercentage = totalQuestionsAttempted > 0 ?
            Math.round((correctAnswers.total / totalQuestionsAttempted) * 100) : 0;
        const safePercentage = isNaN(totalPercentage) ? 0 : totalPercentage;
        const incorrectAnswers = Math.max(0, totalQuestionsAttempted - correctAnswers.total);
        console.log(`Overall: ${correctAnswers.total} correct out of ${totalQuestionsAttempted} attempted = ${safePercentage}%`);
        // Create test scores object matching the user structure (for database)
        const academicScore = {
            total: safePercentage,
            subjects: {
                math: subjectPercentages.math || 0,
                physics: subjectPercentages.physics || 0,
                chemistry: subjectPercentages.chemistry || 0,
                biology: subjectPercentages.biology || 0,
                socialScience: subjectPercentages.socialScience || 0,
            },
            weaknesses: weaknesses,
            strengths: strengths,
            date: new Date(),
            timeTaken: timeTaken
        };
        // Create response data matching SecureTestResults interface
        const responseData = {
            totalQuestions: totalAvailableQuestions, // Total questions available in the test
            questionsAttempted: answers.length, // Questions the user actually answered
            correctAnswers: correctAnswers.total,
            incorrectAnswers: incorrectAnswers,
            unansweredQuestions: Math.max(0, totalQuestionsAttempted - answers.length), // Questions not answered
            percentageScore: safePercentage,
            subjectScores: {
                Mathematics: subjectPercentages.math || 0,
                Physics: subjectPercentages.physics || 0,
                Chemistry: subjectPercentages.chemistry || 0,
                Biology: subjectPercentages.biology || 0,
                'Social Science': subjectPercentages.socialScience || 0,
            },
            subjectBreakdown: {
                Mathematics: {
                    attempted: subjectCounts.math || 0,
                    correct: correctAnswers.subjects.math || 0,
                    available: totalQuestionsBySubject.math || 0,
                    percentage: subjectPercentages.math || 0
                },
                Physics: {
                    attempted: subjectCounts.physics || 0,
                    correct: correctAnswers.subjects.physics || 0,
                    available: totalQuestionsBySubject.physics || 0,
                    percentage: subjectPercentages.physics || 0
                },
                Chemistry: {
                    attempted: subjectCounts.chemistry || 0,
                    correct: correctAnswers.subjects.chemistry || 0,
                    available: totalQuestionsBySubject.chemistry || 0,
                    percentage: subjectPercentages.chemistry || 0
                },
                Biology: {
                    attempted: subjectCounts.biology || 0,
                    correct: correctAnswers.subjects.biology || 0,
                    available: totalQuestionsBySubject.biology || 0,
                    percentage: subjectPercentages.biology || 0
                },
                'Social Science': {
                    attempted: subjectCounts.socialScience || 0,
                    correct: correctAnswers.subjects.socialScience || 0,
                    available: totalQuestionsBySubject.socialScience || 0,
                    percentage: subjectPercentages.socialScience || 0
                }
            },
            timeSpent: timeTaken * 60, // Convert minutes to seconds for frontend
            submittedAt: new Date().toISOString()
        };
        console.log('Final response data:', responseData);
        console.log('Subject percentages:', subjectPercentages);
        console.log('Total percentage:', safePercentage);
        // Update user with test scores and mark exam as completed
        await User_1.default.findByIdAndUpdate(userId, {
            $set: {
                'testScores.fundamentals': academicScore,
                examCompleted: true,
                examDate: new Date(),
            },
        });
        res.status(200).json({
            success: true,
            message: 'Test submitted successfully',
            data: responseData, // Use 'data' key to match frontend expectations
            examCompleted: true,
        });
    }
    catch (error) {
        logger_1.logger.error('Error submitting academic test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit test',
        });
    }
};
exports.submitAcademicTest = submitAcademicTest;
/**
 * Get test results
 */
const getTestResults = async (req, res) => {
    try {
        const userId = req.userId;
        const { testId } = req.params;
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Check if test exists
        if (testId === 'academic') {
            if (!user.testScores?.fundamentals) {
                return res.status(404).json({
                    success: false,
                    message: 'You have not taken the academic test yet',
                });
            }
            return res.status(200).json({
                success: true,
                results: user.testScores.fundamentals,
            });
        }
        // If test ID is not recognized
        res.status(404).json({
            success: false,
            message: 'Test not found',
        });
    }
    catch (error) {
        logger_1.logger.error('Error getting test results:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get test results',
        });
    }
};
exports.getTestResults = getTestResults;
/**
 * Save test session on fullscreen exit
 */
const saveTestSession = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentQuestionIndex, answers, timeRemaining, violationCount } = req.body;
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Save current test session state
        await User_1.default.findByIdAndUpdate(userId, {
            $set: {
                'testSession': {
                    currentQuestionIndex,
                    answers,
                    timeRemaining,
                    violationCount: violationCount || 0,
                    lastSaved: new Date(),
                    canResume: violationCount < 2, // Allow resume only if less than 2 violations
                    resumeAvailableAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
                }
            }
        });
        logger_1.logger.info(`Test session saved for user ${userId}, violations: ${violationCount}`);
        return res.status(200).json({
            success: true,
            message: 'Test session saved successfully',
            canResume: violationCount < 2,
            resumeAvailableAt: new Date(Date.now() + 10 * 60 * 1000)
        });
    }
    catch (error) {
        logger_1.logger.error('Error saving test session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save test session',
        });
    }
};
exports.saveTestSession = saveTestSession;
/**
 * Resume test session
 */
const resumeTestSession = async (req, res) => {
    try {
        const userId = req.userId;
        // Find user
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        const testSession = user.testSession;
        if (!testSession) {
            return res.status(404).json({
                success: false,
                message: 'No saved test session found',
            });
        }
        // Check if user can resume (within 10 minutes and less than 2 violations)
        const now = new Date();
        const resumeAvailableAt = new Date(testSession.resumeAvailableAt);
        if (!testSession.canResume) {
            return res.status(400).json({
                success: false,
                message: 'You have exceeded the maximum number of violations. Test cannot be resumed.',
            });
        }
        if (now < resumeAvailableAt) {
            const waitTime = Math.ceil((resumeAvailableAt.getTime() - now.getTime()) / (1000 * 60));
            return res.status(400).json({
                success: false,
                message: `Please wait ${waitTime} more minutes before resuming the test.`,
                waitTime
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Test session can be resumed',
            data: {
                currentQuestionIndex: testSession.currentQuestionIndex,
                answers: testSession.answers,
                timeRemaining: testSession.timeRemaining,
                violationCount: testSession.violationCount
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error resuming test session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resume test session',
        });
    }
};
exports.resumeTestSession = resumeTestSession;
