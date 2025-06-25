export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  stockList: ProductSize[];
  totalStock: number;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  file?: File;
  stockList: { id: number, size: string; stock: number, originalStock?: number }[];
}

export interface ProductSize {
  id: number;
  size: string;
  stock: number;
}
