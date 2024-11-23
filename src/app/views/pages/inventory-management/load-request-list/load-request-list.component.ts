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

import { ItemService, LoadRequestService, UsersMobileService } from "../../../../core/erp"
import { Widget1Data } from "src/app/views/partials/content/widgets/widget1/widget1.component"
import * as _ from "lodash"
import jsPDF from "jspdf"

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
      private ItemService: ItemService,
      private fb: FormBuilder,
     
  ) {
      
  }

  ngOnInit(): void {
    this.createForm()
    this.initData()
    this.prepareGrid()
    this.prepareGrid2()
    this.prepareGrid3()
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
                    <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette">
                         <i class="flaticon2-printer"></i>
                         
                     </a>
                     `;
                },
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  const index = args.row;
                  this.select_load_code = this.gridService.getDataItemByRowIndex(index).load_request_code
                  this.load_request_data = this.gridService.getDataItemByRowIndex(index)
                  this.printpdf()
                    
                }
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
    this.canPrint = true
    this.select_load_code = this.gridService.getDataItemByRowIndex(index).load_request_code
    this.load_request_data = this.gridService.getDataItemByRowIndex(index)
    this.userMobileService.getByOne({user_mobile_code :this.load_request_data.user_mobile_code }).subscribe(

      (response: any) => {
        this.user_mobile = response.data
      },)
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
            // {
            //     id: "date_creation",
            //     name: "Date creation",
            //     field: "date_creation",
            //     sortable: true,
            //     minWidth: 100,
            //     maxWidth: 300,
            //     filterable: true,
            //     type: FieldType.date,
            // },
            // {
            //   id: "date_charge",
            //   name: "Date charge",
            //   field: "date_charge",
            //   sortable: true,
            //   minWidth: 100,
            //   maxWidth: 300,
            //   filterable: true,
            //   type: FieldType.date, 
            // },

            
            {
                id: "line",
                name: "Ligne",
                field: "line",
                sortable: true,
                minWidth: 30,
                maxWidth: 30,
                filterable: true,
                type: FieldType.string, 
            },
            {
              id: "product_code",
              name: "Code Produit",
              field: "product_code",
              sortable: true,
              minWidth: 50,
              maxWidth: 120,
              filterable: true,
              type: FieldType.string, 
            },


            // 
            {
                id: "item.pt_desc1",
                name: "Designation",
                field: "item.pt_desc1",
                sortable: true,
                minWidth: 150,
                maxWidth: 300,
                filterable: true,
                type: FieldType.string, 
            },


            {
              id: "qt_request",
              name: "QTE Demandée",
              field: "qt_request",
              sortable: true,
              minWidth: 50,
              maxWidth: 80,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "qt_validated",
              name: "QTE validée",
              field: "qt_validated",
              sortable: true,
              minWidth: 50,
              maxWidth: 80,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "qt_effected",
              name: "QTE chargée",
              field: "qt_effected",
              sortable: true,
              minWidth: 50,
              maxWidth: 80,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "pt_price",
              name: "Prix",
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
        enableAutoResizeColumnsByCellContent:true,
        enableAutoSizeColumns:true,
        dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
          var val = undefined;
          try {
            val = eval("item." + column.field);
          } catch (e) {
            // ignore
          }
          return val;
        },
  
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
         
            // {
            //     id: "line",
            //     name: "Ligne",
            //     field: "line",
            //     sortable: true,
            //     minWidth: 100,
            //     maxWidth: 300,
            //     filterable: true,
            //     type: FieldType.string, 
            // },
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
              id: "item.pt_desc1",
              name: "Designation",
              field: "item.pt_desc1",
              sortable: true,
              minWidth: 150,
              maxWidth: 300,
              filterable: true,
              type: FieldType.string, 
          },


            {
              id: "qt_effected",
              name: "Qnt Chargée",
              field: "qt_effected",
              sortable: true,
              minWidth: 100,
              maxWidth: 300,
              filterable: true,
              type: FieldType.integer, 
            },

            {
              id: "pt_price",
              name: "Prix",
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
        dataItemColumnValueExtractor: function getItemColumnValue(item, column) {
          var val = undefined;
          try {
            val = eval("item." + column.field);
          } catch (e) {
            // ignore
          }
          return val;
        },
  
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
           console.log(this.loadRequestLines)
           let i = 1 
  
           if(this.loadRequestLines.length>0){
            this.canPrint = true

            for(const line of this.loadRequestLines){
              this.ItemService.getByOne({pt_part :line.product_code }).subscribe(

                (response: any) => {
                  console.log(response)
                  this.printLines.push({...line,pt_desc1:response.data.pt_desc1})
                  i++
                },)
            }
            
          }
         },
         (error) => {
             this.loadRequestLines = []
             this.loadRequestDetails = []
         },
         () => {}
    )
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


 printpdf() {
  console.log("pdf");
  var doc = new jsPDF();
  let initialY = 65
  let valueToAddToX = 5

  var img = new Image()
  img.src = "./assets/media/logos/companylogo.png";
  doc.addImage(img, 'png', 150, 5, 50, 30)
  doc.setFontSize(9);

   if (this.domain.dom_name != null) {
     doc.text(this.domain.dom_name, 10, 10);
   }
   if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
   if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
   if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
  doc.setFontSize(14);

  doc.line(10, 35, 200, 35);
  doc.setFontSize(12);


       doc.barcode(this.select_load_code, {
        fontSize: 70,
        textColor: "#000000",
        x: 100,
        y: 60,
        textOptions: { align: "center" } // optional text options
      })

       doc.setFont("Times-Roman");
       
       

       doc.setFontSize(12);
       doc.text("Demande de chargement : " + this.select_load_code, 70, initialY+5);
      
       doc.setFontSize(10);
       doc.text("Role    : " + this.load_request_data.role_code, 20, initialY+10);
       doc.text("Date    : " + this.load_request_data.date_creation, 20, initialY+15);
       doc.text("Vendeur : " + this.user_mobile.user_mobile_code +' - '+this.user_mobile.username, 20, initialY+20); // 80
       
       
       doc.setFontSize(9);
        //  initialY+20 
        doc.line(10, initialY+25, 195, initialY+25 ); // 85
        doc.line(10, initialY+30, 195, initialY+30);  // 90
        doc.line(10, initialY+25, 10,initialY+30);  // 90 
        doc.text("N", 12.5,initialY+28.5);  // 88.5
        doc.line(20, initialY+25, 20, initialY+30);  // 90
        doc.text("Code Article", 25, initialY+28.5); // 88.5
        doc.line(45, initialY+25, 45, initialY+30); // 90
        doc.text("Désignation", 67.5, initialY+28.5); // 88.5
        doc.line(100, initialY+25, 100, initialY+30); // 90
        doc.text("Prix", 107, initialY+28.5); // 88.5
        doc.line(120, initialY+25, 120, initialY+30);  // 90
        doc.text("QTE Demandée", 123, initialY+28.5); // 88.5
        doc.line(145, initialY+25, 145, initialY+30); // 90
        doc.text("QTE Validée", 148, initialY+28.5 );// 88.5
        doc.line(170, initialY+25, 170,initialY+30);// 90
        doc.text("QTE Chargée", 173, initialY+28.5 );// 88.5
        doc.line(195, initialY+25, 195, initialY+30);// 90
        var i = 95 + valueToAddToX;
        doc.setFontSize(10);
      

   for (let j = 0; j < this.printLines.length  ; j++) {
    
    
     if ((j % 30 == 0) && (j != 0) ) {
       doc.addPage();
       img.src = "./assets/media/logos/companylogo.png";
       doc.addImage(img, 'png', 150, 5, 50, 30)
       doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
       doc.setFontSize(14);
       doc.line(10, 35, 200, 35);

       
       
       doc.setFontSize(12);
       doc.text(this.select_load_code, 70, 40);
       doc.setFontSize(8);

      
       doc.setFontSize(12);
       doc.text("Demande de chargement : " + this.select_load_code, 70, 60);
      

       doc.setFontSize(10);
       doc.text("Role    : " + this.load_request_data.role_code, 20, 70);
       doc.text("Date    : " + this.load_request_data.date_creation, 20, 75);
       doc.text("Vendeur : " + this.user_mobile.user_mobile_code +' - '+this.user_mobile.username, 20, 80);

       doc.line(10, initialY+25, 195, initialY+25 ); // 85
       doc.line(10, initialY+30, 195, initialY+30);  // 90
       doc.line(10, initialY+25, 10,initialY+30);  // 90 
       doc.text("N", 12.5,initialY+28.5);  // 88.5
       doc.line(20, initialY+25, 20, initialY+30);  // 90
       doc.text("Code Article", 25, initialY+28.5); // 88.5
       doc.line(45, initialY+25, 45, initialY+30); // 90
       doc.text("Désignation", 67.5, initialY+28.5); // 88.5
       doc.line(100, initialY+25, 100, initialY+30); // 90
       doc.text("Prix", 107, initialY+28.5); // 88.5
       doc.line(120, initialY+25, 120, initialY+30);  // 90
       doc.text("QTE Demandée", 123, initialY+28.5); // 88.5
       doc.line(145, initialY+25, 145, initialY+30); // 90
       doc.text("QTE Validée", 148, initialY+28.5 );// 88.5
       doc.line(170, initialY+25, 170,initialY+30);// 90
       doc.text("QTE Chargée", 173, initialY+28.5 );// 88.5
       doc.line(195, initialY+25, 195, initialY+30);// 90
       var i = 95 + valueToAddToX;
     }

     if (this.printLines[j].pt_desc1.length > 35) {
       doc.setFontSize(10);


        let line = this.printLines[j]

        let desc1 = line.pt_desc1.substring(0,34);
        let ind = desc1.lastIndexOf(" ");
        desc1 = line.pt_desc1.substring(0,ind);
        let desc2 = line.pt_desc1.substring(ind +1);

       
        doc.line(10, i - 5, 10, i);
        doc.text(String(line.line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(line.product_code, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(line.pt_price), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(line.qt_request), 143, i - 1 , { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(line.qt_validated), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text("", 193, i - 1, { align: "right" });
        doc.line(195, i - 5, 195, i);
        

        i = i + 5;

        doc.text(desc2, 47, i - 1);

        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(145, i - 5, 145, i);
        doc.line(170, i - 5, 170, i);
        doc.line(195, i - 5, 195, i);
  
        i = i + 5;
     } else {
        doc.setFontSize(10);
        let line = this.printLines[j]
        doc.line(10, i - 5, 10, i);
        doc.text(String(line.line), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(line.product_code, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(line.pt_desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(line.pt_price), 118, i - 1 , { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(String(line.qt_request), 143, i - 1 , { align: "right" });
        doc.line(145, i - 5, 145, i);
        doc.text(String(line.qt_validated), 168, i - 1 , { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text("", 193, i - 1 , { align: "right" });
        doc.line(195, i - 5, 195, i);
        i = i + 5;
      }
      doc.line(10, i - 5, 195, i - 5);
   }

    doc.line(10, i - 5, 195, i - 5);
  
   
  
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}

}
