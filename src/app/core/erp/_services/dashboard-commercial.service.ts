// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"



const API_URL_POS_ORDERS = environment.apiUrl + "/pos-order/findAllPosOrders"

@Injectable()
export class DashboardCommercialService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // READ 
    public getAllPosOrders(startDate: any , endDate:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_POS_ORDERS, {startDate , endDate},{ headers: httpHeaders })
    }
  
}
