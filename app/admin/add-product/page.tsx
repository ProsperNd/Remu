'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import Link from 'next/link';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  images: File[];
  imageUrls: string[];
  discount?: string;
  originalPrice?: string;
}

const INITIAL_FORM: ProductForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  images: [],
  imageUrls: [],
  discount: '',
  originalPrice: ''
};

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Smart Home',
  'Gaming',
  'Sports',
  'Accessories',
  'Networking',
  'Kitchen'
];

export default function AddProduct() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if user is admin, if not redirect
    if (user && !user.isAdmin) {
      router.push('/');
    }
  }, [user, router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!form.name.trim()) {
      errors.name = 'Product name is required';
      isValid = false;
    }

    if (!form.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!form.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (!form.price.trim()) {
      errors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      errors.price = 'Price must be a positive number';
      isValid = false;
    }

    if (!form.stock.trim()) {
      errors.stock = 'Stock quantity is required';
      isValid = false;
    } else if (isNaN(parseInt(form.stock)) || parseInt(form.stock) < 0) {
      errors.stock = 'Stock must be a non-negative number';
      isValid = false;
    }

    if (form.images.length === 0) {
      errors.images = 'At least one product image is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setFormErrors(prev => ({ ...prev, images: 'You can only upload up to 5 images' }));
      return;
    }

    setForm(prev => ({ ...prev, images: files }));
    setFormErrors(prev => ({ ...prev, images: '' }));
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const uploadImages = async () => {
    const urls = [];
    try {
      for (const image of form.images) {
        const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const url = await getDownloadURL(snapshot.ref);
        urls.push(url);
      }
      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Upload images first
      const imageUrls = await uploadImages();

      // Calculate discount percentage if both price and original price are provided
      let discountPercent = null;
      if (form.originalPrice && form.price) {
        const originalPrice = parseFloat(form.originalPrice);
        const currentPrice = parseFloat(form.price);
        if (originalPrice > currentPrice) {
          discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
        }
      }

      // Prepare product data
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        discount: form.discount ? parseInt(form.discount) : discountPercent,
        category: form.category,
        stock: parseInt(form.stock),
        images: imageUrls,
        imageUrl: imageUrls[0], // For backwards compatibility
        rating: 2.5, // Default rating
        ratingCount: 0, // No ratings yet
        reviews: 0, // No reviews yet
        sold: 0, // None sold yet
        createdAt: serverTimestamp(),
        id: Date.now().toString() + Math.floor(Math.random() * 1000)
      };

      // Add to Firestore
      await addDoc(collection(db, 'products'), productData);
      setSuccess(true);
      setForm(INITIAL_FORM);
      setImagePreview([]);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({
      ...prev,
      images: Array.from(prev.images).filter((_, i) => i !== index)
    }));
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="mb-4">You do not have permission to access this page.</p>
          <Link href="/" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Add New Product</h1>
        <Link 
          href="/admin" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md">
          <p className="font-medium">Success!</p>
          <p>Product has been added successfully.</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setSuccess(false)}
              className="bg-white border border-green-500 text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors"
            >
              Add Another Product
            </button>
            <Link
              href="/admin"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {!success && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Enter product name"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`mt-1 block w-full px-3 py-2 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="0.00"
                    />
                    {formErrors.price && <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>}
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      min="0"
                      className={`mt-1 block w-full px-3 py-2 border ${formErrors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                      placeholder="0"
                    />
                    {formErrors.stock && <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    className={`mt-1 block w-full px-3 py-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Describe your product..."
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Images <span className="text-red-500">*</span></label>
                  <div className={`mt-1 p-4 border-2 border-dashed ${formErrors.images ? 'border-red-500' : 'border-gray-300'} rounded-lg text-center`}>
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center justify-center py-6"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        {imagePreview.length === 0
                          ? 'Click to upload images (max 5)'
                          : 'Click to change images'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>
                  {formErrors.images && <p className="mt-1 text-sm text-red-600">{formErrors.images}</p>}

                  {imagePreview.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Image Preview</p>
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreview.map((src, index) => (
                          <div key={index} className="relative group">
                            <div className="relative h-24 w-full overflow-hidden rounded-md border border-gray-200">
                              <Image
                                src={src}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Product Preview</h3>
                    <div className="p-3 bg-white border border-gray-200 rounded-md">
                      <h4 className="font-medium truncate">{form.name || 'Product Name'}</h4>
                      <p className="text-sm text-gray-500 truncate">{form.category || 'Category'}</p>
                      <p className="text-primary font-bold mt-1">${parseFloat(form.price || '0').toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Product...
                    </div>
                  ) : (
                    'Save Product'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}