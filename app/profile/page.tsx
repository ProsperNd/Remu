'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';
import { UserIcon, ShoppingBagIcon, CreditCardIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <div className="flex flex-col items-center pb-6 border-b border-gray-200">
              <div className="h-24 w-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-4">
                <UserIcon className="h-12 w-12" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{userData?.username || user.email}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              {userData?.isAdmin && (
                <span className="mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                  Admin
                </span>
              )}
            </div>

            <nav className="mt-6 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium ${activeTab === 'profile' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <UserIcon className="mr-3 h-5 w-5" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium ${activeTab === 'orders' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <ShoppingBagIcon className="mr-3 h-5 w-5" />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium ${activeTab === 'payment' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <CreditCardIcon className="mr-3 h-5 w-5" />
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium ${activeTab === 'address' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <HomeIcon className="mr-3 h-5 w-5" />
                Addresses
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>

            {userData?.isAdmin && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Admin Actions</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/add-product" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Add Products
                  </Link>
                  <Link 
                    href="/admin/utils" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Utilities
                  </Link>
                  <Link 
                    href="/admin/make-admin" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    Make Admin
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                  <p className="mt-1 text-sm text-gray-500">Personal details and account information.</p>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500">Full name</div>
                    <div className="text-sm text-gray-900 col-span-2">{userData?.username || 'Not set'}</div>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500">Email address</div>
                    <div className="text-sm text-gray-900 col-span-2">{user.email}</div>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500">Phone number</div>
                    <div className="text-sm text-gray-900 col-span-2">{userData?.phoneNumber || 'Not set'}</div>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500">Referral code</div>
                    <div className="text-sm text-gray-900 col-span-2">{userData?.referralCode || 'Not available'}</div>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500">Points</div>
                    <div className="text-sm text-gray-900 col-span-2">
                      <span className="font-medium">{userData?.points || 0}</span> points
                    </div>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-4">
                    <div className="text-sm font-medium text-gray-500">Member since</div>
                    <div className="text-sm text-gray-900 col-span-2">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">My Orders</h3>
                  <p className="mt-1 text-sm text-gray-500">View and track your order history.</p>
                </div>
                
                <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                  <p className="text-sm text-gray-500 mb-6">When you place orders, they will appear here.</p>
                  <Link 
                    href="/" 
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage your payment methods.</p>
                </div>
                
                <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                  <CreditCardIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No payment methods added</h3>
                  <p className="text-sm text-gray-500 mb-6">Add a payment method to enable quick checkout.</p>
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
                    Add Payment Method
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Shipping Addresses</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage your shipping addresses.</p>
                </div>
                
                <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                  <HomeIcon className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No addresses saved</h3>
                  <p className="text-sm text-gray-500 mb-6">Add shipping addresses for easier checkout.</p>
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
                    Add New Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}