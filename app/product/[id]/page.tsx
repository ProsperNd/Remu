import { db } from '@/app/firebase/config';
import { Product } from '@/app/types/product';
import ProductDetails from '@/app/components/ProductDetails';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const productDoc = await db.collection('products').doc(id).get();
    if (!productDoc.exists) {
      return null;
    }
    return { id: productDoc.id, ...productDoc.data() } as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
} 