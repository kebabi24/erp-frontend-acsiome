import { Product } from "./pos-products.model";
export class Category {
  id: Number;
  category_code: string;
  category_name: string;
  items?: Array<Product>;
  category_img: string;
}
