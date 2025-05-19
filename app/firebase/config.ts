'use client';

import { initializeApp, getApps, getApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

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
let app: FirebaseApp;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  
  // Fallback to a more conservative config if needed
  const fallbackConfig: FirebaseOptions = {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  };
  
  try {
    app = initializeApp(fallbackConfig, 'fallback-app');
    console.log('Firebase app initialized with fallback config');
  } catch (fallbackError) {
    console.error('Failed to initialize Firebase with fallback config:', fallbackError);
    // Create a minimal app instance to avoid breaking the app
    app = {} as FirebaseApp;
  }
}

// Initialize Firebase services with error handling
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

try {
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
  
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
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  auth = {} as Auth;
}

try {
  db = getFirestore(app);
  console.log('Firebase Firestore initialized');
  
  // Enable offline persistence for Firestore in browser environment
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log('Firestore offline persistence enabled');
      })
      .catch((error) => {
        if (error.code === 'failed-precondition') {
          console.warn('Firestore persistence can only be enabled in one tab at a time');
        } else if (error.code === 'unimplemented') {
          console.warn('The current browser does not support offline persistence');
        } else {
          console.error('Error enabling Firestore persistence:', error);
        }
      });
  }
} catch (error) {
  console.error('Error initializing Firestore:', error);
  // Create a minimal Firestore instance to avoid breaking the app
  db = {} as unknown as Firestore;
}

try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized');
} catch (error) {
  console.error('Error initializing Firebase Storage:', error);
  storage = {} as FirebaseStorage;
}

// Initialize Analytics in browser environments only
if (typeof window !== 'undefined') {
  isSupported()
    .then(supported => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
          console.log('Firebase Analytics initialized');
        } catch (error) {
          console.error('Error initializing Firebase Analytics:', error);
        }
      } else {
        console.log('Firebase Analytics not supported in this environment');
      }
    })
    .catch(error => {
      console.error('Error checking Analytics support:', error);
    });
}

console.log('Firebase initialized with project:', firebaseConfig.projectId);

export { app, auth, db, storage, analytics };