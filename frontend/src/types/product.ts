export interface Product {
  id: string;
  brand: 'Nike' | 'Adidas' | 'Puma' | 'Converse' | 'New Balance';
  name: string;
  category: 'Running' | 'Lifestyle' | 'Training' | 'Basketball' | 'Casual';
  price: number;
  rating: number;
  colors: string[];
  image: string;
  description: string;
  features: string[];
}
