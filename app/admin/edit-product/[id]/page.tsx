'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export default function EditProduct({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', params.id));
        if (!productDoc.exists()) {
          router.push('/admin');
          return;
        }
        const productData = { id: productDoc.id, ...productDoc.data() } as Product;
        setProduct(productData);
        setPreviewUrl(productData.imageUrl);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setSaving(true);
      const productRef = doc(db, 'products', product.id);
      const updates: Partial<Product> = {
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
      };

      if (imageFile) {
        const imageRef = ref(storage, `products/${product.id}/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
        updates.imageUrl = imageUrl;
      }

      await updateDoc(productRef, updates);
      router.push('/admin');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-2 flex items-center space-x-6">
                <div className="relative h-32 w-32 rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 