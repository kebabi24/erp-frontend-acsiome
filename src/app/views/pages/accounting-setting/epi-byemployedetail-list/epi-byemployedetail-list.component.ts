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
  GridService,
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

import { InventoryTransactionService,EmployeService,UsersService,} from "../../../../core/erp"

@Component({  
  selector: 'kt-epi-byemployedetail-list',
  templateUrl: './epi-byemployedetail-list.component.html',
  styleUrls: ['./epi-byemployedetail-list.component.scss']
})
export class EpiByemployedetailListComponent implements OnInit {
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
              id: "tr_desc",
              name: "Désignation",
              field: "tr_desc",
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
              id: "tr__chr03",
              name: "Groupe",
              field: "tr__chr03",
              sortable: true,
              width: 50,
              filterable: true,
             
             
            }, 
            {
              id: "tr__chr01",
              name: "Article",
              field: "tr__chr01",
              sortable: true,
              width: 50,
              filterable: true,
             
             
            }, 
{
              id: "tr__chr02",
              name: "Couleur",
              field: "tr__chr02",
              sortable: true,
              width: 50,
              filterable: true,
             
             
            },          
            {
              id: "tr_lot",
              name: "Ordre",
              field: "tr_lot",
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
        // this.inventorytransaction.getBy({tr_type:'ISS-EPI'}).subscribe(
        //     (response: any) => (this.dataset = response.data),
        //     (error) => {
        //         this.dataset = []
        //     },
        //     () => {}
        // )
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
            id: "structure",
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
            name: "EPI",
            field: "article",
            sortable: true,
            width: 80,
            filterable: true,
           
          },
          {
            id: "qty",
            name: "Quantité",
            field: "qty",
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
        this.inventorytransaction.getByemploye({tr_user1:item.tr_user1,tr_part:item.tr_part}).subscribe(
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
