import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
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
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  PurchaseOrderService,
  SequenceService,
  UsersService,
  BankService,
  TaxeService,
  DeviseService,
  CodeService,
  SiteService,
  MobileServiceService,
  UsersMobileService,
  RoleService,
  ItineraryService,
  MobileSettingsService,
  LoadRequestService,
  CustomerMobileService,
  AffectEquipement,
  AffectEquipementService
  } from "../../../../core/erp";
  import { jsPDF } from "jspdf";
import { NullVisitor } from "@angular/compiler/src/render3/r3_ast";
import { replaceAll } from "chartist"
@Component({
  selector: 'kt-affect-equipement',
  templateUrl: './affect-equipement.component.html',
  styleUrls: ['./affect-equipement.component.scss']
})
export class AffectEquipementComponent implements OnInit {
  aeForm: FormGroup;

  hasFormErrors = false;
  affectEquipement: AffectEquipement
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  user;
  currentamt: any = 0;
  date: any;
  error = false;
  sites: any[] = [];
  domain : any
  role_code : any
  roles: any[] = []
  serivce_code : any
  services: any[] = []
  user_mobile:any
  
  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  
  rolename: any
  nbr: any
  solde:Number
  isExist:Boolean = false
  ae_sup: any[] = [];
  ae_role: any[] = [];
  ae_itin: any[] = [];
  ae_eqp: any[] = [];
  aenbr : any
  constructor(
    config: NgbDropdownConfig,
    private aeFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private userService: UsersService,
    private sequenceService: SequenceService,
    private itineraryService : ItineraryService,
    private codeService: CodeService,
    // private mobileServiceService: MobileServiceService,
    private usersMobileService : UsersMobileService,
    private roleService : RoleService,
    private customerMobileService: CustomerMobileService,
    private affectEquipementService : AffectEquipementService
    // private mobileSettingsService: MobileSettingsService

  ) {
    this.roleService
    .getSupRoles({})
    .subscribe((response: any) => {console.log(response.data),this.ae_sup = response.data});
    this.codeService.getBy({code_fldname : "equipement"})
    .subscribe((respo: any) => {console.log(respo.data),this.ae_eqp = respo.data});
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    
    
    this.createForm();
  }

  createForm() {
    this.loadingSubject.next(false);
    this.affectEquipement = new AffectEquipement();
    const date = new Date();

    this.aeForm = this.aeFB.group({
      // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      ae_effdate: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      ae_sup : [this.affectEquipement.ae_sup, Validators.required],
     
      ae_role : [this.affectEquipement.ae_role, Validators.required],
      ae_itin : [this.affectEquipement.ae_itin, Validators.required],
      ae_cust : [this.affectEquipement.ae_cust, Validators.required],
      name: [""],
      ae_eqp : [this.affectEquipement.ae_eqp, Validators.required],
      ae_eqp_nbr : [this.affectEquipement.ae_eqp_nbr, Validators.required],
      // ae_amt_un : [this.affectEquipement.ae_amt_un,Validators.required],
      ae_amt : [this.affectEquipement.ae_amt,Validators.required]
      
      // user_mobile_code : [{value:"",disabled:true}],
      // username : [{value:"",disabled:true}],
      // bkh_terms: ["CODPM1", Validators.required],
      // montant_tr: [{value:"",disabled:true}, Validators.required],
   
      
    });
  
  }
  onchangezone() {

    const controls = this.aeForm.controls
    this.roleService
    .getByRole({upper_role_code : controls.ae_sup.value})
    .subscribe((resprole: any) => {console.log(resprole.data),this.ae_role = resprole.data});
  }
  onchangerole() {

    const controls = this.aeForm.controls
    this.itineraryService.getBySomething({role_code : controls.ae_role.value})
    .subscribe((respitin: any) => {console.log(respitin.data),this.ae_itin = respitin.data});
  }
  handleSelectedRowsChanged2(e, args) {
    const controls = this.aeForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        console.log(item);
      
        controls.ae_cust.setValue(item.customer_code || "");
        controls.name.setValue(item.customer_name || "");
      });
    }
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid2() {
    this.columnDefinitions2 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "customer_code",
        name: "Code Client",
        field: "customer_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "customer_name",
        name: "Nom Client",
        field: "customer_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "address_one",
        name: "Adresse",
        field: "address_one",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "category_type_code",
        name: "Type",
        field: "category_type_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "category_code",
        name: "Catégorie",
        field: "category_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cluster_code",
        name: "Cluster",
        field: "cluster_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "sub_cluster_code",
        name: "Sous Cluster",
        field: "sub_cluster_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "sales_channel_code",
        name: "Chaine ",
        field: "sales_channel_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions2 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      autoFitColumnsOnFirstLoad: false,
      enableAutoSizeColumns: false,
      // then enable resize by content with these 2 flags
      autosizeColumnsByCellContentOnFirstLoad: true,
      enableAutoResizeColumnsByCellContent: true,
      checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
   
    };

    // fill the dataset with your data
    const controls = this.aeForm.controls;
    this.customerMobileService.getByCustomerByitin({ itinerary_code: controls.ae_itin.value}).subscribe((response: any) => (this.customers = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "xl" });
  }
// onchangenbr() {
//   const controls = this.aeForm.controls
//   controls.ae_amt.setValue(Number(controls.ae_eqp_nbr.value) * Number(controls.ae_amt_un.value))
//   console.log("here", Number(controls.ae_eqp_nbr.value) * Number(controls.ae_amt_un.value))
// }
onchangeeqp() {
  const controls = this.aeForm.controls
  let index = this.ae_eqp.findIndex((item)=>{return item.code_value === controls.ae_eqp.value})
  controls.ae_amt.setValue(this.ae_eqp[index].dec01)
    
}

onSubmit() {
  this.hasFormErrors = false
  const controls = this.aeForm.controls
  /** check form */
  if (this.aeForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let affect = this.prepareAffect()
  this.addCode(affect)
}
/**
* Returns object for saving
*/
prepareAffect(): AffectEquipement {
  const controls = this.aeForm.controls
  const _ae = new AffectEquipement()
  _ae.ae_sup = controls.ae_sup.value
  _ae.ae_role = controls.ae_role.value
 
  _ae.ae_itin = controls.ae_itin.value
  _ae.ae_cust = controls.ae_cust.value
  _ae.chr01 = controls.name.value
  
  _ae.ae_eqp = controls.ae_eqp.value
  _ae.ae_eqp_nbr = controls.ae_eqp_nbr.value
  // _ae.ae_amt_un = controls.ae_amt_un.value
  _ae.ae_amt = controls.ae_amt.value
  
  _ae.ae_effdate = controls.ae_effdate.value
      ? `${controls.ae_effdate.value.year}/${controls.ae_effdate.value.month}/${controls.ae_effdate.value.day}`
      : null
  

  return _ae
}
/**
* Add code
*
* @param _code: CodeModel
*/
addCode(_ae: AffectEquipement) {
  this.loadingSubject.next(true)
  this.affectEquipementService.add(_ae).subscribe(
    (reponse: any) => {
      this.aenbr = reponse.data.id
          this.layoutUtilsService.showActionNotification(
              "Ajout avec succès",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.loadingSubject.next(false)
          this.printpdf()
          // this.router.navigateByUrl("/code-mstr/codes-list")
          this.reset()
    },
      // (reponse) => console.log("response", Response),
      (error) => {
          this.layoutUtilsService.showActionNotification(
              "Erreur verifier les informations",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.loadingSubject.next(false)
      },
     
  )
}
reset() {
  this.affectEquipement = new AffectEquipement()
  this.createForm()
  this.hasFormErrors = false
}
goBack() {
  //this.loadingSubject.next(false)
  const url = `/sales/list-affect-equipement`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

printpdf() {
  const controls = this.aeForm.controls;
  var doc = new jsPDF();
  
  
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 160, 5, 50, 30);
     doc.setFontSize(9);
     if (this.domain.dom_name != null) {
       doc.text(this.domain.dom_name, 10, 10);
     }
     if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
     if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
     if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
     doc.line(10, 32, 200, 32);
     doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
     doc.line(10, 40, 200, 40);
  doc.setFontSize(14);


  const date = new Date()
  doc.setFontSize(18);

  let initialY = 60;
 
  doc.setFont("Times-Roman");

  doc.text("Ordre de Versement : " + this.aenbr , 70, initialY + 5);

  initialY = 80
  doc.setFontSize(14);
  doc.text("Client    : " + controls.ae_cust.value + " "+ controls.name.value, 10, initialY + 10);
  doc.text("Date    : " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 10, initialY + 15);
  doc.text("Role : " + controls.ae_role.value , 10, initialY + 20);
//    doc.text("Valeur : " + Number(total * 1.2138).toFixed(2) + " DZD", 65, initialY + 20);
  doc.setFontSize(14);

var i = 110



  //   doc.line(2, i - 5, 2, i);
     doc.text("Equipement :" + String(controls.ae_eqp.value) , 10, i );
     doc.text("N° Série : " + String(controls.ae_eqp_nbr.value)  , 10, i +10 ); 
     
     doc.setFontSize(14);
     doc.setFont("Times-Roman-bold");
     let ttecq =  String( Number(controls.ae_amt.value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }))
 //   console.log(mts)



    let ttec = replaceAll(ttecq,","," ")

     doc.text("Montant : " + String(ttec)  , 10, i +20); 

    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));   
  }

}
