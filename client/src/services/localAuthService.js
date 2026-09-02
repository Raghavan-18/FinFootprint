/**
 * Local Demo Authentication Service for FinFootprint
 *
 * Provides a lightweight, offline-ready local demo authentication layer
 * using localStorage.
 *
 * NOTE: TEMPORARY DEMO MODE IS ACTIVE.
 * Firebase authentication is preserved in authService.js for future production use.
 */

const STORAGE_KEY = 'finfootprint_demo_user';

const DEFAULT_DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@finfootprint.local',
  displayName: 'Rajesh Kumar',
  photoURL: null,
  emailVerified: true,
  phoneNumber: '+91 98765 43210',
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
};

// Registered listeners for auth state changes
const authListeners = new Set();

const notifyListeners = (user) => {
  authListeners.forEach((listener) => {
    try {
      listener(user);
    } catch (err) {
      console.error('Error in demo auth listener:', err);
    }
  });
};

/**
 * Get current stored demo user from localStorage
 *
 * @returns {Object|null}
 */
export const getStoredDemoUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading demo user session:', err);
    return null;
  }
};

/**
 * Format user object
 */
export const formatAuthUser = (user) => {
  if (!user) return null;
  return {
    uid: user.uid || user.id || 'demo-user-001',
    email: user.email || 'demo@finfootprint.local',
    displayName: user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Demo User'),
    photoURL: user.photoURL || null,
    emailVerified: Boolean(user.emailVerified ?? true),
    phoneNumber: user.phoneNumber || null,
    isAnonymous: false,
    metadata: {
      creationTime: user.metadata?.creationTime || new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
  };
};

/**
 * Log in user locally in demo mode
 *
 * Supports demo@finfootprint.local / demo12345 or any email/password test input
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export const loginUser = async (email, password) => {
  // Simulate brief natural network delay (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));

  if (!email || !email.includes('@')) {
    const error = new Error('Invalid email address');
    error.code = 'auth/invalid-email';
    error.translationKey = 'auth.errors.invalidEmail';
    throw error;
  }

  if (!password || password.length < 5) {
    const error = new Error('Password must contain at least 6 characters');
    error.code = 'auth/wrong-password';
    error.translationKey = 'auth.errors.wrongPassword';
    throw error;
  }

  const cleanEmail = email.trim().toLowerCase();
  const displayName =
    cleanEmail === 'demo@finfootprint.local'
      ? 'Rajesh Kumar'
      : cleanEmail.split('@')[0].replace(/[._-]/g, ' ');

  const user = formatAuthUser({
    uid: cleanEmail === 'demo@finfootprint.local' ? 'demo-user-001' : `user_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
    email: cleanEmail,
    displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
    photoURL: null,
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  notifyListeners(user);

  return user;
};

/**
 * Register new user locally in demo mode
 *
 * @param {Object} userData - { email, password, fullName }
 * @returns {Promise<Object>}
 */
export const signupUser = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const { email, password, fullName } = userData;

  if (!email || !email.includes('@')) {
    const error = new Error('Invalid email');
    error.code = 'auth/invalid-email';
    error.translationKey = 'auth.errors.invalidEmail';
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error('Weak password');
    error.code = 'auth/weak-password';
    error.translationKey = 'auth.errors.weakPassword';
    throw error;
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = formatAuthUser({
    uid: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    displayName: fullName ? fullName.trim() : cleanEmail.split('@')[0],
    photoURL: null,
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

  // Initialize a blank financial profile in localStorage so the Onboarding Flow shows
  try {
    const profileKey = `finfootprint_profile_${user.uid}`;
    localStorage.setItem(
      profileKey,
      JSON.stringify({
        id: user.uid,
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
        businessName: 'My Enterprise',
        businessType: 'Micro-Enterprise & Sole Proprietorship',
        city: 'India',
        memberSince: new Date().toISOString().split('T')[0],
        profileCompleted: false,
        monthlyIncome: 0,
        incomeType: 'SALARY',
        incomeStability: 'FIXED',
        occupation: '',
        housing: { status: 'OWN', ownershipStatus: 'FULLY_OWNED' },
        loans: [],
        monthlyExpenses: { food: 0, rent: 0, utilities: 0, transport: 0, education: 0, medical: 0, loanEmi: 0, other: 0 },
      })
    );
  } catch (e) {
    console.error('Error seeding demo profile:', e);
  }

  notifyListeners(user);

  return user;
};

/**
 * Log out user locally
 */
export const logoutUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  localStorage.removeItem(STORAGE_KEY);
  notifyListeners(null);
};

/**
 * Reset password mock
 */
export const resetPassword = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (!email || !email.includes('@')) {
    const error = new Error('Invalid email');
    error.code = 'auth/invalid-email';
    error.translationKey = 'auth.errors.invalidEmail';
    throw error;
  }
  return true;
};

/**
 * Mock Google Sign In for demo mode
 */
export const loginWithGoogle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const user = formatAuthUser(DEFAULT_DEMO_USER);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  notifyListeners(user);
  return user;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChangedListener = (callback) => {
  authListeners.add(callback);

  // Initialize with currently stored session or default demo user
  const current = getStoredDemoUser();
  if (current) {
    callback(current);
  } else {
    // If first time opening app without session, provide default demo user logged in
    const defaultUser = formatAuthUser(DEFAULT_DEMO_USER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
    callback(defaultUser);
  }

  return () => {
    authListeners.delete(callback);
  };
};

/**
 * Map error code to localization key
 */
export const mapAuthErrorToKey = (error) => {
  if (error?.translationKey) return error.translationKey;
  return 'auth.errors.genericError';
};

export default {
  getStoredDemoUser,
  formatAuthUser,
  loginUser,
  signupUser,
  logoutUser,
  resetPassword,
  loginWithGoogle,
  onAuthStateChangedListener,
  mapAuthErrorToKey,
};
