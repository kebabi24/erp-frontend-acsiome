import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";

// Angular slickgrid
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  EditorValidator,
  EditorArgs,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { round } from 'lodash';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {
  SaleOrderService,
  CustomerService,
  ItemService,
  AddressService,
  TaxeService,
  DeviseService,
  InventoryTransaction,
  SaleShiper,
  AccountShiper,
  InventoryTransactionService,
  InventoryStatusService,
  SaleShiperService,
  LocationService,
  SiteService,
  MesureService,
  SequenceService,
  LocationDetailService,
  CodeService,
  AccountShiperService,
  BarecodeinfosService,
  TimbreService,
  PricelistService,
  printBL,
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";
import "jspdf-barcode";
import { ControlResultsEntryComponent } from "../../quality-assurance/control-results-entry/control-results-entry.component";

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

@Component({
  selector: 'kt-create-psh-plq',
  templateUrl: './create-psh-plq.component.html',
  styleUrls: ['./create-psh-plq.component.scss']
})
export class CreatePshPlqComponent implements OnInit {

  saleShiper: SaleShiper;
  accountShiper: AccountShiper;
  inventoryTransaction: InventoryTransaction;
  pshForm: FormGroup;
  qtyForm: FormGroup;
  totForm: FormGroup;
  hasFormErrors = false;
  hasFormErrorsQty = false;
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
  customer: any;
  datapsh: any[];
 
  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  sos: [];
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

  statuss: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  qtyship: Number;
  lddet: any;
  row_number;
  message = "";
  messageQty = "";
  pshServer;
  location: any;
  datasetPrint = [];
  stat: String;
  status: any;
  qty: Number;
  expire: Date;
  seq: any;
  user;
  pshnbr: String;
  curr;
  domain: any;
  code_start_pos: number;
  code_length: number;
  lot_start_pos: number;
  lot_length: number;
  serie_start_pos: number;
  serie_length: number;
  price: Number;
  disc: Number;
  taxable: Boolean;
  item:any;
  pshshipdate : any
  so_taxable: boolean
  prod: any
  lot : any
  qtyl: any
  args
  constructor(
    config: NgbDropdownConfig,
    private prhFB: FormBuilder,
    private qtyFB: FormBuilder,
    private totFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private customersService: CustomerService,
    private saleShiperService: SaleShiperService,
    private inventoryTransactionService: InventoryTransactionService,
    private saleOrderService: SaleOrderService,
    private sequenceService: SequenceService,
    private codeService: CodeService,
    private accountShiperService: AccountShiperService,
    private addressService: AddressService,
    private itemsService: ItemService,
    private deviseService: DeviseService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private locationService: LocationService,
    private locationDetailService: LocationDetailService,
    private barecodeinfosService: BarecodeinfosService,
    private timbreService: TimbreService,
    private pricelistService: PricelistService,
  ) {
    config.autoClose = true;
    this.barecodeinfosService.getAll().subscribe((response: any) => {
      // console.log(response.data)
      this.code_start_pos = Number(response.data[0].start) - 1;
      this.code_length = response.data[0].length;
      this.lot_start_pos = Number(response.data[1].start) - 1;
      this.lot_length = response.data[1].length;
      this.serie_start_pos = Number(response.data[2].start) - 1;
      this.serie_length = response.data[2].length;
    });
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
        // onCellClick: (e: Event, args: OnEventArgs) => {
        //   if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
        //     this.angularGrid.gridService.deleteItem(args.dataContext);
        //   }
        // },
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          this.args = args
          let element: HTMLElement = document.getElementById("openAlertGrid") as HTMLElement;
          element.click();
        },
      },
      
      {
        id: "psh_line",
        name: "Ligne",
        field: "psh_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
        sortable: true,
      },
      {
        id: "psh_part",
        name: "Article",
        field: "psh_part",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
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
        id: "psh_site",
        name: "Site",
        field: "psh_site",
        sortable: true,
        width: 80,
        filterable: false,
      },
      {
        id: "psh_loc",
        name: "Emplacement",
        field: "psh_loc",
        sortable: true,
        width: 80,
        filterable: false,
        
      },
      
      {
        id: "psh_serial",
        name: "Lot/Serie",
        field: "psh_serial",
        sortable: true,
        width: 80,
        filterable: false,
      
      },
      
      {
        id: "psh_qty_ship",
        name: "QTE",
        field: "psh_qty_ship",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,
        editor: {
          model: Editors.float,
          params: { decimalPlaces: 2 }
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
       
            const controls = this.pshForm.controls;
            console.log(args.dataContext.psh_part);
            console.log(controls.psh_cust.value);
            let pricebefore = args.dataContext.sod_price;
            console.log(pricebefore);
            this.price = null;
            this.disc = null;
            this.itemsService.getByOne({ pt_part: args.dataContext.psh_part }).subscribe((resp: any) => {
              if (resp.data) {
                console.log(resp.data);
  
                const date1 = new Date();
                let obj: {};
                const part = resp.data.pt_part;
                const promo = resp.data.pt_promo;
                const cust = this.customer.cm_addr;
                const classe = this.customer.cm_class;
                const qty = args.dataContext.psh_qty_ship;
                const um = args.dataContext.psh_um;
                const curr = this.curr.cu_curr; //controls.psh_curr.value;
                const type = "PT";
                const date = `${controls.psh_ship_date.value.year}-${controls.psh_ship_date.value.month}-${controls.psh_ship_date.value.day}`;
  
                obj = { part, promo, cust, classe, date, qty, um, curr, type };
                this.pricelistService.getPrice(obj).subscribe((res: any) => {
                  console.log("price", res);
                  this.price = res.data;
                  if (this.price != 0 && this.price != null) {
                    this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, psh_price: this.price });
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
                    this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, psh_price: this.price, psh_disc_pct: this.disc });
                    // console.log(this.row_number,this.dataset[this.row_number].sod_price)
                  }
                  this.calculatetot();
                });
              }
            });
  
            //console.log(this.row_number,this.dataset[this.row_number].sod_price)
            this.calculatetot();
            document.getElementById("pal").focus();
          },
      
        
      },
      {
        id: "psh_type",
        name: "Type",
        field: "psh_type",
        sortable: true,
        width: 50,
        filterable: false,
        editor: {
          model: Editors.text,
        },
      },
      {
        id: "psh_um",
        name: "UM",
        field: "psh_um",
        sortable: true,
        width: 50,
        filterable: false,
        
      },

      {
        id: "psh_um_conv",
        name: "Conv UM",
        field: "psh_um_conv",
        sortable: true,
        width: 80,
        filterable: false,
       // editor: {
       //     model: Editors.float,
        //},
        
      },
      {
        id: "psh_price",
        name: "Prix unitaire",
        field: "psh_price",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        formatter: Formatters.decimal,
       
      },
      {
        id: "psh_disc_pct",
        name: "Remise",
        field: "psh_disc_pct",
        sortable: true,
        width: 80,
        filterable: false,
        //type: FieldType.float,
        formatter: Formatters.decimal,
       
      },
       
      {
        id: "psh_status",
        name: "Status",
        field: "psh_status",
        sortable: true,
        width: 80,
        filterable: false,
        
      },
      {
        id: "psh_expire",
        name: "Expire",
        field: "psh_expire",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        formatter: Formatters.dateIso,
        
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableSorting: true,
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
      presets: {
        sorters: [
          { columnId: 'psh_line', direction: 'ASC' }
        ],
        columns: [
          
        { columnId: 'id'},
        { columnId: 'psh_line'},
        { columnId: 'psh_part'},
        { columnId: 'desc'},
        { columnId: 'psh_serial'},
        { columnId: 'psh_qty_ship'},
        { columnId: 'psh_price'},
        
      ]
      },
    };

    this.dataset = [];
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.createForm();
    this.createtotForm();
  }

  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
    //const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });
  }
  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.inventoryTransaction = new InventoryTransaction();
    this.saleShiper = new SaleShiper()
    const date = new Date()
    this.pshForm = this.prhFB.group({
      psh_nbr: [this.saleShiper.psh_nbr],
      psh_cust: [{value:this.saleShiper.psh_cust, disabled:true}],
      name: [{value:"", disabled:true}],
      psh_ship_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      // psh_curr: [{value:this.saleShiper.psh_curr, disabled:true}],
      
      // psh_so_taxable: [{value:this.saleShiper.psh_so_taxable, disabled:true}],
      psh_cr_terms: [{value:this.saleShiper.psh_cr_terms, disabled:true}],
     
      print:[true],
    
      pal: [],
    });
  }

  createFormQty() {
    this.qtyForm = this.qtyFB.group({
    
      qty:null
    }) 
    console.log("hhhhhhere")
    // const input = document.getElementById('qty');
    // // Focus on the input
    // input.focus();
    // Set the cursor to the end
    //input.setSelectionRange(length, length);

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
    const controls = this.pshForm.controls;
    /** check form */
    if (this.pshForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

    if (!this.dataset.length) {
      this.message = "La liste des article ne peut pas etre vide ";
      this.hasFormErrors = true;

      return;
    }

    for (var i = 0; i < this.dataset.length; i++) {
      console.log(this.dataset[i]  )
     if (this.dataset[i].psh_part == "" || this.dataset[i].psh_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].psh_site == "" || this.dataset[i].psh_site == null  ) {
      this.message = "Le Site ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].psh_loc == "" || this.dataset[i].psh_loc == null  ) {
      this.message = "L' Emplacement ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].psh_um == "" || this.dataset[i].psh_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
    //  if (this.dataset[i].psh_status == "" || this.dataset[i].psh_status == null  ) {
    //   this.message = "Le Status ne peut pas etre vide";
    //   this.hasFormErrors = true;
    //   return;
 
    //  }
     if (this.dataset[i].tr_qty_loc == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }

    this.sequenceService.getByOne({ seq_type: "BL", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.pshnbr = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`
         console.log(this.seq.seq_prefix)
         console.log(this.seq.seq_curr_val)
         
        console.log(this.pshnbr)
         const id = Number(this.seq.id)
      let obj = { }
      obj = {
        seq_curr_val: Number(this.seq.seq_curr_val )+1
      }
      this.sequenceService.update(id , obj ).subscribe(
        (reponse) => console.log("response", Response),
        (error) => {
          this.message = "Erreur modification Sequence";
          this.hasFormErrors = true;
          return;
     
        
        },
        )
      }else {
        this.message = "Parametrage Manquant pour la sequence";
        this.hasFormErrors = true;
        return;
   
       }

      
      
    // tslint:disable-next-line:prefer-const
    /**********************************************/
    const controlstot = this.totForm.controls
    console.log("controlestot : ", controlstot.tht.value)
    const tot = {
      tht : controlstot.tht.value,
      tva : controlstot.tva.value,
      timbre : controlstot.timbre.value
    }
    console.log("\n\n tot : ", tot)
    /**********************************************/
    let ps = this.prepare()
   
    this.addIt(this.dataset,ps, this.pshnbr, tot); //from this.totForm.controls;
    
     
  })

  }

  prepare(){
    const controls = this.pshForm.controls;
    const _ps = new SaleShiper();
    _ps.psh_nbr = controls.psh_nbr.value
    _ps.psh_cust = controls.psh_cust.value
    _ps.psh_ship_date = controls.psh_ship_date.value
    ? `${controls.psh_ship_date.value.year}/${controls.psh_ship_date.value.month}/${controls.psh_ship_date.value.day}`
    : null
    _ps.psh_curr = this.curr.cu_curr
    _ps.psh_ex_rate  = 1
    _ps.psh_ex_rate2 = 1
    _ps.psh_so_taxable = this.so_taxable
    return _ps
  }

  prepareAs(){
    const controls = this.pshForm.controls;
    const controls1 = this.totForm.controls;
   
    const _as = new AccountShiper();
    _as.as_so_nbr = controls.psh_nbr.value
    _as.as_cust = controls.psh_cust.value
    _as.as_bill = controls.psh_cust.value
    _as.as_effdate = controls.psh_ship_date.value
    ? `${controls.psh_ship_date.value.year}/${controls.psh_ship_date.value.month}/${controls.psh_ship_date.value.day}`
    : null
    _as.as_type = "I"
    _as.as_curr = this.curr.cu_curr //controls.psh_curr.value
    _as.as_ex_rate  = 1
    _as.as_ex_rate2 = 1
    // _as.as_po = controls.psh_rmks.value
    _as.as_amt = controls1.ttc.value
    _as.as_base_amt = Number(controls1.ttc.value) 
    _as.dec01 = Number(controls1.tht.value)
    _as.dec02 = Number(controls1.tva.value)
    _as.dec03 = Number(controls1.timbre.value)



    return _as
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
  addAs( as, pshnbr) {
    this.loadingSubject.next(true);
    
    const controls = this.pshForm.controls
    
    this.accountShiperService
      .add({as,pshnbr})
      .subscribe(
       (reponse: any) => console.log(reponse),
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
        }
      );
  }
  
   addIt( detail: any, ps, pshnbr, tot) {
    for (let data in detail) {
      delete this.dataset[data].id;
      delete this.dataset[data].cmvid;
    }
    this.loadingSubject.next(true);
    
    const controls = this.pshForm.controls
    
    this.saleShiperService
      .add({detail, ps,pshnbr, tot})
      .subscribe(
       (reponse: any) => {
        console.log(reponse)
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
          let as = this.prepareAs()
          console.log("hhhhhh", as)
          this.addAs(as,this.pshnbr);
          this.loadingSubject.next(false);
         console.log(this.customer, pshnbr, this.dataset);
         let cr_terms = controls.psh_cr_terms.value;
          if(controls.print.value == true)  this.printpdf(pshnbr) //printBL(this.customer, this.dataset, pshnbr, cr_terms);
          this.router.navigateByUrl("/");
        }
      );
  }
  onChangeCC() {
    const controls = this.pshForm.controls;
    const so_nbr = controls.psh_nbr.value;
    
    this.dataset = [];
    this.datapsh=[]
        this.saleOrderService.getBy({ so_nbr: so_nbr, so_stat: null }).subscribe(
          (res: any) => {
            
            const { saleOrder, details } = res.data;
            if (saleOrder != null) {
           console.log(saleOrder)
            const det1 = details;
            
            this.pshServer = saleOrder;
            //console.log(this.pshServer)
            //console.log(this.pshServer.so_cust)
            controls.psh_nbr.setValue(this.pshServer.so_nbr|| "")
            controls.psh_cust.setValue(this.pshServer.so_cust|| "");
           // controls.psh_curr.setValue(this.pshServer.so_curr|| "");
          //  this.curr = this.pshServer.so_curr
            // controls.psh_ex_rate.setValue(this.pshServer.so_ex_rate|| "1");
            // controls.psh_ex_rate2.setValue(this.pshServer.so_ex_rate2|| "1");
            // controls.psh_so_taxable.setValue(this.pshServer.so_taxable);
          this.so_taxable = this.pshServer.so_taxable
            controls.psh_cr_terms.setValue(this.pshServer.so_cr_terms|| "");
            const ad_addr = this.pshServer.so_cust;
            this.customersService.getBy({cm_addr: ad_addr}).subscribe((response: any)=>{
                    
              this.deviseService.getBy({ cu_curr: this.pshServer.so_curr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
            if(data) {
    
              this.curr = data;
            }
          })
              this.customer = response.data
    console.log(this.customer)
            controls.name.setValue(this.customer.address.ad_name);
          
            })
          
        //     for (var object = 0; object < det1.length; object++) {
        //       const detail = det1[object];
        //      console.log(detail)
        //       this.datapsh.push({
        //               id: detail.sod_line, //this.dataset.length + 1,
        //               psh_line: detail.sod_line,   //this.dataset.length + 1,
        //               psh_part: detail.sod_part,
        //               cmvid: "",
        //               desc: detail.item.pt_desc1,
        //               psh_qty_toship: detail.sod_qty_ord - detail.sod_qty_ship,
        //               psh_qty_ship: 0, //detail.sod_qty_ord - detail.sod_qty_ship,
        //               psh_um: detail.sod_um,
        //               psh_um_conv: detail.sod_um_conv,
        //               psh_type: detail.sod_type,
        //               psh_price: detail.sod_price,
        //               psh_disc_pct: detail.sod_disc_pct,
        //               psh_so_taxable: detail.sod_taxable,
        //               psh_tax_code: detail.sod_tax_code,
        //               psh_taxc: detail.sod_taxc,
        //               psh_site: detail.sod_site,
        //               psh_loc: detail.sod_loc,
        //               psh_serial: null,
        //               qty_oh: 0,
        //               psh_status: null,
        //               psh_expire: null,
        //             });
          
          
        // }
        console.log(this.datapsh)
        document.getElementById("pal").focus();
      } else {
        alert ("Commande n'existe pas ou bloqué")
        document.getElementById("cc").focus();
      }
      })    
    
      // this.calculatetot();
    
  }

  
  changeCurr(){
    const controls = this.pshForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.so_curr.value
    this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "cette devise n'existe pas",
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
        psh_line: this.dataset.length + 1,
        psh_part: "",
        cmvid: "",
        desc: "",
        psh_qty_ship: 0,
        psh_um: "",
        psh_um_conv: 1,
        psh_price: 0,
        psh_site: "",
        psh_loc: "",
        psh_serial: "",
        tr_status: "",
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  addsameItem(i ) {
    console.log(i)
    console.log(this.dataset)
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        psh_line: this.dataset.length + 1,
        psh_part: this.dataset[i - 1].psh_part,
        cmvid: "",
        desc: this.dataset[i - 1].desc,
        psh_qty_ship: 0,
        psh_um: this.dataset[i - 1].psh_um,
        psh_um_conv: this.dataset[i - 1].psh_um_conv,
        psh_price: this.dataset[i - 1].psh_price,
        psh_disc_pct: this.dataset[i - 1].psh_disc_pct,
        psh_taxc: this.dataset[i - 1].psh_taxc,
        psh_site: this.dataset[i - 1].psh_site,
        psh_qty_toship : this.dataset[i - 1].psh_qty_toship - this.dataset[i - 1].psh_qty_ship,
        psh_loc: this.dataset[i - 1].psh_loc,
        psh_so_taxable: this.dataset[i - 1].psh_so_taxable,
        psh_tax_code: this.dataset[i - 1].psh_tax_code,
        psh_serial: "",
        tr_status: "",
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  
  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

        this.locationService.getByOne({ loc_loc: item.pt_loc, loc_site: item.pt_site }).subscribe(
          (response: any) => {
            this.location = response.data
            console.log( this.location.loc_status)
        updateItem.psh_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        updateItem.psh_um = item.pt_um;
        updateItem.psh_site = item.pt_site;
        updateItem.psh_loc = item.pt_loc;
        updateItem.psh_status =  this.location.loc_status;
        
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
    this.itemsService
      .getAll()
      .subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  handleSelectedRowsChanged5(e, args) {
    const controls = this.pshForm.controls;

    
    
    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.psh_nbr.setValue(item.so_nbr || "");
        const so_nbr = item.so.so_nbr;

        if (item.so.so_stat == null) {
        this.dataset = [];
        this.saleOrderService.getBy({ so_nbr: so_nbr }).subscribe(
          (res: any) => {
            const { saleOrder, details } = res.data;
           
            const det1 = details;
            
            this.pshServer = saleOrder;
            //console.log(this.pshServer)
            //console.log(this.pshServer.so_cust)
            controls.psh_nbr.setValue(this.pshServer.so_nbr|| "")
            controls.psh_cust.setValue(this.pshServer.so_cust|| "");
           // controls.psh_curr.setValue(this.pshServer.so_curr|| "");
            // this.curr = this.pshServer.so_curr
            // controls.psh_ex_rate.setValue(this.pshServer.so_ex_rate|| "1");
            // controls.psh_ex_rate2.setValue(this.pshServer.so_ex_rate2|| "1");
            controls.psh_so_taxable.setValue(this.pshServer.so_taxable);
            this.so_taxable = this.pshServer.so_taxable
            controls.psh_cr_terms.setValue(this.pshServer.so_cr_terms|| "");
            const ad_addr = this.pshServer.so_cust;
            this.customersService.getBy({cm_addr: ad_addr}).subscribe((response: any)=>{
              this.deviseService.getBy({ cu_curr: this.pshServer.so_curr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
            if(data) {
    
              this.curr = data;
            }
          })
                    
              this.customer = response.data
    
            controls.name.setValue(this.customer.address.ad_name);
          
            })
          
            for (var object = 0; object < det1.length; object++) {
              const detail = details[object];
             console.log(detail)
              this.locationDetailService.getByOneStatus({ ld_site: detail.sod_site, ld_loc: detail.sod_loc, ld_part: detail.sod_part, ld_lot: null }).subscribe(
                (responseld: any) => {
                  this.lddet = responseld.data.locationDetails
                  this.status = responseld.data.trstatus
                
                  console.log(this.status)
                  if (this.lddet == null) { 
                 
                      this.qty = 0.
                  } else { this.qty = responseld.data.locationDetails.ld_qty_oh
                  if (this.status == null) { 
                    this.stat = this.lddet.ld_status 
                    this.expire = this.lddet.ld_expire
                  } else {
                    this.stat = null 
                    this.expire = null
                    
                  }
                }
                  if(controls.exp.value == true) {
                    if (this.qty == 0) { this.qtyship } else {  this.qtyship = detail.sod_qty_ord - detail.sod_qty_ship}} else {this.qtyship = 0}
                      this.gridService.addItem(
                        {
                          id: detail.sod_line, //this.dataset.length + 1,
                          psh_line: detail.sod_line,   //this.dataset.length + 1,
                          psh_part: detail.sod_part,
                          cmvid: "",
                          desc: detail.item.pt_desc1,
                          psh_qty_toship: detail.sod_qty_ord - detail.sod_qty_ship,
                          psh_qty_ship: this.qtyship, //detail.sod_qty_ord - detail.sod_qty_ship,
                          psh_um: detail.sod_um,
                          prh_um_conv: detail.sod_um_conv,
                          psh_type: detail.sod_type,
                          psh_um_conv: 1,
                          psh_price: detail.sod_price,
                          psh_disc_pct: detail.sod_disc_pct,
                          psh_so_taxable: detail.sod_taxable,
                          psh_tax_code: detail.sod_tax_code,
                          psh_taxc: detail.sod_taxc,                      
                          psh_site: detail.sod_site,
                          psh_loc: detail.sod_loc,
                          psh_serial: null,
                          qty_oh: this.qty,
                          psh_status: this.stat,
                          psh_expire: this.expire,
                        },
                        { position: "bottom" }
                      );
          
          }) 
        
        }

      })  
    }else {

      alert("commande  bloquée")
    }              
    })
    this.calculatetot();
  
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
        id: "so_nbr",
        name: "N° BC",
        field: "so.so_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "so_ord_date",
        name: "Date",
        field: "so.so_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.date,
      },
      {
        id: "so_cust",
        name: "Customer",
        field: "so.so_cust",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "so_stat",
        name: "status",
        field: "so.so_stat",
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
    this.saleOrderService
      .getAll()
      .subscribe((response: any) => {
        //console.log(response.data)
        this.sos = response.data });
      
      
      
    }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
  }
  
  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.pshForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        controls.psh_curr.setValue(item.cu_curr || "");
        if(item.cu_curr != 'DA'){
          const date = new Date()
          this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}).subscribe((res:any)=>{
            controls.psh_ex_rate.setValue(res.data.exr_rate)
            controls.psh_ex_rate2.setValue(res.data.exr_rate2)
          })
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
    this.deviseService
      .getAll()
      .subscribe((response: any) => (this.devises = response.data));
  }
  opencurr(content) {
    this.prepareGridcurr();
    this.modalService.open(content, { size: "lg" });
  }
  handleSelectedRowsChangedsite(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjsite) {
      args.rows.map((idx) => {
        const item = this.gridObjsite.getDataItem(idx);
        console.log(item);

            
        updateItem.psh_site = item.si_site;
        
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
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.datasite = response.data));
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

            

        this.locationService.getByOne({ loc_loc: item.loc_loc, loc_site: updateItem.psh_site }).subscribe(
          (response: any) => {
            this.location = response.data
            if (response.data) {

               
           
                    this.inventoryStatusService.getAllDetails({isd_status: this.location.loc_status, isd_tr_type: "ISS-SO" }).subscribe((resstat:any)=>{
                      console.log(resstat)
                      const { data } = resstat;

                      if (data) {
                        this.stat = null
                      } else {
                        this.stat = this.location.loc_status
                      }
                    updateItem.psh_loc = item.loc_loc; 
                    updateItem.psh_status = this.stat


                  });     
 
                  
                }
                else {
                  alert("Emplacement Nexiste pas")
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_loc: null, tr_status: null })
                }
                 
    });
   })
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
    this.locationService
      .getBy({ loc_site:  updateItem.psh_site })
      .subscribe((response: any) => (this.dataloc = response.data));
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

            

        this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-SO" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          alert ("Mouvement Interdit Pour ce Status")
          updateItem.psh_serial = null;
          updateItem.psh_status = null;
          
          updateItem.psh_expire = null;
          updateItem.qty_oh = 0;

        }else {
          updateItem.psh_serial = item.ld_lot;
          updateItem.psh_status = item.ld_status;
          updateItem.psh_expire = item.ld_expire;
          updateItem.qty_oh = item.ld_qty_oh;
          
          this.gridService.updateItem(updateItem);

        }
          
        })

  


        
        
        this.gridService.updateItem(updateItem);
        
  });

    }
  }
  angularGridReadylocdet(angularGrid: AngularGridInstance) {
    this.angularGridlocdet = angularGrid;
    this.gridObjlocdet = (angularGrid && angularGrid.slickGrid) || {};
  }

  prepareGridlocdet() {
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
    this.locationDetailService
      .getBy({ ld_site:  updateItem.psh_site , ld_loc:  updateItem.psh_loc, ld_part:  updateItem.psh_part })
      .subscribe((response: any) => (this.datalocdet = response.data));
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
        updateItem.psh_um = item.code_value;
     
        this.gridService.updateItem(updateItem);

/*********/
console.log(updateItem.psh_part)

      this.itemsService.getBy({pt_part: updateItem.psh_part }).subscribe((resp:any)=>{
                      
        if   (updateItem.psh_um == resp.data.pt_um )  {
          
          updateItem.psh_um_conv = 1
        } else { 
          //console.log(resp.data.pt_um)



            this.mesureService.getBy({um_um: updateItem.psh_um, um_alt_um: resp.data.pt_um, um_part: updateItem.psh_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;

          if (data) {
            //alert ("Mouvement Interdit Pour ce Status")
            updateItem.psh_um_conv = res.data.um_conv 
            this.angularGrid.gridService.highlightRow(1, 1500);
          } else {
            this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.psh_um, um_part: updateItem.psh_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.psh_um_conv = res.data.um_conv
                
              } else {
                updateItem.psh_um_conv = 1
                updateItem.psh_um = null
        
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
angularGridReadyum(angularGrid: AngularGridInstance) {
    this.angularGridum = angularGrid
    this.gridObjum = (angularGrid && angularGrid.slickGrid) || {}
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
    ]

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
        .subscribe((response: any) => (this.ums = response.data))
}
openum(content) {
    this.prepareGridum()
    this.modalService.open(content, { size: "lg" })
}


handleSelectedRowsChangedstatus(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjstatus) {
    args.rows.map((idx) => {
      const item = this.gridObjstatus.getDataItem(idx);

      this.inventoryStatusService.getAllDetails({isd_status: item.is_status, isd_tr_type: "ISS-SO" }).subscribe((res:any)=>{
       
        const { data } = res;

      if (data) {
        alert ("Mouvement Interdit Pour ce Status")
      }else {
        updateItem.tr_status = item.is_status;
   
        this.gridService.updateItem(updateItem);

      }
        
      })

              });
  }
}


angularGridReadystatus(angularGrid: AngularGridInstance) {
  this.angularGridstatus = angularGrid
  this.gridObjstatus = (angularGrid && angularGrid.slickGrid) || {}
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
  this.inventoryStatusService
    .getAll()
    .subscribe((response: any) => (this.statuss = response.data));
    console.log(this.statuss)
}
openstatus(content) {
  this.prepareGridstatus()
  this.modalService.open(content, { size: "lg" })
}

 FindLocDet(site,loc,part,lot) {
console.log(site,loc,part,lot)
  this.locationDetailService.getByOne({ ld_site: site, ld_loc: loc, ld_part: part, ld_lot: lot }).subscribe(
    (responseld: any) => {
      this.lddet = responseld.data
    
  
  this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-SO" }).subscribe(
    (resstat:any)=>{
    //console.log(resstat)
    const { data } = resstat

    if (data) {
      this.stat   = null
      this.expire = null

    } else {
      this.stat   = this.lddet.ld_status
      this.expire = this.lddet.ld_expire
    }
   // console.log(this.lddet.ld_qty_oh,"qty")
    
    this.qty = this.lddet.ld_qty_oh,
    this.status = this.stat,
    this.expire = this.lddet.ld_expire;
    let obj = {qty: this.qty, status: this.status, expire: this.expire}
    
    return(obj)
    
  })
  
})    

}



calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.pshForm.controls 
   let tht = 0
   let tva = 0
   let timbre = 0
   let ttc = 0
   for (var i = 0; i < this.dataset.length; i++) {
     console.log("here", this.dataset[i].psh_price,this.dataset[i].psh_qty_ship, this.dataset[i].psh_disc_pct, this.dataset[i].psh_taxc   )
     tht += round((this.dataset[i].psh_price * ((100 - this.dataset[i].psh_disc_pct) / 100 ) *  this.dataset[i].psh_qty_ship),2)
     if(this.so_taxable == true) tva += round((this.dataset[i].psh_price * ((100 - this.dataset[i].psh_disc_pct) / 100 ) *  this.dataset[i].psh_qty_ship) * (this.dataset[i].psh_taxc ? this.dataset[i].psh_taxc / 100 : 0),2)
    
  
     

    //  console.log(tva)
    //  if(controlsso.psh_cr_terms.value == "ES") { timbre = round((tht + tva) / 100,2);
    //    if (timbre > 10000) { timbre = 10000} } 
  
   }
   this.timbreService.getTimbreValue({ code: controlsso.psh_cr_terms.value, amt: round(tht + tva )}).subscribe(
    (response: any) => {
    //  console.log(response.data.value)
     if(response.data != null) {

      timbre = Math.floor((tht + tva) * Number(response.data.value)/ 100)   
      console.log("timbre",timbre)
      if (timbre < 5) { timbre = 5}            
     }else { timbre = 0}

     ttc = round(tht + tva + timbre,2)

      controls.tht.setValue(tht.toFixed(2));
      controls.tva.setValue(tva.toFixed(2));
      controls.timbre.setValue(timbre.toFixed(2));
      controls.ttc.setValue(ttc.toFixed(2));
     })
//  ttc = round(tht + tva + timbre,2)
// console.log(tht,tva,timbre,ttc)
// controls.tht.setValue(tht.toFixed(2));
// controls.tva.setValue(tva.toFixed(2));
// controls.timbre.setValue(timbre.toFixed(2));
// controls.ttc.setValue(ttc.toFixed(2));

}




printpdf(nbr) {
  const controls = this.totForm.controls 
  const controlss = this.pshForm.controls 
  this.pshshipdate = controlss.psh_ship_date.value
  ? `${controlss.psh_ship_date.value.year}/${controlss.psh_ship_date.value.month}/${controlss.psh_ship_date.value.day}`
  : null
  console.log("pdf")
  var doc = new jsPDF();
  var img = new Image();
  img.src = "./assets/media/logos/companylogo.png";
  doc.addImage(img, "png", 160, 5, 50, 30);
    doc.setFontSize(9);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 10, 10);
    }
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.line(10, 32, 200, 32);
    doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
    doc.line(10, 40, 200, 40);
    // doc.barcode(nbr, {
    //   fontSize: 45,
    //   textColor: "#000000",
    //   x: 120,
    //   y: 50,
    //   textOptions: { align: "center" }, // optional text options
    // });
    doc.setFont("Times-Roman");
  doc.setFontSize(12);
  doc.text( 'Bon Livraison N° : ' + nbr  , 87, 45);
  doc.setFontSize(12);
  //console.log(this.customer.address.ad_misc2_id)
  doc.text('Code Client : ' + this.customer.address.ad_addr, 20 , 50 )
  doc.text('Date : ' +this.pshshipdate, 150 , 50 )
  doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
  doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
  if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
      doc.setFontSize(8);  
  doc.line(10, 85, 200, 85);
  doc.line(10, 90, 200, 90);
  doc.line(10, 85, 10, 90);
  doc.text('LN', 12.5 , 88.5);
  doc.line(20, 85, 20, 90);
  doc.text('Code Article', 25 , 88.5);
  doc.line(45, 85, 45, 90);
  doc.text('Désignation', 67.5 , 88.5);
  doc.line(100, 85, 100, 90);
  doc.text('QTE', 107 , 88.5);
  doc.line(120, 85, 120, 90);
  doc.text('UM', 123 , 88.5);
  doc.line(130, 85, 130, 90);
  doc.text('PU', 138 , 88.5);
  doc.line(150, 85, 150, 90);
  doc.text('TVA', 152 , 88.5);
  doc.line(160, 85, 160, 90);
  doc.text('REM', 162 , 88.5);
  doc.line(170, 85, 170, 90);
  doc.text('THT', 181 , 88.5);
  doc.line(200, 85, 200, 90);
  var i = 95;
  doc.setFontSize(8);
  for (let j = 0; j < this.dataset.length  ; j++) {
    
    if ((j % 30 == 0) && (j != 0) ) {
doc.addPage();
doc.addImage(img, "png", 160, 5, 50, 30);
doc.setFontSize(9);
if (this.domain.dom_name != null) {
  doc.text(this.domain.dom_name, 10, 10);
}
if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
doc.line(10, 32, 200, 32);
doc.text( 'RC : ' + this.domain.dom_rc + "          NIF : " + this.domain.dom_nif +  "          AI : " + this.domain.dom_ai  , 60, 37);
doc.line(10, 40, 200, 40);
// doc.barcode(nbr, {
//   fontSize: 45,
//   textColor: "#000000",
//   x: 120,
//   y: 50,
//   textOptions: { align: "center" }, // optional text options
// });
doc.setFont("Times-Roman");
doc.setFontSize(12);
doc.text( 'Bon Livraison N° : ' + nbr  , 87, 45);
      doc.setFontSize(12);
      //console.log(this.customer.ad_misc2_id)
      doc.text('Code Client : ' + this.customer.address.ad_addr, 20 , 50 )
      doc.text('Date : ' +this.pshshipdate, 150 , 50 )
      doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
      doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
      if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
      doc.setFontSize(8);
      doc.line(10, 85, 200, 85);
      doc.line(10, 90, 200, 90);
      doc.line(10, 85, 10, 90);
      doc.text('LN', 12.5 , 88.5);
      doc.line(20, 85, 20, 90);
      doc.text('Code Article', 25 , 88.5);
      doc.line(45, 85, 45, 90);
      doc.text('Désignation', 67.5 , 88.5);
      doc.line(100, 85, 100, 90);
      doc.text('QTE', 107 , 88.5);
      doc.line(120, 85, 120, 90);
      doc.text('UM', 123 , 88.5);
      doc.line(130, 85, 130, 90);
      doc.text('PU', 138 , 88.5);
      doc.line(150, 85, 150, 90);
      doc.text('TVA', 152 , 88.5);
      doc.line(160, 85, 160, 90);
      doc.text('REM', 162 , 88.5);
      doc.line(170, 85, 170, 90);
      doc.text('THT', 181 , 88.5);
      doc.line(200, 85, 200, 90);
      i = 95;
      doc.setFontSize(6);

    }



    if (this.dataset[j].desc.length > 35) {
      let desc1 = this.dataset[j].desc.substring(35)
      let ind = desc1.indexOf(' ')
      desc1 = this.dataset[j].desc.substring(0, 35  + ind)
      let desc2 = this.dataset[j].desc.substring(35+ind)

      doc.line(10, i - 5, 10, i );
      doc.text(String(("000"+ this.dataset[j].psh_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].psh_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(desc1, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(this.dataset[j].psh_qty_ship.toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.dataset[j].psh_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(Number(this.dataset[j].psh_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.dataset[j].psh_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(this.dataset[j].psh_disc_pct) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.dataset[j].psh_price *
              ((100 - this.dataset[j].psh_disc_pct) / 100) *
              this.dataset[j].psh_qty_ship).toFixed(2)), 198 , i  - 1,{ align: 'right' });
      doc.line(200, i-5 , 200, i );
     // doc.line(10, i, 200, i );

      i = i + 5;

      doc.text(desc2, 47 , i  - 1);
      
      doc.line(10, i - 5, 10, i );
      doc.line(20, i - 5, 20, i);
      doc.line(45, i - 5 , 45, i );
      doc.line(100, i - 5, 100, i );
      doc.line(120, i - 5 , 120, i );
      doc.line(130, i - 5, 130, i );
      doc.line(150, i - 5, 150, i );
      doc.line(160, i - 5 , 160, i );
      doc.line(170, i - 5 , 170, i );
      doc.line(200, i-5 , 200, i );
      doc.line(10, i, 200, i );

      i = i + 5 ;
      
    } else {


    
    doc.line(10, i - 5, 10, i );
    doc.text(String(("000"+ this.dataset[j].psh_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.dataset[j].psh_part, 25 , i  - 1);
    doc.line(45, i - 5 , 45, i );
    doc.text(this.dataset[j].desc, 47 , i  - 1);
    doc.line(100, i - 5, 100, i );
    doc.text( String(this.dataset[j].psh_qty_ship.toFixed(2)), 118 , i  - 1 , { align: 'right' });
    doc.line(120, i - 5 , 120, i );
    doc.text(this.dataset[j].psh_um, 123 , i  - 1);
    doc.line(130, i - 5, 130, i );
    doc.text( String(Number(this.dataset[j].psh_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
    doc.line(150, i - 5, 150, i );
    doc.text(String(this.dataset[j].psh_taxc) + "%" , 153 , i  - 1);
    doc.line(160, i - 5 , 160, i );
    doc.text(String(this.dataset[j].psh_disc_pct) + "%" , 163 , i  - 1);
    doc.line(170, i - 5 , 170, i );
    doc.text(String((this.dataset[j].psh_price *
      ((100 - this.dataset[j].psh_disc_pct) / 100) *
      this.dataset[j].psh_qty_ship).toFixed(2)), 198 , i  - 1,{ align: 'right' });
    doc.line(200, i-5 , 200, i );
    doc.line(10, i, 200, i );
    i = i + 5;
    }
  }
  
 // doc.line(10, i - 5, 200, i - 5);

 doc.line(130, i + 7,  200, i + 7  );
 doc.line(130, i + 14, 200, i + 14 );
 doc.line(130, i + 21, 200, i + 21 );
 doc.line(130, i + 28, 200, i + 28 );
 doc.line(130, i + 35, 200, i + 35 );
 doc.line(130, i + 7,  130, i + 35  );
 doc.line(160, i + 7,  160, i + 35  );
 doc.line(200, i + 7,  200, i + 35  );
 doc.setFontSize(10);
 
 doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
 doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
 doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
 doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

 
 doc.text(String(Number(controls.tht.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
 doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
 doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
 doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });

 doc.setFontSize(8);
    let mt = NumberToLetters(
      Number(controls.ttc.value).toFixed(2),this.curr.cu_desc)

      if (mt.length > 95) {
        let mt1 = mt.substring(90)
        let ind = mt1.indexOf(' ')
       
        mt1 = mt.substring(0, 90  + ind)
        let mt2 = mt.substring(90+ind)
   
        doc.text( "Arretée la présente Commande a la somme de :" + mt1  , 20, i + 53)
        doc.text(  mt2  , 20, i + 60)
      } else {
        doc.text( "Arretée la présente Commande a la somme de :" + mt  , 20, i + 53)

      }
    // window.open(doc.output('bloburl'), '_blank');
    //window.open(doc.output('blobUrl'));  // will open a new tab
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));

  }

  onScanPal(content2,content8,contentQty) {
    const controls = this.pshForm.controls;
    if (controls.psh_nbr.value === "") {
      this.modalService.open(content2, { size: "lg" });
      document.getElementById("pal").focus();
      this.playAudio()
      return;
    }
    else {  
    let pal = controls.pal.value;

    
    let prod = pal.substring(this.code_start_pos, this.code_start_pos + this.code_length);
    //console.log(this.code_start_pos , this.code_length)
    let lot = pal.substring(this.lot_start_pos, this.lot_start_pos + this.lot_length); // stop at 8
    let serie = pal.substring(this.serie_start_pos, this.serie_start_pos + this.serie_length);

    console.log(prod, lot, serie);
    console.log(this.datapsh)
    // let index = this.datapsh.findIndex((element) => {
    //   return element.psh_part === prod;
    // });
    // console.log(index)
    //   if(index != -1) {
      this.itemsService.getByOne({ pt_part: prod }).subscribe((resp: any) => {
        if (resp.data) {
          console.log(resp.data);
          this.item = resp.data

        let ind = this.dataset.findIndex((item) => {
          return (item.psh_part === prod && item.psh_serial === lot);
        });
         console.log(ind,lot,serie)
        if(ind == -1 && lot != '' && serie != '') {
         
          this.prod = prod
          this.lot = lot
          this.createFormQty()       
          this.modalService.open(contentQty, { backdrop: 'static', size: "lg" });
  
          const input = document.getElementById('qty');
          // // Focus on the input
         input.focus(); 
          // document.getElementById("qtyl").focus();
          
 
     } else {
      // let updateItem = this.gridService.getDataItemByRowIndex(ind);
      // updateItem.psh_qty_ship =  this.dataset[ind].psh_qty_ship + 1 ;
        
      // this.gridService.updateItem(updateItem);
      this.modalService.open(content8)
          // alert("Lot Produit Déja Exist ou bien lot erronée")
        }
      
      
     // controls.qty_cart.setValue(this.dataset.length )
      
    // } else {
    //   this.playAudio()
    //   this.modalService.open(content8, { size: "lg" });
    // }
  //  console.log(this.dataset)
  //   controls.pal.setValue(null);
  //   document.getElementById("pal").focus();
  
      }
     else {
        this.playAudio()
        this.modalService.open(content8, { size: "lg" });
      }
   })
  }
  }
  playAudio(){
    let audio = new Audio();
    audio.src = "../../../assets/media/error/error.mp3";
    audio.load();
    audio.play();
  }

  openQty(content) {
    this.modalService.open(content, { size: "lg" });
  }
  onChangeQty(content){
    
    const controls = this.pshForm.controls;
    const controlsQ = this.qtyForm.controls;
    this.qtyl = controlsQ.qty.value;
    const qty = controlsQ.qty.value;
    // let pricebefore = args.dataContext.sod_price;
    // console.log(pricebefore);
    this.price = 0;
    this.disc = 0;
    this.itemsService.getByOne({ pt_part: this.prod }).subscribe((resp: any) => {
      if (resp.data) {
        console.log(resp.data);
console.log("controlsQ.qty.value:",controlsQ.qty.value)
        const date1 = new Date();
        let obj: {};
        const part = resp.data.pt_part;
        const promo = resp.data.pt_promo;
        const cust = this.customer.cm_addr;
        const classe = this.customer.cm_class;
        //const qty = controlsQ.qty.value;
        this.qtyl = controlsQ.qty.value;
        const um = this.item.pt_um;
        const curr = this.curr.cu_curr; //controls.psh_curr.value;
        const type = "PT";
        const date = `${controls.psh_ship_date.value.year}-${controls.psh_ship_date.value.month}-${controls.psh_ship_date.value.day}`;

        obj = { part, promo, cust, classe, date, qty, um, curr, type };
        this.pricelistService.getPrice(obj).subscribe((res: any) => {
          console.log("price", res);
          this.price = res.data;

          let objr: {};
        const typer = "PR";

        objr = { part, promo, cust, classe, date, qty, um, curr, typer };

        console.log(obj);

        this.pricelistService.getDiscPct(objr).subscribe((resdisc: any) => {
          console.log(resdisc);
          this.disc = resdisc.data;

          /* add line */

console.log(this.prod,this.lot,this.price,this.qtyl,)
if (this.price != null && Number(this.qtyl) != 0) {
this.angularGrid.gridService.addItem(
  {
                id: this.dataset.length + 1, //this.dataset.length + 1,
                psh_line: this.dataset.length + 1,   //this.dataset.length + 1,
                psh_part: this.prod,
                cmvid: "",
                desc: this.item.pt_desc1,
               // psh_qty_toship: detail.sod_qty_ord - detail.sod_qty_ship,
                psh_qty_ship: this.qtyl, //detail.sod_qty_ord - detail.sod_qty_ship,
                psh_um: this.item.pt_um,
                psh_um_conv: 1,
                psh_type: (this.item.pt_phantom) ? "M" : null,
                psh_price: this.price,
                psh_disc_pct: this.disc,
                psh_so_taxable: this.item.pt_taxable,
                psh_tax_code: this.item.pt_taxc,
                psh_taxc: this.item.taxe.tx2_tax_pct,
                psh_site: this.item.pt_site,
                psh_loc: this.item.pt_loc,
                psh_serial: this.lot,
                qty_oh: 0,
                psh_status: null,
                psh_expire: null,
  },
  { position: "bottom" }
 
);
this.calculatetot()
const controls = this.pshForm.controls
controls.pal.setValue(null);
document.getElementById("pal").focus();
this.modalService.dismissAll()
}else {
this.playAudio()
console.log("this.qtyl, this.price",this.qtyl, this.price)
this.modalService.open(content, { size: "lg" });
document.getElementById("pal").focus();

}     

/* add line */


        });

          // if (this.price != 0 && this.price != null) {
          //   this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, psh_price: this.price });
          // }
          //    this.dataset[this.row_number].sod_price = this.price
          //console.log(this.row_number,this.dataset[this.row_number].sod_price)
        });

        
      
      }
     
    });

    //console.log(this.row_number,this.dataset[this.row_number].sod_price)
    

  }

  addite(content){
   
         console.log(this.prod,this.lot,this.price,this.qtyl,)
         if (this.price != null && Number(this.qtyl) != 0) {
         this.angularGrid.gridService.addItem(
           {
                         id: this.dataset.length + 1, //this.dataset.length + 1,
                         psh_line: this.dataset.length + 1,   //this.dataset.length + 1,
                         psh_part: this.prod,
                         cmvid: "",
                         desc: this.item.pt_desc1,
                        // psh_qty_toship: detail.sod_qty_ord - detail.sod_qty_ship,
                         psh_qty_ship: this.qtyl, //detail.sod_qty_ord - detail.sod_qty_ship,
                         psh_um: this.item.pt_um,
                         psh_um_conv: 1,
                         psh_type: (this.item.pt_phantom) ? "M" : null,
                         psh_price: this.price,
                         psh_disc_pct: this.disc,
                         psh_so_taxable: this.item.pt_taxable,
                         psh_tax_code: this.item.pt_taxc,
                         psh_taxc: this.item.taxe.tx2_tax_pct,
                         psh_site: this.item.pt_site,
                         psh_loc: this.item.pt_loc,
                         psh_serial: this.lot,
                         qty_oh: 0,
                         psh_status: null,
                         psh_expire: null,
           },
           { position: "bottom" }
          
         );
         this.calculatetot()
     const controls = this.pshForm.controls
         controls.pal.setValue(null);
         document.getElementById("pal").focus();
     this.modalService.dismissAll()
     }else {
       this.playAudio()
       console.log("this.qtyl, this.price",this.qtyl, this.price)
       this.modalService.open(content, { size: "lg" });
       document.getElementById("pal").focus();
        
     }     
   
  }
  delete(){
    this.angularGrid.gridService.deleteItem(this.args.dataContext);
    this.calculatetot()
    this.modalService.dismissAll()
  }
  opendelete(content) {
    this.modalService.open(content, { backdrop: 'static', size: "lg" });
  }
}
