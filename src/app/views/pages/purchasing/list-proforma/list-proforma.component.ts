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

import { VoucherProformaService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { replaceAll } from "chartist"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

  import { RowDetailPreloadComponent } from "../rowDetails/row-details-preload.component";
import { RowDetailViewFpComponent } from "../rowDetails/rowdetail-views-fp.component";

@Component({
  selector: 'kt-list-proforma',
  templateUrl: './list-proforma.component.html',
  styleUrls: ['./list-proforma.component.scss']
})
export class ListProformaComponent implements OnInit {

 
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

  
  
  user:any;
  domain:any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private voucherProformaService: VoucherProformaService,
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
            id: "edit",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
            formatter: (row, cell, value, columnDef, dataContext) => {
             // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
             return `
                  <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit Proforma">
                  <i class="flaticon2-pen"></i>
              </a>
              `;
           },
            minWidth: 50,
            maxWidth: 50,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id
              console.log(this.mvdataset)
              console.log(args.dataContext.vh.vph_inv_nbr)
              this.router.navigateByUrl(`/purchasing/edit-proforma/${id}`)
              
          },
          },
          {
            id: "vh.vhp_inv_nbr",
            name: "N°Facture",
            field: "vh.vhp_inv_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vh.vhp_po_nbr",
            name: "N° BC",
            field: "vh.vhp_po_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "vh.vhp_vend",
            name: "Fournisseur",
            field: "vh.vhp_vend",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           
          },
          {
            id: "vh.address.ad_name",
            name: "Nom",
            field: "vh.address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           
          },
          {
            id: "vh.vhp_inv_date",
            name: "Date Effet",
            field: "vh.vhp_inv_date",
            sortable: true,
            filterable: true,
            type: FieldType.date,
           
          }, 
          {
            id: "vh.vhp_curr",
            name: "Devise",
            field: "vh.vhp_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          
          {
            id: "vh.vhp_shipvia",
            name: "Mode Expédition",
            field: "vh.vhp_shipvia",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "vh.vhp_cr_terms",
            name: "Mode Paiement",
            field: "vh.vhp_cr_terms",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           
          },
          {
            id: "vh.vhp_ex_rate",
            name: "Taux Change",
            field: "vh.vhp_ex_rate",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "vh.vhp_ex_rate2",
            name: "Taux Change",
            field: "vh.vhp_ex_rate2",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "vh.vhp_amt",
            name: "Montant",
            field: "vh.vhp_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
           
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "vh.vhp_tax_amt",
            name: "TVA",
            field: "vh.vhp_tax_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "vh.vhp_trl1_amt",
            name: "Timbre",
            field: "vh.vhp_trl1_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "vh.vh.dec01",
            name: "TTC",
            field: "vh.dec01",
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
        enableFiltering: true,
        enableAutoResize: true,
        enableSorting: true,
        autoHeight:false,
        exportOptions: {
          sanitizeDataExport: true
        },
        enableRowDetailView: true,
        rowSelectionOptions: {
          selectActiveRow: true,
        },
        rowDetailView: {
          // We can load the "process" asynchronously in 2 different ways (httpClient OR even Promise)
          process: (item) => {
            // console.log(this.simulateServerAsyncCall(item));
            return this.simulateServerAsyncCall(item);
          },
  
          // load only once and reuse the same item detail without calling process method
          loadOnce: true,
  
          // limit expanded row to only 1 at a time
          singleRowExpand: true,
  
          // false by default, clicking anywhere on the row will open the detail view
          // when set to false, only the "+" icon would open the row detail
          // if you use editor or cell navigation you would want this flag set to false (default)
          useRowClick: false,
  
          // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
          // also note that the detail view adds an extra 1 row for padding purposes
          // so if you choose 4 panelRows, the display will in fact use 5 rows
          panelRows: 9,
  
          // you can override the logic for showing (or not) the expand icon
          // for example, display the expand icon only on every 2nd row
          // expandableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1),
  
          // Preload View Template
           preloadComponent: RowDetailPreloadComponent,
  
          // ViewModel Template to load when row detail data is ready
          viewComponent: RowDetailViewFpComponent,
  
          // Optionally pass your Parent Component reference to your Child Component (row detail component)
          parent: this,
        },
        //enableRowSelection: true,
        enableCellNavigation: true,
        
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: false,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
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
      this.mvdataset = []
//       this.accountPayableService.getByWithAdress({vhp_type : "P"}).subscribe(
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
      this.voucherProformaService.getAllBy(obj).subscribe(
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

     
    
  
  
    simulateServerAsyncCall(item: any) {
      return new Promise((resolve) => {
        const itemDetail = item;
        resolve(itemDetail);
      });
    }
    printpdf() {

      console.log(this.mvdataView.getFilteredItems())
      const data = this.mvdataView.getFilteredItems()
      const controls = this.soForm.controls;
      
      const date = controls.calc_date.value
        ? `${String("0" + controls.calc_date.value.day).slice(-2)}-${String("0" + controls.calc_date.value.month).slice(-2)}-${controls.calc_date.value.year}`
        : null;
       const date1 = controls.calc_date1.value
        ? `${String("0" + controls.calc_date1.value.day).slice(-2)}-${String("0" + controls.calc_date1.value.month).slice(-2)}-${controls.calc_date1.value.year}`
        : null;
      console.log("pdf");
      var doc = new jsPDF({orientation:'p'});
  
      // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
      var img = new Image();
      img.src = "./assets/media/logos/companylogo.png";
      doc.addImage(img, "png", 160, 2, 50, 30);
      doc.setFontSize(9);
      if (this.domain.dom_name != null) {
        doc.text(this.domain.dom_name, 10, 10);
      }

      
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
      doc.text("Liste des Facture    " , 80, 40);
      doc.setFontSize(12);
      
      doc.text("Date Début : " + date, 40, 50);
      doc.text("Date Fin      : " + date1, 110, 50);
  
      doc.setFontSize(9);
      doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 60, 205, 60);
      doc.line(5, 55, 5, 60);
      doc.text("Code", 7.5, 58.5);
      doc.line(35, 55, 35, 60);
      doc.text("Nom ", 40, 58.5);
      doc.line(100, 55, 100, 60);
      doc.text("Date", 102, 58.5);
      doc.line(122, 55, 122, 60);
      doc.text("N° Facture", 124, 58.5);
      doc.line(150, 55, 150, 60);
      doc.text("Devise", 152, 58.5);
      doc.line(165, 55, 165, 60);
      doc.text("Montant", 167, 58.5);
      doc.line(205, 55, 205, 60);
         
     
      var i = 65;
      doc.setFontSize(10);
      let total = 0
      let encaisse = 0
      let credits = 0
      for (let j = 0; j < data.length; j++) {
        let mts =  String(  Number(data[j].vhp_base_amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     //   console.log(mts)
        let mnt = replaceAll(mts,","," ")
        
  
       // console.log(mnsolde)
        if (j % 44 == 0 && j != 0) {
          doc.addPage();
          // img.src = "./assets/media/logos/companylogo.png";
          doc.addImage(img, "png", 160, 2, 50, 30);
          doc.setFontSize(10);
          if (this.domain.dom_name != null) {
            doc.text(this.domain.dom_name, 10, 10);
          }
          if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
          if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
          if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
          doc.setFontSize(14);
          doc.text("Liste des Facture    " , 80, 40);
          doc.setFontSize(12);
          
          doc.text("Date Début : " + date, 40, 50);
          doc.text("Date Fin      : " + date1, 110, 50);
        
          
          doc.setFontSize(9);
          doc.line(5, 55, 205, 55);
          doc.line(5, 55, 205, 55);
          doc.line(5, 55, 205, 55);
          doc.line(5, 60, 205, 60);
          doc.line(5, 55, 5, 60);
          doc.text("Code", 7.5, 58.5);
          doc.line(35, 55, 35, 60);
          doc.text("Nom ", 40, 58.5);
          doc.line(100, 55, 100, 60);
          doc.text("Date", 102, 58.5);
          doc.line(122, 55, 122, 60);
          doc.text("N° Facture", 124, 58.5);
          doc.line(150, 55, 150, 60);
          doc.text("Devise", 152, 58.5);
          doc.line(165, 55, 165, 60);
          doc.text("Montant", 167, 58.5);
          doc.line(205, 55, 205, 60);
                     
          i = 65;
          doc.setFontSize(9);
        }
  
       
          doc.line(5, i - 5, 5, i);
          doc.text(data[j].vhp_vend, 7, i - 1);
          doc.line(35, i - 5, 35, i);
          doc.text(data[j].address.ad_name, 37, i - 1);
          doc.line(100, i - 5, 100, i);
          doc.text(data[j].vhp_effdate, 102, i - 1);
          doc.line(122, i - 5, 122, i);
          doc.text(data[j].vhp_po, 124, i - 1);
          doc.line(150, i - 5, 150, i);
          doc.text(data[j].vhp_curr, 152, i - 1);
          doc.line(165, i - 5, 165, i);
          doc.text(mnt, 203, i - 1,{ align: "right" });
          doc.line(205, i - 5, 205, i);
          
          i = i + 5;
          total = total + Number(data[j].vhp_base_amt)
         }
                 doc.line(5, i - 5, 205, i - 5);
  
        //  doc.line(30, i-5, 110, i-5);
  
         let tt =  String(  Number(total).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let ttc = replaceAll(tt,","," ")
  
         
         doc.line(150, i - 5, 150, i);
         
          // doc.line(40, i - 5, 40, i);
          doc.text("Totaux", 163, i - 1,{ align: "right" });
          doc.line(165, i - 5, 165, i);
          doc.text(ttc, 203, i - 1,{ align: "right" });
          doc.line(205, i - 5, 205, i);
          doc.line(150, i, 205, i);
          i = i + 5;
  
  
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    }
   
}