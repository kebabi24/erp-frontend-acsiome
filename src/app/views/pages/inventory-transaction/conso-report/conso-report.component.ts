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
  ItemService,
  PurchaseOrder,
  TaxeService,
  DeviseService,
  CodeService,
  SiteService,
  PosCategoryService,
  InventoryTransactionService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";

@Component({
  selector: 'kt-conso-report',
  templateUrl: './conso-report.component.html',
  styleUrls: ['./conso-report.component.scss']
})
export class ConsoReportComponent implements OnInit {

  purchaseOrder: PurchaseOrder;
  poForm: FormGroup;
  totForm: FormGroup;
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
  
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];


  // grid options

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  user;
  row_number;
  message = "";
  date: String;
  po_cr_terms: any[] = [];
  constructor(
    config: NgbDropdownConfig,
    private poFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private userService: UsersService,
    private inventoryTransactionService: InventoryTransactionService,
    private posCategoryService: PosCategoryService,
    private codeService: CodeService,
    private siteService: SiteService,
    
  ) {
    config.autoClose = true;
    this.codeService
      .getBy({ code_fldname: "vd_cr_terms" })
      .subscribe((response: any) => (this.po_cr_terms = response.data));
    // this.initGrid();
    // this.initmvGrid();

  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  mvgridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }

  initGrid() {
    this.columnDefinitions = [
      // {
      //   id: "rank",
      //   name: "rank",
      //   field: "rank",
      //   sortable: true,
      //   width: 150,
      //   filterable: true,
      // },
     /* {
        id: "id",
        name: "Ligne",
        field: "id",
        minWidth: 50,
        maxWidth: 50,
      },*/
      {
        id: "famille",
        name: "Famille",
        field: "famille",
        sortable: true,
        width: 100,
        
      },
      // {
      //   id: "part",
      //   name: "Article",
      //   field: "part",
      //   sortable: true,
      //   width: 100,
      //   filterable: true,
        
      // },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 150,
      
      },
      {
        id: "um",
        name: "UM",
        field: "um",
        sortable: true,
        width: 50,
        filterable: false,
        
      },
      {
        id: "pu",
        name: "PU",
        field: "pu",
        sortable: true,
        width: 100,
        filterable: false,
        
      },
    
     
  
     
    
      {
        id: "inv",
        name: "Inventaire",
        field: "inv",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
       
      
      },
      {
        id: "achat",
        name: "Achat",
        field: "achat",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
       
      
      },
      {
        id: "cnt",
        name: "Inventaire Fin ",
        field: "cnt",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
       
      
      },
      {
        id: "avarie",
        name: "Avarie",
        field: "avarie",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,     
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "conso",
        name: "Consomation",
        field: "conso",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "percent",
        name: "% Du CA",
        field: "persent",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.percent,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "vendue",
        name: "Vendue",
        field: "vendue",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "ecart",
        name: "Ecart",
        field: "ecart",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      
      {
        id: "vecart",
        name: "Valeur Ecart",
        field: "vecart",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: false,
      enableFiltering: false,
      enableColumnPicker: true,
      enableCellNavigation: false,
      enableRowSelection: false,
      enableAutoResize: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal:2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
      // presets: {
      //   sorters: [
      //     { columnId: 'rank', direction: 'ASC' }
      //   ],
      // },
        
    };

    this.dataset = [];
   
  }


  mvinitGrid() {
    this.mvcolumnDefinitions = [
      // {
      //   id: "borank",
      //   name: "rank",
      //   field: "borank",
      //   sortable: true,
      //   width: 150,
      //   filterable: true,
      // },
     /* {
        id: "id",
        name: "Ligne",
        field: "id",
        minWidth: 50,
        maxWidth: 50,
      },*/
      {
        id: "bofamille",
        name: "Famille",
        field: "bofamille",
        sortable: true,
        width: 100,
        
      },
      // {
      //   id: "part",
      //   name: "Article",
      //   field: "part",
      //   sortable: true,
      //   width: 100,
      //   filterable: true,
        
      // },
      {
        id: "bodesc",
        name: "Description",
        field: "bodesc",
        sortable: true,
        width: 150,
      },
      {
        id: "boum",
        name: "UM",
        field: "boum",
        sortable: true,
        width: 50,
        filterable: false,
        
      },
      {
        id: "bopu",
        name: "PU",
        field: "bopu",
        sortable: true,
        width: 100,
        filterable: false,
        
      },
      
      
      
      {
        id: "boinv",
        name: "Inventaire",
        field: "boinv",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
       
      
      },
      {
        id: "bocnt",
        name: "Inventaire Fin ",
        field: "bocnt",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
       
      
      },
      {
        id: "boachat",
        name: "Achat",
        field: "boachat",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
       
      
      },
    
      {
        id: "boavarie",
        name: "Avarie",
        field: "boavarie",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,     
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "boconso",
        name: "Consomation",
        field: "boconso",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "bopercent",
        name: "% Du CA",
        field: "bopersent",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.percent,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "bovendue",
        name: "Vendue",
        field: "bovendue",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      {
        id: "boecart",
        name: "Ecart",
        field: "boecart",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      
      {
        id: "bovecart",
        name: "Valeur Ecart",
        field: "bovecart",
        sortable: true,
        minWidth: 100,
        filterable: false,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
      },
      
    ];

    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: false,
      enableFiltering: false,
      enableColumnPicker: true,
      enableCellNavigation: false,
      enableRowSelection: false,
      enableAutoResize: true,
      formatterOptions: {
        
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: false,
  
        // Defaults to undefined, minimum number of decimals
        minDecimal:2,
        maxDecimal:2,
  
        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
        
    };

    this.mvdataset = [];
   
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
   
    this.createForm();
    this.initGrid();
    this.mvinitGrid();
  }

  
change() {
    this.dataset = []
    this.mvdataset = []
    const controls = this.poForm.controls
   // const date = new Date(`${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`)
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
   
       

    this.inventoryTransactionService.getConsoReport({tr_site: controls.tr_site.value, created_date: date}).subscribe(
      (respo: any) => {   
        this.dataset = respo.data.detail
        this.mvdataset = respo.data.bodetail
        controls.casans.setValue(respo.data.casansbo)
        controls.caglob.setValue(respo.data.ca)
      
       
       this.dataView.setItems(this.dataset);
       this.mvdataView.setItems(this.mvdataset); 
         },
      (error) => {
          this.dataset = []
          this.mvdataset= []
      },
      () => {}
  )
  
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.purchaseOrder = new PurchaseOrder();
    const date = new Date;
    
    this.poForm = this.poFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     tr_site:[this.user.usrd_site,Validators.required],
     calc_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      sitedesc:[{value:"", disabled:true}],
      casans:[{value:0, disabled:true}],
      caglob:[{value:0, disabled:true}],
      
    });

    const controls = this.poForm.controls
   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  //reste form
  reset() {
    this.purchaseOrder = new PurchaseOrder();
    this.createForm();
    this.hasFormErrors = false;
  }
  
goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // add new Item to Datatable
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  onChangesite() {
    const controls = this.poForm.controls;
    const si_site = controls.tr_site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Site n'existe pas  ")
            controls.tr_site.setValue(null);
            document.getElementById("tr_site").focus();
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.tr_site.setValue(null);
            document.getElementById("tr_site").focus();
             


           } 
           else{
             controls.sitedesc.setValue(res.data.si_desc)
           }
          }
      
      });
  }
  
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.poForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.tr_site.setValue(item.si_site);
       controls.sitedesc.setValue(item.si_desc)
        
   
     
  });

    }
  }
  angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridsite = angularGrid;
    this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridsite() {
    this.columnDefinitionssite = [
      
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
    ];

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
    if(this.user.usrd_site == "*") {
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
    }
    else {
      this.siteService
      .getBy({si_site : this.user.usrd_site})
      .subscribe((response: any) => (this.datasite = response.data));
  
    }
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

}
