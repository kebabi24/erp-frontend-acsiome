// Angular
import { Component, ChangeDetectorRef, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
    Formatters,
    FieldType,
    OnEventArgs,
  } from "angular-slickgrid";
  
import { ActivatedRoute, Router } from "@angular/router"
import {
    NgbTabChangeEvent,
} from "@ng-bootstrap/ng-bootstrap"

import { FormBuilder, FormGroup, Validators } from "@angular/forms"
// Material
import { MatDialog } from "@angular/material/dialog"
// RxJS
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { map, startWith, delay, first } from "rxjs/operators"
// NGRX
import { Store, select } from "@ngrx/store"
import { Dictionary, Update } from "@ngrx/entity"
import { AppState } from "../../../../core/reducers"
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
// Services and Models
import {
    selectLastCreatedProductId,
    selectProductById,
    SPECIFICATIONS_DICTIONARY,
    ProductModel,
    ProductOnServerCreated,
    ProductUpdated,
    ProductsService,
} from "../../../../core/e-commerce"

import {
    Address,
    AddressService,
    CodeService,
    SiteService,
    Customer,
    CustomerService,
    AccountService,
    TaxeService,
    DeviseService,
    BankService,
    SequenceService,
} from "../../../../core/erp"
//fin onglet 1

import {
  
  Aggregators,
  
  DelimiterType,
  
  FileType,
  Filters,
  
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
} from "angular-slickgrid";







const myCustomCheckboxFormatter: Formatter = (
  row: number,
  cell: number,
  value: any,
  columnDef: Column,
  dataContext: any,
  grid?: any
) =>
  value
    ? `<div class="text"  aria-hidden="true">Oui</div>`
    : '<div class="text"  aria-hidden="true">Non</div>';
// fin onglet 2

import { HttpClient } from "@angular/common/http";
import { HttpUtilsService } from "../../../../core/_base/crud";


// Angular slickgrid
import {
  
  EditorValidator,
  EditorArgs,
  
} from "angular-slickgrid";
 
import {  NgControlStatus } from "@angular/forms"
import { RepertoryService,} from "../../../../core/erp";


import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY } from "@angular/cdk/overlay/overlay-directives";
const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } 
  return { valid: true, msg: '' };
};

  import { environment } from "../../../../../environments/environment"
  const API_URL = environment.apiUrl + "/codes"
  // fin onglet 3
import { Employe, EmployeService, JobService , UsersService, ItemService} from "../../../../core/erp"

import { array } from "@amcharts/amcharts4/core";
const API_URL_JOBS = environment.apiUrl + "/jobs"
// ONGLET 4

import { round } from "lodash";

// CRUD
import { SaleOrderService, Quote,QuoteService, SaleOrder,  LocationService, MesureService, PricelistService, printSO, ConfigService, PayMethService, CostlistService } from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
// ONGLET 5

import {
  
 
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  OperatorType,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid"





import { AccountShiper,
  LocationDetail, LocationDetailService} from "../../../../core/erp"

import { L } from "@angular/cdk/keycodes"

const myCustomCheckboxFormatterO6: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"
// ONGLET 6
import {
  
  
  InventoryStatusService,
  
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
// ONGLET 7
import {
  InventoryTransaction,
  SaleShiper,
  InventoryTransactionService,
  SaleShiperService,
  InvoiceOrderTempService,
  InvoiceOrderTemp,
  printIH,
  Item,
} from "../../../../core/erp";

// ONGLET 8
import {
  InvoiceOrderService,
  InvoiceOrder,
  ProductLineService,
} from "../../../../core/erp";

// ONGLET 9

 

import { AccountReceivable,AccountReceivableService,
  AccountShiperService} from "../../../../core/erp"


const myCustomCheckboxFormatterO10: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codesO10 = environment.apiUrl + "/codes"
// ONGLET 10






// ONGLET 11
import { Requisition, RequisitionService,  ProviderService } from "../../../../core/erp"
import { Reason, ReasonService} from "../../../../core/erp"
import { AlertComponent } from "../../../partials/content/crud"
import { sequence } from "@angular/animations"
// ONGLET 12
@Component({
  selector: 'kt-gestion-commerciale', 
  templateUrl: './gestion-commerciale.component.html',
  styleUrls: ['./gestion-commerciale.component.scss']
})
export class GestionCommercialeComponent implements OnInit {
    // Private password
    private componentSubscriptions: Subscription
    // sticky portlet header margin
    private headerMargin: number

    // properties
    address: Address
    addressForm: FormGroup
    customer: Customer
    customerForm: FormGroup
    hasFormErrors = false
    hascustomerFormErrors = false
    selectedTab = 0
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$: Observable<boolean>
    addressId$: Observable<Number>

    isExist = false

    devises: [];
    columnDefinitions2: Column[] = [];
    gridOptions2: GridOption = {};
    gridObj2: any;
    angularGrid2: AngularGridInstance;


    sequences: []
    columnDefinitions1: Column[] = []
    gridOptions1: GridOption = {}
    gridObj1: any
    angularGrid1: AngularGridInstance

    customers: [];
    columnDefinitions5: Column[] = [];
    gridOptions5: GridOption = {};
    gridObj5: any;
    angularGrid5: AngularGridInstance;

    data: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""

    error = false

    
    fieldcode = "";

    datasite: [];
    columnDefinitionssite: Column[] = [];
    gridOptionssite: GridOption = {};
    gridObjsite: any;
    angularGridsite: AngularGridInstance;

    datatax: []
    columnDefinitionstax: Column[] = []
    gridOptionstax: GridOption = {}
    gridObjtax: any
    angularGridtax: AngularGridInstance

    databank: []
    columnDefinitionsbank: Column[] = []
    gridOptionsbank: GridOption = {}
    gridObjbank: any
    angularGridbank: AngularGridInstance

    datacode: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;
    nbr:any;
fldname;
    // selects
    ad_city: any[] = []
    ad_state: any[] = []
    ad_country: any[] = []
    cm_type: any[] = []
    cm_class: any[] = []
    cm_region: any[] = []
    
    cm_shipvia: any[] = []
    cm_promo: any[] = []
    cm_lang: any[] = []
    ad_tax_zone: any[] = []
    ad_tax_usage: any[] = []
    user:any
    /**
      * Component constructor
      *
      * @param activatedRoute: ActivatedRoute
      * @param router: Router
      * @param typesUtilsService: TypesUtilsService
      * @param FB: FormBuilder
      * @param dialog: MatDialog
      * @param subheaderService: SubheaderService
      * @param layoutUtilsService: SubheaderService
      * @param layoutConfigService: LayoutConfigService
      * @param addressService: AddressService
      * @param codeService: CodeService
      * @param customerService: CustomerService
      * @param cdr: ChangeDetectorRef
      * 

      */

    // fin onglet 1
   
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  dataview: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ["", "", ""];
  gridObj: any;
  dataviewObj: any;
  // fin onglet 2
  repForm: FormGroup;
  row_number;

  

  adtype: any;
    

  
  
  message = "";
  
    
    datacust: []
    columnDefinitionscust: Column[] = []
    gridOptionscust: GridOption = {}
    gridObjcust: any
    angularGridcust: AngularGridInstance

  columnDefinitionsO3: Column[];
  gridOptionsO3: GridOption;
  gridObjO3: any;
  dataView: any;
  grid: any;
  gridService: GridService;
  angularGridO3: AngularGridInstance;
 
  reps: any[] = [];
  adresses:any[] = [];
  httpOptions = this.httpUtils.getHTTPHeaders();
  // fin onglet 3
  employe: Employe
  empForm: FormGroup
  
  hasEmployeErrors = false
 
 

  field = ""
  
    dataO4: []
    columnDefinitions3O4: Column[] = []
    gridOptions3O4: GridOption = {}
    gridObj3O4: any
    angularGrid3O4: AngularGridInstance
    selectedFieldO4 = ""
   
    hasEmployeFormErrors = false

    
    
    

    datauserid: []
    columnDefinitionsuserid: Column[] = []
    gridOptionsuserid: GridOption = {}
    gridObjuserid: any
    angularGriduserid: AngularGridInstance
    
    datashift: []
    columnDefinitionsshift: Column[] = []
    gridOptionsshift: GridOption = {}
    gridObjshift: any
    angularGridshift: AngularGridInstance


  jobs: [];
  columnDefinitions2O4: Column[] = [];
  gridOptions2O4: GridOption = {};
  gridObj2O4: any;
  angularGrid2O4: AngularGridInstance;

  domains: [];
  columnDefinitionsdomain: Column[] = [];
  gridOptionsdomain: GridOption = {};
  gridObjdomain: any;
  angularGriddomain: AngularGridInstance;
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  jbangularGrid: AngularGridInstance;
  jbgrid: any;
  jbgridService: GridService;
  jbdataView: any;
  jbcolumnDefinitions: Column[];
  jbgridOptions: GridOption;
  jbdataset: any[];

    emp_city: any[] = []
    emp_state: any[] = []
    emp_county: any[] = []
    emp_country: any[] = []
    
    leveljbd = [];
    leveljob = []
   

  dataupper: []
    columnDefinitionsupper: Column[] = []
    gridOptionsupper: GridOption = {}
    gridObjupper: any
    angularGridupper: AngularGridInstance

    trangularGrid: AngularGridInstance;
    trgrid: any;
    trgridService: GridService;
    trdataView: any;
    trcolumnDefinitions: Column[];
    trgridOptions: GridOption;
    trdataset: any[];

    itemsO4: [];
    columnDefinitions4O4: Column[] = [];
    gridOptions4O4: GridOption = {};
    gridObj4O4: any;
    angularGrid4O4: AngularGridInstance;

// ONGLET 4
    quote: Quote
    qoForm: FormGroup
    totForm: FormGroup
    


    angularGridO5: AngularGridInstance
    gridO5: any
    gridServiceO5: GridService
    dataViewO5: any
    columnDefinitionsO5: Column[]
    gridOptionsO5: GridOption
    datasetO5: any[]

    sequencesO5: []
    columnDefinitions1O5: Column[] = []
    gridOptions1O5: GridOption = {}
    gridObj1O5: any
    angularGrid1O5: AngularGridInstance

    customersO5: []
    columnDefinitions2O5: Column[] = []
    gridOptions2O5: GridOption = {}
    gridObj2O5: any
    angularGrid2O5: AngularGridInstance

    usersO5: []
    columnDefinitions3O5: Column[] = []
    gridOptions3O5: GridOption = {}
    gridObj3O5: any
    angularGrid3O5:AngularGridInstance

    itemsO5: []
    columnDefinitions4O5: Column[] = []
    gridOptions4O5: GridOption = {}
    gridObj4O5: any
    angularGrid4O5: AngularGridInstance

    devisesO5: [];
    columnDefinitionscurrO5: Column[] = [];
    gridOptionscurrO5: GridOption = {};
    gridObjcurrO5: any;
    angularGridcurrO5: AngularGridInstance;
    
    taxable: boolean;
// selects
    qo_cr_terms: any[] = [];
    curr;
  // ONGLET 5
  columnDefinitionsO6: Column[] = []
  gridOptionsO6: GridOption = {}
  datasetO6: any[] = []
  draggableGroupingPluginO6: any;
  angularGridO6: AngularGridInstance;

  gridO6: any;
  gridServiceO6: GridService;
  dataviewO6: any;
 
  domainO6   : any;
  userO6 : any;
  selectedGroupingFieldsO6: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObjO6: any;
  dataviewObjO6: any;

  // ONGLET 6
  saleOrderO7: SaleOrder;
  soFormO7: FormGroup;
  totFormO7: FormGroup;
  
errorO7 = false;
  angularGridO7: AngularGridInstance;
  gridO7: any;
  gridServiceO7: GridService;
  dataViewO7: any;
  columnDefinitionsO7: Column[];
  gridOptionsO7: GridOption;
  datasetO7: any[];

  sequencesO7: []
  columnDefinitions1O7: Column[] = []
  gridOptions1O7: GridOption = {}
  gridObj1O7: any
  angularGrid1O7: AngularGridInstance

  customersO7: [];
  columnDefinitions2O7: Column[] = [];
  gridOptions2O7: GridOption = {};
  gridObj2O7: any;
  angularGrid2O7: AngularGridInstance;

  usersO7: [];
  columnDefinitions3O7: Column[] = [];
  gridOptions3O7: GridOption = {};
  gridObj3O7: any;
  angularGrid3O7: AngularGridInstance;

  quotesO7: [];
  columnDefinitions5O7: Column[] = [];
  gridOptions5O7: GridOption = {};
  gridObj5O7: any;
  angularGrid5O7: AngularGridInstance;

  billsO7: [];
  columnDefinitionsbillO7: Column[] = [];
  gridOptionsbillO7: GridOption = {};
  gridObjbillO7: any;
  angularGridbillO7: AngularGridInstance;
  
  itemsO7: [];
  columnDefinitions4O7: Column[] = [];
  gridOptions4O7: GridOption = {};
  gridObj4O7: any;
  angularGrid4O7: AngularGridInstance;

  umsO7: [];
  columnDefinitionsumO7: Column[] = [];
  gridOptionsumO7: GridOption = {};
  gridObjumO7: any;
  angularGridumO7: AngularGridInstance;


  datataxO7: [];
  columnDefinitionstaxO7: Column[] = [];
  gridOptionstaxO7: GridOption = {};
  gridObjtaxO7: any;
  angularGridtaxO7: AngularGridInstance;


  devisesO7: [];
  columnDefinitionscurrO7: Column[] = [];
  gridOptionscurrO7: GridOption = {};
  gridObjcurrO7: any;
  angularGridcurrO7: AngularGridInstance;

  datasiteO7: [];
  columnDefinitionssiteO7: Column[] = [];
  gridOptionssiteO7: GridOption = {};
  gridObjsiteO7: any;
  angularGridsiteO7: AngularGridInstance;

  datalocO7: [];
  columnDefinitionslocO7: Column[] = [];
  gridOptionslocO7: GridOption = {};
  gridObjlocO7: any;
  angularGridlocO7: AngularGridInstance;
  datalocdetO7: [];
  columnDefinitionslocdetO7: Column[] = [];
  gridOptionslocdetO7: GridOption = {};
  gridObjlocdetO7: any;
  angularGridlocdetO7: AngularGridInstance;
  
  seqO7;
  userO7;
  row_numberO7;
  messageO7 = "";
  quoteServerO7;
  qoServerO7;
  customerO7;
  billerO7;
  datasetPrintO7 = [];
  typeO7: String;
  dateO7: String;
  so_cr_termsO7: any[] = [];
  priceO7: Number;
  discO7: Number;
  taxableO7: Boolean;
  locationO7: any;
  lddetO7: any;
  statO7: any;
  currO7: any;
  // ONGLET 7
  
  invoiceOrderO8: InvoiceOrderTemp;
  inventoryTransactionO8: InventoryTransaction;
  ihFormO8: FormGroup;
  totFormO8: FormGroup;
  errorO8 = false;
  angularGridO8: AngularGridInstance;
  gridO8: any;
  gridServiceO8: GridService;
  dataViewO8: any;
  columnDefinitionsO8: Column[];
  gridOptionsO8: GridOption;
  datasetO8: any[];

  angularGridihO8: AngularGridInstance; 
  gridihO8: any;
  gridServiceihO8: GridService;
  dataViewihO8: any;
  columnDefinitionsihO8: Column[];
  gridOptionsihO8: GridOption;
  ihdatasetO8 : any[];

  customerO8: any;
  
  customersO8: [];
    columnDefinitions2O8: Column[] = [];
    gridOptions2O8: GridOption = {};
    gridObj2O8: any;
    angularGrid2O8: AngularGridInstance;
  
    
 
  
  sosO8: [];
  columnDefinitions5O8: Column[] = [];
  gridOptions5O8: GridOption = {};
  gridObj5O8: any;
  angularGrid5O8: AngularGridInstance;


  
  
  sequencesO8: []
    columnDefinitions1O8: Column[] = []
    gridOptions1O8: GridOption = {}
    gridObj1O8: any
    angularGrid1O8: AngularGridInstance

  row_numberO8;
  messageO8 = "";
  soServerO8;
  locationO8: any;
  detailsO8: any;
  datasetPrintO8 = [];
  statO8: String;
  statusO8: any;
  qtyO8: Number;
  qtyshipO8: Number;
  expireO8: Date;
  seqO8: any;
  ith_cr_termsO8: any[] = [];
  detailO8: any;
  currO8: any;  
  userO8;
  pshnbrO8: String;
  // ONGLET 8
  invoiceOrderO9: InvoiceOrder;
  inventoryTransactionO9: InventoryTransaction;
  ihFormO9: FormGroup;
  totFormO9: FormGroup;
  hasFormErrorsO9 = false;

  errorO9 = false;
  angularGridO9: AngularGridInstance;
  gridO9: any;
  gridServiceO9: GridService;
  dataViewO9: any;
  columnDefinitionsO9: Column[];
  gridOptionsO9: GridOption;
  datasetO9: any[];

  angularGridihO9: AngularGridInstance; 
  gridihO9: any;
  gridServiceihO9: GridService;
  dataViewihO9: any;
  columnDefinitionsihO9: Column[];
  gridOptionsihO9: GridOption;
  ihdatasetO9 : any[];

  angularGridcfO9: AngularGridInstance;
  gridcfO9: any;
  gridServicecfO9: GridService;
  dataViewcfO9: any;
  columnDefinitionscfO9: Column[];
  gridOptionscfO9: GridOption;
  cfdatasetO9: any[];

  customerO9: any;
  
  
  
  
    invoicesO9: []
    columnDefinitions1O9: Column[] = []
    gridOptions1O9: GridOption = {}
    gridObj1O9: any
    angularGrid1O9: AngularGridInstance

  
  soServerO9;
  locationO9: any;
  detailsO9: any;
  datasetPrintO9 = [];
  statO9: String;
  statusO9: any;
  qtyO9: Number;
  qtyshiO9: Number;
  expireO9: Date;
  seqO9: any;
  ih_cr_termsO9: any[] = [];
  detailO9: any;
  currO9: any;  
  userO9;
  invoiceTempO9: any;
  pshnbrO9: String;
  cfgO9:any;
  totalO9: Number;
  cfplO9 = [];
// ONGLET 9
columnDefinitionsO10: Column[] = []
  gridOptionsO10: GridOption = {}
  datasetO10: any[] = []
  draggableGroupingPluginO10: any;
  angularGridO10: AngularGridInstance;

  gridO10: any;
  gridServiceO10: GridService;
  dataviewO10: any;
 
  domainO10    : any;
  userO10
  selectedGroupingFieldsO10: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObjO10: any;
  dataviewObjO10: any;
// ONGLET 10
accountShiperO11: AccountShiper;
  asFormO11: FormGroup;
  errorO11 = false;
  angularGridO11: AngularGridInstance;
  
  
  blsO11: [];
    columnDefinitionsblO11: Column[] = [];
    gridOptionsblO11: GridOption = {};
    gridObjblO11: any;
    angularGridblO11: AngularGridInstance;
  
  
  detailsO11: any;
  datasetPrintO11 = [];
  as_pay_methodO11: any[] = [];
  blO11: any;
  userO11;
  pshnbrO11: String;
  checkO11;
  nbrO11;
  banksO11: [];
  columnDefinitionsbankO11: Column[] = [];
  gridOptionsbankO11: GridOption = {};
  gridObjbankO11: any;
  angularGridbankO11: AngularGridInstance;

// ONGLET 11
requisitionO12: Requisition
  reqFormO12: FormGroup
  

  angularGridO12: AngularGridInstance
  gridO12: any
  gridServiceO12: GridService
  dataViewO12: any
  columnDefinitionsO12: Column[]
  gridOptionsO12: GridOption
  datasetO12: any[]

  sequencesO12: []
  columnDefinitions1O12: Column[] = []
  gridOptions1O12: GridOption = {}
  gridObj1O12: any
  angularGrid1O12: AngularGridInstance

  providersO12: []
  columnDefinitions2O12: Column[] = []
  gridOptions2O12: GridOption = {}
  gridObj2O12: any
  angularGrid2O12: AngularGridInstance

  usersO12: []
  columnDefinitions3O12: Column[] = []
  gridOptions3O12: GridOption = {}
  gridObj3O12: any
  angularGrid3O12: AngularGridInstance

  itemsO12: []
  columnDefinitions4O12: Column[] = []
  gridOptions4O12: GridOption = {}
  gridObj4O12: any
  angularGrid4O12: AngularGridInstance
  
  causesO12: []
  columnDefinitions6O12: Column[] = []
  gridOptions6O12: GridOption = {}
  gridObj6O12: any
  angularGrid6O12: AngularGridInstance
  
employeO12: any
seqO12:any
selectedJobO12: any[] = [];
datasetempsO12: any[]
dataO12: any[]
unO12: any
year:any[] = [];
pt_dsgn_grpO12: any[]=[];
  pt_drawO12: any[] = [];
  // ONGLET 12
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private typesUtilsService: TypesUtilsService,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private subheaderService: SubheaderService,
        private layoutUtilsService: LayoutUtilsService,
        private layoutConfigService: LayoutConfigService,
        private addressService: AddressService,
        private codeService: CodeService,
        private modalService: NgbModal,
        private accountService: AccountService,
        private customerService: CustomerService,
        private siteService: SiteService,
        private taxService: TaxeService,
        private bankService: BankService,
        private deviseService: DeviseService,
        private cdr: ChangeDetectorRef,
        private sequenceService: SequenceService,
        config: NgbDropdownConfig,
        // fin onglet 1
        
        // fin onglet 2
        
    private repFB: FormBuilder,
    
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    
    private repertoryService: RepertoryService,
    // FIN ONGLET 3
    private empFB: FormBuilder,
    
    private employeService: EmployeService,
    private jobService: JobService,
    
    private userService: UsersService,
    private itemsService: ItemService,
    // ONGLET 4
    private qoFB: FormBuilder,
        private totFB: FormBuilder,
        private quoteService: QuoteService,
        private customersService: CustomerService,
        
        // ONGLET 5
        
        
        private locationDetailService: LocationDetailService,
        // ONGLET 6
        
    private soFB: FormBuilder,
    private totFBO7: FormBuilder,
    
    
    
    private sequencesService: SequenceService,
    private saleOrderService: SaleOrderService,
    
    private mesureService: MesureService,
    
    private locationService: LocationService,
    
    private inventoryStatusService: InventoryStatusService,
    
    private pricelistService: PricelistService,
    // ONGLET 7
    private ihFB: FormBuilder,
    private totFBO8: FormBuilder,
    private saleShiperService: SaleShiperService,
    private invoiceOrderService: InvoiceOrderTempService,
    
    // ONGLET 8
    private ihFBO9: FormBuilder,
    private totFBO9: FormBuilder,
    private invoiceOrderTempService: InvoiceOrderTempService,
    private productLineService: ProductLineService,
    private configService: ConfigService,
    private payMethService: PayMethService,
    // ONGLET 9
   
     
      private accountshipperService: AccountShiperService,
      private accountreceivableService: AccountReceivableService,
      
      // ONGLET 10
      private asFB: FormBuilder,
    
    
    private accountShiperService: AccountShiperService,
  
      // ONGLET 11
      private reqFB: FormBuilder,
      private requisitonService: RequisitionService,
      private providersService: ProviderService,
      private reasonService: ReasonService,
     
      // ONGLET 12
    ) {
      this.codeService
    .getBy({ code_fldname: "check_form" })
    .subscribe((response: any) => (this.as_pay_methodO11 = response.data));
      var y : any;
        for(var i=2025; i <= 2099;i++) {
          for (var j = 1; j <= 4; j++)
          {y = "T" + j + '-' + i
            this.year.push({y})}
          
        }
        this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (this.pt_drawO12 = response.data));
      this.codeService
      .getBy({ code_fldname: "pt_dsgn_grp" })
      .subscribe((response: any) => (this.pt_dsgn_grpO12 = response.data)); 
      
      this.initGridO12()
        config.autoClose = true
        this.prepareGridO10()
        this.codeService
            .getBy({ code_fldname: "ad_country" })
            .subscribe((response: any) => (this.ad_country = response.data))
        this.codeService
            .getBy({ code_fldname: "ad_state" })
            .subscribe((response: any) => (this.ad_state = response.data))
     //   this.codeService
       //     .getBy({ code_fldname: "ad_city" })
         //   .subscribe((response: any) => (this.ad_city = response.data))    
            
        this.codeService
            .getBy({ code_fldname: "cm_type" })
            .subscribe((response: any) => (this.cm_type = response.data))
        this.codeService
            .getBy({ code_fldname: "cm_class" })
            .subscribe((response: any) => (this.cm_class = response.data))
            this.codeService
            .getBy({ code_fldname: "cm_region" })
            .subscribe((response: any) => (this.cm_region = response.data))
        this.codeService
            .getBy({ code_fldname: "cm_shipvia" })
            .subscribe((response: any) => (this.cm_shipvia = response.data))
       
        this.codeService
            .getBy({ code_fldname: "cm_lang" })
            .subscribe((response: any) => (this.cm_lang = response.data))
        this.codeService
            .getBy({ code_fldname: "ad_tax_zone" })
            .subscribe((response: any) => (this.ad_tax_zone = response.data))
        
        this.codeService
            .getBy({ code_fldname: "ad_tax_usage" })
            .subscribe((response: any) => (this.ad_tax_usage = response.data))   
        //  fin onglet 1
        this.prepareGridO2();
        // fin onglet 2
        this.initGridO5()
        this.codeService
        .getBy({ code_fldname: "cm_cr_terms" })
        .subscribe((response: any) => (this.qo_cr_terms = response.data))
        // ONGLET 5
        this.prepareGridO6()
        // ONGLET 6
        this.codeService
      .getBy({ code_fldname: "cm_cr_terms" })
      .subscribe((response: any) => (this.so_cr_termsO7 = response.data));
    this.initGridO7();
    // ONGLET 7
    this.codeService
        .getBy({ code_fldname: "cm_cr_terms" })
        .subscribe((response: any) => (this.ith_cr_termsO8 = response.data));
      
      this.initGridihO8();
      // ONGLET 8
      this.configService.getOne( 1 ).subscribe(
        (resp: any) => {
          console.log("hhhhhhhhhhhhhhhhh",  resp.data.cfg_pay_multiple)
          if (resp.data.cfg_pay_multiple != null) {
          this.cfgO9 = resp.data.cfg_pay_multiple; } else { this.cfgO9 = false }
        
        console.log("cfg", this.cfgO9)
      if(this.cfgO9) {
        
          this.payMethService
           .getAll()
           .subscribe((response: any) => { 
             
            var data = []
            for (let code of response.data){
                data.push({code_value:  code.ct_code, code_cmmt: code.ct_desc})
            }
            console.log(data)
            
  
            
  
  
            
            this.ih_cr_termsO9 = data});
        console.log(this.ih_cr_termsO9)
  
  
      } else {
               this.codeService
                .getBy({ code_fldname: "cm_cr_terms" })
                .subscribe((response: any) => (this.ih_cr_termsO9 = response.data));
                console.log(this.ih_cr_termsO9)
             }
      })
        
        this.initGridihO9();
        this.initGridcfO9();
        // ONGLET 9
    }

    /**
      * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
      */

    /**
      * On init
      */
    ngOnInit() {
      this.createFormO11()
      this.createFormO12()
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.user =  JSON.parse(localStorage.getItem('user'))
        this.userO6 = JSON.parse(localStorage.getItem("user"));
        this.domainO6 = JSON.parse(localStorage.getItem("domain"));
        this.userO7 =  JSON.parse(localStorage.getItem('user'))
        this.init()
        this.createFormO5()
        this.createtotFormO5();
        this.createFormO7();
            this.createtotFormO7();
            this.resetO8();
              this.userO8 =  JSON.parse(localStorage.getItem('user'))
              this.createFormO8();
              this.createtotFormO8();
              this.resetO9();
            
            this.userO9 =  JSON.parse(localStorage.getItem('user'))
            this.createFormO9();
            this.createtotFormO9();
            this.activatedRoute.params.subscribe((params) => {
              const id = params.id;
              if (id) {
                const controls = this.soFormO7.controls;
        
                this.quoteService.findByOne({ id }).subscribe(
                  (res: any) => {
                    console.log("aa", res.data);
                    const { quote, details } = res.data;
                    this.qoServerO7 = quote;
        
                    controls.so_cust.setValue(this.qoServerO7.qo_cust);
                    controls.so_po.setValue(this.qoServerO7.qo_nbr);
                    controls.so_curr.setValue(this.qoServerO7.qo_curr);
                    this.customersService
                          .getBy({ cm_addr: this.qoServerO7.qo_cust })
                          .subscribe((res: any) => (this.customerO7 = res.data));
                    for (const object in details) {
                      const detail = details[object];
                      this.gridServiceO7.addItem(
                        {
                          id: this.datasetO7.length + 1,
                          sod_line: this.datasetO7.length + 1,
                         
                          sod_part: detail.qod_part,
                          cmvid: "",
                          desc: detail.item.pt_desc1,
                          sod_qty_ord: detail.qod_qty_ord,
                          sod_um: detail.qod_um,
                          sod_price: detail.qod_price,
                          sod_disc_pct: detail.qod_disc_pct,
                          sod_site: detail.item.pt_site,
                          sod_loc: detail.item.pt_loc,
                          sod_type: "M",
                          sod_cc: "",
                          sod_taxable: detail.item.pt_taxable,
                          sod_tax_code: detail.item.taxe.tx2_tax_code,
                          sod_taxc: detail.item.taxe.tx2_tax_pct,
                        },
                        { position: "bottom" }
                      );
                      this.datasetPrintO7.push({
                        id: this.datasetO7.length + 1,
                        sod_line: this.datasetO7.length + 1,
                       
                        sod_part: detail.qod_part,
                        cmvid: "",
                        desc: detail.item.pt_desc1,
                        sod_qty_ord: detail.qod_qty_ord,
                        sod_um: detail.qod_um,
                        sod_price: detail.qod_price,
                        sod_disc_pct: detail.qod_disc_pct,
                        sod_site: detail.item.pt_site,
                        sod_loc: detail.item.pt_loc,
                        sod_type: "M",
                        sod_cc: "",
                        sod_taxable: detail.item.pt_taxable,
                        sod_tax_code: detail.item.taxe.tx2_tax_code,
                        sod_taxc: detail.item.taxe.tx2_tax_pct,
                        taxe: detail.item.taxe.tx2_tax_pct,
                      });
                    }
                  },
                  (error) => {
                    this.message = ` ce numero ${id} n'existe pas`;
                    this.hasFormErrors = true;
                  },
                  () => {}
                );
              }
            });
        // sticky portlet header
        window.onload = () => {
            const style = getComputedStyle(document.getElementById("kt_header"))
            this.headerMargin = parseInt(style.height, 0)
        /*  const lang = "fr"
          if ( lang == "fr") {
            this.onchangelabel() } else {

            }*/
        }
        const controls  = this.addressForm.controls
        const controls1 = this.customerForm.controls
      
        this.addressService
            .getAll().subscribe((response: any) => {
                
                if (response.data.length != 0) {
                  this.nbr = response.data.length + 1
                  controls.ad_addr.setValue('CL'+String('000'+ String(this.nbr)).slice(-3))
                  
                    
                    controls.ad_name.enable()
                    controls.ad_line1.enable()
                    controls.ad_city.enable()
                    controls.ad_state.enable()
                    controls.ad_zip.enable()
                    controls.ad_country.enable()
                    controls.ad_temp.enable()
                    controls.ad_phone.enable()
                    controls.ad_phone2.enable()
                    controls.ad_ext.enable()
                    controls.ad_ext2.enable()
                    controls.ad_fax.enable()
                    controls.ad_fax2.enable()
                    controls.ad_attn.enable()
                    controls.ad_attn2.enable()
                    controls.ad_taxable.enable()
                    controls.ad_tax_zone.enable()
                    controls.ad_taxc.enable()
                    controls.ad_tax_usage.enable()
                    controls.ad_tax_in.enable()
                    controls.ad_gst_id.enable()
                    controls.ad_pst_id.enable()
                    controls.ad_misc1_id.enable()
                    controls.ad_misc2_id.enable()
                    
                    controls1.cm_sort.enable()
                    controls1.cm_seq.enable()
                    controls1.cm_type.enable()
                    controls1.cm_slspn.enable()
                    controls1.cm_region.enable()
                    
                    
                    
                    controls1.cm_shipvia.enable()
                    controls1.cm_curr.enable()
                    controls1.cm_ar_acct.enable()
                    controls1.cm_ar_sub.enable()
                    controls1.cm_ar_cc.enable()
                    
                    controls1.cm_resale.enable()
                    controls1.cm_site.enable()
                    controls1.cm_lang.enable()
                    controls1.cm_class.enable()
                    controls1.cm_sic.enable()
                    controls1.cm_bank.enable()
                    controls1.cm_pay_method.enable()
                    controls1.cm_fix_pr.enable()
                    controls1.cm_inv_auto.enable()
                    controls1.cm_partial.enable()
                    controls1.cm_cr_limit.enable()
                    controls1.cm_disc_pct.enable()
                    controls1.cm_bill.enable()
                    controls1.cm_cr_terms.enable()
                    controls1.cm_hold.enable()
                    controls1.cm_fin.enable()
                    controls1.cm_stmt.enable()
                    controls1.cm_cr_review.enable()
                    controls1.cm_cr_update.enable()
                    controls1.cm_db.enable()
                    controls1.cm_po_reqd.enable()
                    controls1.cm_stmt_cyc.enable()
                    controls1.cm_dun.enable()
                   
                  }
                  else{this.nbr =  1
                    controls.ad_addr.setValue('CL'+String('000'+ String(this.nbr)).slice(-3))
                    
                      
                      controls.ad_name.enable()
                      controls.ad_line1.enable()
                      controls.ad_city.enable()
                      controls.ad_state.enable()
                      controls.ad_zip.enable()
                      controls.ad_country.enable()
                      controls.ad_temp.enable()
                      controls.ad_phone.enable()
                      controls.ad_phone2.enable()
                      controls.ad_ext.enable()
                      controls.ad_ext2.enable()
                      controls.ad_fax.enable()
                      controls.ad_fax2.enable()
                      controls.ad_attn.enable()
                      controls.ad_attn2.enable()
                      controls.ad_taxable.enable()
                      controls.ad_tax_zone.enable()
                      controls.ad_taxc.enable()
                      controls.ad_tax_usage.enable()
                      controls.ad_tax_in.enable()
                      controls.ad_gst_id.enable()
                      controls.ad_pst_id.enable()
                      controls.ad_misc1_id.enable()
                      controls.ad_misc2_id.enable()
                      
                      controls1.cm_sort.enable()
                      controls1.cm_seq.enable()
                      controls1.cm_type.enable()
                      controls1.cm_slspn.enable()
                      controls1.cm_region.enable()
                      
                      
                      
                      controls1.cm_shipvia.enable()
                      controls1.cm_curr.enable()
                      controls1.cm_ar_acct.enable()
                      controls1.cm_ar_sub.enable()
                      controls1.cm_ar_cc.enable()
                      
                      controls1.cm_resale.enable()
                      controls1.cm_site.enable()
                      controls1.cm_lang.enable()
                      controls1.cm_class.enable()
                      controls1.cm_sic.enable()
                      controls1.cm_bank.enable()
                      controls1.cm_pay_method.enable()
                      controls1.cm_fix_pr.enable()
                      controls1.cm_inv_auto.enable()
                      controls1.cm_partial.enable()
                      controls1.cm_cr_limit.enable()
                      controls1.cm_disc_pct.enable()
                      controls1.cm_bill.enable()
                      controls1.cm_cr_terms.enable()
                      controls1.cm_hold.enable()
                      controls1.cm_fin.enable()
                      controls1.cm_stmt.enable()
                      controls1.cm_cr_review.enable()
                      controls1.cm_cr_update.enable()
                      controls1.cm_db.enable()
                      controls1.cm_po_reqd.enable()
                      controls1.cm_stmt_cyc.enable()
                      controls1.cm_dun.enable()
              }
                
          })
// FIN ONGLET 1
// FIN ONGLET 2
this.loading$ = this.loadingSubject.asObservable();

this.loadingSubject.next(false);
this.user =  JSON.parse(localStorage.getItem('user'))       


this.createFormO3();
this.initGridO3();
// FIN ONGLET 3
this.createFormO4()
    this.initmvGrid();
    this.initjbGrid()
    this.inittrGrid()
    const controlsO4 = this.empForm.controls
  this.employeService
      .getAll()
      .subscribe((response: any) => {
          if (response.data.length != 0) {this.nbr = response.data.length + 1}
          else{this.nbr = 1}
           controlsO4.emp_addr.setValue('E'+String('000'+ String(this.nbr)).slice(-3))
              controlsO4.emp_lname.enable()
              controlsO4.emp_fname.enable()
              controlsO4.emp_line1.enable()  
              controlsO4.emp_country.enable()
              controlsO4.emp_city.enable()
              controlsO4.emp_state.enable()
              controlsO4.emp_phone.enable()
              controlsO4.emp_mail.enable()
              controlsO4.emp_site.enable()
              controlsO4.emp_contact_fname.enable()
              controlsO4.emp_contact_lname.enable()
              controlsO4.emp_contact_adress.enable()
              controlsO4.emp_contact_tel.enable()
              controlsO4.emp_parent_liaison.enable()
              controlsO4.emp_userid.enable()
              controlsO4.emp_upper.enable()
              controlsO4.emp_job.enable()
              controlsO4.emp_level.enable()
              controlsO4.emp_line2.enable() 
              

          })
          // ONGLET 4
        
    }

   
    // loadProduct(_product, fromService: boolean = false) {
    //     if (!_product) {
    //         this.goBack("")
    //     }
    //     this.product = _product
    //     this.productId$ = of(_product.id)
    //     this.oldProduct = Object.assign({}, _product)
    //     this.initProduct()
    //     if (fromService) {
    //         this.cdr.detectChanges()
    //     }
    // }

    // // If product didn't find in store
    // loadProductFromService(productId) {
    //     this.productService.getProductById(productId).subscribe((res) => {
    //         this.loadProduct(res, true)
    //     })
    // }

    /**
      * On destroy
      */
    ngOnDestroy() {
        if (this.componentSubscriptions) {
            this.componentSubscriptions.unsubscribe()
        }
    }

    /**
      * Init product
      */
    init() {
        this.createAddressForm()
        this.createCustomerForm()
        
        this.loadingSubject.next(false)
        // if (!this.product.id) {
        //     this.subheaderService.setBreadcrumbs([
        //         { title: "eCommerce", page: `/ecommerce` },
        //         { title: "Products", page: `/ecommerce/products` },
        //         { title: "Create product", page: `/ecommerce/products/add` },
        //     ])
        //     return
        // }
        // this.subheaderService.setTitle("Edit product")
        // this.subheaderService.setBreadcrumbs([
        //     { title: "eCommerce", page: `/ecommerce` },
        //     { title: "Products", page: `/ecommerce/products` },
        //     {
        //         title: "Edit product",
        //         page: `/ecommerce/products/edit`,
        //         queryParams: { id: this.product.id },
        //     },
        // ])
       
    }

    /**
      * Create form
      */
    createAddressForm() {


      
       // document.getElementById("bill").focus();
        this.address = new Address()
        this.addressForm = this.formBuilder.group({
            ad_addr: [this.address.ad_addr, Validators.required],
            ad_name: [{ value: this.address.ad_name, disabled: !this.isExist },Validators.required],
            ad_line1:  [{ value: this.address.ad_line1, disabled: !this.isExist },Validators.required],
            ad_city: [{ value: this.address.ad_city, disabled: !this.isExist }],
            ad_state: [{ value: this.address.ad_state, disabled: !this.isExist }],
            ad_zip: [{ value: this.address.ad_zip, disabled: !this.isExist }],
            ad_country: [{ value: this.address.ad_country, disabled: !this.isExist }],
            ad_temp: [{ value: this.address.ad_temp, disabled: !this.isExist }],
            ad_phone: [{ value: this.address.ad_phone, disabled: !this.isExist }, Validators.required],
            ad_phone2: [{ value: this.address.ad_phone, disabled: !this.isExist }],
            ad_ext: [{ value: this.address.ad_ext, disabled: !this.isExist }],
            ad_ext2: [{ value: this.address.ad_ext2, disabled: !this.isExist }],
            ad_fax: [{ value: this.address.ad_fax, disabled: !this.isExist }],
            ad_fax2: [{ value: this.address.ad_fax2, disabled: !this.isExist }],
            ad_attn: [{ value: this.address.ad_attn, disabled: !this.isExist }],
            ad_attn2: [{ value: this.address.ad_attn2, disabled: !this.isExist }],
            ad_taxable: [{ value: this.address.ad_taxable, disabled: !this.isExist }],
            ad_tax_zone: [{ value: this.address.ad_tax_zone, disabled: !this.isExist }],
            ad_taxc: [{ value: this.address.ad_taxc, disabled: !this.isExist }],
            ad_tax_usage: [{ value: this.address.ad_tax_usage, disabled: !this.isExist }],
            ad_tax_in: [{ value: this.address.ad_tax_in, disabled: !this.isExist }],
            ad_gst_id: [{ value: this.address.ad_gst_id, disabled: !this.isExist }],
            ad_pst_id: [{ value: this.address.ad_pst_id, disabled: !this.isExist }],
            ad_misc1_id: [{ value: this.address.ad_misc1_id, disabled: !this.isExist }],
            ad_misc2_id: [{ value: this.address.ad_misc2_id, disabled: !this.isExist }],
        })
    }
    createCustomerForm() {
        this.customer = new Customer()
        this.customerForm = this.formBuilder.group({
            cm_sort: [{ value: this.customer.cm_sort, disabled: !this.isExist }],
            cm_seq: [{ value: this.customer.cm_seq, disabled: !this.isExist }],
            cm_type: [{ value: this.customer.cm_type, disabled: !this.isExist }],
            cm_slspn: [{ value: this.customer.cm_slspn, disabled: !this.isExist }],
            cm_region: [{ value: this.customer.cm_region, disabled: !this.isExist }],
            cm_ar_acct: [{ value: this.customer.cm_ar_acct, disabled: !this.isExist }],
            cm_ar_sub: [{ value: this.customer.cm_ar_sub, disabled: !this.isExist }],
            cm_ar_cc: [{ value: this.customer.cm_ar_cc, disabled: !this.isExist }],
            cm_shipvia: [{ value: this.customer.cm_shipvia, disabled: !this.isExist }],
            cm_site: [{ value: this.customer.cm_site, disabled: !this.isExist }],
            cm_lang: [{ value: this.customer.cm_lang, disabled: !this.isExist }],
            
            cm_bank: [{ value: this.customer.cm_bank, disabled: !this.isExist }],
            cm_curr: [{ value: this.customer.cm_curr, disabled: !this.isExist }],
            cm_class: [{ value: this.customer.cm_class, disabled: !this.isExist }],
            cm_resale: [{ value: this.customer.cm_resale, disabled: !this.isExist }],
            cm_sic: [{ value: this.customer.cm_sic, disabled: !this.isExist }],
            
            cm_pay_method: [{ value: this.customer.cm_pay_method, disabled: !this.isExist }],
            cm_fix_pr: [{ value: this.customer.cm_fix_pr, disabled: !this.isExist }],
            cm_inv_auto: [{ value: this.customer.cm_inv_auto, disabled: !this.isExist }],
            cm_cr_limit: [{ value: this.customer.cm_cr_limit, disabled: !this.isExist }],
            cm_disc_pct: [{ value: this.customer.cm_disc_pct, disabled: !this.isExist }],
            cm_bill: [{ value: this.customer.cm_bill, disabled: !this.isExist }],
            cm_cr_terms: [{ value: this.customer.cm_cr_terms, disabled: !this.isExist }],
            cm_fin: [{ value: this.customer.cm_fin, disabled: !this.isExist }],
            cm_stmt: [{ value: this.customer.cm_stmt, disabled: !this.isExist }],
            cm_po_reqd: [{ value: this.customer.cm_po_reqd, disabled: !this.isExist }],
            cm_partial: [{ value: this.customer.cm_partial, disabled: !this.isExist }],
            cm_hold: [{ value: this.customer.cm_hold, disabled: !this.isExist }],
            cm_dun: [{ value: this.customer.cm_dun, disabled: !this.isExist }],
            cm_db: [{ value: this.customer.cm_db, disabled: !this.isExist }],
            cm_stmt_cyc: [{ value: this.customer.cm_stmt_cyc, disabled: !this.isExist }],
            cm_cr_review: [{ value: this.customer.cm_cr_review, disabled: !this.isExist }],
            cm_cr_update: [{ value: this.customer.cm_cr_update, disabled: !this.isExist }],

        })
    }

    onChangeState() {
        const controls  = this.addressForm.controls
       console.log(controls.ad_state.value)
        this.codeService
            .getBy({ code_fldname: "ad_city", chr01: controls.ad_state.value.substring(0, 2) })
            .subscribe((response: any) => {(this.ad_city = response.data)
            console.log(response.data)})    
    }

   /* onchangelabel(){
console.log("hhhhhhhhhhhhhhhlllllllllllllllllllllllllllllll")
      document.getElementById('code').innerHTML = 'Couuuude';
    }*/
    onChangeCode() {
        const controls  = this.addressForm.controls
        const controls1 = this.customerForm.controls
      
        this.addressService
            .getBy({
                  ad_addr: controls.ad_addr.value,
            })
            .subscribe((response: any) => {
                
                if (response.data) {
                    this.isExist = true
                    console.log(response.data)
                    
                } else {
                    
                    controls.ad_name.enable()
                    controls.ad_line1.enable()
                    controls.ad_city.enable()
                    controls.ad_state.enable()
                    controls.ad_zip.enable()
                    controls.ad_country.enable()
                    controls.ad_temp.enable()
                    controls.ad_phone.enable()
                    controls.ad_phone2.enable()
                    controls.ad_ext.enable()
                    controls.ad_ext2.enable()
                    controls.ad_fax.enable()
                    controls.ad_fax2.enable()
                    controls.ad_attn.enable()
                    controls.ad_attn2.enable()
                    controls.ad_taxable.enable()
                    controls.ad_tax_zone.enable()
                    controls.ad_taxc.enable()
                    controls.ad_tax_usage.enable()
                    controls.ad_tax_in.enable()
                    controls.ad_gst_id.enable()
                    controls.ad_pst_id.enable()
                    controls.ad_misc1_id.enable()
                    controls.ad_misc2_id.enable()
                    
                    controls1.cm_sort.enable()
                    controls1.cm_seq.enable()
                    controls1.cm_type.enable()
                    controls1.cm_slspn.enable()
                    controls1.cm_region.enable()
                    
                    
                    
                    controls1.cm_shipvia.enable()
                    controls1.cm_curr.enable()
                    controls1.cm_ar_acct.enable()
                    controls1.cm_ar_sub.enable()
                    controls1.cm_ar_cc.enable()
                    
                    controls1.cm_resale.enable()
                    controls1.cm_site.enable()
                    controls1.cm_lang.enable()
                    controls1.cm_class.enable()
                    controls1.cm_sic.enable()
                    controls1.cm_bank.enable()
                    controls1.cm_pay_method.enable()
                    controls1.cm_fix_pr.enable()
                    controls1.cm_inv_auto.enable()
                    controls1.cm_partial.enable()
                    controls1.cm_cr_limit.enable()
                    controls1.cm_disc_pct.enable()
                    controls1.cm_bill.enable()
                    controls1.cm_cr_terms.enable()
                    controls1.cm_hold.enable()
                    controls1.cm_fin.enable()
                    controls1.cm_stmt.enable()
                    controls1.cm_cr_review.enable()
                    controls1.cm_cr_update.enable()
                    controls1.cm_db.enable()
                    controls1.cm_po_reqd.enable()
                    controls1.cm_stmt_cyc.enable()
                    controls1.cm_dun.enable()
                   
                  }
                
          })
      }
    /**
      * Go back to the list
      *
      * @param id: any
      */
    goBack() {
        this.loadingSubject.next(false)
        const url = `/customers/customer-list`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }

    goBackWithoutId() {
        this.router.navigateByUrl("/customers/customer-list", {
            relativeTo: this.activatedRoute,
        })
    }

    
    /**
      * Reset
      */
    reset() {
        this.address = new Address()
        this.customer = new Customer()
        this.createAddressForm()
        this.createCustomerForm()
        this.hasFormErrors = false
        this.hascustomerFormErrors = false
    }

    /**
      * Save data
      *
      * @param withBack: boolean
      */
    onSubmit() {
        this.hasFormErrors = false
        const controls = this.addressForm.controls
        const controls_ = this.customerForm.controls
        /** check form */
        if (this.addressForm.invalid) {
            Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hasFormErrors = true
            this.selectedTab = 0
            return
        }
        if (this.customerForm.invalid) {
            Object.keys(controls_).forEach((controlName) =>
                controls[controlName].markAsTouched()
            )

            this.hascustomerFormErrors = true
            return
        }

        let address = this.prepareAddress()
        this.addAddress(address)
    }

    /**
      * Returns object for saving
      */
    prepareAddress(): Address {
        const controls = this.addressForm.controls
        const controls1 = this.customerForm.controls

        const _address = new Address()
        console.log(controls.ad_temp.value)
        _address.ad_addr = controls.ad_addr.value
        _address.ad_name = controls.ad_name.value
        _address.ad_line1 = controls.ad_line1.value
        _address.ad_city = controls.ad_city.value
        _address.ad_state = controls.ad_state.value
        _address.ad_zip = controls.ad_zip.value
        _address.ad_country = controls.ad_country.value
        _address.ad_type = "customer"
        _address.ad_temp = controls.ad_temp.value
        _address.ad_phone = controls.ad_phone.value
        _address.ad_phone2 = controls.ad_phone2.value
        _address.ad_ext = controls.ad_ext.value
        _address.ad_ext2 = controls.ad_ext2.value
        _address.ad_fax = controls.ad_fax.value
        _address.ad_fax2 = controls.ad_fax2.value
        _address.ad_attn = controls.ad_attn.value
        _address.ad_attn2 = controls.ad_attn2.value
        _address.ad_taxable = controls.ad_taxable.value
        _address.ad_tax_zone = controls.ad_tax_zone.value
        _address.ad_taxc = controls.ad_taxc.value
        _address.ad_tax_usage = controls.ad_tax_usage.value
        _address.ad_tax_in = controls.ad_tax_in.value
        _address.ad_gst_id = controls.ad_gst_id.value
        _address.ad_pst_id = controls.ad_pst_id.value
        _address.ad_misc1_id = controls.ad_misc1_id.value
        _address.ad_misc2_id = controls.ad_misc2_id.value
        _address.ad_date = new Date()
        this.address = _address
        return _address
    }

    /**
      * Add product
      *
      * @param _product: ProductModel
      */
    addAddress(_address: Address) {
        this.loadingSubject.next(true)
        this.addressService.addAddress(_address).subscribe(
            (reponse: any) => console.log(reponse),
            (error) =>
                this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                ),
            () => {
                let customer = this.prepareCustomer()
                this.addCustomer(customer)
            }
        )
    }

    /**
      * Returns object for saving
      */
    prepareCustomer(): Customer {
        const controls = this.customerForm.controls
        const _customer = new Customer()
        _customer.cm_addr = this.address.ad_addr
        if(controls.cm_sort.value == null){_customer.cm_sort = this.address.ad_name}
        else{_customer.cm_sort = controls.cm_sort.value}
        _customer.cm_type = controls.cm_type.value
        _customer.cm_seq = controls.cm_seq.value
    
        _customer.cm_slspn = controls.cm_slspn.value
        _customer.cm_region = controls.cm_region.value
    
        _customer.cm_ar_acct = controls.cm_ar_acct.value
        _customer.cm_ar_sub = controls.cm_ar_sub.value
        _customer.cm_ar_cc = controls.cm_ar_cc.value
        _customer.cm_shipvia = controls.cm_shipvia.value
        _customer.cm_bank = controls.cm_bank.value
        _customer.cm_lang = controls.cm_lang.value
        _customer.cm_curr = controls.cm_curr.value
        _customer.cm_site = controls.cm_site.value
        _customer.cm_resale = controls.cm_resale.value
        _customer.cm_class = controls.cm_class.value
        
       
        _customer.cm_fix_pr = controls.cm_fix_pr.value
        _customer.cm_inv_auto = controls.cm_inv_auto.value
        
        _customer.cm_cr_limit = controls.cm_cr_limit.value
        _customer.cm_bill = controls.cm_bill.value

        _customer.cm_fin = controls.cm_fin.value
        _customer.cm_stmt = controls.cm_stmt.value
        _customer.cm_sic = controls.cm_sic.value
        _customer.cm_bank = controls.cm_bank.value
        
        _customer.cm_pay_method = controls.cm_pay_method.value
        _customer.cm_hold = controls.cm_hold.value
        _customer.cm_cr_terms = controls.cm_cr_terms.value
        _customer.cm_disc_pct = controls.cm_disc_pct.value
        _customer.cm_po_reqd = controls.cm_po_reqd.value
        _customer.cm_partial = controls.cm_partial.value
        _customer.cm_hold = controls.cm_hold.value

        
        _customer.cm_db = controls.cm_db.value
        _customer.cm_dun = controls.cm_dun.value
        _customer.cm_stmt_cyc = controls.cm_stmt_cyc.value
        
        _customer.cm_cr_review = controls.cm_cr_review.value
            ? `${controls.cm_cr_review.value.year}/${controls.cm_cr_review.value.month}/${controls.cm_cr_review.value.day}`
            : null
        _customer.cm_cr_update = controls.cm_cr_update.value
            ? `${controls.cm_cr_update.value.year}/${controls.cm_cr_update.value.month}/${controls.cm_cr_update.value.day}`
            : null
        return _customer
    }

    /**
      * Add product
      *
      * @param _product: ProductModel
      */
    addCustomer(_customer: Customer) {
        this.loadingSubject.next(true)
        this.customerService.add(_customer).subscribe(
            (reponse) => console.log("response", Response),
            (error) =>
                this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                ),
            () => {
                this.layoutUtilsService.showActionNotification(
                    "Ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                 this.router.navigateByUrl("/training/gestion-commerciale")
            }
        )
        // this.store.dispatch(new ProductOnServerCreated({ product: _product }))
        // this.componentSubscriptions = this.store
        //     .pipe(delay(1000), select(selectLastCreatedProductId))
        //     .subscribe((newId) => {
        //         if (!newId) {
        //             return
        //         }

        //         this.loadingSubject.next(false)
        //         if (withBack) {
        //             this.goBack(newId)
        //         } else {
        //             const message = `New product successfully has been added.`
        //             this.layoutUtilsService.showActionNotification(
        //                 message,
        //                 MessageType.Create,
        //                 10000,
        //                 true,
        //                 true
        //             )
        //             this.refreshProduct(true, newId)
        //         }
        //     })
    }

    // /**
    //  * Update product
    //  *
    //  * @param _product: ProductModel
    //  * @param withBack: boolean
    //  */
    // updateProduct(_product: ProductModel, withBack: boolean = false) {
    //     this.loadingSubject.next(true)

    //     const updateProduct: Update<ProductModel> = {
    //         id: _product.id,
    //         changes: _product,
    //     }

    //     this.store.dispatch(
    //         new ProductUpdated({
    //             partialProduct: updateProduct,
    //             product: _product,
    //         })
    //     )

    //     of(undefined)
    //         .pipe(delay(3000))
    //         .subscribe(() => {
    //             // Remove this line
    //             if (withBack) {
    //                 this.goBack(_product.id)
    //             } else {
    //                 const message = `Product successfully has been saved.`
    //                 this.layoutUtilsService.showActionNotification(
    //                     message,
    //                     MessageType.Update,
    //                     10000,
    //                     true,
    //                     true
    //                 )
    //                 this.refreshProduct(false)
    //             }
    //         }) // Remove this line
    // }

    /**
      * Returns component title
      */
    getComponentTitle() {
        let result = "Ajouter Client"
        // if (!this.product || !this.product.id) {
        //     return result
        // }

        // result = `Modifier Fournisseur - `
        return result
    }

    /**
      * Close alert
      *
      * @param $event
      */
    onAlertClose($event) {
        this.hasFormErrors = false
    }


    changeAcct (field){

        const controls1 = this.customerForm.controls 
        let ac_code : any
        if (field=="cm_ar_acct") {
            ac_code  = controls1.cm_ar_acct.value
        
        }
       
        
      this.accountService.getBy({ac_code}).subscribe((res:any)=>{
          const {data} = res
          console.log(res)
          if (!data){ this.layoutUtilsService.showActionNotification(
              "ce compte n'existe pas!",
              MessageType.Create,
              10000,
              true,
              true
          )
          this.error = true}
          else {
              this.error = false
          }
    
    
      },error=>console.log(error))
    }


    changeBank (){

      const controls1 = this.customerForm.controls 
      const bk_code  = controls1.cm_bank.value
     
      
    this.bankService.getBy({bk_code}).subscribe((res:any)=>{
        //const {data} = res.data.bank
        //console.log(res.data.bank)
        if (res.data.bank == null){ this.layoutUtilsService.showActionNotification(
            "cette banque n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.error = true}
        else {
            this.error = false
        }
  
  
    },error=>console.log(error))
  }
    
    

    handleSelectedRowsChanged3(e, args) {
        const controls1 = this.customerForm.controls
        
    
        if (Array.isArray(args.rows) && this.gridObj3) {
            args.rows.map((idx) => {
                const item = this.gridObj3.getDataItem(idx)
                // TODO : HERE itterate on selected field and change the value of the selected field
                switch (this.selectedField) {
                    
                  case "cm_ar_acct": {
                      controls1.cm_ar_acct.setValue(item.ac_code || "")
                      break
                  }
                    default:
                        break
                }
            })
        }
    }
      angularGridReady3(angularGrid: AngularGridInstance) {
        this.angularGrid3 = angularGrid
        this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
    }
    
    prepareGrid3() {
        this.columnDefinitions3 = [
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
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "ac_code",
                name: "Compte",
                field: "ac_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "ac_desc",
                name: "Designation",
                field: "ac_desc",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "ac_type",
                name: "Type",
                field: "ac_type",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
              id: "ac_curr",
              name: "Devise",
              field: "ac_curr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "ac_stat_acc",
              name: "Compte Statique",
              field: "ac_stat_acc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
    
        ]
    
        this.gridOptions3 = {
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
            },
            multiSelect: false,
            rowSelectionOptions: {
                selectActiveRow: true,
            },
        }
    
        // fill the dataset with your data
        this.accountService
            .getAll()
            .subscribe((response: any) => (this.data = response.data))
    }
    open3(content, field) {
        this.selectedField = field
        this.prepareGrid3()
        this.modalService.open(content, { size: "lg" })
    }
    
    handleSelectedRowsChangedbank(e, args) {
        const controls = this.customerForm.controls
        if (Array.isArray(args.rows) && this.gridObjbank) {
            args.rows.map((idx) => {
                const item = this.gridObjbank.getDataItem(idx)
                controls.cm_bank.setValue(item.bk_code || "")
            })
        }
    }
    
      angularGridReadybank(angularGrid: AngularGridInstance) {
        this.angularGridbank = angularGrid
        this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {}
    }
    
    prepareGridbank() {
        this.columnDefinitionsbank = [
            {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "bk_code",
                name: "code ",
                field: "bk_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "bk_desc",
                name: "Designation",
                field: "bk_desc",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "bk_curr",
                name: "devise",
                field: "bk_curr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
              id: "bk_entity",
              name: "Entité",
              field: "bk_entity",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },

        ]
    
        this.gridOptionsbank = {
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
        }
    
        // fill the dataset with your data
        this.bankService
            .getAll()
            .subscribe((response: any) => (this.databank = response.data))
    }
    openbank(content) {
        this.prepareGridbank()
        this.modalService.open(content, { size: "lg" })
    }
    

    handleSelectedRowsChanged4(e, args) {
        const controls1 = this.customerForm.controls;
        
        if (Array.isArray(args.rows) && this.gridObj4) {
          args.rows.map((idx) => {
            const item = this.gridObj4.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            console.log(this.selectedField)
            switch (this.selectedField) {
              case "cm_cr_terms": {
                controls1.cm_cr_terms.setValue(item.code_value || "");
                break;
              }
              
              case "cm_pay_method": {
                controls1.cm_pay_method.setValue(item.code_value || "");
                break;
              }
             
              
              default:
                break;
            }
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
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
    
            minWidth: 50,
            maxWidth: 50,
          },
          {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
          },
          {
            id: "code_fldname",
            name: "Champs",
            field: "code_fldname",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "code_value",
            name: "Code",
            field: "code_value",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "code_cmmt",
            name: "Description",
            field: "code_cmmt",
            sortable: true,
            width: 200,
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
          checkboxSelector: {},
          multiSelect: false,
          rowSelectionOptions: {
            selectActiveRow: true,
          },
        };


        if (this.selectedField == "cm_pay_method") {

          this.fldname = "check_form"
        }
        else {
          this.fldname = this.selectedField
        }
    
        // fill the dataset with your data
        this.codeService
          .getBy({ code_fldname: this.fldname })
          .subscribe((response: any) => (this.datacode = response.data));
      }

      open4(content, field) {
        this.selectedField = field;
        this.prepareGrid4();
        this.modalService.open(content, { size: "lg" });
      }





      handleSelectedRowsChangedsite(e, args) {
        const controls1 = this.customerForm.controls;
       
    
        if (Array.isArray(args.rows) && this.gridObjsite) {
          args.rows.map((idx) => {
            const item = this.gridObjsite.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "cm_site": {
                controls1.cm_site.setValue(item.si_site || "");
                break;
              }
              
              default:
                break;
            }
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
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
    
            minWidth: 50,
            maxWidth: 50,
          },
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
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          frozenColumn: 0,
          frozenBottom: true,
          enableRowSelection: true,
          enableCheckboxSelector: true,
          checkboxSelector: {},
          multiSelect: false,
          rowSelectionOptions: {
            selectActiveRow: true,
          },
        };
    
        // fill the dataset with your data
        this.siteService
          .getAll()
          .subscribe((response: any) => (this.datasite = response.data));
      }
      opensite(contentsite, field) {
        this.selectedField = field;
        this.prepareGridsite();
        this.modalService.open(contentsite, { size: "lg" });
      }

      handleSelectedRowsChanged2(e, args) {
        const controls = this.customerForm.controls;
        if (Array.isArray(args.rows) && this.gridObj2) {
          args.rows.map((idx) => {
            const item = this.gridObj2.getDataItem(idx);
            controls.cm_curr.setValue(item.cu_curr || "");
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
            id: "cu_curr",
            name: "code",
            field: "cu_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "cu_desc",
            name: "Designation",
            field: "cu_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "cu_rnd_mthd",
            name: "Methode Arrondi",
            field: "cu_rnd_mthd",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "cu_active",
            name: "Actif",
            field: "cu_active",
            sortable: true,
            filterable: true,
            type: FieldType.boolean,
          },
          {
            id: "cu_iso_curr",
            name: "Devise Iso",
            field: "cu_iso_curr",
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
        };
    
        // fill the dataset with your data
        this.deviseService
          .getAll()
          .subscribe((response: any) => (this.devises = response.data));
      }
      open2(content) {
        this.prepareGrid2();
        this.modalService.open(content, { size: "lg" });
      }
    

      

      handleSelectedRowsChangedtax(e, args) {
        const controls = this.addressForm.controls
        if (Array.isArray(args.rows) && this.gridObjtax) {
            args.rows.map((idx) => {
                const item = this.gridObjtax.getDataItem(idx)
                controls.ad_taxc.setValue(item.tx2_tax_code || "")
            })
        }
    }
    
      angularGridReadytax(angularGrid: AngularGridInstance) {
        this.angularGridtax = angularGrid
        this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {}
    }
    
    prepareGridtax() {
        this.columnDefinitionstax = [
            {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                id: "tx2_tax_code",
                name: "code ",
                field: "tx2_tax_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
              id: "tx2_tax_pct",
              name: "Taux Taxe ",
              field: "tx2_tax_pct",
              sortable: true,
              filterable: true,
              type: FieldType.float,
          },
            {
                id: "tx2_desc",
                name: "Designation",
                field: "tx2_desc",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "tx2_tax_type",
                name: "Type Taxe",
                field: "tx2_tax_type",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
        ]
    
        this.gridOptionstax = {
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
        }
    
        // fill the dataset with your data
        this.taxService
            .getAll()
            .subscribe((response: any) => (this.datatax = response.data))
    }
    opentax(contenttax) {
        this.prepareGridtax()
        this.modalService.open(contenttax, { size: "lg" })
    }
    
    onChangeCust() {
      const controls = this.customerForm.controls; // chof le champs hada wesh men form rah
      const cm_addr = controls.cm_bill.value;
     
      this.customerService.getBy({ cm_addr, cm_hold: false }).subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;
  
          if (!data) {
            this.layoutUtilsService.showActionNotification(
              "ce client n'existe pas! ou bien bloqué",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.error = true;
          } else {
            this.error = false;
            this.customer = res.data; 
            controls.cm_bill.setValue(data.cm_addr || "");
           
          }
           
        },
        (error) => console.log(error)
      );
    }
    handleSelectedRowsChanged5(e, args) {
      const controls = this.customerForm.controls;
      if (Array.isArray(args.rows) && this.gridObj2) {
        args.rows.map((idx) => {
          const item = this.gridObj2.getDataItem(idx);
          console.log(item)
          const date = new Date()
  
  
          this.customer = item;
          controls.cm_bill.setValue(item.cm_addr || "");
          
         
         
          
  
        });
      }
    }
  
    angularGridReady5(angularGrid: AngularGridInstance) {
      this.angularGrid5 = angularGrid;
      this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
    }
  
    prepareGrid5() {
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
  
      this.gridOptions5 = {
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
      this.customerService
        .getByAll({ cm_hold: false })
        .subscribe((response: any) => (this.customers = response.data));
    }
    open5(content) {
      this.prepareGrid5();
      this.modalService.open(content, { size: "lg" });
    }

  onChangeSeq() {
      const controls = this.customerForm.controls
      console.log(this.user.usrd_profile)
      this.sequenceService
          .getBy({seq_seq: controls.cm_seq.value, seq_type: 'SO'})
          .subscribe((response: any) => {
              console.log(response)
              if (response.data.length == 0) {
                  alert("Sequence nexiste pas")
                  controls.cm_seq.setValue("")
                  console.log(response.data.length)
                  document.getElementById("SEQUENCE").focus();
              } 
          })
  }
    handleSelectedRowsChanged(e, args) {
      const controls = this.customerForm.controls
      if (Array.isArray(args.rows) && this.gridObj1) {
          args.rows.map((idx) => {
              const item = this.gridObj1.getDataItem(idx)
              controls.cm_seq.setValue(item.seq_seq || "")
          })
      }
  }
  
  angularGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid1 = angularGrid
      this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGrid1() {
      this.columnDefinitions1 = [
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
          {
              id: "seq_seq",
              name: "code sequence",
              field: "seq_seq",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_desc",
              name: "description",
              field: "seq_desc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_appr1",
              name: "approbateur 1",
              field: "seq_appr1",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_appr2",
              name: "approbateur 2",
              field: "seq_appr2",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "seq_appr3",
              name: "approbateur 3",
              field: "seq_appr3",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
      ]
  
      this.gridOptions1 = {
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
      }
  
      // fill the dataset with your data
     
      this.sequenceService
          .getBy({seq_type: 'SO'})
          .subscribe((response: any) => (this.sequences = response.data))
         
  }
  open1(content) {
      this.prepareGrid1()
      this.modalService.open(content, { size: "lg" })
  }
  // fin onglet 1
  angularGridReadyO2(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.gridObj = angularGrid.slickGrid; // grid object
      this.dataview = angularGrid.dataView;
    }
  prepareGridO2() {
      this.columnDefinitions = [
        {
          id: "edit",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: (row, cell, value, columnDef, dataContext) => {
            // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
            return `
                <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
                <span class="svg-icon svg-icon-md">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                        height="24px" viewBox="0 0 24 24" version="1.1">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <rect x="0" y="0" width="24" height="24"></rect>
                            <path
                                d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                                fill="#000000" fill-rule="nonzero"
                                transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                            </path>
                            <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                        </g>
                    </svg>
                </span>
            </a>
            `;
          },
          minWidth: 50,
          maxWidth: 50,
          // use onCellClick OR grid.onClick.subscribe which you can see down below
          onCellClick: (e: Event, args: OnEventArgs) => {
            const id = args.dataContext.id;
            this.router.navigateByUrl(`/customers/edit/${id}`);
          },
        },
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
          id: "ad_line1",
          name: "Adresse",
          field: "address.ad_line1",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ad_line2",
          name: "Adresse",
          field: "address.ad_line2",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
  
        {
          id: "ad_city",
          name: "City",
          field: "address.ad_city",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ad_ctry",
          name: "Pays",
          field: "address.ad_country",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ad_format",
          name: "Age",
          field: "address.ad_format",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: "ad_format",
            formatter: (g) =>
              `Age: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregateCollapsed: false,
            collapsed: false,
          },
        },
  
        // {
        //   id: "ad_ref",
        //   name: "Sexe",
        //   field: "address.ad_ref",
        //   sortable: true,
        //   filterable: true,
        //   type: FieldType.string,
        //   grouping: {
        //     getter: "ad_ref",
        //     formatter: (g) =>
        //       `Sexe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
        //     aggregateCollapsed: false,
        //     collapsed: false,
        //   },
        // },
        {
          id: "ad_ext",
          name: "Email",
          field: "address.ad_ext",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "cm_db",
          name: "Promo",
          field: "cm_db",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: "cm_db",
            formatter: (g) =>
              `Promo: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregateCollapsed: false,
            collapsed: false,
          },
        },
        {
          id: "cm_seq",
          name: "Sequence",
          field: "cm_seq",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: "cm_seq",
            formatter: (g) =>
              `Sequence: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregateCollapsed: false,
            collapsed: false,
          },
        },
        {
          id: "cm_type",
          name: "Type",
          field: "cm_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: "cm_type",
            formatter: (g) =>
              `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregateCollapsed: false,
            collapsed: false,
          },
        },
  
        {
          id: "cm_class",
          name: "Classe",
          field: "cm_class",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: "cm_class",
            formatter: (g) =>
              `Classe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregateCollapsed: false,
            collapsed: false,
          },
        },
        {
          id: "cm_hold",
          name: "Bloc",
          field: "cm_hold",
          sortable: true,
          filterable: true,
          formatter: myCustomCheckboxFormatter,
  
          type: FieldType.boolean,
          grouping: {
            getter: "cm_hold",
            formatter: (g) =>
              `Bloc: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregateCollapsed: false,
            collapsed: false,
          },
        },
        {
          id: "ad_misc2_id",
          name: "Matricule Fiscal",
          field: "cm_rmks",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "cm_curr",
          name: "Devise",
          field: "cm_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
  
        {
          id: "ad_pst_id",
          name: "Article Imposition",
          field: "address.ad_pst_id",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
  
        {
          id: "ad_gst_id",
          name: "Registre Commerce",
          field: "address.ad_gst_id",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
      ];
  
      this.gridOptions = {
        
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
      this.dataset = [];
      this.user =  JSON.parse(localStorage.getItem('user'))
      if(this.user.usrd_site == '*')
      {this.customerService.getAll().subscribe(
        (response: any) => {
          this.dataset = response.data;
          this.dataview.setItems(this.dataset);
        },
        (error) => {
          this.dataset = [];
        },
        () => {}
      );}
      else{
        console.log(this.user.usrd_site)
        this.customerService.getByAll({cm_site:this.user.usrd_site}).subscribe(
          (response: any) => {
            this.dataset = response.data;
            this.dataview.setItems(this.dataset);
          },
          (error) => {
            this.dataset = [];
          },
          () => {}
        );
      }
      
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
    createcustomer() {
      this.loadingSubject.next(false)
      const url = `/customers/customer-create`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  replist() {
    this.loadingSubject.next(false)
    const url = `/customers/list-rep`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  quotelist() {
    this.loadingSubject.next(false)
    const url = `/sales/req-list`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  invoicelist() {
    this.loadingSubject.next(false)
    const url = `/sales/list-invoices`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  recouvrement() {
    this.loadingSubject.next(false)
    const url = `/sales/payment-psh`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  reqlist() {
    this.loadingSubject.next(false)
    const url = `/training/create-req-training`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  reclamation() {
    this.loadingSubject.next(false)
    const url = `/customers/customer-reclamation`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  // fin onglet 2
  angularGridReadyO3(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid;
      this.gridObjO3 = (angularGrid && angularGrid.slickGrid) || {};
      this.dataView = angularGrid.dataView;
      this.gridService = angularGrid.gridService;
    }
  
    initGridO3() {
      this.reps = [];
      this.columnDefinitionsO3 = [
        {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 50,
          maxWidth: 50,
          filterable: true,
          
        },
        {
          id: "rep_contact",
          name: "Contact",
          field: "rep_contact",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          editor: {
            model: Editors.text,
          }
        },
        {
          id: "rep_type",
          name: "Type",
          field: "rep_type",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          editor: {
            model: Editors.singleSelect,
  
            enableRenderHtml: true,
            collectionAsync:  this.http.get(`${API_URL}/rep_type`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
        
           
          },
          onCellChange:(e: Event, args: OnEventArgs) => {this.adtype = args.dataContext.rep_type}
        },
        {
          id: "rep_code",
          name: "Appartenance",
          field: "rep_code",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          editor: {
            model: Editors.text,
           
          },
        },
        {
          id: "mvid",
          name: "addresse",
          field: "cmvid",
          excludeFromHeaderMenu: true,
          formatter: Formatters.infoIcon,
          minWidth: 30,
          maxWidth: 30,
          onCellClick: (e: Event, args: OnEventArgs) => { 
           
              this.row_number = args.row;
              let element: HTMLElement = document.getElementById("openvdGrid") as HTMLElement;
              element.click();
            
          },
        },
        {
          id: "chr01",
          name: "Métier",
          field: "chr01",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
         
          editor: {
            model: Editors.singleSelect,
  
            enableRenderHtml: true,
            collectionAsync:  this.http.get(`${API_URL}/rep_job`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
        
           
          },
          
        },
        {
          id: "rep_post",
          name: "Poste",
          field: "rep_post",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
         
          editor: {
            model: Editors.singleSelect,
  
            enableRenderHtml: true,
            collectionAsync:  this.http.get(`${API_URL}/postes`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
        
           
          },
          
        },
        {
          id: "rep_tel",
          name: "TEL Mobile",
          field: "rep_tel",
          sortable: true,
          width: 80,
          type: FieldType.string,
          editor: {
            model: Editors.text,
          }
  
        },
        {
          id: "rep_tel2",
          name: "TEL Fix",
          field: "rep_tel2",
          sortable: true,
          width: 80,
          type: FieldType.string,
          editor: {
            model: Editors.text,
          }
  
        },
        {
          id: "rep_email",
          name: "Email",
          field: "rep_email",
          sortable: true,
          width: 80,
          type: FieldType.string,
          editor: {
            model: Editors.text,
          }
  
        },
      ];
  
      this.gridOptionsO3 = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        editable: true,
        autoHeight: false,
        autoCommitEdit:true,
        
      };
  
      // fill the dataset with your data
     this.repertoryService.getBy({}).subscribe(
        (response: any) => {   
          this.reps = response.data
         console.log(this.reps)
         this.dataView.setItems(this.reps);
          
           },
        (error) => {
            this.reps = []
        },
        () => {}
    )
    }
  
    getRep() {
      this.reps = []
     
      const controls = this.repForm.controls
      
    
     
      this.repertoryService.getBy({}).subscribe(
        (response: any) => {   
          this.reps = response.data
         console.log(this.reps)
         this.dataView.setItems(this.reps);
          
           },
        (error) => {
            this.reps = []
        },
        () => {}
    )
    }
    onSubmitO3() {
      const controls = this.repForm.controls
    
      for (let data of this.reps) {
        delete data.id;
      
      }
      this.repertoryService.add({addr: controls.cust.value,repDetails: this.reps }).subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur verifier les informations",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.loadingSubject.next(false);
        },
        () => {
          this.layoutUtilsService.showActionNotification(
            "Ajout avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          // this.reps=[]
          this.resetO3()
          this.loadingSubject.next(false);
        }
      );
    }
    createFormO3() {
      this.loadingSubject.next(false)
    //create form
    
    this.repForm = this.repFB.group({
        cust: [ ""]
    
    })
  }
  
  // prepareCode(): any {
  //   const controls = this.empForm.controls
  //   const _addReport = new AddReport()
  //   _addReport.pmr_pm_code = controls.pmr_pm_code.value
  //   _addReport.pmr_inst = controls.pmr_inst.value
  //   _addReport.pmr_task = controls.pmr_task.value
  //   _addReport.pmr_task_status = controls.pmr_task_status.value
  //   _addReport.pmr_close = controls.pmr_close.value
   
    
  //   return _addReport
  // }
  
  
    
    //reste form
    resetO3() {
      
      this.createFormO3();
      this.hasFormErrors = false;
      // this.reps = []; 
    }
    // save data
  //   onSubmit() {
  //     console.log("haha")
  //     this.hasFormErrors = false;
  //     const controls = this.empForm.controls;
  //     /** check form */
  //     if (this.empForm.invalid) {
  //       Object.keys(controls).forEach((controlName) =>
  //         controls[controlName].markAsTouched()
  //       );
  //       this.message = "Modifiez quelques éléments et réessayez de soumettre.";
  //       this.hasFormErrors = true;
  //       return;
  //     }
  
  //           let pme = this.prepareCode()
  //           console.log(pme)
  //           this.addDet(pme, this.emps, );
     
     
  // /*
  //   console.log("hhhhhhhjssfffjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
  //   let pme = this.prepareCode()
  //   console.log(pme)
  //   this.addDet(pme, this.mvdataset);
  //   console.log("jjjj")*/
  //   }
  
    
    
  //   addDet( _addReport: any ,detail: any) {
  //     console.log("here")
  //     for (let data of detail) {
  //       delete data.id;
  //       delete data.cmvid;
       
  //     }
  //     let emp = null;
  //   //  const controls = this.empForm.controls // chof le champs hada wesh men form rah
  //    // emp = controls.pmr_addr.value
  //     for (let data of detail) {
  //       delete data.id;
  //       delete data.cmvid;
       
  //     }
  //     this.loadingSubject.next(true);
    
     
  // }
  
  
    
    /**
     * Go back to the list
     *
     */
    goBackO3() {
      this.loadingSubject.next(false);
      const url = `/customers/customer-list`;
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    }
    
    handleSelectedRowsChangedcust(e, args) {
      const controls = this.repForm.controls
     
      let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjcust) {
      args.rows.map((idx) => {
        const item = this.gridObjcust.getDataItem(idx);
        console.log(item);
  
        
            updateItem.rep_code = item.ad_addr;
            
            this.gridService.updateItem(updateItem);
          });
          //});
        }
  }
  angularGridReadycust(angularGrid: AngularGridInstance) {
      this.angularGridcust = angularGrid
      this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {}
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
        },    ]
  
      this.gridOptionscust = {
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
          },
          multiSelect: false,
          rowSelectionOptions: {
              selectActiveRow: true,
          },
      }
  
      // fill the dataset with your data
      this.customerService
          .getAll()
          .subscribe((response: any) => (this.datacust = response.data))
  }
  open(content) {
      
      this.prepareGridcust()
      this.modalService.open(content, { size: "lg" })
  }
   
  addNewItemO3() {
    const newId = this.reps.length+1;
    const controls = this.repForm.controls
    let site:any;
    if(this.user.usrd_site=='*'){site= 'ECOLE'}
  else{site = this.user.usrd_site}
    const newItem = {
      id: newId,
      rep_contact:null,
      rep_code:controls.cust.value,
      rep_post: null,
      rep_tel: null,
      rep_tel2: null,
      rep_email: null,
      rep_type: null,
      chr03:site
    };
    this.gridService.addItem(newItem, { position: "bottom" });
  }
  handleSelectedRowsChanged2O3(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjcust) {
      args.rows.map((idx) => {
        const item = this.gridObjcust.getDataItem(idx);
        console.log(item);
  
        
            updateItem.rep_code = item.ad_addr;
            
            this.gridService.updateItem(updateItem);
          });
          //});
        }
  }
  
  angularGridReady2O3(angularGrid: AngularGridInstance) {
    this.angularGridcust = angularGrid;
    this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid2O3() {
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
        id: "ad_type",
        name: "Type",
        field: "ad_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_addr",
        name: "code",
        field: "ad_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Nom",
        field: "ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_phone",
        name: "Numero telephone",
        field: "ad_phone",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxable",
        name: "A Taxer",
        field: "ad_taxable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_taxc",
        name: "Taxe",
        field: "ad_taxc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];
  
    this.gridOptionscust = {
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
    if(this.adtype != "Provider"){this.addressService.getAll().subscribe((response: any) => (this.adresses = response.data));}
    else{this.addressService.getBy({ad_type:'vendor'}).subscribe((response: any) => (this.adresses = response.data));}
  }
  open2O3(content) {
    
          this.prepareGrid2O3();
          this.modalService.open(content, { size: "lg" });
        
    
  }
  // FIN ONGLET 3
  initmvGrid() {
    this.mvcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
      
      },
      {
        id: "code_value",
        name: "Type",
        field: "code_value",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "code_cmmt",
        name: "Designation",
        field: "code_cmmt",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
      {
        id: "emps_amt",
        name: "Montant",
        field: "emps_amt",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
        },
      },
    ];
  
    this.mvgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize:true,
      autoHeight:false,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      rowHeight:40,
    };
    this.codeService.getBy({ code_fldname: "emp_type" })
    .subscribe((response: any) => (this.mvdataset = response.data));
    
  
  }
  
  initjbGrid() {
    this.jbcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            this.jbangularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      
      },
      {
        id: "empj_job",
        name: "Code Compétence",
        field: "empj_job",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          this.jobService.getLevel({jbd_code: args.dataContext.empj_job }).subscribe((resp:any)=>{
  
           this.leveljob = resp.data 
          
         
           for (let obj of this.leveljob) {
             let ob = {
               value : obj.value,
               label : obj.label
             }
             this.leveljbd.push(ob)
           }
           
          });
  
           
         
         
        }
  
      },
  
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
        
         
          this.row_number = args.row
          let element: HTMLElement = document.getElementById(
              "openItemsGrid"
          ) as HTMLElement
          element.click()
          }  
        
      },
      {
        id: "desc",
        name: "Designation",
        field: "desc",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
      
      },
      {
        id: "empj_level",
        name: "Niveau",
        field: "empj_level",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.singleSelect,
          collection: this.leveljbd,
        
        
        
          
        },
        
  
      },
      
    ];
  
    this.jbgridOptions = {
     
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize:true,
      autoHeight:false,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      rowHeight:40,
    };
    // this.codeService.getBy({ code_fldname: "emp_type" })
    // .subscribe((response: any) => (this.mvdataset = response.data));
    this.jbdataset = []
  
  }
  
  inittrGrid() {
    this.trcolumnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
      
      },
      {
        id: "empf_part",
        name: "Code Formation",
        field: "empf_part",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
        
         
          this.row_number = args.row
          let element: HTMLElement = document.getElementById(
              "openItemspGrid"
          ) as HTMLElement
          element.click()
          }  
        
      },
      {
        id: "desc",
        name: "Designation",
        field: "desc",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.string,
      
      },
      {
        id: "empf_beging_date",
        name: "Date Debut",
        field: "empf_beging_date",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
      
      {
        id: "empf_end_date",
        name: "Date Fin",
        field: "empf_end_date",
        sortable: true,
        width: 50,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
    ];
  
    this.trgridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableAutoResize:true,
      autoHeight:false,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      rowHeight:40,
    };
    this.trdataset=[]
  
  }
  addNewItem() {
    this.jbgridService.addItem(
      {
        id: this.jbdataset.length + 1,
       
        empj_job: null,
        empj_level: null,
      },
      { position: "bottom" }
    );
  }
  addNewtrItem() {
    this.trgridService.addItem(
      {
        id: this.trdataset.length + 1,
       
        empf_part: null,
        empf_beging_date: null,
        empf_end_date: null
      },
      { position: "bottom" }
    );
  }
  jbGridReady(angularGrid: AngularGridInstance) {
    this.jbangularGrid = angularGrid;
    this.jbdataView = angularGrid.dataView;
    this.jbgrid = angularGrid.slickGrid;
    this.jbgridService = angularGrid.gridService;
  }
  mvGridReady(angularGrid: AngularGridInstance) {
    this.mvangularGrid = angularGrid;
    this.mvdataView = angularGrid.dataView;
    this.mvgrid = angularGrid.slickGrid;
    this.mvgridService = angularGrid.gridService;
  }
  trGridReady(angularGrid: AngularGridInstance) {
    this.trangularGrid = angularGrid;
    this.trdataView = angularGrid.dataView;
    this.trgrid = angularGrid.slickGrid;
    this.trgridService = angularGrid.gridService;
  }
  //create form
  createFormO4() {
    this.loadingSubject.next(false)
  
    this.employe = new Employe()
    
    this.empForm = this.empFB.group({
        emp_addr: [this.employe.emp_addr, Validators.required],
        emp_lname: [
            { value: this.employe.emp_lname, disabled: !this.isExist },
            Validators.required,
        ],
        emp_fname: [
          { value: this.employe.emp_fname, disabled: !this.isExist },
          Validators.required,
      ],
     emp_birth_date: [this.employe.emp_birth_date, Validators.required],
  emp_line1:  [{ value: this.employe.emp_line1, disabled: !this.isExist }, Validators.required,],
       emp_country: [{ value: this.employe.emp_country, disabled: !this.isExist }],
        emp_city: [{ value: this.employe.emp_city, disabled: !this.isExist }],
        
        emp_state: [{ value: this.employe.emp_state, disabled: !this.isExist }],
  
        emp_phone: [{ value: this.employe.emp_phone, disabled: !this.isExist }],
        emp_fax: [{ value: this.employe.emp_fax, disabled: !this.isExist }],
        emp_mail: [{ value: this.employe.emp_mail, disabled: !this.isExist }],
      
        emp_site:  [{ value: this.employe.emp_site, disabled: !this.isExist }],
        
        
        emp_contact_fname:  [{ value: this.employe.emp_contact_fname, disabled: !this.isExist }],
        emp_contact_lname:  [{ value: this.employe.emp_contact_lname, disabled: !this.isExist }],
        emp_contact_adress: [{ value: this.employe.emp_contact_adress, disabled: !this.isExist }],
        emp_contact_tel: [{ value: this.employe.emp_contact_tel, disabled: !this.isExist }],
        emp_parent_liaison: [{ value: this.employe.emp_parent_liaison, disabled: !this.isExist }],
        emp_userid: [{ value: this.employe.emp_userid, disabled: !this.isExist }],
        emp_upper : [{value: this.employe.emp_upper, disabled: !this.isExist }],
        emp_job : [{value: this.employe.emp_job, disabled: !this.isExist }],
        emp_level : [{value: this.employe.emp_level, disabled: !this.isExist }],
        emp_line2 : [{value: this.employe.emp_line2, disabled: !this.isExist }],
    })
  }
  
  onChangeCodeO4() {
    const controls = this.empForm.controls
    this.employeService
        .getBy({
              emp_addr: controls.emp_addr.value,
        })
        .subscribe((response: any) => {
            if (response.data.length) {
                this.isExist = true
                console.log(response.data.length)
            } else {
                controls.emp_lname.enable()
                controls.emp_fname.enable()
                controls.emp_line1.enable()  
                controls.emp_country.enable()
                controls.emp_city.enable()
               
                controls.emp_state.enable()
                controls.emp_phone.enable()
                controls.emp_fax.enable()
                controls.emp_mail.enable()
                controls.emp_site.enable()
                controls.emp_contact_fname.enable()
                controls.emp_contact_lname.enable()
                controls.emp_contact_adress.enable()
                controls.emp_contact_tel.enable()
                controls.emp_parent_liaison.enable()
                controls.emp_userid.enable()
  
                controls.emp_upper.enable()
                controls.emp_job.enable()
                controls.emp_level.enable()
                controls.emp_line2.enable()
          
                
  
            }
     })
  }
  onChangeJob() {
    const controls = this.empForm.controls; // chof le champs hada wesh men form rah
    const jb_code = controls.emp_job.value;
   
  
    this.jobService.getBy({ jb_code }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res.data;
  
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Métier n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          document.getElementById("job").focus();
        }
      },
      (error) => console.log(error)
    );
  }
  changeJob(){
    const controls = this.empForm.controls // chof le champs hada wesh men form rah
    const jb_code  = controls.emp_job.value
    this.jobService.getBy({jb_code}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "ce Métier n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
    this.error = true}
        else {
            this.error = false
        }
  
  
    },error=>console.log(error))
  }
  onChangeLevel() {
    const controls = this.empForm.controls; // chof le champs hada wesh men form rah
    const jbd_code = controls.emp_job.value;
   
  
    this.jobService.getByDet({ jbd_code }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res.data;
  
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Niveau n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          document.getElementById("level").focus();
        }
      },
      (error) => console.log(error)
    );
  }
  
  //reste form
  resetO4() {
    this.employe = new Employe()
    this.createFormO4()
    this.hasFormErrors = false
    
  }
  // save data
  onSubmitO4() {
    this.hasFormErrors = false
    
    const controls = this.empForm.controls
    /** check form */
    if (this.empForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )
  
        this.hasFormErrors = true
        
        this.selectedTab = 0
        
        return
    }
    
  
    // tslint:disable-next-line:prefer-const
    let employe = this.prepareCode()
    
    for (let data of this.jbdataset) {
      delete data.id;
      delete data.cmvid;
      delete data.desc;
    }
    
    
    for (let data of this.trdataset) {
      delete data.id;
      delete data.cmvid;
      delete data.desc;
    }
    this.addEmploye(employe,this.mvdataset,this.jbdataset,this.trdataset)
    
  }
  /**
       * Returns object for saving
       */
      prepareCode(): Employe {
        const controls = this.empForm.controls
        const _employe = new Employe()
        _employe.emp_addr = controls.emp_addr.value
        _employe.emp_lname = controls.emp_lname.value
        _employe.emp_fname = controls.emp_fname.value
        _employe.emp_birth_date = controls.emp_birth_date.value
        ? `${controls.emp_birth_date.value.year}/${controls.emp_birth_date.value.month}/${controls.emp_birth_date.value.day}`
        : null
        _employe.emp_line1 = controls.emp_line1.value
        
        _employe.emp_country = controls.emp_country.value
        _employe.emp_city = controls.emp_city.value
        
        _employe.emp_state = controls.emp_state.value
        _employe.emp_phone = controls.emp_phone.value
        _employe.emp_fax = controls.emp_fax.value
        _employe.emp_mail = controls.emp_mail.value
  
  
  
  
        _employe.emp_site = controls.emp_site.value
       
        _employe.emp_contact_fname = controls.emp_contact_fname.value
        _employe.emp_contact_lname = controls.emp_contact_lname.value
        _employe.emp_contact_adress = controls.emp_contact_adress.value
        _employe.emp_contact_tel = controls.emp_contact_tel.value
        _employe.emp_parent_liaison = controls.emp_parent_liaison.value
        _employe.emp_userid = controls.emp_userid.value
        
  
        _employe.emp_upper =  controls.emp_upper.value
        _employe.emp_job =  controls.emp_job.value
        _employe.emp_level =  controls.emp_level.value
        _employe.emp_line2 =  controls.emp_line2.value
        
        return _employe
    }
  
  /**
       * Add code
       *
       * @param _employe: EmployeModel
       */
      addEmploye(_employe: Employe, details: any, jbdetails:any,trdetails:any) {
        const controls = this.empForm.controls
        this.loadingSubject.next(true)
        this.employeService.add({ Employe: _employe, employeScoreDetail: details, employeJobDetail: jbdetails,employeTrDetail: trdetails }).subscribe(
            (reponse) => console.log("response", Response),
            (error) => {
                this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
            },
            () => {
                this.layoutUtilsService.showActionNotification(
                    "Ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
                this.loadingSubject.next(false)
                
                // this.router.navigateByUrl("/accounting-setting/list-employe")
            }
        )
    }
  
  
   
  
   /**
       * Go back to the list
       *
       */
      goBackO4() {
        this.loadingSubject.next(false)
        const url = `/accounting-setting/list-employe`
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
    }
  
  
  
  
    changeDomain(){
      const controls = this.empForm.controls // chof le champs hada wesh men form rah
      const code_value  = controls.emp_job.value
      this.codeService.getBy({code_fldname:"pt_draw",code_value:code_value}).subscribe((res:any)=>{
          const {data} = res
          console.log(res)
          if (!data){ this.layoutUtilsService.showActionNotification(
              "ce Service n'existe pas!",
              MessageType.Create,
              10000,
              true,
              true
          )
      this.error = true}
          else {
              this.error = false
          }
  
  
      },error=>console.log(error))
  }
  
    handleSelectedRowsChangeddomain(e, args) {
      const controls = this.empForm.controls;
      if (Array.isArray(args.rows) && this.gridObjdomain) {
        args.rows.map((idx) => {
          const item = this.gridObjdomain.getDataItem(idx);
          controls.emp_job.setValue(item.code_value || "");
        });
      }
    }
  
    angularGridReadydomain(angularGrid: AngularGridInstance) {
      this.angularGriddomain = angularGrid;
      this.gridObjdomain = (angularGrid && angularGrid.slickGrid) || {};
    }
  
    prepareGriddomain() {
      this.columnDefinitionsdomain = [
       
        {
          id: "code_value",
          name: "Code Domaine",
          field: "code_value",
          sortable: true,
          minWidth: 70,
          maxWidth: 100,
          filterable: true,
          type: FieldType.string,
        
      },
      {
          id: "code_cmmt",
          name: "Désignation",
          field: "code_cmmt",
          sortable: true,
          minWidth: 100,
          maxWidth: 300,
          filterable: true,
          type: FieldType.string,
          
      },   
      ];
  
      this.gridOptionsdomain = {
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
      this.codeService
        .getBy({code_fldname:"pt_draw"})
        .subscribe((response: any) => (this.domains = response.data));
    }
    opendom(content) {
      this.prepareGriddomain();
      this.modalService.open(content, { size: "lg" });
    }
  
  
    angularGridReady2O4(angularGrid: AngularGridInstance) {
      this.angularGrid2 = angularGrid;
      this.gridObj2 = (angularGrid && angularGrid.slickGrid) || {};
    }
  
    prepareGrid2O4() {
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
          id: "code_value",
          name: "code",
          field: "code_value",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "code_cmmt",
          name: "Designation",
          field: "code_cmmt",
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
      };
  
      // fill the dataset with your data
      this.codeService
        .getBy({code_fldname:'rep_job'})
        .subscribe((response: any) => (this.jobs = response.data));
    }
    open2O4(content) {
      this.prepareGrid2O4();
      this.modalService.open(content, { size: "lg" });
    }
  
    handleSelectedRowsChanged3O4(e, args) {
      const controls = this.empForm.controls;
      if (Array.isArray(args.rows) && this.gridObj3) {
        args.rows.map((idx) => {
          const item = this.gridObj3.getDataItem(idx);
          controls.emp_level.setValue(item.code_value || "");
        });
      }
  }
    angularGridReady3O4(angularGrid: AngularGridInstance) {
      this.angularGrid3 = angularGrid
      this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGrid3O4() {
    const controls = this.empForm.controls;
      this.columnDefinitions3 = [
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
              id: "code_value",
              name: "Poste",
              field: "code_value",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "code_cmmt",
            name: "Description",
            field: "jbd_level",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        
          
          
          
      ]
  
      this.gridOptions3 = {
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
          },
          multiSelect: false,
          rowSelectionOptions: {
              selectActiveRow: true,
          },
      }
  
      // fill the dataset with your data
      this.codeService
          .getBy({code_fldname: 'POSTES'})
          .subscribe((response: any) => (this.data = response.data))
  }
  open3O4(content) {
     
      this.prepareGrid3()
      this.modalService.open(content, { size: "lg" })
  }
  
  handleSelectedRowsChangedsiteO4(e, args) {
    
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObjsite) {
        args.rows.map((idx) => {
            const item = this.gridObjsite.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
                    controls.emp_site.setValue(item.si_site || "")
        })
    }
  }
 
  
 
  opensiteO4(contentsite, field) {
    this.selectedField = field
    this.prepareGridsite()
    this.modalService.open(contentsite, { size: "lg" })
  }
  onChangesite() {
    const controls = this.empForm.controls;
    const si_site = controls.emp_site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Site n'existe pas  ")
            controls.emp_site.setValue(null);
            document.getElementById("emp_site").focus();
          }
      
      });
  }
  
  handleSelectedRowsChangedcustO4(e, args) {
    
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcust) {
        args.rows.map((idx) => {
            const item = this.gridObjcust.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
                    controls.emp_line2.setValue(item.ad_addr || "")
        })
    }
  }
  angularGridReadycustO4(angularGrid: AngularGridInstance) {
    this.angularGridcust = angularGrid
    this.gridObjcust = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGridcustO4() {
    this.columnDefinitionscust = [
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
            id: "ad_addr",
            name: "Client",
            field: "ad_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "ad_name",
            name: "Nom",
            field: "ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        
    ]
  
    this.gridOptionscust = {
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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }
  
    // fill the dataset with your data
    this.addressService
        .getAllBy({ad_type:'customer'})
        .subscribe((response: any) => (this.datacust = response.data))
  }
  opencust(contentcust, field) {
    this.selectedField = field
    this.prepareGridcust()
    this.modalService.open(contentcust, { size: "lg" })
  }
  onChangecust() {
    const controls = this.empForm.controls;
    const ad_addr = controls.emp_line2.value;
    
    this.addressService.getBy({ ad_addr:ad_addr }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Client n'existe pas  ")
            controls.emp_line2.setValue(null);
            document.getElementById("emp_site").focus();
          }
      
      });
  }
  
  handleSelectedRowsChangedshift(e, args) {
    
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObjshift) {
        args.rows.map((idx) => {
            const item = this.gridObjshift.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
                    controls.emp_shift.setValue(item.code_value || "")
        })
    }
  }
  angularGridReadyshift(angularGrid: AngularGridInstance) {
    this.angularGridshift = angularGrid
    this.gridObjshift = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGridshift() {
    this.columnDefinitionsshift = [
        /*{
            id: "id",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
  
            minWidth: 50,
            maxWidth: 50,
        },*/
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            id: "code_value",
            name: "Code Equipe",
            field: "code_value",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "code_cmmt",
            name: "Designation",
            field: "code_cmmt",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        
    ]
  
    this.gridOptionsshift = {
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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }
  
    // fill the dataset with your data
    this.codeService
        .getBy ({code_fldname: "emp_shift"})
        .subscribe((response: any) => (this.datashift = response.data))
  }
  openshift(contentshift) {
    
    this.prepareGridshift()
    this.modalService.open(contentshift, { size: "lg" })
  }
  onChangeshift() {
    const controls = this.empForm.controls;
    
    this.codeService.getBy({ code_fldname: "emp_shift", code_value : controls.emp_shift.value}).subscribe(
      (res: any) => {
  console.log(res.data)
        if (res.data.length == 0) {
  
            alert("Equipe n'existe pas  ")
            controls.emp_shift.setValue(null);
            document.getElementById("emp_shift").focus();
          }
      
      });
  }
  
  /**
       * Close alert
       *
       * @param $event
       */
   
  
  
  handleSelectedRowsChanged2O4(e, args) {
    
    let updateItem = this.jbgridService.getDataItemByRowIndex(this.row_number);
    
    if (Array.isArray(args.rows) && this.gridObj2O4) {
        args.rows.map((idx) => {
         
            const item = this.gridObj2O4.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            updateItem.empj_job = item.jb_code
            updateItem.desc = item.jb_desc
            this.jbgridService.updateItem(updateItem);
            this.jobService.getLevel({jbd_code: item.jb_code }).subscribe((resp:any)=>{
  
              this.leveljob = resp.data 
             
        
              for (let obj of this.leveljob) {
                let ob = {
                  value : obj.value,
                  label : obj.label
                }
                this.leveljbd.push(ob)
              }
             
             });
     
        })
    }
  }
  
  handleSelectedRowsChangeduserid(e, args) {
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObjuserid) {
      args.rows.map((idx) => {
        const item = this.gridObjuserid.getDataItem(idx);
        console.log(item);
        controls.emp_userid.setValue(item.usrd_code || "");
      });
    }
  }
  
  angularGridReadyuserid(angularGrid: AngularGridInstance) {
    this.angularGriduserid = angularGrid;
    this.gridObjuserid = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGriduserid() {
    this.columnDefinitionsuserid = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "usrd_code",
        name: "code user",
        field: "usrd_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "usrd_name",
        name: "nom",
        field: "usrd_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];
  
    this.gridOptionsuserid = {
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
    this.userService.getAllUsers().subscribe((response: any) => (this.datauserid = response.data));
  }
  openuserid(content) {
    this.prepareGriduserid();
    this.modalService.open(content, { size: "lg" });
  }
  onChangeUserid() {
    const controls = this.empForm.controls; // chof le champs hada wesh men form rah
    const usrd_code = controls.emp_userid.value;
   
  
    this.userService.getByOne({ usrd_code }).subscribe(
      (res: any) => {
        console.log(res);
        
        if (res.data == null) {
          this.layoutUtilsService.showActionNotification(
            "cet utilisateur n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          controls.emp_userid.setValue(null)
          document.getElementById("userid").focus();
        }
      },
      (error) => console.log(error)
    );
  }
  
  
  
  
  handleSelectedRowsChangedupper(e, args) {
    
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObjupper) {
        args.rows.map((idx) => {
            const item = this.gridObjupper.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
                    controls.emp_upper.setValue(item.emp_addr || "")
        })
    }
  }
  angularGridReadyupper(angularGrid: AngularGridInstance) {
    this.angularGridupper = angularGrid
    this.gridObjupper = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGridupper() {
    this.columnDefinitionsupper = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
          id: "emp_addr",
          name: "Code Employe",
          field: "emp_addr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "emp_fname",
        name: "Nom",
        field: "emp_fname",
        sortable: true,
        filterable: true,
        width: 50,
        type: FieldType.string,
    },
    {
        id: "emp_lname",
        name: "Prénom",
        field: "emp_lname",
        sortable: true,
        filterable: true,
        width: 50,
        type: FieldType.string,
    },
    {
      id: "emp_line1",
      name: "Adresse",
      field: "emp_line1",
      sortable: true,
      width: 120,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "emp_birth_date",
      name: "Date Naissance",
      field: "emp_birth_date",
      sortable: true,
      filterable: true,
      width: 50,
      type: FieldType.dateIso,
    },
    
    {
      id: "emp_job",
      name: "Métier",
      field: "emp_job",
      sortable: true,
      filterable: true,
      width: 50,
      type: FieldType.string,
    },
    
    {
      id: "emp_level",
      name: "Niveau",
      field: "emp_level",
      sortable: true,
      filterable: true,
      width: 50,
      type: FieldType.string,
    },
    {
      id: "emp_site",
      name: "Site",
      field: "emp_site",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
    {
      id: "emp_shift",
      name: "Equipe",
      field: "emp_shift",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
  
    {
      id: "emp_rate",
      name: "Taux",
      field: "emp_rate",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "emp_mrate",
      name: "Taux Multiple",
      field: "emp_mrate",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
    {
      id: "emp_arate",
      name: "Taux",
      field: "emp_arate",
      sortable: true,
      filterable: true,
      type: FieldType.float,
    },
        
    ]
  
    this.gridOptionsupper = {
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
        },
        multiSelect: false,
        rowSelectionOptions: {
            selectActiveRow: true,
        },
    }
  
    // fill the dataset with your data
    this.employeService
        .getAll()
        .subscribe((response: any) => (this.dataupper = response.data))
  }
  openupper(content) {
   
    this.prepareGridupper()
    this.modalService.open(content, { size: "lg" })
  }
  onChangeUpper() {
    const controls = this.empForm.controls;
    const emp_addr = controls.emp_upper.value;
    
    this.employeService.getByOne({ emp_addr }).subscribe(
      (res: any) => {
  console.log(res.data)
        if (!res.data) {
  
            alert("Employe n'existe pas  ")
            controls.emp_upper.setValue(null);
            document.getElementById("emp_upper").focus();
          }
      
      });
  }
  
  handleSelectedRowsChanged4O4(e, args) {
    let updateItem = this.trgridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4O4) {
      args.rows.map((idx) => {
        const item = this.gridObj4O4.getDataItem(idx);
              updateItem.empf_part = item.pt_part;
              updateItem.desc = item.pt_desc1;
              
              this.trgridService.updateItem(updateItem);
      });
    }
  }
  angularGridReady4O4(angularGrid: AngularGridInstance) {
    this.angularGrid4O4 = angularGrid;
    this.gridObj4O4 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid4O4() {
    this.columnDefinitions4O4 = [
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
        name: "desc",
        field: "pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];
  
    this.gridOptions4O4 = {
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
    this.itemsService.getBy({pt_part_type : "FORMATION"}).subscribe((response: any) => (this.itemsO4 = response.data));
  }
  open4O4(content) {
    this.prepareGrid4O4();
    this.modalService.open(content, { size: "lg" });
  }
  // ONGLET 4
  gridReadyO5(angularGrid: AngularGridInstance) {
          this.angularGridO5 = angularGrid
          this.dataViewO5 = angularGrid.dataView
          this.gridO5 = angularGrid.slickGrid
          this.gridServiceO5 = angularGrid.gridService
      }
  
      initGridO5() {
          this.columnDefinitionsO5 = [
              {
                  id: "id",
                  field: "id",
                  excludeFromHeaderMenu: true,
                  formatter: Formatters.deleteIcon,
                  minWidth: 30,
                  maxWidth: 30,
                  onCellClick: (e: Event, args: OnEventArgs) => {
                      if (confirm('étes-vous sur de supprimer cette ligne?')) {
                          this.angularGrid.gridService.deleteItem(args.dataContext);
                        }
                    }
              },
              
              {
                  id: "qod_line",
                  name: "Ligne",
                  field: "qod_line",
                  minWidth: 50,
                  maxWidth: 50,
                  selectable: true,
              },
              {
                  id: "qod_part",
                  name: "Article",
                  field: "qod_part",
                  sortable: true,
                  width: 50,
                  filterable: false,
                  editor: {
                      model: Editors.text,
                  },
                  onCellChange: (e: Event, args: OnEventArgs) => {
                    console.log(args.dataContext.qod_part)
                    const controls = this.qoForm.controls 
                    this.itemsService.getByOne({pt_part: args.dataContext.qod_part }).subscribe((resp:any)=>{
          
                      if (resp.data) {
                        console.log(resp.data)
                                    
              
                        if (controls.so_taxable.value == false) {this.taxable = false} else { this.taxable = resp.data.pt_taxable}
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 ,
                          qod_um:resp.data.pt_um,  qod_price: resp.data.pt_price, qod_disc_pct:0, qod_tax_code:resp.data.pt_taxc, qod_taxc: resp.data.taxe.tx2_tax_pct, qod_taxable: this.taxable})
                         
                         
                                        
                
                   }  else {
                      alert("Article Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , qod_part: null })
                   }
                    
                    });
          
                     
                   
                   
                  }
              },
              {
                  id: "mvid",
                  field: "cmvid",
                  excludeFromHeaderMenu: true,
                  formatter: Formatters.infoIcon,
                  minWidth: 30,
                  maxWidth: 30,
                  onCellClick: (e: Event, args: OnEventArgs) => {
                      this.row_number = args.row
                      let element: HTMLElement = document.getElementById('openItemsGrid') as HTMLElement;
                      element.click();
                    }
              },
              {
                  id: "desc",
                  name: "Description",
                  field: "desc",
                  sortable: true,
                  width: 120,
                  filterable: false,
                  
              },
              {
                  id: "qod_qty_ord",
                  name: "QTE",
                  field: "qod_qty_ord",
                  sortable: true,
                  width: 80,
                  filterable: false,
                  type: FieldType.float,
                  editor: {
                      model: Editors.float,
                  },
                  onCellChange: (e: Event, args: OnEventArgs) => {
    
                    
         
                    this.calculatetotO5();
                }
              },
              {
                  id: "qod_um",
                  name: "UM",
                  field: "qod_um",
                  sortable: true,
                  width: 50,
                  filterable: false,
                  
              },
              {
                  id: "qod_price",
                  name: "Prix Un",
                  field: "qod_price",
                  sortable: true,
                  width: 80,
                  filterable: false,
                  editor: {
                      model: Editors.float,
                  },
                  onCellChange: (e: Event, args: OnEventArgs) => {
    
                    
         
                    this.calculatetotO5();
                }  
              },
              {
                  id: "qod_disc_pct",
                  name: "% remise",
                  field: "qod_disc_pct",
                  sortable: true,
                  width: 80,
                  filterable: false,
                  editor: {
                      model: Editors.float,
                  },  
                  onCellChange: (e: Event, args: OnEventArgs) => {
    
                    
         
                    this.calculatetotO5();
                } 
              },
              {
                  id: "qod_taxable",
                  name: "A Taxer",
                  field: "qod_taxable",
                  sortable: true,
                  width: 80,
                  filterable: false,
                  editor: {
                      model: Editors.checkbox
                    },
                    formatter: Formatters.checkmark,
                    cannotTriggerInsert: true,
                    onCellChange: (e: Event, args: OnEventArgs) => {
    
                   
                      this.calculatetotO5();
                  }
              },
              
              {
                id: "qod_tax_code",
                name: "Code de Taxe",
                field: "qod_tax_code",
                sortable: true,
                width: 80,
                filterable: false,
                
              },
  
              {
                id: "qod_taxc",
                name: "Taux Taxe",
                field: "qod_taxc",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                    model: Editors.text,
                  },
                  formatter: Formatters.percentComplete,
                  onCellChange: (e: Event, args: OnEventArgs) => {
  
                    
         
                    this.calculatetotO5();
                }
            },
              {
                  id: "qod_desc",
                  name: "Observation",
                  field: "qod_desc",
                  sortable: true,
                  width: 80,
                  filterable: false,
                  editor: {
                      model: Editors.longText,
                  },
              },
              
          ]
  
          this.gridOptionsO5 = {
              asyncEditorLoading: false,
              editable: true,
              enableColumnPicker: true,
              enableCellNavigation: true,
              enableRowSelection: true,
          }
  
          this.datasetO5 = []
      }
      
  
      //create form
      createFormO5() {
          this.loadingSubject.next(false)
          this.quote = new Quote()
          const date = new Date()
          
       
          
          this.qoForm = this.qoFB.group({
            
            qo_cust: [this.quote.qo_cust ],
            qo_exp_date: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            qo_ord_date: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            qo_due_date: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            qo_po: [this.quote.qo_po ],
            qo_cr_terms: [this.quote.qo_cr_terms ],
            qo_curr: [this.quote.qo_curr ],
            qo_taxable: [this.quote.qo_taxable ],
            qo_userid: [this.quote.qo_userid],
            qo_div: [this.quote.qo_div ],
            qo_stat: [this.quote.qo_stat ],
            qo_rmks: [this.quote.qo_rmks ],
            print:[true]
          })
      }
      createtotFormO5() {
        this.loadingSubject.next(false);
        //this.saleOrder = new SaleOrder();
       // const date = new Date;
        
        this.totForm = this.totFB.group({
      //    so__chr01: [this.saleOrder.so__chr01],
          tht: [{value: 0.00 , disabled: true}],
          tva: [{value: 0.00 , disabled: true}],
          timbre: [{value: 0.00 , disabled: true}],
          ttc: [{value: 0.00 , disabled: true}],
        });
    
        
        
    
      }
     
      //reste form
      resetO5() {
          this.quote = new Quote()
          this.createFormO5()
          this.createtotFormO5()
          this.hasFormErrors = false
      }
      // save data
      onSubmitO5() {
          this.hasFormErrors = false
          const controls = this.qoForm.controls
          /** check form */
          if (this.qoForm.invalid) {
              Object.keys(controls).forEach((controlName) =>
                  controls[controlName].markAsTouched()
              )
              this.message = 'Modifiez quelques �l�ments et r�essayez de soumettre.'
              this.hasFormErrors = true
  
              return
          }
  
          if (!this.datasetO5.length){
              this.message = 'La liste des article ne peut pas etre vide'
              this.hasFormErrors = true
  
              return
          }
          // tslint:disable-next-line:prefer-const
          let qo = this.prepareQuote()
          for(let data of this.datasetO5){
            delete data.id
            delete data.cmvid
           // delete data.desc
          }
          this.addQo(qo, this.datasetO5)
      }
      
      /**
       *
       * Returns object for saving
       */
      prepareQuote(): any {
          const controls = this.qoForm.controls
          const _quote = new Quote()
      
            _quote.qo_cust =  controls.qo_cust.value
            _quote.qo_ord_date=  controls.qo_ord_date.value ? `${controls.qo_ord_date.value.year}/${controls.qo_ord_date.value.month}/${controls.qo_ord_date.value.day}`: null
            _quote.qo_exp_date=  controls.qo_exp_date.value ? `${controls.qo_exp_date.value.year}/${controls.qo_exp_date.value.month}/${controls.qo_exp_date.value.day}`: null
            _quote.qo_due_date=  controls.qo_due_date.value ? `${controls.qo_due_date.value.year}/${controls.qo_due_date.value.month}/${controls.qo_due_date.value.day}`: null
            _quote.qo_rmks=  controls.qo_rmks.value
            _quote.qo_curr=  controls.qo_curr.value
            _quote.qo_cr_terms=  controls.qo_cr_terms.value
            _quote.qo_taxable=  controls.qo_taxable.value
            _quote.qo_relee= false
            
          return _quote
      }
      /**
       * Add Quote
       *
       * @param _quote: Quote
       */
      addQo(_qo: any, detail: any) {
          for (let data of detail) {
            delete data.id;
            delete data.cmvid;
            
          }
          this.loadingSubject.next(true);
          let qo = null;
          const controls = this.qoForm.controls;
      
          this.quoteService
            .add({ quoteOrder: _qo, quoteOrderDetail: detail })
            .subscribe(
              (reponse: any) => (qo = reponse.data),
              (error) => {
                this.layoutUtilsService.showActionNotification(
                  "Erreur verifier les informations",
                  MessageType.Create,
                  10000,
                  true,
                  true
                );
                this.loadingSubject.next(false);
              },
              () => {
                this.layoutUtilsService.showActionNotification(
                  "Ajout avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
                );
                this.loadingSubject.next(false);
  
                console.log(this.dataset);
  
                if(controls.print.value == true) {console.log('imprimer'); this.printpdfO5(qo.qo_nbr) }//printOc(this.customer, this.dataset,qo);
                this.resetO5()
                // this.router.navigateByUrl("/sales/req-list");
              }
            );
        }
        
      /**
       * Go back to the list
       *
       */
      onChangeCustO5() {
          const controls = this.qoForm.controls; // chof le champs hada wesh men form rah
          const cm_addr = controls.qo_cust.value;
         
    
          this.customersService.getBy({ cm_addr }).subscribe(
            (res: any) => {
              console.log(res);
              const { data } = res;
      
              if (!data) {
                this.layoutUtilsService.showActionNotification(
                  "ce Client n'existe pas!",
                  MessageType.Create,
                  10000,
                  true,
                  true
                );
                this.error = true;
              } else {
                this.error = false;
                controls.qo_cust.setValue(res.data.cm_addr || "");
                controls.qo_cr_terms.setValue(res.data.cm_cr_terms || "");
                controls.qo_curr.setValue(res.data.cm_curr || "");
                controls.qo_taxable.setValue(res.data.address.ad_taxable || "");
             
                this.customer = res.data;            
                 
                this.deviseService.getBy({ cu_curr: res.data.cm_curr }).subscribe(
                  (res: any) => {
                    console.log(res);
                    const { data } = res;
              if(data) {
      
                this.curr = data;
              }
            })
              }
               
            },
            (error) => console.log(error)
          );
        }
      
      goBackO5() {
          this.loadingSubject.next(false)
          const url = `/sales/req-list`
          this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
      }
  
      // add new Item to Datatable
      addNewItemO5() {
          this.gridServiceO5.addItem({
              id: this.datasetO12.length + 1,
              qod_line: this.datasetO12.length + 1,
              qod_part: "",
              cmvid: "",
              desc: "",
              qod_qty_ord: 0,
              qod_um: "",
              qod_price: 0,
              qod_disc_pct: 0,
              qod_ar_cc: "",
              qod_desc: "",
          },{position:"bottom"})
      }
  
      handleSelectedRowsChanged2O5(e, args) {
          const controls = this.qoForm.controls
          if (Array.isArray(args.rows) && this.gridObj2O5) {
              args.rows.map((idx) => {
                  const item = this.gridObj2O5.getDataItem(idx)
                  controls.qo_cust.setValue(item.cm_addr || "")
                  controls.qo_cr_terms.setValue(item.cm_cr_terms || "");
                  controls.qo_curr.setValue(item.cm_curr || "");
                  controls.qo_taxable.setValue(item.address.ad_taxable || "");
                  
                
                  this.customer = item;
                  this.deviseService.getBy({ cu_curr: item.cm_curr }).subscribe(
                    (res: any) => {
                      console.log(res);
                      const { data } = res;
                if(data) {
        
                  this.curr = data;
                }
              })
                  console.log(this.customer)
              })
          }
      }
  
      angularGridReady2O5(angularGrid: AngularGridInstance) {
          this.angularGrid2O5 = angularGrid
          this.gridObj2O5 = (angularGrid && angularGrid.slickGrid) || {}
      }
  
      prepareGrid2O5() {
          this.columnDefinitions2O5 = [
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
                  name: "Fournisseur",
                  field: 'address.ad_name',
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "ad_phone",
                  name: "Numero telephone",
                  field: 'address.ad_phone',
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              
          ]
  
          this.gridOptions2O5 = {
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
                }
          }
  
          // fill the dataset with your data
          this.customersService
              .getAll()
              .subscribe((response: any) => (this.customersO5 = response.data))
      }
      open2O5(content) {
          this.prepareGrid2O5()
          this.modalService.open(content, { size: "lg" })
      }
  
   
      handleSelectedRowsChanged4O5(e, args) {
          let updateItem = this.gridServiceO5.getDataItemByRowIndex(this.row_number)
          if (Array.isArray(args.rows) && this.gridObj4O5) {
              args.rows.map((idx) => {
                  const item = this.gridObj4O5.getDataItem(idx)
                  console.log(item)
                  updateItem.qod_part = item.pt_part
                  updateItem.desc = item.pt_desc1
                  updateItem.qod_um = item.pt_um
                  updateItem.qod_price = item.pt_price
                  updateItem.qod_taxable = item.pt_taxable
                  updateItem.qod_tax_code = item.pt_taxc
                  
                  updateItem.qod_taxc = item.taxe.tx2_tax_pct
                  
                  this.gridServiceO5.updateItem(updateItem);
  
              })
          }
      }
  
      angularGridReady4O5(angularGrid: AngularGridInstance) {
          this.angularGrid4O5 = angularGrid
          this.gridObj4O5 = (angularGrid && angularGrid.slickGrid) || {}
      }
  
      prepareGrid4O5() {
          this.columnDefinitions4O5 = [
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
                  name: "desc",
                  field: "pt_um",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
          ]
  
          this.gridOptions4O5 = {
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
          }
  
          // fill the dataset with your data
          this.itemsService
              .getAll()
              .subscribe((response: any) => (this.itemsO5 = response.data))
      }
      open4O5(content) {
          this.prepareGrid4O5()
          this.modalService.open(content, { size: "lg" })
      }
      onAlertCloseO5($event) {
          this.hasFormErrors = false
      }
      handleSelectedRowsChangedcurrO5(e, args) {
          const controls = this.qoForm.controls
          if (Array.isArray(args.rows) && this.gridObjcurrO5) {
              args.rows.map((idx) => {
                  const item = this.gridObjcurrO5.getDataItem(idx)
                  controls.qo_curr.setValue(item.cu_curr || "")
                  this.curr = item
              })
          }
        }
      
        angularGridReadycurrO5(angularGrid: AngularGridInstance) {
          this.angularGridcurrO5 = angularGrid;
          this.gridObjcurrO5 = (angularGrid && angularGrid.slickGrid) || {};
        }
      
        prepareGridcurrO5() {
          this.columnDefinitionscurrO5 = [
            {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
            },
            {
              id: "cu_curr",
              name: "code",
              field: "cu_curr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "cu_desc",
              name: "Designation",
              field: "cu_desc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "cu_rnd_mthd",
              name: "Methode Arrondi",
              field: "cu_rnd_mthd",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "cu_active",
              name: "Actif",
              field: "cu_active",
              sortable: true,
              filterable: true,
              type: FieldType.boolean,
            },
            {
              id: "cu_iso_curr",
              name: "Devise Iso",
              field: "cu_iso_curr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
          ];
      
          this.gridOptionscurrO5 = {
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
          this.deviseService
            .getAll()
            .subscribe((response: any) => (this.devisesO5 = response.data));
        }
        opencurrO5(content) {
          this.prepareGridcurrO5();
          this.modalService.open(content, { size: "lg" });
        }
        calculatetotO5(){
          const controls = this.totForm.controls 
           const controlsso = this.qoForm.controls 
           let tht = 0
           let tva = 0
           let timbre = 0
           let ttc = 0
           for (var i = 0; i < this.datasetO5.length; i++) {
             console.log(this.datasetO5[i]  )
             tht += round((this.datasetO5[i].qod_price * ((100 - this.datasetO5[i].qod_disc_pct) / 100 ) *  this.datasetO5[i].qod_qty_ord),2)
             if(controlsso.qo_taxable.value == true) tva += round((this.datasetO5[i].qod_price * ((100 - this.datasetO5[i].qod_disc_pct) / 100 ) *  this.datasetO5[i].qod_qty_ord) * (this.datasetO5[i].qod_taxc ? this.datasetO5[i].qod_taxc / 100 : 0),2)
            
          
             
        
             console.log(tva)
             if(controlsso.qo_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
               if (timbre > 10000) { timbre = 10000} } 
          
           }
         ttc = round(tht + tva + timbre,2)
       console.log(tht,tva,timbre,ttc)
       controls.tht.setValue(tht.toFixed(2));
       controls.tva.setValue(tva.toFixed(2));
       controls.timbre.setValue(timbre.toFixed(2));
       controls.ttc.setValue(ttc.toFixed(2));
       
  }
  
  
  printpdfO5(nbr) {
    const controls = this.totForm.controls 
    const controlss = this.qoForm.controls 
    console.log("pdf")
    var doc = new jsPDF();
   
   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image()
    img.src = "./assets/media/logos/companyentete.png";
    doc.addImage(img, 'png', 5, 5, 210, 30)
    doc.setFontSize(12);
    doc.text( 'Devis N° : ' + nbr  , 70, 40);
    doc.setFontSize(8);
    doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
      
    doc.line(10, 85, 200, 85);
    doc.line(10, 90, 200, 90);
    doc.line(10, 85, 10, 90);
    doc.text('LN', 12.5 , 88.5);
    doc.line(20, 85, 20, 90);
    doc.text('Code Article', 25 , 88.5);
    doc.line(45, 85, 45, 90);
    doc.text('Désignation', 67.5 , 88.5);
    doc.line(100, 85, 100, 90);
    doc.text('QTE', 107 , 88.5);
    doc.line(120, 85, 120, 90);
    doc.text('UM', 123 , 88.5);
    doc.line(130, 85, 130, 90);
    doc.text('PU', 138 , 88.5);
    doc.line(150, 85, 150, 90);
    doc.text('TVA', 152 , 88.5);
    doc.line(160, 85, 160, 90);
    doc.text('REM', 162 , 88.5);
    doc.line(170, 85, 170, 90);
    doc.text('THT', 181 , 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(6);
    for (let j = 0; j < this.datasetO5.length  ; j++) {
      console.log("hkjhhkjhk", this.datasetO5[j].desc.length) 
      console.log("hnaaaaaaaaaaaaaaaaaaaaaaa")
      if ((j % 20 == 0) && (j != 0) ) {
  doc.addPage();
        doc.addImage(img, 'png', 5, 5, 210, 30)
        doc.setFontSize(12);
        doc.text( 'Devis N° : ' + nbr  , 70, 40);
        doc.setFontSize(8);
        doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
        
        doc.line(10, 85, 200, 85);
        doc.line(10, 90, 200, 90);
        doc.line(10, 85, 10, 90);
        doc.text('LN', 12.5 , 88.5);
        doc.line(20, 85, 20, 90);
        doc.text('Code Article', 25 , 88.5);
        doc.line(45, 85, 45, 90);
        doc.text('Désignation', 67.5 , 88.5);
        doc.line(100, 85, 100, 90);
        doc.text('QTE', 107 , 88.5);
        doc.line(120, 85, 120, 90);
        doc.text('UM', 123 , 88.5);
        doc.line(130, 85, 130, 90);
        doc.text('PU', 138 , 88.5);
        doc.line(150, 85, 150, 90);
        doc.text('TVA', 152 , 88.5);
        doc.line(160, 85, 160, 90);
        doc.text('REM', 162 , 88.5);
        doc.line(170, 85, 170, 90);
        doc.text('THT', 181 , 88.5);
        doc.line(200, 85, 200, 90);
        i = 95;
        doc.setFontSize(6);
  
      }
  
  
      console.log("hkjhhkjhk", String(this.datasetO5[j].desc).length)
  
      if (String(this.datasetO5[j].desc).length > 35) {
        let desc1 = this.datasetO5[j].desc.substring(35)
        let ind = desc1.indexOf(' ')
        desc1 = this.datasetO5[j].desc.substring(0, 35  + ind)
        let desc2 = this.datasetO5[j].desc.substring(35+ind)
  
        doc.line(10, i - 5, 10, i );
        doc.text(String(("000"+ this.datasetO5[j].qod_line)).slice(-3), 12.5 , i  - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.datasetO5[j].qod_part, 25 , i  - 1);
        doc.line(45, i - 5 , 45, i );
        doc.text(desc1, 47 , i  - 1);
        doc.line(100, i - 5, 100, i );
        doc.text( String(this.datasetO5[j].qod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
        doc.line(120, i - 5 , 120, i );
        doc.text(this.datasetO5[j].qod_um, 123 , i  - 1);
        doc.line(130, i - 5, 130, i );
        doc.text( String(Number(this.datasetO5[j].qod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
        doc.line(150, i - 5, 150, i );
        doc.text(String(this.datasetO5[j].qod_taxc) + "%" , 153 , i  - 1);
        doc.line(160, i - 5 , 160, i );
        doc.text(String(this.datasetO5[j].qod_disc_pct) + "%" , 163 , i  - 1);
        doc.line(170, i - 5 , 170, i );
        doc.text(String((this.datasetO5[j].qod_price *
                ((100 - this.datasetO5[j].qod_disc_pct) / 100) *
                this.datasetO5[j].qod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
        doc.line(200, i-5 , 200, i );
       // doc.line(10, i, 200, i );
  
        i = i + 5;
  
        doc.text(desc2, 47 , i  - 1);
        
        doc.line(10, i - 5, 10, i );
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5 , 45, i );
        doc.line(100, i - 5, 100, i );
        doc.line(120, i - 5 , 120, i );
        doc.line(130, i - 5, 130, i );
        doc.line(150, i - 5, 150, i );
        doc.line(160, i - 5 , 160, i );
        doc.line(170, i - 5 , 170, i );
        doc.line(200, i-5 , 200, i );
        doc.line(10, i, 200, i );
  
        i = i + 5 ;
        
      } else {
  
  
      
      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.datasetO5[j].qod_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.datasetO5[j].qod_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(this.datasetO5[j].desc, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(this.datasetO5[j].qod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.datasetO5[j].qod_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(Number(this.datasetO5[j].qod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.datasetO5[j].qod_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(this.datasetO5[j].qod_disc_pct) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.datasetO5[j].qod_price *
        ((100 - this.datasetO5[j].qod_disc_pct) / 100) *
        this.datasetO5[j].qod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );
      i = i + 5;
      }
    }
    
   // doc.line(10, i - 5, 200, i - 5);
  
   doc.line(130, i + 7,  200, i + 7  );
   doc.line(130, i + 14, 200, i + 14 );
   doc.line(130, i + 21, 200, i + 21 );
   doc.line(130, i + 28, 200, i + 28 );
   doc.line(130, i + 35, 200, i + 35 );
   doc.line(130, i + 7,  130, i + 35  );
   doc.line(160, i + 7,  160, i + 35  );
   doc.line(200, i + 7,  200, i + 35  );
   doc.setFontSize(10);
   
   doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
   doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
   doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
   doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
  
   
   doc.text(String(Number(controls.tht.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
   doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
   doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
   doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });
  
   doc.setFontSize(8);
      let mt = NumberToLetters(
        Number(controls.ttc.value).toFixed(2),this.curr.cu_desc)
  
        if (mt.length > 95) {
          let mt1 = mt.substring(90)
          let ind = mt1.indexOf(' ')
         
          mt1 = mt.substring(0, 90  + ind)
          let mt2 = mt.substring(90+ind)
     
          doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
          doc.text(  mt2  , 20, i + 60)
        } else {
          doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)
  
        }
      // window.open(doc.output('bloburl'), '_blank');
      //window.open(doc.output('blobUrl'));  // will open a new tab
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
  
    }
    // ONGLET 5
    
    
      angularGridReadyO6(angularGrid: AngularGridInstance) {
        this.angularGridO6 = angularGrid;
        this.gridO6 = angularGrid.slickGrid; // grid object
        this.dataviewO6 = angularGrid.dataView;
        this.gridServiceO6 = angularGrid.gridService;
      }
      
      
      prepareGridO6() {
    
          this.columnDefinitionsO6 = [
              
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
                id: "qod_nbr",
                name: "Offre",
                field: "qod_nbr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
                grouping: {
                  getter: 'qod_nbr',
                  formatter: (g) => `Offre: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                  aggregators: [
                    // (required), what aggregators (accumulator) to use and on which field to do so
                   // new Aggregators.Avg('ld_qty_oh'),
                    new Aggregators.Sum('qod_price')
                  ],
                  aggregateCollapsed: true,
                  collapsed: true,
                }
              }, 
              {
                id: "qod_line",
                name: "Ligne",
                field: "qod_line",
                sortable: true,
                filterable: true,
                type: FieldType.string,
                grouping: {
                  getter: 'qod_line',
                  formatter: (g) => `Ligne: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                  aggregators: [
                    // (required), what aggregators (accumulator) to use and on which field to do so
                   // new Aggregators.Avg('ld_qty_oh'),
                    new Aggregators.Sum('qod_price')
                  ],
                  aggregateCollapsed: true,
                  collapsed: true,
                }
              }, 
              {
                id: "qod_part",
                name: "Article",
                field: "qod_part",
                sortable: true,
                filterable: true,
                type: FieldType.string,
                grouping: {
                  getter: 'qod_part',
                  formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                  aggregators: [
                    // (required), what aggregators (accumulator) to use and on which field to do so
                   // new Aggregators.Avg('ld_qty_oh'),
                    new Aggregators.Sum('qod_price')
                  ],
                  aggregateCollapsed: true,
                  collapsed: true,
                }
              }, 
              {
                id: "qod_cust",
                name: "Client",
                field: "qod_cust",
                sortable: true,
                filterable: true,
                type: FieldType.string,
                grouping: {
                  getter: 'qod_cust',
                  formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                  aggregators: [
                    // (required), what aggregators (accumulator) to use and on which field to do so
                   // new Aggregators.Avg('ld_qty_oh'),
                    new Aggregators.Sum('qod_price')
                  ],
                  aggregateCollapsed: true,
                  collapsed: true,
                }
              }, 
              // {
              //   id: "as_bank",
              //   name: "Banque",
              //   field: "as_bank",
              //   sortable: true,
              //   filterable: true,
              //   type: FieldType.string,
              //   filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              //   grouping: {
              //     getter: 'as_bank',
              //     formatter: (g) => `Banque: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              //     aggregators: [
              //       // (required), what aggregators (accumulator) to use and on which field to do so
              //      // new Aggregators.Avg('ld_qty_oh'),
              //       new Aggregators.Sum('as_applied')
              //     ],
              //     aggregateCollapsed: true,
              //     collapsed: true,
              //     lazyTotalsCalculation:true,
              //   }
              // }, 
              // {
              //   id: "as_curr",
              //   name: "devise",
              //   field: "as_curr",
              //   sortable: true,
              //   filterable: true,
              //   type: FieldType.string,
              //   // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
              //   grouping: {
              //     getter: 'as_curr',
              //     formatter: (g) => `Devise: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              //     aggregators: [
              //       // (required), what aggregators (accumulator) to use and on which field to do so
              //      // new Aggregators.Avg('ld_qty_oh'),
              //       new Aggregators.Sum('as_applied')
              //     ],
              //     aggregateCollapsed: true,
              //     lazyTotalsCalculation:true,
              //     collapsed:true
              //   }
                
              // }, 
             
              
              {
                id: "qod_qty_ord",
                name: "Quantité",
                field: "qod_qty_ord",
                sortable: true,
                filterable: true,
                groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
                type: FieldType.float,
                filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
                
                
              },
             
              {
                id: "qod_price",
                name: "Prix",
                field: "qod_price",
                sortable: true,
                filterable: true,
                groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
                type: FieldType.float,
                filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
                
                
              }, 
              
               
             
              // {
              //   id: "as_date",
              //   name: "Date Entrée",
              //   field: "as_date",
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
              //     getter: 'as_date',
              //     formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              //     aggregators: [
              //       // (required), what aggregators (accumulator) to use and on which field to do so
              //      // new Aggregators.Avg('ld_qty_oh'),
              //       new Aggregators.Sum('as_applied')
              //     ],
              //     aggregateCollapsed: true,
              //     lazyTotalsCalculation:true,
              //     collapsed:true
              //   }
              // },
              {
                id: "qod_due_date",
                name: "Date échéance",
                field: "qod_due_date",
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
                  getter: 'qod_due_date',
                  formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                  aggregators: [
                    // (required), what aggregators (accumulator) to use and on which field to do so
                   // new Aggregators.Avg('ld_qty_oh'),
                    new Aggregators.Sum('qod_price')
                  ],
                  aggregateCollapsed: true,
                  lazyTotalsCalculation:true,
                  collapsed:true
                }
              },
              {
                id: "qod_per_date",
                name: "Date effet",
                field: "qod_per_date",
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
                  getter: 'qod_per_date',
                  formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                  aggregators: [
                    // (required), what aggregators (accumulator) to use and on which field to do so
                   // new Aggregators.Avg('ld_qty_oh'),
                    new Aggregators.Sum('qod_price')
                  ],
                  aggregateCollapsed: true,
                  lazyTotalsCalculation:true,
                  collapsed:true
                }
              },
              
              
    
          ]
    
          this.gridOptionsO6 = {
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
          this.datasetO6 = []
          this.quoteService
          .findBy({ })
          .subscribe(
            
              (response: any) => {this.datasetO6 = response.data
                console.log(this.datasetO6)
                this.dataviewO6.setItems(this.datasetO6)},
              
              (error) => {
                  this.datasetO6 = []
              },
              () => {}
              
          )
          console.log(this.datasetO6)
      }
      onGroupChangedO6(change: { caller?: string; groupColumns: Grouping[] }) {
          // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
          const caller = change && change.caller || [];
          const groups = change && change.groupColumns || [];
    
          if (Array.isArray(this.selectedGroupingFieldsO6) && Array.isArray(groups) && groups.length > 0) {
            // update all Group By select dropdown
            this.selectedGroupingFieldsO6.forEach((g, i) => this.selectedGroupingFieldsO6[i] = groups[i] && groups[i].getter || '');
          } else if (groups.length === 0 && caller === 'remove-group') {
            this.clearGroupingSelects();
          }
        }
        clearGroupingSelectsO6() {
          this.selectedGroupingFieldsO6.forEach((g, i) => this.selectedGroupingFieldsO6[i] = '');
        }
        
        collapseAllGroupsO6() {
          this.dataviewObjO6.collapseAllGroups();
        }
      
        expandAllGroupsO6() {
          this.dataviewObjO6.expandAllGroups();
        }
        clearGroupingO6() {
          if (this.draggableGroupingPluginO6 && this.draggableGroupingPluginO6.setDroppedGroups) {
            this.draggableGroupingPluginO6.clearDroppedGroups();
          }
          this.gridObjO6.invalidate(); // invalidate all rows and re-render
        }
    
        printpdfO6(nbr) {
          // const controls = this.totForm.controls
          
          console.log("pdf");
          var doc = new jsPDF("l");
          let date = new Date()
         // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
          var img = new Image()
          img.src = "./assets/media/logos/companyentete.png";
          doc.addImage(img, 'png', 150, 5, 50, 30)
          doc.setFontSize(9);
          if (this.domainO6.dom_name != null) {
            doc.text(this.domainO6.dom_name, 10, 10);
          }
          if (this.domainO6.dom_addr != null) doc.text(this.domainO6.dom_addr, 10, 15);
          if (this.domainO6.dom_city != null) doc.text(this.domainO6.dom_city + " " + this.domainO6.dom_country, 10, 20);
          if (this.domainO6.dom_tel != null) doc.text("Tel : " + this.domainO6.dom_tel, 10, 30);
          doc.setFontSize(14);
        
          doc.line(10, 35, 300, 35);
          doc.setFontSize(12);
          doc.text("Etat des Stocks Du: " + nbr, 100, 45);
          //doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
          doc.text("imprimé Le: " + date.toLocaleDateString() , 220, 45);
          doc.text("A: " + new Date().toLocaleTimeString(), 220, 50);
          doc.text("Edité par: " + this.userO6.usrd_code, 220, 55);
          
          
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
          for (let j = 0; j < this.datasetO6.length  ; j++) {
            total = total - Number(this.datasetO6[j].ld_qty_oh)
            
            if ((j % 20 == 0) && (j != 0) ) {
              doc.addPage();
              img.src = "./assets/media/logos/companyentete.png";
              doc.addImage(img, 'png', 150, 5, 50, 30)
              doc.setFontSize(9);
              if (this.domainO6.dom_name != null) {
                doc.text(this.domainO6.dom_name, 10, 10);
              }
              if (this.domainO6.dom_addr != null) doc.text(this.domainO6.dom_addr, 10, 15);
              if (this.domainO6.dom_city != null) doc.text(this.domainO6.dom_city + " " + this.domainO6.dom_country, 10, 20);
              if (this.domainO6.dom_tel != null) doc.text("Tel : " + this.domainO6.dom_tel, 10, 30);
              doc.setFontSize(14);
              doc.line(10, 35, 300, 35);
        
              doc.setFontSize(12);
              doc.text("Etat des Stocks Du: " + nbr, 100, 45);
              //doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
              doc.text("imprimé Le: " + date.toLocaleDateString() , 220, 45);
              doc.text("A: " + new Date().toLocaleTimeString(), 220, 50);
              doc.text("Edité par: " + this.userO6.usrd_code, 220, 55);
             
          
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
              doc.text(this.datasetO6[j].ld_part, 25, i - 1);
              doc.line(65, i - 5, 65, i);
              doc.text(this.datasetO6[j].chr01 + ' ' + this.datasetO6[j].chr02 + ' ' + this.datasetO6[j].chr03, 67.5, i - 1);
              doc.line(130, i - 5, 130, i);
              doc.text(String(Number(this.datasetO6[j].ld_qty_oh) ), 137, i - 1, { align: "right" });
              doc.line(140, i - 5, 140, i);
              doc.text(String(this.datasetO6[j].chr04), 143, i - 1);
              doc.line(170, i - 5, 170, i);
              doc.text(String(this.datasetO6[j].created_by), 173, i - 1, );
              doc.line(185, i - 5, 185, i);
              doc.text(String(this.datasetO6[j].ld_lot), 188, i - 1, );
              doc.line(205, i - 5, 205, i);
              doc.text(String(this.datasetO6[j].ld_ref), 207, i - 1, );
              doc.line(220, i - 5, 220, i);
              doc.text(String((this.datasetO6[j].ld_date)) , 223, i - 1, );
              doc.line(235, i - 5, 235, i);
              doc.text(String((this.datasetO6[j].ld_site)) , 238, i - 1, );
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
        
          doc.text("NOMBRE DE BIG BAG   " + String(this.datasetO6.length) + "  , Total POIDS:  " + String(Number(total)), 40, i + 12, { align: "left" });
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
        onSubmitO6() {
        
          this.printpdfO6(new Date().toLocaleDateString()); 
         
          // tslint:disable-next-line:prefer-const
        
        }
        customerlistO6() {
        
          
          const url = `/customers/customer-list`;
          this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
        
        }
        createquoteO6() {
        
          
          const url = `/sales/create-quote`;
          this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
        
        }
        resetO6() {
        
          this.datasetO6 = []
          this.quoteService.getAll().subscribe( 
            
              (response: any) => {this.datasetO6 = response.data
                console.log(this.datasetO6)
                this.dataviewO6.setItems(this.datasetO6)},
              
              (error) => {
                  this.datasetO6 = []
              },
              () => {}
              
          )
        
        }
        // ONGLET 6
        gridReadyO7(angularGrid: AngularGridInstance) {
            this.angularGridO7 = angularGrid;
            this.dataViewO7 = angularGrid.dataView;
            this.gridO7 = angularGrid.slickGrid;
            this.gridServiceO7 = angularGrid.gridService;
          }
        
          initGridO7() {
            this.columnDefinitionsO7 = [
              {
                id: "id",
                field: "id",
                excludeFromHeaderMenu: true,
                formatter: Formatters.deleteIcon,
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
                    this.angularGrid.gridService.deleteItem(args.dataContext);
                  }
                },
              },
        
              {
                id: "sod_line",
                name: "Ligne",
                field: "sod_line",
                minWidth: 30,
                maxWidth: 30,
                selectable: true,
              },
              {
                id: "sod_part",
                name: "Article",
                field: "sod_part",
                sortable: true,
                width: 50,
                filterable: false,
                editor: {
                  model: Editors.text,
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
                  console.log(args.dataContext.sod_part)
                  const controls = this.soFormO7.controls 
                  this.itemsService.getByOne({pt_part: args.dataContext.sod_part }).subscribe((resp:any)=>{
        
                    if (resp.data) {
                      console.log(resp.data)
                                  
                      if (resp.data.pt_phantom || resp.data.pt_part_type == 'FORMATION') {
                        this.typeO7 = 'M'
                      
                      } else {
                        this.typeO7 = null
                      }            
        
                      if (controls.so_taxable.value == false) {this.taxable = false} else { this.taxable = resp.data.pt_taxable}
                     
                      this.locationDetailService.getByOne({ ld_site: resp.data.pt_site, ld_loc: resp.data.pt_loc, ld_part: args.dataContext.sod_part, ld_lot: null }).subscribe(
                        (response: any) => {
                          this.lddetO7 = response.data
                          console.log(this.lddetO7)
                          if (this.lddetO7 != null) {
                    
                          this.inventoryStatusService.getAllDetails({isd_status: this.lddetO7.ld_status, isd_tr_type: "ISS-SO" }).subscribe((resstat:any)=>{
                            console.log(resstat)
                            const { data } = resstat;
        
                            if (data) {
                              this.statO7 = null
                            } else {
                              this.statO7 = this.lddetO7.ld_status
                            }
                            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , sod_site:resp.data.pt_site, sod_loc: resp.data.pt_loc, sod_serial: null,
                              sod_um:resp.data.pt_um, sod_um_conv:1, sod_price: resp.data.pt_price, sod_disc_pct:0, sod_expire:this.lddetO7.ld_expire,sod_status: this.statO7, qty_oh: this.lddetO7.ld_qty_oh, sod_type: "M" , sod_taxc: resp.data.pt_taxc, sod_taxable: this.taxable})
                     
               // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   sod_status: this.stat, qty_oh: this.lddet[0].ld_qty_oh})
                          });     
            
                      } else { 
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , sod_site:resp.data.pt_site, sod_loc: resp.data.pt_loc, sod_serial: null,
                          sod_um:resp.data.pt_um, sod_um_conv:1, sod_price: resp.data.pt_price, sod_disc_pct:0,sod_expire: null, sod_status: null, qty_oh: 0, sod_type: 'M' , sod_taxc: resp.data.pt_taxc, sod_taxable: this.taxable})
                 
        
                      }
                     
        
                    });                
                       
                                      
              
                 }  else {
                    alert("Article Nexiste pas")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_part: null })
                 }
                  
                  });
        
                   
                 
                 
                }
              },
              {
                id: "mvid",
                field: "cmvid",
                excludeFromHeaderMenu: true,
                formatter: Formatters.infoIcon,
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  this.row_number = args.row;
                  let element: HTMLElement = document.getElementById(
                    "openItemsGrid"
                  ) as HTMLElement;
                  element.click();
                },
              },
              {
                id: "desc",
                name: "Description",
                field: "desc",
                sortable: true,
                width: 180,
                filterable: false,
              },
              {
                id: "sod_site",
                name: "Site",
                field: "sod_site",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                  model: Editors.text,
                  required: true,
                  validator: statusValidator,
        
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
        
                  this.siteService.getByOne({ si_site: args.dataContext.sod_site,}).subscribe(
                    (response: any) => {
                      
                  
        
                        if (response.data) {
                          
                            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_site: response.data.si_site})
                        }
                        else {
                              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , sod_site: null});
            
                             // this.gridService.onItemUpdated;
                              alert("Site N'existe pas")
                        }
                  });     
              }
        
              },
              {
                  id: "mvids",
                  field: "cmvids",
                  excludeFromHeaderMenu: true,
                  formatter: Formatters.infoIcon,
                  minWidth: 30,
                  maxWidth: 30,
                  onCellClick: (e: Event, args: OnEventArgs) => {
                      this.row_number = args.row;
                      let element: HTMLElement = document.getElementById(
                      "openSitesGrid"
                      ) as HTMLElement;
                      element.click();
                  },
              },
              
              {
                id: "sod_loc",
                name: "Emplacement",
                field: "sod_loc",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                  model: Editors.text,
                  required: true,
                  validator: statusValidator,
        
                },
        
        
                onCellChange: (e: Event, args: OnEventArgs) => {
                  console.log(args.dataContext.sod_loc)
                  
                    
                    this.locationService.getByOne({ loc_loc: args.dataContext.sod_loc, loc_site: args.dataContext.sod_site }).subscribe(
                      (response: any) => {
                        this.locationO7 = response.data
                        if (response.data) {
        
                            this.locationDetailService.getBy({ ld_site: args.dataContext.sod_site, ld_loc: args.dataContext.sod_loc, ld_part: args.dataContext.sod_part, ld_lot: null }).subscribe(
                              (response: any) => {
                                this.lddetO7 = response.data
                                console.log(this.lddetO7[0].ld_qty_oh)
                       
                                this.inventoryStatusService.getAllDetails({isd_status: this.locationO7.loc_status, isd_sod_type: "ISS-SO" }).subscribe((resstat:any)=>{
                                  console.log(resstat)
                                  const { data } = resstat;
          
                                  if (data) {
                                    this.statO7 = null
                                  } else {
                                    this.statO7 = this.locationO7.loc_status
                                  }
                            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   sod_status: this.statO7, qty_oh: this.lddetO7[0].ld_qty_oh})
                                });     
             
                              });     
                            }
                            else {
                              alert("Emplacement Nexiste pas")
                              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_loc: null, qty_oh: 0, sod_status: null })
                            }
                             
                });
        
              }
        
        
        
              },
              {
                  id: "mvidl",
                  field: "cmvidl",
                  excludeFromHeaderMenu: true,
                  formatter: Formatters.infoIcon,
                  minWidth: 30,
                  maxWidth: 30,
                  onCellClick: (e: Event, args: OnEventArgs) => {
                      this.row_number = args.row;
                      let element: HTMLElement = document.getElementById(
                      "openLocsGrid"
                      ) as HTMLElement;
                      element.click();
                  },
              },       
              
              {
                id: "sod_serial",
                name: "Lot/Serie",
                field: "sod_serial",
                sortable: true,
                width: 80,
                filterable: false,
                editor: {
                  model: Editors.text,
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
        
                    this.locationDetailService.getBy({ ld_site: args.dataContext.sod_site, ld_loc: args.dataContext.sod_loc, ld_part: args.dataContext.sod_part, ld_lot: args.dataContext.sod_serial }).subscribe(
                      (response: any) => {
                        this.lddetO7 = response.data
                        
                console.log(response.data.length)
                          if (response.data.length != 0) {
                            
                              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddetO7[0].ld_qty_oh, sod_status: this.lddetO7[0].ld_status, sod_expire: this.lddetO7[0].sod_expire})
                          }
                          else {
                                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , sod_serial: null, qty_0h: 0});
              
                                alert("Lot N' existe pas")
                          }
                    });     
                }
        
              },
              {
                  id: "mvidlot",
                  field: "cmvidlot",
                  excludeFromHeaderMenu: true,
                  formatter: Formatters.infoIcon,
                  minWidth: 30,
                  maxWidth: 30,
                  onCellClick: (e: Event, args: OnEventArgs) => {
                      this.row_number = args.row;
                      let element: HTMLElement = document.getElementById(
                      "openLocdetsGrid"
                      ) as HTMLElement;
                      element.click();
                  },
              },
              {
                  id: "qty_oh",
                  name: "QTE Stock",
                  field: "qty_oh",
                  sortable: true,
                  width: 80,
                  filterable: false,
                  type: FieldType.float,
                  
              },
              {
                id: "sod_um",
                name: "UM",
                field: "sod_um",
                sortable: true,
                width: 30,
                filterable: false,
                editor: {
                  model: Editors.text,
                },
        
                onCellChange: (e: Event, args: OnEventArgs) => {
                  console.log(args.dataContext.sod_part)
                  this.itemsService.getByOne({pt_part: args.dataContext.sod_part }).subscribe((resp:any)=>{
                    console.log(args.dataContext.sod_part, resp.data.pt_um )
                  if   (args.dataContext.sod_um == resp.data.pt_um )  {
                    
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: 1 })
                  } else { 
                    //console.log(resp.data.pt_um)
        
        
        
                      this.mesureService.getBy({um_um: args.dataContext.sod_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.sod_part  }).subscribe((res:any)=>{
                      console.log(res)
                      const { data } = res;
            
                    if (data) {
                      //alert ("Mouvement Interdit Pour ce Status")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: res.data.um_conv })
                      this.angularGrid.gridService.highlightRow(1, 1500);
                    } else {
                      this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.sod_um, um_part: args.dataContext.sod_part  }).subscribe((res:any)=>{
                        console.log(res)
                        const { data } = res;
                        if (data) {
                          //alert ("Mouvement Interdit Pour ce Status")
                          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: res.data.um_conv })
                          
                        } else {
                          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: "1" , sod_um: null});
                   
                          alert("UM conversion manquante")
                          
                        }  
                      })
        
                    }
                      })
        
                    }
                    })
          
                  }
        
        
        
        
              },
              {
                id: "mvid",
                field: "cmvid",
                excludeFromHeaderMenu: true,
                formatter: Formatters.infoIcon,
                minWidth: 30,
                maxWidth: 30,
                onCellClick: (e: Event, args: OnEventArgs) => {
                  this.row_number = args.row;
                  let element: HTMLElement = document.getElementById(
                    "openUmsGrid"
                  ) as HTMLElement;
                  element.click();
                },
              },
              {
                id: "sod_um_conv",
                name: "UM",
                field: "sod_um_conv",
                sortable: true,
                width: 30,
                filterable: false,
                
              },
              
              {
                id: "sod_qty_ord",
                name: "QTE",
                field: "sod_qty_ord",
                sortable: true,
                width: 60,
                filterable: false,
                type: FieldType.float,
                editor: {
                  model: Editors.float,
                  params: { decimalPlaces: 2 }
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
                  const controls = this.soFormO7.controls
                  
                  let pricebefore = args.dataContext.sod_price
                  
                  this.priceO7 = 0;
                  this.discO7 = 0;
                  if (args.dataContext.sod_type != "M"){
                    if (args.dataContext.sod_qty_ord * args.dataContext.sod_um_conv   > args.dataContext.qty_oh) {
                     
                    alert ("Qte Manquante")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_qty_ord: null })
                 //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
                
                  
                    }   
                  }
        
                  this.itemsService.getByOne({pt_part: args.dataContext.sod_part }).subscribe((resp:any)=>{
        
                    if (resp.data) {
                      console.log(resp.data)
                                  
                      const date1 = new Date
                     let obj: { }
                      const part = resp.data.pt_part
                      const promo = resp.data.pt_promo
                      const cust = this.customerO7.cm_addr
                      const classe = this.customerO7.cm_class
                      const qty = args.dataContext.sod_qty_ord
                      const um = args.dataContext.sod_um
                      const curr = controls.so_curr.value
                      const type = "PT"
                      const date =  `${controls.so_ord_date.value.year}-${controls.so_ord_date.value.month}-${controls.so_ord_date.value.day}`
                
                obj = {part, promo, cust, classe, date,qty,um,curr,type}
                  this.pricelistService.getPrice(obj).subscribe((res:any)=>{
                    console.log(res)
                    this.priceO7 = res.data
                    if(this.priceO7 == null){this.priceO7 = 0}
                    if (this.priceO7 != 0) { 
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_price: this.priceO7 })
                    }
                //    this.dataset[this.row_number].sod_price = this.price
                    //console.log(this.row_number,this.dataset[this.row_number].sod_price)
                    this.calculatetotO7();
                  });
                  
                  let objr: { }
                    const typer = "PR"
                    
              objr = {part, promo, cust, classe, date,qty,um,curr,typer}
                                    
                console.log(obj)
                
               
                this.pricelistService.getDiscPct(objr).subscribe((resdisc:any)=>{
                  console.log(resdisc)
                  this.discO7 = resdisc.data
                  if(this.discO7 == null){this.discO7 = 0}
                  if (this.discO7 != 0) {
                  //this.dataset[this.row_number].sod_disc_pct = this.disc
                  this.gridServiceO7.updateItemById(args.dataContext.id,{...args.dataContext , sod_price: this.priceO7 ,sod_disc_pct: this.discO7 })
                 // console.log(this.row_number,this.dataset[this.row_number].sod_price)
                  } 
                 this.calculatetotO7();
                
                });
        
        
        
                }
                
                });
        
                //console.log(this.row_number,this.dataset[this.row_number].sod_price)
                  this.calculatetotO7();
              }
              
              },
              {
                id: "sod_price",
                name: "Prix unitaire",
                field: "sod_price",
                sortable: true,
                width: 80,
                filterable: false,
                //type: FieldType.float,
                editor: {
                  model: Editors.float,
                  params: { decimalPlaces: 2 }
                },
                formatter: Formatters.decimal,
                onCellChange: (e: Event, args: OnEventArgs) => {
        
                  console.log(args.dataContext.sod_price)
                  this.calculatetotO7();
                }
              },
              {
                  id: "sod_disc_pct",
                  name: "Remise",
                  field: "sod_disc_pct",
                  sortable: true,
                  width: 50,
                  filterable: false,
                  //type: FieldType.float,
                  editor: {
                    model: Editors.float,
                    params: { decimalPlaces: 2 }
                  },
                  formatter: Formatters.decimal,
                  onCellChange: (e: Event, args: OnEventArgs) => {
        
                    console.log(args.dataContext.sod_disc_pct)
                    this.calculatetotO7();
                  }   
              },
                
                
            
              {
                id: "sod_type",
                name: "Type",
                field: "sod_type",
                sortable: true,
                width: 30,
                filterable: false,
                editor: {
                  model: Editors.text,
                },
                onCellChange: (e: Event, args: OnEventArgs) => {
        
                  if (args.dataContext.sod_type != "M") {
                    alert("Type doit etre M ou NULL")
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , sod_type: null});
                    
                  }
                }
              },
              {
                id: "sod_status",
                name: "Status",
                field: "sod_status",
                sortable: true,
                width: 80,
                filterable: false,
                
              },
              {
                id: "sod_expire",
                name: "Expire",
                field: "sod_expire",
                sortable: true,
                width: 80,
                filterable: false,
                type: FieldType.dateIso,
                formatter: Formatters.dateIso,
                
              },
              {
                id: "sod_taxable",
                name: "Taxable",
                field: "sod_taxable",
                sortable: true,
                width: 30,
                filterable: false,
                editor: {
                  model: Editors.checkbox
                },
                formatter: Formatters.checkmark,
                cannotTriggerInsert: true,
              },
              {
                id: "sod_tax_code",
                name: "code de taxe",
                field: "sod_tax_code",
                sortable: true,
                width: 50,
                filterable: false,
              },
               
              {
                id: "sod_taxc",
                name: "taux de taxe",
                field: "sod_taxc",
                sortable: true,
                width: 50,
                filterable: false,
                editor: {
                  model: Editors.text,
                },
                formatter: Formatters.percentComplete,
              
              onCellChange: (e: Event, args: OnEventArgs) => {
        
                this.calculatetotO7(); 
              }
            },
            ];
        
            this.gridOptionsO7 = {
              asyncEditorLoading: false,
              editable: true,
              enableColumnPicker: true,
              enableCellNavigation: true,
              enableRowSelection: true,
              formatterOptions: {
                
                // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
                displayNegativeNumberWithParentheses: true,
          
                // Defaults to undefined, minimum number of decimals
                minDecimal: 2,
          
                // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
                thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
              },
              
            };
        
            this.datasetO7 = [];
          }
          ngOnInitO7(): void {
            this.loading$ = this.loadingSubject.asObservable();
            this.loadingSubject.next(false);
            this.userO7 =  JSON.parse(localStorage.getItem('user'))
            this.createFormO7();
            this.createtotFormO7();
            
            this.activatedRoute.params.subscribe((params) => {
              const id = params.id;
              if (id) {
                const controls = this.soFormO7.controls;
        
                this.quoteService.findByOne({ id }).subscribe(
                  (res: any) => {
                    console.log("aa", res.data);
                    const { quote, details } = res.data;
                    this.qoServerO7 = quote;
        
                    controls.so_cust.setValue(this.qoServerO7.qo_cust);
                    controls.so_po.setValue(this.qoServerO7.qo_nbr);
                    controls.so_curr.setValue(this.qoServerO7.qo_curr);
                    this.customersService
                          .getBy({ cm_addr: this.qoServerO7.qo_cust })
                          .subscribe((res: any) => (this.customerO7 = res.data));
                    for (const object in details) {
                      const detail = details[object];
                      this.gridServiceO7.addItem(
                        {
                          id: this.datasetO7.length + 1,
                          sod_line: this.datasetO7.length + 1,
                         
                          sod_part: detail.qod_part,
                          cmvid: "",
                          desc: detail.item.pt_desc1,
                          sod_qty_ord: detail.qod_qty_ord,
                          sod_um: detail.qod_um,
                          sod_price: detail.qod_price,
                          sod_disc_pct: detail.qod_disc_pct,
                          sod_site: detail.item.pt_site,
                          sod_loc: detail.item.pt_loc,
                          sod_type: "M",
                          sod_cc: "",
                          sod_taxable: detail.item.pt_taxable,
                          sod_tax_code: detail.item.taxe.tx2_tax_code,
                          sod_taxc: detail.item.taxe.tx2_tax_pct,
                        },
                        { position: "bottom" }
                      );
                      this.datasetPrintO7.push({
                        id: this.datasetO7.length + 1,
                        sod_line: this.datasetO7.length + 1,
                       
                        sod_part: detail.qod_part,
                        cmvid: "",
                        desc: detail.item.pt_desc1,
                        sod_qty_ord: detail.qod_qty_ord,
                        sod_um: detail.qod_um,
                        sod_price: detail.qod_price,
                        sod_disc_pct: detail.qod_disc_pct,
                        sod_site: detail.item.pt_site,
                        sod_loc: detail.item.pt_loc,
                        sod_type: "M",
                        sod_cc: "",
                        sod_taxable: detail.item.pt_taxable,
                        sod_tax_code: detail.item.taxe.tx2_tax_code,
                        sod_taxc: detail.item.taxe.tx2_tax_pct,
                        taxe: detail.item.taxe.tx2_tax_pct,
                      });
                    }
                  },
                  (error) => {
                    this.message = ` ce numero ${id} n'existe pas`;
                    this.hasFormErrors = true;
                  },
                  () => {}
                );
              }
            });
          }
        
          //create form
          createFormO7() {
            this.loadingSubject.next(false);
            this.saleOrderO7 = new SaleOrder();
            const date = new Date;
            
            this.soFormO7 = this.soFB.group({
          //    so__chr01: [this.saleOrder.so__chr01],
              so_category: [this.saleOrderO7.so_category , Validators.required],
              so_cust: [this.saleOrderO7.so_cust, Validators.required],
              name: [{value:"", disabled: true}],
                
              so_bill: [this.saleOrderO7.so_bill , Validators.required],
              namebill: [{value:"", disabled: true}],
        
              so_ord_date: [{
                year:date.getFullYear(),
                month: date.getMonth()+1,
                day: date.getDate()
              }],
              so_due_date: [{
                year:date.getFullYear(),
                month: date.getMonth()+1,
                day: date.getDate()
              }],
              
              so_taxable: [this.saleOrderO7.so_taxable],
             
              so_po: [this.saleOrderO7.so_po],
              so_rmks: [this.saleOrderO7.so_rmks],
              so_curr: [this.saleOrderO7.so_curr],
              so_ex_rate: [this.saleOrderO7.so_ex_rate],
              so_ex_rate2: [this.saleOrderO7.so_ex_rate2],
              so_cr_terms: [this.saleOrderO7.so_cr_terms],
              print:[true]
            });
        
            
            
        
          }
          createtotFormO7() {
            this.loadingSubject.next(false);
            //this.saleOrder = new SaleOrder();
           // const date = new Date;
            
            this.totFormO7 = this.totFBO7.group({
          //    so__chr01: [this.saleOrder.so__chr01],
              tht: [{value: 0.00 , disabled: true}],
              tva: [{value: 0.00 , disabled: true}],
              timbre: [{value: 0.00 , disabled: true}],
              ttc: [{value: 0.00 , disabled: true}],
            });
        
            
            
        
          }
          onChangeSeqO7() {
              const controls = this.soFormO7.controls
              console.log(this.userO7.usrd_profile)
              this.sequencesService
                  .getBy({seq_seq: controls.so_category.value, seq_type: 'SO', seq_profile: this.userO7.usrd_profile})
                  .subscribe((response: any) => {
                      console.log(response)
                      if (response.data.length == 0) {
                          alert("Sequence nexiste pas")
                          controls.so_category.setValue("")
                          console.log(response.data.length)
                          document.getElementById("SEQUENCE").focus();
                      } 
                  })
          }
          //reste form
          resetO7() {
            this.saleOrderO7 = new SaleOrder();
            this.createFormO7();
            this.createtotFormO7();
            this.hasFormErrors = false;
            this.datasetO7 = [];
          }
          // save data
          onSubmitO7() {
            this.hasFormErrors = false;
            const controls = this.soFormO7.controls;
            /** check form */
            // if (this.soFormO7.invalid) {
            //   Object.keys(controls).forEach((controlName) =>
            //     controls[controlName].markAsTouched()
            //   );
            //   this.message = "Modifiez quelques éléments et réessayez de soumettre.";
            //   this.hasFormErrors = true;
        
            //   return;
            // }
        
            if (!this.datasetO7.length) {
              this.message = "La liste des article ne peut pas etre vide";
              this.hasFormErrors = true;
        
              return;
            }
            for (var i = 0; i < this.datasetO7.length; i++) {
              console.log(this.datasetO7[i]  )
              this.datasetO7[i].sod_qty_inv = this.datasetO7[i].sod_qty_ord;
              this.datasetO7[i].sod_qty_ship = this.datasetO7[i].sod_qty_ord;
             if (this.datasetO7[i].sod_part == "" || this.datasetO7[i].sod_part == null  ) {
              this.message = "L' article ne peut pas etre vide";
              this.hasFormErrors = true;
              return;
         
             }
             if (this.datasetO7[i].sod_site == "" || this.datasetO7[i].sod_site == null  ) {
              this.message = "Le Site ne peut pas etre vide";
              this.hasFormErrors = true;
              return;
         
             }
             if (this.datasetO7[i].sod_loc == "" || this.datasetO7[i].sod_loc == null  ) {
              this.message = "L' Emplacement ne peut pas etre vide";
              this.hasFormErrors = true;
              return;
         
             }
             if (this.datasetO7[i].sod_um == "" || this.datasetO7[i].sod_um == null  ) {
              this.message = "L' UM ne peut pas etre vide";
              this.hasFormErrors = true;
              return;
         
             }
             
             if (this.datasetO7[i].sod_qty_loc == 0 ) {
              this.message = "La Quantite ne peut pas etre 0";
              this.hasFormErrors = true;
              return;
         
             }
        
            }
            // tslint:disable-next-line:prefer-const
            let so = this.prepareSo();
            
            this.addSo(so, this.datasetO7);
          }
        
          /**
           *
           * Returns object for saving
           */
          prepareSo(): any {
            const controls = this.soFormO7.controls;
            const controls1 = this.totFormO7.controls;
            const _so = new SaleOrder();
            _so.so_category =  controls.so_category.value
            _so.so_cust = controls.so_cust.value;
            _so.so_bill = controls.so_bill.value;
            _so.so_ord_date = controls.so_ord_date.value
              ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
              : null;
            _so.so_due_date = controls.so_due_date.value
              ? `${controls.so_due_date.value.year}/${controls.so_due_date.value.month}/${controls.so_due_date.value.day}`
              : null;
              if (controls.so_taxable.value == null || controls.so_taxable.value == "" ) { _so.so_taxable = false} else { _so.so_taxable = controls.so_taxable.value}
            
            
            _so.so_po = controls.so_po.value;
            
            _so.so_rmks = controls.so_rmks.value;
            _so.so_curr = controls.so_curr.value;
            _so.so_ex_rate = controls.so_ex_rate.value;
            _so.so_ex_rate2 = controls.so_ex_rate2.value;
            _so.so_cr_terms = controls.so_cr_terms.value;
            _so.so_to_inv = true;
           
            _so.so_amt = controls1.tht.value
            _so.so_tax_amt = controls1.tva.value
            _so.so_trl1_amt = controls1.timbre.value
            
               
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
            const controls = this.soFormO7.controls;
        
            this.saleOrderService
              .adddirect({ saleOrder: _so, saleOrderDetail: detail })
              .subscribe(
                (reponse: any) => (so = reponse.data),
                (error) => {
                  this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                  );
                  this.loadingSubject.next(false);
                },
                () => {
                  this.layoutUtilsService.showActionNotification(
                    "Ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                  );
                  this.loadingSubject.next(false);
                  console.log(this.datasetO7);
                  if(controls.print.value == true) {this.printpdfO7(so.so_nbr)} // printSO(this.customer, this.dataset, so);
                  this.resetO7();
                  this.loadingSubject.next(true);
                  this.router.navigateByUrl("/sales/create-direct-invoice");
                  
           //       this.dataset = [];
                }
              );
          }
          onChangeBillO7() {
            const controls = this.soFormO7.controls;
            const cm_addr = controls.so_bill.value;
            const date = new Date()
            this.dateO7 = controls.so_ord_date.value
            ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
            : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        
            //this.dataset = [];
            this.customersService.getBy({ cm_addr }).subscribe(
              (res: any) => {
                console.log(res);
                const { data } = res;
        
                if (!data) {
                  this.layoutUtilsService.showActionNotification(
                    "ce client n'existe pas!",
                    MessageType.Create,
                    10000,
                    true,
                    true
                  );
                  this.error = true;
                  document.getElementById("bill").focus();
                } else {
                  this.error = false;
                  this.billerO7 = res.data; 
                  controls.so_bill.setValue(data.cm_addr || "");
                  controls.so_cr_terms.setValue(data.cm_cr_terms || "");
                  controls.so_curr.setValue(data.cm_curr || "");
                  controls.so_taxable.setValue(data.address.ad_taxable || "");
                  controls.namebill.setValue(data.address.ad_name || "");
                      
                    
                    this.deviseService.getBy({ cu_curr: data.cm_curr }).subscribe(
                      (res: any) => {
                        console.log(res);
                        const { data } = res;
                  if(data) {
        
                    this.currO7 = data;
                  }
        
                      })
        
                      if (data.cm_curr == 'DA'){
                        controls.so_ex_rate.setValue(1)
                        controls.so_ex_rate2.setValue(1)
          
                      } else {
          
                      this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.dateO7}).subscribe((res:any)=>{
                        
                         controls.so_ex_rate.setValue(res.data.exr_rate)
                         controls.so_ex_rate2.setValue(res.data.exr_rate2)
                        })
          
                        }
          
        
                }
               
              });    
            
          //  (error) => console.log(error)
          
        
            
            
          }
          onChangeOCO7() {
            const controls = this.soFormO7.controls;
            const qo_nbr = controls.so_po.value;
           
            this.quoteService.findByOne({ qo_nbr: qo_nbr }).subscribe(
              (res: any) => {
                const { quoteOrder, details } = res.data;
                console.log(quoteOrder)
                controls.so_cust.setValue(quoteOrder.qo_cust)
                controls.so_curr.setValue(quoteOrder.qo_curr)
                controls.so_cr_terms.setValue(quoteOrder.qo_cr_terms)
                controls.so_taxable.setValue(quoteOrder.qo_taxable)
                this.customersService.getBy({ cm_addr: quoteOrder.qo_cust }).subscribe(
                  (res: any) => {
                    //console.log(res);
                    const { data } = res;
                    this.customerO7 = res.data;
                    
        
                  })
                        for (const object in details) {
                          const detail = details[object];
                          console.log(detail.item);
                          this.gridServiceO7.addItem(
                            {
                              id: this.datasetO7.length + 1,
                              sod_line: this.datasetO7.length + 1,
                              
                              sod_part: detail.qod_part,
                              cmvid: "",
                              desc: detail.item.pt_desc1,
                              sod_qty_ord: detail.qod_qty_ord,
                              sod_um: detail.qod_um,
                              sod_price: detail.qod_price,
                              sod_disc_pct: detail.qod_disc_pct,
                              sod_site: detail.item.pt_site,
                              sod_loc: detail.item.pt_loc,
                              sod_type: "M",
                              sod_cc: "",
                              sod_taxable: detail.item.pt_taxable,
                              sod_tax_code: detail.item.pt_taxc,
                              sod_taxc: detail.item.taxe.tx2_tax_pct,
                            },
                            { position: "bottom" }
                          );
                          this.datasetPrintO7.push({
                            id: this.datasetO7.length + 1,
                            sod_line: this.datasetO7.length + 1,
                           
                            sod_part: detail.qod_part,
                            cmvid: "",
                            desc: detail.item.pt_desc1,
                            sod_qty_ord: detail.qod_qty_ord,
                            sod_um: detail.qod_um,
                            sod_price: detail.qod_price,
                            sod_disc_pct: detail.qod_disc_pct,
                            sod_site: detail.item.pt_site,
                            sod_loc: detail.item.pt_loc,
                            sod_type: "M",
                            sod_cc: "",
                            sod_taxable: detail.item.pt_taxable,
                            sod_tax_code: detail.item.pt_taxc,
                            sod_taxc: detail.item.taxe.tx2_tax_pct,
                            
                          });
                        }
                      
                     // }
                  //);
              }),
              (error) => {
                this.message = `Demande avec ce numero ${qo_nbr} n'existe pas`;
                this.hasFormErrors = true;
              },
              () => {}        
        }
          changeCurrO7(){
            const controls = this.soFormO7.controls // chof le champs hada wesh men form rah
            const cu_curr  = controls.so_curr.value
        
            const date = new Date()
        
            this.dateO7 = controls.so_ord_date.value
              ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
              : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        
             
            this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
                const {data} = res
                console.log(res)
                if (!data){ this.layoutUtilsService.showActionNotification(
                    "cette devise n'existe pas!",
                    MessageType.Create,
                    10000,
                    true,
                    true
                )
            this.error = true}
                else {
                    this.error = false;
             
                    if (cu_curr == 'DA'){
                      controls.so_ex_rate.setValue(1)
                      controls.so_ex_rate2.setValue(1)
        
                    } else {
        
                      console.log(this.dateO7)
                    this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.dateO7 /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                      controls.so_ex_rate.setValue(res.data.exr_rate)
                       controls.so_ex_rate2.setValue(res.data.exr_rate2)
                      })
             
                      }
                     
             
                }
        
        
            },error=>console.log(error))
        }
        changeRateCurrO7(){
          const controls = this.soFormO7.controls // chof le champs hada wesh men form rah
          const cu_curr  = controls.so_curr.value
        
          const date = new Date()
        
          this.dateO7 = controls.so_ord_date.value
            ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
            : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        
            if (cu_curr == 'DA'){
              controls.so_ex_rate.setValue(1)
              controls.so_ex_rate2.setValue(1)
        
            } else {
                  this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.dateO7 /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
                    
        
                     controls.so_ex_rate.setValue(res.data.exr_rate)
                     controls.so_ex_rate2.setValue(res.data.exr_rate2)
                    })
           
            }
                   
                  
          
        }
        changeTaxO7(){
          const controls = this.soFormO7.controls // chof le champs hada wesh men form rah
          const tx2_tax_code  = controls.so_taxc.value
          this.taxService.getBy({tx2_tax_code}).subscribe((res:any)=>{
              const {data} = res
              console.log(res)
              if (!data){ this.layoutUtilsService.showActionNotification(
                  "cette Taxe n'existe pas!",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
          this.error = true}
              else {
                  this.error = false
              }
        
        
          },error=>console.log(error))
        }
        
        
          onChangeCustO7() {
              const controls = this.soFormO7.controls; // chof le champs hada wesh men form rah
              const cm_addr = controls.so_cust.value;
              const date = new Date()
        
              this.dateO7 = controls.so_ord_date.value
              ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
              : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        
        
              this.customersService.getBy({ cm_addr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
          
                  if (!data) {
                    this.layoutUtilsService.showActionNotification(
                      "ce client n'existe pas!",
                      MessageType.Create,
                      10000,
                      true,
                      true
                    );
                    this.error = true;
                    document.getElementById("cust").focus();
                  } else {
                    this.error = false;
                    this.customerO7 = res.data; 
                    controls.so_cust.setValue(data.cm_addr || "");
                    controls.name.setValue(data.address.ad_name || "");
                    controls.so_bill.setValue(data.cm_bill || "");
                    controls.so_curr.setValue(data.cm_curr || "");
                    controls.so_taxable.setValue(data.address.ad_taxable || "");
                    controls.so_cr_terms.setValue(data.cm_cr_terms || "");
                  
                    this.addressService.getBy({ ad_addr:data.cm_bill  }).subscribe(
                      (resadr: any) => {
                        controls.namebill.setValue(resadr.data.ad_name || "");
                        
                      
                      })
                      this.deviseService.getBy({ cu_curr: data.cm_curr }).subscribe(
                        (res: any) => {
                          console.log(res);
                          const { data } = res;
                    if(data) {
          
                      this.currO7 = data;
                    }
          
                        })
          
                    if (data.cm_curr == 'DA'){
                      controls.so_ex_rate.setValue(1)
                      controls.so_ex_rate2.setValue(1)
        
                    } else {
        
                    this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.dateO7}).subscribe((res:any)=>{
                      
                       controls.so_ex_rate.setValue(res.data.exr_rate)
                       controls.so_ex_rate2.setValue(res.data.exr_rate2)
                      })
        
                      }
        
                  }
                   
                },
                (error) => console.log(error)
              );
            }
        
          /**
           * Go back to the list
           *
           */
          goBackO7() {
            this.loadingSubject.next(false);
            const url = `/`;
            this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
          }
        
          // add new Item to Datatable
          addNewItemO7() {
            this.gridServiceO7.addItem(
              {
                id: this.datasetO7.length + 1,
                sod_line: this.datasetO7.length + 1,
         
                sod_part: "",
                cmvid: "",
                desc: "",
                sod_qty_ord: 0,
                sod_um: "",
                sod_price: 0,
                sod_disc_pct: 0,
                sod_site: "",
                sod_loc: "",
                sod_type: "",
                sod_cc: "",
                sod_taxable: true,
                sod_tax_code: "",
                sod_taxc: "",
              },
              { position: "bottom" }
            );
          }
          handleSelectedRowsChanged2O7(e, args) {
            const controls = this.soFormO7.controls;
            if (Array.isArray(args.rows) && this.gridObj2O7) {
              args.rows.map((idx) => {
                const item = this.gridObj2O7.getDataItem(idx);
                console.log(item)
                const date = new Date()
        
                this.dateO7 = controls.so_ord_date.value
                ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
                : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
          
        
                this.customerO7 = item;
                controls.so_cust.setValue(item.cm_addr || "");
                controls.so_bill.setValue(item.cm_bill || "");
                controls.name.setValue(item.address.ad_name || "");
                controls.so_curr.setValue(item.cm_curr || "");
                controls.so_cr_terms.setValue(item.cm_cr_terms || "");
                controls.so_taxable.setValue(item.address.ad_taxable || "");
              
                
               
                const cm_addr = item.cm_addr;
             //   this.dataset = [];
              this.customersService.getBy({ cm_addr: item.cm_bill }).subscribe(
                (ressa: any) => {
                  console.log(ressa);
                  
                    this.error = false;
                    this.billerO7 = ressa.data; 
                    //controls.ih_bill.setValue(dataa.cm_addr || "");
                    controls.namebill.setValue(ressa.data.address.ad_name || "");
                    
                    controls.so_curr.setValue(ressa.data.cm_curr || "");
                    controls.so_taxable.setValue(ressa.data.address.ad_taxable || "");
                    controls.so_cr_terms.setValue(ressa.data.cm_cr_terms || "");
                    
                
          
          
                this.deviseService.getBy({ cu_curr: ressa.data.cm_curr }).subscribe(
                  (res: any) => {
                    console.log(res);
                    const { data } = res;
                      if(data) {
          
                        this.curr = data;
                      }
                      if (item.cm_curr == 'DA'){
                        controls.so_ex_rate.setValue(1)
                        controls.so_ex_rate2.setValue(1)
          
                      } else {
          
                      this.deviseService.getExRate({exr_curr1:item.cm_curr, exr_curr2:'DA', date: this.dateO7}).subscribe((res:any)=>{
                        
                         controls.so_ex_rate.setValue(res.data.exr_rate)
                         controls.so_ex_rate2.setValue(res.data.exr_rate2)
                        })
          
                        }
          
          
                  })
          
          
                })  
          
        
              });
            }
          }
        
          angularGridReady2O7(angularGrid: AngularGridInstance) {
            this.angularGrid2O7 = angularGrid;
            this.gridObj2O7 = (angularGrid && angularGrid.slickGrid) || {};
          }
        
          prepareGrid2O7() {
            this.columnDefinitions2O7 = [
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
        
            this.gridOptions2O7 = {
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
            this.customersService
              .getAll()
              .subscribe((response: any) => (this.customersO7 = response.data));
          }
          open2O7(content) {
            this.prepareGrid2O7();
            this.modalService.open(content, { size: "lg" });
          }
        
          handleSelectedRowsChanged3O7(e, args) {
            const controls = this.soFormO7.controls;
            if (Array.isArray(args.rows) && this.gridObj3O7) {
              args.rows.map((idx) => {
                const item = this.gridObj3O7.getDataItem(idx);
                console.log(item);
                controls.so_buyer.setValue(item.usrd_code || "");
              });
            }
          }
        
          angularGridReady3O7(angularGrid: AngularGridInstance) {
            this.angularGrid3O7 = angularGrid;
            this.gridObj3O7 = (angularGrid && angularGrid.slickGrid) || {};
          }
        
          prepareGrid3O7() {
            this.columnDefinitions3O7 = [
              {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
              },
              {
                id: "usrd_code",
                name: "code user",
                field: "usrd_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "usrd_name",
                name: "nom",
                field: "usrd_name",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
            ];
        
            this.gridOptions3O7 = {
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
            this.userService
              .getAllUsers()
              .subscribe((response: any) => (this.usersO7 = response.data));
          }
          open3O7(content) {
            this.prepareGrid3O7();
            this.modalService.open(content, { size: "lg" });
          }
        
          handleSelectedRowsChanged4O7(e, args) {
            let updateItem = this.gridServiceO7.getDataItemByRowIndex(this.row_number);
            const controls = this.soFormO7.controls;
            
            if (Array.isArray(args.rows) && this.gridObj4O7) {
              args.rows.map((idx) => {
        
                
                const item = this.gridObj4O7.getDataItem(idx);
                console.log(item);
                if (item.pt_phantom) {
                  this.typeO7 = 'M'
                 
                } else {
                  this.typeO7 = null
                }         
                
                if (controls.so_taxable.value == false) {this.taxableO7 = false} else { this.taxableO7 = item.pt_taxable}
                     
                     
                this.locationDetailService.getByOne({ ld_site: item.pt_site, ld_loc: item.pt_loc, ld_part: item.pt_part, ld_lot: null }).subscribe(
                  (response: any) => {
                    this.lddetO7 = response.data
                    //console.log(this.lddet.ld_qty_oh)
                   if (this.lddetO7 != null) { 
                    this.inventoryStatusService.getAllDetails({isd_status: this.lddetO7.ld_status, isd_tr_type: "ISS-SO" }).subscribe((resstat:any)=>{
                      console.log(resstat)
                      const { data } = resstat;
        
                      if (data) {
                        this.statO7 = null
                      } else {
                        this.statO7 = this.lddetO7.ld_status
                      }
                      updateItem.sod_part = item.pt_part;
                      updateItem.desc = item.pt_desc1;
                      updateItem.sod_um = item.pt_um;
                      updateItem.sod_um_conv = 1;
                      
                      updateItem.sod_site = item.pt_site;
                      updateItem.sod_loc = item.pt_loc
                      updateItem.sod_serial = null
                      updateItem.sod_taxable = this.taxable
                      updateItem.sod_tax_code = item.pt_taxc
                      updateItem.sod_taxc = item.taxe.tx2_tax_pct
                      updateItem.sod_type = "M"
                      updateItem.sod_price = item.pt_price
                      updateItem.sod_disc_pct = 0
                      updateItem.qty_oh = this.lddetO7.ld_qty_oh
                      updateItem.sod_status = this.statO7
                      updateItem.sod_expire = this.lddetO7.ld_expire
                      
                      
                      this.gridServiceO7.updateItem(updateItem);
                    })  
                  }else {
                    updateItem.sod_part = item.pt_part;
                    updateItem.desc = item.pt_desc1;
                    updateItem.sod_um = item.pt_um;
                    updateItem.sod_um_conv = 1;
                    
                    updateItem.sod_site = item.pt_site;
                    updateItem.sod_loc = item.pt_loc
                    updateItem.sod_serial = null
                    updateItem.sod_taxable = this.taxable
                    updateItem.sod_taxc = item.taxe.tx2_tax_pct
                    updateItem.sod_tax_code = item.taxe.tx2_tax_code
                    updateItem.sod_type = "M"
                    updateItem.sod_price = item.pt_price
                    updateItem.sod_disc_pct = 0
                    updateItem.qty_oh = 0
                    updateItem.sod_status = null
                    updateItem.sod_expire = null
                    
                    
                    this.gridServiceO7.updateItem(updateItem);
                 
        
                  }
                  })
              }) 
              
            }
          }
          angularGridReady4O7(angularGrid: AngularGridInstance) {
            this.angularGrid4O7 = angularGrid;
            this.gridObj4O7 = (angularGrid && angularGrid.slickGrid) || {};
          }
        
          prepareGrid4O7() {
            this.columnDefinitions4O7 = [
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
            ];
        
            this.gridOptions4O7 = {
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
            this.itemsService
              .getAll()
              .subscribe((response: any) => (this.itemsO7 = response.data));
          }
          open4O7(content) {
            this.prepareGrid4O7();
            this.modalService.open(content, { size: "lg" });
          }
          onAlertCloseO7($event) {
            this.hasFormErrors = false;
          }
        
          handleSelectedRowsChanged5O7(e, args) {
            const controls = this.soFormO7.controls;
        
            const qo_nbr = controls.so_po.value;
            const qo_cust = controls.so_cust.value;
        
            if (Array.isArray(args.rows) && this.gridObj5O7) {
              args.rows.map((idx) => {
                const item = this.gridObj5O7.getDataItem(idx);
                controls.so_po.setValue(item.qo_nbr || "");
                controls.so_cust.setValue(item.qo_cust)
                controls.so_curr.setValue(item.qo_curr)
                controls.so_cr_terms.setValue(item.qo_cr_terms)
                controls.so_taxable.setValue(item.qo_taxable)
            
        
                this.quoteService.findByOne({ qo_nbr: item.qo_nbr }).subscribe(
                  (res: any) => {
                    const { quoteOrder, details } = res.data;
                    console.log(details)
        
                    
        
                    this.customersService.getBy({ cm_addr: item.qo_cust }).subscribe(
                      (res: any) => {
                        //console.log(res);
                        ;
                        this.customerO7 = res.data;
          
                      })
                    
                            for (const object in details) {
                              const detail = details[object];
                              console.log(detail.item);
                              this.gridServiceO7.addItem(
                                {
                                  id: this.datasetO7.length + 1,
                                  sod_line: this.datasetO7.length + 1,
                                  
                                  sod_part: detail.qod_part,
                                  cmvid: "",
                                  desc: detail.item.pt_desc1,
                                  sod_qty_ord: detail.qod_qty_ord,
                                  sod_um: detail.qod_um,
                                  sod_price: detail.qod_price,
                                  sod_disc_pct: detail.qod_disc_pct,
                                  sod_site: detail.item.pt_site,
                                  sod_loc: detail.item.pt_loc,
                                  sod_type: "M",
                                  sod_cc: "",
                                  sod_taxable: detail.item.pt_taxable,
                                  sod_tax_code: detail.item.pt_taxc,
                                  sod_taxc: detail.item.taxe.tx2_tax_pct,
                                },
                                { position: "bottom" }
                              );
                              this.datasetPrintO7.push({
                                id: this.datasetO7.length + 1,
                                sod_line: this.datasetO7.length + 1,
                               
                                sod_part: detail.qod_part,
                                cmvid: "",
                                desc: detail.item.pt_desc1,
                                sod_qty_ord: detail.qod_qty_ord,
                                sod_um: detail.qod_um,
                                sod_price: detail.qod_price,
                                sod_disc_pct: detail.qod_disc_pct,
                                sod_site: detail.item.pt_site,
                                sod_loc: detail.item.pt_loc,
                                sod_type: "M",
                                sod_cc: "",
                                sod_taxable: detail.item.pt_taxable,
                                sod_tax_code: detail.item.pt_taxc,
                                sod_taxc: detail.item.taxe.tx2_tax_pct,
                               // taxe: detail.item.taxe.tx2_tax_pct,
                              });
                            }
                          
                         // }
                      //);
                  },
                  (error) => {
                    this.message = `Demande avec ce numero ${qo_nbr} n'existe pas`;
                    this.hasFormErrors = true;
                  },
                  () => {}
                );
            
              });
            }
          }
        
          angularGridReady5O7(angularGrid: AngularGridInstance) {
            this.angularGrid5O7 = angularGrid;
            this.gridObj5O7 = (angularGrid && angularGrid.slickGrid) || {};
          }
        
          prepareGrid5O7() {
            this.columnDefinitions5O7 = [
              {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
              },
              {
                id: "qo_nbr",
                name: "N° Offre",
                field: "qo_nbr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "qo_ord_date",
                name: "Date",
                field: "qo_ord_date",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "qo_cust",
                name: "Client",
                field: "qo_cust",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
            ];
        
            this.gridOptions5O7 = {
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
            this.quoteService
              .getAll()
              .subscribe((response: any) => (this.quotesO7 = response.data));
          }
          open5O7(content) {
            this.prepareGrid5O7();
            this.modalService.open(content, { size: "lg" });
          }
          handleSelectedRowsChangedtaxO7(e, args) {
            const controls = this.soFormO7.controls;
            if (Array.isArray(args.rows) && this.gridObjtaxO7) {
              args.rows.map((idx) => {
                const item = this.gridObjtax.getDataItem(idx);
                controls.so_taxc.setValue(item.tx2_tax_code || "");
              });
            }
          }
        
          angularGridReadytaxO7(angularGrid: AngularGridInstance) {
            this.angularGridtaxO7 = angularGrid;
            this.gridObjtaxO7 = (angularGrid && angularGrid.slickGrid) || {};
          }
        
          prepareGridtaxO7() {
            this.columnDefinitionstaxO7 = [
              {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
              },
              {
                id: "tx2_tax_code",
                name: "code ",
                field: "tx2_tax_code",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "tx2_tax_pct",
                name: "Taux Taxe ",
                field: "tx2_tax_pct",
                sortable: true,
                filterable: true,
                type: FieldType.float,
              },
              {
                id: "tx2_desc",
                name: "Designation",
                field: "tx2_desc",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "tx2_tax_type",
                name: "Type Taxe",
                field: "tx2_tax_type",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
            ];
        
            this.gridOptionstaxO7 = {
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
            this.taxService
              .getAll()
              .subscribe((response: any) => (this.datataxO7 = response.data));
          }
          opentaxO7(contenttax) {
            this.prepareGridtaxO7();
            this.modalService.open(contenttax, { size: "lg" });
          }
        
        
          handleSelectedRowsChangedcurrO7(e, args) {
            const controls = this.soFormO7.controls;
            if (Array.isArray(args.rows) && this.gridObjcurrO7) {
              args.rows.map((idx) => {
                const item = this.gridObjcurrO7.getDataItem(idx);
                controls.so_curr.setValue(item.cu_curr || "");
                  const date = new Date()
                  this.dateO7 = controls.so_ord_date.value
                  ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
                  : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
                  if (item.cu_curr == 'DA'){
                    controls.so_ex_rate.setValue(1)
                    controls.so_ex_rate2.setValue(1)
        
                  } else {
                  this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: this.dateO7}).subscribe((res:any)=>{
                    
                     controls.so_ex_rate.setValue(res.data.exr_rate)
                     controls.so_ex_rate2.setValue(res.data.exr_rate2)
                    
                  })
                }
                
        
              });
            }
          }
        
          angularGridReadycurrO7(angularGrid: AngularGridInstance) {
            this.angularGridcurrO7 = angularGrid;
            this.gridObjcurrO7 = (angularGrid && angularGrid.slickGrid) || {};
          }
        
          prepareGridcurrO7() {
            this.columnDefinitionscurrO7 = [
              {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
              },
              {
                id: "cu_curr",
                name: "code",
                field: "cu_curr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "cu_desc",
                name: "Designation",
                field: "cu_desc",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "cu_rnd_mthd",
                name: "Methode Arrondi",
                field: "cu_rnd_mthd",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "cu_active",
                name: "Actif",
                field: "cu_active",
                sortable: true,
                filterable: true,
                type: FieldType.boolean,
              },
              {
                id: "cu_iso_curr",
                name: "Devise Iso",
                field: "cu_iso_curr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
            ];
        
            this.gridOptionscurrO7 = {
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
            this.deviseService
              .getAll()
              .subscribe((response: any) => (this.devisesO7 = response.data));
          }
          opencurrO7(content) {
            this.prepareGridcurrO7();
            this.modalService.open(content, { size: "lg" });
          }
        
        
        
        
          handleSelectedRowsChangedumO7(e, args) {
            let updateItem = this.gridServiceO7.getDataItemByRowIndex(this.row_number);
            if (Array.isArray(args.rows) && this.gridObjumO7) {
              args.rows.map((idx) => {
                const item = this.gridObjumO7.getDataItem(idx);
                updateItem.sod_um = item.code_value;
             
                this.gridServiceO7.updateItem(updateItem);
        
        /*********/
        console.log(updateItem.sod_part)
        
              this.itemsService.getBy({pt_part: updateItem.sod_part }).subscribe((resp:any)=>{
                              
                if   (updateItem.sod_um == resp.data.pt_um )  {
                  
                  updateItem.sod_um_conv = 1
                } else { 
                  //console.log(resp.data.pt_um)
        
        
        
                    this.mesureService.getBy({um_um: updateItem.sod_um, um_alt_um: resp.data.pt_um, um_part: updateItem.sod_part  }).subscribe((res:any)=>{
                    console.log(res)
                    const { data } = res;
        
                  if (data) {
                    //alert ("Mouvement Interdit Pour ce Status")
                    updateItem.sod_um_conv = res.data.um_conv 
                    this.angularGridO7.gridService.highlightRow(1, 1500);
                  } else {
                    this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.sod_um, um_part: updateItem.sod_part  }).subscribe((res:any)=>{
                      console.log(res)
                      const { data } = res;
                      if (data) {
                        //alert ("Mouvement Interdit Pour ce Status")
                        updateItem.sod_um_conv = res.data.um_conv
                        
                      } else {
                        updateItem.sod_um_conv = 1
                        updateItem.sod_um = null
                
                        alert("UM conversion manquante")
                        
                      }  
                    })
        
                  }
                    })
        
                  }
                  })
        
        
        
              });
            } 
          
          }
        angularGridReadyumO7(angularGrid: AngularGridInstance) {
            this.angularGridumO7 = angularGrid
            this.gridObjumO7 = (angularGrid && angularGrid.slickGrid) || {}
        }
        
        prepareGridumO7() {
            this.columnDefinitionsumO7 = [
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
                    id: "id",
                    name: "id",
                    field: "id",
                    sortable: true,
                    minWidth: 80,
                    maxWidth: 80,
                },
                {
                    id: "code_fldname",
                    name: "Champs",
                    field: "code_fldname",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                },
                {
                    id: "code_value",
                    name: "Code",
                    field: "code_value",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                },
                {
                    id: "code_cmmt",
                    name: "Description",
                    field: "code_cmmt",
                    sortable: true,
                    width: 200,
                    filterable: true,
                    type: FieldType.string,
                },
            ]
        
            this.gridOptionsumO7 = {
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
                },
                multiSelect: false,
                rowSelectionOptions: {
                    selectActiveRow: true,
                },
            }
        
            // fill the dataset with your data
            this.codeService
                .getBy({ code_fldname: "pt_um" })
                .subscribe((response: any) => (this.umsO7 = response.data))
        }
        openumO7(content) {
            this.prepareGridumO7()
            this.modalService.open(content, { size: "lg" })
        }
        handleSelectedRowsChangedsiteO7(e, args) {
          let updateItem = this.gridServiceO7.getDataItemByRowIndex(this.row_number);
          if (Array.isArray(args.rows) && this.gridObjsiteO7) {
            args.rows.map((idx) => {
              const item = this.gridObjsiteO7.getDataItem(idx);
              console.log(item);
        
                  
              updateItem.sod_site = item.si_site;
              
              this.gridServiceO7.updateItem(updateItem);
           
        });
        
          }
        }
        angularGridReadysiteO7(angularGrid: AngularGridInstance) {
          this.angularGridsiteO7 = angularGrid;
          this.gridObjsiteO7= (angularGrid && angularGrid.slickGrid) || {};
        }
        
        prepareGridsiteO7() {
          this.columnDefinitionssiteO7 = [
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
        
          this.gridOptionssiteO7 = {
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
          this.siteService
            .getAll()
            .subscribe((response: any) => (this.datasiteO7 = response.data));
        }
        opensiteO7(contentsite) {
          this.prepareGridsiteO7();
          this.modalService.open(contentsite, { size: "lg" });
        }
        
        
        handleSelectedRowsChangedlocO7(e, args) {
          let updateItem = this.gridServiceO7.getDataItemByRowIndex(this.row_number);
          if (Array.isArray(args.rows) && this.gridObjlocO7) {
            args.rows.map((idx) => {
              const item = this.gridObjlocO7.getDataItem(idx);
                  
              updateItem.sod_loc = item.loc_loc;
              
              this.gridServiceO7.updateItem(updateItem);
           
        });
        
          }
        }
        angularGridReadylocO7(angularGrid: AngularGridInstance) {
          this.angularGridlocO7 = angularGrid;
          this.gridObjlocO7 = (angularGrid && angularGrid.slickGrid) || {};
        }
        
        prepareGridlocO7() {
          this.columnDefinitionslocO7 = [
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
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
            },
            {
              id: "loc_site",
              name: "Site",
              field: "loc_site",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "loc_loc",
              name: "Emplacement",
              field: "loc_loc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "loc_desc",
              name: "Designation",
              field: "loc_desc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "loc_status",
              name: "Status",
              field: "loc_status",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "loc_perm",
              name: "Permanent",
              field: "loc_perm",
              sortable: true,
              filterable: true,
              type: FieldType.boolean,
              formatter: Formatters.yesNo,
            },
          ];
        
          this.gridOptionslocO7 = {
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
            let updateItem = this.gridServiceO7.getDataItemByRowIndex(this.row_number);
          
          // fill the dataset with your data
          this.locationService
            .getBy({ loc_site:  updateItem.sod_site })
            .subscribe((response: any) => (this.datalocO7 = response.data));
        }
        openlocO7(contentloc) {
          this.prepareGridlocO7();
          this.modalService.open(contentloc, { size: "lg" });
        }
        
        handleSelectedRowsChangedO7(e, args) {
          const controls = this.soFormO7.controls
          if (Array.isArray(args.rows) && this.gridObj1O7) {
              args.rows.map((idx) => {
                  const item = this.gridObj1O7.getDataItem(idx)
                  controls.so_category.setValue(item.seq_seq || "")
              })
          }
        }
        
        angularGridReadyO7(angularGrid: AngularGridInstance) {
          this.angularGrid1O7 = angularGrid
          this.gridObj1O7 = (angularGrid && angularGrid.slickGrid) || {}
        }
        
        prepareGrid1O7() {
          this.columnDefinitions1O7 = [
              {
                  id: "id",
                  name: "id",
                  field: "id",
                  sortable: true,
                  minWidth: 80,
                  maxWidth: 80,
              },
              {
                  id: "seq_seq",
                  name: "code sequence",
                  field: "seq_seq",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "seq_desc",
                  name: "description",
                  field: "seq_desc",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "seq_appr1",
                  name: "approbateur 1",
                  field: "seq_appr1",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "seq_appr2",
                  name: "approbateur 2",
                  field: "seq_appr2",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "seq_appr3",
                  name: "approbateur 3",
                  field: "seq_appr3",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
          ]
        
          this.gridOptions1O7 = {
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
          }
        
          // fill the dataset with your data
         
          this.sequencesService
              .getBy({seq_type: 'SO', seq_profile: this.user.usrd_profile})
              .subscribe((response: any) => (this.sequencesO7 = response.data))
             
        }
        openO7(content) {
          this.prepareGrid1O7()
          this.modalService.open(content, { size: "lg" })
        }
        onChangeTAXO7() {
        const controls = this.soFormO7.controls;
        const tax = controls.so_taxable.value;
        
          for (var i = 0; i < this.datasetO7.length; i++) {
            let updateItem = this.gridServiceO7.getDataItemByRowIndex(i);
          //  console.log(this.dataset[i].qty_oh)
                updateItem.sod_taxable = tax ;
            
                this.gridServiceO7.updateItem(updateItem);
             
          };
        
        
        
        this.calculatetotO7();
        }
        
        calculatetotO7(){
                 const controls = this.totFormO7.controls 
                  const controlsso = this.soFormO7.controls 
                  let tht = 0
                  let tva = 0
                  let timbre = 0
                  let ttc = 0
                  for (var i = 0; i < this.datasetO7.length; i++) {
                    console.log("here here " ,this.datasetO7[i]  )
                    tht += round((this.datasetO7[i].sod_price * ((100 - this.datasetO7[i].sod_disc_pct) / 100 ) *  this.datasetO7[i].sod_qty_ord),2)
                    if(controlsso.so_taxable.value == true) tva += round((this.datasetO7[i].sod_price * ((100 - this.datasetO7[i].sod_disc_pct) / 100 ) *  this.datasetO7[i].sod_qty_ord) * (this.datasetO7[i].sod_taxc ? this.datasetO7[i].sod_taxc / 100 : 0),2)
                   
                 
                    
               
                    
                    if(controlsso.so_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
                      if (timbre > 10000) { timbre = 10000} } 
                 
                  }
                ttc = round(tht + tva + timbre,2)
              
              controls.tht.setValue(tht.toFixed(2));
              controls.tva.setValue(tva.toFixed(2));
              controls.timbre.setValue(timbre.toFixed(2));
              controls.ttc.setValue(ttc.toFixed(2));
              
        }
        
        
        handleSelectedRowsChangedlocdetO7(e, args) {
          let updateItem = this.gridServiceO7.getDataItemByRowIndex(this.row_number);
          if (Array.isArray(args.rows) && this.gridObjlocdetO7) {
            args.rows.map((idx) => {
              const item = this.gridObjlocdetO7.getDataItem(idx);
              console.log(item);
        
                  
        
              this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-SO" }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
        
              if (data) {
                alert ("Mouvement Interdit Pour ce Status")
                updateItem.sod_serial = null;
                updateItem.qty_oh = 0;
                updateItem.sod_status = null;
                updateItem.sod_expire = null;
                
        
              }else {
                updateItem.sod_serial = item.ld_lot;
                updateItem.qty_oh = item.ld_qty_oh;
                updateItem.sod_status = item.ld_status;
                updateItem.sod_expire = item.ld_expire;
                
                this.gridServiceO7.updateItem(updateItem);
        
              }
                
              })
        
        
        
        
              
              
              this.gridServiceO7.updateItem(updateItem);
              
        });
        
          }
        }
        angularGridReadylocdetO7(angularGrid: AngularGridInstance) {
          this.angularGridlocdetO7 = angularGrid;
          this.gridObjlocdetO7 = (angularGrid && angularGrid.slickGrid) || {};
        }
        
        prepareGridlocdetO7() {
          this.columnDefinitionslocdetO7 = [
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
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
            },
            {
              id: "ld_site",
              name: "Site",
              field: "ld_site",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "ld_loc",
              name: "Emplacement",
              field: "ld_loc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "ld_part",
              name: "Article",
              field: "ld_part",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "ld_lot",
              name: "Lot",
              field: "ld_lot",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "ld_qty_oh",
              name: "Qte",
              field: "ld_qty_oh",
              sortable: true,
              filterable: true,
              type: FieldType.float,
            },
            {
              id: "ld_status",
              name: "Status",
              field: "ld_status",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "ld_expire",
              name: "Expire",
              field: "ld_expire",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
          ];
        
          this.gridOptionslocdetO7 = {
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
            let updateItem = this.gridServiceO7.getDataItemByRowIndex(this.row_number);
          
          // fill the dataset with your data
          this.locationDetailService
            .getBy({ ld_site:  updateItem.sod_site , ld_loc:  updateItem.sod_loc, ld_part:  updateItem.sod_part })
            .subscribe((response: any) => (this.datalocdetO7 = response.data));
        }
        openlocdetO7(contentlocdet) {
          this.prepareGridlocdetO7();
          this.modalService.open(contentlocdet, { size: "lg" });
        }
        handleSelectedRowsChangedbillO7(e, args) {
          const controls = this.soFormO7.controls;
          if (Array.isArray(args.rows) && this.gridObjbillO7) {
            args.rows.map((idx) => {
              const item = this.gridObjbillO7.getDataItem(idx);
              console.log(item)
              
              this.billerO7 = item;
              controls.so_bill.setValue(item.cm_addr || "");
              controls.namebill.setValue(item.address.ad_name || "");
              controls.so_curr.setValue(item.cm_curr || "");
              controls.so_cr_terms.setValue(item.cm_cr_terms || "");
              controls.so_taxable.setValue(item.address.ad_taxable || "");
              
        
              this.deviseService.getBy({ cu_curr: item.cm_curr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
                    if(data) {
        
                      this.curr = data;
                    }
                   
                    if (item.cm_curr == 'DA'){
                      controls.so_ex_rate.setValue(1)
                      controls.so_ex_rate2.setValue(1)
        
                    } else {
        
                    this.deviseService.getExRate({exr_curr1:item.cm_curr, exr_curr2:'DA', date: this.dateO7}).subscribe((res:any)=>{
                      
                       controls.so_ex_rate.setValue(res.data.exr_rate)
                       controls.so_ex_rate2.setValue(res.data.exr_rate2)
                      })
        
                      }
                })
        
        
            });
          }
        }
        
        angularGridReadybillO7(angularGrid: AngularGridInstance) {
          this.angularGridbillO7 = angularGrid;
          this.gridObjbillO7 = (angularGrid && angularGrid.slickGrid) || {};
        }
        
        prepareGridbillO7() {
          this.columnDefinitionsbillO7 = [
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
        
          this.gridOptionsbillO7 = {
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
          this.customersService
            .getAll()
            .subscribe((response: any) => (this.billsO7 = response.data));
        }
        openbillO7(content) {
          this.prepareGridbillO7();
          this.modalService.open(content, { size: "lg" });
        }
        
        
        
        printpdfO7(nbr) {
          const controls = this.totFormO7.controls 
          const controlss = this.soFormO7.controls 
          console.log("pdf")
          var doc = new jsPDF();
         
         // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
          var img = new Image()
          img.src = "./assets/media/logos/company.png";
          doc.addImage(img, 'png', 5, 5, 210, 30)
          doc.setFontSize(12);
          doc.text( 'Commande N° : ' + nbr  , 70, 40);
          doc.setFontSize(8);
          console.log(this.customerO7.address.ad_misc2_id)
          doc.text('Code Client : ' + this.customerO7.cm_addr, 20 , 50 )
          doc.text('Nom             : ' + this.customerO7.address.ad_name, 20 , 55)
          doc.text('Adresse       : ' + this.customerO7.address.ad_line1, 20 , 60)
          if (this.customerO7.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customerO7.address.ad_misc2_id, 20 , 65)}
              if (this.customerO7.address.ad_gst_id != null) {doc.text('RC          : ' + this.customerO7.address.ad_gst_id, 20 , 70)}
              if (this.customerO7.address.ad_pst_id) {doc.text('AI            : ' + this.customerO7.address.ad_pst_id, 20 , 75)}
              if (this.customerO7.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customerO7.address.ad_misc1_id, 20 , 80)}
            
          doc.line(10, 85, 200, 85);
          doc.line(10, 90, 200, 90);
          doc.line(10, 85, 10, 90);
          doc.text('LN', 12.5 , 88.5);
          doc.line(20, 85, 20, 90);
          doc.text('Code Article', 25 , 88.5);
          doc.line(45, 85, 45, 90);
          doc.text('Désignation', 67.5 , 88.5);
          doc.line(100, 85, 100, 90);
          doc.text('QTE', 107 , 88.5);
          doc.line(120, 85, 120, 90);
          doc.text('UM', 123 , 88.5);
          doc.line(130, 85, 130, 90);
          doc.text('PU', 138 , 88.5);
          doc.line(150, 85, 150, 90);
          doc.text('TVA', 152 , 88.5);
          doc.line(160, 85, 160, 90);
          doc.text('REM', 162 , 88.5);
          doc.line(170, 85, 170, 90);
          doc.text('THT', 181 , 88.5);
          doc.line(200, 85, 200, 90);
          var i = 95;
          doc.setFontSize(6);
          for (let j = 0; j < this.datasetO7.length  ; j++) {
            
            if ((j % 20 == 0) && (j != 0) ) {
        doc.addPage();
              doc.addImage(img, 'png', 5, 5, 210, 30)
              doc.setFontSize(12);
              doc.text( 'Commande N° : ' + nbr  , 70, 40);
              doc.setFontSize(8);
              console.log(this.customerO7.address.ad_misc2_id)
              doc.text('Code Client : ' + this.customerO7.cm_addr, 20 , 50 )
              doc.text('Nom             : ' + this.customerO7.address.ad_name, 20 , 55)
              doc.text('Adresse       : ' + this.customerO7.address.ad_line1, 20 , 60)
              if (this.customerO7.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customerO7.address.ad_misc2_id, 20 , 65)}
              if (this.customerO7.address.ad_gst_id != null) {doc.text('RC          : ' + this.customerO7.address.ad_gst_id, 20 , 70)}
              if (this.customerO7.address.ad_pst_id) {doc.text('AI            : ' + this.customerO7.address.ad_pst_id, 20 , 75)}
              if (this.customerO7.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customerO7.address.ad_misc1_id, 20 , 80)}
            
              doc.line(10, 85, 200, 85);
              doc.line(10, 90, 200, 90);
              doc.line(10, 85, 10, 90);
              doc.text('LN', 12.5 , 88.5);
              doc.line(20, 85, 20, 90);
              doc.text('Code Article', 25 , 88.5);
              doc.line(45, 85, 45, 90);
              doc.text('Désignation', 67.5 , 88.5);
              doc.line(100, 85, 100, 90);
              doc.text('QTE', 107 , 88.5);
              doc.line(120, 85, 120, 90);
              doc.text('UM', 123 , 88.5);
              doc.line(130, 85, 130, 90);
              doc.text('PU', 138 , 88.5);
              doc.line(150, 85, 150, 90);
              doc.text('TVA', 152 , 88.5);
              doc.line(160, 85, 160, 90);
              doc.text('REM', 162 , 88.5);
              doc.line(170, 85, 170, 90);
              doc.text('THT', 181 , 88.5);
              doc.line(200, 85, 200, 90);
              i = 95;
              doc.setFontSize(6);
        
            }
        
        
        
            if (this.datasetO7[j].desc.length > 45) {
              let desc1 = this.datasetO7[j].desc.substring(45)
              let ind = desc1.indexOf(' ')
              desc1 = this.datasetO7[j].desc.substring(0, 45  + ind)
              let desc2 = this.datasetO7[j].desc.substring(45+ind)
        
              doc.line(10, i - 5, 10, i );
              doc.text(String(("000"+ this.datasetO7[j].sod_line)).slice(-3), 12.5 , i  - 1);
              doc.line(20, i - 5, 20, i);
              doc.text(this.datasetO7[j].sod_part, 25 , i  - 1);
              doc.line(45, i - 5 , 45, i );
              doc.text(desc1, 47 , i  - 1);
              doc.line(100, i - 5, 100, i );
              doc.text( String(this.datasetO7[j].sod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
              doc.line(120, i - 5 , 120, i );
              doc.text(this.datasetO7[j].sod_um, 123 , i  - 1);
              doc.line(130, i - 5, 130, i );
              doc.text( String(Number(this.datasetO7[j].sod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
              doc.line(150, i - 5, 150, i );
              doc.text(String(this.datasetO7[j].sod_taxc) + "%" , 153 , i  - 1);
              doc.line(160, i - 5 , 160, i );
              doc.text(String(this.datasetO7[j].sod_disc_pct) + "%" , 163 , i  - 1);
              doc.line(170, i - 5 , 170, i );
              doc.text(String((this.datasetO7[j].sod_price *
                      ((100 - this.datasetO7[j].sod_disc_pct) / 100) *
                      this.datasetO7[j].sod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
              doc.line(200, i-5 , 200, i );
             // doc.line(10, i, 200, i );
        
              i = i + 5;
        
              doc.text(desc2, 47 , i  - 1);
              
              doc.line(10, i - 5, 10, i );
              doc.line(20, i - 5, 20, i);
              doc.line(45, i - 5 , 45, i );
              doc.line(100, i - 5, 100, i );
              doc.line(120, i - 5 , 120, i );
              doc.line(130, i - 5, 130, i );
              doc.line(150, i - 5, 150, i );
              doc.line(160, i - 5 , 160, i );
              doc.line(170, i - 5 , 170, i );
              doc.line(200, i-5 , 200, i );
              doc.line(10, i, 200, i );
        
              i = i + 5 ;
              
            } else {
        
        
            
            doc.line(10, i - 5, 10, i );
            doc.text(String(("000"+ this.datasetO7[j].sod_line)).slice(-3), 12.5 , i  - 1);
            doc.line(20, i - 5, 20, i);
            doc.text(this.datasetO7[j].sod_part, 25 , i  - 1);
            doc.line(45, i - 5 , 45, i );
            doc.text(this.datasetO7[j].desc, 47 , i  - 1);
            doc.line(100, i - 5, 100, i );
            doc.text( String(this.datasetO7[j].sod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
            doc.line(120, i - 5 , 120, i );
            doc.text(this.datasetO7[j].sod_um, 123 , i  - 1);
            doc.line(130, i - 5, 130, i );
            doc.text( String(Number(this.datasetO7[j].sod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
            doc.line(150, i - 5, 150, i );
            doc.text(String(this.datasetO7[j].sod_taxc) + "%" , 153 , i  - 1);
            doc.line(160, i - 5 , 160, i );
            doc.text(String(this.datasetO7[j].sod_disc_pct) + "%" , 163 , i  - 1);
            doc.line(170, i - 5 , 170, i );
            doc.text(String((this.datasetO7[j].sod_price *
              ((100 - this.datasetO7[j].sod_disc_pct) / 100) *
              this.datasetO7[j].sod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
            doc.line(200, i-5 , 200, i );
            doc.line(10, i, 200, i );
            i = i + 5;
            }
          }
          
         // doc.line(10, i - 5, 200, i - 5);
        
         doc.line(130, i + 7,  200, i + 7  );
         doc.line(130, i + 14, 200, i + 14 );
         doc.line(130, i + 21, 200, i + 21 );
         doc.line(130, i + 28, 200, i + 28 );
         doc.line(130, i + 35, 200, i + 35 );
         doc.line(130, i + 7,  130, i + 35  );
         doc.line(160, i + 7,  160, i + 35  );
         doc.line(200, i + 7,  200, i + 35  );
         doc.setFontSize(10);
         
         doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
         doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
         doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
         doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
        
         
         doc.text(String(Number(controls.tht.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
         doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
         doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
         doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });
        
         doc.setFontSize(8);
            let mt = NumberToLetters(
              Number(controls.ttc.value).toFixed(2),'DINARS ALGERIENS')
        
              if (mt.length > 95) {
                let mt1 = mt.substring(90)
                let ind = mt1.indexOf(' ')
               
                mt1 = mt.substring(0, 90  + ind)
                let mt2 = mt.substring(90+ind)
           
                doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
                doc.text(  mt2  , 20, i + 60)
              } else {
                doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)
        
              }
            // window.open(doc.output('bloburl'), '_blank');
            //window.open(doc.output('blobUrl'));  // will open a new tab
            var blob = doc.output("blob");
            window.open(URL.createObjectURL(blob));
        
          }
          // ONGLET 7
          gridReadyihO8(angularGrid: AngularGridInstance) {
              this.angularGridihO8 = angularGrid;
              this.dataViewihO8 = angularGrid.dataView;
              this.gridihO8 = angularGrid.slickGrid;
              this.gridServiceihO8 = angularGrid.gridService;
            }
            initGridihO8() {
              this.columnDefinitionsihO8 = [
                {
                  id: "id",
                  name: "id",
                  field: "id",
                  sortable: true,
                  minWidth: 80,
                  maxWidth: 80,
              },
                
              {
                id: "itdh_line",
                name: "Ligne",
                field: "itdh_line",
                minWidth: 50,
                maxWidth: 50,
                selectable: true,
                sortable: true,
              },
              {
                id: "itdh_nbr",
                name: "Commande",
                field: "itdh_nbr",
                sortable: true,
                width: 50,
                filterable: false,
                
              },
              
              {
                id: "itdh_part",
                name: "Article",
                field: "itdh_part",
                sortable: true,
                width: 50,
                filterable: false,
                
              },
              {
                id: "desc",
                name: "Description",
                field: "desc",
                sortable: true,
                width: 180,
                filterable: false,
              },
              {
                id: "itdh_um",
                name: "UM",
                field: "itdh_um",
                sortable: true,
                width: 50,
                filterable: false,
                
              },
              {
                id: "itdh_qty_inv",
                name: "Qte",
                field: "itdh_qty_inv",
                sortable: true,
                width: 80,
                filterable: false,
                
              },
              {
                id: "itdh_price",
                name: "Prix unitaire",
                field: "itdh_price",
                sortable: true,
                width: 80,
                filterable: false,
                //type: FieldType.float,
                formatter: Formatters.decimal,
               
              },
              {
                id: "itdh_disc_pct",
                name: "Remise",
                field: "itdh_disc_pct",
                sortable: true,
                width: 80,
                filterable: false,
                //type: FieldType.float,
                formatter: Formatters.decimal,
               
              },
              {
                id: "itdh_taxable",
                name: "A Taxer",
                field: "itdh_taxable",
                sortable: true,
                width: 80,
                filterable: false,
                //type: FieldType.float,
                formatter: Formatters.checkbox,
               
              },
              {
                id: "itdh_tax_code",
                name: "Code Taxe",
                field: "itdh_tax_code",
                sortable: true,
                width: 80,
                filterable: false,
                //type: FieldType.float,
                
              },
             
              {
                id: "itdh_taxc",
                name: "Taux Taxe",
                field: "itdh_taxc",
                sortable: true,
                width: 80,
                filterable: false,
                //type: FieldType.float,
                formatter: Formatters.decimal,
               
              },
                
              ];
          
              this.gridOptionsihO8 = {
                asyncEditorLoading: false,
                editable: true,
                enableColumnPicker: true,
                enableSorting: true,
                enableCellNavigation: true,
                enableRowSelection: true,
                
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
                    { columnId: 'psh_line', direction: 'ASC' }
                  ],
                },*/
              };
          
              this.datasetO8 = [];
            }
            
          
            createtotFormO8() {
              this.loadingSubject.next(false);
              //this.saleOrder = new SaleOrder();
              //const date = new Date;
              
              this.totFormO8 = this.totFBO8.group({
            //    so__chr01: [this.invoiceOrder.ith__chr01],
                tht: [{value: 0.00 , disabled: true}],
                tva: [{value: 0.00 , disabled: true}],
                timbre: [{value: 0.00 , disabled: true}],
                ttc: [{value: 0.00 , disabled: true}],
              });
            }
            //create form
            createFormO8() {
              this.loadingSubject.next(false);
                this.invoiceOrderO8 = new InvoiceOrderTemp();
                const date = new Date;
                
                this.ihFormO8 = this.ihFB.group({
              //    so__chr01: [this.invoiceOrder.ith__chr01],
                  ith_category: [this.invoiceOrderO8.ith_category , Validators.required],
                  ith_nbr: [this.invoiceOrderO8.ith_nbr , Validators.required],
                  ith_cust: [{value: this.invoiceOrderO8.ith_cust , disabled: true}],
                  name: [{value:"", disabled: true}],
                  
                  ith_bill: [{value: this.invoiceOrderO8.ith_bill , disabled: true}],
                  namebill: [{value:"", disabled: true}],
                  
                  ith_inv_date: [{
                    year:date.getFullYear(),
                    month: date.getMonth()+1,
                    day: date.getDate()
                  }],
                  
                  ith_taxable: [{value: this.invoiceOrderO8.ith_taxable, disabled: true}],
                 
                  ith_po: [{value:this.invoiceOrderO8.ith_po, disabled: true}],
                  ith_rmks: [this.invoiceOrderO8.ith_rmks],
                  ith_curr: [{value:this.invoiceOrderO8.ith_curr, disabled: true}],
                  ith_ex_rate: [{value:this.invoiceOrderO8.ith_ex_rate, disabled: true}],
                  ith_ex_rate2: [{value:this.invoiceOrderO8.ith_ex_rate2, disabled: true}],
                  ith_cr_terms: [this.invoiceOrderO8.ith_cr_terms, Validators.required],
                  print:[true]
                });
            
                
                
            
              }
            //reste form
            resetO8() {
              this.inventoryTransactionO8 = new InventoryTransaction();
              this.createFormO8();
              this.datasetO8 = [];
              this.ihdatasetO8 = [];
              this.hasFormErrors = false;
            }
            // save data
            onSubmitO8() {
              this.hasFormErrors = false;
              const controls = this.ihFormO8.controls;
              /** check form */
              // if (this.ihFormO8.invalid) {
              //   Object.keys(controls).forEach((controlName) =>
              //     controls[controlName].markAsTouched()
              //   );
              //   this.message = "Modifiez quelques éléments et réessayez de soumettre.";
              //   this.hasFormErrors = true;
          
              //   return;
              // }
          
              if (!this.ihdatasetO8.length) {
                this.message = "La liste des article ne peut pas etre vide ";
                this.hasFormErrors = true;
          
                return;
              }
          
              for (var i = 0; i < this.ihdatasetO8.length; i++) {
                console.log(this.ihdatasetO8[i]  )
               if (this.ihdatasetO8[i].itdh_part == "" || this.ihdatasetO8[i].itdh_part == null  ) {
                this.message = "L' article ne peut pas etre vide";
                this.hasFormErrors = true;
                return;
           
               }
               if (this.ihdatasetO8[i].itdh_um == "" || this.ihdatasetO8[i].itdh_um == null  ) {
                this.message = "L' UM ne peut pas etre vide";
                this.hasFormErrors = true;
                return;
           
               }
               if (this.ihdatasetO8[i].itdh_qty_inv == 0 ) {
                this.message = "La Quantite ne peut pas etre 0";
                this.hasFormErrors = true;
                return;
           
               }
          
              }
          /*
              this.sequenceService.getByOne({ seq_type: "IV", seq_profile: this.user.usrd_profile }).subscribe(
                (response: any) => {
              this.seq = response.data
              console.log(this.seq)   
                  if (this.seq) {
                   this.pshnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
                   console.log(this.seq.seq_prefix)
                   console.log(this.seq.seq_curr_val)
                   
                  console.log(this.pshnbr)
                   const id = Number(this.seq.id)
                let obj = { }
                obj = {
                  seq_curr_val: Number(this.seq.seq_curr_val )+1
                }
                this.sequenceService.update(id , obj ).subscribe(
                  (reponse) => console.log("response", Response),
                  (error) => {
                    this.message = "Erreur modification Sequence";
                    this.hasFormErrors = true;
                    return;
               
                  
                  },
                  )
                }else {
                  this.message = "Parametrage Manquant pour la sequence";
                  this.hasFormErrors = true;
                  return;
             
                 }
          
                })
                */
              // tslint:disable-next-line:prefer-const
              let ih = this.prepareIh()
              this.addIh(ih, this.ihdatasetO8);
          
          
            }
          
            prepareIh(): any {
              const controls = this.ihFormO8.controls;
              const controlstot = this.totFormO8.controls 
              const _ih = new InvoiceOrderTemp();
              _ih.ith_category =  controls.ith_category.value;
              _ih.ith_cust = controls.ith_cust.value;
                _ih.ith_bill = controls.ith_bill.value;
                _ih.ith_nbr = controls.ith_nbr.value;
                
                _ih.ith_inv_date = controls.ith_inv_date.value
                  ? `${controls.ith_inv_date.value.year}/${controls.ith_inv_date.value.month}/${controls.ith_inv_date.value.day}`
                  : null;
                
                  if (controls.ith_taxable.value == null || controls.ith_taxable.value == "" ) { _ih.ith_taxable = false} else { _ih.ith_taxable = controls.ith_taxable.value}
                
               
                _ih.ith_rmks = controls.ith_rmks.value;
                
                _ih.ith_rmks = controls.ith_rmks.value;
                _ih.ith_curr = controls.ith_curr.value;
                _ih.ith_ex_rate = controls.ith_ex_rate.value;
                _ih.ith_ex_rate2 = controls.ith_ex_rate2.value;
                _ih.ith_cr_terms = controls.ith_cr_terms.value;
                _ih.ith_amt = controlstot.tht.value;
                _ih.ith_tax_amt = controlstot.tva.value;
                _ih.ith_trl1_amt = controlstot.timbre.value;
              this.sequenceService.getBy({ seq_type: "IV", seq_profile: this.user.usrd_profile }).subscribe(
                (response: any) => {
              this.seqO8 = response.data[0]
              
              if (this.seqO8) {
                this.pshnbrO8 = `${this.seqO8.seq_prefix}-${Number(this.seqO8.seq_curr_val)+1}`
                console.log(this.seqO8.seq_prefix)
                console.log(this.seqO8.seq_curr_val)
                _ih.ith_inv_nbr = this.pshnbrO8;
                
                
            
              }
                })
              
              return _ih;
            
            }
            /**
             * Add po
             *
             * @param _ih: ih
             */
            addIh(_ih: any, detail: any) {
              var array = []
              var iharray = []
              for (let data of detail) {
                delete data.id;
                delete data.cmvid;
               
              }
              this.loadingSubject.next(true);
              let ih = null;
              const controls = this.ihFormO8.controls;
          
              this.invoiceOrderService
                .add({ invoiceOrder: _ih, invoiceOrderDetail: detail })
                .subscribe(
                  (reponse: any) => (ih = reponse.data),
                  (error) => {
                    this.layoutUtilsService.showActionNotification(
                      "Erreur verifier les informations",
                      MessageType.Create,
                      10000,
                      true,
                      true
                    );
                    this.loadingSubject.next(false);
                  },
                  () => {
                    this.layoutUtilsService.showActionNotification(
                      "Ajout avec succès",
                      MessageType.Create,
                      10000,
                      true,
                      true
                    );
                    this.loadingSubject.next(false);
                    console.log(this.dataset);
                  
                    array = this.ihdatasetO8;        
                    var result = [];
            array.reduce(function(res, value) {
              //console.log('aaa',res[value.itdh_part])
              if (!res[value.itdh_part]) {
                res[value.itdh_part] = { itdh_part: value.itdh_part,  itdh_qty_inv: 0 };
                result.push(res[value.itdh_part])
                
              }
              res[value.itdh_part].itdh_qty_inv += value.itdh_qty_inv; 
              return res;
            }, {});
            
            console.log('bbb',result)
            var bool = false
            for (var obj = 0; obj < result.length; obj++) {
              const det = result[obj];
              
          iharray.push(det)
          bool = false
          var j = 0
             
              do {
            if (this.ihdatasetO8[j].itdh_part = det.itdh_part ) {
              iharray[obj].itdh_line = obj + 1
              iharray[obj].desc =  this.ihdatasetO8[j].desc
              iharray[obj].itdh_price =  this.ihdatasetO8[j].itdh_price
              iharray[obj].itdh_taxable = this.ihdatasetO8[j].itdh_taxable
              iharray[obj].itdh_tax_code = this.ihdatasetO8[j].itdh_tax_code
              iharray[obj].itdh_taxc = this.ihdatasetO8[j].itdh_taxc
              iharray[obj].itdh_disc_pct = this.ihdatasetO8[j].itdh_disc_pct
              iharray[obj].itdh_um = this.ihdatasetO8[j].itdh_um
              
              
            bool = true   
            }
            j++
            }while ( j < this.ihdatasetO8.length || bool == false);
          
          
                                   
            }
            console.log("hnahna", iharray)
            
          
                    if(controls.print.value == true) printIH(this.customerO8, iharray, _ih,this.curr);
                    this.resetO8()
                    // this.router.navigateByUrl("/sales/print-invoice");
                    // this.reset()
                  }
                );
            }
           
            
          
          
           
          
            
          
            onChangeSeqO8() {
              const controls = this.ihFormO8.controls
              console.log(this.user.usrd_profile)
              this.sequenceService
                  .getBy({seq_seq: controls.ith_category.value, seq_type: 'IV', seq_profile: this.user.usrd_profile})
                  .subscribe((response: any) => {
                      console.log(response)
                      if (response.data.length == 0) {
                          alert("Sequence nexiste pas")
                          controls.ith_category.setValue("")
                          //console.log(response.data.length)
                          document.getElementById("SEQUENCE").focus();
                      } 
                  })
          }
          
           
            /**
             * Go back to the list
             *
             */
            goBackO8() {
              this.loadingSubject.next(false);
              const url = `/`;
              this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
            }
          
            onAlertCloseO8($event) {
              this.hasFormErrors = false;
            }
          
            
            
            onChangeCCO8() {
              const controls = this.ihFormO8.controls;
              const so_nbr = controls.ith_nbr.value;
              
              this.ihdatasetO8 = [];
                  this.saleOrderService.getBy({ so_nbr, so_to_inv: true, so_invoiced: false }).subscribe(
                    (res: any) => {
                      console.log(res)
                      const { saleOrder, details } = res.data;
                     if (saleOrder != null) {
                      const det1 = details;
                      
                      this.soServerO8 = saleOrder;
                      //console.log(this.soServer)
                      //console.log(this.soServer.so_cust)
                      controls.ith_nbr.setValue(this.soServerO8.so_nbr|| "")
                      controls.ith_cust.setValue(this.soServerO8.so_cust|| "");
                      controls.ith_bill.setValue(this.soServerO8.so_bill|| "");
                      controls.ith_curr.setValue(this.soServerO8.so_curr|| "");
                      controls.ith_ex_rate.setValue(this.soServerO8.so_ex_rate|| "1");
                      controls.ith_ex_rate2.setValue(this.soServerO8.so_ex_rate2|| "1");
                      controls.ith_taxable.setValue(this.soServerO8.so_taxable);
                      controls.ith_cr_terms.setValue(this.soServerO8.so_cr_terms|| "");
                      const ad_addr = this.soServerO8.so_cust;
                      this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                              
                              
                        //this.customer = response.data
              
                      controls.name.setValue(response.data.ad_name);
                    
                      })
                      this.customersService.getBy({cm_addr: this.soServerO8.so_bill}).subscribe((response: any)=>{
                              
                              
                        this.customerO8 = response.data
              
                      controls.namebill.setValue(this.customerO8.address.ad_name);
                    
                      })
                      this.deviseService.getBy({cu_curr: this.soServerO8.so_curr}).subscribe((res: any)=>{
                              
                              
                        this.currO8 = res.data
              
                      
                    
                      })
                    
                    
                      for (var object = 0; object < det1.length; object++) {
                        const detail = details[object];
                       console.log(detail)
                            this.gridServiceihO8.addItem(
                              {
                                id: detail.sod_line, //this.dataset.length + 1,
                                itdh_line: detail.sod_line,   //this.dataset.length + 1,
                                itdh_nbr: detail.sod_nbr,
                               
                                itdh_part: detail.sod_part,
                                cmvid: "",
                                desc: detail.item.pt_desc1,
                                itdh_qty_inv: detail.sod_qty_ord ,
                                itdh_um: detail.sod_um,
                                itdh_um_conv: detail.sod_um_conv,
                                itdh_type: detail.sod_type,
                                itdh_price: detail.sod_price,
                                itdh_disc_pct: detail.sod_disc_pct,
                                itdh_taxable: detail.sod_taxable,
                                itdh_taxc: detail.sod_taxc,
                                itdh_tax_code: detail.sod_tax_code,
                                itdh_site: detail.sod_site,
                                itdh_loc: detail.sod_loc,
                                itdh_serial: detail.sod_serial,
                                itdh_status: detail.sod_status,
                                itdh_expire: detail.sod_expire,
                              },
                              { position: "bottom" }
                            );
                    
                  }
          
                  this.calculatetotO8();
          
                }else {
                  alert("Comande n'existe pas ou bien Facturé")
                  controls.ith_nbr.setValue("")
                  //console.log(response.data.length)
                  document.getElementById("ihnbr").focus();
                }
                })    
              
                    
            }
          
          
          
          calculatetotO8(){
            const controls = this.totFormO8.controls 
             const controlsso = this.ihFormO8.controls 
             console.log(this.ihdatasetO8)
             let tht = 0
             let tva = 0
             let timbre = 0
             let ttc = 0
             console.log(this.ihdatasetO8.length)
             
             for (var i = 0; i < this.ihdatasetO8.length; i++) {
               console.log("here", this.ihdatasetO8[i].itdh_price,this.ihdatasetO8[i].itdh_qty_inv, this.ihdatasetO8[i].itdh_disc_pct, this.ihdatasetO8[i].itdh_taxc   )
               tht += round((this.ihdatasetO8[i].itdh_price * ((100 - this.ihdatasetO8[i].itdh_disc_pct) / 100 ) *  this.ihdatasetO8[i].itdh_qty_inv),2)
               if(this.ihdatasetO8[i].itdh_taxable == true) tva += round((this.ihdatasetO8[i].itdh_price * ((100 - this.ihdatasetO8[i].itdh_disc_pct) / 100 ) *  this.ihdatasetO8[i].itdh_qty_inv) * (this.ihdatasetO8[i].itdh_taxc ? this.ihdatasetO8[i].itdh_taxc / 100 : 0),2)
              
            
               
          
               console.log(tva)
               if(controlsso.ith_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
                 if (timbre > 10000) { timbre = 10000} } 
            
             }
           ttc = round(tht,2) + round(tva,2) + round(timbre,2)
          console.log(tht,tva,timbre,ttc)
          controls.tht.setValue(tht.toFixed(2));
          controls.tva.setValue(tva.toFixed(2));
          controls.timbre.setValue(timbre.toFixed(2));
          controls.ttc.setValue(ttc.toFixed(2));
          
          }
          
          
          handleSelectedRowsChangedO8(e, args) {
            const controls = this.ihFormO8.controls
            if (Array.isArray(args.rows) && this.gridObj1O8) {
                args.rows.map((idx) => {
                    const item = this.gridObj1O8.getDataItem(idx)
                    controls.ith_category.setValue(item.seq_seq || "")
                })
            }
          }
          
          angularGridReadyO8(angularGrid: AngularGridInstance) {
            this.angularGrid1O8 = angularGrid
            this.gridObj1O8 = (angularGrid && angularGrid.slickGrid) || {}
          }
          
          prepareGrid1O8() {
            this.columnDefinitions1O8 = [
                {
                    id: "id",
                    name: "id",
                    field: "id",
                    sortable: true,
                    minWidth: 80,
                    maxWidth: 80,
                },
                {
                    id: "seq_seq",
                    name: "code sequence",
                    field: "seq_seq",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                },
                {
                    id: "seq_desc",
                    name: "description",
                    field: "seq_desc",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                },
                {
                    id: "seq_appr1",
                    name: "approbateur 1",
                    field: "seq_appr1",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                },
                {
                    id: "seq_appr2",
                    name: "approbateur 2",
                    field: "seq_appr2",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                },
                {
                    id: "seq_appr3",
                    name: "approbateur 3",
                    field: "seq_appr3",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                },
            ]
          
            this.gridOptions1O8 = {
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
            }
          
            // fill the dataset with your data
           
            this.sequenceService
                .getBy({seq_type: 'IV', seq_profile: this.user.usrd_profile})
                .subscribe((response: any) => (this.sequencesO8 = response.data))
               
          }
          openO8(content) {
            this.prepareGrid1O8()
            this.modalService.open(content, { size: "lg" })
          }
          
          
          handleSelectedRowsChanged5O8(e, args) {
            const controls = this.ihFormO8.controls;
          
               
              
              if (Array.isArray(args.rows) && this.gridObj5O8) {
                args.rows.map((idx) => {
                  const item = this.gridObj5O8.getDataItem(idx);
                  controls.ith_nbr.setValue(item.so_nbr || "");
                  const so_nbr = item.so_nbr;
                  this.ihdatasetO8 = [];
                  this.saleOrderService.getBy({ so_nbr }).subscribe(
                    (res: any) => {
                      console.log(res)
                      const { saleOrder, details } = res.data;
                      const det1 = details;
                      
                      this.soServerO8 = saleOrder;
                      //console.log(this.soServer)
                      //console.log(this.soServer.so_cust)
                      controls.ith_nbr.setValue(this.soServerO8.so_nbr|| "")
                      controls.ith_cust.setValue(this.soServerO8.so_cust|| "");
                      controls.ith_bill.setValue(this.soServerO8.so_bill|| "");
                      controls.ith_curr.setValue(this.soServerO8.so_curr|| "");
                      controls.ith_ex_rate.setValue(this.soServerO8.so_ex_rate|| "1");
                      controls.ith_ex_rate2.setValue(this.soServerO8.so_ex_rate2|| "1");
                      controls.ith_taxable.setValue(this.soServerO8.so_taxable);
                      controls.ith_cr_terms.setValue(this.soServerO8.so_cr_terms|| "");
                      const ad_addr = this.soServerO8.so_cust;
                      this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                              
                              
                        //this.customer = response.data
              
                      controls.name.setValue(response.data.ad_name);
                    
                      })
                      this.customersService.getBy({cm_addr: this.soServerO8.so_bill}).subscribe((response: any)=>{
                              
                              
                        this.customerO8 = response.data
              
                      controls.namebill.setValue(this.customerO8.address.ad_name);
                    
                      })
                      this.deviseService.getBy({cu_curr: this.soServerO8.so_curr}).subscribe((res: any)=>{
                              
                              
                        this.currO8 = res.data
              
                      
                    
                      })
                    
                    
                      for (var object = 0; object < det1.length; object++) {
                        const detail = details[object];
                       console.log(detail)
                            this.gridServiceihO8.addItem(
                              {
                                id: detail.sod_line, //this.dataset.length + 1,
                                itdh_line: detail.sod_line,   //this.dataset.length + 1,
                                itdh_nbr: detail.sod_nbr,
                               
                                itdh_part: detail.sod_part,
                                cmvid: "",
                                desc: detail.item.pt_desc1,
                                itdh_qty_inv: detail.sod_qty_ord ,
                                itdh_um: detail.sod_um,
                                itdh_um_conv: detail.sod_um_conv,
                                itdh_type: detail.sod_type,
                                itdh_price: detail.sod_price,
                                itdh_disc_pct: detail.sod_disc_pct,
                                itdh_taxable: detail.sod_taxable,
                                itdh_tax_code: detail.sod_tax_code,
                                itdh_taxc: detail.sod_taxc,
                                itdh_site: detail.sod_site,
                                itdh_loc: detail.sod_loc,
                                itdh_serial: detail.sod_serial,
                                itdh_status: detail.sod_status,
                                itdh_expire: detail.sod_expire,
                              },
                              { position: "bottom" }
                            );
                    
                  }
          
                  this.calculatetotO8();
          
               
                })    
              
             })
              }
          }
            
          
          angularGridReady5O8(angularGrid: AngularGridInstance) {
            this.angularGrid5O8 = angularGrid;
            this.gridObj5O8 = (angularGrid && angularGrid.slickGrid) || {};
          }
          
          prepareGrid5O8() {
            this.columnDefinitions5O8 = [
              {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
              },
              {
                id: "sos_nbr",
                name: "N° BC",
                field: "so_nbr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "so_ord_date",
                name: "Date",
                field: "so_ord_date",
                sortable: true,
                filterable: true,
                type: FieldType.date,
              },
              {
                id: "so_cust",
                name: "Client",
                field: "so_cust",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              {
                id: "so_bill",
                name: "Adr Facturation",
                field: "so_bill",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
              
              {
                id: "so_status",
                name: "status",
                field: "so_status",
                sortable: true,
                filterable: true,
                type: FieldType.string,
              },
            ];
          
            this.gridOptions5O8 = {
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
            this.saleOrderService
              .getByAll( {so_to_inv: true, so_invoiced: false})
              .subscribe((response: any) => {
                //console.log(response.data)
                this.sosO8 = response.data 
              console.log(response.data )
              });
              
              
              
            }
          open5O8(content) {
            this.prepareGrid5O8();
            this.modalService.open(content, { size: "lg" });
          }
          // ONGLET 8
          gridReadyihO9(angularGrid: AngularGridInstance) {
            this.angularGridihO9 = angularGrid;
            this.dataViewihO9 = angularGrid.dataView;
            this.gridihO9 = angularGrid.slickGrid;
            this.gridServiceihO9 = angularGrid.gridService;
          }
          initGridihO9() {
            this.columnDefinitionsihO9 = [
              {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 80,
                maxWidth: 80,
            },
              
            {
              id: "idh_line",
              name: "Ligne",
              field: "idh_line",
              minWidth: 50,
              maxWidth: 50,
              selectable: true,
              sortable: true,
            },
            {
              id: "idh_nbr",
              name: "Commande",
              field: "idh_nbr",
              sortable: true,
              width: 50,
              filterable: false,
              
            },
            
            {
              id: "idh_part",
              name: "Article",
              field: "idh_part",
              sortable: true,
              width: 50,
              filterable: false,
              
            },
            {
              id: "desc",
              name: "Description",
              field: "desc",
              sortable: true,
              width: 180,
              filterable: false,
            },
            {
              id: "prod_line",
              name: "Ligne Produit",
              field: "prod_line",
              sortable: true,
              width: 50,
              filterable: false,
            },
            {
              id: "idh_um",
              name: "UM",
              field: "idh_um",
              sortable: true,
              width: 50,
              filterable: false,
              
            },
            {
              id: "idh_qty_inv",
              name: "Qte",
              field: "idh_qty_inv",
              sortable: true,
              width: 80,
              filterable: false,
              
            },
            {
              id: "idh_price",
              name: "Prix unitaire",
              field: "idh_price",
              sortable: true,
              width: 80,
              filterable: false,
              //type: FieldType.float,
              formatter: Formatters.decimal,
             
            },
            {
              id: "idh_disc_pct",
              name: "Remise",
              field: "idh_disc_pct",
              sortable: true,
              width: 80,
              filterable: false,
              //type: FieldType.float,
              formatter: Formatters.decimal,
             
            },
            {
              id: "idh_taxable",
              name: "A Taxer",
              field: "idh_taxable",
              sortable: true,
              width: 80,
              filterable: false,
              //type: FieldType.float,
              formatter: Formatters.checkbox,
             
            },
            {
              id: "idh_taxc",
              name: "Taux Taxe",
              field: "idh_taxc",
              sortable: true,
              width: 80,
              filterable: false,
              //type: FieldType.float,
              formatter: Formatters.decimal,
             
            },
              
            ];
        
            this.gridOptionsihO9 = {
              asyncEditorLoading: false,
              editable: true,
              enableColumnPicker: true,
              enableSorting: true,
              enableCellNavigation: true,
              enableRowSelection: true,
              
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
                  { columnId: 'psh_line', direction: 'ASC' }
                ],
              },*/
            };
        
            this.datasetO9 = [];
          }
        
          gridReadycfO9(angularGrid: AngularGridInstance) {
            this.angularGridcfO9 = angularGrid;
            this.dataViewcfO9 = angularGrid.dataView;
            this.gridcfO9 = angularGrid.slickGrid;
            this.gridServicecfO9 = angularGrid.gridService;
          }
        
          initGridcfO9() {
            this.columnDefinitionscfO9 = [
              {
                id: "id",
                name: "id",
                field: "id",
                sortable: true,
                minWidth: 50,
                maxWidth: 50,
            },
            {
              id: "glt_line",
              name: "Ligne",
              field: "glt_line",
              sortable: true,
              minWidth: 50,
              maxWidth: 50,
          },
            {
              id: "glt_ref",
              name: "PL",
              field: "glt_ref",
              sortable: true,
              minWidth: 200,
              maxWidth: 200,
              filterable: false,
              
            }, 
            {
              id: "glt_desc",
              name: "Description",
              field: "glt_desc",
              sortable: true,
              minWidth: 200,
              maxWidth: 200,
              filterable: false,
              
            },
            {
              id: "glt_acct",
              name: "Compte",
              field: "glt_acct",
              sortable: true,
              minWidth: 200,
              maxWidth: 200,
              filterable: false,
              
            },
        
            {
              id: "glt_sub",
              name: "Sous Compte",
              field: "glt_sub",
              sortable: true,
              minWidth: 200,
              maxWidth: 200,
              filterable: false,
              
            },
            {
              id: "glt_cc",
              name: "Centre de Cout",
              field: "glt_cc",
              sortable: true,
              minWidth: 200,
              maxWidth: 200,
              filterable: false,
              
            },
            {
              id: "glt_curr_amt",
              name: "Montant Devise",
              field: "glt_curr_amt",
              sortable: true,
              minWidth: 200,
              maxWidth: 200,
              filterable: false,
              
            },
            {
              id: "glt_amt",
              name: "Montant ",
              field: "glt_amt",
              sortable: true,
              minWidth: 200,
              maxWidth: 200,
              filterable: false,
              
            },
              
            ];
        
            this.gridOptionscfO9 = {
              asyncEditorLoading: false,
              editable: true,
              enableColumnPicker: true,
              enableSorting: true,
              enableCellNavigation: true,
              enableRowSelection: true,
              enableAutoResize: false,
            
              
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
            };
        
            //this.dataset = [];
          }
        
          ngOnInitO9(): void {
            this.resetO9();
            
            this.userO9 =  JSON.parse(localStorage.getItem('user'))
            this.createFormO9();
            this.createtotFormO9();
          }
        
          createtotFormO9() {
            this.loadingSubject.next(false);
            //this.saleOrder = new SaleOrder();
            //const date = new Date;
            
            this.totFormO9 = this.totFBO9.group({
          //    so__chr01: [this.invoiceOrder.ih__chr01],
              tht: [{value: 0.00 , disabled: true}],
              tva: [{value: 0.00 , disabled: true}],
              timbre: [{value: 0.00 , disabled: true}],
              ttc: [{value: 0.00 , disabled: true}],
            });
          }
          //create form
          createFormO9() {
            this.loadingSubject.next(false);
              this.invoiceOrderO9 = new InvoiceOrder();
              const date = new Date;
              
              this.ihFormO9 = this.ihFBO9.group({
            //    so__chr01: [this.invoiceOrder.ih__chr01],
                ih_inv_nbr: [this.invoiceOrderO9.ih_inv_nbr , Validators.required],
                ih_nbr: [{value: this.invoiceOrderO9.ih_nbr , disabled: true}],
                ih_bill: [{value: this.invoiceOrderO9.ih_bill , disabled: true}],
                name: [{value:"", disabled: true}],
                
             
                ih_inv_date: [{
                  year:date.getFullYear(),
                  month: date.getMonth()+1,
                  day: date.getDate()
                }],
                
                ih_taxable: [{value: this.invoiceOrderO9.ih_taxable, disabled: true}],
               
                ih_po: [{value:this.invoiceOrderO9.ih_po, disabled: true}],
                ih_rmks: [this.invoiceOrderO9.ih_rmks],
                ih_curr: [{value:this.invoiceOrderO9.ih_curr, disabled: true}],
                ih_ex_rate: [{value:this.invoiceOrderO9.ih_ex_rate, disabled: true}],
                ih_ex_rate2: [{value:this.invoiceOrderO9.ih_ex_rate2, disabled: true}],
                ih_cr_terms: [this.invoiceOrderO9.ih_cr_terms, Validators.required],
                print:[true]
              });
          
              
              
          
            }
          //reste form
          resetO9() {
            this.inventoryTransactionO9 = new InventoryTransaction();
            this.createFormO9();
            this.datasetO9 = [];
            this.ihdatasetO9 = [];
            this.hasFormErrors = false;
          }
          // save data
          onSubmitO9() {
            this.hasFormErrors = false;
            const controls = this.ihFormO9.controls;
            /** check form */
            if (this.ihFormO9.invalid) {
              Object.keys(controls).forEach((controlName) =>
                controls[controlName].markAsTouched()
              );
              this.message = "Modifiez quelques éléments et réessayez de soumettre.";
              this.hasFormErrors = true;
        
              return;
            }
        
            if (!this.ihdatasetO9.length) {
              this.message = "La liste des article ne peut pas etre vide ";
              this.hasFormErrors = true;
        
              return;
            }
        
            for (var i = 0; i < this.ihdatasetO9.length; i++) {
              console.log(this.ihdatasetO9[i]  )
             if (this.ihdatasetO9[i].idh_part == "" || this.ihdatasetO9[i].idh_part == null  ) {
              this.message = "L' article ne peut pas etre vide";
              this.hasFormErrors = true;
              return;
         
             }
             if (this.ihdatasetO9[i].idh_um == "" || this.ihdatasetO9[i].idh_um == null  ) {
              this.message = "L' UM ne peut pas etre vide";
              this.hasFormErrors = true;
              return;
         
             }
             if (this.ihdatasetO9[i].idh_qty_inv == 0 ) {
              this.message = "La Quantite ne peut pas etre 0";
              this.hasFormErrors = true;
              return;
         
             }
        
            }
        /*
            this.sequenceService.getByOne({ seq_type: "IV", seq_profile: this.user.usrd_profile }).subscribe(
              (response: any) => {
            this.seq = response.data
            console.log(this.seq)   
                if (this.seq) {
                 this.pshnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
                 console.log(this.seq.seq_prefix)
                 console.log(this.seq.seq_curr_val)
                 
                console.log(this.pshnbr)
                 const id = Number(this.seq.id)
              let obj = { }
              obj = {
                seq_curr_val: Number(this.seq.seq_curr_val )+1
              }
              this.sequenceService.update(id , obj ).subscribe(
                (reponse) => console.log("response", Response),
                (error) => {
                  this.message = "Erreur modification Sequence";
                  this.hasFormErrors = true;
                  return;
             
                
                },
                )
              }else {
                this.message = "Parametrage Manquant pour la sequence";
                this.hasFormErrors = true;
                return;
           
               }
        
              })
              */
            // tslint:disable-next-line:prefer-const
            let ih = this.prepareIhO9()
            this.addIhO9(ih, this.ihdatasetO9,this.cfdatasetO9);
        
        
          }
        
          prepareIhO9(): any {
            const controls = this.ihFormO9.controls;
            const controlstot = this.totFormO9.controls 
            const _ih = new InvoiceOrder();
            console.log("temp", this.invoiceTempO9)
            _ih.ih_category =  this.invoiceTempO9.ith_category
            _ih.ih_cust = this.invoiceTempO9.ith_cust;
            _ih.ih_bill = this.invoiceTempO9.ith_bill;
            _ih.ih_nbr = this.invoiceTempO9.ith_nbr;
            
            _ih.ih_inv_date = controls.ih_inv_date.value
            ? `${controls.ih_inv_date.value.year}/${controls.ih_inv_date.value.month}/${controls.ih_inv_date.value.day}`
            : null;
          
            
              if (this.invoiceTempO9.ith_taxable == null || this.invoiceTempO9.ith_taxable == "" ) { _ih.ih_taxable = false} else { _ih.ih_taxable = this.invoiceTempO9.ith_taxable}
            
           
            _ih.ih_rmks = this.invoiceTempO9.ith_rmks;
            
            _ih.ih_rmks = this.invoiceTempO9.ith_rmks;
            _ih.ih_curr = this.invoiceTempO9.ith_curr;
            _ih.ih_ex_rate = this.invoiceTempO9.ith_ex_rate;
            _ih.ih_ex_rate2 = this.invoiceTempO9.ith_ex_rate2;
        
        
            _ih.ih_inv_nbr =  controls.ih_inv_nbr.value
            
            _ih.ih_cr_terms = controls.ih_cr_terms.value;
            _ih.ih_amt = controlstot.tht.value;
            _ih.ih_tax_amt = controlstot.tva.value;
            _ih.ih_trl1_amt = controlstot.timbre.value;
        
        
            
            return _ih;
          
          }
          /**
           * Add po
           *
           * @param _ih: ih
           */
        addIhO9(_ih: any, detail: any, cfdetail:any) {
            var array = []
            var iharray = []
            for (let data of detail) {
              delete data.id;
              delete data.cmvid;
             
            }
            for (let data of cfdetail) {
              delete data.id;
              delete data.cmvid;
             
            }
            this.loadingSubject.next(true);
            let ih = null;
            const controls = this.ihFormO9.controls;
        
            this.invoiceOrderTempService
              .imput({ invoiceOrder: _ih, invoiceOrderDetail: detail, gldetail: cfdetail })
              .subscribe(
                (reponse: any) => (ih = reponse.data),
                (error) => {
                  this.layoutUtilsService.showActionNotification(
                    "Erreur verifier les informations",
                    MessageType.Create,
                    10000,
                    true,
                    true
                  );
                  this.loadingSubject.next(false);
                },
                () => {
                  this.layoutUtilsService.showActionNotification(
                    "Ajout avec succès",
                    MessageType.Create,
                    10000,
                    true,
                    true
                  );
                  this.loadingSubject.next(false);
                  console.log(this.dataset);
                
                  array = this.ihdatasetO9;        
                  var result = [];
          array.reduce(function(res, value) {
            //console.log('aaa',res[value.idh_part])
            if (!res[value.idh_part]) {
              res[value.idh_part] = { idh_part: value.idh_part,  idh_qty_inv: 0 };
              result.push(res[value.idh_part])
              
            }
            res[value.idh_part].idh_qty_inv += value.idh_qty_inv; 
            return res;
          }, {});
          
          console.log('bbb',result)
          var bool = false
          for (var obj = 0; obj < result.length; obj++) {
            const det = result[obj];
            
        iharray.push(det)
        bool = false
        var j = 0
           
            do {
          if (this.ihdatasetO9[j].idh_part = det.idh_part ) {
            iharray[obj].idh_line = obj + 1
            iharray[obj].desc =  this.ihdatasetO9[j].desc
            iharray[obj].idh_price =  this.ihdatasetO9[j].idh_price
            iharray[obj].idh_taxable = this.ihdatasetO9[j].idh_taxable
            iharray[obj].idh_tax_code = this.ihdatasetO9[j].idh_tax_code
            iharray[obj].idh_taxc = this.ihdatasetO9[j].idh_taxc
            iharray[obj].idh_disc_pct = this.ihdatasetO9[j].idh_disc_pct
            iharray[obj].idh_um = this.ihdatasetO9[j].idh_um
            
            
          bool = true   
          }
          j++
          }while ( j < this.ihdatasetO9.length || bool == false);
        
        
                                 
          }
          console.log("hnahna", iharray)
          
        
                 // if(controls.print.value == true) printIH(this.customer, iharray, ih,this.curr);
                  this.resetO9()
                  // this.router.navigateByUrl("/sales/print-invoice");
                  this.resetO9()
                }
              );
        }
        onChangeInvO9() {
            const controls = this.ihFormO9.controls
            const controlst = this.totFormO9.controls
            this.datasetO9 = []
            this.ihdatasetO9 = []
            this.cfdatasetO9 = []
            this.invoiceOrderTempService
                .findBy({ith_inv_nbr: controls.ih_inv_nbr.value, ith_invoiced: false})
                .subscribe((response: any) => {
                    console.log(response.data.invoiceOrderTemp)
                    if (response.data.invoiceOrderTemp == null) {
                        alert("Facture nexiste pas ou bien Imputé")
                        controls.ih_inv_nbr.setValue(null)
                        //console.log(response.data.length)
                        document.getElementById("invoice").focus();
                    }  else {
        
                      this.invoiceTempO9 = response.data.invoiceOrderTemp;
                      const det1 = response.data.details;
                      controls.ih_inv_nbr.setValue (this.invoiceTempO9.ith_inv_nbr)
                      controls.ih_nbr.setValue(this.invoiceTempO9.ith_nbr )
                      controls.ih_bill.setValue(this.invoiceTempO9.ith_bill)
                      controlst.tht.setValue(Number(this.invoiceTempO9.ith_amt).toFixed(2));
                      controlst.tva.setValue(Number(this.invoiceTempO9.ith_tax_amt).toFixed(2));
                      controlst.timbre.setValue(Number(this.invoiceTempO9.ith_trl1_amt).toFixed(2));
                      let ttc = Number(this.invoiceTempO9.ith_amt) + Number(this.invoiceTempO9.ith_tax_amt) + Number(this.invoiceTempO9.ith_trl1_amt)
                      controlst.ttc.setValue(ttc.toFixed(2));
                      
                      
                      
                      this.customersService.getBy({ cm_addr: this.invoiceTempO9.ith_bill }).subscribe(
                        (ressa: any) => {
                          console.log(ressa);
                          this.customerO9  = ressa.data
                          
                            controls.name.setValue(ressa.data.address.ad_name || "");
                        })
                      
                      const dateinv = new Date(this.invoiceTempO9.ith_inv_date)
                                dateinv.setDate(dateinv.getDate() )
                                
                                controls.ih_inv_date.setValue({
                                    year: dateinv.getFullYear(),
                                    month: dateinv.getMonth() + 1,
                                    day: dateinv.getDate(),
                                })
                      
        
                      controls.ih_taxable.setValue(this.invoiceTempO9.ith_taxable)
                     
                      controls.ih_po.setValue(this.invoiceTempO9.ith_po)
                      controls.ih_rmks.setValue(this.invoiceTempO9.ith_rmks)
                      controls.ih_curr.setValue(this.invoiceTempO9.ith_curr)
                      controls.ih_ex_rate.setValue(this.invoiceTempO9.ith_ex_rate)
                      controls.ih_ex_rate2.setValue(this.invoiceTempO9.ith_ex_rate2)
                      controls.ih_cr_terms.setValue(this.invoiceTempO9.ith_cr_terms)
                      for (var object = 0; object < det1.length; object++) {
                        const detail = det1[object];
        
                       console.log(detail)
                       this.itemsService.getByOne({pt_part: detail.itdh_part }).subscribe((resp:any)=>{
                        console.log(resp.data)
                      
                            this.gridServiceihO9.addItem(
                              {
                                id: detail.itdh_line, //this.dataset.length + 1,
                                idh_line: detail.itdh_line,   //this.dataset.length + 1,
                                idh_nbr: detail.itdh_nbr,
                               
                                idh_part: detail.itdh_part,
                                prod_line: resp.data.pt_prod_line,
                                cmvid: "",
                                desc: detail.item.pt_desc1,
                                idh_qty_inv: detail.itdh_qty_inv ,
                                idh_um: detail.itdh_um,
                                idh_um_conv: detail.itdh_um_conv,
                                idh_type: detail.itdh_type,
                                idh_price: detail.itdh_price,
                                idh_disc_pct: detail.itdh_disc_pct,
                                idh_taxable: detail.itdh_taxable,
                                idh_taxc: detail.itdh_taxc,
                                idh_tax_code: detail.itdh_tax_code,
                                idh_site: detail.itdh_site,
                                idh_loc: detail.itdh_loc,
                                idh_serial: detail.itdh_serial,
                                idh_status: detail.itdh_status,
                                idh_expire: detail.itdh_expire,
                              },
                              { position: "bottom" }
                            );
                            })
                  }
          
                  //this.calculatetot();
                    }
                })
        }
          /**
           * Go back to the list
           *
           */
        goBackO9() {
            this.loadingSubject.next(false);
            const url = `/`;
            this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
        }
        onAlertCloseO9($event) {
            this.hasFormErrors = false;
        }
        calculatetotO9(){
          const controls = this.totFormO9.controls 
           const controlsso = this.ihFormO9.controls 
           
           
           console.log(this.ihdatasetO9.length)
           let tht = 0
           let tva = 0
           let timbre = 0
           let ttc = 0
           console.log(this.ihdatasetO9)
           for (var i = 0; i < this.ihdatasetO9.length; i++) {
             console.log("here",this.ihdatasetO9[i].idh_price)
             console.log("here", this.ihdatasetO9[i].idh_price,this.ihdatasetO9[i].idh_qty_inv, this.ihdatasetO9[i].idh_disc_pct, this.ihdatasetO9[i].idh_taxc   )
             tht += round((this.ihdatasetO9[i].idh_price * ((100 - this.ihdatasetO9[i].idh_disc_pct) / 100 ) *  this.ihdatasetO9[i].idh_qty_inv),2)
             if(this.ihdatasetO9[i].idh_taxable == true) tva += round((this.ihdatasetO9[i].idh_price * ((100 - this.ihdatasetO9[i].idh_disc_pct) / 100 ) *  this.ihdatasetO9[i].idh_qty_inv) * (this.ihdatasetO9[i].idh_taxc ? this.ihdatasetO9[i].idh_taxc / 100 : 0),2)
            
          
             
        
             console.log(tva)
             if(controlsso.ih_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
               if (timbre > 10000) { timbre = 10000} } 
          
           }
            ttc = round(tht,2) + round(tva,2) + round(timbre,2)
            console.log(tht,tva,timbre,ttc)
            controls.tht.setValue(tht.toFixed(2));
            controls.tva.setValue(tva.toFixed(2));
            controls.timbre.setValue(timbre.toFixed(2));
            controls.ttc.setValue(ttc.toFixed(2));
        
        }
        handleSelectedRowsChangedO9(e, args) {
          this.datasetO9 = []
          this.ihdatasetO9 = []
          this.cfdatasetO9 = []  
          
          const controls = this.ihFormO9.controls
          const controlst = this.totFormO9.controls
          if (Array.isArray(args.rows) && this.gridObj1O9) {
              args.rows.map((idx) => {
                  const item = this.gridObj1O9.getDataItem(idx)
                  console.log(item)
                  this.invoiceTempO9 = item
                  controls.ih_inv_nbr.setValue (item.ith_inv_nbr)
                      controls.ih_nbr.setValue(item.ith_nbr )
                      controls.ih_bill.setValue(item.ith_bill)
                      controlst.tht.setValue(Number(item.ith_amt).toFixed(2));
                      controlst.tva.setValue(Number(item.ith_tax_amt).toFixed(2));
                      controlst.timbre.setValue(Number(item.ith_trl1_amt).toFixed(2));
                      let ttc = Number(item.ith_amt) + Number(item.ith_tax_amt) + Number(item.ith_trl1_amt)
                      controlst.ttc.setValue(ttc.toFixed(2));
                      
                      
                     
                     
                      const dateinv = new Date(item.ith_inv_date)
                                dateinv.setDate(dateinv.getDate() )
                                
                                controls.ih_inv_date.setValue({
                                    year: dateinv.getFullYear(),
                                    month: dateinv.getMonth() + 1,
                                    day: dateinv.getDate(),
                                })
                      
                      
                      controls.ih_taxable.setValue(item.ith_taxable)
                     
                      controls.ih_po.setValue(item.ith_po)
                      controls.ih_rmks.setValue(item.ith_rmks)
                      controls.ih_curr.setValue(item.ith_curr)
                      controls.ih_ex_rate.setValue(item.ith_ex_rate)
                      controls.ih_ex_rate2.setValue(item.ith_ex_rate2)
                      controls.ih_cr_terms.setValue(item.ith_cr_terms)
                      this.customersService.getBy({ cm_addr: item.ith_bill }).subscribe(
                        (ressa: any) => {
                          console.log(item.ith_bill);
                          this.customerO9  = ressa.data
                            controls.name.setValue(ressa.data.address.ad_name || "");
                        })
                      this.invoiceOrderTempService
                      .findBy({ith_inv_nbr: item.ith_inv_nbr})
                      .subscribe((response: any) => {
                          console.log(response.data.invoiceOrderTemp)
        
                      const det1 = response.data.details
        
                      for (var object = 0; object < det1.length; object++) {
                        const detail = det1[object];
                       console.log(detail)
                       this.itemsService.getByOne({pt_part: detail.itdh_part }).subscribe((resp:any)=>{
                        console.log(resp.data)
                      
                            this.gridServiceihO9.addItem(
                              {
                                id: detail.itdh_line, //this.dataset.length + 1,
                                idh_line: detail.itdh_line,   //this.dataset.length + 1,
                                idh_nbr: detail.itdh_nbr,
                               
                                idh_part: detail.itdh_part,
                                prod_line: resp.data.pt_prod_line,
                                cmvid: "",
                                desc: detail.item.pt_desc1,
                                idh_qty_inv: detail.itdh_qty_inv ,
                                idh_um: detail.itdh_um,
                                idh_um_conv: detail.itdh_um_conv,
                                idh_type: detail.itdh_type,
                                idh_price: detail.itdh_price,
                                idh_disc_pct: detail.itdh_disc_pct,
                                idh_taxable: detail.itdh_taxable,
                                idh_taxc: detail.itdh_taxc,
                                idh_tax_code: detail.itdh_tax_code,
                                idh_site: detail.itdh_site,
                                idh_loc: detail.itdh_loc,
                                idh_serial: detail.itdh_serial,
                                idh_status: detail.itdh_status,
                                idh_expire: detail.itdh_expire,
                              },
                              { position: "bottom" }
                            );
                            })
                  }
          
                  //this.calculatetot();
                })
              })
          }
        }
        angularGridReadyO9(angularGrid: AngularGridInstance) {
          this.angularGrid1O9 = angularGrid
          this.gridObj1O9 = (angularGrid && angularGrid.slickGrid) || {}
        }
        prepareGrid1O9() {
          this.columnDefinitions1O9 = [
              {
                  id: "id",
                  name: "id",
                  field: "id",
                  sortable: true,
                  minWidth: 80,
                  maxWidth: 80,
              },
              {
                  id: "ith_inv_nbr",
                  name: "N° Facture",
                  field: "ith_inv_nbr",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "ith_cust",
                  name: "Client",
                  field: "ith_cust",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "ith_po",
                  name: "Code Projet",
                  field: "ith_po",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "ith_nbr",
                  name: "N° Commande",
                  field: "ith_nbr",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
              },
              {
                  id: "ith_inv_date",
                  name: "Date Effet",
                  field: "ith_inv_date",
                  sortable: true,
                  filterable: true,
                  type: FieldType.dateIso,
              },
          ]
        
          this.gridOptions1O9 = {
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
          }
        
          // fill the dataset with your data
         
          this.invoiceOrderTempService
              .getByAll({ith_invoiced: false})
              .subscribe((response: any) => (this.invoicesO9 = response.data))
             
        }
        openO9(content) {
          this.prepareGrid1O9()
          this.modalService.open(content, { size: "lg" })
        }
        oncreateCFO9() {
          const controls = this.ihFormO9.controls;
          const controlst = this.totFormO9.controls;
          
          this.calculatetotO9();
        
          this.cfplO9 = [];
          this.cfdatasetO9 = [];
          var array = [];
          var tax = [];
        
          console.log("Number(this.total),", Number(this.totalO9))
          console.log(this.customerO9)
        
        //this.gridServicecf.addItem(
        this.cfdatasetO9.push(  
        {
            id: 1,
            glt_line: 1, 
            glt_ref: this.customerO9.cm_addr,
        
            glt_desc: this.customerO9.address.ad_name,
            glt_acct: this.customerO9.cm_ar_acct,
            glt_sub: this.customerO9.cm_ar_sub,
            glt_cc: this.customerO9.cm_ar_cc,
            glt_curr_amt: - Number(controlst.ttc.value),
            glt_amt: - Number(controlst.ttc.value)  * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
            
        
          } ,
         /* { position: "bottom" }*/
        );
        
           
                  for (var j = 0; j < this.ihdatasetO9.length; j++) {
                 console.log("jjjjjjjjjjjj")
                    this.ihdatasetO9[j].total_line = this.ihdatasetO9[j].idh_price * this.ihdatasetO9[j].idh_qty_inv;
                    this.ihdatasetO9[j].tax_line = this.ihdatasetO9[j].idh_price * this.ihdatasetO9[j].idh_qty_inv * this.ihdatasetO9[j].idh_taxc / 100;
        
        
                  }
        
        
          array = this.ihdatasetO9;        
                  var result = [];
          array.reduce(function(res, value) {
            //console.log('aaa',res[value.prod_line])
            if (!res[value.prod_line]) {
              res[value.prod_line] = { prod_line: value.prod_line, total_line: 0 };
              result.push(res[value.prod_line])
            }
            res[value.prod_line].total_line += value.total_line;
            return res;
          }, {});
          
          console.log('bbb',result)
         
          for (var obj = 0; obj < result.length; obj++) {
            const det = result[obj];
            console.log(obj, "obj",det)
                 
          this.productLineService.getByOne({ pl_prod_line: det.prod_line  }).subscribe(
            (res: any) => {
          
              var prodline = det.prod_line
              console.log(res.data)
        
              this.gridServicecfO9.addItem(
                {
                  id: this.cfdatasetO9.length + 1,
                  glt_line: this.cfdatasetO9.length + 1,
                  glt_ref: det.prod_line,
        
                  glt_desc: res.data.pl_desc,
                  glt_acct: res.data.pl_sls_acct,
                  glt_sub: res.data.pl_sls_sub,
                  glt_cc: res.data.pl_sls_cc,
                  glt_curr_amt:  det.total_line,
                  glt_amt:   det.total_line * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
                  
            
                } ,
                { position: "bottom" }
              );
          
        })
        
          }
        
        
        
        if(controls.tva.value !=0)
        {
          tax = this.ihdatasetO9;        
                  var result = [];
          tax.reduce(function(res, value) {
            //console.log('aaa',res[value.prod_line])
            if (!res[value.idh_tax_code]) {
              res[value.idh_tax_code] = { idh_tax_code: value.idh_tax_code, tax_line: 0 };
              result.push(res[value.idh_tax_code])
            }
            res[value.idh_tax_code].tax_line += value.tax_line;
            return res;
          }, {});
          
          console.log('bbb',result)
         
          for (var o = 0; o < result.length; o++) {
            const det = result[o];
                 console.log("taxcode",det.idh_tax_code)
          this.taxService.getBy({ tx2_tax_code: det.idh_tax_code  }).subscribe(
            (res: any) => {
          console.log(res.data)
              var taxline = det.idh_tax_code
              console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhheé",taxline)
        
              this.gridServicecfO9.addItem(
                {
                  id: this.cfdatasetO9.length + 1,
                  glt_line: this.cfdatasetO9.length + 1,
                  glt_ref: det.idh_tax_code,
        
                  glt_desc: res.data.tx2_desc,
                  glt_acct: res.data.tx2_ar_acct,
                  glt_sub: res.data.tx2_ar_sub,
                  glt_cc: res.data.tx2_ar_cc,
                  glt_curr_amt:  det.tax_line,
                  glt_amt:   det.tax_line * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
                  
            
                } ,
                { position: "bottom" }
              );
          
        })
          }
          }
          console.log("timbre" ,this.invoiceOrderO9.ih_trl1_amt)
        if(this.invoiceOrderO9.ih_trl1_amt != 0) {
          this.codeService.getBy({ code_fldname: "cm_cr_terms", code_value: "ES"  }).subscribe(
            (res: any) => {
          console.log(res.data)
          
          this.accountService.getBy({ ac_code: res.data[0].chr01  }).subscribe(
            (resp: any) => {
          console.log(resp.data)
          
          
          this.gridServicecfO9.addItem(
            {
              id: this.cfdatasetO9.length + 1,
              glt_line: this.cfdatasetO9.length + 1,
              glt_ref: "Espece",
              glt_desc: resp.data.ac_desc,
              glt_acct: resp.data.ac_code,
             // glt_sub: res.data.tx2_ar_sub,
             // glt_cc: res.data.tx2_ar_cc,
              glt_curr_amt:  -Number(controlst.timbre.value),
              glt_amt:   -Number(controlst.timbre.value) * ((controls.ih_ex_rate2.value) / (controls.ih_ex_rate.value)),
              
        
            } ,
            { position: "bottom" }
          );
          })
        
        })  
             
        }    
        }
        // ONGLET 9
        angularGridReadyO10(angularGrid: AngularGridInstance) {
            this.angularGridO10 = angularGrid;
            this.gridO10 = angularGrid.slickGrid; // grid object
            this.dataviewO10 = angularGrid.dataView;
            this.gridServiceO10 = angularGrid.gridService;
          }
          
          
          prepareGridO10() {
        
              this.columnDefinitionsO10 = [
                  
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
                        new Aggregators.Sum('ar_applied')
                      ],
                      aggregateCollapsed: true,
                      collapsed: true,
                    }
                  }, 
                  {
                    id: "ar_ship",
                    name: "Facture N°",
                    field: "ar_ship",
                    sortable: true,
                    filterable: true,
                    type: FieldType.string,
                    grouping: {
                      getter: 'ar_ship',
                      formatter: (g) => `Facture: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                      aggregators: [
                        // (required), what aggregators (accumulator) to use and on which field to do so
                       // new Aggregators.Avg('ld_qty_oh'),
                        new Aggregators.Sum('ar_amt')
                      ],
                      aggregateCollapsed: true,
                      collapsed: true,
                    }
                  }, 
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
                        new Aggregators.Sum('ar_applied')
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
                        new Aggregators.Sum('ar_applied')
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
                        new Aggregators.Sum('ar_applied')
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
                        new Aggregators.Sum('ar_applied')
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
                        new Aggregators.Sum('ar_applied')
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
                        new Aggregators.Sum('ar_applied')
                      ],
                      aggregateCollapsed: true,
                      lazyTotalsCalculation:true,
                      collapsed:true
                    }
                  },
                  
                  
        
              ]
        
              this.gridOptionsO10 = {
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
              this.datasetO10 = []
              
                this.accountreceivableService
              .getBy({ })
              .subscribe(
                
                  (response: any) => {this.datasetO10 = response.data
                    console.log(this.datasetO10)
                    this.dataviewO10.setItems(this.datasetO10)},
                  
                  (error) => {
                      this.datasetO10 = []
                  },
                  () => {}
                  
              )
              
              
              console.log(this.datasetO10)
          }
          onGroupChangedO10(change: { caller?: string; groupColumns: Grouping[] }) {
              // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
              const caller = change && change.caller || [];
              const groups = change && change.groupColumns || [];
        
              if (Array.isArray(this.selectedGroupingFieldsO10) && Array.isArray(groups) && groups.length > 0) {
                // update all Group By select dropdown
                this.selectedGroupingFieldsO10.forEach((g, i) => this.selectedGroupingFieldsO10[i] = groups[i] && groups[i].getter || '');
              } else if (groups.length === 0 && caller === 'remove-group') {
                this.clearGroupingSelectsO10();
              }
            }
            clearGroupingSelectsO10() {
              this.selectedGroupingFieldsO10.forEach((g, i) => this.selectedGroupingFieldsO10[i] = '');
            }
            
            collapseAllGroupsO10() {
              this.dataviewObjO10.collapseAllGroups();
            }
          
            expandAllGroupsO10() {
              this.dataviewObjO10.expandAllGroups();
            }
            clearGroupingO10() {
              if (this.draggableGroupingPluginO10 && this.draggableGroupingPluginO10.setDroppedGroups) {
                this.draggableGroupingPluginO10.clearDroppedGroups();
              }
              this.gridObjO10.invalidate(); // invalidate all rows and re-render
            }
        
            printpdfO10(nbr) {
              // const controls = this.totForm.controls
              
              console.log("pdf");
              var doc = new jsPDF("l");
              let date = new Date()
             // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
              var img = new Image()
              img.src = "./assets/media/logos/companyentete.png";
              doc.addImage(img, 'png', 150, 5, 50, 30)
              doc.setFontSize(9);
              if (this.domainO10.dom_name != null) {
                doc.text(this.domainO10.dom_name, 10, 10);
              }
              if (this.domainO10.dom_addr != null) doc.text(this.domainO10.dom_addr, 10, 15);
              if (this.domainO10.dom_city != null) doc.text(this.domainO10.dom_city + " " + this.domainO10.dom_country, 10, 20);
              if (this.domainO10.dom_tel != null) doc.text("Tel : " + this.domainO10.dom_tel, 10, 30);
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
              for (let j = 0; j < this.datasetO10.length  ; j++) {
                total = total - Number(this.datasetO10[j].ld_qty_oh)
                
                if ((j % 20 == 0) && (j != 0) ) {
                  doc.addPage();
                  img.src = "./assets/media/logos/companyentete.png";
                  doc.addImage(img, 'png', 150, 5, 50, 30)
                  doc.setFontSize(9);
                  if (this.domainO10.dom_name != null) {
                    doc.text(this.domainO10.dom_name, 10, 10);
                  }
                  if (this.domainO10.dom_addr != null) doc.text(this.domainO10.dom_addr, 10, 15);
                  if (this.domainO10.dom_city != null) doc.text(this.domainO10.dom_city + " " + this.domainO10.dom_country, 10, 20);
                  if (this.domainO10.dom_tel != null) doc.text("Tel : " + this.domainO10.dom_tel, 10, 30);
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
                  doc.text(this.datasetO10[j].ld_part, 25, i - 1);
                  doc.line(65, i - 5, 65, i);
                  doc.text(this.datasetO10[j].chr01 + ' ' + this.datasetO10[j].chr02 + ' ' + this.datasetO10[j].chr03, 67.5, i - 1);
                  doc.line(130, i - 5, 130, i);
                  doc.text(String(Number(this.datasetO10[j].ld_qty_oh) ), 137, i - 1, { align: "right" });
                  doc.line(140, i - 5, 140, i);
                  doc.text(String(this.datasetO10[j].chr04), 143, i - 1);
                  doc.line(170, i - 5, 170, i);
                  doc.text(String(this.datasetO10[j].created_by), 173, i - 1, );
                  doc.line(185, i - 5, 185, i);
                  doc.text(String(this.datasetO10[j].ld_lot), 188, i - 1, );
                  doc.line(205, i - 5, 205, i);
                  doc.text(String(this.datasetO10[j].ld_ref), 207, i - 1, );
                  doc.line(220, i - 5, 220, i);
                  doc.text(String((this.dataset[j].ld_date)) , 223, i - 1, );
                  doc.line(235, i - 5, 235, i);
                  doc.text(String((this.datasetO10[j].ld_site)) , 238, i - 1, );
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
            
              doc.text("NOMBRE DE BIG BAG   " + String(this.datasetO10.length) + "  , Total POIDS:  " + String(Number(total)), 40, i + 12, { align: "left" });
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
            onSubmitO10() {
              const url = `/sales/payment-psh`;
              this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
            
              // this.printpdf(new Date().toLocaleDateString()); 
             
              // tslint:disable-next-line:prefer-const
            
            }
            oncreateO10() {
              const url = `/sales/create-direct-invoice`;
              this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
            
              // this.printpdf(new Date().toLocaleDateString()); 
             
              // tslint:disable-next-line:prefer-const
            
            }
            onprintO10() {
              const url = `/sales/print-invoice`;
              this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
            
              // this.printpdf(new Date().toLocaleDateString()); 
             
              // tslint:disable-next-line:prefer-const
            
            }
            onimputO10() {
              const url = `/sales/input-invoice`;
              this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
            
              // this.printpdf(new Date().toLocaleDateString()); 
             
              // tslint:disable-next-line:prefer-const
            
            }
            gobackO10() {
            
              
              const url = `/customers/customer-list`;
              this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
            
            }
            resetO10() {
            
              this.datasetO10 = []
              this.accountreceivableService.getAll().subscribe( 
                
                  (response: any) => {this.datasetO10 = response.data
                    console.log(this.dataset)
                    this.dataviewO10.setItems(this.datasetO10)},
                  
                  (error) => {
                      this.datasetO10 = []
                  },
                  () => {}
                  
              )
            
            }
            // ONGLET 10
             //create form
              createFormO11() {
                this.loadingSubject.next(false);
                  this.accountShiperO11 = new AccountShiper();
                  const date = new Date;
                  
                  this.asFormO11 = this.asFB.group({
                //    so__chr01: [this.accountShiperO11.as__chr01],
                    as_ship:[this.accountShiperO11.as_ship , Validators.required],
                    as_cust: [{value: this.accountShiperO11.as_cust , disabled: true} ],
                    name: [{value: '' , disabled: true} ],
                    as_app_owner: [{value:this.accountShiperO11.as_app_owner, disabled: true}],
                    as_curr: [{value: this.accountShiperO11.as_curr , disabled: true}],
                    amt:[{value:0, disabled: true}],
                    rest:[{value:0, disabled: true}],
                   
                    
                  
                    as_effdate: [{
                      year:date.getFullYear(),
                      month: date.getMonth()+1,
                      day: date.getDate()
                    }],
                    
                    as_bank: [this.accountShiperO11.as_bank, Validators.required],
                   
                    as_pay_method: [this.accountShiperO11.as_pay_method, Validators.required],
                    
                    as_check: [this.accountShiperO11.as_check ],
            
                    as_amt: [this.accountShiperO11.as_amt],
                   
                    as_po: [this.accountShiperO11.as_po],
                    
            
            
                  });
              
                  
                  
              
                }
            
                OnchangeCurrO11(){
                  const controls = this.asFormO11.controls
                  
                        this.deviseService
                        .getBy({ cu_curr: controls.as_curr.value })
                        .subscribe((response: any) => {
            
                          if (response.data == null){ 
                            alert("Devise n'existe pas")
                            controls.au_curr.setValue(null)
                            document.getElementById("as_curr").focus();
                          }
                      })
                       
                }
            
            
                OnchangeBankO11 (){
            
                  const controls = this.asFormO11.controls 
                  const bk_code  = controls.as_bank.value
                 
                  
                this.bankService.getBy({bk_code}).subscribe((res:any)=>{
                    //const {data} = res.data.bank
                    //console.log(res.data.bank)
                    if (res.data.bank == null){ this.layoutUtilsService.showActionNotification(
                        "cette banque n'existe pas!",
                        MessageType.Create,
                        10000,
                        true,
                        true
                    )
                    this.error = true}
                    else {
                        this.error = false
                
                     
                    }
              
              
                },error=>console.log(error))
              }  
              //reste form
              resetO11() {
                this.accountShiperO11 = new AccountShiper();
                this.createFormO11();
                
                this.hasFormErrors = false;
              }
              // save data
              onSubmitO11() {
                this.hasFormErrors = false;
                const controls = this.asFormO11.controls;
                /** check form */
                if (this.asFormO11.invalid) {
                  Object.keys(controls).forEach((controlName) =>
                    controls[controlName].markAsTouched()
                  );
                  this.message = "Modifiez quelques éléments et réessayez de soumettre.";
                  this.hasFormErrors = true;
            
                  return;
                }
            
               
                let as = this.prepareAS()
                this.addAS(as);
            
            
              }
            
              prepareAS(): any {
                
                const controls = this.asFormO11.controls;
               
                 const _as = new AccountShiper();
                  _as.as_ship = controls.as_ship.value;
                  _as.as_cust = controls.as_cust.value;
                  _as.as_curr = controls.as_curr.value;
                  _as.as_app_owner = controls.as_app_owner.value;
                  
                  _as.as_effdate = controls.as_effdate.value
                    ? `${controls.as_effdate.value.year}/${controls.as_effdate.value.month}/${controls.as_effdate.value.day}`
                    : null;
              
                   
                  
                  _as.as_type = "P";
                 
                  _as.as_bank = controls.as_bank.value;
                  _as.as_pay_method = controls.as_pay_method.value;
                  _as.as_check = controls.as_check.value;
                
                  _as.as_amt = (-1) * controls.as_amt.value;
                  _as.as_applied = (-1) * controls.as_amt.value ;
                  _as.as_po = controls.as_po.value;
                                  
                
                  _as.as_open = false
                  
            
                 return _as;
                
              
              }
              /**
               * Add po
               *
               * @param _as: as
               */
              addAS(_as: AccountShiper) {
                this.loadingSubject.next(true);
                let as = null;
                const controls = this.asFormO11.controls;
            
                this.accountShiperService
                  .addP(_as )
                  .subscribe(
                    (reponse: any) => (as = reponse.data),
                    (error) => {
                      this.layoutUtilsService.showActionNotification(
                        "Erreur verifier les informations",
                        MessageType.Create,
                        10000,
                        true,
                        true
                      );
                      this.loadingSubject.next(false);
                    },
                    () => {
                      this.layoutUtilsService.showActionNotification(
                        "Ajout avec succès",
                        MessageType.Create,
                        10000,
                        true,
                        true
                      );
                      this.loadingSubject.next(false);
                      
                      // this.router.navigateByUrl("/sales/payment-psh");
                      this.resetO11()
                    }
                  );
              }
             
              
            
            
              onChangeBLO11() {
                const controls = this.asFormO11.controls;
                const as_nbr = controls.as_ship.value;
                
                this.accountShiperService.getBy({ as_nbr, as_type : "I" }).subscribe(
                  (res: any) => {
                  //  console.log(res);
                    const { data } = res.data;
            
                    if (!data) {
                      this.layoutUtilsService.showActionNotification(
                        "ce BL n'existe pas ou bien payé totalement!",
                        MessageType.Create,
                        10000,
                        true,
                        true
                      );
                      this.error = true;
                      controls.as_ship.setValue(null);
                      document.getElementById("check").focus();
                      document.getElementById("bl").focus();
                    } else {
                      this.error = false;
                      
                      controls.as_ship.setValue(data.as_nbr || "");
                      controls.as_cust.setValue(data.as_cust || "");
                      controls.as_app_owner.setValue(data.as_app_owner || "");
                      controls.as_curr.setValue(data.as_curr || "");
                      controls.amt.setValue(data.as_amt || "");
                      controls.rest.setValue(Number(data.as_amt) - Number(data.as_applied) || "");
                    
                  // controls.as_pay_method.setValue(data.as_pay_method || "");
                 
                  this.customerService.getBy({cm_addr: data.as_cust}).subscribe((response: any)=>{
                                
                                
                  
                    controls.name.setValue(response.data.address.ad_name || "");
                    controls.as_bank.setValue(response.data.cm_bank || "");
                    // controls.as_pay_method.setValue(response.data.cm_pay_method|| "");
                     
                   
                 
            
                  });    
                
              //  (error) => console.log(error)
                }
            
              });    
                
              }
            
              
              
            
              onChangeCheckO11() {
                const controls = this.asFormO11.controls;
                const as_check = controls.as_check.value;
                const as_bank = controls.as_bank.value;
                const as_pay_method = controls.as_pay_method.value;
            
                
                this.accountShiperService.getBy({ as_check,as_bank, as_pay_method, as_type : "P" }).subscribe(
                  (res: any) => {
                    this.checkO11 = res.data[0];
                    
                    if (this.checkO11 != null) {
                
                      this.layoutUtilsService.showActionNotification(
                        "ce Cheque Existe Deja",
                        MessageType.Create,
                        10000,
                        true,
                        true
                      );
                      this.error = true;
                      controls.as_check.setValue(null);
                      document.getElementById("check").focus();
                      
                    }
                    
                 
            
                  });    
                
              //  (error) => console.log(error)
              
            
                
                
              }
              onChangeAmtO11() {
                const controls = this.asFormO11.controls;
              
              
                if (Number(controls.as_amt.value) > Number(controls.rest.value)  ) {
                
                      this.layoutUtilsService.showActionNotification(
                        "Montant du paiement doit etre inferieur ou egale au montant BL",
                        MessageType.Create,
                        10000,
                        true,
                        true
                      );
                      this.error = true;
                      controls.as_amt.setValue(0);
                      document.getElementById("amt").focus();
                      
                    }
                
                
              }
            
              /**
               * Go back to the list
               *
               */
              goBackO11() {
                this.loadingSubject.next(false);
                const url = `/sales/list-invoices`;
                this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
              }
            
              onAlertCloseO11($event) {
                this.hasFormErrors = false;
              }
            
              
             
            handleSelectedRowsChangedblO11(e, args) {
              const controls = this.asFormO11.controls;
              if (Array.isArray(args.rows) && this.gridObjblO11) {
                args.rows.map((idx) => {
                  const item = this.gridObjblO11.getDataItem(idx);
                  console.log(item.as_applied, item.as_amt)
                  
                  this.blO11 = item;
                  controls.as_ship.setValue(item.as_nbr || "");
                  controls.as_cust.setValue(item.as_cust || "");
                  controls.as_app_owner.setValue(item.as_app_owner || "");
                  controls.as_curr.setValue(item.as_curr || "");
                  controls.amt.setValue(item.as_amt || "");
                  controls.rest.setValue(Number(item.as_amt) - Number(item.as_applied) || 0);
                  // controls.as_pay_method.setValue(item.cm_cr_terms || "");
                 
                  this.customerService.getBy({cm_addr: item.as_cust}).subscribe((response: any)=>{
                                
                                
                  
                    controls.name.setValue(response.data.address.ad_name || "");
                    // controls.as_bank.setValue(response.data.cm_bank || "");
                    // controls.as_pay_method.setValue(response.data.cm_pay_method|| "");
                  
                  })
                  
                 
                 
              })
            }
            }
            
            angularGridReadyblO11(angularGrid: AngularGridInstance) {
              this.angularGridblO11 = angularGrid;
              this.gridObjblO11 = (angularGrid && angularGrid.slickGrid) || {};
            }
            
            prepareGridblO11() {
              this.columnDefinitionsblO11 = [
                {
                  id: "id",
                  name: "id",
                  field: "id",
                  sortable: true,
                  minWidth: 80,
                  maxWidth: 80,
                },
                {
                  id: "as_nbr",
                  name: "BL",
                  field: "as_nbr",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
                },
                {
                  id: "as_app_owner",
                  name: "Client",
                  field: "as_app_owner",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
                },
                {
                  id: "as_effdate",
                  name: "Date",
                  field: "as_effdate",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
                },
                {
                  id: "as_amt",
                  name: "Montant",
                  field: "as_amt",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
                },
              ];
            
              this.gridOptionsblO11 = {
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
              if (this.user.usrd_site != '*')
              {this.accountShiperService
                .getBy({as_entity:this.user.usrd_site,as_type: "I", as_open: true})
                .subscribe((response: any) => (this.blsO11 = response.data));}
                else{this.accountShiperService
                  .getBy({as_type: "I", as_open: true})
                  .subscribe((response: any) => (this.blsO11 = response.data));}
            }
            openblO11(content) {
              this.prepareGridblO11();
              this.modalService.open(content, { size: "lg" });
            }
            
            handleSelectedRowsChangedbankO11(e, args) {
              const controls = this.asFormO11.controls;
              if (Array.isArray(args.rows) && this.gridObjbankO11) {
                args.rows.map((idx) => {
                  const item = this.gridObjbankO11.getDataItem(idx);
                  controls.as_bank.setValue(item.bk_code || "");
                  
            
                
                });
              }
            }
            
            angularGridReadybankO11(angularGrid: AngularGridInstance) {
              this.angularGridbankO11 = angularGrid;
              this.gridObjbankO11 = (angularGrid && angularGrid.slickGrid) || {};
            }
            
            prepareGridbankO11() {
              this.columnDefinitionsbankO11 = [
                {
                  id: "id",
                  name: "id",
                  field: "id",
                  sortable: true,
                  minWidth: 80,
                  maxWidth: 80,
                },
                {
                  id: "bk_code",
                  name: "code",
                  field: "bk_code",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
                },
                {
                  id: "address.ad_name",
                  name: "Designation",
                  field: "address.ad_name",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
                },
                {
                  id: "bk_curr",
                  name: "Devise",
                  field: "bk_curr",
                  sortable: true,
                  filterable: true,
                  type: FieldType.string,
                },
                {
                  id: "bk_entity",
                  name: "Entité",
                  field: "bk_entity",
                  sortable: true,
                  filterable: true,
                  type: FieldType.boolean,
                },
              ];
            
              this.gridOptionsbankO11 = {
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
              this.bankService
                .getByAll({bk_userid: this.user.usrd_code})
                .subscribe((response: any) => {this.banksO11 = response.data
                console.log(this.banksO11)});
            }
            openbankO11(content) {
              this.prepareGridbankO11();
              this.modalService.open(content, { size: "lg" });
            }
            
            // ONGLET 11
            gridReadyO12(angularGrid: AngularGridInstance) {
                this.angularGridO12 = angularGrid;
                this.dataViewO12 = angularGrid.dataView;
                this.gridO12 = angularGrid.slickGrid;
            
                // if you want to change background color of Duration over 50 right after page load,
                // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
                this.dataViewO12.getItemMetadata = this.updateItemMetadataO12(this.dataViewO12.getItemMetadata);
                this.gridO12.invalidate();
                this.gridO12.render();
                 
              }
              updateItemMetadataO12(previousItemMetadata: any) {
                const newCssClass = "highlight-bg";
                // console.log(this.dataView);
                return (rowNumber: number) => {
                  const item = this.dataViewO12.getItem(rowNumber);
                  let meta = {
                    cssClasses: "",
                  };
                  if (typeof previousItemMetadata === "object") {
                    meta = previousItemMetadata(rowNumber);
                  }
            
                 
                  if (meta && item && item.rqd_insp_rqd) {
            
                    const state = item.rqd_insp_rqd;
                   
                    if (state === true) {
                     
                      meta.cssClasses = (meta.cssClasses || "") + " " + newCssClass;
                    }
                  }
            
                  return meta;
                };
              }
              handleSelectedRowsChangedSO12(e, args) {
                if (Array.isArray(args.rows) && this.gridO12) {
                  args.rows.map((idx) => {
                    const item = this.gridO12.getDataItem(idx);
                    // this.itinerary = this.services[idx].role_itineraries
                  
                    // console.log(this.itinerary);
                  });
                }
               
              }
              initGridO12() {
                  this.columnDefinitionsO12 = [
                      {
                          id: "id",
                          field: "id",
                          excludeFromHeaderMenu: true,
                          formatter: Formatters.deleteIcon,
                          minWidth: 30,
                          maxWidth: 30,
                          onCellClick: (e: Event, args: OnEventArgs) => {
                              if (confirm('Êtes-vous sûr de supprimer cette ligne?')) {
                                  this.angularGrid.gridService.deleteItem(args.dataContext);
                                }
                            }
                      },
                      
                      {
                          id: "rqd_line",
                          name: "Ligne",
                          field: "rqd_line",
                          minWidth: 50,
                          maxWidth: 50,
                          selectable: true,
                      },
                      {
                          id: "rqd_part",
                          name: "Article",
                          field: "rqd_part",
                          sortable: true,
                          width: 50,
                          filterable: false,
                        
                      },
                     
                      {
                          id: "rqd_desc",
                          name: "Description",
                          field: "rqd_desc",
                          sortable: true,
                          width: 80,
                          filterable: false,
                          
                      },
                      {
                          id: "rqd_rqby_userid",
                          name: "Employe",
                          field: "rqd_rqby_userid",
                          sortable: true,
                          width: 80,
                          filterable: false,
                          type: FieldType.string,
                         
                      },
                      {
                        id: "chr01",
                        name: "Nom ",
                        field: "chr01",
                        sortable: true,
                        width: 80,
                        filterable: false,
                        type: FieldType.string,
                       
                    },
                    //   {
                    //     id: "rqd_need_date",
                    //     name: "Date Début",
                    //     field: "rqd_need_date",
                    //     sortable: true,
                    //     width: 80,
                    //     filterable: false,
                    //     type: FieldType.dateIso,
                    //     formatter: Formatters.dateIso,
                    //     editor: {
                    //         model: Editors.date,
                           
                    //     },
                    // },
                    // {
                    //   id: "rqd_expire",
                    //   name: "Date Fin",
                    //   field: "rqd_expire",
                    //   sortable: true,
                    //   width: 80,
                    //   filterable: false,
                    //   type: FieldType.dateIso,
                    //   formatter: Formatters.dateIso,
                    //   editor: {
                    //       model: Editors.date,
                         
                    //   },
                    // },
                    {
                    id: "chr02",
                    name: "Pour le",
                    field: "chr02",
                    type: FieldType.string,
                    
                    filterable:true,
                    sortable: true,
                   
                  },   
                    {
                      id: "rqd_insp_rqd",
                      name: "Déja Faite",
                      field: "rqd_insp_rqd",
                      type: FieldType.boolean,
                      formatter: Formatters.checkmark,
                      filterable:true,
                      sortable: true,
                     
                    },      
            
                      
                  ]
            
                  this.gridOptionsO12 = {
                      asyncEditorLoading: false,
                      editable: true,
                      enableColumnPicker: true,
                      enableCellNavigation: true,
                      enableRowSelection: true,
                  }
            
                  this.datasetO12 = []
              }
              ngOnInitO12(): void {
                  this.loading$ = this.loadingSubject.asObservable()
                  this.loadingSubject.next(false)
                  this.user =  JSON.parse(localStorage.getItem('user'))
                  this.createFormO12()
                  
              }
            
              //create form
              createFormO12() {
                  this.loadingSubject.next(false)
                  this.requisitionO12 = new Requisition()
                  const date = new Date;
                  this.reqFormO12 = this.reqFB.group({
                    // rqm_category: [this.requisitionO12.rqm_category , Validators.required],
                    // rqm_nbr: [this.requisitionO12.rqm_nbr ],
                    // rqm_vend: [this.requisitionO12.rqm_vend ],
                    
                    rqm_req_date:[{
                      year:date.getFullYear(),
                      month: date.getMonth()+1,
                      day: date.getDate()
                    }],
                    year: [null ,  Validators.required],
                    
                    rqm_need_date:[{
                      year:date.getFullYear(),
                      month: date.getMonth()+1,
                      day: date.getDate()
                    }],
                    rqm_due_date:[{
                      year:date.getFullYear(),
                      month: date.getMonth()+1,
                      day: date.getDate()
                    }],
                    pt_dsgn_grp:[''],
                    pt_draw: [''],
                    rqm_rqby_userid: [this.requisitionO12.rqm_rqby_userid],
                    rqm_end_userid: [this.requisitionO12.rqm_end_userid],
                    part: [null],
                    desc:[{value:"", disabled: true}],
                    rqm_rmks: [this.requisitionO12.rqm_rmks ],
                  })
                  const controls = this.reqFormO12.controls
                  
                  this.employeService
                  .getByOne({emp_userid: this.user.usrd_code})
                  .subscribe((response: any) => {
                      //console.log(response)
                      if (response.data != null) {
                       this.employe = (response.data.emp_addr)
                      controls.rqm_rqby_userid.setValue(this.user.usrd_code)
                   
                      } else {
                        alert("Vous n'etes pas affecter à un employé")
                      }
                  })
                  this.sequencesService
                  .getByOne({ seq_type: 'RQ', seq_profile: this.user.usrd_profile})
                  .subscribe((response: any) => {
                     // console.log(response)
                      if (response.data == null) {
                          alert("Sequence nexiste pas")
                          
                      } else {
                        this.seqO12 = response.data.seq_seq
                      //  alert(this.seq)
                      }
                  })
              }
            
            
              onChangeSeqO12() {
                  const controls = this.reqFormO12.controls
                  this.sequencesService
                      .getBy({seq_seq: controls.rqm_category.value, seq_type: 'RQ', seq_profile: this.user.usrd_profile})
                      .subscribe((response: any) => {
                         // console.log(response)
                          if (response.data.length == 0) {
                              alert("Sequence nexiste pas")
                              controls.rqm_category.setValue("")
                             // console.log(response.data.length)
                              document.getElementById("SEQUENCE").focus();
                          } 
                      })
              }
              onchangePartO12() {
                const controls = this.reqFormO12.controls;
                if(controls.part.value == "AUTRE"){controls.desc.enable()} else{controls.desc.disable()}
                this.itemsService
                  .getByOne({
                    pt_part: controls.part.value,
                  })
                  .subscribe((response: any) => {
                  //  console.log(response.data, response.data.length);
                    if (response.data!= null) {
                      
                      controls.part.setValue(response.data.pt_part);
                      controls.desc.setValue(response.data.pt_desc1);
                      
                      this.unO12 = response.data.pt_um
                    
                    } 
                  });
              }
              //reste form
              resetO12() {
                  this.requisitionO12 = new Requisition()
                  this.createFormO12()
                  this.hasFormErrors = false
              }
              
              // save data
              onSubmitO12() {
                  this.hasFormErrors = false
                  const controls = this.reqFormO12.controls
                  /** check form */
                  if (this.reqFormO12.invalid) {
                      Object.keys(controls).forEach((controlName) =>
                          controls[controlName].markAsTouched()
                      )
                      this.message = 'Modifiez quelques éléments et réessayez de soumettre.'
                      this.hasFormErrors = true
            
                      return
                  }
            
                  if (!this.datasetO12.length){
                      this.message = 'La liste des article ne peut pas etre vide'
                      this.hasFormErrors = true
            
                      return
                  }
                  // tslint:disable-next-line:prefer-const
                  let req = this.prepareReq()
                  for(let data of this.dataset){
                    delete data.id
                    delete data.cmvid
                  
                  }
                  this.addReq(req, this.dataset)
              }
              
              /**
               *
               * Returns object for saving
               */
              prepareReq(): any {
                  const controls = this.reqFormO12.controls
                  const _req = new Requisition()
                  _req.rqm_category =  this.seqO12
                 //   _req.rqm_nbr=  controls.rqm_nbr.value
                   
                    _req.rqm_type =  "P"
                    _req.rqm_req_date=  controls.rqm_req_date.value ? `${controls.rqm_req_date.value.year}/${controls.rqm_req_date.value.month}/${controls.rqm_req_date.value.day}`: null
                    // _req.rqm_need_date=  controls.rqm_need_date.value ? `${controls.rqm_need_date.value.year}/${controls.rqm_need_date.value.month}/${controls.rqm_need_date.value.day}`: null
                    // _req.rqm_due_date=  controls.rqm_due_date.value ? `${controls.rqm_due_date.value.year}/${controls.rqm_due_date.value.month}/${controls.rqm_due_date.value.day}`: null
                    _req.rqm_rqby_userid=  controls.rqm_rqby_userid.value
                    _req.rqm_end_userid=  controls.rqm_end_userid.value
                    // _req.rqm_reason=  controls.rqm_reason.value
                    // _req.rqm_status=  controls.rqm_status.value
                    _req.rqm_rmks=  controls.rqm_rmks.value
                    _req.rqm_open= true
                    _req.rqm_aprv_stat = 0
                    _req.chr01 = controls.year.value
                    _req.chr02 =controls.pt_dsgn_grp.value
                    _req.chr03 = controls.pt_draw.value
                  return _req
              }
              /**
               * Add req
               *
               * @param _req: req
               */
              addReq(_req: any, detail:any) {
                  this.loadingSubject.next(true)
                  this.requisitonService.add({ requisition: _req, requisitionDetail: detail }).subscribe(
                      (reponse) => console.log("response", Response),
                      (error) => {
                          this.layoutUtilsService.showActionNotification(
                              "Erreur verifier les informations",
                              MessageType.Create,
                              10000,
                              true,
                              true
                          )
                          this.loadingSubject.next(false)
                      },
                      () => {
                          this.layoutUtilsService.showActionNotification(
                              "Ajout avec succès",
                              MessageType.Create,
                              10000,
                              true,
                              true
                          )
                          this.loadingSubject.next(false)
                          // this.router.navigateByUrl("/training/approval-req")
                      }
                  )
              }
            
              /**
               * Go back to the list
               *
               */
              goBackO12() {
                  this.loadingSubject.next(false)
                  const url = `/training/approval-req`
                  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
              }
            
              // add new Item to Datatable
              addNewItemO12() {
                  this.angularGridO12.gridService.addItem({
                      id:  1,
                      rqd_line: this.datasetO12.length + 1,
                      rqd_part: "",
                      cmvid: "",
                    //  rqd_rqby_userid:req,
                      rqd_req_qty: 0,
                      rqd_um: "",
                      rqd_cc: "",
                      rqd_desc: "",
                  },{position:"bottom"})
              }
            
              handleSelectedRowsChangedO12(e, args) {
                  const controls = this.reqFormO12.controls
                  if (Array.isArray(args.rows) && this.gridObj1O12) {
                      args.rows.map((idx) => {
                          const item = this.gridObj1O12.getDataItem(idx)
                          controls.rqm_category.setValue(item.seq_seq || "")
                      })
                  }
              }
            
              angularGridReadyO12(angularGrid: AngularGridInstance) {
                  this.angularGrid1O12 = angularGrid
                  this.gridObj1O12 = (angularGrid && angularGrid.slickGrid) || {}
              }
            
              prepareGrid1O12() {
                  this.columnDefinitions1O12 = [
                      {
                          id: "id",
                          name: "id",
                          field: "id",
                          sortable: true,
                          minWidth: 80,
                          maxWidth: 80,
                      },
                      {
                          id: "seq_seq",
                          name: "code sequence",
                          field: "seq_seq",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      {
                          id: "seq_desc",
                          name: "description",
                          field: "seq_desc",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      {
                          id: "seq_appr1",
                          name: "approbateur 1",
                          field: "seq_appr1",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      {
                          id: "seq_appr2",
                          name: "approbateur 2",
                          field: "seq_appr2",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      {
                          id: "seq_appr3",
                          name: "approbateur 3",
                          field: "seq_appr3",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                  ]
            
                  this.gridOptions1O12 = {
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
                  }
            
                  // fill the dataset with your data
                 
                  this.sequencesService
                      .getBy({seq_type: 'RQ', seq_profile: this.user.usrd_profile})
                      .subscribe((response: any) => (this.sequencesO12 = response.data))
                     
              }
              openO12(content) {
                  this.prepareGrid1O12()
                  this.modalService.open(content, { size: "lg" })
              }
              handleSelectedRowsChanged2O12(e, args) {
                  const controls = this.reqFormO12.controls
                  if (Array.isArray(args.rows) && this.gridObj2O12) {
                      args.rows.map((idx) => {
                          const item = this.gridObj2O12.getDataItem(idx)
                          controls.rqm_vend.setValue(item.vd_addr || "")
                      })
                  }
              }
            
              angularGridReady2O12(angularGrid: AngularGridInstance) {
                  this.angularGrid2O12 = angularGrid
                  this.gridObj2O12 = (angularGrid && angularGrid.slickGrid) || {}
              }
            
              prepareGrid2O12() {
                  this.columnDefinitions2O12 = [
                      {
                          id: "id",
                          name: "id",
                          field: "id",
                          sortable: true,
                          minWidth: 80,
                          maxWidth: 80,
                      },
                      {
                          id: "vd_addr",
                          name: "code",
                          field: "vd_addr",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      {
                          id: "ad_name",
                          name: "Fournisseur",
                          field: 'address.ad_name',
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      {
                          id: "ad_phone",
                          name: "Numero telephone",
                          field: 'address.ad_phone',
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      
                  ]
            
                  this.gridOptions2O12 = {
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
                        }
                  }
            
                  // fill the dataset with your data
                  this.providersService
                      .getAll()
                      .subscribe((response: any) => (this.providersO12 = response.data))
              }
              open2O12(content) {
                  this.prepareGrid2O12()
                  this.modalService.open(content, { size: "lg" })
              }
            
              // handleSelectedRowsChanged3(e, args) {
              //     const controls = this.reqFormO12.controls
              //     if (Array.isArray(args.rows) && this.gridObj3) {
              //         args.rows.map((idx) => {
              //             const item = this.gridObj3.getDataItem(idx)
              //        this.list.push(item.emp_addr)//     console.log(item)
              //             controls.rqm_rqby_userid.setValue(item.usrd_code || "")
              //         })
              //     }
              // }
              handleSelectedRowsChanged3O12(e, args) {
                const controls = this.reqFormO12.controls
                if (Array.isArray(args.rows) && this.gridObj3O12) {
                  this.selectedJobO12 = args.rows.map((idx: number) => {
                    const item = this.gridObj3O12.getDataItem(idx);
                    return item.emp_addr;
                  });
                }
               // console.log(this.selectedJob)
               let enduser = ""
               for (let d of this.selectedJobO12) {
                enduser =enduser + d + ","  
               }
                controls.rqm_end_userid.setValue(enduser)
              }
              angularGridReady3O12(angularGrid: AngularGridInstance) {
                  this.angularGrid3O12 = angularGrid
                  this.gridObj3O12 = (angularGrid && angularGrid.slickGrid) || {}
              }
            
              prepareGrid3O12() {
                  this.columnDefinitions3O12 = [
                      {
                          id: "id",
                          name: "id",
                          field: "id",
                          sortable: true,
                          minWidth: 80,
                          maxWidth: 80,
                      },
                      {
                          id: "emp_addr",
                          name: "code Employe",
                          field: "emp_addr",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                      {
                          id: "emp_fname",
                          name: "nom",
                          field: "emp_fname",
                          sortable: true,
                          filterable: true,
                          type: FieldType.string,
                      },
                  ]
            
                  this.gridOptions3O12 = {
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
                      multiSelect: true,
                      rowSelectionOptions: {
                          // True (Single Selection), False (Multiple Selections)
                          selectActiveRow: false,
                      },
                  }
            
                  // fill the dataset with your data
               //   console.log(this.user)
                  this.employeService
                  .getByOne({emp_userid: this.user.usrd_code})
                  .subscribe((respo: any) => {
                     // console.log(respo)
                      if (respo.data != null) {
                       this.employe = (respo.data.emp_addr)
                       this.employeService
                       .getChild({emp_addr: this.employe})
                       .subscribe((response: any) => (this.usersO12 = response.data))
                   
                      } else {
                        alert("Vous n'etes pas affecter à un employé")
                      }
                  })
                
              }
              open3O12(content) {
                  this.prepareGrid3O12()
                  this.modalService.open(content, { size: "lg" })
              }
              getTrainingO12(){
                const controls = this.reqFormO12.controls
                this.datasetO12= []
              this.dataO12=[]
                    //console.log(this.datasetO12.length)
                    this.employeService
                    .getBy({emp_addr:this.selectedJobO12})
                    .subscribe((response: any) => {this.datasetempsO12 = response.data
                   // console.log(this.datasetemps)
                  
                     let  id = 0
                      for (let dat of this.datasetempsO12){
                        let bool = false
                        this.employeService
                        .getTrBy({empf_code:dat.emp_addr,empf_part: controls.part.value})
                        .subscribe((respo: any) => {
                          if (respo.data!= null) {
                            bool = true
                          }
                        //  console.log(dat)
                   //      this.datasetO12.push({
                    this.angularGridO12.gridService.addItem({
                            id:  id + 1,
                            rqd_line: id + 1,
                            rqd_part: controls.part.value,
                            rqd_desc: controls.desc.value,
                            rqd_um: this.unO12,
                            rqd_rqby_userid: dat.emp_addr,
                            // rqd_need_date: `${controls.rqm_need_date.value.year}-${controls.rqm_need_date.value.month}-${controls.rqm_need_date.value.day}`,
                            // rqd_expire: `${controls.rqm_due_date.value.year}-${controls.rqm_due_date.value.month}-${controls.rqm_due_date.value.day}`,
                            chr01: dat.emp_fname + ' ' + dat.emp_lname,
                            chr02:controls.year.value,
                            rqd_req_qty: 1,
                            rqd_insp_rqd: bool,
                            rqd_status: bool ? "X" : null,
                            rqd_aprv_stat: 0,
                          },
                          { position: "bottom" });
                          id++
                        })
                      }
            
                    });
               console.log(this.datasetO12)
               this.dataViewO12.setItems(this.datasetO12)
             
              // this.updateItemMetadata(this.dataView.getItemMetadata);
               this.gridO12.invalidate();
               this.gridO12.render();
               this.modalService.dismissAll()
              }
            
             
              handleSelectedRowsChanged6O12(e, args) {
                  const controls = this.reqFormO12.controls
                  if (Array.isArray(args.rows) && this.gridObj6O12) {
                      args.rows.map((idx) => {
                          const cause = this.gridObj6O12.getDataItem(idx)
                          //console.log(cause)
                          controls.rqm_reason.setValue(cause.rsn_ref || "")
            
                      })
                  }
              }
              angularGridReady6O12(angularGrid: AngularGridInstance) {
                  this.angularGrid6O12 = angularGrid
                  this.gridObj6O12 = (angularGrid && angularGrid.slickGrid) || {}
              }
              prepareGrid6O12() {
                  const controls = this.reqFormO12.controls
                  this.columnDefinitions6O12 = [
                      {
                          id: "id",
                          name: "id",
                          field: "id",
                          sortable: true,
                          minWidth: 80,
                          maxWidth: 80,
                      },
                     
                     
                      {
                        id: "rsn_ref",
                        name: "Code",
                        field: "rsn_ref",
                        sortable: true,
                        filterable: true,
                        type: FieldType.string,
                    },
                    
                      {
                          id: "rsn_desc",
                          name: "Designation",
                          field: "rsn_desc",
                          sortable: true,
                          width: 200,
                          filterable: true,
                          type: FieldType.string,
                      },
                  ]
            
                  this.gridOptions6O12 = {
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
                  }
            
                  // fill the dataset with your data
                  
                  this.reasonService
                      .getBy ({rsn_type: 'REQUISITION' })
                      .subscribe((response: any) => (this.causesO12 = response.data))
                   
              }
              open6O12(content) {
                  this.prepareGrid6O12()
                  this.modalService.open(content, { size: "lg" })
              }
              onAlertCloseO12($event) {
                  this.hasFormErrors = false
              }
              handleSelectedRowsChanged4O12(e, args) {
                const controls = this.reqFormO12.controls; 
                //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
                  if (Array.isArray(args.rows) && this.gridObj4O12) {
                  args.rows.map((idx) => {
                    const item = this.gridObj4O12.getDataItem(idx);
                 
                    controls.part.setValue(item.pt_part || ""); 
                    controls.desc.setValue(item.pt_desc1 || ""); 
                    if(item.pt_part == "AUTRE"){controls.desc.enable()} else{controls.desc.disable()}
                    this.unO12 = item.pt_um
                });
              }
            }
            
              angularGridReady4O12(angularGrid: AngularGridInstance) {
                this.angularGrid4O12 = angularGrid;
                this.gridObj4O12 = (angularGrid && angularGrid.slickGrid) || {};
              }
            
              prepareGrid4O12() {
                this.columnDefinitions4O12 = [
                {
                    id: "id",
                    name: "id",
                    field: "id",
                    excludeFromHeaderMenu: true,
                    minWidth: 40,
                    maxWidth: 60,
                    sortable:true,
                },
                {
                    id: "pt_part",
                    name: "Code Formation",
                    field: "pt_part",
                    sortable: true,
                    minWidth: 70,
                    maxWidth: 120,          
                    type: FieldType.string,
                    filterable:true,
                },
                {
                    id: "pt_desc1",
                    name: "Désignation",
                    field: "pt_desc1",
                    sortable: true,
                    minWidth: 100,
                    maxWidth: 350,
                    type: FieldType.string,
                    filterable:true,
                },      
                {
                  id: "pt_draw",
                  name: "Domaine",
                  field: "pt_draw",
                  type: FieldType.string,
                  sortable: true,
                  filterable:true,
                },     
                {
                  id: "pt_group",
                  name: "Rubrique",
                  field: "pt_group",
                  type: FieldType.string,
                  sortable: true,
                 
                },     
                {
                  id: "pt_formula",
                  name: "Ext / Int",
                  field: "pt_formula",
                  type: FieldType.boolean,
                  formatter: Formatters.checkmark,
                  filterable:true,
                  sortable: true,
                 
                },      
                {
                  id: "pt_ms",
                  name: "Certification",
                  field: "pt_ms",
                  type: FieldType.boolean,
                  formatter: Formatters.checkmark,
                  filterable:true,
                  sortable: true,
                 
                },      
                {
                  id: "pt_rollup",
                  name: "Fidélité",
                  field: "pt_rollup",
                  type: FieldType.boolean,
                  formatter: Formatters.checkmark,
                  filterable:true,
                  sortable: true,
                 
                },    
                {
                  id: "pt_origin",
                  field: "pt_origin",
                  type: FieldType.string,
                  filterable:true,
                  sortable: true,
                 
                },      
                {
                  id: "pt_meter_um",
                  field: "pt_meter_um",
                  type: FieldType.string,
                  filterable:true,
                  sortable: true,
                 
                },   
                ];
            
                this.gridOptions4O12 = {
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
                const controls = this.reqFormO12.controls
                this.itemsService
                  .getBy({pt_part_type : "FORMATION",pt_draw:controls.pt_draw.value})
                  .subscribe((response: any) => (this.itemsO12 = response.data));
              }
              openpartO12(content) {
                this.prepareGrid4O12();
                this.modalService.open(content, { size: "xl" });
              }
              onchangetypeO12() {
                
                
                
              
              }
              onchangedomainO12() {
                
               
              
               
            
              
              } 
              // ONGLET 12
}
