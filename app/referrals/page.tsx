'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import Header from '../components/Header';

// Mock referral data - this would come from your backend
const mockReferrals = [
  {
    id: 1,
    name: 'John Doe',
    date: '2024-03-20',
    status: 'completed',
    points: 100,
  },
  {
    id: 2,
    name: 'Jane Smith',
    date: '2024-03-19',
    status: 'pending',
    points: 0,
  },
];

export default function ReferralDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  if (!user) {
    router.push('/auth');
    return null;
  }

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Points</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{user.points}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Successful Referrals</h3>
            <p className="mt-2 text-3xl font-bold text-primary">
              {mockReferrals.filter(r => r.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Pending Referrals</h3>
            <p className="mt-2 text-3xl font-bold text-primary">
              {mockReferrals.filter(r => r.status === 'pending').length}
            </p>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Share Your Referral Link</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                readOnly
                value={`https://remu.com/ref/${user.referralCode}`}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(`https://remu.com/ref/${user.referralCode}`)}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Copy Link
            </button>
          </div>
          <div className="mt-4 flex space-x-4">
            <button className="flex-1 py-2 bg-[#1DA1F2] text-white rounded-md hover:bg-[#1A8CD8]">
              Share on Twitter
            </button>
            <button className="flex-1 py-2 bg-[#4267B2] text-white rounded-md hover:bg-[#365899]">
              Share on Facebook
            </button>
            <button className="flex-1 py-2 bg-[#25D366] text-white rounded-md hover:bg-[#128C7E]">
              Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold">Referral History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockReferrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {referral.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(referral.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          referral.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referral.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 