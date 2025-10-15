// ============================================
// Dashboard Preview Component
// Location: src/components/DashboardPreview.jsx
//
// DAY 0: "Starts Tomorrow" waiting screen
// ============================================

import React, { useState, useEffect } from 'react';

function DashboardPreview({ onNavigate }) {
  const [challenge, setChallenge] = useState(null);
  const [tomorrowDate, setTomorrowDate] = useState('');

  useEffect(() => {
    // Load challenge data
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const data = JSON.parse(savedChallenge);
      setChallenge(data);

      // Format tomorrow's date
      const tomorrow = new Date(data.startDate);
      const options = { weekday: 'long', month: 'short', day: 'numeric' };
      setTomorrowDate(tomorrow.toLocaleDateString('en-US', options));
    }
  }, []);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  // Get current week's goal
  const getWeek1Goal = () => {
    return challenge.goals.week1;
  };

  return (
    <div className="screen-container">
      <div className="screen-card dashboard-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        {/* Challenge Header */}
        <div className="challenge-header">
          <div className="challenge-icon">🚶‍♂️</div>
          <h1 className="challenge-title">Walk Challenge</h1>
          <div className="level-badge">
            {challenge.level.toUpperCase()} LEVEL
          </div>
        </div>

        {/* Starts Tomorrow Message */}
        <div className="countdown-box">
          <div className="countdown-icon">⏰</div>
          <h2 className="countdown-title">Challenge Starts Tomorrow!</h2>
          <p className="countdown-date">Day 1 begins: Tomorrow</p>
        </div>

        {/* Tomorrow's Goal */}
        <div className="goal-preview">
          <div className="goal-label">Your First Goal</div>
          <div className="goal-value">Walk {getWeek1Goal()} minutes</div>
          <p className="goal-help">
            Check in tomorrow to track your progress and earn points!
          </p>
        </div>

        {/* Check-in Button (Disabled) */}
        <button className="check-in-button disabled" disabled>
          <span className="button-icon">🔒</span>
          <span>Check-In Available Tomorrow</span>
        </button>

        {/* What to Expect */}
        <div className="info-box">
          <div className="info-title">📋 What to Expect</div>
          <ul className="info-list">
            <li>Daily check-ins take 30 seconds</li>
            <li>Earn 2 points for on-time check-ins</li>
            <li>Build your streak day by day</li>
            <li>Get 50/60 points to earn your sticker</li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="nav-buttons">
          <button 
            className="nav-button"
            onClick={() => onNavigate('roadmap')}
          >
            View Full Roadmap
          </button>
          <button 
            className="nav-button"
            onClick={() => onNavigate('settings')}
          >
            Settings
          </button>
        </div>

        <p className="reminder-text">
          📧 We'll email you tomorrow when Day 1 begins!
        </p>
      </div>

      <style jsx>{`
        .dashboard-card {
          max-width: 500px;
        }

        .challenge-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .challenge-icon {
          font-size: 64px;
          margin-bottom: 12px;
        }

        .challenge-title {
          font-size: 28px;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 12px;
        }

        .level-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .countdown-box {
          background: linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%);
          border: 2px solid #f59e0b;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 24px;
        }

        .countdown-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .countdown-title {
          font-size: 22px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 8px;
        }

        .countdown-date {
          font-size: 16px;
          color: #92400e;
          font-weight: 600;
        }

        .goal-preview {
          background: #f7fafc;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 24px;
          border: 2px solid #e2e8f0;
        }

        .goal-label {
          font-size: 13px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .goal-value {
          font-size: 28px;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .goal-help {
          font-size: 14px;
          color: #718096;
          line-height: 1.5;
        }

        .check-in-button {
          width: 100%;
          padding: 18px;
          font-size: 18px;
          font-weight: 700;
          background: #e2e8f0;
          color: #a0aec0;
          border: 2px solid #cbd5e0;
          border-radius: 12px;
          cursor: not-allowed;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .button-icon {
          font-size: 20px;
        }

        .info-box {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .info-title {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 12px;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-list li {
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
        }

        .info-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #48bb78;
          font-weight: 700;
        }

        .nav-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .nav-button {
          padding: 14px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          color: #4a5568;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-button:hover {
          border-color: #667eea;
          color: #667eea;
          background: #f7fafc;
        }

        .reminder-text {
          text-align: center;
          font-size: 13px;
          color: #718096;
        }

        @media (max-width: 600px) {
          .challenge-icon {
            font-size: 48px;
          }

          .challenge-title {
            font-size: 24px;
          }

          .countdown-title {
            font-size: 20px;
          }

          .goal-value {
            font-size: 24px;
          }

          .nav-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default DashboardPreview;
