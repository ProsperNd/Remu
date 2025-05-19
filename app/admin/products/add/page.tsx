'use client';

import React, { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Image from 'next/image';

const categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Smart Home',
  'Gaming',
  'Sports',
  'Accessories',
];

const badges = [
  'New Arrival',
  'Best Seller',
  'Hot Deal',
  'Flash Deal',
  'Top Rated',
  'Trending',
  'Recommended',
  'Sale',
];

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    discount: '',
    badge: '',
    shipping: 'Free Shipping',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">You do not have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      // Create preview URLs
      newFiles.forEach(file => {
        const url = URL.createObjectURL(file);
        setImageUrls(prev => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]) => {
    setImageLoading(true);
    const urls: string[] = [];

    try {
      for (const file of files) {
        const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        urls.push(url);
      }
      return urls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!formData.name || !formData.description || !formData.price || 
        !formData.category || !formData.stock || images.length === 0) {
      setError('Please fill in all required fields and add at least one image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload images
      const imageUrls = await uploadImages(images);
      
      // Format product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseInt(formData.discount) : null,
        badge: formData.badge || null,
        shipping: formData.shipping,
        images: imageUrls,
        imageUrl: imageUrls[0], // For backward compatibility
        rating: 4.5, // Default rating
        reviews: 0, // Default review count
        sold: 0, // Default sold count
        createdAt: serverTimestamp(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'products'), productData);
      
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        stock: '',
        discount: '',
        badge: '',
        shipping: 'Free Shipping',
      });
      setImages([]);
      setImageUrls([]);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">Add New Product</h1>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-500 rounded-md">
            Product added successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="19.99"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="29.99"
                step="0.01"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="100"
                min="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="10"
                min="0"
                max="99"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">None</option>
                {badges.map((badge) => (
                  <option key={badge} value={badge}>
                    {badge}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping</label>
              <select
                name="shipping"
                value={formData.shipping}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Free Shipping">Free Shipping</option>
                <option value="$4.99 Shipping">$4.99 Shipping</option>
                <option value="$9.99 Express Shipping">$9.99 Express Shipping</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Enter product description"
              required
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images *</label>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
              >
                Select Images
              </button>
              
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-32 w-full overflow-hidden rounded-md border border-gray-200">
                        <Image 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageLoading}
              className={`px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-500 ${(loading || imageLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading || imageLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </div>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
