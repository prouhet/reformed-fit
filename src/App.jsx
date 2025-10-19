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
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <h1 className="screen-title">Dashboard Preview - Coming Soon!</h1>
        <p className="screen-subtitle">This screen will show your challenge waiting to start tomorrow</p>
        <button className="submit-button" onClick={() => onNavigate('roadmap')}>View Roadmap</button>
      </div>
    </div>
  );
}

function DailyCheckInScreen({ onComplete, onNavigate }) {
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <h1 className="screen-title">Daily Check-In - Coming Soon!</h1>
        <p className="screen-subtitle">This is where you'll check in each day</p>
        <button className="submit-button" onClick={() => onNavigate('dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );
}

function CompletionSuccessScreen({ onSelectNextChallenge }) {
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <h1 className="screen-title">🏆 Challenge Complete!</h1>
        <p className="screen-subtitle">Success screen - Coming Soon!</p>
      </div>
    </div>
  );
}

function CompletionIncompleteScreen({ onTryAgain, onSelectDifferent }) {
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <h1 className="screen-title">💪 You Showed Up!</h1>
        <p className="screen-subtitle">Encouragement screen - Coming Soon!</p>
        <button className="submit-button" onClick={onTryAgain}>Try Again</button>
      </div>
    </div>
  );
}

function RoadmapScreen({ onBack }) {
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <h1 className="screen-title">Roadmap - Coming Soon!</h1>
        <p className="screen-subtitle">30-day calendar view</p>
        <button className="submit-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

export default App;
