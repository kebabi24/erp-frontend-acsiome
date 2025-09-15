// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: "authce9d77b308c149d5992a80073637e4d5",
  apiUrl: "http://localhost:3001/api/v1",
  // apiUrl: "http://192.168.60.52:3001/api/v1",
  //  apiUrl: "http://192.168.1.252:3001/api/v1", //WILLDA
  //  apiUrl: "http://192.168.2.1:3001/api/v1", //TARCHID
  //  apiUrl: "http://105.98.96.17:3001/api/v1",
  //  apiUrl: "http://10.10.130.9:3002/api/v1", //EDELWEISS
  //  apiUrl: "http://10.10.3.6:4341/api/v1", //PRIMA
  // apiUrl: "https://10.10.12.90:3001/api/v1", //PALMARY
  //  apiUrl: "http://192.168.100.100:3001/api/v1", 
  // apiUrl: "http://192.168.1.112:3001/api/v1",
  // apiUrl: "http://25.7.193.22:3001/api/v1",
  // apiUrl: "https://edelweiss.whitebay.limited/api/v1",
  // apiUrl: "http://loalhost:3001/api/v1",
  Instance: "Prod",
  App: "ERP", // RH or ERP or DD
  // key:"$argon2id$v=19$m=4096,t=3,p=1$MTIzNDU2Nzg$hoqzObkMeMlG9nOUKy0g8xwyih/9gjPFUvgRJ229lwQ",
  // key:"$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$O5Ed72MwWBjV0QITSt3bag"
  key:"$argon2i$v=19$m=16,t=2,p=1$MTIzNDU2Nzg$b7dhzjxkuGRbLPCGSXW3Yw",
  // key:"$argon2id$v=19$m=4096,t=3,p=1$MTIzNDU2Nzg$mTqYWw+lo15HFjUskoHyRa+pWpSTX9qZiY9Er0S6leI",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
