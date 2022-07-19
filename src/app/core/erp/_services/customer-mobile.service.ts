import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"

import { CustomerMobile } from "../_models/customer-mobile.model";
const API_URL_CUSTOMER = environment.apiUrl + "/customers-mobile"
const API_URL = environment.apiUrl + "/codes"


@Injectable()
export class CustomerMobileService {
    httpOptions = this.httpUtils.getHTTPHeaders();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ){}

    public addCustomerMobile(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(API_URL_CUSTOMER, data, ({headers: httpHeaders}))
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_CUSTOMER}/findone`,data, { headers: httpHeaders })   
    }

    public getAllCustomers(){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_CUSTOMER, {headers: httpHeaders })
    }

    public getBy() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_CUSTOMER}/find`, { headers: httpHeaders })
    }

 
}