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

import {  InventoryTransactionService, CodeService} from "../../../../core/erp"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { findLastKey } from "lodash"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const defaultPageSize = 100;
  const API_URL = environment.apiUrl + "/codes"
const myCustomTimeFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
value.substring(11,19)  ;

@Component({
  selector: 'kt-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true);
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  grid: any;
  gridService: GridService;
  dataview: any;
  tr_type: any[] = [];
  trForm: FormGroup;
  elem: any[] = [];
  tab: any[] = [] ;
  datefilter: any;
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private trFB: FormBuilder,
      config: NgbDropdownConfig,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private codeService: CodeService,
      private inventoryTransactionService: InventoryTransactionService,
  ) {
   
    
    
   //this.elem = [{value: '', label: ''},];
    
   //this.elem = [{value: '', label: ''},{value: 'ISS-SO', label: 'ISS-SO'}];
    
  
  //  this.prepareGrid() 

  }

  ngOnInit(): void {
    this.createForm();
    this.prepareGrid();
    this.trlist();
   
  }

  createForm() {
    const date = new Date ;
    date.setDate(date.getDate() - 2);
    const date1 = new Date;
    this.trForm = this.trFB.group({
    
      date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      date1: [{
        year:date1.getFullYear(),
        month: date1.getMonth()+1,
        day: date1.getDate()
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


    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
 this.datefilter =  String(currentYear) + '-' + String(currentMonth) + '-' + '01'

      this.columnDefinitions = [
          
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
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "tr_loc",
            name: "Emplacement",
            field: "tr_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'tr_loc',
              formatter: (g) => `Emplacement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "tr_addr",
            name: "Adresse",
            field: "tr_addr",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_addr',
              formatter: (g) => `Adresse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: false,
          
              collapsed: false,
              lazyTotalsCalculation:true
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
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: false,
          
              collapsed: false,
            }
          }, 
          {
            id: "item.pt_desc1",
            name: "Description",
            field: "item.pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'pt_desc1',
              formatter: (g) => `Description: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: false,
          
              collapsed: false,
            }
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
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "item.pt_um",
            name: "UM",
            field: "item.pt_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          }, 
          {
            id: "tr_qty_loc",
            name: "Quantite",
            field: "tr_qty_loc",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },
            {
            id: "tr_status",
            name: "Status",
            field: "tr_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'tr_status',
              formatter: (g) => `Status: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 


          {
            id: "tr_ref",
            name: "Reference",
            field: "tr_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'tr_ref',
              formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          // {
          //   id: 'finish', name: 'Finish', field: 'tr_effdate', nameKey: 'FINISH', formatter: Formatters.dateIso, sortable: true, minWidth: 75, width: 120, exportWithFormatter: true,
          //   type: FieldType.date,
          //   filterable: true,
          //   filter: {
          //     model: Filters.dateRange,
    
          //     // override any of the Flatpickr options through "filterOptions"
          //    // editorOptions: { minDate: 'today' } as FlatpickrOption
          //   }
          // },
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
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "tr_date",
            name: "Date Saisie",
            field: "tr_date",
            sortable: true,
            filterable: true,
            type: FieldType.date,
            formatter: Formatters.dateIso,
//            filter: { model: Filters.dateRange },
  //          type: FieldType.date,
    //        filterable: true,
            filter: {
              model: Filters.dateRange,
             
              // override any of the Flatpickr options through "filterOptions"
          //    editorOptions: { minDate: 'today' } as FlatpickrOption
            },
            grouping: {
              getter: 'tr_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "createdAt",
            name: "Heure",
            field: "createdAt",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
            formatter: myCustomTimeFormatter,
//            filter: { model: Filters.dateRange },
  //          type: FieldType.date,
    //        filterable: true,
          },
          {
            id: "createdAta",
            name: "Heure",
            field: "createdAt",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
            formatter: Formatters.dateTimeIso,
//            filter: { model: Filters.dateRange },
  //          type: FieldType.date,
    //        filterable: true,
          },
          {
            id: "tr_expire",
            name: "Expire Le",
            field: "tr_expire",
            sortable: true,
            filterable: true,
            type: FieldType.dateTimeIso,
            grouping: {
              getter: 'tr_expire',
              formatter: (g) => `Expire Le: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          }, 
          {
            id: "tr_type",
            name: "Type Transaction",
            field: "tr_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           /* filter: {

              
             // collectionAsync: this.elem,
              collection: [{value: '', label: ''},{value: 'ISS-SO', label: 'ISS-SO'},{value: 'ISS-TR', label: 'ISS-TR'},{value: 'ISS-UNP', label: 'ISS-UNP'},{value: 'ISS-WO', label: 'ISS-WO'}, {value: 'ISS-CHL', label: 'ISS-CHL'}, {value: 'CYC-RCNT', label: 'CYC-RCNT'}, {value: 'RCT-WO', label: 'RCT-WO'}, {value: 'RCT-PO', label: 'RCT-PO'} , {value: 'RCT-UNP', label: 'RCT-UNP'}],
              customStructure: {
              value: 'value',
              label: 'label',
              optionLabel: 'value', // if selected text is too long, we can use option labels instead
              labelSuffix: 'text',
           },
            
              model: Filters.multipleSelect,
              searchTerm
              s: []
            },*/
            filter: {

              
              // collectionAsync: this.elem,
              collectionAsync:  this.http.get(`${API_URL}/trans`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
           
           
             
               model: Filters.multipleSelect,
              
             },
            //filter: {model: Filters.multipleSelect , operator: OperatorType.contains },
            grouping: {
              getter: 'tr_type',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "tr_nbr",
            name: "N° Bon",
            field: "tr_nbr",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_nbr',
              formatter: (g) => `N° Bon: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "tr_lot",
            name: "N° Doc ",
            field: "tr_lot",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_lot',
              formatter: (g) => `N° : ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: false,
              collapsed: false,
            }
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

  
        dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
          var val = undefined;
          try {
            val = eval("item." + column.field);
          } catch (e) {
            // ignore
          }
          return val;
        },


    }

    // fill the dataset with your data
    this.dataset = []
    this.inventoryTransactionService.getAll().subscribe(
      
        (response: any) => {this.dataset = response.data
          this.dataview.setItems(this.dataset)},
        
        (error) => {
            this.dataset = []
        },
        () => {}
        
    )
    console.log(this.dataset)
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
    const controls = this.trForm.controls
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
    this.dataset = []
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    console.log(date)
    console.log(date1)
    let obj= {date,date1}
    this.inventoryTransactionService.getByDate(obj).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data)
      this.dataset  = res.data;
      this.dataview.setItems(this.dataset)
        
    //this.dataset = res.data
    this.loadingSubject.next(false) 
  })
  
  }
  

}
