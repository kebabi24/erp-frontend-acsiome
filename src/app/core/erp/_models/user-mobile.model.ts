import { BaseModel } from "./base.model"

export class UserMobile extends BaseModel {
    id: Number
    user_mobile_code:String
    username: String
    //fullname: String
    // email: String
    password: String
    profile_code: String
    language?: String 
    hold: String
}