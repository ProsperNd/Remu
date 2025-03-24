import { addSampleProducts } from '../app/utils/addSampleProducts';

// Run the script
addSampleProducts()
  .then(() => {
    console.log('Successfully added sample products');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  }); 