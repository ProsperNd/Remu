import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const sampleProducts = [
  // Electronics Category
  {
    name: 'Wireless Bluetooth Earbuds',
    description: 'True wireless earbuds with noise cancellation, touch controls, and 30-hour battery life with charging case. Perfect for workouts and everyday use.',
    price: 29.99,
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: 128,
    discount: 50, // percentage discount from original price
    originalPrice: 59.99,
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format',
      'https://images.unsplash.com/photo-1606220588771-5d6c5ca79f91?w=500&auto=format'
    ],
    badge: 'Recommended',
    shipping: 'Free Shipping',
    sold: 1240,
  },
  {
    name: 'Smart Watch Fitness Tracker',
    description: 'Track your heart rate, steps, sleep quality and more with this water-resistant smart watch. Compatible with iOS and Android devices.',
    price: 39.99,
    category: 'Electronics',
    stock: 35,
    rating: 4.7,
    reviews: 245,
    discount: 60,
    originalPrice: 99.99,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format'
    ],
    badge: 'Flash Deal',
    shipping: 'Free Shipping',
    sold: 2890,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact wireless speaker with powerful sound, 12-hour battery life, and waterproof design. Perfect for outdoor activities.',
    price: 24.99,
    category: 'Electronics',
    stock: 45,
    rating: 4.4,
    reviews: 320,
    discount: 30,
    originalPrice: 34.99,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format',
      'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=500&auto=format'
    ],
    badge: 'Best Seller',
    shipping: 'Free Shipping',
    sold: 1578,
  },

  // Home & Kitchen
  {
    name: 'Non-Stick Cooking Set',
    description: '10-piece non-stick cookware set including pots, pans, and utensils. Dishwasher safe and suitable for all stovetops.',
    price: 49.99,
    category: 'Home & Kitchen',
    stock: 30,
    rating: 4.6,
    reviews: 178,
    discount: 40,
    originalPrice: 89.99,
    images: [
      'https://images.unsplash.com/photo-1584803901540-964ff809c54b?w=500&auto=format',
      'https://images.unsplash.com/photo-1585837575652-267c04026c2b?w=500&auto=format'
    ],
    badge: 'Trending',
    shipping: 'Free Shipping',
    sold: 3245,
  },
  {
    name: 'Electric Kettle',
    description: 'Fast-boiling electric kettle with auto shut-off, boil-dry protection, and 1.7L capacity. Perfect for tea, coffee, and instant meals.',
    price: 19.99,
    category: 'Home & Kitchen',
    stock: 60,
    rating: 4.5,
    reviews: 145,
    discount: 20,
    originalPrice: 24.99,
    images: [
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=500&auto=format',
      'https://images.unsplash.com/photo-1594213114451-65e18468d31d?w=500&auto=format'
    ],
    badge: 'Hot Deal',
    shipping: 'Free Shipping',
    sold: 2178,
  },

  // Fashion
  {
    name: 'Women\'s Casual Summer Dress',
    description: 'Lightweight and comfortable summer dress with floral pattern. Available in multiple colors and sizes.',
    price: 17.99,
    category: 'Fashion',
    stock: 50,
    rating: 4.3,
    reviews: 210,
    discount: 25,
    originalPrice: 23.99,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format'
    ],
    badge: 'New Arrival',
    shipping: 'Free Shipping',
    sold: 1432,
  },
  {
    name: 'Men\'s Casual Sneakers',
    description: 'Lightweight and comfortable sneakers for everyday wear. Available in multiple colors and sizes.',
    price: 32.99,
    category: 'Fashion',
    stock: 45,
    rating: 4.6,
    reviews: 178,
    discount: 30,
    originalPrice: 49.99,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=500&auto=format'
    ],
    badge: 'Limited Stock',
    shipping: 'Free Shipping',
    sold: 958,
  },

  // Beauty
  {
    name: 'Skincare Gift Set',
    description: 'Complete skincare set including cleanser, toner, moisturizer, and facial masks. Perfect for all skin types.',
    price: 22.99,
    category: 'Beauty',
    stock: 40,
    rating: 4.8,
    reviews: 156,
    discount: 35,
    originalPrice: 34.99,
    images: [
      'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=500&auto=format',
      'https://images.unsplash.com/photo-1614268303585-a2d1200c3c95?w=500&auto=format'
    ],
    badge: 'Top Rated',
    shipping: 'Free Shipping',
    sold: 1845,
  },
  {
    name: 'Luxury Perfume',
    description: 'Elegant fragrance with notes of jasmine, bergamot, and sandalwood. Long-lasting and suitable for all occasions.',
    price: 29.99,
    category: 'Beauty',
    stock: 30,
    rating: 4.7,
    reviews: 189,
    discount: 40,
    originalPrice: 49.99,
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&auto=format',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format'
    ],
    badge: 'Luxury Item',
    shipping: 'Free Shipping',
    sold: 657,
  },

  // Smart Home
  {
    name: 'Smart LED Light Bulbs (Pack of 4)',
    description: 'Wi-Fi enabled multicolor smart bulbs compatible with Alexa and Google Home. Control with your voice or smartphone app.',
    price: 34.99,
    category: 'Smart Home',
    stock: 50,
    rating: 4.5,
    reviews: 234,
    discount: 30,
    originalPrice: 49.99,
    images: [
      'https://images.unsplash.com/photo-1561212024-cb9ad0c33195?w=500&auto=format',
      'https://images.unsplash.com/photo-1565865348119-762a8266f123?w=500&auto=format'
    ],
    badge: 'Energy Saving',
    shipping: 'Free Shipping',
    sold: 1245,
  },
  {
    name: 'Smart Door Lock',
    description: 'Keyless entry with fingerprint, PIN code, and smartphone app control. Easy installation and compatible with most standard doors.',
    price: 79.99,
    category: 'Smart Home',
    stock: 25,
    rating: 4.6,
    reviews: 108,
    discount: 25,
    originalPrice: 109.99,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format',
      'https://images.unsplash.com/photo-1586099079958-9f2da15d5867?w=500&auto=format'
    ],
    badge: 'High Security',
    shipping: 'Free Shipping',
    sold: 853,
  },

  // Gaming
  {
    name: 'Gaming Headset',
    description: 'Immersive gaming headset with 7.1 surround sound, noise-cancelling microphone, and RGB lighting. Compatible with PC, PlayStation, and Xbox.',
    price: 45.99,
    category: 'Gaming',
    stock: 40,
    rating: 4.5,
    reviews: 321,
    discount: 35,
    originalPrice: 69.99,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format'
    ],
    badge: 'Gamer Choice',
    shipping: 'Free Shipping',
    sold: 1789,
  },
  {
    name: 'RGB Gaming Mouse',
    description: 'Ergonomic gaming mouse with adjustable DPI, programmable buttons, and customizable RGB lighting. Perfect for FPS, MOBA, and MMO games.',
    price: 19.99,
    category: 'Gaming',
    stock: 55,
    rating: 4.4,
    reviews: 187,
    discount: 20,
    originalPrice: 24.99,
    images: [
      'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500&auto=format',
      'https://images.unsplash.com/photo-1596468138838-6706d2a53748?w=500&auto=format'
    ],
    badge: 'Best Value',
    shipping: 'Free Shipping',
    sold: 2345,
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat',
    description: 'Extra thick, non-slip yoga mat with carrying strap. Perfect for yoga, pilates, and other floor exercises.',
    price: 18.99,
    category: 'Sports',
    stock: 60,
    rating: 4.7,
    reviews: 251,
    discount: 40,
    originalPrice: 29.99,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format'
    ],
    badge: 'Eco-Friendly',
    shipping: 'Free Shipping',
    sold: 3210,
  },
  {
    name: 'Insulated Water Bottle',
    description: '24oz double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 15.99,
    category: 'Sports',
    stock: 80,
    rating: 4.8,
    reviews: 412,
    discount: 15,
    originalPrice: 19.99,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format',
      'https://images.unsplash.com/photo-1570087058536-b45d7ea3edd5?w=500&auto=format'
    ],
    badge: 'Best Seller',
    shipping: 'Free Shipping',
    sold: 5732,
  },

  // Accessories
  {
    name: 'Premium Leather Wallet',
    description: 'Genuine leather wallet with RFID blocking technology. Multiple card slots and spacious bill compartment.',
    price: 21.99,
    category: 'Accessories',
    stock: 45,
    rating: 4.6,
    reviews: 189,
    discount: 25,
    originalPrice: 29.99,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format'
    ],
    badge: 'Hand Crafted',
    shipping: 'Free Shipping',
    sold: 1437,
  },
  {
    name: 'Stylish Sunglasses',
    description: 'UV400 protection sunglasses with polarized lenses. Lightweight and comfortable for all-day wear.',
    price: 12.99,
    category: 'Accessories',
    stock: 70,
    rating: 4.3,
    reviews: 276,
    discount: 50,
    originalPrice: 24.99,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format'
    ],
    badge: 'Summer Essential',
    shipping: 'Free Shipping',
    sold: 2853,
  },
];

/**
 * Adds sample products to the Firestore database
 * with real images and Temu-like product data
 */
export async function addSampleProducts() {
  const productsRef = collection(db, 'products');
  
  try {
    console.log('Starting to add sample products...');
    let count = 0;
    
    for (const product of sampleProducts) {
      await addDoc(productsRef, {
        ...product,
        imageUrl: product.images[0], // For backward compatibility
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        createdAt: serverTimestamp(),
        rating: product.rating || 4.5,
        reviews: product.reviews || 100,
      });
      count++;
    }
    
    console.log(`Successfully added ${count} sample products`);
    return { success: true, message: `Successfully added ${count} sample products` };
  } catch (error) {
    console.error('Error adding sample products:', error);
    return { success: false, message: 'Failed to add sample products: ' + error.message };
  }
}