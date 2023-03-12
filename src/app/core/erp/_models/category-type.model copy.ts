import { BaseModel } from "./base.model"

export class CategoryType extends BaseModel{
    id: Number
    category_type_code: String
    category_code: String
    description: String 
}