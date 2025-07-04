// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model


const API_URL = environment.apiUrl + "/crm";
const COMPLAINT_DATA_URL = environment.apiUrl + "/customers/getComplaintData";
const API_GET_PHONE = environment.apiUrl + "/auth/getPhone";
const API_GET_WILAYAS_COMMUNES= environment.apiUrl + "/auth/getWilayasCommunes";
const API_CREATE_CUSTOMER_URL = environment.apiUrl + "/auth/createCustomer";

@Injectable()
export class CRMService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  

  public getCategories() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/categories`, {headers: httpHeaders});
  }

  public getTimeUnits() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/time_units`, {headers: httpHeaders});
  }

  public getEventResults() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/eventResults`, {headers: httpHeaders});
  }

  public getActionTypes() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/action_types`, {headers: httpHeaders});
  }

  public getMethods() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/methods`, {headers: httpHeaders});
  }

  public getSpecialEventConfig() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/specialEventConfig`, {headers: httpHeaders});
  }

  public getAllProfiles() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/allProfiles`, {headers: httpHeaders});
  }

  public createParam(paramHeaderData: any,paramDetails:any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/createParam`, {paramHeaderData,paramDetails}, {headers: httpHeaders});
  }

  public createExecutionLine(executionLine, eventHeader, recreateEvent) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/createExecutionLine`, {executionLine,eventHeader,recreateEvent}, {headers: httpHeaders});
  }

  public createAgendaLine(newEventData) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/createOneAgendaLine`, {newEventData}, {headers: httpHeaders});
  }

  public createPopulation(populationData: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/createPopulation`, populationData , {headers: httpHeaders});
  }


  public getEventsToday() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/getEventsByDay`, {headers: httpHeaders});
  }
  public getEvents() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/getEvents`, {headers: httpHeaders});
  }
public getEventsBy(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/getEventsBy`,data, {headers: httpHeaders});
  }
  public getCustomers(query : any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/getCustomers`,query, {headers: httpHeaders});
  }

  public getCustomerData(phone : any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/customerData/${phone}`, {headers: httpHeaders});
  }

  public getPopulations() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/getPopulations`, {headers: httpHeaders});
  }
public getParams() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/getParams`, {headers: httpHeaders});
  }
  public getPopulation(code: String) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/getPopulation/${code}`, {
      headers: httpHeaders,
    });
  }
 

  public getComplaintData(phone : any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${COMPLAINT_DATA_URL}/${phone}`, {headers: httpHeaders});
  }

  public getCRMDashboardData() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL}/getCRMDashboardData`, {headers: httpHeaders});
  }
 
  getCustomerPhone(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    return this.http.get(`${API_GET_PHONE}/${data}`,{ headers: httpHeaders });
  }

  public createAgendaEventOrderZero(category_code: any,phone:any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/createEventOrderZero`, {category_code,phone}, {headers: httpHeaders});
  }

  public createAgendaExecutionLineDetail(agendaExecutionLineDetail: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL}/createExecutionLineDetail`, {agendaExecutionLineDetail}, {headers: httpHeaders});
  }
  
  getWilayasCommunes() {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    return this.http.get(`${API_GET_WILAYAS_COMMUNES}/`,{ headers: httpHeaders });
  }

  createNewCustomer(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    return this.http.post(API_CREATE_CUSTOMER_URL, {data},{ headers: httpHeaders });
  }

  
}
