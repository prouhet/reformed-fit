// ============================================
// Walk Assessment Component - WITH SUPABASE
// Location: src/components/WalkAssessment.jsx
//
// STEP 1 OF 2: Collect fitness assessment
// ============================================

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function WalkAssessment({ userData, onContinue }) {
  const [formData, setFormData] = useState({
    frequency: '',
    duration: '',
    emailReminders: true
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkExistingChallenge();
  }, []);

  const checkExistingChallenge = async () => {
    try {
      // Check if user already has walk challenge with assessment
      const { data, error } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', userData.id)
        .eq('status', 'active')
        .maybeSingle();

      if (data && data.assessment_data) {
        // Already did assessment, skip to plan
        console.log('Existing assessment found, skipping to plan');
        onContinue({
          plan: data.personalized_plan,
          emailReminders: data.assessment_data.emailReminders || true,
          existingChallenge: data
        });
        return;
      }
    } catch (err) {
      console.log('No existing challenge, continuing with assessment');
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = () => {
    // Calculate score
    let score = 0;
    
    if (formData.frequency === 'never') score += 0;
    else if (formData.frequency === '1-2') score += 1;
    else if (formData.frequency === '3-4') score += 2;
    else if (formData.frequency === '5+') score += 3;
    
    if (formData.duration === '<10') score += 0;
    else if (formData.duration === '10-20') score += 1;
    else if (formData.duration === '20-30') score += 2;
    else if (formData.duration === '30+') score += 3;

    // Determine level
    let level = 'beginner';
    if (score >= 5) level = 'advanced';
    else if (score >= 3) level = 'intermediate';

    // Generate plan
    const plans = {
      beginner: { 
        week1: 5, 
        week2: 10, 
        week3: 15, 
        week4: 20 
      },
      intermediate: { 
        week1: 10, 
        week2: 15, 
        week3: 20, 
        week4: 30 
      },
      advanced: { 
        week1: 15, 
        week2: 25, 
        week3: 35, 
        week4: 45 
      }
    };

    return { 
      level: level, 
      goals: plans[level],
      score: score
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const plan = generatePlan();
      
      // Calculate start date (tomorrow)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Save to Supabase (end_date is auto-generated)
      const { data: challengeData, error } = await supabase
        .from('user_challenges')
        .insert({
          user_id: userData.id,
          challenge_id: 'walk',
          start_date: tomorrow.toISOString().split('T')[0],
          status: 'pending',
          assessment_data: {
            frequency: formData.frequency,
            duration: formData.duration,
            emailReminders: formData.emailReminders
          },
          personalized_plan: plan,
          total_points: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving assessment:', error);
        alert('Failed to save assessment. Please try again.');
        setSubmitting(false);
        return;
      }

      console.log('Assessment saved successfully:', challengeData);

      // Update user email reminder settings
      await supabase
        .from('users')
        .update({ email_reminder_enabled: formData.emailReminders })
        .eq('id', userData.id);

      // Save to localStorage for quick access
      localStorage.setItem('assessment_data', JSON.stringify(formData));
      localStorage.setItem('walk_challenge', JSON.stringify({
        ...challengeData,
        currentDay: 0
      }));

      // Continue to plan overview
      onContinue({
        plan: plan,
        emailReminders: formData.emailReminders,
        challenge: challengeData
      });

    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-card">
          <div className="logo">STUDIO STRONG × PREMIER U</div>
          <p style={{ textAlign: 'center', color: '#718096' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div className="step-indicator">STEP 1 OF 2</div>
        
        <h1 className="screen-title">Let's personalize your plan</h1>
        <p className="screen-subtitle">
          This helps us match the right challenge to your fitness level
        </p>
        
        <form onSubmit={handleSubmit} className="screen-form">
          {/* Question 1: Frequency */}
          <div className="question-block">
            <label className="question-label">
              How often do you walk intentionally now?
            </label>
            <div className="radio-group">
              {[
                { value: 'never', label: 'Never / Rarely' },
                { value: '1-2', label: '1-2 times per week' },
                { value: '3-4', label: '3-4 times per week' },
                { value: '5+', label: '5+ times per week' }
              ].map(option => (
                <label 
                  key={option.value}
                  className={`radio-option ${formData.frequency === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={formData.frequency === option.value}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    required
                    disabled={submitting}
                  />
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2: Duration */}
          <div className="question-block">
            <label className="question-label">
              When you do walk, how long typically?
            </label>
            <div className="radio-group">
              {[
                { value: '<10', label: 'Less than 10 minutes' },
                { value: '10-20', label: '10-20 minutes' },
                { value: '20-30', label: '20-30 minutes' },
                { value: '30+', label: '30+ minutes' }
              ].map(option => (
                <label 
                  key={option.value}
                  className={`radio-option ${formData.duration === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={formData.duration === option.value}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                    disabled={submitting}
                  />
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          {/* Email Reminder Opt-in */}
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.emailReminders}
                onChange={(e) => setFormData({...formData, emailReminders: e.target.checked})}
                className="checkbox-input"
                disabled={submitting}
              />
              <span className="checkbox-text">
                Send me a reminder email if I miss a daily check-in
              </span>
            </label>
            <p className="checkbox-help">
              We'll send a friendly reminder to {userData.email} if you haven't checked in by 8:00 PM CST
            </p>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .step-indicator {
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: #667eea;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .question-block {
          margin-bottom: 30px;
        }

        .question-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 12px;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .radio-option:hover {
          border-color: #cbd5e0;
          background: #f7fafc;
        }

        .radio-option.selected {
          border-color: #667eea;
          background: #edf2f7;
        }

        .radio-option input[type="radio"] {
          margin-right: 12px;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .radio-label {
          font-size: 15px;
          color: #2d3748;
          cursor: pointer;
        }

        .checkbox-container {
          background: #f7fafc;
          padding: 16px;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          cursor: pointer;
        }

        .checkbox-input {
          width: 20px;
          height: 20px;
          margin-right: 12px;
          margin-top: 2px;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 15px;
          color: #2d3748;
          line-height: 1.5;
        }

        .checkbox-help {
          margin-top: 8px;
          margin-left: 32px;
          font-size: 13px;
          color: #718096;
          line-height: 1.4;
        }

        @media (max-width: 600px) {
          .question-label {
            font-size: 15px;
          }

          .radio-label {
            font-size: 14px;
          }

          .checkbox-text {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export default WalkAssessment;
