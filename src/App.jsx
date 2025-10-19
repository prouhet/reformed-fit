// ============================================
// App.jsx - COMPLETE WALK CHALLENGE APP
// Now using separate component files
// ============================================

import React, { useState, useEffect } from 'react';
import './App.css';

// Import components from separate files
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
  return <PUIDEntry onContinue={(user) => {
    console.log('PUIDEntry onContinue called with:', user);
    
    if (user.isNew) {
      setUserData({ ...userData, puid: user.puid });
      setCurrentScreen('setup');
    } else {
      // THIS IS THE KEY FIX - set the full user data!
      setUserData(user);
      
      const savedChallenge = localStorage.getItem('walk_challenge');
      if (savedChallenge) {
        setCurrentScreen('daily-checkin');
      } else {
        setCurrentScreen('select');
      }
    }
  }} />;

      case 'setup':
        return <AccountSetup 
          puid={userData.puid}
          onContinue={(data) => {
            setUserData({ ...userData, ...data });
            setCurrentScreen('select');
          }} 
        />;

      case 'select':
        return <ChallengeSelect 
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
        return <WalkAssessment 
          userData={userData}       
          onContinue={(data) => {
            setAssessmentData(data);
            setCurrentScreen('plan');
          }}
        />;

    case 'plan':
      return <PlanOverview 
         plan={assessmentData?.plan} 
          onStartChallenge={() => {  
            setCurrentScreen('dashboard-preview');
    }}
  />;

      case 'dashboard-preview':
        return <DashboardPreview 
          onContinue={() => {
            setCurrentScreen('daily-checkin');
          }}
        />;

case 'daily-checkin':
  return <DailyCheckIn 
    onComplete={(status) => {
      if (status === 'success') {
        setCurrentScreen('completion-success');
      } else {
        setCurrentScreen('completion-incomplete');
      }
    }}
    onNavigate={(destination) => {
      if (destination === 'roadmap') {
        setCurrentScreen('roadmap');
      } else if (destination === 'dashboard') {
        setCurrentScreen('dashboard-preview');
      } else if (destination === 'settings') {
        setCurrentScreen('settings');
      }
    }}
  />;
This will make the "View Roadmap" and "Back to Dashboard" buttons work!

Make the change, commit, push, rebuild, and test!




      case 'completion-success':
        return <CompletionSuccess 
          onBack={() => setCurrentScreen('select')}
        />;

      case 'completion-incomplete':
        return <CompletionIncomplete 
          onBack={() => setCurrentScreen('select')}
        />;

      case 'roadmap':
        return <Roadmap 
          onBack={() => setCurrentScreen('daily-checkin')}
        />;

      case 'settings':
        return <Settings 
          onBack={() => setCurrentScreen('daily-checkin')}
        />;

      default:
        return <PUIDEntry onContinue={(user) => {
          setUserData(user);
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

export default App;
