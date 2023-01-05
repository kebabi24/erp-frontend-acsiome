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
  // name = new Observable<string>((observer: Observer<string>) => {
  //   setInterval(() => {
  //     observer.next("");

  //   }, 10);
  // });
  phone_number: String;
  adress: String;
  age: Number;
  gender: String;
  email: String;
  createdCustomer: Boolean = false;
  orderNotExist: Boolean = false;
  customerNotExist: Boolean;

  order_code: String;
  order_site: String;
  order_emp: String;
  order_date: String;

  reclamation_causes: any = [];

  customeControls: Object = {};

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
    private saleorderService: SaleOrderService
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
    // this.prepareDataOnLoad();
    this.initCustomerForm();
    this.createForm();
    // this.openCallAlert();
  }

  getOrder() {
    const controls = this.reclamationForm.controls;
    this.order_code = controls.order_code.value;
    this.customerService.getOrder(this.order_code).subscribe(
      (reponse) => {
        if (reponse["data"] == null) {
          this.orderNotExist = true;
          console.log("null");
        } else {
          this.order_site = reponse["data"].usrd_site;
          this.order_emp = reponse["data"].order_emp;
          this.order_date = reponse["data"].created_date;
          console.log(reponse["data"]);
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
    console.log(controls)
    this.phone_number = controls.phonee.value
    console.log('phone'+this.phone_number)

    this.customerService.getCustomer(this.phone_number).subscribe(
      (reponse) => {
        if (reponse["data"] == null) {
          console.log("null");
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
          console.log("null");
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

          this.reclamation_causes.forEach((cause) => {
            this.customeControls[cause.code_value] = new FormControl("");
            console.log(cause.code_value + "text-area");
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

    // this.reclamationForm = this.tagFB.group({
    //   // rec_details:[''],
    //   // cause:[''],
    //   // order_code:[''],
    //   // ...this.customeControls
    // })
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
      user_code: "for later", // backend
      customer_phone: this.phone_number,
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
        complaintDetails.push({
          code_value: code_value,
          observation: observation,
        });
        // console.log(cause.code_value+'\t')
        // console.log(controls[cause.code_value].value) // this is true if selected
        // console.log(controls[cause.code_value+'text-area'].value)
      }
    });

    this.customerService
      .createComplaint(complaintData, complaintDetails, customerData)
      .subscribe(
        (reponse) => {
          console.log(reponse);
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
          this.layoutUtilsService.showActionNotification(
            "Réclamation enregistr avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
          // this.router.navigateByUrl("/customers-mobile/cluster-create")
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
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  open(content) {
    this.modalService.open(content, { size: "lg" });
  }

  // open2(content) {
  //   this.modalService.open(content, { size: "lg" });
  // }
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
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
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
}
