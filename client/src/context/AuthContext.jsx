import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, paymentAPI } from '../services/api.jsx';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear(); // Clear any session storage
      setUser(null);
      setError(null);
      
      // Clear any cached data or redirect to home
      window.location.href = '/';
    }
  };

  const upgradePremium = async ({ premiumTier = 'premium', paymentMethod = 'stripe' }) => {
    try {
      const response = await authAPI.upgradePremium({ premiumTier, paymentMethod });
      setUser(response.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Upgrade failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const createPaymentSession = async ({ premiumTier, paymentMethod }) => {
    try {
      let response;
      if (paymentMethod === 'stripe') {
        response = await paymentAPI.createStripeSession({ tier: premiumTier });
        return { success: true, url: response.data.url };
      } else if (paymentMethod === 'paypal') {
        response = await paymentAPI.createPayPalOrder({ tier: premiumTier });
        return { success: true, url: response.data.approvalUrl, orderId: response.data.orderId };
      } else {
        return { success: false, error: 'Invalid payment method' };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Payment session failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const capturePayPalPayment = async (orderId) => {
    try {
      const response = await paymentAPI.capturePayPalOrder({ orderId });
      if (response.data.success) {
        // Refresh user data to get updated premium status
        await checkAuthStatus();
        return { success: true };
      } else {
        return { success: false, error: 'Payment capture failed' };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Payment capture failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const checkPaymentStatus = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const orderId = urlParams.get('order_id');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && orderId) {
      // PayPal payment success
      const result = await capturePayPalPayment(orderId);
      if (result.success) {
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        return { success: true, message: 'Payment successful! Your premium membership is now active.' };
      } else {
        return { success: false, error: result.error };
      }
    } else if (success === 'true' && sessionId) {
      // Stripe payment success - webhook should have already updated the user
      await checkAuthStatus();
      window.history.replaceState({}, document.title, window.location.pathname);
      return { success: true, message: 'Payment successful! Your premium membership is now active.' };
    }
    
    return null;
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    upgradePremium,
    createPaymentSession,
    capturePayPalPayment,
    checkPaymentStatus,
    clearError,
    isAuthenticated: !!user,
    isPremium: user?.isPremium || false,
    premiumTier: user?.premiumTier || 'none',
    premiumExpires: user?.premiumExpires || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 