// ============================================
// FILE: src/components/EmailPINLogin.jsx
// Main screen - Email + PIN login OR new patient setup
// UPDATED FOR SUPABASE
// ============================================
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || pin.length !== 4) {
      setError('Please enter your email and 4-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Query Supabase for user with matching email
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .limit(1);

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      if (!users || users.length === 0) {
        setError('No account found with that email');
        setLoading(false);
        return;
      }

      const user = users[0];

      // Check if PIN matches (compare with pin_hash if using bcrypt, or plain pin for now)
      // For now assuming plain text PIN stored in 'pin' field
      // TODO: Use bcrypt compare if pin_hash is used
      if (user.pin_hash === pin || user.pin === pin) {
        // Update last_login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        // Store session data
        localStorage.setItem('current_user', JSON.stringify(user));
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Success!
        onSuccess({
          ...user,
          isNew: false
        });
      } else {
        setError('Invalid PIN. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPin = () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    window.location.href = `mailto:connect@reformed.fit?subject=PIN%20Reset%20Request&body=Hello%2C%20I%20need%20to%20reset%20my%20PIN%20for%20email%3A%20${encodeURIComponent(email)}.%20Please%20assist.`;
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
