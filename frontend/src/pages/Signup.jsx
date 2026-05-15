import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

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
    <div className="p-8 max-w-md mx-auto mt-20 mb-20 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input 
            type="password" 
            value={passwordConfirm} 
            onChange={e => setPasswordConfirm(e.target.value)} 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600 text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
