// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model
import { Category } from "../_models/pos-categories.model";

const API_URL = environment.apiUrl + "/pos-category";
const API_URL_ORDER = environment.apiUrl + "/pos-order";
const API_URL_SUPP = environment.apiUrl + "/items";
const API_URL_WO = environment.apiUrl + "/work-orders";
const API_URL_BOM = environment.apiUrl + "/bom-parts";
const API_URL_LD = environment.apiUrl + "/location-details";
const API_URL_TAG = environment.apiUrl + "/tags";

@Injectable()
export class PosCategoryService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // CREATE
  public add(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL, data, { headers: httpHeaders });
  }
  // CREATE ORDER
  public addOrder(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL_ORDER, data, { headers: httpHeaders });
  }
  // READ
  public getAll() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL, { headers: httpHeaders });
  }

  public getAllOrders() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL_ORDER, { headers: httpHeaders });
  }

  public getOne(id: Number) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders });
  }
  public getBy(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/find`, data, { headers: httpHeaders });
  }

  public getLd(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_LD}/findone`, data, {
      headers: httpHeaders,
    });
  }

  public getBySupp(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_SUPP}/findsupp`, data, {
      headers: httpHeaders,
    });
  }

  public getByItems(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_SUPP}/findsupp`, data, {
      headers: httpHeaders,
    });
  }

  public getByOne(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/findOne`, data, { headers: httpHeaders });
  }

  public getByOneBom(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_BOM}/find`, data, {
      headers: httpHeaders,
    });
  }

  // UPDATE
  public update(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/update`, data, { headers: httpHeaders });
  }
  // DELETE
  public delete(id: Number) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders });
  }
  // create ld
  public createld(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    console.log(data);
    return this.http.post(`${API_URL_LD}/createldpos`, data, {
      headers: httpHeaders,
    });
  }

  //Create new card
  public createPosWorkOrder(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    console.log(data);
    return this.http.post(`${API_URL_WO}/createwopos`, data, {
      headers: httpHeaders,
    });
  }

  //get all
  public getAllProductTag() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL_TAG, { headers: httpHeaders });
  }
}
