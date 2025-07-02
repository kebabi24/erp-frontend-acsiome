export const environment = {
  production: true,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: "authce9d77b308c149d5992a80073637e4d5",
   //Palmary  apiUrl: "http://10.10.15.90:3001/api/v1",
  apiUrl: "http://localhost:3001/api/v1",
  //  apiUrl: "http://192.168.1.252:3001/api/v1",
  //  apiUrl: "http://10.10.130.9:3001/api/v1",
  //  apiUrl: "http://10.10.3.6:4141/api/v1",
  Instance: "Prod",
  App: "ERP", /* RH,DD,ERP*/
  key:"$argon2id$v=19$m=4096,t=3,p=1$MTIzNDU2Nzg$hoqzObkMeMlG9nOUKy0g8xwyih/9gjPFUvgRJ229lwQ",
 //edelweiss key:"$argon2id$v=19$m=4096,t=3,p=1$MTIzNDU2Nzg$zHjTc5y+XDtK0x6zun1KfIkkfhpDa+rYV4lBLLZX4Bc"
};
