import { Component, OnInit } from '@angular/core';

import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
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
declare var Edelweiss3: any;
declare var Edelweiss2: any;
declare var Edelweiss: any;
@Component({  
  selector: 'kt-create-bobine-wo',
  templateUrl: './create-bobine-wo.component.html',
  styleUrls: ['./create-bobine-wo.component.scss']
})
export class CreateBobineWoComponent implements OnInit {
  seuil : any;
  currentPrinter: string;
  PathPrinter: string;
  printbuttonState: boolean = false;
  workOrder: WorkOrder;
  woForm: FormGroup;
  MANDRINS: any[] = [];
  MANDRIN :any;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  printable:boolean;
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
  program:any;
  ordre:any;
  part: any;
  gamme: any;
  gammes: [];
  columnDefinitionsgamme: Column[] = [];
  gridOptionsgamme: GridOption = {};
  gridObjgamme: any;
  angularGridgamme: AngularGridInstance;
autorisation:boolean;
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

  emps2: [];
  columnDefinitionsemp2: Column[] = [];
  gridOptionsemp2: GridOption = {};
  gridObjemp2: any;
  angularGridemp2: AngularGridInstance;
  dataViewemp2: any;
  gridServiceemp2: GridService;
  
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
  
  produit:any;
  color:any;
  miclaise:any;
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

 
  docs: any[] = [];
  exist:any;





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
            let new_rest  = controls.rest_bobine.value + args.dataContext.tr_qty_loc
            controls.total_bobine.setValue(new_total)
            controls.rest_bobine.setValue(new_rest)
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
      // {
      //   id: "tr_part",
      //   name: "Article",
      //   field: "tr_part",
      //   sortable: true,
      //   width: 50,
      //   filterable: false,
      // },

      {
        id: "tr_desc",
        name: "Description",
        field: "tr_desc",
        sortable: true,
        minWidth: 150,
        filterable: false,
      },

      
      {
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        minWidth: 80,
        filterable: false,
        editor: {
                  model: Editors.text,
                  required: true,
                 
        
                },
      },

     
      {
        id: "tr_qty_loc",
        name: "QTE",
        field: "tr_qty_loc",
        sortable: true,
        minWidth: 80,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "printid",
        field: "printid",
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
          if(this.printable == true && args.dataContext.printed != true){
          this.itemsService.getByOne({pt_part:args.dataContext.tr_part }).subscribe( 
            (reponse: any) => {this.produit = reponse.data.pt_draw + ' ' + reponse.data.pt_part_type + ' QUALITE ' + reponse.data.pt_rev
                              this.miclaise = reponse.data.pt_article
                              this.color = reponse.data.pt_break_cat
                              if (args.dataContext.tr_part != null && args.dataContext.tr_qty_loc != null && args.dataContext.tr_loc != null && args.dataContext.tr_site != null && (args.dataContext.tr_ref == null || args.dataContext.tr_ref == "")) {
                                const controls = this.woForm.controls;
                                this.printbuttonState = true;
                                this.printable = false;
                                const _lb = new Label();
                                (_lb.lb__dec01 = args.dataContext.tr_line), (_lb.lb_site = args.dataContext.tr_site);
                                // _lb.lb_rmks = controls.tr_rmks.value;
                                _lb.lb_loc = args.dataContext.tr_loc;
                                _lb.lb_part = args.dataContext.tr_part;
                                _lb.lb_nbr = this.program + '-' + this.ordre; //this.trnbr
                                _lb.lb_lot = args.dataContext.tr_serial;
                                _lb.lb_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
                                _lb.lb_qty = args.dataContext.tr_qty_loc;
                                _lb.lb_um = args.dataContext.tr_um;
                                _lb.lb_ld_status = args.dataContext.tr_status;
                                _lb.lb_desc = this.produit;
                                _lb.lb_type = this.miclaise;
                                _lb.lb_ray = this.color; 
                                _lb.lb_rmks = controls.product_Cyl.value;
                                _lb.lb_printer = this.PathPrinter;
                                _lb.lb_grp = controls.emp_shift.value;
                                _lb.lb_cust = controls.wo_routing.value;
                                _lb.lb_addr = controls.wo_user1.value;
                                _lb.lb__chr01 = String(new Date().toLocaleTimeString());
                                _lb.lb__chr02 = controls.wo_vend.value;
                                let lab = null;
                                console.log(_lb);
                                // console.log(10 * 100.02)
                                this.labelService.add(_lb).subscribe(
                                  (reponse: any) => {
                                    lab = reponse.data;
                                    this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: lab.lb_ref, qty: args.dataContext.tr_qty_loc,printed:true });
                                    
                                    this.index = this.dataset.findIndex((el) => {
                                      return el.tr_line == args.dataContext.id;
                                    });
                                    console.log(this.index);
                                    this.globalState = true;
                                    const controls = this.woForm.controls;
                                    const _tr = new InventoryTransaction();
                                    _tr.tr_nbr = controls.wo_nbr.value;
                                    _tr.tr_for = controls.wo_vend.value;
                                    _tr.tr_lot = controls.wo_lot.value;
                                    _tr.tr_part = args.dataContext.tr_part;
                                    _tr.tr_addr = controls.wo_routing.value;
                                    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
                                    _tr.tr_qty_loc = args.dataContext.tr_qty_loc;
                                    _tr.tr_serial = args.dataContext.tr_serial;
                                    _tr.tr_program = args.dataContext.tr_program;
                                    _tr.tr_user2 = controls.emp_shift.value;
                                    _tr.tr_site = controls.wo_site.value;
                                    this.trdataset = [];
                                
                                    if (args.dataContext.tr_qty_loc == null || args.dataContext.tr_qty_loc == 0) {
                                      this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: lab.lb_ref, qty: args.dataContext.tr_qty_loc });
                                    
                                      this.hasFormErrors = true;
                                      this.message = "Verifier la Quantité";
                                      
                                
                                      return;
                                    }
                                    if (this.dataset.length == 0) {
                                      this.hasFormErrors = true;
                                      this.message = "Verifier la liste des bobines";
                                
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
                                    this.labelService.addblob(_lb).subscribe((blob) => {
                                      Edelweiss2.print3(lab);
                                    });
                                  },
                                  (error) => {
                                
                                  },
                                 
                                );
                              } else {
                                this.message = "etiquette déjà imprimée";
                                      this.hasFormErrors = true;
                                      return;
                              }
                              
            }
            
          )
          
        }
        else { this.message = "etiquette déjà imprimée"; 
          this.hasFormErrors = true;
          return;}
      }
      },
      // {
      //   id: "tr_effdate",
      //   name: "date",
      //   field: "tr_effdate",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      // },

      {
        id: "tr_ref",
        name: "Ref",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
      },
      // {
      //   id: "printed",
      //   name: "imprimé",
      //   field: "printed",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.string,
      // },

    
      {
        id: "tr_program",
        name: "Heure",
        field: "tr_program",
        sortable: true,
        minWidth: 80,
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
            controls.total_squelette.setValue(controls.total_squelette.value - args.dataContext.tr_qty_loc)
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
      // {
      //   id: "tr_part",
      //   name: "Article",
      //   field: "tr_part",
      //   sortable: true,
      //   width: 50,
      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {
          
      //     if (args.dataContext.tr_ref != null) {
      //       this.message = "modification interdite";
      //             this.hasFormErrors = true;
      //             return;
      //     } else {
      //       console.log(args.dataContext.tr_part);
      //       this.itemsService.getByOne({ pt_part: args.dataContext.tr_part }).subscribe((resp: any) => {
      //         if (resp.data) {
      //           this.locationService.getByOne({ loc_loc: resp.data.pt_loc, loc_site: resp.data.pt_site }).subscribe((response: any) => {
      //             this.location = response.data;

      //             this.inventoryStatusService.getAllDetails({ isd_status: this.location.loc_status, isd_tr_type: "RCT-UNP" }).subscribe((resstat: any) => {
      //               console.log(resstat);
      //               const { data } = resstat;

      //               if (data) {
      //                 this.stat = null;
      //               } else {
      //                 this.stat = this.location.loc_status;
      //               }
      //               this.gridServicesq.updateItemById(args.dataContext.id, { ...args.dataContext, desc: resp.data.pt_desc1, tr_site: resp.data.pt_site, tr_loc: resp.data.pt_loc, tr_um: resp.data.pt_um, tr_um_conv: 1, tr_status: this.stat, tr_price: 0 });
      //             });
      //           });
      //           this.codeService.getBy({code_fldname:'LIMIT',code_value:resp.data.pt_draw}).subscribe((coderesp:any)=>{this.seuil = Number(coderesp.data.code_cmmt)})
      //         } else {
                
      //           this.gridServicesq.updateItemById(args.dataContext.id, { ...args.dataContext, tr_part: null });
      //         }
      //       });
      //     }
      //   },
      // },
      {
        id: "mvid",
        field: "cmvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          if (args.dataContext.tr_ref != null ) {
            this.message = "modification interdite";
                  this.hasFormErrors = true;
                  return;
          } 
          else {
            if( this.autorisation != true)
              {
                this.message = "modification interdite";
                      this.hasFormErrors = true;
                      return;
              } else {
                      this.autorisation= false;
                      this.row_number = args.row;
                      let element: HTMLElement = document.getElementById("openItemsGrid") as HTMLElement;
                      element.click();
                    }
          }
      }
      },
      {
        id: "tr_desc",
        name: "Description",
        field: "tr_desc",
        sortable: true,
        minWidth: 200,
        filterable: false,
      },

      {
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        minWidth: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
         

        },
      },

      
      
      {
        id: "tr_qty_loc",
        name: "QTE",
        field: "tr_qty_loc",
        sortable: true,
        minWidth: 80,
        filterable: false,
        type: FieldType.float,
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
          if(this.printable == true && args.dataContext.sqprinted != true){
          if (args.dataContext.tr_part != null && args.dataContext.tr_qty_loc != null && args.dataContext.tr_loc != null && args.dataContext.tr_site != null && (args.dataContext.tr_ref == null || args.dataContext.tr_ref == "")) {
            const controls = this.woForm.controls;
            this.printbuttonState = true;
            this.printable=false;
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
            _lb.lb__chr01 = String(new Date().toLocaleTimeString())
            let lab = null;
            console.log(_lb);
            // console.log(10 * 100.02)
            this.labelService.add(_lb).subscribe(
              (reponse: any) => {
                lab = reponse.data;
                this.gridServicesq.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: lab.lb_ref, qty: args.dataContext.tr_qty_loc,sqprinted:true });
                
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
                _tr.tr_addr = controls.wo_routing.value;
                _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
                _tr.tr_qty_loc = args.dataContext.tr_qty_loc;
                _tr.tr_serial = args.dataContext.tr_serial;
                _tr.tr_program = args.dataContext.tr_program;
                _tr.tr_user2 = controls.emp_shift.value;
                this.trdataset = [];
            
                if (args.dataContext.tr_qty_loc == null || args.dataContext.tr_qty_loc == 0) {
                  this.gridServicesq.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: null, qty: args.dataContext.tr_qty_loc });
                
                  this.hasFormErrors = true;
                  this.message = "Verifier la Quantité";
                
            
                  return;
                }
                // if (args.dataContext.tr_serial == null || args.dataContext.tr_serial == '') {
                //   this.hasFormErrors = true;
                //   this.message = "Veuillez remplir le N° de lot";
                
            
                //   return;
                // }
                // if (this.dataset.length == 0) {
                //   this.hasFormErrors = true;
                //   this.message = "Verifier la liste des bobines";
            
                //   return;
                // }
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

                this.labelService.addblob(_lb).subscribe((blob) => {
                  Edelweiss.print3(lab);
                });
              },
              (error) => {
             
              },
              () => {
                
              }
            );
          } else {
            this.message = "etiquette déjà imprimée";
                  this.hasFormErrors = true;
                  return;
          }
        }
        else {
          this.message = "etiquette déjà imprimée";
                  this.hasFormErrors = true;
                  return;
        }
      }
      },
      // {
      //   id: "tr_effdate",
      //   name: "Date",
      //   field: "tr_effdate",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      // },

      {
        id: "tr_ref",
        name: "Ref",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
      },
      // {
      //   id: "sqprinted",
      //   name: "imprimé",
      //   field: "sqprinted",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.string,
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
    this.codeService
    .getBy({
      code_fldname: "EMBALLAGE",code_desc:'MANDRIN'
    })
    .subscribe((response: any) => {
      const { data } = response;
      this.MANDRINS = data;
      if (!data) {
       
        // controls.wo_site.setValue("");
      }
    
    });




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
    this.seuil = 1200;
    this.createForm();
    this.codeService
    .getBy({ code_fldname: "manufacturing/create-bobine-wo" })
    .subscribe((response: any) => {
      const { data } = response;
     this.docs = data; 
     if(response.data.length != 0){this.exist = true} 
    });
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
      wo_lot:[this.workOrder.wo_lot,],
      wo_nbr:[this.workOrder.wo_nbr,],
      wo_vend:[this.workOrder.wo_vend,],
      wo_part: [{ value: this.workOrder.wo_part, disabled: true }],
      desc: [{ value: null, disabled: true }],

      wo_routing: [this.workOrder.wo_routing, Validators.required],
      ref: [{ value: null, disabled: true }],
      wo_qty_ord: [{ value: 0 },this.workOrder.wo_qty_ord],
      total_bobine:  [{value: 0,disabled: true}],
      rest_bobine:  [{value: 0,disabled: true}],
      total_squelette:  [{ value: 0 ,disabled: true}],
      wo_qty_comp: [{ value: 0 },this.workOrder.wo_qty_comp],
wo_bo_chg:[this.workOrder.wo_bo_chg],
      wo_qty_rjct: [{ value: 0 },this.workOrder.wo_qty_rjct],
      autorisation:[false],
      emp_shift: [this.shift],
      wo_serial: [{value:this.workOrder.wo_serial,disabled: true}],
      wo_serial_next: [""],
      printer: [{ value: this.user.usrd_dft_printer, disabled: true }],
      product_type: ["", Validators.required],
      product_color: ["", Validators.required],
      MANDRIN:[""],
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
    controls.wo_serial.setValue('1')
    controls.wo_serial_next.setValue('1')
  }
  authorised(){
    const controls = this.woForm.controls
    let password:any;
    this.codeService.getBy({code_fldname:'PASSWORD',code_value:controls.wo_routing.value}).subscribe((coderesp:any)=>{password = coderesp.data[0].code_cmmt
    console.log(coderesp.data[0].code_cmmt)        
    if(controls.autorisation.value == password){this.autorisation = true,controls.autorisation.setValue(null)}
    else{controls.autorisation.setValue(null)
      this.message = "Mot de passe erroné, veuillez réessayer";
      this.hasFormErrors = true;
      return;
    }
  })
  }
  onChangeOA() {
    // this.dataset = [];
    // this.sqdataset = [];
    const controls = this.woForm.controls;
    const id = controls.wo_lot.value;

    this.workOrderService.getByOne({ id }).subscribe((res: any) => {
      if (res.data.wo_status == "R" && res.data.wo_routing == controls.wo_routing.value) {
        this.woServer = res.data;
        
        controls.wo_lot.setValue(this.woServer.id);
        controls.wo_nbr.setValue(this.woServer.wo_nbr);
        controls.wo_vend.setValue(this.woServer.wo_vend);
        controls.wo_part.setValue(this.woServer.wo_part);
        controls.wo_qty_ord.setValue(this.woServer.wo_qty_ord);
        controls.wo_bo_chg.setValue(this.woServer.wo_bo_chg);
        controls.total_bobine.setValue(this.woServer.wo_qty_comp);
        controls.rest_bobine.setValue(this.woServer.wo_qty_ord - this.woServer.wo_qty_comp);
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
        this.inventoryTransactionService.getByRef({tr_domain: this.domain,tr_type:'RCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
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
        this.inventoryTransactionService.getByRef({tr_domain: this.domain,tr_type:'RJCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
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
            this.codeService.getBy({code_fldname:'LIMIT',code_value:data[0].pt_draw}).subscribe((coderesp:any)=>{this.seuil = Number(coderesp.data[0].code_cmmt)})
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
    _tr.tr_for = controls.wo_vend.value;
    _tr.tr_lot = controls.wo_lot.value;
    _tr.tr_part = controls.wo_part.value;
    _tr.tr_addr = controls.wo_routing.value;
    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _tr.tr_qty_loc = controls.wo_qty_comp.value;
    _tr.tr_serial = controls.wo_serial.value;
    _tr.tr_user1 = this.user1;
    _tr.tr_user2 = this.user2;
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
    _tr.tr_addr = controls.wo_routing.value;
    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _tr.tr_qty_loc = controls.wo_qty_rjct.value;
    _tr.tr_serial = controls.wo_serial.value;
    _tr.tr_user1 = this.user1;
    _tr.tr_user2 = this.user2;
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
    _wo.wo_user2 = this.user2;
    _wo.wo_part = controls.wo_part.value;
    _wo.wo_routing = controls.wo_routing.value;
    _wo.wo_qty_ord = controls.wo_qty_ord.value;
    _wo.wo_ord_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_rel_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_due_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo__chr01 = controls.emp_shift.value;
    _wo.wo_type   = 'EX';
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
    _tr.tr_for = controls.wo_vend.value;
    _tr.tr_lot = this.wolot;
    _tr.tr_user1 = this.user1;
    _tr.tr_user2 = this.user2;
    _tr.tr_addr = controls.wo_routing.value;
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
          this.codeService.getBy({code_fldname:'LIMIT',code_value:response.data.pt_draw}).subscribe((coderesp:any)=>{this.seuil = Number(coderesp.data[0].code_cmmt)})
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
        let updateItem = this.gridServicesq.getDataItemByRowIndex(this.row_number);
        updateItem.tr_part = item.pt_part;
        updateItem.tr_desc = item.pt_desc1;
        this.gridServicesq.updateItem(updateItem);
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

    this.itemsService.getBy({pt_draw:'SQUELETTE',pt_dsgn_grp: 'N/BROY'}).subscribe((response: any) => (this.items = response.data));
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
onpal(){
  const controls = this.woForm.controls
  var newpal:any;
  newpal = String(Number(controls.wo_serial.value) + 1)
  controls.wo_serial.setValue(newpal)
  controls.wo_serial_next.setValue(newpal)
}
printpal(){
  const controls = this.woForm.controls
 var qty = 0;
 var refs='';
 for (let data of this.dataset)
  {
    if(data.tr_serial == controls.wo_serial_next.value){
      qty = qty + data.tr_qty_loc
      refs = refs + data.tr_ref + '/'
    }

  }
    const _lb = new Label();
    (_lb.lb_site = controls.wo_site.value);
    // _lb.lb_rmks = controls.tr_rmks.value;
    _lb.lb_loc  = "";
    _lb.lb_part = controls.wo_part.value;
    _lb.lb_nbr  = controls.wo_nbr.value; //this.trnbr
    _lb.lb_lot  = refs;
    _lb.lb_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _lb.lb_qty  = qty;
    _lb.lb_um   = "KG";
    _lb.lb_ld_status = "";
    _lb.lb_desc = controls.desc.value;
    _lb.lb_printer = this.PathPrinter;
    _lb.lb_grp = controls.emp_shift.value;
    _lb.lb_cust = 'FICHE PALETTE';
    _lb.lb_addr = controls.wo_user1.value;
    _lb.lb__chr01 = String(new Date().toLocaleTimeString())
    let lab = null;
    console.log(_lb);
    // console.log(10 * 100.02)
    this.labelService.add(_lb).subscribe(
      (reponse: any) => {
        lab = reponse.data;
        
       
       
       
       

        this.labelService.addblob(_lb).subscribe((blob) => {
          Edelweiss3.print3(lab);
        });
      },
      (error) => {
     
      },
      () => {
        
      }
    );
 
}

  onChangePal() {
    /*kamel palette*/
    const controls = this.woForm.controls;
    let qty= Number(controls.wo_qty_comp.value)
    if (controls.MANDRIN.value == null){controls.MANDRIN.setValue('MANDRIN')}
    this.codeService.getByOne({code_fldname:'EMBALLAGE',code_value:controls.MANDRIN.value}).subscribe((coderesp:any)=>{let poids = Number(coderesp.data.code_cmmt)
      qty = qty - poids
    })
    const timedate = new Date().toLocaleTimeString();
    console.log(timedate);
    var bol = false;
    this.printable = true;
    if (qty > controls.wo_bo_chg.value)
    {this.layoutUtilsService.showActionNotification("Poids bobine dépasse poids Maximum", MessageType.Create, 10000, true, true);
    }
    if(controls.wo_user1.value == null || controls.wo_user1.value == ''){
      this.message = "veuillez sélectionner les employés";
    this.hasFormErrors = true;
    return;}
    if(controls.wo_user1.value == null || controls.wo_user1.value == ''){
      this.message = "veuillez sélectionner les employés";
    this.hasFormErrors = true;
    return;}
    if(qty > this.seuil || qty < 0){
      this.message = "la quantité que vous avez saisi est erroné";
    this.hasFormErrors = true;
    return;}
    this.workOrderService.getByOne({ wo_nbr: controls.wo_nbr.value }).subscribe((res: any) => {
      if (res.data.wo_status == "C" ){
        console.log(res.data.wo_status)
        this.message = "vous avez atteint la quantité prevue";
      this.hasFormErrors = true;
      return;}
    else {
      
      this.itemsService.getByOne({pt_part: controls.wo_part.value  }).subscribe(
      (respopart: any) => {
        console.log(respopart)
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
            tr_price: 0,
            cmvids: "",
            tr_ref: null,
            tr_serial: controls.wo_serial.value,
            tr_program: timedate,
            // tr_status: this.stat,
            
          },
          { position: "bottom" },
          
        );
        const TOTAL = Number(controls.total_bobine.value) + Number(qty)
        const REST = Number(controls.rest_bobine.value) - Number(qty)
        controls.total_bobine.setValue(TOTAL)
        controls.rest_bobine.setValue(REST)

        controls.wo_qty_comp.setValue(0);
    //  this.sctService.getByOne({ sct_site: controls.wo_site.value, sct_part: controls.wo_part.value, sct_sim: 'STD-CG' }).subscribe(
    //   (respo: any) => {
    //     this.sct = respo.data
    //     console.log(this.sct)
    
  
    
    
    //  });
    }); 
  }})
    
 
  }

  onChangeSq() {
    /*kamel palette*/
    const controls = this.woForm.controls;
    let  sqqty= Number(controls.wo_qty_rjct.value)
    controls.total_squelette.setValue(controls.total_squelette.value + sqqty)
    this.codeService.getByOne({code_fldname:'EMBALLAGE',code_value:'BIGBAG'}).subscribe((coderesp:any)=>{let poids = Number(coderesp.data.code_cmmt)
      sqqty = sqqty - poids
    })
    const timedate = new Date().toLocaleTimeString();
    console.log(timedate);
    var bol = false;
    this.printable=true;
    if(controls.wo_user1.value == null || controls.wo_user1.value == ''){
      this.message = "veuillez sélectionner les employés";
    this.hasFormErrors = true;
    return;}
    this.itemsService.getByOne({pt_draw:'SQUELETTE', pt_dsgn_grp:'N/BROY',pt_break_cat: controls.product_color.value  }).subscribe(
      (respopart: any) => {
        console.log(respopart)
        this.codeService.getBy({code_fldname:'LIMIT',code_value:respopart.data.pt_draw}).subscribe((coderesp:any)=>{
          if(coderesp.data.length != 0){this.seuil = Number(coderesp.data[0].code_cmmt)}
          this.sctService.getByOne({ sct_site: controls.wo_site.value, sct_part: respopart.data.pt_part, sct_sim: 'STD-CG' }).subscribe(
            (respo: any) => {
              this.sct = respo.data
              console.log(this.seuil)
          
              if(controls.wo_qty_rjct.value > this.seuil || controls.wo_qty_rjct.value < 0){
                this.message = "la quantité de squelette ne doit pas dépasser" + this.seuil;
              this.hasFormErrors = true;
              return;} 
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
        })
  
     
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
        this.PathPrinter    = item.printer_path;
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
    this.employeService.getBy({emp_job:'EX'}).subscribe((response: any) => (this.emps = response.data));
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
      // {
      //   id: "id",
      //   name: "id",
      //   field: "id",
      //   sortable: true,
      //   minWidth: 80,
      //   maxWidth: 80,
      // },
      {
        id: "wo_so_job",
        name: "Programme",
        field: "wo_so_job",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      {
        id: "wo_queue_eff",
        name: "N° OF",
        field: "wo_queue_eff",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 50,
      },
      // {
      //   id: "wo_rel_date",
      //   name: "Date",
      //   field: "wo_rel_date",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.date,
      //   minWidth: 150,
      // },
      {
        id: "wo_ref",
        name: "BOBINE",
        field: "wo_ref",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },

      {
        id: "wo_batch",
        name: "COULEUR",
        field: "wo_batch",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 150,
      },
      {
        id: "wo_bom_code",
        name: "QUALITE",
        field: "wo_bom_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "wo_grade",
        name: "SILICONE",
        field: "wo_grade",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 150,
      },
      {
        id: "wo_vend",
        name: "Client",
        field: "wo_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 150,
      },
      // {
      //   id: "wo_status",
      //   name: "status",
      //   field: "wo_status",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
      // {
      //   id: "wo_routing",
      //   name: "status",
      //   field: "wo_routing",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
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

    // this.dataset = [];

    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.wo_lot.setValue(item.id || "");
this.program = item.wo_so_job;
this.ordre = "OF-" + item.wo_queue_eff;
        controls.wo_nbr.setValue(item.wo_nbr);
        controls.wo_vend.setValue(item.wo_vend)
        controls.wo_part.setValue(item.wo_part);
        // controls.tr_so_job.setValue(item.wo_so_job);
        controls.desc.setValue(item.item.pt_desc1);
        controls.product_type.setValue(item.item.pt_article);
        controls.product_color.setValue(item.item.pt_break_cat);
        controls.product_quality.setValue(item.item.pt_rev);
        controls.total_bobine.setValue(item.wo_qty_comp);
        
        controls.rest_bobine.setValue(item.wo_qty_ord - item.wo_qty_comp);
        controls.wo_qty_ord.setValue(item.wo_qty_ord)
        controls.wo_bo_chg.setValue(item.wo_bo_chg)
        controls.product_Cyl.setValue(item.item.pt_group)
        
        //remplir les grids
        controls.wo_nbr.value
        console.log('remplir grid' ,controls.wo_nbr.value)
        // this.inventoryTransactionService.getByRef({tr_domain: this.domain,tr_type:'RCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
        //   (res: any) => {        
        //   this.dataset  = res.data;
        //   for (let item of this.dataset){
        //   this.gridService.addItem(
        //     {
        //       id: this.dataset.length + 1,
        //       tr_line: this.dataset.length + 1,
        //       tr_part: item.tr_part,
        //       cmvid: "",
        //       tr_desc: item.tr_desc,
        //       tr__chr02:item.tr__chr02,
        //       tr_qty_loc: item.tr_qty_loc,
        //       tr_loc: item.tr_loc,
        //       tr_effdate: item.tr_effdate,
        //       tr_um:item.tr_um,
        //       tr_um_conv: 1,
        //       tr_price: item.tr_price,
        //       cmvids: "",
        //       tr_ref: item.tr_ref,
        //       tr_serial: item.tr_serial,
        //       tr_status: item.tr_status,
        //       tr_expire: item.tr_expire,
        //       tr_program: item.tr_program,
        //     },
        //     { position: "bottom" }
            
        //   )}})
        //   console.log('remplir grid' ,controls.wo_nbr.value)
        // this.inventoryTransactionService.getByRef({tr_domain: this.domain,tr_type:'RJCT-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
        //   (res: any) => {        
        //   this.sqdataset  = res.data;
        //   for (let itemsq of this.sqdataset){
        //   this.gridServicesq.addItem(
        //     {
        //       id: this.dataset.length + 1,
        //       tr_line: this.dataset.length + 1,
        //       tr_part: itemsq.tr_part,
        //       cmvid: "",
        //       tr_desc: itemsq.tr_desc,
        //       tr__chr02:itemsq.tr__chr02,
        //       tr_qty_loc: itemsq.tr_qty_loc,
        //       tr_loc: itemsq.tr_loc,
        //       tr_effdate: itemsq.tr_effdate,
        //       tr_um:itemsq.tr_um,
        //       tr_um_conv: 1,
        //       tr_price: itemsq.tr_price,
        //       cmvids: "",
        //       tr_ref: itemsq.tr_ref,
        //       tr_serial: itemsq.tr_serial,
        //       tr_status: itemsq.tr_status,
        //       tr_expire: itemsq.tr_expire,
        //       tr_program: itemsq.tr_program,
        //     },
        //     { position: "bottom" }
            
        //   )}
        //   })
        
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
  onPrint() {
    const controls = this.woForm.controls;

    this.printpdf(controls.wo_nbr.value); 
  }
  printpdf(nbr) {
      // const controls = this.totForm.controls
      const controls = this.woForm.controls;
      console.log("pdf");
      var doc = new jsPDF('l');
      let date = new Date()
     
     // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
      var img = new Image()
      // img.src = "./assets/media/logos/create-direct-wo.png";
      img.src = "./assets/media/logos/companyentete.png";
      doc.addImage(img, 'png', 5, 5, 275, 30)
      doc.setFontSize(10);
  if(this.exist == true){
    doc.text(this.docs[0].code_value, 240, 17); 
    doc.text(this.docs[0].code_cmmt, 70, 22);
    doc.text(this.docs[0].code_desc, 240, 12);
    doc.text(this.docs[0].chr01, 40, 22);
    doc.text(this.docs[0].dec01, 240, 32);
    doc.text(this.docs[0].date01, 240, 22);
    doc.text(this.docs[0].date02, 240, 27);
  }
  // doc.setFontSize(14);
    
      doc.line(10, 35, 200, 35);
      doc.setFontSize(12);
      doc.text("Rapport de Production extrusion N° : " + nbr, 70, 45);
      doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 45);
        doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
        // doc.text("Edité par: " + this.user.usrd_code, 160, 55);
        if(this.user1 != null){  doc.text("Fait par: " + this.user1, 20, 83)};
        if(this.user2 != null){doc.text("Et: " + this.user2, 90, 83);}
        
      doc.setFontSize(8);
      //console.log(this.provider.ad_misc2_id)
      // doc.text("Machine           : " + this.gamme, 20, 50);
      //doc.text(" " + this.provider.ad_name, 60, 50);
      // doc.text("Equipe            : " + this.shift, 120, 50);
      // doc.text("Type produit      : " + controls.product_type.value, 20, 55);
      // doc.text("Employés          : " + this.user1, 120, 55);
      // doc.text("Couleur Produit   : " + controls.product_color.value, 20, 60);
      doc.text("Quantité sortie   : " + controls.total_bobine.value, 20, 65);
      doc.text("Squelette sortie   : " + controls.total_squelette.value, 20, 60);
  doc.setFontSize(8);   
      doc.line(10, 85, 280, 85);
      doc.line(10, 90, 280, 90);
      doc.line(10, 85, 10, 90);
      doc.text("LN", 12.5, 88.5);
      doc.line(20, 85, 20, 90);
      doc.text("Désignation", 21, 88.5);
      doc.line(95, 85, 95, 90);
      doc.text("QTE", 96, 88.5);
      doc.line(105, 85, 105, 90);
      doc.text("MAX", 106, 88.5);
      doc.line(125, 85, 125, 90);
      doc.text("Lot/Série", 126, 88.5);
      doc.line(145, 85, 145, 90);
      doc.text("PL", 146, 88.5);
      doc.line(155, 85, 155, 90);
      doc.text("Heure", 156, 88.5);
      doc.line(170, 85, 170, 90);
      doc.text("SQUELETTE", 171, 88.5);
      doc.line(215, 85, 215, 90);
      doc.text("QTE", 216, 88.5);
      doc.line(235, 85, 235, 90);
      doc.text("Lot/Série", 236, 88.5);
      doc.line(255, 85, 255, 90);
      doc.text("PL", 256, 88.5);
      doc.line(265, 85, 265, 90);
      doc.text("Heure", 266, 88.5);
      doc.line(280, 85, 280, 90);
      var i = 95;
      doc.setFontSize(6);
    //   let total = 0
    let iter = 0
    if (this.dataset.length < this.sqdataset.length){iter = this.sqdataset.length}else{iter = this.dataset.length}
    console.log(this.dataset)
      for (let j = 0; j < iter  ; j++) {
        // total = total + Number(this.dataset[j].tr_price) * Number(this.dataset[j].tr_qty_loc)
        
        if ((j % 12 == 0) && (j != 0) ) {
    doc.addPage();
    //img.src = "./assets/media/logos/create-direct-wo.png";
    img.src = "./assets/media/logos/companyentete.png";
    doc.addImage(img, 'png', 5, 5, 275, 30)
    doc.setFontSize(10);
    if(this.exist == true){
      doc.text(this.docs[0].code_value, 240, 17); 
      doc.text(this.docs[0].code_cmmt, 70, 22);
      doc.text(this.docs[0].code_desc, 240, 12);
      doc.text(this.docs[0].chr01, 40, 27);
      doc.text(this.docs[0].dec01, 240, 32);
      doc.text(this.docs[0].date01, 240, 22);
      doc.text(this.docs[0].date02, 240, 27);
    }
    // doc.setFontSize(14);
    doc.line(10, 35, 200, 35);
    doc.setFontSize(12);
      doc.text("Rapport de Production extrusion N° : " + nbr, 70, 45);
      doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 45);
        doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
        // doc.text("Edité par: " + this.user.usrd_code, 160, 55);
        if(this.user1 != null){  doc.text("Fait par: " + this.user1, 20, 83)};
        if(this.user2 != null){doc.text("Et: " + this.user2, 90, 83);}
        
      doc.setFontSize(8);
      //console.log(this.provider.ad_misc2_id)
      // doc.text("Machine           : " + this.gamme, 20, 50);
      // doc.text(" " + this.provider.ad_name, 60, 50);
      // doc.text("Equipe            : " + this.shift, 120, 50);
      // doc.text("Type produit      : " + controls.product_type.value, 20, 55);
      // doc.text("Employés          : " + this.user1, 120, 55);
      // doc.text("Couleur Produit   : " + controls.product_color.value, 20, 60);
      doc.text("Quantité sortie   : " + controls.total_bobine.value, 20, 65);
      doc.text("Squelette sortie   : " + controls.total_squelette.value, 20, 60);
    doc.setFontSize(8);   
    doc.line(10, 85, 280, 85);
    doc.line(10, 90, 280, 90);
    doc.line(10, 85, 10, 90);
    doc.text("LN", 12.5, 88.5);
    doc.line(20, 85, 20, 90);
    doc.text("Désignation", 21, 88.5);
    doc.line(95, 85, 95, 90);
    doc.text("QTE", 96, 88.5);
      doc.line(105, 85, 105, 90);
    doc.text("MAX", 106, 88.5);
    doc.line(125, 85, 125, 90);
    doc.text("Lot/Série", 126, 88.5);
    doc.line(145, 85, 145, 90);
    doc.text("PL", 146, 88.5);
    doc.line(155, 85, 155, 90);
    doc.text("Heure", 156, 88.5);
    doc.line(170, 85, 170, 90);
    doc.text("SQUELETTE", 171, 88.5);
    doc.line(215, 85, 215, 90);
    doc.text("QTE", 216, 88.5);
    doc.line(235, 85, 235, 90);
    doc.text("Lot/Série", 236, 88.5);
    doc.line(255, 85, 255, 90);
    doc.text("PL", 256, 88.5);
    doc.line(265, 85, 265, 90);
    doc.text("Heure", 266, 88.5);
    doc.line(280, 85, 280, 90);
          i = 95;
          doc.setFontSize(6);
        }
        let squelette = ""
        if (j < this.sqdataset.length){squelette = this.sqdataset[j].tr_desc.substring(24)}
        if (j < this.dataset.length){
          if (this.dataset[j].tr_desc.length > 45) {
            let desc1 = this.dataset[j].tr_desc.substring(45);
            let ind = desc1.indexOf(" ");
            desc1 = this.dataset[j].tr_desc.substring(0, 45 + ind);
            let desc2 = this.dataset[j].tr_desc.substring(45 + ind);
            
            doc.line(10, i - 5, 10, i);
            doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
            doc.line(20, i - 5, 20, i);
            doc.text(desc1, 21, i - 1);
            doc.line(105, i - 5, 105, i);
            doc.text(String(Number(this.dataset[j].tr_qty_loc)), 104, i - 1, { align: "right" });
            doc.line(105, i - 5, 105, i);
            doc.text(String(Number(controls.wo_bo_chg.value)), 124, i - 1, { align: "right" });
            doc.line(125, i - 5, 125, i);
            doc.text(String(this.dataset[j].tr_serial), 126, i - 1, );
            doc.line(145, i - 5, 145, i);
            doc.text(String(this.dataset[j].tr_ref), 146, i - 1, );
            doc.line(155, i - 5, 155, i);
            doc.text(String(this.dataset[j].tr_program), 156, i - 1, );
            doc.line(170, i - 5, 170, i);
            doc.text(squelette, 171, i - 1);
            doc.line(215, i - 5, 215, i);
            if (j < this.sqdataset.length){doc.text(String(Number(this.sqdataset[j].tr_qty_loc)), 234, i - 1, { align: "right" });}
            doc.line(235, i - 5, 235, i);
            if (j < this.sqdataset.length){doc.text(String(this.sqdataset[j].tr_serial), 236, i - 1, );}
            doc.line(255, i - 5, 255, i);
            if (j < this.sqdataset.length){doc.text(String(this.sqdataset[j].tr_ref), 256, i - 1, );}
            doc.line(265, i - 5, 265, i);
            if (j < this.sqdataset.length){doc.text(String(this.sqdataset[j].tr_program), 266, i - 1, );}
            doc.line(280, i - 5, 280, i);
            // doc.line(10, i, 200, i );
      
            i = i + 5;
      
            doc.text(desc2, 21, i - 1);
      
            doc.line(10, i - 5, 10, i);
            doc.line(20, i - 5, 20, i);
            doc.line(105, i - 5, 105, i);
            doc.line(125, i - 5, 125, i);
            doc.line(145, i - 5, 145, i);
            doc.line(155, i - 5, 155, i);
            doc.line(170, i - 5, 170, i);
            doc.line(215, i - 5, 215, i);
            doc.line(235, i - 5, 235, i);
            doc.line(255, i - 5, 255, i);
            doc.line(265, i - 5, 265, i);
            doc.line(280, i - 5, 280, i);
            doc.line(10, i, 280, i );
            i = i + 5;
          } else {
            doc.line(10, i - 5, 10, i);
            doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
            doc.line(20, i - 5, 20, i);
            doc.text(this.dataset[j].tr_desc, 21, i - 1);
            doc.line(105, i - 5, 105, i);
            doc.text(String(Number(this.dataset[j].tr_qty_loc)), 106, i - 1, { align: "right" });
            doc.line(125, i - 5, 125, i);
            doc.text(String(this.dataset[j].tr_serial), 126, i - 1, );
            doc.line(145, i - 5, 145, i);
            doc.text(String(this.dataset[j].tr_ref), 146, i - 1, );
            doc.line(155, i - 5, 155, i);
            doc.text(String(this.dataset[j].tr_program), 156, i - 1, );
            doc.line(170, i - 5, 170, i);
            doc.text(squelette, 171, i - 1);
            doc.line(215, i - 5, 215, i);
            doc.text(String(Number(this.sqdataset[j].tr_qty_loc)), 234, i - 1, { align: "right" });
            doc.line(235, i - 5, 235, i);
            doc.text(String(this.sqdataset[j].tr_serial), 236, i - 1, );
            doc.line(255, i - 5, 255, i);
            doc.text(String(this.sqdataset[j].tr_ref), 256, i - 1, );
            doc.line(265, i - 5, 265, i);
            doc.text(String(this.sqdataset[j].tr_program), 266, i - 1, );
            doc.line(280, i - 5, 280, i);
            doc.line(10, i, 280, i );
            i = i + 5;
            
          }
        }
        else{
          doc.line(10, i - 5, 10, i);
            doc.text(String("000" + this.sqdataset[j].tr_line).slice(-3), 12.5, i - 1);
            doc.line(20, i - 5, 20, i);
            // doc.text(this.dataset[j].tr_desc, 21, i - 1);
            doc.line(105, i - 5, 105, i);
            // doc.text(String(Number(this.dataset[j].tr_qty_loc)), 106, i - 1, { align: "right" });
            doc.line(125, i - 5, 125, i);
            // doc.text(String(this.dataset[j].tr_serial), 126, i - 1, );
            doc.line(145, i - 5, 145, i);
            // doc.text(String(this.dataset[j].tr_ref), 146, i - 1, );
            doc.line(155, i - 5, 155, i);
            // doc.text(String(this.dataset[j].tr_program), 156, i - 1, );
            doc.line(170, i - 5, 170, i);
            doc.text(squelette, 171, i - 1);
            doc.line(215, i - 5, 215, i);
            doc.text(String(Number(this.sqdataset[j].tr_qty_loc)), 234, i - 1, { align: "right" });
            doc.line(235, i - 5, 235, i);
            doc.text(String(this.sqdataset[j].tr_serial), 236, i - 1, );
            doc.line(255, i - 5, 255, i);
            doc.text(String(this.sqdataset[j].tr_ref), 256, i - 1, );
            doc.line(265, i - 5, 265, i);
            doc.text(String(this.sqdataset[j].tr_program), 266, i - 1, );
            doc.line(280, i - 5, 280, i);
            doc.line(10, i, 280, i );
            i = i + 5;
        }
      }
    
      
    
      // doc.line(130, i + 7, 205, i + 7);
      // doc.line(130, i + 14, 205, i + 14);
      // doc.line(130, i + 7, 130, i + 14);
      // doc.line(160, i + 7, 160, i + 14);
      // doc.line(205, i + 7, 205, i + 14);
      // doc.setFontSize(10);
      // doc.text("Validé par: " , 20, i + 22);
      // doc.text("Note: " , 20, i + 32);
     
      doc.setFontSize(8);
      doc.save('EB-' + nbr + '.pdf')
      var blob = doc.output("blob");
      window.open(URL.createObjectURL(blob));
    } 
  // printpdf() {
  //   // const controls = this.totForm.controls
  //   const controls = this.woForm.controls;
  //   console.log("pdf");
  //   var doc = new jsPDF("l");
  //   var nbr1 = new Date().toLocaleDateString()
  //   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  //   var img = new Image();
  //   // img.src = "./assets/media/logos/create-bobine-wo.png";
  //   img.src = "./assets/media/logos/companyentete.png";
  //   doc.addImage(img, 'png', 5, 5, 200, 30)
  //   //ENTETE DOCUMENT
  //   // doc.addImage(img, "png", 20, 11, 20, 20);
  //   // doc.setFontSize(12);
  //   // doc.line(10, 10, 288, 10);
  //   // doc.line(10, 10, 10, 35);
  //   // doc.text("SUIVI DE LA PRODUCTION ET CONTROLE QUALITE DES BOBINES   "  + nbr1, 40, 25);
  //   // doc.line(10, 30, 82, 30);
  //   // doc.line(82, 10, 82, 35);
  //   // doc.line(216, 10, 216, 35);
  //   // doc.setFontSize(8);
  //   // doc.text("Code: FO-PR-002/02  " , 225, 15);
  //   // doc.line(216, 20, 288, 20);
  //   // doc.text("Date: 2024/09/02  " , 225, 25);
  //   // doc.line(216, 30, 288, 30);
  //   // doc.text("PAGE  " , 225, 33);
    
  //   // doc.text("type : Formulaire" , 11, 33);
  //   // doc.line(10, 35, 288, 35);
  //   // doc.line(288, 10, 288, 35);
  //   // doc.text("Date : " + String(new Date().getFullYear()) + "/" + String(Number(new Date().getMonth()) + 1) + "/" + new Date().getDate() , 11, 38);
  //   doc.setFontSize(8);
    
    
  //   // TABLEAU 2 
  //   doc.line(0, 45, 300, 45);
  //   doc.line(0, 50, 300, 50);
  //   doc.line(0, 45, 0, 50);
  //   doc.text("DIMENSION", 1, 48.5);
  //   doc.line(14, 45, 14, 50);
  //   doc.text("COULEUR", 20, 48.5);
  //   doc.line(41, 45, 41, 50);
  //   doc.text("HEURE", 42, 48.5);
  //   doc.line(49, 45, 49, 50);
  //   doc.text("NUM BOB", 50, 48.5);
  //   doc.line(63, 45, 63, 50);
  //   doc.text("REF BOBINE", 64, 48.5);
  //   doc.line(77, 45, 77, 50);
  //   doc.text("KG", 45, 48.5);
  //   doc.line(91, 45, 91, 50);
  //   doc.text("C/NC", 95, 48.5);
  //   doc.line(118, 45, 118, 50);
  //   doc.text("N° PALETTE", 119, 48.5);
  //   doc.line(126, 45, 126, 50);
  //   doc.text("KG PALETTE", 129, 48.5);
  //   doc.line(142, 45, 142, 50);
  //   doc.text("REF SQUELETTE", 143, 48.5);
  //   doc.line(154, 45, 154, 50);
  //   doc.text("KG SQUELETTE", 157, 48.5);
  //   doc.line(166, 45, 166, 50);
  //   doc.text("HEURE", 170, 48.5);
  //   doc.line(189, 45, 189, 50);
  //   doc.text("BARRE FILTRE", 190, 48.5);
  //   doc.line(197, 45, 197, 50);
  //   doc.text("BARRE CONSOMMATION", 198, 48.5);
  //   doc.line(209, 45, 209, 50);
  //   doc.text("COUCHE", 210, 48.5);
  //   doc.line(221, 45, 221, 50);
  //   doc.text("QTE FILTRE", 222, 48.5);
  //   doc.line(235, 45, 235, 50);
  //   doc.text("COUCHE SIL", 241, 48.5);
  //   doc.line(267, 45, 267, 50);
  //   doc.text("DEBIT COLORANT", 268, 48.5);
  //   doc.line(275, 45, 275, 50);
  //   doc.line(0, 50, 300, 50);
    

  //   var i = 95;
    
  //   doc.setFontSize(6);
    
  //   for (let j = 0; j < this.dataset.length; j++) {
  //     if (i > 170){
  //       doc.addPage();
  //       //ENTETE DOCUMENT
  //       doc.addImage(img, "png", 20, 11, 20, 20);
  //       doc.setFontSize(12);
  //       doc.line(10, 10, 288, 10);
  //       doc.line(10, 10, 10, 35);
  //       doc.text("SUIVI DE LA PRODUCTION ET CONTROLE QUALITE DES BOBINES   " + nbr1 , 40, 25);
  //       doc.line(10, 30, 82, 30);
  //       doc.line(82, 10, 82, 35);
  //       doc.line(216, 10, 216, 35);
  //       doc.setFontSize(8);
  //       doc.text("Code: FO-PR-002/02  " , 225, 15);
  //       doc.line(216, 20, 288, 20);
  //       doc.text("Date: 2024/09/02  " , 225, 25);
  //       doc.line(216, 30, 288, 30);
  //       doc.text("PAGE  " , 225, 33);
        
  //       doc.text("type : Formulaire" , 11, 33);
  //       doc.line(10, 35, 288, 35);
  //       doc.line(288, 10, 288, 35);
  //       doc.text("Date : " + String(new Date().getFullYear()) + "/" + String(Number(new Date().getMonth()) + 1) + "/" + new Date().getDate() , 11, 38);
  //       doc.setFontSize(8);
        
        
  //       // TABLEAU 2 
  //       doc.line(0, 45, 300, 45);
  //       doc.line(0, 50, 300, 50);
  //       doc.line(0, 45, 0, 50);
  //       doc.text("DIMENSION", 1, 48.5);
  //       doc.line(14, 45, 14, 50);
  //       doc.text("COULEUR", 20, 48.5);
  //       doc.line(41, 45, 41, 50);
  //       doc.text("HEURE", 42, 48.5);
  //       doc.line(49, 45, 49, 50);
  //       doc.text("NUM BOB", 50, 48.5);
  //       doc.line(63, 45, 63, 50);
  //       doc.text("REF BOBINE", 64, 48.5);
  //       doc.line(77, 45, 77, 50);
  //       doc.text("KG", 45, 48.5);
  //       doc.line(91, 45, 91, 50);
  //       doc.text("C/NC", 95, 48.5);
  //       doc.line(118, 45, 118, 50);
  //       doc.text("N° PALETTE", 119, 48.5);
  //       doc.line(126, 45, 126, 50);
  //       doc.text("KG PALETTE", 129, 48.5);
  //       doc.line(142, 45, 142, 50);
  //       doc.text("REF SQUELETTE", 143, 48.5);
  //       doc.line(154, 45, 154, 50);
  //       doc.text("KG SQUELETTE", 157, 48.5);
  //       doc.line(166, 45, 166, 50);
  //       doc.text("HEURE", 170, 48.5);
  //       doc.line(189, 45, 189, 50);
  //       doc.text("BARRE FILTRE", 190, 48.5);
  //       doc.line(197, 45, 197, 50);
  //       doc.text("BARRE CONSOMMATION", 198, 48.5);
  //       doc.line(209, 45, 209, 50);
  //       doc.text("COUCHE", 210, 48.5);
  //       doc.line(221, 45, 221, 50);
  //       doc.text("QTE FILTRE", 222, 48.5);
  //       doc.line(235, 45, 235, 50);
  //       doc.text("COUCHE SIL", 241, 48.5);
  //       doc.line(267, 45, 267, 50);
  //       doc.text("DEBIT COLORANT", 268, 48.5);
  //       doc.line(275, 45, 275, 50);
  //       doc.line(0, 50, 300, 50);

  //       i = 95;
    
  //     }  
  //       doc.text(this.dataset[j].PAYREF, 1, i - 1);
  //       doc.line(14, i - 5, 14, i);
  //       doc.text(this.dataset[j].PAYCOLOR, 15, i - 1);
  //       doc.line(41, i - 5, 41, i);
  //       doc.text(String((this.dataset[j].PAYQTY)), 42, i - 1);
  //       doc.line(49, i - 5, 49, i);
  //       doc.text(this.dataset[j].PAYTIME, 50, i - 1);
  //       doc.line(63, i - 5, 63, i);
  //       doc.text(this.dataset[j].PAYDEBIT, 64, i - 1);
  //       doc.line(77, i - 5, 77, i);
  //       doc.text(String(this.dataset[j].SQLREF), 78, i - 1);
  //       doc.line(91, i - 5, 91, i);
  //       doc.text(String(this.dataset[j].SQLCOLOR), 92, i - 1);
  //       doc.line(118, i - 5, 118, i);
  //       doc.text(String((this.dataset[j].SQLQTY)), 119, i - 1);
  //       doc.line(126, i - 5, 126, i);
  //       doc.text(this.dataset[j].SQLTIME, 127, i - 1);
  //       doc.line(142, i - 5, 142, i);
  //       doc.text(this.dataset[j].SQLDEBIT, 143, i - 1);
  //       doc.line(154, i - 5, 154, i);
  //       doc.text(String(this.dataset[j].PREREF), 155, i - 1);
  //       doc.line(166, i - 5, 166, i);
  //       doc.text(String(this.dataset[j].PRECOLOR), 167, i - 1);
  //       doc.line(189, i - 5, 189, i);
  //       doc.text(String((this.dataset[j].PREQTY)), 190, i - 1);
  //       doc.line(197, i - 5, 197, i);
  //       doc.text(this.dataset[j].PRETIME, 198, i - 1);
  //       doc.line(209, i - 5, 209, i);
  //       doc.text(this.dataset[j].PREDEBIT, 210, i - 1);
  //       doc.line(221, i - 5, 221, i);
  //       doc.text(String(this.dataset[j].ORGREF), 222, i - 1);
  //       doc.line(235, i - 5, 235, i);
  //       doc.text(String(this.dataset[j].ORGCOLOR), 236, i - 1);
  //       doc.line(267, i - 5, 267, i);
  //       doc.text(String((this.dataset[j].ORGQTY)), 268, i - 1);
  //       doc.line(275, i - 5, 275, i);
  //       doc.text(this.dataset[j].ORGTIME, 278, i - 1);
  //       doc.line(289, i - 5, 289, i);
  //       doc.text(this.dataset[j].ORGDEBIT, 265, i - 1);
  //       doc.line(0, i , 300, i);
  //       // doc.line(288, i - 5, 288, i);
  //       i = i + 5;

      
  //   }
   
    
    
    
  //   let nbr = String(new Date().getFullYear()+"-" + Number(new Date().getMonth() + 1) + "-" + Number(new Date().getDate()))
  //   doc.save('RX-' + nbr + '.pdf')
  //   var blob = doc.output("blob");
  //   window.open(URL.createObjectURL(blob));
    
  // } 
}
