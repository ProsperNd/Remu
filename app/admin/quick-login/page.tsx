'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { createTestAccount } from '../../utils/createTestAccount';
import { populateProducts } from '../../utils/populateProducts';

export default function QuickLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>();
  const [credentials, setCredentials] = useState({ email: 'test@remustore.com', password: 'password123' });

  const handleCreateTestAccount = async () => {
    setLoading(true);
    setMessage({ text: 'Creating test account...', type: 'info' });

    try {
      const result = await createTestAccount();
      setMessage({ 
        text: result.message, 
        type: result.success ? 'success' : 'error' 
      });
      
      if (result.success && result.credentials) {
        setCredentials(result.credentials);
      }
    } catch (error) {
      console.error('Error creating test account:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setMessage({ text: 'Signing in...', type: 'info' });

    try {
      await signIn(credentials.email, credentials.password);
      setMessage({ text: 'Sign in successful! Redirecting...', type: 'success' });
      
      // Redirect after successful login
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Error signing in:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateProducts = async () => {
    setLoading(true);
    setMessage({ text: 'Adding products...', type: 'info' });

    try {
      const result = await populateProducts();
      setMessage({ 
        text: result.success 
          ? `Successfully added ${result.count} products to the database!` 
          : result.message, 
        type: result.success ? 'success' : 'error' 
      });
    } catch (error) {
      console.error('Error populating products:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-orange-600 mb-6 text-center">Remu Quick Access</h1>
        
        {message && (
          <div 
            className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}
          >
            {message.text}
          </div>
        )}
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Test Account Login</h2>
            
            <form className="space-y-4 mb-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={loading}
                />
              </div>
            </form>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleCreateTestAccount}
                disabled={loading}
                className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                Create Account
              </button>
              
              <button
                onClick={handleQuickLogin}
                disabled={loading}
                className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                Sign In
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Database Utilities</h2>
            <button
              onClick={handlePopulateProducts}
              disabled={loading}
              className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              Add Sample Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
