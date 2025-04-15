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

import { InvoiceOrderService, CustomerService, DeviseService } from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";



@Component({
  selector: 'kt-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})
export class ListInvoicesComponent implements OnInit {

// slick grid
draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  dataView: any;
  
  angularGrid: AngularGridInstance;

  
  gridObj: any;
  dataviewObj: any;
  soForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  user: any;
  domain:any;
constructor(
  private activatedRoute: ActivatedRoute,
  private router: Router,
  public dialog: MatDialog,
  private layoutUtilsService: LayoutUtilsService,
  private invoiceOrderService: InvoiceOrderService,
  private customersService: CustomerService,
  private deviseService: DeviseService,
  private soFB: FormBuilder,
) {
  // this.prepareGrid();
}

ngOnInit(): void {
  this.createForm();
  this.prepareGrid()
  this.solist();
}
createForm() {
  this.loadingSubject.next(false);
  const date = new Date;
  
  this.soForm = this.soFB.group({
   
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
}
solist() {
  this.dataset = []
 
  const controls = this.soForm.controls
  const date = controls.calc_date.value
  ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
  : null;

  const date1 = controls.calc_date1.value
  ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
  : null;
 
  let obj= {date,date1}
  this.invoiceOrderService.getAllwithDetail(obj).subscribe(
    (response: any) => {   
      this.dataset = response.data
     console.log(this.dataset)
     this.dataView.setItems(this.dataset);
      
       },
    (error) => {
        this.dataset = []
    },
    () => {}
)
}
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
    // {
    //   id: "iid",
    //   name: "iid",
    //   field: "iid",
    //   resizable: false,
    //   sortable: false,
    //   minWidth: 50,
    //   maxWidth: 50
    // },
    {
      id: "ih_inv_nbr",
      name: "N° Facture",
      field: "ih_inv_nbr",
      minWidth: 80,
      maxWidth: 100,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'ih_inv_nbr',
        formatter: (g) => `N FA: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('idh_qty_inv'),
          new Aggregators.Sum('montant')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "idh_ship",
      name: "N° BL",
      field: "idh_ship",
      minWidth: 80,
      maxWidth: 100,
      selectable: true,
      filterable: true,
      grouping: {
        getter: 'idh_ship',
        formatter: (g) => `N BL: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('idh_qty_inv'),
          new Aggregators.Sum('montant')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "ih_bill",
      name: "Client",
      field: "ih_bill",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'ih_bill',
        formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('idh_qty_inv'),
          new Aggregators.Sum('montant')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    {
      id: "ad_name",
      name: "Nom Client",
      field: "ad_name",
      sortable: true,
      width: 80,
      filterable: true,
      grouping: {
        getter: 'ad_name',
        formatter: (g) => `Nom Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('idh_qty_inv'),
          new Aggregators.Sum('montant')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },

    {
      id: "ih_inv_date",
      name: "Date de Facture",
      field: "ih_inv_date",
      sortable: true,
      width: 50,
      filterable: true,
      formatter: Formatters.dateIso,
      type: FieldType.dateIso,
      grouping: {
        getter: 'ih_inv_date',
        formatter: (g) => `Date Facture: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('idh_qty_inv'),
          new Aggregators.Sum('montant')
        ],
        aggregateCollapsed: true,
    
        collapsed: false,
      }
    },
    // {
    //   id: "ih_due_date",
    //   name: "Date d'echeance",
    //   field: "ih_due_date",
    //   sortable: true,
    //   width: 50,
    //   filterable: true,
    //   formatter: Formatters.dateIso,
    //   type: FieldType.dateIso,
    //   grouping: {
    //     getter: 'ih_due_date',
    //     formatter: (g) => `Date écheance: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
       
    //     aggregators: [
    //       // (required), what aggregators (accumulator) to use and on which field to do so
    //      // new Aggregators.Avg('tr_qty_loc'),
    //       new Aggregators.Sum('idh_qty_inv'),
    //       new Aggregators.Sum('idh_montant')
    //     ],
    //     aggregateCollapsed: true,
    
    //     collapsed: false,
    //   }
    // },
    
    
    {
      id: "idh_part",
      name: "Article",
      field: "idh_part",
      sortable: true,
      width: 50,
      filterable: true,
      grouping: {
        getter: 'idh_part',
        formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        aggregators: [
          // (required), what aggregators (accumulator) to use and on which field to do so
         // new Aggregators.Avg('tr_qty_loc'),
          new Aggregators.Sum('idh_qty_inv'),
          new Aggregators.Sum('montant')
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
      id: "idh_um",
      name: "UM",
      field: "idh_um",
      sortable: true,
      width: 30,
      filterable: true,
    },
    
    {
      id: "idh_qty_inv",
      name: "Quantite",
      field: "idh_qty_inv",
      sortable: true,
      width: 50,
      filterable: true,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
      type: FieldType.float,
      formatter: Formatters.decimal,
    },
    
    {
      id: "idh_price",
      name: "Prix",
      field: "idh_price",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
      formatter: Formatters.decimal,
    },
    {
      id: "montant",
      name: "Montant",
      field: "montant",
      sortable: true,
      width: 50,
      filterable: true,
      type: FieldType.float,
      formatter: Formatters.decimal,
      groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
    },
    
  ];

  this.gridOptions = {
    
    enableAutoResize:true,
    autoHeight:false,
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 40,
    enableFiltering: true,
    enableSorting: true,
    exportOptions: {
      sanitizeDataExport: true
    },
    formatterOptions: {
        
      // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
      displayNegativeNumberWithParentheses: true,

      // Defaults to undefined, minimum number of decimals
      minDecimal: 2,

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
// this.invoiceOrderService.getAllwithDetail().subscribe(
//     (response: any) =>  ( this.dataset = response.data),
   
   

//    (error) => {
    
//         this.dataset = []
//     },
//     () => {}
   
// )  

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
