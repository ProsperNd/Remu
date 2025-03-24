'use client';

import React from 'react';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';

// This would typically come from an API or state management
const cartItems = [
  {
    id: 1,
    name: 'Casual T-Shirt',
    price: 9.99,
    quantity: 2,
    image: 'https://via.placeholder.com/150',
    size: 'M',
    color: 'White',
  },
  {
    id: 2,
    name: 'Summer Dress',
    price: 19.99,
    quantity: 1,
    image: 'https://via.placeholder.com/150',
    size: 'S',
    color: 'Blue',
  },
];

export default function Cart() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart to continue shopping.</p>
            <a
              href="/"
              className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 border-b py-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-2 py-1 border rounded">-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 border rounded">+</button>
                  </div>
                  <button className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-3 rounded-lg mt-6 font-semibold hover:bg-primary-dark transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 