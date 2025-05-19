'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../components/ToastNotification';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

// Create the context with a default value
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  // Initialize cart from localStorage on client-side only
  useEffect(() => {
    setMounted(true);
    
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (mounted) {
    localStorage.setItem('cart', JSON.stringify(items));
      
      // Calculate total and item count
      const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newItemCount = items.reduce((count, item) => count + item.quantity, 0);
      
      setTotal(newTotal);
      setItemCount(newItemCount);
      
      // Dispatch custom event for other components to listen to
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
    }
  }, [items, mounted]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        
        showToast(`Updated quantity of ${item.name} in your cart`, 'success');
        return updatedItems;
      } else {
        // Add new item with quantity 1
        showToast(`Added ${item.name} to your cart`, 'success');
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      const newItems = prevItems.filter(item => item.id !== id);
      
      if (itemToRemove) {
        showToast(`Removed ${itemToRemove.name} from your cart`, 'info');
      }
      
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    showToast('Your cart has been cleared', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 