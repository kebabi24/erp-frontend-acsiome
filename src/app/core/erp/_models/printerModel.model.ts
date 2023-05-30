import { BaseModel } from "./base.model";

export class PrinterModel extends BaseModel {
  id: Number;
  printer_code: String;
  printer_desc: String;
  printer_path: String;
  printer_type: String;
}
