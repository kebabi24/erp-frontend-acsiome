import {BaseModel} from './base.model'

export class LocationDeclared extends BaseModel{
   
    id: Number
    ldd_loc: String
    ldd_part:  String
        
    ldd_date:Date
    ldd_qty_oh: number
    ldd_lot: String
    ldd_ref: String
    ldd_cnt_date: Date
    ldd_assay: number
    ldd_expire:Date
    ldd_user1: String
    ldd_user2: String
    ldd_site: String
    ldd_status: String
    ldd_qty_all: number
    ldd_grade: String
    ldd_qty_frz: number
    ldd_date_frz:Date
    ldd_vd_lot: String
    ldd_cmtindx: number
    ldd_work: number
    ldd__chr01:String
    ldd__chr02:String
    ldd__chr03:String
    ldd__chr04:String
    ldd__chr05:String
    ldd__dte01:Date
    ldd__dte02:Date
    ldd__dec01:number
    ldd__dec02:number
    ldd__log01:Boolean
    ldd_cost:number
    ldd_rev:String
    ldd_cust_consign_qty:number
    ldd_supp_consign_qty:number
    ldd_domain:String


}