import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      return setError("Passwords don't match");
    }

    try {
      await authService.signup(email, password, passwordConfirm);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.status?.message || 'Failed to sign up');
    }
  };

  return (
    <div className="authContainer">
      <div className="authCardWrapper">
        <Link to="/home" className="backToHome">
          <span>← Back to Home</span>
        </Link>
        
        <div className="authCard">
          <h2 className="authTitle">Register</h2>
          <p className="authSubtitle">Create an account to start sourcing products</p>
          
          {error && (
            <div className="authError">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSignup} className="authForm">
            <div className="formGroup">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="you@example.com"
              />
            </div>
            
            <div className="formGroup">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            <div className="formGroup">
              <label>Confirm Password</label>
              <input 
                type="password" 
                value={passwordConfirm} 
                onChange={e => setPasswordConfirm(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" className="authButton">
              Create Account
            </button>
          </form>
          
          <div className="authFooter">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
