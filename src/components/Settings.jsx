// ============================================
// FILE: src/components/Settings.jsx
// ============================================
import React, { useState, useEffect } from 'react';

function Settings({ onBack }) {
  const [userData, setUserData] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [settings, setSettings] = useState({
    reminderTime: '20:00',
    timezone: 'America/Chicago',
    emailRemindersEnabled: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const savedChallenge = localStorage.getItem('walk_challenge');
    const savedSettings = localStorage.getItem('user_settings');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
      setAccountForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
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

  const handleSaveAccount = () => {
    const updatedUser = { ...userData, ...accountForm };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setIsEditingAccount(false);
    alert('Account information updated successfully!');
  };

  const handleCancelAccountEdit = () => {
    setAccountForm({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || ''
    });
    setIsEditingAccount(false);
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
        <button onClick={onBack} className="back-button" style={{
          marginBottom: '20px',
          padding: '10px 20px',
          background: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          color: '#4a5568',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          ← Back
        </button>
