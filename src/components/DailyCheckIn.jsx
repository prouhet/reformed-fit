// ============================================
// FILE: src/components/DailyCheckIn.jsx - SIMPLIFIED STUB
// ============================================
import React from 'react';
import * as storage from '../utils/storage';

const DailyCheckIn = () => {
  const challenge = storage.getActiveChallenge();
  
  return (
    <div className="screen-container">
      <div className="screen-card">
        <h1>Daily Check-In</h1>
        <p>Challenge data: {JSON.stringify(challenge, null, 2)}</p>
        <p>Full component coming next...</p>
      </div>
    </div>
  );
};

export default DailyCheckIn;
