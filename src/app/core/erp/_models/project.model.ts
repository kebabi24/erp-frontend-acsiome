import { BaseModel } from "./base.model"

export class Project extends BaseModel {
    id: Number
    pm_code: String

    pm_desc: Boolean
    pm_site: String
    pm_domain: String
    pm_status: String
    pm_cust: String
    pm_amt: Number
    pm_cost: Number
    pm_ord_date: String
    pm_type:String
    pm_doc_list_code : String

    
    pm_reason : String
    pm_win_addr : String
    pm_win_amt : Number
    pm_win_cmmt : String
}
