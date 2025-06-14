import { BaseModel } from "./base.model"

export class Trainingcalender extends BaseModel {
    id: Number
    tc_code: String
    tc_desc: String
    tc_year: Number
    tc_service: String
    tc_site: String
    tc_domain: String
    chr01:String   
    tc_pop:String 
}
