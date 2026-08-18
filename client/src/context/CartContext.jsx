import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import * as cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart.');
      return false;
    }
    try {
      const res = await cartService.addToCart(productId, quantity);
      setCart(res.data);
      toast.success('Item added to cart!');
      openDrawer(); // Automatically open slide-over cart drawer on add!
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to add item to cart');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartService.updateCartItem(productId, quantity);
      setCart(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartService.removeFromCart(productId);
      setCart(res.data);
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const value = {
    cart,
    loading,
    itemCount: cart.itemCount || 0,
    totalAmount: cart.totalAmount || 0,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
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
