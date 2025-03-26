import { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ProductDetails from './ProductDetails';

// Metadata generation function (server-side)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const productDoc = await getDoc(doc(db, 'products', params.id));
    const product = productDoc.data();

    return {
      title: product ? `${product.name} | Remu` : 'Product Not Found',
      description: product?.description || 'Product details',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Remu',
      description: 'Product details',
    };
  }
}

// Server component
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetails id={params.id} />;
} 