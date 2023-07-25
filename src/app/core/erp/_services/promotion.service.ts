// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"


const API_URL = environment.apiUrl + "/promo"
const GET_SITES = environment.apiUrl + "/sites/"

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

     // GET ALL PRODUCT PAGES
    public getAllPopsArticle() {
         const httpHeaders = this.httpUtils.getHTTPHeaders()
         return this.http.get(`${API_URL}/getPopsArt`, { headers: httpHeaders })
     }

     public getAllSites() {
        

        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(GET_SITES, { headers: httpHeaders })
    }

    //  // UPDATE PROFILE PRODUCT PAGES
    // public updateProfileProductPages(profile_code : any , pagesCodes : any) {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders()
    //     return this.http.post(`${API_URL}/updateProfileProductsPages`, {profile_code:profile_code,pagesCodes:pagesCodes}, { headers: httpHeaders })
    // }

  
   
     

}
