// ============================================
// App.jsx - COMPLETE WALK CHALLENGE APP
// All 11 screens included
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

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const challenge = JSON.parse(savedChallenge);
      
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
              setCurrentScreen('settings');
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
            } else if (destination === 'settings') {
              setCurrentScreen('settings');
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

// ============================================
// SCREEN 1: PU ID ENTRY
// ============================================
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

// ============================================
// SCREEN 2: ACCOUNT SETUP
// ============================================
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

// ============================================
// SCREEN 3: CHALLENGE SELECTION
// ============================================
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

// ============================================
// SCREEN 4: WALK ASSESSMENT
// ============================================
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

// ============================================
// SCREEN 5: PLAN OVERVIEW
// ============================================
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

// ============================================
// SCREEN 6: DASHBOARD PREVIEW (DAY 0)
// ============================================
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
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🚶‍♂️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>Walk Challenge</h1>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
            {challenge.level.toUpperCase()} LEVEL
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '2px solid #f59e0b', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#92400e', marginBottom: '8px' }}>Challenge Starts Tomorrow!</h2>
          <p style={{ fontSize: '16px', color: '#92400e', fontWeight: '600' }}>Day 1 begins: Tomorrow</p>
        </div>

        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Your First Goal</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>Walk {getWeek1Goal()} minutes</div>
          <p style={{ fontSize: '14px', color: '#718096', lineHeight: '1.5' }}>Check in tomorrow to track your progress and earn points!</p>
        </div>

        <button style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: '700', background: '#e2e8f0', color: '#a0aec0', border: '2px solid #cbd5e0', borderRadius: '12px', cursor: 'not-allowed', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled>
          <span style={{ fontSize: '20px' }}>🔒</span>
          <span>Check-In Available Tomorrow</span>
        </button>

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

// ============================================
// SCREEN 7: DAILY CHECK-IN
// ============================================
function DailyCheckInScreen({ onComplete, onNavigate }) {
  const [challenge, setChallenge] = useState(null);
  const [minutes, setMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const data = JSON.parse(savedChallenge);
      setChallenge(data);
    }
  }, []);

  const getCurrentWeekGoal = () => {
    if (!challenge) return 0;
    const day = challenge.currentDay;
    if (day <= 7) return challenge.goals.week1;
    if (day <= 14) return challenge.goals.week2;
    if (day <= 21) return challenge.goals.week3;
    return challenge.goals.week4;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const walkMinutes = parseInt(minutes);
    const goal = getCurrentWeekGoal();
    const pointsEarned = walkMinutes >= goal ? 2 : 1;

    const updatedChallenge = {
      ...challenge,
      currentDay: challenge.currentDay + 1,
      totalPoints: challenge.totalPoints + pointsEarned,
      currentStreak: walkMinutes >= goal ? challenge.currentStreak + 1 : 0,
      checkIns: [...challenge.checkIns, {
        day: challenge.currentDay + 1,
        minutes: walkMinutes,
        goal: goal,
        points: pointsEarned,
        date: new Date().toISOString()
      }]
    };

    if (updatedChallenge.currentDay >= 30) {
      updatedChallenge.status = updatedChallenge.totalPoints >= 50 ? 'completed' : 'incomplete';
      localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
      setTimeout(() => {
        onComplete(updatedChallenge.status === 'completed' ? 'success' : 'incomplete');
      }, 500);
    } else {
      localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚶‍♂️</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>Day {challenge.currentDay + 1} Check-In</h1>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
            {challenge.level.toUpperCase()} LEVEL
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>{challenge.totalPoints}</div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>POINTS</div>
          </div>
          <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>{challenge.currentStreak}</div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>STREAK</div>
          </div>
          <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>{challenge.currentDay}/30</div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>DAYS</div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>TODAY'S GOAL</div>
          <div style={{ fontSize: '36px', fontWeight: '800' }}>{getCurrentWeekGoal()} minutes</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
              How many minutes did you walk today?
            </label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              min="0"
              max="240"
              required
              autoFocus
              style={{ width: '100%', padding: '16px', fontSize: '24px', fontWeight: '700', textAlign: 'center', border: '3px solid #e2e8f0', borderRadius: '12px', background: 'white' }}
              placeholder="0"
            />
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#718096', textAlign: 'center' }}>Enter the actual time you walked</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Check-In'}
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => onNavigate('roadmap')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            View Roadmap
          </button>
          <button onClick={() => onNavigate('settings')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 8: COMPLETION SUCCESS
// ============================================
function CompletionSuccessScreen({ onSelectNextChallenge }) {
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

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>Challenge Complete!</h1>
          <p style={{ fontSize: '16px', color: '#718096' }}>You've earned your achievement sticker!</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '3px solid #f59e0b', padding: '30px', borderRadius: '16px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🏆</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#92400e', marginBottom: '12px' }}>30-Day Walk Challenge</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#92400e' }}>{challenge.totalPoints} / 60 Points</div>
        </div>

        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', textAlign: 'center' }}>📊 Your Stats</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#718096' }}>Total Days Completed</span>
              <span style={{ fontWeight: '700', color: '#2d3748' }}>30</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#718096' }}>Points Earned</span>
              <span style={{ fontWeight: '700', color: '#2d3748' }}>{challenge.totalPoints}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#718096' }}>Longest Streak</span>
              <span style={{ fontWeight: '700', color: '#2d3748' }}>{Math.max(...challenge.checkIns.map((_, i) => {
                let streak = 0;
                for (let j = i; j < challenge.checkIns.length; j++) {
                  if (challenge.checkIns[j].points === 2) streak++;
                  else break;
                }
                return streak;
              }))} days</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', textAlign: 'center' }}>Ready for your next challenge?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => onSelectNextChallenge('protein')} style={{ padding: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              🥩 Start Protein Challenge
            </button>
            <button onClick={() => onSelectNextChallenge('walk')} style={{ padding: '16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              🚶‍♂️ Do Walk Challenge Again
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#718096' }}>Your sticker will be mailed to you within 2 weeks! 📬</p>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 9: COMPLETION INCOMPLETE
// ============================================
function CompletionIncompleteScreen({ onTryAgain, onSelectDifferent }) {
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

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💪</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>Challenge Complete</h1>
          <p style={{ fontSize: '16px', color: '#718096' }}>You finished 30 days, but didn't quite reach the goal</p>
        </div>

        <div style={{ background: '#fef5e7', border: '2px solid #f59e0b', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
          <div style={{ fontSize: '18px', color: '#92400e', marginBottom: '12px' }}>You earned</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#92400e', marginBottom: '8px' }}>{challenge.totalPoints} / 60 Points</div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>Need 50 points to earn sticker</div>
        </div>

        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>💡 What happened?</div>
          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6', marginBottom: '16px' }}>
            Building new habits is tough! You showed up for 30 days, which is already an achievement. The points system rewards consistency and meeting your goals.
          </p>
          <div style={{ background: 'white', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
            <strong>Remember:</strong> Check in on time = 2 points, 1 day late = 1 point. Meeting your walk goal each day helps maximize points!
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onTryAgain} style={{ padding: '18px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
            🔄 Try Walk Challenge Again
          </button>
          <button onClick={onSelectDifferent} style={{ padding: '18px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', color: '#4a5568', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Choose Different Challenge
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#718096', lineHeight: '1.5' }}>
          Every step forward is progress. We're proud of you for completing 30 days! 💚
        </p>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 10: ROADMAP
// ============================================
function RoadmapScreen({ onBack }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    console.log('Roadmap - Raw localStorage:', savedChallenge);
    if (savedChallenge) {
      try {
        const data = JSON.parse(savedChallenge);
        console.log('Roadmap - Parsed challenge:', data);
        setChallenge(data);
      } catch (error) {
        console.error('Roadmap - Parse error:', error);
      }
    }
    setLoading(false);
  }, []);

  const getWeekGoal = (week) => {
    if (!challenge || !challenge.goals) return 0;
    if (week === 1) return challenge.goals.week1 || 0;
    if (week === 2) return challenge.goals.week2 || 0;
    if (week === 3) return challenge.goals.week3 || 0;
    return challenge.goals.week4 || 0;
  };

  const getDayStatus = (day) => {
    if (!challenge) return 'locked';
    if (day > challenge.currentDay) return 'locked';
    if (challenge.currentDay === 0) return 'locked';
    const checkIn = challenge.checkIns && challenge.checkIns.find(c => c.day === day);
    if (!checkIn) return 'missed';
    return checkIn.points === 2 ? 'complete' : 'partial';
  };

  if (loading) {
    return (
      <div className="screen-container">
        <div className="screen-card">
          <p>Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="screen-container">
        <div className="screen-card">
          <button onClick={onBack} style={{ marginBottom: '20px', padding: '10px 20px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', color: '#4a5568', fontWeight: '600', cursor: 'pointer' }}>
            ← Back
          </button>
          <p>No challenge data found. Please start a challenge first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '600px' }}>
        <button onClick={onBack} style={{ marginBottom: '20px', padding: '10px 20px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', color: '#4a5568', fontWeight: '600', cursor: 'pointer' }}>
          ← Back
        </button>

        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>30-Day Roadmap</h1>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
            {challenge.level.toUpperCase()} LEVEL
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(week => (
            <div key={week} style={{ marginBottom: '24px', background: '#f7fafc', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>Week {week}</h3>
                <span style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '14px' }}>
                  {getWeekGoal(week)} min/day
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const day = (week - 1) * 7 + i + 1;
                  const status = getDayStatus(day);
                  return (
                    <div 
                      key={day}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: status === 'complete' ? '#48bb78' : status === 'partial' ? '#f59e0b' : status === 'missed' ? '#ef4444' : 'white',
                        color: status === 'locked' ? '#a0aec0' : 'white',
                        border: `2px solid ${status === 'locked' ? '#e2e8f0' : 'transparent'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '700'
                      }}
                    >
                      {status === 'locked' ? '🔒' : day}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>Legend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#48bb78', borderRadius: '6px' }}></div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Completed on time (2 pts)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#f59e0b', borderRadius: '6px' }}></div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Completed late (1 pt)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#ef4444', borderRadius: '6px' }}></div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Missed (0 pts)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔒</div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Not yet available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 11: SETTINGS
// ============================================
function SettingsScreen({ onBack }) {
  const [userData, setUserData] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [settings, setSettings] = useState({
    reminderTime: '20:00',
    timezone: 'America/Chicago',
    emailRemindersEnabled: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const savedChallenge = localStorage.getItem('walk_challenge');
    const savedSettings = localStorage.getItem('user_settings');
    
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
    if (savedChallenge) {
      setChallenge(JSON.parse(savedChallenge));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    localStorage.setItem('user_settings', JSON.stringify(settings));
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your challenge? This will delete all your progress!')) {
      localStorage.removeItem('walk_challenge');
      localStorage.removeItem('assessment_data');
      alert('Challenge reset successfully!');
      window.location.reload();
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '700px' }}>
        <button onClick={onBack} className="back-button">← Back</button>
        
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px', textAlign: 'center' }}>Settings</h1>
        <p style={{ fontSize: '15px', color: '#718096', textAlign: 'center', marginBottom: '32px' }}>
          Manage your account and preferences
        </p>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Account Info Section */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>━━━ ACCOUNT INFO ━━━</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#718096', marginBottom: '4px' }}>Name</div>
              <div style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>{userData?.name || 'Not set'}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#718096', marginBottom: '4px' }}>Email</div>
              <div style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>{userData?.email || 'Not set'}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#718096', marginBottom: '4px' }}>Phone</div>
              <div style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>{userData?.phone || 'Not set'}</div>
            </div>
          </div>
        </div>

        {/* Email Reminders Section */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>━━━ EMAIL REMINDERS ━━━</div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailRemindersEnabled}
                onChange={(e) => setSettings({...settings, emailRemindersEnabled: e.target.checked})}
                style={{ width: '20px', height: '20px', marginRight: '12px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '15px', color: '#2d3748' }}>Send reminder if I forget to check in</span>
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
              Reminder Time
            </label>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => setSettings({...settings, reminderTime: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
            <p style={{ marginTop: '6px', fontSize: '13px', color: '#718096' }}>
              Get an email if you forget to check in by this time
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="America/Chicago">Central (CST/CDT)</option>
              <option value="America/New_York">Eastern (EST/EDT)</option>
              <option value="America/Denver">Mountain (MST/MDT)</option>
              <option value="America/Los_Angeles">Pacific (PST/PDT)</option>
              <option value="America/Phoenix">Arizona (MST)</option>
            </select>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '14px',
              background: isSaving ? '#a0aec0' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>

        {/* My Challenges Section */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>━━━ MY CHALLENGES ━━━</div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>Active:</div>
            {challenge ? (
              <div style={{ fontSize: '14px', color: '#4a5568', paddingLeft: '12px' }}>
                • Walk Challenge (Day {challenge.current_day}/30)
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#a0aec0', paddingLeft: '12px' }}>No active challenges</div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>Completed:</div>
            <div style={{ fontSize: '14px', color: '#a0aec0', paddingLeft: '12px' }}>None yet</div>
          </div>
        </div>

        {/* Upgrade Section */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px', marginBottom: '16px', color: 'white' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>━━━ UPGRADE ━━━</div>
          <div style={{ fontSize: '15px', marginBottom: '16px', opacity: '0.95' }}>
            Need daily accountability?
          </div>
          <button
            style={{
              width: '100%',
              padding: '14px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Add Accountability - $49/mo
          </button>
          <p style={{ marginTop: '12px', fontSize: '13px', textAlign: 'center', opacity: '0.9' }}>
            Daily text check-ins with personalized coaching
          </p>
        </div>

        {/* Support Section */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>━━━ SUPPORT ━━━</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="#" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Help & FAQs</a>
            <a href="#" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Contact Premier U</a>
            <a href="#" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Privacy Policy</a>
            <a href="#" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Terms of Service</a>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: '#fff5f5', padding: '24px', borderRadius: '12px', border: '2px solid #fc8181' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#c53030', marginBottom: '12px' }}>⚠️ Danger Zone</div>
          <p style={{ fontSize: '14px', color: '#742a2a', marginBottom: '16px', lineHeight: '1.5' }}>
            Resetting will permanently delete your current challenge progress. This action cannot be undone.
          </p>
          <button onClick={handleReset} style={{ width: '100%', padding: '14px', background: '#c53030', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Reset Challenge
          </button>
        </div>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#718096' }}>
          Need help? Email support@premieru.com
        </p>
      </div>
      </div>
    </div>
  );
}

export default App;
