'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  stock: number;
  images: string[];
  sold?: number;
  badge?: string;
  rating?: number;
  reviews?: number;
  shipping?: string;
}

export default function FlashDealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdownHours, setCountdownHours] = useState(11);
  const [countdownMinutes, setCountdownMinutes] = useState(59);
  const [countdownSeconds, setCountdownSeconds] = useState(59);

  useEffect(() => {
    // Countdown timer for flash deals
    const timer = setInterval(() => {
      if (countdownSeconds > 0) {
        setCountdownSeconds(countdownSeconds - 1);
      } else if (countdownMinutes > 0) {
        setCountdownMinutes(countdownMinutes - 1);
        setCountdownSeconds(59);
      } else if (countdownHours > 0) {
        setCountdownHours(countdownHours - 1);
        setCountdownMinutes(59);
        setCountdownSeconds(59);
      } else {
        // Reset timer when it reaches 0
        setCountdownHours(11);
        setCountdownMinutes(59);
        setCountdownSeconds(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownHours, countdownMinutes, countdownSeconds]);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        // Get products with the highest discounts and badges marking them as deals
        const flashDealsQuery = query(
          collection(db, 'products'),
          orderBy('discount', 'desc'),
          limit(20)
        );

        const querySnapshot = await getDocs(flashDealsQuery);
        const productsData = querySnapshot.docs.map(doc => {
          const data = doc.data() as Product;
          return { ...data, id: doc.id };
        });

        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flash deals:', err);
        setError('Failed to load flash deals. Please try again later.');
        setLoading(false);
      }
    };

    fetchFlashDeals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-20">
      {/* Flash Sale Countdown - Temu Style */}
      <div className="bg-gradient-to-r from-primary via-primary-dark to-primary p-4 mb-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold mr-2">⚡ FLASH DEALS</span>
              <div className="flex space-x-1">
                <div className="bg-white rounded p-1 text-primary font-bold">{String(countdownHours).padStart(2, '0')}</div>
                <span className="text-white font-bold">:</span>
                <div className="bg-white rounded p-1 text-primary font-bold">{String(countdownMinutes).padStart(2, '0')}</div>
                <span className="text-white font-bold">:</span>
                <div className="bg-white rounded p-1 text-primary font-bold">{String(countdownSeconds).padStart(2, '0')}</div>
              </div>
            </div>
            <div className="text-white text-sm">
              Hurry! Deals end soon
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 pt-4">Flash Deals</h1>
        
        {products.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No flash deals available. Please check back later.</p>
            <Link href="/admin/reset-database" className="mt-4 inline-block text-primary hover:underline">
              Reset Database to Add Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
                  <div className="relative h-40 bg-gray-100">
                    <Image
                      src={product.images[0] || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded">
                        {product.badge}
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute bottom-1 left-1 bg-primary text-white text-xs font-bold px-1 rounded-sm">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-end">
                      <span className="text-primary font-bold text-base">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-xs line-through ml-1">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs mt-1 text-gray-600 line-clamp-2 h-8">
                      {product.name}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <div className="flex items-center">
                        <span className="text-yellow-500">{"★".repeat(Math.floor(product.rating || 0))}</span>
                        <span className="ml-1 text-gray-500">({product.reviews})</span>
                      </div>
                      <span className="text-gray-500">{product.sold && `${product.sold}+ sold`}</span>
                    </div>
                    {product.shipping && (
                      <div className="text-xs text-green-600 mt-1">{product.shipping}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
