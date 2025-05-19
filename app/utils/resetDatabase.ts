import { clearAllProducts } from './clearProducts';
import { addSampleProducts } from './addSampleProducts';

/**
 * Resets the database by clearing all existing products
 * and adding new sample products with Temu-style data
 */
export async function resetDatabase() {
  try {
    console.log('Starting database reset...');
    
    // Step 1: Clear all existing products
    const clearResult = await clearAllProducts();
    if (!clearResult.success) {
      throw new Error(`Failed to clear products: ${clearResult.message}`);
    }
    console.log('Products cleared successfully');
    
    // Step 2: Add new sample products
    const addResult = await addSampleProducts();
    if (!addResult.success) {
      throw new Error(`Failed to add sample products: ${addResult.message}`);
    }
    console.log('Sample products added successfully');
    
    return { 
      success: true, 
      message: 'Database reset successfully with new Temu-style products',
      productsAdded: true
    };
  } catch (error) {
    console.error('Error resetting database:', error);
    return { 
      success: false, 
      message: `Failed to reset database: ${error.message}`,
      productsAdded: false
    };
  }
}
