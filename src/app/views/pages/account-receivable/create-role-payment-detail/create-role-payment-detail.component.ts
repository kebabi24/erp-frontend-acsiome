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
  LoadRequestService
  } from "../../../../core/erp";
  import { jsPDF } from "jspdf";
import { NullVisitor } from "@angular/compiler/src/render3/r3_ast";
//declare var printTransfert: any;
@Component({
  selector: 'kt-create-role-payment-detail',
  templateUrl: './create-role-payment-detail.component.html',
  styleUrls: ['./create-role-payment-detail.component.scss']
})
export class CreateRolePaymentDetailComponent implements OnInit {

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
    private mobileSettingsService: MobileSettingsService

  ) {
    
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    
    this.prepareRoles()
    this.createForm();
  }
  prepareRoles(){
    if (this.user.usrd_site = "*") {
      this.roleService.getAllRoles().subscribe(
          
          (response: any) => {
            this.roles = response.data
            console.log(this.roles)
          },
          (error) => {
            this.roles = []
          },
          () => {}
      )
        } else {
          this.roleService.getBy({role_site: this.user.usrd_site}).subscribe(
          
            (response: any) => {
              this.roles = response.data
              console.log(this.roles)
            },
            (error) => {
              this.roles = []
            },
            () => {}
        )
        }
  }
  
 next2000(){

  document.getElementById("bkh_1000").focus();
  }
  next1000(){

  document.getElementById("bkh_0500").focus();
  }
  next0500(){

    document.getElementById("bkh_0200").focus();
  }  
  next0200(){

    document.getElementById("bkh_p200").focus();
  }  
  nextp200(){

    document.getElementById("bkh_p100").focus();
  }        
  nextp100(){

    document.getElementById("bkh_p050").focus();
  }        
  nextp050(){
    document.getElementById("bkh_p020").focus();
  }
  nextp020(){
    document.getElementById("bkh_p010").focus();
  }
  nextp010(){
    document.getElementById("bkh_p005").focus();
  }
  nextp005(){
    document.getElementById("bkh_bon").focus();
  }
  nextbon(){
    document.getElementById("bkh_rmks").focus();
  }
  prepareService(){
    const controls = this.rvForm.controls
    const service_period_activate_date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
    const role_code = controls.role_code.value
    this.mobileServiceService.getBy({role_code,service_period_activate_date,service_open: false,service_versement_open:true}).subscribe(
        
        (response: any) => {
          console.log("ser",response.data)
          this.services = response.data
         
        },
        (error) => {
            this.services = []
        },
        () => {}
    )
    console.log("services",this.services)
  }
  onSelectRole(role_code){
    this.prepareService()
    this.role_code = role_code
    const controls = this.rvForm.controls

  
     let index = this.roles.findIndex((role)=>{return role.role_code === role_code})
    this.rolename = this.roles[index].role_name
    
    controls.user_mobile_code.setValue(this.roles[index].user_mobile_code) 
    this.solde= this.roles[index].solde
  
  
  this.usersMobileService.getByOne({user_mobile_code: controls.user_mobile_code.value}).subscribe(
        (respo: any) => {   
         console.log("yuser",respo.data)
         controls.username.setValue(respo.data.username)
     //    this.solde = respo.data.solde
         },
      (error) => {
      
      },
       
  )
    // this.mobileServiceService.getByOne({user_mobile_code :this.roles[index].user_mobile_code }).subscribe(
  
    //   (response: any) => {
    //     this.user_mobile = response.data
    //   },)
  }
  onSelectService(){

    const controls = this.rvForm.controls

    let index = this.services.findIndex((service)=>{return service.service_code === controls.service_code.value})
    console.log(this.services[index])
    controls.montant_rl.setValue(this.services[index].sum_paiement) 
    controls.user_mobile_code.setValue(this.services[index].user_mobile_code) 
  
  
  this.usersMobileService.getByOne({user_mobile_code: controls.user_mobile_code.value}).subscribe(
        (respo: any) => {   
         console.log("yuser",respo.data)
         controls.username.setValue(respo.data.username)
       //  this.solde = respo.data.solde
         },
      (error) => {
      
      },
       
  )
}



  createForm() {
    this.loadingSubject.next(false);

    const date = new Date();

    this.rvForm = this.rvFB.group({
      // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
      bank_code : ["", Validators.required],
      calc_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      
      role_code : ["", Validators.required],
      user_mobile_code : [{value:"",disabled:true}],
      username : [{value:"",disabled:true}],
      bkh_terms: ["CODPM1", Validators.required],
      montant_tr: [{value:"",disabled:true}, Validators.required],
      bkh_2000: [0, Validators.required],
      bkh_1000: [0, Validators.required],
      bkh_0500: [0, Validators.required],
      bkh_0200: [0, Validators.required],

      bkh_p200: [0, Validators.required],
      bkh_p100: [0, Validators.required],
      bkh_p050: [0, Validators.required],
      bkh_p020: [0, Validators.required],
      bkh_p010: [0, Validators.required],
      bkh_p005: [0, Validators.required],
      bkh_bon: [0, Validators.required],
      bkh_rmks : [""],
      bkh_cheque: [{value:0,disabled: !this.isExist}, Validators.required],
      
    });
    const controls = this.rvForm.controls
    this.bankService
    .getBy({bk_user1:this.user.usrd_code})
    .subscribe((response: any) => {
      console.log(response.data.bank)
  controls.bank_code.setValue(response.data.bank.bk_code)});
   
  }

  onchangeterms(){
    const controls = this.rvForm.controls
    if (controls.bkh_terms.value != "CODPM1") {
      this.isExist= true
      controls.bkh_cheque.enable()

      controls.bkh_2000.disable()
      
      controls.bkh_1000.disable()
      
      controls.bkh_0500.disable()
      
      controls.bkh_0200.disable()
      
      controls.bkh_p200.disable()
      
      controls.bkh_p100.disable()
      
      controls.bkh_p050.disable() 
      
      controls.bkh_p020.disable()
     
      controls.bkh_p010.disable()
      
      controls.bkh_p005.disable()
     
      controls.bkh_bon.disable()
     

      controls.bkh_2000.setValue(0)
      controls.bkh_1000.setValue(0)
      controls.bkh_0500.setValue(0)
      controls.bkh_0200.setValue(0)
      controls.bkh_p200.setValue(0)
      controls.bkh_p100.setValue(0)
      controls.bkh_p050.setValue(0)
      controls.bkh_p020.setValue(0)
      controls.bkh_p010.setValue(0)
      controls.bkh_p005.setValue(0)
      controls.bkh_bon.setValue(0)


    }
    else {
      console.log(this.isExist)
      this.isExist= false
      console.log(this.isExist)
      controls.bkh_cheque.setValue(0)
      controls.bkh_cheque.disable()
      controls.bkh_2000.enable()
      controls.bkh_1000.enable()

      controls.bkh_0500.enable()
      controls.bkh_0200.enable()
  
      controls.bkh_p200.enable()
      controls.bkh_p100.enable()
      controls.bkh_p050.enable() 
      controls.bkh_p020.enable()
      controls.bkh_p010.enable()
      controls.bkh_p005.enable()
      controls.bkh_bon.enable()
    }
  }
  calcule(){
    const controls = this.rvForm.controls
    
    
    const total = Number(controls.bkh_2000.value) * 2000 + Number(controls.bkh_1000.value) * 1000
                  + Number(controls.bkh_0500.value) * 500 + Number(controls.bkh_0200.value) * 200  
                  + Number(controls.bkh_p200.value) * 200 + Number(controls.bkh_p100.value) * 100
                  + Number(controls.bkh_p050.value) * 50 + Number(controls.bkh_p020.value) * 20
                  + Number(controls.bkh_p010.value) * 10 + Number(controls.bkh_p005.value) * 5
                  + Number(controls.bkh_bon.value)
                  + Number(controls.bkh_cheque.value)

      controls.montant_tr.setValue(total)            
  }     
  reset() {
    this.createForm();
    
    this.services = []
    this.hasFormErrors = false;
  }

  onSubmit() {
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
    let index = this.services.findIndex((service)=>{return service.role_code === controls.role_code.value})
    console.log(this.services[index])
    this.bankService.addBkhPaymentDetail({
        date: new Date(),
        effdate: effdate,
        service_code: null,
        addr:  controls.user_mobile_code.value,
        bank: controls.bank_code.value,
        role: controls.role_code.value,
    //    amt_rl: controls.montant_rl.value,
        amt_tr: controls.montant_tr.value,
        site: this.user.usrd_site,
        bkh_2000: Number(controls.bkh_2000.value),
        bkh_1000: Number(controls.bkh_1000.value),
        bkh_0500: Number(controls.bkh_0500.value),
        bkh_0200: Number(controls.bkh_0200.value),
        bkh_p200: Number(controls.bkh_p200.value),
        bkh_p100: Number(controls.bkh_p100.value),
        bkh_p050: Number(controls.bkh_p050.value),
        bkh_p020: Number(controls.bkh_p020.value),
        bkh_p010: Number(controls.bkh_p010.value),
        bkh_p005: Number(controls.bkh_p005.value),
        bkh_bon:  Number(controls.bkh_bon.value),
        bkh_rmks: controls.bkh_rmks.value

      })
      .subscribe(
        (reponse: any) => {console.log(reponse)
        this.nbr = reponse.data},
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
          this.router.navigateByUrl("/account-receivable/create-role-payment-detail");

          })
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
          var doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [100,150]
            })
            let initialY = 5;
            doc.setLineWidth(0.2);
          
          var img = new Image();
          // img.src = "companylogo.png";
          // doc.addImage(img, "png", 150, 5, 50, 30);
          doc.setFontSize(14);
    
        
          const date = new Date()
          doc.setFontSize(14);
    
          
          doc.setFont("Times-Roman");
    
          doc.text("Bon N° : " + this.nbr, 20, initialY + 5);
    
          doc.setFontSize(9);
          doc.text("Role    : " + controls.role_code.value + " "+ this.rolename, 5, initialY + 10);
          doc.text("Date    : " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 5, initialY + 15);
          doc.text("Vendeur : " + controls.user_mobile_code.value + " - " + controls.username.value, 5, initialY + 20);
      //    doc.text("Valeur : " + Number(total * 1.2019).toFixed(2) + " DZD", 65, initialY + 20);
          doc.setFontSize(9);
    
     var i = 35
    
        
    
          //   doc.line(2, i - 5, 2, i);
             doc.text("Billet 2000"  , 4, i ); doc.text( String(Number(controls.bkh_2000.value)),20,i); doc.text( String(Number(controls.bkh_2000.value)* 2000),40,i); 
             doc.text("Billet 1000"  , 4, i+5 ); doc.text( String(Number(controls.bkh_1000.value)),20,i+5); doc.text( String(Number(controls.bkh_1000.value)* 1000),40,i+5);              
             doc.text("Billet 500"   , 4, i+10 ); doc.text( String(Number(controls.bkh_0500.value)),20,i+10); doc.text( String(Number(controls.bkh_0500.value)* 500),40,i+10);
             doc.text("Billet 200"  , 4, i+15 ); doc.text( String(Number(controls.bkh_0200.value)),20,i+15); doc.text( String(Number(controls.bkh_0200.value)* 200),40,i+ 15); 

             doc.text("Piéce  200"  , 4, i +20  ); doc.text( String(Number(controls.bkh_p200.value)),20,i+20); doc.text( String(Number(controls.bkh_p200.value)* 200),40,i+20); 
             doc.text("Piéce  100"  , 4, i+25 ); doc.text( String(Number(controls.bkh_p100.value)),20,i+25); doc.text( String(Number(controls.bkh_p100.value)* 100),40,i+25);              
             doc.text("Piéce  50"   , 4, i+30 ); doc.text( String(Number(controls.bkh_p050.value)),20,i+30); doc.text( String(Number(controls.bkh_p050.value)* 50),40,i+30);
             doc.text("Piéce  20"  , 4, i+35 ); doc.text( String(Number(controls.bkh_p020.value)),20,i+35); doc.text( String(Number(controls.bkh_p020.value)* 20),40,i+ 35); 
             doc.text("Piéce  10"  , 4, i+40 ); doc.text( String(Number(controls.bkh_p010.value)),20,i+40); doc.text( String(Number(controls.bkh_p010.value)* 10),40,i+ 40); 
             doc.text("Piéce  5"  , 4, i+45 ); doc.text( String(Number(controls.bkh_p005.value)),20,i+45); doc.text( String(Number(controls.bkh_p005.value)* 5),40,i+ 45); 
             doc.text("Bon"  , 4, i+55 ) ; doc.text( String(Number(controls.bkh_bon.value)),40,i+ 55); 
             doc.text("Cheque"  , 4, i+65 ) ; doc.text( String(Number(controls.bkh_cheque.value)),40,i+ 65); 
             
             doc.setFontSize(14);
             doc.setFont("Times-Roman-bold");
             doc.text("Total Versement"  , 4, i+75 ) ; doc.text( String(Number(controls.montant_tr.value).toFixed(2)),45,i+ 75); 
             
             doc.text("Nouveau Solde"  , 4, i+85 ) ; doc.text( String(Number((Number(this.solde) - Number(controls.montant_tr.value))).toFixed(2)),45,i+ 85); 
             

            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));   
          }
   
}