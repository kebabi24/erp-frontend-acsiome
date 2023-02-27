import { Product } from "./pos-products.model";
export class Cart {
  id?: Number;
  order_code?: string;
  products: Array<Product>;
  usrd_site: string;
  usrd_name: string;
  usrd_profile: string;
  order_emp: string;
  customer: string;
  total_price: number;
  status: string;
  created_date?: Date;
  loy_num?: number;
  disc_amt?: number;
  del_comp?: string;
  site_loc?: string;
  plateforme: string;
}
