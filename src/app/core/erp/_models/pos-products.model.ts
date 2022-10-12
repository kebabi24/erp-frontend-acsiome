import { Spec } from "./spec.model";
export class Product {
  id: Number;
  pt_part: string;
  pt_desc1: string;
  pt_article: string;
  pt_price: number;
  pt_qty: number;
  pt_page: number;
  pt_formule: boolean;
  pt_bom_code: string;
  suppliments: Array<Spec>;
  ingredients: Array<Spec>;
  size: string;
}
