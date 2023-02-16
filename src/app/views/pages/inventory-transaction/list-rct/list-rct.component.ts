import { Component, OnInit } from "@angular/core"

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

import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import {  InventoryTransactionService, CodeService,SiteService} from "../../../../core/erp"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { ControlPosition } from "@agm/core/lib/directives/map"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const defaultPageSize = 100;
  const API_URL = environment.apiUrl + "/codes"
@Component({
  selector: 'kt-list-rct',
  templateUrl: './list-rct.component.html',
  styleUrls: ['./list-rct.component.scss']
})
export class ListRctComponent implements OnInit {

  loadingSubject = new BehaviorSubject<boolean>(true);
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  loading$: Observable<boolean>;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  grid: any;
  gridService: GridService;
  dataview: any;
  tr_type: any[] = [];
  poForm: FormGroup;
  elem: any[] = [];
  tab: any[] = [] ;
  datefilter: any;
  user:any;
  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private trFB: FormBuilder,
      config: NgbDropdownConfig,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private modalService: NgbModal,
      private layoutUtilsService: LayoutUtilsService,
      private siteService: SiteService,
      private inventoryTransactionService: InventoryTransactionService,
  ) {
   
    
    
   //this.elem = [{value: '', label: ''},];
    
   //this.elem = [{value: '', label: ''},{value: 'ISS-SO', label: 'ISS-SO'}];
    
  
  //  this.prepareGrid() 

  }

  ngOnInit(): void {
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
    this.prepareGrid();
    this.trlist();
   
  }

  createForm() {
    const date = new Date ;
  
    
    this.poForm = this.trFB.group({
    
      tr_site:[this.user.usrd_site,Validators.required],
      type:["R",Validators.required],
      calc_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      calc_date1: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      
    
    });
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  prepareGrid() {


   
      this.columnDefinitions = [
          
          /*{
            id: "id",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
    
            minWidth: 50,
            maxWidth: 50,
          },*/
          {
            id: "tr_site",
            name: "Site",
            field: "tr_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'tr_site',
              formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty'),
                new Aggregators.Sum('amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "tr_effdate",
            name: "Date Effet",
            field: "tr_effdate",
            nameKey: 'DATE EFFET',
            sortable: true,
          
  
            formatter: Formatters.dateIso, 
            minWidth: 75,
            width: 120,
            exportWithFormatter: true,
  
            type: FieldType.date,
            filterable: true,
            filter: {
              model: Filters.dateRange,
              operator: 'RangeInclusive',
              // override any of the Flatpickr options through "filterOptions"
              //editorOptions: { minDate: 'today' } as FlatpickrOption
            },
              
            grouping: {
              getter: 'tr_effdate',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty'),
                new Aggregators.Sum('amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
            },
          {
            id: "tr_part",
            name: "Article",
            field: "tr_part",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_part',
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty'),
                new Aggregators.Sum('amt'),
                ],
              aggregateCollapsed: false,
          
              collapsed: false,
            }
          }, 
          {
            id: "tr_addr",
            name: "Fournisseur",
            field: "tr_addr",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_addr',
              formatter: (g) => `Fournisseur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty'),
                new Aggregators.Sum('amt'),
                ],
              aggregateCollapsed: false,
          
              collapsed: false,
            }
          }, 
          {
            id: "tr_desc",
            name: "Description",
            field: "tr_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "tr_serial",
            name: "Lot",
            field: "tr_serial",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_serial',
              formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('qty'),
                new Aggregators.Sum('amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "tr_um",
            name: "UM",
            field: "tr_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          }, 
          
          {
            id: "tr_qty_loc",
            name: "Qte",
            field: "tr_qty_loc",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            formatter: Formatters.decimal,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },
          {
            id: "tr_price",
            name: "Prix",
            field: "tr_price",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            formatter: Formatters.decimal,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },
          {
            id: "dec05",
            name: "Montant",
            field: "dec05",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            formatter: Formatters.decimal,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },

      ]

      this.gridOptions = {
      /*  autoResize: {
          containerId: 'demo-container',
          sidePadding: 10
        },*/
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        autoHeight: false,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
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
        //   filters: [
           
        //     // { columnId: 'complete', searchTerms: ['5'], operator: '>' },
        //     { columnId: 'tr_effdate', operator: '>=', searchTerms: [this.datefilter] },
        //     // { columnId: 'effort-driven', searchTerms: [true] },
        //   ],
        //   // sorters: [
        //   //   { columnId: 'duration', direction: 'DESC' },
        //   //   { columnId: 'complete', direction: 'ASC' }
        //   // ],
        // },
       
     
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

    // fill the dataset with your data
    this.dataset = []
    // this.inventoryTransactionService.getAll().subscribe(
      
    //     (response: any) => {this.dataset = response.data
    //       this.dataview.setItems(this.dataset)},
        
    //     (error) => {
    //         this.dataset = []
    //     },
    //     () => {}
        
    // )
    // console.log(this.dataset)
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
    this.dataview.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataview.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.grid.invalidate(); // invalidate all rows and re-render
  }




  trlist(){
    const controls = this.poForm.controls
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    this.dataset = []
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;

    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;

  const site = controls.tr_site.value
  const type = "RCT-PO"
    console.log(site,date,date1,type)
    
    let obj= {site,date,date1,type}
    this.inventoryTransactionService.getRct(obj).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data)
      this.dataset  = res.data;
      this.dataview.setItems(this.dataset)
        
    //this.dataset = res.data
    this.loadingSubject.next(false) 
  })
  
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
