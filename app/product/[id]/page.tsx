'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon, HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastNotification';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  imageUrl: string;
  rating: number;
  reviews: number;
  features?: string[];
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  const { showToast } = useToast();
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRef = doc(db, 'products', params.id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const productData = { 
            id: productSnap.id, 
            ...productSnap.data() 
          } as Product;
          
          setProduct(productData);
          setMainImage(productData.images?.[0] || productData.imageUrl || '/placeholder.png');
          
          // Check if product is in wishlist
          if (isInWishlist(productSnap.id)) {
            setInWishlist(true);
          }
        } else {
          showToast('Product not found', 'error');
          console.error('No product found with ID:', params.id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        showToast('Error loading product', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, showToast, isInWishlist]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0] || product.imageUrl || '/placeholder.png'
      });
      
      showToast(`${product.name} added to cart`, 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
        showToast(`${product.name} removed from wishlist`, 'info');
      } else {
        await addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.images?.[0] || product.imageUrl || '/placeholder.png'
        });
        setInWishlist(true);
        showToast(`${product.name} added to wishlist`, 'success');
      }
  } catch (error) {
      console.error('Error updating wishlist:', error);
      showToast('Failed to update wishlist', 'error');
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-4">The product you are looking for does not exist or has been removed.</p>
        <Link 
          href="/products" 
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="relative h-80 sm:h-96 w-full mb-4 bg-white rounded-lg overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`relative h-20 cursor-pointer rounded-md overflow-hidden ${
                    mainImage === image ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setMainImage(image)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? (
                    '★'
                  ) : (
                    '☆'
                  )}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          
          <div className="text-2xl font-bold text-primary mb-4">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <div className="font-medium mb-2">Category:</div>
            <Link 
              href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-primary hover:underline"
            >
              {product.category}
            </Link>
          </div>
          
          <div className="mb-6">
            <div className="font-medium mb-2">Quantity:</div>
            <div className="flex items-center">
              <button 
                onClick={decrementQuantity} 
                className="border border-gray-300 rounded-l-md px-3 py-1 hover:bg-gray-100"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
              />
              <button 
                onClick={incrementQuantity} 
                className="border border-gray-300 rounded-r-md px-3 py-1 hover:bg-gray-100"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {inWishlist ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {product.features && product.features.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-3">Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-700">{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 