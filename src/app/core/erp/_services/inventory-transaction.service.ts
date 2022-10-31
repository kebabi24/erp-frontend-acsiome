// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model

const API_URL = environment.apiUrl + "/inventory-transactions"

@Injectable()
export class InventoryTransactionService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public add(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL, data, { headers: httpHeaders })
    }
    public addRCTUNP(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/rct-unp', data, { headers: httpHeaders })
    }
    public addIssUnp(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-unp', data, { headers: httpHeaders })
    }

    public addRCTWO(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/rct-wo', data, { headers: httpHeaders })
    }
    public addIssWo(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-wo', data, { headers: httpHeaders })
    }

    public addTr(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-tr', data, { headers: httpHeaders })
    
        
    }
    public addIssChl(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-chl', data, { headers: httpHeaders })
    }
    
    // READ
    public findBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/find', data, { headers: httpHeaders })
    }
    // READ
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })
 
    }
    public getDayly(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/dayly`,data, { headers: httpHeaders })
 
    }
    // UPDATE
    public update(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders })
    }
    // DELETE
}
