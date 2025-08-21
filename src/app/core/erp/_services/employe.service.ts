// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Employe } from "../_models/employe.model"

const API_URL = environment.apiUrl + "/employes"
const API_URL_EmpTime = environment.apiUrl + "/employe-times"
const API_URL_EmpSalary = environment.apiUrl + "/employe-salarys"


@Injectable()
export class EmployeService {
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
    public addC(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/C`, data, { headers: httpHeaders })
    }
    public addPoint(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_EmpTime}/C`, data, { headers: httpHeaders })
    }
    // READ 
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    public getAllTime() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_EmpTime, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    public getByCycle(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findcycle`,data, 
        { headers: httpHeaders }
        )
    

        
        
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, 
        { headers: httpHeaders }
        )
    

        
        
    }
    public getByReq(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findreq`,data, 
        { headers: httpHeaders }
        )
    }
    public getTrBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/tr`,data, 
        { headers: httpHeaders }
        )

        
        
    }
    public getChild(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/child`,data, 
        { headers: httpHeaders }
        )
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findOne`,data, 
        { headers: httpHeaders }
        )

        
        
    }
    public getByTime(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findtime`,data, { headers: httpHeaders })

        
        
    }
    public getByTimeProject(data: any) { 
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findtimeproject`,data, { headers: httpHeaders })

        
        
    }
    public getByDet(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/finddet`,data, { headers: httpHeaders })  
    }
    
    public getByJob(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findjob`,data, { headers: httpHeaders })  
    }
    // UPDATE
    public update(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`,data, { headers: httpHeaders })
    }
    // DELETE
    public delete(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    public addTime(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_EmpTime, data, { headers: httpHeaders })
    }
    public GetSalary(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_EmpTime}/findsalary`, data, { headers: httpHeaders })
    }
    public addSalary(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_EmpSalary, data, { headers: httpHeaders })
    }
}
