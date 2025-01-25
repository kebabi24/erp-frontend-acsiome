import { BaseModel } from "./base.model";

export class AddReport extends BaseModel {
  id: Number;
  pmr_pm_code: String;
  pmr_nbr:String;
  pmr_site: String;
  pmr_inst: String;
  pmr_task: String;
  pmr_task_status: String;
  pmr_internal: Boolean;
  pmr_demobilisation: Boolean;
  pmr_mobilisation: Boolean;
  pmr_stndby: Boolean;
  pmr_separe: Boolean;
  pmr_duration:Number;
  pmr_start_date: String;
  pmr_end_date: String;
  pmr_employe: String;
  pmr_close: Boolean;
  pmr_domain: String;
}
