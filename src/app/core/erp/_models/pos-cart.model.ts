import { Product } from "./pos-products.model";
export class Cart {
  id: Number;
  code_cart: string;
  products: Array<Product>;
  usrd_site: string;
  order_emp: string;
  customer: string;
  total_price: number;
  created_date?: Date;
}
