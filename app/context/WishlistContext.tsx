'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/ToastNotification';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, deleteField, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  addedAt: number; // timestamp
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
  clearWishlist: async () => {},
  loading: true,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Initialize wishlist data
  useEffect(() => {
    const initializeWishlist = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // If user is logged in, get wishlist from Firestore
          const wishlistDoc = await getDoc(doc(db, 'wishlists', user.uid));
          
          if (wishlistDoc.exists()) {
            const wishlistData = wishlistDoc.data();
            const wishlistItems: WishlistItem[] = Object.values(wishlistData || {});
            
            // Sort by most recently added
            wishlistItems.sort((a, b) => b.addedAt - a.addedAt);
            
            setItems(wishlistItems);
          } else {
            // Create empty wishlist document for user
            await setDoc(doc(db, 'wishlists', user.uid), {});
            setItems([]);
          }
        } else {
          // If no user is logged in, get wishlist from localStorage
          const savedWishlist = localStorage.getItem('wishlist');
          if (savedWishlist) {
            try {
              setItems(JSON.parse(savedWishlist));
            } catch (error) {
              console.error('Error parsing wishlist data:', error);
              localStorage.removeItem('wishlist');
              setItems([]);
            }
          } else {
            setItems([]);
          }
        }
      } catch (error) {
        console.error('Error initializing wishlist:', error);
        showToast('Failed to load your wishlist', 'error');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    initializeWishlist();
  }, [user, showToast]);

  // Sync wishlist to localStorage when items change (for non-logged in users)
  useEffect(() => {
    if (initialized && !user) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, initialized, user]);

  const addToWishlist = async (item: Omit<WishlistItem, 'addedAt'>) => {
    try {
      const newItem: WishlistItem = {
        ...item,
        addedAt: Date.now()
      };
      
      if (user) {
        // Add to Firestore
        await updateDoc(doc(db, 'wishlists', user.uid), {
          [item.id]: newItem
        });
      }
      
      // Update local state
      setItems(prev => {
        // Ensure we don't duplicate items
        const existingItem = prev.find(i => i.id === item.id);
        if (existingItem) {
          return prev;
        }
        return [newItem, ...prev];
      });
      
      showToast(`Added ${item.name} to your wishlist`, 'success');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      showToast('Failed to add item to wishlist', 'error');
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const itemToRemove = items.find(item => item.id === id);
      
      if (user) {
        // Remove from Firestore
        await updateDoc(doc(db, 'wishlists', user.uid), {
          [id]: deleteField()
        });
      }
      
      // Update local state
      setItems(prev => prev.filter(item => item.id !== id));
      
      if (itemToRemove) {
        showToast(`Removed ${itemToRemove.name} from your wishlist`, 'info');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showToast('Failed to remove item from wishlist', 'error');
    }
  };

  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id);
  };

  const clearWishlist = async () => {
    try {
      if (user) {
        // Clear Firestore wishlist
        await setDoc(doc(db, 'wishlists', user.uid), {});
      }
      
      // Update local state
      setItems([]);
      showToast('Your wishlist has been cleared', 'info');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      showToast('Failed to clear wishlist', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}; 