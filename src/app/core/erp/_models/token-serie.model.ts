import { BaseModel } from "./base.model"

export class TokenSerie extends BaseModel{
    token_code: String
    token_name: String
    token_digitcount: Number
    service_prefix: String
    service_next_number: Number
    visit_prefix: String
    visit_next_number: Number
    load_request_prefix: String
    load_request_next_number: Number
    inventory_prefix: String
    inventory_next_number: Number
}