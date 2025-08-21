import { Component, OnInit } from "@angular/core";
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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  SiteService,
  MobileSettingsService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
const API_URL = environment.apiUrl + "/roles"
const API_URL_codes = environment.apiUrl + "/codes"

import { replaceAll } from "chartist"
@Component({
  selector: 'kt-list-roles-sales',
  templateUrl: './list-roles-sales.component.html',
  styleUrls: ['./list-roles-sales.component.scss']
})
export class ListRolesSalesComponent implements OnInit {

 
 
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
  // grid options

  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  
  // angularGrid: AngularGridInstance;
  // grid: any;
  // gridService: GridService;
  // dataView: any;
  // columnDefinitions: Column[];
  // gridOptions: GridOption;
  // dataset: any[];

  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  
  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;
  
  seq;
  user;
  row_number;
  message = "";
  requistionServer;
  vpServer;
  provider;
  curr
  details : any [];
  datasetPrint = [];
  date: String;
  po_cr_terms: any[] = [];
  invid : any;
  domain:any;

  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,
    private mobileSettingsService: MobileSettingsService,
  ) {
    config.autoClose = true;
    
    
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.user)
    this.createForm();
    this.initmvGrid();
    //this.initGrid();
   this.solist()
   
  }

  
 
  initmvGrid() {
    this.mvcolumnDefinitions = [
  /*    {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.mvangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },*/
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   excludeFromHeaderMenu: true,
      
      //   minWidth: 30,
      //   maxWidth: 30,
        
      // },
     
      {
        id: "role_code",
        name: "Code Role",
        field: "role_code",
        sortable: true,
        minWidth:50,
        maxWidth: 80,
        filterable: true,
        type: FieldType.text,
        filter: {

         
          // collectionAsync: this.elem,
          collectionAsync:  this.http.get(`${API_URL}/findrolefilter`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       
          model: Filters.multipleSelect,

          // you can add "multiple-select" plugin options like styling the first row
          // filterOptions: {
          //    offsetLeft: 20,
          //    width: 100
          // } as MultipleSelectOption,
   
          // you can also add an optional placeholder
          placeholder: 'Choisir un Role '
         
          //  model: Filters.multipleSelect,
          
         },
      
      }, 
      {
        id: "role_name",
        name: "Nom",
        field: "role_name",
        sortable: true,
        width: 100,
        filterable: true,
        type: FieldType.text,
        
              
      }, 
      {
        id: "pt_part_type",
        name: "Type Produit ",
        field: "pt_part_type",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        // filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        filter: {

         
          // collectionAsync: this.elem,
          collectionAsync:  this.http.get(`${API_URL_codes}/parttypes`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       
         
         
           model: Filters.multipleSelect,
          
         },
      
      
      }, 
      {
        id: "product_code",
        name: "Code Produit ",
        field: "product_code",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
      
      }, 
      {
        id: "pt_desc1",
        name: "Designation ",
        field: "pt_desc1",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
      
      }, 
      {
        id: "quantity",
        name: "QTE",
        field: "quantity",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        params: { minDecimal: 2, maxDecimal: 2 }, 
        headerCssClass: 'text-right',
        cssClass: 'text-right'

      },
     
      {
        id: "price",
        name: "Montant",
        field: "price",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
        headerCssClass: 'text-right',
        cssClass: 'text-right',
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 

      },

    ];

    this.mvgridOptions = {
    
      enableFiltering: true,
      enableAutoResize: true,
      enableSorting: true,
      enableExcelExport:true,
      enableExcelCopyBuffer: true,
        exportOptions: {
          sanitizeDataExport: true
        },
       
        excelExportOptions: {
          filename: 'Liste des Vente Par Role',
          sanitizeDataExport: true,
         
          columnHeaderStyle: {
            font: { color: 'FFFFFFFF' },
            fill: { type: 'pattern', patternType: 'solid', fgColor: 'FF4a6c91' }
          }
        },
        
        
        //enableRowSelection: true,
      //   enableCellNavigation: true,
      //   enableCheckboxSelector: true,
      //   checkboxSelector: {
      //     // optionally change the column index position of the icon (defaults to 0)
      //     // columnIndexPosition: 1,
  
      //     // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //     hideSelectAllCheckbox: true,
  
      //     // you can override the logic for showing (or not) the expand icon
      //     // for example, display the expand icon only on every 2nd row
      //     // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      //   },
      //  // multiSelect: false,
      //   rowSelectionOptions: {
      //     // True (Single Selection), False (Multiple Selections)
      //     selectActiveRow: true,
      //   },
       
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: true,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
          maxDecimal:2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
      
       

    }
    this.mvdataset = [];
    
  //   console.log(this.user)
  //   const controls = this.soForm.controls
  //   const date = controls.calc_date.value
  //   ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
  //   : null;
  
  //   const date1 = controls.calc_date1.value
  //   ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
  //   : null;
  //   console.log(date,controls.calc_date.value,date1)
   
  //   let obj= {date,date1}
  //   this.mobileSettingsService.getRolesSales(obj).subscribe(
  //     (response: any) => {   
  //       this.mvdataset = response.data
  //      console.log(this.mvdataset)
  //      this.mvdataView.setItems(this.mvdataset);
        
  //        },
  //     (error) => {
  //         this.mvdataset = []
  //     },
  //     () => {}
  // )
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
    this.mobileSettingsService.getRolesSales(obj).subscribe(
      (response: any) => {   
        this.mvdataset = response.data
       console.log(this.mvdataset)
     //  this.mvdataView.setItems(this.mvdataset);
        
         },
      (error) => {
          this.mvdataset = []
      },
      () => {}
  )
  }
  
 
  //create form
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

  onFilterChanged() {
    const filtered = this.mvdataView.getFilteredItems();
    console.log(filtered)
return filtered
  }

  printpdf() {
   
this.onFilterChanged() 

    const controls = this.soForm.controls;
    
    const date = controls.calc_date.value
  ? `${String("0" + controls.calc_date.value.day).slice(-2)}-${String("0" + controls.calc_date.value.month).slice(-2)}-${controls.calc_date.value.year}`
  : null;
  const date1 = controls.calc_date1.value
  ? `${String("0" + controls.calc_date1.value.day).slice(-2)}-${String("0" + controls.calc_date1.value.month).slice(-2)}-${controls.calc_date1.value.year}`
  : null;
    console.log("pdf",this.mvdataset);
    var doc = new jsPDF();

    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 160, 5, 50, 30);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);
    doc.text("Transaction de Caisse   " , 70, 40);
    doc.setFontSize(12);
    
    doc.text("Date Début : " + date, 20, 60);
    doc.text("Date Fin      : " + date1, 20, 65);
    
    doc.setFontSize(10);
    doc.line(30, 85, 110, 85);
    doc.line(30, 85, 110, 85);
    doc.line(30, 90, 110, 90);
    doc.line(30, 85, 30, 90);
    doc.text("LN", 32.5, 88.5);
    doc.line(40, 85, 40, 90);
    doc.text("Role", 42, 88.5);
    doc.line(70, 85, 70, 90);
    doc.text("Montant", 72, 88.5);
    doc.line(110, 85, 110, 90);
   
    var i = 95;
    doc.setFontSize(10);
    let total = 0
    for (let j = 0; j < this.mvdataset.length; j++) {
      let mts =  String(  Number(this.mvdataset[j].Montant).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
   //   console.log(mts)
      let mnt = replaceAll(mts,","," ")
     // console.log(mnsolde)
      if (j % 38 == 0 && j != 0) {
        doc.addPage();
        // img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 160, 5, 50, 30);
        doc.setFontSize(10);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.text("Transaction de Caisse   " , 70, 40);
        doc.setFontSize(12);
        
        doc.text("Date Début : " + date, 20, 60);
        doc.text("Date Fin      : " + date1, 20, 65);
        
        doc.setFontSize(10);
        doc.line(30, 85, 110, 85);
        doc.line(30, 85, 110, 85);
        doc.line(30, 90, 110, 90);
        doc.line(30, 85, 30, 90);
        doc.text("LN", 32.5, 88.5);
        doc.line(40, 85, 40, 90);
        doc.text("Role", 42, 88.5);
        doc.line(70, 85, 70, 90);
        doc.text("Montant", 72, 88.5);
        doc.line(110, 85, 110, 90);
       
        i = 95;
        doc.setFontSize(10);
      }

     
        doc.line(30, i - 5, 30, i);
        doc.text(String("00" + j).slice(-2), 32.5, i - 1);
        doc.line(40, i - 5, 40, i);
        doc.text(this.mvdataset[j].chr01, 45, i - 1);
        doc.line(70, i - 5, 70, i);
        doc.text(mnt, 108, i - 1,{ align: "right" });
        doc.line(110, i - 5, 110, i);
      //   doc.text(String(this.data[j].bkh_addr), 72, i - 1);
      //   doc.line(95, i - 5, 95, i);
      //  if(this.data[j].chr01 != null) { doc.text(this.data[j].chr01, 97, i - 1);} else {doc.text(this.data[j].bkh_addr, 97, i - 1)}
      //   doc.line(120, i - 5, 120, i);
      //   doc.text(String((this.data[j].bkh_type)), 122, i - 1 );
      //   doc.line(130, i - 5, 130, i);
      //   doc.text(String(this.data[j].bkh_effdate) , 153, i - 1, { align: "right" });
      //   doc.line(155, i - 5, 155, i);
      //   doc.text(String(Number(this.data[j].bkh_balance).toFixed(2)) , 178, i - 1,{ align: "right" });
      //   doc.line(180, i - 5, 180, i);
      //   doc.text(String(Number(this.data[j].bkh_amt).toFixed(2)), 203, i - 1, { align: "right" });
      //   doc.line(205, i - 5, 205, i);
         
        i = i + 5;
        total = total + Number(this.mvdataset[j].Montant)
       }
       doc.line(30, i-5, 110, i-5);
       

       let tt =  String(  Number(total).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
   //   console.log(mts)
      let ttc = replaceAll(tt,","," ")

       doc.line(30, i - 5, 30, i);
       
        doc.line(40, i - 5, 40, i);
        doc.text("Total", 45, i - 1);
        doc.line(70, i - 5, 70, i);
        doc.text(ttc, 108, i - 1,{ align: "right" });
        doc.line(110, i - 5, 110, i);
        doc.line(30, i, 110, i);
        i = i + 5;

    // doc.line(10, i - 5, 200, i - 5);

    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }

}
