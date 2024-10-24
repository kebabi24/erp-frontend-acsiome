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

import { BankService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-transfert-payment',
  templateUrl: './list-transfert-payment.component.html',
  styleUrls: ['./list-transfert-payment.component.scss']
})
export class ListTransfertPaymentComponent implements OnInit {

 
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
      private bankService: BankService,
      
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
            id: "id",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
    
            minWidth: 50,
            maxWidth: 50,
          },
          {
            id: "bkh_num_doc",
            name: "N° Document",
            field: "bkh_num_doc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "bkh_addr",
            name: "Adresse",
            field: "bkh_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "bkh_bank",
            name: "Code Banque",
            field: "bkh_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "bkh_effdate",
            name: "Date Effet",
            field: "bkh_effdate",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
            
          }, 
          {
            id: "chr01",
            name: "Role",
            field: "chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "bkh_balance",
            name: "Balance",
            field: "bkh_balance",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "bkh_amt",
            name: "Montant",
            field: "bkh_amt",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          

      ]

      this.gridOptions = {
        
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize:true,
          autoHeight:false,
          exportOptions: {
            sanitizeDataExport: true
          },
          

    
        
      }

      // fill the dataset with your data
      this.dataset = []
      this.bankService.getTransfertBy().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
console.log(this.dataset)
    }
  
}
