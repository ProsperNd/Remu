'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, orderBy, getDocs, startAt, endAt, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useToast } from '../components/ToastNotification';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  images: string[];
  imageUrl: string;
  rating?: number;
  reviews?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { addItem } = useCart();
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    if (!searchQuery) {
      setLoading(false);
      return;
    }
    
    const searchProducts = async () => {
      try {
        setLoading(true);
        
        // Build the base query
        const productsRef = collection(db, 'products');
        let q = query(productsRef);
        
        // Apply price filters
        if (minPrice !== '' && maxPrice !== '') {
          q = query(q, where('price', '>=', minPrice), where('price', '<=', maxPrice));
        } else if (minPrice !== '') {
          q = query(q, where('price', '>=', minPrice));
        } else if (maxPrice !== '') {
          q = query(q, where('price', '<=', maxPrice));
        }
        
        // Apply category filter
        if (categoryFilter !== 'all') {
          q = query(q, where('category', '==', categoryFilter));
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'price-asc':
            q = query(q, orderBy('price', 'asc'));
            break;
          case 'price-desc':
            q = query(q, orderBy('price', 'desc'));
            break;
          case 'rating':
            q = query(q, orderBy('rating', 'desc'));
            break;
          case 'newest':
            q = query(q, orderBy('createdAt', 'desc'));
            break;
          default:
            // Default sort by relevance doesn't need specific ordering
            q = query(q, orderBy('name'));
        }
        
        const querySnapshot = await getDocs(q);
        
        // Filter results client-side based on the search query
        // This is a simplistic approach - in a real app, you might want to use Algolia or a similar search service
        let results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Product));
        
        // Filter by search query
        if (searchQuery) {
          const lowercaseQuery = searchQuery.toLowerCase();
          results = results.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) || 
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
          );
        }
        
        // Extract all unique categories for the filter
        const uniqueCategories = Array.from(new Set(results.map(product => product.category)));
        setCategories(uniqueCategories);
        
        setProducts(results);
      } catch (error) {
        console.error('Error searching products:', error);
        setError('Failed to search products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    searchProducts();
  }, [searchQuery, categoryFilter, minPrice, maxPrice, sortBy]);
  
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl || product.images[0]
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add product to cart', 'error');
    }
  };
  
  const resetFilters = () => {
    setCategoryFilter('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('relevance');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          {loading ? 'Searching...' : `${products.length} products found`}
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block lg:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="category-all"
                    type="radio"
                    name="category"
                    checked={categoryFilter === 'all'}
                    onChange={() => setCategoryFilter('all')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="category-all" className="ml-2 text-sm text-gray-700">
                    All Categories
                  </label>
                </div>
                
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      type="radio"
                      name="category"
                      checked={categoryFilter === category}
                      onChange={() => setCategoryFilter(category)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span>-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
            
            <button
              onClick={resetFilters}
              className="w-full py-2 text-primary hover:text-primary-dark font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-primary font-medium"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {showFilters && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
              <h2 className="font-bold text-lg mb-4">Filters</h2>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Category</h3>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
          </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span>-</span>
                        <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
            </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
              
              <button
                onClick={resetFilters}
                className="w-full py-2 text-primary hover:text-primary-dark font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Product Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-lg text-gray-600 mb-4">
                No products found matching "{searchQuery}".
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group product-card relative">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                      <div className="relative h-56 w-full">
                        <Image
                          src={product.imageUrl || product.images[0]}
                    alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md z-10">
                          <div 
                            onClick={(e) => handleAddToCart(e, product)}
                            className="cursor-pointer p-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                          >
                            <ShoppingCartIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                      
                  <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                        <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                          </span>
                          {product.rating && (
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span className="text-gray-600">{product.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                      </div>
                    </div>
                  </Link>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 