'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  images: File[];
  imageUrls: string[];
  sizes: string[];
  colors: string[];
}

const INITIAL_FORM: ProductForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  images: [],
  imageUrls: [],
  sizes: [],
  colors: [],
};

const CATEGORIES = [
  'Women',
  'Men',
  'Kids',
  'Beauty',
  'Electronics',
  'Home',
  'Sports',
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink'];

export default function AddProduct() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setError('You can only upload up to 5 images');
      return;
    }

    setForm(prev => ({ ...prev, images: files }));
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const uploadImages = async () => {
    const urls = [];
    for (const image of form.images) {
      const imageRef = ref(storage, `products/${Date.now()}-${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Upload images first
      const imageUrls = await uploadImages();

      // Create product document
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        images: imageUrls,
        sizes: form.sizes,
        colors: form.colors,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'products'), productData);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pricing & Inventory</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm(prev => ({ ...prev, stock: e.target.value }))}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Variants</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Available Sizes</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SIZES.map(size => (
                  <label key={size} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={form.sizes.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({ ...prev, sizes: [...prev.sizes, size] }));
                        } else {
                          setForm(prev => ({
                            ...prev,
                            sizes: prev.sizes.filter(s => s !== size)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Available Colors</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {COLORS.map(color => (
                  <label key={color} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={form.colors.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({ ...prev, colors: [...prev.colors, color] }));
                        } else {
                          setForm(prev => ({
                            ...prev,
                            colors: prev.colors.filter(c => c !== color)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Product Images</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Images (Max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imagePreview.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review & Publish</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">Product Details</h3>
              <dl className="mt-2 divide-y divide-gray-200">
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1">{form.name}</dd>
                </div>
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1">{form.category}</dd>
                </div>
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1">${form.price}</dd>
                </div>
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Stock</dt>
                  <dd className="mt-1">{form.stock} units</dd>
                </div>
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Sizes</dt>
                  <dd className="mt-1">{form.sizes.join(', ') || 'None selected'}</dd>
                </div>
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Colors</dt>
                  <dd className="mt-1">{form.colors.join(', ') || 'None selected'}</dd>
                </div>
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-500">Images</dt>
                  <dd className="mt-1">{form.images.length} selected</dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return form.name && form.description && form.category;
      case 2:
        return form.price && form.stock;
      case 3:
        return form.sizes.length > 0 && form.colors.length > 0;
      case 4:
        return form.images.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
        </div>
        <div className="bg-gray-200 h-2 rounded-full">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        {renderStep()}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 