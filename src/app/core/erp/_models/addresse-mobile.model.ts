import { BaseModel } from "./base.model"

export class AddresseMobile extends BaseModel {

    addresse_one: String
    addresse_two: String
    customer_id: Number
    addresse_extended: String
    city: String
    postal_code: String
    state: String
    country: String
    geoarea_code: String
    longitude: String
    latitude: String

    clear() {
    
    }
}
