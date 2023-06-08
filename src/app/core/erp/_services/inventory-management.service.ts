// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model

const API_URL_TAG = environment.apiUrl + "/tags"
const API_URL = environment.apiUrl + "/inventory-transactions"
const API_URL_2 = environment.apiUrl + "/load-request"

@Injectable()
export class InventoryManagementService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public createPhysicalInventoryTag(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG, data, { headers: httpHeaders })
    }
    public add(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG+ '/new', data, { headers: httpHeaders })
    }
    public getTag(data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG + '/find', data, { headers: httpHeaders })
    }
    public updateTag(id, data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(API_URL_TAG +`/${id}`, data, { headers: httpHeaders }) 
    }
    public ReupdateTag(ids, data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(API_URL_TAG +`/${ids}`, data, { headers: httpHeaders }) 
    }

    public getLastIdTag(data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG + '/findlastid', data, { headers: httpHeaders })
    }
    public getGap(data){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG + '/gap', data, { headers: httpHeaders })
    }
    public freezeInventory(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG+'/freeze', data, { headers: httpHeaders })
    }
    public validateTag(data){ 
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL_TAG+'/validate', data, { headers: httpHeaders })
    }
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_TAG, { headers: httpHeaders })
    }
    public inventoryOfDate(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventoryOfDate',data, { headers: httpHeaders })
    }
    public inventoryActivity(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventoryactivity',data, { headers: httpHeaders })
    }
    public inventoryByLoc(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventorybyloc',data, { headers: httpHeaders })
    }
    public inventoryByStatus(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventorybystatus',data, { headers: httpHeaders })
    }
    public inventoryOfSecurity(data) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL +'/inventoryofsecurity',data, { headers: httpHeaders })
    }

    public getRoles(upper_role_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/findAllRoles/${upper_role_code}`, { headers: httpHeaders })
    }

    public getProductLots(ld_loc : any , ld_site : any , product_code:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/findLostProduct/`, {ld_loc:ld_loc,ld_site:ld_site,product_code:product_code},{ headers: httpHeaders })
    }

    public getLoadRequests(role_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/findAllLoadRequests10/${role_code}`, { headers: httpHeaders })
    }

    public findLoadRequestLines(load_request_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/findLoadRequestLines/${load_request_code}`, { headers: httpHeaders })
    }

    public getLoadRequestData(load_request_code : any ) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/findLoadRequestDataV2/${load_request_code}`, { headers: httpHeaders })
    }

    public createLoadRequestDetails(details : any, lines:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/createLoadRequestDetails/`, {load_request_details:details,load_request_lines:lines},{ headers: httpHeaders })
    }
    public createLoadRequestDetailsUpdateStatus(details : any, lines:any , load_request_code:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/createLoadRequestDetailsStatus/`, {load_request_details:details,load_request_lines:lines , load_request_code:load_request_code},{ headers: httpHeaders })
    }
}

