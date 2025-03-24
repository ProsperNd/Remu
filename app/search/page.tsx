import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// This would typically come from an API based on search params
const searchResults = [
  {
    id: 1,
    name: 'Casual T-Shirt',
    price: 9.99,
    image: 'https://via.placeholder.com/200x200',
    rating: 4.5,
    reviews: 128,
  },
  // Add more products...
];

const filters = {
  'Price Range': ['Under $10', '$10-$20', '$20-$50', 'Over $50'],
  'Color': ['Black', 'White', 'Blue', 'Red', 'Green'],
  'Size': ['XS', 'S', 'M', 'L', 'XL'],
  'Rating': ['4★ & up', '3★ & up', '2★ & up'],
};

const sortOptions = [
  'Most Relevant',
  'Price: Low to High',
  'Price: High to Low',
  'Newest Arrivals',
  'Best Selling',
];

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Search Results for "{searchParams.q}"
            </h1>
            <div className="flex items-center space-x-4">
              <select className="border rounded-md px-3 py-1.5">
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-primary">
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="hidden lg:block">
              {Object.entries(filters).map(([category, options]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-medium mb-2">{category}</h3>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-gray-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {searchResults.map((product) => (
                <a
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="mt-1 text-sm text-gray-500">
                      ★ {product.rating} ({product.reviews} reviews)
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 