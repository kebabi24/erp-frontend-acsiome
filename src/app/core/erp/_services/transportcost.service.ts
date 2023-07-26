// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Transportcost } from "../_models/transportcost.model"
const API_URL = environment.apiUrl + "/transportcosts"

@Injectable()
export class TransportcostService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public add(trc: Transportcost) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL, trc, { headers: httpHeaders })
    }

    // READ
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

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        

    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findone`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        

    }
    
    // UPDATE
    public update(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders })
    }
   
    // DELETE
}
