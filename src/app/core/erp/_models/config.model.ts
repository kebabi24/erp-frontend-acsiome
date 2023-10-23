import { BaseModel } from "./base.model"

export class Config extends BaseModel{
    id: Number
    cfg_pm_module : boolean
    cfg_pay_multiple : boolean
    cfg_crm: boolean
    cfg_accounting: boolean
    cfg_declared: boolean
   

}