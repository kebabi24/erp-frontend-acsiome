// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { MenuMobile } from "../_models/mobile-menu.model"

const API_URL_MENU = environment.apiUrl + "/mobile-menu"

@Injectable()
export class MobileMenuService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public addMenu(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_MENU, data, { headers: httpHeaders })
    }
    // READ 
    public getAllMenu() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_MENU, { headers: httpHeaders })
    }

    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_MENU}/findone`,data, { headers: httpHeaders })   
    }
  
}
