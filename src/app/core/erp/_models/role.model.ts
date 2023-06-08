import { BaseModel } from "./base.model"

export class Role extends BaseModel{
    id: Number
    role_code: String
    role_name : String
    user_mobile_code: String
    tokenSerie_code: String
    device_id : String
}