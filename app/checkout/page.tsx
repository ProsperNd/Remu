'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ToastNotification';
import { doc, collection, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CreditCardIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  cryptoAddress: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  
  // Shipping & Payment States
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'crypto'>('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Form State
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: ''
  });
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    cryptoAddress: ''
  });
  
  // Form validation states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Calculate values
  const subtotal = total;
  const shipping = 4.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const orderTotal = subtotal + shipping + tax;
  
  useEffect(() => {
    if (!user) {
      showToast('Please sign in to checkout', 'error');
      router.push('/auth');
    }
    
    if (cart.length === 0 && !orderComplete) {
      showToast('Your cart is empty', 'warning');
      router.push('/products');
    }
  }, [user, cart, router, showToast, orderComplete]);
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate shipping info
    if (!shippingInfo.fullName) errors.fullName = 'Full name is required';
    if (!shippingInfo.address) errors.address = 'Address is required';
    if (!shippingInfo.city) errors.city = 'City is required';
    if (!shippingInfo.state) errors.state = 'State is required';
    if (!shippingInfo.zipCode) errors.zipCode = 'ZIP code is required';
    if (!shippingInfo.phone) errors.phone = 'Phone number is required';
    
    // Validate payment details based on method
    if (paymentMethod === 'credit_card') {
      if (!paymentDetails.cardNumber) errors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) 
        errors.cardNumber = 'Invalid card number';
      
      if (!paymentDetails.cardHolder) errors.cardHolder = 'Card holder name is required';
      if (!paymentDetails.expiryDate) errors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) 
        errors.expiryDate = 'Use format MM/YY';
      
      if (!paymentDetails.cvv) errors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) 
        errors.cvv = 'Invalid CVV';
    } else {
      if (!paymentDetails.cryptoAddress) errors.cryptoAddress = 'Crypto address is required';
      else if (paymentDetails.cryptoAddress.length < 26) 
        errors.cryptoAddress = 'Invalid crypto address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please correct the errors in the form', 'error');
      return;
    }
    
    if (!user) {
      showToast('Please sign in to complete your order', 'error');
      router.push('/auth');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create new order
      const orderData = {
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        shippingInfo,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total: orderTotal,
        status: 'pending',
        createdAt: serverTimestamp()
      };
      
      // Add to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(orderRef.id);
      
      // Update user's order history
      const userOrderRef = doc(db, 'users', user.uid, 'orders', orderRef.id);
      await setDoc(userOrderRef, { 
        orderId: orderRef.id,
        total: orderTotal,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Order complete
      setOrderComplete(true);
      clearCart();
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      console.error('Error processing order:', err);
      setError('There was a problem processing your order. Please try again.');
      showToast('Error processing order', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  if (orderComplete) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4">
            <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase!</p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">Order ID: #{orderId}</p>
          )}
          
          <p className="text-gray-700 mb-6">
            We've sent a confirmation email with the order details and tracking information.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/products" 
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/orders" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/cart" className="flex items-center text-gray-600 hover:text-primary">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          <span>Back to Cart</span>
        </Link>
            </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-primary" />
                Shipping Information
              </h2>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                    <input
                      type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    className={`block w-full p-2 border rounded-md ${
                      formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                  )}
                  </div>
                
                  <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                    <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    className={`block w-full p-2 border rounded-md ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                  </div>
                
                  <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                    <input
                      type="text"
                    id="address"
                    name="address"
                      value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className={`block w-full p-2 border rounded-md ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                  )}
                  </div>
                
                  <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                    <input
                      type="text"
                    id="city"
                    name="city"
                      value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className={`block w-full p-2 border rounded-md ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                  )}
                  </div>
                
                  <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                    <input
                      type="text"
                    id="state"
                    name="state"
                      value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className={`block w-full p-2 border rounded-md ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.state && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                  )}
                  </div>
                
                  <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                    <input
                      type="text"
                    id="zipCode"
                    name="zipCode"
                      value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className={`block w-full p-2 border rounded-md ${
                      formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>
                  )}
                  </div>
                
                  <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                      value={shippingInfo.country}
                    onChange={handleShippingChange}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2 text-primary" />
                Payment Method
              </h2>
              
              <div className="mb-4">
                <div className="flex space-x-4 mb-6">
                  <div 
                    className={`border rounded-lg p-4 flex items-center cursor-pointer flex-1 ${
                      paymentMethod === 'credit_card' 
                        ? 'border-primary bg-primary bg-opacity-5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('credit_card')}
                  >
                    <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                      paymentMethod === 'credit_card' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'credit_card' && (
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <CreditCardIcon className="h-6 w-6 mr-2 text-gray-500" />
                      <span className="font-medium">Credit Card</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 flex items-center cursor-pointer flex-1 ${
                      paymentMethod === 'crypto' 
                        ? 'border-primary bg-primary bg-opacity-5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('crypto')}
                  >
                    <div className={`h-5 w-5 rounded-full border mr-3 flex items-center justify-center ${
                      paymentMethod === 'crypto' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'crypto' && (
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-6 w-6 mr-2 text-gray-500" />
                      <span className="font-medium">Cryptocurrency</span>
                    </div>
                  </div>
                </div>
                
                {/* Credit Card Details */}
                {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                    <input
                      type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                        className={`block w-full p-2 border rounded-md ${
                          formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.cardNumber && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                      )}
                  </div>
                    
                    <div>
                      <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={paymentDetails.cardHolder}
                        onChange={handlePaymentChange}
                        className={`block w-full p-2 border rounded-md ${
                          formErrors.cardHolder ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.cardHolder && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.cardHolder}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentChange}
                          className={`block w-full p-2 border rounded-md ${
                            formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.expiryDate && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentChange}
                          className={`block w-full p-2 border rounded-md ${
                            formErrors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.cvv && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-600">Secure payment processing</span>
                      </div>
                      <div className="flex space-x-2">
                        <Image src="/visa.svg" alt="Visa" width={36} height={24} />
                        <Image src="/mastercard.svg" alt="Mastercard" width={36} height={24} />
                        <Image src="/amex.svg" alt="American Express" width={36} height={24} />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Crypto Payment */}
                {paymentMethod === 'crypto' && (
                    <div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                      <p className="text-sm text-yellow-800">
                        We support Bitcoin, Ethereum, and other major cryptocurrencies. 
                        After placing the order, you'll receive instructions for completing the payment.
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="cryptoAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Crypto Wallet Address (for refunds if needed)
                      </label>
                      <input
                        type="text"
                        id="cryptoAddress"
                        name="cryptoAddress"
                        placeholder="Enter your wallet address"
                        value={paymentDetails.cryptoAddress}
                        onChange={handlePaymentChange}
                        className={`block w-full p-2 border rounded-md ${
                          formErrors.cryptoAddress ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.cryptoAddress && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.cryptoAddress}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                      <Image src="/bitcoin.svg" alt="Bitcoin" width={24} height={24} />
                      <Image src="/ethereum.svg" alt="Ethereum" width={24} height={24} />
                      <span className="text-sm text-gray-600">Cryptocurrency payments are supported</span>
                    </div>
                  </div>
                )}
                  </div>
                </div>
            
            <div className="mt-8 md:hidden">
                <button
                  type="submit"
                disabled={loading}
                className={`w-full p-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                >
                {loading ? 'Processing...' : `Complete Order - $${orderTotal.toFixed(2)}`}
                </button>
            </div>
              </form>
          </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex py-3 border-b">
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
                    {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                        sizes="80px"
                        className="object-cover"
                    />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2 border-t">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 hidden md:block">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full p-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
              <ShieldCheckIcon className="h-4 w-4 mr-1 text-green-500" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
