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
  GridService,
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

import { PurchaseOrderService } from "../../../../core/erp";
const defaultPageSize = 100;
@Component({
  selector: 'kt-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {

// slick grid
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
gridObj: any;
gridService: GridService;
dataviewObj: any;
angularGrid: AngularGridInstance;
draggableGroupingPlugin: any;    
columnDefinitions: Column[] = [];
gridOptions: GridOption = {};
dataset: any[] = [];
user;
site;
constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private poService: PurchaseOrderService
) {
  
}

ngOnInit(): void {
  this.user =  JSON.parse(localStorage.getItem('user'))
  if (this.user.usrd_site == "*") {this.site = null} else {this.site = this.user.usrd_site }
  console.log(this.site)
  this.prepareGrid();
}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  // this.gridObj = angularGrid.slickGrid; // grid object
  // this.dataviewObj = angularGrid.dataView;
  // this.gridService = angularGrid.gridService;
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
      id: "po_nbr",
      name: "Code",
      field: "po_nbr",
      minWidth: 80,
      maxWidth: 100,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'po_nbr',
        formatter: (g) => `N BC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "po_vend",
      name: "Fournisseur",
      field: "po_vend",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'po_vend',
        formatter: (g) => `Fournisseur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },

    {
      id: "po_ord_date",
      name: "Date de creation",
      field: "po_ord_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'po_ord_date',
        formatter: (g) => `Date Creation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "po_due_date",
      name: "Date d echeance",
      field: "po_due_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'po_due_date',
        formatter: (g) => `Date echeance: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "po_stat",
      name: "Status",
      field: "po_stat",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    
    {
      id: "po_req_id",
      name: "N° DA ",
      field: "po_req_id",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pod_part",
      name: "Article",
      field: "pod_part",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'pod_part',
        formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "pt_desc1",
      name: "Designation",
      field: "pt_desc1",
      sortable: true,
      width: 50,
      filterable: true,
    },
    {
      id: "pod_um",
      name: "UM",
      field: "pod_um",
      sortable: true,
      width: 30,
      filterable: true,
    },
    
    {
      id: "pod_qty_ord",
      name: "Quantite",
      field: "pod_qty_ord",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,

    },
    {
      id: "pod_qty_rcvd",
      name: "Quantite Receptionnee",
      field: "pod_qty_rcvd",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,
      grouping: {
        getter: 'pod_part',
       // formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "pod_site",
      name: "Site",
      field: "pod_site",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "pod_price",
      name: "Prix",
      field: "pod_price",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
    },
    
  ];

  this.gridOptions = {
    // autoResize: {
    //   containerId: 'demo-container',
    //   sidePadding: 10
    // },
    
    autoHeight:true,
  
    enableAutoResize:true,
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
    enableFiltering: true,
    enableSorting: true,
    exportOptions: {
      sanitizeDataExport: true
    },
    autoResize: {
      containerId: '#demo-container',
   
    },

    // enable the filtering but hide the user filter row since we use our own single filter
    showHeaderRow: false, // hide the filter row (header row)

    alwaysShowVerticalScroll: false,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  
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
console.log(this.site, "hounadz")
if(this.site == null) {
  console.log("ssssssssssssssssssssssssssss")
this.poService.getAllwithDetail().subscribe(
    (response: any) =>  { this.dataset = response.data
    this.dataviewObj.setItems(this.dataset)},
   
   

   (error) => {
    
        this.dataset = []
    },
    () => {}
   
)  
  }
  else {
    var site = this.site
    this.dataset = []
    console.log(site, "hnahnahnahnahan")
    this.poService.getAllwithDetailSite({site}).subscribe(
      (response: any) =>  { this.dataset = response.data
      this.dataviewObj.setItems(this.dataset)},
     
     
  
     (error) => {
      
          this.dataset = []
      },
      () => {}
     
  )  
  }
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
