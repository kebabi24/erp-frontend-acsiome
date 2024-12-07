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
 
  AccountOrder,
  AccountOrderService,
  CustomerService,
  AddressService,
  DeviseService,
  CodeService,
  InvoiceOrderService,
  BankService,
 

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";


@Component({
  selector: 'kt-payment-so',
  templateUrl: './payment-so.component.html',
  styleUrls: ['./payment-so.component.scss']
})
export class PaymentSoComponent implements OnInit {

 
  accountOrder: AccountOrder;
  asForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  
  
  bls: [];
    columnDefinitionsbl: Column[] = [];
    gridOptionsbl: GridOption = {};
    gridObjbl: any;
    angularGridbl: AngularGridInstance;
    
 
  
  
  
  row_number;
  message = "";
  
  details: any;
  datasetPrint = [];
  ao_pay_method: any[] = [];
  bl: any;
  user;
  pshnbr: String;
  check;
  nbr;
  banks: [];
  columnDefinitionsbank: Column[] = [];
  gridOptionsbank: GridOption = {};
  gridObjbank: any;
  angularGridbank: AngularGridInstance;

  constructor(
    config: NgbDropdownConfig,
    private asFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public  dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private customerService: CustomerService,
    private bankService: BankService,
    private accountOrderService: AccountOrderService,
    private codeService: CodeService,
    private deviseService:  DeviseService,
    

  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "check_form" })
    .subscribe((response: any) => (this.ao_pay_method = response.data));
   
  }
  ngOnInit(): void {
    this.reset();
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
  }

  
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.accountOrder = new AccountOrder();
      const date = new Date;
      
      this.asForm = this.asFB.group({
    //    so__chr01: [this.accountOrder.ao__chr01],
        ao_so_nbr:[this.accountOrder.ao_so_nbr , Validators.required],
        ao_cust: [{value: this.accountOrder.ao_cust , disabled: true} ],
        name: [{value:"", disabled: true}],
        ao_curr: [{value: this.accountOrder.ao_curr , disabled: true}],
        amt:[{value:0, disabled: true}],
        rest:[{value:0, disabled: true}],
       
        
      
        ao_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        ao_bank: [this.accountOrder.ao_bank, Validators.required],
       
        ao_pay_method: [this.accountOrder.ao_pay_method, Validators.required],
        
        ao_check: [this.accountOrder.ao_check ],

        ao_amt: [this.accountOrder.ao_amt],
       
        ao_po: [this.accountOrder.ao_po],
        


      });
  
      
      
  
    }

    OnchangeCurr(){
      const controls = this.asForm.controls
      
            this.deviseService
            .getBy({ cu_curr: controls.ao_curr.value })
            .subscribe((response: any) => {

              if (response.data == null){ 
                alert("Devise n'existe pas")
                controls.au_curr.setValue(null)
                document.getElementById("ao_curr").focus();
              }
          })
           
    }


    OnchangeBank (){

      const controls = this.asForm.controls 
      const bk_code  = controls.ao_bank.value
     
      
    this.bankService.getBy({bk_code}).subscribe((res:any)=>{
        //const {data} = res.data.bank
        //console.log(res.data.bank)
        if (res.data.bank == null){ this.layoutUtilsService.showActionNotification(
            "cette banque n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.error = true}
        else {
            this.error = false
    
         
        }
  
  
    },error=>console.log(error))
  }  
  //reste form
  reset() {
    this.accountOrder = new AccountOrder();
    this.createForm();
    
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.asForm.controls;
    /** check form */
    if (this.asForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

   
    let as = this.prepareAS()
    this.addAS(as);


  }

  prepareAS(): any {
    
    const controls = this.asForm.controls;
   
     const _ao = new AccountOrder();
      _ao.ao_so_nbr = controls.ao_so_nbr.value;
      _ao.ao_cust = controls.ao_cust.value;
      _ao.ao_curr = controls.ao_curr.value;
      
      
      _ao.ao_effdate = controls.ao_effdate.value
        ? `${controls.ao_effdate.value.year}/${controls.ao_effdate.value.month}/${controls.ao_effdate.value.day}`
        : null;
  
       
      
      _ao.ao_type = "P";
     
      _ao.ao_bank = controls.ao_bank.value;
      _ao.ao_pay_method = controls.ao_pay_method.value;
      _ao.ao_check = controls.ao_check.value;
    
      _ao.ao_amt = controls.ao_amt.value;
      _ao.ao_applied = controls.ao_amt.value;
      _ao.ao_po = controls.ao_po.value;
                      
    
      _ao.ao_open = false
      

     return _ao;
    
  
  }
  /**
   * Add po
   *
   * @param _ao: as
   */
  addAS(_ao: AccountOrder) {
    this.loadingSubject.next(true);
    let as = null;
    const controls = this.asForm.controls;

    this.accountOrderService
      .addP(_ao )
      .subscribe(
        (reponse: any) => (as = reponse.data),
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
          
          this.router.navigateByUrl("/sales/payment-so");
          this.reset()
        }
      );
  }
 
  


  onChangeBL() {
    const controls = this.asForm.controls;
    const ao_nbr = controls.ao_so_nbr.value;
    
    this.accountOrderService.getBy({ ao_nbr, ao_type : "I" }).subscribe(
      (res: any) => {
      //  console.log(res);
        const { data } = res.data;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette Commande n'existe pas ou bien payé totalement!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.ao_so_nbr.setValue(null);
          document.getElementById("check").focus();
          document.getElementById("so").focus();
        } else {
          this.error = false;
          
          controls.ao_so_nbr.setValue(data.ao_nbr || "");
          controls.ao_cust.setValue(data.ao_cust || "");
         
          controls.ao_curr.setValue(data.ao_curr || "");
          controls.amt.setValue(data.ao_amt || "");
          controls.rest.setValue(Number(data.ao_amt) - Number(data.ao_applied) || "");
        
      // controls.ao_pay_method.setValue(data.ao_pay_method || "");
     
      this.customerService.getBy({cm_addr: data.ao_cust}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        controls.ao_bank.setValue(response.data.cm_bank || "");
        // controls.ao_pay_method.setValue(response.data.cm_pay_method|| "");
         
       
     

      });    
    
  //  (error) => console.log(error)
    }

  });    
    
  }

  
  

  onChangeCheck() {
    const controls = this.asForm.controls;
    const ao_check = controls.ao_check.value;
    const ao_bank = controls.ao_bank.value;
    const ao_pay_method = controls.ao_pay_method.value;

    
    this.accountOrderService.getBy({ ao_check,ao_bank, ao_pay_method, ao_type : "P" }).subscribe(
      (res: any) => {
        this.check = res.data[0];
        
        if (this.check != null) {
    
          this.layoutUtilsService.showActionNotification(
            "ce Cheque Existe Deja",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.ao_check.setValue(null);
          document.getElementById("check").focus();
          
        }
        
     

      });    
    
  //  (error) => console.log(error)
  

    
    
  }
  onChangeAmt() {
    const controls = this.asForm.controls;
  
  
    if (Number(controls.ao_amt.value) > Number(controls.rest.value)  ) {
    
          this.layoutUtilsService.showActionNotification(
            "Montant du paiement doit etre inferieur ou egale au montant BL",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.ao_amt.setValue(0);
          document.getElementById("amt").focus();
          
        }
    
    
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

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
 
handleSelectedRowsChangedbl(e, args) {
  const controls = this.asForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbl) {
    args.rows.map((idx) => {
      const item = this.gridObjbl.getDataItem(idx);
    //  console.log(item)
      
      this.bl = item;
      controls.ao_so_nbr.setValue(item.ao_nbr || "");
      controls.ao_cust.setValue(item.ao_cust || "");
      controls.ao_curr.setValue(item.ao_curr || "");
      controls.amt.setValue(item.ao_amt || "");
      controls.rest.setValue(Number(item.ao_amt) - Number(item.ao_applied) || "");
      // controls.ao_pay_method.setValue(item.cm_cr_terms || "");
     
      this.customerService.getBy({cm_addr: item.ao_cust}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        // controls.ao_bank.setValue(response.data.cm_bank || "");
        // controls.ao_pay_method.setValue(response.data.cm_pay_method|| "");
      
      })
      
     
     
  })
}
}

angularGridReadybl(angularGrid: AngularGridInstance) {
  this.angularGridbl = angularGrid;
  this.gridObjbl = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbl() {
  this.columnDefinitionsbl = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "ao_nbr",
      name: "cmd",
      field: "ao_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ao_cust",
      name: "Client",
      field: "ao_cust",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ao_effdate",
      name: "Date",
      field: "ao_effdate",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ao_amt",
      name: "Montant",
      field: "ao_amt",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionsbl = {
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
  this.accountOrderService
    .getBy({ao_type: "I", ao_open: true})
    .subscribe((response: any) => (this.bls = response.data));
}
openso(content) {
  this.prepareGridbl();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedbank(e, args) {
  const controls = this.asForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbank) {
    args.rows.map((idx) => {
      const item = this.gridObjbank.getDataItem(idx);
      controls.ao_bank.setValue(item.bk_code || "");
      

    
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
    .getByAll({bk_userid: this.user.usrd_code})
    .subscribe((response: any) => {this.banks = response.data
    console.log(this.banks)});
}
openbank(content) {
  this.prepareGridbank();
  this.modalService.open(content, { size: "lg" });
}

}
