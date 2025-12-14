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

  
    

    public findSpecificationByCode(specification_code: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findOneSpecificationByCode/${specification_code}`, { headers: httpHeaders })
   
    }




    public findSpecificationsBy(query : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findSpecificationsBy/`, {query}, { headers: httpHeaders })
    }

    public findInspectionRoutesBy(query : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findInspectionRoutesBy/`, {query}, { headers: httpHeaders })
    }


    

    public createStandardSpecification(standardSpecificationHeader : any,standardSpecificationDetails:any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createSpecification/`, {standardSpecificationHeader,standardSpecificationDetails}, { headers: httpHeaders })
    }

    public createTestHistory(testsHistory : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createTestsHistory/`, {testsHistory}, { headers: httpHeaders })
    }
    public GetTestHistory(testsHistory : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/GetTestsHistory/`, {testsHistory}, { headers: httpHeaders })
    }

    public findSpecificationWithDetails(specification_code: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findSpecificationWithDetails/${specification_code}`, { headers: httpHeaders })
   
    }

    public findDocumentTriggers() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/docTriggers/`, { headers: httpHeaders })
   
    }

    public getSpecTestResults(query : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getSpecTestResults/`, {query}, { headers: httpHeaders })
    }

    public getSpeficitaion(query : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/getSpecification/`, {query}, { headers: httpHeaders })
    }

    public findInspectionRouting(query : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findInspectionRouting/`, {query}, { headers: httpHeaders })
    }

    public findItemSpecificationDetails(query : any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findItemSpecificationDetails/`, {query}, { headers: httpHeaders })
    }


    public createIpAndIpds(ipData : any,ipdsData:any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createIpAndIpds/`, {ipData,ipdsData}, { headers: httpHeaders })
    }

    public createQroAndQps(qroData : any,qpsData:any ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createQroAndQps/`, {qroData,qpsData}, { headers: httpHeaders })
    }
    


    public getAllGammes( ){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/getAllGammes/`, { headers: httpHeaders })
    }
    
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })
 
    }
    
    
    
}
