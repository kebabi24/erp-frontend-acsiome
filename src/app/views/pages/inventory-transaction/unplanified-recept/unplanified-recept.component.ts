import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, AngularGridInstance, GridService, EditorValidator, EditorArgs, Formatters, FieldType, OnEventArgs } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ItemService, AddressService, SequenceService, VendorProposal, InventoryTransaction, InventoryTransactionService, InventoryStatusService, SiteService, LocationService, LocationDetailService, CostSimulationService, printBc, CodeService, MesureService, printReceiveUNP, LabelService, Label, DomainService, PrintersService, EmployeService } from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";

// import { CreateComponent } from "../../articles/create/create.component";
const statusValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = grid && grid.getOptions ? grid.getOptions() : {};
  const translate = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value == null || value == undefined || !value.length) {
    return { valid: false, msg: "This is a required field" };
  }
  return { valid: true, msg: "" };
};
 
@Component({
  selector: "kt-unplanified-recept", 
  templateUrl: "./unplanified-recept.component.html",
  styleUrls: ["./unplanified-recept.component.scss"],
})
export class UnplanifiedReceptComponent implements OnInit {
  currentPrinter: string;
  PathPrinter: string;
  employeGrp:string;
  inventoryTransaction: InventoryTransaction;
  trForm: FormGroup;
  nbrForm: FormGroup;
 
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
  provider: any;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  datasite: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  dataloc: [];
  columnDefinitionsloc: Column[] = [];
  gridOptionsloc: GridOption = {};
  gridObjloc: any;
  angularGridloc: AngularGridInstance;
  statuss: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  adresses: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;
  vends: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;
  user: any;
  trlot: string;
  row_number;
  message = "";
  prhServer;
  location: any;
  sct: any;
  datasetPrint = [];
  stat: String;
  domain: any;
  seq: any;
  dataprinter: [];
  domconfig : any;
  prodligne : any;
  dsgn_grp  : any;
  columnDefinitionsprinter: Column[] = [];

  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;

  angularGridprinter: AngularGridInstance;
  nligne : any;
  pdl : any;
  exec : Boolean = true
  currentDialog = null;
  nom:any;
  constructor(config: NgbDropdownConfig, 
                private trFB: FormBuilder,
                private nbrFB: FormBuilder, 
                private activatedRoute: ActivatedRoute, 
                private router: Router, 
                public dialog: MatDialog, 
                private modalService: NgbModal, 
                private layoutUtilsService: LayoutUtilsService, 
                private inventoryTransactionService: InventoryTransactionService, 
                private sctService: CostSimulationService, 
                private itemsService: ItemService, 
                private siteService: SiteService, 
                private addressService: AddressService, 
                private locationService: LocationService, 
                private locationDetailService: LocationDetailService, 
                private codeService: CodeService, 
                private mesureService: MesureService, 
                private sequenceService: SequenceService, 
                private inventoryStatusService: InventoryStatusService, 
                private labelService: LabelService, 
                private domainService: DomainService, 
                private printerService: PrintersService, 
                private employeService: EmployeService) {
    config.autoClose = true;
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
            this.angularGrid.gridService.deleteItem(args.dataContext);
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
          //if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //  this.angularGrid.gridService.deleteItem(args.dataContext);
          // }
       
            this.row_number = args.row;
           this.nligne =  args.dataContext.id
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
          const controls=this.trForm.controls;
          console.log(args.dataContext.tr_part);
          this.itemsService.getByOne({ pt_part: args.dataContext.tr_part }).subscribe((resp: any) => {
            if (resp.data) {
              this.locationService.getByOne({ loc_site: controls.tr_site.value }).subscribe((response: any) => {
                this.location = response.data;

                this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: resp.data.pt_part, sct_sim: "STD-CG" }).subscribe((response: any) => {
                  this.sct = response.data;

                  this.inventoryStatusService.getAllDetails({ isd_status: 'CONFORME', isd_tr_type: "RCT-UNP" }).subscribe((resstat: any) => {
                    console.log(resstat);
                    const { data } = resstat;

                    if (data) {
                      this.stat = '';
                    } else {
                      this.stat = this.location.loc_status;
                    }
                    this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, desc: resp.data.pt_desc1, tr_site: controls.tr_site.value, tr_loc: resp.data.pt_loc, tr_um: resp.data.pt_um, tr_um_conv: 1, tr_status: this.stat, tr_price: this.sct.sct_mtl_tl });
                  });
                });
              });
            } else {
              alert("Article Nexiste pas");
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_part: null });
            }
          });
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
          let element: HTMLElement = document.getElementById("openItemsGrid") as HTMLElement;
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
        id: "tr_batch",
        name: "N°",
        field: "tr_batch",
        sortable: true,
        width: 180,
        filterable: false,
        editor:{model:Editors.text}
      },
      {
        id: "tr_serial",
        name: "Lot",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          this.locationDetailService.getBy({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe((response: any) => {
            console.log(response.data);
            if (response.data.length != 0) {
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_status: response.data[0].ld_status, tr_expire: response.data[0].ld_expire });
            }
          });
        },
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
      },
      // {
      //   id: "tr_um",
      //   name: "UM",
      //   field: "tr_um",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //     required: true,
      //     validator: statusValidator,
      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {
      //     console.log(args.dataContext.tr_um);
      //     this.itemsService.getBy({ pt_part: args.dataContext.tr_part }).subscribe((resp: any) => {
      //       if (args.dataContext.tr_um == resp.data.pt_um) {
      //         this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_um_conv: 1 });
      //       } else {
      //         //console.log(resp.data.pt_um)

      //         this.mesureService.getBy({ um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part }).subscribe((res: any) => {
      //           console.log(res);
      //           const { data } = res;

      //           if (data) {
      //             //alert ("Mouvement Interdit Pour ce Status")
      //             this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_um_conv: res.data.um_conv });
      //             this.angularGrid.gridService.highlightRow(1, 1500);
      //           } else {
      //             this.mesureService.getBy({ um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part }).subscribe((res: any) => {
      //               console.log(res);
      //               const { data } = res;
      //               if (data) {
      //                 //alert ("Mouvement Interdit Pour ce Status")
      //                 this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_um_conv: res.data.um_conv });
      //               } else {
      //                 this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_um_conv: "1", tr_um: null });

      //                 alert("UM conversion manquante");
      //               }
      //             });
      //           }
      //         });
      //       }
      //     });
      //   },
      // },

      // {
      //   id: "mvidlot",
      //   field: "cmvidlot",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.row_number = args.row;
      //     let element: HTMLElement = document.getElementById("openUmsGrid") as HTMLElement;
      //     element.click();
      //   },
      // },
      // {
      //   id: "tr_um_conv",
      //   name: "Conv UM",
      //   field: "tr_um_conv",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   // editor: {
      //   //     model: Editors.float,
      //   //},
      // },

      {
        id: "tr_price",
        name: "Prix unitaire",
        field: "tr_price",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
        formatter: Formatters.decimal,
      },
      // {
      //   id: "tr_site",
      //   name: "Site",
      //   field: "tr_site",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {
      //     this.siteService.getByOne({ si_site: args.dataContext.tr_site }).subscribe((response: any) => {
      //       console.log(response.data);

      //       if (response.data) {
      //         this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_site: response.data.si_site });
      //       } else {
      //         this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_site: null });

      //         // this.gridService.onItemUpdated;
      //         alert("Site N'existe pas");
      //       }
      //     });
      //   },
      // },
      // {
      //   id: "mvids",
      //   field: "cmvids",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.row_number = args.row;
      //     let element: HTMLElement = document.getElementById("openSitesGrid") as HTMLElement;
      //     element.click();
      //   },
      // },
      {
        id: "tr_loc",
        name: "Emplacement",
        field: "tr_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_loc);

          this.locationService.getByOne({ loc_loc: args.dataContext.tr_loc, loc_site: args.dataContext.tr_site }).subscribe((response: any) => {
            this.location = response.data;
            if (response.data) {
              this.inventoryStatusService.getAllDetails({ isd_status: this.location.loc_status, isd_tr_type: "RCT-UNP" }).subscribe((resstat: any) => {
                console.log(resstat);
                const { data } = resstat;

                if (data) {
                  this.stat = '';
                } else {
                  this.stat = this.location.loc_status;
                }
                this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_status: this.stat });
              });
            } else {
              alert("Emplacement Nexiste pas");
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_loc: null, tr_status: null });
            }
          });
        },
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
          let element: HTMLElement = document.getElementById("openLocsGrid") as HTMLElement;
          element.click();
        },
      },
 
     
      {
        id: "tr_grade",
        name: "Notaire",
        field: "tr_grade",
        sortable: true,
        width: 180,
        filterable: false,
        editor:{model:Editors.text}
      },
      // {
      //   id: "tr_ref",
      //   name: "N° Palette",
      //   field: "tr_ref",
      //   sortable: false,

      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //   },
      // },
      // {
      //   id: "tr_status",
      //   name: "Status",
      //   field: "tr_status",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //     required: true,
      //     validator: statusValidator,
      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {
      //     console.log(args.dataContext.tr_status);

      //     this.inventoryStatusService.getBy({ is_status: args.dataContext.tr_status }).subscribe((ress: any) => {
      //       console.log(ress.data.inventoryStatus);
      //       if (ress.data.inventoryStatus) {
      //         this.inventoryStatusService.getAllDetails({ isd_status: args.dataContext.tr_status, isd_tr_type: "RCT-UNP" }).subscribe((res: any) => {
      //           console.log(res);
      //           const { data } = res;

      //           if (data) {
      //             alert("Mouvement Interdit Pour ce Status");
      //             this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_status: null });
      //           } else {
      //             let obj = {};
      //             obj = {
      //               ld_site: args.dataContext.tr_site,
      //               ld_loc: args.dataContext.tr_loc,
      //               ld_part: args.dataContext.tr_part,
      //               ld_lot: args.dataContext.tr_serial,
      //             };
      //             status = args.dataContext.tr_status;
      //             console.log(status);
      //             this.locationDetailService.getByStatus({ obj, status }).subscribe((response: any) => {
      //               console.log(response.data.length != 0);
      //               if (response.data.length != 0) {
      //                 this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_status: null });
      //                 alert("lot existe avec un autre status");
      //               } else {
      //                 console.log("here");
      //               }
      //             });
      //           }
      //         });
      //       } else {
      //         this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_status: null });
      //         alert("Status N' existe pas");
      //       }
      //     });
      //   },
      // },
      // {
      //   id: "mvidlot",
      //   field: "cmvidlot",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.row_number = args.row;
      //     let element: HTMLElement = document.getElementById("openStatussGrid") as HTMLElement;
      //     element.click();
      //   },
      // },
      // {
      //   id: "tr_expire",
      //   name: "Expire",
      //   field: "tr_expire",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.dateIso,
      //   editor: {
      //     model: Editors.date,
      //   },
      // },
      // {
      //   id: "id",
      //   field: "id",
      //   excludeFromHeaderMenu: true,
      //   formatter: (row, cell, value, columnDef, dataContext) => {
      //     // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
      //     return `
      //       <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette">
      //            <i class="flaticon2-printer"></i>
                 
      //        </a>
      //        `;
      //   },
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     // if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
      //     //   this.angularGrid.gridService.deleteItem(args.dataContext);
      //     // }
      //     if (args.dataContext.tr_part != null && args.dataContext.tr_qty_loc != null && args.dataContext.tr_loc != null && args.dataContext.tr_site != null && (args.dataContext.tr_ref == null || args.dataContext.tr_ref == "")) {
      //       const controls = this.trForm.controls;
       
      //       const _lb = new Label();
      //       _lb.lb__dec01 = args.dataContext.tr_line,
      //       _lb.lb_site = args.dataContext.tr_site;
      //       _lb.lb_rmks = controls.tr_rmks.value;
      //       _lb.lb_loc = args.dataContext.tr_loc;
      //       _lb.lb_part = args.dataContext.tr_part;
      //       _lb.lb_nbr = args.dataContext.tr_so_job; //this.trnbr
      //       _lb.lb_lot = args.dataContext.tr_serial;
      //       _lb.lb_date = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
      //       _lb.lb_qty = args.dataContext.tr_qty_loc;
      //       _lb.lb_um = args.dataContext.tr_um;
      //       _lb.lb_ld_status = args.dataContext.tr_status;
      //       _lb.lb_desc = args.dataContext.desc;
      //       _lb.lb_printer = this.PathPrinter;
      //       _lb.lb_cust = this.provider.ad_name;
      //       _lb.lb_grp = this.employeGrp;
      //       _lb.lb_addr = this.provider.ad_line1;
      //       _lb.lb_tel = this.provider.ad_phone;
      //       let lab = null;
      //       console.log(_lb)
      //       this.labelService.add(_lb).subscribe(
      //         (reponse: any) => (lab = reponse.data),
      //         (error) => {
      //           alert("Erreur Impression Etiquette");
      //         },
      //         () => {
      //           this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: lab.lb_ref });
      //         }
      //       );
      //     } else {
      //       alert("Veuillez verifier les informations");
      //     } 
      //   },
      // },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      enableAutoResize: true,
      autoHeight: false,
      autoCommitEdit:true,
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
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    
    this.user = JSON.parse(localStorage.getItem("user"));
    this.currentPrinter = this.user.usrd_dft_printer;
    this.printerService.getByPrinter({printer_code:this.currentPrinter}).subscribe(
      (reponse: any) => (this.PathPrinter = reponse.data.printer_path, console.log(this.PathPrinter)),
      (error) => {
        alert("Erreur de récupération path");
      }
    
    );
    this.employeService.getByOne({emp_userid: this.user.usrd_code}).subscribe(
      (reponse: any) => (this.employeGrp = reponse.data.emp_shift, console.log(this.employeGrp)),
      (error) => {
        alert("Erreur Employe Shift");
      },
     
    );
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.domain);

    this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
      (reponse: any) => {
        if(reponse.data != null) {   
          console.log("hahahahahahahaha", reponse.data)
          this.domconfig = true
          this.prodligne = reponse.data.code_cmmt.split(",")
          this.dsgn_grp  = reponse.data.code_desc.split(",")
        } else  {
          this.domconfig = false
        }
      },  
          
      (error) => {
       this.domconfig = false      },
     
    );
    this.createForm();
    console.log(this.PathPrinter)
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    
    
    this.inventoryTransaction = new InventoryTransaction();
    const date = new Date();
    this.trForm = this.trFB.group({
      tr_nbr: [this.inventoryTransaction.tr_nbr],
      tr_effdate: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      tr_so_job: [this.inventoryTransaction.tr_so_job],
      tr_addr:[this.inventoryTransaction.tr_addr],
      tr_rmks: [this.inventoryTransaction.tr_rmks],
      tr_site: [this.inventoryTransaction.tr_site],
      printer :  [this.user.usrd_dft_printer],
      print: [true],
    });
    const controls = this.trForm.controls;
    controls.tr_addr.setValue('INV'),
    
    console.log(this.domconfig)
    // if(this.domconfig) {
      this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
        (reponse: any) => { 
          if(reponse.data != null) {
          controls.tr_addr.setValue(reponse.data.code_value),
          controls.tr_addr.disable() 

          this.addressService.getBy({ ad_addr: reponse.data.code_value }).subscribe((response: any) => {
            //   const { data } = response;
               console.log("aaaaaaaaaaa",response.data);
               if (response.data != null) {
                 this.provider = response.data[0];
               }
             });
          console.log("hehehehehehehehehehe")
          this.addressService.getBy({ ad_addr: controls.tr_addr.value }).subscribe((response1: any) => {
            //   const { data } = response;
               console.log(response1.data);
               if (response1.data == null) {
                 this.layoutUtilsService.showActionNotification("cette Adresse n'existe pas!", MessageType.Create, 10000, true, true);
                 this.error = true;
               }
               else {this.provider = response1.data[0]}
             });
          }
        },
        (error) => {
       
        },
       
      );

    // }
  }

  createnbrForm() {
    this.loadingSubject.next(false);
    
    
    this.nbrForm = this.nbrFB.group({
      nbrligne: [1],
    });
  }
  onChangeVend() {
    const controls = this.trForm.controls;
    this.siteService.getBy({ si_site: controls.tr_site.value }).subscribe((response: any) => {
   //   const { data } = response;
      console.log(response.data);
      if (response.data == null) {
        this.layoutUtilsService.showActionNotification("cette Adresse n'existe pas!", MessageType.Create, 10000, true, true);
        this.error = true;
      } else {
        this.provider = response.data[0];
      }
      
    });
  }
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    document.getElementById("button").removeAttribute("disabled");
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.trForm.controls;
    const button = document.getElementById("button");
    /** check form */
    button.setAttribute("disabled", "");

    if (this.trForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide";
      this.hasFormErrors = true;

      return;
    }
    for (var i = 0; i < this.dataset.length; i++) {
      console.log(this.dataset[i]);
      if (this.dataset[i].tr_part == "" || this.dataset[i].tr_part == null) {
        this.message = "L' article ne peut pas etre vide";
        this.hasFormErrors = true;
        return;
      }
      if (this.dataset[i].tr_site == "" || this.dataset[i].tr_site == null) {
        this.message = "Le Site ne peut pas etre vide";
        this.hasFormErrors = true;
        return;
      }
      if (this.dataset[i].tr_loc == "" || this.dataset[i].tr_loc == null) {
        this.message = "L' Emplacement ne peut pas etre vide";
        this.hasFormErrors = true;
        return;
      }
      if (this.dataset[i].tr_um == "" || this.dataset[i].tr_um == null) {
        this.message = "L' UM ne peut pas etre vide";
        this.hasFormErrors = true;
        return;
      }
      if (this.dataset[i].tr_status == "" || this.dataset[i].tr_status == null) {
        this.message = "Le Status ne peut pas etre vide";
        this.hasFormErrors = true;
        return;
      }
      if (this.dataset[i].tr_qty_loc == 0) {
        this.message = "La Quantite ne peut pas etre 0";
        this.hasFormErrors = true;
        return;
      }
    }
    
    console.log(this.domconfig)
    // if(this.domconfig) {
      this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
        (reponse: any) => { 
          if(reponse.data != null) {
          controls.tr_addr.setValue(reponse.data.code_value),
          controls.tr_addr.disable() 

          this.addressService.getBy({ ad_addr: reponse.data.code_value }).subscribe((response: any) => {
            //   const { data } = response;
               console.log("aaaaaaaaaaa",response.data);
               if (response.data != null) {
                 this.provider = response.data[0];
               }
             });
          console.log("hehehehehehehehehehe")
          }
        },
        (error) => {
       
        },
       
      );
  
      this.sequenceService.getByOne({ seq_type: "RN", seq_profile: this.user.usrd_profile }).subscribe((response: any) => {
        this.seq = response.data;
  
        if (this.seq) {
          this.trlot = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val) + 1}`;
  
          this.sequenceService.update(this.seq.id, { seq_curr_val: Number(this.seq.seq_curr_val) + 1 }).subscribe(
            (reponse) => console.log("response", Response),
            (error) => {
              this.message = "Erreur modification Sequence";
              this.hasFormErrors = true;
              return;
            }
          );
  
          let tr = this.prepare();
          this.addIt(this.dataset, tr, this.trlot);
      
        } else {
          this.message = "Parametrage Manquant pour la sequence";
          this.hasFormErrors = true;
          return;
        }
      });
  
   
   
  }

  prepare() {
    const controls = this.trForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = controls.tr_nbr.value;

    _tr.tr_effdate = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
    _tr.tr_so_job = controls.tr_so_job.value;
    _tr.tr_addr = controls.tr_addr.value;
    _tr.tr_rmks = controls.tr_rmks.value;
    _tr.tr_site = controls.tr_site.value;

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
  addIt(detail: any, it, nlot) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
    }
    this.loadingSubject.next(true);
    const controls = this.trForm.controls;

    this.inventoryTransactionService.addRCTUNP({ detail, it, nlot }).subscribe(
      (reponse: any) => {
        console.log(reponse);
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
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        if (controls.print.value == true) this.printpdf(nlot); 
        this.router.navigateByUrl("/inventory-transaction/transaction-list");
      }
    );
  }

  /**
   * Go back to the list
   *
   */
  goBack() {
    this.loadingSubject.next(false);
    const url = `/inventory-transaction/transaction-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // add new Item to Datatable
  addNewItem() {
    const controls = this.trForm.controls;
    if(controls.tr_site.value==null){alert('veuillez remplir addresse')}
    else {
    var maxObj = null
    var iddd = 0
    if (this.dataset.length> 0) {
     maxObj = this.dataset.reduce((accumulator, current) => {
      return accumulator.id > current.id ? accumulator : current;
    });
    console.log(maxObj.id + 1)
     iddd = maxObj.id + 1

  } else {
    iddd = 1

  }
   
    this.gridService.addItem(
      {
        id: iddd,
        tr_line: iddd,
        tr_part: "",
        cmvid: "",
        desc: "",
        tr_qty_loc: 1,
        tr_um: "",
        tr_price: 0,
        tr_site: controls.tr_site.value,
        tr_loc: "",
        tr_serial: null,
        tr_ref: null,
        tr_status: null,
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
}
  addsameItem() {
    
    
    const control =this.nbrForm.controls
    const limit = Number(control.nbrligne.value)
    var i = this.nligne
    const maxObj = this.dataset.reduce((accumulator, current) => {
      return accumulator.id > current.id ? accumulator : current;
    });
    console.log(maxObj.id + 1)
    var iddd = maxObj.id + 1
    for (var j = 0; j < limit; j++) {
        
    this.gridService.addItem(
      {
        id: iddd,
        tr_line: iddd,
        tr_part: this.dataset[i - 1].tr_part,
        cmvid: "",
        desc: this.dataset[i - 1].desc,
        tr_qty_loc: this.dataset[i - 1].tr_qty_loc,
        tr_um: this.dataset[i - 1].tr_um,
        tr_um_conv: this.dataset[i - 1].tr_um_conv,

        tr_price: this.dataset[i - 1].tr_price,
        tr_site: this.dataset[i - 1].tr_site,
        tr_loc: this.dataset[i - 1].tr_loc,
        tr_grade: this.dataset[i - 1].tr_grad,
        tr_ref: null,
        tr_status: this.dataset[i - 1].tr_status,
        tr_expire: this.dataset[i - 1].tr_expire,
      },
      { position: "bottom" }
    );
    iddd ++
  }
  this.modalService.dismissAll()
  }
  handleSelectedRowsChanged4(e, args) {
    const controls = this.trForm.controls
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

        this.siteService.getByOne({ si_site: controls.tr_site.value }).subscribe((response: any) => {
          this.location = response.data;

          this.sctService.getByOne({ sct_site: controls.tr_site.value, sct_part: item.pt_part, sct_sim: "STD-CG" }).subscribe((response: any) => {
            this.sct = response.data;

            this.inventoryStatusService.getAllDetails({ isd_status: 'CONFORME', isd_tr_type: "RCT-UNP" }).subscribe((resstat: any) => {
              console.log(resstat);
              const { data } = resstat;

              if (data) {
                this.stat = '';
              } else {
                this.stat = 'CONFORME';
              }

              updateItem.tr_part = item.pt_part;
              updateItem.desc = item.pt_desc1;
              updateItem.tr_um = item.pt_um;
              updateItem.tr_um_conv = 1;
              updateItem.tr_site = controls.tr_site.value;
              updateItem.tr_loc = item.pt_loc;
              updateItem.tr_price = this.sct.sct_mtl_tl;

              updateItem.tr_status = this.stat;
              // if (this.pdl == null) {this.pdl = item.pt_draw }
              this.gridService.updateItem(updateItem);
            });
          });
        });
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
    console.log(this.domconfig)
    // if (this.domconfig == false) {
    this.itemsService.getAll().subscribe((response: any) => (this.items = response.data));
    // }
    // else {
    //   if(this.pdl == null) {
    //   //this.prodligne = ["SQUELETTE", "BOBINE"] 
    //   console.log("houhopuhouhouhou", this.prodligne, this.dsgn_grp)
    //   this.itemsService.getbywithperte({pt_draw: this.prodligne, pt_dsgn_grp: this.dsgn_grp}).subscribe((response: any) => (this.items = response.data));
    //   } else {
    //     this.itemsService.getbywithperte({pt_draw: this.pdl, pt_dsgn_grp: this.dsgn_grp}).subscribe((response: any) => (this.items = response.data));

    //   }
    // }
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChangedsite(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);

        updateItem.tr_site = item.si_site;

        this.gridService.updateItem(updateItem);
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
    this.siteService.getAll().subscribe((response: any) => (this.datasite = response.data));
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

  handleSelectedRowsChangedloc(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        console.log(item);

        this.locationService.getByOne({ loc_loc: item.tr_loc, loc_site: updateItem.tr_site }).subscribe((response: any) => {
          this.location = response.data;
          if (response.data) {
            this.inventoryStatusService.getAllDetails({ isd_status: this.location.loc_status, isd_tr_type: "RCT-UNP" }).subscribe((resstat: any) => {
              console.log(resstat);
              const { data } = resstat;

              if (data) {
                this.stat = null;
              } else {
                this.stat = this.location.loc_status;
              }
              updateItem.tr_loc = item.loc_loc;
              updateItem.tr_status = this.stat;
              this.gridService.updateItem(updateItem);
            });
          } else {
            alert("Emplacement Nexiste pas");
            updateItem.tr_loc = null;
            updateItem.tr_status = null;
            this.gridService.updateItem(updateItem);
          }
        });
      });
    }
  }
  angularGridReadyloc(angularGrid: AngularGridInstance) {
    this.angularGridloc = angularGrid;
    this.gridObjloc = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridloc() {
    this.columnDefinitionsloc = [
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

    this.gridOptionsloc = {
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
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);

    // fill the dataset with your data
    this.locationService.getBy({ loc_site: updateItem.tr_site }).subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc) {
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
  }

  handleSelectedRowsChangedum(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
        const item = this.gridObjum.getDataItem(idx);
        updateItem.tr_um = item.code_value;

        this.gridService.updateItem(updateItem);

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
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.tr_um_conv = res.data.um_conv;
                this.angularGrid.gridService.highlightRow(1, 1500);
              } else {
                this.mesureService.getBy({ um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part }).subscribe((res: any) => {
                  console.log(res);
                  const { data } = res;
                  if (data) {
                    //alert ("Mouvement Interdit Pour ce Status")
                    updateItem.tr_um_conv = res.data.um_conv;
                  } else {
                    updateItem.tr_um_conv = 1;
                    updateItem.tr_um = null;

                    alert("UM conversion manquante");
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
  angularGridReadyum(angularGrid: AngularGridInstance) {
    this.angularGridum = angularGrid;
    this.gridObjum = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridum() {
    this.columnDefinitionsum = [
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

    this.gridOptionsum = {
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
    this.codeService.getBy({ code_fldname: "pt_um" }).subscribe((response: any) => (this.ums = response.data));
  }
  openum(content) {
    this.prepareGridum();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChangedstatus(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjstatus) {
      args.rows.map((idx) => {
        const item = this.gridObjstatus.getDataItem(idx);

        this.inventoryStatusService.getAllDetails({ isd_status: item.is_status, isd_tr_type: "RCT-UNP" }).subscribe((res: any) => {
          console.log(res);
          const { data } = res;

          if (data) {
            alert("Mouvement Interdit Pour ce Status");
          } else {
            updateItem.tr_status = item.is_status;

            this.gridService.updateItem(updateItem);
          }
        });
      });
    }
  }

  angularGridReadystatus(angularGrid: AngularGridInstance) {
    this.angularGridstatus = angularGrid;
    this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridstatus() {
    this.columnDefinitionsstatus = [
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

    this.gridOptionsstatus = {
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
    this.inventoryStatusService.getAll().subscribe((response: any) => (this.statuss = response.data));
    console.log(this.statuss);
  }
  openstatus(content) {
    this.prepareGridstatus();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChanged2(e, args) {
    const controls = this.trForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);

       
        controls.tr_site.setValue(item.si_site || "");
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
        id: "si_site",
        name: "site",
        field: "si_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "si_desc",
        name: "Nom",
        field: "si_desc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      // {
      //   id: "ad_phone",
      //   name: "Numero telephone",
      //   field: "ad_phone",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
      // {
      //   id: "ad_taxable",
      //   name: "A Taxer",
      //   field: "ad_taxable",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
      // {
      //   id: "ad_taxc",
      //   name: "Taxe",
      //   field: "ad_taxc",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      // },
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
    this.siteService.getBy({}).subscribe((response: any) => (this.adresses = response.data));
  }
  open2(content) {

    this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
      (reponse: any) => { 
       if (reponse.data == null) {
        this.prepareGrid2();
        this.modalService.open(content, { size: "lg" }); 
      
       }
        console.log(reponse.data)
      
      },
      (error) => {
        this.prepareGrid2();
        this.modalService.open(content, { size: "lg" }); 
      },
    )
    
  }

  printpdf(nbr) {
    // const controls = this.totForm.controls
    const controlss = this.trForm.controls;
    console.log("pdf");
    var doc = new jsPDF();
    let date = new Date()
   // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image()
    // img.src = "./assets/media/logos/unplanified-recept.png";
    img.src = "./assets/media/logos/companyentete.png";
    doc.addImage(img, 'png', 5, 5, 200, 30)
    doc.setFontSize(9);
    // if (this.domain.dom_name != null) {
    //   doc.text(this.domain.dom_name, 10, 10);
    // }
    // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);

    doc.line(10, 35, 200, 35);
    doc.setFontSize(12);
    doc.text("Bon Récéption N° : " + nbr, 70, 45);
    doc.text("Date: " + date.toLocaleDateString() , 160, 45);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      
     
    doc.setFontSize(8);
    console.log(this.provider)
    doc.text("Fournisseur : " + this.provider.ad_addr, 20, 50);
    doc.text("Nom             : " + this.provider.ad_name, 20, 55);
    doc.text("Adresse       : " + this.provider.ad_line1, 20, 60);
    if (this.provider.ad_misc2_id != null) {
      doc.text("MF          : " + this.provider.ad_misc2_id, 20, 65);
    }
    if (this.provider.ad_gst_id != null) {
      doc.text("RC          : " + this.provider.ad_gst_id, 20, 70);
    }
    if (this.provider.ad_pst_id) {
      doc.text("AI            : " + this.provider.ad_pst_id, 20, 75);
    }
    if (this.provider.ad_misc1_id != null) {
      doc.text("NIS         : " + this.provider.ad_misc1_id, 20, 80);
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
    let total = 0
    for (let j = 0; j < this.dataset.length  ; j++) {
      total = total + Number(this.dataset[j].tr_price) * Number(this.dataset[j].tr_qty_loc)
      
      if ((j % 20 == 0) && (j != 0) ) {
  doc.addPage();
  // img.src = "./assets/media/logos/unplanified-recept.png";
  img.src = "./assets/media/logos/companyentete.png";
  doc.addImage(img, 'png', 5, 5, 200, 30)
        doc.setFontSize(9);
        // if (this.domain.dom_name != null) {
        //   doc.text(this.domain.dom_name, 10, 10);
        // }
        // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(14);
        doc.line(10, 35, 200, 35);

        doc.setFontSize(12);
        doc.text("Bon Récéption N° : " + nbr, 70, 40);
        doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 40);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      
      
        doc.setFontSize(8);
        console.log(this.provider.ad_misc2_id);
        doc.text("Fournisseur : " + this.provider.ad_addr, 20, 50);
        doc.text("Nom             : " + this.provider.ad_name, 20, 55);
        doc.text("Adresse       : " + this.provider.ad_line1, 20, 60);
        if (this.provider.ad_misc2_id != null) {
          doc.text("MF          : " + this.provider.ad_misc2_id, 20, 65);
        }
        if (this.provider.ad_gst_id != null) {
          doc.text("RC          : " + this.provider.ad_gst_id, 20, 70);
        }
        if (this.provider.ad_pst_id) {
          doc.text("AI            : " + this.provider.ad_pst_id, 20, 75);
        }
        if (this.provider.ad_misc1_id != null) {
          doc.text("NIS         : " + this.provider.ad_misc1_id, 20, 80);
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

      if (this.dataset[j].desc.length > 45) {
        let desc1 = this.dataset[j].desc.substring(45);
        let ind = desc1.indexOf(" ");
        desc1 = this.dataset[j].desc.substring(0, 45 + ind);
        let desc2 = this.dataset[j].desc.substring(45 + ind);

        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.dataset[j].tr_qty_loc.toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String((this.dataset[j].tr_price * this.dataset[j].tr_qty_loc).toFixed(2)), 203, i - 1, { align: "right" });
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
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.dataset[j].desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.dataset[j].tr_qty_loc.toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String((this.dataset[j].tr_price * this.dataset[j].tr_qty_loc).toFixed(2)), 203, i - 1, { align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 205, i);
        i = i + 5;
      }
    }

    // doc.line(10, i - 5, 200, i - 5);

    doc.line(130, i + 7, 205, i + 7);
    doc.line(130, i + 14, 205, i + 14);
    //  doc.line(130, i + 21, 200, i + 21 );
    //  doc.line(130, i + 28, 200, i + 28 );
    //  doc.line(130, i + 35, 200, i + 35 );
    doc.line(130, i + 7, 130, i + 14);
    doc.line(160, i + 7, 160, i + 14);
    doc.line(205, i + 7, 205, i + 14);
    doc.setFontSize(10);

    doc.text("Total HT", 140, i + 12, { align: "left" });
    //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
    //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
    //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

    doc.text(String(Number(total).toFixed(2)), 198, i + 12, { align: "right" });
    doc.text("Validé par: " , 20, i + 22);
    doc.text("Note: " , 20, i + 32);
    //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
    //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
    //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

    doc.setFontSize(8);
    let mt = NumberToLetters(Number(total).toFixed(2), "Dinars Algerien");

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
  handleSelectedRowsChangedprinter(e, args) {
    const controls = this.trForm.controls;

    if (Array.isArray(args.rows) && this.gridObjprinter) {
      args.rows.map((idx) => {
        const item = this.gridObjprinter.getDataItem(idx);
        console.log(item)
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

  opennbrligne(content) {
    this.createnbrForm();
    this.modalService.open(content, { size: "lg" });
  }

  // openpart() {
  //   //this.modalService.open(content, { size: "xl" });
  //   this.currentDialog = this.modalService.open(CreateComponent, {centered: true,size: "xl"});
  // }
  vendorlist() {
    
      
    const url = `/providers/list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  stklist() {
  
    
    const url = `/inventory-transaction/inventory-list`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  
  caisse() {
  
    
    const url = `/purchasing/payment-au`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  
  }
  handleSelectedRowsChangedvend(e, args) {
    const controls = this.trForm.controls;
    if (Array.isArray(args.rows) && this.gridObjvend) {
      args.rows.map((idx) => {
        const item = this.gridObjvend.getDataItem(idx);

        this.provider = item;
        controls.tr_addr.setValue(item.ad_addr || "");
        this.nom = item.ad_name;
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
    };

    // fill the dataset with your data
    this.addressService.getBy({ad_type:'vendor'}).subscribe((response: any) => (this.vends = response.data));
  }
  openvend(content) {
    this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
      (reponse: any) => {
        if (reponse.data == null || reponse.data.code_value != ' ') {
          this.prepareGridvend();
          this.modalService.open(content, { size: "lg" });
        }
        console.log(reponse.data);
      },
      (error) => {
        this.prepareGridvend();
        this.modalService.open(content, { size: "lg" });
      }
    );
  }
}
