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

import { AccountPayableService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
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
      private accountPayableService: AccountPayableService,
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
            id: "ap_nbr",
            name: "N° Paiement",
            field: "ap_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ap_vend",
            name: "Fournisseur",
            field: "ap_vend",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
                getter: 'ap_vend',
                formatter: (g) => `Fournisseur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  new Aggregators.Sum('apamt'),  
                  new Aggregators.Sum('apapplied'),
                  new Aggregators.Sum('apbase_amt'),  
                  new Aggregators.Sum('apbase_applied'),
                      
                      
                
                ],
                  aggregateCollapsed: false,
                  collapsed: false,
              }
          },
          {
            id: "ad_name",
            name: "Nom",
            field: "address.ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'address.ad_name',
              formatter: (g) => `Nom: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('apamt'),  
                new Aggregators.Sum('apapplied'),
                new Aggregators.Sum('apbase_amt'),  
                new Aggregators.Sum('apbase_applied'),
                    
                    
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
            }
          },
          {
            id: "ap_effdate",
            name: "Date Effet",
            field: "ap_effdate",
            sortable: true,
            filterable: true,
            type: FieldType.date,
            grouping: {
              getter: 'ap_effdate',
              formatter: (g) => `Effet: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('apamt'),  
                new Aggregators.Sum('apapplied'),
                new Aggregators.Sum('apbase_amt'),  
                new Aggregators.Sum('apbase_applied'),
                    
                    
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
            }
          }, 
          {
            id: "ap_curr",
            name: "Devise",
            field: "ap_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "ap_bank",
            name: "Banque",
            field: "ap_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ap_bank',
              formatter: (g) => `Banque: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('apamt'),  
                new Aggregators.Sum('apapplied'),
                new Aggregators.Sum('apbase_amt'),  
                new Aggregators.Sum('apbase_applied'),
                    
                    
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
            }
            
          }, 
         
          {
            id: "ap_check",
            name: "N° Cheque",
            field: "ap_check",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
         
          {
            id: "ap_cr_terms",
            name: "Mode Paiement",
            field: "ap_cr_terms",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ap_cr_terms',
              formatter: (g) => `Mode Paiement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('apamt'),  
                new Aggregators.Sum('apapplied'),
                new Aggregators.Sum('apbase_amt'),  
                new Aggregators.Sum('apbase_applied'),
                    
              
              ],
                aggregateCollapsed: false,
                collapsed: false,
            }
          },
          {
            id: "ap_ex_rate",
            name: "Taux Change",
            field: "ap_ex_rate",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ap_ex_rate2",
            name: "Taux Change",
            field: "ap_ex_rate2",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "apamt",
            name: "Montant",
            field: "apamt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
           
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "apapplied",
            name: "Montant Applique",
            field: "apapplied",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "apbase_amt",
            name: "Montant Devise",
            field: "apbase_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "apbase_applied",
            name: "Montant Applique Devise",
            field: "apbase_applied",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            headerCssClass: 'text-right',
            cssClass: 'text-right'
          },
          {
            id: "ap_open",
            name: "Ouvert",
            field: "ap_open",
            sortable: true,
            filterable: true,
            filter: {
              collection: [  { value: true, label: 'OUI' }, { value: false, label: 'NON' } ],
              model: Filters.multipleSelect,
       
              // you can add "multiple-select" plugin options like styling the first row
              // previously known as `filterOptions` for < 9.0
             
              // you can also add an optional placeholder
              placeholder: 'choose an option'
          },
       
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
       autoHeight:false,
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
      this.accountPayableService.getAllPaymentBy(obj).subscribe(
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
      doc.text("Liste des Paiements    " , 80, 40);
      doc.setFontSize(12);
      
      doc.text("Date Début : " + date, 40, 50);
      doc.text("Date Fin      : " + date1, 110, 50);
  
      doc.setFontSize(9);
      doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 60, 205, 60);
      doc.line(5, 55, 5, 60);
      doc.text("Code ", 7.5, 58.5);
      doc.line(35, 55, 35, 60);
      doc.text("Nom ", 40, 58.5);
      doc.line(100, 55, 100, 60);
      doc.text("Date", 102, 58.5);
      doc.line(122, 55, 122, 60);
      doc.text("Mode Paiement", 124, 58.5);
      doc.line(150, 55, 150, 60);
      doc.text("Devise", 152, 58.5);
      doc.line(165, 55, 165, 60);
      doc.text("Montant", 170, 58.5);
      doc.line(205, 55, 205, 60);
         
     
      var i = 65;
      doc.setFontSize(10);
      let total = 0
      let encaisse = 0
      let credits = 0
      for (let j = 0; j < data.length; j++) {
        let mts =  String(  Number(0 - data[j].ap_base_amt).toLocaleString("en-US", {
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
          doc.text("Liste des Paiements    " , 80, 40);
          doc.setFontSize(12);
          
          doc.text("Date Début : " + date, 40, 50);
          doc.text("Date Fin      : " + date1, 110, 50);
        
          
          doc.setFontSize(9);
          doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 55, 205, 55);
      doc.line(5, 60, 205, 60);
      doc.line(5, 55, 5, 60);
      doc.text("Code ", 7.5, 58.5);
      doc.line(35, 55, 35, 60);
      doc.text("Nom ", 40, 58.5);
      doc.line(100, 55, 100, 60);
      doc.text("Date", 102, 58.5);
      doc.line(122, 55, 122, 60);
      doc.text("Mode Paiement", 124, 58.5);
      doc.line(150, 55, 150, 60);
      doc.text("Devise", 152, 58.5);
      doc.line(165, 55, 165, 60);
      doc.text("Montant", 170, 58.5);
      doc.line(205, 55, 205, 60);
                     
          i = 65;
          doc.setFontSize(9);
        }
  
       
          doc.line(5, i - 5, 5, i);
          doc.text(data[j].ap_vend, 7, i - 1);
          doc.line(35, i - 5, 35, i);
          doc.text(data[j].address.ad_name, 37, i - 1);
          doc.line(100, i - 5, 100, i);
          doc.text(data[j].ap_effdate, 102, i - 1);
          doc.line(122, i - 5, 122, i);
          doc.text(data[j].ap_cr_terms, 124, i - 1);
          doc.line(150, i - 5, 150, i);
          doc.text(data[j].ap_curr, 152, i - 1);
          doc.line(165, i - 5, 165, i);
          doc.text(mnt, 203, i - 1,{ align: "right" });
          doc.line(205, i - 5, 205, i);
          
          i = i + 5;
          total = total + Number(data[j].ap_base_amt)
         }
                 doc.line(5, i - 5, 205, i - 5);
  
        //  doc.line(30, i-5, 110, i-5);
  
         let tt =  String(  Number(0 - total).toLocaleString("en-US", {
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
