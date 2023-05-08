import { BaseModel } from "./base.model";

export class Sensibilisation extends BaseModel {
  id: Number;
  code_project: String;
  code_employee: String;
  code_educator: String;
  duration: Number;
  date: String;
  location: String;
}
