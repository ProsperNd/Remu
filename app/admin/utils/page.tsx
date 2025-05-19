'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { populateProducts } from '../../utils/populateProducts';
import { resetDatabase } from '../../utils/resetDatabase';

export default function AdminUtilities() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' }>();

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">You do not have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handlePopulateProducts = async () => {
    if (!confirm('This will add a large set of sample products to the database. Continue?')) {
      return;
    }

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
      
      if (result.success) {
        // Force reload after 2 seconds to refresh the page and show new products
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error populating products:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('This will reset the database by removing existing products and adding sample products. Continue?')) {
      return;
    }

    setLoading(true);
    setMessage({ text: 'Resetting database...', type: 'info' });

    try {
      const result = await resetDatabase();
      setMessage({ 
        text: result.success 
          ? 'Database reset successfully!' 
          : result.message, 
        type: result.success ? 'success' : 'error' 
      });
      
      if (result.success) {
        // Force reload after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error resetting database:', error);
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">Admin Utilities</h1>
        
        {message && (
          <div 
            className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}
          >
            {message.text}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Populate Products</h2>
            <p className="text-gray-600 mb-4">
              Add a large set of sample products across all categories to fill your store. This will not affect existing products.
            </p>
            <button
              onClick={handlePopulateProducts}
              disabled={loading}
              className={`px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Adding Products...' : 'Add Sample Products'}
            </button>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Reset Database</h2>
            <p className="text-gray-600 mb-4">
              Reset the database by removing all existing products and adding sample products. This action cannot be undone.
            </p>
            <button
              onClick={handleResetDatabase}
              disabled={loading}
              className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Resetting...' : 'Reset Database'}
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Admin Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/products/add')}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              <h3 className="font-medium text-gray-800">Add Product</h3>
              <p className="text-sm text-gray-600 mt-1">Add a new product to your store</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/products')}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              <h3 className="font-medium text-gray-800">Manage Products</h3>
              <p className="text-sm text-gray-600 mt-1">View, edit, and delete products</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/make-admin')}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
            >
              <h3 className="font-medium text-gray-800">Make Admin</h3>
              <p className="text-sm text-gray-600 mt-1">Grant admin access to users</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
