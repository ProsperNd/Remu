'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/app/types/product';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full">
          <Image
            src={product.imageUrl || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-orange-500">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600">{product.description}</p>
          <div className="space-y-2">
            <p className="font-semibold">Available Sizes:</p>
            <div className="flex gap-2">
              {product.sizes?.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 border border-gray-300 rounded"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Colors:</p>
            <div className="flex gap-2">
              {product.colors?.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 border border-gray-300 rounded"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 