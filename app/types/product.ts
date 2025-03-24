export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  createdAt?: Date;
  updatedAt?: Date;
} 