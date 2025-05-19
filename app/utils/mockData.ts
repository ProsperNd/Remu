// Mock data for development use when Firebase is unavailable
import { Product } from './sampleProducts';

export const mockProducts: Product[] = [
  {
    id: 'mock1',
    name: 'Wireless Earbuds Pro',
    description: 'High-quality wireless earbuds with active noise cancellation and 24-hour battery life.',
    price: 129.99,
    category: 'Electronics',
    stock: 50,
    rating: 4.7,
    reviews: 285,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format',
      'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format'
  },
  {
    id: 'mock2',
    name: 'Smart Watch Ultra',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    price: 249.99,
    category: 'Electronics',
    stock: 35,
    rating: 4.8,
    reviews: 412,
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format'
  },
  {
    id: 'mock3',
    name: 'Premium Leather Jacket',
    description: 'Genuine leather jacket with a modern design, perfect for casual and formal occasions.',
    price: 199.99,
    category: 'Fashion',
    stock: 15,
    rating: 4.9,
    reviews: 87,
    images: [
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500&auto=format',
      'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=500&auto=format'
  },
  {
    id: 'mock4',
    name: 'Professional Chef Knife Set',
    description: 'High-quality stainless steel knife set for professional and home cooking.',
    price: 149.99,
    category: 'Home & Kitchen',
    stock: 30,
    rating: 4.8,
    reviews: 216,
    images: [
      'https://images.unsplash.com/photo-1593618998160-944f9ea19d93?w=500&auto=format',
      'https://images.unsplash.com/photo-1566454419290-57a0589c9d13?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-944f9ea19d93?w=500&auto=format'
  },
  {
    id: 'mock5',
    name: 'Premium Skincare Set',
    description: 'Complete skincare routine with cleansers, serums, and moisturizers.',
    price: 89.99,
    category: 'Beauty',
    stock: 35,
    rating: 4.8,
    reviews: 302,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format'
  },
  {
    id: 'mock6',
    name: 'Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS.',
    price: 79.99,
    category: 'Sports',
    stock: 45,
    rating: 4.6,
    reviews: 327,
    images: [
      'https://images.unsplash.com/photo-1557935728-e6d1684e0444?w=500&auto=format',
      'https://images.unsplash.com/photo-1554116154-e733de92fe4b?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1557935728-e6d1684e0444?w=500&auto=format'
  },
  {
    id: 'mock7',
    name: 'Interactive Learning Tablet',
    description: 'Kid-friendly tablet with educational games and parental controls.',
    price: 89.99,
    category: 'Kids',
    stock: 40,
    rating: 4.6,
    reviews: 218,
    images: [
      'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&auto=format',
      'https://images.unsplash.com/photo-1600250395178-40fe752e5189?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&auto=format'
  },
  {
    id: 'mock8',
    name: 'Classic Denim Jeans',
    description: 'Premium quality denim jeans with a perfect fit and classic style.',
    price: 79.99,
    category: 'Fashion',
    stock: 60,
    rating: 4.6,
    reviews: 253,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format'
  },
  {
    id: 'mock9',
    name: 'Non-Stick Cookware Set',
    description: '10-piece non-stick cookware set with tempered glass lids.',
    price: 189.99,
    category: 'Home & Kitchen',
    stock: 20,
    rating: 4.7,
    reviews: 274,
    images: [
      'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=500&auto=format',
      'https://images.unsplash.com/photo-1612200138850-87ca1fe8a055?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=500&auto=format'
  },
  {
    id: 'mock10',
    name: 'Luxury Perfume',
    description: 'Elegant fragrance with notes of jasmine, bergamot, and sandalwood.',
    price: 119.99,
    category: 'Beauty',
    stock: 30,
    rating: 4.7,
    reviews: 189,
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&auto=format',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&auto=format'
  },
  {
    id: 'mock11',
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with alignment lines and carrying strap.',
    price: 35.99,
    category: 'Sports',
    stock: 60,
    rating: 4.7,
    reviews: 251,
    images: [
      'https://images.unsplash.com/photo-1599447292180-45fd84092ef0?w=500&auto=format',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef0?w=500&auto=format'
  },
  {
    id: 'mock12',
    name: 'Building Block Set',
    description: '1000-piece creative building blocks compatible with major brands.',
    price: 49.99,
    category: 'Kids',
    stock: 50,
    rating: 4.8,
    reviews: 327,
    images: [
      'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=500&auto=format',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&auto=format'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=500&auto=format'
  }
];

// Different category mockups
export const mockCategories = [
  { id: 'cat1', name: 'Electronics', count: 42, icon: '📱' },
  { id: 'cat2', name: 'Fashion', count: 56, icon: '👔' },
  { id: 'cat3', name: 'Home & Kitchen', count: 38, icon: '🏠' },
  { id: 'cat4', name: 'Beauty', count: 29, icon: '💄' },
  { id: 'cat5', name: 'Sports', count: 33, icon: '🏅' },
  { id: 'cat6', name: 'Kids', count: 24, icon: '🧸' }
];

// Mock user data
export const mockUser = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  isAdmin: true,
  points: 150
}; 