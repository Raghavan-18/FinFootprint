/**
 * Authentication Service for FinFootprint
 *
 * Implements real Firebase Authentication using the Firebase Modular Web SDK.
 * UI components interact exclusively through this service and AuthContext.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';

/**
 * Format a Firebase User object into a standardized, clean application user profile
 *
 * @param {import('firebase/auth').User|null} firebaseUser
 * @returns {Object|null}
 */
export const formatAuthUser = (firebaseUser) => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User'),
    photoURL: firebaseUser.photoURL || null,
    emailVerified: firebaseUser.emailVerified || false,
    phoneNumber: firebaseUser.phoneNumber || null,
    isAnonymous: firebaseUser.isAnonymous || false,
    metadata: {
      creationTime: firebaseUser.metadata?.creationTime,
      lastSignInTime: firebaseUser.metadata?.lastSignInTime,
    },
  };
};

/**
 * Maps raw Firebase authentication error codes to localization translation keys
 *
 * @param {Error|Object|string} error
 * @returns {string} Translation key
 */
export const mapAuthErrorToKey = (error) => {
  const code = typeof error === 'string' ? error : error?.code || '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'auth.incorrectPassword';
    case 'auth/email-already-in-use':
      return 'auth.errors.emailAlreadyInUse';
    case 'auth/weak-password':
      return 'auth.errors.weakPassword';
    case 'auth/invalid-email':
      return 'auth.errors.invalidEmail';
    case 'auth/network-request-failed':
      return 'auth.errors.networkError';
    case 'auth/too-many-requests':
      return 'auth.errors.tooManyRequests';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'auth.errors.popupClosed';
    case 'auth/user-disabled':
      return 'auth.errors.userDisabled';
    case 'auth/requires-recent-login':
      return 'auth.errors.requiresRecentLogin';
    default:
      return 'auth.errors.genericError';
  }
};

/**
 * Sign in existing user with email and password
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Standardized user profile
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return formatAuthUser(userCredential.user);
  } catch (error) {
    const errorKey = mapAuthErrorToKey(error);
    const customError = new Error(error.message);
    customError.code = error.code;
    customError.translationKey = errorKey;
    throw customError;
  }
};

/**
 * Create a new user account with email, password, and full name
 *
 * @param {Object} userData
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {string} userData.fullName
 * @param {string} [userData.phone]
 * @returns {Promise<Object>} Standardized user profile
 */
export const signupUser = async (userData) => {
  const { email, password, fullName } = userData;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    // Update Firebase user profile with display name
    if (fullName && fullName.trim()) {
      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });
    }

    return formatAuthUser(auth.currentUser || userCredential.user);
  } catch (error) {
    const errorKey = mapAuthErrorToKey(error);
    const customError = new Error(error.message);
    customError.code = error.code;
    customError.translationKey = errorKey;
    throw customError;
  }
};

/**
 * Sign in using Google OAuth Provider via popup
 *
 * @returns {Promise<Object>} Standardized user profile
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return formatAuthUser(result.user);
  } catch (error) {
    // If popup is closed by user, don't trigger intrusive crash
    const errorKey = mapAuthErrorToKey(error);
    const customError = new Error(error.message);
    customError.code = error.code;
    customError.translationKey = errorKey;
    throw customError;
  }
};

/**
 * Send password reset email instructions
 *
 * @param {string} email
 * @returns {Promise<{ success: boolean, email: string }>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      email: email.trim().toLowerCase(),
    };
  } catch (error) {
    const errorKey = mapAuthErrorToKey(error);
    const customError = new Error(error.message);
    customError.code = error.code;
    customError.translationKey = errorKey;
    throw customError;
  }
};

/**
 * Sign out current authenticated user
 *
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out with Firebase:', error);
    throw error;
  }
};

/**
 * Get current cached authenticated Firebase user
 *
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  return formatAuthUser(auth.currentUser);
};

/**
 * Subscribe to Firebase auth state lifecycle changes
 *
 * @param {Function} callback
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(formatAuthUser(firebaseUser));
  });
};

export default {
  loginUser,
  signupUser,
  logoutUser,
  resetPassword,
  loginWithGoogle,
  getCurrentUser,
  onAuthStateChangedListener,
  formatAuthUser,
  mapAuthErrorToKey,
};
