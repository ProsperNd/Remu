export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
}

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format',
      'https://images.unsplash.com/photo-1606220588771-5d6c5ca79f91?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring features',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 30,
    rating: 4.7,
    reviews: 245
  },
  {
    id: '3',
    name: 'Premium Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection',
    price: 39.99,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format'
    ],
    category: 'Accessories',
    stock: 100,
    rating: 4.3,
    reviews: 89
  },
  {
    id: '4',
    name: 'Yoga Mat Premium',
    description: 'Eco-friendly non-slip yoga mat with carrying strap',
    price: 29.99,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format'
    ],
    category: 'Sports',
    stock: 75,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    description: 'Vacuum insulated bottle keeps drinks cold for 24 hours',
    price: 24.99,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format'
    ],
    category: 'Kitchen',
    stock: 120,
    rating: 4.4,
    reviews: 198
  },
  {
    id: '6',
    name: 'Portable Power Bank',
    description: '20000mAh high-capacity power bank with fast charging',
    price: 45.99,
    images: [
      'https://images.unsplash.com/photo-1609592424825-fe0e64de0fe8?w=500&auto=format',
      'https://images.unsplash.com/photo-1609592424825-fe0e64de0fe8?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 60,
    rating: 4.8,
    reviews: 312
  },
  {
    id: '7',
    name: 'Wireless Gaming Mouse',
    description: 'RGB gaming mouse with programmable buttons',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500&auto=format',
      'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500&auto=format'
    ],
    category: 'Gaming',
    stock: 45,
    rating: 4.6,
    reviews: 167
  },
  {
    id: '8',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format'
    ],
    category: 'Gaming',
    stock: 35,
    rating: 4.7,
    reviews: 223
  },
  {
    id: '9',
    name: 'Fitness Tracker Band',
    description: 'Waterproof fitness tracker with heart rate monitor',
    price: 34.99,
    images: [
      'https://images.unsplash.com/photo-1557935728-e6d1684e0444?w=500&auto=format',
      'https://images.unsplash.com/photo-1557935728-e6d1684e0444?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 85,
    rating: 4.4,
    reviews: 178
  },
  {
    id: '10',
    name: 'Wireless Charging Pad',
    description: '15W fast wireless charger for smartphones',
    price: 29.99,
    images: [
      'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&auto=format',
      'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 70,
    rating: 4.3,
    reviews: 145
  },
  {
    id: '11',
    name: 'Laptop Backpack',
    description: 'Water-resistant backpack with USB charging port',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format'
    ],
    category: 'Accessories',
    stock: 55,
    rating: 4.5,
    reviews: 189
  },
  {
    id: '12',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof bluetooth speaker',
    price: 39.99,
    images: [
      'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&auto=format',
      'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 65,
    rating: 4.6,
    reviews: 234
  },
  {
    id: '13',
    name: 'Smart LED Light Bulb',
    description: 'WiFi-enabled color changing smart bulb',
    price: 19.99,
    images: [
      'https://images.unsplash.com/photo-1550985543-f1ea83691cd8?w=500&auto=format',
      'https://images.unsplash.com/photo-1550985543-f1ea83691cd8?w=500&auto=format'
    ],
    category: 'Smart Home',
    stock: 100,
    rating: 4.4,
    reviews: 156
  },
  {
    id: '14',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1517914309068-900c5bca33b6?w=500&auto=format',
      'https://images.unsplash.com/photo-1517914309068-900c5bca33b6?w=500&auto=format'
    ],
    category: 'Kitchen',
    stock: 40,
    rating: 4.7,
    reviews: 289
  },
  {
    id: '15',
    name: 'Air Purifier',
    description: 'HEPA air purifier with air quality monitor',
    price: 149.99,
    images: [
      'https://images.unsplash.com/photo-1634542984003-e0fb8e200e91?w=500&auto=format',
      'https://images.unsplash.com/photo-1634542984003-e0fb8e200e91?w=500&auto=format'
    ],
    category: 'Home',
    stock: 25,
    rating: 4.8,
    reviews: 167
  },
  {
    id: '16',
    name: 'Digital Camera',
    description: '24MP digital camera with 4K video',
    price: 599.99,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 15,
    rating: 4.9,
    reviews: 198
  },
  {
    id: '17',
    name: 'Wireless Keyboard',
    description: 'Slim wireless keyboard with numeric keypad',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    reviews: 145
  },
  {
    id: '18',
    name: 'Smart Door Lock',
    description: 'WiFi-enabled smart door lock with fingerprint',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format',
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format'
    ],
    category: 'Smart Home',
    stock: 20,
    rating: 4.7,
    reviews: 134
  },
  {
    id: '19',
    name: 'Robot Vacuum',
    description: 'Smart robot vacuum with mapping technology',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&auto=format'
    ],
    category: 'Smart Home',
    stock: 30,
    rating: 4.6,
    reviews: 223
  },
  {
    id: '20',
    name: 'Gaming Headset',
    description: '7.1 surround sound gaming headset',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format'
    ],
    category: 'Gaming',
    stock: 45,
    rating: 4.5,
    reviews: 178
  },
  {
    id: '21',
    name: 'Wireless Router',
    description: 'Dual-band WiFi 6 router with mesh capability',
    price: 159.99,
    images: [
      'https://images.unsplash.com/photo-1648412814393-c5fce2902351?w=500&auto=format',
      'https://images.unsplash.com/photo-1648412814393-c5fce2902351?w=500&auto=format'
    ],
    category: 'Networking',
    stock: 35,
    rating: 4.7,
    reviews: 156
  },
  {
    id: '22',
    name: 'Electric Kettle',
    description: 'Temperature control electric kettle',
    price: 44.99,
    images: [
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=500&auto=format',
      'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=500&auto=format'
    ],
    category: 'Kitchen',
    stock: 60,
    rating: 4.4,
    reviews: 145
  },
  {
    id: '23',
    name: 'Security Camera',
    description: 'WiFi security camera with night vision',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500&auto=format',
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500&auto=format'
    ],
    category: 'Smart Home',
    stock: 40,
    rating: 4.6,
    reviews: 189
  },
  {
    id: '24',
    name: 'Desk Lamp',
    description: 'LED desk lamp with wireless charging',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format'
    ],
    category: 'Home',
    stock: 75,
    rating: 4.3,
    reviews: 134
  },
  {
    id: '25',
    name: 'Portable Monitor',
    description: '15.6" USB-C portable monitor',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format'
    ],
    category: 'Electronics',
    stock: 25,
    rating: 4.8,
    reviews: 167
  },
  {
    id: '26',
    name: 'Smart Scale',
    description: 'WiFi smart scale with body composition',
    price: 69.99,
    images: [
      'https://images.unsplash.com/photo-1576515652031-fc429bbc4d31?w=500&auto=format',
      'https://images.unsplash.com/photo-1576515652031-fc429bbc4d31?w=500&auto=format'
    ],
    category: 'Smart Home',
    stock: 50,
    rating: 4.5,
    reviews: 198
  }
]; 