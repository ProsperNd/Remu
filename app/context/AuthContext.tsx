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
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phoneNumber: string, referralCode: string) => Promise<void>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          // Merge Firebase user with Firestore data
          setUser({
            ...firebaseUser,
            points: userData?.points || 0,
            referralCode: userData?.referralCode || '',
            phoneNumber: userData?.phoneNumber || '',
            isAdmin: userData?.isAdmin || false,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Don't set error state here as it might affect the UI negatively
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
    }
    
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = (name: string) => {
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${name.substring(0, 4).toUpperCase()}${randomNum}`;
  };

  const signUp = async (email: string, password: string, phoneNumber: string, referralCode: string) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        phoneNumber,
        referralCode: referralCode || '',
        points: 0,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      });

      // If there's a referral code, update referrer's points
      if (referralCode) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('referralCode', '==', referralCode));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            await updateDoc(doc(db, 'users', referrerDoc.id), {
              points: (referrerDoc.data().points || 0) + 100,
            });
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
      await firebaseSignOut(auth);
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
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 