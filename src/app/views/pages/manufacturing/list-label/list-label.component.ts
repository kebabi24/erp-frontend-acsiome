
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

import { LabelService,} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"

import { replaceAll } from "chartist"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-list-label',
  templateUrl: './list-label.component.html',
  styleUrls: ['./list-label.component.scss']
})
export class ListLabelComponent implements OnInit {

  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  grid: any;
  gridService: GridService;
  
  dataView: any;
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
      private soFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private labelService: LabelService,
      
  ) {
      
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
    // this.prepareRoles();
    console.log(this.user)
    this.createForm();
    this.prepareGrid()
    //this.initGrid();
    this.solist();
   
    this.user = JSON.parse(localStorage.getItem("user"));
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
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
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
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
            id: "lb_nbr",
            name: "Id OF",
            field: "lb_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'lb_nbr',
              formatter: (g) => `ID OF: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('lb_qty'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "lb_date",
            name: "Date effet",
            field: "lb_date",
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
              getter: 'lb_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('lb_qty'),
               
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
          },
          {
            id: "created_by",
            name: "Utilisateur",
            field: "created_by",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'created_by',
              formatter: (g) => `Utilisateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('lb_qty')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          
          {
            id: "lb_part",
            name: "Code Produit",
            field: "lb_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'lb_part',
              formatter: (g) => `Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('lb_qty'),
               
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },

          {
            id: "lb__chr01",
            name: "Désignation",
            field: "lb__chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'lb__chr01',
              formatter: (g) => `Désignation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
               new Aggregators.Sum('lb_qty'),
             
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "lb_lot",
            name: "Lot",
            field: "lb_lot",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'lb_lot',
              formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('lb_qty'),
                
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
         
          {
            id: "lb_pal",
            name: "N° Palette",
            field: "lb_pal",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "lb_deleted",
            name: "Suprimée",
            field: "lb_deleted",
            sortable: true,

            filterable: true,
            type: FieldType.boolean,
            formatter:Formatters.checkmark,
            filter: {
              collection: [ { value: true, label: 'OUI' }, { value: false, label: 'NON' } ],
              model: Filters.multipleSelect,
       
              placeholder: 'Choisir une option'
          },
          },
          
          {
            id: "lb_qty",
            name: "Quantité",
            field: "lb_qty",
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
      
      //   this.accountreceivableService
      // .getBy({ ar_type:'I'})
      // .subscribe(
        
      //     (response: any) => {this.dataset = response.data
      //       console.log(this.dataset)
      //       this.dataView.setItems(this.dataset)},
          
      //     (error) => {
      //         this.dataset = []
      //     },
      //     () => {}
          
      // )
      
      
      // console.log(this.dataset)
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
   
     goback() {
    
      
      const url = `/sales/list-invoices`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
    }
    reset() {
    
      this.dataset = []
      this.reset()
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
      this.labelService.getByObj(obj).subscribe(
        (response: any) => {   
          this.dataset = response.data
          console.log(this.dataset)
           this.dataView.setItems(this.dataset);
        
       
          
           },
        (error) => {
            this.dataset = []
        },
        () => {}
    )
    }

    printpdf() {

      console.log(this.dataView.getFilteredItems())
      const data = this.dataView.getFilteredItems()
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
      doc.text("Liste des Factures    " , 80, 40);
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
      doc.text("N° Facture", 104, 58.5);
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
        let mts =  String(  Number(data[j].ar_base_amt).toLocaleString("en-US", {
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
          doc.text("N° Facture", 104, 58.5);
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
          doc.text(data[j].ar_nbr, 104, i - 1);
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
  
         let tt =  String(  Number(total).toLocaleString("en-US", {
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
