// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { VisitResult } from "../_models/visit-result.model"

const API_URL = environment.apiUrl + "/users-mobile"

const API_URL_2 = environment.apiUrl + "/mobile-settings"

@Injectable()
export class MobileSettingsService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    public   getAllVisitResult() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/getVisitList/`, { headers: httpHeaders })
    }

    public   getAllPaymentMethods() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/paymentMethods/`, { headers: httpHeaders })
    }

    public   getAllCancelationReasons() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/cancelationReasons/`, { headers: httpHeaders })
    }

     public submitVisitListData(visitResults: any , deleteIds: any,updateData : any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/sumbitVisitResultsData/`, {...visitResults,...deleteIds , ...updateData},{ headers: httpHeaders })
    }
    public   getAllInvoices(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllInvoices/`, data,{ headers: httpHeaders })
    }

    public   getAllInvoicesLine(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getInvoiceLines/`, data,{ headers: httpHeaders })
    }

    
    public   getAllPayment(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllPayment/`, data,{ headers: httpHeaders })
    }   
    public   getAllVisites(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllVisit/`, data,{ headers: httpHeaders })
    }   
  
}


    // // UPDATE
    // public update(id: Number, data:any) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.put(`${API_URL}/${id}`,data, { headers: httpHeaders })
    // }
    // // DELETE
    // public delete(id: Number) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders })
    // }

     // CREATE
    //  public add(customer: Customer) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.post(API_URL, customer, { headers: httpHeaders })
    // }
    // // READ
    // public getAll() {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.get(API_URL, { headers: httpHeaders })
    // }
    // public getOne(id: Number) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    // }
  
    // public getBy(data: any) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })

    //    // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    // }
    // public getSolde(data: any) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.post(`${API_URL}/findsolde`,data, { headers: httpHeaders })
    // }    
    // public getByAll(data: any) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.post(`${API_URL}/findall`,data, { headers: httpHeaders })

    //    // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    // }
