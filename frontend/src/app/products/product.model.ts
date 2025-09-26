export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  description?: string;
  baseIngredients: string[];
  options: {
    removable: { name: string; price: number }[];
    addable: { name: string; price: number }[];
  };
  inStock: boolean;
}
