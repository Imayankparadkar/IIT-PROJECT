import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase, ref, set, push, onValue, off, update, remove } from "firebase/database";

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
export const realtimeDb = getDatabase(app);

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

// Realtime Database Functions
export const realtimeDbFunctions = {
  // Update parking slot availability
  updateParkingSlot: async (mallId: string, slotId: string, status: 'available' | 'occupied' | 'reserved') => {
    try {
      const slotRef = ref(realtimeDb, `parking/${mallId}/slots/${slotId}`);
      await update(slotRef, {
        status,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error updating parking slot:', error);
      throw error;
    }
  },

  // Listen to parking slot changes
  listenToParkingUpdates: (mallId: string, callback: (data: any) => void) => {
    const parkingRef = ref(realtimeDb, `parking/${mallId}`);
    onValue(parkingRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    return () => off(parkingRef);
  },

  // Book a parking slot
  bookParkingSlot: async (mallId: string, slotId: string, userId: string, duration: number) => {
    try {
      const bookingId = push(ref(realtimeDb, 'bookings')).key;
      const bookingData = {
        id: bookingId,
        mallId,
        slotId,
        userId,
        startTime: Date.now(),
        duration: duration * 60 * 1000, // Convert to milliseconds
        status: 'active',
        points: 50
      };
      
      // Update booking and slot status simultaneously
      const updates: any = {};
      updates[`bookings/${bookingId}`] = bookingData;
      updates[`parking/${mallId}/slots/${slotId}/status`] = 'reserved';
      updates[`parking/${mallId}/slots/${slotId}/bookedBy`] = userId;
      updates[`parking/${mallId}/slots/${slotId}/bookingId`] = bookingId;
      updates[`parking/${mallId}/availableSlots`] = -1; // Decrease available slots
      
      await update(ref(realtimeDb), updates);
      return bookingData;
    } catch (error) {
      console.error('Error booking parking slot:', error);
      throw error;
    }
  },

  // Mark leaving in advance
  markLeavingSoon: async (bookingId: string, minutesRemaining: number) => {
    try {
      const bookingRef = ref(realtimeDb, `bookings/${bookingId}`);
      await update(bookingRef, {
        leavingSoon: true,
        leavingInMinutes: minutesRemaining,
        notifiedAt: Date.now()
      });
    } catch (error) {
      console.error('Error marking leaving soon:', error);
      throw error;
    }
  },

  // Get real-time parking data
  getParkingData: async (mallId: string) => {
    try {
      const parkingRef = ref(realtimeDb, `parking/${mallId}`);
      return new Promise((resolve, reject) => {
        onValue(parkingRef, (snapshot) => {
          const data = snapshot.val();
          resolve(data);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Error getting parking data:', error);
      throw error;
    }
  }
};

export default app;
