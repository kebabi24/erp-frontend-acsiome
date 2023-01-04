import { BaseModel } from "./base.model"

export class Delivery extends BaseModel {
    id: Number    
    del_code: String
    del_desc: String
    del_pct_disc: Number
    del_part_gift: String
    del_pct_part_gift: String
    del_cndt_actif: Boolean
    del_cndt: String
    del_cndt_qty: String
    del_valid: String
    del_exp: String
    del_start_offer:String
    del_end_offer: String
    actif: String
    
}
