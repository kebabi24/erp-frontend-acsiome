// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model

const API_URL = environment.apiUrl + "/projects"
const API_URL_SPECIFICATIONS = environment.apiUrl + "/qualityControl/findSpecifications"
const API_URL_SPECIFICATION_DATA = environment.apiUrl + "/qualityControl/findSpecificationWithDetails"
const API_URL_PROJECT_TYPE = environment.apiUrl + "/projects/projectTypes"
const API_URL_TESTS_HISTORY = environment.apiUrl + "/qualityControl/createTestsHistory"
const API_URL_SITES = environment.apiUrl + "/sites/"
const API_URL_EMPS_BY_SITE = environment.apiUrl + "/employes/find"

@Injectable()
export class ProjectService {
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
    // READ
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }

    public getSpecifications() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_SPECIFICATIONS, { headers: httpHeaders })
    }

    public getAllSites() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_SITES, { headers: httpHeaders })
    }

    public getEmployeesBySite(site_code : any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_EMPS_BY_SITE,site_code, { headers: httpHeaders })
    }

    public getProjectTypes() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_PROJECT_TYPE, { headers: httpHeaders })
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
    public getByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findall`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }

    public getByAssetDownTypes() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/assetDownTypes`, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getByDet(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/finddet`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getByTask(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findtask`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    // UPDATE
    public update(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders })
    }
    public updateM(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/M${id}`, data, { headers: httpHeaders })
    }
    public getAllwithDetail() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/allwithdetail', { headers: httpHeaders })
    }
    public getAllbomDetail() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/allbomdetail', { headers: httpHeaders })
    }
    public getAllPmdetail() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL+'/allpmdetail', { headers: httpHeaders })
    }

    public getSpecificationData(specification_code: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_SPECIFICATION_DATA}/${specification_code}`, { headers: httpHeaders })
    }
    

    public getEmpProject(project_code: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/findAssignedEmps/${project_code}`, { headers: httpHeaders })
    }

    public createTestsHistory(testsHistory: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TESTS_HISTORY, {testsHistory}, { headers: httpHeaders })
    }

    public createAssetDown(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createAsset`, {data}, { headers: httpHeaders })
    }
}
