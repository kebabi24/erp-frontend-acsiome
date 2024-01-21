import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";

import { CustomerMobile } from "../_models/customer-mobile.model";
const API_URL_CUSTOMER = environment.apiUrl + "/customers-mobile";
const API_URL_2 = environment.apiUrl + "/customers-mobile";
const API_URL = environment.apiUrl + "/codes";

@Injectable()
export class CustomerMobileService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  public addCustomerMobile(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL_CUSTOMER, data, { headers: httpHeaders });
  }
  public getByOne(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_CUSTOMER}/findone`, data, { headers: httpHeaders });
  }

  public getAllCustomers() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_URL_CUSTOMER, { headers: httpHeaders });
  }

  public getBy() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_CUSTOMER}/find`, { headers: httpHeaders });
  }

  public getBySomething(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_CUSTOMER}/getCustomersOfItinerary`, data, { headers: httpHeaders });
  }

  public getOne(customer_code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_CUSTOMER}/${customer_code}`, { headers: httpHeaders });
  }

  public update(id: any, data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.put(`${API_URL_CUSTOMER}/${id}`, data);
  }

  // GET CLUSTER BY CODE
  public getClusterByCode(code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findCluster/${code.code}`, { headers: httpHeaders });
  }

  // GET CLUSTER BY CODE
  public getCreateCustomerData() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    console.log("hediiiiiiiiiii");
    return this.http.post(`${API_URL_2}/getDataCreateCustomer/`, { headers: httpHeaders });
  }

  // CREATE CLUSTER
  public createCluster(cluster: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_2}/createCluster/`, cluster, { headers: httpHeaders });
  }

  // DELETE CLUSTER
  public deleteCluster(clusterId: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL_2}/deleteCluster/${clusterId.clusterId}`, { headers: httpHeaders });
  }

  // DELETE CATEGORY
  public deleteCategory(categoryId: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL_2}/deleteCategory/${categoryId.categoryId}`, { headers: httpHeaders });
  }

  // DELETE CATEGORY
  public deleteSubCluster(subClusterId: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL_2}/deleteSubCluster/${subClusterId.subClusterId}`, { headers: httpHeaders });
  }

  // DELETE CATEGORY TYPE
  public deleteCategoryType(categoryTypeId: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.delete(`${API_URL_2}/deleteCategoryType/${categoryTypeId.categoryTypeId}`, { headers: httpHeaders });
  }

  // GET CATEGORY BY CODE
  public getCategoryByCode(code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findCategory/${code.code}`, { headers: httpHeaders });
  }

  // CREATE CATEGORY
  public createCategory(category: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_2}/createCategory/`, category, { headers: httpHeaders });
  }

  // GET SUB CLUSTER BY CODE
  public getSubClusterByCode(code: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findSubCluster/${code.code}`, { headers: httpHeaders });
  }

  // CREATE SUB CLUSTER
  public createSubCluster(sub_cluster: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_2}/createSubCluster/`, sub_cluster, { headers: httpHeaders });
  }

  // GET ALL CLUSTERS
  public getAllClusters() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findAllClusters/`, { headers: httpHeaders });
  }

  // GET ALL SUB CLUSTERS
  public getAllSubClusters() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findAllSubClusters/`, { headers: httpHeaders });
  }

  // CREATE CATEGORY TYPE
  public createCategoryType(category_type: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_2}/createCategoryType/`, category_type, { headers: httpHeaders });
  }

  // GET ALL CATEGORIES
  public getAllCategories() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findAllCategories/`, { headers: httpHeaders });
  }

  // GET ALL CATEGORIES TYPES
  public getAllCategoriesTypes() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(`${API_URL_2}/findAllCategoriesTypes/`, { headers: httpHeaders });
  }

  // CREATE SALES CHANNELS
  public createSalesChannels(sales_channels: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(`${API_URL_2}/createSalesChannels`, { sales_channels }, { headers: httpHeaders });
  }
}
