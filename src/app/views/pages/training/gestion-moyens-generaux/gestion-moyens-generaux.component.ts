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

import { FormBuilder, FormGroup, Validators, NgControlStatus } from "@angular/forms"
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
    Provider,
    ProviderService,
    AccountService,
    TaxeService,
    BankService,
    DeviseService,
    SequenceService,
} from "../../../../core/erp"

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





const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
// Angular
import {
 ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";

import {
  
  Item,
  ItemService,
  LocationService,
  SiteService,
  
  ProductLineService,
  
  MesureService,
  CostSimulation,
  CostSimulationService,
  InventoryStatusService,
 
} from "../../../../core/erp";
import { _isNumberValue } from '@angular/cdk/coercion';

// create my custom Formatter with the Formatter type
const myCustomCheckmarkFormatter: Formatter = (
  row,
  cell,
  value,
  columnDef,
  dataContext
) => {
  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
  return `
	<div class="form-group row">
        <div class="col-8">
            <span class="switch switch-icon">
                <label>
                    <input type="checkbox"
                        class="form-control form-control-sm form-control-solid"
                        name="select" />
                    <span></span>
                </label>
            </span>
        </div>
    </div>
	`;
};
  

import {
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  OperatorType,
  OperatorString,
  SearchTerm,
  EditorValidator,
  EditorArgs,
} from "angular-slickgrid"

import { LocationDetail, LocationDetailService,} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { L } from "@angular/cdk/keycodes"

const myCustomCheckboxFormatterO5: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

import {
  
  InventoryTransaction,
  InventoryTransactionService,
  
  RequisitionService,
  
  printBc,
  
  printTR,
} from "../../../../core/erp";
import { exit } from "process";

import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


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



import {
   
  
  FlatpickrOption,
  
  
  MultipleSelectOption,
  
  GridStateChange,
  Metrics,
} from "angular-slickgrid"





import { findLastKey } from "lodash"
const myCustomCheckboxFormatterO7: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const defaultPageSize = 100;
  const API_URL_codesO7 = environment.apiUrl + "/codes"
  
const myCustomTimeFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
value.substring(11,19)  ;
const myyearFormatter: Formatter = (row: number, cell: number, valueYEAR: any, columnDef: Column, dataContext: any, grid?: any) =>
valueYEAR.substring(0,4)  ;
const mymonthFormatter: Formatter = (row: number, cell: number, valueMONTH: any, columnDef: Column, dataContext: any, grid?: any) =>
valueMONTH.substring(5,7)  ;


import { saveAs } from "file-saver";
// Angular slickgrid
import {  AutoCompleteEditor } from "angular-slickgrid";




import {  VendorProposal,  printReceiveUNP, LabelService, Label, DomainService, PrintersService, EmployeService } from "../../../../core/erp";


import { MatAutocomplete } from "@angular/material/autocomplete";


declare var asset: any;

import { round } from 'lodash';
import {
 
  AccountUnplanifed,
  AccountUnplanifedService,
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";







import {
 
 
  FinancialchargeService,
  

 

} from "../../../../core/erp";


@Component({
  selector: 'kt-gestion-moyens-generaux',
  templateUrl: './gestion-moyens-generaux.component.html',
  styleUrls: ['./gestion-moyens-generaux.component.scss']
})




export class GestionMoyensGenerauxComponent implements OnInit {

// Private password
private componentSubscriptions: Subscription
// sticky portlet header margin
private headerMargin: number

// properties
address: Address
addressFormO1: FormGroup
formXO1: FormGroup
provider: Provider
providerFormO1: FormGroup
hasFormErrorsO1 = false
hasProviderFormErrorsO1 = false
selectedTabO1 = 0
loadingSubject = new BehaviorSubject<boolean>(true)
loading$: Observable<boolean>
addressId$: Observable<Number>

isExist = false

sequencesO1: []
columnDefinitions1O1: Column[] = []
gridOptions1O1: GridOption = {}
gridObj1O1: any
angularGrid1O1: AngularGridInstance

banksO1: [];
columnDefinitionsbankO1: Column[] = [];
gridOptionsbankO1: GridOption = {};
gridObjbankO1: any;
angularGridbankO1: AngularGridInstance;

dataO1: []
columnDefinitions3O1: Column[] = []
gridOptions3O1: GridOption = {}
gridObj3O1: any
angularGrid3O1: AngularGridInstance
selectedFieldO1 = ""

error = false

datataxO1: []
columnDefinitionstaxO1: Column[] = []
gridOptionstaxO1: GridOption = {}
gridObjtaxO1: any
angularGridtaxO1: AngularGridInstance

devisesO1: [];
columnDefinitions2O1: Column[] = [];
gridOptions2O1: GridOption = {};
gridObj2O1: any;
angularGrid2O1: AngularGridInstance;


datacodeO1: [];
columnDefinitions4O1: Column[] = [];
gridOptions4O1: GridOption = {};
gridObj4O1: any;
angularGrid4O1: AngularGridInstance;
fieldcodeO1 = "";
fldnameO1;
user: any
// selects
ad_cityO1: any[] = []
ad_stateO1: any[] = []
ad_countyO1: any[] = []
vd_typeO1: any[] = []
vd_shipviaO1: any[] = []
vd_promoO1: any[] = []
vd_langO1: any[] = []
ad_tax_zoneO1: any[] = []
ad_tax_usageO1: any[] = []
ad_countryO1: any[] = []
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
 * @param providerService: ProviderService
 * @param cdr: ChangeDetectorRef
 * 

 */

// FIN ONGLET 1
columnDefinitionsO2: Column[] = [];
  gridOptionsO2: GridOption = {};
  datasetO2: any[] = [];
  draggableGroupingPluginO2: any;
  angularGridO2: AngularGridInstance;
  gridO2: any
  gridServiceO2: GridService
  dataviewO2: any;
  // FIN ONGLET 2
  item: Item;
  hasFormErrors1O3 = false;
  hasFormErrors2O3 = false;
  hasFormErrors3O3 = false;
  hasFormErrors4O3 = false;
  hasFormErrors5O3 = false;
  hasFormErrors6O3 = false;

  formXO3: FormGroup;
  form1O3: FormGroup;
  form2O3: FormGroup;
  form3O3: FormGroup;
  form4O3: FormGroup;
  form5O3: FormGroup;
  form6O3: FormGroup;

  
  // slick grid
  columnDefinitionsO3: Column[] = [];
  gridOptionsO3: GridOption = {};
  datasetO3: any[] = [];

  sequencesO3: [];
  columnDefinitionsseqO3: Column[] = [];
  gridOptionsseqO3: GridOption = {};
  gridObjseqO3: any;
  angularGridseqO3: AngularGridInstance;

  columnDefinitions2O3: Column[] = [];
  gridOptions2O3: GridOption = {};
  dataset2O3: any[] = [];

  providersO3: [];
  columnDefinitionsprovO3: Column[] = [];
  gridOptionsprovO3: GridOption = {};
  gridObjprovO3: any;
  angularGridprovO3: AngularGridInstance;

  // selects
  pt_part_typeO3: any[] = [];
  pt_drawO3: any[] = [];
  pt_revO3: any[] = [];
  pt_groupO3: any[] = [];
  pt_drwg_locO3: any[] = [];
  pt_drwg_sizeO3: any[] = [];
  pt_abcO3: any[] = [];
  pt_loc_typeO3: any[] = [];
  pt_ship_wt_umO3: any[] = [];
  pt_net_wt_umO3: any[] = [];
  pt_fr_classO3: any[] = [];
  pt_size_umO3: any[] = [];

  pt_pm_codeO3: any[] = [];
  pt_run_seq1O3: any[] = [];
  pt_run_seq2O3: any[] = [];
  pt_promoO3: any[] = [];

  dataO3: [];
  columnDefinitions3O3: Column[] = [];
  gridOptions3O3: GridOption = {};
  gridObj3O3: any;
  angularGrid3O3: AngularGridInstance;
  selectedFieldO3 = "";
  fieldcodeO3 = "";

  datasiteO3: [];
  columnDefinitionssiteO3: Column[] = [];
  gridOptionssiteO3: GridOption = {};
  gridObjsiteO3: any;
  angularGridsiteO3: AngularGridInstance;

  datataxO3: []
  columnDefinitionstaxO3: Column[] = []
  gridOptionstaxO3: GridOption = {}
  gridObjtaxO3: any
  angularGridtaxO3: AngularGridInstance


  datalocO3: [];
  columnDefinitionslocO3: Column[] = [];
  gridOptionslocO3: GridOption = {};
  gridObjlocO3: any;
  angularGridlocO3: AngularGridInstance;

  datastatusO3: [];
  columnDefinitionsstatusO3: Column[] = [];
  gridOptionsstatusO3: GridOption = {};
  gridObjstatusO3: any;
  angularGridstatusO3: AngularGridInstance;

  dataplO3: [];
  columnDefinitionsplO3: Column[] = [];
  gridOptionsplO3: GridOption = {};
  gridObjplO3: any;
  gridServiceplO3: GridService;
  angularGridplO3: AngularGridInstance;
  row_number;
  
  msg: String;

  

  sct1O3: CostSimulation;
  sct2O3: CostSimulation;

  sctFormO3: FormGroup;
  sctForm1O3: FormGroup;  
// FIN ONGLET 3 
angularGridO4: AngularGridInstance;
gridO4: any;
gridServiceO4: GridService;
dataViewO4: any;
columnDefinitionsO4: Column[];
gridOptionsO4: GridOption;
datasetO4: any[];
draggableGroupingPluginO4: any;
selectedGroupingFieldsO4: Array<string | GroupingGetterFunction> = ['', '', ''];
gridObjO4: any;
dataviewObjO4: any;
// FIN ONGLET 4
columnDefinitionsO5: Column[] = []
  gridOptionsO5: GridOption = {}
  datasetO5: any[] = []
  draggableGroupingPluginO5: any;
  angularGridO5: AngularGridInstance;

  gridO5: any;
  gridServiceO5: GridService;
  dataviewO5: any;
 
  domain    : any;
  
  selectedGroupingFieldsO5: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObjO5: any;
  dataviewObjO5: any;
  // FIN ONGLET 5
  inventoryTransactionO6: InventoryTransaction;
    trFormO6: FormGroup;
    hasFormErrorsO6 = false;
    
    angularGridO6: AngularGridInstance;
    gridO6: any;
    gridServiceO6: GridService;
    dataViewO6: any;
    columnDefinitionsO6: Column[];
    gridOptionsO6: GridOption;
    datasetO6: any[];
 
    globalStateO6: boolean = false; 
    alertWarningO6: any;
   
    adressesO6: [];
    columnDefinitions2O6: Column[] = [];
    gridOptions2O6: GridOption = {};
    gridObj2O6: any;
    angularGrid2O6: AngularGridInstance;

    itemsO6: [];
    columnDefinitions4O6: Column[] = [];
    gridOptions4O6: GridOption = {};
    gridObj4O6: any;
    angularGrid4O6: AngularGridInstance;
  
    datasiteO6: [];
    columnDefinitionssiteO6: Column[] = [];
    gridOptionssiteO6: GridOption = {};
    gridObjsiteO6: any;
    angularGridsiteO6: AngularGridInstance;
  
    datalocO6: [];
    columnDefinitionslocO6: Column[] = [];
    gridOptionslocO6: GridOption = {};
    gridObjlocO6: any;
    angularGridlocO6: AngularGridInstance;
  
    datalocdetO6: [];
    columnDefinitionslocdetO6: Column[] = [];
    gridOptionslocdetO6: GridOption = {};
    gridObjlocdetO6: any;
    angularGridlocdetO6: AngularGridInstance;
    umsO6: [];
    columnDefinitionsumO6: Column[] = [];
    gridOptionsumO6: GridOption = {};
    gridObjumO6: any;
    angularGridumO6: AngularGridInstance;
  
    statussO6: [];
    columnDefinitionsstatusO6: Column[] = [];
    gridOptionsstatusO6: GridOption = {};
    gridObjstatusO6: any;
    angularGridstatusO6: AngularGridInstance;
  
    selectedFieldO6 = "";
    fieldcodeO6 = "";
    sitO6 : string ;
    statO6 : String;
    expireO6;
    
    message = "";
    siteO6: any;
    locationO6: any;
    sctO6: any;
    seqO6: any;
    trServerO6;
    trlotO6: string;
    datasetPrintO6 = [];
    lddetO6: any;
    rqmO6: boolean;
    statusrefO6: any;
    requisitionsO6: [];
    transactionsO6: [];
    columnDefinitions5O6: Column[] = [];
    gridOptions5O6: GridOption = {};
    gridObj5O6: any;
    angularGrid5O6: AngularGridInstance;
    requistionServerO6;
    
// FIN ONGLET 6

  columnDefinitionsO7: Column[] = []
  gridOptionsO7: GridOption = {}
  datasetO7: any[] = []
  draggableGroupingPluginO7: any;
  angularGridO7: AngularGridInstance;
  metrics!: Metrics;
  WithPaginationO7 = true;
  selectedGroupingFieldsO7: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridO7: any;
  gridServiceO7: GridService;
  dataviewO7: any;
  trLinesO7 : any [] = []
  tr_typeO7: any[] = [];
  trFormO7: FormGroup;
  elemO7: any[] = [];
  tabO7: any[] = [] ;
  datefilterO7: any;
  // FIN ONGLET 7
  seuilO8 : any;
  nomO8:any;
  currentPrinterO8: string;
  PathPrinterO8: string;
  employeGrpO8: string;
  inventoryTransactionO8: InventoryTransaction;
  trFormO8: FormGroup;
  nbrFormO8: FormGroup;
  printbuttonStateO8: boolean = false;
  hasFormErrorsO8 = false;
  
  angularGridO8: AngularGridInstance;
  gridO8: any;
  gridServiceO8: GridService;
  dataViewO8: any;
  columnDefinitionsO8: Column[];
  gridOptionsO8: GridOption;
  datasetO8: any[];
  providerO8: any;
  dataO8: any[];
  itemsO8: [];
  columnDefinitions4O8: Column[] = [];
  gridOptions4O8: GridOption = {};
  gridObj4O8: any;
  angularGrid4O8: AngularGridInstance;
  user1O8: any;
  datasiteO8: [];
  columnDefinitionssiteO8: Column[] = [];
  gridOptionssiteO8: GridOption = {};
  gridObjsiteO8: any;
  angularGridsiteO8: AngularGridInstance;

  empsO8: [];
  columnDefinitionsempO8: Column[] = [];
  gridOptionsempO8: GridOption = {};
  gridObjempO8: any;
  angularGridempO8: AngularGridInstance;
  dataViewempO8: any;
  gridServiceempO8: GridService;
  emps2O8: [];
  columnDefinitionsemp2O8: Column[] = [];
  gridOptionsemp2O8: GridOption = {};
  gridObjemp2O8: any;
  angularGridemp2O8: AngularGridInstance;
  dataViewemp2O8: any;
  gridServiceemp2O8: GridService;
  selectedIndexesO8: any[];
  selectedIndexes2O8: any[];
  selectedFieldO8 = "";
  indexO8: any;
  
  user2O8: any;
  adduserO8: boolean = true;

  datalocO8: [];
  columnDefinitionslocO8: Column[] = [];
  gridOptionslocO8: GridOption = {};
  gridObjlocO8: any;
  angularGridlocO8: AngularGridInstance;
  statussO8: [];
  columnDefinitionsstatusO8: Column[] = [];
  gridOptionsstatusO8: GridOption = {};
  gridObjstatusO8: any;
  angularGridstatusO8: AngularGridInstance;

  umsO8: [];
  columnDefinitionsumO8: Column[] = [];
  gridOptionsumO8: GridOption = {};
  gridObjumO8: any;
  angularGridumO8: AngularGridInstance;

  adressesO8: [];
  columnDefinitions2O8: Column[] = [];
  gridOptions2O8: GridOption = {};
  gridObj2O8: any;
  angularGrid2O8: AngularGridInstance;

  transactionsO8: [];
  columnDefinitions5O8: Column[] = [];
  gridOptions5O8: GridOption = {};
  gridObj5O8: any;
  angularGrid5O8: AngularGridInstance;
  sitO8 : string ;
 
  trlotO8: string;
  
  prhServerO8;
  qtyO8: any;
  locationO8: any;
  sctO8: any;
  datasetPrintO8 = [];
  statO8: String;
  
  seqO8: any;
  printableO8:boolean;
  dataprinterO8: [];
  domconfigO8: any;
  prodligneO8: any;
  dsgn_grpO8: any;
  columnDefinitionsprinterO8: Column[] = [];

  gridOptionsprinterO8: GridOption = {};
  gridObjprinterO8: any;

  angularGridprinterO8: AngularGridInstance;
  nligneO8: any;
  pdlO8: any;
  // FIN ONGLET 8
  accountUnplanifed: AccountUnplanifed;
  asForm: FormGroup;
  asFormO10: FormGroup;
  hasFormErrors = false;
  
  angularGrid: AngularGridInstance;
  
  
  bls: [];
    columnDefinitionsbl: Column[] = [];
    gridOptionsbl: GridOption = {};
    gridObjbl: any;
    angularGridbl: AngularGridInstance;
    
 
    banks: [];
    columnDefinitionsbank: Column[] = [];
    gridOptionsbank: GridOption = {};
    gridObjbank: any;
    angularGridbank: AngularGridInstance;
  
  
  
  
  details: any;
  datasetPrint = [];
  au_pay_method: any[] = [];
  bl: any;
  
  pshnbr: String;
  check;
  nbr;
  // FIN ONGLET 9
  accountPayable: AccountUnplanifed;
  
  
  
  
  vends: [];
    columnDefinitionsvend: Column[] = [];
    gridOptionsvend: GridOption = {};
    gridObjvend: any;
    angularGridvend: AngularGridInstance;  
    
 
    
  
  
  
  
  
  curr:any
  
  // grid options
  mvangularGrid: AngularGridInstance;
  mvgrid: any;
  mvgridService: GridService;
  mvdataView: any;
  mvcolumnDefinitions: Column[];
  mvgridOptions: GridOption;
  mvdataset: any[];

  datacharge: any [];
    columnDefinitionsc: Column[] = [];
    gridOptionsc: GridOption = {};
    gridObjc: any;
    angularGridc: AngularGridInstance;
    selectedc:  number[] = [];
constructor(
  
    private financialchargeService: FinancialchargeService,
   
  private asFB: FormBuilder,
 
    private accountUnplanifedService: AccountUnplanifedService,
    
  private nbrFB: FormBuilder,   private labelService: LabelService, private domainService: DomainService, private printerService: PrintersService, private employeService: EmployeService,
   
  private trFB: FormBuilder,
      private inventoryTransactionService: InventoryTransactionService,
     
      private itemsService: ItemService,
      
      private requisitionService: RequisitionService,
      
  private http: HttpClient,
  private httpUtils: HttpUtilsService,
  private locationDetailService: LocationDetailService,

    private sctService: CostSimulationService,
    private siteService: SiteService,
    private locationService: LocationService,
    private productLineService: ProductLineService,
    private itemService: ItemService,
    private mesureService: MesureService,
    private inventoryStatusService: InventoryStatusService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private addressService: AddressService,
    private providerService: ProviderService,
    private typesUtilsService: TypesUtilsService,
    private formBuilder: FormBuilder,
    private subheaderService: SubheaderService,
    private layoutConfigService: LayoutConfigService,
    private codeService: CodeService,
    private modalService: NgbModal,
    private accountService: AccountService,
    private taxService: TaxeService,
    private bankService: BankService,
    private cdr: ChangeDetectorRef,
    private deviseService: DeviseService,
    private sequenceService: SequenceService,
    config: NgbDropdownConfig
) {
  this.resetO10();
 
    this.createFormO10();
    this.initmvGrid();
  this.codeService
    .getBy({ code_fldname: "check_form" })
    .subscribe((response: any) => (this.au_pay_method = response.data));
   
  this.initGridO8();
  this.initGridO6();
  this.prepareGridO5()
  this.prepareGridO4();
  
    this.prepareGridO3();
    this.prepareGrid2O3();
    this.codeService
      .getBy({ code_fldname: "pt_part_type" })
      .subscribe((response: any) => (this.pt_part_typeO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (this.pt_drawO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_rev" })
      .subscribe((response: any) => (this.pt_revO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_group" })
      .subscribe((response: any) => (this.pt_groupO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_drwg_loc" })
      .subscribe((response: any) => (this.pt_drwg_locO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_drwg_size" })
      .subscribe((response: any) => (this.pt_drwg_sizeO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_abc" })
      .subscribe((response: any) => (this.pt_abcO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_loc_type" })
      .subscribe((response: any) => (this.pt_loc_typeO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_ship_wt_um" })
      .subscribe((response: any) => (this.pt_ship_wt_umO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_net_wt_um" })
      .subscribe((response: any) => (this.pt_net_wt_umO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_fr_class" })
      .subscribe((response: any) => (this.pt_fr_classO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_size_um" })
      .subscribe((response: any) => (this.pt_size_umO3 = response.data));

    this.codeService
      .getBy({ code_fldname: "pt_pm_code" })
      .subscribe((response: any) => (this.pt_pm_codeO3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_run_seq1" })
      .subscribe((response: any) => (this.pt_run_seq1O3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_run_seq2" })
      .subscribe((response: any) => (this.pt_run_seq2O3 = response.data));
    this.codeService
      .getBy({ code_fldname: "pt_promo" })
      .subscribe((response: any) => (this.pt_promoO3 = response.data));
    config.autoClose = true
    this.prepareGridO2()
    this.codeService
        .getBy({ code_fldname: "ad_state" })
        .subscribe((response: any) => (this.ad_stateO1 = response.data))
        this.codeService
        .getBy({ code_fldname: "ad_country" })
        .subscribe((response: any) => (this.ad_countryO1 = response.data))
    this.codeService
        .getBy({ code_fldname: "ad_county" })
        .subscribe((response: any) => (this.ad_countyO1 = response.data))
    this.codeService
        .getBy({ code_fldname: "vd_type" })
        .subscribe((response: any) => (this.vd_typeO1 = response.data))
    this.codeService
        .getBy({ code_fldname: "vd_shipvia" })
        .subscribe((response: any) => (this.vd_shipviaO1 = response.data))
    this.codeService
        .getBy({ code_fldname: "vd_promo" })
        .subscribe((response: any) => (this.vd_promoO1 = response.data))
    this.codeService
        .getBy({ code_fldname: "vd_lang" })
        .subscribe((response: any) => (this.vd_langO1 = response.data))
    
    this.codeService
        .getBy({ code_fldname: "ad_tax_zone" })
        .subscribe((response: any) => (this.ad_tax_zoneO1 = response.data))
    this.codeService
        .getBy({ code_fldname: "ad_tax_usage" })
        .subscribe((response: any) => (this.ad_tax_usageO1 = response.data))        
}

/**
 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
 */

/**
 * On init
 */
ngOnInit() {
  this.createFormO3()
  this.createFormXO1()
    this.createAddressFormO1()
    this.createProviderFormO1()
    const controlsa = this.addressFormO1.controls;

    this.deviseService.getBy({ cu_active:  true }).subscribe(
      (response: any) => {
    controls.vd_curr.setValue(response.data.cu_curr)
      })
      this.taxService.getBy({ tx2_default: true}).subscribe(
        (respo: any) => {
        // this.site = res.data.si_site
        
        controlsa.ad_taxc.setValue(respo.data.tx2_tax_code );
        controlsa.ad_taxable.setValue(true );
      //  controls.tr_ref_site.setValue(this.site );
    
      })
    
    
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
  const controlsX  = this.formXO1.controls
  const controls  = this.addressFormO1.controls
  const controls1 = this.providerFormO1.controls
  this.addressService
  .getAll()
  .subscribe((response: any) => {
      console.log(response.data)
      if (response.data.length != 0) {
          this.nbr = response.data.length + 1;
          console.log(this.nbr)
          controlsX.ad_addr.setValue('FR' + String('000'+ String(this.nbr)).slice(-3))
      
          
          controlsX.ad_name.enable()
          controls.ad_line1.enable()
         
          controls.ad_country.enable()
          controls.ad_state.enable()
          controls.ad_city.enable()
          controls.ad_zip.enable()
          
          
          
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
          controls1.vd_seq.enable()
          controls1.vd_sort.enable()
          controls1.vd_type.enable()
          controls1.vd_act_acct.enable()
          controls1.vd_act_sub.enable()
          controls1.vd_act_cc.enable()
          controls1.vd_ap_acct.enable()
          controls1.vd_ap_sub.enable()
          controls1.vd_ap_cc.enable()
          controls1.vd_shipvia.enable()
          controls1.vd_bank.enable()
          controls1.vd_ckfrm.enable()
          controls1.vd_curr.enable()
          controls1.vd_lang.enable()
          controls1.vd_pur_cntct.enable()
          controls1.vd_ap_cntct.enable()
          controls1.vd_misc_cr.enable()
          controls1.vd_carrier_id.enable()
          controls1.vd_promo.enable()
          controls1.vd_kanban_supplier.enable()
          controls1.vd_cr_terms.enable()
          controls1.vd_disc_pct.enable()
          controls1.vd_prepay.enable()
          controls1.vd_debtor.enable()
          controls1.vd_partial.enable()
          controls1.vd_hold.enable()
          controls1.vd_pay_spec.enable()
          controls1.vd_db.enable()
      }
      else{
        this.nbr =  1;
        console.log(this.nbr)
        controlsX.ad_addr.setValue('FR' + String('000'+ String(this.nbr)).slice(-3))
    
        
        controlsX.ad_name.enable()
        controls.ad_line1.enable()
       
        controls.ad_country.enable()
        controls.ad_state.enable()
        controls.ad_city.enable()
        controls.ad_zip.enable()
        
        
       
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
        controls1.vd_seq.enable()
        controls1.vd_sort.enable()
        controls1.vd_type.enable()
        controls1.vd_act_acct.enable()
        controls1.vd_act_sub.enable()
        controls1.vd_act_cc.enable()
        controls1.vd_ap_acct.enable()
        controls1.vd_ap_sub.enable()
        controls1.vd_ap_cc.enable()
        controls1.vd_shipvia.enable()
        controls1.vd_bank.enable()
        controls1.vd_ckfrm.enable()
        controls1.vd_curr.enable()
        controls1.vd_lang.enable()
        controls1.vd_pur_cntct.enable()
        controls1.vd_ap_cntct.enable()
        controls1.vd_misc_cr.enable()
        controls1.vd_carrier_id.enable()
        controls1.vd_promo.enable()
        controls1.vd_kanban_supplier.enable()
        controls1.vd_cr_terms.enable()
        controls1.vd_disc_pct.enable()
        controls1.vd_prepay.enable()
        controls1.vd_debtor.enable()
        controls1.vd_partial.enable()
        controls1.vd_hold.enable()
        controls1.vd_pay_spec.enable()
        controls1.vd_db.enable()
      }
      
})
  this.resetO9();
  
  this.createFormO9();
  this.createFormO10();
  this.loading$ = this.loadingSubject.asObservable();
        this.loadingSubject.next(false);
    
        this.user = JSON.parse(localStorage.getItem("user"));
        this.currentPrinterO8 = this.user.usrd_dft_printer;
        this.PathPrinterO8 = ''
        this.printerService.getByPrinter({ printer_code: this.currentPrinterO8 }).subscribe(
          (reponse: any) => ((this.PathPrinterO8 = reponse.data.printer_path)),
          (error) => {
            this.message = "veuillez verifier l'imprimante";
            this.hasFormErrorsO8 = true;
            return;
          }
        );
        this.employeService.getByOne({ emp_userid: this.user.usrd_code }).subscribe(
          (reponse: any) => ((this.employeGrpO8 = reponse.data.emp_shift), console.log(this.employeGrpO8)),
          (error) => {
            this.message = "veuillez verifier la connexion";
            this.hasFormErrorsO8 = true;
            return;
          }
        );
        this.domain = JSON.parse(localStorage.getItem("domain"));
        console.log(this.domain);
        this.domconfigO8 = false
        this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
          (reponse: any) => {
            if (reponse.data != null) {
              console.log("hahahahahahahaha", reponse.data);
              this.domconfigO8 = true;
              this.prodligneO8 = reponse.data.code_cmmt.split(",");
              this.dsgn_grpO8 = reponse.data.code_desc.split(",");
            } 
          },
    
          (error) => {
            
          }
        );
        this.seuilO8 = 1200;
        this.createFormO8();
        console.log(this.PathPrinterO8);
        
  this.createFormO7();
    this.prepareGridO7();
    this.trlistO7();
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    
    // sticky portlet header
    window.onload = () => {
        const style = getComputedStyle(document.getElementById("kt_header"))
        this.headerMargin = parseInt(style.height, 0)
    }
    
    this.createFormO3();
    this.createFormO6()
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
onchangenameO1(){
  document.getElementById("ad_line1").focus(); 
        
}
initO1() {
    this.createFormXO1()
    this.createAddressFormO1()
    this.createProviderFormO1()
    const controls = this.providerFormO1.controls;
    const controlsa = this.addressFormO1.controls;

    this.deviseService.getBy({ cu_active:  true }).subscribe(
      (response: any) => {
    controls.vd_curr.setValue(response.data.cu_curr)
      })
      this.taxService.getBy({ tx2_default: true}).subscribe(
        (respo: any) => {
        // this.site = res.data.si_site
        
        controlsa.ad_taxc.setValue(respo.data.tx2_tax_code );
        controlsa.ad_taxable.setValue(true );
      //  controls.tr_ref_site.setValue(this.site );
    
      })
    
    
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
createFormXO1(){
  this.address = new Address()
  this.formXO1 = this.formBuilder.group({
    ad_addr: [this.address.ad_addr, Validators.required],
    ad_name: [{ value: this.address.ad_name, disabled: !this.isExist },Validators.required],
    ad_temp: [{ value: this.address.ad_temp}],
  })
 
}
createAddressFormO1() {
  
    this.addressFormO1 = this.formBuilder.group({
      
        ad_line1:  [{ value: this.address.ad_line1, disabled: !this.isExist }],
        ad_city: [{ value: this.address.ad_city, disabled: !this.isExist }],
        ad_state: [{ value: this.address.ad_state, disabled: !this.isExist }],
        ad_zip: [{ value: this.address.ad_zip, disabled: !this.isExist }],
        ad_format: [{ value: this.address.ad_format, disabled: !this.isExist }],
        ad_county: [{ value: this.address.ad_county, disabled: !this.isExist }],
        ad_country: [{ value: this.address.ad_country, disabled: !this.isExist }],
        
        ad_phone: [{ value: this.address.ad_phone, disabled: !this.isExist }],
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
createProviderFormO1() {
    this.provider = new Provider()
    this.providerFormO1 = this.formBuilder.group({
        vd_sort: [{ value: this.provider.vd_sort, disabled: !this.isExist }],
        vd_type: [{ value: this.provider.vd_type, disabled: !this.isExist }],
        vd_seq: [{ value: this.provider.vd_seq, disabled: !this.isExist }],
        vd_act_acct: [{ value: this.provider.vd_act_acct, disabled: !this.isExist }],
        vd_act_sub: [{ value: this.provider.vd_act_sub, disabled: !this.isExist }],
        vd_act_cc: [{ value: this.provider.vd_act_cc, disabled: !this.isExist }],
        vd_ap_acct: [{ value: this.provider.vd_ap_acct, disabled: !this.isExist }],
        vd_ap_sub: [{ value: this.provider.vd_ap_sub, disabled: !this.isExist }],
        vd_ap_cc: [{ value: this.provider.vd_ap_cc, disabled: !this.isExist }],
        vd_shipvia: [{ value: this.provider.vd_shipvia, disabled: !this.isExist }],
        vd_bank: [{ value: this.provider.vd_bank, disabled: !this.isExist }],
        vd_ckfrm: [{ value: this.provider.vd_ckfrm, disabled: !this.isExist }],
        vd_curr: [{ value: this.provider.vd_curr, disabled: !this.isExist }],
        vd_lang: [{ value: this.provider.vd_lang, disabled: !this.isExist }],
        vd_pur_cntct: [{ value: this.provider.vd_pur_cntct, disabled: !this.isExist }],
        vd_ap_cntct: [{ value: this.provider.vd_ap_cntct, disabled: !this.isExist }],
        vd_misc_cr: [{ value: this.provider.vd_misc_cr, disabled: !this.isExist }],
        vd_carrier_id: [{ value: this.provider.vd_carrier_id, disabled: !this.isExist }],
        vd_promo: [{ value: this.provider.vd_promo, disabled: !this.isExist }],
        vd_kanban_supplier: [{ value: this.provider.vd_kanban_supplier, disabled: !this.isExist }],
        vd_cr_terms: [{ value: this.provider.vd_cr_terms, disabled: !this.isExist }],
        vd_disc_pct: [{ value: this.provider.vd_disc_pct, disabled: !this.isExist }],
        vd_prepay: [{ value: this.provider.vd_prepay, disabled: !this.isExist }],
        vd_debtor: [{ value: this.provider.vd_debtor, disabled: !this.isExist }],
        vd_partial: [{ value: this.provider.vd_partial, disabled: !this.isExist }],
        vd_hold: [{ value: this.provider.vd_hold, disabled: !this.isExist }],
        vd_pay_spec: [{ value: this.provider.vd_pay_spec, disabled: !this.isExist }],
        vd_db: [{ value: this.provider.vd_db, disabled: !this.isExist }],
    })
}


onChangeStateO1() {
    const controls  = this.addressFormO1.controls
   console.log(controls.ad_state.value)
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.ad_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.ad_cityO1 = response.data)
        console.log(response.data)})    
}

onChangeCodeO1() {
    const controlsX  = this.formXO1.controls
    const controls  = this.addressFormO1.controls
    const controls1 = this.providerFormO1.controls
    this.addressService
        .getBy({
              ad_addr: controlsX.ad_addr.value,
        })
        .subscribe((response: any) => {
            
            if (response.data.length !=0) {
                this.isExist = true
                console.log(response.data)
               
            } else {
                
                controlsX.ad_name.enable()
                controls.ad_line1.enable()
               
                controls.ad_country.enable()
                controls.ad_state.enable()
                controls.ad_city.enable()
                controls.ad_zip.enable()
                
                
                
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
                controls1.vd_seq.enable()
                controls1.vd_sort.enable()
                controls1.vd_type.enable()
                controls1.vd_act_acct.enable()
                controls1.vd_act_sub.enable()
                controls1.vd_act_cc.enable()
                controls1.vd_ap_acct.enable()
                controls1.vd_ap_sub.enable()
                controls1.vd_ap_cc.enable()
                controls1.vd_shipvia.enable()
                controls1.vd_bank.enable()
                controls1.vd_ckfrm.enable()
                controls1.vd_curr.enable()
                controls1.vd_lang.enable()
                controls1.vd_pur_cntct.enable()
                controls1.vd_ap_cntct.enable()
                controls1.vd_misc_cr.enable()
                controls1.vd_carrier_id.enable()
                controls1.vd_promo.enable()
                controls1.vd_kanban_supplier.enable()
                controls1.vd_cr_terms.enable()
                controls1.vd_disc_pct.enable()
                controls1.vd_prepay.enable()
                controls1.vd_debtor.enable()
                controls1.vd_partial.enable()
                controls1.vd_hold.enable()
                controls1.vd_pay_spec.enable()
                controls1.vd_db.enable()
                document.getElementById("ad_name").focus(); 
            }
           
     })
     
  }
/**
 * Go back to the list
 *
 * @param id: any
 */
goBackO1(id) {
    this.loadingSubject.next(false)
    const url = `/providers`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

goBackWithoutIdO1() {
    this.router.navigateByUrl("/providers", {
        relativeTo: this.activatedRoute,
    })
}

/**
 * Refresh product
 *
 * @param isNew: boolean
 * @param id: number
 */
refreshProductO1(isNew: boolean = false, id = 0) {
    this.loadingSubject.next(false)
    let url = this.router.url
    if (!isNew) {
        this.router.navigate([url], { relativeTo: this.activatedRoute })
        return
    }

    url = `/ecommerce/products/edit/${id}`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

/**
 * Reset
 */
resetO1() {
    this.address = new Address()
    this.provider = new Provider()
    this.createFormXO1()
    this.createAddressFormO1()
    this.createProviderFormO1()
    this.hasFormErrorsO1 = false
    this.hasProviderFormErrorsO1 = false
    const controlsX  = this.formXO1.controls
  const controls  = this.addressFormO1.controls
  const controls1 = this.providerFormO1.controls
  this.addressService
  .getAll()
  .subscribe((response: any) => {
      console.log(response.data)
      if (response.data.length != 0) {
          this.nbr = response.data.length + 1;
          console.log(this.nbr)
          controlsX.ad_addr.setValue('FR' + String('000'+ String(this.nbr)).slice(-3))
      
          
          controlsX.ad_name.enable()
          controls.ad_line1.enable()
         
          controls.ad_country.enable()
          controls.ad_state.enable()
          controls.ad_city.enable()
          controls.ad_zip.enable()
          
          
        
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
          controls1.vd_seq.enable()
          controls1.vd_sort.enable()
          controls1.vd_type.enable()
          controls1.vd_act_acct.enable()
          controls1.vd_act_sub.enable()
          controls1.vd_act_cc.enable()
          controls1.vd_ap_acct.enable()
          controls1.vd_ap_sub.enable()
          controls1.vd_ap_cc.enable()
          controls1.vd_shipvia.enable()
          controls1.vd_bank.enable()
          controls1.vd_ckfrm.enable()
          controls1.vd_curr.enable()
          controls1.vd_lang.enable()
          controls1.vd_pur_cntct.enable()
          controls1.vd_ap_cntct.enable()
          controls1.vd_misc_cr.enable()
          controls1.vd_carrier_id.enable()
          controls1.vd_promo.enable()
          controls1.vd_kanban_supplier.enable()
          controls1.vd_cr_terms.enable()
          controls1.vd_disc_pct.enable()
          controls1.vd_prepay.enable()
          controls1.vd_debtor.enable()
          controls1.vd_partial.enable()
          controls1.vd_hold.enable()
          controls1.vd_pay_spec.enable()
          controls1.vd_db.enable()
      }
      else{
        this.nbr =  1;
        console.log(this.nbr)
        controlsX.ad_addr.setValue('FR' + String('000'+ String(this.nbr)).slice(-3))
    
        
        controlsX.ad_name.enable()
        controls.ad_line1.enable()
       
        controls.ad_country.enable()
        controls.ad_state.enable()
        controls.ad_city.enable()
        controls.ad_zip.enable()
        
        
       
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
        controls1.vd_seq.enable()
        controls1.vd_sort.enable()
        controls1.vd_type.enable()
        controls1.vd_act_acct.enable()
        controls1.vd_act_sub.enable()
        controls1.vd_act_cc.enable()
        controls1.vd_ap_acct.enable()
        controls1.vd_ap_sub.enable()
        controls1.vd_ap_cc.enable()
        controls1.vd_shipvia.enable()
        controls1.vd_bank.enable()
        controls1.vd_ckfrm.enable()
        controls1.vd_curr.enable()
        controls1.vd_lang.enable()
        controls1.vd_pur_cntct.enable()
        controls1.vd_ap_cntct.enable()
        controls1.vd_misc_cr.enable()
        controls1.vd_carrier_id.enable()
        controls1.vd_promo.enable()
        controls1.vd_kanban_supplier.enable()
        controls1.vd_cr_terms.enable()
        controls1.vd_disc_pct.enable()
        controls1.vd_prepay.enable()
        controls1.vd_debtor.enable()
        controls1.vd_partial.enable()
        controls1.vd_hold.enable()
        controls1.vd_pay_spec.enable()
        controls1.vd_db.enable()
      }
    })
}

/**
 * Save data
 *
 * @param withBack: boolean
 */
onSubmitO1() {
    this.hasFormErrorsO1 = false
    const controls = this.addressFormO1.controls
    const controls_ = this.providerFormO1.controls
    const controlsX = this.formXO1.controls
    /** check form */
    if (this.formXO1.invalid) {
      Object.keys(controlsX).forEach((controlName) =>
          controlsX[controlName].markAsTouched()
      )

      this.hasFormErrorsO1 = true
      this.selectedTabO1 = 0
      return
  }
  
    if (this.addressFormO1.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrorsO1 = true
        this.selectedTabO1 = 0
        return
    }
    if (this.providerFormO1.invalid) {
        Object.keys(controls_).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasProviderFormErrorsO1 = true
        return
    }

    let address = this.prepareAddress()
    this.addAddress(address)
}

/**
 * Returns object for saving
 */
prepareAddress(): Address {
    const controls = this.addressFormO1.controls
    const controls1 = this.formXO1.controls

    const _address = new Address()
   
    _address.ad_addr = controls1.ad_addr.value
    _address.ad_name = controls1.ad_name.value
    _address.ad_line1 = controls.ad_line1.value
    _address.ad_city = controls.ad_city.value
    _address.ad_state = controls.ad_state.value
    _address.ad_zip = controls.ad_zip.value
    _address.ad_country = controls.ad_country.value
    _address.ad_temp = controls1.ad_temp.value
    _address.ad_phone = controls.ad_phone.value
    _address.ad_phone2 = controls.ad_phone2.value
    _address.ad_ext = controls.ad_ext.value
    _address.ad_ext2 = controls.ad_ext2.value
    _address.ad_type = "vendor"
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
            let provider = this.prepareProviderO1()
            this.addProvider(provider)
        }
    )
}

/**
 * Returns object for saving
 */
prepareProviderO1(): Provider {
    const controls = this.providerFormO1.controls
    const _provider = new Provider()
    _provider.vd_addr = this.address.ad_addr
    _provider.vd_seq = controls.vd_seq.value
    _provider.vd_sort = controls.vd_sort.value
    _provider.vd_type = controls.vd_type.value
    _provider.vd_act_acct = controls.vd_act_acct.value
    _provider.vd_act_sub = controls.vd_act_sub.value
    _provider.vd_act_cc = controls.vd_act_cc.value
    _provider.vd_ap_acct = controls.vd_ap_acct.value
    _provider.vd_ap_sub = controls.vd_ap_sub.value
    _provider.vd_ap_cc = controls.vd_ap_cc.value
    _provider.vd_shipvia = controls.vd_shipvia.value
    // _provider.vd_rmks = controls.vd_rmks.value
    _provider.vd_bank = controls.vd_bank.value
    _provider.vd_ckfrm = controls.vd_ckfrm.value
    _provider.vd_curr = controls.vd_curr.value
    _provider.vd_lang = controls.vd_lang.value
    _provider.vd_pur_cntct = controls.vd_pur_cntct.value
    _provider.vd_misc_cr = controls.vd_misc_cr.value
    _provider.vd_ap_cntct = controls.vd_ap_cntct.value
    _provider.vd_carrier_id = controls.vd_carrier_id.value
    _provider.vd_promo = controls.vd_promo.value
    _provider.vd_kanban_supplier = controls.vd_kanban_supplier.value
    _provider.vd_cr_terms = controls.vd_cr_terms.value
    _provider.vd_disc_pct = controls.vd_disc_pct.value
    _provider.vd_prepay = controls.vd_prepay.value
    _provider.vd_debtor = controls.vd_debtor.value
    _provider.vd_partial = controls.vd_partial.value
    _provider.vd_hold = controls.vd_hold.value
    _provider.vd_pay_spec = controls.vd_pay_spec.value
    _provider.vd_db = controls.vd_db.value
    return _provider
}

/**
 * Add product
 *
 * @param _product: ProductModel
 */
addProvider(_provider: Provider) {
    this.loadingSubject.next(true)
    this.providerService.add(_provider).subscribe(
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
            this.router.navigateByUrl("/providers")
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
getComponentTitleO1() {
    let result = "Ajouter Fournisseur"
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
onAlertCloseO1($event) {
    this.hasFormErrorsO1 = false
}


changeAcctO1 (fieldO1){

    const controls1 = this.providerFormO1.controls 
    let ac_code : any
    if (fieldO1=="vd_act_acct") {
       ac_code  = controls1.vd_act_acct.value
    
    }
    if (fieldO1=="vd_ap_acct") {
        ac_code  = controls1.vd_ap_acct.value
     
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



handleSelectedRowsChanged3O1(e, args) {
    const controls1 = this.providerFormO1.controls
    

    if (Array.isArray(args.rows) && this.gridObj3O1) {
        args.rows.map((idx) => {
            const item = this.gridObj3O1.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedFieldO1) {
              case "vd_act_acct": {
                  controls1.vd_act_acct.setValue(item.ac_code || "")
                  break
              }    
              case "vd_ap_acct": {
                  controls1.vd_ap_acct.setValue(item.ac_code || "")
                  break
              }
                default:
                    break
            }
        })
    }
}
  angularGridReady3O1(angularGrid: AngularGridInstance) {
    this.angularGrid3O1 = angularGrid
    this.gridObj3O1 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3O1() {
    this.columnDefinitions3O1 = [
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

    this.gridOptions3O1 = {
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
        .subscribe((response: any) => (this.dataO1 = response.data))
}
open3O1(contentO1, fieldO1) {
    this.selectedFieldO1 = fieldO1
    this.prepareGrid3O1()
    this.modalService.open(contentO1, { size: "lg" })
}

handleSelectedRowsChangedtaxO1(e, args) {
    const controls = this.addressFormO1.controls
    if (Array.isArray(args.rows) && this.gridObjtaxO1) {
        args.rows.map((idx) => {
            const item = this.gridObjtaxO1.getDataItem(idx)
            controls.ad_taxc.setValue(item.tx2_tax_code || "")
        })
    }
}

  angularGridReadytaxO1(angularGrid: AngularGridInstance) {
    this.angularGridtaxO1 = angularGrid
    this.gridObjtaxO1 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtaxO1() {
    this.columnDefinitionstaxO1 = [
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

    this.gridOptionstaxO1 = {
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
        .subscribe((response: any) => (this.datataxO1 = response.data))
}
opentaxO1(contenttaxO1) {
    this.prepareGridtaxO1()
    this.modalService.open(contenttaxO1, { size: "lg" })
}


handleSelectedRowsChanged4O1(e, args) {
    const controls1 = this.providerFormO1.controls;
    
    if (Array.isArray(args.rows) && this.gridObj4O1) {
      args.rows.map((idx) => {
        const item = this.gridObj4O1.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedFieldO1) {
          case "vd_cr_terms": {
            controls1.vd_cr_terms.setValue(item.code_value || "");
            break;
          }
          case "vd_ckfrm": {
            controls1.vd_ckfrm.setValue(item.code_value || "");
            break;
          }
         
          default:
            break;
        }
      });
    }
}
angularGridReady4O1(angularGrid: AngularGridInstance) {
    this.angularGrid4O1 = angularGrid;
    this.gridObj4O1 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid4O1() {
    this.columnDefinitions4O1 = [
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

    this.gridOptions4O1 = {
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

    if (this.selectedFieldO1 == "vd_ckfrm") {

        this.fldnameO1 = "check_form"
      }
      else {
        this.fldnameO1 = this.selectedFieldO1
      }
  
    // fill the dataset with your data
    this.codeService
      .getBy({ code_fldname: this.fldnameO1 })
      .subscribe((response: any) => (this.datacodeO1 = response.data));
  }

  open4O1(contentO1, fieldO1) {
    this.selectedFieldO1 = fieldO1;
    this.prepareGrid4O1();
    this.modalService.open(contentO1, { size: "lg" });
  }

  handleSelectedRowsChangedbankO1(e, args) {
    const controls = this.providerFormO1.controls;
    if (Array.isArray(args.rows) && this.gridObjbankO1) {
      args.rows.map((idx) => {
        const item = this.gridObjbankO1.getDataItem(idx);
        controls.vd_bank.setValue(item.bk_code || "");
            
      });
    }
  }
  
  angularGridReadybankO1(angularGrid: AngularGridInstance) {
    this.angularGridbankO1 = angularGrid;
    this.gridObjbankO1 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGridbankO1() {
    this.columnDefinitionsbankO1 = [
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
  
    this.gridOptionsbankO1 = {
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
      .getAll()
      .subscribe((response: any) => (this.banksO1 = response.data));
  }
  openbankO1(contentO1) {
    this.prepareGridbankO1();
    this.modalService.open(contentO1, { size: "lg" });
  }
  handleSelectedRowsChanged2O1(e, args) {
    const controls = this.providerFormO1.controls;
    if (Array.isArray(args.rows) && this.gridObj2O1) {
      args.rows.map((idx) => {
        const item = this.gridObj2O1.getDataItem(idx);
        controls.vd_curr.setValue(item.cu_curr || "");
      });
    }
  }

  angularGridReady2O1(angularGrid: AngularGridInstance) {
    this.angularGrid2O1 = angularGrid;
    this.gridObj2O1 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid2O1() {
    this.columnDefinitions2O1 = [
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

    this.gridOptions2O1 = {
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
      .subscribe((response: any) => (this.devisesO1 = response.data));
  }
  open2O1(contentO1) {
    this.prepareGrid2O1();
    this.modalService.open(contentO1, { size: "lg" });
  }
  onChangeSeqO1() {
    const controls = this.providerFormO1.controls
    console.log(this.user.usrd_profile)
    this.sequenceService
        .getBy({seq_seq: controls.vd_seq.value, seq_type: 'PO'})
        .subscribe((response: any) => {
            console.log(response)
            if (response.data.length == 0) {
                alert("Sequence nexiste pas")
                controls.vd_seq.setValue("")
                console.log(response.data.length)
                document.getElementById("SEQUENCE").focus();
            } 
        })
}
  handleSelectedRowsChangedO1(e, args) {
    const controls = this.providerFormO1.controls
    if (Array.isArray(args.rows) && this.gridObj1O1) {
        args.rows.map((idx) => {
            const item = this.gridObj1O1.getDataItem(idx)
            controls.vd_seq.setValue(item.seq_seq || "")
        })
    }
}

angularGridReadyO1(angularGrid: AngularGridInstance) {
    this.angularGrid1O1 = angularGrid
    this.gridObj1O1 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid1O1() {
    this.columnDefinitions1O1 = [
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

    this.gridOptions1O1 = {
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
        .getBy({seq_type: 'PO'})
        .subscribe((response: any) => (this.sequencesO1 = response.data))
       
}
open1O1(contentO1) {
    this.prepareGrid1O1()
    this.modalService.open(contentO1, { size: "lg" })
}
// FIN ONGLET 1
angularGridReadyO2(angularGrid: AngularGridInstance) {
  this.angularGridO2 = angularGrid
  this.dataviewO2 = angularGrid.dataView
  this.gridO2 = angularGrid.slickGrid
  this.gridServiceO2 = angularGrid.gridService
}

prepareGridO2() {

    this.columnDefinitionsO2 = [
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
        `
            },
            minWidth: 50,
            maxWidth: 50,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
                const id = args.dataContext.id
                this.router.navigateByUrl(`/providers/edit/${id}`)
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
          id: "vd_rmks",
          name: "Matricule Fiscal",
          field: "vd_rmks",
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
        {
          id: "vd_type",
          name: "Type",
          field: "vd_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        }, 
        {
          id: "vd_sequence",
          name: "Sequence",
          field: "vd_seq",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },

    ]

    this.gridOptionsO2 = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        autoEdit: false,
        autoHeight: false,
        enableAutoResize:true,
       

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

    }

    // fill the dataset with your data
    this.datasetO2 = []
    this.providerService.getAll().subscribe(
        (response: any) => {this.datasetO2 = response.data
          // this.dataviewO2.setItems(this.datasetO2);
        },
        (error) => {
            this.datasetO2 = []
        },
        () => {}
    )
}
// FIN ONGLET 2
prepareGridO3() {
    this.columnDefinitionsO3 = [
      {
        id: "elemet",
        name: "Element",
        field: "element",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "this_level",
        name: "Ce niveau",
        field: "thisLevel",
        sortable: true,
      },
      {
        id: "inf_level",
        name: "Niveau inf",
        field: "infLevel",
        sortable: true,
      },
      { id: "total", name: "Total", field: "Total" },
      {
        id: "pri",
        name: "Pri",
        field: "pri",
        formatter: myCustomCheckmarkFormatter,
      },
      { id: "cate", name: "Categorie", field: "category" },
      {
        id: "sur",
        name: "Sur",
        field: "sur",
        formatter: myCustomCheckmarkFormatter,
      },
    ];

    this.gridOptionsO3= {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.datasetO3 = [
      // {
      //     id: 1,
      //     element: "aa",
      //     thisLevel: "0.0",
      //     infLevel: "1",
      //     total: "1",
      //     pri: "",
      //     category: "",
      //     sur: "",
      // },
    ];
  }
  prepareGrid2O3() {
    this.columnDefinitions2O3 = [
      {
        id: "Matiere",
        name: "Matiere",
        field: "matiere",
        sortable: true,
        editor: {
          model: Editors.text,
          required: true,
        },
      },
      {
        id: "Main d'œuvre",
        name: "Main d'œuvre",
        field: "oeuvre",
        sortable: true,
      },
      {
        id: "FG variable",
        name: "FG variable",
        field: "fg_v",
        sortable: true,
      },
      { id: "FG Fixes", name: "FG Fixes", field: "fg_f" },
      {
        id: "SS-trail",
        name: "SS-trail",
        field: "SS-trail",
      },
    ];

    this.gridOptions2O3 = {
      enableSorting: true,
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: true,
    };

    // fill the dataset with your data
    this.dataset2O3 = [];
  }
  //create form
  createFormO3() {
    this.loadingSubject.next(false);
    this.item = new Item();
    this.formXO3 = this.formBuilder.group({
      pt_part: [this.item.pt_part,Validators.required],
      pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
      pt_um: [{ value: this.item.pt_um, disabled: !this.isExist },Validators.required],
    })
    this.form1O3 = this.formBuilder.group({
      pt_desc2: [{ value: this.item.pt_desc2, disabled: !this.isExist }],
      pt_prod_line: [{ value: this.item.pt_prod_line, disabled: !this.isExist }],
      pt_part_type: [{ value: this.item.pt_part_type, disabled: !this.isExist }],
      pt_draw: [{ value: this.item.pt_draw, disabled: !this.isExist }],
      pt_status: [{ value: this.item.pt_status, disabled: !this.isExist }],
      pt_rev: [{ value: this.item.pt_rev, disabled: !this.isExist }],
      pt_dsgn_grp: [{ value: this.item.pt_dsgn_grp, disabled: !this.isExist }],
      pt_group: [{ value: this.item.pt_group, disabled: !this.isExist }],
      pt_drwg_loc: [{ value: this.item.pt_drwg_loc, disabled: !this.isExist }],
      pt_drwg_size: [{ value: this.item.pt_drwg_size, disabled: !this.isExist }],
      pt_promo: [{ value: this.item.pt_promo, disabled: !this.isExist }],
      pt_break_cat: [{ value: this.item.pt_break_cat, disabled: !this.isExist }],
      pt_abc: [{ value: this.item.pt_abc, disabled: !this.isExist },Validators.required],
      pt_avg_int: [{ value: this.item.pt_avg_int, disabled: !this.isExist }],
      pt_lot_ser: [{ value: this.item.pt_lot_ser, disabled: !this.isExist }],
      pt_cyc_int: [{ value: this.item.pt_cyc_int, disabled: !this.isExist }],
      pt_site: [{ value: this.item.pt_site, disabled: !this.isExist },Validators.required],
      pt_shelflife: [{ value: this.item.pt_shelflife, disabled: !this.isExist }],
      pt_loc: [{ value: this.item.pt_loc, disabled: !this.isExist },Validators.required],
      pt_sngl_lot: [{ value: this.item.pt_sngl_lot, disabled: !this.isExist }],
      pt_loc_type: [{ value: this.item.pt_loc_type, disabled: !this.isExist }],
      pt_critical: [{ value: this.item.pt_critical, disabled: !this.isExist }],
      pt_auto_lot: [{ value: this.item.pt_auto_lot, disabled: !this.isExist }],
      pt_rctpo_status: [{ value: this.item.pt_rctpo_status, disabled: !this.isExist }],
      pt_rctpo_active: [{ value: this.item.pt_rctpo_active, disabled: !this.isExist }],
      pt_lot_grp: [{ value: this.item.pt_lot_grp, disabled: !this.isExist }],
      pt_rctwo_status: [{ value: this.item.pt_rctwo_status, disabled: !this.isExist }],
      pt_rctwo_active: [{ value: this.item.pt_rctwo_active, disabled: !this.isExist }],
      pt_article: [{ value: this.item.pt_article, disabled: !this.isExist }],
    });

    this.form2O3 = this.formBuilder.group({
      pt_ship_wt: [{ value: this.item.pt_ship_wt, disabled: !this.isExist }],
      pt_ship_wt_um: [{ value: this.item.pt_ship_wt_um, disabled: !this.isExist }],
      pt_net_wt: [{ value: this.item.pt_net_wt, disabled: !this.isExist }],
      pt_net_wt_um: [{ value: this.item.pt_net_wt_um, disabled: !this.isExist }],
      pt_fr_class: [{ value: this.item.pt_fr_class, disabled: !this.isExist }],
      pt_size: [{ value: this.item.pt_size, disabled: !this.isExist }],
      pt_size_um: [{ value: this.item.pt_size_um, disabled: !this.isExist }],
    });
    this.form3O3 = this.formBuilder.group({
      pt_ms: [{ value: this.item.pt_ms, disabled: !this.isExist }],
      pt_buyer: [{ value: this.item.pt_buyer, disabled: !this.isExist }],
      pt_phantom: [{ value: this.item.pt_phantom, disabled: !this.isExist }],
      pt_plan_ord: [{ value: this.item.pt_plan_ord, disabled: !this.isExist }],
      pt_vend: [{ value: this.item.pt_vend, disabled: !this.isExist }],

      pt_ord_min: [{ value: this.item.pt_ord_min, disabled: !this.isExist }],
      pt_timefence: [{ value: this.item.pt_timefence, disabled: !this.isExist }],
      pt_po_site: [{ value: this.item.pt_po_site, disabled: !this.isExist }],
      pt_ord_max: [{ value: this.item.pt_ord_max, disabled: !this.isExist }],
      pt_pm_code: [{ value: this.item.pt_pm_code, disabled: !this.isExist }],
      pt_ord_mult: [{ value: this.item.pt_ord_mult, disabled: !this.isExist }],
      pt_ord_pol: [{ value: this.item.pt_ord_pol, disabled: !this.isExist }],
      pt_cfg_type: [{ value: this.item.pt_cfg_type, disabled: !this.isExist }],
      pt_op_yield: [{ value: this.item.pt_op_yield, disabled: !this.isExist }],
      pt_ord_qty: [{ value: this.item.pt_ord_qty, disabled: !this.isExist }],
      pt_insp_rqd: [{ value: this.item.pt_insp_rqd, disabled: !this.isExist }],
      pt_yield_pct: [{ value: this.item.pt_yield_pct, disabled: !this.isExist }],
      pt_insp_lead: [{ value: this.item.pt_insp_lead, disabled: !this.isExist }],
      pt_run: [{ value: this.item.pt_run, disabled: !this.isExist }],
      pt_ord_per: [{ value: this.item.pt_ord_per, disabled: !this.isExist }],
      pt_mfg_lead: [{ value: this.item.pt_mfg_lead, disabled: !this.isExist }],
      pt_pur_lead: [{ value: this.item.pt_pur_lead, disabled: !this.isExist }],
      pt_setup: [{ value: this.item.pt_setup, disabled: !this.isExist }],
      pt_sfty_stk: [{ value: this.item.pt_sfty_stk, disabled: !this.isExist }],
      pt_sfty_time: [{ value: this.item.pt_sfty_time, disabled: !this.isExist }],
      pt_rop: [{ value: this.item.pt_rop, disabled: !this.isExist }],
      pt_atp_family: [{ value: this.item.pt_atp_family, disabled: !this.isExist }],
      pt_network: [{ value: this.item.pt_network, disabled: !this.isExist }],
      pt_run_seq1: [{ value: this.item.pt_run_seq1, disabled: !this.isExist }],
      pt_routing: [{ value: this.item.pt_routing, disabled: !this.isExist }],
      pt_iss_pol: [{ value: this.item.pt_iss_pol, disabled: !this.isExist }],
      pt_run_seq2: [{ value: this.item.pt_run_seq2, disabled: !this.isExist }],
      pt_bom_code: [{ value: this.item.pt_bom_code, disabled: !this.isExist }],
    });
    this.form4O3 = this.formBuilder.group({
      pt_pur_price: [{ value: "0.00", disabled: !this.isExist }],
      pt_price: [{ value: "0.00", disabled: !this.isExist }],
      pt_taxable: [{ value: true,  disabled: !this.isExist }],
      pt_taxc: [{ value: this.item.pt_taxc, disabled: !this.isExist },Validators.required],
    });

    this.form5O3 = this.formBuilder.group({
      pt_iss_pol: [{ value: this.item.pt_iss_pol, disabled: !this.isExist }],
      pt_length: [{ value: this.item.pt_length, disabled: !this.isExist }],
      pt_height: [{ value: this.item.pt_height, disabled: !this.isExist }],
      pt_width: [{ value: this.item.pt_width, disabled: !this.isExist }],
      pt_origin: [{ value: this.item.pt_origin, disabled: !this.isExist }],
     
      pt_drwg_size: [{ value: this.item.pt_drwg_size, disabled: !this.isExist }],
      pt_model: [{ value: this.item.pt_model, disabled: !this.isExist }],
      pt_break_cat: [{ value: this.item.pt_break_cat, disabled: !this.isExist }],
      int01: [{ value: this.item.int01, disabled: !this.isExist }],
      int02: [{ value: this.item.int02, disabled: !this.isExist }],
    });
    this.form6O3 = this.formBuilder.group({
      pt_salable: [{ value: this.item.pt_salable, disabled: !this.isExist }],
      pt_inventoryable: [{ value: this.item.pt_inventoryable, disabled: !this.isExist }],
      pt_consignable: [{ value: this.item.pt_consignable, disabled: !this.isExist }],
      pt_returnable: [{ value: this.item.pt_returnable, disabled: !this.isExist }],
      pt_orderable: [{ value: this.item.pt_orderable, disabled: !this.isExist }],
      pt_loadable: [{ value: this.item.pt_loadable, disabled: !this.isExist }],
      pt_promotion: [{ value: this.item.pt_promotion, disabled: !this.isExist }],
    });
    this.sct1O3 = new CostSimulation();

      const controls = this.formXO3.controls;
      const controls1 = this.form1O3.controls;
      const controls4 = this.form4O3.controls;

      this.codeService.getByOne({ code_fldname: "pt_um",bool01: true }).subscribe(
        (response: any) => {
      controls.pt_um.setValue(response.data.code_value)
        })
      controls1.pt_abc.setValue("A")
      this.siteService.getByOne({ si_default: true  }).subscribe(
        (res: any) => {
        // this.site = res.data.si_site
        
        controls1.pt_site.setValue(res.data.si_site );
      //  controls.tr_ref_site.setValue(this.site );
    
      
      this.locationService.getByOne({ loc_site: res.data.si_site , loc_default: true}).subscribe(
        (resp: any) => {
        // this.site = res.data.si_site
        
        controls1.pt_loc.setValue(resp.data.loc_loc );
      //  controls.tr_ref_site.setValue(this.site );
    
      })
    })
    this.taxService.getBy({ tx2_default: true}).subscribe(
      (respo: any) => {
      // this.site = res.data.si_site
      
      controls4.pt_taxc.setValue(respo.data.tx2_tax_code );
    //  controls.tr_ref_site.setValue(this.site );
  
    })

    // this.sctForm = this.formBuilder.group({
    //   sct_mtl_tl: [0],
    //   sct_mtl_ll: [0],
    //   sct_lbr_tl: [0],
    //   sct_lbr_ll: [0],
    //   sct_bdn_tl: [0],
    //   sct_bdn_ll: [0],
    //   sct_ovh_tl: [0],
    //   sct_ovh_ll: [0],
    //   sct_sub_tl: [0],
    //   sct_sub_ll: [0],
    // });
    // this.sctForm1 = this.formBuilder.group({
    //   sct_mtl_tl: [0],
    //   sct_mtl_ll: [0],
    //   sct_lbr_tl: [0],
    //   sct_lbr_ll: [0],
    //   sct_bdn_tl: [0],
    //   sct_bdn_ll: [0],
    //   sct_ovh_tl: [0],
    //   sct_ovh_ll: [0],
    //   sct_sub_tl: [0],
    //   sct_sub_ll: [0],
    // });

  }


  onchangedescO3() {
    const controls = this.form4O3.controls
    document.getElementById("pt_price").focus();
  
  }

  onChangeCodeO3() {
    const controls = this.formXO3.controls
    const controls1 = this.form1O3.controls
    const controls2 = this.form2O3.controls
    const controls3 = this.form3O3.controls
    const controls4 = this.form4O3.controls
    const controls5 = this.form5O3.controls
    const controls6 = this.form6O3.controls

    this.itemService
        .getByOne({
            pt_part: controls.pt_part.value,
        })
        .subscribe((response: any) => {
        
            if (response.data) {
                this.isExist = true
                console.log(response.data)
            } else {
             
              controls.pt_desc1.enable()
              controls.pt_um.enable()
              controls1.pt_desc2.enable()
              controls1.pt_prod_line.enable()
              controls1.pt_part_type.enable()
              controls1.pt_draw.enable()
              controls1.pt_status.enable()
              controls1.pt_rev.enable()
              controls1.pt_dsgn_grp.enable()
              controls1.pt_group.enable()
              controls1.pt_drwg_loc.enable()
              controls1.pt_drwg_size.enable()
              controls1.pt_promo.enable()
              controls1.pt_break_cat.enable()
              controls1.pt_abc.enable()
              controls1.pt_avg_int.enable()
              controls1.pt_lot_ser.enable()
              controls1.pt_cyc_int.enable()
              controls1.pt_site.enable()
              controls1.pt_shelflife.enable()
              controls1.pt_loc.enable()
              controls1.pt_sngl_lot.enable()
              controls1.pt_loc_type.enable()
              controls1.pt_critical.enable()
              controls1.pt_auto_lot.enable()
              controls1.pt_rctpo_status.enable()
              controls1.pt_rctpo_active.enable()
              controls1.pt_lot_grp.enable()
              controls1.pt_rctwo_status.enable()
              controls1.pt_rctwo_active.enable()
              controls1.pt_article.enable()
              controls2.pt_ship_wt.enable()
              controls2.pt_ship_wt_um.enable()
              controls2.pt_net_wt.enable()
              controls2.pt_net_wt_um.enable()
              controls2.pt_fr_class.enable()
              controls2.pt_size.enable()
              controls2.pt_size_um.enable()
              controls3.pt_ms.enable()
              controls3.pt_buyer.enable()
              controls3.pt_phantom.enable()
              controls3.pt_plan_ord.enable()
              controls3.pt_vend.enable()
              controls3.pt_ord_min.enable()
              controls3.pt_timefence.enable()
              controls3.pt_po_site.enable()
              controls3.pt_ord_max.enable()
              controls3.pt_pm_code.enable()
              controls3.pt_ord_mult.enable()
              controls3.pt_ord_pol.enable()
              controls3.pt_cfg_type.enable()
              controls3.pt_op_yield.enable()
              controls3.pt_ord_qty.enable()
              controls3.pt_insp_rqd.enable()
              controls3.pt_yield_pct.enable()
              controls3.pt_insp_lead.enable()
              controls3.pt_run.enable()
              controls3.pt_ord_per.enable()
              controls3.pt_mfg_lead.enable()
              controls3.pt_pur_lead.enable()
              controls3.pt_setup.enable()
              controls3.pt_sfty_stk.enable()
              controls3.pt_sfty_time.enable()
              controls3.pt_rop.enable()
              controls3.pt_atp_family.enable()
              controls3.pt_network.enable()
              controls3.pt_run_seq1.enable()
              controls3.pt_routing.enable()
              controls3.pt_iss_pol.enable()
              controls3.pt_run_seq2.enable()
              controls3.pt_bom_code.enable()
              controls4.pt_pur_price.enable()
              controls4.pt_price.enable()
              controls4.pt_taxable.enable()
              controls4.pt_taxc.enable()

              controls5.pt_iss_pol.enable()
              controls5.pt_length.enable()
              controls5.pt_height.enable()
              controls5.pt_width.enable()
              controls5.pt_origin.enable()
              
              controls5.pt_drwg_size.enable()
              controls5.pt_model.enable()
              controls5.pt_break_cat.enable()
              controls5.int01.enable()
              controls5.int02.enable()

              controls6.pt_salable.enable()
              controls6.pt_inventoryable.enable()
              controls6.pt_consignable.enable()
              controls6.pt_returnable.enable()
              controls6.pt_orderable.enable()
              controls6.pt_loadable.enable()
              controls6.pt_promotion.enable()
              document.getElementById("pt_desc1").focus();

            }
        })
}
//reste form
  //reste form
  resetO3() {
    this.item = new Item();
    this.createFormO3();
    this.hasFormErrors1O3 = false;
    this.hasFormErrors2O3 = false;
    this.hasFormErrors3O3 = false;
    this.hasFormErrors4O3 = false;
  }
  // save data
  onSubmitO3() {
    this.hasFormErrors1O3 = false;
    this.hasFormErrors2O3 = false;
    this.hasFormErrors3O3 = false;
    this.hasFormErrors4O3 = false;
    this.hasFormErrors5O3 = false;
    this.hasFormErrors6O3 = false;
    const controls = this.formXO3.controls;
    const controls1 = this.form1O3.controls;
    const controls2 = this.form2O3.controls;
    const controls3 = this.form3O3.controls;
    const controls4 = this.form4O3.controls;
    const controls5 = this.form5O3.controls;
    const controls6 = this.form6O3.controls;

    /** check form */
    if (this.formXO3.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors1O3 = true;
      return;
    }
    if (this.form1O3.invalid) {
      Object.keys(controls1).forEach((controlName) =>
        controls1[controlName].markAsTouched()
      );

      this.hasFormErrors1O3 = true;
      return;
    }
    if (this.form2O3.invalid) {
      Object.keys(controls2).forEach((controlName) =>
        controls2[controlName].markAsTouched()
      );

      this.hasFormErrors2O3 = true;
      return;
    }
    if (this.form3O3.invalid) {
      Object.keys(controls3).forEach((controlName) =>
        controls3[controlName].markAsTouched()
      );

      this.hasFormErrors3O3 = true;
      return;
    }
    if (this.form4O3.invalid) {
      Object.keys(controls4).forEach((controlName) =>
        controls4[controlName].markAsTouched()
      );

      this.hasFormErrors4O3 = true;
      return;
    }
    if (this.form5O3.invalid) {
      Object.keys(controls5).forEach((controlName) =>
        controls5[controlName].markAsTouched()
      );

      this.hasFormErrors5O3 = true;
      return;
    }
    if (this.form6O3.invalid) {
      Object.keys(controls6).forEach((controlName) =>
        controls3[controlName].markAsTouched()
      );

      this.hasFormErrors6O3 = true;
      return;
    }
    if (this.error) {
      this.hasFormErrors1O3 = true;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let item = this.prepareItemO3();
    let sct1 = this.prepareSct1O3();
    let sct2 = this.prepareSct2O3()
    this.addItem(item, sct1, sct2);
  }
  /**
   *
   * Returns object for saving
   */
  prepareItemO3(): Item {
    const controls  = this.formXO3.controls;
    const controls1 = this.form1O3.controls;
    const controls2 = this.form2O3.controls;
    const controls3 = this.form3O3.controls;
    const controls4 = this.form4O3.controls;
    const controls5 = this.form5O3.controls;
    const controls6 = this.form6O3.controls;

    const _item = new Item();
    _item.pt_part = controls.pt_part.value;
    _item.pt_desc1 = controls.pt_desc1.value;
    _item.pt_desc2 = controls1.pt_desc2.value;
    _item.pt_um = controls.pt_um.value;
    _item.pt_prod_line = controls1.pt_prod_line.value;
    _item.pt_part_type = controls1.pt_part_type.value;
    _item.pt_draw = controls1.pt_draw.value;
    _item.pt_status = controls1.pt_status.value;
    _item.pt_rev = controls1.pt_rev.value;
    _item.pt_dsgn_grp = controls1.pt_dsgn_grp.value;
    _item.pt_group = controls1.pt_group.value;
    _item.pt_drwg_loc = controls1.pt_drwg_loc.value;
    _item.pt_drwg_size = controls1.pt_drwg_size.value;
    _item.pt_promo = controls1.pt_promo.value;
    _item.pt_break_cat = controls1.pt_break_cat.value;
    _item.pt_abc = controls1.pt_abc.value;
    _item.pt_avg_int = controls1.pt_avg_int.value;
    _item.pt_lot_ser = controls1.pt_lot_ser.value;
    _item.pt_cyc_int = controls1.pt_cyc_int.value;
    _item.pt_site = controls1.pt_site.value;
    _item.pt_shelflife = controls1.pt_shelflife.value;
    _item.pt_loc = controls1.pt_loc.value;
    _item.pt_sngl_lot = controls1.pt_sngl_lot.value;
    _item.pt_loc_type = controls1.pt_loc_type.value;
    _item.pt_critical = controls1.pt_critical.value;
    _item.pt_auto_lot = controls1.pt_auto_lot.value;
    _item.pt_rctpo_status = controls1.pt_rctpo_status.value;
    _item.pt_rctpo_active = controls1.pt_rctpo_active.value;
    _item.pt_lot_grp = controls1.pt_lot_grp.value;
    _item.pt_rctwo_status = controls1.pt_rctwo_status.value;
    _item.pt_rctwo_active = controls1.pt_rctwo_active.value;
    _item.pt_article = controls1.pt_article.value;

    _item.pt_ship_wt = controls2.pt_ship_wt.value;
    _item.pt_ship_wt_um = controls2.pt_ship_wt_um.value;
    _item.pt_net_wt = controls2.pt_net_wt.value;
    _item.pt_net_wt_um = controls2.pt_net_wt_um.value;
    _item.pt_fr_class = controls2.pt_fr_class.value;
    _item.pt_size = controls2.pt_size.value;
    _item.pt_size_um = controls2.pt_size_um.value;

    _item.pt_ms = controls3.pt_ms.value;
    _item.pt_buyer = controls3.pt_buyer.value;
    _item.pt_phantom = controls3.pt_phantom.value;
    _item.pt_plan_ord = controls3.pt_plan_ord.value;
    _item.pt_vend = controls3.pt_vend.value;

    _item.pt_ord_min = controls3.pt_ord_min.value;
    _item.pt_timefence = controls3.pt_timefence.value;
    _item.pt_po_site = controls3.pt_po_site.value;
    _item.pt_ord_max = controls3.pt_ord_max.value;
    _item.pt_pm_code = controls3.pt_pm_code.value;
    _item.pt_ord_mult = controls3.pt_ord_mult.value;
    _item.pt_ord_pol = controls3.pt_ord_pol.value;
    _item.pt_cfg_type = controls3.pt_cfg_type.value;
    _item.pt_op_yield = controls3.pt_op_yield.value;
    _item.pt_ord_qty = controls3.pt_ord_qty.value;
    _item.pt_insp_rqd = controls3.pt_insp_rqd.value;
    _item.pt_yield_pct = controls3.pt_yield_pct.value;
    _item.pt_insp_lead = controls3.pt_insp_lead.value;
    _item.pt_run = controls3.pt_run.value;
    _item.pt_ord_per = controls3.pt_ord_per.value;
    _item.pt_mfg_lead = controls3.pt_mfg_lead.value;
    _item.pt_pur_lead = controls3.pt_pur_lead.value;
    _item.pt_setup = controls3.pt_setup.value;
    _item.pt_sfty_stk = controls3.pt_sfty_stk.value;
    _item.pt_sfty_time = controls3.pt_sfty_time.value;
    _item.pt_rop = controls3.pt_rop.value;
    _item.pt_atp_family = controls3.pt_atp_family.value;
    _item.pt_network = controls3.pt_network.value;
    _item.pt_run_seq1 = controls3.pt_run_seq1.value;
    _item.pt_routing = controls3.pt_routing.value;
    // _item.pt_iss_pol = controls3.pt_iss_pol.value;
    _item.pt_run_seq2 = controls3.pt_run_seq2.value;
    _item.pt_bom_code = controls3.pt_bom_code.value;

    _item.pt_pur_price = controls4.pt_pur_price.value;
    _item.pt_price = controls4.pt_price.value;
    _item.pt_taxable = controls4.pt_taxable.value;
    _item.pt_taxc = controls4.pt_taxc.value;


    _item.pt_iss_pol   = controls5.pt_iss_pol.value;
    _item.pt_length    = controls5.pt_length.value;
    _item.pt_height    = controls5.pt_height.value;
    _item.pt_width     = controls5.pt_width.value;
    _item.pt_origin    = controls5.pt_origin.value;
    _item.pt_drwg_size = controls5.pt_drwg_size.value; 
    _item.pt_model     = controls5.pt_model.value;
    _item.pt_break_cat = controls5.pt_break_cat.value;
    _item.int01        = controls5.int01.value;
    _item.int02        = controls5.int02.value;



    _item.pt_salable = controls6.pt_salable.value;
    _item.pt_inventoryable = controls6.pt_inventoryable.value;
    _item.pt_consignable = controls6.pt_consignable.value;
    _item.pt_returnable = controls6.pt_returnable.value;
    _item.pt_orderable = controls6.pt_orderable.value;
    _item.pt_loadable = controls6.pt_loadable.value;
    _item.pt_promotion = controls6.pt_promotion.value;


    return _item;
  }
  /**
   * Add item
   *
   * @param _item: ItemModel
   */
  addItem(item: Item, sct1: CostSimulation, sct2: CostSimulation) {
    this.loadingSubject.next(true);
    this.itemService.add(item).subscribe(
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

        this.sctService.add(sct1).subscribe(
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
            this.sctService.add(sct2).subscribe(
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
                this.loadingSubject.next(false);
                this.resetO3()
               // this.router.navigateByUrl("/articles/list");
              }
            );
          }
        );
      }
    );
  }

  prepareSct1O3(): CostSimulation {
    // const controls = this.sctForm.controls;
    const control1 = this.formXO3.controls;
    const controls1 = this.form1O3.controls;
    const _sct = new CostSimulation();
    
    _sct.sct_sim      = 'STD-CG'
    _sct.sct_part     = control1.pt_part.value;
    _sct.sct_mtl_tl   = 0;
    _sct.sct_mtl_ll   = 0;
    _sct.sct_lbr_tl   = 0;
    _sct.sct_lbr_ll   = 0;
    _sct.sct_bdn_tl   = 0;
    _sct.sct_bdn_ll   = 0;
    _sct.sct_ovh_tl   = 0;
    _sct.sct_ovh_ll   = 0;
    _sct.sct_sub_tl   = 0;
    _sct.sct_sub_ll   = 0;
    _sct.sct_cst_tot  = 0;
    _sct.sct_site     = controls1.pt_site.value;

    return _sct;
  }

  prepareSct2O3(): CostSimulation {
    // const controls = this.sctForm1.controls;
    const control1 = this.formXO3.controls;
    const controls1 = this.form1O3.controls;
    const _sct = new CostSimulation();
    _sct.sct_sim     = 'STD-CR'
    _sct.sct_part    = control1.pt_part.value
    _sct.sct_mtl_tl  = 0;
    _sct.sct_mtl_ll  = 0;
    _sct.sct_lbr_tl  = 0;
    _sct.sct_lbr_ll  = 0;
    _sct.sct_bdn_tl  = 0;
    _sct.sct_bdn_ll  = 0;
    _sct.sct_ovh_tl  = 0;
    _sct.sct_ovh_ll  = 0;
    _sct.sct_sub_tl  = 0;
    _sct.sct_sub_ll  = 0;
    _sct.sct_cst_tot = 0;
    _sct.sct_site    = controls1.pt_site.value;
    return _sct;
  }

  /**
   * Go back to the list
   *
   */
  goBackO3() {
    this.loadingSubject.next(false);
    const url = `/articles/list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }
  changeUmO3() {
    const controls = this.formXO3.controls; // chof le champs hada wesh men form rah
    const um_um = controls.pt_um.value;
    this.codeService.getByOne({ code_fldname: "pt_um", code_value :um_um }).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette unite de mesure n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          controls.pt_um.setValue(null)
          document.getElementById("pt_um").focus();
          this.error = true;
        } else {
          this.error = false;
          document.getElementById("pt_price").focus();
        }
      },
      (error) => console.log(error)
    );
  }

  changeSeqO3() {
    const controls = this.form3O3.controls; // chof le champs hada wesh men form rah
    const seq_seq = controls.pt_buyer.value;
    this.sequenceService.getBy({ seq_seq }).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette sequence n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  changePlO3() {
    const controls = this.form1O3.controls; // chof le champs hada wesh men form rah
    const pl_prod_line = controls.pt_prod_line.value;
    this.productLineService.getBy({ pl_prod_line }).subscribe(
      (res: any) => {
        const { data } = res;
        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cette Ligne de Produit n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }
  changeCodeO3(field) {
    const controls = this.form1O3.controls; // chof le champs hada wesh men form rah

    let obj = {};
    if (field == "pt_status") {
      this.msg = " Status ";
      const code_value = controls.pt_status.value;
      obj = {
        code_value,
        code_fldname: field,
      };
    }
    if (field == "pt_dsgn_grp") {
      this.msg = " Groupe Etude ";
      const code_value = controls.pt_dsgn_grp.value;
      obj = {
        code_value,
        code_fldname: field,
      };
    }

    this.codeService.getBy(obj).subscribe(
      (res: any) => {
        const { data } = res;
        const message = "Ce code" + this.msg + " n'existe pas!";
        if (!data.length) {
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  changeStatusO3(field) {
    const controls = this.form1O3.controls; // chof le champs hada wesh men form rah

    let is_status: any;
    if (field == "pt_rctpo_status") {
      this.msg = " Status reception OA ";
       is_status = controls.pt_rctpo_status.value;
      
    }
    if (field == "pt_rctwo_status") {
      this.msg = " Status Reception WO ";
       is_status = controls.pt_rctwo_status.value;
      
    }

    this.inventoryStatusService.getBy({is_status}).subscribe(
      (res: any) => {
        const { data } = res;
        const message = "Ce code" + this.msg + " n'existe pas!";
        if (!data.length) {
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }







  changeSiteO3() {
    const controls = this.form1O3.controls; // chof le champs hada wesh men form rah
    const si_site = controls.pt_site.value;
    this.siteService.getBy({ si_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce Site n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  changeProviderO3() {
    const controls = this.form3O3.controls; // chof le champs hada wesh men form rah
    const vd_addr = controls.pt_vend.value;
    this.providerService.getBy({ vd_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce fournisseur n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  changeLocO3() {
    const controls = this.form1O3.controls; // chof le champs hada wesh men form rah
    const loc_loc = controls.pt_loc.value;
    const loc_site = controls.pt_site.value;

    this.locationService.getBy({ loc_loc, loc_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cet Emplacement n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }

  handleSelectedRowsChanged3O3(e, args) {
    const controls = this.formXO3.controls;
    const controls1 = this.form1O3.controls;
    const controls2 = this.form2O3.controls;
    const controls3 = this.form3O3.controls;
    const controls4 = this.form4O3.controls;

    if (Array.isArray(args.rows) && this.gridObj3O3) {
      args.rows.map((idx) => {
        const item = this.gridObj3O3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedFieldO3) {
          case "pt_status": {
            controls1.pt_status.setValue(item.code_value || "");
            break;
          }
          case "pt_dsgn_grp": {
            controls1.pt_dsgn_grp.setValue(item.code_value || "");
            break;
          }
          case "pt_um": {
            controls.pt_um.setValue(item.code_value || "");
            document.getElementById("pt_price").focus();
            this.modalService.dismissAll()
            document.getElementById("pt_price").focus();
            break;
          }
          case "pt_network": {
            controls3.pt_network.setValue(item.code_value || "");
            break;
          }
          default:
            break;
        }
      });
    }
  }


  handleSelectedRowsChangedstatusO3(e, args) {
    const controls1 = this.form1O3.controls;
    
    if (Array.isArray(args.rows) && this.gridObjstatusO3) {
      args.rows.map((idx) => {
        const item = this.gridObjstatusO3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedFieldO3) {
          case "pt_rctpo_status": {
            controls1.pt_rctpo_status.setValue(item.is_status || "");
            break;
          }
          case "pt_rctwo_status": {
            controls1.pt_rctwo_status.setValue(item.is_status || "");
            break;
          }
          
          default:
            break;
        }
      });
    }
  }

  handleSelectedRowsChangedsiteO3(e, args) {
    const controls1 = this.form1O3.controls;
    const controls2 = this.form2O3.controls;
    const controls3 = this.form3O3.controls;
    const controls4 = this.form4O3.controls;

    if (Array.isArray(args.rows) && this.gridObjsiteO3) {
      args.rows.map((idx) => {
        const item = this.gridObjsiteO3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedFieldO3) {
          case "pt_site": {
            controls1.pt_site.setValue(item.si_site || "");
            break;
          }
          case "pt_po_site": {
            controls3.pt_po_site.setValue(item.si_site || "");
            break;
          }
          default:
            break;
        }
      });
    }
  }
  handleSelectedRowsChangedplO3(e, args) {
    const controls1 = this.form1O3.controls;
    if (Array.isArray(args.rows) && this.gridObjplO3) {
      args.rows.map((idx) => {
        const item = this.gridObjplO3.getDataItem(idx);
        controls1.pt_prod_line.setValue(item.pl_prod_line || "");
      });
    }
  }
  handleSelectedRowsChangedlocO3(e, args) {
    const controls1 = this.form1O3.controls;

    if (Array.isArray(args.rows) && this.gridObjlocO3) {
      args.rows.map((idx) => {
        const item = this.gridObjlocO3.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        switch (this.selectedFieldO3) {
          case "pt_loc": {
            controls1.pt_loc.setValue(item.loc_loc || "");
            break;
          }
          default:
            break;
        }
      });
    }
  }
  angularGridReady3O3(angularGrid: AngularGridInstance) {
    this.angularGrid3O3 = angularGrid;
    this.gridObj3O3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid3O3() {
    this.columnDefinitions3O3 = [
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

    this.gridOptions3O3 = {
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
    this.codeService
      .getBy({ code_fldname: this.selectedFieldO3 })
      .subscribe((response: any) => (this.dataO3 = response.data));
  }
  open3O3(contentO3, fieldO3) {
    this.selectedFieldO3 = fieldO3;
    this.prepareGrid3O3();
    this.modalService.open(contentO3, { size: "lg" });
  }
  angularGridReadysiteO3(angularGrid: AngularGridInstance) {
    this.angularGridsiteO3 = angularGrid;
    this.gridObjsiteO3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridsiteO3() {
    this.columnDefinitionssiteO3 = [
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

    this.gridOptionssiteO3 = {
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
      .subscribe((response: any) => (this.datasiteO3 = response.data));
  }
  opensiteO3(contentsiteO3, fieldO3) {
    this.selectedFieldO3 = fieldO3;
    this.prepareGridsiteO3();
    this.modalService.open(contentsiteO3, { size: "lg" });
  }
  angularGridReadylocO3(angularGrid: AngularGridInstance) {
    this.angularGridlocO3 = angularGrid;
    this.gridObjlocO3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridlocO3() {
    const controls1 = this.form1O3.controls;
    this.columnDefinitionslocO3 = [
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
        id: "loc_loc",
        name: "loc",
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
    ];

    this.gridOptionslocO3 = {
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
    this.locationService
      .getBy({ loc_site: controls1.pt_site.value })
      .subscribe((response: any) => (this.datalocO3 = response.data));
  }
  openlocO3(contentlocO3, fieldO3) {
    this.selectedFieldO3= fieldO3;
    this.prepareGridlocO3();
    this.modalService.open(contentlocO3, { size: "lg" });
  }

  angularGridReadyplO3(angularGrid: AngularGridInstance) {
    this.angularGridplO3 = angularGrid;
    this.gridObjplO3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridplO3() {
    this.columnDefinitionsplO3 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "pl_prod_line",
        name: "code ",
        field: "pl_prod_line",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pl_desc",
        name: "desc",
        field: "pl_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pl_taxc",
        name: "Taxe",
        field: "pl_taxc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsplO3 = {
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
    this.productLineService
      .getAll()
      .subscribe((response: any) => (this.dataplO3 = response.data));
  }
  openplO3(contentplO3) {
    this.prepareGridplO3();
    this.modalService.open(contentplO3, { size: "lg" });
  }

  handleSelectedRowsChangedprovO3(e, args) {
    const controls = this.form3O3.controls;
    if (Array.isArray(args.rows) && this.gridObjprovO3) {
      args.rows.map((idx) => {
        const item = this.gridObjprovO3.getDataItem(idx);
        controls.pt_vend.setValue(item.vd_addr || "");
      });
    }
  }

  angularGridReadyprovO3(angularGrid: AngularGridInstance) {
    this.angularGridprovO3 = angularGrid;
    this.gridObjprovO3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridprovO3() {
    this.columnDefinitionsprovO3 = [
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
        field: "address.ad_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "vd_type",
        name: "Type",
        field: "vd_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsprovO3 = {
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
    this.providerService
      .getAll()
      .subscribe((response: any) => (this.providersO3 = response.data));
  }
  openprovO3(contentO3) {
    this.prepareGridprovO3();
    this.modalService.open(contentO3, { size: "lg" });
  }

  handleSelectedRowsChangedseqO3(e, args) {
    const controls = this.form3O3.controls;
    if (Array.isArray(args.rows) && this.gridObjseqO3) {
      args.rows.map((idx) => {
        const item = this.gridObjseqO3.getDataItem(idx);
        controls.pt_buyer.setValue(item.seq_seq || "");
      });
    }
  }

  angularGridReadyseqO3(angularGrid: AngularGridInstance) {
    this.angularGridseqO3 = angularGrid;
    this.gridObjseqO3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridseqO3() {
    this.columnDefinitionsseqO3 = [
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
    ];

    this.gridOptionsseqO3 = {
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
    this.sequenceService
      .getAll()
      .subscribe((response: any) => (this.sequencesO3 = response.data));
  }
  openseqO3(contentO3) {
    this.prepareGridseqO3();
    this.modalService.open(contentO3, { size: "lg" });
  }



  angularGridReadystatusO3(angularGrid: AngularGridInstance) {
    this.angularGridstatusO3 = angularGrid;
    this.gridObjstatusO3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridstatusO3() {
    this.columnDefinitionsstatusO3 = [
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
        id: "is_status",
        name: "Status",
        field: "is_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_desc",
        name: "Designation",
        field: "is_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_avail",
        name: "Disponible",
        field: "is_avail",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_nettable",
        name: "Gerer MRP",
        field: "is_nettable",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "is_overissue",
        name: "Sortie Excedent",
        field: "is_overissue",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },


    ];

    this.gridOptionsstatusO3 = {
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
    this.inventoryStatusService
      .getAll()
      .subscribe((response: any) => (this.datastatusO3 = response.data));
  }
  openstatusO3(contentO3, fieldO3) {
    this.selectedFieldO3 = fieldO3;
    this.prepareGridstatusO3();
    this.modalService.open(contentO3, { size: "lg" });
  }


  handleSelectedRowsChangedtaxO3(e, args) {
    const controls = this.form4O3.controls
    if (Array.isArray(args.rows) && this.gridObjtaxO3) {
        args.rows.map((idx) => {
            const item = this.gridObjtaxO3.getDataItem(idx)
            controls.pt_taxc.setValue(item.tx2_tax_code || "")
        })
    }
}

  angularGridReadytaxO3(angularGrid: AngularGridInstance) {
    this.angularGridtaxO3 = angularGrid
    this.gridObjtaxO3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridtaxO3() {
    this.columnDefinitionstaxO3 = [
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

    this.gridOptionstaxO3 = {
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
        .subscribe((response: any) => (this.datataxO3 = response.data))
}
opentaxO3(contenttaxO3) {
    this.prepareGridtaxO3()
    this.modalService.open(contenttaxO3, { size: "lg" })
}

// FIN ONGLET 3
gridReadyO4(angularGrid: AngularGridInstance) {
    this.angularGridO4 = angularGrid;
    this.dataViewO4 = angularGrid.dataView;
    this.gridO4 = angularGrid.slickGrid;
    this.gridServiceO4 = angularGrid.gridService;
  }

  prepareGridO4() {
    this.columnDefinitionsO4 = [
     
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 50,
      },
      {
        id: "pt_part",
        name: "Code Produit",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
     
      {
        id: "pt_desc1",
        name: "Description Externe",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        minWidth: 250,
        type: FieldType.string,
      },
      // {
      //   id: "pt_desc2",
      //   name: "Description Interne",
      //   field: "pt_desc2",
      //   sortable: true,
      //   filterable: true,
      //   minWidth: 150,
      //   type: FieldType.string,
      // },
      {
        id: "pt_um",
        name: "UM",
        field: "pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      {
        id: "pt_prod_line",
        name: "Famille",
        field: "pt_prod_line",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_prod_line',
          formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },
      {
        id: "pt_part_type",
        name: "Type",
        field: "pt_part_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_part_type',
          formatter: (g) => `type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },
      {
        id: "pt_draw",
        name: "Sous Famille",
        field: "pt_draw",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_draw',
          formatter: (g) => `Sous famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },

      {
        id: "pt_group",
        name: "Groupe",
        field: "pt_group",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_group',
          formatter: (g) => `groupe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },
      
      {
        id: "pt_status",
        name: "Statut",
        field: "pt_status",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
      },
      {
        id: "pt_article",
        name: "Modele",
        field: "pt_article",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
        grouping: {
          getter: 'pt_article',
          formatter: (g) => `Modèle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },

     
      {
        id: "created_by",
        name: "Utilisateur",
        field: "created_by",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
        grouping: {
          getter: 'created_by',
          formatter: (g) => `utilisateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      {
        id: "createdAt",
        name: "crée le",
        field: "createdAt",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
        grouping: {
          getter: 'createdAt',
          formatter: (g) => `crée le: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },

    ];

    this.gridOptionsO4 = {
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
                this.clearGroupingO4();
              }
            },
          },
          draggableGrouping: {
            dropPlaceHolderText: 'Drop a column header here to group by the column',
            // groupIconCssClass: 'fa fa-outdent',
            deleteIconCssClass: 'fa fa-times',
            onGroupChanged: (e, args) => this.onGroupChangedO4(args),
            onExtensionRegistered: (extension) => this.draggableGroupingPluginO4 = extension,
        
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

      
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      autoEdit: false,
      autoFitColumnsOnFirstLoad: true,
      // autosizeColumnsByCellContentOnFirstLoad: true,
      enableAutoSizeColumns: true,
      syncColumnCellResize: true,
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      },
    };

    // fill the dataset with your data
    this.datasetO4 = [];
    this.itemService.getAll().subscribe(
      (response: any) => {
        this.datasetO4 = response.data;
        // this.dataViewO4.setItems(this.datasetO4);
      },

      (error) => {
        this.datasetO4 = [];
      },
      () => {}
    );
  }
  onGroupChangedO4(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFieldsO4) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsO4.forEach((g, i) => this.selectedGroupingFieldsO4[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelectsO4();
    }
  }
  clearGroupingSelectsO4() {
    this.selectedGroupingFieldsO4.forEach((g, i) => this.selectedGroupingFieldsO4[i] = '');
  }
  
  collapseAllGroupsO4() {
    this.dataviewObjO4.collapseAllGroups();
  }

  expandAllGroupsO4() {
    this.dataviewObjO4.expandAllGroups();
  }
  clearGroupingO4() {
    if (this.draggableGroupingPluginO4 && this.draggableGroupingPluginO4.setDroppedGroups) {
      this.draggableGroupingPluginO4.clearDroppedGroups();
    }
    this.gridObjO4.invalidate(); // invalidate all rows and re-render
  }
  // FIN ONGLET 4
  angularGridReadyO5(angularGrid: AngularGridInstance) {
      this.angularGridO5 = angularGrid;
      this.gridO5 = angularGrid.slickGrid; // grid object
      this.dataviewO5 = angularGrid.dataView;
      this.gridServiceO5 = angularGrid.gridService;
    }
    
    
    prepareGridO5() {
  
        this.columnDefinitionsO5 = [
            
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
              id: "ld_site",
              name: "Site",
              field: "ld_site",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'ld_site',
                formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                collapsed: true,
              }
            }, 
            {
              id: "ld_loc",
              name: "Emplacement",
              field: "ld_loc",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'ld_loc',
                formatter: (g) => `Emplacement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                collapsed: true,
              }
            }, 
            {
              id: "ld_part",
              name: "Article",
              field: "ld_part",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              grouping: {
                getter: 'ld_part',
                formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                collapsed: true,
                lazyTotalsCalculation:true,
              }
            }, 
            {
              id: "chr05",
              name: "Categorie",
              field: "chr05",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
              grouping: {
                getter: 'chr05',
                formatter: (g) => `Categorie: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            }, 
            {
              id: "ld__chr02",
              name: "Type",
              field: "ld__chr02",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
              grouping: {
                getter: 'ld__chr02',
                formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            }, 
              
             
            {
              id: "chr01",
              name: "FAMILLE",
              field: "chr01",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
              grouping: {
                getter: 'chr01',
                formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            }, 
            {
              id: "chr02",
              name: "Couleur",
              field: "chr02",
              sortable: true,
              filterable: true,
              groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
              type: FieldType.string,
              filter: {collectionAsync:  this.http.get(`${API_URL_codes}/colors`),model: Filters.multipleSelect , operator: OperatorType.inContains },
              grouping: {
                getter: 'chr02',
                formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            }, 
            {
              id: "chr03",
              name: "Etat",
              field: "chr03",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
              grouping: {
                getter: 'chr03',
                formatter: (g) => `Etat: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            },
            {
              id: "ld_lot",
              name: "Lot",
              field: "ld_lot",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'ld_lot',
                formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                collapsed: true,
              }
            }, 
            {
              id: "ld_qty_oh",
              name: "Quantite",
              field: "ld_qty_oh",
              sortable: true,
              filterable: true,
              groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
              type: FieldType.float,
              filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
              
              
            }, 
            {
              id: "ld_status",
              name: "Status",
              field: "ld_status",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'ld_status',
                formatter: (g) => `Status: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('ld_qty_oh'),
                  new Aggregators.Sum('ld_qty_oh')
                ],
                aggregateCollapsed: true,
                collapsed: true,
              }
            }, 
            {
              id: "ld_ref",
              name: "Reference",
              field: "ld_ref",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'ld_ref',
                formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregateCollapsed: true,
                collapsed: true,
              }
            },
            {
              id: "chr04",
              name: "Origine",
              field: "chr04",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'chr04',
                formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregateCollapsed: true,
                collapsed: true,
              }
            }, 
            {
              id: "created_by",
              name: "Saisie par",
              field: "created_by",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'created_by',
                formatter: (g) => `Users: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregateCollapsed: true,
                collapsed: true,
              }
            }, 
            {
              id: "last_modified_by",
              name: "Modifié par",
              field: "last_modified_by",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'last_modified_by',
                formatter: (g) => `Users: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregateCollapsed: true,
                collapsed: true,
              }
            }, 
            {
              id: "ld_date",
              name: "Date Entrée",
              field: "ld_date",
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
                getter: 'ld_date',
                formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregateCollapsed: false,
                collapsed: false,
              }
            },
            
            
            
  
        ]
  
        this.gridOptionsO5 = {
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
                  this.clearGroupingO5();
                }
              },
            },
            draggableGrouping: {
              dropPlaceHolderText: 'Drop a column header here to group by the column',
              // groupIconCssClass: 'fa fa-outdent',
              deleteIconCssClass: 'fa fa-times',
              onGroupChanged: (e, args) => this.onGroupChangedO5(args),
              onExtensionRegistered: (extension) => this.draggableGroupingPluginO5 = extension,
          
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
        this.datasetO5 = []
        this.locationDetailService.getAll().subscribe( 
          
            (response: any) => {this.datasetO5 = response.data
              console.log(this.datasetO5)
              // this.dataviewO5.setItems(this.datasetO5)
            },
            
            (error) => {
                this.datasetO5 = []
            },
            () => {}
            
        )
        console.log(this.datasetO5)
    }
    onGroupChangedO5(change: { caller?: string; groupColumns: Grouping[] }) {
        // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
        const caller = change && change.caller || [];
        const groups = change && change.groupColumns || [];
  
        if (Array.isArray(this.selectedGroupingFieldsO5) && Array.isArray(groups) && groups.length > 0) {
          // update all Group By select dropdown
          this.selectedGroupingFieldsO5.forEach((g, i) => this.selectedGroupingFieldsO5[i] = groups[i] && groups[i].getter || '');
        } else if (groups.length === 0 && caller === 'remove-group') {
          this.clearGroupingSelectsO5();
        }
      }
      clearGroupingSelectsO5() {
        this.selectedGroupingFieldsO5.forEach((g, i) => this.selectedGroupingFieldsO5[i] = '');
      }
      
      collapseAllGroupsO5() {
        this.dataviewObjO5.collapseAllGroups();
      }
    
      expandAllGroupsO5() {
        this.dataviewObjO5.expandAllGroups();
      }
      clearGroupingO5() {
        if (this.draggableGroupingPluginO5 && this.draggableGroupingPluginO5.setDroppedGroups) {
          this.draggableGroupingPluginO5.clearDroppedGroups();
        }
        this.gridObjO5.invalidate(); // invalidate all rows and re-render
      }
  
      printpdfO5() {
        // const controls = this.totForm.controls
        let nbr = new Date().toLocaleDateString()
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
        for (let j = 0; j < this.datasetO5.length  ; j++) {
          total = total - Number(this.datasetO5[j].ld_qty_oh)
          
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
            doc.text(this.datasetO5[j].ld_part, 25, i - 1);
            doc.line(65, i - 5, 65, i);
            doc.text(this.datasetO5[j].chr01 + ' ' + this.datasetO5[j].chr02 + ' ' + this.datasetO5[j].chr03, 67.5, i - 1);
            doc.line(130, i - 5, 130, i);
            doc.text(String(Number(this.datasetO5[j].ld_qty_oh) ), 137, i - 1, { align: "right" });
            doc.line(140, i - 5, 140, i);
            doc.text(String(this.datasetO5[j].chr04), 143, i - 1);
            doc.line(170, i - 5, 170, i);
            doc.text(String(this.datasetO5[j].created_by), 173, i - 1, );
            doc.line(185, i - 5, 185, i);
            doc.text(String(this.datasetO5[j].ld_lot), 188, i - 1, );
            doc.line(205, i - 5, 205, i);
            doc.text(String(this.datasetO5[j].ld_ref), 207, i - 1, );
            doc.line(220, i - 5, 220, i);
            doc.text(String((this.datasetO5[j].ld_date)) , 223, i - 1, );
            doc.line(235, i - 5, 235, i);
            doc.text(String((this.datasetO5[j].ld_site)) , 238, i - 1, );
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
      
        doc.text("NOMBRE DE BIG BAG   " + String(this.datasetO5.length) + "  , Total POIDS:  " + String(Number(total)), 40, i + 12, { align: "left" });
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
      onSubmitO5() {
      
        this.printpdfO5(); 
       
        // tslint:disable-next-line:prefer-const
      
      }
      
      
      
      
     
      
      resetO5() {
      
        this.datasetO5 = []
        this.locationDetailService.getAll().subscribe( 
          
            (response: any) => {this.datasetO5 = response.data
              console.log(this.datasetO5)
              // this.dataviewO5.setItems(this.datasetO5)
              },
            
            (error) => {
                this.datasetO5 = []
            },
            () => {}
            
        )
      
      }
      // FIN ONGLET 5
      GridReadyO6(angularGrid: AngularGridInstance) {
        this.angularGridO6 = angularGrid
        this.dataViewO6 = angularGrid.dataView
        this.gridO6 = angularGrid.slickGrid
        this.gridServiceO6 = angularGrid.gridService
    }
   
      
     
        
          
          
        
 
    

    createFormO6() {
      this.loadingSubject.next(false);
      this.inventoryTransactionO6 = new InventoryTransaction();
    
     // console.log(this.site)  
      const date = new Date()

      this.trFormO6 = this.trFB.group({
        tr_lot: [this.inventoryTransactionO6.tr_lot],
        tr_effdate: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: date.getDate()
        }],
        tr_rmks: [this.inventoryTransactionO6.tr_rmks],    
        //tr_site:  [this.inventoryTransaction.tr_site],
        tr_site:  [this.user.usrd_site],
        tr_loc: [this.inventoryTransactionO6.tr_loc],
        tr_ref_site: [this.user.usrd_site],
        tr_ref_loc: [this.inventoryTransactionO6.tr_ref_loc],
        ref: [null],
        print:[true],
       
      
    })  
      // const controls = this.trForm.controls;
      // this.siteService.getByOne({ si_default: true  }).subscribe(
      //   (res: any) => {
      //   this.site = res.data.si_site
        
      //   controls.tr_site.setValue(this.site );
      //   controls.tr_ref_site.setValue(this.site );
    
      // })
    
      
        
      }
      
      //reste form
      resetO6() {
        this.inventoryTransactionO6 = new InventoryTransaction();
        this.createFormO6();
        this.datasetO6 =[];
        this.globalStateO6 = false;
        this.hasFormErrorsO6 = false;
      }
      // save data
      onSubmitO6() {
        this.globalStateO6 = true;
        this.hasFormErrorsO6 = false;
        const controls = this.trFormO6.controls;
        /** check form */
        if (this.trFormO6.invalid) {
          Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
          );
          this.message = "Modifiez quelques éléments et réessayez de soumettre.";
          this.hasFormErrorsO6 = true;
    
          return;
        }
    
        if (!this.datasetO6.length) {
          this.message = "La liste des article ne peut pas etre vide";
          this.hasFormErrorsO6 = true;
    
          return;
        }


        for (var i = 0; i < this.datasetO6.length; i++) {
          console.log(this.datasetO6[i]  )
         if (this.datasetO6[i].tr_part == "" || this.datasetO6[i].tr_part == null  ) {
          this.message = "L' article ne peut pas etre vide";
          this.hasFormErrorsO6 = true;
          return;
     
         }
         
         if (this.datasetO6[i].tr_um == "" || this.datasetO6[i].tr_um == null  ) {
          this.message = "L' UM ne peut pas etre vide";
          this.hasFormErrorsO6 = true;
          return;
     
         }
         if (this.datasetO6[i].tr_status == "" || this.datasetO6[i].tr_status == null  ) {
          this.message = "Le Status ne peut pas etre vide";
          this.hasFormErrorsO6 = true;
          return;
     
         }
         if (this.datasetO6[i].tr_qty_loc == 0 ) {
          this.message = "La Quantite ne peut pas etre 0";
          this.hasFormErrorsO6 = true;
          return;
     
         }
  
        }


        if(controls.tr_lot.value == null){
          this.sequenceService.getByOne({ seq_type: "TR", seq_profile: this.user.usrd_profile }).subscribe(
          (response: any) => {
        this.seqO6 = response.data 
            
            if (this.seqO6) {
             this.trlotO6 = `${this.seqO6.seq_prefix}-${Number(this.seqO6.seq_curr_val)+1}`
  
             this.sequenceService.update(this.seqO6.id,{ seq_curr_val: Number(this.seqO6.seq_curr_val )+1 }).subscribe(
              (reponse) => console.log("response", Response),
              (error) => { 
                this.message = "Erreur modification Sequence";
                this.hasFormErrorsO6 = true;
                return;
           
              
              },
              )
              let tr = this.prepare()
              this.addIt( this.datasetO6,tr, this.trlotO6);
            }else {
              this.message = "Parametrage Manquant pour la sequence";
              this.hasFormErrorsO6 = true;
              return;
         
             }
  
  
          })
        } 
        else{
          this.trlotO6= controls.tr_lot.value
          let difdataset = []
          for (var i = 0; i < this.datasetO6.length; i++) {
            console.log(this.datasetO6[i]);
            if(this.datasetO6[i].submitted != true)
            {difdataset.push(this.datasetO6[i]);
              console.log(difdataset)
            }
          }
          setTimeout(() => {
            console.log('delay')
          }, 2000);
          console.log(difdataset)
          let tr = this.prepare()
          this.addIt( difdataset,tr, this.trlotO6);
        } 
          
  

        // tslint:disable-next-line:prefer-const
       
      }
    
      prepare(){
        const controls = this.trFormO6.controls;
        const _tr = new InventoryTransaction();
        _tr.tr_lot = controls.tr_lot.value
        _tr.tr_effdate = controls.tr_effdate.value
        ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}`
        : null
        
       // _tr.tr_ex_rate = controls.tr_ex_rate.value
        
        _tr.tr_rmks = controls.tr_rmks.value
        _tr.tr_site = controls.tr_site.value
        _tr.tr_loc = controls.tr_loc.value
        _tr.tr_ref_site = controls.tr_ref_site.value
        _tr.tr_ref_loc = controls.tr_ref_loc.value
        return _tr
      }
      /**
       *
       * Returns object for saving
       */
      /**
       * Add po
       *
       * @param _it: it
       */
      addIt( detail: any, it, nlot) {
        for (let data of detail) {
          delete data.id;
          delete data.cmvid;
        }
        this.loadingSubject.next(true);
        const controls = this.trFormO6.controls;

    
        this.inventoryTransactionService
          .addTr({detail, it,nlot})
          .subscribe(
           (reponse: any) => {
            // console.log(reponse)
            // const arrayOctet = new Uint8Array(reponse.pdf.data)
            // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
            // const fileUrl = URL.createObjectURL(file);
            // window.open(fileUrl)
          },
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
         
          if (controls.print.value == true) this.printpdfO6(nlot);
            this.router.navigateByUrl("/");
            }
          );
      }
      
      /**
       * Go back to the list
       *
       */
      goBackO6() {
        this.loadingSubject.next(false);
        const url = `/`;
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
      }
    



      
      // add new Item to Datatable
      addNewItemO6() {
        this.gridServiceO6.addItem(
          {
            id: this.datasetO6.length + 1,
            tr_line: this.datasetO6.length + 1,
            tr_part: "",
            cmvid: "",
            desc: "",
            tr_qty_loc: 0,
            tr_um: "",
            tr_price: 0,
            cmvids: "",
            tr_serial: null,
            tr_status: null,
            tr_expire: null,
            submitted:false
          },
          { position: "bottom" }
        );
      }

      onChangePalO6() {
            /*kamel palette*/
            const controls = this.trFormO6.controls
            const ref = controls.ref.value
          var bol = false
            for(let ob of this.datasetO6) {

              if(ob.tr_ref == ref) {
                console.log("hnehnahna")
                bol = true
                break;
               
              }
            }
            if (!bol) {
            this.locationDetailService.getByOneRef({ ld_ref: ref  }).subscribe(
              (response: any) => {
                this.lddetO6 = response.data
                //console.log(this.lddet.ld_qty_oh)
            if (this.lddetO6 != null) {
             
              if(this.lddetO6.ld_site != controls.tr_site.value) {
                alert("Palette N'existe pas dans Ce Site")
   
               } else {
  
                if (this.lddetO6.ld_loc != controls.tr_loc.value) {
                  alert("Palette N'existe pas dans Cet Emplacement")
                }
                else {
             
             
              this.inventoryStatusService.getAllDetails({isd_status: this.lddetO6.ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                  console.log(resstat)
                  const { data } = resstat;

                  if (data) {
                    this.statO6 = null
                    alert("Status Interdit pour ce mouvement ")


                  } else {
                    this.statO6 = this.lddetO6.ld_status
                  
                    this.inventoryStatusService.getAllDetails({isd_status: this.statusrefO6, isd_tr_type: "RCT-TR" }).subscribe((resstatref:any)=>{
                      console.log(resstatref)
                      const { data1 } = resstatref;
    
              // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , qty_oh: this.lddet.ld_qty_oh,
              //   tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_cst_tot, tr_expire: this.lddet.ld_expire})
                   console.log(this.statusrefO6)
                   if (data1) {
                    this.statO6 = null
                    alert("Status Interdit pour ce mouvement ")


                  } else {
              this.inventoryStatusService.getByIsm({ism_loc_start: controls.tr_loc.value,ism_loc_end:controls.tr_ref_loc.value, ism_status_start: this.lddetO6.ld_status, 
                ism_status_end:this.statusrefO6 }).subscribe((resstat:any)=>{
                console.log(resstat)
                const { data } = resstat;
                if (data.length > 0) {
                  alert("Mouvement Interdit pour Status dans cet emplacement")
                  this.statO6 = null
                } 
                else{
                this.statO6 =  this.statusrefO6
                     
             
             this.itemsService.getByOne({pt_part: this.lddetO6.ld_part  }).subscribe(
              (respopart: any) => {
                console.log(respopart)

             this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: this.lddetO6.ld_part, sct_sim: 'STD-CG' }).subscribe(
              (respo: any) => {
                this.sctO6 = respo.data
                console.log(this.sctO6)
            

             this.gridServiceO6.addItem(
              {
                id: this.datasetO6.length + 1,
                tr_line: this.datasetO6.length + 1,
                tr_part: this.lddetO6.ld_part,
                cmvid: "",
                desc: respopart.data.pt_desc1,
                tr_qty_loc: this.lddetO6.ld_qty_oh,
                qty_oh: this.lddetO6.ld_qty_oh,
                tr_um: respopart.data.pt_um,
                tr_um_conv:1,
                tr_price: this.sctO6.sct_mtl_tl,
                cmvids: "",
                tr_ref: ref,
                tr_serial: this.lddetO6.ld_lot,
                tr_status: this.statO6,
                tr_expire: this.lddetO6.ld_expire,
                submitted: false
              },
              { position: "bottom" }
            );
         
             });
            }); 
          }
        })
          }
        })     
          }
          }); 
                }
            }
         


          }



            else {
            alert("Palette Nexiste pas")
          //  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
            }

            });

          }
          else {
            alert ("Palette déja scannée")
          }
      controls.ref.setValue(null)
      document.getElementById("ref").focus();
      }
      onChangeLoc() {
        const controls = this.trFormO6.controls;
        const loc_loc = controls.tr_loc.value;
        const loc_site = controls.tr_site.value;
       
        
            this.locationService.getByOne({ loc_site, loc_loc }).subscribe(
              (res: any) => {
                console.log(res)
               this.locationO6 = res.data
                if (this.locationO6 != null) {
                
                  if (this.rqmO6 == true){

                    for (var i = 0; i < this.datasetO6.length; i++) {
                      console.log(this.datasetO6[i].tr_part  )
                      let updateItem = this.gridServiceO6.getDataItemByRowIndex(i);
                      this.sctService.getByOne({ sct_site: loc_site, sct_part: this.datasetO6[i].tr_part, sct_sim: 'STD-CG' }).subscribe(
                        (response: any) => {
                          this.sctO6 = response.data
                         console.log(this.sctO6.sct_cst_tot)
                         let scttot = this.sctO6.sct_cst_tot
                         console.log(scttot)
                         updateItem.tr_price = scttot
                          this.locationDetailService.getBy({ ld_site: loc_site, ld_loc: loc_loc, ld_part: this.sctO6.sct_part, ld_lot: null }).subscribe(
                            (respo: any) => {
                              this.lddetO6 = respo.data
                              console.log(this.lddetO6[0].ld_qty_oh)
        
                              

                              this.inventoryStatusService.getAllDetails({isd_status: this.locationO6.loc_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                                console.log(resstat)
                                const { data } = resstat;
        
                                if (data) {
                                  this.statO6 = null
                                  this.expireO6 = null
                                } else {
                                  this.statO6 = this.lddetO6[0].ld_status
                                  this.expireO6 = this.lddetO6[0].ld_expire
                                }
                                
                                updateItem.qty_oh = this.lddetO6[0].ld_qty_oh
                                updateItem.tr_status = this.statO6
                                updateItem.tr_expire = this.expireO6
                                this.gridServiceO6.updateItem(updateItem);
                                 });     
                            });     
           
                               
                      });




                     }

                  }
              
                
                }else {
                  alert("Emplacement n'existe pas ")
                  controls.tr_loc.setValue("")
                  //console.log(response.data.length)
                  document.getElementById("tr_loc").focus();
                }
          })    
        
              
      }
    
      onChangeCCO6() {
        const controls = this.trFormO6.controls;
        const rqm_nbr = controls.tr_lot.value;
       
        this.datasetO6 = [];
            this.requisitionService.getBy({ rqm_nbr,rqm_aprv_stat: "3", rqm_open: true  }).subscribe(
              (res: any) => {
                console.log(res)
                const { requisition, details } = res.data;
               if (requisition != null) {
                const det1 = details;
                this.rqmO6 = true;
                
              
                for (var object = 0; object < det1.length; object++) {
                    const detail = details[object];
                    console.log(detail)
                      this.gridServiceO6.addItem(
                        {
                          id: detail.rqd_line, //this.dataset.length + 1,
                          tr_line: detail.rqd_line,   //this.dataset.length + 1,
                          tr_nbr: detail.rqd_nbr,
                         
                          tr_part: detail.rqd_part,
                          desc: detail.item.pt_desc1,
                          tr_qty_loc: detail.rqd_qty_ord ,
                          tr_um: detail.rqd_um,
                          tr_um_conv: 1,
                          tr_price: detail.item.pt_pur_price,



          //                tr_site: detail.rqd_site,
            //              tr_loc: detail.rqd_loc,
                        //  tr_serial: detail.rqd_serial,
                        //  tr_status: detail.rqd_status,
                        //  tr_expire: detail.rqd_expire,
                        },
                        { position: "bottom" }
                      );
              
            }
    
          }else {
            alert("Demande n'existe pas ")
            controls.tr_lot.setValue("")
            //console.log(response.data.length)
            document.getElementById("tr_lot").focus();
          }
          })    
        
              
      }



    initGridO6() {
        this.columnDefinitionsO6 = [
          {
            id: "id",
            field: "id",
            excludeFromHeaderMenu: true,
            formatter: Formatters.deleteIcon,
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
                this.angularGridO6.gridService.deleteItem(args.dataContext);
              }
            },
          },
    
          {
            id: "tr_line",
            name: "Ligne",
            field: "tr_line",
            minWidth: 50,
            maxWidth: 50,
            selectable: true,
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
                "openItemsGridO6"
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
            id: "tr_serial",
            name: "Lot/Serie",
            field: "tr_serial",
            sortable: true,
            width: 80,
            filterable: false,
            editor: {
              model: Editors.text,
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
              const controls = this.trFormO6.controls;
              this.locationDetailService.getBy({ ld_site: controls.tr_site.value, ld_loc: controls.tr_loc.value, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe(
                (response: any) => {
                  this.lddetO6 = response.data
                  
                  console.log(response.data.length)
                    if (response.data.length != 0) {
                     
                      this.inventoryStatusService.getAllDetails({isd_status: this.lddetO6[0].ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                        console.log(resstat)
                        const { data } = resstat;
          
                        if (data) {
                          alert("Status Interdit pour ce lot")
                          this.gridServiceO6.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0, tr_expire: null});
                        } 
                          else {
                            this.gridServiceO6.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddetO6[0].ld_qty_oh, tr_expire: this.lddetO6[0].ld_expire})
                   
                      
                          }
                      
                      })

                     
                    }
                    else {
                          this.gridServiceO6.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0});
        
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
              id: "tr_qty_loc",
              name: "QTE",
              field: "tr_qty_loc",
              sortable: true,
              width: 80,
              filterable: false,
              type: FieldType.float,
              editor: {
                  model: Editors.float,
                  params: { decimalPlaces: 2 },
                  required: true,
                  
                  
              },
          
              onCellChange: (e: Event, args: OnEventArgs) => {
                console.log(args.dataContext.tr_qty_loc)
                console.log(args.dataContext.tr_um_conv)
                const controls = this.trFormO6.controls
                if (args.dataContext.tr_qty_loc * args.dataContext.tr_um_conv   > args.dataContext.qty_oh) {
                    console.log('here')
                 alert ("Qte Manquante")
                 this.gridServiceO6.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
              //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
             
               
            
               // meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
              } else {
                if (this.rqmO6) {
                this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: args.dataContext.tr_part, sct_sim: 'STD-CG' }).subscribe(
                  (response: any) => {
                    this.sctO6 = response.data
                    this.gridServiceO6.updateItemById(args.dataContext.id,{...args.dataContext , tr_price: this.sctO6.sct_cst_tot  })
              
                  })
                }
              }

            }

              
          },
        
       
        
          {
              id: "tr_price",
              name: "Prix unitaire",
              field: "tr_price",
              sortable: true,
              width: 80,
              filterable: false,
              //type: FieldType.float,
              formatter: Formatters.decimal,
              
          },
                  
          {
            id: "tr_ref",
            name: "Palette",
            field: "tr_ref",
            sortable: true,
            width: 80,
            filterable: false,
            //type: FieldType.float,
            editor: {
              model: Editors.text,
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
            
            }
            
        },
             
          {
            id: "tr_status",
            name: "Status",
            field: "tr_status",
            sortable: true,
            width: 80,
            filterable: false,
        
          },
          
        ];
    
        this.gridOptionsO6 = {
          asyncEditorLoading: false,
          editable: true,
          enableColumnPicker: true,
          enableCellNavigation: true,
          enableRowSelection: true,
          autoHeight:false,
          autoCommitEdit:true,
          enableAutoResize:true,
          formatterOptions: {
            
            
            // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
            displayNegativeNumberWithParentheses: true,
      
            // Defaults to undefined, minimum number of decimals
            minDecimal: 2,
      
            // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
            thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
        }
      }
        this.datasetO6 = [];
     
    }


    handleSelectedRowsChangedsiteO6(e, args) {
        const controls = this.trFormO6.controls;
       
        if (Array.isArray(args.rows) && this.gridObjsiteO6) {
          args.rows.map((idx) => {
            const item = this.gridObjsiteO6.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedFieldO6) {
              case "tr_site": {
                controls.tr_site.setValue(item.si_site || "");
                break;
              }
              case "tr_ref_site": {
                controls.tr_ref_site.setValue(item.si_site || "");
                break;
              }
              default:
                break;
            }
          });
        }
    }


    angularGridReadysiteO6(angularGrid: AngularGridInstance) {
        this.angularGridsiteO6 = angularGrid;
        this.gridObjsiteO6 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridsiteO6() {
        this.columnDefinitionssiteO6 = [
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
    
        this.gridOptionssiteO6 = {
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
          .subscribe((response: any) => (this.datasiteO6 = response.data));
      }
      opensiteO6(contentsiteO6, fieldO6) {
        this.selectedFieldO6 = fieldO6;
        this.prepareGridsiteO6();
        this.modalService.open(contentsiteO6, { size: "lg" });
      }
      

    handleSelectedRowsChangedlocO6(e, args) {
        const controls = this.trFormO6.controls;
    
        if (Array.isArray(args.rows) && this.gridObjlocO6) {
          args.rows.map((idx) => {
            const item = this.gridObjlocO6.getDataItem(idx);
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedFieldO6) {
              case "tr_loc": {
                controls.tr_loc.setValue(item.loc_loc || "");
                break;
              }
              case "tr_ref_loc": {
                controls.tr_ref_loc.setValue(item.loc_loc || "");
                this.statusrefO6 = item.loc_status
                break;
              }
              default:
                break;
            }
          });
        }
    }
    angularGridReadylocO6(angularGrid: AngularGridInstance) {
        this.angularGridlocO6 = angularGrid;
        this.gridObjlocO6 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridlocO6() {
        const controls = this.trFormO6.controls;
         
        switch (this.selectedFieldO6) {
            case "tr_loc": {
            this.sitO6 =  controls.tr_site.value;
              break;
            }
            case "tr_ref_loc": {
             this.sitO6 = controls.tr_ref_site.value;
              break;
            }
            default:
              break;
          }
        this.columnDefinitionslocO6 = [
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
            id: "loc_loc",
            name: "loc",
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
        ];
    
        this.gridOptionslocO6 = {
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
        this.locationService
          .getBy({ loc_site: this.sitO6 })
          .subscribe((response: any) => (this.datalocO6 = response.data));
      }
      openlocO6(contentlocO6, fieldO6) {
        this.selectedFieldO6 = fieldO6;
        this.prepareGridlocO6();
        this.modalService.open(contentlocO6, { size: "lg" });
      }
      changeSite() {
        const controls = this.trFormO6.controls; // chof le champs hada wesh men form rah
        const si_site = controls.tr_site.value;
        this.siteService.getByOne({ si_site }).subscribe(
          (res: any) => {
              console.log(res)
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "ce Site n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
      changeSiteRefO6() {
        const controls = this.trFormO6.controls; // chof le champs hada wesh men form rah
        const si_site = controls.tr_ref_site.value;
        this.siteService.getByOne({ si_site }).subscribe(
          (res: any) => {
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "ce Site n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
    
      changeLocO6() {
        const controls = this.trFormO6.controls; // chof le champs hada wesh men form rah
        const loc_loc = controls.tr_loc.value;
        const loc_site = controls.tr_site.value;
    
        this.locationService.getByOne({ loc_loc, loc_site }).subscribe(
          (res: any) => {
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "cet Emplacement n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
            }
          },
          (error) => console.log(error)
        );
      }
      changeLocRefO6() {
        const controls = this.trFormO6.controls; // chof le champs hada wesh men form rah
        const loc_loc = controls.tr_ref_loc.value;
        const loc_site = controls.tr_ref_site.value;
    
        this.locationService.getByOne({ loc_loc, loc_site }).subscribe(
          (res: any) => {
            const { data } = res;
    
            if (!data) {
              this.layoutUtilsService.showActionNotification(
                "cet Emplacement n'existe pas!",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
            } else {
              this.error = false;
              this.statusrefO6 = data.loc_status
               
            }
          },
          (error) => console.log(error)
        );
      }
   
      
      handleSelectedRowsChanged4O6(e, args) {
       const controls = this.trFormO6.controls;
        let updateItem = this.gridServiceO6.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObj4O6) {
          args.rows.map((idx) => {
            const item = this.gridObj4O6.getDataItem(idx);
            console.log(item);
    
            //this.locationService.getByOne({ loc_loc: controls.tr_ref_loc.value, loc_site: controls.tr_ref_site.value }).subscribe(
             // (response: any) => {
              //  this.location = response.data
            
              this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: item.pt_part, sct_sim: 'STD-CG' }).subscribe(
                (response: any) => {
                  this.sctO6 = response.data
              

                  this.locationDetailService.getByOne({ ld_site: controls.tr_site.value, ld_loc: controls.tr_loc.value, ld_part: item.pt_part, ld_lot: null , ld_ref: null}).subscribe(
                    (response: any) => {
                      this.lddetO6 = response.data
                      //console.log(this.lddet.ld_qty_oh)

if (this.lddetO6 != null)
{                  this.inventoryStatusService.getAllDetails({isd_status: this.lddetO6.ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
                    console.log(resstat)
                    const { data } = resstat;
  
                    if (data) {
                      this.statO6 = null
                    } else {
                     // this.stat = this.lddet.ld_status

                      this.inventoryStatusService.getAllDetails({isd_status: this.statusrefO6, isd_tr_type: "RCT-TR" }).subscribe((resstatref:any)=>{
                        console.log(resstatref)
                        const { data } = resstatref;
      
                        if (data) {
                          this.statO6 = null
                        } else {
                          this.statO6 = this.statusrefO6
    
                        

                              this.inventoryStatusService.getByIsm({ism_loc_start: controls.tr_loc.value,ism_loc_end:controls.tr_ref_loc.value, ism_status_start: this.lddetO6.ld_status, 
                                ism_status_end:this.statusrefO6 }).subscribe((resstatd:any)=>{
                                console.log(resstatd)
                                const { data } = resstatd;
                                if (data.length > 0) {
                                 
                                  this.statO6 = null
                                 
                                } 
                                else{
                                this.statO6 =  this.statusrefO6

                                
                                }  
                                updateItem.tr_part = item.pt_part;
                                updateItem.desc = item.pt_desc1;
                                updateItem.tr_um = item.pt_um;
                                updateItem.tr_um_conv = 1;
                                updateItem.qty_oh =  this.lddetO6.ld_qty_oh;
                                updateItem.tr_price = this.sctO6.sct_mtl_tl;
                                
                                updateItem.tr_status =  this.statO6;
                                updateItem.tr_expire =  this.lddetO6.ld_expire;
                              })


/*************fin */
                          
                        }
                      })
                    }
  






                   
                          
                    
                    this.gridServiceO6.updateItem(updateItem);
                  });
                  } 
                  else {
                    updateItem.tr_part = item.pt_part;
                    updateItem.desc = item.pt_desc1;
                    updateItem.tr_um = item.pt_um;
                    updateItem.tr_um_conv = 1;
                    updateItem.qty_oh =  0;
                    updateItem.tr_price = this.sctO6.sct_mtl_tl;
                    
                    updateItem.tr_status =  null;
                    updateItem.tr_expire =  null;
                          
                    
                    this.gridServiceO6.updateItem(updateItem);
                 

                  }
                  
                });       
              });   
           // });
          });
   
        }
      }
      angularGridReady4O6(angularGrid: AngularGridInstance) {
        this.angularGrid4O6 = angularGrid;
        this.gridObj4O6 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGrid4O6() {
        this.columnDefinitions4O6 = [
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
    
        this.gridOptions4O6 = {
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
          .subscribe((response: any) => (this.itemsO6 = response.data));
      }
      open4O6(content) {
        this.prepareGrid4O6();
        this.modalService.open(content, { size: "lg" });
      }
      

      handleSelectedRowsChangedlocdetO6(e, args) {
        const controls = this.trFormO6.controls;
        let updateItem = this.gridServiceO6.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObjlocdetO6) {
          args.rows.map((idx) => {
            const item = this.gridObjlocdetO6.getDataItem(idx);
            console.log(item);
    
            this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-TR" }).subscribe((resstat:any)=>{
              console.log(resstat)
              const { data } = resstat;

              if (data) {
                alert("Mouvement interdit pour ce Status ")
                updateItem.tr_status = null;
               
              } 
                else { 

                  this.inventoryStatusService.getAllDetails({isd_status: this.statusrefO6, isd_tr_type: "RCT-TR" }).subscribe((resstatref:any)=>{
                    console.log(resstatref)
                    const { data } = resstatref;
      
                    if (data) {
                      alert("Mouvement interdit pour ce Status ")
                      updateItem.tr_status = null;
                     
                    } 
                    else {

                      this.inventoryStatusService.getByIsm({ism_loc_start: controls.tr_loc.value,ism_loc_end:controls.tr_ref_loc.value, ism_status_start: item.ld_status, 
                        ism_status_end:this.statusrefO6 }).subscribe((resstatd:any)=>{
                        console.log(resstatd)
                        const { data } = resstatd;
                        if (data.length > 0) {
                          alert("Mouvement Interdit pour Status dans cet emplacement")
                          this.statO6 = null
                          updateItem.tr_status = null;
                        } 
                        else{
                        this.statO6 =  this.statusrefO6
                          updateItem.tr_ref = item.ld_ref;
                          updateItem.tr_serial = item.ld_lot;
                          updateItem.tr_expire = item.ld_expire;
                          updateItem.qty_oh = item.ld_qty_oh;
                          updateItem.tr_status = this.statO6;
                        }  
                      })
                    }  
                })
                }
            this.gridServiceO6.updateItem(updateItem);
            
            })
          
          });
        }
      }
      angularGridReadylocdetO6(angularGrid: AngularGridInstance) {
        this.angularGridlocdetO6 = angularGrid;
        this.gridObjlocdetO6 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridlocdetO6() {
        const controls = this.trFormO6.controls; 

        this.columnDefinitionslocdetO6 = [
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
            id: "ld_ref",
            name: "Palette",
            field: "ld_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
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
            id: "ld_qty_oh",
            name: "Qte",
            field: "ld_qty_oh",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          {
            id: "ld_expire",
            name: "Expire",
            field: "ld_expire",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
          },
        ];
    
        this.gridOptionslocdetO6 = {
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
          let updateItem = this.gridServiceO6.getDataItemByRowIndex(this.row_number);
        
        // fill the dataset with your data
        this.locationDetailService
          .getBy({ ld_site:  controls.tr_site.value , ld_loc: controls.tr_loc.value  , ld_part:  updateItem.tr_part })
          .subscribe((response: any) => (this.datalocdetO6 = response.data));
      }
      openlocdetO6(contentlocdetO6) {
        this.prepareGridlocdetO6();
        this.modalService.open(contentlocdetO6, { size: "lg" });
      }
      handleSelectedRowsChangedumV(e, args) {
        let updateItem = this.gridServiceO6.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObjumO6) {
          args.rows.map((idx) => {
            const item = this.gridObjumO6.getDataItem(idx);
            updateItem.tr_um = item.code_value;
         
            this.gridServiceO6.updateItem(updateItem);


          this.itemsService.getBy({pt_part: updateItem.tr_part }).subscribe((resp:any)=>{
                          
            if   (updateItem.tr_um == resp.data.pt_um )  {
              
              updateItem.tr_um_conv = 1
            } else { 
              //console.log(resp.data.pt_um)



                this.mesureService.getBy({um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;

              if (data) {
               // alert ("Mouvement Interdit Pour ce Status")
                updateItem.tr_um_conv = res.data.um_conv 
         
         
                if (updateItem.tr_qty_loc * Number(res.data.um_conv) >  updateItem.qty_oh) {
                  console.log('here')
                  alert ("Qte Manquante")
                   updateItem.tr_qty_loc = null 
           
             
                } else {
              
                  updateItem.tr_um_conv = res.data.um_conv


                }


              } else {
                this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
                  console.log(res)
                  const { data } = res;
                  if (data) {
                    //alert ("Mouvement Interdit Pour ce Status")
                     

                    if (updateItem.tr_qty_loc * Number(res.data.um_conv) >  updateItem.qty_oh) {
                      console.log('here')
                      alert ("Qte Manquante")
                      updateItem.tr_qty_loc = null 
                 
                    } else {
                  
    
                      updateItem.tr_um_conv = res.data.um_conv

                    }
    
    


                    
                    
                  } else {
                    updateItem.tr_um_conv = 1
                    updateItem.tr_um = null
            
                    alert("UM conversion manquante")
                    
                  }  
                })

              }
                })

              }
              })


/***********/








          });
        }
      }
    angularGridReadyumO6(angularGrid: AngularGridInstance) {
        this.angularGridumO6 = angularGrid
        this.gridObjumO6 = (angularGrid && angularGrid.slickGrid) || {}
    }
    
    prepareGridumO6() {
        this.columnDefinitionsumO6 = [
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
    
        this.gridOptionsumO6 = {
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
            .subscribe((response: any) => (this.umsO6 = response.data))
    }
    openumO6(contentO6) {
        this.prepareGridumO6()
        this.modalService.open(contentO6, { size: "lg" })
    }
    handleSelectedRowsChangedstatusO6(e, args) {
      const controls = this.trFormO6.controls;
      let updateItem = this.gridServiceO6.getDataItemByRowIndex(this.row_number);
      if (Array.isArray(args.rows) && this.gridObjstatusO6) {
        args.rows.map((idx) => {
          const item = this.gridObjstatusO6.getDataItem(idx);

          this.inventoryStatusService.getAllDetails({isd_status: item.is_status, isd_tr_type: "RCT-TR" }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;
  
          if (data) {
            alert ("Mouvement Interdit Pour ce Status")
            updateItem.tr_status = null;
       
            this.gridServiceO6.updateItem(updateItem);
          }else {
            console.log("hhhhhhhhhhhhhhhhhhhhhhhhh")
            let obj = {}
            obj = {
               ld_site: controls.tr_ref_site.value, 
               ld_loc: controls.tr_ref_loc.value, 
               ld_part: updateItem.tr_part,
               ld_lot: updateItem.tr_lot,
              }
              console.log(obj)
              status = item.is_status
            console.log(status)
            this.locationDetailService.getByStatus({obj, status} ).subscribe(
              (response: any) => {
               console.log(response.data.length != 0   )
                if (response.data.length != 0) {
                  
                    alert("lot existe avec un autre status")
 
                    updateItem.tr_status = null;
       
                }  else { 


                  updateItem.tr_status = item.is_status;
       
                } 

                this.gridServiceO6.updateItem(updateItem);

          
            })
          }

  
          })

                  });
      }
    }
  

  angularGridReadystatusO6(angularGrid: AngularGridInstance) {
      this.angularGridstatusO6 = angularGrid
      this.gridObjstatusO6 = (angularGrid && angularGrid.slickGrid) || {}
  }

  prepareGridstatusO6() {
      this.columnDefinitionsstatusO6 = [
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
          id: "is_status",
          name: "Status",
          field: "is_status",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_desc",
          name: "Designation",
          field: "is_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_avail",
          name: "Disponible",
          field: "is_avail",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_nettable",
          name: "Gerer MRP",
          field: "is_nettable",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "is_overissue",
          name: "Sortie Excedent",
          field: "is_overissue",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
    
    
      ];
    
      this.gridOptionsstatusO6 = {
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
      this.inventoryStatusService
        .getAll()
        .subscribe((response: any) => (this.statussO6 = response.data));
       
  }
  openstatusO6(contentO6) {
      this.prepareGridstatusO6()
      this.modalService.open(contentO6, { size: "lg" })
  }

  

  /*choisir demande achat*/
  handleSelectedRowsChanged5O6(e, args) {
    const controls = this.trFormO6.controls;
    
    
    
    if (Array.isArray(args.rows) && this.gridObj5O6) {
      this.datasetO6 = []
      args.rows.map((idx) => 
      {
        const item = this.gridObj5O6.getDataItem(idx);
        controls.tr_lot.setValue(item.tr_lot || "");
        
        controls.tr_site.setValue(item.tr_ref_site || "");
        controls.tr_loc.setValue(item.tr_ref_loc || "");
        controls.tr_rmks.setValue(item.tr_rmks || "");
        controls.tr_ref_site.setValue(item.tr_site || "");
        controls.tr_ref_loc.setValue(item.tr_loc || "");
        let oldata=[]
        this.inventoryTransactionService.getByRef({ tr_lot: item.tr_lot,tr_type:'RCT-TR',tr_effdate:item.tr_effdate }).subscribe(
          (res: any) => {
            oldata = res.data
            for (let i = 0; i < oldata.length; i++)
            {
              this.gridServiceO6.addItem(
                {
                  id: this.datasetO6.length + 1,
                  tr_line: this.datasetO6.length + 1,
                  tr_part: res.data[i].tr_part,
                  cmvid: "",
                  desc: res.data[i].tr_desc,
                  tr_qty_loc: res.data[i].tr_qty_loc,
                  qty_oh: 0,
                  tr_um: res.data[i].tr_um,
                  tr_um_conv:1,
                  tr_price:res.data[i].tr_price,
                  cmvids: "",
                  tr_ref: res.data[i].tr_ref,
                  tr_serial: res.data[i].tr_serial,
                  tr_status: res.data[i].tr_status,
                  tr_expire: res.data[i].tr_expire,
                  submitted: true
                },
                { position: "bottom" }
              );
            }
            
         
          },
          (error) => {
            this.message = `Récéption n'existe pas`;
            this.hasFormErrorsO6 = true;
          },
          () => {}
        );
        

    this.locationService.getByOne({ loc_loc:item.tr_loc, loc_site:item.tr_site }).subscribe(
      (res: any) => {
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "cet Emplacement n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
        } else {
          this.error = false;
          this.statusrefO6 = data.loc_status
           
        }
      },
      (error) => console.log(error)
    );
    
        
      
        })
    }
   // this.calculatetot();
  }
  
  angularGridReady5O6(angularGrid: AngularGridInstance) {
    this.angularGrid5O6 = angularGrid;
    this.gridObj5O6 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid5O6() {
    this.columnDefinitions5O6 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "tr_lot",
        name: "N° Récéption",
        field: "tr_lot",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tr_effdate",
        name: "Date",
        field: "tr_effdate",
        sortable: true,
        filterable: true,
        formatter:Formatters.dateIso ,
        type: FieldType.dateIso,
        filter: {
          model: Filters.dateRange,
          operator: 'RangeInclusive',
          // override any of the Flatpickr options through "filterOptions"
          //editorOptions: { minDate: 'today' } as FlatpickrOption
        },
      },
      {
        id: "tr_site",
        name: "Site",
        field: "tr_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tr_loc",
        name: "emplacement",
        field: "tr_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tr_ref_site",
        name: "Site",
        field: "tr_ref_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "tr_ref_loc",
        name: "emplacement",
        field: "tr_ref_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];
  
    this.gridOptions5O6 = {
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
   const controls = this.trFormO6.controls
    // fill the dataset with your data
    this.inventoryTransactionService
      .getByGroup({ tr_type:"RCT-TR" })
      .subscribe((response: any) => (this.transactionsO6 = response.data));
  }
  open5O6(contentO6) {
    this.prepareGrid5O6();
    this.modalService.open(contentO6, { size: "lg" });
  }
  
  
  printpdfO6(nbr) {
    // const controls = this.totForm.controls
    const controlss = this.trFormO6.controls;
    console.log("pdf");
    var doc = new jsPDF();
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

    doc.line(10, 35, 200, 35);
    doc.setFontSize(12);
    doc.text("Bon Transfert N° : " + nbr, 70, 45);
    doc.text("Date: " + date.toLocaleDateString() , 160, 45);
    
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      
     
    doc.setFontSize(8);
    //console.log(this.provider.ad_misc2_id)
    doc.text("Site Source : " + controlss.tr_site.value, 20, 50);
    doc.text("Magasin     : " + controlss.tr_loc.value, 100, 50);
    doc.text("Site Dest   : " + controlss.tr_ref_site.value, 20, 55);
    doc.text("Emplacement     : " + controlss.tr_ref_loc.value, 100, 55);
    doc.text("Je soussigne, Mme, Mr:                              Fonction:               " , 100, 60);
        doc.text("Déclare avoir reçu les articles cité ci-dessous:               " , 100, 65);
        
   

    doc.line(10, 85, 205, 85);
    doc.line(10, 90, 205, 90);
    doc.line(10, 85, 10, 90);
    doc.text("LN", 12.5, 88.5);
    doc.line(20, 85, 20, 90);
    doc.text("Code Article", 25, 88.5);
    doc.line(45, 85, 45, 90);
    doc.text("Désignation", 67.5, 88.5);
    doc.line(100, 85, 100, 90);
    doc.text("QTE", 107, 88.5);
    doc.line(120, 85, 120, 90);
    doc.text("UM", 123, 88.5);
    doc.line(130, 85, 130, 90);
    doc.text("Lot/Série", 152, 88.5);
    doc.line(170, 85, 170, 90);
    doc.text("N Etiquette", 172, 88.5);
    doc.line(185, 85, 185, 90);
    var i = 95;
    doc.setFontSize(6);
    let total = 0
    for (let j = 0; j < this.datasetO6.length  ; j++) {
      total = total + Number(this.datasetO6[j].tr_qty_loc)
      
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
        doc.line(10, 35, 200, 35);

        doc.setFontSize(12);
        doc.text("Bon Transfert N° : " + nbr, 70, 45);
        doc.text("Date: " + date.toLocaleDateString() , 160, 45);
        
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      
      
        doc.setFontSize(8);
        //console.log(this.provider.ad_misc2_id)
        doc.text("Site Source : " + controlss.tr_site.value, 20, 50);
        doc.text("Magasin     : " + controlss.tr_loc.value, 100, 50);
        doc.text("Site Dest   : " + controlss.tr_ref_site.value, 20, 55);
        doc.text("Emplacement     : " + controlss.tr_ref_loc.value, 100, 55);
        doc.text("Je soussigne, Mme, Mr:                              Fonction:               " , 100, 60);
        doc.text("Déclare avoir reçu les articles cité ci-dessous:               " , 100, 65);
        doc.line(10, 85, 205, 85);
        doc.line(10, 90, 205, 90);
        doc.line(10, 85, 10, 90);
        doc.text("LN", 12.5, 88.5);
        doc.line(20, 85, 20, 90);
        doc.text("Code Article", 25, 88.5);
        doc.line(45, 85, 45, 90);
        doc.text("Désignation", 67.5, 88.5);
        doc.line(100, 85, 100, 90);
        doc.text("QTE", 107, 88.5);
        doc.line(120, 85, 120, 90);
        doc.text("UM", 123, 88.5);
        doc.line(130, 85, 130, 90);
        doc.text("Lot/Série", 152, 88.5);
        doc.line(170, 85, 170, 90);
        doc.text("N Etiquette", 172, 88.5);
        doc.line(185, 85, 185, 90);
        i = 95;
        doc.setFontSize(6);
      }

      if (this.datasetO6[j].desc.length > 45) {
        let desc1 = this.datasetO6[j].desc.substring(45);
        let ind = desc1.indexOf(" ");
        desc1 = this.datasetO6[j].desc.substring(0, 45 + ind);
        let desc2 = this.datasetO6[j].desc.substring(45 + ind);

        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + Number(j + 1)).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.datasetO6[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.datasetO6[j].tr_qty_loc)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.datasetO6[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.datasetO6[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.datasetO6[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        // doc.line(10, i, 200, i );

        i = i + 5;

        doc.text(desc2, 47, i - 1);

        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(130, i - 5, 130, i);
        doc.line(150, i - 5, 150, i);
        doc.line(170, i - 5, 170, i);
        doc.line(185, i - 5, 185, i);
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 200, i);

        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + Number(j + 1)).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.datasetO6[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.datasetO6[j].desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.datasetO6[j].tr_qty_loc)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.datasetO6[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.datasetO6[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.datasetO6[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.line(10, i, 205, i);
        i = i + 5;
      }
    }
    // doc.text("NOMBRE DE BIG BAG    " + String(this.dataset.length) + "    ,TOTAL POIDS:   " + String(Number(total)), 40, i + 12, { align: "left" });
    doc.text("Validé par: " , 20, i + 22);
    doc.text("Note: " , 20, i + 32);
    doc.save('TRANSFERT-' + nbr + '.pdf')
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
  // FIN ONGLET 6
  createFormO7() {
      const date = new Date ;
      date.setDate(date.getDate() - 2);
      const date1 = new Date;
      this.trFormO7 = this.trFB.group({
      
        date: [{
          year:date.getFullYear(),
          month: date.getMonth()+1,
          day: 1
        }],
        date1: [{
          year:date1.getFullYear(),
          month: date1.getMonth()+1,
          day: date1.getDate()
        }],
        
      
      });
    }
    angularGridReadyO7(angularGrid: AngularGridInstance) {
      this.angularGridO7 = angularGrid;
      this.gridO7 = angularGrid.slickGrid; // grid object
      this.dataviewO7 = angularGrid.dataView;
      this.gridServiceO7 = angularGrid.gridService;
    }
    prepareGridO7() {
  
  
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();
   this.datefilterO7 =  String(currentYear) + '-' + String(currentMonth) + '-' + '01'
       
        this.columnDefinitionsO7 = [
            
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
              id: "dec01",
              name: "Année",
              field: "dec01",
              sortable: true,
              filterable: true,
                        
              type: FieldType.float,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
              
              grouping: {
                getter: 'dec01',
                formatter: (g) => `Annee: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('tr_qty_loc')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
            },
            {
              id: "dec02",
              name: "MOIS",
              field: "dec02",
              sortable: true,
              filterable: true,
              type: FieldType.float,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
              grouping: {
                getter: 'dec02',
                formatter: (g) => `Mois: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('tr_qty_loc')],
                aggregateCollapsed: true,
               
                collapsed:true
              }
            },
            // {
            //   id: "tr_site",
            //   name: "Site",
            //   field: "tr_site",
            //   sortable: true,
            //   filterable: true,
            //   type: FieldType.string,
              
            //   filter: {
    
            //     model: Filters.compoundInput , operator: OperatorType.rangeInclusive,
                
            //    },
            //   grouping: {
            //     getter: 'tr_site',
            //     formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            //     aggregators: [
            //       // (required), what aggregators (accumulator) to use and on which field to do so
            //      // new Aggregators.Avg('tr_qty_loc'),
            //       new Aggregators.Sum('tr_qty_loc')
            //     ],
                
            //     aggregateCollapsed: true,
              
            //     collapsed:true
            //   }
            // }, 
            // {
            //   id: "tr_loc",
            //   name: "Emplacement",
            //   field: "tr_loc",
            //   sortable: true,
            //   filterable: true,
            //   type: FieldType.string,
            //   filter: {
            //    model: Filters.compoundInput , operator: OperatorType.rangeInclusive,
                
            //    },
            //   grouping: {
            //     getter: 'tr_loc',
            //     formatter: (g) => `Emplacement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            //     aggregators: [
            //       // (required), what aggregators (accumulator) to use and on which field to do so
            //      // new Aggregators.Avg('tr_qty_loc'),
            //       new Aggregators.Sum('tr_qty_loc')
            //     ],
                
            //     aggregateCollapsed: true,
               
            //     collapsed:true
            //   }
            // },
            {
              id: "tr_addr",
              name: "Adresse",
              field: "tr_addr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {
  
               model: Filters.compoundInput , operator: OperatorType.rangeInclusive,
                
               },
              grouping: {
                getter: 'tr_addr',
                formatter: (g) => `Adresse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
               
                collapsed:true
              }
            }, 
            {
              id: "tr_part",
              name: "Article",
              field: "tr_part",
              sortable: true,
              filterable: true,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              type: FieldType.string,
              grouping: {
                getter: 'tr_part',
               
                formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
              
                collapsed:true
              }
            }, 
            {
              id: "tr_desc",
              name: "Description",
              field: "tr_desc",
              sortable: true,
              filterable: true,
              filter: { model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
  
              type: FieldType.string,
              grouping: {
                getter: 'tr_desc',
                formatter: (g) => `Description: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
               
                collapsed:true
              }
            }, 
            {
              id: "tr__chr01",
              name: "FAMILLE",
              field: "tr__chr01",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
              grouping: {
                getter: 'tr__chr01',
                formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            }, 
            {
              id: "tr__chr02",
              name: "COULEUR",
              field: "tr__chr02",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {collectionAsync:  this.http.get(`${API_URL_codes}/colors`),model: Filters.multipleSelect , operator: OperatorType.inContains },
              grouping: {
                getter: 'tr__chr02',
                formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            }, 
            {
              id: "tr__chr03",
              name: "Etat",
              field: "tr__chr03",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
              grouping: {
                getter: 'tr__chr03',
                formatter: (g) => `Etat: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation:true,
                collapsed:true
              }
              
            }, 
            {
              id: "tr_serial",
              name: "Lot",
              field: "tr_serial",
              sortable: true,
              filterable: true,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              type: FieldType.string,
              grouping: {
                getter: 'tr_serial',
                formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
                
                collapsed:true
              }
            },
            {
              id: "tr_um",
              name: "UM",
              field: "tr_um",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
            }, 
            {
              id: "tr_qty_loc",
              name: "Quantite",
              field: "tr_qty_loc",
              sortable: true,
              filterable: true,
              groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
              type: FieldType.float,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
            },
              {
              id: "tr_status",
              name: "Status",
              field: "tr_status",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              grouping: {
                getter: 'tr_status',
                formatter: (g) => `Status: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                aggregateCollapsed: true,
               
                collapsed:true
              }
            }, 
  
  
            {
              id: "tr_ref",
              name: "Reference",
              field: "tr_ref",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
                getter: 'tr_ref',
                formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                 
                  new Aggregators.Sum('tr_qty_loc')
                ],
                
                aggregateCollapsed: true,
             
                collapsed:true
              }
            }, 
            
            {
              id: "tr_effdate",
              name: "Date Effet",
              field: "tr_effdate",
              nameKey: 'DATE EFFET',
              sortable: true,
            
  
              formatter: Formatters.dateIso, 
              minWidth: 75,
              width: 120,
              exportWithFormatter: true,
  
              type: FieldType.date,
              filterable: true,
              filter: {
                model: Filters.dateRange,
                operator: 'RangeInclusive',
                // override any of the Flatpickr options through "filterOptions"
                //editorOptions: { minDate: 'today' } as FlatpickrOption
              },
                
              grouping: {
                getter: 'tr_effdate',
                formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                
                aggregateCollapsed: true,
                
                collapsed:true
              }
            },
  
            {
              id: "tr_program",
              name: "Heure",
              field: "tr_program",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {model: Filters.compoundInput , operator: OperatorType.contains },
             
  //            filter: { model: Filters.dateRange },
    //          type: FieldType.date,
      //        filterable: true,
            },
            {
              id: "tr_so_job",
              name: "Palette origine",
              field: "tr_so_job",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              filter: {model: Filters.compoundInput , operator: OperatorType.contains },
             
  //            filter: { model: Filters.dateRange },
    //          type: FieldType.date,
      //        filterable: true,
            },
            
            // {
            //   id: "tr_expire",
            //   name: "Expire Le",
            //   field: "tr_expire",
            //   sortable: true,
            //   filterable: true,
            //   type: FieldType.dateTimeIso,
            //   grouping: {
            //     getter: 'tr_expire',
            //     formatter: (g) => `Expire Le: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            //     aggregators: [
            //       // (required), what aggregators (accumulator) to use and on which field to do so
            //      // new Aggregators.Avg('tr_qty_loc'),
            //       new Aggregators.Sum('tr_qty_loc')
            //     ],
                
            //     aggregateCollapsed: true,
                
            //     collapsed:true
            //   }
            // }, 
            {
              id: "tr_type",
              name: "Type Transaction",
              field: "tr_type",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            
              filter: {
  
                
                // collectionAsync: this.elem,
                collectionAsync:  this.http.get(`${API_URL_codes}/trans`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
             
                model: Filters.multipleSelect , operator: OperatorType.inContains
               
                
                
               },
              //filter: {model: Filters.multipleSelect , operator: OperatorType.contains },
              grouping: {
                getter: 'tr_type',
                formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                
                aggregateCollapsed: true,
                
                collapsed:true
              }
            },
            {
              id: "tr_nbr",
              name: "N° Bon",
              field: "tr_nbr",
              sortable: true,
              filterable: true,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              type: FieldType.string,
              grouping: {
                getter: 'tr_nbr',
                formatter: (g) => `N° Bon: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                
                aggregateCollapsed: true,
                
                collapsed:true
              }
            },
            {
              id: "tr_lot",
              name: "N° Doc ",
              field: "tr_lot",
              sortable: true,
              filterable: true,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              type: FieldType.string,
              grouping: {
                getter: 'tr_lot',
                formatter: (g) => `N° : ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                
                aggregateCollapsed: true,
                
                collapsed:true
              }
            }, 
            {
              id: "tr_rmks",
              name: "Cause",
              field: "tr_rmks",
              sortable: true,
              filterable: true,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              type: FieldType.string,
              grouping: {
                getter: 'tr_rmks',
                formatter: (g) => `Cause: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                
                aggregateCollapsed: true,
                
                collapsed:true
              }
            },
            {
              id: "last_modified_by",
              name: "Par",
              field: "last_modified_by",
              sortable: true,
              filterable: true,
              filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
              type: FieldType.string,
              grouping: {
                getter: 'last_modified_by',
                formatter: (g) => `Par: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  // (required), what aggregators (accumulator) to use and on which field to do so
                 // new Aggregators.Avg('tr_qty_loc'),
                  new Aggregators.Sum('tr_qty_loc')
                ],
                
                aggregateCollapsed: true,
                
                collapsed:true
              }
            },    
  
        ]
  
        this.gridOptionsO7 = {
          editable:true,
          enableDraggableGrouping: true,
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableCellNavigation:true,
          checkboxSelector: {
            hideInFilterHeaderRow: false,
            hideInColumnTitleRow: true,
           
          },
          rowSelectionOptions: {
           
            selectActiveRow: false
          },
          enableCheckboxSelector:true,
          autoHeight:false,
          
          enableAutoResize: true,
          showCustomFooter: true, // display some metrics in the bottom custom footer
          exportOptions: {
            sanitizeDataExport: true
          },
          enablePagination: true,
          pagination: {
            pageSizes: [5, 10, 50,100,1000,50000,999999999],
            pageSize: 100
          },
          presets: {
            filters: [ 
             
            ],
            sorters: [
             
            ],
            columns:[{columnId:"line",width:50},{columnId:"dec01",width:50},{columnId:"dec02",width:50},{columnId:"last_modified_by",width:50},{columnId:"tr_effdate",width:50},{columnId:"tr_program",width:50},{columnId:"tr_addr",width:50},{columnId:"tr__chr01",width:50},{columnId:"tr__chr02",width:50},{columnId:"tr__chr03",width:50},{columnId:"tr_serial",width:50},{columnId:"tr_ref",width:50}, {columnId:"tr_qty_loc",width:50}, {columnId:"tr_status",width:50}, {columnId:"tr_rmks",width:50},{columnId:"tr_type",width:50},{columnId:"tr_so_job",width:50},{columnId:"tr_lot",width:50}, {columnId:"tr_nbr",width:50}]
            
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
            onExtensionRegistered: (extension) => this.draggableGroupingPluginO7 = extension,
        
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
      this.datasetO7 = []
      this.inventoryTransactionService.getAll().subscribe(
        
          (response: any) => {this.datasetO7 = response.data
             this.dataviewO7.setItems(this.datasetO7)
            },
          
          (error) => {
              this.datasetO7 = []
          },
          () => {}
          
      )
      
  }
  onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
      // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
      const caller = change && change.caller || [];
      const groups = change && change.groupColumns || [];
  
      if (Array.isArray(this.selectedGroupingFieldsO7) && Array.isArray(groups) && groups.length > 0) {
        // update all Group By select dropdown
        this.selectedGroupingFieldsO7.forEach((g, i) => this.selectedGroupingFieldsO7[i] = groups[i] && groups[i].getter || '');
      } else if (groups.length === 0 && caller === 'remove-group') {
        this.clearGroupingSelects();
      }
    }
    clearGroupingSelects() {
      this.selectedGroupingFieldsO7.forEach((g, i) => this.selectedGroupingFieldsO7[i] = '');
    }
    
    collapseAllGroups() {
      this.dataviewO7.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataviewO7.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPluginO7 && this.draggableGroupingPluginO7.setDroppedGroups) {
        this.draggableGroupingPluginO7.clearDroppedGroups();
      }
      this.gridO7.invalidate(); // invalidate all rows and re-render
    }
  
  
    refreshMetrics(e: Event, args: any) {
      if (args && args.current >= 0) {
        setTimeout(() => {
          this.metrics = {
            startTime: new Date(),
            endTime: new Date(),
            itemCount: args && args.current || 0,
            totalItemCount: this.datasetO7.length || 0
          };
        });
      }
    }
    scrollGridBottom() {
      this.angularGridO7.slickGrid.navigateBottom();
    }
    scrollGridDown() {
      this.angularGridO7.slickGrid.navigateDown();
    }
    scrollGridLeft() {
      this.angularGridO7.slickGrid.navigateLeft();
    }
    scrollGridRight() {
      this.angularGridO7.slickGrid.navigateRight();
    }
  
    scrollGridUp() {
      this.angularGridO7.slickGrid.navigateUp();
    }
    scrollGridTop() {
      this.angularGridO7.slickGrid.navigateTop();
    }
    togglePaginationGrid2O7() {
      this.WithPaginationO7 = !this.WithPaginationO7;
      this.angularGridO7.paginationService!.togglePaginationVisibility(this.WithPaginationO7);
    }
  
    trlistO7(){
      const controls = this.trFormO7.controls
      
      this.datasetO7 = []
      const date = controls.date.value
      ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
      : null;
    
      const date1 = controls.date1.value
      ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
      : null;
      
      let obj= {date,date1}
      this.inventoryTransactionService.getByDate(obj).subscribe(
        (res: any) => {
      
        //(response: any) => (this.dataset = response.data),
        console.log(res.data.tr_gl_date)
        
        this.datasetO7  = res.data;
         this.dataviewO7.setItems(this.datasetO7)
        
      //this.dataset = res.data
      this.loadingSubject.next(false) 
    })
    
    }
    onSelectedRowsChangedO7(e, args) {
      // console.log('indexs', args.rows);
      const indexes = args.rows;
      this.trLinesO7 = []
      indexes.forEach(index => {
        const tr_line = this.gridServiceO7.getDataItemByRowIndex(index).tr_part
        this.trLinesO7.push(tr_line)
      });
      console.log(this.trLinesO7)
    }
    
    
    
   
    
    // FIN ONGLET 7
     gridReadyO8(angularGrid: AngularGridInstance) {
        this.angularGridO8 = angularGrid;
        this.dataViewO8 = angularGrid.dataView;
        this.gridO8 = angularGrid.slickGrid;
        this.gridServiceO8 = angularGrid.gridService;
      }
    
      initGridO8() {
        this.columnDefinitionsO8 = [
          {
            id: "id",
            field: "id",
            excludeFromHeaderMenu: true,
            formatter: Formatters.deleteIcon,
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
                if (args.dataContext.tr_ref != null && args.dataContext.tr_ref != "") {
                  this.message = "vous ne pouvez pas supprimer cette ligne";
                  this.hasFormErrorsO8 = true;
                  return;
                  
                }
                else
                {/*ajouter ligne tr_hist de suppression*/
                if (args.dataContext.tr_qty_loc > 0 ) {
                  this.indexO8 = this.datasetO8.findIndex((el) => {
                    return el.tr_line == args.dataContext.tr_line;
                  });
                  args.dataContext.tr_qty_loc = args.dataContext.tr_qty_loc * -1;
                  // this.onSubmit();
                  // }
                } else {
                  
                }
                this.angularGridO8.gridService.deleteItem(args.dataContext);
              }
            }
            },
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
              this.row_number = args.row;
              this.nligneO8 = args.dataContext.id;
              let element: HTMLElement = document.getElementById("openNbrLigne") as HTMLElement;
              element.click();
            },
          },
    
          {
            id: "tr_line",
            name: "Ligne",
            field: "tr_line",
            minWidth: 50,
            maxWidth: 50,
            selectable: true,
          },
          {
            id: "tr_part",
            name: "Article",
            field: "tr_part",
            sortable: true,
            width: 50,
            filterable: false,
            editor: {
              model: Editors.text,
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
              
              if (args.dataContext.tr_ref != null) {
                this.message = "vous ne pouvez pas modifier cette ligne";
                this.hasFormErrorsO8 = true;
                return;
              } else {
                console.log(args.dataContext.tr_part);
                this.itemsService.getByOne({ pt_part: args.dataContext.tr_part }).subscribe((resp: any) => {
                  if (resp.data) {
                    this.locationService.getByOne({ loc_loc: resp.data.pt_loc, loc_site: resp.data.pt_site }).subscribe((response: any) => {
                      this.locationO8 = response.data;
    
                      this.inventoryStatusService.getAllDetails({ isd_status: this.locationO8.loc_status, isd_tr_type: "RCT-PO" }).subscribe((resstat: any) => {
                        console.log(resstat);
                        const { data } = resstat;
    
                        if (data) {
                          this.statO8 = null;
                        } else {
                          this.statO8 = this.locationO8.loc_status;
                        }
                        this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_desc: resp.data.pt_desc1, tr_site: resp.data.pt_site, tr_loc: resp.data.pt_loc, tr_um: resp.data.pt_um, tr_um_conv: 1, tr_status: this.statO8, tr_price: resp.data.pt_pur_price });
                      });
                    });
                    this.codeService.getByOne({code_fldname:'LIMIT',code_value:resp.data.pt_draw}).subscribe((coderesp:any)=>{this.seuilO8 = Number(coderesp.data.code_cmmt)})
                  } else {
                    this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_part: null })
                    this.message = "article n'existe pas";
                    this.hasFormErrorsO8 = true;
                    return;
                    ;
                  }
                });
              }
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
              if (args.dataContext.tr_ref != null) {
                this.message = "vous ne pouvez pas modifier cette ligne";
                this.hasFormErrorsO8 = true;
                return;
              } else {
                this.row_number = args.row;
                let element: HTMLElement = document.getElementById("openItemsGrid") as HTMLElement;
                element.click();
              }
            },
          },
          {
            id: "tr_desc",
            name: "Description",
            field: "tr_desc",
            sortable: true,
            minWidth: 350,
            maxWidth: 350,
            filterable: false,
          },
         
          {
            id: "tr_qty_loc",
            name: "QTE",
            field: "tr_qty_loc",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
    
            editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 },
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
              
              if (args.dataContext.tr_ref != null && args.dataContext.tr_ref != "") {
                this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_qty_loc: args.dataContext.qty });
                this.message = "vous ne pouvez pas modifier cette ligne";
                this.hasFormErrorsO8 = true;
                return;
                
              } else {console.log(this.seuilO8)
                if(args.dataContext.tr_qty_loc < this.seuilO8 && args.dataContext.tr_qty_loc > 0){
                this.printableO8 = true
                this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, qty: args.dataContext.tr_qty_loc });
                }  
                else {
                  this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_qty_loc: args.dataContext.qty });
                this.message = "la quantité dépasse la limite";
                this.hasFormErrorsO8 = true;
                return;
                }      
              }
            },
          },
          {
            id: "tr_price",
            name: "Prix",
            field: "tr_price",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
    
            editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 },
            },
            // onCellChange: (e: Event, args: OnEventArgs) => {
              
            //   if (args.dataContext.tr_ref != null && args.dataContext.tr_ref != "") {
            //     this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_qty_loc: args.dataContext.qty });
            //     this.message = "vous ne pouvez pas modifier cette ligne";
            //     this.hasFormErrorsO8 = true;
            //     return;
                
            //   } else {console.log(this.seuilO8)
            //     if(args.dataContext.tr_qty_loc < this.seuilO8 && args.dataContext.tr_qty_loc > 0){
            //     this.printableO8 = true
            //     this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, qty: args.dataContext.tr_qty_loc });
            //     }  
            //     else {
            //       this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_qty_loc: args.dataContext.qty });
            //     this.message = "la quantité dépasse la limite";
            //     this.hasFormErrorsO8 = true;
            //     return;
            //     }      
            //   }
            // },
          },
          {
            id: "tr_serial",
            name: "Lot/Serie",
            field: "tr_serial",
            sortable: true,
            width: 80,
            filterable: false,
            editor: {
              model: Editors.text,
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
              if (args.dataContext.tr_ref != null) {
                this.message = "vous ne pouvez pas modifier cette ligne";
                this.hasFormErrorsO8 = true;
                return;
              } else {
                this.printableO8 = true
                this.locationDetailService.getBy({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe((response: any) => {
                  console.log(response.data);
                  if (response.data.length != 0) {
                    this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_status: response.data[0].ld_status, tr_expire: response.data[0].ld_expire });
                  }
                });
              }
            },
          },
          
          {
            id: "tr_ref",
            name: "Code Barre",
            field: "tr_ref",
            sortable: false,
    
            filterable: false,
            // editor: {
            //   model: Editors.text,
            // },
          },
          {
            id: "printed",
            name: "Imprimé",
            field: "printed",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
         
          {
            id: "idprint",
            field: "idprint",
            excludeFromHeaderMenu: true,
            formatter: (row, cell, value, columnDef, dataContext) => {
              // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
              return `
                <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette" [disabled]="printbuttonState">
                     <i class="flaticon2-printer" ></i>
                     
                 </a>
                 `;
            },
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              this.printbuttonStateO8 = true;
              
              // if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
              //   this.angularGrid.gridService.deleteItem(args.dataContext);
              // }
              
              if (args.dataContext.tr_part == null || args.dataContext.tr_part == '') {
                this.hasFormErrorsO8 = true;
                this.message = "veuillez selctionner l'article";
              
          
                return;
              }
              
              if (args.dataContext.printed != true && this.printableO8 == true){
              if (args.dataContext.tr_qty_loc != 0 && args.dataContext.tr_ref == null ) {
                // this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: '-', qty: args.dataContext.tr_qty_loc });
                const controls = this.trFormO8.controls;
                this.printbuttonStateO8 = true; 
                this.printableO8 = false
                const _lb = new Label();
                this.addressService.getBy({ ad_addr: controls.tr_addr.value }).subscribe((response: any) => {
                  //   const { data } = response;
                  console.log("aaaaaaaaaaa", response.data);
                  if (response.data != null) {
                    this.providerO8 = response.data[0];
                    this.nomO8 = this.providerO8.ad_name;
                    console.log(this.nomO8);
                    let lab = null;
                    (_lb.lb__dec01 = args.dataContext.tr_line), (_lb.lb_site = args.dataContext.tr_site);
                    _lb.lb_rmks = controls.tr_rmks.value;
                    _lb.lb_loc = args.dataContext.tr_loc;
                    _lb.lb_part = args.dataContext.tr_part;
                    _lb.lb_nbr = args.dataContext.tr_so_job; //this.trnbr
                    _lb.lb_lot = args.dataContext.tr_serial;
                    _lb.lb_date = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
                    _lb.lb_qty = args.dataContext.tr_qty_loc;
                    _lb.lb_um = args.dataContext.tr_um; 
                    _lb.lb_ld_status = args.dataContext.tr_status;
                    _lb.lb_desc = args.dataContext.tr_desc;
                    _lb.lb_printer = this.PathPrinterO8;
                    _lb.lb_cust = this.locationO8.loc_desc;
                    _lb.lb_grp = this.employeGrpO8;
                    _lb.lb_addr = this.providerO8.ad_line1;
                    _lb.lb_tel = this.providerO8.ad_phone;
                    _lb.lb__chr01 = String(new Date().toLocaleTimeString())
                    
                   
                    this.labelService.add(_lb).subscribe(
                      (reponse: any) => {
                        lab = reponse.data;
                        let barcode = lab.lb_ref;
                        
                         this.indexO8 = this.datasetO8.findIndex((el) => {
                          return el.tr_line == args.dataContext.id;
                        });
                        this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: barcode, qty: args.dataContext.tr_qty_loc, printed:true });              
                        
                         this.onSubmitO8(_lb,lab);
    
                         
                        
                                      
                        
                      },
                      (error) => {
                        this.message = "l'impression n'a pas été enregistrée";
                        this.hasFormErrorsO8= true;
                        return;
                      },
                      () => {
                        
        }
                      
                    );
                    this.gridServiceO8.updateItemById(args.dataContext.id, { ...args.dataContext, qty: args.dataContext.tr_qty_loc, printed:true })
                                  
                  }
                });
                
                } else {
                this.message = "veuillez choisir article ";
                this.hasFormErrorsO8 = true;
                return;
              }
             
            }
            else {
              this.message = "Etiquette déjà imprimée ";
              this.hasFormErrorsO8 = true;
              return;
            }
          }
          },
        ]; 
    
        this.gridOptionsO8 = {
          asyncEditorLoading: false,
          editable: true,
          // enableColumnPicker: true,
          enableCellNavigation: true,
          enableRowSelection: true,
          enableAutoResize: true,
          autoHeight: false,
          autoCommitEdit: true,
    
          formatterOptions: {
            // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
            displayNegativeNumberWithParentheses: true,
    
            // Defaults to undefined, minimum number of decimals
            minDecimal: 2,
    
            // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
            thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
          },
        };
    
        this.datasetO8 = [];
      }
      
    
      //create form
      createFormO8() {
        this.loadingSubject.next(false);
    
        this.inventoryTransactionO8 = new InventoryTransaction();
        const date = new Date();
        this.trFormO8 = this.trFB.group({
          tr_lot: [this.inventoryTransactionO8.tr_lot],
          tr_effdate: [
            {
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
            },
          ],
          tr_so_job: [this.inventoryTransactionO8.tr_so_job],
          tr_site: [this.inventoryTransactionO8.tr_site,Validators.required],
          tr_loc: [this.inventoryTransactionO8.tr_loc,Validators.required],
          tr_rmks: [this.inventoryTransactionO8.tr_rmks],
          tr_addr: [this.inventoryTransactionO8.tr_addr,Validators.required],
          tr_user1: [this.inventoryTransactionO8.tr_user1],
          tr_user2: [this.inventoryTransactionO8.tr_user2],
          printer: [this.user.usrd_dft_printer],
          print: [true],
          adduser2:[false],
        });
        const controls = this.trFormO8.controls;
        console.log(this.domconfigO8);
        // if(this.domconfig) {
        this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
          (reponse: any) => {
            if (reponse.data != null && reponse.data.code_value != ' ') {
              controls.tr_addr.setValue(reponse.data.code_value), controls.tr_addr.disable();
              
              this.addressService.getBy({ ad_addr: reponse.data.code_value }).subscribe((response: any) => {
                //   const { data } = response;
                console.log("aaaaaaaaaaa", response.data);
                if (response.data != null) {
                  this.providerO8 = response.data[0];
                  this.nomO8 = this.providerO8.ad_name;
                  console.log(this.providerO8);
                }
              });
              
            }
          },
          (error) => {}
        );
    
       
    
        // }
      }
    
      createnbrFormO8() {
        this.loadingSubject.next(false);
    
        this.nbrFormO8 = this.nbrFB.group({
          nbrligne: [1],
        });
      }
      onChangeVendO8() {
        const controls = this.trFormO8.controls;
        this.addressService.getBy({ ad_addr: controls.tr_addr.value }).subscribe((response: any) => {
          //   const { data } = response;
          console.log(response.data);
          if (response.data == null) {
            this.layoutUtilsService.showActionNotification("cette Adresse n'existe pas!", MessageType.Create, 10000, true, true);
            this.error = true;
          } else {
            this.providerO8 = response.data[0];
            this.nomO8 = this.providerO8.ad_name;
          }
        });
      }
      //reste form
      resetO8() {
        this.inventoryTransactionO8 = new InventoryTransaction();
        this.createFormO8();
        this.hasFormErrorsO8 = false;
      }
      // save data
      onSubmitO8(lb:any,lab:any) {
        this.hasFormErrorsO8 = false;
        
        this.dataO8 = [];
        let obj = {
          tr_line: this.datasetO8[this.indexO8].tr_line,
          tr_part: this.datasetO8[this.indexO8].tr_part,
          tr_desc: this.datasetO8[this.indexO8].tr_desc,
          tr_qty_loc: this.datasetO8[this.indexO8].tr_qty_loc,
          tr_um: this.datasetO8[this.indexO8].tr_um,
          tr_um_conv: this.datasetO8[this.indexO8].tr_um_conv,
          tr_price: this.datasetO8[this.indexO8].tr_price,
          tr_site: this.datasetO8[this.indexO8].tr_site,
          tr_loc: this.datasetO8[this.indexO8].tr_loc,
          tr_serial: this.datasetO8[this.indexO8].tr_serial,
          tr_ref: this.datasetO8[this.indexO8].tr_ref,
          tr_status: this.datasetO8[this.indexO8].tr_status,
          tr_expire: this.datasetO8[this.indexO8].tr_expire,
        };
        // this.data.push(this.dataset[this.index])
        this.dataO8.push(obj);
    
        console.log("this.data", this.dataO8);
        console.log(typeof this.dataO8);
        const controls = this.trFormO8.controls;
        /** check form */
    
        if (this.trFormO8.invalid) {
          Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
          this.message = "Modifiez quelques éléments et réessayez de soumettre.";
          this.hasFormErrorsO8 = true;
    
          return;
        }
    
        // if (!this.dataset.length) {
        //   this.message = "La liste des article ne peut pas etre vide";
        //   this.hasFormErrors = true;
    
        //   return;
        // }
        for (var i = 0; i < this.datasetO8.length; i++) {
        //   console.log(this.dataset[i]);
        //   if (this.dataset[i].tr_part == "" || this.dataset[i].tr_part == null) {
        //     this.message = "L' article ne peut pas etre vide";
        //     this.hasFormErrors = true;
        //     return;
        //   }
          if (this.datasetO8[i].tr_site == "" || this.datasetO8[i].tr_site == null) {
            this.message = "Le Site ne peut pas etre vide";
            this.hasFormErrorsO8 = true;
            return;
          }
          if (this.datasetO8[i].tr_loc == "" || this.datasetO8[i].tr_loc == null) {
            this.message = "L' Emplacement ne peut pas etre vide";
            this.hasFormErrorsO8 = true;
            return;
          }
        //   if (this.dataset[i].tr_um == "" || this.dataset[i].tr_um == null) {
        //     this.message = "L' UM ne peut pas etre vide";
        //     this.hasFormErrors = true;
        //     return;
        //   }
        //   if (this.dataset[i].tr_status == "" || this.dataset[i].tr_status == null) {
        //     this.message = "Le Status ne peut pas etre vide";
        //     this.hasFormErrors = true;
        //     return;
        //   }
        //   if (this.dataset[i].tr_qty_loc == 0) {
        //     this.message = "La Quantite ne peut pas etre 0";
        //     this.hasFormErrors = true;
        //     return;
        //   }
        }
        let tr = this.prepareO8();
        // let obj = this.dataset[this.index]
        // console.log(this.dataset[this.index])
        // console.log("here obj",obj)
        // this.data = []
        // this.data.push(obj)
        this.sequenceService.getByOne({ seq_type: "RA", seq_profile: this.user.usrd_profile }).subscribe((response: any) => {
          this.seqO8 = response.data;
    
          if (this.seqO8) {
            if(this.trlotO8 == null){
              this.sequenceService.update(this.seqO8.id, { seq_curr_val: Number(this.seqO8.seq_curr_val) + 1 }).subscribe(
              (reponse) => console.log("response", Response),
              (error) => {
                this.message = "Erreur modification Sequence";
                this.hasFormErrorsO8 = true;
                return;
              }
              );
              this.trlotO8 = `${this.seqO8.seq_prefix}-${Number(this.seqO8.seq_curr_val) + 1}`;
            
            }
            this.addItO8(this.dataO8, tr, this.trlotO8,lb,lab);
            
          } else {
            this.message = "Parametrage Manquant pour la sequence";
            this.hasFormErrorsO8 = true;
            return;
          }
        });
        
        
       }
    
      prepareO8() {
        const controls = this.trFormO8.controls;
        const _tr = new InventoryTransaction();
        
    
        _tr.tr_effdate = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
        _tr.tr_so_job = controls.tr_so_job.value;
    
        _tr.tr_rmks = controls.tr_rmks.value;
        _tr.tr_addr = controls.tr_addr.value;
        _tr.tr_user1 = controls.tr_user1.value;
        _tr.tr_user2 = controls.tr_user2.value;
    
        return _tr;
      }
      /**
       *
       * Returns object for saving
       */
      /**
       * Add po
       *
       * @param _it: it
       */
      addItO8(detail: any, it, nlot,lb,lab) {
        console.log("here data", detail);
        // for (let data of detail) {
        //   delete data.id;
        //   delete data.cmvid;
        // }
        this.loadingSubject.next(true);
        const controls = this.trFormO8.controls;
    
        this.inventoryTransactionService.addRCTPOCab({ detail, it, nlot }).subscribe(
          (reponse: any) => {
            console.log(reponse);
            // const arrayOctet = new Uint8Array(reponse.pdf.data)
            // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
            // const fileUrl = URL.createObjectURL(file);
            // window.open(fileUrl)
          },
          (error) => {
            console.log(this.trlotO8)
            this.message = "La transaction n'a pas été enregistrée ";
            this.hasFormErrorsO8 = true;
            return;
            
            this.loadingSubject.next(false);
          },
          () => {
            this.labelService.addblob(lb).subscribe((blob) => {                 
              asset.printasset(lab,this.currentPrinterO8);
              
            });
            this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
            this.loadingSubject.next(false);
          
            
          }
        );
      }
      onPrintO8() {
        const controls = this.trFormO8.controls;
    
        if (controls.print.value == true) this.printpdfO8(this.trlotO8); 
        this.goBackO8();
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
    
      // add new Item to Datatable
      addNewItemO8() {
        const controls = this.trFormO8.controls;
        if (controls.tr_site.value == null) {
          this.message = "veuillez selectionner le site";
          this.hasFormErrorsO8 = true;
          return;
          }
          if (controls.tr_loc.value == null) {
            this.message = "veuillez selectionner l'emplacement'";
            this.hasFormErrorsO8 = true;
            return;
            }
          
          else{  
            if (controls.tr_addr.value == null) {
            this.message = "veuillez remplir l'adresse";
            this.hasFormErrorsO8 = true;
            return;
            } 
            else {
              var maxObj = null;
              var iddd = 0;
              if (this.datasetO8.length > 0) {
                maxObj = this.datasetO8.reduce((accumulator, current) => {
                return accumulator.id > current.id ? accumulator : current;
              });
              console.log(maxObj.id + 1);
              iddd = maxObj.id + 1;
              } else 
              {
                iddd = 1;
              }
              this.gridServiceO8.addItem(
            {
              id: iddd,
              tr_line: iddd,
              tr_part: "",
              cmvid: "",
              tr_desc: "",
              tr_qty_loc: 1,
              tr_um: "",
              tr_price: 0,
              tr_site: controls.tr_site.value,
              tr_loc: controls.tr_loc.value,
              tr_serial: null,
              tr_ref: null,
              tr_status: null,
              tr_expire: null,
              qty: 0,
            },
            { position: "bottom" }
              );
            }
          }  
       
      }
    
      addsameItemO8() {
        const control = this.nbrFormO8.controls;
        const limit = Number(control.nbrligne.value);
        var i = this.nligneO8;
    
        const maxObj = this.datasetO8.reduce((accumulator, current) => {
          return accumulator.id > current.id ? accumulator : current;
        });
        console.log(maxObj.id + 1);
        var iddd = maxObj.id + 1;
    
        for (var j = 0; j < limit; j++) {
          this.gridServiceO8.addItem(
            {
              id: iddd,
              tr_line: iddd,
              tr_part: this.datasetO8[i - 1].tr_part,
              cmvid: "",
              tr_desc: this.datasetO8[i - 1].tr_desc,
              tr_qty_loc: this.datasetO8[i - 1].tr_qty_loc,
              tr_um: this.datasetO8[i - 1].tr_um,
              tr_um_conv: this.datasetO8[i - 1].tr_um_conv,
    
              tr_price: this.datasetO8[i - 1].tr_price,
              tr_site: this.datasetO8[i - 1].tr_site,
              tr_loc: this.datasetO8[i - 1].tr_loc,
              tr_serial: this.datasetO8[i - 1].tr_serial,
              tr_ref: null,
              tr_status: this.datasetO8[i - 1].tr_status,
              tr_expire: this.datasetO8[i - 1].tr_expire,
              qty: 0,
            },
            { position: "bottom" }
          );
          iddd++;
        }
        this.modalService.dismissAll();
      }
      addnegativeItemO8() {
        var i = this.nligneO8;
    
        this.gridServiceO8.addItem(
          {
            id: this.datasetO8.length + 1,
            tr_line: this.datasetO8.length + 1,
            tr_part: this.datasetO8[i - 1].tr_part,
            cmvid: "",
            tr_desc: this.datasetO8[i - 1].tr_desc,
            tr_qty_loc: this.datasetO8[i - 1].tr_qty_loc * -1,
            tr_um: this.datasetO8[i - 1].tr_um,
            tr_um_conv: this.datasetO8[i - 1].tr_um_conv,
    
            tr_price: this.datasetO8[i - 1].tr_price,
            tr_site: this.datasetO8[i - 1].tr_site,
            tr_loc: this.datasetO8[i - 1].tr_loc,
            tr_serial: this.datasetO8[i - 1].tr_serial,
            tr_ref: this.datasetO8[i - 1].tr_ref,
            tr_status: this.datasetO8[i - 1].tr_status,
            tr_expire: this.datasetO8[i - 1].tr_expire,
          },
          { position: "bottom" }
        );
    
        this.modalService.dismissAll();
      }
      handleSelectedRowsChanged4O8(e, args) {
        const controls = this.trFormO8.controls
        let updateItem = this.gridServiceO8.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObj4O8) {
          args.rows.map((idx) => {
            const item = this.gridObj4O8.getDataItem(idx);
            let site = controls.tr_site.value;
            let loc = controls.tr_loc.value;
    if(site == null){site = item.site}
    if(loc == null){loc = item.loc}
            this.locationService.getByOne({ loc_loc: loc, loc_site: site }).subscribe((response: any) => {
              this.locationO8 = response.data;
              console.log(this.locationO8.loc_status)
              // this.sctService.getByOne({ sct_site: item.pt_site, sct_part: item.pt_part, sct_sim: "STD-CG" }).subscribe((response: any) => {
              //   this.sct = response.data;
    
              this.inventoryStatusService.getAllDetails({ isd_status: this.locationO8.loc_status, isd_tr_type: "RCT-PO" }).subscribe((resstat: any) => {
                console.log(resstat);
                const { data } = resstat;
    
                if (data) {
                  this.statO8 = null;
                } else {
                  this.statO8 = this.locationO8.loc_status;
                }
    
                updateItem.tr_part = item.pt_part;
                updateItem.tr_desc = item.pt_desc1;
                updateItem.tr_um = item.pt_um;
                updateItem.tr_um_conv = 1;
                updateItem.tr_site = site;
                updateItem.tr_loc = loc;
                updateItem.tr_price = item.pt_pur_price //this.sct.sct_mtl_tl;
    
                updateItem.tr_status = this.statO8;
                if (this.pdlO8 == null) {
                  this.pdlO8 = item.pt_draw;
                }
                this.gridServiceO8.updateItem(updateItem);
              });
              //});
            });
            console.log(item.pt_part_type), this.codeService.getByOne({code_fldname:'LIMIT',code_value:item.pt_draw}).subscribe((coderesp:any)=>{this.seuilO8 = Number(coderesp.data.code_cmmt)})
          });
        }
      }
      angularGridReady4O8(angularGrid: AngularGridInstance) {
        this.angularGrid4O8 = angularGrid;
        this.gridObj4O8 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGrid4O8() {
        this.columnDefinitions4O8 = [
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
            minWidth: 350,
            maxWidth: 350,
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
            id: "pt_site",
            name: "Site",
            field: "pt_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "pt_loc",
            name: "Emplacement",
            field: "pt_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
        ];
    
        this.gridOptions4O8 = {
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
        console.log(this.domconfigO8);
        if (this.domconfigO8 == false) {
          this.itemsService.getBy({}).subscribe((response: any) => (this.itemsO8 = response.data));
        } else {
          if (this.pdlO8 == null) {
            //this.prodligne = ["SQUELETTE", "BOBINE"]
            console.log("houhopuhouhouhou", this.prodligneO8, this.dsgn_grpO8);
            this.itemsService.getbywithperte({ pt_draw: this.prodligneO8, pt_dsgn_grp: this.dsgn_grpO8 }).subscribe((response: any) => (this.itemsO8 = response.data));
          } else {
            this.itemsService.getbywithperte({ pt_draw: this.pdlO8, pt_dsgn_grp: this.dsgn_grpO8 }).subscribe((response: any) => (this.itemsO8 = response.data));
          }
        } 
      }
      open4O8(content) {
        this.prepareGrid4O8();
        this.modalService.open(content, { size: "lg" });
      }
      onAlertCloseO8($event) {
        this.hasFormErrorsO8 = false;
      }
    
      
    
      handleSelectedRowsChangedumO8(e, args) {
        let updateItem = this.gridServiceO8.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObjumO8) {
          args.rows.map((idx) => {
            const item = this.gridObjumO8.getDataItem(idx);
            updateItem.tr_um = item.code_value;
    
            this.gridServiceO8.updateItem(updateItem);
    
            /*********/
            console.log(updateItem.tr_part);
    
            this.itemsService.getBy({ pt_part: updateItem.tr_part }).subscribe((resp: any) => {
              if (updateItem.tr_um == resp.data.pt_um) {
                updateItem.tr_um_conv = 1;
              } else {
                //console.log(resp.data.pt_um)
    
                this.mesureService.getBy({ um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: updateItem.tr_part }).subscribe((res: any) => {
                  console.log(res);
                  const { data } = res;
    
                  if (data) {
                   
                    updateItem.tr_um_conv = res.data.um_conv;
                    this.angularGridO8.gridService.highlightRow(1, 1500);
                  } else {
                    this.mesureService.getBy({ um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part }).subscribe((res: any) => {
                      console.log(res);
                      const { data } = res;
                      if (data) {
                       
                        updateItem.tr_um_conv = res.data.um_conv;
                      } else {
                        updateItem.tr_um_conv = 1;
                        updateItem.tr_um = null;
    
                        
                      }
                    });
                  }
                });
              }
            });
    
            /***********/
          });
        }
      }
      angularGridReadyumO8(angularGrid: AngularGridInstance) {
        this.angularGridumO8 = angularGrid;
        this.gridObjumO8 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridumO8() {
        this.columnDefinitionsumO8 = [
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
    
        this.gridOptionsumO8 = {
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
        this.codeService.getBy({ code_fldname: "pt_um" }).subscribe((response: any) => (this.umsO8 = response.data));
      }
      openumO8(content) {
        this.prepareGridumO8();
        this.modalService.open(content, { size: "lg" });
      }
    
      handleSelectedRowsChangedstatusO8(e, args) {
        let updateItem = this.gridServiceO8.getDataItemByRowIndex(this.row_number);
        if (Array.isArray(args.rows) && this.gridObjstatusO8) {
          args.rows.map((idx) => {
            const item = this.gridObjstatusO8.getDataItem(idx);
    
            this.inventoryStatusService.getAllDetails({ isd_status: item.is_status, isd_tr_type: "RCT-PO" }).subscribe((res: any) => {
              console.log(res);
              const { data } = res;
    
              if (data) {
                this.message = "mouvement interdit pour ce statut";
                this.hasFormErrorsO8 = true;
                return;
              } else {
                updateItem.tr_status = item.is_status;
    
                this.gridServiceO8.updateItem(updateItem);
              }
            });
          });
        }
      }
    
      angularGridReadystatusO8(angularGrid: AngularGridInstance) {
        this.angularGridstatusO8 = angularGrid;
        this.gridObjstatusO8 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGridstatusO8() {
        this.columnDefinitionsstatusO8 = [
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
            id: "is_status",
            name: "Status",
            field: "is_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "is_desc",
            name: "Designation",
            field: "is_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "is_avail",
            name: "Disponible",
            field: "is_avail",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "is_nettable",
            name: "Gerer MRP",
            field: "is_nettable",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "is_overissue",
            name: "Sortie Excedent",
            field: "is_overissue",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
        ];
    
        this.gridOptionsstatusO8 = {
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
        this.inventoryStatusService.getAll().subscribe((response: any) => (this.statussO8 = response.data));
        console.log(this.statussO8);
      }
      openstatusO8(content) {
        this.prepareGridstatusO8();
        this.modalService.open(content, { size: "lg" });
      }
    
      handleSelectedRowsChanged2O8(e, args) {
        const controls = this.trFormO8.controls;
        if (Array.isArray(args.rows) && this.gridObj2O8) {
          args.rows.map((idx) => {
            const item = this.gridObj2O8.getDataItem(idx);
    
            this.providerO8 = item;
            controls.tr_addr.setValue(item.ad_addr || "");
            this.nomO8 = item.ad_name;
          });
        }
      }
    
      angularGridReady2O8(angularGrid: AngularGridInstance) {
        this.angularGrid2O8 = angularGrid;
        this.gridObj2O8 = (angularGrid && angularGrid.slickGrid) || {};
      }
    
      prepareGrid2O8() {
        this.columnDefinitions2O8 = [
          {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
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
    
        this.gridOptions2O8 = {
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
        this.addressService.getBy({ad_type:'vendor'}).subscribe((response: any) => (this.adressesO8 = response.data));
      }
      open2O8(content) {
        this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
          (reponse: any) => {
            if (reponse.data == null || reponse.data.code_value != ' ') {
              this.prepareGrid2O8();
              this.modalService.open(content, { size: "lg" });
            }
            console.log(reponse.data);
          },
          (error) => {
            this.prepareGrid2O8();
            this.modalService.open(content, { size: "lg" });
          }
        );
      }
    
      printpdfO8(nbr) {
        // const controls = this.totForm.controls
        const controlss = this.trFormO8.controls;
        console.log("pdf");
        var doc = new jsPDF();
    let date = new Date();
        // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
        var img = new Image();
        img.src = "./assets/media/logos/companyentete.png";
        doc.addImage(img, "png", 150, 5, 50, 30);
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
    
        doc.line(10, 35, 200, 35);
        doc.setFontSize(12);
        doc.text("Bon de Récéption Achat N° : " + nbr, 70, 45);
        doc.text("Date: " + date.toLocaleDateString() , 160, 40);
        doc.text("Heure: " + new Date().toLocaleTimeString(), 160, 50);
        doc.text("Edité par: " + this.user.usrd_code, 160, 55);
        if(this.user1O8 != null){  doc.text("Fait par: " + this.user1O8, 20, 83)};
        if(this.user2O8 != null){doc.text("Et: " + this.user2O8, 90, 83);}
        
        doc.setFontSize(8);
        //console.log(this.provider.ad_misc2_id)
        doc.text("Fournisseur : " + this.providerO8.ad_addr, 20, 50);
        doc.text("Nom             : " + this.providerO8.ad_name, 20, 55);
        doc.text("Adresse       : " + this.providerO8.ad_line1, 20, 60);
        if (this.providerO8.ad_misc2_id != null) {
          doc.text("MF          : " + this.providerO8.ad_misc2_id, 20, 65);
        }
        if (this.providerO8.ad_gst_id != null) {
          doc.text("RC          : " + this.providerO8.ad_gst_id, 20, 70);
        }
        if (this.providerO8.ad_pst_id) {
          doc.text("AI            : " + this.providerO8.ad_pst_id, 20, 75);
        }
        if (this.providerO8.ad_misc1_id != null) {
          doc.text("NIS         : " + this.providerO8.ad_misc1_id, 20, 80);
        }
    
        doc.line(10, 85, 205, 85);
        doc.line(10, 90, 205, 90);
        doc.line(10, 85, 10, 90);
        doc.text("LN", 12.5, 88.5);
        doc.line(20, 85, 20, 90);
        doc.text("Code Article", 25, 88.5);
        doc.line(45, 85, 45, 90);
        doc.text("Désignation", 67.5, 88.5);
        doc.line(100, 85, 100, 90);
        doc.text("QTE", 107, 88.5);
        doc.line(120, 85, 120, 90);
        doc.text("UM", 123, 88.5);
        doc.line(130, 85, 130, 90);
        doc.text("PU", 138, 88.5);
        doc.line(150, 85, 150, 90);
        doc.text("Lot/Série", 152, 88.5);
        doc.line(170, 85, 170, 90);
        doc.text("N PAL", 172, 88.5);
        doc.line(185, 85, 185, 90);
        doc.text("THT", 195, 88.5);
        doc.line(205, 85, 205, 90);
        var i = 95;
        doc.setFontSize(6);
        let total = 0;
        let ttc = 0;
        for (let j = 0; j < this.datasetO8.length; j++) {
          total = total +  Number(this.datasetO8[j].tr_qty_loc);
          ttc = ttc +  Number(this.datasetO8[j].tr_qty_loc) * Number(this.datasetO8[j].tr_price);
          if (j % 20 == 0 && j != 0) {
            doc.addPage();
            img.src = "./assets/media/logos/companyentete.png";
            doc.addImage(img, "png", 150, 5, 50, 30);
            doc.setFontSize(9);
            if (this.domain.dom_name != null) {
              doc.text(this.domain.dom_name, 10, 10);
            }
            if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
            if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
            if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
            doc.setFontSize(14);
            doc.line(10, 35, 200, 35);
    
            doc.setFontSize(12);
            doc.text("Bon de Réception Achat N° : " + nbr, 70, 40);
            doc.text("Date: " + date.toLocaleDateString() , 160, 40);
            doc.text("Heure: " + new Date().toLocaleTimeString(), 160, 50);
            doc.text("Edité par: " + this.user.usrd_code, 160, 55);
            if(this.user1O8 != null){  doc.text("Fait par: " + this.user1O8, 20, 83)};
            if(this.user2O8 != null){doc.text("Et: " + this.user2O8, 90, 83);}
            
            doc.setFontSize(8);
            console.log(this.providerO8.ad_misc2_id);
            doc.text("Fournisseur : " + this.providerO8.ad_addr, 20, 50);
            doc.text("Nom             : " + this.providerO8.ad_name, 20, 55);
            doc.text("Adresse       : " + this.providerO8.ad_line1, 20, 60);
            if (this.providerO8.ad_misc2_id != null) {
              doc.text("MF          : " + this.providerO8.ad_misc2_id, 20, 65);
            }
            if (this.providerO8.ad_gst_id != null) {
              doc.text("RC          : " + this.providerO8.ad_gst_id, 20, 70);
            }
            if (this.providerO8.ad_pst_id) {
              doc.text("AI            : " + this.providerO8.ad_pst_id, 20, 75);
            }
            if (this.providerO8.ad_misc1_id != null) {
              doc.text("NIS         : " + this.providerO8.ad_misc1_id, 20, 80);
            }
    
            doc.line(10, 85, 205, 85);
            doc.line(10, 90, 205, 90);
            doc.line(10, 85, 10, 90);
            doc.text("LN", 12.5, 88.5);
            doc.line(20, 85, 20, 90);
            doc.text("Code Article", 25, 88.5);
            doc.line(45, 85, 45, 90);
            doc.text("Désignation", 67.5, 88.5);
            doc.line(100, 85, 100, 90);
            doc.text("QTE", 107, 88.5);
            doc.line(120, 85, 120, 90);
            doc.text("UM", 123, 88.5);
            doc.line(130, 85, 130, 90);
            doc.text("PU", 138, 88.5);
            doc.line(150, 85, 150, 90);
            doc.text("Lot/Série", 152, 88.5);
            doc.line(170, 85, 170, 90);
            doc.text("N PAL", 172, 88.5);
            doc.line(185, 85, 185, 90);
            doc.text("THT", 195, 88.5);
            doc.line(205, 85, 205, 90);
            i = 95;
            doc.setFontSize(6);
          }
    
          if (this.datasetO8[j].tr_desc.length > 45) {
            let desc1 = this.datasetO8[j].tr_desc.substring(45);
            let ind = desc1.indexOf(" ");
            desc1 = this.datasetO8[j].tr_desc.substring(0, 45 + ind);
            let desc2 = this.datasetO8[j].tr_desc.substring(45 + ind);
    
            doc.line(10, i - 5, 10, i);
            doc.text(String("000" + Number(j + 1)).slice(-3), 12.5, i - 1);
            doc.line(20, i - 5, 20, i);
            doc.text(this.datasetO8[j].tr_part, 25, i - 1);
            doc.line(45, i - 5, 45, i);
            doc.text(desc1, 47, i - 1);
            doc.line(100, i - 5, 100, i);
            doc.text(String(this.datasetO8[j].tr_qty_loc), 118, i - 1, { align: "right" });
            doc.line(120, i - 5, 120, i);
            doc.text(this.datasetO8[j].tr_um, 123, i - 1);
            doc.line(130, i - 5, 130, i);
            doc.text(String(Number(this.datasetO8[j].tr_price)), 148, i - 1, { align: "right" });
            doc.line(150, i - 5, 150, i);
            doc.text(String(this.datasetO8[j].tr_serial), 168, i - 1, { align: "right" });
            doc.line(170, i - 5, 170, i);
            doc.text(String(this.datasetO8[j].tr_ref), 183, i - 1, { align: "right" });
            doc.line(185, i - 5, 185, i);
            doc.text(String((this.datasetO8[j].tr_price * this.datasetO8[j].tr_qty_loc)), 203, i - 1, { align: "right" });
            doc.line(205, i - 5, 205, i);
            // doc.line(10, i, 200, i );
    
            i = i + 5;
    
            doc.text(desc2, 47, i - 1);
    
            doc.line(10, i - 5, 10, i);
            doc.line(20, i - 5, 20, i);
            doc.line(45, i - 5, 45, i);
            doc.line(100, i - 5, 100, i);
            doc.line(120, i - 5, 120, i);
            doc.line(130, i - 5, 130, i);
            doc.line(150, i - 5, 150, i);
            doc.line(170, i - 5, 170, i);
            doc.line(185, i - 5, 185, i);
            doc.line(205, i - 5, 205, i);
            doc.line(10, i, 200, i);
    
            i = i + 5;
          } else {
            doc.line(10, i - 5, 10, i);
            doc.text(String("000" + Number(j + 1)).slice(-3), 12.5, i - 1);
            doc.line(20, i - 5, 20, i);
            doc.text(this.datasetO8[j].tr_part, 25, i - 1);
            doc.line(45, i - 5, 45, i);
            doc.text(this.datasetO8[j].tr_desc, 47, i - 1);
            doc.line(100, i - 5, 100, i);
            doc.text(String(this.datasetO8[j].tr_qty_loc), 118, i - 1, { align: "right" });
            doc.line(120, i - 5, 120, i);
            doc.text(this.datasetO8[j].tr_um, 123, i - 1);
            doc.line(130, i - 5, 130, i);
            doc.text(String(Number(this.datasetO8[j].tr_price)), 148, i - 1, { align: "right" });
            doc.line(150, i - 5, 150, i);
            doc.text(String(this.datasetO8[j].tr_serial), 168, i - 1, { align: "right" });
            doc.line(170, i - 5, 170, i);
            doc.text(String(this.datasetO8[j].tr_ref), 183, i - 1, { align: "right" });
            doc.line(185, i - 5, 185, i);
            doc.text(String((this.datasetO8[j].tr_price * this.datasetO8[j].tr_qty_loc)), 203, i - 1, { align: "right" });
            doc.line(205, i - 5, 205, i);
            doc.line(10, i, 205, i);
            i = i + 5;
          }
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
        doc.setFontSize(10);
    
        doc.text("NOMBRE DE BIG BAG     " + String(this.datasetO8.length) + "    ,Total POIDS:   " + String(Number(total)), 40, i + 12, { align: "left" });
        doc.text("Validé par: " , 20, i + 22);
        doc.text("Note: " , 20, i + 32);
        //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
        //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
        //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });
    
        // doc.text(String(Number(total)), 198, i + 12, { align: "right" });
        //  doc.text(String(Number(controls.tva.value)), 198 ,  i + 19 , { align: 'right' });
        //  doc.text(String(Number(controls.timbre.value)), 198 ,  i + 26 , { align: 'right' });
        //  doc.text(String(Number(controls.ttc.value))), 198 ,  i + 33 , { align: 'right' });
    
        doc.setFontSize(8);
        let mt = NumberToLetters(Number(ttc), "Dinars Algerien");
    
        if (mt.length > 95) {
          let mt1 = mt.substring(90);
          let ind = mt1.indexOf(" ");
    
          mt1 = mt.substring(0, 90 + ind);
          let mt2 = mt.substring(90 + ind);
    
          doc.text("Arretée la présente Commande a la somme de :" + mt1, 20, i + 53);
          doc.text(mt2, 20, i + 60);
        } else {
          doc.text("Arretée la présente Commande a la somme de :" + mt, 20, i + 53);
        }
        // window.open(doc.output('bloburl'), '_blank');
        //window.open(doc.output('blobUrl'));  // will open a new tab
        doc.save('RU-' + nbr + '.pdf')
        var blob = doc.output("blob");
        window.open(URL.createObjectURL(blob));
      }
      handleSelectedRowsChangedprinterO8(e, args) {
        const controls = this.trFormO8.controls;
    
        if (Array.isArray(args.rows) && this.gridObjprinterO8) {
          args.rows.map((idx) => {
            const item = this.gridObjprinterO8.getDataItem(idx);
            console.log(item);
            // TODO : HERE itterate on selected field and change the value of the selected field
            controls.printer.setValue(item.printer_code || "");
            this.currentPrinterO8 = item.printer_code;
            this.PathPrinterO8 = item.printer_path;
          });
        }
      }
    
      angularGridReadyprinterO8(angularGrid: AngularGridInstance) {
        this.angularGridprinterO8 = angularGrid;
        this.gridObjprinterO8 = (angularGrid && angularGrid.slickGrid) || {};
      }
      prepareGridprinterO8() {
        this.columnDefinitionsprinterO8= [
          {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
          },
          {
            id: "printer_code",
            name: "Code",
            field: "printer_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "printer_desc",
            name: "Designation",
            field: "printer_desc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "printer_path",
            name: "Path",
            field: "printer_path",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
        ];
    
        this.gridOptionsprinterO8 = {
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
        this.printerService.getBy({ usrd_code: this.user.usrd_code }).subscribe((response: any) => (this.dataprinterO8 = response.data));
      }
      openprinterO8(contentprinter) {
        this.prepareGridprinterO8();
        this.modalService.open(contentprinter, { size: "lg" });
      }
    
      opennbrligneO8(content) {
        this.createnbrFormO8();
        this.modalService.open(content, { size: "lg" });
      }
     
    
      // GRID IN
     
    
      
      addempO8() {
        // this.itinerary.push({})
        const controls = this.trFormO8.controls;
        var l: String;
        l = "";
        console.log(l.length);
        this.selectedIndexesO8.forEach((index) => {
          if (l == "") {
            l = this.empsO8[index]["emp_fname"];
          } else {
            l = l + "," + this.empsO8[index]["emp_fname"];
          }
          //id: index,
        });
    
        console.log(l);
        controls.tr_user1.setValue(l);
        this.user1O8 = l;
      }
      additO8() {
        // this.itinerary.push({})
        const controls = this.trFormO8.controls;
        var l: String;
        l = "";
        console.log(l.length);
        this.selectedIndexesO8.forEach((index) => {
          if (index == 0) {
            l = this.empsO8[index]["emp_fname"];
          } else {
            l = l + "," + this.empsO8[index]["emp_fname"];
          }
          //id: index,
        });
      
        console.log(l);
        controls.tr_user1.setValue(l);
        this.user1O8 = l;
      }
      
      angularGridReadyempO8(angularGrid: AngularGridInstance) {
        this.angularGridempO8 = angularGrid;
        this.gridObjempO8 = (angularGrid && angularGrid.slickGrid) || {};
      
        this.gridServiceempO8 = angularGrid.gridService;
        this.dataViewempO8 = angularGrid.dataView;
      }
      // GRID IN
      prepareGridempO8() {
        this.columnDefinitionsempO8 = [
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
            name: "Code Employé",
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
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_lname",
            name: "Prénom",
            field: "emp_lname",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_line1",
            name: "Adresse",
            field: "emp_line1",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_job",
            name: "Métier",
            field: "emp_job",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_level",
            name: "Niveau",
            field: "emp_level",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
        ];
      
        this.gridOptionsempO8 = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          // frozenColumn: 0,
          // frozenBottom: true,
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
          presets: {
            sorters: [{ columnId: "id", direction: "ASC" }],
            rowSelection: {
              // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
              gridRowIndexes: this.selectedIndexes2O8, // (recommended) select by your data object IDs
              //dataContextIds
            },
          },
        };
      
        // fill the dataset with your data
        const controls = this.trFormO8.controls;
        if(controls.tr_addr.value == 'U1') {this.employeService.getBy({emp_job:'EX'}).subscribe((response: any) => (this.empsO8 = response.data));}
        else{if(controls.tr_addr.value == 'B1' ||controls.tr_addr.value == 'B2'){this.employeService.getBy({emp_job:'BR'}).subscribe((response: any) => (this.empsO8 = response.data))}
              else {if(controls.tr_addr.value == 'M1' ||controls.tr_addr.value == 'M2' ||controls.tr_addr.value == 'M3'){this.employeService.getBy({emp_job:'TR'}).subscribe((response: any) => (this.empsO8 = response.data))}
                   else{this.employeService.getBy({emp_job:'MAG'}).subscribe((response: any) => (this.empsO8 = response.data));}}
      }}
      
      handleSelectedRowsChangedempO8(e, args) {
        this.selectedIndexesO8 = [];
        this.selectedIndexesO8 = args.rows;
      }
      openempO8(content) {
        this.prepareGridempO8();
        this.modalService.open(content, { size: "lg" });
      }
      angularGridReadyemp2O8(angularGrid: AngularGridInstance) {
        this.angularGridemp2O8 = angularGrid;
        this.gridObjemp2O8 = (angularGrid && angularGrid.slickGrid) || {};
      
        this.gridServiceemp2O8= angularGrid.gridService;
        this.dataViewemp2O8 = angularGrid.dataView;
      }
      prepareGridemp2O8() {
        this.columnDefinitionsemp2O8 = [
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
            name: "Code Employé",
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
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_lname",
            name: "Prénom",
            field: "emp_lname",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_line1",
            name: "Adresse",
            field: "emp_line1",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_job",
            name: "Métier",
            field: "emp_job",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "emp_level",
            name: "Niveau",
            field: "emp_level",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          },
        ];
      
        this.gridOptionsemp2O8 = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          // frozenColumn: 0,
          // frozenBottom: true,
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
          presets: {
            sorters: [{ columnId: "id", direction: "ASC" }],
            rowSelection: {
              // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
              gridRowIndexes: this.selectedIndexes2O8, // (recommended) select by your data object IDs
              //dataContextIds
            },
          },
        };
      
        // fill the dataset with your data
        
        if (this.adduserO8 == false){this.employeService.getBy({}).subscribe((response: any) => (this.emps2O8 = response.data));}
        else{this.employeService.getBy({emp_job:'NONE'}).subscribe((response: any) => (this.emps2O8 = response.data));}
      }
      
      handleSelectedRowsChangedemp2O8(e, args) {
        this.selectedIndexesO8 = [];
        this.selectedIndexesO8 = args.rows;
      }
      openemp2O8(content) {
        this.prepareGridemp2O8();
        this.modalService.open(content, { size: "lg" });
      }
      addit2O8() {
        // this.itinerary.push({})
        const controls = this.trFormO8.controls;
        var l2: String;
        l2 = "";
        console.log(l2.length);
        this.selectedIndexesO8.forEach((index) => {
          if (index == 0) {
            l2 = this.emps2O8[index]["emp_fname"];
          } else {
            l2 = l2 + "," + this.emps2O8[index]["emp_fname"];
          }
          //id: index,
        });
      
        console.log(l2);
        controls.tr_user2.setValue(l2);
        this.user2O8 = l2;
      }
      onChangeuserO8() {
        const controls = this.trFormO8.controls;
        
        if(controls.adduser2.value == true){this.adduserO8 = false}
        else {this.adduserO8 = true,controls.tr_user2.setValue(null); this.emps2O8=[]}
      }
      onChangeCC() {
        const controls = this.trFormO8.controls;
        //const rqm_nbr = controls.tr_so_job.value;
       
        this.datasetO8 = [];
            this.inventoryTransactionService.getByNbr({ tr_lot: controls.tr_lot.value, tr_type:"RCT-PO" }).subscribe(
              (res: any) => {
                console.log(res)
               this.datasetO8 = res.data;
               if (this.datasetO8.length > 0) {
                // this.dataViewO8.setItems(this.datasetO8)
           
                this.inventoryTransactionService.getByRef({ tr_lot: controls.tr_lot.value, tr_type:"RCT-PO",tr_addr:controls.tr_addr.value }).subscribe(
                  (resp: any) => {
                    console.log(resp)
                    controls.tr_lot.setValue(resp.data[0].tr_lot || "");
                    controls.tr_effdate.setValue(resp.data[0].tr_effdate);
                    controls.tr_site.setValue(resp.data[0].tr_site || "");
                    controls.tr_loc.setValue(resp.data[0].tr_loc || "");
                    controls.tr_rmks.setValue(resp.data[0].tr_rmks || null);
                    controls.tr_addr.setValue(resp.data[0].tr_addr || "");
                    this.addressService.getBy({ad_name: resp.data[0].tr_addr}).subscribe((response: any)=>{
                  
                  
                      this.providerO8 = response.data[0]
              
                    controls.name.setValue(this.providerO8.ad_name);
                    }) 
    
                  })
    
          }else {
            alert("Récéption n'existe pas ")
            controls.tr_lot.setValue(null)
            //console.log(response.data.length)
            document.getElementById("tr_lot").focus();
          }
          })    
        
    
        
      }
      /*choisir demande achat*/
    handleSelectedRowsChanged5O8(e, args) {
      const controls = this.trFormO8.controls;
    
      
      
      if (Array.isArray(args.rows) && this.gridObj5O8) {
        this.datasetO8 = []
        args.rows.map((idx) => 
        {
          const item = this.gridObj5O8.getDataItem(idx);
          console.log(item.tr_user1,item.tr_effdate)
          controls.tr_lot.setValue(item.tr_lot || "");
          this.trlotO8 = item.tr_lot;
          controls.tr_user1.setValue(item.tr_user1 || null);
          controls.tr_user2.setValue(item.tr_user2 || null);
          controls.tr_rmks.setValue(item.tr_rmks || null);
          controls.tr_addr.setValue(item.tr_addr || "");
          controls.tr_effdate.setValue({ year: new Date(item.tr_effdate).getFullYear(),
          month: new Date(item.tr_effdate).getMonth() + 1,
          day: new Date(item.tr_effdate).getDate(),});
          
          this.inventoryTransactionService.getByRef({ tr_lot: item.tr_lot,tr_type:'RCT-PO',tr_effdate:item.tr_effdate,tr_addr:item.tr_addr }).subscribe(
            (res: any) => {
              this.datasetO8 = res.data
              // this.dataViewO8.setItems(this.datasetO8)
           
            },
            (error) => {
              this.message = `Récéption n'existe pas`;
              this.hasFormErrorsO8 = true;
            },
            () => {}
          );
      
          this.addressService.getBy({ad_addr: item.tr_addr}).subscribe((response: any)=>{
                    
                    
            this.providerO8 = response.data[0]
    
          // controls.name.setValue(this.provider.ad_name);
          })
        
          })
      }
     // this.calculatetot();
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
          id: "tr_lot",
          name: "N° Récéption",
          field: "tr_lot",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "tr_addr",
          name: "Fournisseur",
          field: "tr_addr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "tr_effdate",
          name: "Date",
          field: "tr_effdate",
          sortable: true,
          filterable: true,
          formatter:Formatters.dateIso ,
          type: FieldType.dateIso,
          filter: {
            model: Filters.dateRange,
            operator: 'RangeInclusive',
            // override any of the Flatpickr options through "filterOptions"
            //editorOptions: { minDate: 'today' } as FlatpickrOption
          },
        },
        {
          id: "tr_user1",
          name: "employés",
          field: "tr_user1",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "tr_user2",
          name: "Employé remplaçant",
          field: "tr_user2",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "tr_rmks",
          name: "Remarques",
          field: "tr_user2",
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
        checkboxSelector: {},
        multiSelect: false,
        rowSelectionOptions: {
          selectActiveRow: true,
        },
      };
     const controls = this.trFormO8.controls
      // fill the dataset with your data
      this.inventoryTransactionService
        .getByGroup({ tr_type:"RCT-PO" })
        .subscribe((response: any) => (this.transactionsO8 = response.data));
    }
    open5O8(content) {
      this.prepareGrid5O8();
      this.modalService.open(content, { size: "lg" });
    }
    handleSelectedRowsChangedsiteO8(e, args) {
      const controls = this.trFormO8.controls;
     
      if (Array.isArray(args.rows) && this.gridObjsiteO8) {
        args.rows.map((idx) => {
          const item = this.gridObjsiteO8.getDataItem(idx);
          // TODO : HERE itterate on selected field and change the value of the selected field
        
              controls.tr_site.setValue(item.si_site || "");
             
        });
      }
    }
    
    
    angularGridReadysiteO8(angularGrid: AngularGridInstance) {
      this.angularGridsiteO8 = angularGrid;
      this.gridObjsiteO8 = (angularGrid && angularGrid.slickGrid) || {};
    }
    
    prepareGridsiteO8() {
      this.columnDefinitionssiteO8 = [
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
    
      this.gridOptionssiteO8 = {
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
        .subscribe((response: any) => (this.datasiteO8 = response.data));
    }
    opensiteO8(contentsiteO8, fieldO8) {
      this.selectedFieldO8 = fieldO8;
      this.prepareGridsiteO8();
      this.modalService.open(contentsiteO8, { size: "lg" });
    }
    handleSelectedRowsChangedlocO8(e, args) {
      const controls = this.trFormO8.controls;
    
      if (Array.isArray(args.rows) && this.gridObjlocO8) {
        args.rows.map((idx) => {
          const item = this.gridObjlocO8.getDataItem(idx);
          // TODO : HERE itterate on selected field and change the value of the selected field
          
            
              controls.tr_loc.setValue(item.loc_loc || "");
             
           
           
          
        });
      }
    }
    angularGridReadylocO8(angularGrid: AngularGridInstance) {
      this.angularGridlocO8 = angularGrid;
      this.gridObjlocO8 = (angularGrid && angularGrid.slickGrid) || {};
    }
    
    prepareGridlocO8() {
      const controls = this.trFormO8.controls;
       
      
          this.sitO8 =  controls.tr_site.value;
          
      this.columnDefinitionslocO8 = [
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
          id: "loc_loc",
          name: "loc",
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
      ];
    
      this.gridOptionslocO8 = {
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
      this.locationService
        .getBy({ loc_site: this.sitO8 })
        .subscribe((response: any) => (this.datalocO8 = response.data));
    }
    openlocO8(contentlocO8, fieldO8) {
      this.selectedFieldO8 = fieldO8;
      this.prepareGridlocO8();
      this.modalService.open(contentlocO8, { size: "lg" });
    }
    changeSiteO8() {
      const controls = this.trFormO8.controls; // chof le champs hada wesh men form rah
      const si_site = controls.tr_site.value;
      this.siteService.getByOne({ si_site }).subscribe(
        (res: any) => {
            console.log(res)
          const { data } = res;
    
          if (!data) {
            this.layoutUtilsService.showActionNotification(
              "ce Site n'existe pas!",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.error = true;
          } else {
            this.error = false;
          }
        },
        (error) => console.log(error)
      );
    }
    
    
    changeLocO8() {
      const controls = this.trFormO8.controls; // chof le champs hada wesh men form rah
      const loc_loc = controls.tr_loc.value;
      const loc_site = controls.tr_site.value;
    
      this.locationService.getByOne({ loc_loc, loc_site }).subscribe(
        (res: any) => {
          const { data } = res;
    
          if (!data) {
            this.layoutUtilsService.showActionNotification(
              "cet Emplacement n'existe pas!",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.error = true;
          } else {
            this.error = false;
          }
        },
        (error) => console.log(error)
      );
    }
    // FIN ONGLET 8
     createFormO9() {
        this.loadingSubject.next(false);
          this.accountUnplanifed = new AccountUnplanifed();
          const date = new Date;
          
          this.asForm = this.asFB.group({
        //    so__chr01: [this.accountUnplanifed.au__chr01],
            au_ship:[this.accountUnplanifed.au_ship , Validators.required],
            au_vend: [{value: this.accountUnplanifed.au_vend} ],
            name: [{value:""}],
            au_curr: [{value: this.accountUnplanifed.au_curr}],
            amount:[{value:0}],
            unpaid:[{value:0}],
           
            
          
            au_effdate: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            
            au_bank: [this.accountUnplanifed.au_bank, Validators.required],
           
            au_pay_method: [this.accountUnplanifed.au_pay_method],
            
            au_check: [this.accountUnplanifed.au_check ],
    
            au_amt: [this.accountUnplanifed.au_amt],
           
            au_po: [this.accountUnplanifed.au_po],
            
    
    
          });
      
          
          
      
        }
    
    
    
        OnchangeBank (){
    
          const controls = this.asForm.controls 
          const bk_code  = controls.au_bank.value
         
          
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
        
                this.bankService
              .getAllDetails({ bkd_bank: bk_code, bkd_module: "AP" })
              .subscribe((response: any) => {(this.au_pay_method = response.data)
              console.log("hhhhhhhhhhhhhhh",this.au_pay_method)
            })    
                
            }
      
      
        },error=>console.log(error))
      }  
      //reste form
      resetO9() {
        this.accountUnplanifed = new AccountUnplanifed();
        this.createFormO9();
        
        this.hasFormErrors = false;
      }
      // save data
      onSubmitO9() {
        this.hasFormErrors = false;
        const controls = this.asForm.controls;
        /** check form */
        if (this.asForm.invalid) {
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
        
        const controls = this.asForm.controls;
       
         const _as = new AccountUnplanifed();
          _as.au_ship = controls.au_ship.value;
          _as.au_vend = controls.au_vend.value;
          _as.au_curr = controls.au_curr.value;
          
          
          _as.au_effdate = controls.au_effdate.value
            ? `${controls.au_effdate.value.year}/${controls.au_effdate.value.month}/${controls.au_effdate.value.day}`
            : null;
      
           
          
          _as.au_type = "P";
         
          _as.au_bank = controls.au_bank.value;
          _as.au_pay_method = controls.au_pay_method.value;
          _as.au_check = controls.au_check.value;
        
          _as.au_amt = controls.au_amt.value;
          _as.au_applied = controls.au_amt.value;
          _as.au_po = controls.au_po.value;
                          
        
          _as.au_open = false
          
    
         return _as;
        
      
      }
      /**
       * Add po
       *
       * @param _as: as
       */
      addAS(_as: AccountUnplanifed) {
        this.loadingSubject.next(true);
        let as = null;
        const controls = this.asForm.controls;
    
        this.accountUnplanifedService
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
              
              // this.router.navigateByUrl("/purchasing/payment-au");
              this.resetO9()
            }
          );
      }
     
      
    
    
      onChangeBL() {
        const controls = this.asForm.controls;
        const au_nbr = controls.au_ship.value;
        
        this.accountUnplanifedService.getBy({ au_ship:au_nbr, au_type : "I" }).subscribe(
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
              controls.au_ship.setValue(null);
              document.getElementById("check").focus();
              document.getElementById("bl").focus();
            } else {
              this.error = false;
              
              controls.au_ship.setValue(data.au_nbr || "");
              controls.au_vend.setValue(data.au_vend || "");
             
              controls.au_curr.setValue(data.au_curr || "");
              controls.amount.setValue(data.au_amt || "");
              controls.unpaid.setValue(Number(data.au_amt) - Number(data.au_applied) || "");
            
          controls.au_pay_method.setValue(data.au_pay_method || "");
         
          this.providerService.getBy({vd_addr: data.au_vend}).subscribe((response: any)=>{
                        
                        
          
            controls.name.setValue(response.data.address.ad_name || "");
            controls.au_bank.setValue(response.data.cm_bank || "");
            controls.au_pay_method.setValue(response.data.cm_pay_method|| "");
          
            
            this.bankService
            .getAllDetails({ bkd_bank: response.data.cm_bank, bkd_module: "AP" })
            .subscribe((response: any) => {(this.au_pay_method = response.data)
         
            })
           
           
         
    
          });    
        
      //  (error) => console.log(error)
        }
    
      });    
        
      }
    
      
      
    
      onChangeCheck() {
        const controls = this.asForm.controls;
        const au_check = controls.au_check.value;
        const au_bank = controls.au_bank.value;
        const au_pay_method = controls.au_pay_method.value;
    
        
        this.accountUnplanifedService.getBy({ au_check,au_bank, au_pay_method, au_type : "P" }).subscribe(
          (res: any) => {
            this.check = res.data[0];
            
            if (this.check != null) {
        
              this.layoutUtilsService.showActionNotification(
                "ce Cheque Existe Deja",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
              controls.au_check.setValue(null);
              document.getElementById("check").focus();
              
            }
            
         
    
          });    
        
      //  (error) => console.log(error)
      
    
        
        
      }
      onChangeAmt() {
        const controls = this.asForm.controls;
      
      
        if (Number(controls.au_amt.value) > Number(controls.rest.value)  ) {
        
              this.layoutUtilsService.showActionNotification(
                "Montant du paiement doit etre inferieur ou egale au montant BL",
                MessageType.Create,
                10000,
                true,
                true
              );
              this.error = true;
              controls.au_amt.setValue(0);
              document.getElementById("amt").focus();
              
            }
        
        
      }
    
      /**
       * Go back to the list
       *
       */
      
      goBackO9() {
        this.loadingSubject.next(false);
        const url = `/inventory-transaction/inventory-list`;
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
      }
    
      onAlertClose($event) {
        this.hasFormErrors = false;
      }
    
      
     
    handleSelectedRowsChangedblO9(e, args) {
      const controls = this.asForm.controls;
      console.log('test')
      if (Array.isArray(args.rows) && this.gridObjbl) {
        args.rows.map((idx) => {
          const item = this.gridObjbl.getDataItem(idx);
          console.log(item)
          
          this.bl = item;
          controls.au_ship.setValue(item.au_nbr || "");
          controls.au_vend.setValue(item.au_vend || "");
          controls.au_curr.setValue(item.au_curr || "");
          controls.amount.setValue(item.au_amt || "");
           controls.unpaid.setValue(Number(item.au_amt) - Number(item.au_applied) || "");
          controls.au_pay_method.setValue(item.cm_cr_terms || "");
         
          this.providerService.getBy({vd_addr: item.au_vend}).subscribe((response: any)=>{
                        
                        
          
            controls.name.setValue(response.data.address.ad_name || "");
            controls.au_bank.setValue(response.data.cm_bank || "");
            controls.au_pay_method.setValue(response.data.cm_pay_method|| "");
            this.bankService
            .getAllDetails({ bkd_bank: response.data.cm_bank, bkd_module: "AP" })
            .subscribe((response: any) => {(this.au_pay_method = response.data)
          })
          })
          
         
         
      })
    }
    }
    
    angularGridReadybl(angularGrid: AngularGridInstance) {
      this.angularGridbl = angularGrid;
      this.gridObjbl = (angularGrid && angularGrid.slickGrid) || {};
    }
    
    prepareGridbl() {
      this.columnDefinitionsbl = [
        {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
        },
        {
          id: "au_nbr",
          name: "BL",
          field: "au_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "au_vend",
          name: "Client",
          field: "au_vend",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "au_effdate",
          name: "Date",
          field: "au_effdate",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "au_amt",
          name: "Montant",
          field: "au_amt",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
      ];
    
      this.gridOptionsbl = {
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
      this.accountUnplanifedService
        .getBy({au_type: "I", au_open: true})
        .subscribe((response: any) => (this.bls = response.data));
    }
    openbl(content) {
      this.prepareGridbl();
      this.modalService.open(content, { size: "lg" });
    }
    
    handleSelectedRowsChangedbank(e, args) {
      const controls = this.asForm.controls;
      if (Array.isArray(args.rows) && this.gridObjbank) {
        args.rows.map((idx) => {
          const item = this.gridObjbank.getDataItem(idx);
          controls.au_bank.setValue(item.bk_code || "");
          
    
          this.bankService.getAP({bk_code: item.bk_code}).subscribe((res:any)=>{
           // console.log(res.data)
               // controls.ap_dy_code.setValue(res.data.details[0].bkd_dy_code || "")
                controls.au_pay_method.setValue(res.data.details[0].bkd_pay_method || "")
                         
                this.au_pay_method = res.data.details
    
              });        
        });
      }
    }
    
    angularGridReadybank(angularGrid: AngularGridInstance) {
      this.angularGridbank = angularGrid;
      this.gridObjbank = (angularGrid && angularGrid.slickGrid) || {};
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
        .getAll()
        .subscribe((response: any) => (this.banks = response.data));
    }
    openbank(content) {
      this.prepareGridbank();
      this.modalService.open(content, { size: "lg" });
    }
    
    // FIN ONGLET 9
    mvGridReady(angularGrid: AngularGridInstance) {
        this.mvangularGrid = angularGrid;
        this.mvdataView = angularGrid.dataView;
        this.mvgrid = angularGrid.slickGrid;
        this.mvgridService = angularGrid.gridService;
      }
      //create form
      createFormO10() {
        this.loadingSubject.next(false);
          this.accountPayable = new AccountUnplanifed ()
          const date = new Date;
          
          this.asFormO10 = this.asFB.group({
        //    so__chr01: [this.accountPayable.au__chr01],
             au_ship:[this.accountPayable.au_ship , ],
            au_vend: [this.accountPayable.au_vend , Validators.required ],
            name: [{value:"", disabled: true}],
            au_curr: [this.curr, Validators.required ],
            au_effdate: [{
              year:date.getFullYear(),
              month: date.getMonth()+1,
              day: date.getDate()
            }],
            
            au_bank: [this.accountPayable.au_bank, Validators.required],
            au_so_nbr: [this.accountPayable.au_so_nbr],
            au_pay_method: [this.accountPayable.au_pay_method, Validators.required],
            
            au_check: [this.accountPayable.au_check ],
    
            au_amt: [this.accountPayable.au_amt],
           
            au_po: [this.accountPayable.au_po],
            
    
    
          });
      
          this.user =  JSON.parse(localStorage.getItem('user'))
          const controls = this.asFormO10.controls
          this.bankService
                .getByAll({bk_userid: this.user.usrd_code})
                .subscribe((response: any) => {
                  if (response.data.length > 1) {
                    controls.au_bank.setValue(response.data[0].bk_code)
                  }
                });
                this.deviseService
                .getBy({ cu_active: true })
                .subscribe((response: any) => {this.curr = response.data
                console.log(this.curr)
            controls.au_curr.setValue(this.curr.cu_curr)
                })
        }
    
        OnchangeCurr(){
          const controls = this.asFormO10.controls
          
                this.deviseService
                .getBy({ cu_curr: controls.au_curr.value })
                .subscribe((response: any) => {
    
                  if (response.data == null){ 
                    alert("Devise n'existe pas")
                    controls.au_curr.setValue(null)
                    document.getElementById("au_curr").focus();
                  }
              })
               
        }
    
        
    
       
      //reste form
      resetO10() {
        this.accountPayable = new AccountUnplanifed();
        this.createFormO10();
        this.mvdataset=[]
        
        this.hasFormErrors = false;
      }
      // save data
      onSubmitO10() {
        this.hasFormErrors = false;
        const controls = this.asFormO10.controls;
        /** check form */
        if (this.asFormO10.invalid) {
          Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
          );
          this.message = "Modifiez quelques éléments et réessayez de soumettre.";
          this.hasFormErrors = true;
    
          return;
        }
    
        this.bankService.getBy({ bk_code : controls.au_bank.value }).subscribe(
          (resp: any) => {
            
            
            if (resp.data.bank.bk_balance >= Number(controls.au_amt.value)) {
        
              let as = this.prepareASO10()
              this.addASO10(as, this.mvdataset);
                 
            }
            else {
              
              let as = this.prepareAS()
              this.addASO10(as, this.mvdataset);
            }       
         
    
          });    
       
    
      }
    
      prepareASO10(): any {
        
        const controls = this.asFormO10.controls;
       
         const _as = new AccountUnplanifed();
        
          _as.au_vend = controls.au_vend.value;
          _as.au_curr = controls.au_curr.value;
          
          
          _as.au_effdate = controls.au_effdate.value
            ? `${controls.au_effdate.value.year}/${controls.au_effdate.value.month}/${controls.au_effdate.value.day}`
            : null;
      
           
          
          _as.au_type = "P";
         
          _as.au_bank = controls.au_bank.value;
          _as.au_pay_method = controls.au_pay_method.value;
          _as.au_check = controls.au_check.value;
        
          _as.au_amt = controls.au_amt.value;
          _as.au_applied = controls.au_amt.value;
          _as.au_po = controls.au_po.value;
          _as.au_so_nbr = controls.au_so_nbr.value;
          _as.au_open = false
          
    
         return _as;
        
      
      }
      /**
       * Add po
       *
       * @param _as: as
       */
      addASO10(_au: any, detail: any) {
        this.loadingSubject.next(true);
        let as = null;
        for (let data of detail) {
          delete data.id;
          delete data.cmvid;
         
        }
        const controls = this.asFormO10.controls;
    
        this.accountUnplanifedService
        .addFC({ accountUnplanifed: _au, accountUnplanifedDetail: detail})
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
              this.resetO10()
              this.router.navigateByUrl("/account-payable/create-charge-payment");
              this.resetO10()
            }
          );
      }
     
     
      /**
       * Go back to the list
       *
       */
      goBackO10() {
        this.loadingSubject.next(false);
        const url = `/account-payable/create-charge-payment`;
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
      }
    
      
    
      
     
    
    
    
    
    
    
    
    
    handleSelectedRowsChangedvend(e, args) {
      const controls = this.asFormO10.controls;
      if (Array.isArray(args.rows) && this.gridObjvend) {
        args.rows.map((idx) => {
          const item = this.gridObjvend.getDataItem(idx);
        //  console.log(item)
          
          
          controls.au_vend.setValue(item.vd_addr || "");
            controls.name.setValue(item.address.ad_name || "");
          
         
         
      })
    }
    }
    
    angularGridReadyvend(angularGrid: AngularGridInstance) {
      this.angularGridvend = angularGrid;
      this.gridObjvend = (angularGrid && angularGrid.slickGrid) || {};
    }
    
    prepareGridvend() {
      this.columnDefinitionsvend = [
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
          name: "Client",
          field: "address.ad_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "vd_class",
          name: "Classe",
          field: "vd_class",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "vd_type",
          name: "Type",
          field: "vd_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "vd_curr",
          name: "Devise",
          field: "vd_curr",
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
    
      this.gridOptionsvend = {
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
      this.providerService
        .getAll()
        .subscribe((response: any) => (this.vends = response.data));
    }
    openVend(content) {
      this.prepareGridvend();
      this.modalService.open(content, { size: "lg" });
    }
    
    initmvGrid() {
      this.mvcolumnDefinitions = [
        {
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
        },
        {
          id: "aud_fc_code",
          name: "Code Charge",
          field: "aud_fc_code",
          sortable: true,
          width: 50,
          filterable: false,
          type: FieldType.string,
        
        },
        
        {
          id: "aud_desc",
          name: "Description",
          field: "aud_desc",
          sortable: true,
          width: 200,
          filterable: false,
          type: FieldType.string,
         
        },
        {
          id: "aud_amt",
          name: "Montant",
          field: "aud_amt",
          sortable: true,
          width: 50,
          filterable: false,
          type: FieldType.number,
          editor: {
            model: Editors.float,
          },
          onCellChange: (e: Event, args: OnEventArgs) => {
             
            const controls  = this.asFormO10.controls
            let tot = 0
            for (let data of this.mvdataset) {
              tot = tot + data.aud_amt
    
            }
    controls.au_amt.setValue(tot)
          },
        },
        
        
      ];
    
      this.mvgridOptions = {
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
        autoEdit:true,
        autoCommitEdit:true,
      };
    
      this.mvdataset = [];
    }
    addNewItem() {
      const newId = this.mvdataset.length+1;
    
      const newItem = {
        id: newId,
        aud_fc_code : "",
        aud_desc: "",
        aud_amt: 0,
      };
      this.mvgridService.addItem(newItem, { position: "bottom" });
    }
    
    openCharge(content) {
      this.prepareGridcharge();
      this.modalService.open(content, { size: "xl" });
    }
    
    getTrainingDet(){
      this.mvdataset=[]
      // for(let job of this.selectedJob) {
    
      //   console.log(job)
      // }
      
       let idd = 0
        for (let data of this.selectedc){
          const found = this.datacharge.find((element) => element.fc_code == data);
          console.log(found)
    
    
         // this.gridServicetr.addItem(
          let obj =  {
              id: idd + 1,
              aud_fc_code: found.fc_code,
              aud_desc : found.fc_desc,
              aud_amt : 0,
            };
              this.mvdataset.push(obj)
            idd++;
        }
    
      this.modalService.dismissAll()
      // let element: HTMLElement = document.getElementById('openTrsGrid') as HTMLElement;
      // element.click();
    }
    
    
    angularGridReadyc(angularGrid: AngularGridInstance) {
      this.angularGridc = angularGrid;
      this.gridObjc = (angularGrid && angularGrid.slickGrid) || {};
    }
    
    prepareGridcharge() {
      this.columnDefinitionsc = [
         
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
         
          {
              id: "fc_code",
              name: "Code",
              field: "fc_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "fc_desc",
              name: "Designation",
              field: "fc_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.text,
              
            
          },
          {
            id: "fc_type",
            name: "Type",
            field: "fc_type",
            sortable: true,
            filterable: true,
            type: FieldType.text,
          },
          
        
          
          
      ]
    
      this.gridOptionsc = {
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
        showCellSelection:true,
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
      };
        
          
     
    
      // fill the dataset with your data
      this.datacharge = []
      this.financialchargeService.getAll().subscribe(
          (response: any) => (this.datacharge = response.data),
          (error) => {
              this.datacharge = []
          },
          () => {}
      )
    }
    handleSelectedRowsChangedc(e, args) {
      if (Array.isArray(args.rows) && this.gridObjc) {
        this.selectedc = args.rows.map((idx: number) => {
          const item = this.gridObjc.getDataItem(idx);
          return item.fc_code;
        });
      }
      console.log(this.selectedc)
    }
    charge(){
      this.loadingSubject.next(false);
        const url = `/financialcharge/create-fc`;
        this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
    }
}


  
  

