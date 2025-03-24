'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id} className="group">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="relative h-64 w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-1">{product.category}</p>
              <p className="text-xl font-bold text-blue-600 mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 