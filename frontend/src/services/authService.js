import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Make sure this matches your Rails port

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    user: { email, password }
  });
  
  if (response.headers.authorization) {
    localStorage.setItem('user', JSON.stringify(response.data.status.data.user));
    localStorage.setItem('token', response.headers.authorization);
  }
  
  return response.data;
};

const signup = async (email, password, password_confirmation) => {
  const response = await axios.post(`${API_URL}/signup`, {
    user: { email, password, password_confirmation }
  });
  
  return response.data;
};

const logout = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await axios.delete(`${API_URL}/logout`, {
        headers: {
          Authorization: token
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default {
  login,
  signup,
  logout,
  getCurrentUser
};
