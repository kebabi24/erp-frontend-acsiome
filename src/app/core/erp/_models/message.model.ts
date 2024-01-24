import { BaseModel } from "./base.model"

export class Message extends BaseModel {
    id: Number
    title:String
    description:String
    rank:Number
    role_code :String
    
    
}
