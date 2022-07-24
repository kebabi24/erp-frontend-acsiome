import { BaseModel } from "./base.model"

export class MenuMobile extends BaseModel {
    id: Number
    menu_code: String
    name: String
    menu_description: String
    menu_active: Boolean
    menu_goto: String
    menu_type: String
    menu_image: String
}
