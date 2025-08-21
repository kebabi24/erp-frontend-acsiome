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
  MobileSettingsService,
  LoadRequestService,
  AffectEquipementService
  } from "../../../../core/erp";
  import { jsPDF } from "jspdf";

import { replaceAll } from "chartist"
@Component({
  selector: 'kt-create-caution-cust',
  templateUrl: './create-caution-cust.component.html',
  styleUrls: ['./create-caution-cust.component.scss']
})
export class CreateCautionCustComponent implements OnInit {

  rvForm: FormGroup;

  hasFormErrors = false;
  
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
  banks: [];
  columnDefinitionsbank: Column[] = [];
  gridOptionsbank: GridOption = {};
  gridObjbank: any;
  angularGridbank: AngularGridInstance;
  rolename: any
  nbr: any
  solde:Number
  isExist:Boolean = false
  constructor(
    config: NgbDropdownConfig,
    private rvFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private userService: UsersService,
    private sequenceService: SequenceService,
    private bankService: BankService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private taxService: TaxeService,
    private mobileServiceService: MobileServiceService,
    private usersMobileService : UsersMobileService,
    private roleService : RoleService,
    private loadRequestService : LoadRequestService,
    private mobileSettingsService: MobileSettingsService,
    private affectEquipementService : AffectEquipementService,

  ) {
    
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

    const date = new Date();

    this.rvForm = this.rvFB.group({
      // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      bank_code : ["", Validators.required],
      aeid: [null,Validators.required],
      calc_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      
      role_code : [""],
      customer_code : [{value:"",disabled:true}],
      customer_name : [{value:"",disabled:true}],
      equipement : [{value:"",disabled:true}],
      montant_tr: [{value:"",disabled:true}, Validators.required],
      bkh_rmks : [""],
      bkh_terms: ["CODPM1", Validators.required],
      bkh_cheque: [{value:null,disabled: !this.isExist}],
      
    });
    const controls = this.rvForm.controls
    this.bankService
    .getBy({bk_user1:this.user.usrd_code, bk_type:'05'})
    .subscribe((response: any) => {
      console.log(response.data.bank)
  controls.bank_code.setValue(response.data.bank.bk_code)});
   
  }

  onchangeterms(){
    const controls = this.rvForm.controls
    if (controls.bkh_terms.value != "CODPM1") {
      this.isExist= true
      controls.bkh_cheque.enable()
    } else {
      controls.bkh_cheque.setValue(null)
    }
  }  
  reset() {
    const input = document.getElementById('submit') as HTMLInputElement | null;
    input.removeAttribute("disabled");
    this.createForm();
    this.services = []
    this.hasFormErrors = false;
  }
onchangeid(){
const controls = this.rvForm.controls
const id = controls.aeid.value
this.affectEquipementService
.getOne(id)
.subscribe((response: any) => {
  console.log(response.data)
controls.role_code.setValue(response.data.ae_role)
controls.equipement.setValue(response.data.ae_eqp)
controls.customer_code.setValue(response.data.ae_cust)
controls.customer_name.setValue(response.data.chr01)
controls.montant_tr.setValue(response.data.ae_amt)


});
}
  onSubmit() {
    const input = document.getElementById('submit') as HTMLInputElement | null;


    input?.setAttribute('disabled', '');
    this.hasFormErrors = false
    const controls_ = this.rvForm.controls
    if (this.rvForm.invalid) {
      Object.keys(controls_).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

    this.loadingSubject.next(true);

    const controls = this.rvForm.controls;
    const effdate = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
    
    console.log(controls.montant_tr.value);
   
    this.bankService.addBkhCautionDetail({
        date: new Date(),
        effdate: effdate,
        

        addr:  controls.customer_code.value,
        chr02: controls.customer_name.value,
        int01 : controls.aeid.value,
        bank: controls.bank_code.value,
        role: controls.role_code.value,
    //    amt_rl: controls.montant_rl.value,
        amt_tr: controls.montant_tr.value,
        site: this.user.usrd_site,
      
        bkh_terms: controls.bkh_terms.value,
        bkh_cheque: Number(controls.bkh_cheque.value),
        bkh_rmks: controls.bkh_rmks.value

      })
      .subscribe(
        (reponse: any) => 
        
        this.nbr = reponse.data,
        
        
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
              "Ajout avec succès",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.printpdf()
            this.loadingSubject.next(false);
            //console.log(this.provider, po, this.dataset);
            this.reset()
            // this.router.navigateByUrl("/account-receivable/create-role-payment-detail");
  
            },
          )
        }

        handleSelectedRowsChangedbank(e, args) {
          const controls = this.rvForm.controls;
          if (Array.isArray(args.rows) && this.gridObjbank) {
            args.rows.map((idx) => {
              const item = this.gridObjbank.getDataItem(idx);
              controls.bank_code.setValue(item.bk_code || "");
                    
            });
          }
        }
        
        angularGridReadybank(angularGrid: AngularGridInstance) {
          this.angularGridbank = angularGrid;
          this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {};
        }
        
        prepareGridbank() {
          this.columnDefinitionsbank = [
            {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
            },
            {
              id: "bk_code",
              name: "code",
              field: "bk_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "address.ad_name",
              name: "Designation",
              field: "address.ad_name",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "bk_curr",
              name: "Devise",
              field: "bk_curr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "bk_entity",
              name: "Entité",
              field: "bk_entity",
              sortable: true,
              filterable: true,
              type: FieldType.boolean,
            },
          ];
        
          this.gridOptionsbank = {
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
            dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
              var val = undefined;
              try {
                val = eval("item." + column.field);
              } catch (e) {
                // ignore
              }
              return val;
            },
          };
          // fill the dataset with your data
          this.bankService
            .getByAll({bk_user1:this.user.usrd_code})
            .subscribe((response: any) => {
              console.log(response.data)
              this.banks = response.data});
        }
        openbank(content) {
          this.prepareGridbank();
          this.modalService.open(content, { size: "lg" });
        }
  


        printpdf() {
          const controls = this.rvForm.controls;
          var doc = new jsPDF()
            let initialY = 60;
            doc.setLineWidth(0.2);
          
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
    
          
          doc.setFont("Times-Roman");
    
          doc.text("Bon de Versement N° : " + this.nbr, 50, initialY + 5);
          initialY  = initialY  + 30
    
          doc.setFontSize(14);
          doc.text("Client  : " + controls.customer_code.value + " " + controls.customer_name.value , 10, initialY + 10);
          doc.text("Date    : " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 10, initialY + 15);
          doc.text("Equipement : "  +  String(controls.equipement.value) , 10, initialY + 20 ) ;
      //     doc.text("Vendeur : " + controls.user_mobile_code.value + " - " + controls.username.value, 5, initialY + 20);
      // //    doc.text("Valeur : " + Number(total * 1.2138).toFixed(2) + " DZD", 65, initialY + 20);
       
    
        
    
          //   doc.line(2, i - 5, 2, i);
  if(controls.bkh_cheque.value != null) {
             doc.text("Cheque : "  +  String(Number(controls.bkh_cheque.value)) , 10, initialY + 25 ) ;
  }let ttecq =  String(Number(controls.montant_tr.value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }))
//   console.log(mts)



        let ttec = replaceAll(ttecq,","," ")
             doc.setFontSize(14);
             doc.setFont("Times-Roman-bold");
             doc.text("Total Versement : "  +  String(ttec), 10, initialY + 30 ) ;
             
             if(controls.bkh_rmks.value != null) {
              doc.text("Note : "  +  String(controls.bkh_rmks.value) , 10, initialY + 40 ) ;
             }
            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));   
          }
          goBack() {
            this.loadingSubject.next(false);
            const url = `/`;
            this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
          }
}