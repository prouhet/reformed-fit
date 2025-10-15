// ============================================
// Roadmap Component
// Location: src/components/Roadmap.jsx
//
// 30-DAY CALENDAR: Visual progress grid
// ============================================

import React, { useState, useEffect } from 'react';

function Roadmap({ onBack }) {
  const [challenge, setChallenge] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('walk_challenge');
    if (saved) {
      const data = JSON.parse(saved);
      setChallenge(data);

      // Calculate current day
      const startDate = new Date(data.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const day = Math.max(1, Math.min(30, daysDiff));
      setCurrentDay(day);
    }
  }, []);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  // Get day status
  const getDayStatus = (day) => {
    if (day > currentDay) return 'future';
    if (day === currentDay) return 'current';
    
    const checkIn = challenge.checkIns.find(c => c.day === day);
    if (checkIn) {
      return checkIn.completed ? 'completed' : 'missed';
    }
    return 'missed';
  };

  // Get week goal
  const getWeekGoal = (weekNum) => {
    const goals = challenge.goals;
    switch(weekNum) {
      case 1: return goals.week1;
      case 2: return goals.week2;
      case 3: return goals.week3;
      case 4: return goals.week4;
      default: return goals.week1;
    }
  };

  // Create calendar grid (4 weeks + 2 days)
  const weeks = [
    { week: 1, days: Array.from({length: 7}, (_, i) => i + 1) },
    { week: 2, days: Array.from({length: 7}, (_, i) => i + 8) },
    { week: 3, days: Array.from({length: 7}, (_, i) => i + 15) },
    { week: 4, days: Array.from({length: 7}, (_, i) => i + 22) },
    { week: 4, days: [29, 30] } // Last 2 days
  ];

  return (
    <div className="screen-container">
      <div className="screen-card roadmap-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        {/* Header */}
        <div className="roadmap-header">
          <h1 className="roadmap-title">Your 30-Day Roadmap</h1>
          <p className="roadmap-subtitle">
            {challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)} Level • Walk Challenge
          </p>
        </div>

        {/* Legend */}
        <div className="legend">
          <div className="legend-item">
            <div className="legend-dot completed"></div>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot current"></div>
            <span>Current</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot missed"></div>
            <span>Missed</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot future"></div>
            <span>Future</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-container">
          {weeks.map((weekData, weekIndex) => (
            <div key={weekIndex} className="week-section">
              {weekIndex < 4 && (
                <div className="week-header">
                  <div className="week-label">Week {weekData.week}</div>
                  <div className="week-goal">
                    Goal: {getWeekGoal(weekData.week)} min
                  </div>
                </div>
              )}
              
              <div className="days-grid">
                {weekData.days.map(day => {
                  const status = getDayStatus(day);
                  return (
                    <div key={day} className={`day-cell ${status}`}>
                      <div className="day-number">{day}</div>
                      {status === 'completed' && <div className="day-icon">✓</div>}
                      {status === 'current' && <div className="day-icon">📍</div>}
                      {status === 'missed' && <div className="day-icon">✗</div>}
                    </div>
                  );
                })}
                {/* Fill empty cells for last week */}
                {weekIndex === 4 && Array.from({length: 5}, (_, i) => (
                  <div key={`empty-${i}`} className="day-cell empty"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="summary-item">
            <div className="summary-label">Points</div>
            <div className="summary-value">{challenge.totalPoints}/60</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Streak</div>
            <div className="summary-value">🔥 {challenge.currentStreak}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Days Left</div>
            <div className="summary-value">{Math.max(0, 30 - currentDay + 1)}</div>
          </div>
        </div>

        {/* Back Button */}
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>

      <style jsx>{`
        .roadmap-card {
          max-width: 700px;
        }

        .roadmap-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .roadmap-title {
          font-size: 28px;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .roadmap-subtitle {
          font-size: 15px;
          color: #718096;
        }

        .legend {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
          padding: 16px;
          background: #f7fafc;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #4a5568;
          font-weight: 600;
        }

        .legend-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid;
        }

        .legend-dot.completed {
          background: #48bb78;
          border-color: #48bb78;
        }

        .legend-dot.current {
          background: #667eea;
          border-color: #667eea;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .legend-dot.missed {
          background: #f56565;
          border-color: #f56565;
        }

        .legend-dot.future {
          background: #e2e8f0;
          border-color: #e2e8f0;
        }

        .calendar-container {
          margin-bottom: 24px;
        }

        .week-section {
          margin-bottom: 24px;
        }

        .week-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
          margin-bottom: 12px;
          border: 2px solid #e2e8f0;
        }

        .week-label {
          font-size: 15px;
          font-weight: 700;
          color: #2d3748;
        }

        .week-goal {
          font-size: 13px;
          color: #718096;
          font-weight: 600;
          background: white;
          padding: 4px 12px;
          border-radius: 12px;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .day-cell {
          aspect-ratio: 1;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          position: relative;
          border: 2px solid;
          transition: all 0.2s;
        }

        .day-cell.completed {
          background: #48bb78;
          border-color: #48bb78;
          color: white;
        }

        .day-cell.current {
          background: #667eea;
          border-color: #667eea;
          color: white;
          animation: pulse 2s infinite;
        }

        .day-cell.missed {
          background: #f56565;
          border-color: #f56565;
          color: white;
        }

        .day-cell.future {
          background: #f7fafc;
          border-color: #e2e8f0;
          color: #a0aec0;
        }

        .day-cell.empty {
          background: transparent;
          border: none;
        }

        .day-cell:not(.empty):hover {
          transform: scale(1.05);
        }

        .day-number {
          font-size: 16px;
        }

        .day-icon {
          font-size: 12px;
          margin-top: 2px;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .summary-item {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 16px;
          border-radius: 10px;
          text-align: center;
        }

        .summary-label {
          font-size: 12px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: 800;
          color: #2d3748;
        }

        .back-button {
          width: 100%;
          padding: 16px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          color: #4a5568;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          border-color: #667eea;
          color: #667eea;
          background: #f7fafc;
        }

        @media (max-width: 600px) {
          .roadmap-title {
            font-size: 24px;
          }

          .legend {
            gap: 12px;
          }

          .legend-item {
            font-size: 12px;
          }

          .day-cell {
            border-radius: 6px;
          }

          .day-number {
            font-size: 14px;
          }

          .summary-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Roadmap;
