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
  
  } from "../../../../core/erp";
  import { jsPDF } from "jspdf";
declare var printTransfert: any;

@Component({
  selector: 'kt-transfert-caisse-det',
  templateUrl: './transfert-caisse-det.component.html',
  styleUrls: ['./transfert-caisse-det.component.scss']
})
export class TransfertCaisseDetComponent implements OnInit {

  
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

  banksd: [];
  columnDefinitionsbankd: Column[] = [];
  gridOptionsbankd: GridOption = {};
  gridObjbankd: any;
  angularGridbankd: AngularGridInstance;
  nbr : any;

  bkh_2000 : number
bkh_1000 : number
bkh_0500 : number
bkh_0200 : number
bkh_p200 : number
bkh_p100 : number
bkh_p050 : number
bkh_p020 : number
bkh_p010 : number
bkh_p005 : number
bkh_bon  : number
bkh_cheque: number
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
      bank_name:[""],
      bank_code_dest:  ["", Validators.required],
      bank_dest_name:[""],
      calc_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      
    

      montant_rl: [
        { value: 0, disabled: true },
        Validators.required,
      ],
      montant_tr: [0, Validators.required],
      chr02: [""],
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
      bkh_cheque: [0, Validators.required],

    });
    const controls = this.rvForm.controls
    this.bankService
    .getBy({bk_user1:this.user.usrd_code})
    .subscribe((response: any) => {
      console.log(response.data.bank)
      controls.bank_code_dest.setValue(response.data.bank.bk_code)
      controls.bank_dest_name.setValue(response.data.bank.address.ad_name)

    });
  }
  next2000(){
    const controls = this.rvForm.controls

    if(Number(controls.bkh_2000.value) > this.bkh_2000)  {
      alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
      controls.bkh_2000.setValue(this.bkh_2000)
      document.getElementById("bkh_2000").focus();
    } else {
    document.getElementById("bkh_1000").focus();
    }
    }
    next1000(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_1000.value) > this.bkh_1000)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_1000.setValue(this.bkh_1000)
        document.getElementById("bkh_1000").focus();
      } else {
    document.getElementById("bkh_0500").focus();
      }
    }
    next0500(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_0500.value) > this.bkh_0500)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_0500.setValue(this.bkh_0500)
        document.getElementById("bkh_0500").focus();
      } else {
      document.getElementById("bkh_0200").focus();
      }
    }  
    next0200(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_0200.value) > this.bkh_0200)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_0200.setValue(this.bkh_0200)
        document.getElementById("bkh_0200").focus();
      } else {
      document.getElementById("bkh_p200").focus();
      }
    }  
    nextp200(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_p200.value) > this.bkh_p200)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_p200.setValue(this.bkh_p200)
        document.getElementById("bkh_p200").focus();
      } else {
      document.getElementById("bkh_p100").focus();
      }
    }        
    nextp100(){
  const controls = this.rvForm.controls
  if(Number(controls.bkh_p100.value) > this.bkh_p100)  {
    alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
    controls.bkh_p100.setValue(this.bkh_p100)
    document.getElementById("bkh_p100").focus();
  } else {
      document.getElementById("bkh_p050").focus();
  }
    }        
    nextp050(){
   const controls = this.rvForm.controls
   if(Number(controls.bkh_p050.value) > this.bkh_p050)  {
    alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
    controls.bkh_p050.setValue(this.bkh_p050)
    document.getElementById("bkh_p050").focus();
  } else {
      document.getElementById("bkh_p020").focus();
  }
    }
    nextp020(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_p020.value) > this.bkh_p020)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_p020.setValue(this.bkh_p020)
        document.getElementById("bkh_p020").focus();
      } else {
      document.getElementById("bkh_p010").focus();
      }
    }
    nextp010(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_p010.value) > this.bkh_p010)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_p010.setValue(this.bkh_p010)
        document.getElementById("bkh_p010").focus();
      } else {
      document.getElementById("bkh_p005").focus();
      }
    }
    nextp005(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_p005.value) > this.bkh_p005)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_p005.setValue(this.bkh_p005)
        document.getElementById("bkh_p005").focus();
      } else {
      document.getElementById("bkh_bon").focus();
      }
    }
   
    nextbon(){
      const controls = this.rvForm.controls
      if(Number(controls.bkh_bon.value) > this.bkh_bon)  {
        alert("Nombre Saisi ne doit pas etre superieur au nombre de la caisse")
        controls.bkh_bon.setValue(this.bkh_bon)
        document.getElementById("bkh_bon").focus();
      } else {
        document.getElementById("bkh_rmks").focus();
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
                  +  Number(controls.bkh_cheque.value)

      controls.montant_tr.setValue(total)            
  }
  reset() {
    this.createForm();
    
    this.services = []
    this.hasFormErrors = false;
  }
  onChangeAmt() {

    const controls  = this.rvForm.controls
    
    if (Number(controls.montant_tr.value) > Number(controls.montant_rl.value) ) {
      alert(" montant Transferé doit etre inferieur au montant de la caisse")
      controls.montant_tr.setValue(0)
      document.getElementById("montant_tr").focus();
    }
    
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

  if (controls_.montant_tr.value == 0 ) {
   
    this.hasFormErrors = true
    return
}
    this.loadingSubject.next(true);

    const controls = this.rvForm.controls;
    const effdate = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
    console.log(controls.montant_rl.value);
    console.log(controls.montant_tr.value);
    let index = this.services.findIndex((service)=>{return service.role_code === controls.role_code.value})
    console.log(this.services[index])
    this.bankService.addBkhTransfertCDet({
        date: new Date(),
        effdate: effdate,
        addr:  this.user.usrd_code,
        bank: controls.bank_code.value,
        bank_dest: controls.bank_code_dest.value,
        amt_rl: controls.montant_rl.value,
        amt_tr: controls.montant_tr.value,
        site: this.user.usrd_site,
        chr02: controls.chr02.value,
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
        bkh_cheque:  Number(controls.bkh_cheque.value),

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
          this.router.navigateByUrl("/account-receivable/transfert-caisse-det");

          })
        }

        handleSelectedRowsChangedbank(e, args) {
          const controls = this.rvForm.controls;
          if (Array.isArray(args.rows) && this.gridObjbank) {
            args.rows.map((idx) => {
              const item = this.gridObjbank.getDataItem(idx);
              controls.bank_code.setValue(item.bk_code || "");
              controls.bank_name.setValue(item.address.ad_name)
              controls.montant_rl.setValue(item.bk_balance)     
              controls.montant_rl.setValue(item.bk_balance) 
              controls.montant_tr.setValue(item.bk_balance) 
        
              // document.getElementById('200').innerHTML = item.bk_2000;
              controls.bkh_2000.setValue(item.bk_2000)
              controls.bkh_1000.setValue(item.bk_1000)
              controls.bkh_0500.setValue(item.bk_0500)
              controls.bkh_0200.setValue(item.bk_0200)
              controls.bkh_p200.setValue(item.bk_p200)
              controls.bkh_p100.setValue(item.bk_p100)
              controls.bkh_p050.setValue(item.bk_p050)
              controls.bkh_p020.setValue(item.bk_p020)
              controls.bkh_p010.setValue(item.bk_p010)
              controls.bkh_p005.setValue(item.bk_p005)
              controls.bkh_bon.setValue(item.bk_bon)
              controls.bkh_cheque.setValue(item.bk_cheque)


            this.bkh_2000 = item.bk_2000
            this.bkh_1000 = item.bk_1000
            this.bkh_0500 = item.bk_0500
            this.bkh_0200 = item.bk_0200
            this.bkh_p200 = item.bk_p200
            this.bkh_p100 = item.bk_p100
            this.bkh_p050 = item.bk_p050
            this.bkh_p020 = item.bk_p020
            this.bkh_p010 = item.bk_p010
            this.bkh_p005 = item.bk_p005
            this.bkh_bon  = item.bk_bon
            this.bkh_cheque  = item.bk_cheque

            });
          }
        }
        handleSelectedRowsChangedbankd(e, args) {
          const controls = this.rvForm.controls;
          if (Array.isArray(args.rows) && this.gridObjbankd) {
            args.rows.map((idx) => {
              const item = this.gridObjbankd.getDataItem(idx);
              controls.bank_code_dest.setValue(item.bk_code || "");
              controls.bank_dest_name.setValue(item.address.ad_name)
             
                    
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
            .getAll()
            .subscribe((response: any) => {
              console.log(response.data)
              this.banks = response.data});
        }
        openbank(content) {
          this.prepareGridbank();
          this.modalService.open(content, { size: "lg" });
        }
  




        angularGridReadybankd(angularGrid: AngularGridInstance) {
          this.angularGridbankd = angularGrid;
          this.gridObjbankd = (angularGrid && angularGrid.slickGrid) || {};
        }
        
        prepareGridbankd() {
          this.columnDefinitionsbankd = [
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
        
          this.gridOptionsbankd = {
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
              this.banksd = response.data});
        }
        openbankd(content) {
          this.prepareGridbankd();
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
          doc.text("Caisse    : " + controls.bank_code.value + " " + controls.bank_name.value , 5, initialY + 10);
          doc.text("A           : " + controls.bank_code_dest.value + " " + controls.bank_dest_name.value , 5 , initialY + 15);
          doc.text("Vider Le  : " + String(date.getFullYear())+"/" + String(date.getMonth() + 1) + "/" + String(date.getDate()) + " " +  date.toLocaleTimeString(), 5, initialY + 20);
          doc.text("Récap    : " + controls.chr02.value, 5, initialY + 25);
         
          // doc.text("Vendeur : " + controls.user_mobile_code.value + " - " + controls.username.value, 5, initialY + 20);
      //    doc.text("Valeur : " + Number(total * 1.2019).toFixed(2) + " DZD", 65, initialY + 20);
          doc.setFontSize(9);
    
     var i = 40
    
        
    
          //   doc.line(2, i - 5, 2, i);
             doc.text("Billet 2000"  , 4, i ); doc.text( String(Number(controls.bkh_2000.value)),20,i); doc.text( String(Number(controls.bkh_2000.value)* 2000),40,i); 
             doc.text("Billet 1000"  , 4, i+5 ); doc.text( String(Number(controls.bkh_1000.value)),20,i+5); doc.text( String(Number(controls.bkh_1000.value)* 1000),40,i+5);              
             doc.text("Billet 500"   , 4, i+10 ); doc.text( String(Number(controls.bkh_0500.value)),20,i+10); doc.text( String(Number(controls.bkh_0500.value)* 500),40,i+10);
             doc.text("Billet 200"  , 4, i+15 ); doc.text( String(Number(controls.bkh_0200.value)),20,i+15); doc.text( String(Number(controls.bkh_0200.value)* 200),40,i+ 15); 

             doc.text("Total Billet "  , 4, i+25 ); doc.text( String(Number(controls.bkh_2000.value)* 2000 + Number(controls.bkh_1000.value)* 1000+ Number(controls.bkh_0500.value)* 500 + Number(controls.bkh_0200.value)* 200),40,i+ 25); 

             doc.text("Piéce  200"  , 4, i +35  ); doc.text( String(Number(controls.bkh_p200.value)),20,i+35); doc.text( String(Number(controls.bkh_p200.value)* 200),40,i+35); 
             doc.text("Piéce  100"  , 4, i+40 ); doc.text( String(Number(controls.bkh_p100.value)),20,i+40); doc.text( String(Number(controls.bkh_p100.value)* 100),40,i+40);              
             doc.text("Piéce  50"   , 4, i+45 ); doc.text( String(Number(controls.bkh_p050.value)),20,i+45); doc.text( String(Number(controls.bkh_p050.value)* 50),40,i+45);
             doc.text("Piéce  20"  , 4, i+50 ); doc.text( String(Number(controls.bkh_p020.value)),20,i+50); doc.text( String(Number(controls.bkh_p020.value)* 20),40,i+ 50); 
             doc.text("Piéce  10"  , 4, i+55 ); doc.text( String(Number(controls.bkh_p010.value)),20,i+55); doc.text( String(Number(controls.bkh_p010.value)* 10),40,i+ 55); 
             doc.text("Piéce  5"  , 4, i+60 ); doc.text( String(Number(controls.bkh_p005.value)),20,i+60); doc.text( String(Number(controls.bkh_p005.value)* 5),40,i+ 60); 
             
             doc.text("Total Monnaie "  , 4, i+70 ); doc.text( String(Number(controls.bkh_p200.value)* 200 + Number(controls.bkh_p100.value)* 100 + Number(controls.bkh_p050.value)* 50 + Number(controls.bkh_p020.value)* 20 + Number(controls.bkh_p010.value)* 10 + Number(controls.bkh_p005.value)* 5 ),40,i+ 70); 

             
             doc.text("Bon"  , 4, i+80 ) ; doc.text( String(Number(controls.bkh_bon.value)),40,i+ 80); 

             doc.text("Cheque"  , 4, i+85 ) ; doc.text( String(Number(controls.bkh_cheque.value)),40,i+ 85); 
             
             doc.setFontSize(14);
             doc.setFont("Times-Roman-bold");
             doc.text("Total Transfert"  , 4, i+95 ) ; doc.text( String(Number(controls.montant_tr.value).toFixed(2)),45,i+ 95); 
             
            //  doc.text("Nouveau Solde Caisse"  , 4, i+80 ) ; doc.text( String(Number((Number(this.solde) - Number(controls.montant_tr.value))).toFixed(2)),45,i+ 80); 
             

            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));   
          }
   
}