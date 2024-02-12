import { BaseModel } from "./base.model"

export class Role extends BaseModel{
    id: Number
    role_code: String
    role_name : String
    user_mobile_code: String
    tokenSerie_code: String
    device_id : String
    
    controller_role :String
    token_serie_code : String
    upper_role_code: String
    role_loc :String
    role_site : String
    role_loc_from:String
    printer_adress : String 
    pricelist_code : String
}