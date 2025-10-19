// ============================================
// FILE: src/components/EmailPINLogin.jsx
// Main screen - Email + PIN login OR new patient setup
// ============================================
import React, { useState } from 'react';

function EmailPINLogin({ onSuccess, onNewPatient }) {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinInput = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 4) {
      setPin(value);
      setError('');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email || pin.length !== 4) {
      setError('Please enter your email and 4-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check localStorage for matching user
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = savedUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.pin === pin
      );

      if (user) {
        // Store current user session
        localStorage.setItem('current_user', JSON.stringify(user));
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Success!
        onSuccess({
          ...user,
          isNew: false
        });
      } else {
        setError('Invalid email or PIN. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPin = () => {
    window.location.href = `mailto:connect@reformed.fit?subject=PIN Reset Request&body=Hello, I need to reset my PIN for email: ${email}. Please assist.`;
  };

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '480px' }}>
        <div className="logo">REFORMED.FIT</div>
        
        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: '600',
          color: '#667eea',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px'
        }}>
          Premier U Patients
        </div>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#2d3748',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Welcome Back
        </h1>

        {/* Login Form */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              autoFocus
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              4-Digit PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength="4"
              value={pin}
              onChange={handlePinInput}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && email && pin.length === 4) {
                  handleLogin(e);
                }
              }}
              placeholder="••••"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '24px',
                textAlign: 'center',
                letterSpacing: '12px',
                border: error ? '2px solid #fc8181' : '2px solid #e2e8f0',
                borderRadius: '10px',
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
            onClick={handleLogin}
            disabled={!email || pin.length !== 4 || loading}
            style={{
              width: '100%',
              padding: '16px',
              background: (email && pin.length === 4 && !loading) ? '#667eea' : '#cbd5e0',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '17px',
              fontWeight: '700',
              cursor: (email && pin.length === 4 && !loading) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{
            marginTop: '16px',
            textAlign: 'center'
          }}>
            <button
              onClick={handleForgotPin}
              disabled={!email}
              style={{
                background: 'none',
                border: 'none',
                color: email ? '#667eea' : '#cbd5e0',
                fontSize: '14px',
                fontWeight: '600',
                cursor: email ? 'pointer' : 'not-allowed',
                textDecoration: 'underline'
              }}
            >
              Forgot your PIN?
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '32px 0',
          color: '#cbd5e0'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <div style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600' }}>OR</div>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>

        {/* New Patient Button */}
        <button
          onClick={onNewPatient}
          style={{
            width: '100%',
            padding: '16px',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '10px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          New Patient Setup
        </button>

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
            💡 <strong>Tip:</strong> Bookmark your personal login page for faster access next time
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailPINLogin;
