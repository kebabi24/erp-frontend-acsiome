import { BaseModel } from "./base.model"

export class PriceListQuantity extends BaseModel {
    id: Number
    plq_code: String
    plq_min_qty: Number
    plq_max_qty: Number
    plq_desc: String
    plq_domain: String
}
