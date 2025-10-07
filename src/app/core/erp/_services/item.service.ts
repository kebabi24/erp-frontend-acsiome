// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { Item } from "../_models/item.model"

const API_URL = environment.apiUrl + "/items"
const API_URL_2 = environment.apiUrl + "/productPage"

@Injectable()
export class ItemService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE
    public add(item: Item) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL, item, { headers: httpHeaders })
    }
    public adddetail(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/detail', data, { headers: httpHeaders })
    }
    // READ
    public getAll() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL, { headers: httpHeaders })
    }
    public getOne(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/${id}`, { headers: httpHeaders })
    }
    public getOneDet(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/det/${id}`, { headers: httpHeaders })
    }
    public getStk(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/stk`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    
    public getAvailableStk(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/stknotnull`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getAvailableStk1(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/itemstk`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getByTaille(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findtaille`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getByPurchase() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findpurchasing`, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getbywithperte(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findwithperte`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getByOp(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findop`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getBySpec(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findspec`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getProd(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findprod`,data, { headers: httpHeaders })
 
    }
    public getByOne(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findOne`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
     // UPDATE
     public update(id: Number, data:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`,data, { headers: httpHeaders })
    }
    
    public epiupdate(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/epiUpdate`,data, { headers: httpHeaders })
 
    }
    // GET PRODUCT PAGE BY CODE
    public getProductPageByCode(product_page_code: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/findOneByCode/${product_page_code.product_page_code}`, { headers: httpHeaders })
        
    }

    // CREATE PRODUCT PAGE
    public createProductPage(productPage : any , productsCodes : any){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/createProductPage/`, {productPage,productsCodes}, { headers: httpHeaders })
    }
     // GET ALL PRODUCT PAGES
     public getAllProductPages() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/`, { headers: httpHeaders })
    }

     // UPDATE PROFILE PRODUCT PAGES
     public updateProfileProductPages(profile_code : any , pagesCodes : any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_2}/updateProfileProductsPages`, {profile_code:profile_code,pagesCodes:pagesCodes}, { headers: httpHeaders })
    }

    // GET PRODUCT PAGE BY CODE
    public getPageProducts(product_page_code: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL_2}/getPageProducts/${product_page_code}`, { headers: httpHeaders })
    }
        
    public CalcCmp(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/calccmp`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public getByDetTr(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/finddettr`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public updateDet(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/updated/${id}`, data, { headers: httpHeaders })
    }
    public getByJob(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findjob`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public updatepage(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL_2}/${id}`, data, { headers: httpHeaders })
    }
    public UpdatePrice(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/updateprice`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    public delete(id: Number) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.delete(`${API_URL}/${id}`, { headers: httpHeaders })
    }
}
