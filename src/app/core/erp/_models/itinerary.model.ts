import { BaseModel } from "./base.model"

export class Itinerary extends BaseModel {
    id: Number
    itinerary_name: String
    itinerary_type: String
    itinerary_day: String
    customers_name: String
    roles: String
}