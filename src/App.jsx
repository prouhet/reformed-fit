// ============================================
// App.jsx - COMPLETE WALK CHALLENGE
// Location: src/App.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('puid');
  const [userData, setUserData] = useState({
    puid: '',
    name: '',
    email: '',
    phone: '',
    pin: ''
  });
  const [assessmentData, setAssessmentData] = useState(null);

  // Check for existing challenge on mount
  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const challenge = JSON.parse(savedChallenge);
      
      // Determine which screen to show based on challenge status
      if (challenge.status === 'completed') {
        setCurrentScreen('completion-success');
      } else if (challenge.status === 'incomplete') {
        setCurrentScreen('completion-incomplete');
      } else if (challenge.status === 'pending') {
        setCurrentScreen('dashboard-preview');
      } else {
        setCurrentScreen('daily-checkin');
      }
    }
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'puid':
        return <PUIDEntryScreen onContinue={(puid) => {
          setUserData({ ...userData, puid });
          setCurrentScreen('setup');
        }} />;

      case 'setup':
        return <AccountSetupScreen 
          puid={userData.puid}
          onContinue={(data) => {
            setUserData({ ...userData, ...data });
            setCurrentScreen('select');
          }} 
        />;

      case 'select':
        return <ChallengeSelectScreen 
          userName={userData.name}
          onSelectChallenge={(challenge) => {
            if (challenge === 'walk') {
              setCurrentScreen('assessment');
            } else {
              alert('Protein challenge coming soon!');
            }
          }}
        />;

      case 'assessment':
        return <WalkAssessmentScreen
          userData={userData}
          onContinue={(data) => {
            setAssessmentData(data);
            setCurrentScreen('plan-overview');
          }}
        />;

      case 'plan-overview':
        return <PlanOverviewScreen
          plan={assessmentData.plan}
          onStartChallenge={() => {
            setCurrentScreen('dashboard-preview');
          }}
        />;

      case 'dashboard-preview':
        return <DashboardPreviewScreen
          onNavigate={(destination) => {
            if (destination === 'roadmap') {
              setCurrentScreen('roadmap');
            } else if (destination === 'settings') {
              alert('Settings coming soon!');
            }
          }}
        />;

      case 'daily-checkin':
        return <DailyCheckInScreen
          onComplete={(result) => {
            if (result === 'success') {
              setCurrentScreen('completion-success');
            } else if (result === 'incomplete') {
              setCurrentScreen('completion-incomplete');
            }
          }}
          onNavigate={(destination) => {
            if (destination === 'dashboard') {
              setCurrentScreen('dashboard-preview');
            } else if (destination === 'roadmap') {
              setCurrentScreen('roadmap');
            }
          }}
        />;

      case 'completion-success':
        return <CompletionSuccessScreen
          onSelectNextChallenge={(challenge) => {
            alert(`${challenge} challenge selected! Coming soon.`);
          }}
        />;

      case 'completion-incomplete':
        return <CompletionIncompleteScreen
          onTryAgain={() => {
            // Clear challenge and restart
            localStorage.removeItem('walk_challenge');
            setCurrentScreen('assessment');
          }}
          onSelectDifferent={() => {
            localStorage.removeItem('walk_challenge');
            setCurrentScreen('select');
          }}
        />;

      case 'roadmap':
        return <RoadmapScreen
          onBack={() => {
            // Determine where to go back to
            const savedChallenge = localStorage.getItem('walk_challenge');
            if (savedChallenge) {
              const challenge = JSON.parse(savedChallenge);
              if (challenge.currentDay === 0) {
                setCurrentScreen('dashboard-preview');
              } else {
                setCurrentScreen('daily-checkin');
              }
            } else {
              setCurrentScreen('dashboard-preview');
            }
          }}
        />;

      case 'settings':
        return <SettingsScreen
          onBack={() => {
            // Go back to appropriate screen
            const savedChallenge = localStorage.getItem('walk_challenge');
            if (savedChallenge) {
              const challenge = JSON.parse(savedChallenge);
              if (challenge.currentDay === 0 || challenge.status === 'pending') {
                setCurrentScreen('dashboard-preview');
              } else {
                setCurrentScreen('daily-checkin');
              }
            } else {
              setCurrentScreen('select');
            }
          }}
        />;

      default:
        return <PUIDEntryScreen onContinue={(puid) => {
          setUserData({ ...userData, puid });
          setCurrentScreen('setup');
        }} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

// All inline screen components below
// (In production, these would be in separate files)

// SCREEN 1: PU ID ENTRY
function PUIDEntryScreen({ onContinue }) {
  const [puid, setPuid] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!puid || puid.length < 3) {
      setError('Please enter a valid PU ID');
      return;
    }

    onContinue(puid.toUpperCase());
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <h1 className="screen-title">Welcome to Your Challenges</h1>
        <p className="screen-subtitle">Enter your Premier U Patient ID to get started</p>
        
        <form onSubmit={handleSubmit} className="screen-form">
          <div className="input-group">
            <label htmlFor="puid" className="input-label">Premier U Patient ID</label>
            <input
              type="text"
              id="puid"
              className="text-input"
              value={puid}
              onChange={(e) => setPuid(e.target.value.trim().toUpperCase())}
              placeholder="Enter your PU ID"
              required
              autoFocus
            />
            <p className="input-help">Example: PU123456 or just 123456</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            Continue
          </button>
        </form>

        <div className="help-text">
          <p>First time here? Enter your PU ID to create your account.</p>
        </div>
      </div>
    </div>
  );
}

// SCREEN 2: ACCOUNT SETUP
function AccountSetupScreen({ puid, onContinue }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
    confirmPin: ''
  });
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (formData.pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    // Store in localStorage for demo
    localStorage.setItem('user_data', JSON.stringify({
      puid,
      ...formData
    }));

    onContinue(formData);
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div className="puid-badge">Patient ID: {puid}</div>
        
        <h1 className="screen-title">Create Your Account</h1>
        <p className="screen-subtitle">
          You're creating a unique page at: <strong>app.reformed.fit/p/{puid}</strong>
          <br />
          Your PIN will be used to log back in.
        </p>
        
        <form onSubmit={handleSubmit} className="screen-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="text-input"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="text-input"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone</label>
            <input
              type="tel"
              className="text-input"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>

          <div className="divider"></div>

          <div className="input-group">
            <label className="input-label">Create 4-Digit PIN</label>
            <input
              type="password"
              className="pin-input"
              value={formData.pin}
              onChange={(e) => handleChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength="4"
              required
            />
            <p className="input-help">You'll use this PIN to log back in</p>
          </div>

          <div className="input-group">
            <label className="input-label">Confirm PIN</label>
            <input
              type="password"
              className="pin-input"
              value={formData.confirmPin}
              onChange={(e) => handleChange('confirmPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              maxLength="4"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

// SCREEN 3: CHALLENGE SELECTION
function ChallengeSelectScreen({ userName, onSelectChallenge }) {
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <h1 className="screen-title">Welcome, {userName}!</h1>
        <p className="screen-subtitle">Choose your first 30-day challenge</p>
        
        <div className="challenge-grid">
          <button 
            className="challenge-card"
            onClick={() => onSelectChallenge('walk')}
          >
            <div className="challenge-icon">🚶‍♂️</div>
            <h3 className="challenge-name">Walk Challenge</h3>
            <p className="challenge-description">
              Build a daily walking habit
              <br />
              Personalized to your level
            </p>
            <div className="challenge-button">Start Walk Challenge</div>
          </button>

          <button 
            className="challenge-card"
            onClick={() => onSelectChallenge('protein')}
          >
            <div className="challenge-icon">🥩</div>
            <h3 className="challenge-name">Protein Challenge</h3>
            <p className="challenge-description">
              Track 100g protein daily
              <br />
              Build muscle-preserving habits
            </p>
            <div className="challenge-button">Start Protein Challenge</div>
          </button>
        </div>

        <div className="info-box">
          ℹ️ Complete challenges to earn achievement stickers!
        </div>
      </div>
    </div>
  );
}

// NOTE: Import the actual components from separate files
// Uncomment these lines when component files are created:
/*
import WalkAssessment from './components/WalkAssessment';
import PlanOverview from './components/PlanOverview';
import DashboardPreview from './components/DashboardPreview';
import DailyCheckIn from './components/DailyCheckIn';
import CompletionSuccess from './components/CompletionSuccess';
import CompletionIncomplete from './components/CompletionIncomplete';
import Roadmap from './components/Roadmap';
*/

// TEMPORARY: Inline placeholder screens for components
// Replace these with actual imports above when ready
function WalkAssessmentScreen({ userData, onContinue }) {
  const [formData, setFormData] = useState({
    frequency: '',
    duration: '',
    emailReminders: true
  });

  const generatePlan = () => {
    let score = 0;
    
    if (formData.frequency === 'never') score += 0;
    else if (formData.frequency === '1-2') score += 1;
    else if (formData.frequency === '3-4') score += 2;
    else if (formData.frequency === '5+') score += 3;
    
    if (formData.duration === '<10') score += 0;
    else if (formData.duration === '10-20') score += 1;
    else if (formData.duration === '20-30') score += 2;
    else if (formData.duration === '30+') score += 3;

    let level = 'beginner';
    if (score >= 5) level = 'advanced';
    else if (score >= 3) level = 'intermediate';

    const plans = {
      beginner: { week1: 5, week2: 10, week3: 15, week4: 20 },
      intermediate: { week1: 10, week2: 15, week3: 20, week4: 30 },
      advanced: { week1: 15, week2: 25, week3: 35, week4: 45 }
    };

    return { 
      level: level, 
      goals: plans[level],
      score: score
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const plan = generatePlan();
    onContinue({
      plan: plan,
      emailReminders: formData.emailReminders
    });
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#667eea', letterSpacing: '2px', marginBottom: '20px' }}>
          STEP 1 OF 2
        </div>
        <h1 className="screen-title">Let's personalize your plan</h1>
        <p className="screen-subtitle">This helps us match the right challenge to your fitness level</p>
        
        <form onSubmit={handleSubmit} className="screen-form">
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
              How often do you walk intentionally now?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { value: 'never', label: 'Never / Rarely' },
                { value: '1-2', label: '1-2 times per week' },
                { value: '3-4', label: '3-4 times per week' },
                { value: '5+', label: '5+ times per week' }
              ].map(option => (
                <label 
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px',
                    border: `2px solid ${formData.frequency === option.value ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: formData.frequency === option.value ? '#edf2f7' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={formData.frequency === option.value}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    required
                    style={{ marginRight: '12px', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '15px', color: '#2d3748', cursor: 'pointer' }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
              When you do walk, how long typically?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { value: '<10', label: 'Less than 10 minutes' },
                { value: '10-20', label: '10-20 minutes' },
                { value: '20-30', label: '20-30 minutes' },
                { value: '30+', label: '30+ minutes' }
              ].map(option => (
                <label 
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px',
                    border: `2px solid ${formData.duration === option.value ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: formData.duration === option.value ? '#edf2f7' : 'white'
                  }}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={formData.duration === option.value}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                    style={{ marginRight: '12px', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '15px', color: '#2d3748', cursor: 'pointer' }}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.emailReminders}
                onChange={(e) => setFormData({...formData, emailReminders: e.target.checked})}
                style={{ width: '20px', height: '20px', marginRight: '12px', marginTop: '2px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '15px', color: '#2d3748', lineHeight: '1.5' }}>
                Send me a reminder email if I miss a daily check-in
              </span>
            </label>
            <p style={{ marginTop: '8px', marginLeft: '32px', fontSize: '13px', color: '#718096', lineHeight: '1.4' }}>
              We'll send a friendly reminder to {userData.email} if you haven't checked in by 8:00 PM CST
            </p>
          </div>

          <button type="submit" className="submit-button">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

function PlanOverviewScreen({ plan, onStartChallenge }) {
  const handleStart = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const challengeData = {
      level: plan.level,
      goals: plan.goals,
      startDate: tomorrow.toISOString(),
      currentDay: 0,
      totalPoints: 0,
      currentStreak: 0,
      checkIns: [],
      status: 'pending'
    };

    localStorage.setItem('walk_challenge', JSON.stringify(challengeData));
    onStartChallenge();
  };

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '600px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#667eea', letterSpacing: '2px', marginBottom: '20px' }}>
          STEP 2 OF 2
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>
            {plan.level === 'beginner' && '🌱'} {plan.level === 'intermediate' && '💪'} {plan.level === 'advanced' && '🏆'} {plan.level.toUpperCase()} LEVEL
          </div>
          <h1 className="screen-title">Your Personalized Walk Challenge</h1>
          <p className="screen-subtitle">Based on your fitness level, here's your 30-day progressive plan</p>
        </div>

        {/* 4-Week Roadmap */}
        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', textAlign: 'center' }}>
            📅 Your 4-Week Plan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { week: 1, days: '1-7', goal: plan.goals.week1 },
              { week: 2, days: '8-14', goal: plan.goals.week2 },
              { week: 3, days: '15-21', goal: plan.goals.week3 },
              { week: 4, days: '22-30', goal: plan.goals.week4 }
            ].map(w => (
              <div key={w.week} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '14px', borderRadius: '10px', border: '2px solid #e2e8f0' }}>
                <span style={{ fontWeight: '700', color: '#2d3748', fontSize: '15px' }}>Week {w.week}</span>
                <span style={{ fontSize: '13px', color: '#718096' }}>Days {w.days}</span>
                <span style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '14px' }}>
                  {w.goal} min
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Points System */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', textAlign: 'center' }}>
            🎯 How to Earn Your Sticker
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {[
              { icon: '✅', text: 'Check in on time', points: '2 pts' },
              { icon: '⏰', text: 'Check in 1 day late', points: '1 pt' },
              { icon: '❌', text: 'Miss entirely', points: '0 pts' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f7fafc', borderRadius: '8px' }}>
                <span style={{ fontSize: '24px', width: '36px', textAlign: 'center' }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: '15px', color: '#2d3748' }}>{item.text}</span>
                <span style={{ fontWeight: '700', color: '#667eea', fontSize: '15px' }}>{item.points}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '2px solid #f59e0b', padding: '14px', borderRadius: '10px', textAlign: 'center', fontSize: '15px', color: '#92400e', lineHeight: '1.5' }}>
            Earn <strong>50 out of 60 points</strong> to graduate & claim your achievement sticker!
          </div>
        </div>

        <button onClick={handleStart} className="submit-button" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', fontSize: '18px', padding: '18px' }}>
          I'm Ready! Start Tomorrow
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#718096', marginTop: '16px' }}>
          Your Day 1 begins tomorrow. We'll see you then! 🚶‍♂️
        </p>
      </div>
    </div>
  );
}

function DashboardPreviewScreen({ onNavigate }) {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const data = JSON.parse(savedChallenge);
      setChallenge(data);
    }
  }, []);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  const getWeek1Goal = () => {
    return challenge.goals.week1;
  };

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        {/* Challenge Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🚶‍♂️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>Walk Challenge</h1>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
            {challenge.level.toUpperCase()} LEVEL
          </div>
        </div>

        {/* Starts Tomorrow Message */}
        <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '2px solid #f59e0b', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>Challenge Starts Tomorrow!</h2>
          <p style={{ fontSize: '16px', color: '#92400e', fontWeight: '600' }}>Day 1 begins: Tomorrow</p>
        </div>

        {/* Tomorrow's Goal */}
        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Your First Goal</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>Walk {getWeek1Goal()} minutes</div>
          <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.5' }}>Check in tomorrow to track your progress and earn points!</p>
        </div>

        {/* Check-in Button (Disabled) */}
        <button style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: '700', background: '#e2e8f0', color: '#a0aec0', border: '2px solid #cbd5e0', borderRadius: '12px', cursor: 'not-allowed', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled>
          <span style={{ fontSize: '20px' }}>🔒</span>
          <span>Check-In Available Tomorrow</span>
        </button>

        {/* What to Expect */}
        <div style={{ background: 'white', border: '2px solid #e2e8f0', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>📋 What to Expect</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Daily check-ins take 30 seconds', 'Earn 2 points for on-time check-ins', 'Build your streak day by day', 'Get 50/60 points to earn your sticker'].map((item, i) => (
              <li key={i} style={{ padding: '8px 0', paddingLeft: '24px', position: 'relative', color: '#4a5568', fontSize: '14px', lineHeight: '1.5' }}>
                <span style={{ position: 'absolute', left: 0, color: '#48bb78', fontWeight: '700' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => onNavigate('roadmap')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            View Full Roadmap
          </button>
          <button onClick={() => onNavigate('settings')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            Settings
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#718096' }}>📧 We'll email you tomorrow when Day 1 begins!</p>
      </div>
    </div>
  );
}

function DailyCheckInScreen({ onComplete, onNavigate }) {
  // 30 Educational Tips Per Level
  const WALKING_TIPS = {
    beginner: [
      "Start with a 5-minute walk around your neighborhood. Every journey begins with a single step!",
      "Walk at a comfortable pace where you can still hold a conversation. This is your sweet spot.",
      "Wear comfortable, supportive shoes. Your feet will thank you later!",
      "Morning walks help you wake up naturally and set a positive tone for your day.",
      "Try walking during your lunch break. It's a great way to reset and digest.",
      "Walking after meals can help lower blood sugar levels naturally.",
      "Focus on posture: shoulders back, head up, core engaged. You'll feel stronger!",
      "Set a daily reminder on your phone. Consistency builds habits faster than intensity.",
      "Walk with a friend or family member. Social support doubles your success rate.",
      "Track your steps with your phone. Seeing progress is incredibly motivating!",
      "If it's cold outside, try mall walking. Climate control keeps you consistent.",
      "Start adding hills to your route. Even gentle inclines build strength.",
      "Swing your arms naturally. It burns more calories and feels great!",
      "Walk during TV commercials. Those 2-3 minutes add up quickly!",
      "Listen to your favorite music or podcast. Make walking enjoyable, not a chore.",
      "Park farther away from store entrances. Bonus steps throughout your day.",
      "Take the stairs instead of elevators when possible. Your heart will strengthen.",
      "Walk barefoot on grass when you can. It's grounding and strengthens foot muscles.",
      "Stretch for 2 minutes after walking. It prevents soreness and improves flexibility.",
      "Celebrate small wins. You're building a habit that will last a lifetime!",
      "Walk in nature when possible. Studies show it reduces stress more than city walking.",
      "Vary your routes. New scenery keeps your brain engaged and prevents boredom.",
      "Walk slower if you're tired. Showing up matters more than pace.",
      "Drink water before and after your walk. Hydration makes everything work better.",
      "Notice your breathing. Deep breaths activate your calming nervous system.",
      "Walk with intention. This is YOUR time for movement and mental clarity.",
      "Bad weather? Walk indoors around your house. Movement counts everywhere!",
      "Your body is adapting to this new habit. Be patient and proud of yourself.",
      "Walking improves sleep quality. You're investing in better rest tonight!",
      "You've walked for a month! You're no longer a beginner - you're a walker."
    ],
    intermediate: [
      "Increase your pace slightly this week. Challenge yourself without overdoing it.",
      "Try interval walking: 2 minutes fast, 2 minutes normal. It boosts fitness quickly.",
      "Add 5 minutes to one walk this week. Your endurance is building!",
      "Walking uphill burns 50% more calories than flat ground. Seek out those hills!",
      "Your heart rate should be elevated but you can still talk in full sentences.",
      "Track your distance. Aim to gradually increase it each week.",
      "Cross-training is smart. Walk different surfaces: trails, sand, grass, pavement.",
      "Walking 15-20 minutes daily reduces heart disease risk by 30%. You're investing in health!",
      "Focus on pushing off with your toes. This engages your calf muscles more effectively.",
      "Walk before breakfast occasionally. Fasted cardio can boost fat burning.",
      "Your cardiovascular system is getting stronger. Notice how much easier this feels!",
      "Add light hand weights (1-2 lbs) on some walks. Build upper body strength too.",
      "Walk faster for the last 5 minutes. Finish strong and build mental toughness.",
      "Explore new neighborhoods or trails. Adventure keeps motivation high!",
      "Your metabolism stays elevated for hours after walking. You're burning calories all day.",
      "Practice power walking: pump your arms, quicken your step. Feel that heart rate climb!",
      "Walk 30 minutes after dinner. It aids digestion and improves blood sugar control.",
      "Take a 20-minute walk before stressful events. It clears your mind amazingly well.",
      "Challenge yourself with stairs. They're functional strength training in disguise.",
      "Walking in groups? Keep pace with someone slightly faster. Healthy competition helps!",
      "Your resting heart rate is likely lower now. That's a sign of improved fitness!",
      "Aim for 150 minutes total walking this week. Break it into manageable chunks.",
      "Walk backwards for 30 seconds during your walk. It strengthens different muscles!",
      "Notice how your mood improves after walking. Exercise is medicine for mental health.",
      "Your body is burning more fat as fuel now. Metabolic adaptation is real!",
      "Walk at different times of day. Morning, lunch, evening - vary it to stay consistent.",
      "Push yourself one day, take it easy the next. Smart training prevents burnout.",
      "You're in the intermediate zone now. Your body is capable of more than you think!",
      "Walking 30 minutes daily can reduce dementia risk by 40%. You're protecting your brain!",
      "You've built real fitness! You can now walk 30 minutes without struggle. That's huge!"
    ],
    advanced: [
      "Time to push! Walk for 45 minutes without stopping. You're ready for this challenge.",
      "Try Nordic walking with poles. It engages 90% of your muscles and burns 20% more calories.",
      "Walk hills with purpose. Power up them to build serious leg strength.",
      "Your aerobic base is strong. Consider adding short jogging intervals to some walks.",
      "Walk-run intervals: 3 min walk, 1 min jog. Bridge the gap to running if interested.",
      "Aim for 10,000+ steps daily. You have the endurance for this now.",
      "Walk fast enough that conversation becomes challenging. This is your cardio zone.",
      "Add a weighted vest (5-10% of body weight). Level up your strength training.",
      "Walk in sand or on trails. Unstable surfaces engage stabilizer muscles.",
      "Your VO2 max is likely significantly improved. Your cells use oxygen more efficiently!",
      "Incorporate lunges or squats during your walks. Functional fitness = real-world strength.",
      "Walk 5K (3.1 miles) this week. Test your endurance - you've got this!",
      "Try fasted morning walks. Your body becomes efficient at burning stored fat.",
      "Walk a new challenging route. Physical novelty creates mental resilience.",
      "Your mitochondria (cell power plants) have increased. You have more energy naturally!",
      "Walk with a heart rate monitor. Aim for 60-70% of max heart rate for fat burning.",
      "Consider entering a charity walk. Community events amplify motivation.",
      "Walk hills in reverse. Backward walking strengthens quads and improves balance.",
      "Your resting metabolism is higher now. Muscle is metabolically active tissue!",
      "Add sprint intervals: 30 sec fast walk, 90 sec recovery. Build explosive power.",
      "Walk after weight training. It flushes lactic acid and speeds recovery.",
      "Your cardiovascular system is now highly efficient. Resting heart rate under 60? Athlete status!",
      "Walk different terrains weekly: beach, forest, hills. Variety challenges body and mind.",
      "Consider a walking vacation or hiking trip. You have the fitness for it now!",
      "Your bone density has likely improved. Weight-bearing exercise strengthens bones.",
      "Walk with intention and purpose. You're an athlete maintaining peak fitness.",
      "Try a 10K walk (6.2 miles). It's a serious achievement - challenge yourself!",
      "Your mental clarity from walking is peak. Exercise grows new brain cells!",
      "You've transformed your health. 45 minutes of walking is now routine for you.",
      "You completed 30 days at an advanced level! You're in the top 5% of fitness commitment. Incredible!"
    ]
  };

  const [challenge, setChallenge] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [todayGoal, setTodayGoal] = useState(5);
  const [checkedIn, setCheckedIn] = useState(false);
  const [showBackfill, setShowBackfill] = useState(false);
  const [yesterdayAnswer, setYesterdayAnswer] = useState(false);
  const [todayAnswer, setTodayAnswer] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [tip, setTip] = useState('');

  useEffect(() => {
    loadChallengeData();
  }, []);

  const loadChallengeData = () => {
    const saved = localStorage.getItem('walk_challenge');
    if (!saved) return;

    const data = JSON.parse(saved);
    
    const startDate = new Date(data.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const day = Math.max(1, Math.min(30, daysDiff));
    
    let goal;
    if (day <= 7) goal = data.goals.week1;
    else if (day <= 14) goal = data.goals.week2;
    else if (day <= 21) goal = data.goals.week3;
    else goal = data.goals.week4;

    const todayCheckIn = data.checkIns.find(c => c.day === day);
    const alreadyCheckedIn = !!todayCheckIn;

    const yesterdayCheckIn = data.checkIns.find(c => c.day === day - 1);
    const shouldShowBackfill = !yesterdayCheckIn && day > 1 && data.currentStreak === 0;

    setChallenge(data);
    setCurrentDay(day);
    setTodayGoal(goal);
    setCheckedIn(alreadyCheckedIn);
    setShowBackfill(shouldShowBackfill);

    const tipIndex = day - 1;
    const levelTips = WALKING_TIPS[data.level] || WALKING_TIPS.beginner;
    setTip(levelTips[tipIndex] || levelTips[0]);

    if (alreadyCheckedIn) {
      setPointsEarned(todayCheckIn.points);
    }
  };

  const handleAnswer = (answer) => {
    if (showBackfill && yesterdayAnswer !== null) {
      submitCheckIn(yesterdayAnswer, answer);
    } else if (!showBackfill) {
      submitCheckIn(null, answer);
    } else {
      setTodayAnswer(answer);
      if (yesterdayAnswer !== null) {
        submitCheckIn(yesterdayAnswer, answer);
      }
    }
  };

  const handleYesterdayAnswer = (answer) => {
    setYesterdayAnswer(answer);
    if (todayAnswer !== null) {
      submitCheckIn(answer, todayAnswer);
    }
  };

  const submitCheckIn = (yesterday, today) => {
    let points = 0;
    let newStreak = challenge.currentStreak;
    const newCheckIns = [...challenge.checkIns];

    if (yesterday !== null && showBackfill) {
      points += yesterday ? 1 : 0;
      newCheckIns.push({
        day: currentDay - 1,
        completed: yesterday,
        points: yesterday ? 1 : 0,
        isLate: true,
        timestamp: new Date().toISOString()
      });
      if (!yesterday) newStreak = 0;
    }

    points += today ? 2 : 0;
    newCheckIns.push({
      day: currentDay,
      completed: today,
      points: today ? 2 : 0,
      isLate: false,
      timestamp: new Date().toISOString()
    });

    if (today) {
      if (yesterday === false || (showBackfill && !yesterday)) {
        newStreak = 1;
      } else {
        newStreak++;
      }
    } else {
      newStreak = 0;
    }

    const updatedChallenge = {
      ...challenge,
      checkIns: newCheckIns,
      totalPoints: challenge.totalPoints + points,
      currentStreak: newStreak,
      currentDay: currentDay
    };

    if (currentDay >= 30) {
      if (updatedChallenge.totalPoints >= 50) {
        updatedChallenge.status = 'completed';
        localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
        onComplete('success');
        return;
      } else {
        updatedChallenge.status = 'incomplete';
        localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
        onComplete('incomplete');
        return;
      }
    }

    localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
    
    setChallenge(updatedChallenge);
    setPointsEarned(points);
    setCheckedIn(true);
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  if (checkedIn) {
    const getTomorrowGoal = () => {
      if (currentDay >= 30) return null;
      const nextDay = currentDay + 1;
      if (nextDay <= 7) return challenge.goals.week1;
      if (nextDay <= 14) return challenge.goals.week2;
      if (nextDay <= 21) return challenge.goals.week3;
      return challenge.goals.week4;
    };

    const tomorrowGoal = getTomorrowGoal();

    return (
      <div className="screen-container">
        <div className="screen-card">
          <div className="logo">STUDIO STRONG × PREMIER U</div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>✅</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>Great work!</h2>
            <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '8px 20px', borderRadius: '20px', fontWeight: '700', fontSize: '16px' }}>
              You earned {pointsEarned} point{pointsEarned !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', border: '2px solid #e2e8f0', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Your Points</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#2d3748', marginBottom: '4px' }}>{challenge.totalPoints}/60</div>
              <div style={{ fontSize: '12px', color: '#718096', marginBottom: '12px' }}>Need 50 to graduate</div>
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(challenge.totalPoints / 60) * 100}%`, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', transition: 'width 0.3s ease' }}></div>
              </div>
            </div>

            <div style={{ background: 'white', border: '2px solid #e2e8f0', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Current Streak</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#2d3748', marginBottom: '4px' }}>🔥 {challenge.currentStreak}</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>
                {challenge.currentStreak > 0 ? 'Keep it going!' : 'Start fresh tomorrow!'}
              </div>
            </div>
          </div>

          {tomorrowGoal && (
            <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', border: '2px solid #3b82f6', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#1e40af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Tomorrow's Goal</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e3a8a' }}>Walk {tomorrowGoal} minutes</div>
            </div>
          )}

          <div style={{ background: '#f7fafc', border: '2px solid #e2e8f0', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>💡 Did You Know?</div>
            <div style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>{tip}</div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '2px solid #f59e0b', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>Want daily accountability?</div>
            <div style={{ fontSize: '14px', color: '#92400e', marginBottom: '14px' }}>Get text check-ins + trainer support for $49/month</div>
            <button style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
              Learn More
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button onClick={() => onNavigate('dashboard')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              Back to Dashboard
            </button>
            <button onClick={() => onNavigate('roadmap')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              View Roadmap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#667eea', letterSpacing: '2px', marginBottom: '8px' }}>DAY {currentDay} OF 30</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>Walk Challenge</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '2px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '4px' }}>{challenge.totalPoints}/60</span>
            <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Points</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '4px' }}>🔥 {challenge.currentStreak}</span>
            <span style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Streak</span>
          </div>
        </div>

        {showBackfill && (
          <div style={{ background: 'linear-gradient(135deg, #fff3cd 0%, #fef5e7 100%)', border: '2px solid #f59e0b', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: '700', color: '#92400e', marginBottom: '16px' }}>
              ⚠️ You missed Day {currentDay - 1}
            </div>
            <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
              Did you walk {todayGoal} minutes yesterday?
            </div>
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
              (You'll earn 1 point if yes)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => handleYesterdayAnswer(true)}
                style={{ padding: '20px', fontSize: '20px', fontWeight: '700', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '3px solid', background: yesterdayAnswer === true ? '#48bb78' : 'white', color: yesterdayAnswer === true ? 'white' : '#48bb78', borderColor: '#48bb78' }}
              >
                YES
              </button>
              <button
                onClick={() => handleYesterdayAnswer(false)}
                style={{ padding: '20px', fontSize: '20px', fontWeight: '700', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '3px solid', background: yesterdayAnswer === false ? '#f56565' : 'white', color: yesterdayAnswer === false ? 'white' : '#f56565', borderColor: '#f56565' }}
              >
                NO
              </button>
            </div>
          </div>
        )}

        <div style={{ background: 'white', border: '2px solid #e2e8f0', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
            Did you walk {todayGoal} minutes today?
          </div>
          <div style={{ textAlign: 'center', fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
            (You'll earn 2 points if yes)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => handleAnswer(true)}
              style={{ padding: '20px', fontSize: '20px', fontWeight: '700', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '3px solid #48bb78', background: 'white', color: '#48bb78' }}
            >
              YES
            </button>
            <button
              onClick={() => handleAnswer(false)}
              style={{ padding: '20px', fontSize: '20px', fontWeight: '700', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', border: '3px solid #f56565', background: 'white', color: '#f56565' }}
            >
              NO
            </button>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', border: '2px solid #3b82f6', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', marginBottom: '8px' }}>Need daily accountability?</div>
          <div style={{ fontSize: '13px', color: '#1e40af', marginBottom: '14px' }}>Get text reminders + trainer support for $49/month</div>
          <button style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletionSuccessScreen({ onSelectNextChallenge }) {
  const [challenge, setChallenge] = useState(null);
  const [maxStreak, setMaxStreak] = useState(0);
  const [daysCompleted, setDaysCompleted] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('walk_challenge');
    if (saved) {
      const data = JSON.parse(saved);
      setChallenge(data);

      const completedDays = data.checkIns.filter(c => c.completed).length;
      setDaysCompleted(completedDays);

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

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '600px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px', animation: 'bounce 1s ease-in-out' }}>🏆</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>Challenge Complete!</h1>
          <p style={{ fontSize: '18px', color: '#718096' }}>You crushed the Walk Challenge</p>
        </div>

        <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          {[
            { label: 'Final Points', value: `${challenge.totalPoints}/60 🎯` },
            { label: 'Days Completed', value: `${daysCompleted}/30 ✓` },
            { label: 'Longest Streak', value: `${maxStreak} days 🔥` }
          ].map((stat, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
              <span style={{ fontSize: '15px', color: '#718096', fontWeight: '600' }}>{stat.label}</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#2d3748' }}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '2px solid #f59e0b', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🎖️</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>Claim Your Sticker!</div>
          <div style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.6' }}>
            Show this screen at your next Premier U appointment to receive your exclusive Walk Challenge achievement sticker!
          </div>
        </div>

        <div style={{ background: '#f7fafc', border: '2px solid #e2e8f0', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', textAlign: 'center' }}>Your Journey Progress</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Movement</div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>1/4 complete</div>
            </div>
            <div style={{ background: 'white', color: '#718096', border: '2px solid #e2e8f0', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Nutrition</div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>0/12 complete</div>
            </div>
            <div style={{ background: 'white', color: '#718096', border: '2px solid #e2e8f0', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Awareness</div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>0/6 complete</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', textAlign: 'center', marginBottom: '16px' }}>Choose Your Next Challenge</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { emoji: '💪', name: 'Bodyweight Low', category: 'Movement' },
              { emoji: '🥩', name: 'Protein 100g', category: 'Nutrition' },
              { emoji: '🛌', name: 'Sleep 1', category: 'Awareness' }
            ].map((ch, i) => (
              <button key={i} onClick={() => onSelectNextChallenge(ch.name.toLowerCase())} style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>{ch.emoji}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' }}>{ch.name}</div>
                <div style={{ fontSize: '11px', color: '#718096' }}>{ch.category}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>🚀 Ready to Level Up?</div>
          <div style={{ fontSize: '14px', marginBottom: '16px', opacity: 0.95 }}>Get daily text check-ins + trainer support for $49/month</div>
          <button style={{ background: 'white', color: '#667eea', padding: '14px 28px', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
            Add Accountability
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletionIncompleteScreen({ onTryAgain, onSelectDifferent }) {
  const [challenge, setChallenge] = useState(null);
  const [maxStreak, setMaxStreak] = useState(0);
  const [daysCompleted, setDaysCompleted] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('walk_challenge');
    if (saved) {
      const data = JSON.parse(saved);
      setChallenge(data);

      const completedDays = data.checkIns.filter(c => c.completed).length;
      setDaysCompleted(completedDays);

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
      <div className="screen-card" style={{ maxWidth: '600px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>💪</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>You Showed Up!</h1>
          <p style={{ fontSize: '16px', color: '#718096', lineHeight: '1.6' }}>
            Every step forward counts, even if we didn't hit graduation this time
          </p>
        </div>

        <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          {[
            { label: 'Final Points', value: `${challenge.totalPoints}/60` },
            { label: 'Days Completed', value: `${daysCompleted}/30 ✓` },
            { label: 'Longest Streak', value: `${maxStreak} days 🔥` }
          ].map((stat, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
              <span style={{ fontSize: '15px', color: '#718096', fontWeight: '600' }}>{stat.label}</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#2d3748' }}>{stat.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', border: '2px solid #3b82f6', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>💡</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af', textAlign: 'center', marginBottom: '8px' }}>What This Shows</div>
          <div style={{ fontSize: '15px', color: '#1e40af', textAlign: 'center', lineHeight: '1.5' }}>{getInsight()}</div>
        </div>

        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6', marginBottom: '12px' }}>
            Building new habits is <strong>hard</strong>. The fact that you started means you're serious about your health. Most people never even try.
          </p>
          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.6', margin: 0 }}>
            Research shows it takes <strong>multiple attempts</strong> to make habits stick. This was practice. Now you know what to expect.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', textAlign: 'center', marginBottom: '16px' }}>What's Next?</div>
          
          <button onClick={onTryAgain} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', border: 'none', marginBottom: '16px', textAlign: 'left' }}>
            <div style={{ fontSize: '40px', flexShrink: 0 }}>🔄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Try Walk Challenge Again</div>
              <div style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4' }}>Start fresh with everything you learned. You'll do better!</div>
            </div>
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', color: '#718096', fontWeight: '600', margin: '16px 0' }}>OR</div>

          <button onClick={onSelectDifferent} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: 'white', color: '#2d3748', border: '2px solid #e2e8f0', textAlign: 'left' }}>
            <div style={{ fontSize: '40px', flexShrink: 0 }}>🎯</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Try a Different Challenge</div>
              <div style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4' }}>Maybe a different goal will be easier to stick with right now</div>
            </div>
          </button>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '3px solid #f59e0b', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.2)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#92400e', marginBottom: '8px' }}>Need Daily Support?</div>
          <div style={{ fontSize: '15px', color: '#92400e', lineHeight: '1.6', marginBottom: '16px' }}>
            Get text check-ins every day from a real trainer. 85% of our accountability members complete their challenges.
          </div>
          <button style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '16px 32px', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '17px', cursor: 'pointer', marginBottom: '8px' }}>
            Add Accountability - $49/month
          </button>
          <div style={{ fontSize: '12px', color: '#92400e', fontStyle: 'italic' }}>Cancel anytime. First week free if you don't love it.</div>
        </div>
      </div>
    </div>
  );
}

function RoadmapScreen({ onBack }) {
  const [challenge, setChallenge] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('walk_challenge');
    if (saved) {
      const data = JSON.parse(saved);
      setChallenge(data);

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

  const getDayStatus = (day) => {
    if (day > currentDay) return 'future';
    if (day === currentDay) return 'current';
    
    const checkIn = challenge.checkIns.find(c => c.day === day);
    if (checkIn) {
      return checkIn.completed ? 'completed' : 'missed';
    }
    return 'missed';
  };

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

  const weeks = [
    { week: 1, days: Array.from({length: 7}, (_, i) => i + 1) },
    { week: 2, days: Array.from({length: 7}, (_, i) => i + 8) },
    { week: 3, days: Array.from({length: 7}, (_, i) => i + 15) },
    { week: 4, days: Array.from({length: 7}, (_, i) => i + 22) },
    { week: 4, days: [29, 30] }
  ];

  const dayStyles = {
    completed: { background: '#48bb78', borderColor: '#48bb78', color: 'white' },
    current: { background: '#667eea', borderColor: '#667eea', color: 'white' },
    missed: { background: '#f56565', borderColor: '#f56565', color: 'white' },
    future: { background: '#f7fafc', borderColor: '#e2e8f0', color: '#a0aec0' },
    empty: { background: 'transparent', border: 'none' }
  };

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '700px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>Your 30-Day Roadmap</h1>
          <p style={{ fontSize: '15px', color: '#718096' }}>
            {challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)} Level • Walk Challenge
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', padding: '16px', background: '#f7fafc', borderRadius: '10px', border: '2px solid #e2e8f0' }}>
          {[
            { label: 'Completed', color: '#48bb78' },
            { label: 'Current', color: '#667eea' },
            { label: 'Missed', color: '#f56565' },
            { label: 'Future', color: '#e2e8f0' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4a5568', fontWeight: '600' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', background: item.color, borderColor: item.color }}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '24px' }}>
          {weeks.map((weekData, weekIndex) => (
            <div key={weekIndex} style={{ marginBottom: '24px' }}>
              {weekIndex < 4 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f7fafc', borderRadius: '8px', marginBottom: '12px', border: '2px solid #e2e8f0' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#2d3748' }}>Week {weekData.week}</span>
                  <span style={{ fontSize: '13px', color: '#718096', fontWeight: '600', background: 'white', padding: '4px 12px', borderRadius: '12px' }}>
                    Goal: {getWeekGoal(weekData.week)} min
                  </span>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {weekData.days.map(day => {
                  const status = getDayStatus(day);
                  const style = dayStyles[status];
                  return (
                    <div key={day} style={{ 
                      aspectRatio: '1',
                      borderRadius: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      position: 'relative',
                      border: '2px solid',
                      transition: 'all 0.2s',
                      ...style
                    }}>
                      <div style={{ fontSize: '16px' }}>{day}</div>
                      {status === 'completed' && <div style={{ fontSize: '12px', marginTop: '2px' }}>✓</div>}
                      {status === 'current' && <div style={{ fontSize: '12px', marginTop: '2px' }}>📍</div>}
                      {status === 'missed' && <div style={{ fontSize: '12px', marginTop: '2px' }}>✗</div>}
                    </div>
                  );
                })}
                {weekIndex === 4 && Array.from({length: 5}, (_, i) => (
                  <div key={`empty-${i}`} style={{ aspectRatio: '1' }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Points', value: `${challenge.totalPoints}/60` },
            { label: 'Streak', value: `🔥 ${challenge.currentStreak}` },
            { label: 'Days Left', value: Math.max(0, 30 - currentDay + 1) }
          ].map((stat, i) => (
            <div key={i} style={{ background: 'white', border: '2px solid #e2e8f0', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <button onClick={onBack} style={{ width: '100%', padding: '16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ onBack }) {
  const [userData, setUserData] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [reminderTime, setReminderTime] = useState('20:00'); // 8pm default
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [timezone, setTimezone] = useState('America/Chicago');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Load user data
    const saved = localStorage.getItem('user_data');
    if (saved) {
      const data = JSON.parse(saved);
      setUserData(data);
      setEditData({
        name: data.name,
        email: data.email,
        phone: data.phone
      });
    }

    // Load challenge data
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      setChallenge(JSON.parse(savedChallenge));
    }

    // Load reminder settings (would come from DB in production)
    const savedReminder = localStorage.getItem('reminder_settings');
    if (savedReminder) {
      const settings = JSON.parse(savedReminder);
      setReminderTime(settings.time || '20:00');
      setReminderEnabled(settings.enabled !== false);
      setTimezone(settings.timezone || 'America/Chicago');
    }
  }, []);

  const handleSaveAccount = () => {
    const updatedData = {
      ...userData,
      ...editData
    };
    localStorage.setItem('user_data', JSON.stringify(updatedData));
    setUserData(updatedData);
    setEditing(false);
    alert('Account updated successfully!');
  };

  const handleSaveReminder = () => {
    const settings = {
      time: reminderTime,
      enabled: reminderEnabled,
      timezone: timezone
    };
    localStorage.setItem('reminder_settings', JSON.stringify(settings));
    alert('Reminder settings saved!');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const getChallengeStatus = () => {
    if (!challenge) return null;
    if (challenge.status === 'completed') return { text: 'Completed ✓', color: '#48bb78' };
    if (challenge.status === 'incomplete') return { text: 'Incomplete', color: '#f59e0b' };
    if (challenge.status === 'pending') return { text: 'Starts Tomorrow', color: '#667eea' };
    return { text: `Day ${challenge.currentDay}/30`, color: '#667eea' };
  };

  const status = getChallengeStatus();

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '600px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>Settings</h1>
          <p style={{ fontSize: '15px', color: '#718096' }}>Manage your account and preferences</p>
        </div>

        {/* Account Information */}
        <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>Account Information</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{ background: '#667eea', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Edit
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>PU Patient ID</div>
              <div style={{ fontSize: '16px', color: '#2d3748', fontWeight: '600' }}>{userData.puid}</div>
            </div>

            {editing ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Name</label>
                  <input
                    type="text"
                    className="text-input"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Email</label>
                  <input
                    type="email"
                    className="text-input"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Phone</label>
                  <input
                    type="tel"
                    className="text-input"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button onClick={handleSaveAccount} style={{ flex: 1, padding: '12px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                    Save Changes
                  </button>
                  <button onClick={() => {
                    setEditing(false);
                    setEditData({
                      name: userData.name,
                      email: userData.email,
                      phone: userData.phone
                    });
                  }} style={{ flex: 1, padding: '12px', background: 'white', color: '#718096', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Name</div>
                  <div style={{ fontSize: '16px', color: '#2d3748' }}>{userData.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '16px', color: '#2d3748' }}>{userData.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Phone</div>
                  <div style={{ fontSize: '16px', color: '#2d3748' }}>{userData.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>PIN</div>
                  <div style={{ fontSize: '16px', color: '#2d3748' }}>••••</div>
                  <p style={{ fontSize: '13px', color: '#718096', marginTop: '4px' }}>Contact Premier U staff to reset your PIN</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Active Challenges */}
        {challenge && (
          <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>Active Challenges</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f7fafc', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px' }}>🚶‍♂️</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748' }}>Walk Challenge</div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>
                    {challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)} Level • {challenge.totalPoints}/60 points
                  </div>
                </div>
              </div>
              {status && (
                <div style={{ background: status.color, color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '700' }}>
                  {status.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Email Reminder Settings */}
        <div style={{ background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>Email Reminder Settings</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>
                Send me a reminder email if I haven't checked in
              </span>
            </label>
          </div>

          {reminderEnabled && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', fontWeight: '600', marginBottom: '8px' }}>
                  Reminder Time
                </label>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#2d3748' }}
                >
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM (Default)</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
                <p style={{ fontSize: '13px', color: '#718096', marginTop: '6px' }}>
                  We'll email you at this time if you haven't checked in yet
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#4a5568', fontWeight: '600', marginBottom: '8px' }}>
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #e2e8f0', borderRadius: '8px', background: 'white', color: '#2d3748' }}
                >
                  <option value="America/Chicago">Central Time (CST/CDT)</option>
                  <option value="America/New_York">Eastern Time (EST/EDT)</option>
                  <option value="America/Denver">Mountain Time (MST/MDT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                  <option value="America/Anchorage">Alaska Time (AKST/AKDT)</option>
                  <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
                </select>
              </div>

              <button onClick={handleSaveReminder} style={{ width: '100%', padding: '14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
                Save Reminder Settings
              </button>
            </>
          )}
        </div>

        {/* Accountability Upgrade */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px', textAlign: 'center', color: 'white', marginBottom: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>🚀 Want Daily Accountability?</div>
          <p style={{ fontSize: '15px', marginBottom: '16px', opacity: 0.95' }}>
            Get text check-ins from a real trainer every day for $49/month
          </p>
          <button style={{ background: 'white', color: '#667eea', padding: '14px 28px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
            Learn More
          </button>
        </div>

        {/* Back Button */}
        <button onClick={onBack} style={{ width: '100%', padding: '16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default App;
