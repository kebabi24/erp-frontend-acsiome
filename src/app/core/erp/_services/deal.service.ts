// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
// model
import { Deal } from "../_models/deal.model";

const API_URL = environment.apiUrl + "/deals";

@Injectable()
export class DealService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  public add(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const headers = { "Content-Type": "multipart/form-data" }; // Set the Content-Type header to multipart/form-data
    return this.http.post(API_URL, data);
  }
  // READ
  public getAll() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL, { headers: httpHeaders });
  }
  public getOne(id: Number) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders });
  }
  public getBy(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/find`, data, { headers: httpHeaders });
  }
  public getByOne(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/findOne`, data, { headers: httpHeaders });
  }
  // UPDATE
  public update(id: Number, data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders });
  }
  // DELETE
  public delete(id: Number) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders });
  }
}
