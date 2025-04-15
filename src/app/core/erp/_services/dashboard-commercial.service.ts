// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"



const API_URL_POS_ORDERS = environment.apiUrl + "/pos-order/findAllPosOrders"
const API_URL_DD_DATA = environment.apiUrl + "/users-mobile/getDashboardData"
const API_URL_SALES_DATA = environment.apiUrl + "/users-mobile/getSalesDashboardData"

@Injectable()
export class DashboardCommercialService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // READ 
    public getAllPosOrders(startDate: any , endDate:any , shop:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_POS_ORDERS, {startDate, endDate, shop},{ headers: httpHeaders })
    }

    public getDdDashboardData(start_date: any , end_date:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_DD_DATA, {start_date, end_date},{ headers: httpHeaders })
    }

    public getSalesDashboardData(start_date: any , end_date:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_SALES_DATA, {start_date, end_date},{ headers: httpHeaders })
    }
  
}
