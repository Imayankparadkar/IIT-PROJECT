import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ApplicationVerifier } from "firebase/auth";
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

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }
  
  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('Recaptcha resolved');
    }
  });
  
  return recaptchaVerifier;
};

export const sendOTP = async (phoneNumber: string, appVerifier: ApplicationVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export default app;
