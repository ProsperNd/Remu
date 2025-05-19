'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  GiftIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Function to get cart count from localStorage
    const getCartCount = () => {
      if (typeof window !== 'undefined') {
        const cart = localStorage.getItem('cart');
        if (cart) {
          try {
            const cartItems = JSON.parse(cart);
            const itemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
            setCartItemCount(itemCount);
          } catch (error) {
            console.error('Error parsing cart data:', error);
            setCartItemCount(0);
          }
        } else {
          setCartItemCount(0);
        }
      }
    };

    // Initial cart count
    getCartCount();

    // Add event listener for storage changes
    const handleStorageChange = () => {
      getCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for cart updates
    const handleCartUpdate = () => {
      getCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Check cart count every second (for updates from other components)
    const interval = setInterval(getCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-primary-dark text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">🎉 Free Shipping on Orders Over $50! Limited Time Offer 🎉</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white hover:text-secondary transition">
              ReMu
            </span>
          </Link>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-dark pl-4 pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-primary"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-6">
            {user && (
              <Link href="/referrals" className="text-white hover:text-secondary-dark relative">
                <GiftIcon className="h-6 w-6" />
                {user.points && user.points > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {user.points}
                  </span>
                )}
              </Link>
            )}
            <Link href="/wishlist" className="text-white hover:text-secondary-dark">
              <HeartIcon className="h-6 w-6" />
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-white hover:text-secondary-dark"
              >
                <UserIcon className="h-6 w-6" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                        >
                          Profile
                        </Link>
                        {user.isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link href="/cart" className="text-white hover:text-secondary-dark relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin" className="text-white hover:text-secondary-dark">
                <ShieldCheckIcon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 text-sm overflow-x-auto">
            {['Today\'s Deals', 'New Arrivals', 'Women', 'Men', 'Kids', 'Beauty', 'Electronics', 'Home & Kitchen', 'Sports'].map((item) => (
              <Link
                key={item}
                href={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-white hover:text-secondary-dark py-3 px-2 whitespace-nowrap"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
} 