import { BaseModel } from "./base.model"

export class MobileService extends BaseModel {
    id: Number
    service_period_activate_date: String
    service_creation_date: String
    service_closing_date: String
    service_roleId: Number
    service_itineraryId: Number
    service_open: String
}
