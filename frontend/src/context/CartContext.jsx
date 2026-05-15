import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import authService from '../services/authService';

const CartContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-fullstack-design-25oo.onrender.com/api/v1';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to get Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: token } : {};
  };

  const fetchCart = useCallback(async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart_items`, {
        headers: getAuthHeaders()
      });
      // Normalize data to match the expected format in UI
      const items = (response.data.data || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        qty: item.quantity,
        price: item.product.price,
        name: item.product.name,
        image: item.product.image,
        category: item.product.category,
        seller: 'Verified Seller'
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    
    // Refresh cart when user logs in/out
    const handleUserChange = () => fetchCart();
    window.addEventListener('userUpdated', handleUserChange);
    window.addEventListener('storage', handleUserChange);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserChange);
      window.removeEventListener('storage', handleUserChange);
    };
  }, [fetchCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Please login to add items to your cart.');
      // Optional: Redirect to login
      // window.location.href = '/login';
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/cart_items`, {
        cart_item: {
          product_id: product.id || product.attributes?.id,
          quantity: quantity
        }
      }, {
        headers: getAuthHeaders()
      });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart.');
    }
  }, [fetchCart]);

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart_items/${cartItemId}`, {
        headers: getAuthHeaders()
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.patch(`${API_BASE_URL}/cart_items/${cartItemId}`, {
        cart_item: { quantity: newQty }
      }, {
        headers: getAuthHeaders()
      });
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    // For clearing, we can loop and delete or add a custom bulk delete route
    // For now, let's just implement the loop or assume user clears one by one
    // Simple way: just remove items from UI and let backend handle session if needed
    // But since we want DB persistence, we should delete them.
    try {
      const promises = cartItems.map(item => 
        axios.delete(`${API_BASE_URL}/cart_items/${item.id}`, { headers: getAuthHeaders() })
      );
      await Promise.all(promises);
      await fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [cartItems, fetchCart]);

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart: fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
