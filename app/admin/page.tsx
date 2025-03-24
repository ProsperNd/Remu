'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, updateDoc, doc, deleteDoc, orderBy, where, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/config';
import Header from '../components/Header';
import {
  TrashIcon,
  UserPlusIcon,
  UserMinusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { addSampleProducts } from '../utils/addSampleProducts';
import Link from 'next/link';
import { FiPackage, FiDollarSign, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  referralCode?: string;
  referredBy?: string;
  points: number;
  isAdmin: boolean;
  createdAt: string;
}

type SortField = 'name' | 'email' | 'points' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  description: string;
  imageUrl: string;
}

interface Analytics {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  categories: { [key: string]: number };
}

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAdmin, setFilterAdmin] = useState<boolean | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const usersPerPage = 10;

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    totalReferrals: 0,
  });

  const [message, setMessage] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    categories: {},
  });

  const [addingProducts, setAddingProducts] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    fetchUsers();
    fetchProducts();
  }, [user, router, sortField, sortOrder, filterAdmin, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      let q = query(usersRef, orderBy(sortField, sortOrder));

      if (filterAdmin !== null) {
        q = query(q, where('isAdmin', '==', filterAdmin));
      }

      q = query(q, limit(usersPerPage * currentPage));
      const querySnapshot = await getDocs(q);
      
      const usersData: UserData[] = [];
      let totalPoints = 0;
      let totalReferrals = 0;

      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() } as UserData;
        usersData.push(userData);
        totalPoints += userData.points || 0;
        if (userData.referredBy) totalReferrals++;
      });

      // Apply client-side search filtering
      const filteredUsers = searchQuery
        ? usersData.filter(
            (user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : usersData;

      setUsers(filteredUsers);
      setStats({
        totalUsers: usersData.length,
        totalPoints,
        totalReferrals,
      });
      setHasMore(querySnapshot.docs.length === usersPerPage * currentPage);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(productsData);

      // Calculate analytics
      const analytics = {
        totalProducts: productsData.length,
        totalValue: productsData.reduce((acc, product) => acc + (product.price * product.stock), 0),
        lowStock: productsData.filter(product => product.stock < 10).length,
        categories: productsData.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number }),
      };

      setAnalytics(analytics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: !currentStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? (
      <ArrowUpIcon className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 inline ml-1" />
    );
  };

  const handleAddSampleProducts = async () => {
    try {
      setAddingProducts(true);
      const result = await addSampleProducts();
      if (result.success) {
        alert('Sample products added successfully!');
        // Refresh products
        fetchProducts();
      } else {
        alert('Failed to add sample products. Please try again.');
      }
    } catch (error) {
      console.error('Error adding sample products:', error);
      alert('An error occurred while adding sample products.');
    } finally {
      setAddingProducts(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className="bg-orange-100 p-3 rounded-full">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>
  );

  if (loading && !users.length) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Product Management</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleAddSampleProducts}
              disabled={addingProducts}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {addingProducts ? 'Adding Products...' : 'Add Sample Products'}
            </button>

            {message && (
              <p className={`mt-4 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Points</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{stats.totalPoints}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Referrals</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{stats.totalReferrals}</p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterAdmin === null ? 'all' : filterAdmin.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilterAdmin(value === 'all' ? null : value === 'true');
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Users</option>
                  <option value="true">Admins</option>
                  <option value="false">Regular Users</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    Name <SortIcon field="name" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    Email <SortIcon field="email" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('points')}
                  >
                    Points <SortIcon field="points" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Referral Code
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Joined <SortIcon field="createdAt" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.points}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.referralCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                        className="text-primary hover:text-primary-dark mr-4 flex items-center"
                      >
                        {user.isAdmin ? (
                          <>
                            <UserMinusIcon className="h-5 w-5 mr-1" />
                            <span>Remove Admin</span>
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="h-5 w-5 mr-1" />
                            <span>Make Admin</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <TrashIcon className="h-5 w-5 mr-1" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!hasMore}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/admin/add-product"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Product
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={analytics.totalProducts}
            icon={FiPackage}
          />
          <StatCard
            title="Total Inventory Value"
            value={`$${analytics.totalValue.toLocaleString()}`}
            icon={FiDollarSign}
          />
          <StatCard
            title="Low Stock Items"
            value={analytics.lowStock}
            icon={FiShoppingBag}
          />
          <StatCard
            title="Categories"
            value={Object.keys(analytics.categories).length}
            icon={FiTrendingUp}
          />
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.slice(0, 10).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/edit-product/${product.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
            <div className="space-y-4">
              {Object.entries(analytics.categories).map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{category}</span>
                    <span>{count} products</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{
                        width: `${(count / analytics.totalProducts) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
            <div className="space-y-4">
              {products
                .filter(product => product.stock < 10)
                .map(product => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-red-600 font-medium">
                      {product.stock} left
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 