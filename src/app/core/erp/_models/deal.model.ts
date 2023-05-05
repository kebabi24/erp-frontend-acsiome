import { BaseModel } from "./base.model"

export class Deal extends BaseModel{
    id: Number
    deal_code: String
    deal_desc: String
    
    deal_start_datedesc: String
    deal_start_date: String
    deal_end_date: String
    deal_status: String
    deal_amt : Number
    deal_inv_meth: String
    deal_pay_meth: String
    deal_pen_cust: Number
    deal_pen_prov: Number
    deal_delai_cust: Number
    deal_delai_prov: Number
    deal_attach: String
    deal_sign_cust: String
    deal_sign_prov: String
    deal_cust: String


    deal_open: Boolean
    
    deal_domain: String
   
    
}