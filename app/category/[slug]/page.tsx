'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useToast } from '../../components/ToastNotification';
import { useCart } from '../../context/CartContext';

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

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, price-low, price-high, newest
  const [categoryName, setCategoryName] = useState('');
  const [categoryEmoji, setCategoryEmoji] = useState('🛍️');
  const { showToast } = useToast();
  const { addItem } = useCart();
  
  useEffect(() => {
    const slug = params.slug;
    // Convert slug to category name (e.g., "home-kitchen" -> "Home & Kitchen")
    const formattedCategory = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Handle special cases
    const categoryMap: {[key: string]: string} = {
      'home kitchen': 'Home & Kitchen',
      'smart home': 'Smart Home',
    };
    
    const category = categoryMap[formattedCategory.toLowerCase()] || formattedCategory;
    setCategoryName(category);
    setCategoryEmoji(getCategoryEmoji(category));
    
    // Determine the query based on the sort option
    let productsQuery;
    if (sortBy === 'price-low') {
      productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('price', 'asc')
      );
    } else if (sortBy === 'price-high') {
      productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('price', 'desc')
      );
    } else if (sortBy === 'newest') {
      productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    } else { // popularity (default)
      productsQuery = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('sold', 'desc')
      );
    }
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => {
          const data = doc.data() as Product;
          return { ...data, id: doc.id };
        });
        
        setProducts(productsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    );
    
    // Clean up listener when component unmounts or dependencies change
    return () => unsubscribe();
  }, [params.slug, sortBy]);
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event bubbling
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0] || '/placeholder.png'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add product to cart', 'error');
    }
  };
  
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between pt-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-2">{categoryEmoji}</span>
            {categoryName}
            <span className="text-sm font-normal text-gray-500 ml-2">({products.length})</span>
          </h1>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm text-gray-600">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No products found in this category. Please check back later.</p>
            <Link href="/categories" className="mt-4 inline-block text-primary hover:underline">
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <Link href={`/product/${product.id}`}>
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
                      <div className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md">
                        <div 
                          onClick={(e) => handleAddToCart(e, product)}
                          className="cursor-pointer p-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                        >
                          <ShoppingCartIcon className="h-4 w-4" />
                        </div>
                      </div>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get emoji for category
function getCategoryEmoji(category: string): string {
  const categoryMap: {[key: string]: string} = {
    'Electronics': '📱',
    'Fashion': '👔',
    'Home & Kitchen': '🏠',
    'Beauty': '💄',
    'Smart Home': '🏡',
    'Gaming': '🎮',
    'Sports': '⚽',
    'Accessories': '👜',
  };
  
  return categoryMap[category] || '🛍️';
}
