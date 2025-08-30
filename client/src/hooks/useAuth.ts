import { useState, useEffect } from 'react';
import { auth, registerWithEmail, loginWithEmail, logoutUser, onAuthChange } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      
      // If user is authenticated, ensure they exist in our database
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (!response.ok && response.status === 404) {
            // User doesn't exist in our database, create them
            await apiRequest('POST', '/api/users', {
              firebaseUid: user.uid,
              email: user.email || '',
              name: user.displayName || null,
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

  const login = async (email: string, password: string) => {
    setIsAuthLoading(true);
    try {
      const firebaseUser = await loginWithEmail(email, password);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      return firebaseUser;
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsAuthLoading(true);
    try {
      const firebaseUser = await registerWithEmail(email, password);
      
      // Create user in our database
      try {
        await apiRequest('POST', '/api/users', {
          firebaseUid: firebaseUser.uid,
          email: email,
          name: name,
        });
      } catch (dbError) {
        console.error('Database user creation error:', dbError);
      }
      
      toast({
        title: "Welcome to Park Sarthi!",
        description: "Your account has been created successfully. You've earned 100 welcome points!",
      });
      
      return firebaseUser;
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthLoading,
  };
};