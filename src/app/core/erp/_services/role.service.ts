// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Role } from '../_models/role.model'
import { UserMobile } from '../_models/user-mobile.model'
import { RoleItinerary } from '../_models/role-itinerary.model'

const API_URL_ROLE = environment.apiUrl + "/roles"
const API_URL_USER = environment.apiUrl + "/users-mobile"
const API_ROLE_ITINERARY = environment.apiUrl + "/role-itinerary"


@Injectable()
export class RoleService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public addRole(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        console.log(data)
        return this.http.post(API_URL_ROLE, data, { headers: httpHeaders })
    }

    public addRoleItinerary(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        console.log(data)
        return this.http.post(API_ROLE_ITINERARY, data, { headers: httpHeaders })
        
    }


    public updateRole(data,id) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(API_URL_ROLE + '/'+ id,data , { headers: httpHeaders })
    }
    public getAllUsers() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_USER, { headers: httpHeaders })
    }

    public getAllRoles(){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_ROLE, {headers: httpHeaders })
    }

    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_USER}/${id}`, { headers: httpHeaders })
    }

    public updated(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL_ROLE}/up${id}`,data, { headers: httpHeaders })
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_USER}/find`,data, { headers: httpHeaders })   
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_ROLE}/findone`,data, { headers: httpHeaders })   
    }
    
}
