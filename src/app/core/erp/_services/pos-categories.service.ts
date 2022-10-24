// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model
import { Category } from "../_models/pos-categories.model";
import { Observable } from "rxjs";
import { Product } from "../_models/pos-products.model";
import { D } from "@angular/cdk/keycodes";

const API_URL = environment.apiUrl + "/pos-category";
const API_URL_ORDER = environment.apiUrl + "/pos-order";
const API_URL_ORDER_DETAIL = environment.apiUrl + "/pos-order";
const API_URL_SUPP = environment.apiUrl + "/items";
const API_URL_ITEMS = environment.apiUrl + "/items";
const API_URL_WO = environment.apiUrl + "/work-orders";
const API_URL_ISSWO = environment.apiUrl + "/inventory-transactions";
const API_URL_INV = environment.apiUrl + "/inventory-transactions";
const API_URL_ISSSO = environment.apiUrl + "/saleorders";
const API_URL_WOD = environment.apiUrl + "/work-order-details";
const API_URL_BOM = environment.apiUrl + "/bom-parts";
const API_URL_LD = environment.apiUrl + "/location-details";
const API_URL_TAG = environment.apiUrl + "/tags";
const API_URL_CODE = environment.apiUrl + "/codes";
const API_URL_SEQ = environment.apiUrl + "/sequences";
const API_URL_PO = environment.apiUrl + "/purchase-orders";
const API_URL_PR = environment.apiUrl + "/purchase-receives";
const API_URL_BK = environment.apiUrl + "/banks";
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
  public getPoRec(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_PO}/findAllpodRec`, data, {
      headers: httpHeaders,
    });
  }
  public getBank(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_BK}/findBk`, data, {
      headers: httpHeaders,
    });
  }

  public getAllProducts() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL_ITEMS, { headers: httpHeaders });
  }

  public getOneProduct(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_ITEMS}/findone`, data, {
      headers: httpHeaders,
    });
  }

  public getAllOrders() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL_ORDER, { headers: httpHeaders });
  }

  public getOneOrder(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_ORDER}/findorder`, data, {
      headers: httpHeaders,
    });
  }

  public getWod(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_WOD}/find`, data, {
      headers: httpHeaders,
    });
  }

  public getOne(id: Number) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders });
  }

  public getLastOneSeq(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_SEQ}/findone`, data, {
      headers: httpHeaders,
    });
  }
  public getBy(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/find`, data, { headers: httpHeaders });
  }

  public getByCode(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_CODE}/find`, data, {
      headers: httpHeaders,
    });
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

  public updateSeq(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_SEQ}/update`, data, {
      headers: httpHeaders,
    });
  }
  // DELETE
  public delete(id: Number) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders });
  }
  // create ld
  public createld(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_LD}/createldpos`, data, {
      headers: httpHeaders,
    });
  }

  //Create new card
  public createPosWorkOrder(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_WO}/createwopos`, data, {
      headers: httpHeaders,
    });
  }
  public createPosWorkOrderDetail(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_WOD}/createwodpos`, data, {
      headers: httpHeaders,
    });
  }

  public createIssWo(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_ISSWO}/iss-wo`, data, {
      headers: httpHeaders,
    });
  }
  public createInventory(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(API_URL_INV, data, {
      headers: httpHeaders,
    });
  }

  public checkInventory(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_INV}/cyc-cnt`, data, {
      headers: httpHeaders,
    });
  }

  public createIssSo(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_INV}/iss-so`, data, {
      headers: httpHeaders,
    });
  }

  public createRctPo(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_PR}/rct-po`, data, {
      headers: httpHeaders,
    });
  }

  public createBkBkh(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post(`${API_URL_BK}/bk`, data, {
      headers: httpHeaders,
    });
  }

  public getOneWorkOrder(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_WO}/findone`, data, {
      headers: httpHeaders,
    });
  }

  //get all
  public getAllProductInventory(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_LD}/find`, data, {
      headers: httpHeaders,
    });
  }

  search(data: any): Observable<Object> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    let apiURL = `${API_URL_CODE}/find`;
    return this.http.post(apiURL, data, {
      headers: httpHeaders,
    });
  }
}
