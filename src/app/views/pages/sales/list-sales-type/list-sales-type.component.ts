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
  selector: 'kt-list-sales-type',
  templateUrl: './list-sales-type.component.html',
  styleUrls: ['./list-sales-type.component.scss']
})
export class ListSalesTypeComponent implements OnInit {

  
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

  
  
  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  
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
  /*    {
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
      },*/
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
      
        minWidth: 30,
        maxWidth: 30,
        
      },
     
      {
        id: "pt_part_type",
        name: "Code Type",
        field: "pt_part_type",
        sortable: true,
        minWidth: 30,
        maxWidth: 60,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'pt_part_type',
          formatter: (g) => `Code Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('quantity'),  
          new Aggregators.Sum('price'),
      
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
      
      }, 
      {
        id: "code_cmmt",
        name: "Type",
        field: "code_cmmt",
        sortable: true,
        minWidth: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'code_cmmt',
          formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('quantity'),  
          new Aggregators.Sum('price'),
      
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
      
      }, 
      {
        id: "pt_part",
        name: "Code Produit",
        field: "pt_part",
        sortable: true,
        minWidth: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'pt_part',
          formatter: (g) => `Code Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('quantity'),  
          new Aggregators.Sum('price'),
      
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
      
      }, 
      {
        id: "pt_desc1",
        name: "Designation",
        field: "pt_desc1",
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'pt_desc1',
          formatter: (g) => `Designation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('quantity'),  
          new Aggregators.Sum('price'),
      
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
      
      }, 
      
      {
        id: "quantity",
        name: "QTE",
        field: "quantity",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
      },
      {
        id: "price",
        name: "Montant",
        field: "price",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        formatter:Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2, exportWithFormatter: true }, 
      },

    ];

    this.mvgridOptions = {
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      enableFiltering: true,
      enableAutoResize: true,
      autoHeight:false,
      enableSorting: true,
      enableExcelExport:true,
      enableExcelCopyBuffer: true,
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
          displayNegativeNumberWithParentheses: true,
    
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
    const site = controls.site.value
    let obj= {date,date1,site}
    this.mobileSettingsService.getSalesType(obj).subscribe(
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
    const site = controls.site.value
    let obj= {date,date1,site}
    this.mobileSettingsService.getSalesType(obj).subscribe(
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
  onChangesite() {
    const controls = this.soForm.controls;
    const si_site = controls.site.value;
    
   
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
          if( this.user.usrd_site != "*" ) {
            alert("Site n'existe pas  ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
          }
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
             


           } 
          }
      
      });
   
  }
  
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     site:[this.user.usrd_site,Validators.required],
     
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

   
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.site.setValue(item.si_site);
        
    
     
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
 
}