'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Use the user's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6lEIdd2VCN3KMHf4-IoUfp1HngQDf4Uo",
  authDomain: "remu-feebb.firebaseapp.com",
  databaseURL: "https://remu-feebb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "remu-feebb",
  storageBucket: "remu-feebb.firebasestorage.app",
  messagingSenderId: "326780972702",
  appId: "1:326780972702:web:7b9015a9837b375c80958f",
  measurementId: "G-MN7BHLEDSP"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const rtdb = getDatabase(app); // Realtime Database instead of Firestore
const storage = getStorage(app);

// Only set persistence in browser environments to avoid SSR issues
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Firebase auth persistence set to LOCAL');
    })
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });
}

// Initialize Analytics in browser environments only
let analytics = null;
if (typeof window !== 'undefined') {
  // Initialize analytics only in browser environment
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized');
    }
  });
}

console.log('Firebase Realtime Database initialized');

export { app, auth, rtdb, storage, analytics };
