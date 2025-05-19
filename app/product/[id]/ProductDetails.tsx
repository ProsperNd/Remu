'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, limit, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ProductRating from '../../components/ProductRating';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  images: string[];
  imageUrl: string;
  category: string;
  rating: number;
  ratingCount: number;
  reviews: number;
  sold?: number;
  stock: number;
  shipping?: string;
  badge?: string;
}

export default function ProductDetails({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, 'products', id));
        
        if (!productDoc.exists()) {
          router.push('/not-found');
          return;
        }

        const productData = { id: productDoc.id, ...productDoc.data() } as Product;
        setProduct(productData);

        // Fetch related products from the same category
        const relatedQuery = query(
          collection(db, 'products'),
          where('category', '==', productData.category),
          where('__name__', '!=', id),
          limit(4)
        );

        const relatedSnapshot = await getDocs(relatedQuery);
        const relatedData = relatedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setRelatedProducts(relatedData);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      // Get existing cart from localStorage or initialize empty array
      const existingCart = localStorage.getItem('cart');
      const cart = existingCart ? JSON.parse(existingCart) : [];
      
      // Check if product already in cart
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || product.imageUrl,
          quantity: quantity
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Update sold count in database
      const productRef = doc(db, 'products', product.id);
      updateDoc(productRef, {
        sold: (product.sold || 0) + quantity
      });
      
      alert('Product added to cart!');
      
      // Force reload to update cart count in header
      window.location.reload();
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (product && value > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(value);
    }
  };

  const handleRatingChange = (newRating: number) => {
    if (product) {
      setProduct({
        ...product,
        rating: newRating
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-80 md:h-96 w-full rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={product.images?.[currentImage] || product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    -{product.discount}%
                  </div>
                )}
                {product.badge && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {product.badge}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative w-20 h-20 rounded border-2 ${currentImage === index ? 'border-orange-500' : 'border-gray-200'}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <ProductRating 
                    productId={product.id} 
                    initialRating={product.rating || 2.5}
                    ratingCount={product.ratingCount || 0}
                    onRatingChange={handleRatingChange}
                  />
                </div>
                
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold text-orange-600 mr-2">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 text-lg line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {product.shipping && (
                  <div className="flex items-center text-green-600 text-sm mb-4">
                    <span>{product.shipping}</span>
                  </div>
                )}
                
                <div className="mb-6">
                  <h2 className="text-sm font-medium text-gray-900 mb-1">Description</h2>
                  <p className="text-gray-700">{product.description}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Category: <span className="font-medium">{product.category}</span></p>
                  {product.sold && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{product.sold}</span> sold
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{product.stock}</span> in stock
                  </p>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center mb-4">
                  <label htmlFor="quantity" className="mr-3 text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button 
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.stock}
                      className="w-12 text-center border-0 focus:ring-0"
                    />
                    <button 
                      onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md flex items-center justify-center transition-colors"
                    disabled={product.stock < 1}
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-500">
                    <HeartIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <Link href={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="group">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedProduct.images?.[0] || relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {relatedProduct.discount && relatedProduct.discount > 0 && (
                        <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          -{relatedProduct.discount}%
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="mt-1">
                        <ProductRating 
                          productId={relatedProduct.id}
                          initialRating={relatedProduct.rating || 2.5}
                          ratingCount={relatedProduct.ratingCount || 0}
                          size="sm"
                          interactive={false}
                        />
                      </div>
                      <div className="flex items-baseline mt-1">
                        <span className="font-bold text-orange-600">
                          ${relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="ml-1 text-xs text-gray-500 line-through">
                            ${relatedProduct.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}