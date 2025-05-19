'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist, loading } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    removeFromWishlist(id);
  };

  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Wishlist</h1>
          <p className="text-gray-600">{items.length} saved items</p>
        </div>
        
        {items.length > 0 && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => clearWishlist()}
              className="text-red-500 hover:text-red-700 font-medium flex items-center"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Clear Wishlist
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <HeartIcon className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Browse our products and add items you like to your wishlist
          </p>
          <Link
            href="/"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-56 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                  >
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <Link href={`/product/${item.id}`} className="block">
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors mb-2">
                    {item.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary font-bold text-lg">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Added {formatDate(new Date(item.addedAt))}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-1" />
                    Add to Cart
                  </button>
                  
                  <Link
                    href={`/product/${item.id}`}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 