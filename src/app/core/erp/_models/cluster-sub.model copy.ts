import { BaseModel } from "./base.model"

export class SubCluster extends BaseModel{
    id: Number
    sub_cluster_code: String
    cluster_code : String
    description: String 
}