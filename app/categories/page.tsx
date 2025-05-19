'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';
import Image from 'next/image';

interface CategorySummary {
  name: string;
  count: number;
  image: string;
  emoji: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        // Get all product data
        const products = snapshot.docs.map(doc => doc.data());
        
        // Count products by category and get first image for each category
        const categoryMap = new Map<string, CategorySummary>();
        
        products.forEach(product => {
          const category = product.category;
          if (!category) return;
          
          if (!categoryMap.has(category)) {
            categoryMap.set(category, {
              name: category,
              count: 1,
              image: product.images && product.images.length > 0 ? product.images[0] : '',
              emoji: getCategoryEmoji(category)
            });
          } else {
            const currentData = categoryMap.get(category)!;
            categoryMap.set(category, {
              ...currentData,
              count: currentData.count + 1
            });
          }
        });
        
        // Convert map to array and sort by count (most popular first)
        const categoriesArray = Array.from(categoryMap.values())
          .sort((a, b) => b.count - a.count);
          
        setCategories(categoriesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
        setLoading(false);
      }
    };

    fetchCategories();
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
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 pt-4">All Categories</h1>
        
        {categories.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No categories available. Please check back later.</p>
            <Link href="/admin/reset-database" className="mt-4 inline-block text-primary hover:underline">
              Reset Database
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
                key={category.name}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 bg-gray-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">{category.emoji}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">{category.emoji}</span>
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{category.count} products</p>
                </div>
              </Link>
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
