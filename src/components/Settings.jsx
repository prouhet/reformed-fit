// ============================================
// FILE: src/components/Settings.jsx - WITH SIMPLIFIED PIN CHANGE
// ============================================
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [pinForm, setPinForm] = useState({
    newPin: '',
    confirmPin: ''
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

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          email_reminder_time: settings.reminderTime,
          email_reminder_enabled: settings.emailRemindersEnabled,
          timezone: settings.timezone
        })
        .eq('id', userData.id);

      if (error) {
        console.error('Supabase error:', error);
        alert('Failed to save settings. Please try again.');
        setIsSaving(false);
        return;
      }

      // Also save to localStorage for quick access
      localStorage.setItem('user_settings', JSON.stringify(settings));
      
      setIsSaving(false);
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Save settings error:', err);
      alert('Failed to save settings. Please try again.');
      setIsSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: accountForm.name,
          email: accountForm.email,
          phone: accountForm.phone
        })
        .eq('id', userData.id);

      if (error) {
        console.error('Supabase error:', error);
        alert('Failed to update account. Please try again.');
        return;
      }

      const updatedUser = { ...userData, ...accountForm };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setIsEditingAccount(false);
      alert('Account information updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update account. Please try again.');
    }
  };

  const handleCancelAccountEdit = () => {
    setAccountForm({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || ''
    });
    setIsEditingAccount(false);
  };

  const handleChangePin = async () => {
    // Validate new PIN
    if (pinForm.newPin.length !== 4) {
      alert('New PIN must be exactly 4 digits');
      return;
    }
    
    // Validate confirmation
    if (pinForm.newPin !== pinForm.confirmPin) {
      alert('PINs do not match!');
      return;
    }
    
    try {
      // Update PIN in Supabase (only pin_hash column)
      const { error } = await supabase
        .from('users')
        .update({ 
          pin_hash: pinForm.newPin
        })
        .eq('id', userData.id);

      if (error) {
        console.error('Supabase error:', error);
        alert('Failed to change PIN. Please try again.');
        return;
      }

      // Update local storage
      const updatedUser = { ...userData, pin_hash: pinForm.newPin };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      setUserData(updatedUser);
      setIsChangingPin(false);
      setPinForm({ newPin: '', confirmPin: '' });
      alert('PIN changed successfully!');
    } catch (err) {
      console.error('PIN change error:', err);
      alert('Failed to change PIN. Please try again.');
    }
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
        <button onClick={onBack} style={{
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
        
        <div className="logo">REFORMED.FIT × PREMIER U</div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px', textAlign: 'center' }}>Settings</h1>
        <p style={{ fontSize: '15px', color: '#718096', textAlign: 'center', marginBottom: '32px' }}>
          Manage your account and preferences
        </p>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Account Info Section */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>ACCOUNT INFO</div>
              {!isEditingAccount && (
                <button
                  onClick={() => setIsEditingAccount(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            
            {isEditingAccount ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '6px' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '15px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '15px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '6px' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={accountForm.phone}
                    onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '15px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleSaveAccount}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#48bb78',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelAccountEdit}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096', marginBottom: '4px' }}>Name</div>
                  <div style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>{userData?.name || 'Not set'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096', marginBottom: '4px' }}>Email</div>
                  <div style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>{userData?.email || 'Not set'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096', marginBottom: '4px' }}>Phone</div>
                  <div style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>{userData?.phone || 'Not set'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Security Section - SIMPLIFIED PIN Change */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>SECURITY</div>
              {!isChangingPin && (
                <button
                  onClick={() => setIsChangingPin(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Change PIN
                </button>
              )}
            </div>

            {isChangingPin ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '6px' }}>
                    New PIN
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength="4"
                    value={pinForm.newPin}
                    onChange={(e) => setPinForm({...pinForm, newPin: e.target.value.replace(/\D/g, '')})}
                    placeholder="••••"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none',
                      letterSpacing: '6px',
                      textAlign: 'center',
                      fontWeight: '700'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2d3748', marginBottom: '6px' }}>
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength="4"
                    value={pinForm.confirmPin}
                    onChange={(e) => setPinForm({...pinForm, confirmPin: e.target.value.replace(/\D/g, '')})}
                    placeholder="••••"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '6px',
                      outline: 'none',
                      letterSpacing: '6px',
                      textAlign: 'center',
                      fontWeight: '700'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleChangePin}
                    disabled={pinForm.newPin.length !== 4 || pinForm.confirmPin.length !== 4}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: (pinForm.newPin.length === 4 && pinForm.confirmPin.length === 4) ? '#48bb78' : '#cbd5e0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: (pinForm.newPin.length === 4 && pinForm.confirmPin.length === 4) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Save New PIN
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPin(false);
                      setPinForm({ newPin: '', confirmPin: '' });
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#718096' }}>
                Your 4-digit PIN keeps your account secure
              </div>
            )}
          </div>

          {/* Email Reminders Section */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>EMAIL REMINDERS</div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailRemindersEnabled}
                  onChange={(e) => setSettings({...settings, emailRemindersEnabled: e.target.checked})}
                  style={{ width: '20px', height: '20px', marginRight: '12px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '15px', color: '#2d3748' }}>Send reminder if I forget to check in</span>
              </label>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
                Reminder Time
              </label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => setSettings({...settings, reminderTime: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
              <p style={{ marginTop: '6px', fontSize: '13px', color: '#718096' }}>
                Get an email if you forget to check in by this time
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="America/Chicago">Central (CST/CDT)</option>
                <option value="America/New_York">Eastern (EST/EDT)</option>
                <option value="America/Denver">Mountain (MST/MDT)</option>
                <option value="America/Los_Angeles">Pacific (PST/PDT)</option>
                <option value="America/Phoenix">Arizona (MST)</option>
              </select>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              style={{
                width: '100%',
                padding: '14px',
                background: isSaving ? '#a0aec0' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
            >
              {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>

          {/* My Challenges Section */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>MY CHALLENGES</div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>Active:</div>
              {challenge ? (
                <div style={{ fontSize: '14px', color: '#4a5568', paddingLeft: '12px' }}>
                  • Walk Challenge (Day {challenge.currentDay || 0}/30)
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: '#a0aec0', paddingLeft: '12px' }}>No active challenges</div>
              )}
            </div>

            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>Completed:</div>
              <div style={{ fontSize: '14px', color: '#a0aec0', paddingLeft: '12px' }}>None yet</div>
            </div>
          </div>

          {/* Upgrade Section */}
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '12px', marginBottom: '16px', color: 'white' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>UPGRADE</div>
            <div style={{ fontSize: '15px', marginBottom: '16px', opacity: '0.95' }}>
              Need daily accountability?
            </div>
            <button
              style={{
                width: '100%',
                padding: '14px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Add Accountability - $49/mo
            </button>
            <p style={{ marginTop: '12px', fontSize: '13px', textAlign: 'center', opacity: '0.9' }}>
              Daily text check-ins with personalized coaching
            </p>
          </div>

          {/* Support Section */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>SUPPORT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="mailto:connect@reformed.fit" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Contact Support</a>
              <a href="#" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Help & FAQs</a>
              <a href="#" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Privacy Policy</a>
              <a href="#" style={{ fontSize: '15px', color: '#667eea', textDecoration: 'none' }}>• Terms of Service</a>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={{ background: '#fff5f5', padding: '24px', borderRadius: '12px', border: '2px solid #fc8181' }}>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#c53030', marginBottom: '12px' }}>⚠️ Danger Zone</div>
            <p style={{ fontSize: '14px', color: '#742a2a', marginBottom: '16px', lineHeight: '1.5' }}>
              Resetting will permanently delete your current challenge progress. This action cannot be undone.
            </p>
            <button onClick={handleReset} style={{ width: '100%', padding: '14px', background: '#c53030', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
              Reset Challenge
            </button>
          </div>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#718096' }}>
            Need help? Email connect@reformed.fit
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
