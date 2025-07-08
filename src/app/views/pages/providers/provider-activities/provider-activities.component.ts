import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
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
  FlatpickrOption,
  GridService,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
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

import {  ProviderService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { replaceAll } from "chartist"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {

  
  soForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  draggableGroupingPlugin: any;
  
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];

  draggableGroupingPluginp: any;
  
  selectedGroupingFieldsp: Array<string | GroupingGetterFunction> = ['', '', ''];
  
  
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  angularGrid2: AngularGridInstance;
  grid2: any;
  gridService2: GridService;
  dataView2: any;
  gridObj2: any;
  dataviewObj2: any;
  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}
  datasetdet: any = []; // datasetdatasetdet
  user:any;
  domain:any

  select_vend:any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
    
      private providerService: ProviderService,
      private soFB: FormBuilder,
      config: NgbDropdownConfig,
      
  ) {
      // this.prepareGrid()
      config.autoClose = true;
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
    // this.prepareRoles();
    console.log(this.user)
    this.createForm();
    this.prepareGrid();
    this.prepareGrid2()
    //this.initGrid();
    this.solist();
  }
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     
      calc_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      calc_date1: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
    });

   

  }
  
  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  prepareGrid() {

      this.mvcolumnDefinitions = [
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
            id: "vend",
            name: "Code Fournisseur",
            field: "vend",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "name",
            name: "Nom",
            field: "name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          
          },
          
          {
            id: "poamt",
            name: "Montant Commandé",
            field: "poamt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "prhamt",
            name: "Montant Réceptioné",
            field: "prhamt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "vhamt",
            name: "Montant Facturé",
            field: "vhamt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "apamt",
            name: "Montant Réglé",
            field: "apamt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          
      ]

      this.mvgridOptions = {
        // enableDraggableGrouping: true,
        // createPreHeaderPanel: true,
        // showPreHeaderPanel: true,
        // preHeaderPanelHeight: 40,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        enableFiltering: true,
        enableAutoResize: true,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
        autoHeight:false,
        checkboxSelector: {
          // optionally change the column index position of the icon (defaults to 0)
          // columnIndexPosition: 1,

          // remove the unnecessary "Select All" checkbox in header when in single selection mode
          hideSelectAllCheckbox: true,

          // you can override the logic for showing (or not) the expand icon
          // for example, display the expand icon only on every 2nd row
          // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
        //enableRowSelection: true,
        
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: false,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
   
   

      }

      // fill the dataset with your data
      this.mvdataset = []
//       this.accountPayableService.getByWithAdress({ap_type : "P"}).subscribe(
//           (response: any) => (this.dataset = response.data),
//           (error) => {
//               this.dataset = []
//           },
//           () => {}
//       )
// console.log(this.dataset)
    }
    solist() {
      this.mvdataset = []
     
      const controls = this.soForm.controls
      const date = controls.calc_date.value
      ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
      : null;
    
      const date1 = controls.calc_date1.value
      ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
      : null;
     
      
      let obj= {date,date1}
      this.providerService.getActivities(obj).subscribe(
        (response: any) => {   
          this.mvdataset = response.data
          console.log(this.mvdataset)
           this.mvdataView.setItems(this.mvdataset);
        
       
          
           },
        (error) => {
            this.mvdataset = []
        },
        () => {}
    )
    }

    onSelectedRowsChanged(e, args) {
     console.log('indexs', args.rows);
      const index = args.rows;
      this.select_vend = this.mvgridService.getDataItemByRowIndex(index).vend
      
      // this.userMobileService.getByOne({user_mobile_code :this.load_request_data.user_mobile_code }).subscribe(
  
      //   (response: any) => {
      //     this.user_mobile = response.data
      //   },)
      const controls = this.soForm.controls
      const date = controls.calc_date.value
      ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
      : null;
    
      const date1 = controls.calc_date1.value
      ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
      : null;
     const vend = this.select_vend
      let objd= {vend,date,date1}
     this.updateData(objd)
      // alert("selected vend" + this.select_vend)
     
    }

    
   
   
    updateData(objct){
      this.providerService.getActHist(objct).subscribe(
     
          (response: any) => {
           this.datasetdet = response.data
            this.dataView2.setItems(this.datasetdet)
            
           
   
           
          },
          (error) => {
              this.datasetdet = []
           
          },
          () => {}
     )
  }
  prepareGrid2() {
    this.columnDefinitions2 = [
            
              
              // {
              //     id: "line",
              //     name: "Ligne",
              //     field: "line",
              //     sortable: true,
              //     minWidth: 30,
              //     maxWidth: 30,
              //     filterable: true,
              //     type: FieldType.string, 
              // },
              {
                id: "part",
                name: "Code Article",
                field: "part",
                sortable: true,
                minWidth: 50,
                maxWidth: 150,
                filterable: true,
                type: FieldType.string, 
              },
  
  
              // 
              {
                  id: "desc",
                  name: "Designation",
                  field: "desc",
                  sortable: true,
                  minWidth: 50,
                  maxWidth: 450,
                  filterable: true,
                  type: FieldType.string, 
              },
  
  
              {
                id: "poqty",
                name: "QTE Commandée",
                field: "poqty",
                sortable: true,
               
                filterable: true,
                type: FieldType.float, 
              },
  
              {
                id: "poamt",
                name: "Montant Commandée",
                field: "poamt",
                sortable: true,
               
                filterable: true,
                type: FieldType.float, 
              },
              {
                id: "prhqty",
                name: "QTE Réceptionnée",
                field: "prhqty",
                sortable: true,
              
                filterable: true,
                type: FieldType.float, 
              },
  
              {
                id: "prhamt",
                name: "Montant Réceptionnée",
                field: "prhamt",
                sortable: true,
                
                filterable: true,
                type: FieldType.float, 
              },
              {
                id: "vhqty",
                name: "QTE Achetée",
                field: "vhqty",
                sortable: true,
                
                filterable: true,
                type: FieldType.float, 
              },
  
              {
                id: "vhamt",
                name: "Montant Achetée",
                field: "vhamt",
                sortable: true,
                
                filterable: true,
                type: FieldType.float, 
              },
  
        ]
  
        this.gridOptions2 = {
          enableAutoResize:true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          autoFitColumnsOnFirstLoad: false,
          enableAutoSizeColumns: true,
          // then enable resize by content with these 2 flags
          autosizeColumnsByCellContentOnFirstLoad: true,
          enableAutoResizeColumnsByCellContent: true,
          
          autoHeight:false,
          exportOptions: {
            sanitizeDataExport: true
          },
    
        };
  
  this.datasetdet= []
  
  
  }
  
  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.dataView2 = angularGrid.dataView;
    this.grid2 = angularGrid.slickGrid;
    this.gridService2 = angularGrid.gridService;
  }
  
}
