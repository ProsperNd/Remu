// Firebase setup
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products with realistic Unsplash image URLs
const sampleProducts = [
  // Electronics
  {
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
    createdAt: serverTimestamp()
  },
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: '4K Ultra HD Smart TV',
    description: '55-inch 4K Ultra HD Smart TV with HDR support and built-in streaming apps.',
    price: 699.99,
    category: 'Electronics',
    stock: 20,
    rating: 4.6,
    reviews: 178,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof Bluetooth speaker with 360° sound and 12-hour playtime.',
    price: 89.99,
    category: 'Electronics',
    stock: 45,
    rating: 4.5,
    reviews: 320,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format',
      'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Pro Gaming Headset',
    description: 'Immersive surround sound gaming headset with noise-cancelling microphone.',
    price: 129.99,
    category: 'Electronics',
    stock: 30,
    rating: 4.6,
    reviews: 245,
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&auto=format',
      'https://images.unsplash.com/photo-1615655096345-41850c2a3017?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Digital Camera Kit',
    description: 'Professional DSLR camera with 24MP sensor and multiple lenses.',
    price: 899.99,
    category: 'Electronics',
    stock: 15,
    rating: 4.9,
    reviews: 187,
    images: [
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=500&auto=format',
      'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },

  // Fashion
  {
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
    createdAt: serverTimestamp()
  },
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: 'Designer Sunglasses',
    description: 'Stylish sunglasses with UV protection and premium build quality.',
    price: 129.99,
    category: 'Fashion',
    stock: 40,
    rating: 4.7,
    reviews: 183,
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&auto=format',
      'https://images.unsplash.com/photo-1625591340248-6d866125e6b5?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Canvas Sneakers',
    description: 'Comfortable canvas sneakers perfect for casual everyday wear.',
    price: 59.99,
    category: 'Fashion',
    stock: 75,
    rating: 4.5,
    reviews: 341,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&auto=format',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Summer Dress Collection',
    description: 'Elegant summer dress with floral patterns, lightweight and comfortable.',
    price: 89.99,
    category: 'Fashion',
    stock: 40,
    rating: 4.7,
    reviews: 219,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Formal Suit Set',
    description: 'Premium tailored suit with modern fit and luxurious fabric.',
    price: 299.99,
    category: 'Fashion',
    stock: 25,
    rating: 4.8,
    reviews: 142,
    images: [
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=500&auto=format',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },

  // Home & Kitchen
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: 'Smart Coffee Maker',
    description: 'Programmable coffee maker with smart features and built-in grinder.',
    price: 119.99,
    category: 'Home & Kitchen',
    stock: 25,
    rating: 4.6,
    reviews: 198,
    images: [
      'https://images.unsplash.com/photo-1521302200778-33500795e128?w=500&auto=format',
      'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: 'Modern Desk Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures.',
    price: 49.99,
    category: 'Home & Kitchen',
    stock: 55,
    rating: 4.5,
    reviews: 167,
    images: [
      'https://images.unsplash.com/photo-1534105615256-13940a56ff9e?w=500&auto=format',
      'https://images.unsplash.com/photo-1617117694467-24226933e7f1?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Luxury Bedding Set',
    description: 'Premium cotton bedding set with duvet cover and 4 pillowcases.',
    price: 149.99,
    category: 'Home & Kitchen',
    stock: 35,
    rating: 4.8,
    reviews: 193,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Smart Home Hub',
    description: 'Central control for all your smart home devices with voice control.',
    price: 179.99,
    category: 'Home & Kitchen',
    stock: 30,
    rating: 4.7,
    reviews: 238,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055e2e89a68?w=500&auto=format',
      'https://images.unsplash.com/photo-1589401655014-e43beae0c874?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },

  // Beauty
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: 'Professional Hair Dryer',
    description: 'Salon-quality hair dryer with ionic technology for fast, frizz-free results.',
    price: 69.99,
    category: 'Beauty',
    stock: 40,
    rating: 4.6,
    reviews: 215,
    images: [
      'https://images.unsplash.com/photo-1522338140505-bfe8a8dc3389?w=500&auto=format',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: 'Makeup Brush Set',
    description: 'Professional 15-piece makeup brush set with synthetic bristles.',
    price: 39.99,
    category: 'Beauty',
    stock: 50,
    rating: 4.5,
    reviews: 268,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format',
      'https://images.unsplash.com/photo-1631214504364-378d622769c4?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Organic Bath Set',
    description: 'Luxurious bath bombs, salts, and oils made with natural ingredients.',
    price: 59.99,
    category: 'Beauty',
    stock: 45,
    rating: 4.7,
    reviews: 213,
    images: [
      'https://images.unsplash.com/photo-1570194065650-d99fb4d8a670?w=500&auto=format',
      'https://images.unsplash.com/photo-1596178060810-72660ee8d2ad?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Electric Facial Cleanser',
    description: 'Deep cleansing facial brush with multiple speed settings.',
    price: 79.99,
    category: 'Beauty',
    stock: 30,
    rating: 4.6,
    reviews: 198,
    images: [
      'https://images.unsplash.com/photo-1626791436956-0505032b9f9a?w=500&auto=format',
      'https://images.unsplash.com/photo-1614159102522-45e0670521ef?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },

  // Sports
  {
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
    createdAt: serverTimestamp()
  },
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: 'Insulated Water Bottle',
    description: '32oz vacuum insulated water bottle that keeps drinks cold for 24 hours.',
    price: 29.99,
    category: 'Sports',
    stock: 80,
    rating: 4.8,
    reviews: 412,
    images: [
      'https://images.unsplash.com/photo-1570087058536-b45d7ea3edd5?w=500&auto=format',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh.',
    price: 99.99,
    category: 'Sports',
    stock: 35,
    rating: 4.6,
    reviews: 283,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Home Gym Equipment Set',
    description: 'Complete home gym set with adjustable weights and resistance bands.',
    price: 249.99,
    category: 'Sports',
    stock: 20,
    rating: 4.8,
    reviews: 176,
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format',
      'https://images.unsplash.com/photo-1590239926044-4133f3e29b0b?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },
  {
    name: 'Tennis Racket Pro',
    description: 'Professional tennis racket with carbon fiber frame and ergonomic grip.',
    price: 159.99,
    category: 'Sports',
    stock: 25,
    rating: 4.7,
    reviews: 154,
    images: [
      'https://images.unsplash.com/photo-1595435742656-5272ce5d9d3d?w=500&auto=format',
      'https://images.unsplash.com/photo-1617645576427-463dcd9be3f0?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  },

  // Kids
  {
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
    createdAt: serverTimestamp()
  },
  {
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
    createdAt: serverTimestamp()
  },
  {
    name: 'Children\'s Bike',
    description: 'Durable children\'s bicycle with training wheels and safety features.',
    price: 129.99,
    category: 'Kids',
    stock: 30,
    rating: 4.7,
    reviews: 185,
    images: [
      'https://images.unsplash.com/photo-1570991903297-75b513586ccd?w=500&auto=format',
      'https://images.unsplash.com/photo-1532330393533-443990f44e05?w=500&auto=format'
    ],
    createdAt: serverTimestamp()
  }
];

// Function to add sample products to Firestore
async function addSampleProducts() {
  console.log('Starting to add sample products to Firebase...');
  let successCount = 0;
  let errorCount = 0;

  for (const product of sampleProducts) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        imageUrl: product.images[0], // For backward compatibility with existing components
        id: Date.now().toString() + Math.floor(Math.random() * 1000) // Generate unique ID
      });
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
      successCount++;
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
      errorCount++;
    }
  }

  console.log(`Completed adding products. Success: ${successCount}, Errors: ${errorCount}`);
}

// Run the seed function
addSampleProducts().then(() => {
  console.log('Seeding complete!');
  process.exit(0);
}).catch(error => {
  console.error('Error during seeding:', error);
  process.exit(1);
}); 