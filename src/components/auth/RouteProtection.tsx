import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/auth-store';

interface RouteProtectionProps {
  children: React.ReactNode;
}

const RouteProtection: React.FC<RouteProtectionProps> = ({ children }) => {
  const { isAuthenticated, user, isAdmin, logout } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated and is Admin
    if (isAuthenticated && user) {
      if (!isAdmin()) {
        // Force logout if user is not Admin
        logout();
      }
    }
  }, [isAuthenticated, user, isAdmin, logout]);

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated but not Admin, don't render children
  if (user && user.role !== 'Admin') {
    return null;
  }

  // If authenticated and is Admin, render children
  return <>{children}</>;
};

export default RouteProtection;
