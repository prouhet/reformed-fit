// ============================================
// FILE: src/components/PINLogin.jsx
// PIN-based login that extracts PUID from URL
// ============================================
import React, { useState, useEffect } from 'react';

function PINLogin({ puid, provider, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get provider name for display
  const getProviderName = (providerCode) => {
    const providers = {
      'p': 'Premier U',
      'g': 'Provider G',
      // Add more providers as needed
    };
    return providers[providerCode] || 'Reformed.Fit';
  };

  const handlePinInput = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 4) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check localStorage first (for demo/development)
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = savedUsers.find(u => u.puid === puid && u.pin === pin);

      if (user) {
        // Store current user session
        localStorage.setItem('current_user', JSON.stringify(user));
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Success! Pass user data back
        onSuccess({
          ...user,
          isNew: false
        });
      } else {
        setError('Invalid PIN. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPin = () => {
    window.location.href = `mailto:connect@reformed.fit?subject=PIN Reset Request - ${puid}&body=Hello, I need to reset my PIN for account ${puid}. Please assist.`;
  };

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '450px' }}>
        <div className="logo">REFORMED.FIT</div>
        
        {provider && (
          <div style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: '600',
            color: '#667eea',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px'
          }}>
            {getProviderName(provider)} Patient
          </div>
        )}
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#2d3748',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          Welcome Back
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#718096',
          fontSize: '15px',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          Enter your 4-digit PIN to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              Your PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength="4"
              value={pin}
              onChange={handlePinInput}
              placeholder="••••"
              autoFocus
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '32px',
                textAlign: 'center',
                letterSpacing: '12px',
                border: error ? '2px solid #fc8181' : '2px solid #e2e8f0',
                borderRadius: '12px',
                outline: 'none',
                fontWeight: '700',
                transition: 'all 0.2s',
                backgroundColor: error ? '#fff5f5' : 'white'
              }}
            />
            
            {error && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: '#fff5f5',
                border: '1px solid #fc8181',
                borderRadius: '8px',
                color: '#c53030',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={pin.length !== 4 || loading}
            style={{
              width: '100%',
              padding: '16px',
              background: (pin.length === 4 && !loading) ? '#667eea' : '#cbd5e0',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '17px',
              fontWeight: '700',
              cursor: (pin.length === 4 && !loading) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <button
            onClick={handleForgotPin}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Forgot your PIN?
          </button>
          <p style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#a0aec0'
          }}>
            We'll help you reset it
          </p>
        </div>

        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#f7fafc',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#718096',
            lineHeight: '1.5'
          }}>
            💡 <strong>Tip:</strong> Bookmark this page for easy access
          </div>
        </div>
      </div>
    </div>
  );
}

export default PINLogin;
