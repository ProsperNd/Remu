'use client';

import { useState } from 'react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface ProductRatingProps {
  productId: string;
  initialRating: number;
  ratingCount: number;
  onRatingChange?: (newRating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  interactive?: boolean;
}

export default function ProductRating({
  productId,
  initialRating = 2.5,
  ratingCount = 0,
  onRatingChange,
  size = 'md',
  color = 'text-orange-500',
  interactive = true
}: ProductRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRated, setUserRated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRatings, setTotalRatings] = useState(ratingCount);

  // Determine star sizes based on the size prop
  const starSizes = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleRating = async (selectedRating: number) => {
    if (!user || !interactive || userRated || loading) return;

    setLoading(true);
    try {
      // Get the product document
      const productRef = doc(db, 'products', productId);
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists()) {
        const productData = productDoc.data();
        const currentRating = productData.rating || 2.5;
        const currentCount = productData.ratingCount || 0;
        
        // Calculate new rating
        const newRatingCount = currentCount + 1;
        const newRatingValue = ((currentRating * currentCount) + selectedRating) / newRatingCount;
        
        // Update the product with the new rating
        await updateDoc(productRef, {
          rating: newRatingValue,
          ratingCount: increment(1)
        });
        
        // Update local state
        setRating(newRatingValue);
        setTotalRatings(newRatingCount);
        setUserRated(true);
        
        // Call the callback if provided
        if (onRatingChange) {
          onRatingChange(newRatingValue);
        }
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create an array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        {stars.map((star) => {
          const displayRating = hoveredRating || rating;
          const filled = star <= Math.round(displayRating);
          const halfFilled = !filled && star === Math.ceil(displayRating) && displayRating % 1 >= 0.5;

          return (
            <button
              key={star}
              className={`${interactive && !userRated ? 'cursor-pointer' : 'cursor-default'} mr-0.5 focus:outline-none ${color}`}
              onMouseEnter={() => interactive && !userRated && setHoveredRating(star)}
              onMouseLeave={() => interactive && !userRated && setHoveredRating(0)}
              onClick={() => handleRating(star)}
              disabled={!interactive || userRated || loading}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              {filled ? (
                <StarIcon className={starSizes[size]} />
              ) : halfFilled ? (
                <span className="relative">
                  <StarOutlineIcon className={starSizes[size]} />
                  <span className="absolute overflow-hidden top-0 left-0" style={{ width: '50%' }}>
                    <StarIcon className={starSizes[size]} />
                  </span>
                </span>
              ) : (
                <StarOutlineIcon className={starSizes[size]} />
              )}
            </button>
          );
        })}
        {totalRatings > 0 && (
          <span className="ml-2 text-xs text-gray-500">
            ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
          </span>
        )}
      </div>
      {userRated && (
        <p className="text-xs text-green-600 mt-1">Thanks for your rating!</p>
      )}
    </div>
  );
}
