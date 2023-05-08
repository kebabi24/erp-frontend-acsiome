import { BaseModel } from "./base.model"

export class VisitResult extends BaseModel{
    id: Number
    visitresult_code: String
    name: String
    rank : Number
    revisit : Boolean 
}