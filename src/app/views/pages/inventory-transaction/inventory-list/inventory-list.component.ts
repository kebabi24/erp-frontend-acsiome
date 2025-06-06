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
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  GridService,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
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

import { LocationDetail, LocationDetailService, CodeService} from "../../../../core/erp"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  grid: any;
  gridService: GridService;
  dataview: any;
 

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;

  
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
     
      private locationDetailService: LocationDetailService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  
  
  prepareGrid() {

      this.columnDefinitions = [
          
          // {
          //   id: "id",
          //   field: "id",
          //   excludeFromColumnPicker: true,
          //   excludeFromGridMenu: true,
          //   excludeFromHeaderMenu: true,
    
          //   minWidth: 50,
          //   maxWidth: 50,
          // },
          {
            id: "ld_site",
            name: "Site",
            field: "ld_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ld_site',
              formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ld_loc",
            name: "Emplacement",
            field: "ld_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ld_loc',
              formatter: (g) => `Emplacement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ld_part",
            name: "Article",
            field: "ld_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'ld_part',
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          }, 
          {
            id: "item.pt_desc1",
            name: "Description",
            field: "item.pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "item.pt_draw",
            name: "FAMILLE",
            field: "item.pt_draw",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'item.pt_draw',
              formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "item.pt_break_cat",
            name: "COULEUR",
            field: "item.pt_break_cat",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/colors`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'item.pt_break_cat',
              formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "item.pt_group",
            name: "Etat",
            field: "item.pt_group",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'item.pt_group',
              formatter: (g) => `Etat: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "ld_lot",
            name: "Lot",
            field: "ld_lot",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ld_lot',
              formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ld_qty_oh",
            name: "Quantite",
            field: "ld_qty_oh",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          }, 
          {
            id: "ld_status",
            name: "Status",
            field: "ld_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ld_status',
              formatter: (g) => `Status: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ld_qty_oh')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ld_ref",
            name: "Reference",
            field: "ld_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ld_ref',
              formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          // {
          //   id: "ld_grade",
          //   name: "Taille",
          //   field: "ld_grade",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          //   grouping: {
          //     getter: 'ld_grade',
          //     formatter: (g) => `Taille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //   }
          // }, 
          {
            id: "last_modified_by",
            name: "Par",
            field: "last_modified_by",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'last_modified_by',
              formatter: (g) => `Users: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ld_date",
            name: "Date Entrée",
            field: "ld_date",
            sortable: true,
            filterable: true,
            type: FieldType.date,
            formatter: Formatters.dateIso ,
            filter: { model: Filters.compoundDate },
            grouping: {
              getter: 'ld_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          
          // {
          //   id: "ld_expire",
          //   name: "Expire Le",
          //   field: "ld_expire",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.dateTimeIso,
          //   grouping: {
          //     getter: 'ld_expire',
          //     formatter: (g) => `Expire Le: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [
          //       // (required), what aggregators (accumulator) to use and on which field to do so
          //      // new Aggregators.Avg('ld_qty_oh'),
          //       new Aggregators.Sum('ld_qty_oh')
          //     ],
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //   }
          // }, 
          // {
          //   id: "ld_qty_frz",
          //   name: "Qte Friz",
          //   field: "ld_qty_frz",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
            
          // },
          
          // {
          //   id: "ld_date_frz",
          //   name: "Date Friz",
          //   field: "ld_date_frz",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.date,
          //   grouping: {
          //     getter: 'ld_date_frz',
          //     formatter: (g) => `Date Friz: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregateCollapsed: false,
          //     collapsed: false,
          //   }
          // },
          

      ]

      this.gridOptions = {
         /* autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },*/
          enableDraggableGrouping: true,
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize: true,
          exportOptions: {
            sanitizeDataExport: true
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
      this.locationDetailService.getAll().subscribe( 
        
          (response: any) => {this.dataset = response.data
            console.log(this.dataset)
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
      this.dataviewObj.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataviewObj.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }

  
}
