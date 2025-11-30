// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
// import { Quote } from "../_models/quote.model"

const API_URL = environment.apiUrl + "/saleorders"

@Injectable()
export class SaleOrderService {
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
    public adddirect(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/direct', data, { headers: httpHeaders })
    }
    public addceram(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/ceram', data, { headers: httpHeaders })
    }
    // READ
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/find', data, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    public getAllCeram() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/ceram', { headers: httpHeaders })
    }
    public getByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findAll`,data, { headers: httpHeaders })
    }
    public getByAllSo(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findAllso`,data, { headers: httpHeaders })
    }
    public getAllwithDetail() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/allwithdetail', { headers: httpHeaders })
    }
    public getAllwithDetailCeram() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/allwithdetailceram', { headers: httpHeaders })
    }
    public getByrange(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findrange', data, { headers: httpHeaders })
    }
    public getCustomerCA(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findca', data, { headers: httpHeaders })
    }
    public getCustomerActivity(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findactivity', data, { headers: httpHeaders })
    }
    
    // UPDATE
    public update(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`,data, { headers: httpHeaders })
    }
    public updateproj(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/project/${id}`,data, { headers: httpHeaders })
    }
    public updateSo(data:any,id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/So/${id}`,data, { headers: httpHeaders })
    }
    public updateSod(data:any,id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/Sod/${id}`,data, { headers: httpHeaders })
    }
    public getSojob(data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/allsojob',data, { headers: httpHeaders })
    }
    // DELETE
    public delete(nbr:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.delete(`${API_URL}/${nbr}`, { headers: httpHeaders })
    }
}
