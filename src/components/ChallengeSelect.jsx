// ============================================
// FILE: src/components/ChallengeSelect.jsx
// ============================================
import React from 'react';

const ChallengeSelect = ({ userName, onSelectChallenge }) => {
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">REFORMED.FIT × PREMIER U</div>
        <h1>Welcome, {userName?.split(' ')[0] || 'there'}!</h1>
        <p className="subtitle">Choose your first 30-day challenge</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
          <button 
            onClick={() => onSelectChallenge('walk')}
            className="challenge-button"
            style={{
              padding: '24px',
              fontSize: '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🚶‍♂️ Walk Challenge
            <div style={{ fontSize: '14px', marginTop: '8px', opacity: '0.9' }}>
              30-day personalized walking program
            </div>
          </button>

          <button 
            onClick={() => onSelectChallenge('protein')}
            className="challenge-button"
            style={{
              padding: '24px',
              fontSize: '18px',
              background: '#e2e8f0',
              color: '#4a5568',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            🥩 Protein Challenge
            <div style={{ fontSize: '14px', marginTop: '8px', opacity: '0.9' }}>
              Coming soon!
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSelect;
