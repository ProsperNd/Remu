'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase/config';
import { Product } from './utils/sampleProducts';
import { mockProducts } from './utils/mockData';
import Image from 'next/image';
import Link from 'next/link';
import ProductList from './components/ProductList';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useToast } from './components/ToastNotification';
import { useCart } from './context/CartContext';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const { showToast } = useToast();
  const { addItem } = useCart();

  useEffect(() => {
    // Set up real-time listeners for featured products, new arrivals, and regular products
    
    // Featured products query - get top rated products
    const featuredQuery = query(
      collection(db, 'products'),
      orderBy('rating', 'desc'),
      limit(12)
    );
    
    // New arrivals query - get newest products
    const newArrivalsQuery = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc'),
      limit(4)
    );
    
    // Regular products query
        const productsQuery = query(
          collection(db, 'products'),
          limit(8)
        );
    
    // Initialize counters to track when all data is loaded
    let loadedDataSets = 0;
    const totalDataSets = 3;
    const checkAllLoaded = () => {
      loadedDataSets++;
      if (loadedDataSets >= totalDataSets) {
        setLoading(false);
      }
    };

    // Set up featured products listener
    const unsubFeatured = onSnapshot(
      featuredQuery, 
      (snapshot) => {
        const featuredData = snapshot.docs.map(doc => {
          const data = doc.data() as Product;
          return { ...data, id: doc.id };
        });
        
        if (featuredData.length > 0) {
          setFeaturedProducts(featuredData);
          setUsingMockData(false);
        } else {
          // Only set mock data if we haven't already got any real data
          if (featuredProducts.length === 0) {
            console.log('No featured products found, using mock data');
            setFeaturedProducts(mockProducts);
            setUsingMockData(true);
          }
        }
        checkAllLoaded();
      },
      (err) => {
        console.error('Error fetching featured products:', err);
        setFeaturedProducts(mockProducts);
        setUsingMockData(true);
        setError('Could not connect to the database. Using sample data instead.');
        checkAllLoaded();
      }
    );
    
    // Set up new arrivals listener
    const unsubNewArrivals = onSnapshot(
      newArrivalsQuery,
      (snapshot) => {
        const newArrivalsData = snapshot.docs.map(doc => {
          const data = doc.data() as Product;
          return { ...data, id: doc.id };
        });
        
        if (newArrivalsData.length > 0) {
          setNewArrivals(newArrivalsData);
        } else {
          // Only set mock data if we haven't already got any real data
          if (newArrivals.length === 0) {
            setNewArrivals(mockProducts.slice(0, 4));
          }
        }
        checkAllLoaded();
      },
      (err) => {
        console.error('Error fetching new arrivals:', err);
        setNewArrivals(mockProducts.slice(0, 4));
        checkAllLoaded();
      }
    );
    
    // Set up regular products listener
    const unsubProducts = onSnapshot(
      productsQuery,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => {
          const data = doc.data() as Product;
          return { ...data, id: doc.id };
        });
        
        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          // Only set mock data if we haven't already got any real data
          if (products.length === 0) {
            setProducts(mockProducts.slice(4, 12));
          }
        }
        checkAllLoaded();
      },
      (err) => {
        console.error('Error fetching products:', err);
        setProducts(mockProducts.slice(4, 12));
        checkAllLoaded();
      }
    );
    
    // Clean up listeners when component unmounts
    return () => {
      unsubFeatured();
      unsubNewArrivals();
      unsubProducts();
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event bubbling
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || '/placeholder.png'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add product to cart', 'error');
    }
  };

  return (
    <main className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-white text-lg mb-8">
              Quality products at great prices with fast shipping
            </p>
            <Link
              href="/products"
              className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Notice if using mock data */}
      {usingMockData && (
        <div className="bg-yellow-100 border-yellow-400 border-l-4 p-4 mb-4 mx-6 mt-6">
          <p className="text-yellow-700">
            <strong>Note:</strong> Unable to connect to the database. Showing sample products instead.
          </p>
        </div>
      )}

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty'].map((category) => (
              <Link href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} key={category} className="group">
                <div className="bg-secondary rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">{getEmoji(category)}</span>
                  </div>
                  <div className="p-4 bg-primary text-center">
                    <h3 className="text-lg font-semibold text-white group-hover:underline">
                      {category}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
          
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          )}

          {error && !usingMockData && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card relative">
                <Link href={`/product/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="relative h-48">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-primary font-bold">
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
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">New Arrivals</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div key={product.id} className="product-card relative">
                <Link href={`/product/${product.id}`}>
                  <div className="bg-secondary rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                    <div className="relative h-48">
                      <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs font-bold">
                        NEW
                      </div>
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-white p-1 rounded-full shadow-md">
                        <div 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="cursor-pointer p-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {product.name}
                      </h3>
                      <span className="text-primary font-bold block mt-2">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Best Quality</h3>
              <p className="text-gray-600">Guaranteed products</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="text-primary text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">100% protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-white mb-6">Get updates about new products and special offers</p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary-dark text-white px-6 py-2 rounded-r-lg hover:bg-opacity-90"
            >
              Subscribe
            </button>
          </form>
      </div>
      </section>
    </main>
  );
}

// Helper function to get emoji for category
function getEmoji(category: string): string {
  switch (category.toLowerCase()) {
    case 'electronics':
      return '📱';
    case 'fashion':
      return '👔';
    case 'home & kitchen':
      return '🏠';
    case 'beauty':
      return '💄';
    default:
      return '🛍️';
  }
} 