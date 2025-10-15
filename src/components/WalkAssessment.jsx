// ============================================
// FILE: src/components/WalkAssessment.jsx
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WalkAssessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
    frequency: '',
    duration: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store answers and go to plan
    localStorage.setItem('assessment_answers', JSON.stringify(answers));
    navigate('/walk/plan');
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">PREMIER U × STUDIO STRONG</div>
        <div style={{ fontSize: '12px', color: '#a0aec0', marginBottom: '16px' }}>STEP 1 OF 2</div>
        <h1>Quick Assessment</h1>
        <p className="subtitle">Help us personalize your walking plan</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>How often do you walk intentionally now?</label>
            <div className="radio-group">
              {['never', '1-2', '3-4', '5+'].map(option => (
                <label key={option} className={`radio-option ${answers.frequency === option ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="frequency" 
                    value={option}
                    onChange={(e) => setAnswers({...answers, frequency: e.target.value})}
                  />
                  {option === 'never' ? 'Never / Rarely' : `${option} times per week`}
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>When you do walk, how long typically?</label>
            <div className="radio-group">
              {['<10', '10-20', '20-30', '30+'].map(option => (
                <label key={option} className={`radio-option ${answers.duration === option ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="duration" 
                    value={option}
                    onChange={(e) => setAnswers({...answers, duration: e.target.value})}
                  />
                  {option === '<10' ? 'Less than 10 minutes' : 
                   option === '30+' ? '30+ minutes' : 
                   `${option} minutes`}
                </label>
              ))}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!answers.frequency || !answers.duration}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalkAssessment;
