import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      window.dispatchEvent(new Event('userUpdated'));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.status?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="authContainer">
      <div className="authCardWrapper">
        <Link to="/home" className="backToHome">
          <span>← Back to Home</span>
        </Link>
        
        <div className="authCard">
          <h2 className="authTitle">Sign in</h2>
          <p className="authSubtitle">Please enter your credentials to access your account</p>
          
          {error && (
            <div className="authError">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="authForm">
            <div className="formGroup">
              <label>Email</label>
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
            
            <button type="submit" className="authButton">
              Login
            </button>
          </form>
          
          <div className="authFooter">
            <p>
              Don't have an account? <Link to="/signup">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
