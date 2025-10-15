// ============================================
// PU ID Entry Component
// Location: src/components/PUIDEntry.jsx
//
// First screen users see
// Captures PU ID and checks if account exists
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as storage from '../utils/storage';

const PUIDEntry = () => {
  const { puid } = useParams(); // Get PU ID from URL
  const navigate = useNavigate();
  const [puId, setPuId] = useState(puid || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If PU ID in URL, auto-check if account exists
  useEffect(() => {
    if (puid) {
      setPuId(puid);
      checkAccount(puid);
    }
  }, [puid]);

  const checkAccount = async (id) => {
    setLoading(true);
    setError('');

    try {
      // Check if user already has account
      const existingUser = storage.getCurrentUser();
      
      if (existingUser && existingUser.pu_id === id) {
        // User exists and is logged in, check for active challenge
        const activeChallenge = storage.getActiveChallenge();
        
        if (activeChallenge) {
          // Has active challenge, go to check-in
          navigate('/walk/checkin');
        } else {
          // No active challenge, go to selection
          navigate('/challenges');
        }
      } else {
        // New user or different user, go to account setup
        navigate('/setup', { state: { pu_id: id } });
      }
    } catch (err) {
      setError('Error checking account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate PU ID
    if (!puId || puId.trim().length < 3) {
      setError('Please enter a valid PU ID');
      return;
    }
    
    checkAccount(puId.trim());
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">PREMIER U × STUDIO STRONG</div>
        
        <h1>Welcome to Studio Strong Challenges</h1>
        <p className="subtitle">
          Enter your Premier U Patient ID to get started
        </p>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="puid">Premier U Patient ID</label>
            <input
              id="puid"
              type="text"
              placeholder="PU123456"
              value={puId}
              onChange={(e) => setPuId(e.target.value.toUpperCase())}
              disabled={loading}
              autoFocus
            />
            <p className="helper-text">
              This should start with "PU" followed by numbers
            </p>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !puId}
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#718096' }}>
            💡 <strong>Tip:</strong> Bookmark this page after setup to easily return!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PUIDEntry;