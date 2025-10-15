// ============================================
// Plan Overview Component
// Location: src/components/PlanOverview.jsx
//
// STEP 2 OF 2: Show personalized plan + points system
// ============================================

import React from 'react';

function PlanOverview({ plan, onStartChallenge }) {
  const handleStart = () => {
    // Save plan and create challenge
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const challengeData = {
      level: plan.level,
      goals: plan.goals,
      startDate: tomorrow.toISOString(),
      currentDay: 0, // Day 0 = waiting to start
      totalPoints: 0,
      currentStreak: 0,
      checkIns: [], // Will store daily check-ins
      status: 'pending' // pending, active, completed, incomplete
    };

    localStorage.setItem('walk_challenge', JSON.stringify(challengeData));
    onStartChallenge();
  };

  const levelEmoji = {
    beginner: '🌱',
    intermediate: '💪',
    advanced: '🏆'
  };

  return (
    <div className="screen-container">
      <div className="screen-card plan-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div className="step-indicator">STEP 2 OF 2</div>
        
        <div className="plan-header">
          <div className="level-badge">
            {levelEmoji[plan.level]} {plan.level.toUpperCase()} LEVEL
          </div>
          <h1 className="screen-title">Your Personalized Walk Challenge</h1>
          <p className="screen-subtitle">
            Based on your fitness level, here's your 30-day progressive plan
          </p>
        </div>

        {/* 4-Week Roadmap */}
        <div className="roadmap-container">
          <div className="roadmap-title">📅 Your 4-Week Plan</div>
          <div className="weeks-grid">
            <div className="week-row">
              <div className="week-label">Week 1</div>
              <div className="week-days">Days 1-7</div>
              <div className="week-goal">
                <span className="goal-badge">{plan.goals.week1} min</span>
              </div>
            </div>
            <div className="week-row">
              <div className="week-label">Week 2</div>
              <div className="week-days">Days 8-14</div>
              <div className="week-goal">
                <span className="goal-badge">{plan.goals.week2} min</span>
              </div>
            </div>
            <div className="week-row">
              <div className="week-label">Week 3</div>
              <div className="week-days">Days 15-21</div>
              <div className="week-goal">
                <span className="goal-badge">{plan.goals.week3} min</span>
              </div>
            </div>
            <div className="week-row">
              <div className="week-label">Week 4</div>
              <div className="week-days">Days 22-30</div>
              <div className="week-goal">
                <span className="goal-badge">{plan.goals.week4} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Points System */}
        <div className="points-section">
          <div className="points-title">🎯 How to Earn Your Sticker</div>
          
          <div className="points-grid">
            <div className="points-row">
              <div className="points-icon">✅</div>
              <div className="points-text">Check in on time</div>
              <div className="points-value">2 pts</div>
            </div>
            <div className="points-row">
              <div className="points-icon">⏰</div>
              <div className="points-text">Check in 1 day late</div>
              <div className="points-value">1 pt</div>
            </div>
            <div className="points-row">
              <div className="points-icon">❌</div>
              <div className="points-text">Miss entirely</div>
              <div className="points-value">0 pts</div>
            </div>
          </div>
          
          <div className="graduate-box">
            Earn <strong>50 out of 60 points</strong> to graduate & claim your achievement sticker!
          </div>
        </div>

        {/* Sticker Preview */}
        <div className="sticker-preview">
          <div className="sticker-icon">🏆</div>
          <div className="sticker-text">
            Complete the challenge and show this at your next Premier U appointment to get your exclusive sticker!
          </div>
        </div>

        <button onClick={handleStart} className="submit-button start-button">
          I'm Ready! Start Tomorrow
        </button>

        <p className="start-date">
          Your Day 1 begins tomorrow. We'll see you then! 🚶‍♂️
        </p>
      </div>

      <style jsx>{`
        .plan-card {
          max-width: 600px;
        }

        .plan-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .level-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .roadmap-container {
          background: #f7fafc;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .roadmap-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 16px;
          text-align: center;
        }

        .weeks-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .week-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          padding: 14px;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
        }

        .week-label {
          font-weight: 700;
          color: #2d3748;
          font-size: 15px;
        }

        .week-days {
          font-size: 13px;
          color: #718096;
        }

        .week-goal {
          margin-left: auto;
        }

        .goal-badge {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 14px;
        }

        .points-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          margin-bottom: 24px;
        }

        .points-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 16px;
          text-align: center;
        }

        .points-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .points-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .points-icon {
          font-size: 24px;
          width: 36px;
          text-align: center;
        }

        .points-text {
          flex: 1;
          font-size: 15px;
          color: #2d3748;
        }

        .points-value {
          font-weight: 700;
          color: #667eea;
          font-size: 15px;
        }

        .graduate-box {
          background: linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%);
          border: 2px solid #f59e0b;
          padding: 14px;
          border-radius: 10px;
          text-align: center;
          font-size: 15px;
          color: #92400e;
          line-height: 1.5;
        }

        .sticker-preview {
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          border: 2px solid #3b82f6;
          padding: 16px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 24px;
        }

        .sticker-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        .sticker-text {
          font-size: 14px;
          color: #1e40af;
          line-height: 1.5;
        }

        .start-button {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          font-size: 18px;
          padding: 18px;
        }

        .start-date {
          text-align: center;
          font-size: 14px;
          color: #718096;
          margin-top: 16px;
        }

        @media (max-width: 600px) {
          .week-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .week-goal {
            margin-left: 0;
          }

          .points-row {
            gap: 8px;
          }

          .points-icon {
            font-size: 20px;
            width: 32px;
          }
        }
      `}</style>
    </div>
  );
}

export default PlanOverview;
