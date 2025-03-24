import { db } from '../app/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const makeAdmin = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isAdmin: true
    });
    console.log('Successfully made user an admin!');
  } catch (error) {
    console.error('Error making user admin:', error);
  }
  process.exit(0);
};

// Replace this with your user ID after signing up
const userId = process.argv[2];

if (!userId) {
  console.error('Please provide a user ID as an argument');
  process.exit(1);
}

makeAdmin(userId); 