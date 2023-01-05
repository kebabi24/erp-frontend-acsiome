import { Spec } from "./spec.model";
export class Product {
  id: Number;
  pt_part: string;
  pt_desc1: string;
  pt_desc2?: string;
  pt_article: string;
  pt_price: number;
  pt_qty: number;
  pt_formule: boolean;
  pt_bom_code: string;
  suppliments: Array<any>;
  pt_loc: string;
  ingredients: Array<any>;
  sauces?: Array<any>;
  soda?: Array<any>;
  pt_draw?: string;
  pt_group?: string;
  comment: string;
  pt_part_type: string;
  line: string;
}
