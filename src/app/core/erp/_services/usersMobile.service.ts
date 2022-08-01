// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { ProfileMobile } from '../_models/profile-mobile.model'
import { UserMobile } from '../_models/user-mobile.model'

const API_URL_PROFILE = environment.apiUrl + "/profiles-mobile"
const API_URL_USER = environment.apiUrl + "/users-mobile"


@Injectable()
export class UsersMobileService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public addProfile(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_PROFILE, data, { headers: httpHeaders })
    }
    public getProfile(id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_PROFILE+'/'+id, { headers: httpHeaders })
    }
    public addUser(user: UserMobile) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_USER, user, { headers: httpHeaders })
    }

    public getAllProfiles() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_PROFILE, { headers: httpHeaders })
    }
    public updateProfile(data,id) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(API_URL_PROFILE + '/'+ id,data , { headers: httpHeaders })
    }
    public getAllUsers() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_USER, { headers: httpHeaders })
    }
    public getOne(user_mobile_code: String) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_USER}/${user_mobile_code}`, { headers: httpHeaders })
    }

    public getOneProfile(profile_code: String) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_PROFILE}/${profile_code}`, { headers: httpHeaders })
    }

    public update(user_mobile_code: String, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL_USER}/${user_mobile_code}`,data, { headers: httpHeaders })
    }
    // public updated(id: Number, data:any) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.put(`${API_URL_USER}/up${id}`,data, { headers: httpHeaders })
    // }
    public updateP(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL_PROFILE}/${id}`,data, { headers: httpHeaders })
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_USER}/find`,data, { headers: httpHeaders })   
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_USER}/findone`,data, { headers: httpHeaders })   
    }
    public getByOneP(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_PROFILE}/findone`,data, { headers: httpHeaders })   
    }

    public getMenuByProfile(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_PROFILE}/findmenu`,data, { headers: httpHeaders })   
    }
    
}
