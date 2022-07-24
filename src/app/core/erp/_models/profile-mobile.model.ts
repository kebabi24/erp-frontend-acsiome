import { BaseModel } from "./base.model"

export class ProfileMobile extends BaseModel {
    id: Number
    profile_code: String
    profile_name: String
    profile_valid_date: String
    profile_exp_date: String
}