import { Component, OnInit } from "@angular/core";
import { saveAs } from "file-saver";
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
import { PosPrintData, PosPrintOptions, PosPrinter } from "electron-pos-printer";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import bwipjs from "bwip-js";

// import print from "print-js";
// import printJS from "print-js";
// import blobStream from "blob-stream";
// import { saveAs } from "file-saver";
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
declare var Edelweiss: any;


@Component({
  selector: 'kt-po-unreceip-vend',
  templateUrl: './po-unreceip-vend.component.html',
  styleUrls: ['./po-unreceip-vend.component.scss']
})
export class PoUnreceipVendComponent implements OnInit {

  // declare printJS: any;
  printable: any;
  currentPrinter: string;
  PathPrinter: string;
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

  providers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

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
  domain;
  dataprinter: [];
  nligne: any;
  nbrForm: FormGroup;

  columnDefinitionsprinter: Column[] = [];

  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;
  angularGridprinter: AngularGridInstance;


  
  
  receivers: [];
  columnDefinitions6: Column[] = [];
  gridOptions6: GridOption = {};
  gridObj6: any;
  angularGrid6: AngularGridInstance;
date:String
curr:any
taxc:any
idpal: any
  constructor(config: NgbDropdownConfig, private prhFB: FormBuilder, private nbrFB: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, public dialog: MatDialog, private modalService: NgbModal, private layoutUtilsService: LayoutUtilsService, private providersService: ProviderService, private purchaseReceiveService: PurchaseReceiveService, private inventoryTransactionService: InventoryTransactionService, private purchaseOrderService: PurchaseOrderService, private poService: PurchaseOrderService, private addressService: AddressService, private itemsService: ItemService, private codeService: CodeService, private siteService: SiteService, private mesureService: MesureService, private locationDetailService: LocationDetailService, private deviseService: DeviseService, private taxService: TaxeService, private sequenceService: SequenceService, private inventoryStatusService: InventoryStatusService, private locationService: LocationService, private labelService: LabelService, private printerService: PrintersService) {
    config.autoClose = true;
    this.initGrid();
  }
  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  // test() {
  //   const data = [
  //     {
  //       type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
  //       value: "SAMPLE HEADING",
  //       style: { fontWeight: "700", textAlign: "center", fontSize: "24px" },
  //     },
  //   ];
  //   ElectronPrinter2.print2(data, "data");
  // }

  initGrid() {
    this.columnDefinitions = [
      // {
      //   id: "id",
      //   field: "id",
      //   excludeFromHeaderMenu: true,
       
      // },
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
        id: "desc",
        name: "Description",
        field: "tr_desc",
        sortable: true,
        width: 180,
        filterable: false,
      },
     
      {
        id: "tr_qty_loc",
        name: "QTE A Récep",
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
        id: "tr_site",
        name: "Site",
        field: "tr_site",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "tr_loc",
        name: "Emplacement",
        field: "tr_loc",
        sortable: true,
        width: 80,
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
      {
        id: "tr_status",
        name: "Status",
        field: "tr_status",
        sortable: true,
        width: 80,
        filterable: false,
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
        id: "tr_nbr",
        name: "N° OA",
        field: "tr_nbr",
        sortable: true,
        width: 80,
        filterable: false,
      },
      
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      // editable: true,
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
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.user = JSON.parse(localStorage.getItem("user"));
    this.currentPrinter = this.user.usrd_dft_printer;
    this.printerService.getByPrinter({ printer_code: this.currentPrinter }).subscribe(
      (reponse: any) => ((this.PathPrinter = reponse.data.printer_path), console.log(this.PathPrinter)),
      (error) => {
        this.message = "Erreur, vérifier les informations";
            this.hasFormErrors = true;
            return;
      }
    );
    if (this.user.usrd_site == "*") {
      this.site = null;
    } else {
      this.site = this.user.usrd_site;
    }
    this.printable = true;
    this.createForm();
  }
  // printJsS() {
  //   printJS("/assets/output12.pdf");
  // }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.inventoryTransaction = new InventoryTransaction();
    this.purchaseReceive = new PurchaseReceive();
    const date = new Date();

    console.log(this.prhnbr);
    this.prhForm = this.prhFB.group({
      
      prh_vend: [this.purchaseReceive.prh_vend,Validators.required],
      name: "",
      prh_rcp_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      prh_xinvoice: [this.purchaseReceive.prh_xinvoice],
      prh_curr: [this.purchaseReceive.prh_curr],
      prh_taxable: [this.purchaseReceive.prh_taxable],
      prh_tax_code: [this.purchaseReceive.prh_tax_code],
      // prh_site: [this.site, Validators.required],
      prh_ex_rate: [this.purchaseReceive.prh_ex_rate],
      prh_ex_rate2: [this.purchaseReceive.prh_ex_rate2],

      prh_rmks: [this.purchaseReceive.prh_rmks],
      print: [true],
      printer: [this.user.usrd_dft_printer],

      ref: [null],
    });

    const controls = this.prhForm.controls;
    
  }
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.hasFormErrors = false;
    this.dataset=[]
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
    this.sequenceService.getByOne({ seq_type: "PR", seq_profile: this.user.usrd_profile }).subscribe((response: any) => {
      this.seq = response.data;
    
      if (this.seq) {
        const id = Number(this.seq.id);
        let obj = {};
        obj = {
          seq_curr_val: Number(this.seq.seq_curr_val) + 1,
        };
        if(this.prhnbr == null)
        { this.prhnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val) + 1}`;
          this.sequenceService.update(id, obj).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
            this.message = "Erreur modification Sequence";
            this.hasFormErrors = true;
            return;
          }
          );
          
        }
        
        // controls.prh_receiver.setValue(this.prhnbr);
    
       let pr = this.prepare();
       let date = new Date(controls.prh_rcp_date.value ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}` : null)
        this.addIt(this.dataset,pr, this.prhnbr);
        // controls.prh_receiver.setValue(this.prhnbr);
    
      // tslint:disable-next-line:prefer-const
      }
    })

    // tslint:disable-next-line:prefer-const
    // let pr = this.prepare()
    //this.addIt( this.dataset,pr);
  }
  loadPdf() {
    this.labelService.getPdf({}).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    });
  }
  prepare() {
    const controls = this.prhForm.controls;
    const _pr = new PurchaseReceive();
    
    _pr.prh_vend = controls.prh_vend.value;
    _pr.prh_rcp_date = controls.prh_rcp_date.value ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}` : null;
    _pr.prh_xinvoice = controls.prh_xinvoice.value;
    _pr.prh_curr = controls.prh_curr.value;
    _pr.prh_taxable = controls.prh_taxable.value;
    _pr.prh_taxc = Number(this.taxc);
    _pr.prh_tax_code = controls.prh_tax_code.value;
    // _pr.prh_site = controls.prh_site.value;
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
      this.dataset[data].tr_qty_loc = - this.dataset[data].tr_qty_loc 
    }
    this.loadingSubject.next(true);

    const controls = this.prhForm.controls;
    let poNbr = 0;
    this.purchaseReceiveService.addRetour({ detail, pr, prhnbr }).subscribe(
      (reponse: any) => (poNbr = reponse.data),
      (error) => {
        this.loadingSubject.next(false);
        this.message = "Erreur, vérifier les informations";
            this.hasFormErrors = true;
            return;
        
        
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);
        console.log(this.provider, poNbr, this.dataset);
        if (controls.print.value == true) this.printpdf(poNbr);
        this.router.navigateByUrl("/purchasing/po-list");
      }
    );
  }

  
// onChangeTAX() {
//   const controls = this.prhForm.controls;
//   const tax = controls.prh_taxable.value;

//     for (var i = 0; i < this.dataset.length; i++) {
//       let updateItem = this.gridService.getDataItemByRowIndex(i);
//     //  console.log(this.dataset[i].qty_oh)
//           updateItem.prh_taxable = tax ;
      
//           this.gridService.updateItem(updateItem);
       
//     };
  
  
 
//   // this.calculatetot();
// }

changeTax(){
  const controls = this.prhForm.controls // chof le champs hada wesh men form rah
  const tx2_tax_code  = controls.prh_tax_code.value
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
          this.taxc = data.tx2_tax_pct
      }


  },error=>console.log(error))
}

  // onChangesite() {
  //   const controls = this.prhForm.controls;
  //   const si_site = controls.prh_site.value;

  //   this.siteService.getByOne({ si_site }).subscribe((res: any) => {
  //     if (!res.data) {
        
  //       controls.prh_site.setValue(null);
  //       document.getElementById("prh_site").focus();
  //       this.message = "site inexistant";
  //           this.hasFormErrors = true;
  //           return;
  //     } else {
  //       if (this.user.usrd_site != "*" && si_site != this.user.usrd_site) {
          
  //         controls.prh_site.setValue(null);
  //         document.getElementById("prh_site").focus();
  //         this.message = "vous ne pouvez pas choisir ce site";
  //           this.hasFormErrors = true;
  //           return;
  //       }
  //     }
  //   });
  // }

  onChangePal() { 
    
    /*kamel palette*/
    const controls = this.prhForm.controls
    const ref = controls.ref.value
  var bol = false
  
this.labelService.getBy({lb_cab: ref,lb_actif: false}).subscribe((res:any) =>{if (res.data != null) {bol = true}})
  
  
  if (controls.prh_vend.value == null  ){  this.message = "veuillez choisir le fournisseur";
  this.hasFormErrors = true;
  return;}
  else{
    for(let ob of this.dataset) {

      if(ob.tr_ref == ref) {
        console.log("hnehnahna")
        bol = true
        break;
       
      }
    }
    if (!bol) {
    this.locationDetailService.getByOneRef({ ld_ref: ref  }).subscribe(
      (response: any) => {
        this.lddet = response.data
        //console.log(this.lddet.ld_qty_oh)
    if (this.lddet != null) {
     
      
      
     
     
      this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "RCT-PO" }).subscribe((resstat:any)=>{
          console.log(resstat)
          const { data } = resstat;

          if (data) {
            this.stat = null
            this.message = "mouvement interdit dans cet emplacement";
            this.hasFormErrors = true;
            return;


          } else {
            this.stat = this.lddet.ld_status
          

      // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , qty_oh: this.lddet.ld_qty_oh,
      //   tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_cst_tot, tr_expire: this.lddet.ld_expire})
             
     
     this.itemsService.getByOne({pt_part: this.lddet.ld_part  }).subscribe(
      (respopart: any) => {
        console.log(respopart)

     this.inventoryTransactionService.getBy({ tr_site: this.lddet.ld_site,tr_ref:ref, tr_part: this.lddet.ld_part, tr_type: 'RCT-PO' }).subscribe(
      (respo: any) => {
       console.log(respo.data[0])
       if (respo.data[0].tr_addr != controls.prh_vend.value) {
       
        this.message = "Palette ne correspond pas au fournisseur";
        this.hasFormErrors = true;
        return;


      }  else {
        this.labelService.getBy({lb_cab: ref}).subscribe((res:any) =>{if (res.data != null) {this.idpal = res.data.id}})
        console.log(this.idpal)
        this.labelService.update({lb_actif : false},{id: this.idpal}).subscribe((res:any) =>{})
       
     this.gridService.addItem(
      { 
        id: this.dataset.length + 1,
        tr_line: this.dataset.length + 1,
        tr_part: this.lddet.ld_part,
        cmvid: "",
        tr_desc: respopart.data.pt_desc1,
        tr_qty_loc: this.lddet.ld_qty_oh,
        qty_oh: this.lddet.ld_qty_oh,
        tr_site:  this.lddet.ld_site,
        tr_loc: this.lddet.ld_loc,
        tr_ref: this.lddet.ld_ref,
        tr_um: respopart.data.pt_um,
        tr_um_conv:1,
        tr_price: respo.data[0].tr_price,
        tr_nbr: respo.data[0].tr_nbr,
        cmvids: "",
        tr_serial: this.lddet.ld_lot,
        tr_status: this.stat,
        tr_expire: this.lddet.ld_expire,
        submitted: false
      },
      { position: "bottom" }
    );
    }
     });
      
})
  
     
  }
  }); 
        
    
 


  }



    else {
      this.message = "veuillez verifier le bigbag";
            this.hasFormErrors = true;
            return;
  //  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
    }

    });

  }
  else {
    this.message = "Palette déjà scanné";
    this.hasFormErrors = true;
    return;
  }
}
  controls.ref.setValue(null)
  document.getElementById("ref").focus();
  
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
        this.provider = response.data[0];

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
  addsameItem() {
    const control = this.nbrForm.controls;
    const limit = Number(control.nbrligne.value);
    var i = this.nligne;

    for (var j = 0; j < limit; j++) {
      this.gridService.addItem(
        {
          id: this.dataset.length + 1,
          prh_line: this.dataset.length + 1,
          prh_part: this.dataset[i - 1].prh_part,
          cmvid: "",
          desc: this.dataset[i - 1].desc,
          qty_received: this.dataset[i - 1].qty_received,
          prh_rcvd: this.dataset[i - 1].prh_rcvd,
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
          prh_vend_lot: this.dataset[i - 1].prh_vend_lot,
          tr_expire: this.dataset[i - 1].tr_expire,
        },
        { position: "bottom" }
      );
    }
    this.modalService.dismissAll();
  }

  // addsameItem(i) {
  //   console.log(i);
  //   console.log(this.dataset);
  //   this.gridService.addItem(
  //     {
  //       id: this.dataset.length + 1,
  //       prh_line: this.dataset.length + 1,
  //       prh_part: this.dataset[i - 1].prh_part,
  //       cmvid: "",
  //       desc: this.dataset[i - 1].desc,
  //       qty_received: this.dataset[i - 1].qty_received,
  //       prh_rcvd: 0,
  //       prh_taxable: this.dataset[i - 1].pod_taxable,
  //       prh_taxc: this.dataset[i - 1].pod_taxc,
  //       prh_tax_code: this.dataset[i - 1].pod_tax_code,

  //       prh_um: this.dataset[i - 1].prh_um,
  //       prh_um_conv: this.dataset[i - 1].prh_um_conv,
  //       prh_pur_cost: this.dataset[i - 1].prh_pur_cost,
  //       // prh_site: this.dataset[i - 1].prh_site,
  //       prh_loc: this.dataset[i - 1].prh_loc,
  //       prh_serial: this.dataset[i - 1].prh_serial,
  //       tr_status: this.dataset[i - 1].tr_status,
  //       prh_vend_lot: null,
  //       tr_expire: null,
  //     },
  //     { position: "bottom" }
  //   );
  // }

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
            this.provider = response.data[0];

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


  
  onChangesite() {
    const controls = this.prhForm.controls;
    const si_site = controls.prh_site.value;
    
    this.siteService.getByOne({ si_site }).subscribe(
      (res: any) => {
  
        if (!res.data) {
  
            alert("Site n'existe pas  ")
            controls.prh_site.setValue(null);
            document.getElementById("prh_site").focus();
          } else {
           if( this.user.usrd_site != "*" && si_site != this.user.usrd_site){
            alert("Site n'est pas autorisé pour cet utilisateur ")
            controls.prh_site.setValue(null);
            document.getElementById("prh_site").focus();
             


           } 
          }
      
      });
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
            
            this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, prh_loc: null, tr_status: null });
            this.message = "emplacement incorrect";
            this.hasFormErrors = true;
            return;
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
            
            updateItem.prh_serial = null;
            updateItem.tr_status = null;

            updateItem.tr_expire = null;
            updateItem.qty_oh = 0;
            this.message = "mouvement interdit pour ce statut";
            this.hasFormErrors = true;
            return;
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
                
                updateItem.prh_um_conv = res.data.um_conv;
                this.angularGrid.gridService.highlightRow(1, 1500);
              } else {
                this.mesureService.getBy({ um_um: resp.data.pt_um, um_alt_um: updateItem.prh_um, um_part: updateItem.prh_part }).subscribe((res: any) => {
                  console.log(res);
                  const { data } = res;
                  if (data) {
                   
                    updateItem.prh_um_conv = res.data.um_conv;
                  } else {
                    updateItem.prh_um_conv = 1;
                    updateItem.prh_um = null;

                    this.message = "conversion UM manquant";
            this.hasFormErrors = true;
            return;
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
  
  onChangeVend() {
    const controls = this.prhForm.controls; // chof le champs hada wesh men form rah
    const vd_addr = controls.prh_vend.value;
    const date = new Date()

    this.date = controls.prh_rcp_date.value
    ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;


    this.providersService.getBy({ vd_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
         alert("ce fournisseur n'existe pas!")
          document.getElementById("prh_vend").focus()
          controls.prh_vend.setValue(null)
          this.error = true;
        } else {
          this.error = false;
          controls.prh_vend.setValue(data.vd_addr || "");
          controls.prh_curr.setValue(data.vd_curr || "");
          controls.name.setValue(data.address.ad_name || "");
          controls.prh_taxable.setValue(data.address.ad_taxable || "");
        controls.prh_tax_code.setValue(data.address.ad_taxc || "");
        this.taxService.getBy({tx2_tax_code: data.address.ad_taxc}).subscribe((res:any)=>{
          this.taxc = res.data.tx2_tax_pct
         })
          this.deviseService.getBy({cu_curr:data.vd_curr}).subscribe((resc:any)=>{  
            this.curr = resc.data
         })

          if (data.vd_curr == 'DA'){
            controls.prh_ex_rate.setValue(1)
            controls.prh_ex_rate2.setValue(1)

          } else {

          this.deviseService.getExRate({exr_curr1:data.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
            
             controls.prh_ex_rate.setValue(res.data.exr_rate)
             controls.prh_ex_rate2.setValue(res.data.exr_rate2)
            })

            }

        }
         
      },
      (error) => console.log(error)
    );
  }
  handleSelectedRowsChanged2(e, args) {
    const controls = this.prhForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        console.log(item)
        const date = new Date()

        this.date = controls.prh_rcp_date.value
        ? `${controls.prh_rcp_date.value.year}/${controls.prh_rcp_date.value.month}/${controls.prh_rcp_date.value.day}`
        : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  

        this.provider = item.address;
        controls.prh_vend.setValue(item.vd_addr || "");
        controls.name.setValue(item.address.ad_name || "");
        controls.prh_taxable.setValue(item.address.ad_taxable || "");
        controls.prh_tax_code.setValue(item.address.ad_taxc || "");
        controls.prh_curr.setValue(item.vd_curr || "");
        this.deviseService.getBy({cu_curr:item.vd_curr}).subscribe((res:any)=>{  
          this.curr = res.data
       })
       
       this.taxService.getBy({tx2_tax_code: item.address.ad_taxc}).subscribe((res:any)=>{
        this.taxc = res.data.tx2_tax_pct
       })
       
        if (item.vd_curr == 'DA'){
          controls.prh_ex_rate.setValue(1)
          controls.prh_ex_rate2.setValue(1)

        } else {
         
          this.deviseService.getExRate({exr_curr1:item.vd_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{  
           controls.prh_ex_rate.setValue(res.data.exr_rate)
           controls.prh_ex_rate2.setValue(res.data.exr_rate2)
          
        })
            }


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
        formatter:Formatters.checkmark,
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
    this.providersService
      .getAll()
      .subscribe((response: any) => (this.providers = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }


  printpdf(nbr) {
    //const controls = this.totForm.controls
    const controls = this.prhForm.controls;
    console.log("pdf");
    var doc = new jsPDF();

    // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
    var img = new Image();
    // img.src = "./assets/media/logos/po-receip-cab.png";
    img.src = "./assets/media/logos/companyentete.png";
    doc.addImage(img, 'png', 5, 5, 200, 30)
    doc.setFontSize(9);
    // if (this.domain.dom_name != null) {
    //   doc.text(this.domain.dom_name, 10, 10);
    // }
    // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    let date = new Date()
    doc.setFontSize(12);
    doc.text("Retour RC N° : " + nbr, 50, 40);
    doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 40);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      doc.text("Site        : " + controls.prh_site.value, 160, 60);
      
    doc.setFontSize(8);

    doc.text("Code Fournisseur : " + this.provider.ad_addr, 20, 50);
    doc.text("Nom             : " + this.provider.ad_name, 20, 55);
    if(this.provider.ad_line1==null){
    doc.text("Adresse       : " +  this.provider.ad_line1 , 20, 60);
    }
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
    doc.text("Code Article", 22, 88.5);
    doc.line(55, 85, 55, 90);
    doc.text("Désignation", 62.5, 88.5);
    doc.line(115, 85, 115, 90);
    doc.text("QTE", 117, 88.5);
    doc.line(135, 85, 135, 90);
    doc.text("UM", 137, 88.5);
    doc.line(145, 85, 145, 90);
    doc.text("Prix", 147, 88.5);
    doc.line(155, 85, 155, 90);
    doc.text("Empl", 157, 88.5);
    doc.line(175, 85, 175, 90);
    doc.text("Lot/Serie", 177, 88.5);
    doc.line(190, 85, 190, 90);
    doc.text("Réference", 192, 88.5);
    doc.line(205, 85, 205, 90);
    var i = 95;
    doc.setFontSize(6);
    for (let j = 0; j < this.dataset.length; j++) {
      if (j % 20 == 0 && j != 0) {
        doc.addPage();
        doc.addImage(img, "png", 150, 5, 50, 30);
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(12);
        doc.text("Annulation RC N° : " + nbr, 70, 40);
        doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 40);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      doc.text("Site        : " + controls.prh_site.value, 160, 60);
      
        doc.setFontSize(8);

        doc.text("Code Fournisseur : " + this.provider.vd_addr, 20, 50);
        doc.text("Nom             : " + this.provider.ad_name, 20, 55);
        if(this.provider.ad_line1==null){
          doc.text("Adresse       : " +  this.provider.ad_line1 , 20, 60);
          }
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
        doc.text("Code Article", 22, 88.5);
        doc.line(55, 85, 55, 90);
        doc.text("Désignation", 62.5, 88.5);
        doc.line(115, 85, 115, 90);
        doc.text("QTE", 117, 88.5);
        doc.line(135, 85, 135, 90);
        doc.text("UM", 137, 88.5);
        doc.line(145, 85, 145, 90);
        doc.text("Prix", 147, 88.5);
        doc.line(155, 85, 155, 90);
        doc.text("Empl", 157, 88.5);
        doc.line(175, 85, 175, 90);
        doc.text("Lot/Serie", 177, 88.5);
        doc.line(190, 85, 190, 90);
        doc.text("Réference", 192, 88.5);
        doc.line(205, 85, 205, 90);
        i = 95;
        doc.setFontSize(6);
      }

      if (this.dataset[j].tr_desc.length > 35) {
        let desc1 = this.dataset[j].tr_desc.substring(35);
        let ind = desc1.indexOf(" ");
        desc1 = this.dataset[j].tr_desc.substring(0, 35 + ind);
        let desc2 = this.dataset[j].tr_desc.substring(35 + ind);

        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 22, i - 1);
        doc.line(55, i - 5, 55, i);
        doc.text(desc1, 57, i - 1);
        doc.line(115, i - 5, 115, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc).toFixed(2)), 133, i - 1, { align: "right" });
        doc.line(135, i - 5, 135, i);
        doc.text(this.dataset[j].tr_um, 137, i - 1);
        doc.line(145, i - 5, 145, i);
        doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 153, i - 1, { align: "right" });
        doc.line(155, i - 5, 155, i);
        doc.text(String(this.dataset[j].tr_loc), 157, i - 1);
        doc.line(175, i - 5, 175, i);
        if (this.dataset[j].tr_serial != null) {
          doc.text(String(this.dataset[j].tr_serial), 177, i - 1);
        }
        doc.line(190, i - 5, 190, i);
        if (this.dataset[j].tr_ref != null) {
          doc.text(String(this.dataset[j].tr_ref), 192, i - 1);
        }
        doc.line(205, i - 5, 205, i);
        // doc.line(10, i, 200, i );

        i = i + 5;

        doc.text(desc2, 62, i - 1);

        doc.line(10, i - 5, 10, i);
        doc.line(20, i - 5, 20, i);
        doc.line(55, i - 5, 55, i);
        doc.line(115, i - 5, 115, i);
        doc.line(135, i - 5, 135, i);
        doc.line(145, i - 5, 145, i);
        doc.line(155, i - 5, 155, i);
        doc.line(175, i - 5, 175, i);
        doc.line(190, i - 5, 190, i);
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 205, i);

        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].tr_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].tr_part, 22, i - 1);
        doc.line(55, i - 5, 55, i);
        doc.text(this.dataset[j].tr_desc, 57, i - 1);
        doc.line(115, i - 5, 115, i);
        doc.text(String(Number(this.dataset[j].tr_qty_loc).toFixed(2)), 133, i - 1, { align: "right" });
        doc.line(135, i - 5, 135, i);
        doc.text(this.dataset[j].tr_um, 137, i - 1);
        doc.line(145, i - 5, 145, i);
        doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 153, i - 1, { align: "right" });
        doc.line(155, i - 5, 155, i);
        doc.text(String(this.dataset[j].tr_loc), 157, i - 1);
        doc.line(175, i - 5, 175, i);
        if (this.dataset[j].tr_serial != null) {
          doc.text(String(this.dataset[j].tr_serial), 177, i - 1);
        }
        doc.line(190, i - 5, 190, i);
        if (this.dataset[j].tr_ref) {
          doc.text(String(this.dataset[j].tr_ref), 192, i - 1);
        }
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 205, i);
        i = i + 5;
      }
    }

    // doc.line(10, i - 5, 200, i - 5);
    doc.text("Validé par: " , 20, 235);
    doc.text("Note: " , 20, 250);
    doc.setFontSize(10);

    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    doc.save('RC-' + nbr + '.pdf')
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

  createnbrForm() {
    this.loadingSubject.next(false);

    this.nbrForm = this.nbrFB.group({
      nbrligne: [1],
    });
  }


  handleSelectedRowsChanged6(e, args) {
    const controls = this.prhForm.controls;

    this.dataset=[]
    
    if (Array.isArray(args.rows) && this.gridObj6) {
      args.rows.map((idx) => {
        const item = this.gridObj6.getDataItem(idx);
        controls.prh_receiver.setValue(item.prh_receiver || "");
        this.prhnbr = item.prh_receiver
        controls.prh_vend.setValue(item.prh_vend || "");
        // controls.prh_rcp_date.setValue(item.prh_rcp_date || "");
        // const d2 = new Date(item.prh_rcp_date)
        // // d2.setDate(d2.getDate() )
        // controls.prh_rcp_date.setValue({year: d2.getFullYear, month: d2.getMonth()+1, day: d2.getDate()})
        
        
        this.purchaseReceiveService.getByTr( {prh_receiver:item.prh_receiver} ).subscribe(
          (res: any) => {
           console.log(res.data)
           this.provider = res.data.purchaseReceive[0].address
           controls.prh_nbr.setValue(res.data.purchaseReceive[0].prh_nbr || "");
           controls.name.setValue(res.data.purchaseReceive[0].address.ad_name)
           controls.prh_xinvoice.setValue(res.data.purchaseReceive[0].prh_xinvoice)
           controls.prh_site.setValue(res.data.purchaseReceive[0].prh_site)
           controls.prh_curr.setValue(res.data.purchaseReceive[0].prh_curr)
           controls.prh_ex_rate.setValue(res.data.purchaseReceive[0].prh_ex_rate)
           controls.prh_ex_rate2.setValue(res.data.purchaseReceive[0].prh_ex_rate2)
           controls.prh_rmks.setValue(res.data.purchaseReceive[0].prh_rmks)
            this.dataset  = res.data.inventoryTransaction;
            this.dataView.setItems(this.dataset)

        }
        );
          }
     
       )}
}

  angularGridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid;
    this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid6() {
    this.columnDefinitions6 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "prh_receiver",
        name: "N° RC",
        field: "prh_receiver",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "prh_rcp_date",
        name: "Date",
        field: "prh_rcp_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "prh_vend",
        name: "Fournisseur",
        field: "prh_vend",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      
    ];

    this.gridOptions6 = {
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
    this.purchaseReceiveService
      .getGroupRCPCancel()
      .subscribe((response: any) => {
        console.log(response.data)
        this.receivers = response.data });
      
      
      
    }
  open6(content) {
    this.prepareGrid6();
    this.modalService.open(content, { size: "lg" });
  }

}

