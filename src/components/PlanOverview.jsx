// ============================================
// FILE: src/components/PlanOverview.jsx
// ============================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as challengeLogic from '../utils/challengeLogic';
import * as storage from '../utils/storage';

const PlanOverview = () => {
  const navigate = useNavigate();
  const answers = JSON.parse(localStorage.getItem('assessment_answers') || '{}');
  const plan = challengeLogic.generateWalkPlan(answers);
  
  const handleStart = () => {
    // Create challenge
    const startDate = challengeLogic.getTomorrowDate();
    const user = storage.getCurrentUser();
    
    const challengeData = {
      user_id: user?.pu_id,
      challenge_type: 'walk',
      start_date: startDate,
      status: 'pending',
      personalized_plan: plan,
      total_points: 0,
      current_day: 0,
      created_at: new Date().toISOString()
    };
    
    storage.saveActiveChallenge(challengeData);
    navigate('/walk/dashboard');
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">PREMIER U × STUDIO STRONG</div>
        <div style={{ fontSize: '12px', color: '#a0aec0', marginBottom: '16px' }}>STEP 2 OF 2</div>
        <h1>Your Personalized Plan</h1>
        <p className="subtitle">Based on your {plan.level} fitness level</p>
        
        <div style={{ margin: '24px 0' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>🗓️ Your 30-Day Roadmap</h2>
          {Object.entries(plan.plan).map(([week, minutes]) => (
            <div key={week} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#f7fafc',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontWeight: 600 }}>{week.replace('week', 'Week ')}</span>
              <span style={{ color: '#667eea', fontWeight: 700 }}>{minutes} min</span>
            </div>
          ))}
        </div>
        
        <div style={{ background: '#edf2f7', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>🎯 How to Earn Your Sticker</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            ✅ On-time check-in: <strong>2 pts</strong><br/>
            ⏰ Late (1 day): <strong>1 pt</strong><br/>
            ❌ Miss: <strong>0 pts</strong><br/>
            <div style={{ marginTop: '12px', fontWeight: 600 }}>
              Earn 50/60 points to graduate!
            </div>
          </div>
        </div>
        
        <button onClick={handleStart} className="btn btn-success">
          I'm Ready! Start Tomorrow
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#718096' }}>
          Your Day 1 begins tomorrow. We'll email you!
        </p>
      </div>
    </div>
  );
};

export default PlanOverview;
