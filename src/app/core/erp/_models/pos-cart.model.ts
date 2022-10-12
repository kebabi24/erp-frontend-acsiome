import { Product } from "./pos-products.model";
export class Cart {
  id: Number;
  code_cart: string;
  products: Array<Product>;
  order_emp: string;
  customer: string;
  total_price: number;
}
