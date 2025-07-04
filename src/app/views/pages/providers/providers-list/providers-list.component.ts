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
  GridService,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
} from "angular-slickgrid";
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

import { Provider, ProviderService,Address , AddressService} from "../../../../core/erp"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  
@Component({
  selector: 'kt-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss']
})
export class ProvidersListComponent implements OnInit {


  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  grid: any
  gridService: GridService
  dataview: any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private addressService: AddressService,
      private providerService: ProviderService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.dataview = angularGrid.dataView
    this.grid = angularGrid.slickGrid
    this.gridService = angularGrid.gridService
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
          `
              },
              minWidth: 50,
              maxWidth: 50,
              // use onCellClick OR grid.onClick.subscribe which you can see down below
              onCellClick: (e: Event, args: OnEventArgs) => {
                  const id = args.dataContext.id
                  this.router.navigateByUrl(`/providers/edit/${id}`)
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
            id: "vd_addr",
            name: "code",
            field: "vd_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name",
            name: "Fournisseur",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_sort",
            name: "Activité",
            field: "vd_sort",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_balance",
            name: "Solde",
            field: "vd_balance",
            sortable: true,
            filterable: true,
            type: FieldType.float,
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
            id: "ad_phone",
            name: "Téléphone",
            field: "address.ad_phone",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_pst",
            name: "Email",
            field: "address.ad_pst",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_hold",
            name: "Statut Inactif",
            field: "vd_hold",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_taxc",
            name: "TVA",
            field: "address.ad_taxc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_ckfrm",
            name: "Mode paiement",
            field: "vd_ckfrm",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "vd_cr_terms",
            name: "Délai",
            field: "vd_cr_terms",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vd_type",
            name: "Type",
            field: "vd_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          }, 
          {
            id: "vd_sequence",
            name: "Sequence",
            field: "vd_seq",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "createdAt",
            name: "crée le",
            field: "createdAt",
            sortable: true,
            filterable: true,
            type: FieldType.date,
          },

          {
            id: "created_by",
            name: "Par",
            field: "created_by",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },

          {
            id: "updatedAt",
            name: "modifié le",
            field: "updatedAt",
            sortable: true,
            filterable: true,
            type: FieldType.date,
          },

          {
            id: "last_modified_by",
            name: "Par",
            field: "last_modified_by",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },


      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          enableAutoResize:true,
         

          multiSelect: false,
          rowSelectionOptions: {
            // True (Single Selection), False (Multiple Selections)
            selectActiveRow: true,
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
      this.providerService.getAll().subscribe(
          (response: any) => {this.dataset = response.data
            this.dataview.setItems(this.dataset);
          },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
  vendor() {
    
      
    const url = `/providers/add`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  stklist() {
  
    
    const url = `/inventory-transaction/inventory-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  polist() {
  
    
    const url = `/inventory-transaction/transaction-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  
}
