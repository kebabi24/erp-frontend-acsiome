import { BaseModel } from "./base.model"

export class UserMobile extends BaseModel {
    id: Number
    username: String
    fullname: String
    email: String
    password: String
    profileId: Number
    language?: String 
    hold: String
}