'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface UserData extends Omit<User, 'phoneNumber'> {
  points?: number;
  referralCode?: string;
  phoneNumber?: string | null;
  isAdmin?: boolean;
  username?: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, phoneNumber: string, referralCode: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Only run authentication effects after component mounts on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Skip auth initialization until mounted on client
    if (!mounted) return;

    console.log('Auth provider mounted, initializing auth state');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('User authenticated:', firebaseUser.uid);
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data retrieved from Firestore');
            
            // Merge Firebase user with Firestore data
            setUser({
              ...firebaseUser,
              points: userData?.points || 0,
              referralCode: userData?.referralCode || '',
              phoneNumber: userData?.phoneNumber || '',
              isAdmin: userData?.isAdmin || false,
              username: userData?.username || ''
            });
          } else {
            console.log('User document not found in Firestore');
            // User exists in Authentication but not in Firestore
            setUser({
              ...firebaseUser,
              points: 0,
              referralCode: '',
              phoneNumber: '',
              isAdmin: false,
              username: firebaseUser.displayName || ''
            });
          }
        } else {
          console.log('No user authenticated');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set a null user state on error
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('Unsubscribing from auth state');
      unsubscribe();
    };
  }, [mounted]);

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    let errorMessage = 'An unexpected error occurred';
    
    if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password sign-in is not enabled for this Firebase project.';
    } else {
      // For any other errors, use Firebase's error message
      errorMessage = error.message || 'Authentication failed. Please try again.';
    }
    
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`Attempting to sign in with email: ${email}`);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
    } catch (error: any) {
      console.error('Sign in error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = (name: string) => {
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${name.substring(0, 4).toUpperCase()}${randomNum}`;
  };

  const signUp = async (email: string, password: string, username: string, phoneNumber: string, referralCode: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`Attempting to create user with email: ${email}`);
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created in Authentication:', user.uid);
      
      // Update profile with display name (username)
      if (user) {
        await updateProfile(user, {
          displayName: username
        });
        console.log('User profile updated with username');
      }
      
      // Generate a new referral code if one wasn't provided
      const userReferralCode = referralCode || generateReferralCode(username);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        username,
        phoneNumber,
        referralCode: userReferralCode,
        points: 0,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      });
      console.log('User document created in Firestore');

      // If there's a referral code, update referrer's points
      if (referralCode) {
        try {
          console.log('Processing referral code:', referralCode);
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('referralCode', '==', referralCode));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'users', referrerDoc.id), {
              points: (referrerDoc.data().points || 0) + 100,
            });
            console.log('Referrer points updated');
          } else {
            console.log('No referrer found with the provided code');
          }
        } catch (error) {
          console.error('Error processing referral:', error);
          // Don't throw here as the user is already created
        }
      }
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting to sign out');
      await firebaseSignOut(auth);
      console.log('Sign out successful');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log(`Attempting to send password reset email to: ${email}`);
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}