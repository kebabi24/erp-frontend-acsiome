import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { addDays,addMs } from "@fullcalendar/angular";
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
  TimbreService,
  printBL,
  LabelService,
  Label,EntityService,
  
} from "../../../../core/erp";
import { DecimalPipe } from "@angular/common";
import { jsPDF } from "jspdf";
import { NumberToLetters } from "../../../../core/erp/helpers/numberToString";


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
  selector: 'kt-create-psh',
  templateUrl: './create-psh.component.html',
  styleUrls: ['./create-psh.component.scss']
}) 
export class CreatePshComponent implements OnInit {
  saleShiper: SaleShiper;
  accountShiper: AccountShiper;
  inventoryTransaction: InventoryTransaction;
  pshForm: FormGroup;
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
  customer: any;
  
 
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

remise:any;
contrat:any;
bc:any;
terms:any;
duedate:any;
lieu:any;
selectedField = ""
  dataentity: [];
    columnDefinitionsentity: Column[] = [];
    gridOptionsentity: GridOption = {};
    gridObjentity: any;
    angularGridentity: AngularGridInstance;
  nom:any;  
  addresse:any;
  RC:any;
  NIF:any;
  AI :any;
  NIS :any;
  mail:any;
  phone:any;
  banque:any;
  constructor(
    config: NgbDropdownConfig,
    private prhFB: FormBuilder,
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
    private labelService: LabelService,
    private entityService       : EntityService, 
    private timbreService : TimbreService,
  ) {
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
        formatter: Formatters.icon, params: { formatterIcon: 'fa fa-plus' },
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          //if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
          //  this.angularGrid.gridService.deleteItem(args.dataContext);
         // }
         this.addsameItem(args.dataContext.id)
        
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
      // {
      //   id: "desc2",
      //   name: "ARAB",
      //   field: "desc2",
      //   sortable: true,
      //   width: 180,
      //   filterable: false,
      // },
      {
        id: "psh_site",
        name: "Site",
        field: "psh_site",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {

          this.siteService.getByOne({ si_site: args.dataContext.psh_site,}).subscribe(
            (response: any) => {
              
          

                if (response.data) {
                  
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_site: response.data.si_site})
                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , psh_site: null});
    
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
      
      {
        id: "psh_loc",
        name: "Emplacement",
        field: "psh_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },


        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.psh_loc)
          
            
            this.locationService.getByOne({ loc_loc: args.dataContext.psh_loc, loc_site: args.dataContext.psh_site }).subscribe(
              (response: any) => {
                this.location = response.data
                if (response.data) {

                    this.locationDetailService.getByOne({ ld_site: args.dataContext.psh_site, ld_loc: args.dataContext.psh_loc, ld_part: args.dataContext.psh_part, ld_lot: null }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                        console.log(this.lddet[0].ld_qty_oh)
               
                        this.inventoryStatusService.getAllDetails({isd_status:  this.lddet.ld_status, isd_psh_type: "ISS-SO" }).subscribe((resstat:any)=>{
                          console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat =  this.lddet.ld_status
                          }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   psh_status: this.stat, qty_oh: this.lddet.ld_qty_oh})
                        });     
     
                      });     
                    }
                    else {
                      alert("Emplacement Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_loc: null, qty_oh: 0, psh_status: null })
                    }
                     
        });

      }



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
              let element: HTMLElement = document.getElementById(
              "openLocsGrid"
              ) as HTMLElement;
              element.click();
          },
      },       
      
      {
        id: "psh_serial",
        name: "Lot/Serie",
        field: "psh_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {




          



            this.locationDetailService.getByOne({ ld_site: args.dataContext.psh_site, ld_loc: args.dataContext.psh_loc, ld_part: args.dataContext.psh_part, ld_lot: args.dataContext.psh_serial }).subscribe(
              (response: any) => {
                this.lddet = response.data
                
        console.log(response.data.length)
                  if (response.data.length != 0) {
                    
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddet.ld_qty_oh, psh_status: this.lddet.ld_status, psh_expire: this.lddet.ld_expire})
                  }
                  else {
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , psh_serial: null, qty_0h: 0});
      
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
        id: "psh_qty_toship",
        name: "QTE Rest",
        field: "psh_qty_toship",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.float,

        
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
          
          if (args.dataContext.psh_type != 'M' && args.dataContext.psh_qty_ship * args.dataContext.psh_um_conv   > args.dataContext.qty_oh) {
             
           alert ("Qte Manquante")
           this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_qty_ship: null })
        //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
       
         
          } else {

            if (args.dataContext.psh_qty_ship * args.dataContext.psh_um_conv   > args.dataContext.psh_qty_toship) {
          
              alert ("Qte Superieure a Qte livrée")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_qty_ship: null })
           //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;


          }
        }
        
            this.calculatetot();
        
      }

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
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          this.itemsService.getBy({pt_part: args.dataContext.psh_part }).subscribe((resp:any)=>{
            
          if   (args.dataContext.psh_um == resp.data.pt_um )  {
            
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_um_conv: 1 })
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: args.dataContext.psh_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.psh_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
    
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_um_conv: res.data.um_conv })
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.psh_um, um_part: args.dataContext.psh_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_um_conv: res.data.um_conv })
                  
                } else {
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , psh_um_conv: "1" , psh_um: null});
           
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
  tht: [{ value: 0.0, disabled: true }],
  tbt: [{ value: 0.0, disabled: true }],
  remise: [{value: 0.00 , disabled: true}],
  tva: [{ value: 0.0, disabled: true }],
  // tva09: [{ value: 0.0, disabled: true }],
  // tva19: [{ value: 0.0, disabled: true }],
  timbre: [{ value: 0.0, disabled: true }],
  ttc: [{ value: 0.0, disabled: true }],
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
      // psh_ship: [this.saleShiper.psh_ship],
      psh_cust: [{value:this.saleShiper.psh_cust, disabled:true}],
      name: [{value:"", disabled:true}],
      // psh_shipto: [{value:this.saleShiper.psh_shipto}],
      psh_ship_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      // psh_xinvoice: [this.saleShiper.psh_xinvoice],
      psh_curr: [{value:this.saleShiper.psh_curr, disabled:true}],
      psh_ex_rate: [{value:this.saleShiper.psh_ex_rate}],
      psh_ex_rate2: [{value:this.saleShiper.psh_ex_rate2}],
      
      psh_rmks: [this.saleShiper.psh_rmks],
      psh_so_taxable: [{value:this.saleShiper.psh_so_taxable, disabled:true}],
      psh_cr_terms: [{value:this.saleShiper.psh_cr_terms, disabled:true}],
      // psh_po_site:[this.saleShiper.psh_po_site],
      
      print:[true],
      exp:[false]
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
    const input = document.getElementById('submit') as HTMLInputElement | null;


    input?.setAttribute('disabled', '');
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
    // if (controls.psh_po_site.value == null || controls.psh_po_site.value == '') {
    //   this.message = "veuillez choisir l'entité";
    //   this.hasFormErrors = true;

    //   return;
    // }
let somme = 0
    for (var i = 0; i < this.dataset.length; i++) {
      console.log(this.dataset[i]  )
     if (this.dataset[i].psh_part == "" || this.dataset[i].psh_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     somme = somme + this.dataset[i].psh_qty_ship;
     if(this.dataset[i].psh_qty_ship != 0)
     { 

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
      if (this.dataset[i].psh_status == "" || this.dataset[i].psh_status == null  ) {
      this.message = "Le Status ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
      }
     }

    }
if(somme == 0){
  this.message = "Aucune ligne n'a été livrée";
  this.hasFormErrors = true;
  return;
}
    this.sequenceService.getByOne({ seq_type: "BL" , seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data
    console.log(this.seq)   
        if (this.seq) {
         this.pshnbr = `${this.seq.seq_prefix}${Number(this.seq.seq_curr_val)+1}`
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
    let as = this.prepareAs()
    // this.lieu = controls.psh_shipto.value
    // if(this.lieu == null){this.lieu = ''}
    console.log("hhhhhh", as)
    this.addAs(as,this.pshnbr);
     
  })

  }

  prepare(){
    const controls = this.pshForm.controls;
    const _ps = new SaleShiper();
    _ps.psh_nbr = controls.psh_nbr.value
    _ps.psh_cust = controls.psh_cust.value
    // _ps.psh_ship = controls.psh_ship.value
    // _ps.psh_shipto = controls.psh_shipto.value
    _ps.psh_ship_date = controls.psh_ship_date.value
    ? `${controls.psh_ship_date.value.year}/${controls.psh_ship_date.value.month}/${controls.psh_ship_date.value.day}`
    : null
    // _ps.psh_xinvoice = controls.psh_xinvoice.value
    _ps.psh_curr = controls.psh_curr.value
    _ps.psh_ex_rate  = controls.psh_ex_rate.value
    _ps.psh_ex_rate2 = controls.psh_ex_rate2.value
    _ps.psh_rmks = controls.psh_rmks.value
    // _ps.psh_po_site = controls.psh_po_site.value
    return _ps
  }

  prepareAs(){
    const controls = this.pshForm.controls;
    const controls1 = this.totForm.controls;
   
    const _as = new AccountShiper();
    _as.as_so_nbr = controls.psh_nbr.value
    // _as.as_entity = controls.psh_po_site.value
    _as.as_cust = controls.psh_cust.value
    _as.as_effdate = controls.psh_ship_date.value
    ? `${controls.psh_ship_date.value.year}/${controls.psh_ship_date.value.month}/${controls.psh_ship_date.value.day}`
    : null
    _as.as_type = "I"
    _as.as_curr = controls.psh_curr.value
    _as.as_ex_rate  = controls.psh_ex_rate.value
    _as.as_ex_rate2 = controls.psh_ex_rate2.value
    _as.as_po = controls.psh_rmks.value
    _as.as_amt = controls1.ttc.value
    _as.as_base_amt = Number(controls1.ttc.value) * Number(controls.psh_ex_rate2.value) /  Number(controls.psh_ex_rate.value)
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
          this.loadingSubject.next(false);
        
         let cr_terms = controls.psh_cr_terms.value;
          if(controls.print.value == true)  this.printpdf(pshnbr) 
          this.router.navigateByUrl("/");
        }
      );
  }
  onChangeCC() {
    const controls = this.pshForm.controls;
    const so_nbr = controls.psh_nbr.value;
    
    this.dataset = [];
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
            // controls.psh_ship.setValue(this.pshServer.so_po|| "");
            // controls.psh_shipto.setValue(this.pshServer.so_ship|| "");
            // controls.psh_xinvoice.setValue(this.pshServer.so_quote|| "");
            controls.psh_curr.setValue(this.pshServer.so_curr|| "");
            controls.psh_ex_rate.setValue(this.pshServer.so_ex_rate|| "1");
            controls.psh_ex_rate2.setValue(this.pshServer.so_ex_rate2|| "1");
            controls.psh_so_taxable.setValue(this.pshServer.so_taxable);
            controls.psh_cr_terms.setValue(this.pshServer.so_cr_terms|| "");
         
            
            const ad_addr = this.pshServer.so_cust;
            // this.contrat = this.pshServer.so_quote
            // if(this.contrat == null){this.contrat = ''}
            // this.bc = this.pshServer.so_po
            // if(this.bc == null){this.bc = ''}
            // this.terms = this.pshServer.so_cr_terms
            // this.lieu = this.pshServer.so_ship
            // if(this.lieu == null){this.lieu = ''}
           


            this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
                    
              this.deviseService.getBy({ cu_curr: this.pshServer.so_curr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
            if(data) {
    
              this.curr = data;
            }
          })
              this.customer = response.data[0]
    console.log(response.data)
            controls.name.setValue(this.customer.ad_name);
          
            })

          
            for (var object = 0; object < det1.length; object++) {
              const detail = details[object];
             console.log(detail)
              this.locationDetailService.getByOneStatus({ ld_site: detail.sod_site, ld_loc: detail.sod_loc, ld_part: detail.sod_part, ld_lot: null }).subscribe(
                (responseld: any) => {
                 
                  this.lddet = responseld.data.locationDetails
                  this.status = responseld.data.trstatus
                 
               
             
                  if (this.lddet == null) { 
                 
                      this.qty = 0,
                      this.status = null
                      this.expire = null

                  } else { this.qty = this.lddet.ld_qty_oh
                  if (this.status == null) { 
                    this.stat = responseld.data.locationDetails.ld_status 
                    this.expire = responseld.data.locationDetails.ld_expire
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
                      // desc2: detail.item.pt_desc2,
                      psh_qty_toship: detail.sod_qty_ord - detail.sod_qty_ship,
                      psh_qty_ship: this.qtyship, //detail.sod_qty_ord - detail.sod_qty_ship,
                      psh_um: detail.sod_um,
                      psh_um_conv: detail.sod_um_conv,
                      psh_type: detail.sod_type,
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
      } else {
        alert ("Commande n'existe pas ou bloqué")
        document.getElementById("cc").focus();
      }
      })    
    
      this.calculatetot();
    
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
        // desc2:"",
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
        // desc2: this.dataset[i - 1].desc2,
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
            controls.psh_nbr.setValue(this.pshServer.so_nbr|| "")
            controls.psh_cust.setValue(this.pshServer.so_cust|| "");
            // controls.psh_ship.setValue(this.pshServer.so_po|| "");
            // controls.psh_shipto.setValue(this.pshServer.so_ship|| "");
            // controls.psh_xinvoice.setValue(this.pshServer.so_quote|| "");
            controls.psh_curr.setValue(this.pshServer.so_curr|| "");
            controls.psh_ex_rate.setValue(this.pshServer.so_ex_rate|| "1");
            controls.psh_ex_rate2.setValue(this.pshServer.so_ex_rate2|| "1");
            controls.psh_so_taxable.setValue(this.pshServer.so_taxable);
            controls.psh_cr_terms.setValue(this.pshServer.so_cr_terms|| "");
            
            const ad_addr = this.pshServer.so_cust;
            // this.contrat = this.pshServer.so_quote
            // if(this.contrat == null){this.contrat = ''}
            // this.bc = this.pshServer.so_po
            // if(this.bc == null){this.bc = ''}
            // this.lieu = this.pshServer.so_ship
            // if(this.lieu == null){this.lieu = ''}
           
            this.addressService.getBy({ad_addr: ad_addr}).subscribe((response: any)=>{
              this.deviseService.getBy({ cu_curr: this.pshServer.so_curr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
            if(data) {
    
              this.curr = data;
            }
            this.customer = response.data[0]
            console.log(this.customer[0])
            controls.name.setValue(this.customer.ad_name);
          
          })
                    
              
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
                      this.stat = 'CONFORME'
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
                          // desc2: detail.item.pt_desc2,
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
                          psh_serial: detail.sod_serial,
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

onChangeEXP() {
  const controls = this.pshForm.controls;
  const exp = controls.exp.value;

  if (exp == true) {
    for (var i = 0; i < this.dataset.length; i++) {
      let updateItem = this.gridService.getDataItemByRowIndex(i);
      console.log(this.dataset[i].psh_type , this.dataset[i].qty_oh)
      if (this.dataset[i].qty_oh == 0 && this.dataset[i].psh_type != 'M') {updateItem.psh_qty_ship = 0 
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")}
             else {
              console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
          updateItem.psh_qty_ship = this.dataset[i].psh_qty_toship ;
        }
          this.gridService.updateItem(updateItem);
       
    };
  
  } else {
    for (var i = 0; i < this.dataset.length; i++) {
      let updateItem = this.gridService.getDataItemByRowIndex(i);
      
  
              
          updateItem.psh_qty_ship = 0 ;
          
          this.gridService.updateItem(updateItem);
       
    };
  
  }
 
this.calculatetot();
}


calculatetot(){
  const controls = this.totForm.controls 
   const controlsso = this.pshForm.controls 
  //  let tbt = 0
   let remise = 0
   let tht = 0
   let tva = 0
  //  let tva09 = 0
  //  let tva19 = 0
   let timbre = 0
   let ttc = 0
   for (var i = 0; i < this.dataset.length; i++) {
    // tbt += round((this.dataset[i].psh_price * ((100 ) / 100 ) *  this.dataset[i].psh_qty_ship),2)
    // remise += round((this.dataset[i].psh_price * ((this.dataset[i].psh_disc_pct) / 100 ) *  this.dataset[i].psh_qty_ship),2)
    tht += round((this.dataset[i].psh_price * ((100 - this.dataset[i].psh_disc_pct) / 100 ) *  this.dataset[i].psh_qty_ship),2)
     if(controlsso.psh_so_taxable.value == true) {tva += round((this.dataset[i].psh_price * ((100 - this.dataset[i].psh_disc_pct) / 100 ) *  this.dataset[i].psh_qty_ship) * (this.dataset[i].psh_taxc ? this.dataset[i].psh_taxc / 100 : 0),2)
      // if(this.dataset[i].psh_taxc == 9)  {tva09 += round((this.dataset[i].psh_price * ((100 - this.dataset[i].psh_disc_pct) / 100 ) *  this.dataset[i].psh_qty_ship) * (this.dataset[i].psh_taxc ? this.dataset[i].psh_taxc / 100 : 0),2)}
      // if(this.dataset[i].psh_taxc == 19)  {tva19 += round((this.dataset[i].psh_price * ((100 - this.dataset[i].psh_disc_pct) / 100 ) *  this.dataset[i].psh_qty_ship) * (this.dataset[i].psh_taxc ? this.dataset[i].psh_taxc / 100 : 0),2)}
     }
    
     this.timbreService.getTimbreValue({ code: controlsso.psh_cr_terms.value, amt: round(tht + tva )}).subscribe(
      (response: any) => {
      
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
     

  
  }
}
  handleSelectedRowsChangedentity(e, args) {
    const controls1 = this.pshForm.controls
    
  
    if (Array.isArray(args.rows) && this.gridObjentity) {
        args.rows.map((idx) => {
            const item = this.gridObjentity.getDataItem(idx)
            // TODO : HERE itterate on selected field and change the value of the selected field
            switch (this.selectedField) {
              case "psh_po_site": {
                  controls1.psh_po_site.setValue(item.en_entity || "")
                  this.nom = item.en_name
                  this.addresse = item.en_addr
                  this.RC = item.chr01
                  this.NIF = item.chr02
                  this.AI = item.chr03
                  this.NIS = item.chr04
                  this.mail = item.chr05
                  this.phone = item.en_user1
                  this.banque = item.en_user2
                  break
              }    
              
                default:
                    break
            }
        })
    }
  }
  angularGridReadyentity(angularGrid: AngularGridInstance) {
    this.angularGridentity = angularGrid
    this.gridObjentity = (angularGrid && angularGrid.slickGrid) || {}
  }
  
  prepareGridentity() {
    this.columnDefinitionsentity = [
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
            id: "en_entity",
            name: "Entite",
            field: "en_entity",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "en_name",
            name: "Designation",
            field: "en_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "en_type",
          name: "Type",
          field: "en_type",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
        {
            id: "en_primary",
            name: "Principale",
            field: "en_primary",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
          id: "en_curr",
          name: "Devise",
          field: "en_curr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "dec01",
          name: "Capital",
          field: "dec01",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "chr01",
          name: "RC",
          field: "chr01",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "chr02",
          name: "NIF",
          field: "chr02",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "chr03",
          name: "AI",
          field: "chr03",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "chr04",
          name: "NIS",
          field: "chr04",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "chr05",
          name: "EMAIL",
          field: "chr05",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "en_user1",
          name: "Phone",
          field: "en_user1",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "en_user2",
          name: "RIB",
          field: "en_user2",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        
  
    ]
  
    this.gridOptionsentity = {
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
    this.entityService
        .getAll()
        .subscribe((response: any) => (this.dataentity = response.data))
       
  }
  openentity(content, field) {
    this.selectedField = field
    this.prepareGridentity()
    this.modalService.open(content, { size: "lg" })
  }





  printpdf(nbr) {
    const controls = this.totForm.controls 
    const controlss = this.pshForm.controls 
    console.log("pdf")
    var doc = new jsPDF();
    var img = new Image();
    const due =  Number(controlss.psh_ship_date.value.day).toString().padStart(2, '0') + "/" + Number(controlss.psh_ship_date.value.month).toString().padStart(2, '0')+ "/" + (controlss.psh_ship_date.value.year);  
    console.log(due, controlss.psh_ship_date.value)
    
    img.src = "./assets/media/logos/companylogo.png";
    doc.addImage(img, "png", 5, 5, 50, 30);
    doc.setFont('times','bold')
    doc.setFontSize(10);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 100, 10);
    }
    let tel1 =  (this.domain.dom_tel1 != null) ? this.domain.dom_tel1 : ""
    let tel2 =  (this.domain.dom_tel2 != null) ? this.domain.dom_tel2 : ""
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 100, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 100, 20);
    if (tel1!= "" || tel2 != "") doc.text("Tél : " + tel1 + " / " + tel2, 100, 25);
    
    doc.setFontSize(8);
    doc.line(2, 32, 208, 32);
    doc.text( 'RC : ' + this.domain.dom_rc + "      NIF : " + this.domain.dom_nif +  "      AI : " + this.domain.dom_ai + "      NIS : " + this.domain.dom_nis + "      Compte Bancaire :" + this.domain.dom_bank1 + " N° : " + this.domain.dom_rib1, 10, 37);
    doc.line(2, 40, 208, 40);
    doc.setFont('times','normal')
    
    doc.setFontSize(12);
    doc.text( 'Bon Livraison N° : ' + nbr  , 70, 50);
    doc.setFontSize(8);
    //console.log(this.customer.address.ad_misc2_id)
    doc.text('Code Client : ' + this.customer.ad_addr, 20 , 55 )
    doc.text('Nom             : ' + this.customer.ad_name, 20 , 60)
    doc.text("Date : " + due, 150, 55);
    if (this.customer.ad_line1 != null) {doc.text('Adresse       : ' + this.customer.ad_line1, 20 , 65)}
    // if (this.customer.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.ad_misc2_id, 20 , 65)}
    //     if (this.customer.ad_gst_id != null) {doc.text('RC          : ' + this.customer.ad_gst_id, 20 , 70)}
    //     if (this.customer.ad_pst_id) {doc.text('AI            : ' + this.customer.ad_pst_id, 20 , 75)}
    //     if (this.customer.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.ad_misc1_id, 20 , 80)}
      
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
    doc.setFontSize(6);
    for (let j = 0; j < this.dataset.length  ; j++) {
      
      if ((j % 20 == 0) && (j != 0) ) {
  doc.addPage();
  img.src = "./assets/media/logos/companylogo.png";
  doc.addImage(img, "png", 5, 5, 50, 30);
    doc.setFont('times','bold')
    doc.setFontSize(10);
    if (this.domain.dom_name != null) {
      doc.text(this.domain.dom_name, 100, 10);
    }
    let tel1 =  (this.domain.dom_tel1 != null) ? this.domain.dom_tel1 : ""
    let tel2 =  (this.domain.dom_tel2 != null) ? this.domain.dom_tel2 : ""
    if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 100, 15);
    if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 100, 20);
    if (tel1!= "" || tel2 != "") doc.text("Tél : " + tel1 + " / " + tel2, 100, 25);
    
    doc.setFontSize(8);
    doc.line(2, 32, 208, 32);
    doc.text( 'RC : ' + this.domain.dom_rc + "      NIF : " + this.domain.dom_nif +  "      AI : " + this.domain.dom_ai + "      NIS : " + this.domain.dom_nis + "      Compte Bancaire :" + this.domain.dom_bank1 + " N° : " + this.domain.dom_rib1, 10, 37);
    doc.line(2, 40, 208, 40);
    doc.setFont('times','normal')
    doc.setFontSize(12);
    doc.text( 'Bon Livraison N° : ' + nbr  , 70, 50);
    doc.setFontSize(8);
    //console.log(this.customer.address.ad_misc2_id)
    doc.text('Code Client : ' + this.customer.ad_addr, 20 , 55 )
    doc.text('Nom             : ' + this.customer.ad_name, 20 , 60)
    doc.text("Date : " + due, 150, 55);
    if (this.customer.ad_line1 != null) {doc.text('Adresse       : ' + this.customer.ad_line1, 20 , 65)}
        // if (this.customer.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.ad_misc2_id, 20 , 65)}
        // if (this.customer.ad_gst_id != null) {doc.text('RC          : ' + this.customer.ad_gst_id, 20 , 70)}
        // if (this.customer.ad_pst_id) {doc.text('AI            : ' + this.customer.ad_pst_id, 20 , 75)}
        // if (this.customer.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.ad_misc1_id, 20 , 80)}
      
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
  
  
  
      if (this.dataset[j].desc.length > 45) {
        let desc1 = this.dataset[j].desc.substring(45)
        let ind = desc1.indexOf(' ')
        desc1 = this.dataset[j].desc.substring(0, 45  + ind)
        let desc2 = this.dataset[j].desc.substring(45+ind)
  
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
// doc.addFileToVFS(
//   "amiri.ttf",
//   font
// );
// doc.addFont(
//   "amiri.ttf",
//   "amiri",
//   "normal"
// );



//   var date = new Date().toLocaleDateString()
  
//  // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
//   var img = new Image()
//   img.src = "./assets/media/logos/" + controlss.psh_po_site.value +  ".png";
//   var img2 = new Image()
  

//   var due = String(this.duedate.getFullYear()) + '/' + String(this.duedate.getMonth() + 1 ) + '/' + String(this.duedate.getDate())

//   // doc.addImage(img, 'png', 5, 5, 200, 30)
//   // doc.addImage(img2, 'png', 5, 250, 200, 40)
  
//   let position = 30
//     doc.addImage(img, 'png', 5, 10, 15, 25);
//     // doc.addImage(img2, 'png', 5, 250, 200, 40)
//     doc.setFontSize(10);
//     doc.setFont("Trebuchet MS","bold");
//     doc.text(this.nom, 30, 15);
//     doc.text(this.addresse, 30, 20);
//     if(this.RC  != null){doc.text('RC: '  + this.RC, position, 25);position =  position + 40}
//     if(this.AI  != null){doc.text('- ART: ' + this.AI, position, 25);position =  position + 45}
//     if(this.NIF  != null){doc.text('- NIF: ' + this.NIF, position, 25);position =  position + 45}
   
//     doc.text(this.banque, 30, 30);
//     doc.addImage(img, 'png', 185, 10, 15, 25);




//   doc.setFontSize(12);
//   doc.text( 'Bon De Livraison N° : ' + nbr  , 10, 40);
//   doc.text( 'DU : ' + date  , 160, 40);
//   doc.setFontSize(8);
//   doc.rect(9,41,100,40);
//   doc.text('CONTRAT N° : ' + this.contrat, 10 , 50 )
//     doc.text('MODE DE REGLEMENT : ' + this.terms, 10 , 55 )
//     doc.text('DATE DE PAIEMENT AVANT LE : ' + due, 10 , 60 )
//     doc.text('BC N° : ' + this.bc, 10 , 65 )
//     doc.text('LIEU DE LIVRAISON : ' + this.lieu, 10 , 70 )
    
//   doc.rect(119,41,90,40)
//   doc.text('DOIT : ' , 120 , 45 )
//   doc.text('Code Client : ' + this.customer[0].ad_addr, 120 , 50 )
//   doc.text('Nom             : ' + this.customer[0].ad_name, 120 , 55)
  
//   doc.text('Adresse       : ' + this.customer[0].ad_line1, 120 , 60)
//   doc.setFontSize(8);
//   if (this.customer[0].ad_misc2_id != null) {doc.text('MF          : ' + this.customer[0].ad_misc2_id, 120 , 65)}
//       if (this.customer[0].ad_gst_id != null) {doc.text('RC          : ' + this.customer[0].ad_gst_id, 120 , 70)}
//       if (this.customer[0].ad_pst_id) {doc.text('AI            : ' + this.customer[0].ad_pst_id, 120 , 75)}
//       if (this.customer[0].ad_misc1_id != null) {doc.text('NIS         : ' + this.customer[0].ad_misc1_id, 120 , 80)}
//       doc.setFillColor(50,205,50)
//       doc.rect(10,85,199,5,'F')
//   doc.line(10, 85, 209, 85);
//   doc.line(10, 90, 209, 90);
//   doc.line(10, 85, 10, 265);
//   doc.text('N°', 12.5 , 88.5);
//   doc.line(20, 85, 20, 265);
//   // doc.text('Code Article', 25 , 88.5);
//   // doc.line(45, 85, 45, 90);
//   doc.text('DESIGNATION', 25 , 88.5);
//   doc.line(90, 85, 90, 265);
//   doc.text('ITEM ARABE', 100 , 88.5);
//   doc.line(115, 85, 115, 265);
//   doc.text('CMD', 123 , 88.5);
//   doc.line(130, 85, 130, 265);
//   doc.text('UM', 133 , 88.5);
//   doc.line(140, 85, 140, 265);
//   doc.text('CHG', 148 , 88.5);
//   doc.line(160, 85, 160, 265);
//   doc.text('REC', 162 , 88.5);
//   doc.line(170, 85, 170, 265);
//   doc.text('OBSERVATION', 172 , 88.5);
  
//   doc.line(209, 85, 209, 265);
//   doc.rect(10,85,199,180)
//   var i = 95;
//   doc.setFontSize(10);
//   let total = 0;
//   for (let j = 0; j < this.dataset.length  ; j++) {
    
//     if ((j % 35 == 0) && (j != 0) ) {
// doc.addPage();
// let position = 30
// doc.addImage(img, 'png', 5, 10, 15, 25)
// // doc.addImage(img2, 'png', 5, 250, 200, 40)
// doc.setFontSize(10);
// doc.setFont("Trebuchet MS","bold");
// doc.text(this.nom, 30, 15);
// doc.text(this.addresse, 30, 20);
// if(this.RC  != null){doc.text('RC: '  + this.RC, position, 25);position =  position + 40}
// if(this.AI  != null){doc.text('- ART: ' + this.AI, position, 25);position =  position + 45}
// if(this.NIF  != null){doc.text('- NIF: ' + this.NIF, position, 25);position =  position + 45}

// doc.text(this.banque, 30, 30);
// doc.addImage(img, 'png', 185, 10, 15, 25)
// doc.setFontSize(12);
//       doc.text( 'Bon De Livraison N° : ' + nbr  , 10, 40);
//       doc.text( 'DU : ' + date  , 160, 40);
      
//       doc.rect(9,41,100,40)
//       doc.setFontSize(8);
      
//       doc.text('CONTRAT N° : ' + this.contrat, 10 , 50 )
//     doc.text('MODE DE REGLEMENT : ' + this.terms, 10 , 55 )
//     doc.text('DATE DE PAIEMENT AVANT LE : ' + due, 10 , 60 )
//     doc.text('BC N° : ' + this.bc, 10 , 65 )
//     doc.text('LIEU DE LIVRAISON : ' + this.lieu, 10 , 70 )
//     doc.rect(119,41,90,40) 
//   doc.text('DOIT : ' , 120 , 45 )
//   doc.text('Code Client : ' + this.customer[0].ad_addr, 120 , 50 )
//   doc.text('Nom             : ' + this.customer[0].ad_name, 120 , 55)
 
//   doc.text('Adresse       : ' + this.customer[0].ad_line1, 120 , 60)
//   doc.setFontSize(8);
//   if (this.customer[0].ad_misc2_id != null) {doc.text('MF          : ' + this.customer[0].ad_misc2_id, 120 , 65)}
//       if (this.customer[0].ad_gst_id != null) {doc.text('RC          : ' + this.customer[0].ad_gst_id, 120 , 70)}
//       if (this.customer[0].ad_pst_id) {doc.text('AI            : ' + this.customer[0].ad_pst_id, 120 , 75)}
//       if (this.customer[0].ad_misc1_id != null) {doc.text('NIS         : ' + this.customer[0].ad_misc1_id, 120 , 80)}
//       doc.setFillColor(50,205,50)
//       doc.rect(10,85,199,5,'F')
//       doc.line(10, 85, 209, 85);
//       doc.line(10, 90, 209, 90);
//       doc.line(10, 85, 10, 265);
//       doc.text('N°', 12.5 , 88.5);
//       doc.line(20, 85, 20, 265);
//       // doc.text('Code Article', 25 , 88.5);
//       // doc.line(45, 85, 45, 90);
//       doc.text('DESIGNATION', 25 , 88.5);
//       doc.line(90, 85, 90, 265);
//       doc.text('ITEM ARABE', 100 , 88.5);
//       doc.line(115, 85, 115, 265);
//       doc.text('CMD', 123 , 88.5);
//       doc.line(130, 85, 130, 265);
//       doc.text('UM', 133 , 88.5);
//       doc.line(140, 85, 140, 265);
//       doc.text('CHG', 148 , 88.5);
//       doc.line(160, 85, 160, 265);
//       doc.text('REC', 162 , 88.5);
//       doc.line(170, 85, 170, 265);
//       doc.text('OBSERVATION', 172 , 88.5);
//       doc.line(209, 85, 209, 265);
//       doc.rect(10,85,199,180)
//       i = 95;
//       doc.setFontSize(10);

//     }



//     if (this.dataset[j].desc.length > 45) {
//       let desc1 = this.dataset[j].desc.substring(45)
//       let ind = desc1.indexOf(' ')
//       desc1 = this.dataset[j].desc.substring(0, 45  + ind)
//       let desc3 = this.dataset[j].desc.substring(45+ind)
      
//       doc.setFont("Times-Roman","normal");
//       doc.line(10, i - 5, 10, i );
//       doc.text(String(("000"+ this.dataset[j].psh_line)).slice(-3), 12.5 , i  - 1);
//       doc.line(20, i - 5, 20, i);
//       // doc.text(this.dataset[j].psh_part, 25 , i  - 1);
//       // doc.line(45, i - 5 , 45, i );
//       doc.text(desc1, 25 , i  - 1);
//       doc.line(90, i - 5, 90, i );
//       doc.setFont("amiri");
//       doc.text(this.dataset[j].desc2, 113 , i  - 1,{ align: 'right' });
//       doc.line(115, i - 5, 115, i );
//       doc.setFont("Times-Roman","normal");
//       doc.text( String(this.dataset[j].psh_qty_toship.toFixed(2)), 128 , i  - 1 , { align: 'right' });
//       doc.line(130, i - 5 , 130, i );
//       doc.text(this.dataset[j].psh_um, 133 , i  - 1);
//       doc.line(140, i - 5, 140, i );
//       doc.text( String(Number(this.dataset[j].psh_qty_ship).toFixed(2)), 158 , i  - 1 , { align: 'right' });
//       doc.line(160, i - 5, 160, i );
//       doc.text( "" , 163 , i  - 1);
//       doc.line(170, i - 5 , 170, i );
//       doc.text("" , 173 , i  - 1);
      
//       doc.line(209, i-5 , 209, i );
//      // doc.line(10, i, 200, i );

//       i = i + 5;

//       doc.text(desc3, 25 , i  - 1);
      
//       doc.line(10, i - 5, 10, i );
//       doc.line(20, i - 5, 20, i);
//       // doc.line(45, i - 5 , 45, i );
//       doc.line(90, i - 5, 90, i );
//       doc.line(115, i - 5 , 115, i );
//       doc.line(130, i - 5, 130, i );
//       doc.line(140, i - 5, 140, i );
//       doc.line(160, i - 5 , 160, i );
//       doc.line(170, i - 5 , 170, i );
//       doc.line(180, i - 5 , 180, i );
//       doc.line(209, i-5 , 209, i );
//       doc.line(10, i, 209, i );

//       i = i + 5 ;
      
//     } else {



//     doc.setFont("Times-Roman","normal");  
//     doc.line(10, i - 5, 10, i );
//     doc.text(String(("000"+ this.dataset[j].psh_line)).slice(-3), 12.5 , i  - 1);
//     doc.line(20, i - 5, 20, i);
//     // doc.text(this.dataset[j].psh_part, 25 , i  - 1);
//     // doc.line(45, i - 5 , 45, i );
//     doc.text(this.dataset[j].desc, 25 , i  - 1);
//     doc.line(90, i - 5, 90, i );
//     doc.setFont("amiri");
//     doc.text(this.dataset[j].desc2, 113 , i  - 1,{ align: 'right' });
//     doc.line(115, i - 5, 115, i );
//     doc.setFont("Times-Roman","normal");
//     doc.text( String(this.dataset[j].psh_qty_toship.toFixed(2)), 128 , i  - 1 , { align: 'right' });
//     doc.line(130, i - 5 , 130, i );
//     doc.text(this.dataset[j].psh_um, 133 , i  - 1);
//     doc.line(140, i - 5, 140, i );
//     doc.text( String(Number(this.dataset[j].psh_qty_ship).toFixed(2)), 158 , i  - 1 , { align: 'right' });
//     doc.line(160, i - 5, 160, i );
//     doc.text("" , 163 , i  - 1);
//     doc.line(170, i - 5 , 170, i );
//     doc.text("" , 173 , i  - 1);
    
//     doc.line(209, i-5 , 209, i );
//     doc.line(10, i, 209, i );
//     i = i + 5;
//     }
    
//   total = total + this.dataset[j].psh_qty_ship
//   }
//   i = 270;
//   doc.line(115, i - 5 , 115, i );
//   doc.text('TOTAL:', 116 , i  - 1);
//   doc.line(145, i - 5 , 145, i );
//   doc.text( String(Number(total).toFixed(2)), 158 , i  - 1 , { align: 'right' });
//   doc.line(160, i - 5 , 160, i );  
//   doc.line(115, i  , 160, i );
// // doc.line(10, i - 5, 200, i - 5);
// //  doc.line(130, i ,  210, i   );
// //  doc.line(130, i + 7,  210, i + 7  );
// //  if(controls.remise.value != 0){doc.line(130, i + 7,  210, i + 7  );i = i + 7;}
// //  doc.line(130, i + 14, 210, i + 14 );
// //  doc.line(130, i + 21, 210, i + 21 );
// //  doc.line(130, i + 28, 210, i + 28 );
// //  doc.line(130, i + 35, 210, i + 35 );
// //  doc.line(130, i + 42, 210, i + 42 );
// //  doc.line(130, i + 49, 210, i + 49 );
 
// //  doc.line(130, i ,  130, i + 49  );
// //  doc.line(160, i ,  160, i + 49  );
// //  doc.line(210, i ,  210, i + 49  );
// //  doc.setFontSize(10);
 
// //  doc.text('Total Brut', 140 ,  i + 5 , { align: 'left' });
// //  if(controls.remise.value != 0){doc.text('Remise', 140 ,  i + 12 , { align: 'left' }); i = i + 7}
// //  doc.text('Total HT', 140 ,  i + 12 , { align: 'left' });
// //  doc.text('TVA 09%', 140 ,  i + 19 , { align: 'left' });
// //  doc.text('TVA 19%', 140 ,  i + 26 , { align: 'left' });
// //  doc.text('Total TVA ', 140 ,  i + 33 , { align: 'left' });
// //  doc.text('Timbre', 140 ,  i + 40 , { align: 'left' });
// //  doc.text('Total TTC', 140 ,  i + 47 , { align: 'left' });
// //  if(controls.remise.value != 0){i = i - 7}
// //  doc.text(String(Number(controls.tbt.value).toFixed(2)), 198 ,  i + 5 , { align: 'right' });
// //  if(controls.remise.value != 0){doc.text(String(Number(controls.remise.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' }); i = i + 7}
// //  doc.text(String(Number(controls.tht.value).toFixed(2)), 198 ,  i + 12 , { align: 'right' });
// //  doc.text(String(Number(controls.tva09.value).toFixed(2)), 198 ,  i + 19 , { align: 'right' });
// //  doc.text(String(Number(controls.tva19.value).toFixed(2)), 198 ,  i + 26 , { align: 'right' });
// //  doc.text(String(Number(controls.tva.value).toFixed(2)), 198 ,  i + 33 , { align: 'right' });
// //  doc.text(String(Number(controls.timbre.value).toFixed(2)), 198 ,  i + 40 , { align: 'right' });
// //  doc.text(String(Number(controls.ttc.value).toFixed(2)), 198 ,  i + 47 , { align: 'right' });

// //  doc.setFontSize(8);
// //     let mt = NumberToLetters(
// //       Number(controls.ttc.value).toFixed(2),'DINARS ALGERIENS')

// //       if (mt.length > 95) {
// //         let mt1 = mt.substring(90)
// //         let ind = mt1.indexOf(' ')
       
// //         mt1 = mt.substring(0, 90  + ind)
// //         let mt2 = mt.substring(90+ind)
   
// //         doc.text( "Arretée la présente Livraison a la somme de :" + mt1  , 20, i + 65)
// //         doc.text(  mt2  , 20, i + 68)
// //       } else {
// //         doc.text( "Arretée la présente Livraison a la somme de :" + mt  , 20, i + 65)

// //       }
//     // window.open(doc.output('bloburl'), '_blank');
//     //window.open(doc.output('blobUrl'));  // will open a new tab
//     img2.src = "./assets/media/logos/pied.png";
//     doc.save('BL-' + nbr + '.pdf')
//     var blob = doc.output("blob");
//     window.open(URL.createObjectURL(blob));

//   }
  onChangePal() {
    
    /*kamel palette*/
    const controls = this.pshForm.controls
    const ref = controls.ref.value
  var bol = false
  let idpal;
this.labelService.getBy({lb_cab: ref,lb_actif: false}).subscribe((res:any) =>{if (res.data != null) {bol = true}})
  
  
  if (controls.psh_cust.value == null){  this.message = "veuillez saisir l'adresse";
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
     
      
      
     
     
      this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-UNP" }).subscribe((resstat:any)=>{
          console.log(resstat)
          const { data } = resstat;

          if (data) {
            this.stat = null
            this.message = "mouvement interdit dans cet emplacement";
            this.hasFormErrors = true;
            return;


          } else {
            this.stat = this.lddet.ld_status
          
 
     
     this.itemsService.getByOne({pt_part: this.lddet.ld_part  }).subscribe(
      (respopart: any) => {
        console.log(respopart)
        this.labelService.getBy({lb_cab: ref}).subscribe((res:any) =>{if (res.data != null) {idpal = res.data.id}})
          this.gridService.addItem(
            {
              id: this.dataset.length + 1,
              psh_line: this.dataset.length + 1,
              psh_part: respopart.data.pt_part,
              cmvid: "",
              desc: respopart.data.pt_desc1,
              // desc2: respopart.data.pt_desc2,
              psh_qty_toship: 0,
              psh_qty_ship: this.lddet.ld_qty_oh, //detail.sod_qty_ord - detail.sod_qty_ship,
              psh_um: this.lddet.ld_um,
              psh_um_conv: 1,
              psh_type: '',
              psh_price: 0,
              psh_disc_pct: 0,
              psh_so_taxable: true,
              psh_tax_code: '',
              psh_taxc: '19A',
              psh_site: this.lddet.ld_site,
              psh_loc: this.lddet.ld_loc,
              psh_serial: this.lddet.ld_lot,
              qty_oh: this.lddet.ld_qty_oh,
              psh_status: this.lddet.ld_status,
              psh_expire: this.lddet.ld_expire,
            },
            { position: "bottom" }
          );
 
     
  
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
    this.message = "bigbag déjà scanné";
    this.hasFormErrors = true;
    return;
  }
}
  controls.ref.setValue(null)
  document.getElementById("ref").focus();
  
}
}
