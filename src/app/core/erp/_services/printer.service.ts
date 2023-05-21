import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model
import { PrinterModel } from "../_models/printerModel.model";
const API_URL = environment.apiUrl + "/printers";

@Injectable()
export class PrintersService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // CREATE
  public add(data: PrinterModel) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    console.log(data);
    return this.http.post(API_URL, data, { headers: httpHeaders });
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

    // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
  }
  public getBySpec(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/findspec`, data, { headers: httpHeaders });

    // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
  }
  public getPrice(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/price`, data, { headers: httpHeaders });

    // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
  }
  // UPDATE
  public update(data: any, id: String) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders });
  }
  // DELETE
  public delete(id: Number) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders });
  }
}
