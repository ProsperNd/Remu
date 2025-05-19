import { ImageResponse } from 'next/og';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Metadata } from 'next';

// Image generation for social sharing
export async function generateImageMetadata({ params }: { params: { id: string } }) {
  try {
    const productDoc = await getDoc(doc(db, 'products', params.id));
    const product = productDoc.data();
    
    return [
      {
        contentType: 'image/png',
        size: { width: 1200, height: 630 },
        id: 'og-image',
        alt: product?.name || 'Product image',
      }
    ];
  } catch (err) {
    console.error('Error generating image metadata:', err);
    return [];
  }
}

// Route segment metadata
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const productDoc = await getDoc(doc(db, 'products', params.id));
    
    if (!productDoc.exists()) {
      return {
        title: 'Product Not Found | Remu',
        description: 'The requested product could not be found',
      };
    }
    
    const product = productDoc.data();
    
    return {
      title: product?.name ? `${product.name} | Remu` : 'Product | Remu',
      description: product?.description || 'View product details',
      openGraph: {
        title: product?.name || 'Product',
        description: product?.description || 'View product details',
        images: [
          {
            url: product?.imageUrl || product?.images?.[0] || '/placeholder.png',
            width: 1200,
            height: 630,
            alt: product?.name || 'Product image',
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Remu',
      description: 'View product details',
    };
  }
}

// OpenGraph Image
export default async function Image({ params }: { params: { id: string } }) {
  try {
    const productDoc = await getDoc(doc(db, 'products', params.id));
    const product = productDoc.data();
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            padding: 50,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#1F2937',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ 
              background: '#FF7F00', 
              color: 'white',
              padding: '8px 24px',
              borderRadius: 8,
              marginRight: 12
            }}>
              Remu
            </div>
            <div style={{ fontSize: 24, color: '#4B5563' }}>
              E-commerce Platform
            </div>
          </div>
          <div
            style={{
              fontSize: 64,
              background: 'linear-gradient(to right, #FF7F00, #E67300)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 24,
              maxWidth: '80%',
              textAlign: 'center',
            }}
          >
            {product?.name || 'Product'}
          </div>
          <div style={{ 
            fontSize: 32, 
            color: '#FF7F00', 
            marginBottom: 24,
            fontWeight: 'bold'
          }}>
            ${product?.price ? product.price.toFixed(2) : '0.00'}
          </div>
          <div style={{ fontSize: 24, color: '#6B7280', maxWidth: '70%', textAlign: 'center' }}>
            {product?.description?.substring(0, 100) || 'View this amazing product on Remu'}
            {product?.description && product.description.length > 100 ? '...' : ''}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OpenGraph image:', error);
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            padding: 50,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#1F2937',
          }}
        >
          <div style={{ 
            background: '#FF7F00', 
            color: 'white',
            padding: '8px 24px',
            borderRadius: 8,
            marginBottom: 24
          }}>
            Remu
          </div>
          <div style={{ fontSize: 32 }}>Premium E-commerce Products</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
} 