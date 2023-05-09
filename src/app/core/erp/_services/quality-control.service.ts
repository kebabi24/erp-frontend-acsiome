// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Site } from "../_models/site.model"

const API_URL = environment.apiUrl + "/qualityControl"

@Injectable()
export class QualityControlService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    // public add(site: Site) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.post(API_URL, site, { headers: httpHeaders })
    // }

    public findSpecificationByCode(specification_code: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findOneSpecificationByCode/${specification_code}`, { headers: httpHeaders })
   
    }

    public createStandardSpecification(standardSpecificationHeader : any,standardSpecificationDetails:any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createSpecification/`, {standardSpecificationHeader,standardSpecificationDetails}, { headers: httpHeaders })
    }

    public createTestHistory(testsHistory : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createTestsHistory/`, {testsHistory}, { headers: httpHeaders })
    }

    public findSpecificationWithDetails(specification_code: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findSpecificationWithDetails/${specification_code}`, { headers: httpHeaders })
   
    }

    public findDocumentTriggers() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/docTriggers/`, { headers: httpHeaders })
   
    }
    
    
}
