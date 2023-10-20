// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"


const API_URL = environment.apiUrl + "/promo"
const GET_SITES = environment.apiUrl + "/sites/"
const CRM = environment.apiUrl + "/crm"


@Injectable()
export class PromotionService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}




    // CREATE POPULATION ARTICLE
    public createPopulationArticle(populationData : any){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createPopArt/`, {populationData}, { headers: httpHeaders })
    }

    // CREATE POPULATION ARTICLE
    public createAdvantage(advantage : any){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createAdv/`, {advantage}, { headers: httpHeaders })
    }

     // CREATE PROMOTION
     public createPromotion(promo : any){
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/createPromo/`, {promo}, { headers: httpHeaders })
    }

     // GET ALL PRODUCT PAGES
    public getAllPopsArticle() {
         const httpHeaders = this.httpUtils.getHTTPHeaders()
         return this.http.get(`${API_URL}/getPopsArt`, { headers: httpHeaders })
     }

     public getAllAdvantages() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${API_URL}/getAdvantages`, { headers: httpHeaders })
    }

     public getAllSites() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(GET_SITES, { headers: httpHeaders })
    }

      // GET ALL PRODUCT PAGES
      public getPopsClient() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(`${CRM}/getPopulations`, { headers: httpHeaders })
    }

    public getPromo(code: any,) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(`${API_URL}/findPromo/${code}`, { headers: httpHeaders });
    }

    public getAdv(code: any,) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(`${API_URL}/findAdv/${code}`, { headers: httpHeaders });
    }

    public getPopArt(code: any,) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(`${API_URL}/findPopArt/${code}`, { headers: httpHeaders });
    }

    public getPopulationCustomer(code: String) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(`${API_URL}/getPopulationCustomer/${code}`, {
          headers: httpHeaders,
        });
      }
      public createPopulationCustomer(populationData: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(`${API_URL}/createPopulationCustomer`, populationData , {headers: httpHeaders});
      }

  
   
     

}
