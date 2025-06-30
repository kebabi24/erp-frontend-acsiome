// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model

const API_URL = environment.apiUrl + "/banks"

@Injectable()
export class BankService {
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

    // READ
    
    public getAR(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/ar`,data, { headers: httpHeaders })
 
    }
    public getAP(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/ap`,data, { headers: httpHeaders })
 
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
    public getByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findbyall`,data, { headers: httpHeaders })
 
    }
    public getAllDetails(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findDetails`,data, { headers: httpHeaders })
 
    }
    // UPDATE
    public update(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders })
    }
    public updatedet(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/P${id}`, data, { headers: httpHeaders })
    }
    public getAllGrp(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(`${API_URL}/findbankgrp`, data, {
          headers: httpHeaders,
        });
    }

    public addBkhTransfert(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/addbkhtransfert`, data, {
        headers: httpHeaders,
    });

    }  
    public addBkhPayment(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(`${API_URL}/addbkhpayment`, data, {
            headers: httpHeaders,
        });
    }
    public addBkhPaymentDetail(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(`${API_URL}/addbkhpaymentdet`, data, {
            headers: httpHeaders,
        });
    }
    public addBkhTransfertC(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(`${API_URL}/addbkhtransfertc`, data, {
            headers: httpHeaders,
        });
    // DELETE
    }
    public addBkhTransfertCDet(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(`${API_URL}/addbkhtransfertcdet`, data, {
            headers: httpHeaders,
        });
    // DELETE
    }
    public getBKHBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findbkh`,data, { headers: httpHeaders })
 
    }
   
    public getBKHTrBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findbkhtr`,data, { headers: httpHeaders })
 
    } 
    public getBKHGrpTrBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findbkhgrptr`,data, { headers: httpHeaders })
 
    } 
    public getBKHTrGrp(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findbkhtrgrp`,data, { headers: httpHeaders })
 
    } 
    public getBKTr(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findtrbk`,data, { headers: httpHeaders })
 
    }
    public getTransfertBy() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/findtransfert', { headers: httpHeaders })
    }
    public getBKHRCTBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findbkhrct`,data, { headers: httpHeaders })
 
    }
    
}
