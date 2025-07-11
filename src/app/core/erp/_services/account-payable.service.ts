// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model

const API_URL = environment.apiUrl + "/account-payables"
                                         

@Injectable()
export class AccountPayableService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public add(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/P`, data, { headers: httpHeaders })
    }
    public addFC(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/FC`, data, { headers: httpHeaders })
    }
    public addNote(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/note`, data, { headers: httpHeaders })
    }
    public addUp(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/UP`, data, { headers: httpHeaders })
    }
    // READ
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/find`, data, { headers: httpHeaders })
    }
    public getByWithAdress(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/findwithadress`, data, { headers: httpHeaders })
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/findOne`, data, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    public getByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findAll`,data, { headers: httpHeaders })
    }
    public getAllwithDetail() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/allwithdetail', { headers: httpHeaders })
    }
    // UPDATE
    public update(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders })
    }
    public   getAllPaymentBy(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getallpaymentby/`, data,{ headers: httpHeaders })
    }
    public   getAllInvoiceBy(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getallinvoiceby/`, data,{ headers: httpHeaders })
    }
    public getByRange(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+`/range`, data, { headers: httpHeaders })
    }
    // DELETE
}
