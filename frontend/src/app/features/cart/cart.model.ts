import { Product } from '../../shared/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
}
