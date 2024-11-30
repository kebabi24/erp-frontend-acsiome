import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridService,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid"
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
  SiteService,
  MobileSettingsService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
const API_URL = environment.apiUrl + "/users-mobile"


@Component({
  selector: 'kt-list-ca-dd',
  templateUrl: './list-ca-dd.component.html',
  styleUrls: ['./list-ca-dd.component.scss']
})
export class ListCaDdComponent implements OnInit {

  soForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;

  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  // grid options

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  
  seq;
  user;
  row_number;
  message = "";
  requistionServer;
  vpServer;
  provider;
  curr
  details : any [];
  datasetPrint = [];
  date: String;
  po_cr_terms: any[] = [];
  invid : any;

  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,
    private mobileSettingsService: MobileSettingsService,
  ) {
    config.autoClose = true;
    
  
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  GridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.createForm();
    this.initmvGrid();
    //this.initGrid();
    this.solist();
   
  }

  
 
  initmvGrid() {
    this.mvcolumnDefinitions = [
  
      {
        id: "customer_code",
        name: "Code Client",
        field: "customer_code",
        sortable: true,
        
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
       
       
      }, 
      {
        id: "customer_name",
        name: "Nom Client",
        field: "customer_name",
        sortable: true,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
       
       
      }, 
      {
        id: "horstax",
        name: "Hors Taxe",
        field: "horstax",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
       
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "tax",
        name: "TVA",
        field: "tax",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
       
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "stamp",
        name: "Timbre",
        field: "stamp",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
       
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "amount",
        name: "Montant",
        field: "amount",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
       
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "due_amount",
        name: "Montant Appliqué",
        field: "due_amount",
        sortable: true,
        filterable: true,
        
        type: FieldType.number,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
       
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },

    ];

    this.mvgridOptions = {
     
        enableFiltering: true,
        enableAutoResize: true,
        enableAutoResizeColumnsByCellContent:true,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
       
        //enableRowSelection: true,
      //   enableCellNavigation: true,
      //   enableCheckboxSelector: true,
      //   checkboxSelector: {
      //     // optionally change the column index position of the icon (defaults to 0)
      //     // columnIndexPosition: 1,
  
      //     // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //     hideSelectAllCheckbox: true,
  
      //     // you can override the logic for showing (or not) the expand icon
      //     // for example, display the expand icon only on every 2nd row
      //     // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      //   },
      //  // multiSelect: false,
      //   rowSelectionOptions: {
      //     // True (Single Selection), False (Multiple Selections)
      //     selectActiveRow: true,
      //   },
       
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: false,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
          maxDecimal:2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
        gridMenu: {
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => this.onGroupChanged(args),
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      
      },

    }
    this.mvdataset = [];
    
    console.log(this.user)
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    console.log(date,controls.calc_date.value,date1)
    
    let obj= {date,date1}
    this.mobileSettingsService.getAllCA(obj).subscribe(
      (response: any) => {   
        this.mvdataset = response.data
       console.log(this.mvdataset)
       this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  }
  solist() {
    this.mvdataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    
    let obj= {date,date1}
    this.mobileSettingsService.getAllCA(obj).subscribe(
      (response: any) => {   
        this.mvdataset = response.data
       console.log(this.mvdataset)
     //  this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  }
  
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     calc_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      calc_date1: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
    });

    const controls = this.soForm.controls
   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  //reste form
  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }
  clearGroupingSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
  }
  
  collapseAllGroups() {
    this.mvdataView.collapseAllGroups();
  }

  expandAllGroups() {
    this.mvdataView.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.mvgrid.invalidate(); // invalidate all rows and re-render
  }
  handleSelectedRowsChanged(e, args) {
    const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.mvgrid) {
      args.rows.map((idx) => {
        const item = this.mvgrid.getDataItem(idx);
        console.log(item);
        
       const invoicecode = item.invoice_code 
       
    let obj= {invoicecode}
this.dataset= []
       
       this.mobileSettingsService.getAllInvoicesDet(obj).subscribe(
        (respo: any) => {   
          this.dataset = respo.data
         console.log(this.dataset)
         this.dataView.setItems(this.dataset);
          
           },
        (error) => {
            this.dataset = []
        },
        () => {}
    )
     
  });

    }
  }
   


  
 
}
