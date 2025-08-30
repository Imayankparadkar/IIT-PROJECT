import { useState, useEffect } from 'react';
import { auth, setupRecaptcha, sendOTP } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPhoneAuthLoading, setIsPhoneAuthLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // If user is authenticated, ensure they exist in our database
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (!response.ok && response.status === 404) {
            // User doesn't exist in our database, create them
            await apiRequest('/api/users', {
              method: 'POST',
              body: JSON.stringify({
                id: user.uid,
                phoneNumber: user.phoneNumber || '',
                name: user.displayName || null,
                email: user.email || null
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        } catch (error) {
          console.error('Error syncing user with database:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithPhone = async (phoneNumber: string) => {
    try {
      setIsPhoneAuthLoading(true);
      
      // Setup recaptcha
      const appVerifier = setupRecaptcha('recaptcha-container');
      
      // Format phone number
      const formattedPhoneNumber = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      // Send OTP
      const confirmationResult = await sendOTP(formattedPhoneNumber, appVerifier);
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formattedPhoneNumber}`,
      });

      return confirmationResult;
    } catch (error: any) {
      console.error('Error during phone authentication:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsPhoneAuthLoading(false);
    }
  };

  const verifyOTP = async (confirmationResult: any, otp: string) => {
    try {
      setIsPhoneAuthLoading(true);
      const result = await confirmationResult.confirm(otp);
      
      toast({
        title: "Success",
        description: "Login successful! Welcome to Park Sarthi!",
      });

      return result.user;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsPhoneAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    isPhoneAuthLoading,
    loginWithPhone,
    verifyOTP,
    logout
  };
};
