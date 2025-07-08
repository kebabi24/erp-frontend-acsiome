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
  LoadRequestService,
  AccountReceivableService,
} from "../../../../core/erp";
import { round } from 'lodash';
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
const API_URL = environment.apiUrl + "/users-mobile"

import { replaceAll } from "chartist"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-list-payment',
  templateUrl: './list-payment.component.html',
  styleUrls: ['./list-payment.component.scss']
})
export class ListPaymentComponent implements OnInit {

  
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
   dataset: any[];

  
  
  
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
domain :any
roles: any[] = [];
role:any[]
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
    private accountReceivableService: AccountReceivableService
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
    // this.prepareRoles();
    console.log(this.user)
    this.createForm();
    this.initmvGrid();
    //this.initGrid();
    this.solist();
   
  }

 
  initmvGrid() {
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
          id: "ar_nbr",
          name: "N° Paiement",
          field: "ar_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ar_bill",
          name: "Client",
          field: "ar_bill",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "cm_sort",
          name: "Nom",
          field: "customer.cm_sort",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ar_curr",
          name: "Devise",
          field: "ar_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          
        }, 
        {
          id: "ar_bank",
          name: "Banque",
          field: "ar_bank",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          
        }, 
       
        {
          id: "ar_check",
          name: "N° Cheque",
          field: "ar_check",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          
        }, 
       
        {
          id: "ar_cr_terms",
          name: "Mode Paiement",
          field: "ar_cr_terms",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ar_ex_rate",
          name: "Taux Change",
          field: "ar_ex_rate",
          sortable: true,
          filterable: true,
          type: FieldType.float,
        },
        {
          id: "ar_ex_rate2",
          name: "Taux Change",
          field: "ar_ex_rate2",
          sortable: true,
          filterable: true,
          type: FieldType.float,
        },
        {
          id: "ar_amt",
          name: "Montant",
          field: "ar_amt",
          sortable: true,
          filterable: true,
          type: FieldType.float,
        },
        {
          id: "ar_applied",
          name: "Montant Applique",
          field: "ar_applied",
          sortable: true,
          filterable: true,
          type: FieldType.float,
        },
        {
          id: "ar_base_amt",
          name: "Montant Devise",
          field: "ar_base_amt",
          sortable: true,
          filterable: true,
          type: FieldType.float,
        },
        {
          id: "ar_base_applied",
          name: "Montant Applique Devise",
          field: "ar_base_applied",
          sortable: true,
          filterable: true,
          type: FieldType.float,
        },
        {
          id: "ar_open",
          name: "Ouvert",
          field: "ar_open",
          sortable: true,
          filterable: true,
          formatter: myCustomCheckboxFormatter,
        },

        

    ]

    this.mvgridOptions = {
      enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableAutoResize: true,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
       
        //enableRowSelection: true,
        enableCellNavigation: true,
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
       // multiSelect: false,
        rowSelectionOptions: {
          // True (Single Selection), False (Multiple Selections)
          selectActiveRow: true,
        },
       
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: true,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal: 2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
        gridMenu: {
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => this.onGroupChanged(args),
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      
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
    this.mvdataset = [];
    
   
  }
  // solist() {
  //   this.mvdataset = []
   
  //   const controls = this.soForm.controls
  //   const date = controls.calc_date.value
  //   ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
  //   : null;
  
  //   const date1 = controls.calc_date1.value
  //   ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
  //   : null;
  //   const site = controls.site.value
  
  //       let obj= {date,date1,site}
  //       this.mobileSettingsService.getAllCredits(obj).subscribe(
  //         (response: any) => {   
  //           this.mvdataset = response.data
  //          console.log(this.mvdataset)
  //          this.mvdataView.setItems(this.mvdataset);
            
  //            },
  //         (error) => {
  //             this.mvdataset = []
  //         },
  //         () => {}
  //     )
      
     
  // }
  
 
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

    const controls = this.soForm.controls
   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  //reste form
  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }
  clearGroupingSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
  }
  
  collapseAllGroups() {
    this.mvdataView.collapseAllGroups();
  }

  expandAllGroups() {
    this.mvdataView.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.mvgrid.invalidate(); // invalidate all rows and re-render
  }
   
  


    onGroupChangedp(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFieldsp) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsp.forEach((g, i) => this.selectedGroupingFieldsp[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelectsp();
    }
  }
  clearGroupingSelectsp() {
    this.selectedGroupingFieldsp.forEach((g, i) => this.selectedGroupingFieldsp[i] = '');
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
      this.accountReceivableService.getAllPaymentBy(obj).subscribe(
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

      // fill the dataset with your data
    
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
      doc.text("Liste des Paiements    " , 80, 40);
      doc.setFontSize(12);
      
      doc.text("Date Début : " + date, 40, 50);
      doc.text("Date Fin      : " + date1, 110, 50);
  
      doc.setFontSize(10);
      doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 60, 205, 60);
      doc.line(5, 55, 5, 60);
      doc.text("Code Cient", 7.5, 58.5);
      doc.line(27, 55, 27, 60);
      doc.text("Nom Client", 40, 58.5);
      doc.line(80, 55, 80, 60);
      doc.text("Date", 82, 58.5);
      doc.line(102, 55, 102, 60);
      doc.text("Mode Paiement", 104, 58.5);
      doc.line(130, 55, 130, 60);
      doc.text("Devise", 132, 58.5);
      doc.line(145, 55, 145, 60);
      doc.text("Montant", 160, 58.5);
      doc.line(205, 55, 205, 60);
         
     
      var i = 65;
      doc.setFontSize(10);
      let total = 0
      let encaisse = 0
      let credits = 0
      for (let j = 0; j < data.length; j++) {
        let mts =  String(  Number(0 - data[j].ar_base_amt).toLocaleString("en-US", {
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
          doc.text("Liste des Crédits    " , 80, 40);
          doc.setFontSize(12);
          
          doc.text("Date Début : " + date, 40, 50);
          doc.text("Date Fin      : " + date1, 110, 50);
        
          
          doc.setFontSize(10);
          doc.line(5, 55, 205, 55);
          doc.line(5, 55, 205, 55);
          doc.line(5, 55, 205, 55);
          doc.line(5, 60, 205, 60);
          doc.line(5, 55, 5, 60);
          doc.text("Code Cient", 7.5, 58.5);
          doc.line(27, 55, 27, 60);
          doc.text("Nom Client", 40, 58.5);
          doc.line(80, 55, 80, 60);
          doc.text("Date", 82, 58.5);
          doc.line(102, 55, 102, 60);
          doc.text("Mode Paiement", 104, 58.5);
          doc.line(130, 55, 130, 60);
          doc.text("Devise", 132, 58.5);
          doc.line(145, 55, 145, 60);
          doc.text("Montant", 160, 58.5);
          doc.line(205, 55, 205, 60);
                     
          i = 65;
          doc.setFontSize(10);
        }
  
       
          doc.line(5, i - 5, 5, i);
          doc.text(data[j].ar_bill, 7, i - 1);
          doc.line(27, i - 5, 27, i);
          doc.text(data[j].customer.cm_sort, 29, i - 1);
          doc.line(80, i - 5, 80, i);
          doc.text(data[j].ar_effdate, 82, i - 1);
          doc.line(102, i - 5, 102, i);
          doc.text(data[j].ar_cr_terms, 104, i - 1);
          doc.line(130, i - 5, 130, i);
          doc.text(data[j].ar_curr, 132, i - 1);
          doc.line(145, i - 5, 145, i);
          doc.text(mnt, 203, i - 1,{ align: "right" });
          doc.line(205, i - 5, 205, i);
          
          i = i + 5;
          total = total + Number(data[j].ar_base_amt)
         }
                 doc.line(5, i - 5, 205, i - 5);
  
        //  doc.line(30, i-5, 110, i-5);
  
         let tt =  String(  Number(0 - total).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let ttc = replaceAll(tt,","," ")
  
         
         doc.line(130, i - 5, 130, i);
         
          // doc.line(40, i - 5, 40, i);
          doc.text("Totaux", 143, i - 1,{ align: "right" });
          doc.line(145, i - 5, 145, i);
          doc.text(ttc, 203, i - 1,{ align: "right" });
          doc.line(205, i - 5, 205, i);
          doc.line(130, i, 205, i);
          i = i + 5;
  
  
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    }
  
}
