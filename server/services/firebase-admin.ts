import admin from 'firebase-admin';

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
  // For development, we'll use the client config since we don't have admin credentials
  // In production, you would use proper service account credentials
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "iit-indore-22e05",
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export async function verifyFirebaseToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw new Error('Invalid token');
  }
}

export async function createFirebaseUser(phoneNumber: string) {
  try {
    const userRecord = await adminAuth.createUser({
      phoneNumber: phoneNumber,
    });
    return userRecord;
  } catch (error) {
    console.error('Error creating Firebase user:', error);
    throw error;
  }
}

export async function getUserByPhoneNumber(phoneNumber: string) {
  try {
    const userRecord = await adminAuth.getUserByPhoneNumber(phoneNumber);
    return userRecord;
  } catch (error) {
    if ((error as any).code === 'auth/user-not-found') {
      return null;
    }
    console.error('Error getting user by phone number:', error);
    throw error;
  }
}
