// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model
import { MobileService } from "../_models/mobile-service.model";

const API_URL_SERVICE = environment.apiUrl + "/service";

@Injectable()
export class MobileServiceService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // CREATE
  public addService(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL_SERVICE, data, { headers: httpHeaders });
  }
  // READ
  public getAllService() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL_SERVICE, { headers: httpHeaders });
  }

  public getByOne(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_SERVICE}/find`, data, {
      headers: httpHeaders,
    });
  }
  public getBy(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_SERVICE}/findby`, data, {
      headers: httpHeaders,
    });
  }
  public closeService(data:any,service_code:any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    return this.http.put(`${API_URL_SERVICE}/close/${service_code}`, data, { headers: httpHeaders })
}
public   getAllServicesBy(data:any) {
  const httpHeaders = this.httpUtils.getHTTPHeaders()
  return this.http.post(`${API_URL_SERVICE}/getAllService`, data,{ headers: httpHeaders })
}   
}
