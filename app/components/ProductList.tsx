'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockProducts } from '../utils/mockData';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useToast } from '../components/ToastNotification';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const { showToast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    // Query for products, ordered by creation date
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // Handle successful data fetch
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        if (productsData.length > 0) {
          setProducts(productsData);
          setUsingMockData(false);
          setError(null);
        } else {
          // If no data from Firebase, use mock data
          console.log('No products found in Firebase, using mock data');
          setUsingMockData(true);
          setProducts(mockProducts as unknown as Product[]);
          setError('No products found in the database. Using sample products.');
        }
        setLoading(false);
      },
      (err) => {
        // Handle errors
        console.error('Error fetching products:', err);
        console.log('Using mock data for ProductList component');
        setUsingMockData(true);
        setProducts(mockProducts as unknown as Product[]);
        setError('Failed to connect to the database. Using sample products.');
        setLoading(false);
      }
    );
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event bubbling
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add product to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <>
      {usingMockData && (
        <div className="bg-yellow-100 border-yellow-400 border-l-4 p-4 mb-4">
          <p className="text-yellow-700">
            <strong>Note:</strong> Unable to connect to the database. Showing sample products instead.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {products.map((product) => (
          <div key={product.id} className="group product-card relative">
            <Link href={`/product/${product.id}`} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="relative h-64 w-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md">
                    <div 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="cursor-pointer p-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-1">{product.category}</p>
                  <p className="text-xl font-bold text-primary mt-2">
                    ${product.price.toFixed(2)}
                  </p>
                  <button className="mt-3 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
} 