import { Component, OnInit } from "@angular/core";
import {
  NgbDropdownConfig,
  NgbModal,
  NgbTabsetConfig,
} from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
} from "angular-slickgrid";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of, Observer } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSelectModule } from "@angular/material/select";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  SaleOrderService,
  printCustomerCAList,
  CustomerService,
  Code,
} from "../../../../core/erp";
@Component({
  selector: "kt-customer-reclamation",
  templateUrl: "./customer-reclamation.component.html",
  styleUrls: ["./customer-reclamation.component.scss"],
})
export class CustomerReclamationComponent implements OnInit {
  imports: [MatSelectModule];
  reclamationForm: FormGroup;
  customerForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;

  name: String;
  phone_number: String;
  adress: String;
  age: Number;
  ageDisplay : String ;
  gender: String;
  email: String;
  wilaya : String;
  commune : String;
  adressDisplay: String;
  createdCustomer: Boolean = false;
  orderNotExist: Boolean = false;
  customerNotExist: Boolean;
  automaticCauseExist : Boolean = false;

  order_code: String;
  order_site: String;
  order_emp: String;
  order_date: String;

  reclamation_causes: any = [];
  filtered_causes: any = [];
  methods : any = [];

  automatic_treat: any = [];
  reclamation_details : any = [];
  automatic_treat_data : any = [];

  customeControls: Object = {};

  wilayas_communes_data: any = [];
  wilayas: any = [];
  communes: any = [];

  constructor(
    config: NgbDropdownConfig,
    private tagFB: FormBuilder,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private saleorderService: SaleOrderService,
  ) {
    config.autoClose = true;
  }

  ngOnInit(): void {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.getReclamationCauses();
    this.getMethods();
    this.getWilayasCommunes()
    // this.prepareDataOnLoad();
    this.initCustomerForm();
    this.createForm();
    // this.openCallAlert();
    this.activatedRoute.params.subscribe(params => {
      this.phone_number = params['phone']
      if(this.phone_number){
        this.getCustomerDataV2(this.phone_number)
        
      }
    });
  }

  getOrder() {
    const controls = this.reclamationForm.controls;
    this.order_code = controls.order_code.value;
    this.customerService.getOrder(this.order_code).subscribe(
      (reponse) => {
        if (reponse["data"] == null) {
          this.orderNotExist = true;
        } else {
          this.order_site = reponse["data"].usrd_site;
          this.order_emp = reponse["data"].order_emp;
          this.order_date = reponse["data"].created_date;
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur verifier les informations",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  getCustomerData(){
    const controls = this.reclamationForm.controls;
    this.phone_number = controls.phonee.value

    this.customerService.getCustomerPhone(this.phone_number).subscribe(
      (reponse) => {
        if (reponse["data"] == null) {
          this.customerNotExist = true;
        } else {
          this.customerNotExist = false;
          this.name = reponse["data"].cm_sort;
          this.adress = reponse["data"].wilaya;
          this.wilaya = reponse["data"].wilaya;
          this.commune = reponse["data"].commune;
          this.age = reponse["data"].cm_high_date;
          this.gender = reponse["data"].gender;

          // GET INDEX OF WILAYA 
          const wilayaIndex = this.wilayas_communes_data.findIndex(element =>{
            return element.wilaya.code_value == this.wilaya
          })
          
          console.log(this.wilayas_communes_data[wilayaIndex])

          const communeIndex = this.wilayas_communes_data[wilayaIndex].communes.findIndex(element =>{
          
             return element.code_value == this.commune
          })

           this.adressDisplay = this.wilayas_communes_data[wilayaIndex].wilaya.code_cmmt + ' - ' +this.wilayas_communes_data[wilayaIndex].communes[communeIndex].code_cmmt

          
          // CALCULATE BIRTHDAY 
          var ageDifMs = Date.now() -  new Date(reponse["data"].cm_high_date).getTime();
          var ageDate = new Date(ageDifMs);
          const age =  Math.abs(ageDate.getUTCFullYear() - 1970);
          this.age = age 
          this.ageDisplay = this.age.toString() + ' ans'

        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur verifier les informations",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  getCustomerDataV2(phone){

    this.customerService.getCustomer(phone).subscribe(
      (reponse) => {
        if (reponse["data"] == null) {
          this.customerNotExist = true;
        } else {
          this.customerNotExist = false;
          this.name = reponse["data"].ad_name;
          this.adress = reponse["data"].ad_line1;
          this.age = reponse["data"].ad_format;
          this.gender = reponse["data"].ad_ref;
          this.router.navigated = false;
          // window.location.reload()
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur verifier les informations",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  prepareDataOnLoad() {
    // this.activatedRoute.params.subscribe((params) => {
    //   this.phone_number = params["phone"];
    // });

    this.phone_number = '0699061833'

    this.customerService.getCustomer(this.phone_number).subscribe(
      (reponse) => {
        if (reponse["data"] == null) {
          this.customerNotExist = true;
        } else {
          this.customerNotExist = false;
          this.name = reponse["data"].ad_attn;
          this.adress = reponse["data"].ad_name;
          this.age = reponse["data"].ad_format;
          this.gender = reponse["data"].ad_ref;
          this.router.navigated = false;
          // window.location.reload()
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur verifier les informations",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  getReclamationCauses() {
    this.customerService.getReclamationCauses().subscribe(
      (reponse) => {
        if (reponse["data"] != null) {
          this.reclamation_causes = reponse["data"];
          this.filtered_causes = reponse["filtered_causes"];

          this.reclamation_causes.forEach((cause) => {
            this.customeControls[cause.code_value] = new FormControl("");
            this.customeControls[cause.code_value + "text-area"] =
              new FormControl("");
          });
          this.customeControls["order_code"] = new FormControl("");
          this.customeControls["phonee"]= new FormControl("");

          this.reclamationForm = this.tagFB.group({
            order_code: new FormControl(""),
            phonee :  new FormControl(""),
            ...this.customeControls,
          });
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => {
      observer.next("");
    }, 1000);
  });

  createForm() {
    this.loadingSubject.next(false);
    this.reclamationForm = this.tagFB.group({
      order_code: new FormControl(""),
      phonee : new FormControl(""),
      ...this.customeControls,
    });
  }

  //reste form
  reset() {
    this.createForm();
    this.hasFormErrors = false;
  }

  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.reclamationForm.controls;
    /** check form */
    // if (this.reclamationForm.invalid) {
    //     Object.keys(controls).forEach((controlName) =>
    //         controls[controlName].markAsTouched()
    //     )

    //     this.hasFormErrors = true
    //     return
    // }

    const complaintData = { 
      customer_phone: this.phone_number,
      priority: 1,
      order_code: this.order_code,
      site_loc: this.order_site,
      order_emp: this.order_emp,
      created_date: this.order_date,
    };

    var customerData = {};

    if (this.createdCustomer === true) {
      customerData["name"] = this.name;
      customerData["phone_number"] = this.phone_number;
      customerData["adress"] = this.adress;
      customerData["age"] = this.age;
      customerData["gender"] = this.gender;
      customerData["email"] = this.email;
    }

    var complaintDetails = [];

    this.reclamation_causes.forEach((cause) => {
      if (controls[cause.code_value].value) {
        const code_value = cause.code_value;
        const observation = controls[cause.code_value + "text-area"].value;

        const indexInReasons = this.reclamation_causes.findIndex(cause=>{
          return cause.code_value === code_value
        })

        if(this.reclamation_causes[indexInReasons].bool01 == false){
          complaintDetails.push({
            code_value: code_value,
            observation: observation,
            method:""
          });
        }
      }
    });

    if(this.automatic_treat_data.length>0){
      this.automatic_treat_data.forEach(cause => {
        complaintDetails.push({
          code_value: cause.code_value,
          observation: cause.observation,
          method :cause.method
        });
      });
    }

    this.customerService
      .createComplaint(complaintData, complaintDetails, customerData)
      .subscribe(
        (reponse) => {

          this.automatic_treat = []
          this.reclamation_details  = []
          this.automatic_treat_data  = []
          this.name = "";
          this.phone_number = "";
          this.adress = "";
          this.age = null;
          this.gender = "";
          this.email = "";
          this.createdCustomer  = false;
          this.orderNotExist = false;
          this.customerNotExist = false;
          this.automaticCauseExist   = false;

          this.order_code = "";
          this.order_site = "";
          this.order_emp = "";
          this.order_date = "";

          this.createForm();
          this.initCustomerForm();
          
        },
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        },
        () => {
          this.initCustomerForm();
          this.createForm();
          this.layoutUtilsService.showActionNotification(
            "Réclamation enregistrée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/customers/customer-list")
        }
      );
  }

  /**
   * Add code
   *
   * @param _code: CodeModel
   */

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/customers/customer-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  open(content) {
    this.modalService.open(content, { size: "lg" });
  }

  open1(content1){
    this.modalService.open(content1, { size: "lg" });
  }

  
  // openCallAlert() {
  //   document.getElementById("call-alert").click();
  // }

  initCustomerForm() {
    // demo message to show

    this.customerForm = this.fb.group({
      name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(320),
        ]),
      ],
      phone: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      age: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(2)]),
      ],
      gender: ["", Validators.compose([Validators.required])],
      commune: ["", Validators.compose([Validators.required])],
      email: [""],
    });
  }

  

  saveCustomer() {
    const controls = this.customerForm.controls;
    this.name = controls.name.value;
    this.age = controls.age.value;
    this.gender = controls.gender.value;
    this.adress = controls.commune.value;
    this.email = controls.email.value;
    this.createdCustomer = true;
    document.getElementById("closeForm").click();
  }

  // test() {
  //   window.alert("hey");
  // }

  onAlertClose($event) {
    this.orderNotExist = false
    this.customeControls["order_code"] = new FormControl("");
    this.customeControls["phonee"]= new FormControl("");

          this.reclamationForm = this.tagFB.group({
            order_code: new FormControl(""),
            ...this.customeControls,
          });
  }

  onCauseSelect(val){
    

    // INDEX OF SELECTED CAUSE IN reclamation_causes
    const indexInReasons = this.reclamation_causes.findIndex(cause=>{
       return cause.code_value === val
    })

    // CHECK IF THE CAUSE REQUIRE AUTOMATIC TREATMENT
    if(this.reclamation_causes[indexInReasons].bool01){
      const index = this.automatic_treat.findIndex(code =>{
        return code ==  val
      })
      if(index === -1){
        this.automatic_treat.push(val)
      }
      else{ 
        this.automatic_treat.splice(index, 1);
      }
      
      if(this.automatic_treat.length>0 ){
        this.automaticCauseExist = true
      }else{
        this.automaticCauseExist= false
      }
      // console.log(this.automatic_treat)
      // console.log(this.automatic_treat.length)

    }
  }


  validateAutomaticComplaints(){
    const controls = this.reclamationForm.controls;
    this.automatic_treat_data = []
    this.reclamation_causes.forEach((cause) => {
      if (controls[cause.code_value].value) {
        if(cause.bool01){
          const code_value = cause.code_value;
          const observation = controls[cause.code_value + "text-area"].value;

          // GET METHOD DISPLAY 
          const method_index = this.methods.findIndex(method => {
            
            return method.code_value == cause.chr01
          });

          this.automatic_treat_data.push({
            code_value: code_value,
            observation: observation,
            method : cause.chr01,
            cause_display : cause.code_desc,
            method_display : this.methods[method_index].code_desc
          });
        }
      }
    });
    console.log(this.automatic_treat_data)
    document.getElementById("modal2Button").click(); 
  }

  getMethods() {
    this.customerService.getMethods().subscribe(
      (response) => {
        if (response["data"] != null) {
          this.methods = response["data"]
        }
      },
      (error) => {
        this.layoutUtilsService.showActionNotification(
          "Erreur lors de la récupération des données du backend",
          MessageType.Create,
          10000,
          true,
          true
        );
        this.loadingSubject.next(false);
      }
    );
  }

  confirmAutomatic(){
    this.automaticCauseExist = false
    document.getElementById("closeForm1").click(); 
  }

  getWilayasCommunes() {
    this.customerService
      .getWilayasCommunes()

      .subscribe(
        (res: any) => {
          this.wilayas_communes_data = res.data;
          this.wilayas_communes_data.forEach((wilaya) => {
            this.wilayas.push(wilaya.wilaya);
          });
          console.log(this.wilayas_communes_data)
        },
        (err) =>
          console.log("error")
      );
  }

}
