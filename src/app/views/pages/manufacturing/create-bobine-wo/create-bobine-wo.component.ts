import { Component, OnInit } from '@angular/core';

import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { saveAs } from "file-saver";
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
import { ItemService, SiteService, BomService, BomPartService, WorkOrder, WorkOrderService, SequenceService, ProviderService, WorkRoutingService, AddressService, InventoryTransaction, InventoryTransactionService, LocationService, RequisitionService, CostSimulationService, LocationDetailService, InventoryStatusService, CodeService, printBc, MesureService, LabelService, SaleOrderService,Label, EmployeService, PrintersService } from "../../../../core/erp";
import date from 'src/assets/plugins/formvalidation/src/js/validators/date';
declare var Edelweiss2: any;
@Component({
  selector: 'kt-create-bobine-wo',
  templateUrl: './create-bobine-wo.component.html',
  styleUrls: ['./create-bobine-wo.component.scss']
})
export class CreateBobineWoComponent implements OnInit {
  currentPrinter: string;
  PathPrinter: string;
  printbuttonState: boolean = false;
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
  angularGridsq: AngularGridInstance;
  gridsq: any;
  gridServicesq: GridService;
  dataViewsq: any; 
  columnDefinitionssq: Column[];
  gridOptionssq: GridOption;
  sqdataset: any[];
  user: any;
  alertWarning: any;
  trdataset: any[];
  sites: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  part: any;
  gamme: any;
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
  
  wos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  boms: [];
  columnDefinitionsbom: Column[] = [];
  gridOptionsbom: GridOption = {};
  gridObjbom: any;
  angularGridbom: AngularGridInstance;

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
  selectedIndexes: any[];
  selectedIndexes2: any[];
  index: any;
  woServer;
  umd;
  qtycart;
  uniquelot; 
  product: any;
  address: any;

  seq: any;
  nof: any;
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
  globalState: boolean = true;
  product_colors: any[] = [];
  product_types: any[] = [];
  product_qualitys: any[] = [];
  product_Cyls: any[] = [];
  
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
 

 






  constructor(config: NgbDropdownConfig, private woFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private modalService: NgbModal, private layoutUtilsService: LayoutUtilsService, private siteService: SiteService, private providersService: ProviderService, private itemsService: ItemService, private sequenceService: SequenceService, private workOrderService: WorkOrderService, private workRoutingService: WorkRoutingService, private bomService: BomService, private bomPartService: BomPartService, private inventoryTransactionService: InventoryTransactionService, private sctService: CostSimulationService, private locationService: LocationService, private inventoryStatusService: InventoryStatusService, private mesureService: MesureService, private codeService: CodeService, private requisitionService: RequisitionService, private locationDetailService: LocationDetailService, private labelService: LabelService, private saleOrderService: SaleOrderService,private employeService: EmployeService, private addressService: AddressService,private printerService: PrintersService) {
    config.autoClose = true;
    this.workRoutingService.getBy({ ro_rollup: true }).subscribe((response: any) => {
      console.log(response.date);
      this.ro_rollup = response.data;
    });
    this.codeService.getBy({ code_fldname: "emp_shift" }).subscribe((response: any) => (this.emp_shift = response.data));

    this.initGrid();
    this.initGridsq();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }
  gridReadysq(angularGrid: AngularGridInstance) {
    this.angularGridsq = angularGrid;
    this.dataViewsq = angularGrid.dataView;
    this.gridsq = angularGrid.slickGrid;
    this.gridServicesq = angularGrid.gridService;
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
          console.log(args.dataContext.tr_ref)
          if (args.dataContext.tr_ref != null && args.dataContext.tr_ref != '' ){this.message = "vous ne pouvez pas supprimer cette ligne";
          this.hasFormErrors = true;
          return;}
          else {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            const controls = this.woForm.controls;
            let new_total = controls.total_bobine.value - args.dataContext.tr_qty_loc
            controls.total_bobine.setValue(new_total)
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }}
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
      },

      {
        id: "tr_desc",
        name: "Description",
        field: "tr_desc",
        sortable: true,
        width: 180,
        filterable: false,
      },

      {
        id: "tr__chr02",
        name: "Couleur",
        field: "tr__chr02",
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
        id: "tr_effdate",
        name: "date",
        field: "tr_effdate",
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
        id: "tr_ref",
        name: "BIG BAG",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
      },

      // {
      //   id: "tr_status",
      //   name: "Status",
      //   field: "tr_status",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      // },
      {
        id: "tr_program",
        name: "Heure",
        field: "tr_program",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "id",
        field: "id",
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
          this.printbuttonState = true;
          // if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //   this.angularGrid.gridService.deleteItem(args.dataContext);
          // }
          if (args.dataContext.tr_part != null && args.dataContext.tr_qty_loc != null && args.dataContext.tr_loc != null && args.dataContext.tr_site != null && (args.dataContext.tr_ref == null || args.dataContext.tr_ref == "")) {
            const controls = this.woForm.controls;
            this.printbuttonState = true;
            const _lb = new Label();
            (_lb.lb__dec01 = args.dataContext.tr_line), (_lb.lb_site = args.dataContext.tr_site);
            // _lb.lb_rmks = controls.tr_rmks.value;
            _lb.lb_loc = args.dataContext.tr_loc;
            _lb.lb_part = args.dataContext.tr_part;
            _lb.lb_nbr = args.dataContext.tr_so_job; //this.trnbr
            _lb.lb_lot = args.dataContext.tr_serial;
            _lb.lb_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
            _lb.lb_qty = args.dataContext.tr_qty_loc;
            _lb.lb_um = args.dataContext.tr_um;
            _lb.lb_ld_status = args.dataContext.tr_status;
            _lb.lb_desc = args.dataContext.tr_desc;
            _lb.lb_printer = this.PathPrinter;
            _lb.lb_grp = controls.emp_shift.value;
            _lb.lb_cust = controls.wo_routing.value;
            _lb.lb_addr = controls.wo_user1.value;
            _lb.lb_rmks = controls.product_Cyl.value;
            let lab = null;
            console.log(_lb);
            // console.log(10 * 100.02)
            this.labelService.add(_lb).subscribe(
              (reponse: any) => {
                lab = reponse.data;
                this.labelService.addblob(_lb).subscribe((blob) => {
                  Edelweiss2.print3(lab);
                });
              },
              (error) => {
                this.message = "veuillez verifier votre connexion";
                  this.hasFormErrors = true;
                  return;
              },
              () => {
                this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: lab.lb_ref, qty: args.dataContext.tr_qty_loc });
                //console.log("id", args.dataContext.id)
                //console.log("dataset",this.dataset[args.dataContext.id])
                this.index = this.dataset.findIndex((el) => {
                  return el.tr_line == args.dataContext.id;
                });
                console.log(this.index);
                this.globalState = true;
                const controls = this.woForm.controls;
                const _tr = new InventoryTransaction();
                _tr.tr_nbr = controls.wo_nbr.value;
                _tr.tr_lot = controls.wo_lot.value;
                _tr.tr_part = args.dataContext.tr_part;
            
                _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
                _tr.tr_qty_loc = args.dataContext.tr_qty_loc;
                _tr.tr_serial = args.dataContext.tr_serial;
                _tr.tr_program = args.dataContext.tr_program;
                _tr.tr_user2 = controls.emp_shift.value;
                this.trdataset = [];
            
                if (args.dataContext.tr_qty_loc == null || args.dataContext.tr_qty_loc == 0) {
                  this.hasFormErrors = true;
                  this.message = "Verifier la Quantité";
                  
            
                  return;
                }
                if (this.dataset.length == 0) {
                  this.hasFormErrors = true;
                  this.message = "Verifier la liste des bobines";
            
                  return;
                }
                if (args.dataContext.tr_serial == null || args.dataContext.tr_serial == '') {
                  this.hasFormErrors = true;
                  this.message = "veuillez remplir le N° de lot";
                
            
                  return;
                }
                this.trdataset.push({
                  tr_line: 1,
                  tr_part: controls.wo_part.value,
                  tr_qty_loc: args.dataContext.tr_qty_loc,
                  tr_effdate:controls.wo_ord_date.value,
                  tr_um: this.um,
                  tr_um_conv: 1,
                  tr_price: 0,
                  tr_site: controls.wo_site.value,
                  tr_loc: this.loc,
                  tr_serial: args.dataContext.tr_serial,
                  tr_status: this.rctwostat,
                  tr_expire: null,
                  tr_ref: lab.lb_ref,
                  tr_user1: controls.wo_user1.value,
                });
                console.log(this.trdataset);
                this.addTR(this.trdataset, _tr);
              }
            );
          } else {
            this.message = "etiquette déjà imprimée";
                  this.hasFormErrors = true;
                  return;
          }
        },
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
  initGridsq() {
    this.columnDefinitionssq = [
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            console.log(args.dataContext.tr_ref)
          if (args.dataContext.tr_ref != null && args.dataContext.tr_ref != '' ){this.message = "vous ne pouvez pas supprimer cette ligne";
          this.hasFormErrors = true;
          return;}
          else {
          if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
            const controls = this.woForm.controls;
            this.angularGridsq.gridService.deleteItem(args.dataContext);
          }}
           
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
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          if (args.dataContext.tr_ref != null) {
            this.message = "modification interdite";
                  this.hasFormErrors = true;
                  return;
          } else {
            console.log(args.dataContext.tr_part);
            this.itemsService.getByOne({ pt_part: args.dataContext.tr_part }).subscribe((resp: any) => {
              if (resp.data) {
                this.locationService.getByOne({ loc_loc: resp.data.pt_loc, loc_site: resp.data.pt_site }).subscribe((response: any) => {
                  this.location = response.data;

                  this.inventoryStatusService.getAllDetails({ isd_status: this.location.loc_status, isd_tr_type: "RCT-UNP" }).subscribe((resstat: any) => {
                    console.log(resstat);
                    const { data } = resstat;

                    if (data) {
                      this.stat = null;
                    } else {
                      this.stat = this.location.loc_status;
                    }
                    this.gridServicesq.updateItemById(args.dataContext.id, { ...args.dataContext, desc: resp.data.pt_desc1, tr_site: resp.data.pt_site, tr_loc: resp.data.pt_loc, tr_um: resp.data.pt_um, tr_um_conv: 1, tr_status: this.stat, tr_price: 0 });
                  });
                });
              } else {
                
                this.gridServicesq.updateItemById(args.dataContext.id, { ...args.dataContext, tr_part: null });
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
            this.message = "modification interdite";
                  this.hasFormErrors = true;
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
        width: 180,
        filterable: false,
      },

      {
        id: "tr__chr02",
        name: "Couleur",
        field: "tr__chr02",
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
        id: "tr_effdate",
        name: "Date",
        field: "tr_effdate",
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
        id: "tr_ref",
        name: "BIG BAG",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
      },

      // {
      //   id: "tr_status",
      //   name: "Status",
      //   field: "tr_status",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      // },
      {
        id: "tr_program",
        name: "Heure",
        field: "tr_program",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
      },
      {
        id: "sqid",
        field: "sqid",
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
          this.printbuttonState = true;
          // if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //   this.angularGrid.gridService.deleteItem(args.dataContext);
          // }
          if (args.dataContext.tr_part != null && args.dataContext.tr_qty_loc != null && args.dataContext.tr_loc != null && args.dataContext.tr_site != null && (args.dataContext.tr_ref == null || args.dataContext.tr_ref == "")) {
            const controls = this.woForm.controls;
            this.printbuttonState = true;
            const _lb = new Label();
            (_lb.lb__dec01 = args.dataContext.tr_line), (_lb.lb_site = args.dataContext.tr_site);
            // _lb.lb_rmks = controls.tr_rmks.value;
            _lb.lb_loc = args.dataContext.tr_loc;
            _lb.lb_part = args.dataContext.tr_part;
            _lb.lb_nbr = args.dataContext.tr_so_job; //this.trnbr
            _lb.lb_lot = args.dataContext.tr_serial;
            _lb.lb_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
            _lb.lb_qty = args.dataContext.tr_qty_loc;
            _lb.lb_um = args.dataContext.tr_um;
            _lb.lb_ld_status = args.dataContext.tr_status;
            _lb.lb_desc = args.dataContext.tr_desc;
            _lb.lb_printer = this.PathPrinter;
            _lb.lb_grp = controls.emp_shift.value;
            _lb.lb_cust = controls.wo_routing.value;
            _lb.lb_addr = controls.wo_user1.value;
            
            let lab = null;
            console.log(_lb);
            // console.log(10 * 100.02)
            this.labelService.add(_lb).subscribe(
              (reponse: any) => {
                lab = reponse.data;
                this.labelService.addblob(_lb).subscribe((blob) => {
                  Edelweiss2.print3(lab);
                });
              },
              (error) => {
             
              },
              () => {
                this.gridServicesq.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: lab.lb_ref, qty: args.dataContext.tr_qty_loc });
                //console.log("id", args.dataContext.id)
                //console.log("dataset",this.dataset[args.dataContext.id])
                this.index = this.dataset.findIndex((el) => {
                  return el.tr_line == args.dataContext.id;
                });
                console.log(this.index);
                this.globalState = true;
                const controls = this.woForm.controls;
                const _tr = new InventoryTransaction();
                _tr.tr_nbr = controls.wo_nbr.value;
                _tr.tr_lot = controls.wo_lot.value;
                _tr.tr_part = args.dataContext.tr_part;
            
                _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
                _tr.tr_qty_loc = args.dataContext.tr_qty_loc;
                _tr.tr_serial = args.dataContext.tr_serial;
                _tr.tr_program = args.dataContext.tr_program;
                _tr.tr_user2 = controls.emp_shift.value;
                this.trdataset = [];
            
                if (args.dataContext.tr_qty_loc == null || args.dataContext.tr_qty_loc == 0) {
                  this.hasFormErrors = true;
                  this.message = "Verifier la Quantité";
                
            
                  return;
                }
                if (args.dataContext.tr_serial == null || args.dataContext.tr_serial == '') {
                  this.hasFormErrors = true;
                  this.message = "Veuillez remplir le N° de lot";
                
            
                  return;
                }
                if (this.dataset.length == 0) {
                  this.hasFormErrors = true;
                  this.message = "Verifier la liste des bobines";
            
                  return;
                }
                this.trdataset.push({
                  tr_line: 1,
                  tr_part: args.dataContext.tr_part,
                  tr_qty_loc: args.dataContext.tr_qty_loc,
                  tr_effdate: controls.wo_ord_date.value,
                  tr_um: this.um,
                  tr_um_conv: 1,
                  tr_price: 0,
                  tr_site: controls.wo_site.value,
                  tr_loc: this.loc,
                  tr_serial: args.dataContext.tr_serial,
                  tr_status: this.rctwostat,
                  tr_expire: null,
                  tr_ref: lab.lb_ref,
                  tr_user1: controls.wo_user1.value,
                });
                console.log(this.trdataset);
                this.addSQ(this.trdataset, _tr);

              }
            );
          } else {
            this.message = "etiquette déjà imprimée";
                  this.hasFormErrors = true;
                  return;
          }
        },
      },
    ];

    this.gridOptionssq = {
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

    this.sqdataset = [];
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
        this.message = "veuillez verifier votre connexion";
                  this.hasFormErrors = true;
                  return;
      }
    );
    this.getProductColors();
    this.getProductTypes();
    this.getProductquality();
    this.getProductcyl()
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
      wo_lot:[this.workOrder.wo_lot,],
      wo_nbr:[this.workOrder.wo_nbr,],
      wo_part: [{ value: this.workOrder.wo_part, disabled: true }, Validators.required],
      desc: [{ value: null, disabled: true }],

      wo_routing: [this.workOrder.wo_routing, Validators.required],
      ref: [{ value: null, disabled: true }],
      wo_qty_ord: [{ value: 0 },this.workOrder.wo_qty_ord],
      total_bobine:  [{disabled: true}],
      total_squelette:  [{disabled: true}],
      wo_qty_comp: [{ value: 0 },this.workOrder.wo_qty_comp],
      wo_qty_rjct: [{ value: 0 },this.workOrder.wo_qty_rjct],
      emp_shift: [this.shift],
      wo_serial: [this.workOrder.wo_serial],
      printer: [{ value: this.user.usrd_dft_printer, disabled: true }],
      product_type: ["", Validators.required],
      product_color: ["", Validators.required],
      product_quality: ["", Validators.required],
      product_Cyl: ["", Validators.required],
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
          this.gamme = reponse.data.code_value;
        }
      },
      (error) => {}
    );
  }
  onChangeOA() {
    this.dataset = [];
    this.sqdataset = [];
    const controls = this.woForm.controls;
    const id = controls.wo_lot.value;

    this.workOrderService.getByOne({ id }).subscribe((res: any) => {
      if (res.data.wo_status == "R" && res.data.wo_routing == controls.wo_routing.value) {
        this.woServer = res.data;
        
        controls.wo_lot.setValue(this.woServer.id);
        controls.wo_nbr.setValue(this.woServer.wo_nbr);
        controls.wo_part.setValue(this.woServer.wo_part);
        controls.wo_qty_ord.setValue(this.woServer.wo_qty_ord);
        controls.total_bobine.setValue(this.woServer.wo_qty_comp);
        controls.total_squelette.setValue(this.woServer.wo_qty_rjct);
        controls.desc.setValue(this.woServer.item.pt_desc1);
        controls.product_type.setValue(this.woServer.item.pt_article);
        controls.product_color.setValue(this.woServer.item.pt_break_cat);
        controls.product_quality.setValue(this.woServer.item.pt_rev);
        controls.product_Cyl.setValue(this.woServer.item.pt_group);

        
        this.product = this.woServer.item;
        this.umd = this.woServer.item.pt_um;
        this.qtycart = this.woServer.item.int03 != null ? this.woServer.item.int03 : 0;
        this.uniquelot = this.woServer.item.pt_lot_ser;
        this.site = this.woServer.item.pt_site;
        this.loc = this.woServer.item.pt_loc;
        if (this.woServer.item.pt_rctwo_active) {
          this.rctwostat = this.woServer.item.pt_rctwo_status;
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

        if (this.woServer.wo_so_job != null && this.woServer.wo_so_job != "") {
          this.saleOrderService.getBy({ so_nbr: this.woServer.wo_so_job }).subscribe((res: any) => {
            console.log(res.data);
            if (res.data.saleOrder != null) {
              this.addressService.getBy({ ad_addr: res.data.saleOrder.so_cust }).subscribe((resaddr: any) => {
                console.log(resaddr.data);
                this.address = resaddr.data;
              });
            }
          });
        } else {
          this.addressService.getBy({ ad_addr: "1000" }).subscribe((resaddr: any) => {
            console.log(resaddr.data);
            this.address = resaddr.data;
          });
        }
        
        this.sctService.getByOne({ sct_site: this.site, sct_part: this.woServer.wo_part, sct_sim: "STD-CG" }).subscribe((resp: any) => {
          this.sct = resp.data;
          console.log(this.sct);
        }),
        this.globalState=true;

        //remplir les grids
        controls.wo_nbr.value
        console.log('remplir grid' ,controls.wo_nbr.value)
        this.inventoryTransactionService.getBy({tr_domain: this.domain,tr_type:'RCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
          (res: any) => {        
          this.dataset  = res.data;
          for (let item of this.dataset){
          this.gridService.addItem(
            {
              id: this.dataset.length + 1,
              tr_line: this.dataset.length + 1,
              tr_part: item.tr_part,
              cmvid: "",
              tr_desc: item.tr_desc,
              tr__chr02:item.tr__chr02,
              tr_qty_loc: item.tr_qty_loc,
              tr_loc: item.tr_loc,
              tr_effdate: item.tr_effdate,
              tr_um:item.tr_um,
              tr_um_conv: 1,
              tr_price: item.tr_price,
              cmvids: "",
              tr_ref: item.tr_ref,
              tr_serial: item.tr_serial,
              tr_status: item.tr_status,
              tr_expire: item.tr_expire,
              tr_program: item.tr_program,
            },
            { position: "bottom" }
            
          )}},)
          console.log('remplir grid' ,controls.wo_nbr.value)
        this.inventoryTransactionService.getBy({tr_domain: this.domain,tr_type:'RJCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
          (res: any) => {        
          this.sqdataset  = res.data;
          for (let itemsq of this.sqdataset){
          this.gridServicesq.addItem(
            {
              id: this.dataset.length + 1,
              tr_line: this.dataset.length + 1,
              tr_part: itemsq.tr_part,
              cmvid: "",
              tr_desc: itemsq.tr_desc,
              tr__chr02:itemsq.tr__chr02,
              tr_qty_loc: itemsq.tr_qty_loc,
              tr_loc: itemsq.tr_loc,
              tr_effdate: itemsq.tr_effdate,
              tr_um:itemsq.tr_um,
              tr_um_conv: 1,
              tr_price: itemsq.tr_price,
              cmvids: "",
              tr_ref: itemsq.tr_ref,
              tr_serial: itemsq.tr_serial,
              tr_status: itemsq.tr_status,
              tr_expire: itemsq.tr_expire,
              tr_program: itemsq.tr_program,
            },
            { position: "bottom" }
            
          )}
         
      })
     
      } else {
        controls.wo_lot.setValue(null);
        document.getElementById("id").focus();
        this.message = "OF n'existe pas ou n'est pas lancé";
                  this.hasFormErrors = true;
                  return;
       
        
      }
    });
  }

  //reste form
  reset() {
    this.workOrder = new WorkOrder();
    this.createForm();
    this.dataset = [];
    this.sqdataset = [];

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
         
          // controls.wo_site.setValue("");
        }
      });
  }

  getProductTypes() {
    this.codeService
      .getBy({
        code_fldname: "pt_article",
      })
      .subscribe((response: any) => {
        const { data } = response;
        this.product_types = data;
        if (!data) {
         
          // controls.wo_site.setValue("");
        }
      });
  }
  getProductquality() {
    this.codeService
      .getBy({
        code_fldname: "pt_rev",
      })
      .subscribe((response: any) => {
        const { data } = response;
        this.product_qualitys = data;
        if (!data) {
       
          // controls.wo_site.setValue("");
        }
      });
  }
  getProductcyl() {
    this.codeService
      .getBy({
        code_fldname: "pt_group", code_desc: "cyl"
      })
      .subscribe((response: any) => {
        const { data } = response;
        this.product_Cyls = data;
        if (!data) {
    
          // controls.wo_site.setValue("");
        }
      });
  }

  searchProduct() {
    this.globalState = false;
    const controls = this.woForm.controls;
    const date = new Date();
    controls.product_quality.value;
    controls.product_type.value;
    controls.product_color.value;
    controls.product_Cyl.value;
    
    
    this.itemsService
      .getBy({
        pt_article: controls.product_type.value,
        pt_break_cat: controls.product_color.value,
        pt_draw: "BOBINE",
        pt_rev: controls.product_quality.value,
        pt_group:controls.product_Cyl.value,
      })
      .subscribe((response: any) => {
        const { data } = response;
        console.log('recherche article',response);
        if (data) { 
          if (data.length == 0) {
            this.message = "veuillez verifier votre configuration";
                  this.hasFormErrors = true;
                  return;
          } else {
            
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

  // onSubmit() {
  //  
  //   this.globalState = true;
  //   const controls = this.woForm.controls;
  //   let tr = this.prepareTr();
  //   this.trdataset = [];

  //   if (controls.wo_qty_comp.value == null || controls.wo_qty_comp.value == 0) {
  //     this.hasFormErrors = true;
  //     this.message = "Verifier la Quantité";
  //    

  //     return;
  //   }
  //   if (this.dataset.length == 0) {
  //     this.hasFormErrors = true;
  //     this.message = "Verifier la liste des consomation";

  //     return;
  //   }

  //   const _lb = new Label();
  //   _lb.lb_site = controls.wo_site.value;
  //   _lb.lb_loc = this.loc;
  //   _lb.lb_part = controls.wo_part.value;
  //   _lb.lb_nbr = this.nof;
  //   _lb.lb_lot = controls.wo_serial.value;
  //   _lb.lb_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
  //   _lb.lb_qty = controls.wo_qty_comp.value;
  //   _lb.lb_ld_status = this.rctwostat;
  //   _lb.lb_desc = this.desc2;
  //   _lb.lb_grp = controls.emp_shift.value;
  //   _lb.lb_cust = controls.wo_routing.value;
  //   _lb.lb_addr = controls.wo_user1.value;
  //   // _lb.lb_rmks = controls.emp_shift.value
  //   // _lb.lb_tel  = this.address.ad_phone
  //   // _lb.int01   = this.product.int01
  //   // _lb.int02   = this.product.int02

  //   _lb.lb_printer = this.currentPrinter;

  //   let lab = null;

  //   this.labelService.add(_lb).subscribe(
  //     (reponse: any) => {
  //       lab = reponse.data;
  //       this.labelService.addblob(_lb).subscribe((blob) => {
  //         Edelweiss.print3(lab, this.currentPrinter);
  //       });
  //     },
  //     (error) => {
  //      
  //     },
  //     () => {
  //       console.log("lab", lab);

  //       this.trdataset.push({
  //         tr_line: 1,
  //         tr_part: controls.wo_part.value,
  //         tr_qty_loc: controls.wo_qty_comp.value,
  //         tr_um: this.um,
  //         tr_um_conv: 1,
  //         tr_price: 0,
  //         tr_site: controls.wo_site.value,
  //         tr_loc: this.loc,
  //         tr_serial: controls.wo_serial.value,
  //         tr_status: this.rctwostat,
  //         tr_expire: null,
  //         tr_ref: lab.lb_ref,
  //         tr_user1: controls.wo_user1.value,
  //       });
  //       console.log(this.trdataset);
  //       this.addTR(this.trdataset, tr);

  //       //   this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_ref: lab.lb_ref})
  //     }
  //   );
  //   let wod = this.prepareWOD();
  //   this.addWod(this.dataset, wod);
  //   this.reset();
  // }

  prepareTr() {
    const controls = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = controls.wo_nbr.value;
    _tr.tr_lot = controls.wo_lot.value;
    _tr.tr_part = controls.wo_part.value;

    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _tr.tr_qty_loc = controls.wo_qty_comp.value;
    _tr.tr_serial = controls.wo_serial.value;
    _tr.tr_user2 = controls.emp_shift.value;
    // _tr.tr_so_job = controls.tr_so_job.value

    // _tr.tr_rmks = controls.tr_rmks.value

    console.log("trtrtrtrtrt", _tr);
    return _tr;
  }
  prepareTrsq() {
    const controls = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = controls.wo_nbr.value;
    _tr.tr_lot = controls.wo_lot.value;
    _tr.tr_part = controls.wo_part.value;

    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _tr.tr_qty_loc = controls.wo_qty_rjct.value;
    _tr.tr_serial = controls.wo_serial.value;
    _tr.tr_user2 = controls.emp_shift.value;
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
      (error) => {
        this.message = "veuillez verifier votre connexion";
        this.hasFormErrors = true;
        return;
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        //    console.log(this.provider, po, this.dataset);

        // this.router.navigateByUrl("/");
      }
    );
  }
  addSQ(detail: any, it) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);

    this.inventoryTransactionService.addRJCTWO({ detail, it }).subscribe(
      (reponse: any) => console.log(reponse),
      (error) => {
        this.message = "veuillez verifier votre connexion";
                  this.hasFormErrors = true;
                  return;
        this.loadingSubject.next(false);
      },
      () => {
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
    _wo.wo_part = controls.wo_part.value;
    _wo.wo_routing = controls.wo_routing.value;
    _wo.wo_qty_ord = controls.wo_qty_ord.value;
    _wo.wo_ord_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_rel_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_due_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo__chr01 = controls.emp_shift.value;
    return _wo;
  }
  // save data
  //   onSubmit() {
  //     this.hasFormErrors = false;
  //     const controls = this.woForm.controls;
  //     /** check form */
  //     if (this.woForm.invalid) {
  //       Object.keys(controls).forEach((controlName) =>
  //         controls[controlName].markAsTouched()
  //       );
  //       this.message = "Modifiez quelques éléments et réessayez de soumettre.";
  //       this.hasFormErrors = true;

  //       return;
  //     }

  //     if (!this.dataset.length) {
  //       this.message = "La liste des article ne peut pas etre vide";
  //       this.hasFormErrors = true;

  //       return;
  //     }
  //     for (var i = 0; i < this.dataset.length; i++) {

  //      if (this.dataset[i].wo_part == "" || this.dataset[i].wo_part == null  ) {
  //       this.message = "L' article ne peut pas etre vide";
  //       this.hasFormErrors = true;
  //       return;

  //      }
  //     }
  //      for (var i = 0; i < this.dataset.length; i++) {

  //      if (this.dataset[i].wo_qty_ord == 0 || this.dataset[i].wo_qty_ord == null  ) {
  //       this.message = "Quantité ne peut pas etre 0";
  //       this.hasFormErrors = true;
  //       return;

  //      }
  //     }
  //      for (var i = 0; i < this.dataset.length; i++) {

  //      if (this.dataset[i].wo_rel_date == "" || this.dataset[i].wo_rel_date == null  ) {
  //       this.message = "Date de lancement ne peut pas etre vide";
  //       this.hasFormErrors = true;
  //       return;
  //      }
  //      }

  //      for (var i = 0; i < this.dataset.length; i++) {

  //      if (this.dataset[i].wo_due_date == "" || this.dataset[i].wo_due_date == null  ) {
  //       this.message = "Date Echeance ne peut pas etre vide";
  //       this.hasFormErrors = true;
  //       return;

  //      }
  //     }
  //     for (var i = 0; i < this.dataset.length; i++) {

  //       if (this.dataset[i].wo_bom_code == "" || this.dataset[i].wo_bom_code == null  ) {
  //        this.message = "Code Nomenclature ne peut pas etre vide";
  //        this.hasFormErrors = true;
  //        return;
  //       }
  //       }

  //     this.sequenceService.getByOne({ seq_type: "OF", seq_profile: this.user.usrd_profile }).subscribe(
  //       (response: any) => {
  //     this.seq = response.data

  //         if (this.seq) {
  //          this.nof = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`

  //          this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
  //           (reponse) => console.log("response", Response),
  //           (error) => {
  //             this.message = "Erreur modification Sequence";
  //             this.hasFormErrors = true;
  //             return;

  //           },
  //           )

  //     let wo = this.prepare()
  //     this.addIt( this.dataset,wo, this.nof);

  //   }else {
  //     this.message = "Parametrage Manquant pour la sequence";
  //     this.hasFormErrors = true;
  //     return;

  //    }

  // })

  //     // tslint:disable-next-line:prefer-const

  //   }

  prepareWOD() {
    const controls = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = this.nof;
    _tr.tr_lot = this.wolot;

    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    //_tr.tr_site = controls.wo_site.value
    // _tr.tr_so_job = controls.tr_so_job.value

    // _tr.tr_rmks = controls.tr_rmks.value

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

        //    console.log(this.provider, po, this.dataset);
        //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);

        //    this.router.navigateByUrl("/");
      }
    );
  }

  addWo() {
    const controls = this.woForm.controls;
    this.hasFormErrors = false;
    /** check form */
    if (this.woForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
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
            this.message = "veuillez verifier votre connexion";
                  this.hasFormErrors = true;
                  return;;
            this.loadingSubject.next(false);
          },
          () => {
            this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 1000, false, false);
            controls.ref.enable();
            controls.wo_nbr.setValue(this.nof),
            document.getElementById("ref").focus();
            this.loadingSubject.next(false);

            //    console.log(this.provider, po, this.dataset);
            //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
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
    const controls = this.woForm.controls;
    (this.part = null),
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          tr_line: this.dataset.length + 1,
          tr_part: null,
          cmvid: "",
          tr_desc: null,
          tr__chr02: "",
          tr_qty_loc: null,
          tr_loc: null,
          tr_effdate: controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null,
          tr_um:null,
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
        } else {
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
    
  }}
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
        this.gamme = item.ro_routing
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
      this.gamme = controls.wo_routing.value;
      if (response.data == null) {
        
        controls.wo_routing.setValue(null);
        document.getElementById("wo_routing").focus();
      }
    });
  }

  onChangePal() {
    /*kamel palette*/
    const controls = this.woForm.controls;
    const qty= Number(controls.wo_qty_comp.value)
    
    const timedate = new Date().toLocaleTimeString();
    console.log(timedate);
    var bol = false;
    this.workOrderService.getByOne({ wo_nbr: controls.wo_nbr.value }).subscribe((res: any) => {
      if (res.data.wo_status == "C" ){this.message = "vous avez atteint la quantité prevue";
      this.hasFormErrors = true;
      return;}
    else {this.itemsService.getByOne({pt_part: controls.wo_part.value  }).subscribe(
      (respopart: any) => {
        console.log(respopart)
  
     this.sctService.getByOne({ sct_site: controls.wo_site.value, sct_part: controls.wo_part.value, sct_sim: 'STD-CG' }).subscribe(
      (respo: any) => {
        this.sct = respo.data
        console.log(this.sct)
    
  
     this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        tr_line: this.dataset.length + 1,
        tr_part: controls.wo_part.value,
        tr__chr02:respopart.data.pt_break_cat,
        cmvid: "",
        tr_desc: controls.desc.value,
        // qty_oh: this.lddet.ld_qty_oh,
        tr_qty_loc: qty,
        tr_site: controls.wo_site.value,
        tr_loc: respopart.data.pt_loc,
        tr_effdate: controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}-${controls.wo_ord_date.value.month}-${controls.wo_ord_date.value.day}` : null,
        tr_um:respopart.data.pt_um,
        tr_um_conv:1,
        tr_price: this.sct.sct_mtl_tl,
        cmvids: "",
        tr_ref: null,
        tr_serial: "",
        tr_program: timedate,
        // tr_status: this.stat,
        
      },
      { position: "bottom" },
      
    );
    const TOTAL = Number(controls.total_bobine.value) + Number(controls.wo_qty_comp.value)
    controls.total_bobine.setValue(TOTAL)
    controls.wo_qty_comp.setValue(0);
    
     });
    }); 
  }})
    
 
  }
  onChangeSq() {
    /*kamel palette*/
    const controls = this.woForm.controls;
    const sqqty= Number(controls.wo_qty_rjct.value)
    const timedate = new Date().toLocaleTimeString();
    console.log(timedate);
    var bol = false;
    this.itemsService.getByOne({pt_draw:'SQUELETTE', pt_dsgn_grp:'N/BROY',pt_break_cat: controls.product_color.value  }).subscribe(
      (respopart: any) => {
        console.log(respopart)
  
     this.sctService.getByOne({ sct_site: controls.wo_site.value, sct_part: respopart.data.pt_part, sct_sim: 'STD-CG' }).subscribe(
      (respo: any) => {
        this.sct = respo.data
        console.log(this.sct)
    
  
     this.gridServicesq.addItem(
      {
        id: this.sqdataset.length + 1,
        tr_line: this.sqdataset.length + 1,
        tr_part: respopart.data.pt_part,
        tr__chr02:respopart.data.pt_break_cat,
        cmvid: "",
        tr_desc: respopart.data.pt_desc1,
        // qty_oh: this.lddet.ld_qty_oh,
        tr_qty_loc: sqqty,
        tr_site: controls.wo_site.value,
        tr_loc: respopart.data.pt_loc,
        tr_effdate: controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null,
        tr_um:respopart.data.pt_um,
        tr_um_conv:1,
        tr_price: this.sct.sct_mtl_tl,
        cmvids: "",
        tr_ref: null,
        tr_serial: "",
        tr_program: timedate,
        // tr_status: this.stat,
        
      },
      { position: "bottom" },
      
    );
    controls.wo_qty_rjct.setValue(0);
  
     });
    }); 
  
 
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
    this.employeService.getAll().subscribe((response: any) => (this.emps = response.data));
  }

  handleSelectedRowsChangedemp(e, args) {
    this.selectedIndexes = [];
    this.selectedIndexes = args.rows;
  }
  openemp(content) {
    this.prepareGridemp();
    this.modalService.open(content, { size: "lg" });
  }
 
  angularGridReady5(angularGrid: AngularGridInstance) {
    this.angularGrid5 = angularGrid;
    this.gridObj5 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid5() {
    this.columnDefinitions5 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "wo_nbr",
        name: "N° OF",
        field: "wo_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_ord_date",
        name: "Date",
        field: "wo_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "wo_part",
        name: "Article",
        field: "wo_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_status",
        name: "status",
        field: "wo_status",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_routing",
        name: "status",
        field: "wo_routing",
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
    console.log(this.gamme)
    this.workOrderService.getBy({ wo_status: "R", wo_routing: this.gamme }).subscribe((response: any) => {
      // console.log(response.data)
      this.wos = response.data;
    });
  }
  handleSelectedRowsChanged5(e, args) {
    const controls = this.woForm.controls;

    this.dataset = [];

    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.wo_lot.setValue(item.id || "");

        controls.wo_nbr.setValue(item.wo_nbr);
        controls.wo_part.setValue(item.wo_part);
        // controls.tr_so_job.setValue(item.wo_so_job);
        controls.desc.setValue(item.item.pt_desc1);
        controls.product_type.setValue(item.item.pt_article);
        controls.product_color.setValue(item.item.pt_break_cat);
        controls.product_quality.setValue(item.item.pt_rev);
        controls.total_bobine.setValue(item.wo_qty_comp);
        controls.wo_qty_ord.setValue(item.wo_qty_ord)
        controls.product_Cyl.setValue(item.item.pt_group)
        
        //remplir les grids
        controls.wo_nbr.value
        console.log('remplir grid' ,controls.wo_nbr.value)
        this.inventoryTransactionService.getBy({tr_domain: this.domain,tr_type:'RCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
          (res: any) => {        
          this.dataset  = res.data;
          for (let item of this.dataset){
          this.gridService.addItem(
            {
              id: this.dataset.length + 1,
              tr_line: this.dataset.length + 1,
              tr_part: item.tr_part,
              cmvid: "",
              tr_desc: item.tr_desc,
              tr__chr02:item.tr__chr02,
              tr_qty_loc: item.tr_qty_loc,
              tr_loc: item.tr_loc,
              tr_effdate: item.tr_effdate,
              tr_um:item.tr_um,
              tr_um_conv: 1,
              tr_price: item.tr_price,
              cmvids: "",
              tr_ref: item.tr_ref,
              tr_serial: item.tr_serial,
              tr_status: item.tr_status,
              tr_expire: item.tr_expire,
              tr_program: item.tr_program,
            },
            { position: "bottom" }
            
          )}})
          console.log('remplir grid' ,controls.wo_nbr.value)
        this.inventoryTransactionService.getBy({tr_domain: this.domain,tr_type:'RJCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
          (res: any) => {        
          this.sqdataset  = res.data;
          for (let itemsq of this.sqdataset){
          this.gridServicesq.addItem(
            {
              id: this.dataset.length + 1,
              tr_line: this.dataset.length + 1,
              tr_part: itemsq.tr_part,
              cmvid: "",
              tr_desc: itemsq.tr_desc,
              tr__chr02:itemsq.tr__chr02,
              tr_qty_loc: itemsq.tr_qty_loc,
              tr_loc: itemsq.tr_loc,
              tr_effdate: itemsq.tr_effdate,
              tr_um:itemsq.tr_um,
              tr_um_conv: 1,
              tr_price: itemsq.tr_price,
              cmvids: "",
              tr_ref: itemsq.tr_ref,
              tr_serial: itemsq.tr_serial,
              tr_status: itemsq.tr_status,
              tr_expire: itemsq.tr_expire,
              tr_program: itemsq.tr_program,
            },
            { position: "bottom" }
            
          )}
          })
        
        this.product = item.item;
        this.umd = item.item.pt_um;
        this.qtycart = item.item.int03 != null ? item.item.int03 : 0;
        this.uniquelot = item.item.pt_lot_ser;
        this.site = item.item.pt_site;
        this.loc = item.item.pt_loc;
        this.globalState=true;
        console.log("item.item.pt_loc", item.item.pt_loc);
        if (item.item.pt_rctwo_active) {
          this.rctwostat = item.item.pt_rctwo_status;
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

        console.log(this.site);
        this.sctService.getByOne({ sct_site: this.site, sct_part: item.wo_part, sct_sim: "STD-CG" }).subscribe((resp: any) => {
          this.sct = resp.data;
          console.log("sct", this.sct);
        });
      });
    }
    // if (controls.tr_so_job.value != null && controls.tr_so_job.value != "") {
    //   this.saleOrderService.getBy({ so_nbr: controls.tr_so_job.value }).subscribe((res: any) => {
    //     console.log(res.data);
    //     if (res.data.saleOrder != null) {
    //       this.addressService.getBy({ ad_addr: res.data.saleOrder.so_cust }).subscribe((resaddr: any) => {
    //         console.log(resaddr.data);
    //         this.address = resaddr.data;
    //       });
    //     }
    //   });
    // } else {
    //   this.addressService.getBy({ ad_addr: "1000" }).subscribe((resaddr: any) => {
    //     console.log(resaddr.data);
    //     this.address = resaddr.data;
    //   });
    // }
   
  }

   open5(content) {
    this.prepareGrid5();
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
        l = this.emps[index]["emp_addr"];
      } else {
        l = l + "," + this.emps[index]["emp_addr"];
      }
      //id: index,
    });

    console.log(l);
    controls.wo_user1.setValue(l);
    this.user1 = l;
  }
}
