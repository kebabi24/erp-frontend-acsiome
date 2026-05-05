
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
  selector: 'kt-list-invoices-detail',
  templateUrl: './list-invoices-detail.component.html',
  styleUrls: ['./list-invoices-detail.component.scss']
})


export class ListInvoicesDetailComponent implements OnInit {

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
    this.invoiceorderservice.getByBetween(obj).subscribe(
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
               new Aggregators.Sum('ih_tot_amt'),
               new Aggregators.Sum('ih_amt'),
               new Aggregators.Sum('ih_tax_amt'),
               new Aggregators.Sum('ih_trl1_amt'),
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
               new Aggregators.Sum('ih_tot_amt'),
               new Aggregators.Sum('ih_amt'),
               new Aggregators.Sum('ih_tax_amt'),
               new Aggregators.Sum('ih_trl1_amt'),
               
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
               new Aggregators.Sum('ih_tot_amt'),
               new Aggregators.Sum('ih_amt'),
               new Aggregators.Sum('ih_tax_amt'),
               new Aggregators.Sum('ih_trl1_amt'),
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ih_cust",
            name: "Client",
            field: "ih_cust",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ih_cust',
              formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('ih_tot_amt'),
               new Aggregators.Sum('ih_amt'),
               new Aggregators.Sum('ih_tax_amt'),
               new Aggregators.Sum('ih_trl1_amt'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "cm_sort",
            name: "Nom Client",
            field: "customer.cm_sort",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ih_bill",
            name: "Facturé a",
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
               new Aggregators.Sum('ih_tot_amt'),
               new Aggregators.Sum('ih_amt'),
               new Aggregators.Sum('ih_tax_amt'),
               new Aggregators.Sum('ih_trl1_amt'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ih_cr_terms",
            name: "Mode Paiement",
            field: "ih_cr_terms",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'ih_cr_terms',
              formatter: (g) => `Mode paiement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('ih_tot_amt'),
               new Aggregators.Sum('ih_amt'),
               new Aggregators.Sum('ih_tax_amt'),
               new Aggregators.Sum('ih_trl1_amt'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          }, 
          {
            id: "ih_curr",
            name: "Devise",
            field: "ih_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'ih_curr',
              formatter: (g) => `Devise: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('ih_tot_amt'),
               new Aggregators.Sum('ih_amt'),
               new Aggregators.Sum('ih_tax_amt'),
               new Aggregators.Sum('ih_trl1_amt'),
               
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
         
          {
            id: "ih_tot_amt",
            name: "Montant TTC",
            field: "ih_tot_amt",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          },
          {
            id: "ih_amt",
            name: "Montant HT",
            field: "ih_amt",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          },
         
          {
            id: "ih_tax_amt",
            name: "Montant TVA",
            field: "ih_tax_amt",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          }, 
          {
            id: "ih_trl1_amt",
            name: "Timbre",
            field: "ih_trl1_amt",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
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
      doc.text("Liste des Factures    " , 110, 40);
      doc.setFontSize(12);
      
      doc.text("Date Début : " + date, 40, 50);
      doc.text("Date Fin      : " + date1, 150, 50);
  
      doc.setFontSize(10);
      doc.line(5, 55, 290, 55);
      doc.line(5, 55, 290, 55);
      doc.line(5, 55, 290, 55);
      doc.line(5, 60, 290, 60);
      doc.line(5, 55, 5, 60);
      doc.text("Code Cient", 7.5, 58.5);
      doc.line(27, 55, 27, 60);
      doc.text("Nom Client", 40, 58.5);
      doc.line(112, 55, 112, 60);
      doc.text("Date", 114, 58.5);
      doc.line(134, 55, 134, 60);
      doc.text("N° Facture", 136, 58.5);
      doc.line(160, 55, 160, 60);
      doc.text("Devise", 162, 58.5);
      doc.line(175, 55, 175, 60);
      doc.text("Montant HT", 180, 58.5);
      doc.line(205, 55, 205, 60);
      doc.text("Montant TVA", 207, 58.5);
      doc.line(230, 55, 230, 60);
      doc.text("Timbre", 235, 58.5);
      doc.line(255, 55, 255, 60); 
      doc.text("Montant TTC", 264, 58.5);
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
        let mts =  String(  Number(data[j].ih_tot_amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     //   console.log(mts)
        let mnt = replaceAll(mts,","," ")
        
  

        let mtas =  String(  Number(data[j].ih_amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     //   console.log(mts)
        let mnta = replaceAll(mtas,","," ")
       

        let mtvas =  String(  Number(data[j].ih_tax_amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     //   console.log(mts)
        let mntva = replaceAll(mtvas,","," ")
       

        let mtimbre =  String(  Number(data[j].ih_trl1_amt).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
     //   console.log(mts)
        let mntimbre = replaceAll(mtimbre,","," ")
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
          doc.text("Liste des Factures    " , 110, 40);
          doc.setFontSize(12);
          
          doc.text("Date Début : " + date, 40, 50);
          doc.text("Date Fin      : " + date1, 150, 50);
          
          doc.setFontSize(10);
          doc.line(5, 55, 290, 55);
          doc.line(5, 55, 290, 55);
          doc.line(5, 55, 290, 55);
          doc.line(5, 60, 290, 60);
          doc.line(5, 55, 5, 60);
          doc.text("Code Cient", 7.5, 58.5);
          doc.line(27, 55, 27, 60);
          doc.text("Nom Client", 40, 58.5);
          doc.line(112, 55, 112, 60);
          doc.text("Date", 114, 58.5);
          doc.line(134, 55, 134, 60);
          doc.text("N° Facture", 136, 58.5);
          doc.line(160, 55, 160, 60);
          doc.text("Devise", 162, 58.5);
          doc.line(175, 55, 175, 60);
          doc.text("Montant HT", 180, 58.5);
          doc.line(205, 55, 205, 60);
          doc.text("Montant TVA", 207, 58.5);
          doc.line(230, 55, 230, 60);
          doc.text("Timbre", 235, 58.5);
          doc.line(255, 55, 255, 60); 
          doc.text("Montant TTC", 264, 58.5);
          doc.line(290, 55, 290, 60);  
                              
          i = 65;
          doc.setFontSize(10);
        }
  
       
          doc.line(5, i - 5, 5, i);
          doc.text(data[j].ih_cust, 7, i - 1);
          doc.line(27, i - 5, 27, i);
          doc.text(data[j].customer.cm_sort, 29, i - 1);
          doc.line(112, i - 5, 112, i);
          doc.text(data[j].ih_inv_date, 114, i - 1);
          doc.line(134, i - 5, 134, i);
          doc.text(String(data[j].ih_inv_nbr), 136, i - 1);
          doc.line(160, i - 5, 160, i);
          doc.text(data[j].ih_curr, 162, i - 1);
          doc.line(175, i - 5, 175, i);
          doc.text(mnta, 203, i - 1,{ align: "right" });
          doc.line(205, i - 5, 205, i);
          doc.text(mntva, 228, i - 1,{ align: "right" });
          doc.line(230, i - 5, 230, i);
          doc.text(mntimbre, 253, i - 1,{ align: "right" });
          doc.line(255, i - 5, 255, i);
          doc.text(mnt, 288, i - 1,{ align: "right" });
          doc.line(290, i - 5, 290, i);

          i = i + 5;
          total = total + Number(data[j].ih_tot_amt)
          tht = tht + Number(data[j].ih_amt)
          tva = tva + Number(data[j].ih_tax_amt)
          timbre = timbre + Number(data[j].ih_trl1_amt)
         }
                 doc.line(5, i - 5, 290, i - 5);
  
        //  doc.line(30, i-5, 110, i-5);
  
         let tt =  String(  Number(total).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let ttc = replaceAll(tt,","," ")
        let th =  String(  Number(tht).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let thtc = replaceAll(th,","," ")
         
        let tv =  String(  Number(tva).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let tvac = replaceAll(tv,","," ")
        let tim =  String(  Number(timbre).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))
        let timbrec = replaceAll(tim,","," ")
         doc.line(134, i - 5, 134, i);
         
          // doc.line(40, i - 5, 40, i);
          doc.text("Totaux", 173, i - 1,{ align: "right" });
          doc.line(175, i - 5, 175, i);
          doc.text(thtc, 203, i - 1,{ align: "right" });
          doc.line(205, i - 5, 205, i);
          doc.text(tvac, 228, i - 1,{ align: "right" });
          doc.line(230, i - 5, 230, i);
          doc.text(timbrec, 253, i - 1,{ align: "right" });
          doc.line(255, i - 5, 255, i);
          doc.text(ttc, 288, i - 1,{ align: "right" });
          doc.line(290, i - 5, 290, i);
          doc.line(134, i, 290, i);
          i = i + 5;
  
  
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    }
  
}

