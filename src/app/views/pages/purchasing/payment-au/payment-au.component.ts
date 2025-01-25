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
 
  AccountUnplanifed,
  AccountUnplanifedService,
  ProviderService,
  AddressService,
  DeviseService,
  CodeService,
  
  BankService,
 

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'kt-payment-au',
  templateUrl: './payment-au.component.html',
  styleUrls: ['./payment-au.component.scss']
})
export class PaymentAuComponent implements OnInit {

  accountUnplanifed: AccountUnplanifed;
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
    
 
    banks: [];
    columnDefinitionsbank: Column[] = [];
    gridOptionsbank: GridOption = {};
    gridObjbank: any;
    angularGridbank: AngularGridInstance;
  
  
  row_number;
  message = "";
  
  details: any;
  datasetPrint = [];
  au_pay_method: any[] = [];
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
    private providerService: ProviderService,
    private bankService: BankService,
    private accountUnplanifedService: AccountUnplanifedService,
    private codeService: CodeService,
    

  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "check_form" })
    .subscribe((response: any) => (this.au_pay_method = response.data));
   
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
      this.accountUnplanifed = new AccountUnplanifed();
      const date = new Date;
      
      this.asForm = this.asFB.group({
    //    so__chr01: [this.accountUnplanifed.au__chr01],
        au_ship:[this.accountUnplanifed.au_ship , Validators.required],
        au_vend: [{value: this.accountUnplanifed.au_vend , disabled: true} ],
        name: [{value:"", disabled: true}],
        au_curr: [{value: this.accountUnplanifed.au_curr , disabled: true}],
        amt:[{value:0, disabled: true}],
        rest:[{value:0, disabled: true}],
       
        
      
        au_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        au_bank: [this.accountUnplanifed.au_bank, Validators.required],
       
        au_pay_method: [this.accountUnplanifed.au_pay_method, Validators.required],
        
        au_check: [this.accountUnplanifed.au_check ],

        au_amt: [this.accountUnplanifed.au_amt],
       
        au_po: [this.accountUnplanifed.au_po],
        


      });
  
      
      
  
    }



    OnchangeBank (){

      const controls = this.asForm.controls 
      const bk_code  = controls.au_bank.value
     
      
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
          .getAllDetails({ bkd_bank: bk_code, bkd_module: "AP" })
          .subscribe((response: any) => {(this.au_pay_method = response.data)
          console.log("hhhhhhhhhhhhhhh",this.au_pay_method)
        })    
            
        }
  
  
    },error=>console.log(error))
  }  
  //reste form
  reset() {
    this.accountUnplanifed = new AccountUnplanifed();
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
   
     const _as = new AccountUnplanifed();
      _as.au_ship = controls.au_ship.value;
      _as.au_vend = controls.au_vend.value;
      _as.au_curr = controls.au_curr.value;
      
      
      _as.au_effdate = controls.au_effdate.value
        ? `${controls.au_effdate.value.year}/${controls.au_effdate.value.month}/${controls.au_effdate.value.day}`
        : null;
  
       
      
      _as.au_type = "P";
     
      _as.au_bank = controls.au_bank.value;
      _as.au_pay_method = controls.au_pay_method.value;
      _as.au_check = controls.au_check.value;
    
      _as.au_amt = controls.au_amt.value;
      _as.au_applied = controls.au_amt.value;
      _as.au_po = controls.au_po.value;
                      
    
      _as.au_open = false
      

     return _as;
    
  
  }
  /**
   * Add po
   *
   * @param _as: as
   */
  addAS(_as: AccountUnplanifed) {
    this.loadingSubject.next(true);
    let as = null;
    const controls = this.asForm.controls;

    this.accountUnplanifedService
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
          
          this.router.navigateByUrl("/purchasing/payment-au");
          this.reset()
        }
      );
  }
 
  


  onChangeBL() {
    const controls = this.asForm.controls;
    const au_nbr = controls.au_ship.value;
    
    this.accountUnplanifedService.getBy({ au_nbr, au_type : "I" }).subscribe(
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
          controls.au_ship.setValue(null);
          document.getElementById("check").focus();
          document.getElementById("bl").focus();
        } else {
          this.error = false;
          
          controls.au_ship.setValue(data.au_nbr || "");
          controls.au_vend.setValue(data.au_vend || "");
         
          controls.au_curr.setValue(data.au_curr || "");
          controls.amt.setValue(data.au_amt || "");
          controls.rest.setValue(Number(data.au_amt) - Number(data.au_applied) || "");
        
      controls.au_pay_method.setValue(data.au_pay_method || "");
     
      this.providerService.getBy({vd_addr: data.au_vend}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        controls.au_bank.setValue(response.data.cm_bank || "");
        controls.au_pay_method.setValue(response.data.cm_pay_method|| "");
      
        
        this.bankService
        .getAllDetails({ bkd_bank: response.data.cm_bank, bkd_module: "AP" })
        .subscribe((response: any) => {(this.au_pay_method = response.data)
     
        })
       
       
     

      });    
    
  //  (error) => console.log(error)
    }

  });    
    
  }

  
  

  onChangeCheck() {
    const controls = this.asForm.controls;
    const au_check = controls.au_check.value;
    const au_bank = controls.au_bank.value;
    const au_pay_method = controls.au_pay_method.value;

    
    this.accountUnplanifedService.getBy({ au_check,au_bank, au_pay_method, au_type : "P" }).subscribe(
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
          controls.au_check.setValue(null);
          document.getElementById("check").focus();
          
        }
        
     

      });    
    
  //  (error) => console.log(error)
  

    
    
  }
  onChangeAmt() {
    const controls = this.asForm.controls;
  
  
    if (Number(controls.au_amt.value) > Number(controls.rest.value)  ) {
    
          this.layoutUtilsService.showActionNotification(
            "Montant du paiement doit etre inferieur ou egale au montant BL",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.au_amt.setValue(0);
          document.getElementById("amt").focus();
          
        }
    
    
  }

  /**
   * Go back to the list
   *
   */
  
  goBack() {
    this.loadingSubject.next(false);
    const url = `/inventory-transaction/inventory-list`;
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
      controls.au_ship.setValue(item.au_nbr || "");
      controls.au_vend.setValue(item.au_vend || "");
      controls.au_curr.setValue(item.au_curr || "");
      controls.amt.setValue(item.au_amt || "");
       controls.rest.setValue(Number(item.au_amt) - Number(item.au_applied) || "");
      controls.au_pay_method.setValue(item.cm_cr_terms || "");
     
      this.providerService.getBy({vd_addr: item.au_vend}).subscribe((response: any)=>{
                    
                    
      
        controls.name.setValue(response.data.address.ad_name || "");
        controls.au_bank.setValue(response.data.cm_bank || "");
        controls.au_pay_method.setValue(response.data.cm_pay_method|| "");
        this.bankService
        .getAllDetails({ bkd_bank: response.data.cm_bank, bkd_module: "AP" })
        .subscribe((response: any) => {(this.au_pay_method = response.data)
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
      id: "au_nbr",
      name: "BL",
      field: "au_nbr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "au_vend",
      name: "Client",
      field: "au_vend",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "au_effdate",
      name: "Date",
      field: "au_effdate",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "au_amt",
      name: "Montant",
      field: "au_amt",
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
  this.accountUnplanifedService
    .getBy({au_type: "I", au_open: true})
    .subscribe((response: any) => (this.bls = response.data));
}
openbl(content) {
  this.prepareGridbl();
  this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedbank(e, args) {
  const controls = this.asForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbank) {
    args.rows.map((idx) => {
      const item = this.gridObjbank.getDataItem(idx);
      controls.au_bank.setValue(item.bk_code || "");
      

      this.bankService.getAP({bk_code: item.bk_code}).subscribe((res:any)=>{
       // console.log(res.data)
           // controls.ap_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
            controls.au_pay_method.setValue(res.data.details[0].bkd_pay_method || "")
                     
            this.au_pay_method = res.data.details

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


}
