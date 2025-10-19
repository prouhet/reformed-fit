// ==============================================
// UPDATED PUID ENTRY COMPONENT  
// Location: src/components/PUIDEntry.jsx
// ==============================================

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function PUIDEntry({ onContinue }) {
  const [puid, setPuid] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('puid'); // 'puid' or 'pin'
  const [existingUser, setExistingUser] = useState(null);

  const handleCheckPUID = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!puid || puid.length < 3) {
      setError('Please enter a valid PU ID');
      setLoading(false);
      return;
    }

    try {
      // Check if user exists
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('pu_id', puid.toUpperCase())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 means "no rows returned" which is fine
        console.error('Error checking user:', fetchError);
        setError('Error checking account');
        setLoading(false);
        return;
      }

      if (user) {
        // Existing user - show PIN field
        setExistingUser(user);
        setStep('pin');
        setLoading(false);
      } else {
        // New user - go directly to account setup
        console.log('New user, proceeding to account setup');
        onContinue({ puid: puid.toUpperCase(), isNew: true });
      }

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleVerifyPIN = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!pin || pin.length !== 4) {
      setError('Please enter your 4-digit PIN');
      setLoading(false);
      return;
    }

    if (existingUser.pin_hash !== pin) {
      setError('Incorrect PIN');
      setLoading(false);
      return;
    }

    // Login successful
    localStorage.setItem('user_id', existingUser.id);
    localStorage.setItem('user_data', JSON.stringify(existingUser));
    
    console.log('Login successful:', existingUser);
    onContinue(existingUser);
  };

  if (step === 'pin') {
    return (
      <div className="screen-container">
        <div className="screen-card">
          <div className="logo">REFORMED.FIT × PREMIER U</div>
          
          <h1 className="screen-title">Welcome Back!</h1>
          <p className="screen-subtitle">Enter your PIN to continue</p>
          
          <div className="puid-badge">Patient ID: {puid}</div>
          
          <form onSubmit={handleVerifyPIN} className="screen-form">
            <div className="input-group">
              <label htmlFor="pin" className="input-label">4-Digit PIN</label>
              <input
                type="password"
                id="pin"
                className="text-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="0000"
                maxLength="4"
                pattern="[0-9]{4}"
                required
                autoFocus
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>

            <button 
              type="button" 
              onClick={() => {
                setStep('puid');
                setPin('');
                setError('');
              }}
              style={{ 
                marginTop: '12px', 
                background: 'transparent', 
                color: '#667eea', 
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← Use different PU ID
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">REFORMED.FIT × PREMIER U</div>
        
        <h1 className="screen-title">Welcome to Your Challenges</h1>
        <p className="screen-subtitle">Enter your Premier U Patient ID to get started</p>
        
        <form onSubmit={handleCheckPUID} className="screen-form">
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
              disabled={loading}
            />
            <p className="input-help">Example: PU123456 or just 123456</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>

        <div className="help-text">
          <p>First time here? Just enter your PU ID to create an account.</p>
        </div>
      </div>
    </div>
  );
}

export default PUIDEntry;
