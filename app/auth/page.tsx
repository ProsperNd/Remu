'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phoneNumber: '',
    referralCode: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    // Simple password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (isSignUp) {
      // Username validation
      if (!formData.username) {
        errors.username = 'Username is required';
        isValid = false;
      }

      // Simple phone validation
      if (!formData.phoneNumber) {
        errors.phoneNumber = 'Phone number is required';
        isValid = false;
      }

      // Confirm password
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(
          formData.email,
          formData.password,
          formData.username,
          formData.phoneNumber,
          formData.referralCode
        );
      } else {
        await signIn(formData.email, formData.password);
      }
      router.push('/');
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {isSignUp ? 'Join our community today!' : 'Please enter your credentials to sign in'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your email address"
            />
            {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your password"
            />
            {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
          </div>

          {isSignUp && (
            <>
              <div className="space-y-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${formErrors.username ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Choose a username"
                />
                {formErrors.username && <p className="text-red-500 text-xs">{formErrors.username}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Confirm your password"
                />
                {formErrors.confirmPassword && <p className="text-red-500 text-xs">{formErrors.confirmPassword}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Your phone number"
                />
                {formErrors.phoneNumber && <p className="text-red-500 text-xs">{formErrors.phoneNumber}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
                <input
                  type="text"
                  id="referralCode"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="Enter referral code if you have one"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                Processing...
              </span>
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormErrors({});
            }}
            className="text-orange-600 hover:text-orange-700 hover:underline transition-colors font-medium"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}