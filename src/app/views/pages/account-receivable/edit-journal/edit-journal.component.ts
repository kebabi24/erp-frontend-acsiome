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
  CustomerService,
  AccountReceivableService,
} from "../../../../core/erp";
import { round } from 'lodash';

import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import thId from "src/assets/plugins/formvalidation/src/js/validators/id/thId";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { jsPDF } from "jspdf";
import { replace } from "lodash";
import { replaceAll } from "chartist";

@Component({
  selector: 'kt-edit-journal',
  templateUrl: './edit-journal.component.html',
  styleUrls: ['./edit-journal.component.scss']
})
export class EditJournalComponent implements OnInit {

 
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

  
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  
  
  customers: [];
  columnDefinitionscust: Column[] = [];
  gridOptionscust: GridOption = {};
  gridObjcust: any;
  angularGridcust: AngularGridInstance;
  
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
  domain: any
  name: any
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
    private customerService: CustomerService,
    private accountReceivableService: AccountReceivableService,
  ) {
    config.autoClose = true;
    
  
  }

  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  GridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    
    this.createForm();
    this.initmvGrid();
    //this.initGrid();
    this.solist();
   
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
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
      
        minWidth: 30,
        maxWidth: 30,
        
      },
      {
        id: "nbr",
        name: "N° Piéce",
        field: "nbr",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'nbr',
          formatter: (g) => `N°: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('debit'),
            new Aggregators.Sum('credit'),
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      }, 
      {
        id: "po",
        name: "Observation",
        field: "po",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
       

      }, 
      {
        id: "date",
        name: "Date effet",
        field: "date",
        sortable: true,
        width: 50,
        type: FieldType.date,
        filterable: true,
        filter: {
          model: Filters.dateRange,
          operator: 'RangeInclusive',
          // override any of the Flatpickr options through "filterOptions"
          //editorOptions: { minDate: 'today' } as FlatpickrOption
        },
        grouping: {
          getter: 'date',
          formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('debit'),
          new Aggregators.Sum('credit'),  
          
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "type",
        name: "Type",
        field: "type",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {
          collection: [  { value: 'I', label: 'I' }, { value: 'P', label: 'P' } ],
          model: Filters.multipleSelect,
   
          // you can add "multiple-select" plugin options like styling the first row
          filterOptions: {
             offsetLeft: 14,
             width: 100
          } as MultipleSelectOption,
   
          // you can also add an optional placeholder
          placeholder: 'choose an option'
      },
        grouping: {
          getter: 'type',
          formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('debit'),  
          new Aggregators.Sum('credit'),  
          
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      {
        id: "debit",
        name: "Débit ",
        field: "debit",
        sortable: true,
        width: 50,
        filterable: true,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        headerCssClass: 'text-right',
        cssClass: 'text-right'
      
      },
      {
        id: "credit",
        name: "Crédit ",
        field: "credit",
        sortable: true,
        width: 50,
        filterable: true,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        headerCssClass: 'text-right',
        cssClass: 'text-right'
      },
      {
        id: "solde",
        name: "Solde ",
        field: "solde",
        sortable: true,
        width: 50,
        filterable: true,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        formatter: Formatters.decimal,
        params: { minDecimal: 2, maxDecimal: 2 }, 
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        headerCssClass: 'text-right',
        cssClass: 'text-right'

      },
      
    ];

    this.mvgridOptions = {
      enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableAutoResize: true,
        enableSorting: true,
        enableExcelExport:true,
        enableExcelCopyBuffer: true,
        exportOptions: {
          sanitizeDataExport: true
        },
       
        //enableRowSelection: true,
        enableCellNavigation: true,
       
        formatterOptions: {
        
          // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
          displayNegativeNumberWithParentheses: false,
    
          // Defaults to undefined, minimum number of decimals
          minDecimal:2,
          maxDecimal:2,
    
          // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
          thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        },
         presets: {
            sorters: [
              { columnId: 'ar_effdate', direction: 'ASC' }
            ],
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
  solist() {
    this.mvdataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    const cust = controls.cust.value
    let obj= {date,date1,cust}
    this.accountReceivableService.getByRange(obj).subscribe(
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
  onChangecust() {
    const controls = this.soForm.controls;
    const cm_addr = controls.cust.value;
    
   
    this.customerService.getBy({ cm_addr:cm_addr }).subscribe(
      (res: any) => {
  
        if (!res.data) {
        
            alert("client n'existe pas  ")
            controls.cust.setValue(null);
            document.getElementById("cust").focus();
          } 
          
      
      });
   
  }
  
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     cust:[null,Validators.required],
     
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
  
   
  handleSelectedRowsChangedcust(e, args) {
    const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.gridObjcust) {
      args.rows.map((idx) => {
        const item = this.gridObjcust.getDataItem(idx);
        console.log(item);
        
       controls.cust.setValue(item.cm_addr);
       this.name = item.address.ad_name
        
    
     
  });

    }
  }
  angularGridReadycust(angularGrid: AngularGridInstance) {
    this.angularGridcust = angularGrid;
    this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridcust() {
    this.columnDefinitionscust = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "cm_addr",
        name: "Code Client",
        field: "cm_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "address.ad_name",
        name: "Nom",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionscust = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelExport:true,
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
    // fill the dataset with your data
    this.customerService
      .getAll()
      .subscribe((response: any) => (this.customers = response.data));
  }
  opencust(content) {
    this.prepareGridcust();
    this.modalService.open(content, { size: "lg" });
  }

  printpdf() {
     
        let bool = true
    const controls = this.soForm.controls
    console.log("pdf");
    var doc = new jsPDF({orientation:'l'});
    const date = controls.calc_date.value
    ? `${String("0" + controls.calc_date.value.day).slice(-2)}-${String("0" + controls.calc_date.value.month).slice(-2)}-${controls.calc_date.value.year}`
    : null;
    const date1 = controls.calc_date1.value
    ? `${String("0" + controls.calc_date1.value.day).slice(-2)}-${String("0" + controls.calc_date1.value.month).slice(-2)}-${controls.calc_date1.value.year}`
    : null;
console.log("date",date1)
    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 250, 5, 50, 30);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);
    doc.text("Journal Client " + controls.cust.value + ' Du :' + date + ' A :' + date1  , 70, 40);
    doc.setFontSize(12);
    
    
    doc.setFontSize(10);
    doc.line(5, 55, 290, 55);
    doc.line(5, 60, 290, 60);
    
    doc.line(5, 55, 5, 60);
    doc.text("Code Client", 10, 58.5);
    doc.line(30, 55, 30, 60);
    doc.text("Nom Client", 42, 58.5);
    doc.line(75, 55, 75, 60);
    doc.text("N° Piéce", 90, 58.5);
    doc.line(115, 55, 115, 60);
    doc.text("Date", 117, 58.5);
    doc.line(140, 55, 140, 60);
    
    doc.text("Observation", 152, 58.5);
    doc.line(188, 55, 188, 60);
    doc.text("Type", 190, 58.5);
    doc.line(200, 55, 200, 60);
    doc.text("Débit", 210, 58.5);
    doc.line(230, 55, 230, 60);
    doc.text("Crédit", 240, 58.5);
    doc.line(260, 55, 260, 60);
    doc.text("Solde", 270, 58.5);
    doc.line(290, 55, 290, 60);
   
    var i = 65;
    doc.setFontSize(10);
    let totaldebit = 0
    let totalcredit = 0
    for (let j = 0; j < this.mvdataset.length; j++) {
      totaldebit  = totaldebit + Number(this.mvdataset[j].debit)
      totalcredit = totalcredit + Number(this.mvdataset[j].credit)
      
      let deb =  String(  Number(this.mvdataset[j].debit).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
      
     let  mndeb = replaceAll(deb,","," ")
    // } else { mndeb = "0.00"}
    // if(this.mvdataset[j].credit != null) {
      let montantcredit = 0 
      if(Number(this.mvdataset[j].credit) != 0) { montantcredit = Number( Number(-1 ) * Number(this.mvdataset[j].credit))} else { montantcredit = 0}
      console.log(montantcredit)
    let  cre =  String( montantcredit.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
      
     let mncre = replaceAll(cre,","," ")
    // } else {
    //   mncre = "0.00"
    // }
      let sol =  String(  Number(this.mvdataset[j].solde).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
      
      let mnsol = replaceAll(sol,","," ")
      if (j % 27 == 0 && j != 0) {
        bool = true
        doc.addPage();

        // img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 250, 5, 50, 30);
        doc.setFontSize(10);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.text("Journal Client " + controls.cust.value + ' Du :' + date + ' A :' + date1  , 70, 40);
        doc.setFontSize(12);
        
        
        doc.setFontSize(10);
        doc.line(5, 55, 290, 55);
        doc.line(5, 60, 290, 60);
        
        doc.line(5, 55, 5, 60);
        doc.text("Code Client", 10, 58.5);
        doc.line(30, 55, 30, 60);
        doc.text("Nom Client", 42, 58.5);
        doc.line(75, 55, 75, 60);
        doc.text("N° Piéce", 90, 58.5);
        doc.line(115, 55, 115, 60);
        doc.text("Date", 117, 58.5);
        doc.line(140, 55, 140, 60);
        
        doc.text("Observation", 152, 58.5);
        doc.line(188, 55, 188, 60);
        doc.text("Type", 190, 58.5);
        doc.line(200, 55, 200, 60);
        doc.text("Débit", 210, 58.5);
        doc.line(230, 55, 230, 60);
        doc.text("Crédit", 240, 58.5);
        doc.line(260, 55, 260, 60);
        doc.text("Solde", 270, 58.5);
        doc.line(290, 55, 290, 60);
       
        var i = 65;
        doc.setFontSize(9);
      }

     
         doc.line(5, i - 5, 5, i);
        // doc.line(20, i - 5, 20, i);
       if (bool) { doc.text(controls.cust.value, 7.5, i - 1);
        doc.line(30, i - 5, 30, i);
        doc.text(this.name, 32, i - 1); }
        bool = false
         doc.line(75, i - 5, 75, i);
        doc.text(String(this.mvdataset[j].nbr) , 77, i - 1);
        doc.line(115, i - 5, 115, i);
       if(this.mvdataset[j].date != null) doc.text(String(this.mvdataset[j].date) , 117, i - 1);
       doc.line(140, i - 5, 140, i);
        if (this.mvdataset[j].po != null) doc.text(String(this.mvdataset[j].po) , 142, i - 1);
        doc.line(188, i - 5, 188, i);
        if (this.mvdataset[j].type != null) doc.text(String(this.mvdataset[j].type) , 193, i - 1);
        doc.line(200, i - 5, 200, i);


       if(this.mvdataset[j].debit != null) doc.text(mndeb , 228, i - 1,{ align: "right" });
       doc.line(230, i - 5, 230, i);
       if(this.mvdataset[j].credit != null) doc.text(mncre , 258, i - 1,{ align: "right" });
       doc.line(260, i - 5, 260, i);
       if(this.mvdataset[j].solde != null) doc.text(mnsol , 288, i - 1,{ align: "right" });
         doc.line(290, i - 5, 290, i);
        // doc.line(10, i , 205, i);
         
        i = i + 5;
        // total = total + Number(this.dataset[j].cm_balance)
       }
       doc.line(5, i-5, 290, i-5);
       
      

      

       doc.line(50, i - 5, 50, i);
      
       let nbm =   Number(totaldebit)
       console.log(nbm)
        doc.text("Totaux", 52, i - 1);
        // doc.line(110, i - 5, 110, i);
        // doc.text(String(Number(totalqty).toFixed(2)), 148, i - 1,{ align: "right" });
        doc.line(200, i - 5, 200, i);
        let nb =  String(nbm.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     let tnb = replaceAll(nb,","," ")
        doc.text(tnb, 228, i - 1,{ align: "right" });
        doc.line(230, i - 5, 230, i);
        let nbc =   Number(totalcredit)
       console.log(nbm)
        // doc.text("Totaux", 52, i - 1);
        // doc.line(110, i - 5, 110, i);
        // doc.text(String(Number(totalqty).toFixed(2)), 148, i - 1,{ align: "right" });
        doc.line(200, i - 5, 200, i);
        let nbcr =  String(nbc.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let tnbcr = replaceAll(nbcr,","," ")
        doc.text(tnbcr, 258, i - 1,{ align: "right" });

        doc.line(260, i - 5, 260, i);
        let soli =  String(  Number(this.mvdataset[this.mvdataset.length - 1].solde).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        
        let mnsoli = replaceAll(soli,","," ")
        doc.text(mnsoli, 288, i - 1,{ align: "right" });
        doc.line(50, i, 290, i);
        doc.line(290, i - 5, 290, i);
        i = i + 5;

    // doc.line(10, i - 5, 200, i - 5);

    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
 
  }

  
 
}
