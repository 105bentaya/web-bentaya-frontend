import {Product} from "./product.model";

export interface CartItem {
  product: Product;
  totalPrice: number;
  items: { size: any, count: number, stock: number, productSizeId: number }[];
}

export interface CartProductForm {
  productSizeId: number,
  count: number
}
