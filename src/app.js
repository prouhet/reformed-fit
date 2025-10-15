// ============================================
// Main Application Router
// Location: src/App.jsx
// ============================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import utility functions
import * as storage from './utils/storage';
import * as challengeLogic from './utils/challengeLogic';

// Import components (we'll create these next)
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
  const [currentUser, setCurrentUser] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and challenge data on mount
  useEffect(() => {
    const user = storage.getCurrentUser();
    const challenge = storage.getActiveChallenge();
    
    setCurrentUser(user);
    setActiveChallenge(challenge);
    setLoading(false);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/p/:puid" element={<PUIDEntry />} />
        
        {/* Account setup */}
        <Route path="/setup" element={<AccountSetup />} />
        
        {/* Challenge selection */}
        <Route path="/challenges" element={<ChallengeSelect />} />
        
        {/* Walk challenge flow */}
        <Route path="/walk/assessment" element={<WalkAssessment />} />
        <Route path="/walk/plan" element={<PlanOverview />} />
        <Route path="/walk/dashboard" element={<DashboardPreview />} />
        <Route path="/walk/checkin" element={<DailyCheckIn />} />
        <Route path="/walk/complete/success" element={<CompletionSuccess />} />
        <Route path="/walk/complete/incomplete" element={<CompletionIncomplete />} />
        <Route path="/walk/roadmap" element={<Roadmap />} />
        
        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
        
        {/* Default/home route */}
        <Route path="/" element={
          currentUser ? (
            activeChallenge ? <Navigate to="/walk/checkin" replace /> : <Navigate to="/challenges" replace />
          ) : (
            <Navigate to="/p/DEMO" replace />
          )
        } />
        
        {/* 404 - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;