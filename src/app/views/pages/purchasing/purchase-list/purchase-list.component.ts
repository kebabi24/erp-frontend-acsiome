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
   this.gridObj = angularGrid.slickGrid; // grid object
   this.dataviewObj = angularGrid.dataView;
   this.gridService = angularGrid.gridService;
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
      name: "Code BC",
      field: "po_nbr",
      minWidth: 80,
      maxWidth: 100,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'po_nbr',
        formatter: (g) => `Code BC: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
          new Aggregators.Sum('pod_qty_rcvd'),
          new Aggregators.Sum('rest_to_receive'),
          new Aggregators.Sum('total_price'),
          new Aggregators.Sum('total_recep'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
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
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
          new Aggregators.Sum('pod_qty_rcvd'),
          new Aggregators.Sum('rest_to_receive'),
          new Aggregators.Sum('total_price'),
          new Aggregators.Sum('total_recep'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "ad_name",
      name: "Nom",
      field: "ad_name",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'ad_name',
        formatter: (g) => `Nom : ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
          new Aggregators.Sum('pod_qty_rcvd'),
          new Aggregators.Sum('rest_to_receive'),
          new Aggregators.Sum('total_price'),
          new Aggregators.Sum('total_recep'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "po_ord_date",
      name: "Date de création",
      field: "po_ord_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      filter: {
        model: Filters.dateRange,
      },
      grouping: {
        getter: 'po_ord_date',
        formatter: (g) => `Date Création: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
          new Aggregators.Sum('pod_qty_rcvd'),
          new Aggregators.Sum('rest_to_receive'),
          new Aggregators.Sum('total_price'),
          new Aggregators.Sum('total_recep'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
        aggregateCollapsed: false,
        collapsed: false,
      }
    },
    {
      id: "po_due_date",
      name: "Date d'écheance",
      field: "po_due_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'po_due_date',
        formatter: (g) => `Date d'écheance: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
          new Aggregators.Sum('pod_qty_rcvd'),
          new Aggregators.Sum('rest_to_receive'),
          new Aggregators.Sum('total_price'),
          new Aggregators.Sum('total_recep'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
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
          new Aggregators.Sum('pod_qty_rcvd'),
          new Aggregators.Sum('rest_to_receive'),
          new Aggregators.Sum('total_price'),
          new Aggregators.Sum('total_recep'),
        //  new Aggregators.Sum('pod_qty_rcvd')
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
      width: 50,
      filterable: true,
      grouping: {
        getter: 'pt_desc1',
        formatter: (g) => `Designation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('pod_qty_ord'),
          new Aggregators.Sum('pod_qty_rcvd'),
          new Aggregators.Sum('rest_to_receive'),
          new Aggregators.Sum('total_price'),
          new Aggregators.Sum('total_recep'),
        //  new Aggregators.Sum('pod_qty_rcvd')
        ],
        aggregateCollapsed: false,
        collapsed: false,
      }
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
      type: FieldType.float,
      formatter: Formatters.decimal,
      params: { minDecimal: 2, maxDecimal: 2 }, 
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      headerCssClass: 'text-right',
      cssClass: 'text-right'
    },
    {
      id: "pod_qty_rcvd",
      name: "Quantite receptionnée",
      field: "pod_qty_rcvd",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.decimal,
      type: FieldType.float,
      params: { minDecimal: 2, maxDecimal: 2 }, 
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      headerCssClass: 'text-right',
      cssClass: 'text-right'
      
    },
    {
      id: "rest_to_receive",
      name: " Reste à recevoir",
      field: "rest_to_receive",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
      formatter: Formatters.decimal,
      params: { minDecimal: 2, maxDecimal: 2 }, 
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      headerCssClass: 'text-right',
      cssClass: 'text-right'

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
    {
      id: "total_price",
      name: "Montant commandé",
      field: "total_price",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.float,
      formatter: Formatters.decimal,
      params: { minDecimal: 2, maxDecimal: 2 }, 
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      headerCssClass: 'text-right',
      cssClass: 'text-right'
    },
    {
      id: "total_recep",
      name: "Montant réceptionné",
      field: "total_recep",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.float,
      formatter: Formatters.decimal,
      params: { minDecimal: 2, maxDecimal: 2 }, 
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      headerCssClass: 'text-right',
      cssClass: 'text-right'
    }
    
  ];

  this.gridOptions = {
    // autoResize: {
    //   containerId: 'demo-container',
    //   sidePadding: 10
    // },
    
   
    enableAutoResize:true,
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
    enableFiltering: true,
    enableFilterTrimWhiteSpace: true,
    enableSorting: true,
    exportOptions: {
      sanitizeDataExport: true
    },
    
   
    // enable the filtering but hide the user filter row since we use our own single filter
    showHeaderRow: true, // hide the filter row (header row)

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
let dataset2 = []

// console.log(this.site, "hounadz")
if(this.site == null) {
  // console.log("ssssssssssssssssssssssssssss")
this.poService.getAllwithDetail().subscribe(
    (response: any) =>  { 
      this.dataset = response.data
      //est ce que c;est possibile juste ici parcourir dataset et rajouter f unne nouvelle dataset 2 champs et 
      // avec ce qui existe deja ...item, po_totalC:(),po_totalR:() 
      console.log(this.dataset)
      // dataset2 = response.data
      // dataset2.map((item)=>{
      //   let total_price=item.pod_price * item.pod_qty_ord
      //   let total_recep=item.pod_price * item.pod_qty_rcvd
      //   let element= {...item,"total_price":total_price,"total_recep":total_recep,"rest_to_receive":(item.pod_qty_ord-item.pod_qty_rcvd)}
      //   this.dataset.push(element)
      // })
      // this.dataset.map((item)=>{
      //   console.log(" item of dataset updated "+item.po_nbr+" price "+item.total_price)
      // })

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
    // console.log(site, "hnahnahnahnahan")
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
