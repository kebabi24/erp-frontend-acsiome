import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import { Column, GridOption, Formatter, Editor, Editors, AngularGridInstance, GridService, Formatters, FieldType, OnEventArgs } from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { round } from "lodash";

// Layout
import { SubheaderService, LayoutConfigService } from "../../../../core/_base/layout";
// CRUD
import { LayoutUtilsService, TypesUtilsService, MessageType } from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import {  MobileSettingsService,CustomerMobileService, ItineraryService, ItemService, Invoice, TaxeService, DeviseService, CodeService, SiteService, LocationService, MesureService, PricelistService, printSO, ConfigService, PayMethService, CostlistService } from "../../../../core/erp";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";

@Component({
  selector: 'kt-create-inv-mob',
  templateUrl: './create-inv-mob.component.html',
  styleUrls: ['./create-inv-mob.component.scss']
})
export class CreateInvMobComponent implements OnInit {
  invoice: Invoice;
  soForm: FormGroup;
  totForm: FormGroup;
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

  sequences: [];
  columnDefinitions1: Column[] = [];
  gridOptions1: GridOption = {};
  gridObj1: any;
  angularGrid1: AngularGridInstance;

  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  itinerarys: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;

  datatax: [];
  columnDefinitionstax: Column[] = [];
  gridOptionstax: GridOption = {};
  gridObjtax: any;
  angularGridtax: AngularGridInstance;

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

  channels: [];
  columnDefinitionschannel: Column[] = [];
  gridOptionschannel: GridOption = {};
  gridObjchannel: any;
  angularGridchannel: AngularGridInstance;

  seq;
  user;
  row_number;
  message = "";
  quoteServer;
  qoServer;
  customer;
  datasetPrint = [];
  type: String;
  date: String;
  payment_term_code: any[] = [];
  price: Number;
  disc: Number;
  taxable: Boolean;
  cfg: any;
  curr;
  domain;
  role:any;
  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
    private totFB: FormBuilder,

    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    
    private itemsService: ItemService,
    private codeService: CodeService,
    private mesureService: MesureService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private locationService: LocationService,
    private taxService: TaxeService,
    private pricelistService: PricelistService,
    private configService: ConfigService,
    private payMethService: PayMethService,
    private itineraryService: ItineraryService,
    private customerMobileService: CustomerMobileService,
    private mobileSettingService : MobileSettingsService
  ) {
    config.autoClose = true;

    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user)
    this.codeService.getByOne({code_fldname:"vente_comptoir",code_value:this.user.usrd_code}).subscribe((respo: any) => {
     console.log(respo.data)
      this.role = respo.data.code_cmmt
      console.log(this.role)
    })

   this.mobileSettingService.getAllPaymentMethods().subscribe((response: any) => {this.payment_term_code = response.paymenetMethods

    console.log(response)

  });
       // console.log(this.payment_term_code);
  
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
          console.log(args.dataContext.sod_part);
          const controls = this.soForm.controls;
          this.itemsService.getByOne({ pt_part: args.dataContext.sod_part }).subscribe((resp: any) => {
            if (resp.data) {
              console.log(resp.data);

              if (resp.data.pt_phantom) {
                this.type = "M";
              } else {
                this.type = null;
              }

              if (controls.so_taxable.value == false) {
                this.taxable = false;
              } else {
                this.taxable = resp.data.pt_taxable;
              }
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, desc: resp.data.pt_desc1, sod_site: resp.data.pt_site, sod_loc: resp.data.pt_loc, sod_um: resp.data.pt_um, sod_um_conv: 1, sod_price: resp.data.pt_price, sod_disc_pct: 0, sod_type: this.type, sod_tax_code: resp.data.pt_taxc, sod_taxc: resp.data.taxe.tx2_tax_pct, sod_taxable: this.taxable });
            } else {
              alert("Article Nexiste pas");
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_part: null });
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
        id: "sod_site",
        name: "Site",
        field: "sod_site",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          this.siteService.getByOne({ si_site: args.dataContext.sod_site }).subscribe((response: any) => {
            console.log(response.data);

            if (response.data) {
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_site: response.data.si_site });
            } else {
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_site: null });

              // this.gridService.onItemUpdated;
              alert("Site N'existe pas");
            }
          });
        },
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
          let element: HTMLElement = document.getElementById("openSitesGrid") as HTMLElement;
          element.click();
        },
      },
      {
        id: "sod_loc",
        name: "Emplacement",
        field: "sod_loc",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_loc);

          this.locationService.getByOne({ loc_loc: args.dataContext.sod_loc, loc_site: args.dataContext.sod_site }).subscribe((response: any) => {
            if (!response.data) {
              alert("Emplacement Nexiste pas");
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_loc: null });
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
          console.log(args.dataContext.sod_part);
          this.itemsService.getByOne({ pt_part: args.dataContext.sod_part }).subscribe((resp: any) => {
            console.log(args.dataContext.sod_part, resp.data.pt_um);
            if (args.dataContext.sod_um == resp.data.pt_um) {
              this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_um_conv: 1 });
            } else {
              //console.log(resp.data.pt_um)

              this.mesureService.getBy({ um_um: args.dataContext.sod_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.sod_part }).subscribe((res: any) => {
                console.log(res);
                const { data } = res;

                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_um_conv: res.data.um_conv });
                  this.angularGrid.gridService.highlightRow(1, 1500);
                } else {
                  this.mesureService.getBy({ um_um: resp.data.pt_um, um_alt_um: args.dataContext.sod_um, um_part: args.dataContext.sod_part }).subscribe((res: any) => {
                    console.log(res);
                    const { data } = res;
                    if (data) {
                      //alert ("Mouvement Interdit Pour ce Status")
                      this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_um_conv: res.data.um_conv });
                    } else {
                      this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_um_conv: "1", sod_um: null });

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
        id: "mvid",
        field: "cmvid",
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
          params: { decimalPlaces: 2 },
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.soForm.controls;
          console.log(args.dataContext.sod_part);
          console.log(controls.so_cust.value);
          let pricebefore = args.dataContext.sod_price;
          console.log(pricebefore);
          this.price = null;
          this.disc = null;
          this.itemsService.getByOne({ pt_part: args.dataContext.sod_part }).subscribe((resp: any) => {
            if (resp.data) {
              console.log(resp.data);

              const date1 = new Date();
              let obj: {};
              const part = resp.data.pt_part;
              const promo = resp.data.pt_promo;
              const cust = this.customer.cm_addr;
              const classe = this.customer.cm_class;
              const qty = args.dataContext.sod_qty_ord;
              const um = args.dataContext.sod_um;
              const curr = controls.so_curr.value;
              const type = "PT";
              const date = `${controls.so_ord_date.value.year}-${controls.so_ord_date.value.month}-${controls.so_ord_date.value.day}`;

              obj = { part, promo, cust, classe, date, qty, um, curr, type };
              this.pricelistService.getPrice(obj).subscribe((res: any) => {
                console.log("price", res);
                this.price = res.data;
                if (this.price != 0 && this.price != null) {
                  this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_price: this.price });
                }
                //    this.dataset[this.row_number].sod_price = this.price
                //console.log(this.row_number,this.dataset[this.row_number].sod_price)
                this.calculatetot();
              });

              let objr: {};
              const typer = "PR";

              objr = { part, promo, cust, classe, date, qty, um, curr, typer };

              console.log(obj);

              this.pricelistService.getDiscPct(objr).subscribe((resdisc: any) => {
                console.log(resdisc);
                this.disc = resdisc.data;
                if (this.disc != 0 && this.disc != null) {
                  //this.dataset[this.row_number].sod_disc_pct = this.disc
                  this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_price: this.price, sod_disc_pct: this.disc });
                  // console.log(this.row_number,this.dataset[this.row_number].sod_price)
                }
                this.calculatetot();
              });
            }
          });

          //console.log(this.row_number,this.dataset[this.row_number].sod_price)
          this.calculatetot();
        },
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
          params: { decimalPlaces: 2 },
        },
        formatter: Formatters.decimal,
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.sod_price);
          this.calculatetot();
        },
      },
      {
        id: "sod_qty_val",
        name: "Nbr jours",
        field: "sod_qty_val",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log("here");
        },
      },
      {
        id: "dec01",
        name: "Nbr heures",
        field: "dec01",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log("here");
        },
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
          params: { decimalPlaces: 2 },
        },
        formatter: Formatters.decimal,
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.sod_disc_pct);
          this.calculatetot();
        },
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
            alert("Type doit etre M ou NULL");
            this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, sod_type: null });
          }
        },
      },
      {
        id: "sod_cc",
        name: "Centre de cout",
        field: "sod_cc",
        sortable: true,
        width: 80,
        filterable: false,

        editor: {
          model: Editors.text,
        },
      },
      {
        id: "sod_taxable",
        name: "Taxable",
        field: "sod_taxable",
        sortable: true,
        width: 30,
        filterable: false,
        editor: {
          model: Editors.checkbox,
        },
        formatter: Formatters.checkmark,
        cannotTriggerInsert: true,
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
          this.calculatetot();
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
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    
    this.createForm();
    this.createtotForm();

   
        
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.invoice = new Invoice();
    const date = new Date();

    this.soForm = this.soFB.group({
      //    so__chr01: [this.invoice.so__chr01],
      itinerary_code: [this.invoice.itinerary_code, Validators.required],
      customer_code: [this.invoice.customer_code],
      name:[null],
      period_active_date: [
        {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
        },
      ],
      
      payment_term_code: [this.invoice.payment_term_code],
      print: [true],
    });
  }
  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new Invoice ();
    // const date = new Date;

    this.totForm = this.totFB.group({
      //    so__chr01: [this.invoice.so__chr01],
      tht: [{ value: 0.0, disabled: true }],
      tva: [{ value: 0.0, disabled: true }],
      timbre: [{ value: 0.0, disabled: true }],
      ttc: [{ value: 0.0, disabled: true }],
    });
  }
  
  //reste form
  reset() {
    this.invoice = new Invoice();
    this.createForm();
    this.createtotForm();
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.soForm.controls;

    /** check form */
    if (this.soForm.invalid) {
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
    // tslint:disable-next-line:prefer-const
    // let so = this.prepareSo();

    // this.addSo(so, this.dataset);
  }

  /**
   *
   * Returns object for saving
   */
  prepareSo(): any {
    const controls = this.soForm.controls;
    const controls1 = this.totForm.controls;
    const _so = new Invoice ();
   

  }
  /**
   * Add po
   *
   * @param _so: so
   */
  // addSo(_so: any, detail: any) {
  //   for (let data of detail) {
  //     delete data.id;
  //     delete data.cmvid;
  //   }
  //   this.loadingSubject.next(true);
  //   let so = null;
  //   const controls = this.soForm.controls;

  //   this.saleOrderService.add({ saleOrder: _so, saleOrderDetail: detail }).subscribe(
  //     (reponse: any) => {
  //       so = reponse.data;
  //       // const arrayOctet = new Uint8Array(reponse.pdf.data)
  //       // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
  //       // const fileUrl = URL.createObjectURL(file);
  //       // window.open(fileUrl)
  //     },
  //     (error) => {
  //       alert("Erreur, vérifier les informations");
  //       this.loadingSubject.next(false);
  //     },
  //     () => {
  //       this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
  //       this.loadingSubject.next(false);
  //       console.log(this.dataset);
  //       if (controls.print.value == true) this.printpdf(so.so_nbr); //printSO(this.customer, this.dataset, so);
  //       this.router.navigateByUrl("/");
  //     }
  //   );
  // }
  // onChangeOC() {
  //   const controls = this.soForm.controls;
  //   const qo_nbr = controls.so_po.value;

  //   this.quoteService.findByOne({ qo_nbr: qo_nbr }).subscribe((res: any) => {
  //     const { quoteOrder, details } = res.data;
  //     console.log(quoteOrder);
  //     controls.so_cust.setValue(quoteOrder.qo_cust);
  //     controls.so_curr.setValue(quoteOrder.qo_curr);
  //     controls.so_cr_terms.setValue(quoteOrder.qo_cr_terms);
  //     controls.so_taxable.setValue(quoteOrder.qo_taxable);
  //     this.customersService.getBy({ cm_addr: quoteOrder.qo_cust }).subscribe((res: any) => {
  //       //console.log(res);
  //       const { data } = res;
  //       this.customer = res.data;
  //     });
  //     for (const object in details) {
  //       const detail = details[object];
  //       console.log(detail.item);
  //       this.gridService.addItem(
  //         {
  //           id: this.dataset.length + 1,
  //           sod_line: this.dataset.length + 1,

  //           sod_part: detail.qod_part,
  //           cmvid: "",
  //           desc: detail.item.pt_desc1,
  //           sod_qty_ord: detail.qod_qty_ord,
  //           sod_um: detail.qod_um,
  //           sod_price: detail.qod_price,
  //           sod_disc_pct: detail.qod_disc_pct,
  //           sod_site: detail.item.pt_site,
  //           sod_loc: detail.item.pt_loc,
  //           sod_type: detail.item.pt_type,
  //           sod_cc: "",
  //           sod_taxable: detail.item.pt_taxable,
  //           sod_tax_code: detail.item.pt_taxc,
  //           sod_taxc: detail.item.taxe.tx2_tax_pct,
  //         },
  //         { position: "bottom" }
  //       );
  //       this.datasetPrint.push({
  //         id: this.dataset.length + 1,
  //         sod_line: this.dataset.length + 1,

  //         sod_part: detail.qod_part,
  //         cmvid: "",
  //         desc: detail.item.pt_desc1,
  //         sod_qty_ord: detail.qod_qty_ord,
  //         sod_um: detail.qod_um,
  //         sod_price: detail.qod_price,
  //         sod_disc_pct: detail.qod_disc_pct,
  //         sod_site: detail.item.pt_site,
  //         sod_loc: detail.item.pt_loc,
  //         sod_type: detail.item.pt_type,
  //         sod_cc: "",
  //         sod_taxable: detail.item.pt_taxable,
  //         sod_tax_code: detail.item.pt_taxc,
  //         sod_taxc: detail.item.taxe.tx2_tax_pct,
  //         // taxe: detail.item.taxe.tx2_tax_pct,
  //       });
  //     }

  //     // }
  //     //);
  //   }),
  //     (error) => {
  //       this.message = `Demande avec ce numero ${qo_nbr} n'existe pas`;
  //       this.hasFormErrors = true;
  //     },
  //     () => {};
  // }
  onChangeItin() {
    const controls = this.soForm.controls; // chof le champs hada wesh men form rah
    
    this.itineraryService.getItineraryByRole({ role_code: this.role, itinerary_code:controls.itinerary_code.value}).subscribe(
      (res: any) => {
        console.log(res);
        

        if (res.data.length==0) {
          controls.itinerary_code.setValue(null);
        alert("Tournée n 'existe pas ou bien n'est ps affectée a ce role " )
        document.getElementById("itinerary_code").focus();
        } 
      },
      (error) => console.log(error)
    );
  }

  onChangeCust() {
    const controls = this.soForm.controls; // chof le champs hada wesh men form rah
    
   
    this.customerMobileService.getCustomerByitin({itinerary_code:controls.itinerary_code.value,customer_code: controls.customer_code.value}).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
        alert('client nexiste pas')
        controls.customer_code.setValue(null)
        document.getElementById("customer_code").focus();
        
        } else {
          this.error = false;
          this.customer = res.data;
          controls.customer_code.setValue(data.customer_code || "");
          controls.name.setValue(data.customer_name || "");
          controls.payment_term_code.setValue(data.payment_method_code || "");
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
        sod_line: this.dataset.length + 1,

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
  handleSelectedRowsChanged2(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        console.log(item);
        const date = new Date();


        this.customer = item;
        controls.customer_code.setValue(item.customer_code || "");
        controls.name.setValue(item.customer_name || "");
        controls.payment_term_code.setValue(item.payment_method_code || "");

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
        id: "customer_code",
        name: "code",
        field: "customer_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "customer_name",
        name: "Nom",
        field: "customer_name",
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
    const controls = this.soForm.controls;
    this.customerMobileService.getByCustomerByitin({ itinerary_code: controls.itinerary_code.value }).subscribe((response: any) => (this.customers = response.data));
  }
  open2(content) {
    this.prepareGrid2();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChanged3(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObj3) {
      args.rows.map((idx) => {
        const item = this.gridObj3.getDataItem(idx);
        console.log(item);
       // this.itineraty = item;
        controls.itinerary_code.setValue(item.itinerary_code || "");

      });
    }
  }

  angularGridReady3(angularGrid: AngularGridInstance) {
    this.angularGrid3 = angularGrid;
    this.gridObj3 = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGrid3() {
    this.columnDefinitions3 = [
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 80,
        maxWidth: 80,
      },
      {
        id: "itinerary_code",
        name: "code Tournée",
        field: "itinerary_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "itinerary_name",
        name: "Nom Tournée",
        field: "itinerary_name",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
    ];

    this.gridOptions3 = {
      enableSorting: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      autoHeight: false,
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
    const controls = this.soForm.controls;
    this.itineraryService.getItinerarydetByRole({ role_code: this.role }).subscribe((response: any) => (this.itinerarys = response.data));
  }
  open3(content) {
    this.prepareGrid3();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    const controls = this.soForm.controls;

    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);
        if (item.pt_phantom) {
          this.type = "M";
        } else {
          this.type = null;
        }

        updateItem.sod_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        updateItem.sod_um = item.pt_um;
        updateItem.sod_um_conv = 1;

        updateItem.sod_site = item.pt_site;
        updateItem.sod_loc = item.pt_loc;
        updateItem.sod_taxable = item.pt_taxable;
        updateItem.sod_tax_code = item.pt_taxc;
        updateItem.sod_taxc = item.taxe.tx2_tax_pct;
        updateItem.sod_type = this.type;
        updateItem.sod_price = item.pt_price;
        updateItem.sod_disc_pct = 0;

        this.gridService.updateItem(updateItem);
      });
    }
  }
  dbclick4(e) {
     this.gridObj4.onDblClick.subscribe((e, args) => {
     alert("On Click");
      
  })
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
        name: "UM",
        field: "pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "pt_ord_max",
        name: "QTE",
        field: "pt_ord_max",
        sortable: true,
        filterable: true,
        type: FieldType.float,
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
      editable: true,
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
    this.itemsService.getStk({}).subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  
  handleSelectedRowsChangedtax(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObjtax) {
      args.rows.map((idx) => {
        const item = this.gridObjtax.getDataItem(idx);
        controls.so_taxc.setValue(item.tx2_tax_code || "");
      });
    }
  }

  angularGridReadytax(angularGrid: AngularGridInstance) {
    this.angularGridtax = angularGrid;
    this.gridObjtax = (angularGrid && angularGrid.slickGrid) || {};
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
    ];

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
    };

    // fill the dataset with your data
    this.taxService.getAll().subscribe((response: any) => (this.datatax = response.data));
  }
  opentax(contenttax) {
    this.prepareGridtax();
    this.modalService.open(contenttax, { size: "lg" });
  }

  calculatetot() {
    const controls = this.totForm.controls;
    const controlsso = this.soForm.controls;
    let tht = 0;
    let tva = 0;
    let timbre = 0;
    let ttc = 0;
    for (var i = 0; i < this.dataset.length; i++) {
      console.log("here here ", this.dataset[i]);
      tht += round(this.dataset[i].sod_price * ((100 - this.dataset[i].sod_disc_pct) / 100) * this.dataset[i].sod_qty_ord, 2);
      if (controlsso.so_taxable.value == true) tva += round(this.dataset[i].sod_price * ((100 - this.dataset[i].sod_disc_pct) / 100) * this.dataset[i].sod_qty_ord * (this.dataset[i].sod_taxc ? this.dataset[i].sod_taxc / 100 : 0), 2);

      if (controlsso.so_cr_terms.value == "ES") {
        timbre = round((tht + tva) / 100, 2);
        if (timbre > 10000) {
          timbre = 10000;
        }
      }
    }
    ttc = round(tht + tva + timbre, 2);

    controls.tht.setValue(tht.toFixed(2));
    controls.tva.setValue(tva.toFixed(2));
    controls.timbre.setValue(timbre.toFixed(2));
    controls.ttc.setValue(ttc.toFixed(2));
  }

  printpdf(nbr) {
    const controls = this.totForm.controls;
    const controlss = this.soForm.controls;
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
    doc.text("Commande N° : " + nbr, 70, 40);
    doc.setFontSize(8);
    console.log(this.customer.address.ad_misc2_id);
    doc.text("Code Client : " + this.customer.cm_addr, 20, 50);
    doc.text("Nom             : " + this.customer.address.ad_name, 20, 55);
    doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 60);
    if (this.customer.address.ad_misc2_id != null) {
      doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 65);
    }
    if (this.customer.address.ad_gst_id != null) {
      doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 70);
    }
    if (this.customer.address.ad_pst_id) {
      doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 75);
    }
    if (this.customer.address.ad_misc1_id != null) {
      doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 80);
    }

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
    doc.text("PU", 138, 88.5);
    doc.line(150, 85, 150, 90);
    doc.text("TVA", 152, 88.5);
    doc.line(160, 85, 160, 90);
    doc.text("REM", 162, 88.5);
    doc.line(170, 85, 170, 90);
    doc.text("THT", 181, 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(6);
    for (let j = 0; j < this.dataset.length; j++) {
      if (j % 30 == 0 && j != 0) {
        doc.addPage();
        // img.src = "./assets/media/logos/companylogo.png";
        doc.addImage(img, "png", 170, 5, 30, 30);
        doc.setFontSize(9);
        if (this.domain.dom_name != null) {
          doc.text(this.domain.dom_name, 10, 10);
        }
        if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
        if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
        if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
        doc.setFontSize(12);
        doc.text("Commande N° : " + nbr, 70, 40);
        doc.setFontSize(8);
        console.log(this.customer.address.ad_misc2_id);
        doc.text("Code Client : " + this.customer.cm_addr, 20, 50);
        doc.text("Nom             : " + this.customer.address.ad_name, 20, 55);
        doc.text("Adresse       : " + this.customer.address.ad_line1, 20, 60);
        if (this.customer.address.ad_misc2_id != null) {
          doc.text("MF          : " + this.customer.address.ad_misc2_id, 20, 65);
        }
        if (this.customer.address.ad_gst_id != null) {
          doc.text("RC          : " + this.customer.address.ad_gst_id, 20, 70);
        }
        if (this.customer.address.ad_pst_id) {
          doc.text("AI            : " + this.customer.address.ad_pst_id, 20, 75);
        }
        if (this.customer.address.ad_misc1_id != null) {
          doc.text("NIS         : " + this.customer.address.ad_misc1_id, 20, 80);
        }

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
        doc.text("PU", 138, 88.5);
        doc.line(150, 85, 150, 90);
        doc.text("TVA", 152, 88.5);
        doc.line(160, 85, 160, 90);
        doc.text("REM", 162, 88.5);
        doc.line(170, 85, 170, 90);
        doc.text("THT", 181, 88.5);
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
        doc.text(String("000" + this.dataset[j].sod_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].sod_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(desc1, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.dataset[j].sod_qty_ord.toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].sod_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].sod_price).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].sod_taxc) + "%", 153, i - 1);
        doc.line(160, i - 5, 160, i);
        doc.text(String(this.dataset[j].sod_disc_pct) + "%", 163, i - 1);
        doc.line(170, i - 5, 170, i);
        doc.text(String((this.dataset[j].sod_price * ((100 - this.dataset[j].sod_disc_pct) / 100) * this.dataset[j].sod_qty_ord).toFixed(2)), 198, i - 1, { align: "right" });
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
        doc.line(150, i - 5, 150, i);
        doc.line(160, i - 5, 160, i);
        doc.line(170, i - 5, 170, i);
        doc.line(200, i - 5, 200, i);
        doc.line(10, i, 200, i);

        i = i + 5;
      } else {
        doc.line(10, i - 5, 10, i);
        doc.text(String("000" + this.dataset[j].sod_line).slice(-3), 12.5, i - 1);
        doc.line(20, i - 5, 20, i);
        doc.text(this.dataset[j].sod_part, 25, i - 1);
        doc.line(45, i - 5, 45, i);
        doc.text(this.dataset[j].desc, 47, i - 1);
        doc.line(100, i - 5, 100, i);
        doc.text(String(this.dataset[j].sod_qty_ord.toFixed(2)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].sod_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(Number(this.dataset[j].sod_price).toFixed(2)), 148, i - 1, { align: "right" });
        doc.line(150, i - 5, 150, i);
        doc.text(String(this.dataset[j].sod_taxc) + "%", 153, i - 1);
        doc.line(160, i - 5, 160, i);
        doc.text(String(this.dataset[j].sod_disc_pct) + "%", 163, i - 1);
        doc.line(170, i - 5, 170, i);
        doc.text(String((this.dataset[j].sod_price * ((100 - this.dataset[j].sod_disc_pct) / 100) * this.dataset[j].sod_qty_ord).toFixed(2)), 198, i - 1, { align: "right" });
        doc.line(200, i - 5, 200, i);
        doc.line(10, i, 200, i);
        i = i + 5;
      }
    }

    // doc.line(10, i - 5, 200, i - 5);

    doc.line(130, i + 7, 200, i + 7);
    doc.line(130, i + 14, 200, i + 14);
    doc.line(130, i + 21, 200, i + 21);
    doc.line(130, i + 28, 200, i + 28);
    doc.line(130, i + 35, 200, i + 35);
    doc.line(130, i + 7, 130, i + 35);
    doc.line(160, i + 7, 160, i + 35);
    doc.line(200, i + 7, 200, i + 35);
    doc.setFontSize(10);

    doc.text("Total HT", 140, i + 12, { align: "left" });
    doc.text("TVA", 140, i + 19, { align: "left" });
    doc.text("Timbre", 140, i + 26, { align: "left" });
    doc.text("Total TC", 140, i + 33, { align: "left" });

    doc.text(String(Number(controls.tht.value).toFixed(2)), 198, i + 12, { align: "right" });
    doc.text(String(Number(controls.tva.value).toFixed(2)), 198, i + 19, { align: "right" });
    doc.text(String(Number(controls.timbre.value).toFixed(2)), 198, i + 26, { align: "right" });
    doc.text(String(Number(controls.ttc.value).toFixed(2)), 198, i + 33, { align: "right" });

    doc.setFontSize(8);
    let mt = NumberToLetters(Number(controls.ttc.value).toFixed(2), this.curr.cu_desc);

    if (mt.length > 95) {
      let mt1 = mt.substring(90);
      let ind = mt1.indexOf(" ");

      mt1 = mt.substring(0, 90 + ind);
      let mt2 = mt.substring(90 + ind);

      doc.text("Arretée la présente Commande a la somme de : " + mt1, 20, i + 53);
      doc.text(mt2, 20, i + 60);
    } else {
      doc.text("Arretée la présente Commande a la somme de : " + mt, 20, i + 53);
    }
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  }
}
