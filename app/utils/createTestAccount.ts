import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

/**
 * Creates a test account with admin privileges
 * Use this to quickly get access to admin features in development
 */
export async function createTestAccount() {
  const email = 'test@remustore.com';
  const password = 'password123';
  const username = 'Test Admin';

  try {
    console.log('Creating test account...');
    
    // First try signing in to check if the account already exists
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Test account already exists and signed in!');
      return { 
        success: true, 
        message: 'Test account already exists, sign in successful',
        credentials: { email, password }
      };
    } catch (signInError) {
      // If sign in fails, account might not exist, so create it
      console.log('Test account does not exist, creating new test account...');
    }

    // Create the test account in Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore with admin privileges
    await setDoc(doc(db, 'users', user.uid), {
      email,
      username,
      phoneNumber: '555-123-4567',
      referralCode: 'TESTADMIN',
      points: 1000,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });

    console.log('Test account created with admin privileges!');
    return { 
      success: true, 
      message: 'Test account created with admin privileges',
      credentials: { email, password }
    };
  } catch (error) {
    console.error('Error creating test account:', error);
    return { 
      success: false, 
      message: `Failed to create test account: ${error.message}`,
      credentials: { email, password }
    };
  }
}
