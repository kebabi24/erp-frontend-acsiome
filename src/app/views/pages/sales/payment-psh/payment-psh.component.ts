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
 
  AccountShiper,
  AccountShiperService,
  CustomerService,
  AddressService,
  DeviseService,
  CodeService,
  InvoiceOrderService,
  BankService,
 

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";


@Component({
  selector: 'kt-payment-psh',
  templateUrl: './payment-psh.component.html',
  styleUrls: ['./payment-psh.component.scss']
})
export class PaymentPshComponent implements OnInit {

  accountShiper: AccountShiper;
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
  as_pay_method: any[] = [];
  bl: any;
  user;
  pshnbr: String;
  check;
  nbr;
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
    private accountShiperService: AccountShiperService,
    private codeService: CodeService,
    

  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "check_form" })
    .subscribe((response: any) => (this.as_pay_method = response.data));
   
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
      this.accountShiper = new AccountShiper();
      const date = new Date;
      
      this.asForm = this.asFB.group({
    //    so__chr01: [this.accountShiper.as__chr01],
        as_ship:[this.accountShiper.as_ship , Validators.required],
        as_cust: [{value: this.accountShiper.as_cust , disabled: true} ],
        name: [{value:"", disabled: true}],
        as_curr: [{value: this.accountShiper.as_curr , disabled: true}],
        amt:[{value:0, disabled: true}],
        rest:[{value:0, disabled: true}],
       
        
      
        as_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        as_bank: [this.accountShiper.as_bank, Validators.required],
       
        as_pay_method: [this.accountShiper.as_pay_method, Validators.required],
        
        as_check: [this.accountShiper.as_check , Validators.required],

        as_amt: [this.accountShiper.as_amt],
       
        as_po: [this.accountShiper.as_po],
        


      });
  
      
      
  
    }



    OnchangeBank (){

      const controls = this.asForm.controls 
      const bk_code  = controls.as_bank.value
     
      
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
    
            this.bankService
          .getAllDetails({ bkd_bank: bk_code, bkd_module: "AR" })
          .subscribe((response: any) => {(this.as_pay_method = response.data)
          console.log("hhhhhhhhhhhhhhh",this.as_pay_method)
        })    
            
        }
  
  
    },error=>console.log(error))
  }  
  //reste form
  reset() {
    this.accountShiper = new AccountShiper();
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
   
     const _as = new AccountShiper();
      _as.as_ship = controls.as_ship.value;
      _as.as_cust = controls.as_cust.value;
      _as.as_curr = controls.as_curr.value;
      
      
      _as.as_effdate = controls.as_effdate.value
        ? `${controls.as_effdate.value.year}/${controls.as_effdate.value.month}/${controls.as_effdate.value.day}`
        : null;
  
       
      
      _as.as_type = "P";
     
      _as.as_bank = controls.as_bank.value;
      _as.as_pay_method = controls.as_pay_method.value;
      _as.as_check = controls.as_check.value;
    
      _as.as_amt = controls.as_amt.value;
      _as.as_applied = controls.as_amt.value;
      _as.as_po = controls.as_po.value;
                      
    
      _as.as_open = false
      

     return _as;
    
  
  }
  /**
   * Add po
   *
   * @param _as: as
   */
  addAS(_as: AccountShiper) {
    this.loadingSubject.next(true);
    let as = null;
    const controls = this.asForm.controls;

    this.accountShiperService
      .addP(_as )
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
          
          this.router.navigateByUrl("/sales/payment-psh");
          this.reset()
        }
      );
  }
 
  


  onChangeBL() {
    const controls = this.asForm.controls;
    const as_nbr = controls.as_ship.value;
    
    this.accountShiperService.getBy({ as_nbr, as_type : "I" }).subscribe(
      (res: any) => {
      //  console.log(res);
        const { data } = res.data;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce BL n'existe pas ou bien payé totalement!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.as_ship.setValue(null);
          document.getElementById("check").focus();
          document.getElementById("bl").focus();
        } else {
          this.error = false;
          
          controls.as_ship.setValue(data.as_nbr || "");
          controls.as_cust.setValue(data.as_cust || "");
         
          controls.as_curr.setValue(data.as_curr || "");
          controls.amt.setValue(data.as_amt || "");
          controls.rest.setValue(Number(data.as_amt) - Number(data.as_applied) || "");
        
      controls.as_pay_method.setValue(data.as_pay_method || "");
     
      this.customerService.getBy({cm_addr: data.as_cust}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        controls.as_bank.setValue(response.data.cm_bank || "");
        controls.as_pay_method.setValue(response.data.cm_pay_method|| "");
      
        
        this.bankService
        .getAllDetails({ bkd_bank: response.data.cm_bank, bkd_module: "AR" })
        .subscribe((response: any) => {(this.as_pay_method = response.data)
     
        })
       
       
     

      });    
    
  //  (error) => console.log(error)
    }

  });    
    
  }

  
  

  onChangeCheck() {
    const controls = this.asForm.controls;
    const as_check = controls.as_check.value;
    const as_bank = controls.as_bank.value;
    const as_pay_method = controls.as_pay_method.value;

    
    this.accountShiperService.getBy({ as_check,as_bank, as_pay_method, as_type : "P" }).subscribe(
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
          controls.as_check.setValue(null);
          document.getElementById("check").focus();
          
        }
        
     

      });    
    
  //  (error) => console.log(error)
  

    
    
  }
  onChangeAmt() {
    const controls = this.asForm.controls;
  
  
    if (Number(controls.as_amt.value) > Number(controls.rest.value)  ) {
    
          this.layoutUtilsService.showActionNotification(
            "Montant du paiement doit etre inferieur ou egale au montant BL",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.as_amt.setValue(0);
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
      controls.as_ship.setValue(item.as_nbr || "");
      controls.as_cust.setValue(item.as_cust || "");
      controls.as_curr.setValue(item.as_curr || "");
      controls.amt.setValue(item.as_amt || "");
       controls.rest.setValue(Number(item.as_amt) - Number(item.as_applied) || "");
      controls.as_pay_method.setValue(item.cm_cr_terms || "");
     
      this.customerService.getBy({cm_addr: item.as_cust}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        controls.as_bank.setValue(response.data.cm_bank || "");
        controls.as_pay_method.setValue(response.data.cm_pay_method|| "");
        this.bankService
        .getAllDetails({ bkd_bank: response.data.cm_bank, bkd_module: "AR" })
        .subscribe((response: any) => {(this.as_pay_method = response.data)
      })
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
      id: "as_nbr",
      name: "BL",
      field: "as_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "as_cust",
      name: "Client",
      field: "as_cust",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "as_effdate",
      name: "Date",
      field: "as_effdate",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "as_amt",
      name: "Montant",
      field: "as_amt",
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
  this.accountShiperService
    .getBy({as_type: "I", as_open: true})
    .subscribe((response: any) => (this.bls = response.data));
}
openbl(content) {
  this.prepareGridbl();
  this.modalService.open(content, { size: "lg" });
}



}
