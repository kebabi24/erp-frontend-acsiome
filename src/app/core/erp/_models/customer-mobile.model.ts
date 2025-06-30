import { BaseModel } from "../../_base/crud";

export class CustomerMobile extends BaseModel {

    id : Number
    customer_code: String
    customer_name: String
    customer_name2: String
    customer_arabic_name: String
    customer_phone_one: String
    customer_phone_two: String
    customer_email: String
    customer_fax: String
    customer_web_adr: String
    customer_branch_code: String
    customer_barcode: String
    customer_contact: String
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

    // commercial fiels
    cluster_code : String 
    sub_cluster_code: String
    category_code : String 
    category_type_code : String 
    sales_channel_code : String 
    payment_method_code : String
    rc: String
    ai: String
    nif: String
    nis:String
    
}