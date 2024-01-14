// Angular
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model
import { Label } from "../_models/label.model";
import { Observable } from "rxjs";
const API_URL = environment.apiUrl + "/labels";

@Injectable()
export class LabelService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // CREATE
  public add(label: Label): Observable<Blob> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL, label, { responseType: "blob", headers: httpHeaders });
  }

  public addProd(label: Label) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/prod`, label, { headers: httpHeaders });
  }
  public addPAL(label: Label) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/prodpal`, label, { headers: httpHeaders });
  }
  public Allocation(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/allocation`, data, { headers: httpHeaders });
  }

  // READ
  // READ
  getPdf(data: any): Observable<Blob> {
    const headers = new HttpHeaders({
      "Content-Type": "application/pdf",
    });

    return this.http.post(`${API_URL}/get-pdf`, data, {
      responseType: "blob",
      headers,
    });
  }
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

    // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
  }
  public getByAll(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/findby`, data, { headers: httpHeaders });

    // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
  }
  // UPDATE
  public update(data: any, id: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders });
  }
  public updatelist(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/upd`, data, { headers: httpHeaders });
  }
  // DELETE
}
