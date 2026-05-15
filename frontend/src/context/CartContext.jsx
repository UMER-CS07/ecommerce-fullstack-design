import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCartItems,
  getCartCount,
  addToCart as addToCartUtil,
  updateCartItemQuantity as updateQtyUtil,
  removeFromCart as removeFromCartUtil,
  clearCart as clearCartUtil,
} from '../utils/cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getCartItems());
  const [cartCount, setCartCount] = useState(() => getCartCount());

  // Sync state whenever the underlying localStorage changes
  const refresh = useCallback(() => {
    setCartItems(getCartItems());
    setCartCount(getCartCount());
  }, []);

  useEffect(() => {
    // Listen for changes from other components or tabs
    window.addEventListener('cartUpdated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('cartUpdated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const addToCart = useCallback((product, quantity = 1) => {
    addToCartUtil(product, quantity);
    refresh();
  }, [refresh]);

  const removeFromCart = useCallback((productId) => {
    removeFromCartUtil(productId);
    refresh();
  }, [refresh]);

  const updateQuantity = useCallback((productId, amount) => {
    updateQtyUtil(productId, amount);
    refresh();
  }, [refresh]);

  const clearCart = useCallback(() => {
    clearCartUtil();
    refresh();
  }, [refresh]);

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
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
