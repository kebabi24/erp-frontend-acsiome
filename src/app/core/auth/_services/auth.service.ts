import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
import { HttpUtilsService } from "../../_base/crud"

const API_USERS_URL = environment.apiUrl + "/auth/login";
const API_CREATE_CUSTOMER_URL = environment.apiUrl + "/auth/createCustomer";
const API_NOTIFICATIONS = environment.apiUrl + "/auth/getNotifications";
const API_GET_PHONE = environment.apiUrl + "/auth/getPhone";
const API_GET_WILAYAS_COMMUNES= environment.apiUrl + "/auth/getWilayasCommunes";
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';
const API_GET_PROMO = environment.apiUrl + "/auth/getValidePromo";

@Injectable()
export class AuthService {
  httpOptions = this.httpUtils.getHTTPHeaders()

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

  // Authentication/Authorization
  login(userName: string, password: string,key:string) {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    console.log(API_USERS_URL)
    return this.http.post(API_USERS_URL, {userName, password,key}, { headers: httpHeaders });
  }

  createNewCustomer(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    console.log(API_USERS_URL)
    return this.http.post(API_CREATE_CUSTOMER_URL, {data},{ headers: httpHeaders });
  }

  getCustomerPhone(data: any) {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    console.log(API_USERS_URL)
    return this.http.get(`${API_GET_PHONE}/${data}`,{ headers: httpHeaders });
  }

  getValidePromo() {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    console.log(API_USERS_URL)
    return this.http.get(`${API_GET_PROMO}/`,{ headers: httpHeaders });
  }

  getWilayasCommunes() {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    console.log(API_USERS_URL)
    return this.http.get(`${API_GET_WILAYAS_COMMUNES}/`,{ headers: httpHeaders });
  }

  // getNewNotifications
  getNewNotifications() {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    return this.http.get(`${API_NOTIFICATIONS}/`,{ headers: httpHeaders });
  }

  verifypwd(userName: string, password: string) {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
    console.log(API_USERS_URL)
    return this.http.post(API_USERS_URL, {userName, password}, { headers: httpHeaders });
  }

   getUserByToken(): Observable<User> {
     const userToken = localStorage.getItem(environment.authTokenKey);
     let httpHeaders = new HttpHeaders();
     httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + userToken);
     return this.http.get<User>(API_USERS_URL, {headers: httpHeaders});
   }

   register(user: User): Observable<any> {
     let httpHeaders = new HttpHeaders();
     httpHeaders = httpHeaders.set('Content-Type', 'application/json');
     return this.http.post<User>(API_USERS_URL, user, {headers: httpHeaders})
       .pipe(
         map((res: User) => {
           return res;
         }),
         catchError(err => {
           return null;
         })
       );
   }

  /*
   * Submit forgot password request
   *
   * @param {string} email
   * @returns {Observable<any>}
   */
  public requestPassword(email: string): Observable<any> {
    return this.http.get(API_USERS_URL + '/forgot?=' + email)
      .pipe(catchError(this.handleError('forgot-password', []))
      );
  }


   getAllUsers(): Observable<User[]> {
     return this.http.get<User[]>(API_USERS_URL);
   }

   getUserById(userId: number): Observable<User> {
     return this.http.get<User>(API_USERS_URL + `/${userId}`);
   }


  // // DELETE => delete the user from the server
   deleteUser(userId: number) {
     const url = `${API_USERS_URL}/${userId}`;
     return this.http.delete(url);
   }

  // // UPDATE => PUT: update the user on the server
  // // tslint:disable-next-line
   updateUser(_user: User): Observable<any> {
     let httpHeaders = new HttpHeaders();
     httpHeaders = httpHeaders.set('Content-Type', 'application/json');
     return this.http.put(API_USERS_URL, _user, {headers: httpHeaders});
   }

  // CREATE =>  POST: add a new user to the server
   createUser(user: User): Observable<User> {
     let httpHeaders = new HttpHeaders();
     httpHeaders = httpHeaders.set('Content-Type', 'application/json');
     return this.http.post<User>(API_USERS_URL, user, {headers: httpHeaders});
   }

   // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
   // items => filtered/sorted result
   findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
     let httpHeaders = new HttpHeaders();
     httpHeaders = httpHeaders.set('Content-Type', 'application/json');
     return this.http.post<QueryResultsModel>(API_USERS_URL + '/findUsers', queryParams, {headers: httpHeaders});
   }

  // Permission
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(API_PERMISSION_URL);
  }

  getRolePermissions(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
  }

  // Roles
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(API_ROLES_URL);
  }

  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
  }

  // CREATE =>  POST: add a new role to the server
  createRole(role: Role): Observable<Role> {
    // Note: Add headers if needed (tokens/bearer)
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<Role>(API_ROLES_URL, role, {headers: httpHeaders});
  }

  // UPDATE => PUT: update the role on the server
  updateRole(role: Role): Observable<any> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.put(API_ROLES_URL, role, {headers: httpHeaders});
  }

  // DELETE => delete the role from the server
  deleteRole(roleId: number): Observable<Role> {
    const url = `${API_ROLES_URL}/${roleId}`;
    return this.http.delete<Role>(url);
  }

  // Check Role Before deletion
  isRoleAssignedToUsers(roleId: number): Observable<boolean> {
    return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
  }

  findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    // This code imitates server calls
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, {headers: httpHeaders});
  }

  /*
   * Handle Http operation that failed.
   * Let the app continue.
    *
  * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      //  Let the app keep running by returning an empty result.
      return of(result);
    };
  }
}
