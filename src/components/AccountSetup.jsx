// ============================================
// FILE: src/components/AccountSetup.jsx
// ============================================
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as storage from '../utils/storage';

const AccountSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const puId = location.state?.pu_id || '';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pin: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save user data
    const userData = {
      pu_id: puId,
      ...formData,
      created_at: new Date().toISOString()
    };
    
    storage.saveCurrentUser(userData);
    navigate('/challenges');
  };

  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">PREMIER U × STUDIO STRONG</div>
        <h1>Create Your Account</h1>
        <p className="subtitle">Set up your profile to get started</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Phone (optional)</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Create PIN (4-6 digits)</label>
            <input 
              type="password" 
              maxLength="6"
              value={formData.pin}
              onChange={(e) => setFormData({...formData, pin: e.target.value})}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSetup;
