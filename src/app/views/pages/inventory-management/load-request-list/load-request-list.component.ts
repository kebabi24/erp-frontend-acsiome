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
  GridService,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  OperatorType,
  OperatorString,
  SearchTerm,
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

import { LoadRequestService } from "../../../../core/erp"
import { Widget1Data } from "src/app/views/partials/content/widgets/widget1/widget1.component"
import * as _ from "lodash"

@Component({
  selector: 'kt-load-request-list',
  templateUrl: './load-request-list.component.html',
  styleUrls: ['./load-request-list.component.scss']
})
export class LoadRequestListComponent implements OnInit {

  dataset: any[] = []
  draggableGroupingPlugin: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  gridObj: any;
  dataviewObj: any;
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}

  angularGrid2: AngularGridInstance;
  grid2: any;
  gridService2: GridService;
  dataView2: any;
  gridObj2: any;
  dataviewObj2: any;
  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}

  angularGrid3: AngularGridInstance;
  grid3: any;
  gridService3: GridService;
  dataView3: any;
  gridObj3: any;
  dataviewObj3: any;
  columnDefinitions3: Column[] = []
  gridOptions3: GridOption = {}
  

  loadRequests: any = []; // dataset
  loadRequestLines: any = []; // dataset
  loadRequestDetails: any = []; // dataset

  select_load_code : any ; 

  dataForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  


 data1: Widget1Data[];
 data2: Widget1Data[];

 rolesList : any = [];

  
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private loadRequestService: LoadRequestService,
      private fb: FormBuilder,
     
  ) {
      
  }

  ngOnInit(): void {
    this.createForm()
    this.initData()
    this.prepareGrid()
    this.prepareGrid2()
    this.prepareGrid3()
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataView = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  
  

  prepareGrid() {
    this.columnDefinitions = [
              {
                  id: "load_request_code",
                  name: "Code demande",
                  field: "load_request_code",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string,
                  filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            
                  
  
              },
  
              {
                  id: "date_creation",
                  name: "Date creation",
                  field: "date_creation",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.date, 
                  filter: {
                    model: Filters.dateRange
                  }
                  
              },
              {
                id: "date_charge",
                name: "Date charge",
                field: "date_charge",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.date, 
                filter: {
                  model: Filters.dateRange
                }
              },
  
              
              {
                  id: "status",
                  name: "Status",
                  field: "status",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  filter: {
                    collection: [{value:"0",label:"0 Créée"},{value:"10",label:"10 Validée"},{value:"20",label:"20 Chargée"}],
                     model: Filters.multipleSelect,
                    
                   },
              },
              {
                id: "role_code",
                name: "Code role",
                field: "role_code",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                filter: {

                  collection: this.rolesList,
                   model: Filters.multipleSelect,
                  
                 },
              },
  
  
              // 
              {
                  id: "user_mobile_code",
                  name: "Code utilisateur mobile",
                  field: "user_mobile_code",
                  sortable: true,
                  minWidth: 100,
                  maxWidth: 300,
                  filterable: true,
                  type: FieldType.string, 
                  filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              },
              {
                id: "role_loc",
                name: "Role loc",
                field: "role_loc",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              },
  
              // ***
              {
                id: "role_site",
                name: "Role site",
                field: "role_site",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
                filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              },
        ]
  
        this.gridOptions = {
          enableAutoResize:true,
          autoHeight:true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          // enableRowSelection: true,
          enableCheckboxSelector: true,
          // rowSelectionOptions: {
          //   selectActiveRow: false
          // }
          enableFiltering:true,
        };


  
  }

  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.dataForm = this.fb.group({
  
      
      start_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      end_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
    });
  }


  onSelectedRowsChanged(e, args) {
    // console.log('indexs', args.rows);
    const index = args.rows;
    this.select_load_code = this.gridService.getDataItemByRowIndex(index).load_request_code
    this.updateData()
   
  }

  
gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}

// GRID 2

prepareGrid2() {
  this.columnDefinitions2 = [
            {
                id: "date_creation",
                name: "Date creation",
                field: "date_creation",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.date,
            },
            {
              id: "date_charge",
              name: "Date charge",
              field: "date_charge",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.date, 
            },

            
            {
                id: "line",
                name: "Ligne",
                field: "line",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
            },
            {
              id: "product_code",
              name: "Code produit",
              field: "product_code",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
            },


            // 
            {
                id: "product_desc",
                name: "Desc produit",
                field: "product_desc",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
            },


            {
              id: "qt_request",
              name: "Qnt demandee",
              field: "qt_request",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "qt_validated",
              name: "Qnt valide",
              field: "qt_validated",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "qt_effected",
              name: "Qnt effectue",
              field: "qt_effected",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "pt_price",
              name: "Price",
              field: "pt_price",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
            },

      ]

      this.gridOptions2 = {
        enableAutoResize:true,
        enableColumnPicker: true,
        enableCellNavigation: true,
      };




}

angularGridReady2(angularGrid: AngularGridInstance) {
  this.angularGrid2 = angularGrid;
  this.dataView2 = angularGrid.dataView;
  this.grid2 = angularGrid.slickGrid;
  this.gridService2 = angularGrid.gridService;
}

prepareGrid3() {
  this.columnDefinitions3 = [
         
            {
                id: "line",
                name: "Ligne",
                field: "line",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
            },
            {
              id: "product_code",
              name: "Code produit",
              field: "product_code",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
            },


            // 
            {
                id: "product_desc",
                name: "Desc produit",
                field: "product_desc",
                sortable: true,
                minWidth: 100,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
            },


            {
              id: "qt_effected",
              name: "Qnt effectue",
              field: "qt_effected",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "pt_price",
              name: "Price",
              field: "pt_price",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "lot",
              name: "Lot",
              field: "lot",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
          },

      ]

      this.gridOptions3 = {
        enableAutoResize:true,
        // autoHeight:true,
        enableColumnPicker: true,
        enableCellNavigation: true,
      };

  
}
angularGridReady3(angularGrid: AngularGridInstance) {
  this.angularGrid3 = angularGrid;
  this.dataView3 = angularGrid.dataView;
  this.grid3 = angularGrid.slickGrid;
  this.gridService3 = angularGrid.gridService;
}

 updateData(){
     this.loadRequestService.getLoadRequestLinesDetails(this.select_load_code).subscribe(
    
         (response: any) => {
           this.loadRequestLines = response.data.loadRequestLines
           this.loadRequestDetails = response.data.loadRequestDetails
           this.dataView2.setItems(this.loadRequestLines)
           this.dataView3.setItems(this.loadRequestDetails)
         },
         (error) => {
             this.loadRequestLines = []
             this.loadRequestDetails = []
         },
         () => {}
    )
 }


updateDates(){
  
  const controls = this.dataForm.controls
  const date = controls.start_date.value
  const date2 = controls.end_date.value
  const startDate = date.year+'-'+date.month+'-'+date.day
  const endDate = date2.year+'-'+date2.month+'-'+date2.day

  console.log(startDate)
  console.log(endDate)
  this.loadRequestService.getLoadRequestsBetweenDates(startDate,endDate).subscribe(
      
    (response: any) => {
      this.loadRequests = response.data
      this.dataView.setItems(this.loadRequests)
      this.updateRolesList()
    },
    (error) => {
        this.loadRequests = []
    },
    () => {}
  )
 }

 initData(){
  
  const controls = this.dataForm.controls
  const date = controls.start_date.value
  const date2 = controls.end_date.value
  const startDate = date.year+'-'+date.month+'-'+date.day
  const endDate = date2.year+'-'+date2.month+'-'+date2.day
  this.loadRequestService.getLoadRequestsBetweenDates(startDate,endDate).subscribe(
      
    (response: any) => {
      this.loadRequests = response.data
      this.dataView.setItems(this.loadRequests)
      this.updateRolesList()
    },
    (error) => {
        this.loadRequests = []
    },
    () => {}
  )
 }

 updateRolesList(){
  this.rolesList = []
  const l = _.mapValues(_.groupBy(this.loadRequests, 'role_code'));
  for (const [key, value] of Object.entries(l)) {
    this.rolesList.push({
       value : key , 
       label : key
    })
  }
  this.prepareGrid()
  console.log(this.rolesList)
 }

}
