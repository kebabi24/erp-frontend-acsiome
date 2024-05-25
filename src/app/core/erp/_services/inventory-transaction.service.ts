// Angular
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// CRUD
import { HttpUtilsService } from "../../_base/crud";
// ENV
import { environment } from "../../../../environments/environment";

// model

const API_URL = environment.apiUrl + "/inventory-transactions";

@Injectable()
export class InventoryTransactionService {
  httpOptions = this.httpUtils.getHTTPHeaders();

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  // CREATE
  public add(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL, data, { headers: httpHeaders });
  }
  public addRCTUNP(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL + "/rct-unp", data, { headers: httpHeaders });
  }
  public addIssUnp(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post(API_URL + "/iss-unp", data, { headers: httpHeaders });
  }

    public addRCTWO(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/rct-wo', data, { headers: httpHeaders })
    }
    public addRJCTWO(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/rjct-wo', data, { headers: httpHeaders })
    }
   
    public addIssWo(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-wo', data, { headers: httpHeaders })
    }

    public addTr(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-tr', data, { headers: httpHeaders })
    
        
    }
    public addTrV(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-trv', data, { headers: httpHeaders })
    
        
    }
    public addIssChl(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-chl', data, { headers: httpHeaders })
    }
    public addIssChlRef(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/iss-chlref', data, { headers: httpHeaders })
    }
    // READ
    public findBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/find', data, { headers: httpHeaders })
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
    public getBy(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/find`,data, { headers: httpHeaders })
 
    }
    public getByDate(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findtrdate', data, { headers: httpHeaders })
    }
    public getByDateAddr(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findtrdateaddr', data, { headers: httpHeaders })
    }
    public getGrpType(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findtrtype', data, { headers: httpHeaders })
    }
    public getInv(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findinv', data, { headers: httpHeaders })
    }
    public getRct(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/findrct', data, { headers: httpHeaders })
    }
    public getDayly(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/dayly`,data, { headers: httpHeaders })
 
    }
    public getDayly1(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/dayly1`,data, { headers: httpHeaders })
 
    }
    public getConsoReport(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/consoreport`,data, { headers: httpHeaders })
 
    }
    public getConsoRange(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/consorange`,data, { headers: httpHeaders })
 
    }
    public getBySpec(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findoa`,data, { headers: httpHeaders })

       // return this.http.post(`${API_URL}/find`,data, { headers:httpHeaders })
        
    }
    // UPDATE
    public update(data: any, id:any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.put(`${API_URL}/${id}`, data, { headers: httpHeaders })
    }
    public updatetr(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/updateTr', data, { headers: httpHeaders })
    }
    // DELETE
    
    public getByCost(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findcost`,data, { headers: httpHeaders })
 
    }

    public getByNbr(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findnbr`,data, { headers: httpHeaders })
 
    }
    public getByGroup(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(`${API_URL}/findgroup`,data, { headers: httpHeaders })
 
    }
    public updatePrice(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(`${API_URL}/updateprice`, data, { headers: httpHeaders });
      }
      public addRCTUNPCab(data: any) {
        const httpHeaders = this.httpUtils.getHTTPHeaders()
        return this.http.post(API_URL+'/rct-unpcab', data, { headers: httpHeaders })
    }
    
 
  
  
  
 
 
  
  
  
  
}
