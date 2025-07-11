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
    selector: 'kt-list-inv-bobine',
    templateUrl: './list-inv-bobine.component.html',
    styleUrls: ['./list-inv-bobine.component.scss']
  })
export class ListInvBobineComponent implements OnInit {

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
            id: "chr05",
            name: "Categorie",
            field: "chr05",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'chr05',
              formatter: (g) => `Categorie: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
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
            id: "ld__chr02",
            name: "Type",
            field: "ld__chr02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'ld__chr02',
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
            id: "chr01",
            name: "FAMILLE",
            field: "chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'chr01',
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
            id: "chr02",
            name: "COULEUR",
            field: "chr02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/colors`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'chr02',
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
            id: "chr03",
            name: "Etat",
            field: "chr03",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'chr03',
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
            id: "int01",
            name: "Micronage",
            field: "int01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'int01',
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
            id: "int02",
            name: "laise",
            field: "int02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'int02',
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
            id: "ld_rev",
            name: "Qualité",
            field: "ld_rev",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'ld_rev',
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
          {
            id: "chr04",
            name: "Origine",
            field: "chr04",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'chr04',
              formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "created_by",
            name: "Saisie par",
            field: "created_by",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'created_by',
              formatter: (g) => `Users: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "last_modified_by",
            name: "Modifié par",
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
      this.locationDetailService.getBy({chr01:'BOBINE'}).subscribe( 
        
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
