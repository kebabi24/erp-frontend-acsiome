import { BaseModel } from "./base.model"

export class Provider extends BaseModel{
    id: Number
    vd_addr: String
    vd_curr: String
    vd_cr_terms: String
    vd_buyer: String
    vd_disc_pct: Number
    vd_shipvia: String
    vd_partial: Boolean
    vd_rmks: String
    vd_ap_acct: String
    vd_ap_cc: String
    vd_act_acct: String
    vd_act_cc: String
    vd_pur_cntct: String
    vd_ap_cntct: String
    vd_1099: Boolean
    vd_sort: String
    vd_last_ck: Date
    vd_balance: Number
    vd_hold: Boolean
    vd_tax_id: String
    vd_taxable: Boolean
    vd_user1: String
    vd_user2: String
    vd_lang: String
    vd_vt_id: String
    vd_fob: String
    vd_debtor: String
    vd_bank: String
    vd_ckfrm: String
    vd_pay_spec: Boolean
    vd_remit: String
    vd_type: String
    vd_userid: String
    vd_mod_date: Date
    vd_prepay: Number
    vd_conrep_logic: String
    vd_pr_list: String
    vd_drft_bal: Number
    vd_lc_bal: Number
    vd_pr_list2: String
    vd_fix_pr: Boolean
    vd_fr_list: String
    vd_fr_min_wt: Number
    vd_fr_terms: String
    vd_tid_notice: String
    vd_promo: String
    vd_misc_cr: Boolean
    vd_rcv_so_price: Boolean
    vd_rcv_held_so: Boolean
    vd_tp_use_pct: Boolean
    vd_tp_pct: Number
    vd_ex_ratetype: String
    vd_db: String
    vd_ap_sub: String
    vd_act_sub: String
    vd_tot_terms_code: String
    vd_carrier_id: String
    vd_kanban_supplier: String
    vd_seq : String

}