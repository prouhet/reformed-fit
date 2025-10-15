// ============================================
// Completion Incomplete Component
// Location: src/components/CompletionIncomplete.jsx
//
// <50 POINTS: Encouraging screen (never say "failed")
// ============================================

import React, { useState, useEffect } from 'react';

function CompletionIncomplete({ onTryAgain, onSelectDifferent }) {
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

  // Generate encouraging insight
  const getInsight = () => {
    if (daysCompleted >= 20) {
      return "You completed over 2/3 of the challenge! That's real consistency.";
    } else if (daysCompleted >= 15) {
      return "You showed up for half the challenge. That takes commitment!";
    } else if (maxStreak >= 7) {
      return `You had a ${maxStreak}-day streak! You know you can do this.`;
    } else {
      return "Every step you took was progress. Building habits takes practice.";
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-card completion-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        {/* Encouraging Header */}
        <div className="encouragement-header">
          <div className="encouragement-icon">💪</div>
          <h1 className="encouragement-title">You Showed Up!</h1>
          <p className="encouragement-subtitle">
            Every step forward counts, even if we didn't hit graduation this time
          </p>
        </div>

        {/* Final Stats */}
        <div className="final-stats">
          <div className="stat-row">
            <span className="stat-label">Final Points</span>
            <span className="stat-value">{challenge.totalPoints}/60</span>
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

        {/* Insight Box */}
        <div className="insight-box">
          <div className="insight-icon">💡</div>
          <div className="insight-title">What This Shows</div>
          <div className="insight-text">{getInsight()}</div>
        </div>

        {/* Encouragement Message */}
        <div className="message-box">
          <p className="message-text">
            Building new habits is <strong>hard</strong>. The fact that you started means you're serious about your health. Most people never even try.
          </p>
          <p className="message-text">
            Research shows it takes <strong>multiple attempts</strong> to make habits stick. This was practice. Now you know what to expect.
          </p>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <div className="next-title">What's Next?</div>
          
          <button 
            className="primary-option"
            onClick={onTryAgain}
          >
            <div className="option-icon">🔄</div>
            <div className="option-content">
              <div className="option-title">Try Walk Challenge Again</div>
              <div className="option-text">
                Start fresh with everything you learned. You'll do better!
              </div>
            </div>
          </button>

          <div className="divider-text">OR</div>

          <button 
            className="secondary-option"
            onClick={onSelectDifferent}
          >
            <div className="option-icon">🎯</div>
            <div className="option-content">
              <div className="option-title">Try a Different Challenge</div>
              <div className="option-text">
                Maybe a different goal will be easier to stick with right now
              </div>
            </div>
          </button>
        </div>

        {/* Accountability CTA (Prominent) */}
        <div className="cta-box prominent">
          <div className="cta-icon">📱</div>
          <div className="cta-title">Need Daily Support?</div>
          <div className="cta-text">
            Get text check-ins every day from a real trainer. 85% of our accountability members complete their challenges.
          </div>
          <button className="cta-button">Add Accountability - $49/month</button>
          <div className="cta-subtext">
            Cancel anytime. First week free if you don't love it.
          </div>
        </div>
      </div>

      <style jsx>{`
        .completion-card {
          max-width: 600px;
        }

        .encouragement-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .encouragement-icon {
          font-size: 80px;
          margin-bottom: 16px;
        }

        .encouragement-title {
          font-size: 32px;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 12px;
        }

        .encouragement-subtitle {
          font-size: 16px;
          color: #718096;
          line-height: 1.6;
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

        .insight-box {
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          border: 2px solid #3b82f6;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .insight-icon {
          font-size: 32px;
          text-align: center;
          margin-bottom: 8px;
        }

        .insight-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e40af;
          text-align: center;
          margin-bottom: 8px;
        }

        .insight-text {
          font-size: 15px;
          color: #1e40af;
          text-align: center;
          line-height: 1.5;
        }

        .message-box {
          background: #f7fafc;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 2px solid #e2e8f0;
        }

        .message-text {
          font-size: 15px;
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .message-text:last-child {
          margin-bottom: 0;
        }

        .next-steps {
          margin-bottom: 24px;
        }

        .next-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          text-align: center;
          margin-bottom: 16px;
        }

        .primary-option, .secondary-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .primary-option {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          border: none;
          margin-bottom: 16px;
        }

        .primary-option:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
        }

        .secondary-option {
          background: white;
          border: 2px solid #e2e8f0;
          color: #2d3748;
        }

        .secondary-option:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
        }

        .option-icon {
          font-size: 40px;
          flex-shrink: 0;
        }

        .option-content {
          flex: 1;
        }

        .option-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .option-text {
          font-size: 14px;
          opacity: 0.9;
          line-height: 1.4;
        }

        .divider-text {
          text-align: center;
          font-size: 14px;
          color: #718096;
          font-weight: 600;
          margin: 16px 0;
        }

        .cta-box {
          background: linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%);
          border: 3px solid #f59e0b;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
        }

        .cta-box.prominent {
          border-width: 3px;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.2);
        }

        .cta-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .cta-title {
          font-size: 20px;
          font-weight: 800;
          color: #92400e;
          margin-bottom: 8px;
        }

        .cta-text {
          font-size: 15px;
          color: #92400e;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .cta-button {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 16px 32px;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 17px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
        }

        .cta-subtext {
          font-size: 12px;
          color: #92400e;
          font-style: italic;
        }

        @media (max-width: 600px) {
          .encouragement-icon {
            font-size: 64px;
          }

          .encouragement-title {
            font-size: 28px;
          }

          .primary-option, .secondary-option {
            flex-direction: column;
            text-align: center;
          }

          .option-icon {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}

export default CompletionIncomplete;
