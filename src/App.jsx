// ============================================
// PU ID Entry Component - FIXED NAVIGATION
// Location: src/components/PUIDEntry.jsx
//
// THE FIRST SCREEN USERS SEE
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkUserExists, getUserByPUID } from '../utils/api';

function PUIDEntry() {
  const [puid, setPuid] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const params = useParams();

  // If PUID is in URL, pre-fill it
  useEffect(() => {
    if (params.puid) {
      setPuid(params.puid);
      checkExistingAccount(params.puid);
    }
  }, [params.puid]);

  const checkExistingAccount = async (puidToCheck) => {
    setLoading(true);
    setError('');
    
    try {
      const exists = await checkUserExists(puidToCheck);
      
      if (exists) {
        // Account exists - show PIN entry
        setShowPinEntry(true);
      } else {
        // No account - go to setup
        navigate(`/p/${puidToCheck}/setup`);
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Error checking account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePUIDSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!puid || puid.length < 3) {
      setError('Please enter a valid PU ID');
      return;
    }

    await checkExistingAccount(puid);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await getUserByPUID(puid);
      
      if (!user) {
        setError('Account not found');
        return;
      }

      if (user.pin !== pin) {
        setError('Incorrect PIN');
        setPin('');
        return;
      }

      // Successful login - store in session
      localStorage.setItem('current_user_id', user.id);
      localStorage.setItem('current_puid', puid);
      
      // Navigate to their dashboard
      navigate(`/p/${puid}/select`);
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showPinEntry) {
    return (
      <div className="entry-container">
        <div className="entry-card">
          <div className="logo">STUDIO STRONG × PREMIER U</div>
          
          <h1 className="entry-title">Welcome Back!</h1>
          <p className="entry-subtitle">Enter your PIN to continue</p>
          
          <form onSubmit={handlePinSubmit} className="entry-form">
            <div className="puid-display">
              <span className="puid-label">PU ID:</span>
              <span className="puid-value">{puid}</span>
              <button 
                type="button" 
                onClick={() => {
                  setShowPinEntry(false);
                  setPin('');
                  setPuid('');
                }}
                className="change-link"
              >
                Change
              </button>
            </div>

            <div className="input-group">
              <label htmlFor="pin" className="input-label">4-Digit PIN</label>
              <input
                type="password"
                id="pin"
                className="pin-input"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                maxLength="4"
                required
                autoFocus
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || pin.length !== 4}
            >
              {loading ? 'Verifying...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="entry-container">
      <div className="entry-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <h1 className="entry-title">Welcome to Your Challenges</h1>
        <p className="entry-subtitle">Enter your Premier U Patient ID to get started</p>
        
        <form onSubmit={handlePUIDSubmit} className="entry-form">
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
            <p className="input-help">
              Example: PU123456 or just 123456
            </p>
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
          <p>First time here? Enter your PU ID to create your account.</p>
          <p>Already have an account? Enter your PU ID and PIN to log in.</p>
        </div>
      </div>

      <style jsx>{`
        .entry-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .entry-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .logo {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: #667eea;
          letter-spacing: 2px;
          margin-bottom: 30px;
        }

        .entry-title {
          font-size: 32px;
          font-weight: 800;
          color: #2d3748;
          text-align: center;
          margin-bottom: 10px;
        }

        .entry-subtitle {
          text-align: center;
          color: #718096;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .entry-form {
          margin-bottom: 20px;
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .text-input, .pin-input {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .text-input:focus, .pin-input:focus {
          outline: none;
          border-color: #667eea;
          background: #f7fafc;
        }

        .pin-input {
          letter-spacing: 8px;
          font-size: 24px;
          text-align: center;
        }

        .input-help {
          font-size: 13px;
          color: #718096;
          margin-top: 6px;
        }

        .puid-display {
          background: #f7fafc;
          padding: 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .puid-label {
          font-size: 14px;
          color: #718096;
          font-weight: 600;
        }

        .puid-value {
          font-size: 18px;
          color: #2d3748;
          font-weight: 700;
        }

        .change-link {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          text-align: center;
        }

        .help-text {
          text-align: center;
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
        }

        .help-text p {
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
}

export default PUIDEntry;
