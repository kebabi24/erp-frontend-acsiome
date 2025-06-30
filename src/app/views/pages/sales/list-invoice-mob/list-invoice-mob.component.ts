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
const API_URL = environment.apiUrl + "/users-mobile"
import { replaceAll } from "chartist"

@Component({
  selector: 'kt-list-invoice-mob',
  templateUrl: './list-invoice-mob.component.html',
  styleUrls: ['./list-invoice-mob.component.scss']
})
export class ListInvoiceMobComponent implements OnInit {

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
    console.log(this.user)
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
        id: "site",
        name: "Site",
        field: "site",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'site',
          formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      }, 
      {
        id: "period_active_date",
        name: "Date",
        field: "period_active_date",
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
          getter: 'period_active_date',
          formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "role_code",
        name: "Role",
        field: "role_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'role_code',
          formatter: (g) => `Role: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      {
        id: "user_code",
        name: "vendeur",
        field: "user_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'user_code',
          formatter: (g) => `Vendeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      {
        id: "itinerary_code",
        name: "Itineraire",
        field: "itinerary_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'itinerary_code',
          formatter: (g) => `Itineraire: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "customer_code",
        name: "Code Client",
        field: "customer_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'customer_code',
          formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      }, 
      {
        id: "sdelivery_note_code",
        name: "Nom Client",
        field: "sdelivery_note_code",
        sortable: true,
        width: 150,
        filterable: true,
        type: FieldType.text,
       
      }, 
      {
        id: "service_code",
        name: "Service",
        field: "service_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'service_code',
          formatter: (g) => `Service: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "invoice_code",
        name: "Facture",
        field: "invoice_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
    
      },
      
      {
        id: "payment_term_code",
        name: "Type Paiement",
        field: "payment_term_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {

              
          // collectionAsync: this.elem,
          collectionAsync:  this.http.get(`${API_URL}/findterms`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       
       
         
           model: Filters.multipleSelect,
          
         },
      }, 
      {
        id: "closed",
        name: "Clos",
        field: "closed",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        formatter: Formatters.checkmark,
        filter: {

              
           collection: [{value: true , label: "OUI"}, {value: false , label: "NON"}],
          //collectionAsync:  this.http.get(`${API_URL}/trans`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
       
       
         
           model: Filters.multipleSelect,
          
         },
        grouping: {
          getter: 'closed',
          formatter: (g) => `Clos: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "canceled",
        name: "Annulée",
        field: "canceled",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        formatter: Formatters.checkmark,
        filter: {

              
          collection: [{value: true , label: "OUI"}, {value: false , label: "NON"}],
        
        
          model: Filters.multipleSelect,
         
        },
        grouping: {
          getter: 'canceled',
          formatter: (g) => `Annulée: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
          new Aggregators.Sum('horstax_amount'),  
          new Aggregators.Sum('taxe_amount'),
          new Aggregators.Sum('stamp_amount'),
          new Aggregators.Sum('amount'),
          new Aggregators.Sum('due_amount'),
          new Aggregators.Sum('Credit')
        ],
          aggregateCollapsed: false,
          collapsed: false,
        }
       
      },
      {
        id: "horstax_amount",
        name: "Montant HT",
        field: "horstax_amount",
        sortable: true,
        width: 50,
        filterable: true,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 

      },
      {
        id: "taxe_amount",
        name: "TVA",
        field: "taxe_amount",
        sortable: true,
        width: 50,
        filterable: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "stamp_amount",
        name: "Timbre",
        field: "stamp_amount",
        sortable: true,
        width: 50,
        filterable: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "amount",
        name: "Montant TTC",
        field: "amount",
        sortable: true,
        width: 50,
        filterable: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
        
      },
      {
        id: "due_amount",
        name: "Montant Appliqué",
        field: "due_amount",
        sortable: true,
        width: 50,
        filterable: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },

      {
        id: "Credit",
        name: "Crédit",
        field: "Credit",
        sortable: true,
        width: 50,
        filterable: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        formatter:Formatters.decimal,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
      {
        id: "id",
        name: "Détail",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
       // formatter: Formatters.editIcon,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Voir Détail Facture">
               <i class="flaticon2-list"></i>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           this.invid = args.dataContext.invoice_code
           
          // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
          // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
          let element: HTMLElement = document.getElementById(
            "openInvsGrid"
          ) as HTMLElement;
          element.click();
          // }
          // else {
          //   alert("Modification Impossible pour ce Status")
          // }
           
        },
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
       
        
       
        excelExportOptions: {
          filename: 'my-export',
          sanitizeDataExport: true,
         
          columnHeaderStyle: {
            font: { color: 'FFFFFFFF' },
            fill: { type: 'pattern', patternType: 'solid', fgColor: 'FF4a6c91' }
          }
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
  solist() {
    this.mvdataset = []
   
    const controls = this.soForm.controls
    const date = controls.calc_date.value
    ? `${controls.calc_date.value.year}/${controls.calc_date.value.month}/${controls.calc_date.value.day}`
    : null;
  
    const date1 = controls.calc_date1.value
    ? `${controls.calc_date1.value.year}/${controls.calc_date1.value.month}/${controls.calc_date1.value.day}`
    : null;
    const site = controls.site.value
    let obj= {date,date1,site}
    this.mobileSettingsService.getAllInvoices(obj).subscribe(
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
  onChangesite() {
    const controls = this.soForm.controls;
    const si_site = controls.site.value;
    
   
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
          if( this.user.usrd_site != "*" ) {
            alert("Site n'existe pas  ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
          }
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.site.setValue(null);
            document.getElementById("site").focus();
             


           } 
          }
      
      });
   
  }
  
 
  //create form
  createForm() {
    this.loadingSubject.next(false);
    const date = new Date;
    
    this.soForm = this.soFB.group({
     // po_category: [{value: this.purchaseOrder.po_category, disabled:true}, Validators.required],
     site:[this.user.usrd_site,Validators.required],
     
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
  handleSelectedRowsChanged(e, args) {
    const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.mvgrid) {
      args.rows.map((idx) => {
        const item = this.mvgrid.getDataItem(idx);
        console.log(item);
        
       const invoicecode = item.invoice_code 
       
    let obj= {invoicecode}
this.dataset= []
       
       this.mobileSettingsService.getAllInvoicesLine(obj).subscribe(
        (respo: any) => {   
          this.dataset = respo.data
         console.log(this.dataset)
         this.dataView.setItems(this.dataset);
          
           },
        (error) => {
            this.dataset = []
        },
        () => {}
    )
     
  });

    }
  }
   
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);
        
       controls.site.setValue(item.si_site);
        
    
     
  });

    }
  }
  angularGridReadysite(angularGrid: AngularGridInstance) {
    this.angularGridsite = angularGrid;
    this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridsite() {
    this.columnDefinitionssite = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "si_site",
        name: "Site",
        field: "si_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Designation",
        field: "si_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionssite = {
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
      };
    // fill the dataset with your data
    if(this.user.usrd_site == "*") {
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
    }
    else {
      this.siteService
      .getBy({si_site : this.user.usrd_site})
      .subscribe((response: any) => (this.datasite = response.data));
  
    }
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }



  initGrid() {
    this.columnDefinitions = [
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
        id: "product_code",
        name: "Code Produit",
        field: "product_code",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'product_code',
          formatter: (g) => `Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('quantity'),
            new Aggregators.Sum('Montant')
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      }, 
      {
        id: "description",
        name: "Designation",
        field: "designation",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'description',
          formatter: (g) => `Designation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('quantity'),
            new Aggregators.Sum('Montant')
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      }, 
      
      {
        id: "lot",
        name: "Lot/Serie",
        field: "lot",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.text,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
        grouping: {
          getter: 'lot',
          formatter: (g) => `Lot/Serie: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [
            new Aggregators.Sum('quantity'),
            new Aggregators.Sum('Montant')
          ],
            aggregateCollapsed: false,
            collapsed: false,
          }

      }, 
      
       
      {
        id: "quantity",
        name: "Quantité",
        field: "quantity",
        sortable: true,
        width: 50,
        filterable: true,
       
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 

      },
      {
        id: "unit_price",
        name: "Prix",
        field: "unit_price",
        sortable: true,
        width: 50,
        filterable: true,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
     
      {
        id: "Montant",
        name: "Montant",
        field: "Montant",
        sortable: true,
        width: 50,
        filterable: true,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        type: FieldType.float,
        filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
      },
     
      
    ];

    this.gridOptions = {
      enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableAutoResize: true,
        autoHeight:true,
        enableSorting: true,
        exportOptions: {
          sanitizeDataExport: true
        },
       
        //enableRowSelection: true,
        enableCellNavigation: true,
        
     
        gridMenu: {
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGroupingp();
            }
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => this.onGroupChangedp(args),
          onExtensionRegistered: (extension) => this.draggableGroupingPluginp = extension,
      
      },

    }
    this.dataset = [];
    
    
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
  
  collapseAllGroupsp() {
    this.dataView.collapseAllGroupsp();
  }

  expandAllGroupsp() {
    this.dataView.expandAllGroupsp();
  }
  clearGroupingp() {
    if (this.draggableGroupingPluginp && this.draggableGroupingPlugin.setDroppedGroupsp) {
      this.draggableGroupingPluginp.clearDroppedGroupsp();
    }
    this.grid.invalidate(); // invalidate all rows and re-render
  }
  openInv(contentdet) {
    // this.prepareGridvend();
    const invoicecode = this.invid 
       
    let obj= {invoicecode}
this.dataset= []
       
       this.mobileSettingsService.getAllInvoicesLine(obj).subscribe(
        (respo: any) => {   
          this.dataset = respo.data
         console.log(this.dataset)
         this.dataView.setItems(this.dataset);
          
           },
        (error) => {
            this.dataset = []
        },
        () => {}
    
        )
     
 

   this.initGrid()
     this.modalService.open(contentdet, { size: "lg" });
   }
   printpdf() {

    console.log(this.mvdataset)
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
    var doc = new jsPDF({orientation:'l'});

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
    doc.text("Liste des Factures    " , 120, 40);
    doc.setFontSize(12);
    
    doc.text("Date Début : " + date, 70, 50);
    doc.text("Date Fin      : " + date1, 190, 50);

    doc.setFontSize(10);
    doc.line(5, 55, 295, 55);
    doc.line(5, 55, 295, 55);
    doc.line(5, 55, 295, 55);
    doc.line(5, 60, 295, 60);
    doc.line(5, 55, 5, 60);
    doc.text("Role", 7.5, 58.5);
    doc.line(20, 55, 20, 60);
    doc.text("Vendeur", 22, 58.5);
    doc.line(37, 55, 37, 60);
    doc.text("N° Facture", 40, 58.5);
    doc.line(60, 55, 60, 60);
    doc.text("Code Client", 62, 58.5);
    doc.line(85, 55, 85, 60);
    doc.text("Nom", 87, 58.5);
    doc.line(150, 55, 150, 60);
    doc.text("Date", 152, 58.5);
    doc.line(172, 55, 172, 60);
    doc.text("Annulée", 174, 58.5);
    doc.line(188, 55, 188, 60);
    doc.text("Montant", 202, 58.5);
    doc.line(230, 55, 230, 60);
    doc.text("Encaissé", 242, 58.5);
    doc.line(270, 55, 270, 60);
    doc.text("Crédit", 279, 58.5);
    doc.line(295, 55, 295, 60);
       
   
    var i = 65;
    doc.setFontSize(10);
    let total = 0
    let encaisse = 0
    let credits = 0
    let canceled= ""
    for (let j = 0; j < data.length; j++) {
      if (data[j].canceled == true) { canceled = "OUI"} else {canceled = 'NON'}
      let mts =  String(  Number(data[j].amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
   //   console.log(mts)
      let mnt = replaceAll(mts,","," ")
      let due =  String(  Number(data[j].due_amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
   //   console.log(mts)
      let due_amt = replaceAll(due,","," ")
      let crd =  String(  Number(data[j].Credit).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
   //   console.log(mts)
      let credit = replaceAll(crd,","," ")
   

     // console.log(mnsolde)
      if (j % 27 == 0 && j != 0) {
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
        doc.text("Liste des Factures    " , 120, 40);
        doc.setFontSize(12);
        
        doc.text("Date Début : " + date, 70, 50);
        doc.text("Date Fin      : " + date1, 190, 50);
      
        
        doc.setFontSize(10);
        doc.line(5, 55, 295, 55);
        doc.line(5, 55, 295, 55);
        doc.line(5, 55, 295, 55);
        doc.line(5, 60, 295, 60);
        doc.line(5, 55, 5, 60);
        doc.text("Role", 7.5, 58.5);
        doc.line(20, 55, 20, 60);
        doc.text("Vendeur", 22, 58.5);
        doc.line(37, 55, 37, 60);
        doc.text("N° Facture", 40, 58.5);
        doc.line(60, 55, 60, 60);
        doc.text("Code Client", 62, 58.5);
        doc.line(85, 55, 85, 60);
        doc.text("Nom", 87, 58.5);
        doc.line(150, 55, 150, 60);
        doc.text("Date", 152, 58.5);
        doc.line(172, 55, 172, 60);
        doc.text("Annulée", 174, 58.5);
        doc.line(188, 55, 188, 60);

        doc.text("Montant", 202, 58.5);
        doc.line(230, 55, 230, 60);
        doc.text("Encaissé", 242, 58.5);
        doc.line(270, 55, 270, 60);
        doc.text("Crédit", 279, 58.5);
        doc.line(295, 55, 295, 60);           
               
        i = 65;
        doc.setFontSize(10);
      }

     
        doc.line(5, i - 5, 5, i);
        doc.text(data[j].role_code, 7, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(data[j].user_code, 22, i - 1);
        doc.line(37, i - 5, 37, i);
        doc.text(data[j].invoice_code, 40, i - 1);
        doc.line(60, i - 5, 60, i);
        doc.text(data[j].customer_code, 62, i - 1);
        doc.line(85, i - 5, 85, i);
        doc.text(data[j].sdelivery_note_code, 87, i - 1);
        doc.line(150, i - 5, 150, i);
        doc.text(data[j].period_active_date, 152, i - 1);
        doc.line(172, i - 5, 172, i);
        doc.text(canceled, 174, i - 1);
        doc.line(188, i - 5, 188, i);
        doc.text(mnt, 228, i - 1,{ align: "right" });
        doc.line(230, i - 5, 230, i);
        doc.text(due_amt, 268, i - 1,{ align: "right" });
        doc.line(270, i - 5, 270, i);
        doc.text(credit, 293, i - 1,{ align: "right" });
        doc.line(295, i - 5, 295, i);
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
        total = total + Number(data[j].amount)
        encaisse = encaisse + Number(data[j].due_amount)
        credits = credits + Number(data[j].Credit)
       }
               doc.line(5, i - 5, 295, i - 5);

      //  doc.line(30, i-5, 110, i-5);

       let tt =  String(  Number(total).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
      let ttc = replaceAll(tt,","," ")

       
       let tdue =  String(  Number(encaisse).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))
      let ttdue = replaceAll(tdue,","," ")

      let tcredit =  String(  Number(credits).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }))

      let ttcredit = replaceAll(tcredit,","," ")
       doc.line(172, i - 5, 172, i);
       
        // doc.line(40, i - 5, 40, i);
        doc.text("Totaux", 186, i - 1,{ align: "right" });
        doc.line(188, i - 5, 188, i);
        doc.text(ttc, 228, i - 1,{ align: "right" });
        doc.line(230, i - 5, 230, i);
        doc.text(ttdue, 268, i - 1,{ align: "right" });
        doc.line(270, i - 5, 270, i);
        doc.text(ttcredit, 293, i - 1,{ align: "right" });
        doc.line(295, i - 5, 295, i);
        doc.line(172, i, 295, i);
        i = i + 5;


    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }

}
