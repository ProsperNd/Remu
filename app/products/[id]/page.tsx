'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Product } from '../../utils/sampleProducts';
import Image from 'next/image';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.log('No such product!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-4">The product you are looking for does not exist.</p>
        <Link href="/" className="text-yellow-600 hover:text-yellow-800">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-yellow-600 hover:text-yellow-800 mb-8 inline-block">
        &larr; Back to Products
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-96 w-full rounded-lg overflow-hidden"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
        
        <div className="md:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-yellow-600 font-semibold mb-4">${product.price.toFixed(2)}</p>
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
              {product.features && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Features:</h3>
                  <ul className="list-disc pl-5">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex items-center mt-6">
              <button
                onClick={() => addToCart(product)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center transition duration-300"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <span className="ml-4 text-sm text-gray-500">
                {product.inventory > 10 
                  ? 'In Stock' 
                  : product.inventory > 0 
                    ? `Only ${product.inventory} left!` 
                    : 'Out of Stock'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 