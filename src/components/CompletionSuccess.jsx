// ============================================
// Completion Success Component
// Location: src/components/CompletionSuccess.jsx
//
// 50+ POINTS: Graduation celebration screen
// ============================================

import React, { useState, useEffect } from 'react';

function CompletionSuccess({ onSelectNextChallenge }) {
  const [challenge, setChallenge] = useState(null);
  const [maxStreak, setMaxStreak] = useState(0);
  const [daysCompleted, setDaysCompleted] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('walk_challenge');
    if (saved) {
      const data = JSON.parse(saved);
      setChallenge(data);

      // Calculate stats
      const completedDays = data.checkIns.filter(c => c.completed).length;
      setDaysCompleted(completedDays);

      // Calculate max streak
      let maxStreakCalc = 0;
      let currentStreakCalc = 0;
      data.checkIns.sort((a, b) => a.day - b.day).forEach(checkIn => {
        if (checkIn.completed) {
          currentStreakCalc++;
          maxStreakCalc = Math.max(maxStreakCalc, currentStreakCalc);
        } else {
          currentStreakCalc = 0;
        }
      });
      setMaxStreak(maxStreakCalc);
    }
  }, []);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen-container">
      <div className="screen-card completion-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        {/* Celebration Header */}
        <div className="celebration-header">
          <div className="trophy-icon">🏆</div>
          <h1 className="celebration-title">Challenge Complete!</h1>
          <p className="celebration-subtitle">
            You crushed the Walk Challenge
          </p>
        </div>

        {/* Final Stats */}
        <div className="final-stats">
          <div className="stat-row">
            <span className="stat-label">Final Points</span>
            <span className="stat-value">{challenge.totalPoints}/60 🎯</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Days Completed</span>
            <span className="stat-value">{daysCompleted}/30 ✓</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Longest Streak</span>
            <span className="stat-value">{maxStreak} days 🔥</span>
          </div>
        </div>

        {/* Sticker Claim */}
        <div className="sticker-claim">
          <div className="sticker-icon">🎖️</div>
          <div className="sticker-title">Claim Your Sticker!</div>
          <div className="sticker-text">
            Show this screen at your next Premier U appointment to receive your exclusive Walk Challenge achievement sticker!
          </div>
        </div>

        {/* Journey Progress */}
        <div className="journey-section">
          <div className="journey-title">Your Journey Progress</div>
          <div className="journey-grid">
            <div className="journey-item">
              <div className="journey-category">Movement</div>
              <div className="journey-progress">1/4 complete</div>
            </div>
            <div className="journey-item incomplete">
              <div className="journey-category">Nutrition</div>
              <div className="journey-progress">0/12 complete</div>
            </div>
            <div className="journey-item incomplete">
              <div className="journey-category">Awareness</div>
              <div className="journey-progress">0/6 complete</div>
            </div>
          </div>
        </div>

        {/* Next Challenge Options */}
        <div className="next-challenges">
          <div className="next-title">Choose Your Next Challenge</div>
          <div className="challenges-grid">
            <button 
              className="challenge-option"
              onClick={() => onSelectNextChallenge('bodyweight-low')}
            >
              <div className="challenge-emoji">💪</div>
              <div className="challenge-name">Bodyweight Low</div>
              <div className="challenge-category">Movement</div>
            </button>
            
            <button 
              className="challenge-option"
              onClick={() => onSelectNextChallenge('protein')}
            >
              <div className="challenge-emoji">🥩</div>
              <div className="challenge-name">Protein 100g</div>
              <div className="challenge-category">Nutrition</div>
            </button>
            
            <button 
              className="challenge-option"
              onClick={() => onSelectNextChallenge('sleep')}
            >
              <div className="challenge-emoji">🛌</div>
              <div className="challenge-name">Sleep 1</div>
              <div className="challenge-category">Awareness</div>
            </button>
          </div>
        </div>

        {/* Accountability CTA */}
        <div className="cta-box">
          <div className="cta-title">🚀 Ready to Level Up?</div>
          <div className="cta-text">
            Get daily text check-ins + trainer support for $49/month
          </div>
          <button className="cta-button">Add Accountability</button>
        </div>
      </div>

      <style jsx>{`
        .completion-card {
          max-width: 600px;
        }

        .celebration-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .trophy-icon {
          font-size: 80px;
          margin-bottom: 16px;
          animation: bounce 1s ease-in-out;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .celebration-title {
          font-size: 32px;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .celebration-subtitle {
          font-size: 18px;
          color: #718096;
        }

        .final-stats {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat-row:last-child {
          border-bottom: none;
        }

        .stat-label {
          font-size: 15px;
          color: #718096;
          font-weight: 600;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #2d3748;
        }

        .sticker-claim {
          background: linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%);
          border: 2px solid #f59e0b;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 24px;
        }

        .sticker-icon {
          font-size: 64px;
          margin-bottom: 12px;
        }

        .sticker-title {
          font-size: 20px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 8px;
        }

        .sticker-text {
          font-size: 14px;
          color: #92400e;
          line-height: 1.6;
        }

        .journey-section {
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .journey-title {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 16px;
          text-align: center;
        }

        .journey-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .journey-item {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 16px;
          border-radius: 10px;
          text-align: center;
        }

        .journey-item.incomplete {
          background: white;
          color: #718096;
          border: 2px solid #e2e8f0;
        }

        .journey-category {
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .journey-progress {
          font-size: 11px;
          opacity: 0.9;
        }

        .next-challenges {
          margin-bottom: 24px;
        }

        .next-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          text-align: center;
          margin-bottom: 16px;
        }

        .challenges-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .challenge-option {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .challenge-option:hover {
          border-color: #667eea;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
        }

        .challenge-emoji {
          font-size: 40px;
          margin-bottom: 8px;
        }

        .challenge-name {
          font-size: 13px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .challenge-category {
          font-size: 11px;
          color: #718096;
        }

        .cta-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          color: white;
        }

        .cta-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .cta-text {
          font-size: 14px;
          margin-bottom: 16px;
          opacity: 0.95;
        }

        .cta-button {
          background: white;
          color: #667eea;
          padding: 14px 28px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 600px) {
          .journey-grid {
            grid-template-columns: 1fr;
          }

          .challenges-grid {
            grid-template-columns: 1fr;
          }

          .trophy-icon {
            font-size: 64px;
          }

          .celebration-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}

export default CompletionSuccess;
