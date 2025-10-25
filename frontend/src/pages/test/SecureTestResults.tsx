import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SecureTestResults.css';

interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentageScore: number;
  subjectScores: { [key: string]: number };
  timeSpent: number;
  submittedAt: string;
}

const SecureTestResults: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem('testResults');
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setResults(parsedResults);
      } catch (error) { 
        console.error('Error parsing test results:', error);
        navigate('/dashboard');
      }
    } else {
      // No results found, redirect to dashboard
      navigate('/dashboard');
    }
    
    setLoading(false);
  }, [navigate]);

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 80) return '#28a745'; // Green
    if (percentage >= 60) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  const getPerformanceMessage = (percentage: number): string => {
    if (percentage >= 90) return 'Outstanding! Excellent performance! 🎉';
    if (percentage >= 80) return 'Great job! You did very well! 👏';
    if (percentage >= 70) return 'Good work! Keep it up! 👍';
    if (percentage >= 60) return 'Fair performance. Room for improvement. 📚';
    if (percentage >= 50) return 'You passed, but need more practice. 💪';
    return 'Keep studying and try again! 📖';
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDashboard = () => {
    // Clear the results from sessionStorage
    sessionStorage.removeItem('testResults');
    // Set flag to indicate test was just completed (for dashboard refresh)
    sessionStorage.setItem('testJustCompleted', 'true');
    navigate('/dashboard');
  };



  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-container">
        <div className="error-message">
          <h2>No Results Found</h2>
          <p>Test results could not be loaded.</p>
          <button onClick={() => {
            sessionStorage.setItem('testJustCompleted', 'true');
            navigate('/dashboard');
          }}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const grade = getGrade(results.percentageScore);
  const gradeColor = getGradeColor(results.percentageScore);
  const performanceMessage = getPerformanceMessage(results.percentageScore);

  return (
    <div className="results-container">
      <div className="results-content">
        {/* Header */}
        <div className="results-header">
          <h1>🎓 Academic Test Results</h1>
          <p className="submission-time">Submitted on {formatDate(results.submittedAt)}</p>
        </div>

        {/* Overall Score Card */}
        <div className="score-card-main">
          <div className="score-circle" style={{ borderColor: gradeColor }}>
            <div className="score-percentage" style={{ color: gradeColor }}>
              {results.percentageScore}%
            </div>
            <div className="score-grade" style={{ color: gradeColor }}>
              {grade}
            </div>
          </div>
          <div className="score-details">
            <h2>{performanceMessage}</h2>
            <div className="score-stats">
              <div className="stat-item">
                <span className="stat-label">Total Questions:</span>
                <span className="stat-value">{results.totalQuestions}</span>
              </div>
              <div className="stat-item correct">
                <span className="stat-label">✅ Correct Answers:</span>
                <span className="stat-value">{results.correctAnswers}</span>
              </div>
              <div className="stat-item incorrect">
                <span className="stat-label">❌ Incorrect Answers:</span>
                <span className="stat-value">{results.incorrectAnswers}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">⏱️ Time Taken:</span>
                <span className="stat-value">{formatTime(results.timeSpent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div className="subject-performance">
          <h2>📊 Subject-wise Performance</h2>
          <div className="subject-grid">
            {Object.entries(results.subjectScores).map(([subject, score]) => (
              <div key={subject} className="subject-card">
                <div className="subject-header">
                  <h3>{subject}</h3>
                  <span className="subject-score" style={{ color: getGradeColor(score) }}>
                    {score}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${score}%`,
                      backgroundColor: getGradeColor(score)
                    }}
                  ></div>
                </div>
                <div className="subject-grade">
                  Grade: <strong style={{ color: getGradeColor(score) }}>{getGrade(score)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="performance-summary">
          <h2>📈 Performance Analysis</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <h3>Accuracy Rate</h3>
              <p className="summary-value">{results.percentageScore}%</p>
              <p className="summary-desc">
                You answered {results.correctAnswers} out of {results.totalQuestions} questions correctly
              </p>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">⏱️</div>
              <h3>Time Management</h3>
              <p className="summary-value">{formatTime(results.timeSpent)}</p>
              <p className="summary-desc">
                Average: {Math.round(results.timeSpent / results.totalQuestions)} seconds per question
              </p>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">🎯</div>
              <h3>Overall Grade</h3>
              <p className="summary-value" style={{ color: gradeColor }}>{grade}</p>
              <p className="summary-desc">
                {results.percentageScore >= 60 ? 'Congratulations! You passed!' : 'Keep practicing to improve!'}
              </p>
            </div>
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="strengths-weaknesses">
          <div className="strengths">
            <h3>💪 Strong Subjects</h3>
            <ul>
              {Object.entries(results.subjectScores)
                .filter(([_, score]) => score >= 70)
                .sort((a, b) => b[1] - a[1])
                .map(([subject, score]) => (
                  <li key={subject}>
                    <span className="subject-name">{subject}</span>
                    <span className="subject-percentage">{score}%</span>
                  </li>
                ))}
              {Object.entries(results.subjectScores).filter(([_, score]) => score >= 70).length === 0 && (
                <li className="no-items">No subjects scored above 70%</li>
              )}
            </ul>
          </div>
          
          <div className="weaknesses">
            <h3>📚 Areas for Improvement</h3>
            <ul>
              {Object.entries(results.subjectScores)
                .filter(([_, score]) => score < 60)
                .sort((a, b) => a[1] - b[1])
                .map(([subject, score]) => (
                  <li key={subject}>
                    <span className="subject-name">{subject}</span>
                    <span className="subject-percentage">{score}%</span>
                  </li>
                ))}
              {Object.entries(results.subjectScores).filter(([_, score]) => score < 60).length === 0 && (
                <li className="no-items">Great! All subjects scored above 60%</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button className="btn-primary" onClick={handleViewDashboard}>
            📊 View Dashboard
          </button>
        </div>

        {/* Download/Print Option */}
        <div className="results-footer">
          <p>Want to save these results? Take a screenshot or print this page.</p>
          <button className="btn-print" onClick={() => window.print()}>
            🖨️ Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecureTestResults;