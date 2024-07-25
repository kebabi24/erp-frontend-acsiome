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
  ProviderService,
  DeviseService,
  FinancialchargeService,
  BankService,
  CodeService,
  AccountUnplanifedService,

 

} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";

@Component({
  selector: 'kt-create-charge-payment',
  templateUrl: './create-charge-payment.component.html',
  styleUrls: ['./create-charge-payment.component.scss']
})
export class CreateChargePaymentComponent implements OnInit {

  
  accountPayable: AccountUnplanifed;
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
  vends: [];
    columnDefinitionsvend: Column[] = [];
    gridOptionsvend: GridOption = {};
    gridObjvend: any;
    angularGridvend: AngularGridInstance;  
    
 
    banks: [];
    columnDefinitionsbank: Column[] = [];
    gridOptionsbank: GridOption = {};
    gridObjbank: any;
    angularGridbank: AngularGridInstance;
  
  
  row_number;
  message = "";
  
  details: any;
  datasetPrint = [];
  curr:any
  bl: any;
  user;
  pshnbr: String;
  check;
  nbr;
  au_pay_method
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  datacharge: any [];
    columnDefinitionsc: Column[] = [];
    gridOptionsc: GridOption = {};
    gridObjc: any;
    angularGridc: AngularGridInstance;
    selectedc:  number[] = [];
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
    private financialchargeService: FinancialchargeService,
    private deviseService:  DeviseService,
    private codeService: CodeService,
    private accountUnplanifedService: AccountUnplanifedService,

   
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
    this.initmvGrid();
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
      this.accountPayable = new AccountUnplanifed ()
      const date = new Date;
      
      this.asForm = this.asFB.group({
    //    so__chr01: [this.accountPayable.au__chr01],
        // au_nbr:[this.accountPayable.au_nbr , Validators.required],
        au_vend: [this.accountPayable.au_vend , Validators.required ],
        name: [{value:"", disabled: true}],
        au_curr: [this.curr, Validators.required ],
        au_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        
        au_bank: [this.accountPayable.au_bank, Validators.required],
        au_so_nbr: [this.accountPayable.au_so_nbr],
        au_pay_method: [this.accountPayable.au_pay_method, Validators.required],
        
        au_check: [this.accountPayable.au_check ],

        au_amt: [this.accountPayable.au_amt],
       
        au_po: [this.accountPayable.au_po],
        


      });
  
      this.user =  JSON.parse(localStorage.getItem('user'))
      const controls = this.asForm.controls
      this.bankService
            .getByAll({bk_userid: this.user.usrd_code})
            .subscribe((response: any) => {
              if (response.data.length > 1) {
                controls.au_bank.setValue(response.data[0].bk_code)
              }
            });
            this.deviseService
            .getBy({ cu_active: true })
            .subscribe((response: any) => {this.curr = response.data
            console.log(this.curr)
        controls.au_curr.setValue(this.curr.cu_curr)
            })
    }

    OnchangeCurr(){
      const controls = this.asForm.controls
      
            this.deviseService
            .getBy({ cu_curr: controls.au_curr.value })
            .subscribe((response: any) => {

              if (response.data == null){ 
                alert("Devise n'existe pas")
                controls.au_curr.setValue(null)
                document.getElementById("au_curr").focus();
              }
          })
           
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
    this.accountPayable = new AccountUnplanifed();
    this.createForm();
    this.mvdataset=[]
    
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

    this.bankService.getBy({ bk_code : controls.au_bank.value }).subscribe(
      (resp: any) => {
        
        
        if (resp.data.bank.bk_balance >= Number(controls.au_amt.value)) {
    
          let as = this.prepareAS()
          this.addAS(as, this.mvdataset);
             
        }
        else {
          alert("Balance de caisse inférieure")
        }       
     

      });    
   

  }

  prepareAS(): any {
    
    const controls = this.asForm.controls;
   
     const _as = new AccountUnplanifed();
    
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
      _as.au_so_nbr = controls.au_so_nbr.value;
      _as.au_open = false
      

     return _as;
    
  
  }
  /**
   * Add po
   *
   * @param _as: as
   */
  addAS(_au: any, detail: any) {
    this.loadingSubject.next(true);
    let as = null;
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    const controls = this.asForm.controls;

    this.accountUnplanifedService
    .addFC({ accountUnplanifed: _au, accountUnplanifedDetail: detail})
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
          this.reset()
          this.router.navigateByUrl("/account-payable/create-charge-payment");
          this.reset()
        }
      );
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

  
 

handleSelectedRowsChangedbank(e, args) {
  const controls = this.asForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbank) {
    args.rows.map((idx) => {
      const item = this.gridObjbank.getDataItem(idx);
      controls.au_bank.setValue(item.bk_code || "");
      

    
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

handleSelectedRowsChangedvend(e, args) {
  const controls = this.asForm.controls;
  if (Array.isArray(args.rows) && this.gridObjvend) {
    args.rows.map((idx) => {
      const item = this.gridObjvend.getDataItem(idx);
    //  console.log(item)
      
      
      controls.au_vend.setValue(item.vd_addr || "");
        controls.name.setValue(item.address.ad_name || "");
      
     
     
  })
}
}

angularGridReadyvend(angularGrid: AngularGridInstance) {
  this.angularGridvend = angularGrid;
  this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridvend() {
  this.columnDefinitionsvend = [
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

  this.gridOptionsvend = {
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
    .subscribe((response: any) => (this.vends = response.data));
}
openVend(content) {
  this.prepareGridvend();
  this.modalService.open(content, { size: "lg" });
}

initmvGrid() {
  this.mvcolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.mvangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    },
    {
      id: "aud_fc_code",
      name: "Code Charge",
      field: "aud_fc_code",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
    
    },
    
    {
      id: "aud_desc",
      name: "Description",
      field: "aud_desc",
      sortable: true,
      width: 200,
      filterable: false,
      type: FieldType.string,
     
    },
    {
      id: "aud_amt",
      name: "Montant",
      field: "aud_amt",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.number,
      editor: {
        model: Editors.float,
      },
      onCellChange: (e: Event, args: OnEventArgs) => {
         
        const controls  = this.asForm.controls
        let tot = 0
        for (let data of this.mvdataset) {
          tot = tot + data.aud_amt

        }
controls.au_amt.setValue(tot)
      },
    },
    
    
  ];

  this.mvgridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
    autoEdit:true,
    autoCommitEdit:true,
  };

  this.mvdataset = [];
}
addNewItem() {
  const newId = this.mvdataset.length+1;

  const newItem = {
    id: newId,
    aud_fc_code : "",
    aud_desc: "",
    aud_amt: 0,
  };
  this.mvgridService.addItem(newItem, { position: "bottom" });
}

openCharge(content) {
  this.prepareGridcharge();
  this.modalService.open(content, { size: "xl" });
}

getTrainingDet(){
  this.mvdataset=[]
  // for(let job of this.selectedJob) {

  //   console.log(job)
  // }
  
   let idd = 0
    for (let data of this.selectedc){
      const found = this.datacharge.find((element) => element.fc_code == data);
      console.log(found)


     // this.gridServicetr.addItem(
      let obj =  {
          id: idd + 1,
          aud_fc_code: found.fc_code,
          aud_desc : found.fc_desc,
          aud_amt : 0,
        };
          this.mvdataset.push(obj)
        idd++;
    }

  this.modalService.dismissAll()
  // let element: HTMLElement = document.getElementById('openTrsGrid') as HTMLElement;
  // element.click();
}


angularGridReadyc(angularGrid: AngularGridInstance) {
  this.angularGridc = angularGrid;
  this.gridObjc = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridcharge() {
  this.columnDefinitionsc = [
     
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
     
      {
          id: "fc_code",
          name: "Code",
          field: "fc_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "fc_desc",
          name: "Designation",
          field: "fc_desc",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.text,
          
        
      },
      {
        id: "fc_type",
        name: "Type",
        field: "fc_type",
        sortable: true,
        filterable: true,
        type: FieldType.text,
      },
      
    
      
      
  ]

  this.gridOptionsc = {
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
    showCellSelection:true,
    checkboxSelector: {
      // optionally change the column index position of the icon (defaults to 0)
      // columnIndexPosition: 1,

      // remove the unnecessary "Select All" checkbox in header when in single selection mode
      hideSelectAllCheckbox: true,

      // you can override the logic for showing (or not) the expand icon
      // for example, display the expand icon only on every 2nd row
      // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
    },
    multiSelect: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false,
    },
  };
    
      
 

  // fill the dataset with your data
  this.datacharge = []
  this.financialchargeService.getAll().subscribe(
      (response: any) => (this.datacharge = response.data),
      (error) => {
          this.datacharge = []
      },
      () => {}
  )
}
handleSelectedRowsChangedc(e, args) {
  if (Array.isArray(args.rows) && this.gridObjc) {
    this.selectedc = args.rows.map((idx: number) => {
      const item = this.gridObjc.getDataItem(idx);
      return item.fc_code;
    });
  }
  console.log(this.selectedc)
}
}
