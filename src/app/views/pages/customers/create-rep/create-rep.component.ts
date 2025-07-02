import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";
import { HttpUtilsService } from "../../../../core/_base/crud";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  EditorValidator,
  EditorArgs,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  FieldType,
  Formatters,
  OnEventArgs,
} from "angular-slickgrid";
import { BehaviorSubject, Observable } from "rxjs";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms"
import { RepertoryService, CustomerService,AddressService} from "../../../../core/erp";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";

import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";
const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } 
  return { valid: true, msg: '' };
};

  import { environment } from "../../../../../environments/environment"
  const API_URL = environment.apiUrl + "/codes"
@Component({
  selector: 'kt-create-rep', 
  templateUrl: './create-rep.component.html',
  styleUrls: ['./create-rep.component.scss']
})
export class CreateRepComponent implements OnInit {

 
  
  repForm: FormGroup;
  row_number;

  isExist = false

  adtype: any;
    

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  message = "";
  user
    
    datacust: []
    columnDefinitionscust: Column[] = []
    gridOptionscust: GridOption = {}
    gridObjcust: any
    angularGridcust: AngularGridInstance

  columnDefinitions: Column[];
  gridOptions: GridOption;
  gridObj: any;
  dataView: any;
  grid: any;
  gridService: GridService;
  angularGrid: AngularGridInstance;
 
  reps: any[] = [];
  adresses:any[] = [];
  httpOptions = this.httpUtils.getHTTPHeaders();
  constructor(
    
    config: NgbDropdownConfig,
    private repFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private customerService: CustomerService,
    private addressService: AddressService,
    private repertoryService: RepertoryService,
   
  ) {
    config.autoClose = true;
    
  }

 
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();

    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))       
    
    
    this.createForm();
    this.initGrid();
   
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = (angularGrid && angularGrid.slickGrid) || {};
    this.dataView = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    this.reps = [];
    this.columnDefinitions = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
        maxWidth: 50,
        filterable: true,
        
      },
      {
        id: "rep_contact",
        name: "Contact",
        field: "rep_contact",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        }
      },
      // {
      //   id: "rep_type",
      //   name: "Type",
      //   field: "rep_type",
      //   sortable: true,
      //   width: 80,
      //   filterable: true,
      //   type: FieldType.string,
      //   editor: {
      //     model: Editors.singleSelect,

      //     enableRenderHtml: true,
      //     collectionAsync:  this.http.get(`${API_URL}/rep_type`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
      
         
      //   },
      //   onCellChange:(e: Event, args: OnEventArgs) => {this.adtype = args.dataContext.rep_type}
      // },
      {
        id: "rep_code",
        name: "Appartenance",
        field: "rep_code",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
        editor: {
          model: Editors.text,
         
        },
      },
      // {
      //   id: "mvid",
      //   name: "addresse",
      //   field: "cmvid",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => { 
         
      //       this.row_number = args.row;
      //       let element: HTMLElement = document.getElementById("openvdGrid") as HTMLElement;
      //       element.click();
          
      //   },
      // },
      {
        id: "chr01",
        name: "Lien de parenté",
        field: "chr01",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
       
        editor: {
          model: Editors.singleSelect,

          enableRenderHtml: true,
          collectionAsync:  this.http.get(`${API_URL}/rep_job`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
      
         
        },
        
      },
      // {
      //   id: "rep_post",
      //   name: "Poste",
      //   field: "rep_post",
      //   sortable: true,
      //   width: 80,
      //   filterable: true,
      //   type: FieldType.string,
       
      //   editor: {
      //     model: Editors.singleSelect,

      //     enableRenderHtml: true,
      //     collectionAsync:  this.http.get(`${API_URL}/postes`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
      
         
      //   },
        
      // },
      {
        id: "rep_tel",
        name: "TEL Mobile",
        field: "rep_tel",
        sortable: true,
        width: 80,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        }

      },
      {
        id: "rep_tel2",
        name: "TEL Fix",
        field: "rep_tel2",
        sortable: true,
        width: 80,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        }

      },
      {
        id: "rep_email",
        name: "Email",
        field: "rep_email",
        sortable: true,
        width: 80,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        }

      },
    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      editable: true,
      autoHeight: false,
      autoCommitEdit:true,
      
    };

    // fill the dataset with your data
   
  }

  getRep() {
    this.reps = []
   
    const controls = this.repForm.controls
    
  
   
    this.repertoryService.getBy({ rep_code : controls.cust.value}).subscribe(
      (response: any) => {   
        this.reps = response.data
       console.log(this.reps)
       this.dataView.setItems(this.reps);
        
         },
      (error) => {
          this.reps = []
      },
      () => {}
  )
  }
  onSubmit() {
    const controls = this.repForm.controls
  
    for (let data of this.reps) {
      delete data.id;
    
    }
    this.repertoryService.add({addr: controls.cust.value,repDetails: this.reps }).subscribe(
      (reponse) => console.log("response", Response),
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
        this.reps=[]
        this.reset()
        this.loadingSubject.next(false);
      }
    );
  }
  createForm() {
    this.loadingSubject.next(false)
  //create form
  
  this.repForm = this.repFB.group({
      cust: [ ""]
  
  })
}

// prepareCode(): any {
//   const controls = this.empForm.controls
//   const _addReport = new AddReport()
//   _addReport.pmr_pm_code = controls.pmr_pm_code.value
//   _addReport.pmr_inst = controls.pmr_inst.value
//   _addReport.pmr_task = controls.pmr_task.value
//   _addReport.pmr_task_status = controls.pmr_task_status.value
//   _addReport.pmr_close = controls.pmr_close.value
 
  
//   return _addReport
// }


  
  //reste form
  reset() {
    
    this.createForm();
    this.hasFormErrors = false;
    this.reps = []; 
  }
  // save data
//   onSubmit() {
//     console.log("haha")
//     this.hasFormErrors = false;
//     const controls = this.empForm.controls;
//     /** check form */
//     if (this.empForm.invalid) {
//       Object.keys(controls).forEach((controlName) =>
//         controls[controlName].markAsTouched()
//       );
//       this.message = "Modifiez quelques éléments et réessayez de soumettre.";
//       this.hasFormErrors = true;
//       return;
//     }

//           let pme = this.prepareCode()
//           console.log(pme)
//           this.addDet(pme, this.emps, );
   
   
// /*
//   console.log("hhhhhhhjssfffjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
//   let pme = this.prepareCode()
//   console.log(pme)
//   this.addDet(pme, this.mvdataset);
//   console.log("jjjj")*/
//   }

  
  
//   addDet( _addReport: any ,detail: any) {
//     console.log("here")
//     for (let data of detail) {
//       delete data.id;
//       delete data.cmvid;
     
//     }
//     let emp = null;
//   //  const controls = this.empForm.controls // chof le champs hada wesh men form rah
//    // emp = controls.pmr_addr.value
//     for (let data of detail) {
//       delete data.id;
//       delete data.cmvid;
     
//     }
//     this.loadingSubject.next(true);
  
   
// }


  
  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/customers/customer-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  handleSelectedRowsChangedcust(e, args) {
    const controls = this.repForm.controls
   
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjcust) {
    args.rows.map((idx) => {
      const item = this.gridObjcust.getDataItem(idx);
      console.log(item);

      
       controls.cust.setValue(item.cm_addr)
       this.reps = []
   this.repertoryService.getBy({ rep_code : controls.cust.value}).subscribe(
      (response: any) => {   
        this.reps = response.data
       console.log(this.reps)
       this.dataView.setItems(this.reps);
        
         },
      (error) => {
          this.reps = []
      },
      () => {}
  )
        });
        //});
      }
}
angularGridReadycust(angularGrid: AngularGridInstance) {
    this.angularGridcust = angularGrid
    this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridcust() {
    this.columnDefinitionscust = [
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
        id: "address.ad_name",
        name: "Client",
        field: "address.ad_name",
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
      // {
      //   id: "ad_taxable",
      //   name: "A Taxer",
      //   field: "address.ad_taxable",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
      // {
      //   id: "ad_taxc",
      //   name: "Taxe",
      //   field: "address.ad_taxc",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },  
        ]

    this.gridOptionscust = {
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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }

    // fill the dataset with your data
    this.customerService
        .getAll()
        .subscribe((response: any) => (this.datacust = response.data))
}
open(content) {
    
    this.prepareGridcust()
    this.modalService.open(content, { size: "lg" })
}
 
addNewItem() {
  const newId = this.reps.length+1;
  const controls = this.repForm.controls
  let site:any;
  if(this.user.usrd_site=='*'){site= '1000'}
else{site = this.user.usrd_site}
  const newItem = {
    id: newId,
    rep_contact:null,
    rep_code:controls.cust.value,
    rep_post: null,
    rep_tel: null,
    rep_tel2: null,
    rep_email: null,
    rep_type: null,
    chr03:site
  };
  this.gridService.addItem(newItem, { position: "bottom" });
}
handleSelectedRowsChanged2(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjcust) {
    args.rows.map((idx) => {
      const item = this.gridObjcust.getDataItem(idx);
      console.log(item);

      
          updateItem.rep_code = item.ad_addr;
          
          this.gridService.updateItem(updateItem);
        });
        //});
      }
}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGridcust = angularGrid;
  this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid2() {
  this.columnDefinitionscust = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "ad_type",
      name: "Type",
      field: "ad_type",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_addr",
      name: "code",
      field: "ad_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Nom",
      field: "ad_name",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_phone",
      name: "Numero telephone",
      field: "ad_phone",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxable",
      name: "A Taxer",
      field: "ad_taxable",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_taxc",
      name: "Taxe",
      field: "ad_taxc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  ];

  this.gridOptionscust = {
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
  if(this.adtype != "Provider"){this.addressService.getAll().subscribe((response: any) => (this.adresses = response.data));}
  else{this.addressService.getBy({ad_type:'vendor'}).subscribe((response: any) => (this.adresses = response.data));}
}
open2(content) {
  
        this.prepareGrid2();
        this.modalService.open(content, { size: "lg" });
      
  
}
}
