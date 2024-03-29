import { BaseModel } from "./base.model"

export class MobileService extends BaseModel {
    id: Number
    service_code: String
    service_period_activate_date: String
    service_creation_date: String
    service_closing_date: String
    role_code: String
    itinerary_code: String
    service_open: String
    user_mobile_code: String
    service_site: String 
}
