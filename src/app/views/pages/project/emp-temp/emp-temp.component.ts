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
import { EmployeService, CodeService , ProjectService, TaskService,ProviderService,AddReportService,AddReport,SequenceService,ItemService, LocationService,
  CostSimulationService,LocationDetailService,InventoryStatusService,MesureService, SiteService,InventoryTransactionService} from "../../../../core/erp";
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
import { environment } from "../../../../../environments/environment";
import { TransitiveCompileNgModuleMetadata } from "@angular/compiler";
const API_URL = environment.apiUrl + "/codes";
@Component({
  selector: 'kt-emp-temp',
  templateUrl: './emp-temp.component.html',
  styleUrls: ['./emp-temp.component.scss']
})
export class EmpTempComponent implements OnInit {

  addReport: AddReport;
  empForm: FormGroup;
  row_number;

  isExist = false

  
    

  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  message = "";
  job: String;
  level: String;
  seq : any;
  nbr: string;
  user
    
    location: any;
    sct: any;
    lddet: any;
    trlot: string;
    datasetPrint = [];
    stat: String;

    loc: String;
    site: String;

    alertWarning: any;

    datasite: []
    columnDefinitionssite: Column[] = []
    gridOptionssite: GridOption = {}
    gridObjsite: any
    angularGridsite: AngularGridInstance

  columnDefinitions18: Column[];
  gridOptions18: GridOption;
  gridObj18: any;
  dataView18: any;
  grid18: any;
  gridService18: GridService;
  angularGrid18: AngularGridInstance;
  emp_shift: any[] = [];
  emps: any[];
  httpOptions = this.httpUtils.getHTTPHeaders();
  constructor(
    
    config: NgbDropdownConfig,
    private empFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private router: Router,
    public  dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private modalService: NgbModal,
    private employeService: EmployeService,
    private addReportService: AddReportService,
    private sequenceService: SequenceService,
    private projectService: ProjectService,
    private providerService: ProviderService,
    private inventoryTransactionService: InventoryTransactionService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    private locationService: LocationService,
    private codeService: CodeService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private locationDetailService: LocationDetailService
  ) {
    config.autoClose = true;
    this.codeService
    .getBy({ code_fldname: "emp_shift" })
    .subscribe((response: any) => (this.emp_shift = response.data));
  }

 
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();

    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))       
    
    if (this.user.usrd_site == "*") {this.site = null} else {this.site = this.user.usrd_site }
    this.createForm();
    this.initGrid18();
   
  }
  angularGridReady18(angularGrid: AngularGridInstance) {
    this.angularGrid18 = angularGrid;
    this.gridObj18 = (angularGrid && angularGrid.slickGrid) || {};
    this.dataView18 = angularGrid.dataView;
  }

  initGrid18() {
    this.emps = [];
    this.columnDefinitions18 = [
      {
        id: "emp_fname",
        name: "Nom",
        field: "emp_fname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "emp_lname",
        name: "Prénom",
        field: "emp_lname",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "type",
        name: "Type",
        field: "type",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.string,
        editor: {
          model: Editors.singleSelect,

          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collectionAsync: this.http.get(`${API_URL}/emptype`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
          //   customStructure: {
          //     value: 'code_value',
          //     label: 'code_cmmt',
          //     optionLabel: 'code_value', // if selected text is too long, we can use option labels instead
          //     //labelSuffix: 'text',
          //  },
          //   editorOptions: {
          //     maxHeight: 400
          //   }
        },
      },
      // {
      //   id: "timestart",
      //   name: "Heure D'entrée",
      //   field: "timestart",
      //   sortable: true,
      //   width: 80,
      //   filterable: true,
      //   type: FieldType.string,
      //   editor: {
      //     model: Editors.text,
      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {},
      // },
      // {
      //   id: "timeend",
      //   name: "Heure De Sortie",
      //   field: "timeend",
      //   sortable: true,
      //   width: 80,
      //   filterable: true,
      //   type: FieldType.string,

      //   editor: {
      //     model: Editors.text,
      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {},
      // },
    ];

    this.gridOptions18 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: true,
      editable: true,
      autoHeight: false,
      autoCommitEdit:true,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      checkboxSelector: {},
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
   
  }

  getEmp() {
    this.emps = []
   
    const controls = this.empForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
  
   
    this.employeService.getByTimeProject({emp_shift:controls.emp_shift.value,date:date, site:controls.site.value}).subscribe(
      (response: any) => {   
        this.emps = response.data
       console.log(this.emps)
       //this.dataView18.setItems(this.emps);
        
         },
      (error) => {
          this.emps = []
      },
      () => {}
  )
  }
  onSubmitEmpTime() {
    const controls = this.empForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    this.employeService.addPoint({ date,empDetails: this.emps }).subscribe(
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
        this.emps=[]
        this.loadingSubject.next(false);
      }
    );
  }
  createForm() {
    this.loadingSubject.next(false)
  //create form
  const date = new Date;
  
  this.empForm = this.empFB.group({
    calc_date: [{
      year:date.getFullYear(),
      month: date.getMonth()+1,
      day: date.getUTCDate() 
    }],
      emp_shift :  [{value: ""}],
      site: [ this.site]
  
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
    this.emps = []; 
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
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.empForm.controls
   
    if (Array.isArray(args.rows) && this.gridObjsite) {
        args.rows.map((idx) => {
            const item = this.gridObjsite.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            
                    controls.site.setValue(item.si_site || "")
            
        })
    }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridsite = angularGrid
    this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridsite() {
    this.columnDefinitionssite = [
        {
            id: "id",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,

            minWidth: 50,
            maxWidth: 50,
        },
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "si_site",
            name: "Site",
            field: "si_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "si_desc",
            name: "Designation",
            field: "si_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        
    ]

    this.gridOptionssite = {
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
    this.siteService
        .getAll()
        .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite) {
    
    this.prepareGridsite()
    this.modalService.open(contentsite, { size: "lg" })
}
 
}
