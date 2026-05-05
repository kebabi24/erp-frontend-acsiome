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
  SaleOrderService,
  SaleOrder,
  MobileSettingsService,
  LoadRequestService,
  CodeService,
  SequenceService,
  DeviseService,
  AddressService
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
  selector: 'kt-export-invoice-ih',
  templateUrl: './export-invoice-ih.component.html',
  styleUrls: ['./export-invoice-ih.component.scss']
})
export class ExportInvoiceIhComponent implements OnInit {
  saleOrder: SaleOrder;
  soForm: FormGroup;
  sodForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  hasFormErrorsd = false;
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

  
  
  datarole: [];
  columnDefinitionsrole: Column[] = [];
  gridOptionsrole: GridOption = {};
  gridObjrole: any;
  angularGridrole: AngularGridInstance;
  
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
so_cr_terms: any[] = [];
so_categorys: any[] = [];
customer_code : any
customer_name : any
horstax_amount: any
taxe_amount : any
stamp_amount : any
po : any

  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
    private sodFB: FormBuilder,
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,
    private mobileSettingsService: MobileSettingsService,
    private loadRequestService : LoadRequestService,
    private sequenceService : SequenceService,
    private codeService : CodeService,
    private deviseService : DeviseService,
    private adressService : AddressService,
    private saleOrderService : SaleOrderService,
  ) {
    config.autoClose = true;
    
    this.codeService.getBy({ code_fldname: "cm_cr_terms" }).subscribe((response: any) => (this.so_cr_terms = response.data));
    console.log(this.so_cr_terms);
    this.sequenceService.getBy({ seq_type: "SO" }).subscribe((response: any) => (this.so_categorys = response.data));
    console.log(this.so_categorys);

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
        name: "Export",
        field: "id",
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
       // formatter: Formatters.editIcon,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
               <a class="btn btn-sm btn-clean btn-icon mr-2" title="Voir Détail Facture">
               <i class="flaticon-paper-plane-1"></i>
           </a>
           `;
        },
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
           this.invid = args.dataContext.invoice_code
           this.customer_code = args.dataContext.customer_code
           this.customer_name = args.dataContext.sdelivery_note_code
           this.horstax_amount = args.dataContext.horstax_amount
           this.taxe_amount = args.dataContext.taxe_amount
           this.stamp_amount = args.dataContext.stamp_amount
           this.po = args.dataContext.invoice_code
          // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
          // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
          this.createSoForm()
          
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
     const role = controls.role.value
    let obj= {date,date1,role}
    this.mobileSettingsService.getAllInvoicesRoleExp(obj).subscribe(
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
     role:["",Validators.required],
     name:[""],
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


  createSoForm() {
    this.loadingSubject.next(false);
    this.saleOrder = new SaleOrder();
    const date = new Date();

    this.sodForm = this.sodFB.group({
      //    so__chr01: [this.saleOrder.so__chr01],
      so_category: [this.saleOrder.so_category, Validators.required],
      so_cust: [this.customer_code],
      name : [this.customer_name],
      
      so_ord_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      so_due_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],

      so_taxable: [this.saleOrder.so_taxable],
      so_po: [this.po],
      so_curr: [this.saleOrder.so_curr],
      so_cr_terms: [this.saleOrder.so_cr_terms],
      so_amt : [this.horstax_amount],
       so_tax_amt : [this.taxe_amount],
      so_trl1_amt : [this.stamp_amount]
      
    });
    const controls = this.sodForm.controls
    this.deviseService
            .getBy({ cu_active: true })
            .subscribe((response: any) => {this.curr = response.data
            console.log(this.curr)
        controls.so_curr.setValue(this.curr.cu_curr)
            })
            this.adressService.getBy({ad_addr: this.customer_code}).subscribe((resp: any)=>{
             controls.so_taxable.setValue(resp.data[0].ad_taxable)
            console.log(resp)
            })  
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
   
  handleSelectedRowsChangedrole(e, args) {
    const controls = this.soForm.controls;
      if (Array.isArray(args.rows) && this.gridObjrole) {
      args.rows.map((idx) => {
        const item = this.gridObjrole.getDataItem(idx);
        console.log(item);
        controls.role.setValue(item.role_code);
        controls.name.setValue(item.role_name);
    });

    }
  }
  angularGridReadyrole(angularGrid: AngularGridInstance) {
    this.angularGridrole = angularGrid;
    this.gridObjrole = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridrole() {
    this.columnDefinitionsrole = [
      
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "role_code",
        name: "Role",
        field: "role_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "role_name",
        name: "Nom",
        field: "role_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsrole = {
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
    this.loadRequestService.getRoles(this.user.usrd_code).subscribe(
      (response: any) => {
        this.datarole = response.data;
        console.log(this.datarole)
        console.log(this.datarole.length)
      })
  }
  openrole(contentrole) {
    this.prepareGridrole();
    this.modalService.open(contentrole, { size: "lg" });
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
    const customer_code = this.customer_code
    const costumer_name = this.customer_name   
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
     this.modalService.open(contentdet, { backdrop: 'static',size: "xl" });
   }
 
   onsave() {
    let so = this.prepareSo();
    this.addSo(so, this.dataset);



   }
   prepareSo(): any {
   const controls = this.sodForm.controls;
  
   const _so = new SaleOrder();
   _so.so_category = controls.so_category.value;
   _so.so_cust = controls.so_cust.value;
   _so.so_ship = controls.so_cust.value;
   
   _so.so_ord_date = controls.so_ord_date.value ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}` : null;
   _so.so_due_date = controls.so_due_date.value ? `${controls.so_due_date.value.year}/${controls.so_due_date.value.month}/${controls.so_due_date.value.day}` : null;
   if (controls.so_taxable.value == null || controls.so_taxable.value == "") {
     _so.so_taxable = false;
   } else {
     _so.so_taxable = controls.so_taxable.value;
   }

    _so.so_po = controls.so_po.value;

   
   _so.so_curr = controls.so_curr.value;
   _so.so_ex_rate = 1;
   _so.so_ex_rate2 = 1;
   _so.so_cr_terms = controls.so_cr_terms.value;
   
   _so.so_amt = controls.so_amt.value;
   _so.so_tax_amt = controls.so_tax_amt.value;
   _so.so_trl1_amt = controls.so_trl1_amt.value;

 
   return _so;
 }
 /**
  * Add po
  *
  * @param _so: so
  */
 addSo(_so: any, detail: any) {
   for (let data of detail) {
     delete data.id;
     delete data.cmvid;
   }
   this.loadingSubject.next(true);
   let so = null;
   const controls = this.soForm.controls;

   this.saleOrderService.addMobile({ saleOrder: _so, saleOrderDetail: detail }).subscribe(
     (reponse: any) => {
       so = reponse.data;
       // const arrayOctet = new Uint8Array(reponse.pdf.data)
       // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
       // const fileUrl = URL.createObjectURL(file);
       // window.open(fileUrl)
     },
     (error) => {
       alert("Erreur, vérifier les informations");
       this.loadingSubject.next(false);
     },
     () => {
      alert("Commande numero" + so.so_nbr)
       this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
       this.loadingSubject.next(false);
       console.log(this.dataset);
      //  if (controls.print.value == true) {this.printpdf(so.so_nbr)}; //printSO(this.customer, this.dataset, so);
      //  this.router.navigateByUrl("/");
     }
   );
 }
}
