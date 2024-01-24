import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { HttpUtilsService } from "../../_base/crud";
import { Itinerary } from "../_models/itinerary.model";
import { environment } from "src/environments/environment";

const API_ITINERARY = environment.apiUrl + "/itinerary";
const API_ITINERARY_ROLE = environment.apiUrl + "/role-itinerary";
@Injectable()
export class ItineraryService {
  httpOptions = this.httpUtils.getHTTPHeaders();
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // CREATE
  public addItinerary(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_ITINERARY, data, { headers: httpHeaders });
  }

  public getItinerary(id: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_ITINERARY + "/" + id, { headers: httpHeaders });
  }

  public getAllItinerary() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_ITINERARY, { headers: httpHeaders });
  }
  public updateItinerary(id, data) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(`${API_ITINERARY}/${id}`, data, { headers: httpHeaders });
  }

  public getOne(id: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_ITINERARY}/${id}`, { headers: httpHeaders });
  }
  public getBySomething(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_ITINERARY_ROLE}/getItineraryOfRoles`, data, { headers: httpHeaders });
  }
  public getItineraryByRole(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_ITINERARY_ROLE}/find`, data, { headers: httpHeaders });
  }

  public updated(id: Number, data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(`${API_ITINERARY}/up${id}`, data, { headers: httpHeaders });
  }
  public getBy(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_ITINERARY}/find`, data, { headers: httpHeaders });
  }
  public getByOne(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_ITINERARY}/findone`, data, { headers: httpHeaders });
  }
}
