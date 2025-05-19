'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';

export default function DebugPage() {
  const [status, setStatus] = useState({ message: 'Testing connection...', success: false });
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      setLoading(true);
      setStatus({ message: 'Testing Firestore connection...', success: false });
      
      // Try to fetch products collection to test read permissions
      console.log('Testing Firestore read access...');
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsCount = productsSnapshot.size;
      console.log(`Successfully read ${productsCount} products from Firestore`);
      
      // Test is successful if we can read from Firestore
      setStatus({ 
        message: `Firestore connection successful! Found ${productsCount} products in database.`, 
        success: true 
      });
      setTestResult({
        productsCount,
        readSuccess: true,
      });
    } catch (error) {
      console.error('Error testing Firebase connection:', error);
      setStatus({ 
        message: `Error connecting to Firebase: ${error.message}`, 
        success: false 
      });
      setTestResult({
        error: error.message,
        readSuccess: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const addTestProduct = async () => {
    try {
      setLoading(true);
      setStatus({ message: 'Adding test product...', success: false });
      
      // Add a test product to check write permissions
      const productsCollection = collection(db, 'products');
      const newProduct = {
        name: 'Test Product',
        description: 'This is a test product to verify Firestore write permissions',
        price: 9.99,
        category: 'Test',
        stock: 999,
        images: ['https://via.placeholder.com/500'],
        imageUrl: 'https://via.placeholder.com/500',
        rating: 5,
        reviews: 1,
        sold: 0,
        discount: 0,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(productsCollection, newProduct);
      console.log('Test product added with ID:', docRef.id);
      
      setStatus({ 
        message: `Successfully added test product with ID: ${docRef.id}`, 
        success: true 
      });
      
      // Now test reading again
      await testFirebaseConnection();
    } catch (error) {
      console.error('Error adding test product:', error);
      setStatus({ 
        message: `Error adding test product: ${error.message}`, 
        success: false 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Firebase Debug Utility</h1>
        
        <div className={`p-4 mb-6 rounded-md ${status.success ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
          <h2 className="font-semibold text-lg mb-2">Status</h2>
          <p>{status.message}</p>
          {loading && (
            <div className="flex items-center mt-2">
              <div className="w-4 h-4 mr-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span>Testing in progress...</span>
            </div>
          )}
        </div>
        
        {testResult && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h2 className="font-semibold text-lg mb-2">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={testFirebaseConnection}
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            Test Connection Again
          </button>
          
          <button
            onClick={addTestProduct}
            disabled={loading}
            className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            Add Test Product
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/quick-login" className="block px-4 py-2 text-center bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
            Go to Quick Login
          </Link>
          
          <Link href="/" className="block px-4 py-2 text-center bg-gray-500 text-white rounded-md hover:bg-gray-600 transition">
            Home Page
          </Link>
          
          <Link href="/admin/utils" className="block px-4 py-2 text-center bg-purple-500 text-white rounded-md hover:bg-purple-600 transition">
            Admin Utilities
          </Link>
        </div>
      </div>
    </div>
  );
}
