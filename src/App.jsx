// ============================================
// App.jsx - COMPLETE WALK CHALLENGE FLOW
// Location: src/App.jsx
//
// All screens integrated with proper flow
// ============================================

import React, { useState, useEffect } from 'react';
import './App.css';

// Import all components (in real app, these would be separate files)
import WalkAssessment from './components/WalkAssessment';
import PlanOverview from './components/PlanOverview';
import DashboardPreview from './components/DashboardPreview';
import DailyCheckIn from './components/DailyCheckIn';
import CompletionSuccess from './components/CompletionSuccess';
import CompletionIncomplete from './components/CompletionIncomplete';
import Roadmap from './components/Roadmap';

function App() {
  const [currentScreen, setCurrentScreen] = useState('puid'); 
  const [userData, setUserData] = useState({
    puid: '',
    name: '',
    email: '',
    phone: '',
    pin: ''
  });
  const [challengeData, setC

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
            alert(`${challenge} challenge selected! More screens coming soon.`);
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

    // For now, just continue to setup
    // Later we'll check if account exists
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
            onClick={() => onSelectChallenge('Walk')}
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
            onClick={() => onSelectChallenge('Protein')}
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

export default App;
