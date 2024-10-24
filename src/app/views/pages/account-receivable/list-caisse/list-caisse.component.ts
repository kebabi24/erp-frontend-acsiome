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

import { BankService, AddressService} from "../../../../core/erp"


const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-caisse',
  templateUrl: './list-caisse.component.html',
  styleUrls: ['./list-caisse.component.scss']
})
export class ListCaisseComponent implements OnInit {

  
  
   
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  
  angularGrid: AngularGridInstance;

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;
user :any
  
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private addressService: AddressService,
      private bankService: BankService,
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
      this.prepareGrid()
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
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
            id: "bk_code",
            name: "code",
            field: "bk_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name",
            name: "Designation",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            minWidth: 200,
            type: FieldType.string,
          },
          {
            id: "bk_user1",
            name: "Utilisateur",
            field: "bk_user1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          // {
          //   id: "bk_curr",
          //   name: "Devise",
          //   field: "bk_curr",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
            
          // }, 
          // {
          //   id: "bk_entity",
          //   name: "Entité",
          //   field: "bk_entity",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
            
          // }, 
          {
            id: "bk_balance",
            name: "Solde",
            field: "bk_balance",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            
          }, 
          {
            id: "bk_2000",
            name: "Billet 2000",
            field: "bk_2000",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          }, 
          {
            id: "bk_1000",
            name: "Billet 1000",
            field: "bk_1000",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          }, 
          {
            id: "bk_0500",
            name: "Billet 500",
            field: "bk_0500",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          }, 
          {
            id: "bk_0200",
            name: "Billet 200",
            field: "bk_0200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bk_p200",
            name: "Piéce 200",
            field: "bk_p200",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bk_p100",
            name: "Piéce 100",
            field: "bk_p100",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bk_p050",
            name: "Piéce 50",
            field: "bk_p050",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bk_p020",
            name: "Piéce 20",
            field: "bk_p020",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bk_p010",
            name: "Piéce 10",
            field: "bk_p010",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bk_p005",
            name: "Piéce 5",
            field: "bk_p005",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },
          {
            id: "bk_bon",
            name: "Bon",
            field: "bk_bon",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            
          },

      ]

      this.gridOptions = {
          autoHeight:false,
          enableAutoResize:true,
          enableFiltering: true,
          enableSorting: true,
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
      this.bankService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
console.log(this.dataset)
    }
  
}
