import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAlfBKnP7D5p8wUOaU4S5MM7BZy141GYsE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'padikam-84ad3.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'padikam-84ad3',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'padikam-84ad3.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '683194811006',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:683194811006:web:f1b7db6f4731e759504e2f',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-0S21TTQZY2',
};

export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your_project_id'
  );
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface GoogleSignInResult {
  user: FirebaseUser;
  idToken: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

/**
 * Sign in using Google OAuth Popup and retrieve user data & ID token
 */
export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase credentials are not configured. Please check your Firebase configuration.'
    );
  }

  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    if (!user.email) {
      throw new Error('Google account does not have an associated email address.');
    }

    return {
      user,
      idToken,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL,
    };
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled by user.');
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup blocked by browser. Please allow popups for this site.');
    }
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error(
        'This domain (e.g. localhost) is not authorized in Firebase Console. Go to Firebase Console -> Authentication -> Settings -> Authorized domains.'
      );
    }
    if (error.code === 'auth/invalid-api-key') {
      throw new Error('Invalid Firebase API key');
    }
    throw error;
  }
};

export const logoutFirebase = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out from Firebase:', error);
  }
};

export default app;
