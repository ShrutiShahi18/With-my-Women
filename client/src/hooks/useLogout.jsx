import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const useLogout = () => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (customMessage = 'Are you sure you want to logout?') => {
    if (window.confirm(customMessage)) {
      setIsLoggingOut(true);
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
        setIsLoggingOut(false);
        throw error;
      }
    }
  };

  return {
    handleLogout,
    isLoggingOut
  };
}; 