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
import "jspdf-barcode";
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

import { LoadRequestService, UsersMobileService } from "../../../../core/erp"
import { Widget1Data } from "src/app/views/partials/content/widgets/widget1/widget1.component"
import * as _ from "lodash"
import jsPDF from "jspdf"

@Component({
  selector: 'kt-export-lr',
  templateUrl: './export-lr.component.html',
  styleUrls: ['./export-lr.component.scss']
})
export class ExportLrComponent implements OnInit {

 
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

  
  loadRequests: any = []; // dataset
  
  select_load_code : any ; 

  dataForm: FormGroup;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  


 data1: Widget1Data[];
 data2: Widget1Data[];

 rolesList : any = [];

 load_request_data : any
 printLines:any[] = []
 user_mobile : any

 canPrint = false
 initialY = 60

 domain: any;

  
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private loadRequestService: LoadRequestService,
      private userMobileService: UsersMobileService,
      private fb: FormBuilder,
     
  ) {
      
  }

  ngOnInit(): void {
    this.createForm()
    this.initData()
    this.prepareGrid()
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
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
                    collection: [{value:"0",label:"0 Créée"},{value:"10",label:"10 Validée"},{value:"20",label:"20 Chargée"},{value:"40",label:"40 Transferet"},{value:"50",label:"50 Acceptée"}],
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
              {
                id: "id",
                field: "id",
                excludeFromHeaderMenu: true,
                formatter: (row, cell, value, columnDef, dataContext) => {
                  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
                  return `
                    <a class="btn btn-sm btn-clean btn-icon mr-2" title="Export DC">
                         <i class="flaticon2-paper-plane"></i>
                         
                     </a>
                     `;
                },
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  const index = args.row;
                  this.select_load_code = this.gridService.getDataItemByRowIndex(index).load_request_code
                  this.load_request_data = this.gridService.getDataItemByRowIndex(index)
                  this.loadRequestService.ExportLoadRequest(this.select_load_code).subscribe(

                    (response: any) => {
                      console.log(response)
                    },
                    (error) => {
                      // this.loadRequestData = []
                      console.log(error)
                    },
                    () => {
                      this.layoutUtilsService.showActionNotification(
                          "Load requests exported",
                          MessageType.Create,
                          10000,
                          true,
                          true
                      )
                      this.loadingSubject.next(false)
                      
                      // this.router.navigateByUrl("/customers-mobile/cluster-create")
                  }
                  )
              
                    
                }
              },
        ]
  
        this.gridOptions = {
          enableAutoResize:true,
          autoHeight:false,
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


  
  
gridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.dataView = angularGrid.dataView;
  this.grid = angularGrid.slickGrid;
  this.gridService = angularGrid.gridService;
}

 
updateDates(){
  this.canPrint = false
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
 }


 

}
