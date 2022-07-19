import { BaseModel } from "../../_base/crud";

export class CustomerMobile extends BaseModel {

    id : Number
    customer_name: String
    customer_name2: String
    customer_arabic_name: String
    customer_contact: String
    customer_phone_one: String
    customer_phone_two: String
    customer_email: String
    customer_fax: String
    customer_web_adr: String
    customer_branch_code: String
    customer_barcode: String
}