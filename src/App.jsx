// ============================================
// App.jsx - COMPLETE APP WITH URL ROUTING
// ============================================

import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import PINLogin from './components/PINLogin';
import EmailPINLogin from './components/EmailPINLogin';
import PUIDEntry from './components/PUIDEntry';
import AccountSetup from './components/AccountSetup';
import ChallengeSelect from './components/ChallengeSelect';
import WalkAssessment from './components/WalkAssessment';
import PlanOverview from './components/PlanOverview';
import DashboardPreview from './components/DashboardPreview';
import DailyCheckIn from './components/DailyCheckIn';
import CompletionSuccess from './components/CompletionSuccess';
import CompletionIncomplete from './components/CompletionIncomplete';
import Roadmap from './components/Roadmap';
import Settings from './components/Settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [urlParams, setUrlParams] = useState({ provider: null, puid: null });
  const [userData, setUserData] = useState({
    puid: '',
    name: '',
    email: '',
    phone: '',
    pin: ''
  });
  const [assessmentData, setAssessmentData] = useState(null);

  // Parse URL and determine initial screen
  useEffect(() => {
    const path = window.location.pathname;
    
    // Check for /p/PUID URL pattern
    const providerMatch = path.match(/^\/p\/([A-Za-z0-9]+)/);
    
    if (providerMatch) {
      const puid = providerMatch[1];
      setUrlParams({ provider: 'p', puid });
      
      // Check if user already logged in with this PUID
      const currentUser = localStorage.getItem('current_user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.puid === puid) {
          // User is already logged in
          setUserData(user);
          navigateToCorrectScreen(user);
          return;
        }
      }
      
      // Show PIN-only login for /p/PUID URLs
      setCurrentScreen('pin-login');
    } else {
      // Main domain - show email/PIN login or new patient setup
      setCurrentScreen('main');
    }
  }, []);

  const navigateToCorrectScreen = (user) => {
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
    } else {
      setCurrentScreen('select');
    }
  };

  const renderScreen = () => {
    if (currentScreen === 'loading') {
      return (
        <div className="screen-container">
          <div className="screen-card">
            <div className="logo">REFORMED.FIT</div>
            <p style={{ textAlign: 'center', color: '#718096' }}>Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'main':
        return (
          <EmailPINLogin
            onSuccess={(user) => {
              setUserData(user);
              navigateToCorrectScreen(user);
            }}
            onNewPatient={() => setCurrentScreen('puid')}
          />
        );

      case 'pin-login':
        return (
          <PINLogin
            puid={urlParams.puid}
            provider={urlParams.provider}
            onSuccess={(user) => {
              setUserData(user);
              navigateToCorrectScreen(user);
            }}
          />
        );

      case 'puid':
        return (
          <PUIDEntry
            onContinue={(user) => {
              if (user.isNew) {
                setUserData({ ...userData, puid: user.puid });
                setCurrentScreen('setup');
              } else {
                setUserData(user);
                navigateToCorrectScreen(user);
              }
            }}
          />
        );

      case 'setup':
        return (
          <AccountSetup
            puid={userData.puid}
            onContinue={(data) => {
              setUserData({ ...userData, ...data });
              setCurrentScreen('select');
            }}
          />
        );

      case 'select':
        return (
          <ChallengeSelect
            userName={userData.name}
            onSelectChallenge={(challenge) => {
              if (challenge === 'walk') {
                setCurrentScreen('assessment');
              } else {
                alert('Protein challenge coming soon!');
              }
            }}
          />
        );

      case 'assessment':
        return (
          <WalkAssessment
            userData={userData}
            onContinue={(data) => {
              setAssessmentData(data);
              setCurrentScreen('plan');
            }}
          />
        );

      case 'plan':
        return (
          <PlanOverview
            plan={assessmentData?.plan}
            onStartChallenge={() => {
              setCurrentScreen('dashboard-preview');
            }}
          />
        );

      case 'dashboard-preview':
        return (
          <DashboardPreview
            onNavigate={(destination) => {
              if (destination === 'roadmap') {
                setCurrentScreen('roadmap');
              } else if (destination === 'settings') {
                setCurrentScreen('settings');
              }
            }}
          />
        );

      case 'daily-checkin':
        return (
          <DailyCheckIn
            onComplete={(status) => {
              if (status === 'success') {
                setCurrentScreen('completion-success');
              } else {
                setCurrentScreen('completion-incomplete');
              }
            }}
            onViewRoadmap={() => setCurrentScreen('roadmap')}
            onSettings={() => setCurrentScreen('settings')}
          />
        );

      case 'completion-success':
        return <CompletionSuccess onBack={() => setCurrentScreen('select')} />;

      case 'completion-incomplete':
        return <CompletionIncomplete onBack={() => setCurrentScreen('select')} />;

      case 'roadmap':
        return <Roadmap onBack={() => setCurrentScreen('daily-checkin')} />;

      case 'settings':
        return <Settings onBack={() => setCurrentScreen('daily-checkin')} />;

      default:
        return (
          <EmailPINLogin
            onSuccess={(user) => {
              setUserData(user);
              navigateToCorrectScreen(user);
            }}
            onNewPatient={() => setCurrentScreen('puid')}
          />
        );
    }
  };

  return <div className="app">{renderScreen()}</div>;
}

export default App;
