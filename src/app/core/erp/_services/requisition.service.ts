// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model

const API_URL = environment.apiUrl + "/requisitions"

@Injectable()
export class RequisitionService {
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
    public findBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/find', data, { headers: httpHeaders })
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    public getByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findAll`,data, { headers: httpHeaders })
    }
    public getNotByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findNotAll`,data, { headers: httpHeaders })
    }
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    public getAllApp() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findapp`, { headers: httpHeaders })
    }
    public getAllAppDet() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findappdet`, { headers: httpHeaders })
    }
    // UPDATE
    public update(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders })
    }
    public updatedet(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/URQD/${id}`, data, { headers: httpHeaders }) 
    }
    public updaterqd(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/RQD/${id}`, data, { headers: httpHeaders })
    }
    // READ
    public findByDet(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/finddet', data, { headers: httpHeaders })
    }
    public getAllUser() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findalluser`, { headers: httpHeaders })
    }
    // DELETE
    public delete(nbr:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.delete(`${API_URL}/${nbr}`, { headers: httpHeaders })
    }
}
