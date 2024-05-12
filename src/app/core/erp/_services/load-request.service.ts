// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model
// import { Item } from "../_models/item.model"

const API_URL = environment.apiUrl + "/load-request";
const API_URL_2 = environment.apiUrl + "/load-request";

@Injectable()
export class LoadRequestService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // GET PRODUCT PAGE BY CODE
  public getProductPageByCode(product_page_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findOneByCode/${product_page_code.product_page_code}`, { headers: httpHeaders });
  }

  public getLoadRequestInfo(load_request_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/getLoadRequestInfo/${load_request_code}`, { headers: httpHeaders });
  }

  public getLoadRequestLineInfo(load_request_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/getLoadRequestLineInfo/${load_request_code}`, { headers: httpHeaders });
  }

  // CREATE PRODUCT PAGE
  public createProductPage(productPage: any, productsCodes: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_2}/createProductPage/`, { productPage, productsCodes }, { headers: httpHeaders });
  }

  // GET ALL PRODUCT PAGES
  public getAllProductPages() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/`, { headers: httpHeaders });
  }

  // UPDATE PROFILE PRODUCT PAGES
  public updateProfileProductPages(profile_code: any, pagesCodes: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_2}/updateProfileProductsPages`, { profile_code: profile_code, pagesCodes: pagesCodes }, { headers: httpHeaders });
  }

  public getRoles(upper_role_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/findAllRoles/${upper_role_code}`, { headers: httpHeaders });
  }

  public getLoadRequests(role_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/findAllLoadRequests/${role_code}`, { headers: httpHeaders });
  }
  public getLoadRequests20() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/findAllLoadRequests20/}`, { headers: httpHeaders });
  }

  // public getLoadRequests20(role_code : any ) {
  //     const httpHeaders = this.httpUtils.getHTTPHeaders()
  //     return this.http.get(`${API_URL}/findAllLoadRequests20/${role_code}`, { headers: httpHeaders })
  // }

  public getLoadRequestData(load_request_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/findLoadRequestData/${load_request_code}`, { headers: httpHeaders });
  }

  public getLoadRequestDataByRole(role_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/findLoadRequestCreationDataRole/${role_code}`, { headers: httpHeaders });
  }

  public getLoadRequestCreationData() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/findLoadRequestCreationData`, { headers: httpHeaders });
  }

  public getLoadRequest20Details(load_request_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/findLoadRequest20Details/${load_request_code}`, { headers: httpHeaders });
  }

  public updateLoadRequestStatus10(load_request_code: any, load_request_data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/updateLoadRequest/`, { load_request_code, load_request_data }, { headers: httpHeaders });
  }

  public updateLoadRequestsStatus40(load_requests_codes: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/updateLoadRequest40/`, { load_requests_codes }, { headers: httpHeaders });
  }

  public createLoadRequestAndLines(loadRequest: any, lines: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/createLoadRequestAndLines/`, { loadRequest, lines }, { headers: httpHeaders });
  }

  public getLoadRequestsBetweenDates(startDate: any, endDate: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/findLoadRequestsDates/`, { startDate, endDate }, { headers: httpHeaders });
  }

  public getLoadRequestLinesDetails(load_request_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findLoadRequestLinesDetails/${load_request_code}`, { headers: httpHeaders });
  }

  public getLoadRequestsLineDiff(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/LoadRequestLinesdif/`, data, { headers: httpHeaders });
  }
  public getLoadRequestsLineWithCode(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
//    console.log(data);
    return this.http.post(`${API_URL}/getLoadRequestWithCode/`, data, { headers: httpHeaders });
  }
}
