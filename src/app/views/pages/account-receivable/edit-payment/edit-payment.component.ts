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
 
  CustomerService,
  AddressService,
  DeviseService,
  CodeService,
  BankService,
  InvoiceOrderService,
  AccountReceivable,
  AccountReceivableService,
  DaybookService,
  ConfigService,
 

} from "../../../../core/erp";

import { DecimalPipe } from "@angular/common";
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";


@Component({
  selector: 'kt-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {

  private headerMargin: number
  accountReceivable: AccountReceivable;
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
  accountReceivableEdit: any;
  provider;
  address;
  curr: any;  
  find: Boolean;
  rest: number;
  date: String;
  effdate: any;
  duedate: any;
  title: String = 'rapprochement Paiement - '
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
    private customerService: CustomerService,
   
    private invoiceOrderService: InvoiceOrderService,
    private accountReceivableService: AccountReceivableService,
    private codeService: CodeService,
    private deviseService: DeviseService,
    private bankService: BankService, 
    private daybookService: DaybookService, 
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
                  this.accountReceivableService.getByOne({ar_nbr: args.dataContext.apd_ref, ar_type: "I", ar_open: true }).subscribe((resp:any)=>{
                   // console.log(resp.data)
                                if (resp.data) {
                    
                                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , effdate: resp.data.ar_effdate , apd_amt: resp.data.ar_amt, open: resp.data.ar_amt - resp.data.ar_applied})
                    
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
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.accountReceivableService.getOne(id).subscribe((response: any)=>{
          this.accountReceivableEdit = response.data
        
          this.initCode()

          this.loadingSubject.next(false)
          this.title = this.title + this.accountReceivableEdit.ar_nbr

         
          this.customerService.getBy({vd_addr: this.accountReceivableEdit.ar_vend}).subscribe((resp: any)=>{
            this.provider = resp.data
          
          })  


        })

    })
  }

  initCode() {
    
    this.createForm()
    this.loadingSubject.next(false)
}
  //create form
  createForm() {
    this.loadingSubject.next(false);
    console.log(this.effdate)
   

    this.effdate = new Date(this.accountReceivableEdit.ar_effdate)
    this.duedate = new Date(this.accountReceivableEdit.ar_due_date)
     // this.accountReceivable = new AccountReceivable();
     // const date = new Date;
     
      this.apForm = this.apFB.group({
    //    so__chr01: [this.accountReceivable.ar__chr01],
        ar_nbr: [{ value: this.accountReceivableEdit.ar_nbr} ],
        ar_vend: [{ value: this.accountReceivableEdit.ar_vend, disabled: true} ],
        name: [{value: this.accountReceivableEdit.address.ad_name, disabled: true}],
        
      
       
        
        ar_curr:  [{ value: this.accountReceivableEdit.ar_curr, disabled: true} ],
        ar_cr_terms: [{ value: this.accountReceivableEdit.ar_cr_terms, disabled: true} ],
       // ar_type:  [{value: this.accountReceivable.ar_type ,disabled: !this.isExistc }, Validators.required],
        ar_batch:  [{ value: - this.accountReceivableEdit.ar_batch, disabled: true} ],
        ar_amt:  [{ value: - this.accountReceivableEdit.ar_amt, disabled: true} ],
        open:  [{ value: - (Number(this.accountReceivableEdit.ar_amt) - Number(this.accountReceivableEdit.ar_applied)), disabled: true} ],
        ar_bank:  [{ value: this.accountReceivableEdit.ar_bank, disabled: true} ],
        bank_name: [{value: "", disabled: true}],
       
        ar_dy_code:  [{ value: this.accountReceivableEdit.ar_dy_code, disabled: true} ],
        ar_check:  [{ value: this.accountReceivableEdit.ar_check, disabled: true} ],
        ar_po:  [{ value: this.accountReceivableEdit.ar_po, disabled: true} ],
        
        ar_ex_rate: [{ value: this.accountReceivableEdit.ar_ex_rate, disabled: true} ],
        ar_ex_rate2: [{ value: this.accountReceivableEdit.ar_ex_rate2, disabled: true} ],
        
        imput:  [false],
       
        ar_effdate: [ {
          year: this.effdate.getFullYear(),
          month: this.effdate.getMonth()+1,
          day: this.effdate.getDate() 
        }],
        ar_due_date: [ {
          year: this.duedate.getFullYear(),
          month: this.duedate.getMonth()+1,
          day: this.duedate.getDate() 
        }],

      });
  
   
  
    }

  
    onChangeImput() {
      this.dataset = [];
      this.cfdataset = [];
      this.invoice = [];
      const controls  = this.apForm.controls
     // this.rest = Number(controls.ar_amt.value)
      if (controls.imput.value == true) {
        if (controls.ar_amt.value != 0 &&  controls.ar_amt.value != null  ) {
      this.accountReceivableService
          .getBy({
                ar_vend: controls.ar_vend.value,
                ar_type: "I",
                ar_open: true,
          })
          .subscribe((resp: any) => {
            this.detail  = resp.data;
           console.log(this.detail)
         
            var applied = 0;
            var rest = Number(controls.open.value);
            //console.log(rest)
            for (var object = 0; object < this.detail.length; object++) {
              if (rest >0) {
              if ((Number(this.detail[object].ar_amt) - Number(this.detail[object].ar_applied)) > rest)  {
                 applied = rest;
               } else { applied =  (Number(this.detail[object].ar_amt) - Number(this.detail[object].ar_applied))}
            
              this.gridService.addItem(
                    {
                      id: object + 1,
                      apd_ref: this.detail[object].ar_nbr,
                      ref: this.detail[object].ar_nbr,
                      effdate: this.detail[object].ar_effdate,
                      apd_amt: this.detail[object].ar_amt,
                      open: Number(this.detail[object].ar_amt) - Number(this.detail[object].ar_applied),
                     applied: applied,
                     apamt: applied,
                     apd_type: "VO",
                     apd_acct: this.provider.vd_ar_acct,
                     apd_sub: this.provider.vd_ar_sub,
                     apd_cc: this.provider.vd_ar_cc,
                     apd_ex_rate: controls.ar_ex_rate.value,
                     apd_ex_rate2: controls.ar_ex_rate2.value,
                     apd_dy_code: controls.ar_dy_code.value,
                    },
                    { position: "bottom" }
                  );
                rest = rest - applied;
              
            } 
          }
          if (rest > 0 && object > 0 ) {

            this.gridService.addItem(
              {
                id: object + 1,
                apd_ref: null,
                ref: null,
                effdate: controls.ar_effdate.value
                ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
                : null,
                apd_amt: rest,
                open: rest,
               applied: rest,
               apamt: applied,
               apd_type: "U",
               apd_acct: this.provider.vd_act_acct,
               apd_sub: this.provider.vd_act_sub,
               apd_cc: this.provider.vd_act_cc,
               apd_ex_rate: controls.ar_ex_rate.value,
               apd_ex_rate2: controls.ar_ex_rate2.value,
               apd_dy_code: controls.ar_dy_code.value,
              
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
      const controls = this.apForm.controls;
  
      if (controls.imput.value == false ) {
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          apd_ref: "",
          effdate: null,
          apd_amt: 0,
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

    if(this.cfdataset.length == 0) {
      this.message = "Ecriture comptable vide.";
      this.hasFormErrors = true;

      return;
   

    }
    
    let ap = this.prepareAP()
    this.addAP(ap, this.dataset, this.cfdataset);


  }

  prepareAP(): any {
    const controls = this.apForm.controls;
   
    const _ap = new AccountReceivable();
   console.log(controls.ar_check.value) 
   _ap.id = this.accountReceivableEdit.id;
    _ap.ar_bill = controls.ar_bill.value;
    _ap.ar_check = controls.ar_check.value;
    
    _ap.ar_effdate = controls.ar_effdate.value
      ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
      : null;

      _ap.ar_due_date = controls.ar_due_date.value
      ? `${controls.ar_due_date.value.year}/${controls.ar_due_date.value.month}/${controls.ar_due_date.value.day}`
      : null;  
    
    _ap.ar_curr = controls.ar_curr.value;
    _ap.ar_ex_rate  = controls.ar_ex_rate.value;
    _ap.ar_ex_rate2 = controls.ar_ex_rate2.value;

    _ap.ar_type = "P";

   _ap.ar_bank = controls.ar_bank.value;
   _ap.ar_dy_code = controls.ar_dy_code.value;

   _ap.ar_batch = controls.ar_batch.value;
 
   
    _ap.ar_cr_terms = controls.ar_cr_terms.value;
    _ap.ar_amt = - controls.ar_amt.value;
    _ap.ar_po = controls.ar_po.value;
    _ap.ar_applied =  - (Number(controls.ar_amt.value) - Number(this.rest))

    _ap.ar_base_amt = - ( Number(controls.ar_amt.value) * Number(controls.ar_ex_rate2.value) / Number(controls.ar_ex_rate.value));
    _ap.ar_base_applied =  - ((Number(controls.ar_amt.value) - Number(this.rest)) * Number(controls.ar_ex_rate2.value) / Number(controls.ar_ex_rate.value));
     if (this.rest == 0 ) {_ap.ar_open = false} else { _ap.ar_open = true }
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
    this.loadingSubject.next(true);
    let ar = null;
    const controls = this.apForm.controls;

    this.accountReceivableService
      .addUp({ accountReceivable: _ap, accountReceivableDetail: detail, gldetail: cfdetail })
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
          
          this.router.navigateByUrl("/account-Receivable/create-account-Receivable");
          this.reset()
        }
      );
  }
 
  
  changeCurr(){
    const controls = this.apForm.controls // chof le champs hada wesh men form rah
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
  const controls = this.apForm.controls // chof le champs hada wesh men form rah
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
  const controls = this.apForm.controls // chof le champs hada wesh men form rah
  const bk_code  = controls.ar_bank.value ;      
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
  const controls = this.apForm.controls // chof le champs hada wesh men form rah
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
const controls = this.apForm.controls;
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
  const controls = this.apForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbill) {
    args.rows.map((idx) => {
      const date = new Date()

      this.date = controls.ar_effdate.value
    ? `${controls.ar_effdate.value.year}/${controls.ar_effdate.value.month}/${controls.ar_effdate.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

      const item = this.gridObjbill.getDataItem(idx);
      
      
      this.provider = item;
      
      controls.ar_vend.setValue(this.provider.vd_addr || "")
                 
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

                  controls.name.setValue(this.provider.address.ad_name || "")
                  controls.ar_curr.setValue(this.provider.vd_curr || "")
                  controls.ar_bank.setValue(this.provider.vd_bank || "")
                  controls.ar_cr_terms.setValue(this.provider.vd_ckfrm || "")


                  this.deviseService.getBy({ cu_curr: item.vd_curr }).subscribe(
                    (res: any) => {
                      //console.log(res);
                      const { data } = res;
                if(data) {
            
                  this.curr = data;
                }
            
                    })
            
                    if (item.vd_curr == 'DA'){
                      controls.ar_ex_rate.setValue(1)
                      controls.ar_ex_rate2.setValue(1)
            
                    } else {
            
                    this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                      
                     // console.log(res.data)
                       controls.ar_ex_rate.setValue(res.data.exr_rate)
                       controls.ar_ex_rate2.setValue(res.data.exr_rate2)
                      })
            
                      }
            

                  this.bankService
                  .getAP({
                        bk_code: this.provider.vd_bank, 
                        
                  })
                  .subscribe((res: any) => {
                   
                    controls.bank_name.setValue(res.data.bank.bk_desc || "")
           
                    this.ar_cr_terms = res.data.details
         
                  })
                  this.bankService
                  .getAllDetails({
                        bkd_bank: this.provider.vd_bank,
                        bkd_module: "AR",
                        bkd_pay_method:  this.provider.vd_ckfrm,
                        
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
      id: "vd_addr",
      name: "code",
      field: "vd_addr",
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
  const controls = this.apForm.controls;
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
  const controls = this.apForm.controls;
  
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
        updateItem.apd_ref = null
        this.gridService.updateItem(updateItem);
      
      } else {
      
      updateItem.apd_ref = item.ar_nbr
      updateItem.effdate = item.ar_effdate
      updateItem.apd_amt = item.ar_amt
      
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
    .getBy({ar_vend: controls.ar_vend.value, ar_type: "I", ar_open: true})
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
     
alert("Vous n'avez pas fait de lettrage")

        } else {

          this.cfdataset.push(  
            {
                id: 1,
                glt_ref: this.provider.vd_addr,
      
                glt_desc: this.provider.address.ad_name,
                glt_acct: this.provider.vd_act_acct,
                glt_sub: this.provider.vd_act_sub,
                glt_cc: this.provider.vd_act_cc,
                glt_dy_code: controls.ar_dy_code.value ,
                glt_cur_amt:  controls.ar_amt.value * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value) ,
                glt_amt:    controls.ar_amt.value,
                
      
              } ,
            /* { position: "bottom" }*/
            );
      
            this.bankService
            .getBy({
                  bk_code: this.provider.vd_bank,
                  
            })
            .subscribe((resp: any) => {
      
      //console.log(resp.data.bank)
      
      this.bank = resp.data.bank;
      
      this.gridServicecf.addItem(
              {
                  id: 2,
                  glt_ref: this.provider.vd_addr,
      
                glt_desc: this.provider.address.ad_name,
                glt_acct: this.provider.vd_ar_acct,
                glt_sub: this.provider.vd_ar_sub,
                glt_cc: this.provider.vd_ar_cc,
                glt_dy_code: controls.ar_dy_code.value ,
                glt_cur_amt: - controls.ar_amt.value * (controls.ar_ex_rate2.value / controls.ar_ex_rate.value) ,
                glt_amt:   - controls.ar_amt.value,
                  
        
                } ,
               { position: "bottom" }
              );
            })
      

        }
      


}



}
