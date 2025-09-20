import { Component, OnInit } from "@angular/core";
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

import { SaleOrderService, CustomerService, DeviseService,SaleShiperService } from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


const defaultPageSize = 100;
@Component({
  selector: 'kt-psh-list',
  templateUrl: './psh-list.component.html',
  styleUrls: ['./psh-list.component.scss']
})
export class PshListComponent implements OnInit {

 
// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
gridObj: any;
dataviewObj: any;
angularGrid: AngularGridInstance;
draggableGroupingPlugin: any;    
columnDefinitions: Column[] = [];
gridOptions: GridOption = {};
dataset: any[] = [];
customer: any;
so: any;
sodataset: any[] = [];
curr : any;
constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private soService: SaleOrderService,
  private customersService: CustomerService,
  private deviseService: DeviseService,
  private shiperService:SaleShiperService
) {
  this.prepareGrid();
}

ngOnInit(): void {}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.gridObj = angularGrid.slickGrid; // grid object
  this.dataviewObj = angularGrid.dataView;
}

prepareGrid() {
  this.columnDefinitions = [
    
    {
      id: "id",
      name: "id",
      field: "id",
      resizable: false,
      sortable: false,
      minWidth: 50,
      maxWidth: 50
    },
    {
      id: "psh_cust",
      name: "Client",
      field: "psh_cust",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'psh_cust',
        formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "name",
      name: " Nom Client",
      field: "name",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'name',
        formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "psh_nbr",
      name: "commande",
      field: "psh_nbr",
      minWidth: 100,
      maxWidth: 120,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'psh_nbr',
        formatter: (g) => `N BC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
      
    },
    {
      id: "psh_shiper",
      name: "BL",
      field: "psh_shiper",
      minWidth: 100,
      maxWidth: 120,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'psh_shiper',
        formatter: (g) => `N BL: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
   

    {
      id: "psh_ship_date",
      name: "Date de livraison",
      field: "psh_ship_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.date,
      
      filter: {
              model: Filters.dateRange,
              operator: 'RangeInclusive',
              // override any of the Flatpickr options through "filterOptions"
              //editorOptions: { minDate: 'today' } as FlatpickrOption
            },
      grouping: {
        getter: 'psh_ship_date',
        formatter: (g) => `Date Creation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    
    
   
    {
      id: "psh_part",
      name: "Article",
      field: "psh_part",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'psh_part',
        formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "desc",
      name: "Designation",
      field: "desc",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'desc',
        formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "psh_serial",
      name: "Lot",
      field: "psh_serial",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'psh_serial',
        formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "fournisseur",
      name: "Fournisseur",
      field: "fournisseur",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'Fournisseur',
        formatter: (g) => `Fournisseur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('psh_qty_ship'),
          new Aggregators.Sum('sod_qty_ord'),
          new Aggregators.Sum('vamt'),
          new Aggregators.Sum('pamt'),
          new Aggregators.Sum('ecart'),
          
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "psh_um",
      name: "UM",
      field: "psh_um",
      sortable: true,
      width: 30,
      filterable: true,
    },
    
    {
      id: "sod_qty_ord",
      name: "Quantite",
      field: "sod_qty_ord",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    {
      id: "psh_qty_ship",
      name: "Quantite Livree",
      field: "psh_qty_ship",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    
    {
      id: "psh_price",
      name: "Prix",
      field: "psh_price",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "vamt",
      name: "Montant Vente",
      field: "vamt",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,
    },
    {
      id: "pur_price",
      name: "Prix Achat",
      field: "pur_price",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "pamt",
      name: "Montant Achat",
      field: "pamt",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,
    },
    {
      id: "ecart",
      name: "écart",
      field: "ecart",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,
    },
   
     
  ];

  this.gridOptions = {
    
    enableAutoResize:true,
    autoHeight:true,
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
    enableFiltering: true,
    enableSorting: true,
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
    enablePagination: true, // you could optionally disable the Pagination
      pagination: {
      pageSizes: [20, 50, 100, 200, 300, 400, 500, 700, 1000],
      pageSize: defaultPageSize,
      totalItems: 0
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
this.shiperService.getByDet({}).subscribe(
    (response: any) =>  ( this.dataset = response.data),
   
   

   (error) => {
    
        this.dataset = []
    },
    () => {}
   
)  

  // fill the dataset with your data
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
