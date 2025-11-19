import { Category } from './category.model';

export interface Product {
  _id: string;
  name: string;
  category: Category;
  price: number;
  imageUrl?: string;
  description?: string;
  inStock: boolean;
}
