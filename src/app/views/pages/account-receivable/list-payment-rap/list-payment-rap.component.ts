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

import { AccountReceivableService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-payment-rap',
  templateUrl: './list-payment-rap.component.html',
  styleUrls: ['./list-payment-rap.component.scss']
})
export class ListPaymentRapComponent implements OnInit {

 
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  
  angularGrid: AngularGridInstance;

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;

  
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private accountReceivableService: AccountReceivableService,
      
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
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
                  this.router.navigateByUrl(`/account-receivable/edit-payment/${id}`)
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
            id: "ar_nbr",
            name: "N° Paiement",
            field: "ar_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "chr01",
            name: "Projet",
            field: "chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ar_bill",
            name: "Client",
            field: "ar_bill",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name",
            name: "Nom",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ar_curr",
            name: "Devise",
            field: "ar_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "ar_bank",
            name: "Banque",
            field: "ar_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "ar_check",
            name: "N° Cheque",
            field: "ar_check",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "ar_cr_terms",
            name: "Mode Paiement",
            field: "ar_cr_terms",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ar_ex_rate",
            name: "Taux Change",
            field: "ar_ex_rate",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ar_ex_rate2",
            name: "Taux Change",
            field: "ar_ex_rate2",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ar_amt",
            name: "Montant",
            field: "ar_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ar_applied",
            name: "Montant Applique",
            field: "ar_applied",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ar_base_amt",
            name: "Montant Devise",
            field: "ar_base_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ar_base_applied",
            name: "Montant Applique Devise",
            field: "ar_base_applied",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },

          

      ]

      this.gridOptions = {
          autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },
         
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize:true,
          autoHeight: false,
          exportOptions: {
            sanitizeDataExport: true
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
      this.accountReceivableService.getByWithAdress({ar_open: true, ar_type: "P"}).subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
console.log(this.dataset)
    }
  
}
