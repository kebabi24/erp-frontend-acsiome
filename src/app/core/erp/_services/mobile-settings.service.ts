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
    public   getAllInvoicesAcc(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllInvoicesAcc/`, data,{ headers: httpHeaders })
    }
    public   getAllInvoicesLine(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getInvoiceLines/`, data,{ headers: httpHeaders })
    }

    public   getAllInvoicesLineAcc(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getInvoiceLinesAcc/`, data,{ headers: httpHeaders })
    }

    public   getAllInvoicesDet(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllInvoicesdet/`,data,{ headers: httpHeaders })
        //return this.http.post(API_URL+'/getAllInvoicesdet', { headers: httpHeaders })
    }
    public   getAllInvoicesDetAcc(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllInvoicesdetAcc/`,data,{ headers: httpHeaders })
        //return this.http.post(API_URL+'/getAllInvoicesdet', { headers: httpHeaders })
    }
    public   getAllInvoicesDetInv(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllInvoicesdetInv/`,data,{ headers: httpHeaders })
        //return this.http.post(API_URL+'/getAllInvoicesdet', { headers: httpHeaders })
    }
    public   getAllInvoicesDetRole(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllInvoicesdetrole/`,data,{ headers: httpHeaders })
        //return this.http.post(API_URL+'/getAllInvoicesdet', { headers: httpHeaders })
    }
    public   getAllPayment(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllPayment/`, data,{ headers: httpHeaders })
    }   
    public   getAllPaymentByRole(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllPaymentByRole/`, data,{ headers: httpHeaders })
    }   
    public   getAllPaymentService(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllPaymentService/`, data,{ headers: httpHeaders })
    }   
    
    public   getAllVisites(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllVisit/`, data,{ headers: httpHeaders })
    }   
    public   getAllVisitesRole(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllVisitrole/`, data,{ headers: httpHeaders })
    }
    public createCancelationReasons(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/createCancelReasons/`, {data},{ headers: httpHeaders })
    }

    public createPaymentMethods(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/createPaymentMethods/`, {data},{ headers: httpHeaders })
    }
    public getPriceList(code: any,) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(`${API_URL_2}/getPriceList/${code}`, { headers: httpHeaders });
    }

    public createPriceList(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/createPriceList/`, {data},{ headers: httpHeaders })
    }
    public getAllPriceList() {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(`${API_URL_2}/getPriceList`, { headers: httpHeaders });
    }
    public   getAllInvoicesRole(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllInvoicesRole/`, data,{ headers: httpHeaders })
    }
    public   getAllCreditsRole(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllCreditsRole/`, data,{ headers: httpHeaders })
    }
    public   getAllCredits(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getAllCredits/`, data,{ headers: httpHeaders })
    }
    public   getAllCA(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findallca/`, data,{ headers: httpHeaders })
    }
    public getSalesRole(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getsalesrole/`,data,{ headers: httpHeaders })
        //return this.http.post(API_URL+'/getAllInvoicesdet', { headers: httpHeaders })
    }
    public   getSalesType(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findsalestype/`, data,{ headers: httpHeaders })
    }
    public GetProfileProductPage(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/findppprofile/`, data,{ headers: httpHeaders })
    }
    public getRolesSales(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findallsalesrole/`,data,{ headers: httpHeaders })
        //return this.http.post(API_URL+'/getAllInvoicesdet', { headers: httpHeaders })
    }
}