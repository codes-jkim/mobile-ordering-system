import { Product } from './product.model';

export interface Order {
  _id: string;
  items: { product: Product; quantity: number }[];
  totalPrice: number;
  status: 'preparing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TopProduct {
  productId: string;
  name: string;
  imageUrl: string;
  soldCount: number;
}

export interface TopProductsByCategory {
  category: string;
  topProducts: TopProduct[];
}

export interface SalesByDate {
  date: string;
  total: number;
  count: number;
}

export interface DashboardStats {
  dailyOrders: number;
  weeklyOrders: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  topProductsByCategory: TopProductsByCategory[];
  salesByDate: SalesByDate[];
}
