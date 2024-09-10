import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { saveAs } from "file-saver";
import {HttpClient} from '@angular/common/http';
// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, AngularGridInstance, EditorValidator, EditorArgs, GridService, Formatters, FieldType, OnEventArgs } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators, NgControlStatus } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ItemService, SiteService, BomService, BomPartService, WorkOrder, WorkOrderService, SequenceService, ProviderService, WorkRoutingService, AddressService, InventoryTransaction, InventoryTransactionService, LocationService, RequisitionService, CostSimulationService, LocationDetailService, InventoryStatusService, CodeService, printBc, MesureService, LabelService, Label, EmployeService, PrintersService } from "../../../../core/erp";
declare var Edelweiss: any;
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
@Component({
  selector: "kt-create-direct-wo",
  templateUrl: "./create-direct-wo.component.html",
  styleUrls: ["./create-direct-wo.component.scss"],
})
export class CreateDirectWoComponent implements OnInit {
  seuil:any;
  currentPrinter: string;
  PathPrinter: string;
  ipAddress:any;
  workOrder: WorkOrder;
  woForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  user: any;
  alertWarning: any;
  trdataset: any[];
  sites: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  part: any;
  gammes: [];
  columnDefinitionsgamme: Column[] = [];
  gridOptionsgamme: GridOption = {};
  gridObjgamme: any;
  angularGridgamme: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  boms: [];
  columnDefinitionsbom: Column[] = [];
  gridOptionsbom: GridOption = {};
  gridObjbom: any;
  angularGridbom: AngularGridInstance;
  provider:any;
  vends: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;

  emps: [];
  columnDefinitionsemp: Column[] = [];
  gridOptionsemp: GridOption = {};
  gridObjemp: any;
  angularGridemp: AngularGridInstance;
  dataViewemp: any;
  gridServiceemp: GridService;

  emps2: [];
  columnDefinitionsemp2: Column[] = [];
  gridOptionsemp2: GridOption = {};
  gridObjemp2: any;
  angularGridemp2: AngularGridInstance;
  dataViewemp2: any;
  gridServiceemp2: GridService;

  selectedIndexes: any[];
  selectedIndexes2: any[];
  
  seq: any;
  nof: any;
  nbpal: any;
  row_number;
  message = "";

  selectedField = "";
  fieldcode = "";
  sit: string;
  stat: String;
  expire;
  site: any;
  location: any;
  sct: any;

  trServer;
  trlot: string;
  datasetPrint = [];
  lddet: any;
  rqm: boolean;
  statusref: any;
  wolot: any;
  um: any;
  loc: any;
  rctwostat: any;
  ro_rollup: any[] = [];
  emp_shift: any[] = [];
  globalState: boolean = false;
  validate:boolean = true;
  product_colors: any[] = [];
  product_types: any[] = [];
  ok_types:boolean = false;
  prodqty:any;
  prodlot:any;
  color:any;
  type:any;
  shift: any;
  desc2: any;
  dataprinter: [];

  columnDefinitionsprinter: Column[] = [];

  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;
  angularGridprinter: AngularGridInstance;
  domain: any;
  domconfig: any;
  user1: any;
  user2: any;
  adduser: boolean = true;
  constructor(config: NgbDropdownConfig, private woFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private modalService: NgbModal, private layoutUtilsService: LayoutUtilsService, private siteService: SiteService, private providersService: ProviderService, private itemsService: ItemService, private sequenceService: SequenceService, private workOrderService: WorkOrderService, private workRoutingService: WorkRoutingService, private bomService: BomService, private bomPartService: BomPartService, private inventoryTransactionService: InventoryTransactionService, private sctService: CostSimulationService, private locationService: LocationService, private inventoryStatusService: InventoryStatusService, private mesureService: MesureService, private codeService: CodeService, private requisitionService: RequisitionService, private locationDetailService: LocationDetailService, private labelService: LabelService, private employeService: EmployeService,private addressService: AddressService, private printerService: PrintersService, private http: HttpClient) {
    config.autoClose = true;
    
    this.workRoutingService.getBy({ ro_rollup: true }).subscribe((response: any) => {
      console.log(response.date);
      this.ro_rollup = response.data;
    });
    this.codeService.getBy({ code_fldname: "emp_shift" }).subscribe((response: any) => (this.emp_shift = response.data));

    this.initGrid();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  initGrid() {
    this.columnDefinitions = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            let idpal;
            this.labelService.getBy({lb_cab: args.dataContext.tr_ref}).subscribe((res:any) =>{if (res.data != null) {idpal = res.data.id}})
            this.labelService.update({lb_actif : true},{id: idpal}).subscribe((res:any) =>{})
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
      // {
      //   id: "tr_part",
      //   name: "Article",
      //   field: "tr_part",
      //   sortable: true,
      //   width: 50,
      //   filterable: false,
      // },

      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 180,
        filterable: false,
      },

      {
        id: "break",
        name: "Couleur",
        field: "break",
        sortable: true,
        width: 100,
        filterable: false,
      },
      {
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
      },

      // {
      //     id: "tr_loc",
      //     name: "Empl",
      //     field: "tr_loc",
      //     sortable: true,
      //     width: 80,
      //     filterable: false,
      //     type: FieldType.string,

      // },
      {
        id: "tr_qty_loc",
        name: "QTE",
        field: "tr_qty_loc",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "tr_um",
        name: "UM",
        field: "tr_um",
        sortable: true,
        width: 80,
        filterable: false,
      },

      // {
      //   id: "tr_um_conv",
      //   name: "Conv UM",
      //   field: "tr_um_conv",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //  // editor: {
      //  //     model: Editors.float,
      //   //},

      // },

      // {
      //     id: "tr_price",
      //     name: "Prix unitaire",
      //     field: "tr_price",
      //     sortable: true,
      //     width: 80,
      //     filterable: false,
      //     //type: FieldType.float,
      //     formatter: Formatters.decimal,

      // },
      {
        id: "tr_serial",
        name: "N° serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
      },

      {
        id: "tr_ref",
        name: "BIG BAG",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
      },

      {
        id: "tr_status",
        name: "Status",
        field: "tr_status",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "tr_program",
        name: "Heure",
        field: "tr_program",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: true,
      autoHeight: false,
      formatterOptions: {
        // Defaults to false, option to display negative numbers wrapped in parentheses, example: -$12.50 becomes ($12.50)
        displayNegativeNumberWithParentheses: true,

        // Defaults to undefined, minimum number of decimals
        minDecimal: 2,

        // Defaults to empty string, thousand separator on a number. Example: 12345678 becomes 12,345,678
        thousandSeparator: " ", // can be any of ',' | '_' | ' ' | ''
      },
    };

    this.dataset = [];
  }

  //ISS-UNP qrt * -1 w ttna7a men ld_det
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);

    this.user = JSON.parse(localStorage.getItem("user"));
    this.currentPrinter = this.user.usrd_dft_printer;
    this.printerService.getByPrinter({ printer_code: this.currentPrinter }).subscribe(
      (reponse: any) => ((this.PathPrinter = reponse.data.printer_path), console.log(this.PathPrinter)),
      (error) => {
        this.message = "veuillez verifier la connexion";
        this.hasFormErrors = true;
        return;
      }
    );
    this.getProductColors();
    this.getProductTypes();
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.domain);

    this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
      (reponse: any) => {
        if (reponse.data != null) {
          console.log("hahahahahahahaha", reponse.data);
          this.domconfig = true;
        } else {
          this.domconfig = false;
        }
      },

      (error) => {
        this.domconfig = false;
      }
    );
    this.seuil = 1200;
    this.createForm();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.workOrder = new WorkOrder();
    const date = new Date();
    console.log(this.shift, "shiftcreate");
    this.woForm = this.woFB.group({
      wo_ord_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      wo_site: [this.workOrder.wo_site, Validators.required],
      wo_user1: [this.workOrder.wo_user1, Validators.required],
      wo_user2: [this.workOrder.wo_user2],
      adduser2:[false],
      wo_part: [{ value: this.workOrder.wo_part, disabled: true }, Validators.required],
      desc: [{ value: null, disabled: true }],

      wo_routing: [this.workOrder.wo_routing, Validators.required],
      ref: [{ value: null, disabled: true }],

      wo_qty_comp: [this.workOrder.wo_qty_comp],
      emp_shift: [this.shift],
      wo_serial: [this.workOrder.wo_serial],
      printer: [{ value: this.user.usrd_dft_printer, disabled: true }],
      product_type: ["", Validators.required],
      product_color: ["", Validators.required],
    });
    const controls = this.woForm.controls;
    controls.wo_site.setValue(this.user.usrd_site);
    this.user = JSON.parse(localStorage.getItem("user"));

    this.employeService.getBy({ emp_userid: this.user.usrd_code }).subscribe((respuser: any) => {
      this.shift = respuser.data[0].emp_shift;
      controls.emp_shift.setValue(this.shift);
      console.log("shift", this.shift);
    });
    this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
      (reponse: any) => {
        if (reponse.data != null) {
          controls.wo_routing.setValue(reponse.data.code_value), controls.wo_routing.disable();
          this.addressService.getBy({ ad_addr: reponse.data.code_value }).subscribe((response: any) => {
            //   const { data } = response;
               console.log("aaaaaaaaaaa",response.data);
               if (response.data != null) {
                 this.provider = response.data;
               }
             });
        }
      },
      (error) => {}
    );
  }
  //reste form
  reset() {
    this.globalState = true
    this.validate = false
    this.workOrder = new WorkOrder();
    this.createForm();
    // this.dataset = [];
    // this.trdataset = [];

    this.hasFormErrors = false;
  }

  onChangeCode() {
    const controls = this.woForm.controls;
    this.siteService
      .getByOne({
        si_site: controls.wo_site.value,
      })
      .subscribe((response: any) => {
        const { data } = response;
        if (!data) {
          this.message = "site n'existe pas";
          this.hasFormErrors = true;
          return;
          controls.wo_site.setValue("");
          document.getElementById("site").focus();
        }
      });
  }

  getProductColors() {
    
      this.codeService
      .getBy({
        code_fldname: "pt_break_cat",
      })
      .subscribe((response: any) => {
        const { data } = response;
        this.product_colors = data;
        if (!data) {
          this.message = "veuillez verifier la connexion";
          this.hasFormErrors = true;
          return;
          // controls.wo_site.setValue("");
        }
      });
  }

  getProductTypes() {
    this.codeService
      .getBy({
        code_fldname: "pt_draw",
      })
      .subscribe((response: any) => {
        const { data } = response;
        this.product_types = data;
        if (!data) {
          this.message = "veuillez verifier votre connexion";
          this.hasFormErrors = true;
          return;
          // controls.wo_site.setValue("");
        }
      });
  }

  searchProduct() {
    this.validate = true;
    this.globalState = false;
    const controls = this.woForm.controls;
    const date = new Date();
    controls.product_type.value;
    controls.product_color.value;
    this.color = controls.product_color.value;
    this.type = controls.product_type.value;
    this.itemsService
      .getBy({
        pt_draw: controls.product_type.value,
        pt_break_cat: controls.product_color.value,
        pt_dsgn_grp: "BROY",
        pt_drwg_loc: "INTERNE",
      })
      .subscribe((response: any) => {
        const { data } = response;
        if (data) {
          if (data.length == 0) {
            this.message = "Aucun produit n'existe avec le type et la couleur sélectionnés";
            this.hasFormErrors = true;
            return;
            
          } else {
            this.codeService.getBy({code_fldname:'LIMIT',code_value:data[0].pt_draw}).subscribe((coderesp:any)=>{this.seuil = Number(coderesp.data.code_cmmt)})
            console.log(data);
            controls.wo_part.setValue(data[0].pt_part);
            controls.desc.setValue(response.data[0].pt_desc1);
            this.desc2 = response.data[0].pt_desc2;
            controls.wo_serial.setValue(response.data[0].pt_part_type + response.data[0].pt_break_cat + date.getFullYear() + "." + Number(date.getMonth() + 1) + "." + date.getDate());
            this.um = response.data[0].pt_um;
            this.loc = response.data[0].pt_loc;
            if (response.data[0].pt_rctwo_active) {
              this.rctwostat = response.data[0].pt_rctwo_status;
            } else {
              this.locationService
                .getByOne({
                  loc_loc: this.loc,
                })
                .subscribe((resp: any) => {
                  console.log(resp.data, resp.data.length);
                  this.rctwostat = resp.data.loc_status;
                });
            }
          }
        }
      });
  }

  onSubmit() {
    
    
    const controls = this.woForm.controls;
    let tr = this.prepareTr();
    this.trdataset = [];
    this.prodqty = controls.wo_qty_comp.value
    this.prodlot = controls.wo_serial.value
    if (controls.wo_qty_comp.value == null || controls.wo_qty_comp.value <= 0 || controls.wo_qty_comp.value > this.seuil) {
      this.hasFormErrors = true;
      this.message = "la quantité est erronée";
      
      this.globalState = false;return;
    }
    if (this.dataset.length == 0) {
      this.hasFormErrors = true;
      this.message = "Verifier la liste des consomation";
      
      return;
    }
    let date = new Date(); 
     
    let tr_addr = controls.wo_routing.value
    let obj ={date,tr_addr}
    this.inventoryTransactionService.getByDateAddr(obj).subscribe(
      (res: any) => {
        
    console.log('nb pal', res.data.length + 1)
    this.nbpal = res.data.length + 1
    const _lb = new Label();
    _lb.lb__dec01 = res.data.length + 1
    _lb.lb_site = controls.wo_site.value;
    _lb.lb_loc = this.loc;
    _lb.lb_part = controls.wo_part.value; 
    _lb.lb_nbr = this.nof;
    _lb.lb_lot = controls.wo_serial.value;
    _lb.lb_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _lb.lb_qty = controls.wo_qty_comp.value;
    _lb.lb_ld_status = this.rctwostat;
    _lb.lb_desc = controls.desc.value;
    _lb.lb_grp = controls.emp_shift.value;
    _lb.lb_cust = controls.wo_routing.value;
    _lb.lb_addr = controls.wo_user1.value;
    // _lb.lb_rmks = controls.emp_shift.value
    // _lb.lb_tel  = this.address.ad_phone
    // _lb.int01   = this.product.int01
    // _lb.int02   = this.product.int02

    _lb.lb_printer = this.currentPrinter;

    let lab = null;

    this.labelService.add(_lb).subscribe(
      (reponse: any) => {
        lab = reponse.data;
       
      },
      (error) => {
        
        this.message = "veuillez verifier votre connexion";
                  this.hasFormErrors = true;
                  return;
      },
      () => {
        console.log("lab", lab);
        const timedate = new Date().toLocaleTimeString();
        this.trdataset.push({
          tr_line: 1,
          tr_part: controls.wo_part.value,
          tr_qty_loc: controls.wo_qty_comp.value,
          tr_um: this.um,
          tr_um_conv: 1,
          tr_price: 0,
          tr_site: controls.wo_site.value,
          tr_loc: this.loc,
          tr_serial: controls.wo_serial.value,
          tr_status: this.rctwostat,
          tr_expire: null,
          tr_ref: lab.lb_ref,
          tr_user1: controls.wo_user1.value,
          tr_program: timedate,
          
          tr_user2: controls.wo_user2.value,
        });
        console.log(this.trdataset);
        this.addTR(this.trdataset, tr);
        this.labelService.addblob(_lb).subscribe((blob) => {
          Edelweiss.print3(lab, this.currentPrinter);
        });
        
        //   this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_ref: lab.lb_ref})
      }
    );
    let wod = this.prepareWOD();
    this.addWod(this.dataset, wod);
    this.reset();
  })
  
      
    
   
   
  }

  prepareTr() {
    const controls = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = this.nof;
    _tr.tr_lot = this.wolot;
    _tr.tr_part = controls.wo_part.value;
    _tr.tr_user1 = controls.wo_user1.value,
    _tr.tr_user2 = controls.wo_user2.value,
    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _tr.tr_qty_loc = controls.wo_qty_comp.value;
    _tr.tr_serial = controls.wo_serial.value;
    _tr.tr_addr = controls.emp_shift.value;
    _tr.created_ip_adr = this.ipAddress;
    // _tr.tr_so_job = controls.tr_so_job.value

    // _tr.tr_rmks = controls.tr_rmks.value

    console.log("trtrtrtrtrt", _tr);
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
  addTR(detail: any, it) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);

    this.inventoryTransactionService.addRCTWO({ detail, it }).subscribe(
      (reponse: any) => console.log(reponse), 
      (error) => {this.loadingSubject.next(false);
        this.message = "la transaction n'a pas ete enregistré, veuillez verifier votre connexion";
                  this.hasFormErrors = true;
                  return;
        
      },
      () => {this.printpdf(this.nof),this.globalState = false; this.validate = true;
        this.dataset = []
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        //    console.log(this.provider, po, this.dataset);

        // this.router.navigateByUrl("/");
      }
    );
  }

  prepare() {
    const controls = this.woForm.controls;
    console.log("alllllllllllllllo");
    const _wo = new WorkOrder();
    _wo.wo_site = controls.wo_site.value;
    _wo.wo_user1 = this.user1;
    _wo.wo_user2 = this.user2;
    _wo.wo_part = controls.wo_part.value;
    _wo.wo_routing = controls.wo_routing.value;
    _wo.wo_ord_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_rel_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_due_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo__chr01 = controls.emp_shift.value;
    _wo.wo_type = 'BR';
    return _wo;
  }
  
  prepareWOD() {
    const controls = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = this.nof;
    _tr.tr_lot = this.wolot;
    _tr.tr_user1 = this.user1;
    _tr.tr_user2 = this.user2;
    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
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
  addWod(detail: any, it) {
    const controls = this.woForm.controls;

    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
      data.tr_site = controls.wo_site.value;
    }
    this.loadingSubject.next(true);

    this.inventoryTransactionService.addIssWo({ detail, it }).subscribe(
      (reponse: any) => console.log(reponse),
      (error) => {
        this.message = "veuillez verifier votre connexion";
                  this.hasFormErrors = true;
                  return;
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 500, false, false);
        this.loadingSubject.next(false);

      
      }
    );
  }

  addWo() {
    const controls = this.woForm.controls;
    this.hasFormErrors = false;
    /** check form */
    
    if (controls.wo_user1.value == null || controls.wo_user1.value == '') {this.message = "veuillez remplir la liste des employés";
      this.hasFormErrors = true;

      return;
      }
      else {if (controls.product_color.value == null || controls.product_color.value == '') {this.message = "veuillez choisir la couleur souhaité";
      this.hasFormErrors = true;

      return;
      }
            else {if (controls.product_type.value == null || controls.product_type.value == '') {this.message = "veuillez choisir le type de produit souhaité";
            this.hasFormErrors = true;

            return;
            }
            else {if (this.color != controls.product_color.value || this.type != controls.product_type.value){
              this.hasFormErrors = true;
              this.message = "veuillez relancer la recherche du produit";
           
              this.globalState = false;
              return;
            }}
                 }
           } 
    this.sequenceService.getByOne({ seq_type: "OF", seq_profile: this.user.usrd_profile }).subscribe((response: any) => {
      this.seq = response.data;

      if (this.seq) {
        this.nof = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val) + 1}`;

        this.sequenceService.update(this.seq.id, { seq_curr_val: Number(this.seq.seq_curr_val) + 1 }).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
            this.message = "Erreur modification Sequence";
            this.hasFormErrors = true;
            return;
          }
        );
        
        let wo = this.prepare();
        this.workOrderService.addDirect({ it: wo, nof: this.nof }).subscribe(
          (reponse: any) => (this.wolot = reponse.data),
          (error) => {
            this.message = "la création de l'OF n'a pas ete enregistrée, veuillez verifier votre connexion";
            this.hasFormErrors = true;
            return;
            
          },
          () => {
            this.validate = false;
            this.globalState = true
            this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 1000, false, false);
            controls.ref.enable();
            document.getElementById("ref").focus();
            this.loadingSubject.next(false);
}
        );
      }
    });
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

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // add new Item to Datatable
  addNewItem() {
    (this.part = null),
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          tr_line: this.dataset.length + 1,
          tr_part: null,
          cmvid: "",
          desc: null,
          tr_qty_loc: null,
          tr_loc: null,
          tr_um: null,
          tr_um_conv: 1,
          tr_price: null,
          cmvids: "",
          tr_ref: null,
          tr_serial: null,
          tr_status: null,
          tr_expire: null,
          tr_program: null,
        },
        { position: "bottom" }
      );
  }

  onchangePart() {
    const controls = this.woForm.controls;
    const date = new Date();
    this.itemsService
      .getProd({
        pt_part: controls.wo_part.value,
      })
      .subscribe((response: any) => {
        console.log(response.data, response.data.length);
        if (response.data.length == 0) {
          controls.wo_part.setValue("");
          controls.desc.setValue("");
          document.getElementById("part").focus();
          this.message = "code article n'exite pas";
            this.hasFormErrors = true;
            return;
          
        } else {
          this.codeService.getBy({code_fldname:'LIMIT',code_value:response.data.pt_draw}).subscribe((coderesp:any)=>{this.seuil = Number(coderesp.data.code_cmmt)})
          controls.desc.setValue(response.data[0].pt_desc1);
          this.desc2 = response.data[0].pt_desc2;
          controls.wo_serial.setValue(response.data[0].pt_part_type + response.data[0].pt_break_cat + date.getFullYear() + "." + Number(date.getMonth() + 1) + "." + date.getDate());
          this.um = response.data[0].pt_um;
          this.loc = response.data[0].pt_loc;
          if (response.data[0].pt_rctwo_active) {
            this.rctwostat = response.data[0].pt_rctwo_status;
          } else {
            this.locationService
              .getByOne({
                loc_loc: this.loc,
              })
              .subscribe((resp: any) => {
                console.log(resp.data, resp.data.length);
                this.rctwostat = resp.data.loc_status;
              });
          }
        }
      });
  }

  handleSelectedRowsChangedsite(e, args) {
    const controls = this.woForm.controls;
    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);

        controls.wo_site.setValue(item.si_site || "");
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
    if (this.user.usrd_site == "*") {
      this.siteService.getAll().subscribe((response: any) => (this.sites = response.data));
    } else {
      this.siteService.getBy({ si_site: this.user.usrd_site }).subscribe((response: any) => (this.sites = response.data));
    }
  }
  opensite(content) {
    this.prepareGridsite();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChanged4(e, args) {
    const controls = this.woForm.controls;
    const date = new Date();
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);

        controls.wo_part.setValue(item.pt_part);
        controls.desc.setValue(item.pt_desc1);
        this.desc2 = item.pt_desc2;
        controls.wo_serial.setValue(item.pt_part_type + item.pt_break_cat + date.getFullYear() + "." + Number(date.getMonth() + 1) + "." + date.getDate());
        this.codeService.getBy({code_fldname:'LIMIT',code_value:item.pt_draw}).subscribe((coderesp:any)=>{this.seuil = Number(coderesp.data.code_cmmt)})
        this.um = item.pt_um;
        this.loc = item.pt_loc;
        if (item.pt_rctwo_active) {
          this.rctwostat = item.pt_rctwo_status;
        } else {
          this.locationService
            .getByOne({
              loc_loc: this.loc,
            })
            .subscribe((resp: any) => {
              console.log(resp.data, resp.data.length);
              this.rctwostat = resp.data.loc_status;
            });
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

    this.itemsService.getProd({}).subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChangedvend(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjvend) {
      args.rows.map((idx) => {
        const item = this.gridObjvend.getDataItem(idx);

        updateItem.wo_vend = item.vd_addr;

        this.gridService.updateItem(updateItem);
      });
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
    this.providersService.getAll().subscribe((response: any) => (this.vends = response.data));
  }
  openvend(content) {
    this.prepareGridvend();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChangedgamme(e, args) {
    const controls = this.woForm.controls;
    if (Array.isArray(args.rows) && this.gridObjgamme) {
      args.rows.map((idx) => {
        const item = this.gridObjgamme.getDataItem(idx);
        console.log(item);
        controls.wo_routing.setValue(item.ro_routing || "");
        this.addressService.getBy({ ad_addr: item.ro_routing }).subscribe((response: any) => {
          //   const { data } = response;
             console.log("aaaaaaaaaaa",response.data);
             if (response.data != null) {
               this.provider = response.data;
             }
           });
      });
    }
  }

  angularGridReadygamme(angularGrid: AngularGridInstance) {
    this.angularGridgamme = angularGrid;
    this.gridObjgamme = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridgamme() {
    this.columnDefinitionsgamme = [
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
        id: "ro_routing",
        name: "Gamme",
        field: "ro_routing",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ro_desc",
        name: "Designation",
        field: "ro_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsgamme = {
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
    this.workRoutingService.getAllDistinct().subscribe((response: any) => (this.gammes = response.data));
  }
  opengamme(content) {
    this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
      (reponse: any) => {
        if (reponse.data == null) {
          this.prepareGridgamme();
          this.modalService.open(content, { size: "lg" });
        }
        console.log(reponse.data);
      },
      (error) => {
        this.prepareGridgamme();
        this.modalService.open(content, { size: "lg" });
      }
    );
  }

  handleSelectedRowsChangedbom(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjbom) {
      args.rows.map((idx) => {
        const item = this.gridObjbom.getDataItem(idx);

        updateItem.wo_bom_code = item.bom_parent;

        this.gridService.updateItem(updateItem);
      });
    }
  }

  angularGridReadybom(angularGrid: AngularGridInstance) {
    this.angularGridbom = angularGrid;
    this.gridObjbom = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridbom() {
    this.columnDefinitionsbom = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "ptb_bom",
        name: "code Nomen",
        field: "ptb_bom",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_desc",
        name: "Désignation",
        field: "Bom.bom_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_batch",
        name: "Batch",
        field: "Bom.bom_batch",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "bom_batch_um",
        name: "UM",
        field: "Bom.bom_batch_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptionsbom = {
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

    this.bomPartService.getBy({ ptb_part: this.part }).subscribe((response: any) => {
      console.log(response.data);
      this.boms = response.data;
    });
  }
  openbom(content) {
    this.prepareGridbom();
    this.modalService.open(content, { size: "lg" });
  }

  onChangeGamme() {
    const controls = this.woForm.controls;
    this.workRoutingService.getByOne({ ro_routing: controls.wo_routing.value }).subscribe((response: any) => {
      //   const { data } = response;
      console.log(response.data);
      if (response.data == null) {
         
        controls.wo_routing.setValue(null);
        document.getElementById("wo_routing").focus();
      }
    });
  }

  onChangePal() {
    /*kamel palette*/
    const controls = this.woForm.controls;
    const ref = controls.ref.value;
    const timedate = new Date().toLocaleTimeString();
    var bol = false;
    
    this.labelService.getBy({lb_cab: ref,lb_actif:false}).subscribe((res:any) =>{if (res.data != null) {bol = true}})
    
    for (let ob of this.dataset) {
      if (ob.tr_ref == ref) {
        console.log("hnehnahna");
        bol = true;
        break;
      }
    }
    if (!bol) {
      this.workOrderService.getByOne({ wo_nbr: this.nof }).subscribe((res: any) => {
        if (res.data.wo_status == "C" ){
          this.message = "Quantité pour cet OF est superieure à la quantité prévue";
            this.hasFormErrors = true;
            return;
            }
        else {
          this.locationDetailService.getByOneRef({ ld_ref: ref }).subscribe((response: any) => {
              this.lddet = response.data;
              //console.log(this.lddet.ld_qty_oh)
              if (this.lddet != null) {
                if (this.lddet.ld_site != controls.wo_site.value) {
                  this.message = "Palette N'existe pas dans Ce Site";
                  this.hasFormErrors = true;
                  return;
                  
                } else {
                  this.inventoryStatusService.getAllDetails({ isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat: any) => {
                    console.log(resstat);
                    const { data } = resstat;

                    if (data) {
                      this.stat = null;
                      this.message = "mouvement interdit dans cet emplacement";
                  this.hasFormErrors = true;
                  return;
                    } else {
                      this.stat = this.lddet.ld_status;

                      this.itemsService.getByOne({ pt_part: this.lddet.ld_part }).subscribe((respopart: any) => {
                        
                        this.labelService.getBy({ lb_ref: ref }).subscribe((respopal: any) => {
                          if (respopart.data.pt_draw != controls.product_type.value && respopal.data.label.lb__log01 != true && respopart.data.pt_draw != 'PERTE' ) {
                            this.codeService.getBy({code_fldname:controls.product_type.value,code_value:respopart.data.pt_draw}).subscribe((coderesp:any) => {if(coderesp.data!=null){this.ok_types = true}})
                            if(this.ok_types == false){
                            this.message = "type ne correspond pas au produit broyé";
                            this.hasFormErrors = true;
                            return}
                          } else { 
                            this.sctService.getByOne({ sct_site: controls.wo_site.value, sct_part: this.lddet.ld_part, sct_sim: "STD-CG" }).subscribe((respo: any) => {
                              this.sct = respo.data;
                              console.log(this.sct);

                              this.codeService.getBy({ code_fldname: controls.product_color.value, code_value: respopart.data.pt_break_cat }).subscribe((rescode: any) => {
                                console.log(rescode);
                                if (rescode.data.length > 0 || respopal.data.label.lb__log01 == true || respopart.data.pt_draw == 'PERTE') {
                                  this.labelService.update({lb_actif : false},{id: respopal.data.id}).subscribe((res:any) =>{console.log('update label')})
                                  this.gridService.addItem(
                                    {
                                      id: this.dataset.length + 1,
                                      tr_line: this.dataset.length + 1,
                                      tr_part: this.lddet.ld_part,
                                      break: respopart.data.pt_break_cat,
                                      cmvid: "",
                                      desc: respopart.data.pt_desc1,
                                      tr_qty_loc: this.lddet.ld_qty_oh,
                                      tr_loc: this.lddet.ld_loc,
                                      tr_um: respopart.data.pt_um,
                                      tr_um_conv: 1,
                                      tr_price: this.sct.sct_mtl_tl,
                                      cmvids: "",
                                      tr_ref: ref,
                                      tr_serial: this.lddet.ld_lot,
                                      tr_status: this.stat,
                                      tr_expire: this.lddet.ld_expire,
                                      tr_program: timedate,
                                    },
                                    { position: "bottom" }
                                  );
                                } else {
                                  this.message = "couleur ne correspond pas au produit broyé";
                                  this.hasFormErrors = true;
                                  return;
                                }
                              });
                            });
                          }
                        });
                      });
                    }
                  });
                }
              } else {
                this.message = "Palette N'existe pas dans Ce Site";
                  this.hasFormErrors = true;
                  return;
                //  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
              }
            });
          }
        })
    } else {
      this.message = "Palette déjà scanée";
      this.hasFormErrors = true;
      return;
    }
    controls.ref.setValue(null);
    document.getElementById("ref").focus();
  }
  handleSelectedRowsChangedprinter(e, args) {
    const controls = this.woForm.controls;

    if (Array.isArray(args.rows) && this.gridObjprinter) {
      args.rows.map((idx) => {
        const item = this.gridObjprinter.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        controls.printer.setValue(item.printer_code || "");
        this.currentPrinter = item.printer_code;
        this.PathPrinter = item.printer_path;
      });
    }
  }

  angularGridReadyprinter(angularGrid: AngularGridInstance) {
    this.angularGridprinter = angularGrid;
    this.gridObjprinter = (angularGrid && angularGrid.slickGrid) || {};
  }
  prepareGridprinter() {
    this.columnDefinitionsprinter = [
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

    this.gridOptionsprinter = {
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
    this.printerService.getBy({ usrd_code: this.user.usrd_code }).subscribe((response: any) => (this.dataprinter = response.data));
  }
  openprinter(contentprinter) {
    this.prepareGridprinter();
    this.modalService.open(contentprinter, { size: "lg" });
  }

  angularGridReadyemp(angularGrid: AngularGridInstance) {
    this.angularGridemp = angularGrid;
    this.gridObjemp = (angularGrid && angularGrid.slickGrid) || {};

    this.gridServiceemp = angularGrid.gridService;
    this.dataViewemp = angularGrid.dataView;
  }

  // GRID IN
  prepareGridemp() {
    this.columnDefinitionsemp = [
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

    this.gridOptionsemp = {
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
          gridRowIndexes: this.selectedIndexes2, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };

    // fill the dataset with your data
    this.employeService.getBy({emp_job:'BR'}).subscribe((response: any) => (this.emps = response.data));
  }

  handleSelectedRowsChangedemp(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }
  openemp(content) {
    this.prepareGridemp();
    this.modalService.open(content, { size: "lg" });
  }
  addit() {
    // this.itinerary.push({})
    const controls = this.woForm.controls;
    var l: String;
    l = "";
    console.log(l.length);
    this.selectedIndexes.forEach((index) => {
      if (index == 0) {
        l = this.emps[index]["emp_fname"];
      } else {
        l = l + "," + this.emps[index]["emp_fname"];
      }
      //id: index,
    });

    console.log(l);
    controls.wo_user1.setValue(l);
    this.user1 = l;
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
    // this.globalState=false
  }
  onChangeqty() {
    
    const controls = this.woForm.controls;
    const qty= Number(controls.wo_qty_comp.value)
    
    const timedate = new Date().toLocaleTimeString();
    
    var bol = false;
    
    if(controls.wo_qty_comp.value > this.seuil || controls.wo_qty_comp.value < 0){
      controls.wo_qty_comp.setValue(0)
      this.message = "la quantité que vous avez saisi est erroné";
    this.hasFormErrors = true;
    return;}
    
    
 
  }
  printpdf(nbr) {
    // const controls = this.totForm.controls
    const controls = this.woForm.controls;
    console.log("pdf");
    var doc = new jsPDF();
    
   
   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image()
    img.src = "./assets/media/logos/companylogo.png";
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
    doc.text("Rapport de broyage N° : " + nbr, 70, 45);
    doc.setFontSize(8);
    //console.log(this.provider.ad_misc2_id)
    doc.text("Machine           : " + this.provider.ad_addr, 20, 50);
    doc.text(" " + this.provider.ad_name, 60, 50);
    doc.text("Equipe            : " + this.shift, 120, 50);
    doc.text("Type produit      : " + this.type, 20, 55);
    doc.text("Employés          : " + this.user1, 120, 55);
    doc.text("Couleur Produit   : " + this.color, 20, 60);
    doc.text("Quantité sortie   : " + this.prodqty, 20, 65);
    doc.text("Lot N°            : " + this.prodlot, 20, 70);
    doc.text("N° BIGBAG         : " + this.nbpal, 20, 75);
  
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
    doc.text("N PAL", 172, 88.5);
    doc.line(185, 85, 185, 90);
    doc.text("Heure", 192, 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(6);
  //   let total = 0
  console.log(this.dataset)
    for (let j = 0; j < this.dataset.length  ; j++) {
      // total = total + Number(this.dataset[j].tr_price) * Number(this.dataset[j].tr_qty_loc)
      
      if ((j % 30 == 0) && (j != 0) ) {
  doc.addPage();
        img.src = "./assets/media/logos/companylogo.png";
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
    doc.text("Rapport de broyage N° : " + nbr, 70, 40);
    doc.text("**SUITE** " + nbr, 70, 45);
    doc.setFontSize(8);
    //console.log(this.provider.ad_misc2_id)
    doc.text("Machine           : " + this.provider.ad_addr, 20, 50);
    doc.text(" " + this.provider.ad_name, 60, 50);
    doc.text("Equipe            : " + this.shift, 120, 50);
    doc.text("Type produit      : " + this.type, 20, 55);
    doc.text("Employés          : " + this.user1, 120, 55);
    doc.text("Couleur Produit   : " + this.color, 20, 60);
    doc.text("Quantité sortie   : " + this.prodqty, 20, 65);
    doc.text("Lot N°            : " + this.prodlot, 20, 70);
    doc.text("N° BIGBAG         : " + this.nbpal, 20, 75);
  
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
        doc.line(150, 85, 150, 90);
        doc.text("Lot/Série", 152, 88.5);
        doc.line(170, 85, 170, 90);
        doc.text("N° pal", 172, 88.5);
        doc.line(185, 85, 185, 90);
        doc.text("Heure", 192, 88.5);
        doc.line(200, 85, 200, 90);
        i = 95;
        doc.setFontSize(6);
      }
  
      if (this.dataset[j].desc.length > 35) {
        let desc1 = this.dataset[j].desc.substring(35);
        let ind = desc1.indexOf(" ");
        desc1 = this.dataset[j].desc.substring(0, 35 + ind);
        let desc2 = this.dataset[j].desc.substring(35 + ind);
  
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc.toFixed(2))), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, );
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, );
        doc.line(185, i - 5, 185, i);
        doc.text(String(this.dataset[j].tr_program), 203, i - 1, );
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
        doc.line(170, i - 5, 170, i);
        doc.line(185, i - 5, 185, i);
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 200, i);
  
        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.dataset[j].desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String(this.dataset[j].tr_program), 203, i - 1, { align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 205, i);
        i = i + 5;
      }
    }
  
    
  
    doc.line(130, i + 7, 205, i + 7);
    doc.line(130, i + 14, 205, i + 14);
    doc.line(130, i + 7, 130, i + 14);
    doc.line(160, i + 7, 160, i + 14);
    doc.line(205, i + 7, 205, i + 14);
    doc.setFontSize(10);
  
   
    doc.setFontSize(8);
 
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
  angularGridReadyemp2(angularGrid: AngularGridInstance) {
    this.angularGridemp2 = angularGrid;
    this.gridObjemp2 = (angularGrid && angularGrid.slickGrid) || {};
  
    this.gridServiceemp2 = angularGrid.gridService;
    this.dataViewemp2 = angularGrid.dataView;
  }
  
  // GRID IN
  prepareGridemp2() {
    this.columnDefinitionsemp2 = [
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
  
    this.gridOptionsemp2 = {
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
          gridRowIndexes: this.selectedIndexes2, // (recommended) select by your data object IDs
          //dataContextIds
        },
      },
    };
  
    // fill the dataset with your data
    
    if (this.adduser == false){this.employeService.getBy({}).subscribe((response: any) => (this.emps2 = response.data));}
    else{this.employeService.getBy({emp_job:'NONE'}).subscribe((response: any) => (this.emps2 = response.data));}
  }
  
  handleSelectedRowsChangedemp2(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }
  openemp2(content) {
    this.prepareGridemp2();
    this.modalService.open(content, { size: "lg" });
  }
  addit2() {
    // this.itinerary.push({})
    const controls = this.woForm.controls;
    var l2: String;
    l2 = "";
    console.log(l2.length);
    this.selectedIndexes.forEach((index) => {
      if (index == 0) {
        l2 = this.emps2[index]["emp_fname"];
      } else {
        l2 = l2 + "," + this.emps2[index]["emp_fname"];
      }
      //id: index,
    });
  
    console.log(l2);
    controls.wo_user2.setValue(l2);
    this.user2 = l2;
  }
  onChangeuser() {
    const controls = this.woForm.controls;
    
    if(controls.adduser2.value == true){this.adduser = false}
    else {this.adduser = true,controls.wo_user2.setValue(null); this.emps2=[]}
  }
}
