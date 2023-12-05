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
import { ItemService, SiteService, BomService, BomPartService, WorkOrder, WorkOrderService, SequenceService, ProviderService, WorkRoutingService, AddressService, InventoryTransaction, InventoryTransactionService, LocationService, RequisitionService, CostSimulationService, LocationDetailService, InventoryStatusService, CodeService, printBc, MesureService, LabelService, Label, EmployeService, PrintersService } from "../../../../core/erp";

@Component({
  selector: "kt-create-direct-wo",
  templateUrl: "./create-direct-wo.component.html",
  styleUrls: ["./create-direct-wo.component.scss"],
})
export class CreateDirectWoComponent implements OnInit {
  currentPrinter: string;
  PathPrinter: string;
 
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

  vends: [];
  columnDefinitionsvend: Column[] = [];
  gridOptionsvend: GridOption = {};
  gridObjvend: any;
  angularGridvend: AngularGridInstance;

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

  product_colors: any[] = [];
  product_types: any[] = [];

  shift: any;
  desc2: any;
  dataprinter: [];

  columnDefinitionsprinter: Column[] = [];

  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;
  angularGridprinter: AngularGridInstance;
  domain: any;
  domconfig : any;
  constructor(config: NgbDropdownConfig, private woFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private modalService: NgbModal, private layoutUtilsService: LayoutUtilsService, private siteService: SiteService, private providersService: ProviderService, private itemsService: ItemService, private sequenceService: SequenceService, private workOrderService: WorkOrderService, private workRoutingService: WorkRoutingService, private bomService: BomService, private bomPartService: BomPartService, private inventoryTransactionService: InventoryTransactionService, private sctService: CostSimulationService, private locationService: LocationService, private inventoryStatusService: InventoryStatusService, private mesureService: MesureService, private codeService: CodeService, private requisitionService: RequisitionService, private locationDetailService: LocationDetailService, private labelService: LabelService, private employeService: EmployeService, private printerService: PrintersService) {
    config.autoClose = true;
    this.workRoutingService.getBy({ ro_rollup: true })
      .subscribe((response: any) => { console.log(response.date)
      this.ro_rollup = response.data});
    this.codeService
      .getBy({ code_fldname: "emp_shift" })
      .subscribe((response: any) => (this.emp_shift = response.data));
     
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
      // {
      //   id: "tr_expire",
      //   name: "Expire",
      //   field: "tr_expire",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.dateIso,

      // },
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

  //ISS-UNP qrt * -1 w ttna7a men ld_det
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
    this.getProductColors();
    this.getProductTypes();
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.domain);

    this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
      (reponse: any) => {
        if(reponse.data != null) {   
          console.log("hahahahahahahaha", reponse.data)
          this.domconfig = true
        } else  {
          this.domconfig = false
        }
      },  
          
      (error) => {
       this.domconfig = false      },
     
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
      wo_part: [this.workOrder.wo_part, Validators.required],
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
    this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
      (reponse: any) => { 
        if(reponse.data != null) {
        controls.wo_routing.setValue(reponse.data.code_value),
        controls.wo_routing.disable() 

        }
      },
      (error) => {
     
      },
     
    );

  }
  //reste form
  reset() {
    this.workOrder = new WorkOrder();
    this.createForm();
    this.dataset = [];
    this.trdataset = [];

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
          alert("Site n'existe pas");
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
          alert("Erreur bdd");
          // controls.wo_site.setValue("");
        }
      });
  }

  getProductTypes() {
    this.codeService
      .getBy({
        code_fldname: "pt_prod_line",
      })
      .subscribe((response: any) => {
        const { data } = response;
        this.product_types = data;
        if (!data) {
          alert("Erreur bdd");
          // controls.wo_site.setValue("");
        }
      });
  }

  searchProduct() {
    const controls = this.woForm.controls;
    controls.product_type.value;
    controls.product_color.value;

    this.itemsService
      .getBy({
        pt_prod_line: controls.product_type.value,
        pt_break_cat: controls.product_color.value,
        pt_dsgn_grp: "BROY",
        pt_drwg_loc: "INTERNE",
      })
      .subscribe((response: any) => {
        const { data } = response;
        if (data) {
          if (data.length == 0) {
            alert("Aucun produit n'existe avec le type et la couleur sélectionnés");
          } else {
            console.log(data);
            controls.wo_part.setValue(data[0].pt_part);
            controls.desc.setValue(data[0].pt_desc1);
          }
        }
      });
  }

  onSubmit() {
    // alert("ok")
    const controls = this.woForm.controls;
    let tr = this.prepareTr();
    this.trdataset = [];

    if (controls.wo_qty_comp.value == null || controls.wo_qty_comp.value == 0) {
      this.hasFormErrors = true;
      this.message = "Verifier la Quantité";
      // alert("Saisir Qte")

      return;
    }
    if (this.dataset.length == 0) {
      this.hasFormErrors = true;
      this.message = "Verifier la liste des consomation";

      return;
    }

    const _lb = new Label();
    _lb.lb_site = controls.wo_site.value;
    _lb.lb_loc = this.loc;
    _lb.lb_part = controls.wo_part.value;
    _lb.lb_nbr = this.nof;
    _lb.lb_lot = controls.wo_serial.value;
    _lb.lb_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _lb.lb_qty = controls.wo_qty_comp.value;
    _lb.lb_ld_status = this.rctwostat;
    _lb.lb_desc = this.desc2;
    _lb.lb_grp = controls.emp_shift.value;
    _lb.lb_cust = "";
    _lb.lb_addr = "";
    // _lb.lb_rmks = controls.emp_shift.value
    // _lb.lb_tel  = this.address.ad_phone
    // _lb.int01   = this.product.int01
    // _lb.int02   = this.product.int02
    
    _lb.lb_printer = this.PathPrinter;

    let lab = null;

    this.labelService.add(_lb).subscribe(
      (reponse: any) => (lab = reponse.data),
      (error) => {
        alert("Erreur Impression Etiquette");
      },
      () => {
        console.log("lab", lab);

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
        });
        console.log(this.trdataset);
        this.addTR(this.trdataset, tr);

        //   this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_ref: lab.lb_ref})
      }
    );
    let wod = this.prepareWOD();
    this.addWod(this.dataset, wod);
    this.reset();
  }

  prepareTr() {
    const controls = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = this.nof;
    _tr.tr_lot = this.wolot;
    _tr.tr_part = controls.wo_part.value;

    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _tr.tr_qty_loc = controls.wo_qty_comp.value;
    _tr.tr_serial = controls.wo_serial.value;
    _tr.tr_addr = controls.emp_shift.value;
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
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
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

  prepare(){
    const controls = this.woForm.controls;
    console.log("alllllllllllllllo")
    const _wo = new WorkOrder();
    _wo.wo_site = controls.wo_site.value
    _wo.wo_part = controls.wo_part.value
    _wo.wo_routing = controls.wo_routing.value
    _wo.wo_ord_date = controls.wo_ord_date.value
    ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}`
    : null
    _wo.wo_rel_date = controls.wo_ord_date.value
    ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}`
    : null
    _wo.wo_due_date = controls.wo_ord_date.value
    ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}`
    : null
    _wo.wo__chr01 = controls.emp_shift.value
    return _wo
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
        this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
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
        console.log("yaw hna ", this.nof);
        let wo = this.prepare();
        this.workOrderService.addDirect({ it: wo, nof: this.nof }).subscribe(
          (reponse: any) => (this.wolot = reponse.data),
          (error) => {
            this.layoutUtilsService.showActionNotification("Erreur verifier les informations", MessageType.Create, 10000, true, true);
            this.loadingSubject.next(false);
          },
          () => {
            this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 1000, false, false);
            controls.ref.enable();
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
          alert("Article n'existe pas");
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
    this.prepareGridgamme();
    this.modalService.open(content, { size: "lg" });
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

  onChangePal() {
    /*kamel palette*/
    const controls = this.woForm.controls;
    const ref = controls.ref.value;
    var bol = false;
    for (let ob of this.dataset) {
      if (ob.tr_ref == ref) {
        console.log("hnehnahna");
        bol = true;
        break;
      }
    }
    if (!bol) {
      this.locationDetailService.getByOneRef({ ld_ref: ref }).subscribe((response: any) => {
        this.lddet = response.data;
        //console.log(this.lddet.ld_qty_oh)
        if (this.lddet != null) {
          if (this.lddet.ld_site != controls.wo_site.value) {
            alert("Palette N'existe pas dans Ce Site");
          } else {
            this.inventoryStatusService.getAllDetails({ isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat: any) => {
              console.log(resstat);
              const { data } = resstat;

              if (data) {
                this.stat = null;
                alert("Status Interdit pour ce mouvement ");
              } else {
                this.stat = this.lddet.ld_status;

                // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , qty_oh: this.lddet.ld_qty_oh,
                //   tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_cst_tot, tr_expire: this.lddet.ld_expire})

                this.itemsService.getByOne({ pt_part: this.lddet.ld_part }).subscribe((respopart: any) => {
                  console.log(respopart);

                  this.sctService.getByOne({ sct_site: controls.wo_site.value, sct_part: this.lddet.ld_part, sct_sim: "STD-CG" }).subscribe((respo: any) => {
                    this.sct = respo.data;
                    console.log(this.sct);

                    this.codeService.getBy({ code_fldname: controls.product_color.value, code_value: respopart.data.pt_break_cat }).subscribe((rescode: any) => {
                      console.log(rescode);
                      if (rescode.data.length > 0) {
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
                          },
                          { position: "bottom" }
                        );
                      } else {
                        alert("Couleur ne correspond pas au produit ");
                      }
                    });
                  });
                });
              }
            });
          }
        } else {
          alert("Palette Nexiste pas");
          //  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
        }
      });
    } else {
      alert("Palette déja scannée");
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
}
