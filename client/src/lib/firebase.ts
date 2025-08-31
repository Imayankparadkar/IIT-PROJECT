import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "1034044789593",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-QH44SF0902"
};

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Note: Realtime Database temporarily disabled to prevent configuration errors
// export const realtimeDb = null;

// Email/Password Authentication Functions
export const registerWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Note: Realtime Database functions temporarily disabled due to configuration issues
// These will be re-enabled once Firebase Realtime Database is properly configured
export const realtimeDbFunctions = {
  updateParkingSlot: async () => { console.warn('Realtime DB not available'); },
  listenToParkingUpdates: () => { console.warn('Realtime DB not available'); return () => {}; },
  bookParkingSlot: async () => { console.warn('Realtime DB not available'); return null; },
  markLeavingSoon: async () => { console.warn('Realtime DB not available'); },
  getParkingData: async () => { console.warn('Realtime DB not available'); return null; }
};

export default app;
