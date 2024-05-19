import { Component, OnInit } from '@angular/core';



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
  GridStateChange,
  Metrics,
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

import {  InventoryTransaction, InventoryTransactionService, CodeService, LabelService, Label} from "../../../../core/erp"
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
import { PAUSE } from '@angular/cdk/keycodes';
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const defaultPageSize = 100;
  const API_URL_codes = environment.apiUrl + "/codes"
  
const myCustomTimeFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
value.substring(11,19)  ;
const myyearFormatter: Formatter = (row: number, cell: number, valueYEAR: any, columnDef: Column, dataContext: any, grid?: any) =>
valueYEAR.substring(0,4)  ;
const mymonthFormatter: Formatter = (row: number, cell: number, valueMONTH: any, columnDef: Column, dataContext: any, grid?: any) =>
valueMONTH.substring(5,7)  ;


declare var Edelweiss: any;
@Component({
  selector: 'kt-edit-transaction-list',
  templateUrl: './edit-transaction-list.component.html',
  styleUrls: ['./edit-transaction-list.component.scss']
})

export class EditTransactionListComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true);
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  copydataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  metrics!: Metrics;
  WithPagination = true;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  grid: any;
  gridService: GridService;
  dataview: any;
  trLines : any [] = []
  tr_type: any[] = [];
  trForm: FormGroup;
  elem: any[] = [];
  tab: any[] = [] ;
  datefilter: any;
  index: any;
  hasFormErrors = false;
  data: any[];
  message = "";
  trlot: string;
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
      private labelService: LabelService,
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
            id: "supp",
            field: "supp",
            excludeFromHeaderMenu: true,
            formatter: Formatters.deleteIcon,
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
                
                /*ajouter ligne tr_hist de suppression*/
                
                  this.index = this.dataset.findIndex((el) => {
                    return el.tr_line == args.dataContext.tr_line;
                  });
                  args.dataContext.tr_qty_loc = args.dataContext.tr_qty_loc * -1;
                  
                  this.data = [];
                  let obj = {
                    tr_lot:args.dataContext.tr_lot,
                    tr_nbr:args.dataContext.tr_nbr,
                    tr_addr:args.dataContext.tr_addr,
                    tr_rmks:'CORRECTION ADMINISTRATION',
                    tr_gl_date: new Date(),
                    tr_effdate: args.dataContext.tr_effdate,
                    dec01:args.dataContext.dec01,
                    dec02:args.dataContext.dec02,
                    tr_line: args.dataContext.tr_line,
                    tr_part: args.dataContext.tr_part,
                    desc: args.dataContext.desc,
                    tr_qty_loc: args.dataContext.tr_qty_chg * -1,
                    tr_um: args.dataContext.tr_um,
                    tr_um_conv: args.dataContext.tr_um_conv,
                    tr_price: args.dataContext.tr_price,
                    tr_site: args.dataContext.tr_site,
                    tr_loc: args.dataContext.tr_loc,
                    tr_serial: args.dataContext.tr_serial,
                    tr_ref: args.dataContext.tr_ref,
                    tr_status: args.dataContext.tr_status,
                    tr_expire: args.dataContext.tr_expire,
                  };
                  
                  this.data.push(obj);
                  let tr = obj;
                  this.trlot = args.dataContext.tr_lot;
                  this.updatetrans(args.dataContext.id)
                 if(args.dataContext.tr_type == 'RCT-UNP') {this.addRCTUNP(this.data, tr, this.trlot)}
                 else{
                  if(args.dataContext.tr_type == 'ISS-UNP') {this.addISSUNP(this.data, tr, this.trlot)}
                  else{
                   if(args.dataContext.tr_type == 'RCT-WO') {this.addRCTWO(this.data, tr)}
                   else{
                    if(args.dataContext.tr_type == 'ISS-WO') {this.addISSWO(this.data,tr)}
                    else{
                      if(args.dataContext.tr_type == 'RJCT-WO') {this.addRJCTWO(this.data,tr)}
                     }
                  }
                   
                  }
                 }
                  // }
                
                this.angularGrid.gridService.deleteItem(args.dataContext);
              }
            
            },
          },
          
          {
            id: "tr_addr",
            name: "Adresse",
            field: "tr_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {

             model: Filters.compoundInput , operator: OperatorType.rangeInclusive,
              
             },
            grouping: {
              getter: 'tr_addr',
              formatter: (g) => `Adresse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
             
              collapsed:true
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
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
            
              collapsed:true
            }
          }, 
          {
            id: "tr_desc",
            name: "Description",
            field: "tr_desc",
            sortable: true,
            filterable: true,
            filter: { model: Filters.compoundInput , operator: OperatorType.rangeInclusive },

            type: FieldType.string,
            grouping: {
              getter: 'tr_desc',
              formatter: (g) => `Description: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
             
              collapsed:true
            }
          }, 
          {
            id: "tr__chr01",
            name: "FAMILLE",
            field: "tr__chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'tr__chr01',
              formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "tr__chr02",
            name: "COULEUR",
            field: "tr__chr02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/colors`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'tr__chr02',
              formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "tr__chr03",
            name: "Etat",
            field: "tr__chr03",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'tr__chr03',
              formatter: (g) => `Etat: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
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
              aggregateCollapsed: true,
              
              collapsed:true
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
            id: "tr_qty_chg",
            name: "Quantité trans",
            field: "tr_qty_chg",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          }, 
          {
            id: "tr_qty_loc",
            name: "Quantite",
            field: "tr_qty_loc",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 },
            },
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
            onCellChange: (e: Event, args: OnEventArgs) => {
          
                this.data = [];
                let obj = {
                  tr_lot:args.dataContext.tr_lot,
                  tr_nbr:args.dataContext.tr_nbr,
                  tr_addr:args.dataContext.tr_addr,
                  tr_rmks:'CORRECTION ADMINISTRATION',
                  tr_gl_date: new Date(),
                  tr_effdate: args.dataContext.tr_effdate,
                  dec01:args.dataContext.dec01,
                  dec02:args.dataContext.dec02,
                  tr_line: args.dataContext.tr_line,
                  tr_part: args.dataContext.tr_part,
                  desc: args.dataContext.desc,
                  tr_qty_loc: args.dataContext.tr_qty_loc - args.dataContext.tr_qty_chg ,
                  tr_um: args.dataContext.tr_um,
                  tr_um_conv: args.dataContext.tr_um_conv,
                  tr_price: args.dataContext.tr_price,
                  tr_site: args.dataContext.tr_site,
                  tr_loc: args.dataContext.tr_loc,
                  tr_serial: args.dataContext.tr_serial,
                  tr_ref: args.dataContext.tr_ref,
                  tr_status: args.dataContext.tr_status,
                  tr_expire: args.dataContext.tr_expire,
                };
                // this.data.push(this.dataset[this.index])
                this.data.push(obj);
                let tr = obj;
                this.trlot = args.dataContext.tr_lot;
                this.updatetrans(args.dataContext.id)
                if(args.dataContext.tr_type == 'RCT-UNP') {this.addRCTUNP(this.data, tr, this.trlot)}
                else{
                 if(args.dataContext.tr_type == 'ISS-UNP') {this.addISSUNP(this.data, tr, this.trlot)}
                 else{
                  if(args.dataContext.tr_type == 'RCT-WO') {this.addRCTWO(this.data, tr)}
                  else{
                   if(args.dataContext.tr_type == 'ISS-WO') {this.addISSWO(this.data,tr)}
                  }
                 }
                }
                
              
               
                
              
              
            },
          },
            {
            id: "tr_status",
            name: "Status",
            field: "tr_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'tr_status',
              formatter: (g) => `Status: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
             
              collapsed:true
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
               
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: true,
           
              collapsed:true
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
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },

          {
            id: "tr_program",
            name: "Heure",
            field: "tr_program",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.contains },
           

          },
          
          {
            id: "tr_type",
            name: "Type Transaction",
            field: "tr_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          
            filter: {

              
              // collectionAsync: this.elem,
              collectionAsync:  this.http.get(`${API_URL_codes}/trans`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
           
              model: Filters.multipleSelect , operator: OperatorType.inContains
             
              
              
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
              
              aggregateCollapsed: true,
              
              collapsed:true
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
              
              aggregateCollapsed: true,
              
              collapsed:true
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
              
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          

      ]

      this.gridOptions = {
        editable:true,
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableSorting: true,
        enableCellNavigation:true,
        checkboxSelector: {
          hideInFilterHeaderRow: false,
          hideInColumnTitleRow: true,
         
        },
        rowSelectionOptions: {
         
          selectActiveRow: false
        },
        enableCheckboxSelector:true,
        autoHeight:false,
        
        enableAutoResize: true,
        showCustomFooter: true, // display some metrics in the bottom custom footer
        exportOptions: {
          sanitizeDataExport: true
        },
        enablePagination: true,
        pagination: {
          pageSizes: [5, 10, 50,100,1000,50000,999999999],
          pageSize: 100
        },
        presets: {
          filters: [
           
          ],
          sorters: [
           
          ],
          columns:[{columnId:"line",width:50},{columnId:"supp",width:50},{columnId:"tr_effdate",width:50},{columnId:"tr_program",width:50},{columnId:"tr_addr",width:80},{columnId:"tr_part",width:80},{columnId:"tr_desc",width:150},{columnId:"tr__chr01",width:100},{columnId:"tr__chr02",width:100},{columnId:"tr__chr03",width:100},{columnId:"tr_serial",width:20},{columnId:"tr_ref",width:20}, {columnId:"tr_qty_loc",width:20}, {columnId:"tr_um",width:10}, {columnId:"tr_status",width:80}, {columnId:"tr_type",width:50}, {columnId:"tr_lot",width:20}, {columnId:"tr_nbr",width:20}]
          
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
    this.copydataset = []
    this.inventoryTransactionService.getAll().subscribe(
      
        (response: any) => {this.dataset = response.data,
          this.copydataset = response.data,
          this.dataview.setItems(this.dataset)},
        
        (error) => {
            this.dataset = []
            this.copydataset = []
        },
        () => {}
        
    )
    
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


  refreshMetrics(e: Event, args: any) {
    if (args && args.current >= 0) {
      setTimeout(() => {
        this.metrics = {
          startTime: new Date(),
          endTime: new Date(),
          itemCount: args && args.current || 0,
          totalItemCount: this.dataset.length || 0
        };
      });
    }
  }
  scrollGridBottom() {
    this.angularGrid.slickGrid.navigateBottom();
  }
  scrollGridDown() {
    this.angularGrid.slickGrid.navigateDown();
  }
  scrollGridLeft() {
    this.angularGrid.slickGrid.navigateLeft();
  }
  scrollGridRight() {
    this.angularGrid.slickGrid.navigateRight();
  }

  scrollGridUp() {
    this.angularGrid.slickGrid.navigateUp();
  }
  scrollGridTop() {
    this.angularGrid.slickGrid.navigateTop();
  }
  togglePaginationGrid2() {
    this.WithPagination = !this.WithPagination;
    this.angularGrid.paginationService!.togglePaginationVisibility(this.WithPagination);
  }

  trlist(){
    const controls = this.trForm.controls
    
    this.dataset = []
    this.copydataset = []
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    
    let obj= {date,date1}
    this.inventoryTransactionService.getByDate(obj).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data.tr_gl_date)
      
      this.dataset  = res.data;
      this.copydataset  = res.data;
      this.dataview.setItems(this.dataset)
      
    //this.dataset = res.data
    this.loadingSubject.next(false) 
  })
  
  }
  onSelectedRowsChanged(e, args) {
    // console.log('indexs', args.rows);
    const indexes = args.rows;
    this.trLines = []
    indexes.forEach(index => {
      const tr_line = this.gridService.getDataItemByRowIndex(index).tr_part
      this.trLines.push(tr_line)
    });
   
  }
  prepare() {
    const controls = this.trForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_lot = controls.tr_lot.value;
    _tr.tr_nbr = controls.tr_nbr.value;

    _tr.tr_effdate = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
    _tr.tr_so_job = controls.tr_so_job.value;

    _tr.tr_rmks = controls.tr_rmks.value;
    _tr.tr_addr = controls.tr_addr.value;

    return _tr;
  }
  /**
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _it: it
   */
  onSubmit() {
    this.hasFormErrors = false;
    
    this.data = [];
    let obj = {
      tr_lot:this.dataset[this.index].tr_lot,
      tr_nbr:this.dataset[this.index].tr_nbr,
      tr_addr:this.dataset[this.index].tr_addr,
      tr_rmks:'CORRECTION ADMINISTRATION',
      tr_gl_date: new Date(),
      tr_effdate: this.dataset[this.index].tr_effdate,
      dec01:this.dataset[this.index].dec01,
      dec02:this.dataset[this.index].dec02,
      tr_line: this.dataset[this.index].tr_line,
      tr_part: this.dataset[this.index].tr_part,
      desc: this.dataset[this.index].desc,
      tr_qty_loc: this.dataset[this.index].tr_qty_loc,
      tr_um: this.dataset[this.index].tr_um,
      tr_um_conv: this.dataset[this.index].tr_um_conv,
      tr_price: this.dataset[this.index].tr_price,
      tr_site: this.dataset[this.index].tr_site,
      tr_loc: this.dataset[this.index].tr_loc,
      tr_serial: this.dataset[this.index].tr_serial,
      tr_ref: this.dataset[this.index].tr_ref,
      tr_status: this.dataset[this.index].tr_status,
      tr_expire: this.dataset[this.index].tr_expire,
    };
    // this.data.push(this.dataset[this.index])
    this.data.push(obj);

    
   
    this.trlot = this.dataset[this.index].tr_lot;

    let tr = obj;
    this.addRCTUNP(this.data, tr, this.trlot);

    
  }
  addRCTUNP(detail: any, it, nlot) {
   
    this.loadingSubject.next(true);
    const controls = this.trForm.controls;
  
    this.inventoryTransactionService.addRCTUNPCab({ detail, it, nlot }).subscribe(
      (reponse: any) => {
        console.log(reponse);
        // const arrayOctet = new Uint8Array(reponse.pdf.data)
        // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
        // const fileUrl = URL.createObjectURL(file);
        // window.open(fileUrl)
      },
      (error) => {
        
        alert("Erreur, vérifier les informations");
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);

        //    console.log(this.provider, po, this.dataset);
        // if(controls.print.value == true) printReceiveUNP(this.provider, this.dataset, nlot)
        // if (controls.print.value == true) this.printpdf(nlot); //printBc(this.provider, this.dataset, po, this.curr);

        // this.router.navigateByUrl("/");
      }
    );
  }
  addISSUNP( detail: any, it, nlot) {
    
    this.loadingSubject.next(true);
    const controls = this.trForm.controls;

    this.inventoryTransactionService
      .addIssUnp({detail, it,nlot})
      .subscribe(
       (reponse: any) => {
        console.log(reponse)
      // this.printpdf(this.trlot); //printBc(this.provider, this.dataset, po, this.curr);
        // const arrayOctet = new Uint8Array(reponse.pdf.data)
        // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
        // const fileUrl = URL.createObjectURL(file);
        // window.open(fileUrl)},
       },
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
          
          // this.goBack()
      //    console.log(this.provider, po, this.dataset);
      //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
     

        // this.router.navigateByUrl("/");
        
        }
      );
  }
  addRCTWO(detail: any, it) {
    
    this.loadingSubject.next(true);

    this.inventoryTransactionService.addRCTWO({ detail, it }).subscribe(
      (reponse: any) => console.log(reponse),
      (error) => {
        alert("Erreur, vérifier les informations avec l'administrateur système");
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        //    console.log(this.provider, po, this.dataset);

        // this.router.navigateByUrl("/");
      }
    );
  }
  addRJCTWO(detail: any, it) {
    
    this.loadingSubject.next(true);

    this.inventoryTransactionService.addRJCTWO({ detail, it }).subscribe(
      (reponse: any) => console.log(reponse),
      (error) => {
        alert("Erreur, vérifier les informations avec l'administrateur système");
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        //    console.log(this.provider, po, this.dataset);

        // this.router.navigateByUrl("/");
      }
    );
  }
  addISSWO( detail: any, it) {
    
    this.loadingSubject.next(true);
    const controls = this.trForm.controls;

    this.inventoryTransactionService
      .addIssWo({detail, it})
      .subscribe(
       (reponse: any) => console.log(reponse),
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
      //    console.log(this.provider, po, this.dataset);
      //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
     
        // this.router.navigateByUrl("/");
        }
      );
  }
  updatetrans(details: any) {
    this.loadingSubject.next(true)
    this.inventoryTransactionService.updatetr({id:details}).subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
            this.layoutUtilsService.showActionNotification(
                "Erreur verifier les informations",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
        },
        () => {
          
            this.layoutUtilsService.showActionNotification(
                "Modification avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            // this.router.navigateByUrl("inventory-settings/list-status")
        }
    )
  }
}
