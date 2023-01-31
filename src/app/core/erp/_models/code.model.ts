import { BaseModel } from "./base.model"

export class Code extends BaseModel {
    id: Number
    code_fldname : String
    code_value : String
    code_desc : String
    code_cmmt : String
    code_user1 : String
    code_user2 : String
    date01: String
    date02: String
    chr01: String
    chr02: String
    dec01: Number
    dec02: Number
    bool01: Boolean
    bool02: Boolean
    code_domain: String

    
}
