import { BaseModel } from "./base.model"

export class Transportcost extends BaseModel {
    id: Number
    trc_code: String

    trc_desc: Boolean
    trc_domain: String
    trc_acct: String
    trc_project: String
    trc_taxable: Boolean   
    
    trc_taxc: String
      
    trc_disc: Boolean       
    
}
