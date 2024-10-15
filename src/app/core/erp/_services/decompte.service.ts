// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"



const API_URL = environment.apiUrl + "/decomptes"


@Injectable()
export class DecompteService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findrange`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    // UPDATE
    
}
