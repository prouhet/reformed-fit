// ============================================
// FILE: src/components/DashboardPreview.jsx
// ============================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as storage from '../utils/storage';
import * as challengeLogic from '../utils/challengeLogic';

const DashboardPreview = () => {
  const navigate = useNavigate();
  const challenge = storage.getActiveChallenge();
  
  // Check if challenge has started
  const hasStarted = challenge && challengeLogic.hasStarted(challenge.start_date);
  
  if (hasStarted) {
    // Redirect to check-in
    navigate('/walk/checkin');
    return null;
  }
  
  const startDateFormatted = challenge ? challengeLogic.formatDate(challenge.start_date) : '';
  const firstGoal = challenge?.personalized_plan?.plan?.week1 || 5;

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">PREMIER U × STUDIO STRONG</div>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '64px' }}>✅</div>
          <h1>You're All Set!</h1>
        </div>
        
        <div style={{ background: '#edf2f7', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Your Walk Challenge starts:</h2>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#667eea', marginBottom: '16px' }}>
            {startDateFormatted}
          </div>
          <div style={{ fontSize: '16px', color: '#4a5568' }}>
            Your Day 1 Goal: Walk <strong>{firstGoal} minutes</strong>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '12px' }}>
            📧 Check your email for your unique login link
          </p>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            💡 <strong>Bookmark this page</strong> to easily return tomorrow!
          </p>
        </div>
        
        <button onClick={() => navigate('/walk/roadmap')} className="btn btn-secondary">
          View Full Roadmap
        </button>
        
        <button onClick={() => navigate('/settings')} className="btn btn-secondary" style={{ marginTop: '12px' }}>
          Account Settings
        </button>
      </div>
    </div>
  );
};

export default DashboardPreview;
