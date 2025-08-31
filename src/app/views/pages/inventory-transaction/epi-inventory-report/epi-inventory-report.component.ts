import { Component, OnInit } from "@angular/core"
// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  Filters,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
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

import {  InventoryTransactionService } from "../../../../core/erp"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
if (value=="C"){
  return `<div class="text"  aria-hidden="C">Cloturé</div>`
}
if (value=="R"){
  return `<div class="text"  aria-hidden="R">Lancé</div>`
}
if (value=="F"){
  return `<div class="text"  aria-hidden="F">Valide</div>`
}
if (value=="D"){
  return `<div class="text"  aria-hidden="D">Reporté</div>`
}
}
  // return  value  ? `<div class="text"  aria-hidden="C">Clos</div>` : '<div class="text"  aria-hidden="R">Lancé</div>';}
@Component({
  selector: 'kt-epi-inventory-report',
  templateUrl: './epi-inventory-report.component.html',
  styleUrls: ['./epi-inventory-report.component.scss']
})
export class EpiInventoryReportComponent implements OnInit {

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  columnDefinitions1: Column[] = []
  gridOptions1: GridOption = {}
  dataset1: any[] = []

  gridObj1: any;
  angularGrid1: AngularGridInstance;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      
      private inventorytransaction: InventoryTransactionService
  ) {
      this.prepareGrid()
      this.prepareGrid1()
  }

  ngOnInit(): void {
  }

  prepareGrid() {
      this.columnDefinitions = [
         
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
         
          {
            id: "tr_user1",
            name: "Employé",
            field: "tr_user1",
            sortable: true,
            filterable: true,
           
           
          },
          {
            id: "tr_part",
            name: "EPI",
            field: "tr_part",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          {
            id: "tr_rev",
            name: "taille",
            field: "tr_rev",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
        
          {
            id: "tr_nbr",
            name: "Ordre",
            field: "tr_nbr",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          {
            id: "tr_effdate",
            name: "Date",
            field: "tr_effdate",
            sortable: true,
            minWidth: 150,
            filterable: true,
           
           
          },
                   
          {
            id: "tr_qty_loc",
            name: "Quantité",
            field: "tr_qty_loc",
            sortable: true,
            minWidth: 100,
            filterable: true,
           
          },
        
          
    
        ];

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          frozenColumn: 0,
          frozenBottom: true,
      }

      // fill the dataset with your data
      this.dataset = []
      this.inventorytransaction.getByGroupEmp({}).subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
  prepareGrid1() {
    this.columnDefinitions1 = [
        {
          id: "tr_user1",
          name: "Employé",
          field: "tr_user1",
          sortable: true,
          filterable: true,
         
         
        },
       
        {
          id: "Structure",
          name: "Structure",
          field: "structure",
          sortable: true,
          width: 50,
          filterable: true,
         
         
        },
        {
          id: "service",
          name: "Service",
          field: "service",
          sortable: true,
          width: 50,
          filterable: true,
        },
        {
          id: "poste",
          name: "Poste",
          field: "poste",
          sortable: true,
          width: 80,
          filterable: true,
         
        },
      
        {
          id: "spec",
          name: "Spécialite",
          field: "spec",
          sortable: true,
          width: 80,
          filterable: true,
         
        },
        {
          id: "article",
          name: "article",
          field: "article",
          sortable: true,
          width: 80,
          filterable: true,
         
        },
        {
          id: "quantite",
          name: "Quantité",
          field: "quantite",
          sortable: true,
          width: 80,
          filterable: true,
          
        },
        
      ];

    // this.gridOptions1 = {
    //     enableSorting: true,
    //     enableCellNavigation: true,
    //     enableExcelCopyBuffer: true,
    //     enableFiltering: true,
    //     autoEdit: false,
    //     autoHeight: false,
    //     frozenColumn: 0,
    //     frozenBottom: true,
    // }
    this.gridOptions1 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      checkboxSelector: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
      multiSelect: false,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true,
      },
    };

    // fill the dataset with your data
    this.dataset1 = []
    this.inventorytransaction.getByGroupEmp({}).subscribe(
        (response: any) => (this.dataset1 = response.data),
        (error) => {
            this.dataset1 = []
        },
        () => {}
    )
}
angularGridReady1(angularGrid: AngularGridInstance) {
    this.angularGrid1 = angularGrid;
    this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {};
  }
handleSelectedRowsChanged1(e, args) {
  
  
  
  if (Array.isArray(args.rows) && this.gridObj1) {
    args.rows.map((idx) => {
      const item = this.gridObj1.getDataItem(idx);
      console.log(item)
       
      this.dataset = []
      this.inventorytransaction.getByemploye({tr_user1:item.tr_user1}).subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
    
    
  })
 }
}
}
