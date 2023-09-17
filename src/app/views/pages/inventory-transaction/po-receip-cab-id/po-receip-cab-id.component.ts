import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

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
import { PurchaseOrderService, ProviderService, ItemService, AddressService, TaxeService, DeviseService, VendorProposal, InventoryTransaction, PurchaseReceive, Label, LabelService, InventoryTransactionService, PurchaseReceiveService, LocationService, SiteService, MesureService, SequenceService, LocationDetailService, CodeService, InventoryStatusService, printReceive, PrintersService } from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";

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
  selector: "kt-po-receip-cab-id",
  templateUrl: "./po-receip-cab-id.component.html",
  styleUrls: ["./po-receip-cab-id.component.scss"],
})
export class PoReceipCabIdComponent implements OnInit {
  purchaseReceive: PurchaseReceive;
  inventoryTransaction: InventoryTransaction;
  prhForm: FormGroup;
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

  pos: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  devises: [];
  columnDefinitionscurr: Column[] = [];
  gridOptionscurr: GridOption = {};
  gridObjcurr: any;
  angularGridcurr: AngularGridInstance;

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

  datalocdet: [];
  columnDefinitionslocdet: Column[] = [];
  gridOptionslocdet: GridOption = {};
  gridObjlocdet: any;
  angularGridlocdet: AngularGridInstance;
  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  site: String;
  currentPrinter: string;
  row_number;
  message = "";
  prhServer;
  location: any;
  datasetPrint = [];
  seq: any;
  user;
  prhnbr: String;
  stat: String;
  lddet: any;
  poEdit: any;
  address: any;
  details: any[];
  domain;
  dataprinter: [];

  columnDefinitionsprinter: Column[] = [];

  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;
  angularGridprinter: AngularGridInstance;
  constructor(config: NgbDropdownConfig, private prhFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private modalService: NgbModal, private layoutUtilsService: LayoutUtilsService, private providersService: ProviderService, private purchaseReceiveService: PurchaseReceiveService, private inventoryTransactionService: InventoryTransactionService, private purchaseOrderService: PurchaseOrderService, private poService: PurchaseOrderService, private addressService: AddressService, private itemsService: ItemService, private codeService: CodeService, private siteService: SiteService, private mesureService: MesureService, private locationDetailService: LocationDetailService, private deviseService: DeviseService, private taxService: TaxeService, private sequenceService: SequenceService, private inventoryStatusService: InventoryStatusService, private locationService: LocationService, private labelService: LabelService, private printerService: PrintersService) {
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
          this.addsameItem(args.dataContext.id);
        },
      },

      {
        id: "prh_line",
        name: "Ligne",
        field: "prh_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      {
        id: "prh_part",
        name: "Article",
        field: "prh_part",
        sortable: true,
        width: 50,
        filterable: false,
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
        id: "qty_received",
        name: "QTE OA Récept",
        field: "qty_received",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
      },
      {
        id: "prh_rcvd",
        name: "QTE A Récep",
        field: "prh_rcvd",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 },
        },
      },
      {
        id: "prh_um",
        name: "UM",
        field: "prh_um",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.prh_um);
          this.itemsService.getBy({ pt_part: args.dataContext.prh_part }).subscribe((resp: any) => {
            if (args.dataContext.prh_um == resp.data.pt_um) {
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_um_conv: 1 });
            } else {
              //console.log(resp.data.pt_um)

              this.mesureService.getBy({ um_um: args.dataContext.prh_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.prh_part }).subscribe((res: any) => {
                console.log(res);
                const { data } = res;

                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_um_conv: res.data.um_conv });
                  this.angularGrid.gridService.highlightRow(1, 1500);
                } else {
                  this.mesureService.getBy({ um_um: resp.data.pt_um, um_alt_um: args.dataContext.prh_um, um_part: args.dataContext.prh_part }).subscribe((res: any) => {
                    console.log(res);
                    const { data } = res;
                    if (data) {
                      //alert ("Mouvement Interdit Pour ce Status")
                      this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_um_conv: res.data.um_conv });
                    } else {
                      this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_um_conv: "1", prh_um: null });

                      alert("UM conversion manquante");
                    }
                  });
                }
              });
            }
          });
        },
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
          let element: HTMLElement = document.getElementById("openUmsGrid") as HTMLElement;
          element.click();
        },
      },
      {
        id: "prh_um_conv",
        name: "Conv UM",
        field: "prh_um_conv",
        sortable: true,
        width: 80,
        filterable: false,
        // editor: {
        //     model: Editors.float,
        //},
      },
      {
        id: "prh_pur_cost",
        name: "Prix unitaire",
        field: "prh_pur_cost",
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
      /*{
        id: "prh_site",
        name: "Site",
        field: "prh_site",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {

          this.siteService.getByOne({ si_site: args.dataContext.prh_site,}).subscribe(
            (response: any) => {
              
          console.log(response.data)

                if (response.data) {
                  
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , prh_site: response.data.si_site})
                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , prh_site: null});
    
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
      */
      {
        id: "prh_loc",
        name: "Emplacement",
        field: "prh_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,
        },

        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.prh_loc);

          const controls = this.prhForm.controls;
          this.locationService.getByOne({ loc_loc: args.dataContext.prh_loc, loc_site: controls.prh_site.value }).subscribe((response: any) => {
            this.location = response.data;
            if (response.data) {
              this.locationDetailService.getBy({ ld_site: controls.prh_site.value, ld_loc: args.dataContext.prh_loc, ld_part: args.dataContext.prh_part, ld_lot: null }).subscribe((response: any) => {
                this.lddet = response.data;
                console.log(this.lddet[0].ld_qty_oh);

                this.inventoryStatusService.getAllDetails({ isd_status: this.location.loc_status, isd_prh_type: "RCT-PO" }).subscribe((resstat: any) => {
                  console.log(resstat);
                  const { data } = resstat;

                  if (data) {
                    this.stat = null;
                  } else {
                    this.stat = this.location.loc_status;
                  }
                  this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_status: this.stat });
                });
              });
            } else {
              alert("Emplacement Nexiste pas");
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_loc: null, qty_oh: 0, prh_status: null });
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
        id: "prh_serial",
        name: "Lot/Serie",
        field: "prh_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.prhForm.controls;
          this.locationDetailService.getBy({ ld_site: controls.prh_site.value, ld_loc: args.dataContext.prh_loc, ld_part: args.dataContext.prh_part, ld_lot: args.dataContext.prh_serial }).subscribe((response: any) => {
            this.lddet = response.data;

            console.log(response.data.length);
            if (response.data.length != 0) {
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_status: this.lddet[0].ld_status, tr_expire: this.lddet[0].tr_expire });
            }
          });
        },
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
          let element: HTMLElement = document.getElementById("openLocdetsGrid") as HTMLElement;
          element.click();
        },
      },
      {
        id: "prh_vend_lot",
        name: "Lot Fournisseur",
        field: "prh_vend_lot",
        sortable: true,
        width: 80,
        filterable: false,

        editor: {
          model: Editors.text,
        },
      },

      {
        id: "tr_status",
        name: "Status",
        field: "tr_status",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "tr_expire",
        name: "Expire",
        field: "tr_expire",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        editor: {
          model: Editors.date,
        },
      },
      {
        id: "tr_ref",
        name: "N° Palette",
        field: "tr_ref",
        sortable: false,

        filterable: false,
        // editor: {
        //     model: Editors.float,
        //},
      },
      {
        id: "id",
        field: "id",
        excludeFromHeaderMenu: true,
        formatter: (row, cell, value, columnDef, dataContext) => {
          // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          return `
          <a class="btn btn-sm btn-clean btn-icon mr-2" title="Impression Etiquette">
               <i class="flaticon2-printer"></i>
               
           </a>
           `;
        },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          // if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //   this.angularGrid.gridService.deleteItem(args.dataContext);
          // }
          if (args.dataContext.prh_part != null && args.dataContext.prh_rcvd != null && args.dataContext.prh_loc != null) {
            const controls = this.prhForm.controls;
            const _lb = new Label();
            _lb.lb_site = controls.prh_site.value;
            _lb.lb_rmks = controls.prh_rmks.value;
            _lb.lb_loc = args.dataContext.prh_loc;
            _lb.lb_part = args.dataContext.prh_part;
            _lb.lb_nbr = this.prhnbr;
            _lb.lb_lot = args.dataContext.prh_serial;
            _lb.lb_date = controls.prh_rcp_date.value ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}` : null;
            _lb.lb_qty = args.dataContext.prh_rcvd;
            _lb.lb_ld_status = args.dataContext.tr_status;
            _lb.lb_desc = args.dataContext.desc;

            let lab = null;

            this.labelService.add(_lb).subscribe(
              (reponse: any) => (lab = reponse.data),
              (error) => {
                alert("Erreur Impression Etiquette");
              },
              () => {
                this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: lab.lb_ref });
              }
            );
          } else {
            alert("Veuillez verifier les informations");
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
    // this.loading$ = this.loadingSubject.asObservable();
    // this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user.usrd_site == "*") {
      this.site = null;
    } else {
      this.site = this.user.usrd_site;
    }
    this.domain = JSON.parse(localStorage.getItem("domain"));
    //const controls = this.prhForm.controls
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(true);
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      this.poService.getOne(id).subscribe((response: any) => {
        (this.poEdit = response.data.purchaseOrder), (this.details = response.data.details);
        console.log(this.poEdit);
        // this.addressService.getBy({ad_addr: this.poEdit.po_vend}).subscribe(
        //   (resp: any) => {this.address = resp.data
        this.createForm();
        // controls.prh_nbr.setValue(this.poEdit.po_nbr)
        this.initGrid();
        const { purchaseOrder, details } = response.data;
        const det1 = details;
        this.dataset = [];
        for (const object in det1) {
          console.log(details[object]);
          const detail = details[object];
          // console.log(det)
          var i = 0;

          this.locationService.getByOne({ loc_loc: detail.item.pt_loc, loc_site: detail.item.pt_site }).subscribe((respon: any) => {
            this.location = respon.data;
            // console.log( this.location.loc_status)
            if (this.location == null) {
              this.stat = null;
            } else {
              this.stat = this.location.loc_status;
            }
            this.gridService.addItem(
              {
                id: this.dataset.length + 1,
                prh_line: this.dataset.length + 1,
                prh_part: detail.pod_part,
                cmvid: "",
                desc: detail.item.pt_desc1,
                qty_received: detail.pod_qty_rcvd,
                prh_rcvd: detail.pod_qty_ord - detail.pod_qty_rcvd,
                prh_um: detail.item.pt_um,
                prh_um_conv: 1,
                prh_pur_cost: detail.pod_price,
                prh_disc_pct: detail.pod_disc_pct,
                prh_taxable: detail.pod_taxable,
                prh_taxc: detail.pod_taxc,
                prh_tax_code: detail.pod_tax_code,
                //prh_site: detail.item.pt_site,
                prh_loc: detail.item.pt_loc,
                prh_serial: null,
                tr_status: this.stat,
                prh_vend_lot: null,
                tr_expire: null,
              },
              { position: "bottom" }
            );
          });
          i = i + 1;
        }
        this.loadingSubject.next(false);

        //  })
      });
    });
    // this.createForm();
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.inventoryTransaction = new InventoryTransaction();
    this.purchaseReceive = new PurchaseReceive();
    const date = new Date();
    console.log(this.poEdit.po_nbr);
    this.prhForm = this.prhFB.group({
      prh_receiver: [null],
      prh_nbr: [{ value: this.poEdit.po_nbr }],
      prh_vend: [this.poEdit.po_vend],
      name: [""],
      prh_rcp_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      prh_xinvoice: [this.purchaseReceive.prh_xinvoice],
      prh_curr: [this.poEdit.po_curr],
      prh_site: [this.site, Validators.required],
      prh_ex_rate: [this.poEdit.po_ex_rate],
      prh_ex_rate2: [this.poEdit.po_ex_rate2],

      prh_rmks: [this.poEdit.po_rmks],
      print: [true],
    });
    const controls = this.prhForm.controls;
    this.addressService.getBy({ ad_addr: this.poEdit.po_vend }).subscribe((resp: any) => {
      this.address = resp.data;
      this.provider = resp.data;

      controls.name.setValue(this.address.ad_name);
    });
    this.loadingSubject.next(false);

    // const controls = this.prhForm.controls
    this.sequenceService.getByOne({ seq_type: "PR", seq_profile: this.user.usrd_profile }).subscribe((response: any) => {
      this.seq = response.data;
      console.log(this.seq);
      if (this.seq) {
        this.prhnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val) + 1}`;
        console.log(this.seq.seq_prefix);
        console.log(this.seq.seq_curr_val);

        console.log(this.prhnbr);
        const id = Number(this.seq.id);
        let obj = {};
        obj = {
          seq_curr_val: Number(this.seq.seq_curr_val) + 1,
        };
        this.sequenceService.update(id, obj).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
            this.message = "Erreur modification Sequence";
            this.hasFormErrors = true;
            return;
          }
        );
        console.log("prhnumber", this.prhnbr);
        controls.prh_receiver.setValue(this.prhnbr);
      } else {
        this.message = "Parametrage Monquant pour la sequence";
        this.hasFormErrors = true;
        return;
      }

      // tslint:disable-next-line:prefer-const
    });
  }
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.prhForm.controls;
    /** check form */
    if (this.prhForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }

    // this.sequenceService.getByOne({ seq_type: "PR", seq_profile: this.user.usrd_profile }).subscribe(
    //   (response: any) => {
    // this.seq = response.data
    // console.log(this.seq)
    //     if (this.seq) {
    //      this.prhnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
    //      console.log(this.seq.seq_prefix)
    //      console.log(this.seq.seq_curr_val)

    //     console.log(this.prhnbr)
    //      const id = Number(this.seq.id)
    //   let obj = { }
    //   obj = {
    //     seq_curr_val: Number(this.seq.seq_curr_val )+1
    //   }
    //   this.sequenceService.update(id , obj ).subscribe(
    //     (reponse) => console.log("response", Response),
    //     (error) => {
    //       this.message = "Erreur modification Sequence";
    //       this.hasFormErrors = true;
    //       return;

    //     },
    //     )
    //   }else {
    //     this.message = "Parametrage Monquant pour la sequence";
    //     this.hasFormErrors = true;
    //     return;

    //    }

    // tslint:disable-next-line:prefer-const
    let pr = this.prepare();
    this.addIt(this.dataset, pr, this.prhnbr);
    //  })

    // tslint:disable-next-line:prefer-const
    // let pr = this.prepare()
    //this.addIt( this.dataset,pr);
  }

  prepare() {
    const controls = this.prhForm.controls;
    const _pr = new PurchaseReceive();
    _pr.prh_nbr = controls.prh_nbr.value;
    _pr.prh_receiver = controls.prh_receiver.value;

    _pr.prh_vend = controls.prh_vend.value;
    _pr.prh_rcp_date = controls.prh_rcp_date.value ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}` : null;
    _pr.prh_xinvoice = controls.prh_xinvoice.value;
    _pr.prh_curr = controls.prh_curr.value;
    _pr.prh_site = controls.prh_site.value;
    _pr.prh_ex_rate = controls.prh_ex_rate.value;
    _pr.prh_ex_rate2 = controls.prh_ex_rate2.value;
    _pr.prh_rmks = controls.prh_rmks.value;
    return _pr;
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
  addIt(detail: any, pr, prhnbr) {
    for (let data in detail) {
      delete this.dataset[data].id;
      delete this.dataset[data].cmvid;
    }
    this.loadingSubject.next(true);

    const controls = this.prhForm.controls;
    let poNbr = 0;
    this.purchaseReceiveService.addCab({ detail, pr, prhnbr }).subscribe(
      (reponse: any) => (poNbr = reponse.data),
      (error) => {
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        console.log(this.provider, poNbr, this.dataset);
        if (controls.print.value == true) this.printpdf(poNbr);
        this.router.navigateByUrl("/");
      }
    );
  }
  onChangesite() {
    const controls = this.prhForm.controls;
    const si_site = controls.prh_site.value;

    this.siteService.getByOne({ si_site }).subscribe((res: any) => {
      if (!res.data) {
        alert("Site n'existe pas  ");
        controls.prh_site.setValue(null);
        document.getElementById("prh_site").focus();
      } else {
        if (this.user.usrd_site != "*" && si_site != this.user.usrd_site) {
          alert("Site n'est pas autorisé pour cet utilisateur ");
          controls.prh_site.setValue(null);
          document.getElementById("prh_site").focus();
        }
      }
    });
  }

  onChangeOA() {
    this.dataset = [];
    const controls = this.prhForm.controls;
    const po_nbr = controls.prh_nbr.value;

    this.purchaseOrderService.findBy({ po_nbr }).subscribe((res: any) => {
      const { purchaseOrder, details } = res.data;
      const det1 = details;
      this.prhServer = purchaseOrder;

      controls.prh_vend.setValue(this.prhServer.po_vend);
      controls.prh_curr.setValue(this.prhServer.po_curr);
      controls.prh_ex_rate.setValue(this.prhServer.po_ex_rate);
      controls.prh_ex_rate2.setValue(this.prhServer.po_ex_rate2);
      const ad_addr = this.prhServer.po_vend;
      console.log(ad_addr);
      this.addressService.getBy({ ad_addr: ad_addr }).subscribe((response: any) => {
        this.provider = response.data;

        controls.name.setValue(this.provider.ad_name);

        for (const object in det1) {
          console.log(details[object]);
          const detail = details[object];
          this.locationService.getByOne({ loc_loc: detail.item.pt_loc, loc_site: detail.item.pt_site }).subscribe((response: any) => {
            this.location = response.data;
            console.log(this.location);
            if (this.location == null) {
              this.stat = null;
            } else {
              this.stat = this.location.loc_status;
            }

            this.gridService.addItem(
              {
                id: this.dataset.length + 1,
                prh_line: this.dataset.length + 1,
                prh_part: detail.pod_part,
                cmvid: "",
                desc: detail.item.pt_desc1,
                qty_received: detail.pod_qty_rcvd,
                prh_rcvd: detail.pod_qty_ord - detail.pod_qty_rcvd,
                prh_um: detail.item.pt_um,
                prh_taxable: detail.pod_taxable,
                prh_taxc: detail.pod_taxc,
                prh_tax_code: detail.pod_tax_code,
                prh_um_conv: 1,
                prh_pur_cost: detail.pod_price,

                //prh_site: detail.item.pt_site,
                prh_loc: detail.item.pt_loc,
                prh_serial: "",
                tr_status: this.stat,
                prh_vend_lot: "",
                tr_expire: null,
              },
              { position: "bottom" }
            );
            this.datasetPrint.push({
              id: this.dataset.length + 1,
              prh_line: this.dataset.length + 1,
              prh_part: detail.pod_part,
              cmvid: "",
              desc: detail.item.pt_desc1,
              qty_received: detail.pod_qty_rcvd,
              prh_rcvd: detail.pod_qty_ord,
              prh_taxable: detail.pod_taxable,
              prh_taxc: detail.pod_taxc,
              prh_tax_code: detail.pod_tax_code,

              prh_um: detail.item.pt_um,
              prh_um_conv: 1,
              prh_pur_cost: detail.pod_price,
              //prh_site: detail.item.pt_site,
              prh_loc: detail.item.pt_loc,
              prh_serial: "",
              tr_status: this.stat,
              prh_vend_lot: "",
              tr_expire: null,
            });
          });
        }
      });
    });
  }

  changeCurr() {
    const controls = this.prhForm.controls; // chof le champs hada wesh men form rah
    const cu_curr = controls.po_curr.value;
    this.deviseService.getBy({ cu_curr }).subscribe(
      (res: any) => {
        const { data } = res;
        console.log(res);
        if (!data) {
          this.layoutUtilsService.showActionNotification("cette devise n'existe pas", MessageType.Create, 10000, true, true);
          this.error = true;
        } else {
          this.error = false;
        }
      },
      (error) => console.log(error)
    );
  }
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
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        prh_line: this.dataset.length + 1,
        prh_part: null,
        cmvid: "",
        desc: null,
        qty_received: 0,
        prh_rcvd: 0,
        prh_um: null,
        prh_um_conv: 1,
        prh_pur_cost: 0,
        // prh_site: "",
        prh_loc: null,
        prh_serial: null,
        tr_status: null,
        prh_vend_lot: null,
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  addsameItem(i) {
    console.log(i);
    console.log(this.dataset);
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        prh_line: this.dataset.length + 1,
        prh_part: this.dataset[i - 1].prh_part,
        cmvid: "",
        desc: this.dataset[i - 1].desc,
        qty_received: this.dataset[i - 1].qty_received,
        prh_rcvd: 0,
        prh_taxable: this.dataset[i - 1].pod_taxable,
        prh_taxc: this.dataset[i - 1].pod_taxc,
        prh_tax_code: this.dataset[i - 1].pod_tax_code,

        prh_um: this.dataset[i - 1].prh_um,
        prh_um_conv: this.dataset[i - 1].prh_um_conv,
        prh_pur_cost: this.dataset[i - 1].prh_pur_cost,
        // prh_site: this.dataset[i - 1].prh_site,
        prh_loc: this.dataset[i - 1].prh_loc,
        prh_serial: this.dataset[i - 1].prh_serial,
        tr_status: this.dataset[i - 1].tr_status,
        prh_vend_lot: null,
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }

  handleSelectedRowsChanged4(e, args) {
    const controls = this.prhForm.controls;
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

        this.locationService.getByOne({ loc_loc: item.pt_loc, loc_site: controls.prh_site.value }).subscribe((response: any) => {
          this.location = response.data;
          console.log(this.location.loc_status);
          updateItem.prh_part = item.pt_part;
          updateItem.desc = item.pt_desc1;
          updateItem.prh_um = item.pt_um;
          //updateItem.prh_site = item.pt_site;
          updateItem.prh_loc = item.pt_loc;
          updateItem.tr_status = this.location.loc_status;

          this.gridService.updateItem(updateItem);
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
    this.itemsService.getAll().subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.prhForm.controls;

    this.dataset = [];

    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.prh_nbr.setValue(item.po_nbr || "");
        const po_nbr = controls.prh_nbr.value;
        this.purchaseOrderService.findBy({ po_nbr: item.po_nbr }).subscribe((res: any) => {
          const { purchaseOrder, details } = res.data;
          const det1 = details;
          this.prhServer = purchaseOrder;

          controls.prh_nbr.setValue(this.prhServer.po_nbr);
          controls.prh_vend.setValue(this.prhServer.po_vend);
          controls.prh_curr.setValue(this.prhServer.po_curr);
          controls.prh_ex_rate.setValue(this.prhServer.po_ex_rate);
          controls.prh_ex_rate2.setValue(this.prhServer.po_ex_rate2);
          const ad_addr = this.prhServer.po_vend;
          console.log(ad_addr);
          this.addressService.getBy({ ad_addr: ad_addr }).subscribe((response: any) => {
            this.provider = response.data;

            controls.name.setValue(this.provider.ad_name);

            for (const object in det1) {
              console.log(details[object]);
              const detail = details[object];
              this.locationService.getByOne({ loc_loc: detail.item.pt_loc, loc_site: detail.item.pt_site }).subscribe((response: any) => {
                this.location = response.data;
                // console.log( this.location.loc_status)
                if (this.location == null) {
                  this.stat = null;
                } else {
                  this.stat = this.location.loc_status;
                }
                this.gridService.addItem(
                  {
                    id: this.dataset.length + 1,
                    prh_line: this.dataset.length + 1,
                    prh_part: detail.pod_part,
                    cmvid: "",
                    desc: detail.item.pt_desc1,
                    qty_received: detail.pod_qty_rcvd,
                    prh_rcvd: detail.pod_qty_ord - detail.pod_qty_rcvd,
                    prh_um: detail.item.pt_um,
                    prh_um_conv: 1,
                    prh_pur_cost: detail.pod_price,
                    prh_disc_pct: detail.pod_disc_pct,
                    prh_taxable: detail.pod_taxable,
                    prh_taxc: detail.pod_taxc,
                    prh_tax_code: detail.pod_tax_code,
                    //prh_site: detail.item.pt_site,
                    prh_loc: detail.item.pt_loc,
                    prh_serial: "",
                    tr_status: this.stat,
                    prh_vend_lot: "",
                    tr_expire: null,
                  },
                  { position: "bottom" }
                );
                this.datasetPrint.push({
                  id: this.dataset.length + 1,
                  prh_line: this.dataset.length + 1,
                  prh_part: detail.pod_part,
                  cmvid: "",
                  desc: detail.item.pt_desc1,
                  qty_received: detail.pod_qty_rcvd,
                  prh_rcvd: detail.pod_qty_ord,
                  prh_um: detail.item.pt_um,
                  prh_um_conv: 1,
                  prh_pur_cost: detail.pod_price,
                  prh_disc_pct: detail.pod_disc_pct,
                  prh_taxable: detail.pod_taxable,
                  prh_taxc: detail.pod_taxc,
                  prh_tax_code: detail.pod_tax_code,
                  //prh_site: detail.item.pt_site,
                  prh_loc: detail.item.pt_loc,
                  prh_serial: "",
                  tr_status: this.stat,
                  prh_vend_lot: "",
                  tr_expire: null,
                });
              });
            }
          });
        });
      });
    }
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
        id: "po_nbr",
        name: "N° BC",
        field: "po_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_ord_date",
        name: "Date",
        field: "po_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "po_vend",
        name: "Fournisseur",
        field: "po_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "po_status",
        name: "status",
        field: "po_status",
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
    this.purchaseOrderService.getByStat({ po_stat: "V" }).subscribe((response: any) => {
      console.log(response.data);
      this.pos = response.data;
    });
  }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }

  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.prhForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        controls.prh_curr.setValue(item.cu_curr || "");
        if (item.cu_curr != "DA") {
          const date = new Date();
          this.deviseService.getExRate({ exr_curr1: item.cu_curr, exr_curr2: "DA", date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` }).subscribe((res: any) => {
            controls.prh_ex_rate.setValue(res.data.exr_rate);
            controls.prh_ex_rate2.setValue(res.data.exr_rate2);
          });
        }
      });
    }
  }

  angularGridReadycurr(angularGrid: AngularGridInstance) {
    this.angularGridcurr = angularGrid;
    this.gridObjcurr = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridcurr() {
    this.columnDefinitionscurr = [
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

    this.gridOptionscurr = {
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
    this.deviseService.getAll().subscribe((response: any) => (this.devises = response.data));
  }
  opencurr(content) {
    this.prepareGridcurr();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedsite(e, args) {
    const controls = this.prhForm.controls;
    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);

        controls.prh_site.setValue(item.si_site);
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
      this.siteService.getAll().subscribe((response: any) => (this.datasite = response.data));
    } else {
      this.siteService.getBy({ si_site: this.user.usrd_site }).subscribe((response: any) => (this.datasite = response.data));
    }
  }
  opensite(contentsite) {
    this.prepareGridsite();
    this.modalService.open(contentsite, { size: "lg" });
  }

  handleSelectedRowsChangedloc(e, args) {
    const controls = this.prhForm.controls;
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjloc) {
      args.rows.map((idx) => {
        const item = this.gridObjloc.getDataItem(idx);
        console.log(item);

        this.locationService.getByOne({ loc_loc: item.loc_loc, loc_site: controls.prh_site.value }).subscribe((response: any) => {
          this.location = response.data;
          if (response.data) {
            this.inventoryStatusService.getAllDetails({ isd_status: this.location.loc_status, isd_tr_type: "ISS-SO" }).subscribe((resstat: any) => {
              console.log(resstat);
              const { data } = resstat;

              if (data) {
                this.stat = null;
              } else {
                this.stat = this.location.loc_status;
              }
              updateItem.prh_loc = item.loc_loc;
              updateItem.prh_status = this.stat;
            });
          } else {
            alert("Emplacement Nexiste pas");
            this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_loc: null, tr_status: null });
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
    const controls = this.prhForm.controls;
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
    this.locationService.getBy({ loc_site: controls.prh_site.value }).subscribe((response: any) => (this.dataloc = response.data));
  }
  openloc(contentloc) {
    this.prepareGridloc();
    this.modalService.open(contentloc, { size: "lg" });
  }

  handleSelectedRowsChangedlocdet(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjlocdet) {
      args.rows.map((idx) => {
        const item = this.gridObjlocdet.getDataItem(idx);
        console.log(item);

        this.inventoryStatusService.getAllDetails({ isd_status: item.ld_status, isd_tr_type: "ISS-SO" }).subscribe((res: any) => {
          console.log(res);
          const { data } = res;

          if (data) {
            alert("Mouvement Interdit Pour ce Status");
            updateItem.prh_serial = null;
            updateItem.tr_status = null;

            updateItem.tr_expire = null;
            updateItem.qty_oh = 0;
          } else {
            updateItem.prh_serial = item.ld_lot;
            updateItem.tr_status = item.ld_status;
            updateItem.tr_expire = item.ld_expire;
            updateItem.qty_oh = item.ld_qty_oh;

            this.gridService.updateItem(updateItem);
          }
        });

        this.gridService.updateItem(updateItem);
      });
    }
  }
  angularGridReadylocdet(angularGrid: AngularGridInstance) {
    this.angularGridlocdet = angularGrid;
    this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridlocdet() {
    const controls = this.prhForm.controls;
    this.columnDefinitionslocdet = [
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

    this.gridOptionslocdet = {
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
    this.locationDetailService.getBy({ ld_site: controls.prh_site.value, ld_loc: updateItem.prh_loc, ld_part: updateItem.prh_part }).subscribe((response: any) => (this.datalocdet = response.data));
  }
  openlocdet(contentlocdet) {
    this.prepareGridlocdet();
    this.modalService.open(contentlocdet, { size: "lg" });
  }

  handleSelectedRowsChangedum(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
        const item = this.gridObjum.getDataItem(idx);
        updateItem.prh_um = item.code_value;

        this.gridService.updateItem(updateItem);

        /*********/
        console.log(updateItem.prh_part);

        this.itemsService.getBy({ pt_part: updateItem.prh_part }).subscribe((resp: any) => {
          if (updateItem.prh_um == resp.data.pt_um) {
            updateItem.prh_um_conv = 1;
          } else {
            //console.log(resp.data.pt_um)

            this.mesureService.getBy({ um_um: updateItem.prh_um, um_alt_um: resp.data.pt_um, um_part: updateItem.prh_part }).subscribe((res: any) => {
              console.log(res);
              const { data } = res;

              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.prh_um_conv = res.data.um_conv;
                this.angularGrid.gridService.highlightRow(1, 1500);
              } else {
                this.mesureService.getBy({ um_um: resp.data.pt_um, um_alt_um: updateItem.prh_um, um_part: updateItem.prh_part }).subscribe((res: any) => {
                  console.log(res);
                  const { data } = res;
                  if (data) {
                    //alert ("Mouvement Interdit Pour ce Status")
                    updateItem.prh_um_conv = res.data.um_conv;
                  } else {
                    updateItem.prh_um_conv = 1;
                    updateItem.prh_um = null;

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

  printpdf(nbr) {
    //const controls = this.totForm.controls
    const controls = this.prhForm.controls;
    console.log("pdf");
    var doc = new jsPDF();

    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 170, 5, 30, 30);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(12);
    doc.text("RC N° : " + nbr, 70, 40);
    doc.setFontSize(8);

    doc.text("Code Fournisseur : " + this.provider.ad_addr, 20, 50);
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
    doc.text("Site        : " + controls.prh_site.value, 180, 50);

    doc.line(10, 85, 200, 85);
    doc.line(10, 90, 200, 90);
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
    doc.text("Prix", 132, 88.5);
    doc.line(140, 85, 140, 90);
    doc.text("Empl", 142, 88.5);
    doc.line(153, 85, 153, 90);
    doc.text("Lot/Serie", 158, 88.5);
    doc.line(180, 85, 180, 90);
    doc.text("Réference", 182, 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(6);
    for (let j = 0; j < this.dataset.length; j++) {
      if (j % 35 == 0 && j != 0) {
        doc.addPage();

        doc.addImage(img, "png", 170, 5, 30, 30);
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(12);
        doc.text("RC N° : " + nbr, 70, 40);
        doc.setFontSize(8);

        doc.text("Code Fournisseur : " + this.provider.vd_addr, 20, 50);
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
        doc.text("Site        : " + controls.prh_site.value, 180, 50);

        doc.line(10, 85, 200, 85);
        doc.line(10, 90, 200, 90);
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
        doc.text("Prix", 132, 88.5);
        doc.line(140, 85, 140, 90);
        doc.text("Empl", 142, 88.5);
        doc.line(153, 85, 153, 90);
        doc.text("Lot/Série", 152, 88.5);
        doc.line(180, 85, 180, 90);
        doc.text("Réf", 182, 88.5);
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
        doc.text(String("000" + this.dataset[j].prh_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].prh_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].prh_rcvd).toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].prh_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.dataset[j].prh_pur_cost), 132, i - 1);
        doc.line(140, i - 5, 140, i);
        doc.text(String(this.dataset[j].prh_loc), 141, i - 1);
        doc.line(153, i - 5, 153, i);
        if (this.dataset[j].prh_serial != null) {
          doc.text(String(this.dataset[j].prh_serial), 156, i - 1);
        }
        doc.line(180, i - 5, 180, i);
        if (this.dataset[j].tr_ref != null) {
          doc.text(String(this.dataset[j].tr_ref), 182, i - 1);
        }
        doc.line(200, i - 5, 200, i);
        // doc.line(10, i, 200, i );

        i = i + 5;

        doc.text(desc2, 47, i - 1);

        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(45, i - 5, 45, i);
        doc.line(100, i - 5, 100, i);
        doc.line(120, i - 5, 120, i);
        doc.line(130, i - 5, 130, i);
        doc.line(140, i - 5, 140, i);
        doc.line(153, i - 5, 153, i);
        doc.line(180, i - 5, 180, i);
        doc.line(200, i - 5, 200, i);
        doc.line(10, i, 200, i);

        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].prh_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].prh_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.dataset[j].desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(Number(this.dataset[j].prh_rcvd).toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].prh_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.dataset[j].prh_pur_cost), 132, i - 1);
        doc.line(140, i - 5, 140, i);
        doc.text(String(this.dataset[j].prh_loc), 141, i - 1);
        doc.line(153, i - 5, 153, i);
        if (this.dataset[j].prh_serial != null) {
          doc.text(String(this.dataset[j].prh_serial), 156, i - 1);
        }
        doc.line(180, i - 5, 180, i);
        if (this.dataset[j].tr_ref) {
          doc.text(String(this.dataset[j].tr_ref), 182, i - 1);
        }
        doc.line(200, i - 5, 200, i);
        doc.line(10, i, 200, i);
        i = i + 5;
      }
    }

    // doc.line(10, i - 5, 200, i - 5);

    doc.setFontSize(10);

    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }

  handleSelectedRowsChangedprinter(e, args) {
    const controls = this.prhForm.controls;

    if (Array.isArray(args.rows) && this.gridObjprinter) {
      args.rows.map((idx) => {
        const item = this.gridObjprinter.getDataItem(idx);
        // TODO : HERE itterate on selected field and change the value of the selected field
        controls.printer.setValue(item.printer_code || "");
        this.currentPrinter = item.printer_code;
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
}
