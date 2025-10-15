// ============================================
// FILE: src/components/ChallengeSelect.jsx
// ============================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as storage from '../utils/storage';

const ChallengeSelect = () => {
  const navigate = useNavigate();
  const user = storage.getCurrentUser();

  const handleSelectChallenge = (challengeType) => {
    if (challengeType === 'walk') {
      navigate('/walk/assessment');
    } else {
      alert('Protein Challenge coming soon!');
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">PREMIER U × STUDIO STRONG</div>
        <h1>Welcome, {user?.name?.split(' ')[0] || 'there'}!</h1>
        <p className="subtitle">Choose your first 30-day challenge</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
          <div 
            onClick={() => handleSelectChallenge('walk')}
            style={{
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚶‍♂️</div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Walk Challenge</h2>
            <p style={{ color: '#718096', fontSize: '14px' }}>
              Build a daily walking habit<br/>
              Personalized to your level
            </p>
          </div>
          
          <div 
            onClick={() => handleSelectChallenge('protein')}
            style={{
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🥩</div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Protein Challenge</h2>
            <p style={{ color: '#718096', fontSize: '14px' }}>
              Track 100g protein daily<br/>
              Build muscle-preserving habits
            </p>
          </div>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#718096' }}>
          ℹ️ Complete challenges to earn achievement stickers!
        </p>
      </div>
    </div>
  );
};

export default ChallengeSelect;
