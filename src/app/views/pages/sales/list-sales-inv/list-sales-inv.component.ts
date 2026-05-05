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

import { AccountShiper,AccountReceivable,AccountReceivableService,InvoiceOrderService,
  AccountShiperService,LocationDetail, LocationDetailService, CodeService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { L } from "@angular/cdk/keycodes"
import { replaceAll } from "chartist"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-list-sales-inv',
  templateUrl: './list-sales-inv.component.html',
  styleUrls: ['./list-sales-inv.component.scss']
})
export class ListSalesInvComponent implements OnInit {

 
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  grid: any;
  gridService: GridService;
  dataview: any;
 
  domain    : any;
  user
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;
  soForm: FormGroup;
  
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private soFB: FormBuilder,
      private layoutUtilsService: LayoutUtilsService,
      private accountshipperService: AccountShiperService,
      private locationDetailService: LocationDetailService,
      private invoiceorderservice:InvoiceOrderService,
  ) {
     
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.user =  JSON.parse(localStorage.getItem('user'))
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
    // this.prepareRoles();
    console.log(this.user)
    this.createForm();
    this.prepareGrid()
    //this.initGrid();
    this.solist();
  }
  solist() {
    this.dataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
   
    
    let obj= {date,date1}
    this.invoiceorderservice.getAllwithDetail(obj).subscribe(
      (response: any) => {   
        this.dataset = response.data
        console.log(this.dataset)
         this.dataview.setItems(this.dataset);
      
     
        
         },
      (error) => {
          this.dataset = []
      },
      () => {}
  )
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

    const controls = this.soForm.controls
   /* this.sequenceService.getBy({ seq_type: "PO", seq_profile: this.user.usrd_profile }).subscribe(
      (res: any) => {
        this.seq = res.data[0].seq_seq
        console.log(this.seq)
        controls.po_category.setValue(this.seq);
    
    })
    */

  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  
  
  prepareGrid() {

      this.columnDefinitions = [
          
          // {
          //   id: "id",
          //   field: "id",
          //   excludeFromColumnPicker: true,
          //   excludeFromGridMenu: true,
          //   excludeFromHeaderMenu: true,
    
          //   minWidth: 50,
          //   maxWidth: 50,
          // },
          {
            id: "ih_inv_nbr",
            name: "N° Facture",
            field: "ih_inv_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ih_inv_nbr',
              formatter: (g) => `N° Facture: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('montant'),
               new Aggregators.Sum('idh_qty_inv'),
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ih_inv_date",
            name: "Date Facture",
            field: "ih_inv_date",
            sortable: true,
            filterable: true,
            type: FieldType.date,
            formatter: Formatters.dateIso ,
            minWidth: 75,
            width: 120,
            exportWithFormatter: true,
            filter: {
              model: Filters.dateRange,
              operator: 'RangeInclusive',
              // override any of the Flatpickr options through "filterOptions"
              //editorOptions: { minDate: 'today' } as FlatpickrOption
            },
            grouping: {
              getter: 'ih_inv_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('montant'),
               new Aggregators.Sum('idh_qty_inv'),
               
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
          },
          {
            id: "ih_category",
            name: "Type",
            field: "ih_category",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ih_category',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('montant'),
               new Aggregators.Sum('idh_qty_inv'),
           
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          
          {
            id: "ih_bill",
            name: "Client",
            field: "ih_bill",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ih_bill',
              formatter: (g) => `Facturé à: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('montant'),
               new Aggregators.Sum('idh_qty_inv'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "ad_name",
            name: "Nom Client",
            field: "ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
                    
          {
            id: "idh_part",
            name: "Code Produit",
            field: "idh_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ish_part',
              formatter: (g) => `Code Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('montant'),
               new Aggregators.Sum('idh_qty_inv'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "pt_desc1",
            name: "Désignation",
            field: "pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'pt_desc1',
              formatter: (g) => `Désignation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('montant'),
               new Aggregators.Sum('idh_qty_inv'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          
          {
            id: "idh_price",
            name: "Prix UN",
            field: "idh_price",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive},
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            
          },
          {
            id: "idh_qty_inv",
            name: "Quantité",
            field: "idh_qty_inv",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive},
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            
            
          },
          {
            id: "montant",
            name: "Montant HT",
            field: "montant",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive},
            formatter: Formatters.decimal,
            params: { minDecimal: 2, maxDecimal: 2 }, 
            
          },
         
          

      ]

      this.gridOptions = {
         /* autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },*/
          enableDraggableGrouping: true,
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize: true,
          exportOptions: {
            sanitizeDataExport: true
          },
          formatterOptions: {
        
            // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
            displayNegativeNumberWithParentheses: true,
      
            // Defaults to undefined, minimum number of decimals
            minDecimal: 2,
      
            // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
            thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
          },
         /* presets: {
            sorters: [
              { columnId: 'prh_line', direction: 'ASC' }
            ],
          },*/
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
      this.dataset = []
      
      
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
      this.dataviewObj.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataviewObj.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }

   
    printpdf() {

      console.log(this.dataview.getFilteredItems())
      const data = this.dataview.getFilteredItems()
      const controls = this.soForm.controls;
      
      const date = controls.calc_date.value
        ? `${String("0" + controls.calc_date.value.day).slice(-2)}-${String("0" + controls.calc_date.value.month).slice(-2)}-${controls.calc_date.value.year}`
        : null;
       const date1 = controls.calc_date1.value
        ? `${String("0" + controls.calc_date1.value.day).slice(-2)}-${String("0" + controls.calc_date1.value.month).slice(-2)}-${controls.calc_date1.value.year}`
        : null;
      console.log("pdf");
      var doc = new jsPDF({orientation:'l'});
  
      // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
      var img = new Image();
      img.src = "./assets/media/logos/companylogo.png";
      doc.addImage(img, "png", 240, 2, 50, 30);
      doc.setFontSize(9);
      if (this.domain.dom_name != null) {
        doc.text(this.domain.dom_name, 10, 10);
      }

      // fill the dataset with your data
    
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
      doc.text("Liste des Ventes :" , 110, 40);
      doc.setFontSize(12);
      
      doc.text("Date Début : " + date, 40, 50);
      doc.text("Date Fin      : " + date1, 150, 50);
  
      doc.setFontSize(10);
      doc.line(5, 55, 290, 55);
      doc.line(5, 55, 290, 55);
      doc.line(5, 55, 290, 55);
      doc.line(5, 60, 290, 60);
      doc.line(5, 55, 5, 60);
      doc.text("Date", 7.5, 58.5);
      doc.line(27, 55, 27, 60);
      doc.text("N° Facture", 29, 58.5);
      doc.line(54, 55, 54, 60);
      doc.text("Code Client", 56, 58.5);
      doc.line(80, 55, 80, 60);
      doc.text("Nom Client", 82, 58.5);
      doc.line(145, 55, 145, 60);
      doc.text("Code ", 147, 58.5);
      doc.line(165, 55, 165, 60);
      doc.text("Désignation", 167, 58.5);
      doc.line(225, 55, 225, 60);
      doc.text("Quantité", 227, 58.5);
      doc.line(245, 55, 245, 60);
      doc.text("Prix UN", 247, 58.5);
      doc.line(265, 55, 265, 60); 
      doc.text("Montant TTC", 267, 58.5);
      doc.line(290, 55, 290, 60);  
     
      var i = 65;
      doc.setFontSize(10);
      let total = 0
      let tht = 0
      let tva = 0
      let timbre = 0
      let encaisse = 0
      let credits = 0
      for (let j = 0; j < data.length; j++) {
        console.log(data[j].ih_inv_nbr)
        let mts =  String(  Number(data[j].montant).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     //   console.log(mts)
        let mnt = replaceAll(mts,","," ")
        
        let pri =  String(  Number(data[j].idh_price).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     //   console.log(mts)
        let price = replaceAll(pri,","," ")

    
       // console.log(mnsolde)
        if (j % 29 == 0 && j != 0) {
          doc.addPage();
          // img.src = "./assets/media/logos/companylogo.png";
          doc.addImage(img, "png", 240, 2, 50, 30);
          doc.setFontSize(10);
          if (this.domain.dom_name != null) {
            doc.text(this.domain.dom_name, 10, 10);
          }
          if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
          if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
          if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
          doc.setFontSize(14);
          doc.text("Liste des Ventes :" , 110, 40);
          doc.setFontSize(12);
          
          doc.text("Date Début : " + date, 40, 50);
          doc.text("Date Fin      : " + date1, 150, 50);
        
          
          doc.setFontSize(10);
          doc.line(5, 55, 290, 55);
          doc.line(5, 55, 290, 55);
          doc.line(5, 55, 290, 55);
          doc.line(5, 60, 290, 60);
          doc.line(5, 55, 5, 60);
          doc.text("Date", 7.5, 58.5);
          doc.line(27, 55, 27, 60);
          doc.text("N° Facture", 29, 58.5);
          doc.line(54, 55, 54, 60);
          doc.text("Code Client", 56, 58.5);
          doc.line(80, 55, 80, 60);
          doc.text("Nom Client", 82, 58.5);
          doc.line(145, 55, 145, 60);
          doc.text("Code ", 147, 58.5);
          doc.line(165, 55, 165, 60);
          doc.text("Désignation", 167, 58.5);
          doc.line(225, 55, 225, 60);
          doc.text("Quantité", 227, 58.5);
          doc.line(245, 55, 245, 60);
          doc.text("Prix UN", 247, 58.5);
          doc.line(265, 55, 265, 60); 
          doc.text("Montant TTC", 267, 58.5);
          doc.line(290, 55, 290, 60);  
         
                              
          i = 65;
          doc.setFontSize(10);
        }
  
       
          doc.line(5, i - 5, 5, i);
          doc.text(data[j].ih_inv_date, 7, i - 1);
          doc.line(27, i - 5, 27, i);
          doc.text(data[j].ih_inv_nbr, 29, i - 1);
          doc.line(54, i - 5, 54, i);
          doc.text(data[j].ih_bill, 56, i - 1);
          doc.line(80, i - 5, 80, i);
          doc.text(String(data[j].ad_name), 82, i - 1);
          doc.line(145, i - 5, 145, i);
          doc.text(data[j].idh_part, 147, i - 1);
          doc.line(165, i - 5, 165, i);
          doc.text(data[j].pt_desc1, 167, i - 1);
          doc.line(225, i - 5, 225, i);
          doc.text(data[j].idh_qty_inv, 243, i - 1,{ align: "right" });
          doc.line(245, i - 5, 245, i);
          doc.text(price, 263, i - 1,{ align: "right" });
          doc.line(265, i - 5, 265, i);
          doc.text(mnt, 288, i - 1,{ align: "right" });
          doc.line(290, i - 5, 290, i);

          i = i + 5;
          total = total + Number(data[j].montant)
    
         }
                 doc.line(5, i - 5, 290, i - 5);
  
        //  doc.line(30, i-5, 110, i-5);
  
         let tt =  String(  Number(total).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let ttc = replaceAll(tt,","," ")
       
         doc.line(165, i - 5, 165, i);
         
          // doc.line(40, i - 5, 40, i);
          doc.text("Totaux", 223, i - 1,{ align: "right" });
          doc.line(225, i - 5, 225, i);
          doc.text(ttc, 288, i - 1,{ align: "right" });
          doc.line(290, i - 5, 290, i);
          doc.line(165, i, 290, i);
          i = i + 5;
  
  
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    }
  
}

