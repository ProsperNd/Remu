import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

/**
 * Utility function to clear all products from the Firestore database
 * and delete associated images from Firebase Storage
 */
export async function clearAllProducts() {
  try {
    console.log('Starting to clear all products...');
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    if (querySnapshot.empty) {
      console.log('No products found to delete');
      return { success: true, message: 'No products found to delete' };
    }
    
    let count = 0;
    for (const document of querySnapshot.docs) {
      try {
        const productData = document.data();
        
        // Delete any associated images from Storage if they exist
        if (productData.images && Array.isArray(productData.images)) {
          for (const imageUrl of productData.images) {
            try {
              // Only attempt to delete if it's a Firebase Storage URL
              if (imageUrl && imageUrl.includes('firebasestorage')) {
                // Extract the path from the URL
                const path = imageUrl.split('?')[0].split('/o/')[1];
                if (path) {
                  const decodedPath = decodeURIComponent(path);
                  const imageRef = ref(storage, decodedPath);
                  await deleteObject(imageRef);
                  console.log(`Deleted image: ${decodedPath}`);
                }
              }
            } catch (imageError) {
              console.error(`Error deleting image ${imageUrl}:`, imageError);
              // Continue with other images even if one fails
            }
          }
        }
        
        // Delete the product document from Firestore
        await deleteDoc(doc(db, 'products', document.id));
        count++;
      } catch (docError) {
        console.error(`Error deleting product ${document.id}:`, docError);
        // Continue with other products even if one fails
      }
    }
    
    console.log(`Successfully deleted ${count} products`);
    return { success: true, message: `Successfully deleted ${count} products` };
  } catch (error) {
    console.error('Error clearing products:', error);
    return { success: false, message: 'Failed to clear products: ' + error.message };
  }
}
