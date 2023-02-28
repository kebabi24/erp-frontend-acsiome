// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Customer } from "../_models/customer.model"

const API_URL = environment.apiUrl + "/customers"
const CRM_URL = environment.apiUrl + "/crm";
const API_GET_PHONE = environment.apiUrl + "/auth/getPhone";
const API_GET_WILAYAS_COMMUNES= environment.apiUrl + "/auth/getWilayasCommunes";

@Injectable()
export class CustomerService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public add(customer: Customer) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL, customer, { headers: httpHeaders })
    }

    // CREATE COMPLAINT
    public createComplaint(complaintData : any, complaintDetailsData: any , customerData:any) {
        console
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createComplaint`, {complaintData,complaintDetailsData,customerData}, { headers: httpHeaders })
    }


    public getCustomer(phone: String) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/getCustomer/${phone}`, { headers: httpHeaders })
    }

    // CORRECT ONE AT THE MOMENT 
    public getCustomerPhone(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_GET_PHONE}/${data}`,{ headers: httpHeaders });
    }

    public getOrder(order_code: String) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/getOrder/${order_code}`, { headers: httpHeaders })
    }

    public getReclamationCauses() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/getReclamationCauses`, { headers: httpHeaders })
    }

    // CREATE SATISFACTION
    public createSatisfaction(satisfactionData : any, complaintDetailsData: any ) {
        console
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createSatisfaction`, {satisfactionData,complaintDetailsData}, { headers: httpHeaders })
    }

    // READ
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
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
    public getSolde(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findsolde`,data, { headers: httpHeaders })
    }    
    public getByAll(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findall`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
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

    public getMethods() {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(`${CRM_URL}/methods`, {headers: httpHeaders});
      }

      getWilayasCommunes() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_GET_WILAYAS_COMMUNES}/`,{ headers: httpHeaders });
      }
    
}
