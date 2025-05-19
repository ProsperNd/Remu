import { ref, set, get, push, update, remove, query, orderByChild, limitToLast, equalTo } from 'firebase/database';
import { rtdb } from '../firebase/realtime-config';

// Product utility functions
export const saveProduct = async (product: any) => {
  const newProductRef = push(ref(rtdb, 'products'));
  const productWithId = {
    ...product,
    id: newProductRef.key,
    createdAt: new Date().toISOString(),
  };
  
  await set(newProductRef, productWithId);
  return productWithId;
};

export const getProducts = async (limit = 50) => {
  const productsRef = ref(rtdb, 'products');
  const snapshot = await get(query(productsRef, limitToLast(limit)));
  
  if (snapshot.exists()) {
    const products = [];
    snapshot.forEach((childSnapshot) => {
      products.push({
        ...childSnapshot.val(),
        id: childSnapshot.key,
      });
    });
    return products;
  }
  
  return [];
};

export const getProductsByCategory = async (category: string, limit = 20) => {
  const productsRef = ref(rtdb, 'products');
  const productsQuery = query(
    productsRef,
    orderByChild('category'),
    equalTo(category),
    limitToLast(limit)
  );
  
  const snapshot = await get(productsQuery);
  
  if (snapshot.exists()) {
    const products = [];
    snapshot.forEach((childSnapshot) => {
      products.push({
        ...childSnapshot.val(),
        id: childSnapshot.key,
      });
    });
    return products;
  }
  
  return [];
};

export const getProductById = async (productId: string) => {
  const productRef = ref(rtdb, `products/${productId}`);
  const snapshot = await get(productRef);
  
  if (snapshot.exists()) {
    return {
      ...snapshot.val(),
      id: snapshot.key,
    };
  }
  
  return null;
};

export const updateProduct = async (productId: string, updates: any) => {
  const productRef = ref(rtdb, `products/${productId}`);
  await update(productRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteProduct = async (productId: string) => {
  const productRef = ref(rtdb, `products/${productId}`);
  await remove(productRef);
};

// User utility functions
export const getUserById = async (userId: string) => {
  const userRef = ref(rtdb, `users/${userId}`);
  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    return {
      ...snapshot.val(),
      id: snapshot.key,
    };
  }
  
  return null;
};

export const createUser = async (userId: string, userData: any) => {
  const userRef = ref(rtdb, `users/${userId}`);
  await set(userRef, {
    ...userData,
    createdAt: new Date().toISOString(),
  });
};

export const updateUser = async (userId: string, updates: any) => {
  const userRef = ref(rtdb, `users/${userId}`);
  await update(userRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

// Cart utility functions
export const getCart = async (userId: string) => {
  const cartRef = ref(rtdb, `carts/${userId}`);
  const snapshot = await get(cartRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return { items: [] };
};

export const updateCart = async (userId: string, cartData: any) => {
  const cartRef = ref(rtdb, `carts/${userId}`);
  await set(cartRef, {
    ...cartData,
    updatedAt: new Date().toISOString(),
  });
};

// Order utility functions
export const createOrder = async (orderData: any) => {
  const ordersRef = ref(rtdb, 'orders');
  const newOrderRef = push(ordersRef);
  
  await set(newOrderRef, {
    ...orderData,
    id: newOrderRef.key,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  
  return newOrderRef.key;
};

export const getOrdersByUser = async (userId: string) => {
  const ordersRef = ref(rtdb, 'orders');
  const ordersQuery = query(
    ordersRef,
    orderByChild('userId'),
    equalTo(userId)
  );
  
  const snapshot = await get(ordersQuery);
  
  if (snapshot.exists()) {
    const orders = [];
    snapshot.forEach((childSnapshot) => {
      orders.push({
        ...childSnapshot.val(),
        id: childSnapshot.key,
      });
    });
    return orders;
  }
  
  return [];
};

export const getOrderById = async (orderId: string) => {
  const orderRef = ref(rtdb, `orders/${orderId}`);
  const snapshot = await get(orderRef);
  
  if (snapshot.exists()) {
    return {
      ...snapshot.val(),
      id: snapshot.key,
    };
  }
  
  return null;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = ref(rtdb, `orders/${orderId}`);
  await update(orderRef, {
    status,
    updatedAt: new Date().toISOString(),
  });
};
