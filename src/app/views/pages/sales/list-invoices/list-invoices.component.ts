
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

import { AccountShiper,AccountReceivable,AccountReceivableService,
  AccountShiperService,LocationDetail, LocationDetailService, CodeService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { L } from "@angular/cdk/keycodes"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

@Component({ 
  selector: 'kt-list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})


export class ListInvoicesComponent implements OnInit {

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

  
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private accountshipperService: AccountShiperService,
      private accountreceivableService: AccountReceivableService,
      private locationDetailService: LocationDetailService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
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
            id: "ar_nbr",
            name: "Document",
            field: "ar_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ar_nbr',
              formatter: (g) => `Facture: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          // {
          //   id: "ar_ship",
          //   name: "Facture N°",
          //   field: "ar_ship",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          //   grouping: {
          //     getter: 'ar_ship',
          //     formatter: (g) => `Facture: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [
          //       // (required), what aggregators (accumulator) to use and on which field to do so
          //      // new Aggregators.Avg('ld_qty_oh'),
          //       new Aggregators.Sum('ar_amt'),
          //       new Aggregators.Sum('ar_applied')
          //     ],
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //   }
          // }, 
          {
            id: "ar_type",
            name: "type",
            field: "ar_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ar_type',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ar_cust",
            name: "Client",
            field: "ar_cust",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ar_cust',
              formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "ar_bill",
            name: "Facturé a",
            field: "ar_bill",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'ar_bill',
              formatter: (g) => `Facturé à: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "ar_bank",
            name: "Banque",
            field: "ar_bank",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'ar_bank',
              formatter: (g) => `Banque: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          }, 
          {
            id: "ar_curr",
            name: "devise",
            field: "ar_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'ar_curr',
              formatter: (g) => `Devise: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
         
          
          {
            id: "ar_amt",
            name: "Montant",
            field: "ar_amt",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          },
         
          {
            id: "ar_applied",
            name: "Montant payé",
            field: "ar_applied",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          }, 
          
           
         
          // {
          //   id: "ar_date",
          //   name: "Date Entrée",
          //   field: "ar_date",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.date,
          //   formatter: Formatters.dateIso ,
          //   minWidth: 75,
          //   width: 120,
          //   exportWithFormatter: true,
          //   filter: {
          //     model: Filters.dateRange,
          //     operator: 'RangeInclusive',
          //     // override any of the Flatpickr options through "filterOptions"
          //     //editorOptions: { minDate: 'today' } as FlatpickrOption
          //   },
          //   grouping: {
          //     getter: 'ar_date',
          //     formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [
          //       // (required), what aggregators (accumulator) to use and on which field to do so
          //      // new Aggregators.Avg('ld_qty_oh'),
          //       new Aggregators.Sum('ar_applied')
          //     ],
          //     aggregateCollapsed: true,
          //     lazyTotalsCalculation:true,
          //     collapsed:true
          //   }
          // },
          {
            id: "ar_due_date",
            name: "Date échéance",
            field: "ar_due_date",
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
              getter: 'ar_due_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
          },
          {
            id: "ar_effdate",
            name: "Date effet",
            field: "ar_effdate",
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
              getter: 'ar_effdate',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('ar_applied'),
                new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
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
      
        this.accountreceivableService
      .getBy({ })
      .subscribe(
        
          (response: any) => {this.dataset = response.data
            console.log(this.dataset)
            this.dataview.setItems(this.dataset)},
          
          (error) => {
              this.dataset = []
          },
          () => {}
          
      )
      
      
      console.log(this.dataset)
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

    printpdf(nbr) {
      // const controls = this.totForm.controls
      
      console.log("pdf");
      var doc = new jsPDF("l");
      let date = new Date()
     // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
      var img = new Image()
      img.src = "./assets/media/logos/companyentete.png";
      doc.addImage(img, 'png', 150, 5, 50, 30)
      doc.setFontSize(9);
      if (this.domain.dom_name != null) {
        doc.text(this.domain.dom_name, 10, 10);
      }
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
    
      doc.line(10, 35, 300, 35);
      doc.setFontSize(12);
      doc.text("Etat des Stocks Du: " + nbr, 100, 45);
      //doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
      doc.text("imprimé Le: " + date.toLocaleDateString() , 220, 45);
      doc.text("A: " + new Date().toLocaleTimeString(), 220, 50);
      doc.text("Edité par: " + this.user.usrd_code, 220, 55);
      
      
      doc.setFontSize(8);
      //console.log(this.provider.ad_misc2_id)
     
    
      doc.line(10, 85, 300, 85);
      doc.line(10, 90, 300, 90);
      doc.line(10, 85, 10, 90);
      doc.text("LN", 12.5, 88.5);
      doc.line(20, 85, 20, 90);
      doc.text("Code Article", 25, 88.5);
      doc.line(65, 85, 65, 90);
      doc.text("Désignation", 67.5, 88.5);
      doc.line(130, 85, 130, 90);
      doc.text("QTE", 133, 88.5);
      doc.line(140, 85, 140, 90);
      doc.text("ORIGINE", 143, 88.5);
      doc.line(170, 85, 170, 90);
      doc.text("PAR", 173, 88.5);
      doc.line(185, 85, 185, 90);
      doc.text("Lot/Série", 188, 88.5);
      doc.line(205, 85, 205, 90);
      doc.text("N PAL", 207, 88.5);
      doc.line(220, 85, 220, 90);
      doc.text("DATE", 223, 88.5);
      doc.line(235, 85, 235, 90);
      doc.text("SITE", 238, 88.5);
      doc.line(245, 85, 245, 90);
      var i = 95;
      doc.setFontSize(6);
      let total = 0
      for (let j = 0; j < this.dataset.length  ; j++) {
        total = total - Number(this.dataset[j].ld_qty_oh)
        
        if ((j % 20 == 0) && (j != 0) ) {
          doc.addPage();
          img.src = "./assets/media/logos/companyentete.png";
          doc.addImage(img, 'png', 150, 5, 50, 30)
          doc.setFontSize(9);
          if (this.domain.dom_name != null) {
            doc.text(this.domain.dom_name, 10, 10);
          }
          if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
          if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
          if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
          doc.setFontSize(14);
          doc.line(10, 35, 300, 35);
    
          doc.setFontSize(12);
          doc.text("Etat des Stocks Du: " + nbr, 100, 45);
          //doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
          doc.text("imprimé Le: " + date.toLocaleDateString() , 220, 45);
          doc.text("A: " + new Date().toLocaleTimeString(), 220, 50);
          doc.text("Edité par: " + this.user.usrd_code, 220, 55);
         
      
          doc.setFontSize(8);
          
    
          
      doc.line(10, 85, 300, 85);
      doc.line(10, 90, 300, 90);
      doc.line(10, 85, 10, 90);
      doc.text("LN", 12.5, 88.5);
      doc.line(20, 85, 20, 90);
      doc.text("Code Article", 25, 88.5);
      doc.line(65, 85, 65, 90);
      doc.text("Désignation", 67.5, 88.5);
      doc.line(130, 85, 130, 90);
      doc.text("QTE", 133, 88.5);
      doc.line(140, 85, 140, 90);
      doc.text("ORIGINE", 143, 88.5);
      doc.line(170, 85, 170, 90);
      doc.text("PAR", 173, 88.5);
      doc.line(185, 85, 185, 90);
      doc.text("Lot/Série", 188, 88.5);
      doc.line(205, 85, 205, 90);
      doc.text("N PAL", 207, 88.5);
      doc.line(220, 85, 220, 90);
      doc.text("DATE", 223, 88.5);
      doc.line(235, 85, 235, 90);
      doc.text("SITE", 238, 88.5);
      doc.line(245, 85, 245, 90);
          i = 95;
          doc.setFontSize(6);
        }
    
        
          doc.line(10, i - 5, 10, i);
          doc.text(String("0000" + Number(j+1)).slice(-4), 12.5, i - 1);
          doc.line(20, i - 5, 20, i);
          doc.text(this.dataset[j].ld_part, 25, i - 1);
          doc.line(65, i - 5, 65, i);
          doc.text(this.dataset[j].chr01 + ' ' + this.dataset[j].chr02 + ' ' + this.dataset[j].chr03, 67.5, i - 1);
          doc.line(130, i - 5, 130, i);
          doc.text(String(Number(this.dataset[j].ld_qty_oh) ), 137, i - 1, { align: "right" });
          doc.line(140, i - 5, 140, i);
          doc.text(String(this.dataset[j].chr04), 143, i - 1);
          doc.line(170, i - 5, 170, i);
          doc.text(String(this.dataset[j].created_by), 173, i - 1, );
          doc.line(185, i - 5, 185, i);
          doc.text(String(this.dataset[j].ld_lot), 188, i - 1, );
          doc.line(205, i - 5, 205, i);
          doc.text(String(this.dataset[j].ld_ref), 207, i - 1, );
          doc.line(220, i - 5, 220, i);
          doc.text(String((this.dataset[j].ld_date)) , 223, i - 1, );
          doc.line(235, i - 5, 235, i);
          doc.text(String((this.dataset[j].ld_site)) , 238, i - 1, );
          doc.line(245, i - 5, 245, i);
          doc.line(10, i, 245, i);
          i = i + 5;
        
      }
    
      // doc.line(10, i - 5, 200, i - 5);
    
      // doc.line(130, i + 7, 205, i + 7);
      // doc.line(130, i + 14, 205, i + 14);
      // //  doc.line(130, i + 21, 200, i + 21 );
      // //  doc.line(130, i + 28, 200, i + 28 );
      // //  doc.line(130, i + 35, 200, i + 35 );
      // doc.line(130, i + 7, 130, i + 14);
      // doc.line(160, i + 7, 160, i + 14);
      // doc.line(205, i + 7, 205, i + 14);
      // doc.setFontSize(10);
    
      doc.text("NOMBRE DE BIG BAG   " + String(this.dataset.length) + "  , Total POIDS:  " + String(Number(total)), 40, i + 12, { align: "left" });
      //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
      //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
      //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
    
      // doc.text(String(Number(total)), 198, i + 12, { align: "right" });
      //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
      //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
      //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });
    
      doc.setFontSize(8);
      // let mt = NumberToLetters(Number(total), "Dinars Algerien");
    
      // if (mt.length > 95) {
      //   let mt1 = mt.substring(90);
      //   let ind = mt1.indexOf(" ");
    
      //   mt1 = mt.substring(0, 90 + ind);
      //   let mt2 = mt.substring(90 + ind);
    
      //   doc.text("Arretée la présente Commande a la somme de :" + mt1, 20, i + 53);
      //   doc.text(mt2, 20, i + 60);
      // } else {
      //   doc.text("Arretée la présente Commande a la somme de :" + mt, 20, i + 53);
      // }
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      doc.save('ES-' + nbr + '.pdf')
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    }
    onSubmit() {
      const url = `/sales/payment-psh`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
      // this.printpdf(new Date().toLocaleDateString()); 
     
      // tslint:disable-next-line:prefer-const
    
    }
    oncreate() {
      const url = `/sales/create-direct-invoice`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
      // this.printpdf(new Date().toLocaleDateString()); 
     
      // tslint:disable-next-line:prefer-const
    
    }
    onprint() {
      const url = `/sales/print-invoice`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
      // this.printpdf(new Date().toLocaleDateString()); 
     
      // tslint:disable-next-line:prefer-const
    
    }
    onimput() {
      const url = `/sales/input-invoice`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
      // this.printpdf(new Date().toLocaleDateString()); 
     
      // tslint:disable-next-line:prefer-const
    
    }
    goback() {
    
      
      const url = `/customers/customer-list`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
    }
    reset() {
    
      this.dataset = []
      this.accountreceivableService.getAll().subscribe( 
        
          (response: any) => {this.dataset = response.data
            console.log(this.dataset)
            this.dataview.setItems(this.dataset)},
          
          (error) => {
              this.dataset = []
          },
          () => {}
          
      )
    
    }
}
