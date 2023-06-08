// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
// import { Item } from "../_models/item.model"

const API_URL = environment.apiUrl + "/unload-request"
const API_URL_2 = environment.apiUrl + "/unload-request"

@Injectable()
export class UnloadRequestService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    

    
    // USE  
    public getRoles(upper_role_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findAllRoles/${upper_role_code}`, { headers: httpHeaders })
    }

    // USE
    public getUnloadRequests(role_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findAllUnloadRequests/${role_code}`, { headers: httpHeaders })
    }

    // USE
    public getUnloadRequests10(role_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findAllUnloadRequests10/${role_code}`, { headers: httpHeaders })
    }
    

    // USED
    public getUnloadRequestData(unload_request_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findUnloadRequestData/${unload_request_code}`, { headers: httpHeaders })
    }

    public getLoadRequest20Details(load_request_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findLoadRequest20Details/${load_request_code}`, { headers: httpHeaders })
    }

    // USE 
    public updateUnloadRequestStatus10(unload_request_code : any, unload_request_data: any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/updateUnloadRequest10/`, {unload_request_code,unload_request_data},{ headers: httpHeaders })
    }

    public updateUnloadRequestStatus20(unload_request_code : any, unload_request_data: any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/updateUnloadRequest20/`, {unload_request_code,unload_request_data},{ headers: httpHeaders })
    }

   
}
