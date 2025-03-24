'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from './firebase/config';
import { Product } from './utils/sampleProducts';
import Header from './components/Header';
import Image from 'next/image';
import Link from 'next/link';
import ProductList from './components/ProductList';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsQuery = query(
          collection(db, 'products'),
          orderBy('rating', 'desc'),
          limit(8)
        );
        const querySnapshot = await getDocs(productsQuery);
        const productsData = querySnapshot.docs.map(doc => doc.data() as Product);
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Our Store
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Discover amazing products at great prices
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
          
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative h-48">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold">
                        ${product.price}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Best Quality</h3>
              <p className="text-gray-600">Guaranteed products</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">100% protected</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 px-6">Featured Products</h1>
        <ProductList />
      </div>
    </main>
  );
} 