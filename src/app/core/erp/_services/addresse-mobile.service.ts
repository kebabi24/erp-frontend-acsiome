// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { AddresseMobile } from "../_models/addresse-mobile.model"

const API_URL = environment.apiUrl + "/addresses-mobile"

@Injectable()
export class AddresseMobileService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public addAddress(address: AddresseMobile) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        // console.log(address)
        return this.http.post(API_URL, address, { headers: httpHeaders })
    }
    // READ
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })

        return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }

    // UPDATE
    public update(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`,data, { headers: httpHeaders })
    }
    // DELETE
}
