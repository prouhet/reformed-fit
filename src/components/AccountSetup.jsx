// ==============================================
// UPDATED ACCOUNT SETUP COMPONENT - WITH LOCATION
// Location: src/components/AccountSetup.jsx
// ==============================================

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function AccountSetup({ puid, onContinue }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    clinicLocation: 'swansea', // NEW: Default location
    pin: '',
    confirmPin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (formData.pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setLoading(true);

    try {
      // Insert user into Supabase WITH provider and clinic_location
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            pu_id: puid,
            provider: 'premieru', // NEW: Add provider
            clinic_location: formData.clinicLocation, // NEW: Add location
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            pin_hash: formData.pin // TODO: Hash this in production!
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Supabase error:', insertError);
        setError('Error creating account: ' + insertError.message);
        setLoading(false);
        return;
      }

      console.log('User created successfully:', data);

      // Store user ID in localStorage for session
      localStorage.setItem('user_id', data.id);
      localStorage.setItem('user_data', JSON.stringify(data));

      // Continue to next screen
      onContinue(data);
      
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">REFORMED.FIT × PREMIER U</div>
        
        <div className="puid-badge">Patient ID: {puid}</div>
        
        <h1 className="screen-title">Create Your Account</h1>
        <p className="screen-subtitle">
          Your PIN will be used to log back in.
        </p>
        
        <form onSubmit={handleSubmit} className="screen-form">
          {/* NEW: Clinic Location Dropdown */}
          <div className="input-group">
            <label className="input-label">Which Premier U location do you visit?</label>
            <select
              className="text-input"
              value={formData.clinicLocation}
              onChange={(e) => handleChange('clinicLocation', e.target.value)}
              required
              disabled={loading}
            >
              <option value="swansea">Swansea</option>
              <option value="southcounty">South County</option>
              <option value="marion">Marion</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="text-input"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="text-input"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone</label>
            <input
              type="tel"
              className="text-input"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
              required
              disabled={loading}
            />
          </div>

          <div className="divider"></div>

          <div className="input-group">
            <label className="input-label">Create 4-Digit PIN</label>
            <input
              type="password"
              className="text-input"
              value={formData.pin}
              onChange={(e) => handleChange('pin', e.target.value)}
              placeholder="0000"
              maxLength="4"
              pattern="[0-9]{4}"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm PIN</label>
            <input
              type="password"
              className="text-input"
              value={formData.confirmPin}
              onChange={(e) => handleChange('confirmPin', e.target.value)}
              placeholder="0000"
              maxLength="4"
              pattern="[0-9]{4}"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AccountSetup;
