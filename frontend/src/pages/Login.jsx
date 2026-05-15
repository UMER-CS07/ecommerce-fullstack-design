import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

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
    <div className="p-8 max-w-md mx-auto mt-20 mb-20 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-5">
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
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600 text-sm">
        Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline font-medium">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
