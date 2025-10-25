import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SecureTest.css';

// Helper function to get API URL
const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  return `${baseUrl}/api`
}

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctOption: string | number; // Backend sends string, frontend might expect number
  correctAnswer?: string; // Backend also has this field
  subject: string;
  difficulty: string;
  class: number;
  topics?: string[]; // Make optional since backend might not always send this
} 

interface TestData {
  questions: Question[];
  uniqueSubjects: string[];
  totalQuestions: number;
  timer: {
    minutes: number;
    seconds: number;
  };
}



const SecureTest: React.FC = () => {
  const navigate = useNavigate();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Regulations screen state
  const [showRegulations, setShowRegulations] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Test state
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  
  // Filtered questions based on selected subject
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [filteredCurrentIndex, setFilteredCurrentIndex] = useState(0);

  // Disable browser functions (only when test has started)
  useEffect(() => {
    // Only enable security features after test has started
    if (!testStarted) return;

    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable Ctrl+C, Ctrl+V, Ctrl+A, F12, Alt+Tab, etc.
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 'x')) ||
        e.key === 'F12' ||
        (e.altKey && e.key === 'Tab') ||
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        e.stopPropagation();
        alert('This action is not allowed during the test!');
        return false;
      }
    };

    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert('Right-click is disabled during the test!');
      return false;
    };

    const disableF11 = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        alert('Fullscreen toggle is not allowed during the test!');
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert('Tab switching detected! Please stay on the test page.');
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message = 'Are you sure you want to leave the test? Your progress may be lost.';
      e.returnValue = message;
      return message;
    };

    // Handle fullscreen exit - auto-submit test
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testStarted && !testSubmitted) {
        alert('⚠️ Test terminated! You exited fullscreen mode. Your test will be auto-submitted.');
        handleSubmitTest();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableF11);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableF11);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.warn('Could not exit fullscreen mode:', err);
        });
      }
    };
  }, [testStarted, testSubmitted]);

  // Fetch test questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${getApiUrl()}/tests/academic`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const data = response.data.data;
          
          // Transform backend data to frontend expected format
          const transformedData: TestData = {
            questions: data.questions,
            uniqueSubjects: [...new Set(data.questions.map((q: Question) => q.subject))] as string[],
            totalQuestions: data.totalQuestions || data.questions.length,
            timer: {
              minutes: data.timeLimit || 30,
              seconds: (data.timeLimit || 30) * 60
            }
          };
          
          setTestData(transformedData);
          setTimeRemaining(transformedData.timer.seconds);
          setFilteredQuestions(transformedData.questions);
          
          // Set default subject if available
          if (transformedData.uniqueSubjects.length > 0) {
            setSelectedSubject('all');
          }
        } else {
          setError(response.data.message || 'Failed to fetch questions');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch questions');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !testSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, testSubmitted]);

  // Filter questions when subject changes
  useEffect(() => {
    if (!testData) return;

    if (selectedSubject === 'all') {
      setFilteredQuestions(testData.questions);
    } else {
      const filtered = testData.questions.filter(q => q.subject === selectedSubject);
      setFilteredQuestions(filtered);
    }
    setFilteredCurrentIndex(0);
  }, [selectedSubject, testData]);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
  };

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < filteredQuestions.length) {
      setFilteredCurrentIndex(index);
    }
  };

  const getQuestionStatus = (questionId: string): 'current' | 'answered' | 'unanswered' => {
    const currentQuestion = filteredQuestions[filteredCurrentIndex];
    if (currentQuestion && currentQuestion._id === questionId) {
      return 'current';
    }
    return answers.hasOwnProperty(questionId) ? 'answered' : 'unanswered';
  };

  const handleSubmitTest = async () => {
    if (testSubmitted) return;
    
    setTestSubmitted(true);
    
    try {
      const token = localStorage.getItem('token');
      const timeSpent = testData ? testData.timer.seconds - timeRemaining : 0;
      
      // Convert answers format from {questionId: optionIndex} to [{questionId, selectedOption}]
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));
      
      const response = await axios.post(`${getApiUrl()}/tests/academic/submit`, {
        answers: formattedAnswers,
        timeSpent
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Store results in localStorage or sessionStorage for the results page
        sessionStorage.setItem('testResults', JSON.stringify(response.data.data));
        // Set flag to indicate test was just completed (for dashboard refresh)
        sessionStorage.setItem('testJustCompleted', 'true');
        // Navigate to results page
        navigate('/test/results');
      } else {
        setError(response.data.message || 'Failed to submit test');
        setTestSubmitted(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit test');
      setTestSubmitted(false);
      console.error('Error submitting test:', err);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle start test button click
  const handleStartTest = () => {
    setShowRegulations(false);
    setTestStarted(true);
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Could not enter fullscreen mode:', err);
      });
    }
  };

  if (loading) {
    return (
      <div className="secure-test-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading test questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="secure-test-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!testData || filteredQuestions.length === 0) {
    return (
      <div className="secure-test-container">
        <div className="error-message">
          <h2>No Questions Available</h2>
          <p>No questions found for the selected subject.</p>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  // Show regulations screen before starting test
  if (showRegulations && !testStarted) {
    return (
      <div className="secure-test-container">
        <div className="regulations-screen">
          <div className="regulations-content">
            <h1>Test Instructions & Regulations</h1>
            
            <div className="regulations-section">
              <h2>📋 Test Overview</h2>
              <ul>
                <li><strong>Total Questions:</strong> {testData.totalQuestions}</li>
                <li><strong>Time Allowed:</strong> {testData.timer.minutes} minutes ({Math.floor(testData.timer.minutes / 60)}h {Math.floor(testData.timer.minutes % 60)}m)</li>
                <li><strong>Subjects:</strong> {testData.uniqueSubjects.join(', ')}</li>
                <li><strong>Time per Question:</strong> 45 seconds</li>
              </ul>
            </div>

            <div className="regulations-section warning">
              <h2>⚠️ Important Rules</h2>
              <ul>
                <li>The test will automatically enter <strong>FULLSCREEN MODE</strong></li>
                <li><strong>DO NOT</strong> exit fullscreen during the test</li>
                <li><strong>DO NOT</strong> switch tabs or windows</li>
                <li><strong>DO NOT</strong> minimize the browser</li>
                <li>Tab switching will be detected and logged</li>
                <li>Violations may result in test termination</li>
              </ul>
            </div>

            <div className="regulations-section">
              <h2>🚫 Prohibited Actions</h2>
              <ul>
                <li><strong>Copy/Paste:</strong> Ctrl+C, Ctrl+V, Ctrl+X are disabled</li>
                <li><strong>Right-click:</strong> Context menu is disabled</li>
                <li><strong>Developer Tools:</strong> F12, Ctrl+Shift+I are disabled</li>
                <li><strong>View Source:</strong> Ctrl+U is disabled</li>
                <li><strong>Screenshots:</strong> PrintScreen is disabled</li>
                <li><strong>Select All:</strong> Ctrl+A is disabled</li>
              </ul>
            </div>

            <div className="regulations-section">
              <h2>✅ Test Features</h2>
              <ul>
                <li><strong>Subject Navigation:</strong> Switch between subjects anytime</li>
                <li><strong>Question Grid:</strong> Jump to any question number</li>
                <li><strong>Color Coding:</strong>
                  <ul>
                    <li>🔵 Blue = Current Question</li>
                    <li>🟢 Green = Answered</li>
                    <li>⚪ Gray = Unanswered</li>
                  </ul>
                </li>
                <li><strong>Auto-Save:</strong> Your answers are saved automatically</li>
                <li><strong>Auto-Submit:</strong> Test will submit when timer ends</li>
              </ul>
            </div>

            <div className="regulations-section">
              <h2>📝 How to Take the Test</h2>
              <ol>
                <li>Read each question carefully</li>
                <li>Select one option (A, B, C, or D)</li>
                <li>Use Previous/Next buttons to navigate</li>
                <li>Use the question grid to jump to specific questions</li>
                <li>Use subject tabs to filter questions by subject</li>
                <li>Review your answers before submitting</li>
                <li>Click "Submit Test" when done</li>
              </ol>
            </div>

            <div className="regulations-section warning">
              <h2>⏰ Timer Information</h2>
              <ul>
                <li>Timer starts when you click "Start Test"</li>
                <li>Timer is displayed in the top-right corner</li>
                <li>Test will <strong>AUTO-SUBMIT</strong> when timer reaches 0:00</li>
                <li>You can submit before time runs out</li>
                <li><strong>WARNING:</strong> Once submitted, you cannot change answers</li>
              </ul>
            </div>

            <div className="regulations-footer">
              <div className="checkbox-container">
                <input 
                  type="checkbox" 
                  id="agree-terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <label htmlFor="agree-terms">
                  I have read and understood all the instructions and regulations. I agree to follow all rules during the test.
                </label>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="back-btn"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button 
                  id="start-test-btn"
                  className="start-test-btn"
                  onClick={handleStartTest}
                  disabled={!agreedToTerms}
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = filteredQuestions[filteredCurrentIndex];
  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="secure-test-container">
      {/* Header */}
      <div className="test-header">
        <div className="test-info">
          <h1>Secure Test</h1>
          <div className="test-stats">
            <span>Questions: {totalAnswered}/{testData.totalQuestions}</span>
            <span className="timer">Time: {formatTime(timeRemaining)}</span>
          </div>
        </div>
        <button
          onClick={handleSubmitTest}
          disabled={testSubmitted}
          className="submit-btn-header"
        >
          {testSubmitted ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>

      {/* Main Content */}
      <div className="test-content">
        {/* Subject Selector */}
        <div className="subject-selector">
          <h3>Select Subject:</h3>
          <div className="subject-buttons">
            <button
              className={selectedSubject === 'all' ? 'active' : ''}
              onClick={() => handleSubjectChange('all')}
            >
              All Subjects ({testData.totalQuestions})
            </button>
            {testData.uniqueSubjects.map(subject => {
              const subjectQuestions = testData.questions.filter(q => q.subject === subject);
              return (
                <button
                  key={subject}
                  className={selectedSubject === subject ? 'active' : ''}
                  onClick={() => handleSubjectChange(subject)}
                >
                  {subject} ({subjectQuestions.length})
                </button>
              );
            })}
          </div>
        </div>

        <div className="test-layout">
          {/* Question Navigation Panel */}
          <div className="question-nav-panel">
            <h3>{selectedSubject === 'all' ? 'All Questions' : selectedSubject}</h3>
            <div className="question-grid">
              {filteredQuestions.map((question, index) => {
                const status = getQuestionStatus(question._id);
                return (
                  <button
                    key={question._id}
                    className={`question-nav-btn ${status}`}
                    onClick={() => navigateToQuestion(index)}
                  >
                    {testData.questions.findIndex(q => q._id === question._id) + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color current"></span>
                <span>Current</span>
              </div>
              <div className="legend-item">
                <span className="legend-color answered"></span>
                <span>Answered</span>
              </div>
              <div className="legend-item">
                <span className="legend-color unanswered"></span>
                <span>Unanswered</span>
              </div>
            </div>
          </div>

          {/* Question Display */}
          <div className="question-panel">
            {currentQuestion && (
              <>
                <div className="question-header">
                  <h2>
                    Question {testData.questions.findIndex(q => q._id === currentQuestion._id) + 1}
                    <span className="question-subject">({currentQuestion.subject})</span>
                  </h2>
                </div>

                <div className="question-content">
                  <p className="question-text">{currentQuestion.text}</p>
                  
                  <div className="options">
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className="option-label">
                        <input
                          type="radio"
                          name={`question-${currentQuestion._id}`}
                          value={index}
                          checked={answers[currentQuestion._id] === index}
                          onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                        />
                        <span className="option-text">
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="question-navigation">
                  <button
                    onClick={() => navigateToQuestion(filteredCurrentIndex - 1)}
                    disabled={filteredCurrentIndex === 0}
                    className="nav-btn prev-btn"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={() => handleClearAnswer(currentQuestion._id)}
                    disabled={!answers.hasOwnProperty(currentQuestion._id)}
                    className="nav-btn clear-btn"
                  >
                    Clear Answer
                  </button>
                  
                  <button
                    onClick={() => navigateToQuestion(filteredCurrentIndex + 1)}
                    disabled={filteredCurrentIndex === filteredQuestions.length - 1}
                    className="nav-btn next-btn"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureTest;
