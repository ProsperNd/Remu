'use client';

import { useState } from 'react';
import { resetDatabase } from '../../utils/resetDatabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function ResetDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete all existing products and add sample products.')) {
      return;
    }

    setLoading(true);
    try {
      const resetResult = await resetDatabase();
      setResult(resetResult);
      
      if (resetResult.success) {
        // Wait 2 seconds before redirecting to home page
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error resetting database:', error);
      setResult({ 
        success: false, 
        message: 'An unexpected error occurred while resetting the database.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 pt-24">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">You do not have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-24">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-primary mb-6">Reset Database</h1>
        <p className="text-gray-700 mb-6">
          This utility will clear all existing products from the database and add new sample products with Temu-style data.
          This action cannot be undone.
        </p>
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg shadow-md text-white font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} transition`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </div>
          ) : (
            'Reset Database'
          )}
        </button>

        {result && (
          <div
            className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}
