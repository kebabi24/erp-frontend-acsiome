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
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
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
 
  ProviderService,
  AddressService,
  DeviseService,
  CodeService,
  BankService,
  VoucherOrderService,
  AccountPayable,
  AccountPayableService,
  DaybookService,
  EntityService,
  ConfigService,
 

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";

@Component({
  selector: 'kt-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})
export class CreatePaymentComponent implements OnInit {

 
  accountPayable: AccountPayable;
  apForm: FormGroup;
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
  

  dataentity: []
  columnDefinitionsentity: Column[] = []
  gridOptionsentity: GridOption = {}
  gridObjentity: any
  angularGridentity: AngularGridInstance


  journals: [];
  columnDefinitionsjournal: Column[] = [];
  gridOptionsjournal: GridOption = {};
  gridObjjournal: any;
  angularGridjournal: AngularGridInstance;

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
  ap_cr_termss: any[] = [];
  detail = [];
  invoice: any[];
  user;
  bank;
  pshnbr: String;
  isExist: Boolean;
  isExistc: Boolean;
  provider;
  curr: any;  
  find: Boolean;
  rest: number;
  date: String;
  timbre: Number;
  compta: Boolean = false
  declared: Boolean = false
  constructor(
    config: NgbDropdownConfig,
    private apFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private providerService: ProviderService,
   
    private voucherOrderService: VoucherOrderService,
    private accountPayableService: AccountPayableService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private bankService: BankService, 
    private entityService: EntityService,
    private daybookService: DaybookService, 
    private configService: ConfigService,

  ) {
    config.autoClose = true;
      this.codeService
        .getBy({ code_fldname: "check_form" })
        .subscribe((response: any) => {
          const { data } = response;
          this.ap_cr_termss = data;
          if (!data) {
            this.message = "veuillez verifier votre connexion";
            this.hasFormErrors = true;
            return;
            // controls.wo_site.setValue("");
          }
        });
        console.log(this.ap_cr_termss)
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
        id: "apd_ref",
        name: "N° Facture",
        field: "apd_ref",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        
        editor: {
          model: Editors.text,
       },
       onCellChange: (e: Event, args: OnEventArgs) => {
         
        const controls  = this.apForm.controls
        console.log(args.dataContext.apd_ref)
        var inv = args.dataContext.ref;
                if (controls.imput.value  == true) { 
        
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , apd_ref: inv })
                 alert("Vous ne pouvez pas modifier une ligne de Facture")
                            
                } else 
                {
        this.find = false;
                  for (var i = 0; i < this.invoice.length; i++) {
                    if (this.invoice[i].nbr == args.dataContext.apd_ref ) { this.find = true };
                  } 
                  if (this.find) { 
        
                    alert("Facture deja choisi")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , apd_ref: null })
                  } else {
                  this.accountPayableService.getByOne({ap_nbr: args.dataContext.apd_ref, ap_type: "I", ap_open: true }).subscribe((resp:any)=>{
                   // console.log(resp.data)
                                if (resp.data) {
                    
                                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , effdate: resp.data.ap_effdate , apd_amt: resp.data.ap_amt, open: resp.data.ap_amt - resp.data.ap_applied})
                    
                                  this.invoice.push({ nbr: args.dataContext.apd_ref});
                                
                                  console.log(this.invoice)
                             }  else {
                                alert("Facture Nexiste pas")
                                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , apd_ref: null })
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
          const controls = this.apForm.controls;
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
        id: "apd_amt",
        name: "Montant",
        field: "apd_amt",
        sortable: true,
        minWidth: 200,
        maxWidth: 200,
        filterable: false,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      
      
        
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
          const controls  = this.apForm.controls
      //  console.log(args.dataView.apd_ref)
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
        displayNegativeNumberWithParentheses: false,
  
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
      id: "glt_line",
      name: "Ligne",
      field: "glt_line",
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
      id: "glt_curr_amt",
      name: "Montant Devise",
      field: "glt_curr_amt",
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
    this.createForm();
    this.codeService
    .getBy({ code_fldname: "check_form" })
    .subscribe((response: any) => {
      const { data } = response;
      this.ap_cr_termss = data;
      if (!data) {
        this.message = "veuillez verifier votre connexion";
        this.hasFormErrors = true;
        return;
        // controls.wo_site.setValue("");
      }
    });
    console.log(this.ap_cr_termss)
 
  }

  
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.accountPayable = new AccountPayable();
      const date = new Date;
      
      this.apForm = this.apFB.group({
    //    so__chr01: [this.accountPayable.ap__chr01],
       
        ap_vend: [this.accountPayable.ap_vend  , Validators.required],
        name: [{value:"", disabled: true}],
        
      
        ap_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
       }],
        ap_due_date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        ap_curr:  [{value: this.accountPayable.ap_curr ,disabled: !this.isExistc }, Validators.required],
        ap_cr_terms: [{value: this.accountPayable.ap_cr_terms ,disabled: !this.isExistc }],
       // ap_type:  [{value: this.accountPayable.ap_type ,disabled: !this.isExistc }, Validators.required],
        ap_batch:  [{value: 0 , disabled: !this.isExistc }],
        ap_amt:  [{value: 0 , disabled: !this.isExistc }],
        ap_acct:  [{value: this.accountPayable.ap_acct ,disabled: !this.isExistc }],
        ap_bank:  [{value: this.accountPayable.ap_bank ,disabled: !this.isExistc } , Validators.required],
        bank_name: [{value: "", disabled: true}],
        ap_disc_acct:  [{value: this.accountPayable.ap_disc_acct ,disabled: !this.isExistc }],
        ap_dy_code:  [{value: this.accountPayable.ap_dy_code ,disabled: !this.isExistc }],
        ap_check:  [{value: this.accountPayable.ap_check ,disabled: !this.isExistc }, Validators.required],
        ap_po:  [{value: this.accountPayable.ap_po ,disabled: !this.isExistc }],
        
        ap_ex_rate: [{value: this.accountPayable.ap_ex_rate, disabled: !this.isExistc }],
        ap_ex_rate2: [{value: this.accountPayable.ap_ex_rate2, disabled: !this.isExistc }],
        ap_entity:  [{value: this.accountPayable.ap_entity ,disabled: !this.isExistc } , Validators.required],
        imput:  [{value: false ,disabled: !this.isExistc }],
       


      });
  
      
  
    }




    onChangeCheck() {
      const controls  = this.apForm.controls
      this.accountPayableService
          .getByOne({
                ap_check: controls.ap_check.value,
                ap_bank: controls.ap_bank.value,
          })
          .subscribe((response: any) => {
            //  const {data} = response.data;
             // console.log(response.data)
              if (response.data) {
                alert("N° cheque exist pour une autre banque")

                 controls.ap_check.setValue(null) 
                 document.getElementById("ap_check").focus(); 
              }             
        })
    }

    onChangeBill() {
      const controls  = this.apForm.controls
      const date = new Date()

      this.date = controls.ap_effdate.value
    ? `${controls.ap_effdate.value.year}/${controls.ap_effdate.value.month}/${controls.ap_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      this.providerService
          .getBy({
                vd_addr: controls.ap_vend.value,
          })
          .subscribe((response: any) => {
            
            this.provider = response.data;
         //   console.log(this.provider)
       

              if (response.data) {
                  this.isExistc = true
     //             console.log(response.data)
                  
                  
                  controls.ap_effdate.enable()
                  controls.ap_curr.enable()
                  controls.ap_cr_terms.enable()
                  controls.ap_ex_rate.enable()
                  controls.ap_ex_rate2.enable()
                  controls.ap_batch.enable()
                  //controls.ap_amt.enable()
                  controls.ap_acct.enable()
                  controls.ap_bank.enable()
                  controls.ap_disc_acct.enable()
                  controls.ap_dy_code.enable()
                  controls.ap_po.enable()
                  controls.imput.enable()
                  controls.ap_check.enable()
                  controls.name.setValue(this.provider.address.ad_name || "")
                  controls.ap_curr.setValue(this.provider.vd_curr || "")
                  controls.ap_bank.setValue(this.provider.vd_bank || "")
                  controls.ap_cr_terms.setValue(this.provider.vd_ckfrm || "")
                  

                  this.deviseService.getBy({ cu_curr: this.provider.vd_curr }).subscribe(
                    (res: any) => {
                     // console.log(res);
                      const { data } = res;
                if(data) {
      
                  this.curr = data;
                }
      
                    })
      
                    if (this.provider.vd_curr == 'DA'){
                      controls.ap_ex_rate.setValue(1)
                      controls.ap_ex_rate2.setValue(1)
        
                    } else {
        
                    this.deviseService.getExRate({exr_curr1:this.provider.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                      
                       controls.ap_ex_rate.setValue(res.data.exr_rate)
                       controls.ap_ex_rate2.setValue(res.data.exr_rate2)
                      })
        
                      }
                 
                  this.bankService
                  .getAP({
                        bk_code: this.provider.vd_bank,
                  })
                  .subscribe((res: any) => {
                    //console.log("jjjjjj",res.data)
                    controls.bank_name.setValue(res.data.bank.bk_desc || "")
                    controls.ap_entity.setValue(res.data.bank.bk_entity || "")
                    this.ap_cr_termss = res.data.details
         
                  })
                  this.bankService
                  .getAllDetails({
                        bkd_bank: this.provider.vd_bank,
                        bkd_module: "AP",
                        bkd_pay_method:  this.provider.vd_ckfrm,
                        
                  })
                  .subscribe((resp: any) => {
                   // console.log(resp.data)
         
                   controls.ap_dy_code.setValue(resp.data[0].bkd_dy_code || "")
           
                  })
              
                 

              } else {
              alert("Ce Fournisseur n'exist pas")
              controls.ap_vend.setValue(null)
              document.getElementById("bill").focus();
              }
               
        })
    }
    onChangeAmt() {

      const controls  = this.apForm.controls
      
      if (controls.ap_amt.value != controls.ap_batch.value ) {
        alert(" montant doit etre egale au montant du controle")
        controls.ap_amt.setValue(null)
        document.getElementById("ap_amt").focus();
      }
      else {this.rest = Number(controls.ap_amt.value);
        this.invoice = [];
       }

    }
    onChangeImput() {
      this.dataset = [];
      this.cfdataset = [];
      this.invoice = [];
      const controls  = this.apForm.controls
     // this.rest = Number(controls.ap_amt.value)
      if (controls.imput.value == true) {
        if (controls.ap_amt.value != 0 &&  controls.ap_amt.value != null  ) {
      this.accountPayableService
          .getBy({
                ap_vend: controls.ap_vend.value,
                ap_type: "I",
                ap_open: true,
          })
          .subscribe((resp: any) => {
            this.detail  = resp.data;
           console.log(this.detail)
         
            var applied = 0;
            var rest = Number(controls.ap_amt.value);
            //console.log(rest)
            for (var object = 0; object < this.detail.length; object++) {
              if (rest >0) {
              if ((Number(this.detail[object].ap_amt) - Number(this.detail[object].ap_applied)) > rest)  {
                 applied = rest;
               } else { applied =  (Number(this.detail[object].ap_amt) - Number(this.detail[object].ap_applied))}
            
              this.gridService.addItem(
                    {
                      id: object + 1,
                      apd_ref: this.detail[object].ap_nbr,
                      ref: this.detail[object].ap_nbr,
                      effdate: this.detail[object].ap_effdate,
                      apd_amt: this.detail[object].ap_amt,
                      open: Number(this.detail[object].ap_amt) - Number(this.detail[object].ap_applied),
                     applied: applied,
                     apamt: applied,
                     apd_type: "VO",
                     apd_acct: this.provider.vd_ap_acct,
                     apd_sub: this.provider.vd_ap_sub,
                     apd_cc: this.provider.vd_ap_cc,
                     apd_ex_rate: controls.ap_ex_rate.value,
                     apd_ex_rate2: controls.ap_ex_rate2.value,
                     apd_dy_code: controls.ap_dy_code.value,
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
                apd_ref: null,
                ref: null,
                effdate: controls.ap_effdate.value
                ? `${controls.ap_effdate.value.year}/${controls.ap_effdate.value.month}/${controls.ap_effdate.value.day}`
                : null,
                apd_amt: rest,
                open: rest,
               applied: rest,
               apamt: applied,
               apd_type: "U",
               apd_acct: this.provider.vd_act_acct,
               apd_sub: this.provider.vd_act_sub,
               apd_cc: this.provider.vd_act_cc,
               apd_ex_rate: controls.ap_ex_rate.value,
               apd_ex_rate2: controls.ap_ex_rate2.value,
               apd_dy_code: controls.ap_dy_code.value,
              
              },
              { position: "bottom" }
            );
            
          }
          this.rest = rest;
          console.log(this.dataset)
        })
      }  else {

        alert("Montant doit etre superieur a 0")
        document.getElementById("ap_amt").focus();
        controls.imput.setValue( false)
        controls.ap_amt.setValue( 0)
      }
    } 
    }

    addNewItem() {
      const controls = this.apForm.controls;
  
      if (controls.imput.value == false ) {
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          apd_ref: "",
          effdate: null,
          apd_amt: 0,
          applied: 0,
          apd_type: "VO",
          apd_acct: this.provider.vd_ap_acct,
          apd_sub: this.provider.vd_ap_sub,
          apd_cc: this.provider.vd_ap_cc,
          apd_ex_rate: controls.ap_ex_rate.value,
          apd_ex_rate2: controls.ap_ex_rate2.value,
          apd_dy_code: controls.ap_dy_code.value,
        },
        { position: "bottom" }
      );
    } else { 
  alert("vous ne pouvez pas ajouter de ligne")
  
    }
    }
  
  //reste form
  reset() {
    this.accountPayable = new AccountPayable();
    this.createForm();
    this.dataset = [];
    this.ihdataset = [];
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.apForm.controls;
    /** check form */
    if (this.apForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }
    // if(this.cfdataset.length == 0) {
    //   this.message = "Ecriture comptable vide.";
    //   this.hasFormErrors = true;

    //   return;
   

    // }

   
    
    let ap = this.prepareAP()
    this.addAP(ap, this.dataset, this.cfdataset);


  }

  prepareAP(): any {
    const controls = this.apForm.controls;
   console.log(controls.ap_ex_rate,controls.ap_ex_rate2)
    const _ap = new AccountPayable();
   console.log(controls.ap_check.value) 
    _ap.ap_vend = controls.ap_vend.value;
    _ap.ap_check = controls.ap_check.value;
    
    _ap.ap_effdate = controls.ap_effdate.value
      ? `${controls.ap_effdate.value.year}/${controls.ap_effdate.value.month}/${controls.ap_effdate.value.day}`
      : null;

      _ap.ap_due_date = controls.ap_due_date.value
      ? `${controls.ap_due_date.value.year}/${controls.ap_due_date.value.month}/${controls.ap_due_date.value.day}`
      : null;  
    
    _ap.ap_curr = controls.ap_curr.value;
    _ap.ap_ex_rate  = controls.ap_ex_rate.value;
    _ap.ap_ex_rate2 = controls.ap_ex_rate2.value;

    _ap.ap_type = "P";

   _ap.ap_bank = controls.ap_bank.value;
   _ap.ap_dy_code = controls.ap_dy_code.value;

   _ap.ap_batch = controls.ap_batch.value;
 
   _ap.ap_acct = controls.ap_acct.value;
   _ap.ap_disc_acct = controls.ap_disc_acct.value;
    _ap.ap_cr_terms = controls.ap_cr_terms.value;
    _ap.ap_amt = - controls.ap_amt.value;
    _ap.ap_po = controls.ap_po.value;
    _ap.ap_applied = -( Number(controls.ap_amt.value) - Number(this.rest))
    _ap.ap_entity = controls.ap_entity.value;
    _ap.ap_base_amt = - (Number(controls.ap_amt.value) * Number(controls.ap_ex_rate2.value) / Number(controls.ap_ex_rate.value));
    _ap.ap_base_applied =  -((Number(controls.ap_amt.value) - Number(this.rest)) * Number(controls.ap_ex_rate2.value) / Number(controls.ap_ex_rate.value));
     if (this.rest == 0 ) {_ap.ap_open = false} else { _ap.ap_open = true }
    return _ap;
  
  }
  /**
   * Add po
   *
   * @param _ap: ap
   */
  addAP(_ap: any, detail: any, cfdetail:any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    for (let data of cfdetail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let ar = null;
    const controls = this.apForm.controls;

    this.accountPayableService
      .add({ accountPayable: _ap, accountPayableDetail: detail, gldetail: cfdetail })
      .subscribe(
        (reponse: any) => (ar = reponse.data),
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
          console.log(this.dataset);
          
          this.router.navigateByUrl("/account-payable/list-payment");
          this.reset()
        }
      );
  }
 
  
  changeCurr(){
    const controls = this.apForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.vh_curr.value
    const date = new Date()
    this.date = controls.ap_effdate.value
    ? `${controls.ap_effdate.value.year}/${controls.ap_effdate.value.month}/${controls.ap_effdate.value.day}`
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
              controls.ap_ex_rate.setValue(1)
              controls.ap_ex_rate2.setValue(1)

            } else {

              //console.log(this.date)
            this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            // console.log("here")
             //console.log(res.data)
              controls.ap_ex_rate.setValue(res.data.exr_rate)
               controls.ap_ex_rate2.setValue(res.data.exr_rate2)
              })
     
              }
        }


    },error=>console.log(error))
}
changeRateCurr(){
  const controls = this.apForm.controls // chof le champs hada wesh men form rah
  const cu_curr  = controls.vh_curr.value

  const date = new Date()

  this.date = controls.ap_effdate.value
    ? `${controls.ap_effdate.value.year}/${controls.ap_effdate.value.month}/${controls.ap_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    if (cu_curr == 'DA'){
      controls.ap_ex_rate.setValue(1)
      controls.ap_ex_rate2.setValue(1)

    } else {
          this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            

             controls.ap_ex_rate.setValue(res.data.exr_rate)
             controls.ap_ex_rate2.setValue(res.data.exr_rate2)
            })
   
    }
           
          
  
}


onChangeBank(){
  const controls = this.apForm.controls // chof le champs hada wesh men form rah
  const bk_code  = controls.ap_bank.value ;      
  this.bankService.getAP({bk_code}).subscribe((res:any)=>{
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

        this.accountPayableService.getByOne({ap_bank: bk_code, ap_check: controls.ap_check.value}).subscribe((res:any)=>{
         
         // console.log(res.data)

          if (!res.data.accountPayable) {
     
          this.error = false

          controls.bank_name.setValue(res.data.bank.bk_desc || "")
          controls.ap_entity.setValue(res.data.bank.bk_entity || "")
          controls.ap_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
          controls.ap_cr_terms.setValue(res.data.details[0].bkd_pay_method || "")
                 
          this.ap_cr_termss = res.data.details
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
  const controls = this.apForm.controls // chof le champs hada wesh men form rah
 const terms = controls.ap_cr_terms.value
  console.log(terms)  
  this.bankService
  .getAllDetails({bkd_bank: controls.ap_bank.value,
                  bkd_module: "AP",
                  bkd_pay_method: controls.ap_cr_terms.value,   
                 }).subscribe((res:any)=>{
   
                  controls.ap_dy_code.setValue(res.data[0].bkd_dy_code || "")
          
      })



}
onChangeBatch(){
const controls = this.apForm.controls;
controls.ap_amt.setValue(null)
  controls.ap_amt.enable()
  document.getElementById("ap_amt").focus(); 
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
  const controls = this.apForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbill) {
    args.rows.map((idx) => {
      const date = new Date()

      this.date = controls.ap_effdate.value
    ? `${controls.ap_effdate.value.year}/${controls.ap_effdate.value.month}/${controls.ap_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

      const item = this.gridObjbill.getDataItem(idx);
      
      
      this.provider = item;
      
      controls.ap_vend.setValue(this.provider.vd_addr || "")
                 
                  controls.ap_curr.enable()
                  controls.ap_cr_terms.enable()
                  
                  controls.ap_batch.enable()
                  //controls.ap_amt.enable()
                  controls.ap_acct.enable()
                  controls.ap_bank.enable()
                  controls.ap_disc_acct.enable()
                  controls.ap_dy_code.enable()
                  controls.ap_po.enable()
                  controls.ap_ex_rate.enable()
                  controls.ap_ex_rate2.enable()
                  controls.ap_check.enable()
                  
                  controls.imput.enable()

                  controls.name.setValue(this.provider.address.ad_name || "")
                  controls.ap_curr.setValue(this.provider.vd_curr || "")
                  controls.ap_bank.setValue(this.provider.vd_bank || "")
                  controls.ap_cr_terms.setValue(this.provider.vd_ckfrm || "")


                  this.deviseService.getBy({ cu_curr: item.vd_curr }).subscribe(
                    (res: any) => {
                      //console.log(res);
                      const { data } = res;
                if(data) {
            
                  this.curr = data;
                }
            
                    })
            
                    if (item.vd_curr == 'DA'){
                      controls.ap_ex_rate.setValue(1)
                      controls.ap_ex_rate2.setValue(1)
            
                    } else {
            
                    this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                      
                     // console.log(res.data)
                       controls.ap_ex_rate.setValue(res.data.exr_rate)
                       controls.ap_ex_rate2.setValue(res.data.exr_rate2)
                      })
            
                      }
            

                  this.bankService
                  .getAP({
                        bk_code: this.provider.vd_bank, 
                        
                  })
                  .subscribe((res: any) => {
                   
                    controls.bank_name.setValue(res.data.bank.bk_desc || "")
                    controls.ap_entity.setValue(res.data.bank.bk_entity || "")
                    this.ap_cr_termss = res.data.details
         
                  })
                  this.bankService
                  .getAllDetails({
                        bkd_bank: this.provider.vd_bank,
                        bkd_module: "AP",
                        bkd_pay_method:  this.provider.vd_ckfrm,
                        
                  })
                  .subscribe((resp: any) => {
         
                   controls.ap_dy_code.setValue(resp.data[0].bkd_dy_code || "")
           
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
      id: "vd_addr",
      name: "code",
      field: "vd_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Nom",
      field: "address.ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_class",
      name: "Classe",
      field: "vd_class",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_type",
      name: "Type",
      field: "vd_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "vd_curr",
      name: "Devise",
      field: "vd_curr",
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
      formatter:Formatters.checkmark,
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
  this.providerService
    .getAll()
    .subscribe((response: any) => (this.bills = response.data));
}
openbill(content) {
  this.prepareGridbill();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedcurr(e, args) {
  const controls = this.apForm.controls;
  if (Array.isArray(args.rows) && this.gridObjcurr) {
    args.rows.map((idx) => {
      const item = this.gridObjcurr.getDataItem(idx);
      controls.ap_curr.setValue(item.cu_curr || "");
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
  const controls = this.apForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {

      
      const item = this.gridObj4.getDataItem(idx);
     
      this.find = false;
    //  console.log(this.invoice)
      if(this.invoice.length != 0) {
      for (var i = 0; i < this.invoice.length; i++) {
        if (this.invoice[i].nbr == item.ap_nbr ) { 
          
          this.find = true };
      } 
    }
      if (this.find) { 

        alert("Facture deja choisi")
        updateItem.apd_ref = null
        this.gridService.updateItem(updateItem);
      
      } else {
      
      updateItem.apd_ref = item.ap_nbr
      updateItem.effdate = item.ap_effdate
      updateItem.apd_amt = item.ap_amt
      
      updateItem.open = item.ap_amt - item.ap_applied
      this.gridService.updateItem(updateItem);
      this.invoice.push({ nbr: item.ap_nbr});
                                
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
  const controls = this.apForm.controls;
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
      id: "ap_nbr",
      name: "Facture ",
      field: "ap_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ap_effdate",
      name: "Date Effet",
      field: "ap_effdate",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ap_amt",
      name: "Montant",
      field: "ap_amt",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "ap_applied",
      name: "Montant Appliqué",
      field: "ap_applied",
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
  this.accountPayableService
    .getBy({ap_vend: controls.ap_vend.value, ap_type: "I", ap_open: true})
    .subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}





oncreateGL() {
  const controls = this.apForm.controls;
  
  
  this.cfdataset = [];
  
  console.log(this.rest)
//this.gridServicecf.addItem(
  if (this.dataset.length == 0 ) {
    var i = 1
      this.cfdataset.push(  
      {
          id: i,
          glt_line: i,
          glt_ref: this.provider.vd_addr,

          glt_desc: this.provider.address.ad_name,
          glt_acct: this.provider.vd_act_acct,
          glt_sub: this.provider.vd_act_sub,
          glt_cc: this.provider.vd_act_cc,
          glt_dy_code: controls.ap_dy_code.value ,
          glt_curr_amt:  controls.ap_amt.value * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value) ,
          glt_amt:    controls.ap_amt.value,
          

        } ,
      /* { position: "bottom" }*/
      );

      if(controls.ap_cr_terms.value == "ES") {

        this.codeService
          .getBy({
                code_fldname: "vd_cr_terms",
                code_value: "ES"
                
          })
          .subscribe((resp: any) => {
    
  //  console.log(resp.data.bank)
   
    if (Number( controls.ap_amt.value) > 100000  ) { this.timbre =  Number( controls.ap_amt.value) * 2 / 100 }
    else{
      if (Number( controls.ap_amt.value) > 30000  ) { this.timbre =  Number( controls.ap_amt.value) * 1.5 / 100 }
      else{this.timbre =  Number( controls.ap_amt.value) * 1 / 100 }
    
      
    }
    if(Number(this.timbre) < 5){this.timbre = 5}
    this.gridServicecf.addItem(
            {
                id: i + 1,
                glt_line: i + 1,
                glt_ref: resp.data[0].code_value,
      
                glt_desc: resp.data[0].code_value,
                glt_acct: resp.data[0].chr01,
                glt_dy_code: controls.ap_dy_code.value ,
                glt_curr_amt:  - Number(this.timbre) * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value) ,
                glt_amt:   - this.timbre,
                
      
              } ,
             { position: "bottom" }
            );
          })
        i = i + 1
      } else { this.timbre = 0 }
    

      this.bankService
      .getBy({
            bk_code: controls.ap_bank.value,
            
      })
      .subscribe((resp: any) => {

//console.log(resp.data.bank)

this.bank = resp.data.bank;

this.gridServicecf.addItem(
        {
            id: i + 1,
            glt_line: i + 1,
            glt_ref: this.bank.bk_code,
  
            glt_desc: this.bank.address.ad_name,
            glt_acct: this.bank.bk_pip_acct,
            glt_sub: this.bank.bk_pip_sub,
            glt_cc: this.bank.bk_pip_cc,
            glt_dy_code: controls.ap_dy_code.value ,
            glt_curr_amt: -  ((this.timbre + controls.ap_amt.value) * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value)),
            glt_amt: -  (this.timbre + controls.ap_amt.value),
            
  
          } ,
         { position: "bottom" }
        );
      })

        } else {

          if (this.rest != 0)
          {


            console.log("hhhhhhhhhereeeeeeeeé", this.rest)
            var i = 1;
            if(Number(controls.ap_amt.value) - this.rest != 0) {
          this.cfdataset.push(  
            {
                id: i,
                glt_line: i,
                glt_ref: this.provider.vd_addr,
      
                glt_desc: this.provider.address.ad_name,
                glt_acct: this.provider.vd_ap_acct,
                glt_sub: this.provider.vd_ap_sub,
                glt_cc: this.provider.vd_ap_cc,
                glt_dy_code: controls.ap_dy_code.value ,
                glt_curr_amt:  (Number(controls.ap_amt.value) - this.rest) * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value),
                glt_amt:    (Number(controls.ap_amt.value) - this.rest),
                
      
              } ,
            /* { position: "bottom" }*/
            );

            this.cfdataset.push(
              {
                  id: i + 1,
                  glt_line: i + 1,
                  glt_ref: this.provider.vd_addr,

                  glt_desc: this.provider.address.ad_name,
                  glt_acct: this.provider.vd_act_acct,
                  glt_sub: this.provider.vd_act_sub,
                  glt_cc: this.provider.vd_act_cc,
                  glt_dy_code: controls.ap_dy_code.value ,
                  glt_curr_amt:  this.rest * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value),
                  glt_amt:    this.rest,
          
                } ,
             
              );
              } else {
                this.cfdataset.push(
                  {
                      id: i,
                      glt_line: i,
                      glt_ref: this.provider.vd_addr,
    
                      glt_desc: this.provider.address.ad_name,
                      glt_acct: this.provider.vd_act_acct,
                      glt_sub: this.provider.vd_act_sub,
                      glt_cc: this.provider.vd_act_cc,
                      glt_dy_code: controls.ap_dy_code.value ,
                      glt_curr_amt:  this.rest * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value),
                      glt_amt:    this.rest,
              
                    } ,
                 
                  );
              }
              
              if(controls.ap_cr_terms.value == "ES") {

                this.codeService
                  .getBy({
                        code_fldname: "vd_cr_terms",
                        code_value: "ES"
                        
                  })
                  .subscribe((resp: any) => {
            
          //  console.log(resp.data.bank)
           
            
    if (Number( controls.ap_amt.value) > 100000  ) { this.timbre =  Number( controls.ap_amt.value) * 2 / 100 }
    else{
      if (Number( controls.ap_amt.value) > 30000  ) { this.timbre =  Number( controls.ap_amt.value) * 1.5 / 100 }
      else{this.timbre =  Number( controls.ap_amt.value) * 1 / 100 }
    
      
    }
    if(Number(this.timbre) < 5){this.timbre = 5}
    this.gridServicecf.addItem(
                    {
                        id: i + 1,
                        glt_line: i + 1,
                        glt_ref: resp.data[0].code_value,
              
                        glt_desc: resp.data[0].code_value,
                        glt_acct: resp.data[0].chr01,
                        glt_dy_code: controls.ap_dy_code.value ,
                        glt_curr_amt: - Number(this.timbre) * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value) ,
                        glt_amt:  - this.timbre,
                        
              
                      } ,
                     { position: "bottom" }
                    );
                  })

                  i = i + 1
              } else { this.timbre = 0}
            
      
            this.bankService
            .getBy({
                  bk_code: controls.ap_bank.value,
                  
            })
            .subscribe((resp: any) => {
      
    //  console.log(resp.data.bank)
      
      this.bank = resp.data.bank;
      
      this.gridServicecf.addItem(
              {
                  id: i + 1,
                  glt_line: i + 1,
                  glt_ref: this.bank.bk_code,
        
                  glt_desc: this.bank.address.ad_name,
                  glt_acct: this.bank.bk_pip_acct,
                  glt_sub: this.bank.bk_pip_sub,
                  glt_cc: this.bank.bk_pip_cc,
                  glt_dy_code: controls.ap_dy_code.value ,
                  glt_curr_amt:   -((this.timbre + controls.ap_amt.value) * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value)),
                  glt_amt:    -(this.timbre + controls.ap_amt.value),
                  
        
                } ,
               { position: "bottom" }
              );
            })
          } else {

            this.cfdataset.push(  
              {
                  id: 1,
                  glt_ref: this.provider.vd_addr,
        
                  glt_desc: this.provider.address.ad_name,
                  glt_acct: this.provider.vd_ap_acct,
                  glt_sub: this.provider.vd_ap_sub,
                  glt_cc: this.provider.vd_ap_cc,
                  glt_dy_code: controls.ap_dy_code.value ,
                  glt_curr_amt:  (Number(controls.ap_amt.value) - this.rest) * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value),
                  glt_amt:    (Number(controls.ap_amt.value) - this.rest),
                  
        
                } ,
              /* { position: "bottom" }*/
              );
              this.bankService
            .getBy({
                  bk_code: controls.ap_bank.value,
                  
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
                  glt_dy_code: controls.ap_dy_code.value ,
                  glt_curr_amt:  -( controls.ap_amt.value * (controls.ap_ex_rate2.value / controls.ap_ex_rate.value)),
                  glt_amt:  -  controls.ap_amt.value,
                  
        
                } ,
               { position: "bottom" }
              );
            })

          }



        }




      } 


      handleSelectedRowsChangedbank(e, args) {
        const controls = this.apForm.controls;
        if (Array.isArray(args.rows) && this.gridObjbank) {
          args.rows.map((idx) => {
            const item = this.gridObjbank.getDataItem(idx);
            controls.ap_bank.setValue(item.bk_code || "");
            controls.bank_name.setValue(item.address.ad_name || "");


            this.bankService.getAP({bk_code: item.bk_code}).subscribe((res:any)=>{
             console.log(res.data)
                  controls.ap_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
                  controls.ap_cr_terms.setValue(res.data.details[0].bkd_pay_method || "")
                           
                  this.ap_cr_termss = res.data.details

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
            id: "ad_name",
            name: "Designation",
            field: "ad_name",
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
      handleSelectedRowsChangedjournal(e, args) {
        const controls = this.apForm.controls;
        if (Array.isArray(args.rows) && this.gridObjjournal) {
          args.rows.map((idx) => {
            const item = this.gridObjjournal.getDataItem(idx);
            controls.ap_dy_code.setValue(item.dy_dy_code || "");
           
          });
        }
      }
      
      angularGridReadyjournal(angularGrid: AngularGridInstance) {
        this.angularGridjournal = angularGrid;
        this.gridObjjournal = (angularGrid && angularGrid.slickGrid) || {};
      }
      
      prepareGridjournal() {
        this.columnDefinitionsjournal = [
          {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "dy_dy_code",
            name: "Code",
            field: "dy_dy_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "dy_desc",
            name: "Description",
            field: "dy_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "dy_type",
            name: "Type",
            field: "dy_type",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "dy_next_pgdet",
          name: "Page suivante Journal",
          field: "dy_next_pgdet",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "dy_next_pgcen",
          name: "Page suivante centrale",
          field: "dy_next_pgcen",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "dy_last_entdet",
          name: "Dernière entrée Journal",
          field: "dy_last_entdet",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "dy_last_entcen",
          name: "Dernière entrée centrale",
          field: "dy_last_entcen",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
        },
      
        ];
      
        this.gridOptionsjournal = {
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
        this.daybookService
          .getAll()
          .subscribe((response: any) => (this.journals = response.data));
      }
      openjournal(content) {
        this.prepareGridjournal();
        this.modalService.open(content, { size: "lg" });
      }
      onChangeJournal() {
        const controls  = this.apForm.controls
        this.daybookService
            .getByOne({
                  dy_dy_code: controls.ap_dy_code.value,
                  
            })
            .subscribe((response: any) => {
              //  const {data} = response.data;
               // console.log(response.data)
                if (!response.data) {
                  alert("Journal n'existe pas")
  
                   controls.ap_dy_code.setValue(null) 
                   document.getElementById("ap_dy_code").focus(); 
                }             
          })
      }

      handleSelectedRowsChangedentity(e, args) {
        const controls = this.apForm.controls
        if (Array.isArray(args.rows) && this.gridObjentity) {
            args.rows.map((idx) => {
                const item = this.gridObjentity.getDataItem(idx)
                controls.ap_entity.setValue(item.en_entity || "")
            })
        }
      }
      
      angularGridReadyentity(angularGrid: AngularGridInstance) {
        this.angularGridentity = angularGrid
        this.gridObjentity = (angularGrid && angularGrid.slickGrid) || {}
      }
      
      prepareGridentity() {
        this.columnDefinitionsentity = [
            {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "en_entity",
                name: "code ",
                field: "en_entity",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
              id: "en_name",
              name: "Désignation ",
              field: "en_name",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
                id: "en_primary",
                name: "Principale",
                field: "en_primary",
                sortable: true,
                filterable: true,
                type: FieldType.boolean,
                formatter: Formatters.yesNo
            },
        ]
      
        this.gridOptionsentity = {
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
        }
      
        // fill the dataset with your data
        this.entityService
            .getAll()
            .subscribe((response: any) => (this.dataentity = response.data))
      }
      openentity(contenttax) {
        this.prepareGridentity()
        this.modalService.open(contenttax, { size: "lg" })
      }
      
}
