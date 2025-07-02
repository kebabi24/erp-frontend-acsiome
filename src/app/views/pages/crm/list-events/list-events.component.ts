import { Component, OnInit } from "@angular/core"
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

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
  EditCommand,
  formatNumber,
  GridStateChange,
  LongTextEditorOption,
  SlickGrid,
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

import { CRMService, CodeService,ItemService,LocationDetailService,CustomerService,} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { L } from "@angular/cdk/keycodes"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss']
})
export class ListEventsComponent implements OnInit {
   nbrForm: FormGroup;
loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
results;
statuses;

methods;
executionLine: Object = {};
eventHeader : Object = {};

customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

items: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;

  grid: any;
  gridService: GridService;
  dataview: any;
  nligne : any;
  row_number;
  domain    : any;
  user : any;
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
     private modalService: NgbModal, 
      private codeService: CodeService,
      private crmservice:CRMService,
      private itemService:ItemService,
      private customersService:CustomerService,
      private nbrFB: FormBuilder,
  ) {
      this.prepareGrid()
       this.codeService
    .getBy({ code_fldname: "crm_event_result" })
    .subscribe((response: any) => (this.results = response.data));
     this.codeService
    .getBy({ code_fldname: "crm_event_status" })
    .subscribe((response: any) => (this.statuses = response.data));
    this.codeService
    .getBy({ code_fldname: "crm_action_type" })
    .subscribe((response: any) => (this.methods = response.data));
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
          // {
          //   id: "code_event",
          //   name: "N° évenement",
          //   field: "code_event",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          //   grouping: {
          //     getter: 'code_event',
          //     formatter: (g) => `N°: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [
          //       // (required), what aggregators (accumulator) to use and on which field to do so
          //      // new Aggregators.Avg('ld_qty_oh'),
          //       new Aggregators.Sum('ld_qty_oh')
          //     ],
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //   }
          // }, 
          
          // {
          //   id: "code_client",
          //   name: "Client",
          //   field: "code_client",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          //   filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
          //   grouping: {
          //     getter: 'code_client',
          //     formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [
          //       // (required), what aggregators (accumulator) to use and on which field to do so
          //      // new Aggregators.Avg('ld_qty_oh'),
          //       new Aggregators.Sum('ld_qty_oh')
          //     ],
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //     lazyTotalsCalculation:true,
          //   }
          // }, 
          {
            id: "nom_client",
            name: "Client",
            field: "nom_client",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'nom_client',
              formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          },
          {
            id: "phone",
            name: "N° Phone",
            field: "phone",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            // grouping: {
            //   getter: 'nom_client',
            //   formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            //   aggregators: [
            //     // (required), what aggregators (accumulator) to use and on which field to do so
               
            //    new Aggregators.Sum('etude'),
            //    new Aggregators.Sum('offre'),
            //    new Aggregators.Sum('encours'),
            //    new Aggregators.Sum('facture'),
            //    new Aggregators.Sum('perdu')
            //   ],
            //   aggregateCollapsed: true,
            //   collapsed: true,
            //   lazyTotalsCalculation:true,
            // }
          },
          {
            id: "mail",
            name: "Email",
            field: "mail",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            // grouping: {
            //   getter: 'nom_client',
            //   formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            //   aggregators: [
            //     // (required), what aggregators (accumulator) to use and on which field to do so
               
            //    new Aggregators.Sum('etude'),
            //    new Aggregators.Sum('offre'),
            //    new Aggregators.Sum('encours'),
            //    new Aggregators.Sum('facture'),
            //    new Aggregators.Sum('perdu')
            //   ],
            //   aggregateCollapsed: true,
            //   collapsed: true,
            //   lazyTotalsCalculation:true,
            // }
          },
          // {
          //   id: "category",
          //   name: "Type Evenement",
          //   field: "category",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          //   filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
          //   grouping: {
          //     getter: 'category',
          //     formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [
          //       // (required), what aggregators (accumulator) to use and on which field to do so
          //     
          //    
          //     ],
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //     lazyTotalsCalculation:true,
          //   }
          // },
          {
            id: "desc",
            name: "Formation",
            field: "desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'desc',
              formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
              new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          }, 
          {
            id: "event_day",
            name: "Date",
            field: "event_day",
            sortable: true,
            filterable: true,
            formatter: Formatters.dateIso,
        type: FieldType.dateIso,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'event_day',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "status",
            name: "Statut",
            field: "status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'status',
              formatter: (g) => `Situation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "action",
            name: "Action",
            field: "action",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'action',
              formatter: (g) => `Action: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "event_nbr",
            name: "Nombre action",
            field: "event_nbr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'event_nbr',
              formatter: (g) => `Action: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "resultat",
            name: "résultat",
            field: "resultat",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'resultat',
              formatter: (g) => `Résultats: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              collapsed: true,
              lazyTotalsCalculation:true,
            }
          }, 
          {
            id: "etude",
            name: "Etude",
            field: "etude",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            ,grouping: {
              getter: 'etude',
              formatter: (g) => `Etude: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          
          {
            id: "offre",
            name: "Offre",
            field: "offre",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            ,grouping: {
              getter: 'offre',
              formatter: (g) => `Offre: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "encours",
            name: "En-Cours",
            field: "encours",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            ,grouping: {
              getter: 'encours',
              formatter: (g) => `En-cours: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "facture",
            name: "Facturé",
            field: "facture",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive},
            grouping: {
              getter: 'facture',
              formatter: (g) => `Facturé: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
          {
            id: "perdu",
            name: "Non Conclu",
            field: "perdu",
            sortable: true,
            filterable: true,
           groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive},
            grouping: {
              getter: 'perdu',
              formatter: (g) => `Non Conclu: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               new Aggregators.Sum('etude'),
               new Aggregators.Sum('offre'),
               new Aggregators.Sum('encours'),
               new Aggregators.Sum('facture'),
               new Aggregators.Sum('perdu')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          },
           
         {
        id: "add",
        field: "add",
        excludeFromHeaderMenu: true,
        formatter: Formatters.icon,
        params: { formatterIcon: "fa fa-plus" },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          //if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //  this.angularGrid.gridService.deleteItem(args.dataContext);
          // }
       
            this.row_number = args.row;
            this.nligne =  args.dataContext.id
            let element: HTMLElement = document.getElementById("openNbrLigne") as HTMLElement;
            element.click();
        
        },
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
      this.crmservice.getEvents().subscribe( 
        
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

    printpdf() {
      // const controls = this.totForm.controls
      let nbr = new Date().toLocaleDateString()
      console.log("pdf");
      var doc = new jsPDF("l");
      let date = new Date()
     // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
      var img = new Image()
      // img.src = "./assets/media/logos/inventory-list.png";
      img.src = "./assets/media/logos/companyentete"
    doc.addImage(img, 'png', 5, 5, 200, 30)
      doc.setFontSize(9);
      // if (this.domain.dom_name != null) {
      //   doc.text(this.domain.dom_name, 10, 10);
      // }
      // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
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
          // img.src = "./assets/media/logos/inventory-list.png";
          img.src = "./assets/media/logos/companyentete"
    doc.addImage(img, 'png', 5, 5, 200, 30)
          doc.setFontSize(9);
          // if (this.domain.dom_name != null) {
          //   doc.text(this.domain.dom_name, 10, 10);
          // }
          // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
          // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
          // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
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
    
      this.printpdf(); 
     
      // tslint:disable-next-line:prefer-const
    
    }
    vendorlist() {
    
      
      const url = `/providers/list`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
    }
    partlist() {
    
      
      const url = `/articles/list`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
    }
    polist() {
    
      
      const url = `/inventory-transaction/transaction-list`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
    }
    caisse() {
    
      
      const url = `/purchasing/payment-au`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    
    }
   
    
    reset() {
    
     this.dataset = []
      this.crmservice.getEvents().subscribe( 
        
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
 opennbrligne(content) {

    this.createnbrForm();
    this.modalService.open(content, { size: "lg" });
    
  }
createnbrForm() {
    this.loadingSubject.next(false);
    
    const date = new Date();
    this.nbrForm = this.nbrFB.group({
      result: [""],
      status:[""],
      comment:[""],
      new_event:[false],
      effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        start_time:['00:00'],
        method:[""],
      nbrligne:[1],
      price:[0]
    });

  }
newEvent(){
        let element: HTMLElement = document.getElementById("openEvent") as HTMLElement;
            element.click();
        
  }  
openEvent(content) {
    this.createeventForm();
    this.modalService.open(content, { size: "lg" });
  }
createeventForm() {
    this.loadingSubject.next(false);
    
    const date = new Date;
    this.nbrForm = this.nbrFB.group({
      so_cust:[""],
      name:[""],
      addresse:[""],
      phone:[""],
      mail:[""],
      tr_part:[""],
      desc:[""],
      result: [""],
      status:[""],
      comment:[""],
      new_event:[false],
      effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        start_time:['00:00'],
        method:[""],
      nbrligne:[1],
      price:[0]
    });
  }
  
  saveNewEvent(){
    const controls = this.nbrForm.controls
    // let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    let newEvent = {}
    newEvent['code_event'] = controls.so_cust.value + '-' + controls.tr_part.value , 
    newEvent['order'] = 1
    newEvent['code_client'] = controls.so_cust.value 
    newEvent['category'] = 'new_shop' 
    newEvent['phone_to_call'] = controls.phone.value
    newEvent['status'] = controls.status.value 
    newEvent['visibility'] = true
    newEvent['duration'] = 0
    newEvent['action'] = controls.action.value 
    newEvent['method'] = 'method_6'
    newEvent['event_day'] = controls.effdate.value ? `${controls.effdate.value.year}/${controls.effdate.value.month}/${controls.effdate.value.day}` : null;
    newEvent['hh'] = Number(controls.start_time.value.substring(0,2)) 
    newEvent['mn'] = Number(controls.start_time.value.substring(3))
    newEvent['ss'] = 0  
    newEvent['profile_code'] = this.user.usrd_code
    newEvent['param_code'] = 'NEW_CALL'
    newEvent['item'] = controls.tr_part.value
    newEvent['nbr'] = controls.nbrligne.value
    newEvent['price'] = Number(controls.price.value) * Number(controls.nbrligne.value)
    newEvent['visibility'] = true
    newEvent['comment'] = controls.comment.value
    
    this.crmservice
      .createAgendaLine(newEvent)

      .subscribe(
        (res: any) => {
          console.log(res);
          document.getElementById("closeModal4").click(); 
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de le event",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.layoutUtilsService.showActionNotification(
            "event créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        }
      );

    console.log(newEvent)
  
    this.eventHeader['code_event'] = controls.so_cust.value + '-' + controls.tr_part.value , 
    this.eventHeader['order'] = 1 , 
    this.eventHeader['param_code'] = 'NEW_CALL',
    this.eventHeader['nbr'] = controls.nbrligne.value
    this.eventHeader['price'] = Number(controls.price.value) * Number(controls.nbrligne.value)
    this.eventHeader['event_day'] = controls.effdate.value ? `${controls.effdate.value.year}/${controls.effdate.value.month}/${controls.effdate.value.day}` : null;
    this.executionLine = {
      event_day:new Date(),
      phone_to_call: controls.phone.value,
      status:controls.status.value,
      duration:0,
      action:controls.method.value,
      method:controls.method.value,
      call_hour:Date.now(),
      call_end_hour:Date.now(),
      observation:controls.comment.value,
      event_code : controls.so_cust.value + '-' + controls.tr_part.value,
      event_result : controls.result.value,
      category : 'new_shop',
      visibility:true
    }
     this.crmservice
      .createExecutionLine(this.executionLine, this.eventHeader,controls.new_event.value)

      .subscribe(
        (res: any) => {
          console.log(res);
          this.eventHeader = {}
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de la catégorie",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          
          this.layoutUtilsService.showActionNotification(
            "Ligne d'exécution créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        }
      );



    
    this.modalService.dismissAll()
  }
  saveNewResult(){
    const controls = this.nbrForm.controls
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
    this.eventHeader['code_event'] = updateItem.code_event , 
    this.eventHeader['order'] = updateItem.order , 
    this.eventHeader['param_code'] = updateItem.param_code, 
    this.eventHeader['nbr'] = controls.nbrligne.value
    this.eventHeader['price'] = Number(controls.price.value) * Number(controls.nbrligne.value)
    this.eventHeader['event_day'] = controls.effdate.value ? `${controls.effdate.value.year}/${controls.effdate.value.month}/${controls.effdate.value.day}` : null;
    this.eventHeader['hh'] = Number(controls.start_time.value.substring(0,2)) 
    this.eventHeader['mn'] = Number(controls.start_time.value.substring(3))
    this.eventHeader['ss'] = 0  
    this.executionLine = {
      event_day:new Date(),
      phone_to_call: updateItem.phone_to_call,
      status:controls.status.value,
      duration:0,
      action:controls.method.value,
      method:updateItem.method,
      call_hour:Date.now(),
      call_end_hour:Date.now(),
      observation:controls.comment.value,
      event_code : updateItem.code_event,
      event_result : controls.result.value,
      category : updateItem.category
    }
     this.crmservice
      .createExecutionLine(this.executionLine, this.eventHeader,controls.new_event.value)

      .subscribe(
        (res: any) => {
          console.log(res);
          this.eventHeader = {}
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de la catégorie",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          
          this.layoutUtilsService.showActionNotification(
            "Ligne d'exécution créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        }
      );


if(controls.new_event.value == true)
{
    let newEvent = {}
    
    newEvent['code_event'] = updateItem.code_event 
    newEvent['order'] = 1
    newEvent['code_client'] = updateItem.code_client 
    newEvent['category'] = updateItem.category 
    newEvent['phone_to_call'] = updateItem.phone
    newEvent['status'] = controls.status.value 
    newEvent['visibility'] = true
    newEvent['duration'] = updateItem.duration
    newEvent['action'] = controls.action.value
    newEvent['method'] = updateItem.method
    newEvent['event_day'] = controls.effdate.value ? `${controls.effdate.value.year}/${controls.effdate.value.month}/${controls.effdate.value.day}` : null;
    newEvent['hh'] = Number(controls.start_time.value.substring(0,2)) 
    newEvent['mn'] = Number(controls.start_time.value.substring(3))
    newEvent['ss'] = 0  
    newEvent['profile_code'] = updateItem.profile_code
    newEvent['param_code'] = updateItem.param_code
    newEvent['item'] = updateItem.item
    newEvent['id_event'] = updateItem.id
    newEvent['new_event'] = controls.new_event.value
    newEvent['comment'] = controls.comment.value
    newEvent['amount']   = Number(Number(updateItem.offre)+Number(updateItem.etude)+Number(updateItem.encours)+Number(updateItem.facture))*controls.nbrligne.value
    this.crmservice
    .createAgendaLine(newEvent)

       .subscribe(
        (res: any) => {
          console.log(res);
          // document.getElementById("closeModal4").click(); 
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de l'evenement",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          
          this.layoutUtilsService.showActionNotification(
            "event créée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.router.navigateByUrl("/auth/new-customer/");
        }
      );
    }
    
    this.modalService.dismissAll()
  }
  addclient() {
   this.modalService.dismissAll() 
  }
  handleSelectedRowsChanged2(e, args) {
    const controls = this.nbrForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        console.log(item);
        const date = new Date();

        
        
        controls.so_cust.setValue(item.cm_addr || "");
        controls.name.setValue(item.address.ad_name || "");
        controls.addresse.setValue(item.address.ad_line1 || "");
        controls.phone.setValue(item.address.ad_phone || "");
        controls.mail.setValue(item.address.ad_ext);
        
        
      });
    }
  }

  angularGridReady2(angularGrid: AngularGridInstance) {
    this.angularGrid2 = angularGrid;
    this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid2() {
    this.columnDefinitions2 = [
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
        name: "code",
        field: "cm_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Client",
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_phone",
        name: "Numero telephone",
        field: "address.ad_phone",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxable",
        name: "A Taxer",
        field: "address.ad_taxable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxc",
        name: "Taxe",
        field: "address.ad_taxc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions2 = {
      enableSorting: true,
      enableCellNavigation: true,
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
    const controls = this.nbrForm.controls;
    this.customersService.getByAll({ cm_hold: false,  }).subscribe((response: any) => (this.customers = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChanged4(e, args) {
    const controls = this.nbrForm.controls; 
    //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
     
        controls.tr_part.setValue(item.pt_part || ""); 
        controls.desc.setValue(item.pt_desc1)
        controls.price.setValue(item.pt_price)
    });
  }
}

  angularGridReady4(angularGrid: AngularGridInstance) {
    this.angularGrid4 = angularGrid;
    this.gridObj4 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid4() {
    this.columnDefinitions4 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pt_part",
        name: "code ",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_desc1",
        name: "desc",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_um",
        name: "UM",
        field: "pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_price",
        name: "Prix",
        field: "pt_price",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions4 = {
      enableSorting: true,
      enableCellNavigation: true,
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
    };

    // fill the dataset with your data
    this.itemService
      .getAll()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onChangeResult(){
    const controls = this.nbrForm.controls
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    let amt = Number(updateItem.etude) + Number(updateItem.offre) + Number(updateItem.encours) + Number(updateItem.facture) + Number(updateItem.perdu) 
    controls.price.setValue(amt)
    if(controls.result.value == 'result_1'){controls.status.setValue('A')
      
    }
  }
  onChangeStatus(){
    const controls = this.nbrForm.controls
     if(controls.status.value == 'Q'){
      this.saveNewResult()
        const url = `/sales/create-quote`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
     }
     if(controls.status.value == 'F'){
      this.saveNewResult()
        const url = `/sales/create-direct-invoice`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
     }
    //  if(controls.status.value == 'T'){
    //     const url = `/training/create-training-session`;
    //   this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    //  }
  }
}

