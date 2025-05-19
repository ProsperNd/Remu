'use client';

import { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useRouter } from 'next/navigation';

export default function MakeAdminPage() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  const makeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId && !email) {
      setResult({
        success: false,
        message: 'Please provide either a User ID or Email',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let targetUserId = userId;

      // If email is provided but no userId, try to find the user by email
      if (!userId && email) {
        setResult({
          success: false,
          message: 'When using email, please also provide the user ID. You can find your user ID in the browser console after signing in (look for "User authenticated: [YOUR-USER-ID]")',
        });
        setLoading(false);
        return;
      }

      // Update the user to be an admin
      const userRef = doc(db, 'users', targetUserId);
      
      // Check if user exists
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        setResult({
          success: false,
          message: `User with ID ${targetUserId} does not exist`,
        });
        setLoading(false);
        return;
      }

      await updateDoc(userRef, {
        isAdmin: true
      });

      setResult({
        success: true,
        message: `Successfully made user ${email || targetUserId} an admin!`,
      });
    } catch (error) {
      console.error('Error making user admin:', error);
      setResult({
        success: false,
        message: `Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-orange-600 mb-4">Make User Admin</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Instructions</h2>
          <ol className="list-decimal pl-4 space-y-1 text-sm text-yellow-700">
            <li>Sign in to your account first</li>
            <li>Open browser console (F12 or right-click > Inspect > Console)</li>
            <li>Look for message "User authenticated: [your-user-id]"</li>
            <li>Copy the user ID and paste it below</li>
            <li>Click "Make Admin" to grant admin privileges</li>
          </ol>
        </div>

        {result && (
          <div
            className={`mb-6 p-4 rounded-md ${result.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
          >
            {result.message}
          </div>
        )}

        <form onSubmit={makeAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter the user ID from console"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (optional, for your reference only)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter the user's email"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!userId && !email)}
              className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 ${(loading || (!userId && !email)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Make Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
