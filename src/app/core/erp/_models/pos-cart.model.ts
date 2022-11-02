import { Product } from "./pos-products.model";
export class Cart {
  id: Number;
  order_code?: string;
  products: Array<Product>;
  usrd_site: string;
  usrd_name: string;
  order_emp: string;
  customer: string;
  total_price: number;
  status: string;
  created_date?: Date;
}
