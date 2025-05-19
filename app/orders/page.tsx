'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../utils/formatters';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: any; // Firebase timestamp
  updatedAt: any; // Firebase timestamp
  trackingNumber?: string;
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
    if (!user) {
        setLoading(false);
      return;
    }

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
    }

  if (!user) {
  return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Please Sign In</h1>
        <p className="text-lg text-gray-600 mb-8">
          You need to be signed in to view your order history.
        </p>
        <Link
          href="/auth"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
        >
          Sign In
        </Link>
          </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
        
        {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <Link 
                href="/" 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
              >
                Start Shopping
              </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="p-4 border-b cursor-pointer hover:bg-gray-50 transition"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                    <div className="flex items-center">
                      <span className="font-bold">Order #{order.id.slice(-8)}</span>
                      <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="p-4 bg-gray-50">
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Method</h4>
                        <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        
                        {order.status === 'shipped' && order.trackingNumber && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Tracking Number</h4>
                            <p className="text-sm text-blue-600">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-2">Items</h3>
                  <div className="space-y-3">
                      {order.items.map((item) => (
                      <div key={item.id} className="flex items-center bg-white p-3 rounded border border-gray-200">
                        <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        <div className="ml-4 flex-grow">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <div className="flex justify-between mt-1">
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}