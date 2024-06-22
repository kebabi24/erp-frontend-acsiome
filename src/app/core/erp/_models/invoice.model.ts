import { BaseModel } from "./base.model"

export class Invoice extends BaseModel{
    id: Number
    invoice_code:String
    site:String
    itinerary_code:String // from itinerary 
    customer_code:String // from customer 
    the_date:String
    period_active_date:String
    role_code:String // from role 
    user_code:String // from user
    loc_code:String 
    service_code : String // from service
    visit_code : String 
    pricelist_code:String // from pricelist
    amount:Number 
    due_amount:Number 
    payment_term_code:String 
    devise_code:String 
    description:String 
    discount:Number 
    taxe_amount : Number // FLOAT default 0
    stamp_amount : Number// FLOAT default 0
    horstax_amount : Number// FLOAT default 0
    canceled : Boolean
    cancelation_reason_code : String // from cancelation reason 
    progress_level : Number
    score_code : String 
    sdelivery_note_code : String
    closed : Boolean
    promorate: Number
    promoamt: Number
    
}