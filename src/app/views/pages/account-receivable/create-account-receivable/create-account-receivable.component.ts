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
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { round } from 'lodash';
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
 
  CustomerService,
  AddressService,
  DeviseService,
  CodeService,
  BankService,
  InvoiceOrderService,
  AccountReceivable,
  AccountReceivableService,
  ConfigService,
 

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";

import { replaceAll } from "chartist";
@Component({
  selector: 'kt-create-account-receivable',
  templateUrl: './create-account-receivable.component.html',
  styleUrls: ['./create-account-receivable.component.scss']
})
export class CreateAccountReceivableComponent implements OnInit {

  accountReceivable: AccountReceivable;
  arForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  angularGridih: AngularGridInstance; 
  gridih: any;
  gridServiceih: GridService;
  dataViewih: any;
  columnDefinitionsih: Column[];
  gridOptionsih: GridOption;
  ihdataset : any[];

  customer: any;
  
  providers: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;
  
  bills: [];
    columnDefinitionsbill: Column[] = [];
    gridOptionsbill: GridOption = {};
    gridObjbill: any;
    angularGridbill: AngularGridInstance;
    
 
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  

  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

  banks: [];
  columnDefinitionsbank: Column[] = [];
  gridOptionsbank: GridOption = {};
  gridObjbank: any;
  angularGridbank: AngularGridInstance;
  
  angularGridcf: AngularGridInstance;
  gridcf: any;
  gridServicecf: GridService;
  dataViewcf: any;
  columnDefinitionscf: Column[];
  gridOptionscf: GridOption;
  cfdataset: any[];
  
  bool : boolean;
  row_number;
  message = "";
  details: any;
  datasetPrint = [];
  ar_cr_terms: any[] = [];
  detail = [];
  invoice: any[];
  user;
  bank;
  pshnbr: String;
  isExist: Boolean;
  isExistc: Boolean;
  curr: any;  
  find: Boolean;
  rest: number;
  date: String;
  compta: Boolean = false
  declared: Boolean = false
  arr : any
  domain: any;
  constructor(
    config: NgbDropdownConfig,
    private apFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private customerService: CustomerService,
   
    private invoiceOrderService: InvoiceOrderService,
    private accountReceivableService: AccountReceivableService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private bankService: BankService, 
    private configService : ConfigService,

  ) {
    config.autoClose = true;
      this.codeService
        .getBy({ code_fldname: "check_form" })
        .subscribe((response: any) => (this.ar_cr_terms = response.data));
    this.configService.getOne( 1 ).subscribe(
      (resp: any) => {
        console.log(resp.data)
        if (resp.data.cfg_accounting) { 
          this.compta = true
        }
        if (resp.data.cfg_declared) { 
          this.declared = true
        }
        
      })      
      this.initGrid();
      this.initGridcf();

  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
  
    this.columnDefinitions = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
      
      {
        id: "ard_ref",
        name: "N° Facture",
        field: "ard_ref",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        
        editor: {
          model: Editors.text,
       },
       onCellChange: (e: Event, args: OnEventArgs) => {
         
        const controls  = this.arForm.controls
        console.log(args.dataContext.ard_ref)
        var inv = args.dataContext.ref;
                if (controls.imput.value  == true) { 
        
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , ard_ref: inv })
                 alert("Vous ne pouvez pas modifier une ligne de Facture")
                            
                } else 
                {
        this.find = false;
                  for (var i = 0; i < this.invoice.length; i++) {
                    if (this.invoice[i].nbr == args.dataContext.ard_ref ) { this.find = true };
                  } 
                  if (this.find) { 
        
                    alert("Facture deja choisi")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , ard_ref: null })
                  } else {
                  this.accountReceivableService.getByOne({ar_nbr: args.dataContext.ard_ref, ar_type: "I", ar_open: true }).subscribe((resp:any)=>{
                   // console.log(resp.data)
                                if (resp.data) {
                    
                                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , effdate: resp.data.ar_effdate , ard_amt: resp.data.ar_amt, open: resp.data.ar_amt - resp.data.ar_applied})
                    
                                  this.invoice.push({ nbr: args.dataContext.ard_ref});
                                
                                  console.log(this.invoice)
                             }  else {
                                alert("Facture Nexiste pas")
                                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , ard_ref: null })
                             }
                              
                     });
                    
                    }
        
        
        
        
        
                }
                
                 } 
        
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          const controls = this.arForm.controls;
          this.row_number = args.row;
          
          if ( (controls.imput.value  == true)) {
  
            alert( " vous ne pouvez pas changer de ligne ")
          } 
          else {
          let element: HTMLElement = document.getElementById(
            "openItemsGrid"
          ) as HTMLElement;
          element.click();
          }
        },
      },
      {
        id: "effdate",
        name: "Date",
        field: "effdate",
        sortable: true,
        minWidth: 250,
        maxWidth: 250,
        filterable: false,
        formatter: Formatters.dateIso,
        type: FieldType.dateIso,
      },
      {
        id: "ard_amt",
        name: "Montant",
        field: "ard_amt",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
      
        
      },
      
      {
        id: "open",
        name: "Montant ouvert",
        field: "open",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
      
        
      },
      {
        id: "applied",
        name: "Montant A Appliqué",
        field: "applied",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls  = this.arForm.controls
      //  console.log(args.dataView.ard_ref)
        var app = Number(args.dataContext.apamt);
                if (controls.imput.value  == false) { 
               
      if( args.dataContext.applied > args.dataContext.open ) {

        alert("Montant ne doit pas etre superieur au montant ouvert")
      } 
      else {
        console.log(this.rest)
        this.rest = this.rest - args.dataContext.applied
        console.log(this.rest)
      }        
               
               
                } else {

alert("Vous ne pouvez pas changer le montant")
this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , applied: app })
                }


        }, 
      },
      
      
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: false,
    
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     /* presets: {
        sorters: [
          { columnId: 'psh_line', direction: 'ASC' }
        ],
      },*/
    };

    this.dataset = [];
  }

  gridReadycf(angularGrid: AngularGridInstance) {
    this.angularGridcf = angularGrid;
    this.dataViewcf = angularGrid.dataView;
    this.gridcf = angularGrid.slickGrid;
    this.gridServicecf = angularGrid.gridService;
  }

  initGridcf() {
    this.columnDefinitionscf = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
    },
      
    {
      id: "glt_ref",
      name: "Ref",
      field: "glt_ref",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    }, 
    {
      id: "glt_desc",
      name: "Description",
      field: "glt_desc",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_acct",
      name: "Compte",
      field: "glt_acct",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },

    {
      id: "glt_sub",
      name: "Sous Compte",
      field: "glt_sub",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_cc",
      name: "Centre de Cout",
      field: "glt_cc",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_dy_code",
      name: "Journal",
      field: "glt_dy_code",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },

    
    {
      id: "glt_cur_amt",
      name: "Montant Devise",
      field: "glt_cur_amt",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
    {
      id: "glt_amt",
      name: "Montant ",
      field: "glt_amt",
      sortable: true,
      minWidth: 200,
      maxWidth: 200,
      filterable: false,
      
    },
      
    ];

    this.gridOptionscf = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: false,
    
      
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
     /* presets: {
        sorters: [
          { columnId: 'prh_line', direction: 'ASC' }
        ],
      },*/
    };

    //this.dataset = [];
  }
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    
    this.domain = JSON.parse(localStorage.getItem("domain")); 
    this.createForm();
  }

  
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.accountReceivable = new AccountReceivable();
      const date = new Date;
      
      this.arForm = this.apFB.group({
    //    so__chr01: [this.accountReceivable.ar__chr01],
       
        ar_bill: [this.accountReceivable.ar_bill  , Validators.required],
        name: [{value:"", disabled: true}],
        
      
        ar_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
       }],
        ar_due_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        ar_curr:  [{value: this.accountReceivable.ar_curr ,disabled: !this.isExistc }, Validators.required],
        ar_cr_terms: [{value: this.accountReceivable.ar_cr_terms ,disabled: !this.isExistc }, Validators.required],
       // ar_type:  [{value: this.accountReceivable.ar_type ,disabled: !this.isExistc }, Validators.required],
        ar_batch:  [{value: 0 , disabled: !this.isExistc }],
        ar_amt:  [{value: 0 , disabled: !this.isExistc }],
        ar_acct:  [{value: this.accountReceivable.ar_acct ,disabled: !this.isExistc }],
        ar_bank:  [{value: this.accountReceivable.ar_bank ,disabled: !this.isExistc } , Validators.required],
        bank_name: [{value: "", disabled: true}],
        ar_disc_acct:  [{value: this.accountReceivable.ar_disc_acct ,disabled: !this.isExistc }],
        ar_dy_code:  [{value: this.accountReceivable.ar_dy_code ,disabled: !this.isExistc }],
        ar_check:  [{value: this.accountReceivable.ar_check ,disabled: !this.isExistc }],
        ar_po:  [{value: this.accountReceivable.ar_po ,disabled: !this.isExistc }],
        
        ar_ex_rate: [{value: this.accountReceivable.ar_ex_rate, disabled: !this.isExistc }],
        ar_ex_rate2: [{value: this.accountReceivable.ar_ex_rate2, disabled: !this.isExistc }],
        
        imput:  [{value: false ,disabled: !this.isExistc }],
       
        print:[true]

      });
  
      
  
    }




    onChangeCheck() {
      const controls  = this.arForm.controls
      this.accountReceivableService
          .getByOne({
                ar_check: controls.ar_check.value,
                ar_bank: controls.ar_bank.value,
          })
          .subscribe((response: any) => {
            //  const {data} = response.data;
             // console.log(response.data)
              if (response.data) {
                alert("N° cheque exist pour une autre banque")

                 controls.ar_check.setValue(null) 
                 document.getElementById("ar_check").focus(); 
              }             
        })
    }

    onChangeBill() {
      const controls  = this.arForm.controls
      const date = new Date()

      this.date = controls.ar_effdate.value
    ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      this.customerService
          .getBy({
                cm_addr: controls.ar_bill.value,
          })
          .subscribe((response: any) => {
            
            this.customer = response.data;
         //   console.log(this.provider)
       

              if (response.data) {
                  this.isExistc = true
     //             console.log(response.data)
                  
                  
                  controls.ar_effdate.enable()
                  controls.ar_curr.enable()
                  controls.ar_cr_terms.enable()
                  controls.ar_ex_rate.enable()
                  controls.ar_ex_rate2.enable()
                  controls.ar_batch.enable()
                  //controls.ar_amt.enable()
                  controls.ar_acct.enable()
                  controls.ar_bank.enable()
                  controls.ar_disc_acct.enable()
                  controls.ar_dy_code.enable()
                  controls.ar_po.enable()
                  controls.imput.enable()
                  controls.ar_check.enable()
                  controls.name.setValue(this.customer.address.ad_name || "")
                  controls.ar_curr.setValue(this.customer.cm_curr || "")
                  controls.ar_bank.setValue(this.customer.cm_bank || "")
                  controls.ar_cr_terms.setValue(this.customer.cm_ckfrm || "")
                  

                  this.deviseService.getBy({ cu_curr: this.customer.cm_curr }).subscribe(
                    (res: any) => {
                     // console.log(res);
                      const { data } = res;
                if(data) {
      
                  this.curr = data;
                }
      
                    })
      
                    if (this.customer.cm_curr == 'DA'){
                      controls.ar_ex_rate.setValue(1)
                      controls.ar_ex_rate2.setValue(1)
        
                    } else {
        
                    this.deviseService.getExRate({exr_curr1:this.customer.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                      
                       controls.ar_ex_rate.setValue(res.data.exr_rate)
                       controls.ar_ex_rate2.setValue(res.data.exr_rate2)
                      })
        
                      }
                 
                  this.bankService
                  .getAR({
                        bk_code: this.customer.cm_bank,
                  })
                  .subscribe((res: any) => {
                    //console.log("jjjjjj",res.data)
                    controls.bank_name.setValue(res.data.bank.bk_desc || "")
                    this.ar_cr_terms = res.data.details
         
                  })
                  this.bankService
                  .getAllDetails({
                        bkd_bank: this.customer.cm_bank,
                        bkd_module: "AR",
                        bkd_pay_method:  this.customer.cm_ckfrm,
                        
                  })
                  .subscribe((resp: any) => {
                   // console.log(resp.data)
         
                   controls.ar_dy_code.setValue(resp.data[0].bkd_dy_code || "")
           
                  })
              
                 

              } else {
              alert("Ce Fournisseur n'exist pas")
              document.getElementById("bill").focus();
              }
               
        })
    }
    onChangeAmt() {

      const controls  = this.arForm.controls
      
      if (controls.ar_amt.value != controls.ar_batch.value ) {
        alert(" montant doit etre egale au montant du controle")
        controls.ar_amt.setValue(null)
        document.getElementById("ar_amt").focus();
      }
      else {this.rest = Number(controls.ar_amt.value);
        this.invoice = [];
       }

    }
    onChangeImput() {
      this.dataset = [];
      this.cfdataset = [];
      this.invoice = [];
      const controls  = this.arForm.controls
     // this.rest = Number(controls.ar_amt.value)
      if (controls.imput.value == true) {
        if (controls.ar_amt.value != 0 &&  controls.ar_amt.value != null  ) {
      this.accountReceivableService
          .getBy({
                ar_bill: controls.ar_bill.value,
                ar_type: "I",
                ar_open: true,
          })
          .subscribe((resp: any) => {
            this.detail  = resp.data;
           console.log(this.detail)
         
            var applied = 0;
            var rest = Number(controls.ar_amt.value);
            //console.log(rest)
            for (var object = 0; object < this.detail.length; object++) {
              if (rest >0) {
              if ((Number(this.detail[object].ar_amt) - Number(this.detail[object].ar_applied)) > rest)  {
                 applied = rest;
               } else { applied =  (Number(this.detail[object].ar_amt) - Number(this.detail[object].ar_applied))}
            
              this.gridService.addItem(
                    {
                      id: object + 1,
                      ard_ref: this.detail[object].ar_nbr,
                      ref: this.detail[object].ar_nbr,
                      effdate: this.detail[object].ar_effdate,
                      ard_amt: this.detail[object].ar_amt,
                      open: Number(this.detail[object].ar_amt) - Number(this.detail[object].ar_applied),
                     applied: applied,
                     apamt: applied,
                     ard_type: "I",
                     ard_acct: this.customer.cm_ar_acct,
                     ard_sub: this.customer.cm_ar_sub,
                     ard_cc: this.customer.cm_ar_cc,
                     ard_ex_rate: controls.ar_ex_rate.value,
                     ard_ex_rate2: controls.ar_ex_rate2.value,
                     ard_dy_code: controls.ar_dy_code.value,
                    },
                    { position: "bottom" }
                  );
                rest = rest - applied;
              
            } 
          }
          if (rest > 0 ) {

            this.gridService.addItem(
              {
                id: object + 1,
                ard_ref: null,
                ref: null,
                effdate: controls.ar_effdate.value
                ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
                : null,
                ard_amt: rest,
                open: rest,
               applied: rest,
               apamt: applied,
               ard_type: "U",
               ard_acct: this.customer.cm_act_acct,
               ard_sub: this.customer.cm_act_sub,
               ard_cc: this.customer.cm_act_cc,
               ard_ex_rate: controls.ar_ex_rate.value,
               ard_ex_rate2: controls.ar_ex_rate2.value,
               ard_dy_code: controls.ar_dy_code.value,
              
              },
              { position: "bottom" }
            );
            
          }
          this.rest = rest;
          console.log(this.dataset)
        })
      }  else {

        alert("Montant doit etre superieur a 0")
        document.getElementById("ar_amt").focus();
        controls.imput.setValue( false)
        controls.ar_amt.setValue( 0)
      }
    } 
    }

    addNewItem() {
      const controls = this.arForm.controls;
  
      if (controls.imput.value == false ) {
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          ard_ref: "",
          effdate: null,
          ard_amt: 0,
          applied: 0,
        },
        { position: "bottom" }
      );
    } else { 
  alert("vous ne pouvez pas ajouter de ligne")
  
    }
    }
  
  //reste form
  reset() {
    this.accountReceivable = new AccountReceivable();
    this.createForm();
    this.dataset = [];
    this.ihdataset = [];
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.arForm.controls;
    /** check form */
    if (this.arForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }
    if(this.compta) {
    if(this.cfdataset.length == 0) {
      this.message = "Ecriture comptable vide.";
      this.hasFormErrors = true;

    //   return;
   

    }
  }
   
    
    let ap = this.prepareAP()
    this.addAP(ap, this.dataset, this.cfdataset);


  }

  prepareAP(): any {
    const controls = this.arForm.controls;
   
    const _ar = new AccountReceivable();
   //console.log(controls.ar_check.value) 
    _ar.ar_bill = controls.ar_bill.value;
    _ar.ar_check = controls.ar_check.value;
    
    _ar.ar_effdate = controls.ar_effdate.value
      ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
      : null;

      _ar.ar_due_date = controls.ar_due_date.value
      ? `${controls.ar_due_date.value.year}/${controls.ar_due_date.value.month}/${controls.ar_due_date.value.day}`
      : null;  
    
    _ar.ar_curr = controls.ar_curr.value;
    _ar.ar_ex_rate  = controls.ar_ex_rate.value;
    _ar.ar_ex_rate2 = controls.ar_ex_rate2.value;

    _ar.ar_type = "P";

   _ar.ar_bank = controls.ar_bank.value;
   _ar.ar_dy_code = controls.ar_dy_code.value;

   _ar.ar_batch = controls.ar_batch.value;
 
   _ar.ar_acct = controls.ar_acct.value;
   _ar.ar_disc_acct = controls.ar_disc_acct.value;
    _ar.ar_cr_terms = controls.ar_cr_terms.value;
    _ar.ar_amt = - controls.ar_amt.value;
    _ar.ar_po = controls.ar_po.value;
    _ar.ar_applied = -( Number(controls.ar_amt.value) - Number(this.rest))

    _ar.ar_base_amt = - (Number(controls.ar_amt.value) * Number(controls.ar_ex_rate2.value) / Number(controls.ar_ex_rate.value));
    _ar.ar_base_applied =  -((Number(controls.ar_amt.value) - Number(this.rest)) * Number(controls.ar_ex_rate2.value) / Number(controls.ar_ex_rate.value));
     if (this.rest == 0 ) {_ar.ar_open = false} else { _ar.ar_open = true }
    return _ar;
  
  }
  /**
   * Add po
   *
   * @param _ar: ap
   */
  addAP(_ar: any, detail: any, cfdetail:any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let ar = null;
    const controls = this.arForm.controls;

    this.accountReceivableService
      .add({ accountReceivable: _ar, accountReceivableDetail: detail, gldetail: cfdetail })
      .subscribe(
        (reponse: any) => (ar = reponse.data, this.arr= reponse.data),
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
          this.loadingSubject.next(false);
          if(controls.print.value == true) this.printpdf(ar.ar_nbr) //printIH(this.customer, iharray, ih,this.curr);
          console.log(this.dataset);
          this.reset()
          this.router.navigateByUrl("/account-receivable/create-account-receivable");
          this.reset()
        }
      );
  }
 
  
  changeCurr(){
    const controls = this.arForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.vh_curr.value
    const date = new Date()
    this.date = controls.ar_effdate.value
    ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
        const {data} = res
        //console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "cette devise n'existe pas",
            MessageType.Create,
            10000,
            true,
            true
        )
    this.error = true}
        else {
            this.error = false
            this.curr = data 
            if (cu_curr == 'DA'){
              controls.ar_ex_rate.setValue(1)
              controls.ar_ex_rate2.setValue(1)

            } else {

              //console.log(this.date)
            this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            // console.log("here")
             //console.log(res.data)
              controls.ar_ex_rate.setValue(res.data.exr_rate)
               controls.ar_ex_rate2.setValue(res.data.exr_rate2)
              })
     
              }
        }


    },error=>console.log(error))
}
changeRateCurr(){
  const controls = this.arForm.controls // chof le champs hada wesh men form rah
  const cu_curr  = controls.vh_curr.value

  const date = new Date()

  this.date = controls.ar_effdate.value
    ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    if (cu_curr == 'DA'){
      controls.ar_ex_rate.setValue(1)
      controls.ar_ex_rate2.setValue(1)

    } else {
          this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            

             controls.ar_ex_rate.setValue(res.data.exr_rate)
             controls.ar_ex_rate2.setValue(res.data.exr_rate2)
            })
   
    }
           
          
  
}


onChangeBank(){
  const controls = this.arForm.controls // chof le champs hada wesh men form rah
  const bk_code  = controls.ar_bank.value ;      
  this.bankService.getAR({bk_code}).subscribe((res:any)=>{
      const {data} = res
      if (res.data.bank == null){
         this.layoutUtilsService.showActionNotification(
          "cette Banque n'existe pas",
          MessageType.Create,
          10000,
          true,
          true
      )
  this.error = true}
      else {

        this.accountReceivableService.getByOne({ar_bank: bk_code, ar_check: controls.ar_check.value}).subscribe((res:any)=>{
         
         // console.log(res.data)

          if (!res.data.accountReceivable) {
     
          this.error = false

          controls.bank_name.setValue(res.data.bank.bk_desc || "")
          controls.ar_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
          controls.ar_cr_terms.setValue(res.data.details[0].bkd_pay_method || "")
                   
          this.ar_cr_terms = res.data.details
          } else {
            this.layoutUtilsService.showActionNotification(
        
            "ce Numero cheque exist pour un autre Banque ",
            MessageType.Create,
            10000,
            true,
            true
            )




          }

      })


  } }, error=>console.log(error))

}
onChangePM(){
  const controls = this.arForm.controls // chof le champs hada wesh men form rah
  const bkd_pay_method  = controls.ar_cr_terms.value ;      
  this.bankService
  .getAllDetails({bkd_bank: controls.ar_bank.value,
                  bkd_module: "AR",
                  bkd_pay_method: controls.ar_cr_terms.value,   
                 }).subscribe((res:any)=>{
   
                  controls.ar_dy_code.setValue(res.data[0].bkd_dy_code || "")
          
      })



}
onChangeBatch(){
const controls = this.arForm.controls;
controls.ar_amt.setValue(null)
  controls.ar_amt.enable()
  document.getElementById("ar_amt").focus(); 
this.dataset = []
this.cfdataset = []
}
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // add new Item to Datatable
/*addNewItem() {
    this.gridServiceih.addItem(
      {
        id: this.ihdataset.length + 1,
        idh_line: this.ihdataset.length + 1,
        idh_part: "",
        desc: "",
        idh_qty_inv: 0,
        idh_um: "",
        idh_price: 0,
        idh_disc_pct:0,
        idh_taxable: false,
        idh_taxc:0,
      },
      { position: "bottom" }
    );
  }
  addsameItem(i ) {
    console.log(i)
    console.log(this.dataset)
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        psh_line: this.dataset.length + 1,
        psh_part: this.dataset[i - 1].psh_part,
        cmvid: "",
        desc: this.dataset[i - 1].desc,
        psh_qty_ship: 0,
        psh_um: this.dataset[i - 1].psh_um,
        psh_um_conv: this.dataset[i - 1].psh_um_conv,
        psh_price: this.dataset[i - 1].psh_price,
        psh_site: this.dataset[i - 1].psh_site,
        psh_loc: this.dataset[i - 1].psh_loc,
        psh_serial: "",
        tr_status: "",
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  */
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
 
handleSelectedRowsChangedbill(e, args) {
  const controls = this.arForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbill) {
    args.rows.map((idx) => {
      const date = new Date()

      this.date = controls.ar_effdate.value
    ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

      const item = this.gridObjbill.getDataItem(idx);
      
      
      this.customer = item;
      
      controls.ar_bill.setValue(this.customer.cm_addr || "")
                 
                  controls.ar_curr.enable()
                  controls.ar_cr_terms.enable()
                  
                  controls.ar_batch.enable()
                  //controls.ar_amt.enable()
                  controls.ar_acct.enable()
                  controls.ar_bank.enable()
                  controls.ar_disc_acct.enable()
                  controls.ar_dy_code.enable()
                  controls.ar_po.enable()
                  controls.ar_ex_rate.enable()
                  controls.ar_ex_rate2.enable()
                  controls.ar_check.enable()
                  
                  controls.imput.enable()

                  controls.name.setValue(this.customer.address.ad_name || "")
                  controls.ar_curr.setValue(this.customer.cm_curr || "")
                  controls.ar_bank.setValue(this.customer.cm_bank || "")
                  controls.ar_cr_terms.setValue(this.customer.cm_ckfrm || "")


                  this.deviseService.getBy({ cu_curr: item.cm_curr }).subscribe(
                    (res: any) => {
                      //console.log(res);
                      const { data } = res;
                if(data) {
            
                  this.curr = data;
                }
            
                    })
            
                    if (item.cm_curr == 'DA'){
                      controls.ar_ex_rate.setValue(1)
                      controls.ar_ex_rate2.setValue(1)
            
                    } else {
            
                    this.deviseService.getExRate({exr_curr1:item.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                      
                     // console.log(res.data)
                       controls.ar_ex_rate.setValue(res.data.exr_rate)
                       controls.ar_ex_rate2.setValue(res.data.exr_rate2)
                      })
            
                      }
            

                  this.bankService
                  .getAP({
                        bk_code: this.customer.cm_bank, 
                        
                  })
                  .subscribe((res: any) => {
                   
                    controls.bank_name.setValue(res.data.bank.bk_desc || "")
           
                    this.ar_cr_terms = res.data.details
         
                  })
                  this.bankService
                  .getAllDetails({
                        bkd_bank: this.customer.cm_bank,
                        bkd_module: "AR",
                        bkd_pay_method:  this.customer.cm_ckfrm,
                        
                  })
                  .subscribe((resp: any) => {
         
                   controls.ar_dy_code.setValue(resp.data[0].bkd_dy_code || "")
           
                  })
      

    });
  }
}

angularGridReadybill(angularGrid: AngularGridInstance) {
  this.angularGridbill = angularGrid;
  this.gridObjbill = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbill() {
  this.columnDefinitionsbill = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "cm_addr",
      name: "code",
      field: "cm_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Client",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cm_class",
      name: "Classe",
      field: "cm_class",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cm_type",
      name: "Type",
      field: "cm_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cm_curr",
      name: "Devise",
      field: "cm_curr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "address.ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "address.ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "address.ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsbill = {
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
  this.customerService
    .getAll()
    .subscribe((response: any) => (this.bills = response.data));
}
openbill(content) {
  this.prepareGridbill();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedcurr(e, args) {
  const controls = this.arForm.controls;
  if (Array.isArray(args.rows) && this.gridObjcurr) {
    args.rows.map((idx) => {
      const item = this.gridObjcurr.getDataItem(idx);
      controls.ar_curr.setValue(item.cu_curr || "");
    });
  }
}

angularGridReadycurr(angularGrid: AngularGridInstance) {
  this.angularGridcurr = angularGrid;
  this.gridObjcurr = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridcurr() {
  this.columnDefinitionscurr = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "cu_curr",
      name: "code",
      field: "cu_curr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cu_desc",
      name: "Designation",
      field: "cu_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cu_rnd_mthd",
      name: "Methode Arrondi",
      field: "cu_rnd_mthd",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "cu_active",
      name: "Actif",
      field: "cu_active",
      sortable: true,
      filterable: true,
      type: FieldType.boolean,
    },
    {
      id: "cu_iso_curr",
      name: "Devise Iso",
      field: "cu_iso_curr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionscurr = {
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
  };

  // fill the dataset with your data
  this.deviseService
    .getAll()
    .subscribe((response: any) => (this.devises = response.data));
}
opencurr(content) {
  this.prepareGridcurr();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChanged4(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  const controls = this.arForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {

      
      const item = this.gridObj4.getDataItem(idx);
     
      this.find = false;
    //  console.log(this.invoice)
      if(this.invoice.length != 0) {
      for (var i = 0; i < this.invoice.length; i++) {
        if (this.invoice[i].nbr == item.ar_nbr ) { 
          
          this.find = true };
      } 
    }
      if (this.find) { 

        alert("Facture deja choisi")
        updateItem.ard_ref = null
        this.gridService.updateItem(updateItem);
      
      } else {
      
      updateItem.ard_ref = item.ar_nbr
      updateItem.effdate = item.ar_effdate
      updateItem.ard_amt = item.ar_amt
      
      updateItem.open = item.ar_amt - item.ar_applied
      this.gridService.updateItem(updateItem);
      this.invoice.push({ nbr: item.ar_nbr});
                                
      console.log(this.invoice)
    }  
    });
  
  }
}
angularGridReady4(angularGrid: AngularGridInstance) {
  this.angularGrid4 = angularGrid;
  this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid4() {
  const controls = this.arForm.controls;
  this.columnDefinitions4 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "ar_nbr",
      name: "Facture ",
      field: "ar_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ar_effdate",
      name: "Date Effet",
      field: "ar_effdate",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ar_amt",
      name: "Montant",
      field: "ar_amt",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "ar_applied",
      name: "Montant Appliqué",
      field: "ar_applied",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
  ];

  this.gridOptions4 = {
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
  };

  // fill the dataset with your data
  this.accountReceivableService
    .getBy({ar_bill: controls.ar_bill.value, ar_type: "I", ar_open: true})
    .subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}





oncreateGL() {
  const controls = this.arForm.controls;
  
  
  this.cfdataset = [];
  
  console.log(this.rest)
//this.gridServicecf.addItem(
  if (this.dataset.length == 0 ) {
      this.cfdataset.push(  
      {
          id: 1,
          glt_ref: this.customer.cm_addr,

          glt_desc: this.customer.address.ad_name,
          glt_acct: this.customer.cm_act_acct,
          glt_sub: this.customer.cm_act_sub,
          glt_cc: this.customer.cm_act_cc,
          glt_dy_code: controls.ar_dy_code.value ,
          glt_cur_amt: - controls.ar_amt.value * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value) ,
          glt_amt:   - controls.ar_amt.value,
          

        } ,
      /* { position: "bottom" }*/
      );

      this.bankService
      .getBy({
            bk_code: this.customer.cm_bank,
            
      })
      .subscribe((resp: any) => {

//console.log(resp.data.bank)

this.bank = resp.data.bank;

this.gridServicecf.addItem(
        {
            id: 2,
            glt_ref: this.bank.bk_code,
  
            glt_desc: this.bank.address.ad_name,
            glt_acct: this.bank.bk_pip_acct,
            glt_sub: this.bank.bk_pip_sub,
            glt_cc: this.bank.bk_pip_cc,
            glt_dy_code: controls.ar_dy_code.value ,
            glt_cur_amt:  controls.ar_amt.value * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value),
            glt_amt:   controls.ar_amt.value,
            
  
          } ,
         { position: "bottom" }
        );
      })

        } else {

          if (this.rest != 0)
          {
          this.cfdataset.push(  
            {
                id: 1,
                glt_ref: this.customer.cm_addr,
      
                glt_desc: this.customer.address.ad_name,
                glt_acct: this.customer.cm_ar_acct,
                glt_sub: this.customer.cm_ar_sub,
                glt_cc: this.customer.cm_ar_cc,
                glt_dy_code: controls.ar_dy_code.value ,
                glt_cur_amt: - (Number(controls.ar_amt.value) - this.rest) * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value),
                glt_amt:   - (Number(controls.ar_amt.value) - this.rest),
                
      
              } ,
            /* { position: "bottom" }*/
            );

            this.cfdataset.push(
              {
                  id: 2,
                  
                  glt_ref: this.customer.cm_addr,

                  glt_desc: this.customer.address.ad_name,
                  glt_acct: this.customer.cm_act_acct,
                  glt_sub: this.customer.cm_act_sub,
                  glt_cc: this.customer.cm_act_cc,
                  glt_dy_code: controls.ar_dy_code.value ,
                  glt_cur_amt: - this.rest * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value),
                  glt_amt:   - this.rest,
          
                } ,
             
              );
            
            
            this.bankService
            .getBy({
                  bk_code: controls.ar_bank.value,
                  
            })
            .subscribe((resp: any) => {
      
    //  console.log(resp.data.bank)
      
      this.bank = resp.data.bank;
      
      this.gridServicecf.addItem(
              {
                  id: 3,
                  glt_ref: this.bank.bk_code,
        
                  glt_desc: this.bank.address.ad_name,
                  glt_acct: this.bank.bk_pip_acct,
                  glt_sub: this.bank.bk_pip_sub,
                  glt_cc: this.bank.bk_pip_cc,
                  glt_dy_code: controls.ar_dy_code.value ,
                  glt_cur_amt:   controls.ar_amt.value * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value),
                  glt_amt:    controls.ar_amt.value,
                  
        
                } ,
               { position: "bottom" }
              );
            })
          } else {

            this.cfdataset.push(  
              {
                  id: 1,
                  glt_ref: this.customer.cm_addr,
        
                  glt_desc: this.customer.address.ad_name,
                  glt_acct: this.customer.cm_ar_acct,
                  glt_sub: this.customer.cm_ar_sub,
                  glt_cc: this.customer.cm_ar_cc,
                  glt_dy_code: controls.ar_dy_code.value ,
                  glt_cur_amt: - (Number(controls.ar_amt.value) - this.rest) * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value),
                  glt_amt:   - (Number(controls.ar_amt.value) - this.rest),
                  
        
                } ,
              /* { position: "bottom" }*/
              );
              this.bankService
            .getBy({
                  bk_code: controls.ar_bank.value,
                  
            })
            .subscribe((resp: any) => {
      
    //  console.log(resp.data.bank)
      
      this.bank = resp.data.bank;
      
      this.gridServicecf.addItem(
              {
                  id: 2,
                  glt_ref: this.bank.bk_code,
        
                  glt_desc: this.bank.address.ad_name,
                  glt_acct: this.bank.bk_pip_acct,
                  glt_sub: this.bank.bk_pip_sub,
                  glt_cc: this.bank.bk_pip_cc,
                  glt_dy_code: controls.ar_dy_code.value ,
                  glt_cur_amt:   controls.ar_amt.value * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value),
                  glt_amt:    controls.ar_amt.value,
                  
        
                } ,
               { position: "bottom" }
              );
            })

          }



        }
      




      } 


      handleSelectedRowsChangedbank(e, args) {
        const controls = this.arForm.controls;
        if (Array.isArray(args.rows) && this.gridObjbank) {
          args.rows.map((idx) => {
            const item = this.gridObjbank.getDataItem(idx);
            controls.ar_bank.setValue(item.bk_code || "");
            controls.bank_name.setValue(item.address.ad_name || "");


            this.bankService.getAR({bk_code: item.bk_code}).subscribe((res:any)=>{
             // console.log(res.data)
                  controls.ar_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
                  controls.ar_cr_terms.setValue(res.data.details[0].bkd_pay_method || "")
                           
                  this.ar_cr_terms = res.data.details

                });        
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
          .subscribe((response: any) => (this.banks = response.data));
      }
      openbank(content) {
        this.prepareGridbank();
        this.modalService.open(content, { size: "lg" });
      }
      


      printpdf(nbr) {
        const controls = this.arForm.controls 
        console.log("pdf")
        var doc = new jsPDF();
       
       // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
        var img = new Image()
        img.src = "./assets/media/logos/company.png";
        img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 170, 2, 45, 30);
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
        doc.setFontSize(12);
        doc.text( 'Paiement N°: ' + nbr  , 70, 50);
       // doc.setFontSize(8);
       // console.log(this.customer.address.ad_misc2_id)
        doc.text('Code Client : ' + this.customer.cm_addr, 20 , 60 )
        doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 65)
      if(this.customer.address.ad_line1 != null) { doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 70)}
        if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 75)}
            if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 80)}
            if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 85)}
            if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 90)}
          
        
            doc.text('Date         : ' + this.arr.ar_effdate, 20 , 95)
            let nbm = - Number(this.arr.ar_base_amt)

            let mts =  String(  Number(nbm).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }))
            console.log(mts)
            let mnsolde = replaceAll(mts,","," ")
            console.log(mnsolde)
            doc.text('Montant      : ' + (mnsolde), 20 , 100)
          if(this.arr.ar_po != null) { doc.text('Observation         : ' + this.arr.ar_po, 20 , 105)}

          let mt = NumberToLetters(
            Number(- Number(this.arr.ar_base_amt)).toFixed(2),this.curr.cu_desc)
      
            if (mt.length > 85) {
              let mt1 = mt.substring(80)
              let ind = mt1.indexOf(' ')
             
              mt1 = mt.substring(0, 80  + ind)
              let mt2 = mt.substring(80+ind)
         
              doc.text( "Montant du Paiement" + mt1  , 20, 110)
              doc.text(  mt2  , 20, 115)
            } else {
              doc.text( "Montant du Paiement :" + mt  , 20, 110)
      
            }
          
            // window.open(doc.output('bloburl'), '_blank');
          //window.open(doc.output('blobUrl'));  // will open a new tab
          var blob = doc.output("blob");
          window.open(URL.createObjectURL(blob));
      
        }
        
    }
    
