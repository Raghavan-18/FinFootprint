/**
 * Firebase Configuration for FinFootprint
 *
 * NOTE: TEMPORARY DEMO MODE IS ACTIVE.
 * Firebase code and configurations are preserved here for future production use.
 * To re-enable Firebase in production, set VITE_USE_FIREBASE=true in your .env file
 * and switch Auth/Data providers to use authService.js and firestoreService.js.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const isFirebaseEnabled =
  typeof import.meta !== 'undefined' &&
  import.meta.env?.VITE_USE_FIREBASE === 'true';

const firebaseConfig = {
  apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) || 'AIzaSyBiV6wpW_1AbsW9JDbfqGItxMAdrM-ONvY',
  authDomain: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || 'finfootprint-dc8d3.firebaseapp.com',
  projectId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || 'finfootprint-dc8d3',
  storageBucket: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || 'finfootprint-dc8d3.firebasestorage.app',
  messagingSenderId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || '907457057994',
  appId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_APP_ID) || '1:907457057994:web:0e22bcb584317eab3e9033',
  measurementId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) || 'G-66BQLNYE07',
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let analytics = null;

if (isFirebaseEnabled) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  if (typeof window !== 'undefined') {
    isSupported()
      .then((supported) => {
        if (supported) {
          analytics = getAnalytics(app);
        }
      })
      .catch(() => {});
  }
}

export { app, auth, db, googleProvider, analytics };
export default app;

