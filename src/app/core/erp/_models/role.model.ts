import { BaseModel } from "./base.model"

export class Role extends BaseModel{
    id: Number
    role_name : String
    role_userMobileId: Number
    role_tokenSerie?: String
}