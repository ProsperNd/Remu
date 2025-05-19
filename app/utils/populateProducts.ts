import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Define all categories we'll use
const categories = [
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty',
  'Smart Home',
  'Gaming',
  'Sports',
  'Accessories',
  'Toys',
  'Books'
];

// Sample products organized by category
const sampleProductsByCategory = {
  Electronics: [
    {
      name: 'Wireless Bluetooth Earbuds',
      description: 'True wireless earbuds with noise cancellation, touch controls, and 30-hour battery life with charging case.',
      price: 29.99,
      originalPrice: 59.99,
      discount: 50,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format',
        'https://images.unsplash.com/photo-1606220588771-5d6c5ca79f91?w=500&auto=format'
      ],
      rating: 4.5,
      reviews: 128,
      sold: 1240,
      badge: 'Recommended',
      shipping: 'Free Shipping'
    },
    {
      name: 'Smart Watch Fitness Tracker',
      description: 'Track your heart rate, steps, sleep quality and more with this water-resistant smart watch.',
      price: 39.99,
      originalPrice: 99.99,
      discount: 60,
      stock: 35,
      images: [
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format'
      ],
      rating: 4.7,
      reviews: 245,
      sold: 2890,
      badge: 'Flash Deal',
      shipping: 'Free Shipping'
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Compact wireless speaker with powerful sound, 12-hour battery life, and waterproof design.',
      price: 24.99,
      originalPrice: 34.99,
      discount: 30,
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format',
        'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=500&auto=format'
      ],
      rating: 4.4,
      reviews: 320,
      sold: 1578,
      badge: 'Best Seller',
      shipping: 'Free Shipping'
    },
    {
      name: '4K Ultra HD Smart TV',
      description: '55-inch 4K Ultra HD display with HDR and built-in streaming apps.',
      price: 399.99,
      originalPrice: 599.99,
      discount: 33,
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format',
        'https://images.unsplash.com/photo-1600877314257-44d27cb43b8a?w=500&auto=format'
      ],
      rating: 4.6,
      reviews: 189,
      sold: 876,
      badge: 'Popular',
      shipping: 'Free Shipping'
    },
    {
      name: 'Wireless Charging Pad',
      description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
      price: 19.99,
      originalPrice: 29.99,
      discount: 33,
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1586813967123-2b86d0faa0e8?w=500&auto=format',
      ],
      rating: 4.3,
      reviews: 145,
      sold: 1290,
      badge: 'Hot Deal',
      shipping: 'Free Shipping'
    }
  ],
  Fashion: [
    {
      name: "Women's Casual Summer Dress",
      description: 'Lightweight and comfortable summer dress with floral pattern. Available in multiple colors and sizes.',
      price: 17.99,
      originalPrice: 23.99,
      discount: 25,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format'
      ],
      rating: 4.3,
      reviews: 210,
      sold: 1432,
      badge: 'New Arrival',
      shipping: 'Free Shipping'
    },
    {
      name: "Men's Casual Sneakers",
      description: 'Lightweight and comfortable sneakers for everyday wear. Available in multiple colors and sizes.',
      price: 32.99,
      originalPrice: 45.99,
      discount: 28,
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&auto=format',
        'https://images.unsplash.com/photo-1614268303585-a2d1200c3c95?w=500&auto=format'
      ],
      rating: 4.6,
      reviews: 178,
      sold: 1845,
      badge: 'Top Rated',
      shipping: 'Free Shipping'
    },
    {
      name: "Women's Leather Handbag",
      description: 'Premium quality leather handbag with multiple compartments and adjustable strap.',
      price: 49.99,
      originalPrice: 79.99,
      discount: 38,
      stock: 35,
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format'
      ],
      rating: 4.8,
      reviews: 125,
      sold: 928,
      badge: 'Premium',
      shipping: 'Free Shipping'
    },
    {
      name: "Men's Formal Business Suit",
      description: 'Classic fit two-piece suit for business and formal occasions. Available in navy, black, and gray.',
      price: 129.99,
      originalPrice: 199.99,
      discount: 35,
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1593032465175-481ac7f401f0?w=500&auto=format',
      ],
      rating: 4.7,
      reviews: 89,
      sold: 452,
      badge: 'Quality',
      shipping: 'Free Shipping'
    },
    {
      name: "Women's Running Shoes",
      description: 'Lightweight cushioned running shoes with breathable mesh upper and responsive sole.',
      price: 59.99,
      originalPrice: 89.99,
      discount: 33,
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=500&auto=format',
      ],
      rating: 4.5,
      reviews: 167,
      sold: 1238,
      badge: 'Best Seller',
      shipping: 'Free Shipping'
    }
  ],
  'Home & Kitchen': [
    {
      name: 'Non-Stick Cooking Set',
      description: '10-piece non-stick cookware set including pots, pans, and utensils. Dishwasher safe.',
      price: 49.99,
      originalPrice: 89.99,
      discount: 40,
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1584803901540-964ff809c54b?w=500&auto=format',
        'https://images.unsplash.com/photo-1585837575652-267c04026c2b?w=500&auto=format'
      ],
      rating: 4.6,
      reviews: 178,
      sold: 3245,
      badge: 'Trending',
      shipping: 'Free Shipping'
    },
    {
      name: 'Electric Kettle',
      description: 'Fast-boiling electric kettle with auto shut-off, boil-dry protection, and 1.7L capacity.',
      price: 19.99,
      originalPrice: 24.99,
      discount: 20,
      stock: 60,
      images: [
        'https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=500&auto=format',
        'https://images.unsplash.com/photo-1594213114451-65e18468d31d?w=500&auto=format'
      ],
      rating: 4.5,
      reviews: 145,
      sold: 2178,
      badge: 'Hot Deal',
      shipping: 'Free Shipping'
    },
    {
      name: 'Robot Vacuum Cleaner',
      description: 'Smart robot vacuum with mapping technology, app control, and 120-minute runtime.',
      price: 149.99,
      originalPrice: 249.99,
      discount: 40,
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1582830165505-e22d1a471625?w=500&auto=format',
      ],
      rating: 4.7,
      reviews: 216,
      sold: 1348,
      badge: 'Smart Home',
      shipping: 'Free Shipping'
    },
    {
      name: 'Memory Foam Pillow',
      description: 'Ergonomic memory foam pillow with cooling gel technology and removable cover.',
      price: 24.99,
      originalPrice: 39.99,
      discount: 38,
      stock: 80,
      images: [
        'https://images.unsplash.com/photo-1631196362721-3d08cf6e4002?w=500&auto=format',
      ],
      rating: 4.6,
      reviews: 173,
      sold: 2184,
      badge: 'Comfort',
      shipping: 'Free Shipping'
    },
    {
      name: 'Blender with Glass Jar',
      description: '5-speed blender with 48oz glass jar, pulse function, and ice crushing capabilities.',
      price: 34.99,
      originalPrice: 49.99,
      discount: 30,
      stock: 45,
      images: [
        'https://images.unsplash.com/photo-1619897602459-945b54fcc419?w=500&auto=format',
      ],
      rating: 4.4,
      reviews: 129,
      sold: 1089,
      badge: 'Essential',
      shipping: 'Free Shipping'
    }
  ],
  Beauty: [
    {
      name: 'Luxury Perfume',
      description: 'Elegant fragrance with notes of jasmine, bergamot, and sandalwood. Long-lasting and suitable for all occasions.',
      price: 29.99,
      originalPrice: 49.99,
      discount: 40,
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format',
        'https://images.unsplash.com/photo-1585089858717-f4378c2031d8?w=500&auto=format'
      ],
      rating: 4.7,
      reviews: 189,
      sold: 1245,
      badge: 'Luxury',
      shipping: 'Free Shipping'
    },
    {
      name: 'Skincare Set',
      description: 'Complete skincare set with cleanser, toner, serum, and moisturizer for all skin types.',
      price: 39.99,
      originalPrice: 69.99,
      discount: 43,
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&auto=format',
      ],
      rating: 4.6,
      reviews: 142,
      sold: 978,
      badge: 'Complete Set',
      shipping: 'Free Shipping'
    },
    {
      name: 'Makeup Brush Set',
      description: '12-piece professional makeup brush set with synthetic bristles and carrying case.',
      price: 19.99,
      originalPrice: 29.99,
      discount: 33,
      stock: 55,
      images: [
        'https://images.unsplash.com/photo-1631213971230-315ffe2a53b5?w=500&auto=format',
      ],
      rating: 4.4,
      reviews: 118,
      sold: 1432,
      badge: 'Best Value',
      shipping: 'Free Shipping'
    },
    {
      name: 'Hair Styling Tool',
      description: '3-in-1 hair styling tool for straightening, curling, and volumizing with ceramic plates.',
      price: 44.99,
      originalPrice: 69.99,
      discount: 36,
      stock: 35,
      images: [
        'https://images.unsplash.com/photo-1522338141320-5dd463886622?w=500&auto=format',
      ],
      rating: 4.5,
      reviews: 157,
      sold: 1089,
      badge: 'Versatile',
      shipping: 'Free Shipping'
    },
    {
      name: 'Natural Face Mask Set',
      description: 'Set of 5 sheet masks with natural ingredients targeting different skin concerns.',
      price: 12.99,
      originalPrice: 19.99,
      discount: 35,
      stock: 70,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format',
      ],
      rating: 4.3,
      reviews: 98,
      sold: 2175,
      badge: 'Self Care',
      shipping: 'Free Shipping'
    }
  ]
};

// Function to populate database with products
export async function populateProducts() {
  const productsRef = collection(db, 'products');
  const results = { success: false, count: 0, message: '' };
  
  try {
    console.log('Starting to populate products...');
    let count = 0;
    
    // Add products for each category
    for (const category in sampleProductsByCategory) {
      const productsInCategory = sampleProductsByCategory[category];
      
      for (const product of productsInCategory) {
        await addDoc(productsRef, {
          ...product,
          createdAt: serverTimestamp(),
        });
        count++;
      }
    }
    
    console.log(`Successfully added ${count} products`);
    results.success = true;
    results.count = count;
    results.message = `Successfully added ${count} products to the database`;
    return results;
  } catch (error) {
    console.error('Error populating products:', error);
    results.message = `Failed to populate products: ${error.message}`;
    return results;
  }
}

// Function to add a single specific category of products
export async function addCategoryProducts(categoryName: string) {
  if (!sampleProductsByCategory[categoryName]) {
    return { 
      success: false, 
      count: 0, 
      message: `Category '${categoryName}' not found in sample products` 
    };
  }
  
  const productsRef = collection(db, 'products');
  const results = { success: false, count: 0, message: '' };
  
  try {
    console.log(`Adding products for category: ${categoryName}...`);
    let count = 0;
    
    const productsToAdd = sampleProductsByCategory[categoryName];
    for (const product of productsToAdd) {
      await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp(),
      });
      count++;
    }
    
    console.log(`Successfully added ${count} products in the ${categoryName} category`);
    results.success = true;
    results.count = count;
    results.message = `Successfully added ${count} products in the ${categoryName} category`;
    return results;
  } catch (error) {
    console.error(`Error adding ${categoryName} products:`, error);
    results.message = `Failed to add ${categoryName} products: ${error.message}`;
    return results;
  }
}
