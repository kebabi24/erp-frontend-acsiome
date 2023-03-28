// Angular
import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
// CRUD
import { HttpUtilsService } from "../../_base/crud"
// ENV
import { environment } from "../../../../environments/environment"

// model
import { ProfileMobile } from '../_models/profile-mobile.model'

const API_URL_TOKENS = environment.apiUrl + "/token-serie"

@Injectable()
export class TokenSerieService {
    httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    // CREATE TOKENS
    public createTokens(tokens: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL_TOKENS}/createTokens`, {tokens}, { headers: httpHeaders })
    }

    public getAllTokens() {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.get(API_URL_TOKENS+'/', { headers: httpHeaders })
    }
    
   
    
}
