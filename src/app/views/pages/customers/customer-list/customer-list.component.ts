import { Component, OnInit } from "@angular/core";
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
} from "angular-slickgrid";

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
  Customer,
  CustomerService,
  Address,
  AddressService,
} from "../../../../core/erp";

const myCustomCheckboxFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) =>
  value
    ? `<div class="text"  aria-hidden="true">Oui</div>`
    : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: "kt-customer-list", 
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.scss"],
})
export class CustomerListComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  user:any;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  dataview: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ["", "", ""];
  gridObj: any;
  dataviewObj: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private addressService: AddressService,
    private customerService: CustomerService
  ) {
    this.prepareGrid();
  }

  ngOnInit(): void {}

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
  }
  prepareGrid() {
    this.columnDefinitions = [
      {
        id: "edit",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
              <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
              <span class="svg-icon svg-icon-md">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                      height="24px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <rect x="0" y="0" width="24" height="24"></rect>
                          <path
                              d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                              fill="#000000" fill-rule="nonzero"
                              transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                          </path>
                          <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                      </g>
                  </svg>
              </span>
          </a>
          `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          const id = args.dataContext.id;
          this.router.navigateByUrl(`/customers/edit/${id}`);
        },
      },
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
        id: "cm_addr",
        name: "code",
        field: "cm_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Client",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_line1",
        name: "Adresse",
        field: "address.ad_line1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_line2",
        name: "Adresse",
        field: "address.ad_line2",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "ad_city",
        name: "City",
        field: "address.ad_city",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_ctry",
        name: "Pays",
        field: "address.ad_country",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_format",
        name: "Format",
        field: "address.ad_format",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        grouping: {
          getter: "ad_format",
          formatter: (g) =>
            `Format: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },

      // {
      //   id: "ad_ref",
      //   name: "Sexe",
      //   field: "address.ad_ref",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      //   grouping: {
      //     getter: "ad_ref",
      //     formatter: (g) =>
      //       `Sexe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
      //     aggregateCollapsed: false,
      //     collapsed: false,
      //   },
      // },
      {
        id: "ad_ext",
        name: "Email",
        field: "address.ad_ext",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cm_db",
        name: "Promo",
        field: "cm_db",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        grouping: {
          getter: "cm_db",
          formatter: (g) =>
            `Promo: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },
      {
        id: "cm_seq",
        name: "Sequence",
        field: "cm_seq",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        grouping: {
          getter: "cm_seq",
          formatter: (g) =>
            `Sequence: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },
      {
        id: "cm_type",
        name: "Type",
        field: "cm_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        grouping: {
          getter: "cm_type",
          formatter: (g) =>
            `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },

      {
        id: "cm_class",
        name: "Classe",
        field: "cm_class",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        grouping: {
          getter: "cm_class",
          formatter: (g) =>
            `Classe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },
      {
        id: "cm_hold",
        name: "Bloc",
        field: "cm_hold",
        sortable: true,
        filterable: true,
        formatter: myCustomCheckboxFormatter,

        type: FieldType.boolean,
        grouping: {
          getter: "cm_hold",
          formatter: (g) =>
            `Bloc: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        },
      },
      {
        id: "ad_misc2_id",
        name: "Matricule Fiscal",
        field: "cm_rmks",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cm_curr",
        name: "Devise",
        field: "cm_curr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "ad_pst_id",
        name: "Article Imposition",
        field: "address.ad_pst_id",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },

      {
        id: "ad_gst_id",
        name: "Registre Commerce",
        field: "address.ad_gst_id",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "cm_balance",
        name: "Solde",
        field: "cm_balance",
        sortable: true,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 

      },
    ];

    this.gridOptions = {
      
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
      enableFiltering: true,
      enableAutoResize: true,
     
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
    this.dataset = [];
    this.user =  JSON.parse(localStorage.getItem('user'))
    if(this.user.usrd_site == '*')
    {this.customerService.getAll().subscribe(
      (response: any) => {
        this.dataset = response.data;
        this.dataview.setItems(this.dataset);
      },
      (error) => {
        this.dataset = [];
      },
      () => {}
    );}
    else{
      console.log(this.user.usrd_site)
      this.customerService.getByAll({cm_site:this.user.usrd_site}).subscribe(
        (response: any) => {
          this.dataset = response.data;
          this.dataview.setItems(this.dataset);
        },
        (error) => {
          this.dataset = [];
        },
        () => {}
      );
    }
    
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
  createcustomer() {
    this.loadingSubject.next(false)
    const url = `/customers/customer-create`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
replist() {
  this.loadingSubject.next(false)
  const url = `/customers/list-rep`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
quotelist() {
  this.loadingSubject.next(false)
  const url = `/sales/req-list`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
invoicelist() {
  this.loadingSubject.next(false)
  const url = `/sales/list-invoices`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
recouvrement() {
  this.loadingSubject.next(false)
  const url = `/sales/payment-psh`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
reqlist() {
  this.loadingSubject.next(false)
  const url = `/training/create-req-training`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
reclamation() {
  this.loadingSubject.next(false)
  const url = `/customers/customer-reclamation`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

}