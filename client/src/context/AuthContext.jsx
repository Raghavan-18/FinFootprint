/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  loginUser,
  signupUser,
  logoutUser,
  resetPassword as resetPasswordService,
  loginWithGoogle as loginWithGoogleService,
  onAuthStateChangedListener,
  mapAuthErrorToKey,
} from '../services/authService';

export const AuthContext = createContext(null);

/**
 * Global Authentication Provider Component powered by Firebase Authentication
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase auth state lifecycle changes
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Log in user with email & password via Firebase
   */
  const login = useCallback(async (email, password) => {
    return await loginUser(email, password);
  }, []);

  /**
   * Register new user account via Firebase
   */
  const signup = useCallback(async (userData) => {
    return await signupUser(userData);
  }, []);

  /**
   * Sign out current user via Firebase
   */
  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  /**
   * Request password reset link via Firebase
   */
  const resetPassword = useCallback(async (email) => {
    return await resetPasswordService(email);
  }, []);

  /**
   * Authenticate via Google OAuth Popup
   */
  const loginWithGoogle = useCallback(async () => {
    return await loginWithGoogleService();
  }, []);

  /**
   * Helper to resolve a Firebase error to a localized translation key
   */
  const getAuthErrorKey = useCallback((error) => {
    return error?.translationKey || mapAuthErrorToKey(error);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      resetPassword,
      loginWithGoogle,
      getAuthErrorKey,
    }),
    [user, loading, login, signup, logout, resetPassword, loginWithGoogle, getAuthErrorKey]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume AuthContext safely
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
