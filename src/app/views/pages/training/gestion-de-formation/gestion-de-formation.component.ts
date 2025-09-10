import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { jsPDF } from "jspdf";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
import { HttpClient } from "@angular/common/http"
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
  EditorValidator,
  EditorArgs,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  Aggregators,
  Filters,
  
  SortDirectionNumber,
  Sorters,
  
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  OperatorType,
  OperatorString,
  SearchTerm,
} from "angular-slickgrid";
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

import { Employe, EmployeService, JobService , CodeService, SiteService,AddressService,UsersService, ItemService, Item,
  CostSimulation,
  AccountUnplanifed,
  Location,     
  DeviseService,
  FinancialchargeService,
  BankService,
  AccountShiperService,LocationDetail, 
  AccountUnplanifedService,
  Requisition, RequisitionService,SequenceService, ProviderService,Reason, ReasonService,
  PayMethService, ProjectService, TaskService,AffectEmpService, AffectEmp , LocationService,
  CostSimulationService,LocationDetailService,InventoryStatusService,MesureService, InventoryTransactionService,TrainingcalenderService,RepertoryService
} from "../../../../core/erp"

import { LocationFilterService } from "src/app/core/erp/_services/location-filter.service"
import { LocationFilter } from "src/app/core/erp/_models/location-filter.model"
import { is } from "@amcharts/amcharts4/core"
import { T } from "@angular/cdk/keycodes"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { array } from "@amcharts/amcharts4/core";
const API_URL = environment.apiUrl + "/jobs"
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
const myCustomStringFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value!= null){
    return `<div class="text"  aria-hidden="${value}" style="font-size:14px;" >${value}</div>`
  }
}
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"

@Component({ 
  selector: 'kt-gestion-de-formation',
  templateUrl: './gestion-de-formation.component.html',
  styleUrls: ['./gestion-de-formation.component.scss']
})
export class GestionDeFormationComponent implements OnInit {
  // onglet créer formation
  item: Item;
  hasFormErrors1 = false;
  hasFormErrors5 = false;
  formX: FormGroup;
  ad_country: any[] = []
  pt_network:any[] = []
  pt_bom_code: any[] = []
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  // slick grid
  columnDefinitionsO1_1: Column[] = [];
  gridOptionsO1_1: GridOption = {};
  datasetO1_1: any[] = [];

  sequences: [];
  columnDefinitionsseq: Column[] = [];
  gridOptionsseq: GridOption = {};
  gridObjseq: any;
  angularGridseq: AngularGridInstance;

  columnDefinitionsO1_2: Column[] = [];
  gridOptionsO1_2: GridOption = {};
  datasetO1_2: any[] = [];

  providers: [];
  columnDefinitionsprov: Column[] = [];
  gridOptionsprov: GridOption = {};
  gridObjprov: any;
  angularGridprov: AngularGridInstance;

  // selects
  pt_dsgn_grp: any[]=[];
  pt_draw: any[] = [];
  pt_group: any[] = [];

  methangularGrid: AngularGridInstance;
  methgrid: any;
  methgridService: GridService;
  methdataView: any;
  methcolumnDefinitions: Column[];
  methgridOptions: GridOption;
  methdataset: any[];

  progangularGrid: AngularGridInstance;
  proggrid: any;
  proggridService: GridService;
  progdataView: any;
  progcolumnDefinitions: Column[];
  proggridOptions: GridOption;
  progdataset: any[];

  objeangularGrid: AngularGridInstance;
  objegrid: any;
  objegridService: GridService;
  objedataView: any;
  objecolumnDefinitions: Column[];
  objegridOptions: GridOption;
  objedataset: any[];


  row_number;
  error = false;
  msg: String;
  isExist = false;
  
  

  
  jobsO1: [];
  columnDefinitionsjobsO1: Column[] = [];
  gridOptionsjobsO1: GridOption = {};
  gridObjjobsO1: any;
  angularGridjobsO1: AngularGridInstance;
  domain    : any;  
  user:any;
  part:any;

  sct1: CostSimulation;
  sct2: CostSimulation;
 
  sctForm: FormGroup;
  sctForm1: FormGroup;
// fin onglet 1

  angularGridO2: AngularGridInstance
  gridO2: any
  gridServiceO2: GridService
  dataViewO2: any
  columnDefinitionsO2: Column[] = []
  gridOptionsO2: GridOption = {}
  datasetO2: any[] = []
  datadetO2: any [] = []
  columnDefinitionsO2_1: Column[] = [];
  gridOptionsO2_1: GridOption = {};
  gridObjO2_1: any;
  angularGridO2_1: AngularGridInstance;
  
// FIN ONGLET 2
requisition: Requisition
  reqForm: FormGroup
  hasFormErrors3 = false
  
  angularGridO3: AngularGridInstance
  gridO3: any
  gridServiceO3: GridService
  dataViewO3: any
  columnDefinitionsO3: Column[]
  gridOptionsO3: GridOption
  datasetO3: any[]

  sequencesO3: []
  columnDefinitions1O3: Column[] = []
  gridOptions1O3: GridOption = {}
  gridObj1O3: any
  angularGrid1O3: AngularGridInstance

  providersO3: []
  columnDefinitions2O3: Column[] = []
  gridOptions2O3: GridOption = {}
  gridObj2O3: any
  angularGrid2O3: AngularGridInstance

  usersO3: []
  columnDefinitions3O3: Column[] = []
  gridOptions3O3: GridOption = {}
  gridObj3O3: any
  angularGrid3O3: AngularGridInstance

  itemsO3: []
  columnDefinitions4O3: Column[] = []
  gridOptions4O3: GridOption = {}
  gridObj4O3: any
  angularGrid4O3: AngularGridInstance
  
  causesO3: []
  columnDefinitions6O3: Column[] = []
  gridOptions6O3: GridOption = {}
  gridObj6O3: any
  angularGrid6O3: AngularGridInstance
  
  message=''
employe: any
seq:any
selectedJob: any[] = [];
datasetemps: any[]
data: any[]
un: any
year:any[] = [];

// FIN ONGLET 3

affectEmp: AffectEmp;
  empFormO8: FormGroup;
  

  
  weekdays: any[] = [];
  emps: []
  columnDefinitionsempO8: Column[] = []
  gridOptionsempO8: GridOption = {}
  gridObjempO8: any
  angularGridempO8: AngularGridInstance
  dataViewempO8: any;
  gridServiceempO8: GridService;

  paysO8: []
  columnDefinitionspayO8: Column[] = []
  gridOptionspayO8: GridOption = {}
  gridObjpayO8: any
  angularGridpayO8: AngularGridInstance
  dataViewpayO8: any;
  gridServicepayO8: GridService;

  providersO8: []
  columnDefinitionsprovO8: Column[] = []
  gridOptionsprovO8: GridOption = {}
  gridObjprovO8: any
  angularGridprovO8: AngularGridInstance

  datasetO8: []
  columnDefinitionsO8: Column[] = []
  gridOptionsO8: GridOption = {}
  gridObjO8: any
  angularGridO8: AngularGridInstance

  datasetsO8: []
  columnDefinitionssO8: Column[] = []
  gridOptionssO8: GridOption = {}
  gridObjsO8: any
  angularGridsO8: AngularGridInstance
  
  datasetinstO8: []
  columnDefinitionsinstO8: Column[] = []
  gridOptionsinstO8: GridOption = {}
  gridObjinstO8: any
  angularGridinstO8: AngularGridInstance
  
  datasettaskO8: []
  columnDefinitionstaskO8: Column[] = []
  gridOptionstaskO8: GridOption = {}
  gridObjtaskO8: any
  angularGridtaskO8: AngularGridInstance

  datasetformO8: []
  columnDefinitionsformO8: Column[] = []
  gridOptionsformO8: GridOption = {}
  gridObjformO8: any
  angularGridformO8: AngularGridInstance

  details: any;
  // grid options
  mvangularGridO8: AngularGridInstance;
  mvgridO8: any;
  mvgridServiceO8: GridService;
  mvdataViewO8: any; 
  mvcolumnDefinitionsO8: Column[];
  mvgridOptionsO8: GridOption;
  mvdatasetO8: any[];
  
  empsreqO8: [];
  columnDefinitionsempreqO8: Column[] = [];
  gridOptionsempreqO8: GridOption = {};
  gridObjempreqO8: any;
  angularGridempreqO8: AngularGridInstance;
  dataViewempreqO8: any;
  gridServiceempreqO8: GridService;
  selectedIndexes: any[];
  index: any;

  itemsO8: [];
    columnDefinitions4O8: Column[] = [];
    gridOptions4O8: GridOption = {};
    gridObj4O8: any;
    angularGrid4O8: AngularGridInstance;
  
    
    datalocdetO8: [];
    columnDefinitionslocdetO8: Column[] = [];
    gridOptionslocdetO8: GridOption = {};
    gridObjlocdetO8: any;
    angularGridlocdetO8: AngularGridInstance;
    umsO8: [];
    columnDefinitionsumO8: Column[] = [];
    gridOptionsumO8: GridOption = {};
    gridObjumO8: any;
    angularGridumO8: AngularGridInstance;
  

    datasiteO8: []
    columnDefinitionssiteO8: Column[] = []
    gridOptionssiteO8: GridOption = {}
    gridObjsiteO8: any
    angularGridsiteO8: AngularGridInstance

  hasFormErrors8 = false;
  
  jobO8: String;
  levelO8: String;
  seqO8 : any;
  nbrO8: string;
  domaineO8:any;
  userO8
    angularGridcnsO8: AngularGridInstance;
    gridcnsO8: any;
    gridServicecnsO8: GridService;
    dataViewcnsO8: any;
    columnDefinitionscnsO8: Column[];
    gridOptionscnsO8: GridOption;
    cnsdatasetO8: any[];
    
    locationO8: any;
    sctO8: any;
    lddetO8: any;
    trlotO8: string;
    datasetPrintO8 = [];
    statO8: String;

    locO8: String;
    siteO8: String;

    alertWarningO8: any;

// FIN ONGLET 8

  draggableGroupingPluginO9: any;
  selectedGroupingFieldsO9: Array<string | GroupingGetterFunction> = ['', '', ''];
  dataviewO9: any;
  gridO9: any;
  columnDefinitionsO9: Column[] = []
  gridOptionsO9: GridOption = {}
  datasetO9: any[] = []
  datadetO9: any [] = []
  columnDefinitions1O9: Column[] = [];
  gridOptions1O9: GridOption = {};
  gridObj1O9: any;
  angularGrid1O9: AngularGridInstance;
  angularGridO9: AngularGridInstance;
  gridServiceO9: GridService;
  itemO9: any
  // FIN ONGLET 9
  repFormO10: FormGroup;
  

  
    
  adressesO10:any[] = [];
  hasFormErrors10 = false;
  
  adtypeO10: any;
    datacustO10: []
    columnDefinitionscustO10: Column[] = []
    gridOptionscustO10: GridOption = {}
    gridObjcustO10: any
    angularGridcustO10: AngularGridInstance

  columnDefinitionsO10: Column[];
  gridOptionsO10: GridOption;
  gridObjO10: any;
  dataViewO10: any;
  gridO10: any;
  gridServiceO10: GridService;
  angularGridO10: AngularGridInstance;
 
  columnDefinitionsJobO10: Column[];
  gridOptionsJobO10: GridOption;
  gridObjJobO10: any;
  dataViewJobO10: any;
  gridJobO10: any;
  gridServiceJobO10: GridService;
  angularGridJobO10: AngularGridInstance;

  datajobO10: [];
  columnDefinitionsjO10: Column[] = [];
  gridOptionsjO10: GridOption = {};
  gridObjjO10: any;
  angularGridjO10: AngularGridInstance;

  columnDefinitionsDomO10: Column[];
  gridOptionsDomO10: GridOption;
  gridObjDomO10: any;
  dataViewDomO10: any;
  gridDomO10: any;
  gridServiceDomO10: GridService;
  angularGridDomO10: AngularGridInstance;


  datadomO10: [];
  columnDefinitionsdO10: Column[] = [];
  gridOptionsdO10: GridOption = {};
  gridObjdO10: any;
  angularGriddO10: AngularGridInstance;

  repsO10: any[] = [];
  jobsO10: any[] = [];
  httpOptionsO10 = this.httpUtils.getHTTPHeaders();
  contactO10:any;
  // FIN ONGLET 10
  accountPayable: AccountUnplanifed;
  asForm: FormGroup;
  hasFormErrors11 = false;
  
  angularGridO11: AngularGridInstance;
  
  
  blsO11: [];
    columnDefinitionsblO11: Column[] = [];
    gridOptionsblO11: GridOption = {};
    gridObjblO11: any;
    angularGridblO11: AngularGridInstance;
  vendsO11: [];
    columnDefinitionsvendO11: Column[] = [];
    gridOptionsvendO11: GridOption = {};
    gridObjvendO11: any;
    angularGridvendO11: AngularGridInstance;  
    
 
    banksO11: [];
    columnDefinitionsbankO11: Column[] = [];
    gridOptionsbankO11: GridOption = {};
    gridObjbankO11: any;
    angularGridbankO11: AngularGridInstance;
  
  
  
  
  
  datasetPrint = [];
  curr:any
  bl: any;
  
  pshnbr: String;
  check;
  nbr;
  au_pay_method
  // grid options
  mvangularGridO11: AngularGridInstance;
  mvgridO11: any;
  mvgridServiceO11: GridService;
  mvdataViewO11: any;
  mvcolumnDefinitionsO11: Column[];
  mvgridOptionsO11: GridOption;
  mvdatasetO11: any[];

  datachargeO11: any [];
    columnDefinitionscO11: Column[] = [];
    gridOptionscO11: GridOption = {};
    gridObjcO11: any;
    angularGridcO11: AngularGridInstance;
    selectedcO11:  number[] = [];
  // FIN ONGLET 11
  location: Location
    locationFilter:LocationFilter
    locationForm: FormGroup
    form1:FormGroup
    hasFormErrors12 = false
    
    loc_type: any[] = []
   

    datasiteO12: []
    columnDefinitionssiteO12: Column[] = []
    gridOptionssiteO12: GridOption = {}
    gridObjsiteO12: any
    angularGridsiteO12: AngularGridInstance
    selectedFieldO12 = ""

    datastatus12: []
    columnDefinitionsstatus12: Column[] = []
    gridOptionsstatus12: GridOption = {}
    gridObjstatus12: any
    angularGridstatus12: AngularGridInstance

    datapm12: []
    columnDefinitionspm12: Column[] = []
    gridOptionspm12: GridOption = {}
    gridObjpm12: any
    angularGridpm12: AngularGridInstance
    
    data12: []
    columnDefinitions312: Column[] = []
    gridOptions312: GridOption = {}
    gridObj312: any
    angularGrid312: AngularGridInstance
    

    //for filter
    dataset12: any[]=[];
    datasetSaved12: any[]=[];
    angularGrid12: AngularGridInstance;
    grid12: any;
    gridService12: GridService;
    dataView12: any;
    columnDefinitions12: Column[];
    gridOptions12: GridOption;
    filtredList12: any[] = [];
    public isChecked = false;
    selectedList12: any[]=[]

    angularGridSelected12: AngularGridInstance;
    columnSelectedDefinitions12: Column[];
    gridSelected12: any;
    gridServiceSelected12: GridService;
    gridSelectedOptions12: GridOption;
    listprodIds12: any[] = [];
// FIN ONGLET 12

  
  gridObjO13: any;
  dataViewO13: any;
  gridO13: any;
  gridServiceO13: GridService;
  angularGridO13: AngularGridInstance;
columnDefinitionsO13: Column[] = []
  gridOptionsO13: GridOption = {}
  datasetO13: any[] = []
  // FIN ONGLET 13
  columnDefinitionsO14: Column[] = []
  gridOptionsO14: GridOption = {}
  datasetO14: any[] = []
  draggableGroupingPluginO14: any;
  angularGridO14: AngularGridInstance;

  gridO14: any;
  gridServiceO14: GridService;
  dataviewO14: any;
 


  selectedGroupingFieldsO14: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObjO14: any;
  dataviewObjO14: any;
  // FIN ONGLET 14
  selecteditem:any;
  
  draggableGroupingPluginO15: any;
  selectedGroupingFieldsO15: Array<string | GroupingGetterFunction> = ['', '', ''];
  dataviewO15: any;
  gridO15: any;
  columnDefinitionsO15: Column[] = []
  gridOptionsO15: GridOption = {}
  datasetO15: any[] = []
  datadetO15: any [] = []
  columnDefinitions1O15: Column[] = [];
  gridOptions1O15: GridOption = {};
  gridObj1O15: any;
  angularGrid1O15: AngularGridInstance;
  angularGridO15: AngularGridInstance;
  gridServiceO15: GridService;
  itemO15: any

  draggableGroupingPluginO16: any;
  selectedGroupingFieldsO16: Array<string | GroupingGetterFunction> = ['', '', ''];
  dataviewO16: any;
  gridO16: any;
  columnDefinitionsO16: Column[] = []
  gridOptionsO16: GridOption = {}
  datasetO16: any[] = []
  datadetO16: any [] = []
  columnDefinitions1O16: Column[] = [];
  gridOptions1O16: GridOption = {};
  gridObj1O16: any;
  angularGrid1O16: AngularGridInstance;
  angularGridO16: AngularGridInstance;
  gridServiceO16: GridService;
  itemO16: any

  draggableGroupingPluginO17: any;
  selectedGroupingFieldsO17: Array<string | GroupingGetterFunction> = ['', '', ''];
  dataviewO17: any;
  gridO17: any;
  columnDefinitionsO17: Column[] = []
  gridOptionsO17: GridOption = {}
  datasetO17: any[] = []
  datadetO17: any [] = []
  columnDefinitions1O17: Column[] = [];
  gridOptions1O17: GridOption = {};
  gridObj1O17: any;
  angularGrid1O17: AngularGridInstance;
  angularGridO17: AngularGridInstance;
  gridServiceO17: GridService;
  itemO17: any

  draggableGroupingPluginO18: any;
  selectedGroupingFieldsO18: Array<string | GroupingGetterFunction> = ['', '', ''];
  dataviewO18: any;
  gridO18: any;
  columnDefinitionsO18: Column[] = []
  gridOptionsO18: GridOption = {}
  datasetO18: any[] = []
  datadetO18: any [] = []
  columnDefinitions1O18: Column[] = [];
  gridOptions1O18: GridOption = {};
  gridObj1O18: any;
  angularGrid1O18: AngularGridInstance;
  angularGridO18: AngularGridInstance;
  gridServiceO18: GridService;
  itemO18: any

  draggableGroupingPluginO19: any;
  selectedGroupingFieldsO19: Array<string | GroupingGetterFunction> = ['', '', ''];
  dataviewO19: any;
  gridO19: any;
  columnDefinitionsO19: Column[] = []
  gridOptionsO19: GridOption = {}
  datasetO19: any[] = []
  datadetO19: any [] = []
  columnDefinitions1O19: Column[] = [];
  gridOptions1O19: GridOption = {};
  gridObj1O19: any;
  angularGrid1O19: AngularGridInstance;
  angularGridO19: AngularGridInstance;
  gridServiceO19: GridService;
  itemO19: any
  // FIN ONGLET HORAIRES
  empForm: FormGroup
  repForm: FormGroup;
  hasEmployeErrors = false
  field = ""
  selectedTab = 0
    dataO5: []
    columnDefinitions3: Column[] = []
    gridOptions3: GridOption = {}
    gridObj3: any
    angularGrid3: AngularGridInstance
    selectedField = ""
   
    hasEmployeFormErrors = false

    datasite: []
    columnDefinitionssite: Column[] = []
    gridOptionssite: GridOption = {}
    gridObjsite: any
    angularGridsite: AngularGridInstance
    
    datacust: []
    columnDefinitionscust: Column[] = []
    gridOptionscust: GridOption = {}
    gridObjcust: any
    angularGridcust: AngularGridInstance

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
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

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
    
    httpOptions = this.httpUtils.getHTTPHeaders()
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

    items: [];
    columnDefinitions4: Column[] = [];
    gridOptions4: GridOption = {};
    gridObj4: any;
    angularGrid4: AngularGridInstance;


  grid: any;
  gridService: GridService;
  dataView: any;
  
  angularGrid: AngularGridInstance;
  draggableGroupingPlugin: any;    
  
  columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    dataset: any[] = []
    
  constructor(
    config: NgbDropdownConfig,
   
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private codeService: CodeService,
    private itemService: ItemService,
    private jobService:JobService,
    private sctService: CostSimulationService,
    private empFB: FormBuilder,
    private employeService: EmployeService,
    private siteService: SiteService,
      private addressService:AddressService,
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private userService: UsersService,
      private itemsService: ItemService,
      private repFB: FormBuilder,
      private reqFB: FormBuilder,
      private requisitonService: RequisitionService,
      private providersService: ProviderService,
      private sequencesService: SequenceService,
      private reasonService: ReasonService,
          
    
    private affectEmpService: AffectEmpService,
    private sequenceService: SequenceService,
    private projectService: ProjectService,
    private providerService: ProviderService,
    private inventoryTransactionService: InventoryTransactionService,
    
    private locationService: LocationService,
   
    private inventoryStatusService: InventoryStatusService,
    
    private mesureService: MesureService,
    private locationDetailService: LocationDetailService,
    private TrainingCalendarService: TrainingcalenderService,
    private payMethService: PayMethService,
    private RepertoryService: RepertoryService,
      
    private asFB: FormBuilder,
    private bankService: BankService,
    private financialchargeService: FinancialchargeService,
    private deviseService:  DeviseService,
    private accountUnplanifedService: AccountUnplanifedService,
    private accountshipperService: AccountShiperService,
    
    private locationFB: FormBuilder,
    
    
    
    private locationFilterService: LocationFilterService,
  
      
  ) { 
    var y : any;
    for(var i=2025; i <= 2099;i++) {
      for (var j = 1; j <= 4; j++)
      {y = "T" + j + '-' + i
        this.year.push({y})}
      
    }
    
    this.codeService
    .getBy({ code_fldname: "check_form" })
    .subscribe((response: any) => (this.au_pay_method = response.data));

    this.initGridO3()

    this.prepareGridO2()
    
    this.prepareGrid()
      config.autoClose = true
      // ONGLET CREER FORMATION
      this.codeService
      .getBy({ code_fldname: "pt_origin" })
      .subscribe((response: any) => (this.ad_country = response.data))
      this.codeService
      .getBy({ code_fldname: "pt_network" })
      .subscribe((response: any) => (this.pt_network = response.data))
    
      this.codeService
      .getBy({ code_fldname: "pt_dsgn_grp" })
      .subscribe((response: any) => (this.pt_dsgn_grp = response.data));  
    this.codeService
      .getBy({ code_fldname: "pt_bom_code" })
      .subscribe((response: any) => (this.pt_bom_code = response.data));  
      this.codeService
      .getBy({ code_fldname: "pt_draw" })
      .subscribe((response: any) => (console.log(response.data), this.pt_draw = response.data));
    // ONGLET CREER FORMATION
   
      this.codeService
      .getBy({ code_fldname: "ad_state" })
      .subscribe((response: any) => (this.emp_state = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_country" })
      .subscribe((response: any) => (this.emp_country = response.data))
  this.codeService
      .getBy({ code_fldname: "ad_county" })
      .subscribe((response: any) => (this.emp_county = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_city" })
      .subscribe((response: any) => (this.emp_city = response.data))
      
      
      this.prepareGrid12();
      this.codeService
          .getBy({ code_fldname: "loc_type" })
          .subscribe((response: any) => (this.loc_type = response.data))
          this.prepareGridO13();
          this.prepareGridO14();
          this.prepareGridO15();
          this.prepareGridO16();
          this.prepareGridO17();
          this.prepareGridO18();
          this.prepareGridO19();
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));

    this.createFormO1();
    this.createFormO3()
    this.initmethGrid();
    this.initprogGrid();
    this.initobjeGrid();


      
    this.createFormRep();
    this.hasFormErrors1 = false
    this.createForm()
    this.initmvGrid();
    this.initjbGrid()
    this.inittrGrid()
    const controls = this.empForm.controls
    this.employeService
      .getAll()
      .subscribe((response: any) => {
          if (response.data.length != 0) {this.nbr = response.data.length + 1}
          else{this.nbr = 1}
           controls.emp_addr.setValue('E'+String('000'+ String(this.nbr)).slice(-3))
              controls.emp_lname.enable()
              controls.emp_fname.enable()
              controls.emp_line1.enable()  
              controls.emp_country.enable()
              controls.emp_city.enable()
              controls.emp_state.enable()
              controls.emp_phone.enable()
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
              

          })
            
          this.createFormO8();
          this.initmvGridO8();
          this.initcnsGridO8();
          this.getweekdays();
          this.prepareGridO9()
          this.createFormO10();
          this.initGridO10();
         this.initGridJobO10();
         
         this.resetO11();
         this.createFormO11();
         this.initmvGridO11();

         this.createForm12()
        this.prepareGrid12()
        this.prepareGridSelected12()

        this.prepareGridO13()
        this.prepareGridO14()

        this.prepareGridO15()
        this.prepareGridO16()
        this.prepareGridO17()
        this.prepareGridO18()
        this.prepareGridO19()
}

methGridReady(angularGrid: AngularGridInstance) {
  this.methangularGrid = angularGrid;
  this.methdataView = angularGrid.dataView;
  this.methgrid = angularGrid.slickGrid;
  this.methgridService = angularGrid.gridService;
}
objeGridReady(angularGrid: AngularGridInstance) {
  this.objeangularGrid = angularGrid;
  this.objedataView = angularGrid.dataView;
  this.objegrid = angularGrid.slickGrid;
  this.objegridService = angularGrid.gridService;
}
progGridReady(angularGrid: AngularGridInstance) {
  this.progangularGrid = angularGrid;
  this.progdataView = angularGrid.dataView;
  this.proggrid = angularGrid.slickGrid;
  this.proggridService = angularGrid.gridService;
}
//create form
createFormO1() {
  this.loadingSubject.next(false);
  this.item = new Item();
  this.formX = this.formBuilder.group({
    pt_dsgn_grp:[{ value: this.item.pt_dsgn_grp},Validators.required],
    pt_draw: [{ value: this.item.pt_draw },Validators.required],
    pt_group: [{ value: this.item.pt_group}],
    pt_part: [this.item.pt_part],
    pt_desc1: [{ value: this.item.pt_desc1, disabled: !this.isExist },Validators.required],
    
    pt_iss_pol: [{ value: false, disabled: !this.isExist }],
    pt_rollup: [{ value: false, disabled: !this.isExist }],
    pt_phantom: [{ value: false, disabled: !this.isExist }],
    pt_insp_rqd: [{ value: false, disabled: !this.isExist }],
    pt_critical: [{ value: false, disabled: !this.isExist }],
    pt_network: [{ value: this.item.pt_network, disabled: !this.isExist }],
    pt_origin: [{ value: this.item.pt_origin, disabled: !this.isExist }],
    pt_bom_code: [{ value: this.item.pt_bom_code, disabled: !this.isExist }],
    pt_shelflife: [{ value: this.item.pt_shelflife, disabled: !this.isExist }],
    pt_price: [{ value: this.item.pt_price, disabled: !this.isExist }],
    pt_pur_price: [{ value: this.item.pt_pur_price, disabled: !this.isExist }],
    
  })
  this.sct1 = new CostSimulation();
}
onChangeCodeO1() {
  const controls = this.formX.controls

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
            controls.pt_draw.enable()
            controls.pt_group.enable()
            controls.pt_iss_pol.enable()
            controls.pt_rollup.enable()
            controls.pt_phantom.enable()
            controls.pt_insp_rqd.enable()
            controls.pt_critical.enable()
            controls.pt_network.enable()
            controls.pt_origin.enable()  
            controls.pt_bom_code.enable() 
            controls.pt_shelflife.enable() 
            controls.pt_price.enable() 
            controls.pt_pur_price.enable() 

            document.getElementById("pt_desc1").focus();

          }
      })
}

resetO1() {
  this.item = new Item();
  this.createFormO1();
  this.methdataset= []
  this.progdataset= []
  this.objedataset= []
  this.hasFormErrors1 = false;
}
// save data
onSubmitO1() {
 
  this.hasFormErrors1 = false;
  const controls = this.formX.controls;
  /** check form */
  if (this.formX.invalid) {
    Object.keys(controls).forEach((controlName) =>
      controls[controlName].markAsTouched()
    );

    this.hasFormErrors1 = true;
    return;
  }
  if (this.error) {
    this.hasFormErrors1 = true;
    return;
  }
  // tslint:disable-next-line:prefer-const
  let item = this.prepareItem();
  let sct1 = this.prepareSct1();
  let sct2 = this.prepareSct2()
  this.addItem(item,sct1,sct2,this.methdataset,this.objedataset,this.progdataset);
  this.printpdfO1(controls.pt_part.value); 
}
/**
 *
 * Returns object for saving
 */
prepareItem(): Item {
  const controls  = this.formX.controls;
  let site: any;
  if(this.user.usrd_site == '*'){site = 'ECOLE'} else{site = this.user.usrd_site}
  const _item = new Item();
  _item.pt_part = controls.pt_part.value;
  _item.pt_desc1 = controls.pt_desc1.value;
  _item.pt_dsgn_grp = controls.pt_dsgn_grp.value;
  _item.pt_draw = controls.pt_draw.value;
  _item.pt_group = controls.pt_group.value;
  _item.pt_iss_pol = controls.pt_iss_pol.value;
  _item.pt_critical = controls.pt_critical.value;
  _item.pt_phantom = controls.pt_phantom.value;
  _item.pt_insp_rqd = controls.pt_insp_rqd.value;
  _item.pt_rollup = controls.pt_rollup.value;
  _item.pt_network = controls.pt_network.value;
  _item.pt_origin = controls.pt_origin.value;
  _item.pt_bom_code = controls.pt_bom_code.value;
  _item.pt_shelflife = controls.pt_shelflife.value;
  _item.pt_price = controls.pt_price.value;
  _item.pt_pur_price = controls.pt_pur_price.value;
  _item.pt_taxable = true;
  _item.pt_taxc = '19A';
  _item.pt_part_type = "FORMATION";
  _item.pt_um= "UN"
  _item.pt_buyer = controls.pt_draw.value;
  _item.pt_site = site; 
  _item.pt_prod_line = 'FORMATION'; 

  return _item;
}
/**
 * Add item
 *
 * @param _item: ItemModel
 */

  addItem(_item: any,sct1:CostSimulation,sct2:CostSimulation, detail1: any,detail2: any,detail3: any) {
    for (let data1 of detail1) {
      delete data1.id;
      delete data1.cmvid;
     
    }
    for (let data2 of detail2) {
      delete data2.id;
      delete data2.cmvid;
     
    }
    for (let data3 of detail3) {
      delete data3.id;
      delete data3.cmvid;
     
    }
    this.loadingSubject.next(true);
    let so = null;
    const controls = this.formX.controls;

    this.itemService
      .adddetail({ item: _item, itemmethode: detail1,itemobjectif: detail2,itemprogram: detail3})
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
                  this.resetO1()
                }
              );
            }
          );
        }
      );
  }

  


prepareSct1(): CostSimulation {
  // const controls = this.sctForm.controls;
  const control1 = this.formX.controls;
  const _sct = new CostSimulation();
  let site: any;
  if(this.user.usrd_site == '*'){site = 'ECOLE'} else{site = this.user.usrd_site}
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
  _sct.sct_site     = site;

  return _sct;
}

prepareSct2(): CostSimulation {
  // const controls = this.sctForm1.controls;
  let site: any;
  if(this.user.usrd_site == '*'){site = 'ECOLE'} else{site = this.user.usrd_site}
  const control1 = this.formX.controls;
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
  _sct.sct_site    = site;
  return _sct;
}
onchangedescO1() {
  const controls = this.formX.controls
  document.getElementById("pt_draw").focus();

}
onchangetypeO1() {
  const controls = this.formX.controls
  this.part = controls.pt_dsgn_grp.value
  controls.pt_draw.setValue(null)
  controls.pt_group.setValue(null)
  controls.pt_part.setValue(this.part)
  
  this.codeService
    .getBy({ code_fldname: "pt_draw" })
    .subscribe((response: any) => (console.log(response.data), this.pt_draw = response.data));
 // document.getElementById("pt_group").focus();

}
onchangedomainO1() {
  const controls = this.formX.controls
  this.part = controls.pt_dsgn_grp.value + '-' + controls.pt_draw.value + '-'
     let nbr: any;
  this.itemService
    .getBy({ pt_part_type:'FORMATION',pt_dsgn_grp: controls.pt_dsgn_grp.value,pt_draw:controls.pt_draw.value,})
    .subscribe((response: any) => (nbr = response.data.length + 1,
      this.part = this.part + nbr,
      controls.pt_part.setValue(this.part)
      
    ));
 
  this.codeService
    .getBy({ code_fldname: "pt_group",chr01:controls.pt_draw.value })
    .subscribe((response: any) => (this.pt_group = response.data));
 // document.getElementById("pt_group").focus();
 controls.pt_desc1.enable()
 controls.pt_iss_pol.enable()
            controls.pt_rollup.enable()
            controls.pt_phantom.enable()
            controls.pt_insp_rqd.enable()
            controls.pt_critical.enable()
            controls.pt_network.enable()
            controls.pt_origin.enable()  
            controls.pt_bom_code.enable() 
            controls.pt_shelflife.enable() 
            controls.pt_price.enable() 
            controls.pt_pur_price.enable()


}


initprogGrid() {
  this.progcolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.progangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    },
    {
      id: "ptd_desc",
      name: "Programme de formation",
      field: "ptd_desc",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    
   
   
  ];

  this.proggridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableAutoResize: true,
    autoHeight:false,
    rowHeight:40,
    autoCommitEdit:true,
    
   // enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };

  this.progdataset = [];
}
initobjeGrid() {
  this.objecolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.objeangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    },
   
    {
      id: "ptd_gol",
      name: "Objectif",
      field: "ptd_gol",
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
        this.row_number = args.row;
        let element: HTMLElement = document.getElementById("openJobsGrid") as HTMLElement;
        element.click();
      },
    }, 
    {
      id: "ptd_level",
      name: "Niveau Maitrise",
      field: "ptd_level",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
     
    },
  ];

  this.objegridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableAutoResize: true,
    autoHeight:false,
    rowHeight:40,
    autoCommitEdit:true,
    
   // enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };

  this.objedataset = [];
}
initmethGrid() {
  this.methcolumnDefinitions = [
    {
      id: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.methangularGrid.gridService.deleteItem(args.dataContext);
        }
      },
    },
    {
      id: "ptd_desc",
      name: "Méthode de formation",
      field: "ptd_desc",
      sortable: true,
      width: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    
    
   
  ];

  this.methgridOptions = {
    asyncEditorLoading: false,
    editable: true,
    enableAutoResize: true,
    autoHeight:false,
    rowHeight:40,
    autoCommitEdit:true,
    
   // enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };

  this.methdataset = [];
}
addNewprog() {
  const newId = this.progdataset.length+1;

  const newItem = {
    id: newId,
    ptd_desc: null,
    
  };
  this.proggridService.addItem(newItem, { position: "bottom" });
}
addNewobje() {
  const newId = this.objedataset.length+1;

  const newItem = {
    id: newId,
    ptd_desc: null,
   
  };
  this.objegridService.addItem(newItem, { position: "bottom" });
}
addNewmeth() {
  const newId = this.methdataset.length+1;

  const newItem = {
    id: newId,
    ptd_desc: null,
   
  };
  this.methgridService.addItem(newItem, { position: "bottom" });
}


handleSelectedRowsChangedjobsO1(e, args) {
  let updateItem = this.objegridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjjobsO1) {
    args.rows.map((idx) => {
      const item = this.gridObjjobsO1.getDataItem(idx);
      console.log(item);
      
     
      updateItem.ptd_gol = item.jb_code;

     this.objegridService.updateItem(updateItem);
     
    });
  }



}

angularGridReadyjobsO1(angularGrid: AngularGridInstance) {
  this.angularGridjobsO1 = angularGrid;
  this.gridObjjobsO1 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridO1() {
  this.columnDefinitionsjobsO1 = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "jb_code",
      name: "code Compétence",
      field: "jb_code",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "jb_desc",
      name: "Désignation",
      field: "jb_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    
  ];

  this.gridOptionsjobsO1 = {
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

  this.jobService.getAll().subscribe((response: any) => (this.jobsO1 = response.data));
}
openJobO1(content) {
  this.prepareGridO1();
  this.modalService.open(content, { size: "lg" });
}
printpdfO1(nbr) {
  // const controls = this.totForm.controls
  const controls = this.formX.controls
  console.log("pdf");
  var doc = new jsPDF();
  let date = new Date()
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  img.src = "./assets/media/logos/companyentete.png";
  doc.addImage(img, 'png', 150, 5, 50, 30)
  doc.setFontSize(9);
  
  doc.setFontSize(14);

  doc.line(10, 35, 200, 35);
  doc.setFontSize(12);
  doc.text(nbr, 70, 45);
  doc.text("Date: " + this.dataset[0].tr_effdate, 160, 45);
  doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 40);
  doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
  doc.text("Edité par: " + this.user.usrd_code, 160, 55);
  
  doc.setFontSize(8);
  //console.log(this.provider.ad_misc2_id)
  

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
  let total = 0
  for (let j = 0; j < this.dataset.length  ; j++) {
    total = total - Number(this.dataset[j].tr_qty_loc)
    if (this.dataset[j].tr_desc.length > 40) {
      let desc1 = this.dataset[j].tr_desc.substring(40);
      let ind = desc1.indexOf(" ");
      desc1 = this.dataset[j].tr_desc.substring(0, 40 + ind);
      let desc2 = this.dataset[j].tr_desc.substring(40 + ind);

      doc.line(10, i - 5, 10, i);
      doc.text(String("000" + Number(j + 1) ).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].tr_part, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(desc1, 47, i - 1);
      doc.line(100, i - 5, 100, i);
      doc.text(String(Number(this.dataset[j].tr_qty_loc) * (-1)), 118, i - 1, { align: "right" });
      doc.line(120, i - 5, 120, i);
      doc.text(this.dataset[j].tr_um, 123, i - 1);
      doc.line(130, i - 5, 130, i);
      doc.text(String(Number(this.dataset[j].tr_price)), 148, i - 1, { align: "right" });
      doc.line(150, i - 5, 150, i);
      doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
      doc.line(170, i - 5, 170, i);
      doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
      doc.line(185, i - 5, 185, i);
      doc.text(String(Number((Number(this.dataset[j].tr_price) * (-1) * Number((this.dataset[j].tr_qty_loc))))), 203, i - 1, { align: "right" });
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
      doc.text(String("000" + Number(j+1)).slice(-3), 12.5, i - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].tr_part, 25, i - 1);
      doc.line(45, i - 5, 45, i);
      doc.text(this.dataset[j].tr_desc, 47, i - 1);
      doc.line(100, i - 5, 100, i);
      doc.text(String(Number(this.dataset[j].tr_qty_loc) * (-1)), 118, i - 1, { align: "right" });
      doc.line(120, i - 5, 120, i);
      doc.text(this.dataset[j].tr_um, 123, i - 1);
      doc.line(130, i - 5, 130, i);
      doc.text(String(Number(this.dataset[j].tr_price)), 148, i - 1, { align: "right" });
      doc.line(150, i - 5, 150, i);
      doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
      doc.line(170, i - 5, 170, i);
      doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
      doc.line(185, i - 5, 185, i);
      doc.text(String(Number(Number((this.dataset[j].tr_price)) * (-1) * Number((this.dataset[j].tr_qty_loc)))), 203, i - 1, { align: "right" });
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
  // doc.setFontSize(10);

  
  doc.setFontSize(8);
  
  doc.save('FT-' + nbr + '.pdf')
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}

// fin onglet 1
gridReadyO2(angularGrid: AngularGridInstance) {
  this.angularGridO2 = angularGrid;
  this.dataViewO2 = angularGrid.dataView;
  this.gridO2 = angularGrid.slickGrid;

 
   
}
handleSelectedRowsChangedO2(e, args) {
  if (Array.isArray(args.rows) && this.gridO2) {
    args.rows.map((idx) => {
      const item = this.gridO2.getDataItem(idx);
      // this.itinerary = this.services[idx].role_itineraries
    this.selecteditem = item.pt_part
       console.log(this.selecteditem);
       this.affectEmpService.getByGlobal(
        {pme_inst:this.selecteditem}
        ).subscribe(
        (response: any) => {
          console.log(response.data)
          this.datasetO15= response.data
          console.log(this.datasetO15)
          
        
           this.dataviewO15.setItems(this.datasetO15)
           
        },
        (error) => {
            console.log(error)
            this.datasetO15=[]
        },
      )
    });
  }
 
}
prepareGridO2() {
  this.columnDefinitionsO2 = [
    {
      id: "mod",
      name: "Edit",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
     // formatter: Formatters.editIcon,
      formatter: (row, cell, value, columnDef, dataContext) => {
        // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
        return `
             <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Formation">
             <i class="flaticon2-pen"></i>
         </a>
         `;
      },
      minWidth: 50,
      maxWidth: 50,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
        const id = args.dataContext.id
              // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
        // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
        this.router.navigateByUrl(`/training/edit-training/${id}`)
        // }
        // else {
        //   alert("Modification Impossible pour ce Status")
        // }
          
      // })
      },
    },
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
          id: "pt_dsgn_grp",
          name: "Type",
          field: "pt_dsgn_grp",
          type: FieldType.string,
          sortable: true,
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
          id: "pt_iss_pol",
          name: "Interne",
          field: "pt_iss_pol",
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
          filterable:true,
          sortable: true,
         
        },      
        {
          id: "pt_rollup",
          name: "Certifiante",
          field: "pt_rollup",
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
          filterable:true,
          sortable: true,
         
        }, 
        {
          id: "pt_critical",
          name: "Qualifiante",
          field: "pt_critical",
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
          filterable:true,
          sortable: true,
         
        },         
        {
          id: "pt_insp_rqd",
          name: "Habilitation",
          field: "pt_insp_rqd",
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
          filterable:true,
          sortable: true,
         
        },         
        {
          id: "pt_phantom",
          name: "Fidélité",
          field: "pt_phantom",
          type: FieldType.boolean,
          formatter: Formatters.checkmark,
          filterable:true,
          sortable: true,
         
        },    
        {
          id: "pt_origin",
          name: "Pays",
          field: "pt_origin",
          type: FieldType.string,
          filterable:true,
          sortable: true,
         
        },      
        {
          id: "pt_bom_code",
          name: "Mesure d'accompagnement",
          field: "pt_bom_code",
          type: FieldType.string,
          filterable:true,
          sortable: true,
         
        },     
        {
          id: "pt_shelflife",
          name: "Durée",
          field: "pt_shelflife",
          type: FieldType.string,
          filterable:true,
          sortable: true,
         
        },   
        {
          id: "pt_price",
          name: "Prix",
          field: "pt_price",
          type: FieldType.string,
          filterable:true,
          sortable: true,
         
        }, 
        {
          id: "det",
          name: "Détail",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
         // formatter: Formatters.editIcon,
          formatter: (row, cell, value, columnDef, dataContext) => {
            // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
            return `
                 <a class="btn btn-sm btn-clean btn-icon mr-2" title="Voir Détail">
                 <i class="flaticon2-list-1"></i>
             </a>
             `;
          },
          minWidth: 50,
          maxWidth: 50,
          // use onCellClick OR grid.onClick.subscribe which you can see down below
          onCellClick: (e: Event, args: OnEventArgs) => {
            this.item = args.dataContext.pt_part
          
                  // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
            // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
            let element: HTMLElement = document.getElementById(
              "openDetsGrid"
            ) as HTMLElement;
            element.click();
            // }
            // else {
            //   alert("Modification Impossible pour ce Status")
            // }
              
          // })
          },
        },
  
      ]

  this.gridOptionsO2 = {
   
    rowHeight: 40,
    enableAutoResize:true,
    autoHeight:false,
    enableCellNavigation: true,
    enableSorting: true,
    enableExcelCopyBuffer: true,
    enableFiltering: true,
    frozenColumn: 0,
    frozenBottom: true,
    enableFilterTrimWhiteSpace:true,
    enableRowSelection: true,
    presets: {
      sorters: [{ columnId: "id", direction: "ASC" }],
    } 
  }
  this.user = JSON.parse(localStorage.getItem("user"));
  if(this.user.usrd_site == '*')
  {this.itemService.getBy(
    {pt_part_type:"FORMATION"},
    ).subscribe(
    (response: any) => {
      console.log(response.data)
      this.datasetO2 = response.data
      console.log(this.dataset)
      
    
      // this.dataView.setItems(this.dataset)
       
    },
    (error) => {
        console.log(error)
        this.dataset=[]
    },
  )
}
else{
  this.itemService.getBy(
    {pt_site:this.user.usrd_site,pt_part_type:"FORMATION"},
    ).subscribe(
    (response: any) => {
      console.log(response.data)
      this.datasetO2 = response.data
      console.log(this.datasetO2)
      
    
      // this.dataView.setItems(this.dataset)
       
    },
    (error) => {
        console.log(error)
        this.dataset=[]
    },
  )
}
}
openDetO2(content) {
  this.prepareGridO2_1();
  this.modalService.open(content, { size: "lg" });
}
angularGridReadyO2(angularGrid: AngularGridInstance) {
  this.angularGridO2_1 = angularGrid;
  this.gridObjO2_1 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridO2_1() {
  this.columnDefinitionsO2_1 = [
  //   {
  //     id: "id",
  //     name: "id",
  //     field: "id",
  //     excludeFromHeaderMenu: true,
  //     minWidth: 10,
  //     sortable:true,
  // },
  {
    id: "chr01",
    name: "Type",
    field: "chr01",
    sortable: true,
    minWidth: 50,
    filterable: true,
    type: FieldType.string,
    editor: {
      model: Editors.text,
    },
  },

    {
      id: "ptd_desc",
      name: "Désignation",
      field: "ptd_desc",
      sortable: true,
      minWidth: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "ptd_gol",
      name: "Objectif",
      field: "ptd_gol",
      sortable: true,
      minWidth: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    
  ];

  this.gridOptionsO2_1 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableFiltering: true,
     autoHeight: false,
    // frozenColumn: 0,
    // frozenBottom: true,
    // autoFitColumnsOnFirstLoad: true,
    // enableAutoSizeColumns:true,
  
   //enableAutoResizeColumnsByCellContent:true,
    
  };
  this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
    (respo: any) => {this.datadetO2 = respo.data
      console.log(respo.data)
    })
  // fill the dataset with your data

  // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
}

// FIN ONGLET 2
gridReadyO3(angularGrid: AngularGridInstance) {
  this.angularGridO3 = angularGrid;
  this.dataViewO3 = angularGrid.dataView;
  this.gridO3 = angularGrid.slickGrid;

  // if you want to change background color of Duration over 50 right after page load,
  // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
  this.dataViewO3.getItemMetadata = this.updateItemMetadataO3(this.dataViewO3.getItemMetadata);
  this.gridO3.invalidate();
  this.gridO3.render();
   
}
updateItemMetadataO3(previousItemMetadata: any) {
  const newCssClass = "highlight-bg";
  // console.log(this.dataView);
  return (rowNumber: number) => {
    const item = this.dataViewO3.getItem(rowNumber);
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
handleSelectedRowsChangedSO3(e, args) {
  if (Array.isArray(args.rows) && this.gridO3) {
    args.rows.map((idx) => {
      const item = this.gridO3.getDataItem(idx);
      // this.itinerary = this.services[idx].role_itineraries
    
      // console.log(this.itinerary);
    });
  }
 
}
initGridO3() {
    this.columnDefinitionsO3 = [
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

    this.gridOptionsO3 = {
        asyncEditorLoading: false,
        editable: true,
        enableColumnPicker: true,
        enableCellNavigation: true,
        enableRowSelection: true,
    }

    this.datasetO3 = []
}


//create form
createFormO3() {
    this.loadingSubject.next(false)
    this.requisition = new Requisition()
    const date = new Date;
    this.reqForm = this.reqFB.group({
      // rqm_category: [this.requisition.rqm_category , Validators.required],
      // rqm_nbr: [this.requisition.rqm_nbr ],
      // rqm_vend: [this.requisition.rqm_vend ],
      
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
      rqm_rqby_userid: [this.requisition.rqm_rqby_userid],
      rqm_end_userid: [this.requisition.rqm_end_userid],
      part: [null],
      desc:[{value:"", disabled: true}],
      rqm_rmks: [this.requisition.rqm_rmks ],
    })
    const controls = this.reqForm.controls
    
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
          this.seq = response.data.seq_seq
        //  alert(this.seq)
        }
    })
}


onChangeSeqO3() {
    const controls = this.reqForm.controls
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
onchangePartO3() {
  const controls = this.reqForm.controls;
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
        
        this.un = response.data.pt_um
      
      } 
    });
}
//reste form
resetO3() {
    this.requisition = new Requisition()
    this.createFormO3()
    this.hasFormErrors3 = false
    this.datasetO3 = []
}

// save data
onSubmitO3() {
    this.hasFormErrors3 = false
    const controls = this.reqForm.controls
    /** check form */
    if (this.reqForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )
        this.message = 'Modifiez quelques éléments et réessayez de soumettre.'
        this.hasFormErrors3 = true

        return
    }

    if (!this.datasetO3.length){
        this.message = 'La liste des article ne peut pas etre vide'
        this.hasFormErrors3 = true

        return
    }
    // tslint:disable-next-line:prefer-const
    let req = this.prepareReq()
    for(let data of this.datasetO3){
      delete data.id
      delete data.cmvid
    
    }
    this.addReq(req, this.datasetO3)
}

/**
 *
 * Returns object for saving
 */
prepareReq(): any {
    const controls = this.reqForm.controls
    const _req = new Requisition()
    _req.rqm_category =  this.seq
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
           this.resetO3()
        }
    )
}

/**
 * Go back to the list
 *
 */
goBackO3() {
    this.loadingSubject.next(false)
    const url = `/training/approval-req`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

// add new Item to Datatable
addNewItemO3() {
    this.angularGrid.gridService.addItem({
        id:  1,
        rqd_line: this.dataset.length + 1,
        rqd_part: "",
        cmvid: "",
      //  rqd_rqby_userid:req,
        rqd_req_qty: 0,
        rqd_um: "",
        rqd_cc: "",
        rqd_desc: "",
    },{position:"bottom"})
}

handleSelectedRowsChangedO3(e, args) {
    const controls = this.reqForm.controls
    if (Array.isArray(args.rows) && this.gridObj1O3) {
        args.rows.map((idx) => {
            const item = this.gridObj1O3.getDataItem(idx)
            controls.rqm_category.setValue(item.seq_seq || "")
        })
    }
}

angularGridReadyO3(angularGrid: AngularGridInstance) {
    this.angularGrid1O3 = angularGrid
    this.gridObj1O3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid1O3() {
    this.columnDefinitions1O3 = [
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

    this.gridOptions1O3 = {
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
        .subscribe((response: any) => (this.sequencesO3 = response.data))
       
}
openO3(content) {
    this.prepareGrid1O3()
    this.modalService.open(content, { size: "lg" })
}
handleSelectedRowsChanged2O3(e, args) {
    const controls = this.reqForm.controls
    if (Array.isArray(args.rows) && this.gridObj2) {
        args.rows.map((idx) => {
            const item = this.gridObj2O3.getDataItem(idx)
            controls.rqm_vend.setValue(item.vd_addr || "")
        })
    }
}

angularGridReady2O3(angularGrid: AngularGridInstance) {
    this.angularGrid2O3 = angularGrid
    this.gridObj2O3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid2O3() {
    this.columnDefinitions2O3 = [
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

    this.gridOptions2O3 = {
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
        .subscribe((response: any) => (this.providersO3 = response.data))
}
open2O3(content) {
    this.prepareGrid2O3()
    this.modalService.open(content, { size: "lg" })
}
handleSelectedRowsChanged3O3(e, args) {
  const controls = this.reqForm.controls
  if (Array.isArray(args.rows) && this.gridObj3O3) {
    this.selectedJob = args.rows.map((idx: number) => {
      const item = this.gridObj3O3.getDataItem(idx);
      return item.emp_addr;
    });
  }
 let enduser = ""
 for (let d of this.selectedJob) {
  enduser =enduser + d + ","  
 }
  controls.rqm_end_userid.setValue(enduser)
}
angularGridReady3O3(angularGrid: AngularGridInstance) {
    this.angularGrid3O3 = angularGrid
    this.gridObj3O3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3O3() {
    this.columnDefinitions3O3 = [
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
         .subscribe((response: any) => (this.usersO3 = response.data))
     
        } else {
          alert("Vous n'etes pas affecter à un employé")
        }
    })
  
}
open3O3(content) {
    this.prepareGrid3O3()
    this.modalService.open(content, { size: "lg" })
}
getTraining(){
  const controls = this.reqForm.controls
  this.datasetO3= []
this.data=[]
      //console.log(this.dataset.length)
      this.employeService
      .getBy({emp_addr:this.selectedJob})
      .subscribe((response: any) => {this.datasetemps = response.data
      console.log(this.datasetemps)
    
       let  id = 0
        for (let dat of this.datasetemps){
          let bool = false
          this.employeService
          .getTrBy({empf_code:dat.emp_addr,empf_part: controls.part.value})
          .subscribe((respo: any) => {
            if (respo.data!= null) {
              bool = true
            }
        
      this.angularGridO3.gridService.addItem({
              id:  id + 1,
              rqd_line: id + 1,
              rqd_part: controls.part.value,
              rqd_desc: controls.desc.value,
              rqd_um: this.un,
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

 this.dataViewO3.setItems(this.datasetO3)

// this.updateItemMetadata(this.dataView.getItemMetadata);
 this.gridO3.invalidate();
 this.gridO3.render();
 this.modalService.dismissAll()
}


handleSelectedRowsChanged6O3(e, args) {
    const controls = this.reqForm.controls
    if (Array.isArray(args.rows) && this.gridObj6O3) {
        args.rows.map((idx) => {
            const cause = this.gridObj6O3.getDataItem(idx)
            //console.log(cause)
            controls.rqm_reason.setValue(cause.rsn_ref || "")

        })
    }
}
angularGridReady6O3(angularGrid: AngularGridInstance) {
    this.angularGrid6O3 = angularGrid
    this.gridObj6O3 = (angularGrid && angularGrid.slickGrid) || {}
}
prepareGrid6O3() {
    const controls = this.reqForm.controls
    this.columnDefinitions6O3 = [
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

    this.gridOptions6O3 = {
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
        .subscribe((response: any) => (this.causesO3 = response.data))
     
}
open6O3(content) {
    this.prepareGrid6O3()
    this.modalService.open(content, { size: "lg" })
}
onAlertCloseO3($event) {
    this.hasFormErrors3 = false
}
handleSelectedRowsChanged4O3(e, args) {
  const controls = this.reqForm.controls; 
  //let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4O3) {
    args.rows.map((idx) => {
      const item = this.gridObj4O3.getDataItem(idx);
   
      controls.part.setValue(item.pt_part || ""); 
      controls.desc.setValue(item.pt_desc1 || ""); 
      if(item.pt_part == "AUTRE"){controls.desc.enable()} else{controls.desc.disable()}
      this.un = item.pt_um
  });
}
}

angularGridReady4O3(angularGrid: AngularGridInstance) {
  this.angularGrid4O3 = angularGrid;
  this.gridObj4O3 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid4O3() {
  this.columnDefinitions4O3 = [
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

  this.gridOptions4O3 = {
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
  const controls = this.reqForm.controls
  this.itemsService
    .getBy({pt_part_type : "FORMATION",pt_draw:controls.pt_draw.value})
    .subscribe((response: any) => (this.itemsO3 = response.data));
}
openpartO3(content) {
  this.prepareGrid4O3();
  this.modalService.open(content, { size: "xl" });
}
onchangetypeO3() {
  
  
  

}
onchangedomainO3() {
 
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
createForm() {
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
  const controls = this.empForm.controls
  this.employeService
      .getAll()
      .subscribe((response: any) => {
          if (response.data.length != 0) {this.nbr = response.data.length + 1}
          else{this.nbr = 1}
           controls.emp_addr.setValue('E'+String('000'+ String(this.nbr)).slice(-3))
              controls.emp_lname.enable()
              controls.emp_fname.enable()
              controls.emp_line1.enable()  
              controls.emp_country.enable()
              controls.emp_city.enable()
              controls.emp_state.enable()
              controls.emp_phone.enable()
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
              

          })
}

onChangeCode() {
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
resetO5() {
  this.employe = new Employe()
  this.createForm()
  this.hasFormErrors5 = false
  
}
// save data
onSubmitO5() {
  this.hasFormErrors5 = false
  
  const controls = this.empForm.controls
  /** check form */
  if (this.empForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors5 = true
      
      this.selectedTab = 0
      
      return
  }
  

  // tslint:disable-next-line:prefer-const
  let employe = this.prepareCode()
  for (let data of this.mvdataset) {
    delete data.id;
    delete data.cmvid;
  }
  for (let data of this.jbdataset) {
    delete data.id;
    delete data.cmvid;
    delete data.desc;
  }
  console.log(this.mvdataset)
  
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
  onChangeState() {
    const controls  = this.empForm.controls
  
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.emp_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.emp_city = response.data)
        })    
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
              this.resetO5()
              
          }
      )
  }


 

 /**
     * Go back to the list
     *
     */
    goBack() {
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
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChanged3(e, args) {
    const controls = this.empForm.controls;
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        controls.emp_level.setValue(item.code_value || "");
      });
    }
}
  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid3() {
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
open3(content) {
   
    this.prepareGrid3()
    this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedsite(e, args) {
  
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
          const item = this.gridObjsite.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.emp_site.setValue(item.si_site || "")
      })
  }
}
angularGridReadysite(angularGrid: AngularGridInstance) {
  this.angularGridsite = angularGrid
  this.gridObjsite = (angularGrid && angularGrid.slickGrid) || {}
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
      
  ]

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
      checkboxSelector: {
      },
      multiSelect: false,
      rowSelectionOptions: {
          selectActiveRow: true,
      },
  }

  // fill the dataset with your data
  this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data))
}
opensite(contentsite, field) {
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

handleSelectedRowsChangedcust(e, args) {
  
  const controls = this.empForm.controls;
  if (Array.isArray(args.rows) && this.gridObjcust) {
      args.rows.map((idx) => {
          const item = this.gridObjcust.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.emp_line2.setValue(item.ad_addr || "")
      })
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
 onAlertCloseO5($event) {
  this.hasFormErrors5 = false
}



handleSelectedRowsChanged2(e, args) {
  
  let updateItem = this.jbgridService.getDataItemByRowIndex(this.row_number);
  
  if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
       
          const item = this.gridObj2.getDataItem(idx)
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

handleSelectedRowsChanged4(e, args) {
  let updateItem = this.trgridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObj4) {
    args.rows.map((idx) => {
      const item = this.gridObj4.getDataItem(idx);
            updateItem.empf_part = item.pt_part;
            updateItem.desc = item.pt_desc1;
            
            this.trgridService.updateItem(updateItem);
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
      name: "desc",
      field: "pt_um",
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
  this.itemsService.getBy({pt_part_type : "FORMATION"}).subscribe((response: any) => (this.items = response.data));
}
open4(content) {
  this.prepareGrid4();
  this.modalService.open(content, { size: "lg" });
}
handleSelectedRowsChanged(e, args) {
  if (Array.isArray(args.rows) && this.grid) {
    args.rows.map((idx) => {
      const item = this.grid.getDataItem(idx);
      // this.itinerary = this.services[idx].role_itineraries
    this.selecteditem = item.emp_addr
       console.log(this.selecteditem);
       this.affectEmpService.getBy(
        {pme_employe:this.selecteditem}
        ).subscribe(
        (response: any) => {
          console.log(response.data)
          this.datasetO16= response.data
          console.log(this.datasetO16)
          
        
           this.dataviewO16.setItems(this.datasetO16)
           
        },
        (error) => {
            console.log(error)
            this.datasetO16=[]
        },
      )
    });
  }
 
}
angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
  this.grid = angularGrid.slickGrid; // grid object
  this.dataView = angularGrid.dataView;
  this.gridService = angularGrid.gridService;
}
prepareGrid() {
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
                   <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Employe">
                   <i class="flaticon2-pen"></i>
               </a>
               `;
            },
            minWidth: 50,
            maxWidth: 50,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
                const id = args.dataContext.id
                this.router.navigateByUrl(`/training/edit-student/${id}`)
            },
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
            id: "emp_addr",
            name: "Code",
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
          name: "Domaine de formation",
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
        
        // {
        //   id: "emp_shift",
        //   name: "Equipe",
        //   field: "emp_shift",
        //   sortable: true,
        //   filterable: true,
        //   type: FieldType.string,
        // },
     
       
    ]

    this.gridOptions = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        // enableFiltering: true,
        autoEdit: false,
        autoHeight: false,
        enableAutoResize:true,
        frozenColumn: 0,
        frozenBottom: true,
        rowHeight:40,
        enableRowSelection:true,
    }

    // fill the dataset with your data
    this.dataset = []
    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user)
  //   if(this.user.usrd_site == '*')
  //   {this.employeService.getAll().subscribe(
  //       (response: any) => {this.dataset = response.data
  //         this.dataView.setItems(this.dataset)},
  //       (error) => {
  //           this.dataset = []
  //       },
  //       () => {}
  //   )}
  //   else{this.employeService.getBy({emp_site:this.user.usrd_site}).subscribe(
  //     (response: any) => {this.dataset = response.data
  //       this.dataView.setItems(this.dataset)},
  //     (error) => {
  //         this.dataset = []
  //     },
  //     () => {}
  // )}
}
createemp() {
  this.loadingSubject.next(false)
  const url = `/accounting-setting/create-student`
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
students() {
this.loadingSubject.next(false)
const url = `/accounting-setting/list-employe`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
listsession() {
this.loadingSubject.next(false)
const url = `/training/training-session-list`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
listtraining() {
this.loadingSubject.next(false)
const url = `/training/list-training`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createtraining() {
this.loadingSubject.next(false)
const url = `/training/create-training`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

createsession() {
this.loadingSubject.next(false)
const url = `/training/create-training-session`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
approverequest() {
this.loadingSubject.next(false)
const url = `/training/approval-req`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createTrainor() {
this.loadingSubject.next(false)
const url = `/providers/create-rep-job`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
createlocation() {
this.loadingSubject.next(false)
const url = `/inventory-settings/list-loc`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
payment() {
this.loadingSubject.next(false)
const url = `/sales/payment-psh`
this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}
// FIN ONGLET 05
createFormRep() {
this.loadingSubject.next(false)
//create form

this.repForm = this.repFB.group({
  filter1: [ ""],
  filter2: [ ""],
  filter3: [ ""]

})
}
getemp1() {
this.dataset = []

const controls = this.repForm.controls
if(controls.filter1.value == ''){
if(controls.filter2.value == '' ){
  if(controls.filter3.value == ''){this.dataset =[]}
  else{this.employeService.getBy({ emp_level : controls.filter3.value}).subscribe(
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
}
else{
  if(controls.filter3.value == ''){this.employeService.getBy({ emp_lname : controls.filter2.value}).subscribe(
    (response: any) => {   
    this.dataset = response.data
    console.log(this.dataset)
    this.dataView.setItems(this.dataset);
  
      },
      (error) => {
        this.dataset = []
        },
      () => {}
    )}
  else{this.employeService.getBy({ emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
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
}
} 
else{
if(controls.filter2.value == ''){
  if(controls.filter3.value == ''){console.log('getemp1-1',controls.filter1.value)
    this.employeService.getBy({ emp_fname : controls.filter1.value}).subscribe(
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
  else{console.log('getemp1-2')
    this.employeService.getBy({ emp_fname:controls.filter1.value,emp_level : controls.filter3.value}).subscribe(
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
}
else {
  if(controls.filter3.value == ''){console.log('getemp1-3')
    this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname : controls.filter2.value}).subscribe(
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
  else{console.log('getemp1-4')
    this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
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
}
} 



}
getemp2() {
this.dataset = []

const controls = this.repForm.controls
if(controls.filter2.value == ''){
if(controls.filter1.value == '' ){
  if(controls.filter3.value == ''){this.dataset =[]}
  else{this.employeService.getBy({ emp_level : controls.filter3.value}).subscribe(
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
}
else{
  if(controls.filter3.value == ''){this.employeService.getBy({ emp_fname : controls.filter1.value}).subscribe(
    (response: any) => {   
    this.dataset = response.data
    console.log(this.dataset)
    this.dataView.setItems(this.dataset);
  
      },
      (error) => {
        this.dataset = []
        },
      () => {}
    )}
  else{this.employeService.getBy({ emp_fname:controls.filter1.value,emp_level : controls.filter3.value}).subscribe(
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
}
} 
else{
if(controls.filter1.value == ''){
  if(controls.filter3.value == ''){console.log('getemp1-1',controls.filter2.value)
    this.employeService.getBy({ emp_lname : controls.filter2.value}).subscribe(
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
  else{console.log('getemp1-2')
    this.employeService.getBy({ emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
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
}
else {
  if(controls.filter3.value == ''){console.log('getemp1-3')
    this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname : controls.filter2.value}).subscribe(
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
  else{console.log('getemp1-4')
    this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
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
}
} 

}

getemp3() {
this.dataset = []

const controls = this.repForm.controls
if(controls.filter3.value == ''){
if(controls.filter1.value == '' ){
  if(controls.filter2.value == ''){this.dataset =[]}
  else{this.employeService.getBy({ emp_lname : controls.filter2.value}).subscribe(
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
}
else{
  if(controls.filter2.value == ''){this.employeService.getBy({ emp_fname : controls.filter1.value}).subscribe(
    (response: any) => {   
    this.dataset = response.data
    console.log(this.dataset)
    this.dataView.setItems(this.dataset);
  
      },
      (error) => {
        this.dataset = []
        },
      () => {}
    )}
  else{this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname : controls.filter2.value}).subscribe(
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
}
} 
else{
if(controls.filter1.value == ''){
  if(controls.filter2.value == ''){console.log('getemp1-1',controls.filter2.value)
    this.employeService.getBy({ emp_level : controls.filter3.value}).subscribe(
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
  else{console.log('getemp1-2')
    this.employeService.getBy({ emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
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
}
else {
  if(controls.filter2.value == ''){console.log('getemp1-3')
    this.employeService.getBy({ emp_fname:controls.filter1.value,emp_level : controls.filter3.value}).subscribe(
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
  else{console.log('getemp1-4')
    this.employeService.getBy({ emp_fname:controls.filter1.value,emp_lname:controls.filter2.value,emp_level : controls.filter3.value}).subscribe(
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
}
} 


}
// FIN ONGLET 6
mvGridReadyO8(angularGrid: AngularGridInstance) {
  this.mvangularGridO8 = angularGrid;
  this.mvdataViewO8 = angularGrid.dataView;
  this.mvgridO8 = angularGrid.slickGrid;
  this.mvgridServiceO8 = angularGrid.gridService;
}
gridReadycnsO8(angularGrid: AngularGridInstance) {
  this.angularGridcnsO8 = angularGrid;
  this.dataViewcnsO8 = angularGrid.dataView;
  this.gridcnsO8 = angularGrid.slickGrid;
  this.gridServicecnsO8 = angularGrid.gridService;
}

createFormO8() {
  this.loadingSubject.next(false)
//create form
this.affectEmp = new AffectEmp();
const date = new Date;
this.empFormO8 = this.empFB.group({
    pme_pm_code: [this.affectEmp.pme_pm_code],
    pme_nbr:[this.affectEmp.pme_nbr],
    pme_var:[this.affectEmp.int01],
    pmdesc :  [{value: "", disabled: true}],
   
    pme_inst: [
      this.affectEmp.pme_inst, 
        Validators.required,
    ],
    pme_duration: [
      this.affectEmp.pme_duration,
      
  ],
  pme_task: [
    this.affectEmp.pme_task,
    
],
pme_site: [
  this.affectEmp.pme_site,
  
],
pme_task_status: [
this.affectEmp.pme_task_status,

],
pme_start_date: [{
year:date.getFullYear(),
month: date.getMonth()+1,
day: date.getDate()
}],
pme_end_date: [{
year:date.getFullYear(),
month: date.getMonth()+1,
day: date.getDate()
}],
tr_user1:  [{value: ""}],  
start_time:[],
weekday: [""],  


})
}

prepareCodeO8(): any {
const controls = this.empFormO8.controls
const _affectEmp = new AffectEmp()
_affectEmp.pme_pm_code = controls.pme_pm_code.value
_affectEmp.pme_nbr = controls.pme_nbr.value
_affectEmp.int01 = controls.pme_var.value
_affectEmp.pme_inst = controls.pme_inst.value
_affectEmp.pme_task = controls.pme_task.value
_affectEmp.pme_task_status = controls.pme_task_status.value
_affectEmp.pme_site = controls.pme_site.value
_affectEmp.pme_duration = controls.pme_duration.value
_affectEmp.pme_start_date = controls.pme_start_date.value ? `${controls.pme_start_date.value.year}/${controls.pme_start_date.value.month}/${controls.pme_start_date.value.day}`   : null;
_affectEmp.pme_end_date = controls.pme_end_date.value  ? `${controls.pme_end_date.value.year}/${controls.pme_end_date.value.month}/${controls.pme_end_date.value.day}` : null;
_affectEmp.pme_start_time = controls.start_time.value
_affectEmp.chr04 = controls.weekday.value
return _affectEmp
}



//reste form
resetO8() {
  
  this.createFormO8();
  this.hasFormErrors8 = false;
  this.mvdatasetO8 = []; 
  this.getweekdays();
}
getweekdays() {
  this.codeService
    .getBy({
      code_fldname: "weekdays",
    })
    .subscribe((response: any) => {
      const { data } = response;
      this.weekdays = data;
      if (!data) {
        this.message = "veuillez verifier votre connexion";
        this.hasFormErrors8 = true;
        return;
        // controls.wo_site.setValue("");
      }
    });
}
// save data
onSubmitO8() {
  
  this.hasFormErrors8 = false;
  const controls = this.empFormO8.controls;
  /** check form */
  if (this.empFormO8.invalid) {
    Object.keys(controls).forEach((controlName) =>
      controls[controlName].markAsTouched()
    );
    this.message = "Modifiez quelques éléments et réessayez de soumettre.";
    this.hasFormErrors8 = true;
    return;
  }

  if (!this.mvdatasetO8.length) {
    this.message = "La liste des employés peut pas etre vide ";
    this.hasFormErrors8 = true;

    return;
  }

  for (var i = 0; i < this.mvdatasetO8.length; i++) {
    
   if (this.mvdatasetO8[i].pme_employe == "" || this.mvdatasetO8[i].pme_employe == null  ) {
    this.message = "L' employé ne peut pas etre vide";
    this.hasFormErrors8 = true;
    return;

   }
   

  }
  
  
    let pme = this.prepareCodeO8()
            console.log(pme)
            this.addDet(pme, this.mvdatasetO8, this.cnsdatasetO8, this.nbr);
  
/*
console.log("hhhhhhhjssfffjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
let pme = this.prepareCode()
console.log(pme)
this.addDet(pme, this.mvdataset);
console.log("jjjj")*/
}



addDet( _affectEmp: any ,detail: any, cnsdetail: any, nbr : any) {
  
  for (let data of detail) {
    delete data.id;
    delete data.cmvid;
   
  }
  for (let data of cnsdetail) {
    delete data.id;
    delete data.cmvid;
   
  }
  let emp = null;

  for (let data of detail) {
    delete data.id;
    delete data.cmvid;
   
  }
  this.loadingSubject.next(true);
  console.log(this.nbr,detail)
  this.affectEmpService
    .add({ affectEmp : _affectEmp,empDetail:detail,nbr:this.nbr})
    .subscribe(
      (reponse: any) => (emp = reponse.data),
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
          )
          this.loadingSubject.next(false)
      
          this.resetO8()
      }
  )
}



/**
 * Go back to the list
 *
 */

initmvGridO8() {
  this.mvcolumnDefinitionsO8 = [
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
      id: "pme_internal",
      name: "Interne",
      field: "pme_internal",
      sortable: true,
      width: 50,
      filterable: false,
      editor: {
        model: Editors.checkbox
      },
      formatter: Formatters.checkmark,
      cannotTriggerInsert: false,
    },
    {
      id: "pme_employe",
      name: "Employé/Fournisseur",
      field: "pme_employe",
      sortable: true,
      width: 80,
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
        if (args.dataContext.pme_internal) {
          this.row_number = args.row
          let element: HTMLElement = document.getElementById(
              "openEmpsGrid"
          ) as HTMLElement
          element.click()
        }
         else {

       
          this.row_number = args.row
          let element: HTMLElement = document.getElementById(
              "openProvsGrid"
          ) as HTMLElement
          element.click()
          }  
      },
    },
    {
      id: "fname",
      name: "Nom",
      field: "fname",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
    },
    {
      id: "lname",
      name: "Prénom",
      field: "lname",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
    },
    {
      id: "methode",
      name: "Mode Paiement",
      field: "methode",
      sortable: true,
      width: 80,
      filterable: false,
      type: FieldType.string,
    },
    {
      id: "pvid",
      field: "pmvid",
      excludeFromHeaderMenu: true,
      formatter: Formatters.infoIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        
          this.row_number = args.row
          let element: HTMLElement = document.getElementById(
              "openpayGrid"
          ) as HTMLElement
          element.click()
        
      },
    },
    {
      id: "livre",
      name: "livre",
      field: "livre",
      sortable: true,
      width: 80,
      filterable: false,

      editor: {
        model: Editors.checkbox
      },
      formatter: Formatters.checkmark,
    },

    // {
    //   id: "pme_start_date",
    //   name: "Date Début",
    //   field: "pme_start_date",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   type: FieldType.dateIso,
    //           editor: {
    //     model: Editors.date,
    //   },
    // },
    // {
    //   id: "pme_end_date",
    //   name: "Date Fin",
    //   field: "pme_end_date",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   type: FieldType.dateIso,
    //           editor: {
    //     model: Editors.date,
    //   },
    // },
    // {
    //   id: "pme_duration",
    //   name: "Durée",
    //   field: "pme_duration",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
    //   type: FieldType.float,
    //           editor: {
    //     model: Editors.float,
    //     params: { decimalPlaces: 2 }
    //   },
    // },

    {
      id: "chr01",
      name: "Observation",
      field: "chr01",
      sortable: true,
      width: 80,
      filterable: false,
      editor: {
          model: Editors.longText,
      },
  },


   
  ];

  this.mvgridOptionsO8 = {
    asyncEditorLoading: false,
    editable: true,
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableRowSelection: true,
  };

  this.mvdatasetO8 = [];
}


initcnsGridO8() {
  this.columnDefinitionscnsO8 = [
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
        required: true,
        validator: statusValidator,

      },
      onCellChange: (e: Event, args: OnEventArgs) => {
        console.log(args.dataContext.tr_part)
        this.itemsService.getByOne({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{

          if (resp.data) {
            console.log(resp.data)

           
              this.sctService.getByOne({ sct_site: this.siteO8, sct_part: resp.data.pt_part, sct_sim: 'STD-CG' }).subscribe(
                (response: any) => {
                  this.sctO8 = response.data
         
                  this.locationDetailService.getByOne({ ld_site: this.siteO8, ld_loc:this.locO8, ld_part: resp.data.pt_part, ld_lot: null }).subscribe(
                    (response: any) => {
                      this.lddetO8 = response.data
                      console.log(this.lddetO8.ld_qty_oh)
                      if (this.lddetO8 != null) {
                      this.inventoryStatusService.getAllDetails({isd_status: this.lddetO8.ld_status, isd_tr_type: "ISS-CNS" }).subscribe((resstat:any)=>{
                     //   console.log(resstat)
                        const { data } = resstat;

                        if (data) {
                          this.statO8 = null
                        } else {
                          this.statO8 = this.lddetO8.ld_status
                        }
                  this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:this.siteO8, tr_loc:this.locO8,
                    tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.statO8, tr_price: this.sctO8.sct_mtl_tl, qty_oh: this.lddetO8.ld_qty_oh, tr_expire: this.lddetO8.ld_expire})
                      });
                    }
                    else {
                      this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:this.siteO8, tr_loc:this.locO8,
                        tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: null, tr_price: this.sctO8.sct_mtl_tl, qty_oh: 0, tr_expire: null})
                    

                    }     
   
                    });     
              });  
          
        }



  


        else {
          alert("Article Nexiste pas")
          this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
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

          this.locationDetailService.getByOne({ ld_site: this.siteO8, ld_loc: this.locO8, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe(
            (response: any) => {
              this.lddetO8 = response.data
              
     // console.log(response.data.length)
                if (this.lddetO8 != null) {
                  
                    this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddetO8.ld_qty_oh, tr_status: this.lddetO8.ld_status, tr_expire: this.lddetO8.tr_expire})
                }
                else {
                      this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0, tr_expire: null});
    
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
            
            if (args.dataContext.tr_qty_loc * args.dataContext.tr_um_conv   > args.dataContext.qty_oh) {
                console.log('here')
             alert ("Qte Manquante")
             this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
          //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
         
           
        }
    
         // meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
        
    },
    
      {
        id: "tr_um",
        name: "UM",
        field: "tr_um",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
            model: Editors.text,
            required: true,
            validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_um)
          this.itemsService.getBy({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
            
          if   (args.dataContext.tr_um == resp.data.pt_um )  {
            
            this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: 1 })
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
    
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
              this.angularGrid.gridService.highlightRow(1, 1500);

              if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                console.log('here')
                alert ("Qte Manquante")
                this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                
            
              } else {
            
                this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })

              }




            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                    console.log('here')
                    alert ("Qte Manquante")
                    this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                    
                
                  } else {
                
                    this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })
  
                  }
        
                } else {
                  this.gridServicecnsO8.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
            
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
      id: "mvidlot",
      field: "cmvidlot",
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
      id: "tr_um_conv",
      name: "Conv UM",
      field: "tr_um_conv",
      sortable: true,
      width: 80,
      filterable: false,
     // editor: {
     //     model: Editors.float,
      //},
      
    },
            
    
  ];

  this.gridOptionscnsO8 = {
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

  this.cnsdatasetO8 = [];
}
addNewItemO8() {
  const controls = this.empFormO8.controls;
  if(controls.pme_nbr.value == null)
    {console.log('seq')
        this.sequenceService.getByOne({ seq_type: "PM" }).subscribe(
          (response: any) => {
          this.seq = response.data 
            
            if (this.seq) {
            this.nbr =   `${new Date().getFullYear()}-${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`

            this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
              (reponse) => console.log("response", Response),
              (error) => {
                this.message = "Erreur modification Sequence";
                this.hasFormErrors8 = true;
                return;
          
              
              },
              )
              controls.pme_nbr.setValue(this.nbr)
              controls.pme_var.setValue(1)
            }

            else {
              this.message = "Parametrage Manquant pour la sequence";
              this.hasFormErrors8 = true;
              return;
        
            }


          })
    }
  const newId = this.mvdatasetO8.length+1;

  const newItem = {
    id: newId,
    pme_internal: true,
    pme_affectEmp : "",
    fname: null,
    lname: null,
    job  : null,
    level: null,
  };
  this.mvgridServiceO8.addItem(newItem, { position: "bottom" });
}
addNewcnsItemO8() {
  this.gridServicecnsO8.addItem(
    {
      id: this.cnsdatasetO8.length + 1,
      tr_line: this.cnsdatasetO8.length + 1,
      tr_part: "",
      cmvid: "",
      desc: "",
      tr_qty_loc: 0,
      tr_um: "",
      tr_um_conv: 1,
      tr_price: 0,
      tr_site: this.siteO8,
      cmvids: "",
      tr_loc: this.locO8,
      tr_serial: null,
      tr_status: null,
      tr_expire: null,
    },
    { position: "bottom" }
  );
}

handleSelectedRowsChangedO8(e, args) {
this.mvdatasetO8 = [];
const controls = this.empFormO8.controls // chof le champs hada wesh men form rah
if (Array.isArray(args.rows) && this.gridObjO8) {
  args.rows.map((idx) => {
    const item = this.gridObjO8.getDataItem(idx);
    console.log(item);
    controls.pme_pm_code.setValue(item.tc_year + '-' + item.tc_service + '-' + item.tc_site || "");
    controls.pme_inst.setValue(item.tc_part || "");
    
    controls.pmdesc.setValue(item.tc_desc)
    this.siteO8 = item.tc_site
    this.itemsService.getByOne({pt_part:item.tc_part}).subscribe((response: any) => (this.domaineO8 = response.data.pt_draw));
  
})
}
}
angularGridReadyO8(angularGrid: AngularGridInstance) {
this.angularGridO8 = angularGrid
this.gridObjO8 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridO8() {
this.columnDefinitionsO8 = [
    {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
    {
        id: "tc_year",
        name: "Année",
        field: "tc_year",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "tc_site",
        name: "site",
        field: "tc_site",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "tc_service",
      name: "Service",
      field: "tc_service",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "tc_desc",
    name: "formation",
    field: "tc_desc",
    sortable: true,
    width: 80,
    filterable: true,
    type: FieldType.string,
},
  
    
];

this.gridOptionsO8 = {
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
if(this.user.usrd_site == '*')
{this.TrainingCalendarService
// {pm_status: ""}
    .getAll()
    .subscribe((response: any) =>{ 
      this.datasetO8 = response.data
      
    })}
    else{
      this.TrainingCalendarService
// {pm_status: ""}
    .getBy({tc_site:this.user.usrd_site})
    .subscribe((response: any) =>{ 
      this.datasetO8 = response.data
      
    })
    }
}
openO8(content) {

this.prepareGridO8()
this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedsO8(e, args) {
this.mvdatasetO8 = [];
const controls = this.empFormO8.controls // chof le champs hada wesh men form rah
if (Array.isArray(args.rows) && this.gridObjsO8) {
  args.rows.map((idx) => {
    const item = this.gridObjsO8.getDataItem(idx);
    
    
    controls.pme_start_date.setValue({year: new Date(item.pme_start_date).getFullYear(),
    month: new Date(item.pme_start_date).getMonth() + 1,
    day: new Date(item.pme_start_date).getDate(),}
)
    controls.start_time.setValue(item.pme_start_time)
    controls.pme_end_date.setValue({year: new Date(item.pme_end_date).getFullYear(),
      month: new Date(item.pme_end_date).getMonth() + 1,
      day: new Date(item.pme_end_date).getDate(),})
    controls.pme_nbr.setValue(item.pme_nbr)
    controls.pme_var.setValue(item.int01)
    controls.pme_site.setValue(item.pme_site)
    controls.pme_inst.setValue(item.pme_inst)
    this.itemsService.getBy({pt_part:item.pme_inst}).subscribe((pt: any) =>{console.log(pt.data[0]);controls.pmdesc.setValue(pt.data[0].pt_desc1)
    })
    controls.pme_site.setValue(item.pme_site)
    controls.pme_duration.setValue(item.pme_duration)
    controls.pme_task.setValue(item.pme_task)
    controls.pme_task_status.setValue(item.pme_task_status)
    
    let weekdays =  item.chr04.split(",");
    controls.weekday.setValue(weekdays)
    this.affectEmpService.getBy({pme_nbr:controls.pme_nbr.value,int01:controls.pme_var.value}).subscribe((response: any) =>{ 
      const datas = response.data
     
      for (let items of datas)
      {
        const newId = this.mvdatasetO8.length+1;
        this.employeService.getByOne({emp_addr:items.pme_employe}).subscribe((emp: any) =>{let employeO8 = emp.data
          console.log(employeO8)
          this.mvgridServiceO8.addItem(
            {id:newId,
              
              pme_employe:items.pme_employe,
             fname:employeO8.emp_fname,
             lname:employeO8.emp_lname,
             methode:items.chr05,
             livre:items.log01,
             pme_cmmt:items.pme_cmmt, 
             pme_internal: true,
             pme_affectEmp : "",
                  }, { position: "bottom" });
                  
        })
       
      
      };
     
      
    })
})
}
}
angularGridReadysO8(angularGrid: AngularGridInstance) {
this.angularGridsO8 = angularGrid
this.gridObjsO8 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridsO8() {
this.columnDefinitionssO8 = [
    {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
    },
    {
        id: "pme_pm_code",
        name: "programme",
        field: "pme_pm_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    {
        id: "pme_nbr",
        name: "session/groupe",
        field: "pme_nbr",
        sortable: true,
        width: 120,
        filterable: true,
        type: FieldType.string,
    },
    {
      id: "int01",
      name: "configuration groupe",
      field: "int01",
      sortable: true,
      width: 120,
      filterable: true,
      type: FieldType.string,
  },
    {
      id: "pme_inst",
      name: "formation",
      field: "pme_inst",
      sortable: true,
      width: 80,
      filterable: true,
      type: FieldType.string,
  },
  {
    id: "pme_site",
    name: "formateur",
    field: "pme_site",
    sortable: true,
    width: 80,
    filterable: true,
    type: FieldType.string,
},
{
  id: "pme_task",
  name: "salle de formation",
  field: "pme_task",
  sortable: true,
  width: 80,
  filterable: true,
  type: FieldType.string,
},
{
id: "pme_duration",
name: "Durée",
field: "pme_duration",
sortable: true,
width: 80,
filterable: true,
type: FieldType.number,
},
  
    
];

this.gridOptionssO8 = {
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
const controls = this.empFormO8.controls
console.log(controls.pme_pm_code.value)
if(this.user.usrd_site == '*')
{this.affectEmpService
  // {pm_status: ""}
      .getByGlobal({pme_pm_code:controls.pme_pm_code.value,pme_task_status:null})
      .subscribe((response: any) =>{ 
        this.datasetsO8 = response.data
        
      })}
else
{this.affectEmpService
// {pm_status: ""}
    .getByGlobal({pme_pm_code:controls.pme_pm_code.value,pme_task_status:null})
    .subscribe((response: any) =>{ 
      this.datasetsO8 = response.data
      
    })}
}
opensO8(contents) {

this.prepareGridsO8()
this.modalService.open(contents, { size: "lg" })
}

handleSelectedRowsChangedinstO8(e, args) {
this.mvdatasetO8 = [];
const controls = this.empFormO8.controls // chof le champs hada wesh men form rah
if (Array.isArray(args.rows) && this.gridObjinstO8) {
  args.rows.map((idx) => {
    const item = this.gridObjinstO8.getDataItem(idx);
    console.log(item);
    controls.pme_inst.setValue(item.pt_part || "");
    controls.pmdesc.setValue(item.pt_desc1)
    this.itemsService.getByOne({pt_part:item.pt_part}).subscribe((response: any) => (console.log(response.data.pt_draw),this.domaineO8 = response.data.pt_draw));
  });
}
}
angularGridReadyinstO8(angularGrid: AngularGridInstance) {
this.angularGridinstO8 = angularGrid
this.gridObjinstO8 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridinstO8() {
const controls = this.empFormO8.controls 
this.columnDefinitionsinstO8 = [
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
     
  ];

  this.gridOptionsinstO8 = {
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
  if(this.user.usrd_site == '*')
  {this.itemsService
    .getBy({pt_part_type : "FORMATION"})
    .subscribe((response: any) => (this.datasetinstO8 = response.data));
}
else{
  this.itemsService
    .getBy({pt_site:this.user.usrd_site,pt_part_type : "FORMATION"})
    .subscribe((response: any) => (this.datasetinstO8 = response.data));
}
  



}
openinstO8(content) {

this.prepareGridinstO8()
this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChangedtaskO8(e, args) {
this.mvdatasetO8 = [];
const controls = this.empFormO8.controls // chof le champs hada wesh men form rah
if (Array.isArray(args.rows) && this.gridObjtaskO8) {
  args.rows.map((idx) => {
    const item = this.gridObjtaskO8.getDataItem(idx);
   // console.log(item);
    controls.pme_task.setValue(item.loc_loc || "");
    
    
  });
}
}
angularGridReadytaskO8(angularGrid: AngularGridInstance) {
this.angularGridtaskO8 = angularGrid
this.gridObjtaskO8= (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridtaskO8() {
const controls = this.empFormO8.controls 
this.columnDefinitionstaskO8 = [
    {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 40,
        maxWidth: 40,
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
    
]

this.gridOptionstaskO8 = {
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
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: true,
    },
  }
// fill the dataset with your data
if(this.user.usrd_site == '*')

{ this.locationService
    .getBy({ loc_site: this.siteO8 })
    .subscribe((response: any) => (this.datasettaskO8 = response.data))}
    else{this.locationService
      .getBy({})
      .subscribe((response: any) => (this.datasettaskO8 = response.data))}
}
opentaskO8(content) {

this.prepareGridtaskO8()
this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedformO8(e, args) {
this.mvdatasetO8 = [];
const controls = this.empFormO8.controls // chof le champs hada wesh men form rah
if (Array.isArray(args.rows) && this.gridObjformO8) {
  args.rows.map((idx) => {
    const item = this.gridObjformO8.getDataItem(idx);
   // console.log(item);
    controls.pme_site.setValue(item.rep_contact || "");
    
    
  });
}
}
angularGridReadyformO8(angularGrid: AngularGridInstance) {
this.angularGridformO8 = angularGrid
this.gridObjformO8 = (angularGrid && angularGrid.slickGrid) || {}
}


prepareGridformO8() {
const controls = this.empFormO8.controls 
this.columnDefinitionsformO8 = [
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
    id: "rep_code",
    name: "Organisme",
    field: "rep_code",
    sortable: true,
    width: 80,
    filterable: true,
    type: FieldType.string,
    editor: {
      model: Editors.text,
    }
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
      model: Editors.text,
    }
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
]

this.gridOptionsformO8 = {
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
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: true,
    },
  }
// fill the dataset with your data
console.log(this.domaineO8)
if(this.user.usrd_site == '*')
{this.RepertoryService.getBy({rep_type:'Trainor'}).subscribe(
  (response: any) => (console.log(response.data),this.datasetformO8 = response.data)
    
)}
else
{this.RepertoryService.getBy({chr03:this.user.usrd_site,rep_type:'Trainor'}).subscribe(
  (response: any) => (console.log(response.data),this.datasetformO8 = response.data)
    
)}
}
openformO8(content) {

this.prepareGridformO8()
this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedprovO8(e, args) {
let updateItem = this.mvgridServiceO8.getDataItemByRowIndex(this.row_number)
if (Array.isArray(args.rows) && this.gridObjprovO8) {
    args.rows.map((idx) => {
        const item = this.gridObjprovO8.getDataItem(idx)
        console.log(item)
        updateItem.pme_employe = item.vd_addr
        updateItem.fname   = item.address.ad_name
        
        this.mvgridServiceO8.updateItem(updateItem)
    })
}
}


angularGridReadyprovO8(angularGrid: AngularGridInstance) {
this.angularGridprovO8 = angularGrid
this.gridObjprovO8 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridprovO8() {
this.columnDefinitionsprovO8 = [
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
]

this.gridOptionsprovO8 = {
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
    dataItemColumnValueExtractor: function getItemColumnValue(
        item,
        column
    ) {
        var val = undefined
        try {
            val = eval("item." + column.field)
        } catch (e) {
            // ignore
        }
        return val
    },
}

// fill the dataset with your data
this.providerService
    .getAll()
    .subscribe((response: any) => (this.providersO8 = response.data))
}
openprovO8(content) {
this.prepareGridprovO8()
this.modalService.open(content, { size: "lg" })
}

onAlertCloseO8($event) {
this.hasFormErrors8 = false
}

handleSelectedRowsChanged4O8(e, args) {
let updateItem = this.gridServicecnsO8.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObj4) {
  args.rows.map((idx) => {
    const item = this.gridObj4.getDataItem(idx);
    console.log(item);

   
    
        this.sctService.getByOne({ sct_site: this.siteO8, sct_part: item.pt_part, sct_sim: 'STD-CG' }).subscribe(
          (response: any) => {
            this.sctO8 = response.data
        
            this.locationDetailService.getByOne({ ld_site: this.siteO8, ld_loc: this.locO8, ld_part: item.pt_part, ld_lot: null }).subscribe(
              (response: any) => {
                this.lddetO8 = response.data
                //console.log(this.lddet.ld_qty_oh)
       if (this.lddetO8 != null)
           {     this.inventoryStatusService.getAllDetails({isd_status: this.lddetO8.ld_status, isd_tr_type: "ISS-CNS" }).subscribe((resstat:any)=>{
                  console.log(resstat)
                  const { data } = resstat;

                  if (data) {
                    this.statO8 = null
                  } else {
                    this.statO8 = this.lddetO8.ld_status
                  }
        
          updateItem.tr_part = item.pt_part;
          updateItem.desc = item.pt_desc1;
          updateItem.tr_um = item.pt_um;
          updateItem.tr_conv_um = 1;
          
          updateItem.tr_site = this.siteO8;
          updateItem.tr_loc = this.locO8;
          updateItem.tr_price = this.sctO8.sct_mtl_tl;
          
          updateItem.qty_oh =  this.lddetO8.ld_qty_oh;
          
          updateItem.tr_status =  this.statO8;
          updateItem.tr_expire =  this.lddetO8.ld_expire;
          this.gridServicecnsO8.updateItem(updateItem);
       });
      }
      else {
        updateItem.tr_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        updateItem.tr_um = item.pt_um;
        updateItem.tr_conv_um = 1;
        
        updateItem.tr_site = this.siteO8;
        updateItem.tr_loc = this.locO8;
        updateItem.tr_price = this.sctO8.sct_mtl_tl;
        
        updateItem.qty_oh =  0;
        
        updateItem.tr_status =  null;
        updateItem.tr_expire =  null;
        this.gridServicecnsO8.updateItem(updateItem);


      }
      });  
    });  
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
if(this.user.usrd_site == '*')
{this.itemsService
  .getAll()
  .subscribe((response: any) => (this.itemsO8 = response.data));}
  else{this.itemsService
    .getBy({pt_site:this.user.usrd_site})
    .subscribe((response: any) => (this.itemsO8 = response.data));}
}
open4O8(content) {
this.prepareGrid4O8();
this.modalService.open(content, { size: "lg" });
}

handleSelectedRowsChangedlocdetO8(e, args) {
  let updateItem = this.gridServicecnsO8.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjlocdetO8) {
    args.rows.map((idx) => {
      const item = this.gridObjlocdetO8.getDataItem(idx);
      console.log(item);

          

      this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-CNS" }).subscribe((res:any)=>{
        console.log(res)
        const { data } = res;

      if (data) {
        alert ("Mouvement Interdit Pour ce Status")
        updateItem.tr_serial = null;
        updateItem.tr_expire = null;
        updateItem.qty_oh = 0;

      }else {
        updateItem.tr_serial = item.ld_lot;
        updateItem.tr_status = item.ld_status;
        updateItem.tr_expire = item.ld_expire;
        updateItem.qty_oh = item.ld_qty_oh;
        
        this.gridServicecnsO8.updateItem(updateItem);

      }
        
      })




      
      
      this.gridServicecnsO8.updateItem(updateItem);
      
});

  }
}
angularGridReadylocdetO8(angularGrid: AngularGridInstance) {
  this.angularGridlocdetO8 = angularGrid;
  this.gridObjlocdetO8 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridlocdetO8() {
  this.columnDefinitionslocdetO8 = [
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

  this.gridOptionslocdetO8 = {
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
    let updateItem = this.gridServicecnsO8.getDataItemByRowIndex(this.row_number);
  
  // fill the dataset with your data
  this.locationDetailService
    .getBy({ ld_site:  this.siteO8 , ld_loc:  this.locO8, ld_part:  updateItem.tr_part })
    .subscribe((response: any) => (this.datalocdetO8 = response.data));
}
openlocdetO8(contentlocdet) {
  this.prepareGridlocdetO8();
  this.modalService.open(contentlocdet, { size: "lg" });
}

handleSelectedRowsChangedumO8(e, args) {
  let updateItem = this.gridServicecnsO8.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjumO8) {
    args.rows.map((idx) => {
      const item = this.gridObjumO8.getDataItem(idx);
      updateItem.tr_um = item.code_value;
   
      this.gridServicecnsO8.updateItem(updateItem);

/*********/
console.log(updateItem.tr_part)

    this.itemsService.getBy({pt_part: updateItem.tr_part }).subscribe((resp:any)=>{
                    
      if   (updateItem.tr_um == resp.data.pt_um )  {
        
        updateItem.tr_um_conv = 1
      } else { 
        //console.log(resp.data.pt_um)



          this.mesureService.getBy({um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          //alert ("Mouvement Interdit Pour ce Status")
          updateItem.tr_um_conv = res.data.um_conv 
          this.angularGrid.gridService.highlightRow(1, 1500);
        } else {
          this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              updateItem.tr_um_conv = res.data.um_conv
              
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
angularGridReadyumO8(angularGrid: AngularGridInstance) {
  this.angularGridumO8 = angularGrid
  this.gridObjumO8 = (angularGrid && angularGrid.slickGrid) || {}
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
  ]

  this.gridOptionsumO8= {
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
      .subscribe((response: any) => (this.umsO8 = response.data))
}
openumO8(content) {
  this.prepareGridumO8()
  this.modalService.open(content, { size: "lg" })
}
handleSelectedRowsChangedsiteO8(e, args) {
const controls = this.empFormO8.controls

if (Array.isArray(args.rows) && this.gridObjsiteO8) {
    args.rows.map((idx) => {
        const item = this.gridObjsiteO8.getDataItem(idx)
        // TODO : HERE itterate on selected field and change the value of the selected field
        
                controls.site.setValue(item.si_site || "")
        
    })
}
}
angularGridReadysiteO8(angularGrid: AngularGridInstance) {
this.angularGridsiteO8 = angularGrid
this.gridObjsiteO8 = (angularGrid && angularGrid.slickGrid) || {}
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
    
]

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
    checkboxSelector: {
    },
    multiSelect: false,
    rowSelectionOptions: {
        selectActiveRow: true,
    },
}

// fill the dataset with your data
this.siteService
    .getAll()
    .subscribe((response: any) => (this.datasiteO8 = response.data))
}
opensiteO8(contentsite) {

this.prepareGridsiteO8()
this.modalService.open(contentsite, { size: "lg" })
}
addempreqO8() {
  // this.itinerary.push({})
  const controls = this.empFormO8.controls;
  var l: String;
  l = "";
  console.log(l.length);
  if(controls.pme_nbr.value == null)
    {console.log('seq')
        this.sequenceService.getByOne({ seq_type: "PM" }).subscribe(
          (response: any) => {
          this.seq = response.data 
            
            if (this.seq) {
            this.nbr = `${new Date().getFullYear()}-${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`

            this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
              (reponse) => console.log("response", Response),
              (error) => {
                this.message = "Erreur modification Sequence";
                this.hasFormErrors8 = true;
                return;
          
              
              },
              )
              controls.pme_nbr.setValue(this.nbr)
              controls.pme_var.setValue(1)
            }

            else {
              this.message = "Parametrage Manquant pour la sequence";
              this.hasFormErrors8 = true;
              return;
        
            }


          })
    }
  this.selectedIndexes.forEach((index) => {
    const newId = this.mvdatasetO8.length+1;
    const newItem = {
      id: newId,
      pme_employe:this.empsreqO8[index]["emp_addr"],
      pme_internal: true,
      pme_affectEmp : "",
      fname:this.empsreqO8[index]["emp_fname"],
      lname: this.empsreqO8[index]["emp_lname"],
      job  : this.empsreqO8[index]["emp_job"],
      level: this.empsreqO8[index]["emp_level"],
    };
    this.mvgridServiceO8.addItem(newItem, { position: "bottom" });
  });

  console.log(l);
  controls.tr_user1.setValue(l);
  
}
addempO8() {
  // this.itinerary.push({})
  const controls = this.empFormO8.controls;
  var l: String;
  l = "";
  console.log(l.length);
  if(controls.pme_nbr.value == null)
    {console.log('seq')
        this.sequenceService.getByOne({ seq_type: "PM" }).subscribe(
          (response: any) => {
          this.seq = response.data 
            
            if (this.seq) {
            this.nbr = `${new Date().getFullYear()}-${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`

            this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
              (reponse) => console.log("response", Response),
              (error) => {
                this.message = "Erreur modification Sequence";
                this.hasFormErrors8 = true;
                return;
          
              
              },
              )
              controls.pme_nbr.setValue(this.nbr)
              controls.pme_var.setValue(1)
            }

            else {
              this.message = "Parametrage Manquant pour la sequence";
              this.hasFormErrors8 = true;
              return;
        
            }


          })
    }
  this.selectedIndexes.forEach((index) => {
    const newId = this.mvdatasetO8.length+1;
    const newItem = {
      id: newId,
      pme_employe:this.emps[index]["emp_addr"],
      pme_internal: true,
      pme_affectEmp : "",
      fname:this.emps[index]["emp_fname"],
      lname: this.emps[index]["emp_lname"],
      job  : this.emps[index]["emp_job"],
      level: this.emps[index]["emp_level"],
    };
    this.mvgridServiceO8.addItem(newItem, { position: "bottom" });
  });

  console.log(l);
  
  
}

handleSelectedRowsChangedempreqO8(e, args) {
  this.selectedIndexes = [];
  this.selectedIndexes = args.rows;
}
angularGridReadyempreqO8(angularGrid: AngularGridInstance) {
  this.angularGridempreqO8 = angularGrid;
  this.gridObjempreqO8 = (angularGrid && angularGrid.slickGrid) || {};

  this.gridServiceempreqO8 = angularGrid.gridService;
  this.dataViewempreqO8 = angularGrid.dataView;
}
// GRID IN

prepareGridempreqO8() {
  this.columnDefinitionsempreqO8 = [
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
      name: "Compétence",
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

  this.gridOptionsempreqO8 = {
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
        gridRowIndexes: this.selectedIndexes, // (recommended) select by your data object IDs
        //dataContextIds
      },
    },
  };

  // fill the dataset with your data
  const controls = this.empFormO8.controls;
  const training = controls.pme_inst.value
  if(this.user.usrd_site == '*')
  {this.employeService.getByReq({training}).subscribe((response: any) => (this.empsreqO8 = response.data));}
  else {this.employeService.getByReq({emp_site:this.user.usrd_site,training}).subscribe((response: any) => (this.empsreqO8 = response.data));}
}
openempreqO8(content) {
  this.prepareGridempreqO8();
  this.modalService.open(content, { size: "lg" });
}


handleSelectedRowsChangedempO8(e, args) {
const controls = this.empFormO8.controls;
let updateItem = this.mvgridServiceO8.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObjempO8) {
  args.rows.map((idx) => {
    const item = this.gridObjempO8.getDataItem(idx);
    console.log(item);

   
      updateItem.pme_employe = item.emp_addr;
      updateItem.fname = item.emp_fname;
      updateItem.lname = item.emp_lname;
      
      this.mvgridServiceO8.updateItem(updateItem);
   
  });
}
}
angularGridReadyempO8(angularGrid: AngularGridInstance) {
this.angularGridempO8 = angularGrid
this.gridObjempO8 = (angularGrid && angularGrid.slickGrid) || {}
this.gridServiceempO8 = angularGrid.gridService;
this.dataViewempO8 = angularGrid.dataView;
}
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
  name: "Compétence",
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
    
]

this.gridOptionsempO8 = {
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
if(this.user.usrd_site == '*')
{this.employeService
    .getAll()
    .subscribe((response: any) => (this.emps = response.data))}
else{this.employeService
  .getBy({emp_site:this.user.usrd_site})
  .subscribe((response: any) => (this.emps = response.data))}    
}
openempO8(content) {

this.prepareGridempO8()
this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChangedpayO8(e, args) {

const controls = this.empFormO8.controls // chof le champs hada wesh men form rah
let updateItem = this.mvgridServiceO8.getDataItemByRowIndex(this.row_number);
console.log(this.row_number)
if (Array.isArray(args.rows) && this.gridObjpayO8) {
  args.rows.map((idx) => {
    const item = this.gridObjpayO8.getDataItem(idx);
    console.log(item,updateItem.id);

   
      updateItem.methode = item.ct_code;
      // updateItem.tc_desc = item.pt_desc1;
      
      this.mvgridServiceO8.updateItem(updateItem);
   
  });
}
}

angularGridReadypayO8(angularGrid: AngularGridInstance) {
this.angularGridpayO8 = angularGrid
this.gridObjpayO8 = (angularGrid && angularGrid.slickGrid) || {}
this.gridServicepayO8 = angularGrid.gridService;
this.dataViewpayO8 = angularGrid.dataView;
}
prepareGridpayO8() {
this.columnDefinitionspayO8 = [

{
    id: "id",
    name: "id",
    field: "id",
    sortable: true,
    minWidth: 80,
    maxWidth: 80,
},

{
    id: "ct_code",
    name: "Code Méthode Paiement",
    field: "ct_code",
    sortable: true,
    filterable: true,
    type: FieldType.string,
},
{
  id: "ct_desc",
  name: "Designation Code",
  field: "ct_desc",
  sortable: true,
  width: 200,
  filterable: true,
  type: FieldType.string,
},
{
  id: "ctd_term",
  name: "Code Term",
  field: "ctd_term",
  sortable: true,
  filterable: true,
  type: FieldType.string,
},

{
    id: "ctd_desc",
    name: "Designation",
    field: "ctd_desc",
    sortable: true,
    width: 200,
    filterable: true,
    type: FieldType.string,
},
{
  id: "ctd_due_day",
  name: "Echéance",
  field: "ctd_due_day",
  sortable: true,
  filterable: true,
  type: FieldType.string,
},
    
]

this.gridOptionspayO8 = {
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

this.datasetO8 = []
    this.payMethService.getAll().subscribe(
      
        (response: any) => {
        //  console.log(response.data),
          (this.paysO8 = response.data),
       
        (error) => {
            this.paysO8 = []
        },
        () => {}
       } )  
}
openpayO8(content) {

this.prepareGridpayO8()
this.modalService.open(content, { size: "lg" })
}
// FIN ONGLET 8
angularGridReadyO9(angularGrid: AngularGridInstance) {
  this.angularGridO9 = angularGrid;
  this.gridO9 = angularGrid.slickGrid; // grid object
  this.dataviewO9 = angularGrid.dataView;
  this.gridServiceO9 = angularGrid.gridService;
}
handleSelectedRowsChangedO9(e, args) {
  if (Array.isArray(args.rows) && this.gridO9) {
    args.rows.map((idx) => {
      const item = this.gridO9.getDataItem(idx);
      // this.itinerary = this.services[idx].role_itineraries
    this.selecteditem = item.pme_nbr
       console.log(this.selecteditem);
       this.affectEmpService.getByGlobal(
        {pme_nbr:this.selecteditem}
        ).subscribe(
        (response: any) => {
          console.log(response.data)
          this.datasetO17= response.data
          console.log(this.datasetO17)
          
        
           this.dataviewO17.setItems(this.datasetO17)
           
        },
        (error) => {
            console.log(error)
            this.datasetO15=[]
        },
      )
    });
  }
 
}
prepareGridO9() {
  this.columnDefinitionsO9 = [
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
            id: "pme_nbr",
            name: "Session",
            field: "pme_nbr",
            sortable: true,
            minWidth: 70,
            maxWidth: 120,          
            type: FieldType.string,
            filterable:true,
            grouping: {
              getter: 'pme_nbr',
              formatter: (g) => `Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
        },
        {
            id: "pme_pm_code",
            name: "Programme",
            field: "pme_pm_code",
            sortable: true,
            minWidth: 100,
            maxWidth: 350,
            type: FieldType.string,
            filterable:true,
            grouping: {
              getter: 'pme_pm_code',
              formatter: (g) => `Programme: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
        }, 
        {
          id: "pme_site",
          name: "formateur",
          field: "pme_site",
          type: FieldType.string,
          sortable: true,
          filterable:true,
          grouping: {
            getter: 'pme_site',
            formatter: (g) => `Formateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
        },         
        {
          id: "pme_inst",
          name: "formation",
          field: "pme_inst",
          type: FieldType.string,
          sortable: true,
          filterable:true,
          grouping: {
            getter: 'pme_inst',
            formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
        },     
        {
          id: "price",
          name: "Budget",
          field: "price",
          type: FieldType.string,
          sortable: true,
          filterable:true,
          groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        },     
        {
          id: "pme_task",
          name: "salle de formation",
          field: "pme_task",
          type: FieldType.string,
          sortable: true,
          grouping: {
            getter: 'pme_task',
            formatter: (g) => `Salle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
         
        },     
        {
          id: "pme_task_status",
          name: "statut",
          field: "pme_task_status",
          type: FieldType.string,
        
          filterable:true,
          sortable: true,
          grouping: {
            getter: 'pme_status',
            formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
        },      
        {
          id: "pme_start_date",
          name: "Date debut",
          field: "pme_start_date",
          type: FieldType.date,
          
          filterable:true,
          sortable: true,
          grouping: {
            getter: 'pme_start_date',
            formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
        }, 
        {
          id: "pme_end_date",
          name: "Date Fin",
          field: "pme_end_date",
          type: FieldType.date,
          
          filterable:true,
          sortable: true,
          grouping: {
            getter: 'pme_end_date',
            formatter: (g) => `Fin Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
        }, 
        {
          id: "pme_duration",
          name: "Durée",
          field: "pme_duration",
          type: FieldType.integer,
          
          filterable:true,
          sortable: true,
          grouping: {
            getter: 'pme_duration',
            formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
        },
        {
          id: "pme_start_time",
          name: "Heure debut",
          field: "pme_start_time",
          type: FieldType.date,
          
          filterable:true,
          sortable: true,
          grouping: {
            getter: 'pme_start_Time',
            formatter: (g) => `Heure Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [new Aggregators.Sum('price')],
            aggregateCollapsed: true,
            
            collapsed:true
          }
        },   
        
        
        
      
  
      ]

  this.gridOptionsO9 = {
   
    rowHeight: 40,
    enableDraggableGrouping: true,
    createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 40,
    enableAutoResize:true,
    autoHeight:false,
    enableCellNavigation: true,
    enableSorting: true,
    enableExcelCopyBuffer: true,
    enableFiltering: true,
    enableRowSelection:true,
    frozenBottom: true,
    enableFilterTrimWhiteSpace:true,
    
    presets: {
      sorters: [{ columnId: "id", direction: "ASC" }],
    } ,
    
    draggableGrouping: {
      dropPlaceHolderText: 'Drop a column header here to group by the column',
      // groupIconCssClass: 'fa fa-outdent',
      deleteIconCssClass: 'fa fa-times',
      onGroupChanged: (e, args) => this.onGroupChangedO9(args),
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

  this.affectEmpService.getByGlobal(
    {}
    ).subscribe(
    (response: any) => {
      console.log(response.data)
      this.datasetO9 = response.data
      console.log(this.datasetO9)
      
    
       this.dataviewO9.setItems(this.datasetO9)
       
    },
    (error) => {
        console.log(error)
        this.datasetO9=[]
    },
  )
}
onGroupChangedO9(change: { caller?: string; groupColumns: Grouping[] }) {
  // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
  const caller = change && change.caller || [];
  const groups = change && change.groupColumns || [];

  if (Array.isArray(this.selectedGroupingFieldsO9) && Array.isArray(groups) && groups.length > 0) {
    // update all Group By select dropdown
    this.selectedGroupingFieldsO9.forEach((g, i) => this.selectedGroupingFieldsO9[i] = groups[i] && groups[i].getter || '');
  } else if (groups.length === 0 && caller === 'remove-group') {
    this.clearGroupingSelectsO9();
  }
}
clearGroupingSelectsO9() {
  this.selectedGroupingFieldsO9.forEach((g, i) => this.selectedGroupingFieldsO9[i] = '');
}
openDetO9(content) {
  this.prepareGrid1O9();
  this.modalService.open(content, { size: "lg" });
}
angularGridReady1O9(angularGrid: AngularGridInstance) {
  this.angularGrid1O9 = angularGrid;
  this.gridObj1O9 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid1O9() {
  this.columnDefinitions1O9 = [
    {
      id: "id",
      name: "id",
      field: "id",
      excludeFromHeaderMenu: true,
      minWidth: 10,
      sortable:true,
  },
    {
      id: "ptd_desc",
      name: "Désignation",
      field: "ptd_desc",
      sortable: true,
      minWidth: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    {
      id: "ptd_gol",
      name: "Objectif",
      field: "ptd_gol",
      sortable: true,
      minWidth: 50,
      filterable: false,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      },
    },
    
  ];

  this.gridOptions1O9 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableFiltering: true,
     autoHeight: false,
    // frozenColumn: 0,
    // frozenBottom: true,
    // autoFitColumnsOnFirstLoad: true,
    // enableAutoSizeColumns:true,
  
   //enableAutoResizeColumnsByCellContent:true,
    
  };
  this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
    (respo: any) => {this.datadetO9 = respo.data
      console.log(respo.data)
    })
  // fill the dataset with your data

  // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
}
// FIN ONGLET 9
angularGridReadyO10(angularGrid: AngularGridInstance) {
  this.angularGridO10 = angularGrid;
  this.gridO10 =angularGrid.slickGrid;
  this.gridObjO10 = (angularGrid && angularGrid.slickGrid) || {};
  this.dataViewO10 = angularGrid.dataView;
  this.gridServiceO10 = angularGrid.gridService;
}
handleSelectedRowsChangedO10(e, args) {
  if (Array.isArray(args.rows) && this.gridO10) {
    args.rows.map((idx) => {
      const item = this.gridO10.getDataItem(idx);
      // this.itinerary = this.services[idx].role_itineraries
    this.selecteditem = item.rep_contact
       console.log(this.selecteditem);
       this.affectEmpService.getByGlobal(
        {pme_site:this.selecteditem}
        ).subscribe(
        (response: any) => {
          console.log(response.data)
          this.datasetO18= response.data
          console.log(this.datasetO18)
          
        
           this.dataviewO18.setItems(this.datasetO18)
           
        },
        (error) => {
            console.log(error)
            this.datasetO18=[]
        },
      )
    });
  }
 
}
initGridO10() {
  
  this.columnDefinitionsO10 = [
    {
      id: 'delete',
      field: 'id',
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
         let ids=[]
         for(let da of this.jobsO10) {
          if (da.repd_contact == args.dataContext.rep_contact){
            console.log("da.id",da.id)
            ids.push(da.id)
          
          }
         }
        //  this.playAudio();
         this.gridServiceJobO10.deleteItemByIds(ids)
         this.gridServiceO10.deleteItem(args.dataContext);
        }
      
      }
      
    },
    // {
    //   id: "id",
    //   name: "id",
    //   field: "id",
    //   sortable: true,
    //   minWidth: 50,
    //   maxWidth: 50,
    //   filterable: true,
      
    // },
    {
      id: "rep_contact",
      name: "Contact",
      field: "rep_contact",
      sortable: true,
      width: 80,
      filterable: true,
      formatter:myCustomStringFormatter,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }
    },
    {
      id: "rep_code",
      name: "Organisme",
      field: "rep_code",
      sortable: true,
      width: 80,
      filterable: true,
      formatter:myCustomStringFormatter,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }
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
      id: "rep_post",
      name: "Poste",
      field: "rep_post",
      sortable: true,
      width: 80,
      filterable: true,
      formatter:myCustomStringFormatter,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }
    },
    {
      id: "chr01",
      name: "addresse",
      field: "chr01",
      sortable: true,
      width: 80,
      filterable: true,
      formatter:myCustomStringFormatter,
      type: FieldType.string,
      editor: {
        model: Editors.text,
      }
    },
    
    
    {
      id: "rep_tel",
      name: "TEL Mobile",
      field: "rep_tel",
      sortable: true,
      width: 80,
      type: FieldType.string,
      formatter:myCustomStringFormatter,
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
      formatter:myCustomStringFormatter,
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
      formatter:myCustomStringFormatter,
      editor: {
        model: Editors.text,
      }

    },
    // {
    //   id: "chr02",
    //   name: "Domaine",
    //   field: "chr02",
    //   sortable: true,
    //   width: 80,
    //   type: FieldType.string,
    //   formatter:myCustomStringFormatter,
    //   editor: {
    //     model: Editors.text,
    //   }

    // },
    {
      id: "chr03",
      name: "Site",
      field: "chr03",
      sortable: true,
      width: 80,
      type: FieldType.string,
      formatter:myCustomStringFormatter,
      editor: {
        model: Editors.text,
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
        let element: HTMLElement = document.getElementById("openDomsGrid") as HTMLElement;
        element.click();
      },
    },
    {
      id: "int01",
      name: "Honoraires",
      field: "int01",
      sortable: true,
      width: 80,
      type: FieldType.float,
      
      editor: {
        model: Editors.float,
      }

    },

    
   
    {
      id: "mod",
      name: "Edit",
      field: "id",
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
     // formatter: Formatters.editIcon,
      formatter: (row, cell, value, columnDef, dataContext) => {
        // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
        return `
             <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Formation">
             <i class="flaticon2-plus"></i>
         </a>
         `;
      },
      minWidth: 50,
      maxWidth: 50,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
        const id = args.dataContext.id
        this.contactO10 = args.dataContext.rep_contact
        let site = args.dataContext.chr03
              // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
        // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
   
        // }
        // else {
        //   alert("Modification Impossible pour ce Status")
        // }
        this.addNewJobO10(this.contactO10,site)
      // })
      },
    },
  ];

  this.gridOptionsO10 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableFiltering: true,
    editable: true,
    autoHeight: false,
    autoCommitEdit:true,
    rowHeight:40,
    enableRowSelection: true,
  };

  // fill the dataset with your data
  if(this.user.usrd_site == '*')  
    {this.RepertoryService.getBy({rep_type:'Trainor' }).subscribe(
      (respo: any) => {   
        this.repsO10 = respo.data
       console.log(this.repsO10)
       this.dataViewJobO10.setItems(this.repsO10);
        
         },
      (error) => {
          this.repsO10 = []
      },
      () => {}
  )}
  else{this.RepertoryService.getBy({rep_type:'Trainor',chr03:this.user.usrd_site }).subscribe(
    (respo: any) => {   
      this.repsO10 = respo.data
     console.log(this.repsO10)
     this.dataViewJobO10.setItems(this.repsO10);
      
       },
    (error) => {
        this.repsO10 = []
    },
    () => {}
  )}
}

angularGridReadyJobO10(angularGrid: AngularGridInstance) {
  this.angularGridJobO10 = angularGrid;
  this.gridObjJobO10 = (angularGrid && angularGrid.slickGrid) || {};
  this.dataViewJobO10 = angularGrid.dataView;
  this.gridServiceJobO10 = angularGrid.gridService;
}

initGridJobO10() {
  this.jobsO10 = [];
  this.columnDefinitionsJobO10 = [
    {
      id: 'delete',
      field: 'id',
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      onCellClick: (e: Event, args: OnEventArgs) => {
        if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          this.gridServiceJobO10.deleteItem(args.dataContext);
        }
      
      }
      
    },
    // {
    //   id: "id",
    //   name: "id",
    //   field: "id",
    //   sortable: true,
    //   minWidth: 50,
    //   maxWidth: 50,
    //   filterable: true,
      
    // },
    {
      id: "repd_contact",
      name: "Code Contact",
      field: "repd_contact",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      formatter:myCustomStringFormatter,
  },
  {
    id: "repd_job",
    name: "Diplome / Experience",
    field: "repd_job",
    sortable: true,
    filterable: true,
    type: FieldType.string,
    formatter:myCustomStringFormatter,
    editor: {
      model: Editors.text,
    }
  },
  // {
  //   id: "mvid",
  //   field: "cmvid",
  //   excludeFromHeaderMenu: true,
  //   formatter: Formatters.infoIcon,
  //   minWidth: 30,
  //   maxWidth: 30,
  //   onCellClick: (e: Event, args: OnEventArgs) => {
  //     this.row_number = args.row;
  //     let element: HTMLElement = document.getElementById("openJobsGrid") as HTMLElement;
  //     element.click();
  //   },
  // }, 
  
{
  id: "chr01",
  name: "Ecole / Entreprise",
  field: "chr01",
  sortable: true,
  filterable: true,
  type: FieldType.string,
  formatter:myCustomStringFormatter,
  editor: {
    model: Editors.text,
  }
},
{
  id: "chr02",
  name: "Année",
  field: "chr02",
  sortable: true,
  filterable: true,
  type: FieldType.string,
  formatter:myCustomStringFormatter,
  editor: {
    model: Editors.text,
  }
},
 
   
  ];

  this.gridOptionsJobO10 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableFiltering: true,
    editable: true,
    autoHeight: false,
    autoCommitEdit:true,
    rowHeight:40,
  
    
  };
if(this.user.usrd_site == '*')  
{this.RepertoryService.getByJob({ }).subscribe(
  (respo: any) => {   
    this.jobsO10 = respo.data
   console.log(this.jobsO10)
   this.dataViewJobO10.setItems(this.jobsO10);
    
     },
  (error) => {
      this.jobsO10 = []
  },
  () => {}
)}
else{this.RepertoryService.getByJob({chr03:this.user.usrd_site }).subscribe(
(respo: any) => {   
  this.jobsO10 = respo.data
 console.log(this.jobsO10)
 this.dataViewJobO10.setItems(this.jobsO10);
  
   },
(error) => {
    this.jobsO10 = []
},
() => {}
)}
  // this.jobService.getAllwithDetail().subscribe(
      
  //   (response: any) => {
  //   //  console.log(response.data),
  //     this.jobs = response.data,
  //     this.dataViewJob.setItems(this.jobs)
  //   },
  //   (error) => {
  //       this.jobs = []
  //   },
  //   () => {}
  //   )
 
}
getRepO10() {
  this.repsO10 = []
 
  const controls = this.repForm.controls
  this.providerService.getBy({vd_addr:controls.four.value}).subscribe((respo: any)=>{
    if(respo.data != null) {
      controls.name.setValue(respo.data.address.ad_name)
    }

 
  this.RepertoryService.getBy({ rep_code : controls.four.value}).subscribe(
    (response: any) => {   
      this.repsO10 = response.data
     console.log(this.repsO10)
     this.dataViewO10.setItems(this.repsO10);
      
       },
    (error) => {
        this.repsO10 = []
    },
    () => {}
)
this.RepertoryService.getByJob({ repd_code : controls.four.value}).subscribe(
  (respo: any) => {   
    this.jobsO10 = respo.data
   console.log(this.jobsO10)
   this.dataViewJobO10.setItems(this.jobsO10);
    
     },
  (error) => {
      this.jobsO10 = []
  },
  () => {}
)
  })
}
onSubmitO10() {
  const controls = this.repFormO10.controls

  for (let data of this.repsO10) {
    delete data.id;
  
  }
  for (let data of this.jobsO10) {
    delete data.id;
  
  }
  this.RepertoryService.addJob({addr: controls.four.value,repDetails: this.repsO10,jobDetails: this.jobsO10 }).subscribe(
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
      
      this.resetO10()
      this.loadingSubject.next(false);
    }
  );
}
createFormO10() {
  this.loadingSubject.next(false)
//create form

this.repFormO10 = this.repFB.group({
    four: [null],
    name: [null]

})
this.initGridO10();
this.initGridJobO10();
}

// prepareCode(): any {
//   const controls = this.empForm.controls
//   const _addReport = nchnagedew AddReport()
//   _addReport.pmr_pm_code = controls.pmr_pm_code.value
//   _addReport.pmr_inst = controls.pmr_inst.value
//   _addReport.pmr_task = controls.pmr_task.value
//   _addReport.pmr_task_status = controls.pmr_task_status.value
//   _addReport.pmr_close = controls.pmr_close.value


//   return _addReport
// }



//reste form
resetO10() {
  
  this.createFormO10();
  this.hasFormErrors10 = false;
   
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


handleSelectedRowsChangedcustO10(e, args) {
  
 
  let updateItem = this.gridServiceO10.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObjcustO10) {
  args.rows.map((idx) => {
    const item = this.gridObjcustO10.getDataItem(idx);
    console.log(item);

    
        updateItem.rep_code = item.ad_addr;
        
        this.gridServiceO10.updateItem(updateItem);
      });
      //});
    }
}
angularGridReadycustO10(angularGrid: AngularGridInstance) {
  this.angularGridcustO10 = angularGrid
  this.gridObjcustO10 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridcustO10() {
  this.columnDefinitionscustO10 = [
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

  this.gridOptionscustO10 = {
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
  this.providerService
      .getAll()
      .subscribe((response: any) => (this.datacustO10 = response.data))
}
openO10(content) {
  
  this.prepareGridcustO10()
  this.modalService.open(content, { size: "lg" })
}

addNewItemO10() {
const newId = this.repsO10.length+1;

const newItem = {
  id: newId,
  rep_contact:null,
  rep_post: null,
  rep_tel: null,
  rep_tel2: null,
  rep_email: null,
  rep_type: "Trainor",
};
this.gridServiceO10.addItem(newItem, { position: "bottom" });
}
addNewJobO10(contact,site) {
const newId = this.jobsO10.length+1;

const newItem = {
  id: newId,
  repd_contact:contact,
  repd_job: null,
  desc: null,
  chr03:site,
 
};
this.gridServiceJobO10.addItem(newItem, { position: "bottom" });
}

handleSelectedRowsChangedjO10(e, args) {
let updateItem = this.gridServiceJobO10.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObjjO10) {
  args.rows.map((idx) => {
    const item = this.gridObjjO10.getDataItem(idx);
  console.log(item)
        updateItem.repd_job = item.jb_code;
        updateItem.desc= item.jb_desc;
        
        this.gridServiceJobO10.updateItem(updateItem);
       
  
});

}
}
angularGridReadyjO10(angularGrid: AngularGridInstance) {
this.angularGridjO10 = angularGrid;
this.gridObjjO10 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridjO10() {
this.columnDefinitionsjO10 = [
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
    id: "jb_code",
    name: "Code",
    field: "jb_code",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  {
    id: "jb_desc",
    name: "Designation",
    field: "jb_desc",
    sortable: true,
    filterable: true,
    type: FieldType.string,
  },
  
];

this.gridOptionsjO10 = {
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
  // let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);

// fill the dataset with your data
this.jobService
  .getAll()
  .subscribe((response: any) => (this.datajobO10 = response.data));
}
openjobO10(contenttask) {
this.prepareGridjO10();
this.modalService.open(contenttask, { size: "lg" });
}


handleSelectedRowsChangeddO10(e, args) {
let updateItem = this.gridServiceO10.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObjdO10) {
  args.rows.map((idx) => {
    const item = this.gridObjdO10.getDataItem(idx);
  
        updateItem.chr03 = item.si_site;
        
        this.gridServiceO10.updateItem(updateItem);
       
  
});

}
}
angularGridReadydO10(angularGrid: AngularGridInstance) {
this.angularGriddO10 = angularGrid;
this.gridObjdO10 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGriddO10() {
this.columnDefinitionsdO10 = [
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
    id: "si_site",
    name: "Code site",
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

this.gridOptionsdO10 = {
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
  // let updateItem = this.mvgridService.getDataItemByRowIndex(this.row_number);

// fill the dataset with your data
if(this.user.usrd_site != '*')
{this.siteService
  .getBy({si_site:this.user.usrd_site})
  .subscribe((response: any) => (this.datadomO10 = response.data));}
else{this.siteService
  .getBy({})
  .subscribe((response: any) => (this.datadomO10 = response.data));}  
}
opendomO10(contentdom) {
this.prepareGriddO10();
this.modalService.open(contentdom, { size: "lg" });
}

playAudio(){
let audio = new Audio();
audio.src = "../../../assets/media/error/error.mp3";
audio.load();
audio.play();
}
handleSelectedRowsChanged2O10(e, args) {
let updateItem = this.gridServiceO10.getDataItemByRowIndex(this.row_number);
if (Array.isArray(args.rows) && this.gridObjcustO10) {
  args.rows.map((idx) => {
    const item = this.gridObjcustO10.getDataItem(idx);
    console.log(item);

    
        updateItem.rep_code = item.ad_addr;
        
        this.gridServiceO10.updateItem(updateItem);
      });
      //});
    }
}

angularGridReady2O10(angularGrid: AngularGridInstance) {
this.angularGridcustO10 = angularGrid;
this.gridObjcustO10 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGrid2O10() {
this.columnDefinitionscustO10 = [
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

this.gridOptionscustO10 = {
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
if(this.adtypeO10 != "Provider"){this.addressService.getAll().subscribe((response: any) => (this.adressesO10 = response.data));}
else{this.addressService.getBy({ad_type:'vendor'}).subscribe((response: any) => (this.adressesO10 = response.data));}
}
open2O10(content) {

      this.prepareGrid2O10();
      this.modalService.open(content, { size: "lg" });
    

}
// FIN ONGLET 10
mvGridReadyO11(angularGrid: AngularGridInstance) {
  this.mvangularGridO11 = angularGrid;
  this.mvdataViewO11 = angularGrid.dataView;
  this.mvgridO11 = angularGrid.slickGrid;
  this.mvgridServiceO11 = angularGrid.gridService;
}
//create form
createFormO11() {
  this.loadingSubject.next(false);
    this.accountPayable = new AccountUnplanifed ()
    const date = new Date;
    
    this.asForm = this.asFB.group({
  //    so__chr01: [this.accountPayable.au__chr01],
      // au_nbr:[this.accountPayable.au_nbr , Validators.required],
      au_vend: [this.accountPayable.au_vend , Validators.required ],
      name: [{value:"", disabled: true}],
      au_curr: [this.curr,],
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
    const controls = this.asForm.controls
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

  OnchangeCurrO11(){
    const controls = this.asForm.controls
    
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

  

  OnchangeBankO11 (){

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
resetO11() {
  this.accountPayable = new AccountUnplanifed();
  this.createFormO11();
  this.mvdatasetO11=[]
  
  this.hasFormErrors11 = false;
}
// save data
onSubmitO11() {
  this.hasFormErrors11 = false;
  const controls = this.asForm.controls;
  /** check form */
  if (this.asForm.invalid) {
    Object.keys(controls).forEach((controlName) =>
      controls[controlName].markAsTouched()
    );
    this.message = "Modifiez quelques éléments et réessayez de soumettre.";
    this.hasFormErrors11 = true;

    return;
  }

  this.bankService.getBy({ bk_code : controls.au_bank.value }).subscribe(
    (resp: any) => {
      
      
      if (resp.data.bank.bk_balance >= Number(controls.au_amt.value)) {
  
        let as = this.prepareAS()
        this.addAS(as, this.mvdatasetO11);
           
      }
      else {
        
        let as = this.prepareAS()
        this.addAS(as, this.mvdatasetO11);
      }       
   

    });    
 

}

prepareAS(): any {
  
  const controls = this.asForm.controls;
 
   const _as = new AccountUnplanifed();
  
    _as.au_vend = controls.au_vend.value;
    _as.au_user1 = controls.name.value;
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
addAS(_au: any, detail: any) {
  this.loadingSubject.next(true);
  let as = null;
  for (let data of detail) {
    delete data.id;
    delete data.cmvid;
   
  }
  const controls = this.asForm.controls;

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
        this.resetO11()
        
      }
    );
}
onChangeCheckO11() {
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

/**
 * Go back to the list
 *
 */
goBack11() {
  this.loadingSubject.next(false);
  const url = `/account-payable/create-charge-payment`;
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
}

onAlertClose11($event) {
  this.hasFormErrors11 = false;
}




handleSelectedRowsChangedbankO11(e, args) {
const controls = this.asForm.controls;
if (Array.isArray(args.rows) && this.gridObjbankO11) {
  args.rows.map((idx) => {
    const item = this.gridObjbankO11.getDataItem(idx);
    controls.au_bank.setValue(item.bk_code || "");
    

  
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

handleSelectedRowsChangedvendO11(e, args) {
const controls = this.asForm.controls;
if (Array.isArray(args.rows) && this.gridObjvendO11) {
  args.rows.map((idx) => {
    const item = this.gridObjvendO11.getDataItem(idx);
  //  console.log(item)
    
    
    controls.au_vend.setValue(item.rep_code || "");
      controls.name.setValue(item.rep_contact || "");
    
   
   
})
}
}

angularGridReadyvendO11(angularGrid: AngularGridInstance) {
this.angularGridvendO11 = angularGrid;
this.gridObjvendO11 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridvendO11() {
this.columnDefinitionsvendO11 = [
  
  
  {
    id: "rep_contact",
    name: "Contact",
    field: "rep_contact",
    sortable: true,
    width: 80,
    filterable: true,
    formatter:myCustomStringFormatter,
    type: FieldType.string,
    
  },
  {
    id: "rep_code",
    name: "Organisme",
    field: "rep_code",
    sortable: true,
    width: 80,
    filterable: true,
    formatter:myCustomStringFormatter,
    type: FieldType.string,
    
  },
  
  {
    id: "rep_post",
    name: "Poste",
    field: "rep_post",
    sortable: true,
    width: 80,
    filterable: true,
    formatter:myCustomStringFormatter,
    type: FieldType.string,
    
  },
  {
    id: "chr01",
    name: "addresse",
    field: "chr01",
    sortable: true,
    width: 80,
    filterable: true,
    formatter:myCustomStringFormatter,
    type: FieldType.string,
   
  },
  
  
  {
    id: "rep_tel",
    name: "TEL Mobile",
    field: "rep_tel",
    sortable: true,
    width: 80,
    type: FieldType.string,
    formatter:myCustomStringFormatter,
    

  },
];

this.gridOptionsvendO11 = {
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
if(this.user.usrd_site == '*')  
  {this.RepertoryService.getBy({rep_type:'Trainor' }).subscribe(
    (respo: any) => {   
      this.vendsO11 = respo.data
     
      
       },
    (error) => {
      this.vendsO11 = []
    },
    () => {}
)}
else{this.RepertoryService.getBy({rep_type:'Trainor',chr03:this.user.usrd_site }).subscribe(
  (respo: any) => {   
    this.vendsO11 = respo.data
   
    
     },
  (error) => {
    this.vendsO11 = []
  },
  () => {}
)}
// this.providerService
//   .getAll()
//   .subscribe((response: any) => (this.vendsO11 = response.data));
 }
openVendO11(content) {
this.prepareGridvendO11();
this.modalService.open(content, { size: "lg" });
}

initmvGridO11() {
this.mvcolumnDefinitionsO11 = [
  {
    id: "id",
    field: "id",
    excludeFromHeaderMenu: true,
    formatter: Formatters.deleteIcon,
    minWidth: 30,
    maxWidth: 30,
    onCellClick: (e: Event, args: OnEventArgs) => {
      if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
        this.mvangularGridO11.gridService.deleteItem(args.dataContext);
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
       
      const controls  = this.asForm.controls
      let tot = 0
      for (let data of this.mvdatasetO11) {
        tot = tot + data.aud_amt

      }
controls.au_amt.setValue(tot)
    },
  },
  
  
];

this.mvgridOptionsO11 = {
  asyncEditorLoading: false,
  editable: true,
  enableColumnPicker: true,
  enableCellNavigation: true,
  enableRowSelection: true,
  autoEdit:true,
  autoCommitEdit:true,
};

this.mvdatasetO11 = [];
}
addNewItemO11() {
const newId = this.mvdatasetO11.length+1;

const newItem = {
  id: newId,
  aud_fc_code : "",
  aud_desc: "",
  aud_amt: 0,
};
this.mvgridServiceO11.addItem(newItem, { position: "bottom" });
}

openChargeO11(content) {
this.prepareGridchargeO11();
this.modalService.open(content, { size: "xl" });
}

getTrainingDetO11(){
this.mvdatasetO11=[]
// for(let job of this.selectedJob) {

//   console.log(job)
// }

 let idd = 0
  for (let data of this.selectedcO11){
    const found = this.datachargeO11.find((element) => element.fc_code == data);
    console.log(found)


   // this.gridServicetr.addItem(
    let obj =  {
        id: idd + 1,
        aud_fc_code: found.fc_code,
        aud_desc : found.fc_desc,
        aud_amt : 0,
      };
        this.mvdatasetO11.push(obj)
      idd++;
  }

this.modalService.dismissAll()
// let element: HTMLElement = document.getElementById('openTrsGrid') as HTMLElement;
// element.click();
}


angularGridReadycO11(angularGrid: AngularGridInstance) {
this.angularGridcO11 = angularGrid;
this.gridObjcO11 = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridchargeO11() {
this.columnDefinitionscO11 = [
   
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

this.gridOptionscO11 = {
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
this.datachargeO11 = []
this.financialchargeService.getAll().subscribe(
    (response: any) => (this.datachargeO11 = response.data),
    (error) => {
        this.datachargeO11 = []
    },
    () => {}
)
}
handleSelectedRowsChangedcO11(e, args) {
if (Array.isArray(args.rows) && this.gridObjcO11) {
  this.selectedcO11 = args.rows.map((idx: number) => {
    const item = this.gridObjcO11.getDataItem(idx);
    return item.fc_code;
  });
}
console.log(this.selectedcO11)
}
charge(){
this.loadingSubject.next(false);
  const url = `/financialcharge/create-fc`;
  this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
}
// FIN ONGLET 11
 //create form
 createForm12() {
  this.loadingSubject.next(false)
  this.location = new Location()
  this.locationForm = this.locationFB.group({
      loc_site: [this.location.loc_site, Validators.required],
      loc_loc: [this.location.loc_loc, Validators.required],
      loc_desc: [{ value: this.location.loc_desc, disabled: !this.isExist },  Validators.required ],
      loc_status: [{ value: this.location.loc_status,disabled: !this.isExist }, Validators.required],
      loc_project: [{ value: this.location.loc_project, disabled: !this.isExist }],
      loc_perm: [{ value: this.location.loc_perm, disabled: !this.isExist }],
      loc_type: [{ value: this.location.loc_type , disabled: !this.isExist }],
      loc_single: [{ value: this.location.loc_single, disabled: !this.isExist }],
      loc__qad01: [{ value: this.location.loc__qad01, disabled: !this.isExist }],
      loc_cap: [{ value: this.location.loc_cap, disabled: !this.isExist }],
      loc_cap_um: [{ value: this.location.loc_cap_um, disabled: !this.isExist }],
      loc_xfer_ownership: [{ value: this.location.loc_xfer_ownership, disabled: !this.isExist }],
      chr01: [this.location.chr01],
      loc_phy_adr:[this.location.loc_phys_addr],
      

  })
  this.form1 = this.locationFB.group({
      pts_selected:[{value:false}],

    
    });
}

onChangeCode12() {
  const controls = this.locationForm.controls
  this.locationService
      .getBy({
            loc_site: controls.loc_site.value,
            loc_loc: controls.loc_loc.value,

      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.loc_desc.enable()
              controls.loc_status.enable()
              controls.loc_project.enable()
              controls.loc_perm.enable()
              controls.loc_type.enable()
              controls.loc_single.enable()
              controls.loc__qad01.enable()
              controls.loc_cap.enable()
              controls.loc_cap_um.enable()
              controls.loc_xfer_ownership.enable()

          }
   })
}
//reste form
reset12() {
  this.location = new Location()
  // this.locationFilter=new LocationFilter()
  this.createForm12()
  this.hasFormErrors12 = false
}
// save data
onSubmit12() {
  this.hasFormErrors12 = false
  const controls = this.locationForm.controls
  /** check form */
  if (this.locationForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors12 = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let location = this.prepateLocation()
  this.addLocation(location,this.filtredList12)
}

/**
* Returns object for saving
*/
prepateLocation(): Location {
  const controls = this.locationForm.controls
  const _location = new Location()
  _location.loc_site = controls.loc_site.value
  _location.loc_loc = controls.loc_loc.value
  _location.loc_desc = controls.loc_desc.value
  _location.loc_status = controls.loc_status.value
  _location.loc_project = controls.loc_project.value
  _location.loc_perm = controls.loc_perm.value
  _location.loc_type = controls.loc_type.value
  _location.loc_single = controls.loc_single.value
  _location.loc__qad01 = controls.loc__qad01.value
  _location.loc_cap = controls.loc_cap.value
  _location.loc_cap_um = controls.loc_cap_um.value
  _location.loc_xfer_ownership = controls.loc_xfer_ownership.value
  _location.chr01=controls.chr01.value
  _location.loc_phys_addr=controls.loc_phy_adr.value


  return _location
}
/**
* Add code
*
* @param _code: CodeModel
*/
addLocation(_location: Location, listprodfilter:any) {
  this.loadingSubject.next(true)
  this.locationService.add({_location:_location, details:listprodfilter}).subscribe(
      (reponse) => console.log("response", Response),
      (error) => {
        // console.log("error ", _location)
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
          this.reset12()
      }
  )
  
}

/**
* Go back to the list
*
*/

handleSelectedRowsChangedsiteO12(e, args) {
  const controls = this.locationForm.controls
 
  if (Array.isArray(args.rows) && this.gridObjsiteO12) {
      args.rows.map((idx) => {
          const item = this.gridObjsiteO12.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedFieldO12) {
              case "loc_site": {
                  controls.loc_site.setValue(item.si_site || "")
                  break
              }    
              default:
                  break
          }
      })
  }
}

angularGridReadysiteO12(angularGrid: AngularGridInstance) {
  this.angularGridsiteO12 = angularGrid
  this.gridObjsiteO12 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridsiteO12() {
  this.columnDefinitionssiteO12 = [
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
      
  ]

  this.gridOptionssiteO12 = {
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
  this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasiteO12 = response.data))
}
opensiteO12(contentsite, field) {
  this.selectedFieldO12 = field
  this.prepareGridsiteO12()
  this.modalService.open(contentsite, { size: "lg" })
}



changeUm12() {
  const controls = this.locationForm.controls; // chof le champs hada wesh men form rah

  let obj = {};
    
    const code_value = controls.loc_cap_um.value;
    obj = {
      code_value,
      code_fldname: 'pt_um',
    };
  

  this.codeService.getBy(obj).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Cette UM n'existe pas!";
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

changeStatus12(field) {
  const controls = this.locationForm.controls; // chof le champs hada wesh men form rah

  let is_status: any;
  if (field == "loc_status") {
   
     is_status = controls.loc_status.value;
    
  }
 

  this.inventoryStatusService.getBy({is_status}).subscribe(
    (res: any) => {
      const { data } = res;
      const message = "Ce code status n'existe pas!";
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


handleSelectedRowsChangedstatus12(e, args) {
  const controls1 = this.locationForm.controls;
  
  if (Array.isArray(args.rows) && this.gridObjstatus12) {
    args.rows.map((idx) => {
      const item = this.gridObjstatus12.getDataItem(idx);
      // TODO : HERE itterate on selected field and change the value of the selected field
      switch (this.selectedField) {
        case "loc_status": {
          controls1.loc_status.setValue(item.is_status || "");
          break;
        }
        
        default:
          break;
      }
    });
  }
}


angularGridReadystatus12(angularGrid: AngularGridInstance) {
  this.angularGridstatus12 = angularGrid
  this.gridObjstatus12 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridstatus12() {
  this.columnDefinitionsstatus12 = [
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

  this.gridOptionsstatus12 = {
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
    .subscribe((response: any) => (this.datastatus12 = response.data));
}
openstatus12(content, field) {
  this.selectedFieldO12 = field
  this.prepareGridstatus12()
  this.modalService.open(content, { size: "lg" })
}

handleSelectedRowsChanged312(e, args) {
  const controls = this.locationForm.controls
  
  if (Array.isArray(args.rows) && this.gridObj312) {
      args.rows.map((idx) => {
          const item = this.gridObj312.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
          switch (this.selectedFieldO12) {
             
              case "pt_um": {
                  controls.loc_cap_um.setValue(item.code_value || "")
                  break    
              }
              case "loc_type": {
                  controls.loc_cap_um.setValue(item.code_value || "")
                  break    
              }
             
              default:
                  break
          }
      })
  }
}

angularGridReady312(angularGrid: AngularGridInstance) {
  this.angularGrid312 = angularGrid
  this.gridObj312 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid312() {
  this.columnDefinitions312 = [
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

  this.gridOptions312 = {
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
      .getBy({ code_fldname: this.selectedFieldO12 })
      .subscribe((response: any) => (this.data12 = response.data))
}

open312(content, field) {
  this.selectedFieldO12 = field
  this.prepareGrid312()
  this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChangedpm12(e, args) {
  const controls = this.locationForm.controls
 
  if (Array.isArray(args.rows) && this.gridObjpm12) {
      args.rows.map((idx) => {
          const item = this.gridObjpm12.getDataItem(idx)
          // TODO : HERE itterate on selected field and change the value of the selected field
                  controls.loc_project.setValue(item.pm_code || "")
          
      })
    }

}

angularGridReadypm12(angularGrid: AngularGridInstance) {
  this.angularGridpm12 = angularGrid
  this.gridObjpm12 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGridpm12() {
  this.columnDefinitionspm12 = [
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
          id: "pm_code",
          name: "Code",
          field: "pm_code",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "pm_desc",
          name: "Designation",
          field: "pm_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "pm_cust",
          name: "Client",
          field: "pm_cust",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      
  ]

  this.gridOptionspm12 = {
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
  this.projectService
      .getAll()
      .subscribe((response: any) => (this.datapm12 = response.data))
}

openpm12(content) {
  
  this.prepareGridpm12()
  this.modalService.open(content, { size: "lg" })
}

gridReady12(angularGrid: AngularGridInstance) {
  this.angularGrid12 = angularGrid;
  this.dataView12 = angularGrid.dataView;
  this.grid12 = angularGrid.slickGrid;
  this.gridService12 = angularGrid.gridService;
}

prepareGrid12() {
  this.columnDefinitions12 = [
   
  //   {
  //     id: "id",
  //     name: "id",
  //     field: "id",
  //     sortable: true,
  //     width: 10,
  //   },
    {
      id: "pt_part",
      name: "Code Produit",
      field: "pt_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    },
  //   {
  //     id: "pt_desc2",
  //     name: "Description Interne",
  //     field: "pt_desc2",
  //     sortable: true,
  //     filterable: true,
  //     minWidth: 150,
  //     type: FieldType.string,
  //   },
   
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
      id: "pt_net_wt",
      name: "Poids Net",
      field: "pt_net_wt",
      sortable: true,
      filterable: true,
      type: FieldType.number,
      minWidth: 80,
    },
    {
      id: "pt_model",
      name: "Format",
      field: "pt_model",
      sortable: true,
      filterable: true,
      // type: FieldType.text,
      minWidth: 80,
    },

    {
      id: "pt_break_cat",
      name: "Couleur",
      field: "pt_break_cat",
      sortable: true,
      filterable: true,
      minWidth: 80,
      // type: FieldType.text,
      // resizeAlwaysRecalculateWidth:true
    },
    {
      id: "pt_promo",
      name: "Logo",
      field: "pt_promo",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    }
   
  ];

  this.gridOptions12 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableCheckboxSelector:true,
    multiSelect:true,
    enableFiltering: true,
    autoEdit: false,
    enableAutoResize: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false,
      
    },
    // enableRangeSelection=true,
    autoFitColumnsOnFirstLoad: true,
    // showCellSelection:true,
    // enableRowSelection:true,
    // autosizeColumnsByCellContentOnFirstLoad: true,
    enableAutoSizeColumns: true,
    syncColumnCellResize: true,

    presets: {
      sorters: [{ columnId: "id", direction: "ASC" }],
      rowSelection: {
        // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
        dataContextIds: this.listprodIds12  //[3,5, 12, 13,]  // (recommended) select by your data object IDs
      }
    },
  };

  // fill the dataset with your data
  // this.dataset = []; this.datasetSaved=[]
  // if(this.firstime){
    console.log('we are here ')
  this.itemService.getAll().subscribe(
    (response: any) => {
      this.dataset12 = response.data;
      this.datasetSaved12=response.data;
      // this.dataView.setItems(this.dataset);
    },

    (error) => {
      this.dataset12 = [];
      this.datasetSaved12=[]
    },
    () => {}
  );
  // } 
}

onChangeCheckbox12(event: Event): void {
  const checked: boolean = event.target['checked']; // or event.target.checked
  this.isChecked=checked
  // console.log(" list f from check bx"+this.filtredList)
  // console.log(" list id frm cbx "+this.listprodIds)
  // console.log('checkbox '+checked +' global variable '+this.isChecked)
  if(checked){
    //checked
    // own logic
    // this.prepareGrid()
    this.dataset12=[]
    this.dataset12=this.selectedList12
  }
  else{
      // not checked
      // logic 
      this.dataset12=[]
      this.dataset12=this.datasetSaved12
  }
 }

handleSelectedRowsChangedFiltredProd12(e, args) {
  // const controls1 = this.form1.controls;    
  this.filtredList12=[];
  this.listprodIds12=[]
  this.selectedList12=[]
  if (Array.isArray(args.rows) && this.grid12) {
  //    this.filtredList=args.rows;  

    args.rows.map((idx) => {
      const item = this.grid12.getDataItem(idx);
      
      this.listprodIds12.push(item.id)
      this.selectedList12.push(item)
      // TODO : HERE itterate on selected field and change the value of the selected field
       let pt_fltr ={
           loc_loc: this.locationForm.controls.loc_loc.value,
           loc_site: this.locationForm.controls.loc_site.value,
           loc_part: item.pt_part,
           color: item.pt_break_cat,
           model: item.pt_model,
           quality: item.status,
           logo: item.pt_promo,
           grammage: item.pt_net_wt,
       };
       this.filtredList12.push(pt_fltr)
          // controls1.pt_site.setValue(item.si_site || "");
    });

     console.log(" list f "+this.filtredList12)
     console.log(" list id "+this.listprodIds12)
    //  this.filtredList.map((item)=>{
    //   console.log(" item loc "+item.loc_loc)
    //   console.log(" item code "+item.loc_part)
    //   console.log(" item model "+item.model)
    //  })

  }
}

refresh12(){
  console.log(' refresh test ')
  // this.grid.setSelectedRows(this.listprodIds) 
  // this.grid.cellSelectionModel(this.listprodIds)
  // this.prepareGrid()

  // alert('teeest')
  // this.grid.setActiveCell(this.listprodIds)
  // this.angularGrid.slickGrid.setSelectedRows(this.listprodIds); 
  // this.angularGrid.gridService.setSelectedRows(this.listprodIds); 
  // this.angularGrid.slickGrid.renderGrid()
  
  this.gridOptions12 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    enableCheckboxSelector:true,
    multiSelect:true,
    enableFiltering: true,
    autoEdit: false,
    enableAutoResize: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false,
      
    },
    // enableRangeSelection=true,
    autoFitColumnsOnFirstLoad: true,
    // showCellSelection:true,
    // enableRowSelection:true,
    // autosizeColumnsByCellContentOnFirstLoad: true,
    enableAutoSizeColumns: true,
    syncColumnCellResize: true,

    presets: {
      sorters: [{ columnId: "id", direction: "ASC" }],
      rowSelection: {
        // gridRowIndexes: [2],           // the row position of what you see on the screen (UI)
        dataContextIds: this.listprodIds12  //[3,5, 12, 13,]  // (recommended) select by your data object IDs
      }
    },
  };
}

gridSelectedReady12(angularGrid: AngularGridInstance) {
  this.angularGridSelected12 = angularGrid;
  this.dataView12 = angularGrid.dataView;
  this.gridSelected12 = angularGrid.slickGrid;
  this.gridServiceSelected12 = angularGrid.gridService;
}

prepareGridSelected12() {
  this.columnSelectedDefinitions12 = [
   
  
    {
      id: "pt_part",
      name: "Code Produit",
      field: "pt_part",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
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
      id: "pt_net_wt",
      name: "Poids Net",
      field: "pt_net_wt",
      sortable: true,
      filterable: true,
      type: FieldType.number,
      minWidth: 80,
    },
    {
      id: "pt_model",
      name: "Format",
      field: "pt_model",
      sortable: true,
      filterable: true,
      // type: FieldType.text,
      minWidth: 80,
    },

    {
      id: "pt_break_cat",
      name: "Couleur",
      field: "pt_break_cat",
      sortable: true,
      filterable: true,
      minWidth: 80,
      // type: FieldType.text,
      // resizeAlwaysRecalculateWidth:true
    },
    {
      id: "pt_promo",
      name: "Logo",
      field: "pt_promo",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 80,
    }
   
  ];

  this.gridSelectedOptions12 = {
    enableSorting: true,
    enableCellNavigation: true,
    enableExcelCopyBuffer: true,
    // enableCheckboxSelector:true,
    multiSelect:true,
    enableFiltering: true,
    autoEdit: false,
    enableAutoResize: true,
    rowSelectionOptions: {
      // True (Single Selection), False (Multiple Selections)
      selectActiveRow: false
    },

    autoFitColumnsOnFirstLoad: true,
    // autosizeColumnsByCellContentOnFirstLoad: true,
    enableAutoSizeColumns: true,
    syncColumnCellResize: true,

    presets: {
      sorters: [{ columnId: "id", direction: "ASC" }],
    },
  };
 
  this.dataView12.setItems(this.selectedList12);
  

}
// FIN ONGLET 12
angularGridReadyO13(angularGrid: AngularGridInstance) {
  this.angularGridO13 = angularGrid;
  this.gridO13 = angularGrid.slickGrid; // grid object
  this.dataViewO13 = angularGrid.dataView;
  this.gridServiceO13 = angularGrid.gridService;
}
handleSelectedRowsChangedO13(e, args) {
  if (Array.isArray(args.rows) && this.gridO13) {
    args.rows.map((idx) => {
      const item = this.gridO13.getDataItem(idx);
      // this.itinerary = this.services[idx].role_itineraries
    this.selecteditem = item.loc_loc
       console.log(this.selecteditem);
       this.affectEmpService.getByGlobal(
        {pme_task:this.selecteditem}
        ).subscribe(
        (response: any) => {
          console.log(response.data)
          this.datasetO19= response.data
          console.log(this.datasetO19)
          
        
           this.dataviewO19.setItems(this.datasetO19)
           
        },
        (error) => {
            console.log(error)
            this.datasetO19=[]
        },
      )
    });
  }
 
}
prepareGridO13() {
  this.columnDefinitionsO13 = [
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
              this.router.navigateByUrl(`/inventory-settings/edit-loc/${id}`)
          },
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
          id: "loc_site",
          name: "Site",
          field: "loc_site",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "loc_desc",
          name: "Designation",
          field: "loc_desc",
          sortable: true,
          width: 200,
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
        id: "loc_type",
        name: "Type",
        field: "loc_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
     
      
      {
        id: "loc_cap",
        name: "Capacite",
        field: "loc_cap",
        sortable: true,
        filterable: true,
        type: FieldType.float,
      },
      {
        id: "loc_cap_um",
        name: "UM",
        field: "loc_cap_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      

      
  ]

  this.gridOptionsO13 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
      frozenColumn: 0,
      frozenBottom: true,
      enableRowSelection:true,
  }

  // fill the dataset with your data
  this.datasetO13 = []
  if (this.user.usrd_site == '*')
  {this.locationService.getAll().subscribe(
      (response: any) => (this.datasetO13 = response.data),
      (error) => {
          this.datasetO13 = []
      },
      () => {}
  )}
  else{this.locationService.getBy({loc_site:this.user.usrd_site}).subscribe(
    (response: any) => (this.datasetO13 = response.data),
    (error) => {
        this.datasetO13 = []
    },
    () => {}
)}
}
// FIN ONGLET 13
angularGridReadyO14(angularGrid: AngularGridInstance) {
  this.angularGridO14 = angularGrid;
  this.gridO14 = angularGrid.slickGrid; // grid object
  this.dataviewO14 = angularGrid.dataView;
  this.gridServiceO14 = angularGrid.gridService;
}


prepareGridO14() {

    this.columnDefinitionsO14 = [
        
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
          id: "as_nbr",
          name: "Document",
          field: "as_nbr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: 'as_nbr',
            formatter: (g) => `Facture: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_applied')
            ],
            aggregateCollapsed: true,
            collapsed: true,
          }
        }, 
        {
          id: "as_ship",
          name: "Facture N°",
          field: "as_ship",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: 'as_ship',
            formatter: (g) => `Facture: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_amt')
            ],
            aggregateCollapsed: true,
            collapsed: true,
          }
        }, 
        {
          id: "as_type",
          name: "type",
          field: "as_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: 'as_type',
            formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_applied')
            ],
            aggregateCollapsed: true,
            collapsed: true,
          }
        }, 
        {
          id: "as_cust",
          name: "Client",
          field: "as_cust",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
            getter: 'as_cust',
            formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_applied')
            ],
            aggregateCollapsed: true,
            collapsed: true,
          }
        }, 
        {
          id: "as_bank",
          name: "Banque",
          field: "as_bank",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
          grouping: {
            getter: 'as_bank',
            formatter: (g) => `Banque: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_applied')
            ],
            aggregateCollapsed: true,
            collapsed: true,
            lazyTotalsCalculation:true,
          }
        }, 
        {
          id: "as_curr",
          name: "devise",
          field: "as_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          // filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
          grouping: {
            getter: 'as_curr',
            formatter: (g) => `Devise: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_applied')
            ],
            aggregateCollapsed: true,
            lazyTotalsCalculation:true,
            collapsed:true
          }
          
        }, 
       
        
        {
          id: "as_amt",
          name: "Montant",
          field: "as_amt",
          sortable: true,
          filterable: true,
          groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
          type: FieldType.float,
          filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
          
          
        },
       
        {
          id: "as_applied",
          name: "Montant payé",
          field: "as_applied",
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
          id: "as_due_date",
          name: "Date échéance",
          field: "as_due_date",
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
            getter: 'as_due_date',
            formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_applied')
            ],
            aggregateCollapsed: true,
            lazyTotalsCalculation:true,
            collapsed:true
          }
        },
        {
          id: "as_effdate",
          name: "Date effet",
          field: "as_effdate",
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
            getter: 'as_effdate',
            formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
            aggregators: [
              // (required), what aggregators (accumulator) to use and on which field to do so
             // new Aggregators.Avg('ld_qty_oh'),
              new Aggregators.Sum('as_applied')
            ],
            aggregateCollapsed: true,
            lazyTotalsCalculation:true,
            collapsed:true
          }
        },
        
        

    ]

    this.gridOptionsO14 = {
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
          onExtensionRegistered: (extension) => this.draggableGroupingPluginO14 = extension,
      
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
    this.datasetO14 = []
    
      this.accountshipperService
    .getBy({ })
    .subscribe(
      
        (response: any) => {this.datasetO14 = response.data
          console.log(this.datasetO14)
          this.dataviewO14.setItems(this.datasetO14)},
        
        (error) => {
            this.datasetO14 = []
        },
        () => {}
        
    )
    
    
    console.log(this.datasetO14)
}
onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFieldsO14) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsO14.forEach((g, i) => this.selectedGroupingFieldsO14[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }
  clearGroupingSelects() {
    this.selectedGroupingFieldsO14.forEach((g, i) => this.selectedGroupingFieldsO14[i] = '');
  }
  
  collapseAllGroups() {
    this.dataviewObjO14.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataviewObjO14.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPluginO14 && this.draggableGroupingPluginO14.setDroppedGroups) {
      this.draggableGroupingPluginO14.clearDroppedGroups();
    }
    this.gridObjO14.invalidate(); // invalidate all rows and re-render
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
  
    this.datasetO14 = []
    this.accountshipperService.getAll().subscribe( 
      
        (response: any) => {this.datasetO14 = response.data
          console.log(this.datasetO14)
          this.dataviewO14.setItems(this.datasetO14)},
        
        (error) => {
            this.datasetO14 = []
        },
        () => {}
        
    )
  
  }
  // FIN ONGLET 14
  angularGridReadyO15(angularGrid: AngularGridInstance) {
    this.angularGridO15 = angularGrid;
    this.gridO15 = angularGrid.slickGrid; // grid object
    this.dataviewO15 = angularGrid.dataView;
    this.gridServiceO15 = angularGrid.gridService;
  }
  
  prepareGridO15() {
    this.columnDefinitionsO15 = [
      {
        id: "pme_start_time",
        name: "Heure debut",
        field: "pme_start_time",
        type: FieldType.date,
        
        filterable:true,
        sortable: true,
        grouping: {
          getter: 'pme_start_Time',
          formatter: (g) => `Heure Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
      },
      {
        id: "chr04",
        name: "Jours",
        field: "chr04",
        sortable: true,
        minWidth: 70,
        maxWidth: 120,          
        type: FieldType.string,
        filterable:true,
        grouping: {
          getter: 'chr04',
          formatter: (g) => `Jours: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
    },
          {
              id: "pme_nbr",
              name: "Session",
              field: "pme_nbr",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
              grouping: {
                getter: 'pme_nbr',
                formatter: (g) => `Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('price')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
          },
          {
            id: "pme_duration",
            name: "Durée",
            field: "pme_duration",
            type: FieldType.integer,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_duration',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "pme_site",
            name: "formateur",
            field: "pme_site",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_site',
              formatter: (g) => `Formateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },         
          // {
          //   id: "pme_inst",
          //   name: "formation",
          //   field: "pme_inst",
          //   type: FieldType.string,
          //   sortable: true,
          //   filterable:true,
          //   grouping: {
          //     getter: 'pme_inst',
          //     formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [new Aggregators.Sum('price')],
          //     aggregateCollapsed: true,
              
          //     collapsed:true
          //   }
          // },     
              
          {
            id: "pme_task",
            name: "salle de formation",
            field: "pme_task",
            type: FieldType.string,
            sortable: true,
            grouping: {
              getter: 'pme_task',
              formatter: (g) => `Salle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
           
          },     
          {
            id: "pme_task_status",
            name: "statut",
            field: "pme_task_status",
            type: FieldType.string,
          
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_status',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },      
          {
            id: "pme_start_date",
            name: "Date debut",
            field: "pme_start_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_start_date',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          {
            id: "pme_end_date",
            name: "Date Fin",
            field: "pme_end_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_end_date',
              formatter: (g) => `Fin Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          
             
          
          
          
        
    
        ]
  
    this.gridOptionsO15 = {
     
      rowHeight: 40,
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
      enableAutoResize:true,
      autoHeight:false,
      enableCellNavigation: true,
      enableSorting: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      
      frozenBottom: true,
      enableFilterTrimWhiteSpace:true,
      
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } ,
      
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => this.onGroupChangedO9(args),
        onExtensionRegistered: (extension) => this.draggableGroupingPluginO15 = extension,
    
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
  
    this.affectEmpService.getByGlobal(
      {pme_inst:this.selecteditem}
      ).subscribe(
      (response: any) => {
        console.log(response.data)
        this.datasetO15= response.data
        console.log(this.datasetO15)
        
      
         this.dataviewO15.setItems(this.datasetO15)
         
      },
      (error) => {
          console.log(error)
          this.datasetO15=[]
      },
    )
  }
  onGroupChangedO15(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];
  
    if (Array.isArray(this.selectedGroupingFieldsO15) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsO15.forEach((g, i) => this.selectedGroupingFieldsO15[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelectsO15();
    }
  }
  clearGroupingSelectsO15() {
    this.selectedGroupingFieldsO15.forEach((g, i) => this.selectedGroupingFieldsO15[i] = '');
  }
  openDetO15(content) {
    this.prepareGrid1O15();
    this.modalService.open(content, { size: "lg" });
  }
  angularGridReady1O15(angularGrid: AngularGridInstance) {
    this.angularGrid1O15 = angularGrid;
    this.gridObj1O15 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid1O15() {
    this.columnDefinitions1O15 = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 10,
        sortable:true,
    },
      {
        id: "ptd_desc",
        name: "Désignation",
        field: "ptd_desc",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "ptd_gol",
        name: "Objectif",
        field: "ptd_gol",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
    ];
  
    this.gridOptions1O15 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
       autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
      // autoFitColumnsOnFirstLoad: true,
      // enableAutoSizeColumns:true,
    
     //enableAutoResizeColumnsByCellContent:true,
      
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadetO15 = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
  angularGridReadyO16(angularGrid: AngularGridInstance) {
    this.angularGridO16 = angularGrid;
    this.gridO16 = angularGrid.slickGrid; // grid object
    this.dataviewO16 = angularGrid.dataView;
    this.gridServiceO16 = angularGrid.gridService;
  }
  
  prepareGridO16() {
    this.columnDefinitionsO16 = [
      {
        id: "pme_start_time",
        name: "Heure debut",
        field: "pme_start_time",
        type: FieldType.date,
        
        filterable:true,
        sortable: true,
        grouping: {
          getter: 'pme_start_Time',
          formatter: (g) => `Heure Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
      },
      {
        id: "chr04",
        name: "Jours",
        field: "chr04",
        sortable: true,
        minWidth: 70,
        maxWidth: 120,          
        type: FieldType.string,
        filterable:true,
        grouping: {
          getter: 'chr04',
          formatter: (g) => `Jours: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
    },
          {
              id: "pme_nbr",
              name: "Session",
              field: "pme_nbr",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
              grouping: {
                getter: 'pme_nbr',
                formatter: (g) => `Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('price')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
          },
          {
            id: "pme_duration",
            name: "Durée",
            field: "pme_duration",
            type: FieldType.integer,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_duration',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "pme_site",
            name: "formateur",
            field: "pme_site",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_site',
              formatter: (g) => `Formateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },         
          {
            id: "pme_inst",
            name: "formation",
            field: "pme_inst",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_inst',
              formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },     
              
          {
            id: "pme_task",
            name: "salle de formation",
            field: "pme_task",
            type: FieldType.string,
            sortable: true,
            grouping: {
              getter: 'pme_task',
              formatter: (g) => `Salle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
           
          },     
          {
            id: "pme_task_status",
            name: "statut",
            field: "pme_task_status",
            type: FieldType.string,
          
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_status',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },      
          {
            id: "pme_start_date",
            name: "Date debut",
            field: "pme_start_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_start_date',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          {
            id: "pme_end_date",
            name: "Date Fin",
            field: "pme_end_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_end_date',
              formatter: (g) => `Fin Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          
      
          
        
    
        ]
  
    this.gridOptionsO16 = {
     
      rowHeight: 40,
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
      enableAutoResize:true,
      autoHeight:false,
      enableCellNavigation: true,
      enableSorting: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      
      frozenBottom: true,
      enableFilterTrimWhiteSpace:true,
      
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } ,
      
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => this.onGroupChangedO16(args),
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
  
    this.affectEmpService.getByGlobal(
      {pme_employe:this.selecteditem}
      ).subscribe(
      (response: any) => {
        console.log(response.data)
        this.datasetO16 = response.data
        console.log(this.datasetO16)
        
      
         this.dataviewO16.setItems(this.datasetO16)
         
      },
      (error) => {
          console.log(error)
          this.datasetO16=[]
      },
    )
  }
  onGroupChangedO16(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];
  
    if (Array.isArray(this.selectedGroupingFieldsO16) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsO16.forEach((g, i) => this.selectedGroupingFieldsO16[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelectsO16();
    }
  }
  clearGroupingSelectsO16() {
    this.selectedGroupingFieldsO16.forEach((g, i) => this.selectedGroupingFieldsO16[i] = '');
  }
  openDetO16(content) {
    this.prepareGrid1O16();
    this.modalService.open(content, { size: "lg" });
  }
  angularGridReady1O16(angularGrid: AngularGridInstance) {
    this.angularGrid1O16 = angularGrid;
    this.gridObj1O16 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid1O16() {
    this.columnDefinitions1O16 = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 10,
        sortable:true,
    },
      {
        id: "ptd_desc",
        name: "Désignation",
        field: "ptd_desc",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "ptd_gol",
        name: "Objectif",
        field: "ptd_gol",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
    ];
  
    this.gridOptions1O16 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
       autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
      // autoFitColumnsOnFirstLoad: true,
      // enableAutoSizeColumns:true,
    
     //enableAutoResizeColumnsByCellContent:true,
      
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadetO16 = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
  angularGridReadyO17(angularGrid: AngularGridInstance) {
    this.angularGridO17 = angularGrid;
    this.gridO17 = angularGrid.slickGrid; // grid object
    this.dataviewO17 = angularGrid.dataView;
    this.gridServiceO17 = angularGrid.gridService;
  }
  
  prepareGridO17() {
    this.columnDefinitionsO17 = [
      {
        id: "pme_start_time",
        name: "Heure debut",
        field: "pme_start_time",
        type: FieldType.date,
        
        filterable:true,
        sortable: true,
        grouping: {
          getter: 'pme_start_Time',
          formatter: (g) => `Heure Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
      },
      {
        id: "chr04",
        name: "Jours",
        field: "chr04",
        sortable: true,
        minWidth: 70,
        maxWidth: 120,          
        type: FieldType.string,
        filterable:true,
        grouping: {
          getter: 'chr04',
          formatter: (g) => `Jours: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
    },
          // {
          //     id: "pme_nbr",
          //     name: "Session",
          //     field: "pme_nbr",
          //     sortable: true,
          //     minWidth: 70,
          //     maxWidth: 120,          
          //     type: FieldType.string,
          //     filterable:true,
          //     grouping: {
          //       getter: 'pme_nbr',
          //       formatter: (g) => `Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //       aggregators: [new Aggregators.Sum('price')],
          //       aggregateCollapsed: true,
                
          //       collapsed:true
          //     }
          // },
          {
            id: "pme_duration",
            name: "Durée",
            field: "pme_duration",
            type: FieldType.integer,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_duration',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "pme_site",
            name: "formateur",
            field: "pme_site",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_site',
              formatter: (g) => `Formateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },         
          {
            id: "pme_inst",
            name: "formation",
            field: "pme_inst",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_inst',
              formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },     
              
          {
            id: "pme_task",
            name: "salle de formation",
            field: "pme_task",
            type: FieldType.string,
            sortable: true,
            grouping: {
              getter: 'pme_task',
              formatter: (g) => `Salle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
           
          },     
          {
            id: "pme_task_status",
            name: "statut",
            field: "pme_task_status",
            type: FieldType.string,
          
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_status',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },      
          {
            id: "pme_start_date",
            name: "Date debut",
            field: "pme_start_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_start_date',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          {
            id: "pme_end_date",
            name: "Date Fin",
            field: "pme_end_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_end_date',
              formatter: (g) => `Fin Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          
      
          
          
        
    
        ]
  
    this.gridOptionsO17 = {
     
      rowHeight: 40,
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
      enableAutoResize:true,
      autoHeight:false,
      enableCellNavigation: true,
      enableSorting: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      
      frozenBottom: true,
      enableFilterTrimWhiteSpace:true,
      
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } ,
      
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => this.onGroupChangedO17(args),
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
  
    this.affectEmpService.getByGlobal(
      {pme_nbr:this.selecteditem}
      ).subscribe(
      (response: any) => {
        console.log(response.data)
        this.datasetO17 = response.data
        console.log(this.datasetO17)
        
      
         this.dataviewO17.setItems(this.datasetO17)
         
      },
      (error) => {
          console.log(error)
          this.datasetO17=[]
      },
    )
  }
  onGroupChangedO17(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];
  
    if (Array.isArray(this.selectedGroupingFieldsO17) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsO17.forEach((g, i) => this.selectedGroupingFieldsO17[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelectsO17();
    }
  }
  clearGroupingSelectsO17() {
    this.selectedGroupingFieldsO17.forEach((g, i) => this.selectedGroupingFieldsO17[i] = '');
  }
  openDetO17(content) {
    this.prepareGrid1O17();
    this.modalService.open(content, { size: "lg" });
  }
  angularGridReady1O17(angularGrid: AngularGridInstance) {
    this.angularGrid1O17 = angularGrid;
    this.gridObj1O17 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid1O17() {
    this.columnDefinitions1O17 = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 10,
        sortable:true,
    },
      {
        id: "ptd_desc",
        name: "Désignation",
        field: "ptd_desc",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "ptd_gol",
        name: "Objectif",
        field: "ptd_gol",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
    ];
  
    this.gridOptions1O17 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
       autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
      // autoFitColumnsOnFirstLoad: true,
      // enableAutoSizeColumns:true,
    
     //enableAutoResizeColumnsByCellContent:true,
      
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadetO17 = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
  angularGridReadyO18(angularGrid: AngularGridInstance) {
    this.angularGridO18 = angularGrid;
    this.gridO18 = angularGrid.slickGrid; // grid object
    this.dataviewO18 = angularGrid.dataView;
    this.gridServiceO18 = angularGrid.gridService;
  }
  
  prepareGridO18() {
    this.columnDefinitionsO18 = [
      {
        id: "pme_start_time",
        name: "Heure debut",
        field: "pme_start_time",
        type: FieldType.date,
        
        filterable:true,
        sortable: true,
        grouping: {
          getter: 'pme_start_Time',
          formatter: (g) => `Heure Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
      },
      {
        id: "chr04",
        name: "Jours",
        field: "chr04",
        sortable: true,
        minWidth: 70,
        maxWidth: 120,          
        type: FieldType.string,
        filterable:true,
        grouping: {
          getter: 'chr04',
          formatter: (g) => `Jours: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
    },
          {
              id: "pme_nbr",
              name: "Session",
              field: "pme_nbr",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
              grouping: {
                getter: 'pme_nbr',
                formatter: (g) => `Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('price')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
          },
          {
            id: "pme_duration",
            name: "Durée",
            field: "pme_duration",
            type: FieldType.integer,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_duration',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          // {
          //   id: "pme_site",
          //   name: "formateur",
          //   field: "pme_site",
          //   type: FieldType.string,
          //   sortable: true,
          //   filterable:true,
          //   grouping: {
          //     getter: 'pme_site',
          //     formatter: (g) => `Formateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [new Aggregators.Sum('price')],
          //     aggregateCollapsed: true,
              
          //     collapsed:true
          //   }
          // },         
          {
            id: "pme_inst",
            name: "formation",
            field: "pme_inst",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_inst',
              formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },     
              
          {
            id: "pme_task",
            name: "salle de formation",
            field: "pme_task",
            type: FieldType.string,
            sortable: true,
            grouping: {
              getter: 'pme_task',
              formatter: (g) => `Salle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
           
          },     
          {
            id: "pme_task_status",
            name: "statut",
            field: "pme_task_status",
            type: FieldType.string,
          
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_status',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },      
          {
            id: "pme_start_date",
            name: "Date debut",
            field: "pme_start_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_start_date',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          {
            id: "pme_end_date",
            name: "Date Fin",
            field: "pme_end_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_end_date',
              formatter: (g) => `Fin Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          
      
          
        
    
        ]
  
    this.gridOptionsO18 = {
     
      rowHeight: 40,
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
      enableAutoResize:true,
      autoHeight:false,
      enableCellNavigation: true,
      enableSorting: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      
      frozenBottom: true,
      enableFilterTrimWhiteSpace:true,
      
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } ,
      
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => this.onGroupChangedO18(args),
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
  
    this.affectEmpService.getByGlobal(
      {pme_site:this.selecteditem}
      ).subscribe(
      (response: any) => {
        console.log(response.data)
        this.datasetO18 = response.data
        console.log(this.datasetO18)
        
      
         this.dataviewO18.setItems(this.datasetO18)
         
      },
      (error) => {
          console.log(error)
          this.datasetO18=[]
      },
    )
  }
  onGroupChangedO18(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];
  
    if (Array.isArray(this.selectedGroupingFieldsO18) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsO18.forEach((g, i) => this.selectedGroupingFieldsO18[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelectsO18();
    }
  }
  clearGroupingSelectsO18() {
    this.selectedGroupingFieldsO18.forEach((g, i) => this.selectedGroupingFieldsO18[i] = '');
  }
  openDetO18(content) {
    this.prepareGrid1O18();
    this.modalService.open(content, { size: "lg" });
  }
  angularGridReady1O18(angularGrid: AngularGridInstance) {
    this.angularGrid1O18 = angularGrid;
    this.gridObj1O18 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid1O18() {
    this.columnDefinitions1O18 = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 10,
        sortable:true,
    },
      {
        id: "ptd_desc",
        name: "Désignation",
        field: "ptd_desc",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "ptd_gol",
        name: "Objectif",
        field: "ptd_gol",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
    ];
  
    this.gridOptions1O18 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
       autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
      // autoFitColumnsOnFirstLoad: true,
      // enableAutoSizeColumns:true,
    
     //enableAutoResizeColumnsByCellContent:true,
      
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadetO18 = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
  angularGridReadyO19(angularGrid: AngularGridInstance) {
    this.angularGridO19 = angularGrid;
    this.gridO19 = angularGrid.slickGrid; // grid object
    this.dataviewO19 = angularGrid.dataView;
    this.gridServiceO19 = angularGrid.gridService;
  }
  
  prepareGridO19() {
    this.columnDefinitionsO19 = [
      {
        id: "pme_start_time",
        name: "Heure debut",
        field: "pme_start_time",
        type: FieldType.date,
        
        filterable:true,
        sortable: true,
        grouping: {
          getter: 'pme_start_Time',
          formatter: (g) => `Heure Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
      },
      {
        id: "chr04",
        name: "Jours",
        field: "chr04",
        sortable: true,
        minWidth: 70,
        maxWidth: 120,          
        type: FieldType.string,
        filterable:true,
        grouping: {
          getter: 'chr04',
          formatter: (g) => `Jours: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregators: [new Aggregators.Sum('price')],
          aggregateCollapsed: true,
          
          collapsed:true
        }
    },
          {
              id: "pme_nbr",
              name: "Session",
              field: "pme_nbr",
              sortable: true,
              minWidth: 70,
              maxWidth: 120,          
              type: FieldType.string,
              filterable:true,
              grouping: {
                getter: 'pme_nbr',
                formatter: (g) => `Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('price')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
          },
          {
            id: "pme_duration",
            name: "Durée",
            field: "pme_duration",
            type: FieldType.integer,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_duration',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "pme_site",
            name: "formateur",
            field: "pme_site",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_site',
              formatter: (g) => `Formateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },         
          {
            id: "pme_inst",
            name: "formation",
            field: "pme_inst",
            type: FieldType.string,
            sortable: true,
            filterable:true,
            grouping: {
              getter: 'pme_inst',
              formatter: (g) => `Formation: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },     
              
          // {
          //   id: "pme_task",
          //   name: "salle de formation",
          //   field: "pme_task",
          //   type: FieldType.string,
          //   sortable: true,
          //   grouping: {
          //     getter: 'pme_task',
          //     formatter: (g) => `Salle: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregators: [new Aggregators.Sum('price')],
          //     aggregateCollapsed: true,
              
          //     collapsed:true
          //   }
           
          // },     
          {
            id: "pme_task_status",
            name: "statut",
            field: "pme_task_status",
            type: FieldType.string,
          
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_status',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },      
          {
            id: "pme_start_date",
            name: "Date debut",
            field: "pme_start_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_start_date',
              formatter: (g) => `Debut Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          {
            id: "pme_end_date",
            name: "Date Fin",
            field: "pme_end_date",
            type: FieldType.date,
            
            filterable:true,
            sortable: true,
            grouping: {
              getter: 'pme_end_date',
              formatter: (g) => `Fin Session: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [new Aggregators.Sum('price')],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
          
      
        
    
        ]
  
    this.gridOptionsO19 = {
     
      rowHeight: 40,
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
      enableAutoResize:true,
      autoHeight:false,
      enableCellNavigation: true,
      enableSorting: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      
      frozenBottom: true,
      enableFilterTrimWhiteSpace:true,
      
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      } ,
      
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
        onGroupChanged: (e, args) => this.onGroupChangedO19(args),
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
  
    this.affectEmpService.getByGlobal(
      {pme_task:this.selecteditem}
      ).subscribe(
      (response: any) => {
        console.log(response.data)
        this.datasetO19 = response.data
        console.log(this.datasetO19)
        
      
         this.dataviewO19.setItems(this.datasetO19)
         
      },
      (error) => {
          console.log(error)
          this.datasetO19=[]
      },
    )
  }
  onGroupChangedO19(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];
  
    if (Array.isArray(this.selectedGroupingFieldsO19) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFieldsO19.forEach((g, i) => this.selectedGroupingFieldsO19[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelectsO19();
    }
  }
  clearGroupingSelectsO19() {
    this.selectedGroupingFieldsO19.forEach((g, i) => this.selectedGroupingFieldsO19[i] = '');
  }
  openDetO19(content) {
    this.prepareGrid1O19();
    this.modalService.open(content, { size: "lg" });
  }
  angularGridReady1O19(angularGrid: AngularGridInstance) {
    this.angularGrid1O19 = angularGrid;
    this.gridObj1O19 = (angularGrid && angularGrid.slickGrid) || {};
  }
  
  prepareGrid1O19() {
    this.columnDefinitions1O19 = [
      {
        id: "id",
        name: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        minWidth: 10,
        sortable:true,
    },
      {
        id: "ptd_desc",
        name: "Désignation",
        field: "ptd_desc",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "ptd_gol",
        name: "Objectif",
        field: "ptd_gol",
        sortable: true,
        minWidth: 50,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
        },
      },
      
    ];
  
    this.gridOptions1O19 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
       autoHeight: false,
      // frozenColumn: 0,
      // frozenBottom: true,
      // autoFitColumnsOnFirstLoad: true,
      // enableAutoSizeColumns:true,
    
     //enableAutoResizeColumnsByCellContent:true,
      
    };
    this.itemService.getByDetTr({ptd_part:this.item}).subscribe(
      (respo: any) => {this.datadetO19 = respo.data
        console.log(respo.data)
      })
    // fill the dataset with your data
  
    // this.codeService.getBy({ code_fldname: "pt_draw" }).subscribe((response: any) => (this.codes = response.data));
  }
}
