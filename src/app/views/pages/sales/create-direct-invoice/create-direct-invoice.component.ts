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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { round } from 'lodash';

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
  AddressService,
  QuoteService,
  SequenceService,
  CustomerService,
  UsersService,
  ItemService,
  SaleOrder,
  TaxeService,
  DeviseService,
  CodeService,
  SiteService,
  LocationService,
  MesureService,
  PricelistService,
  LocationDetailService,
  InventoryStatusService,
  TimbreService,
  printSO,
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
  selector: 'kt-create-direct-invoice',
  templateUrl: './create-direct-invoice.component.html',
  styleUrls: ['./create-direct-invoice.component.scss']
})
export class CreateDirectInvoiceComponent implements OnInit {

  saleOrder: SaleOrder;
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

  sequences: []
  columnDefinitions1: Column[] = []
  gridOptions1: GridOption = {}
  gridObj1: any
  angularGrid1: AngularGridInstance

  customers: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  users: [];
  columnDefinitions3: Column[] = [];
  gridOptions3: GridOption = {};
  gridObj3: any;
  angularGrid3: AngularGridInstance;

  quotes: [];
  columnDefinitions5: Column[] = [];
  gridOptions5: GridOption = {};
  gridObj5: any;
  angularGrid5: AngularGridInstance;

  bills: [];
  columnDefinitionsbill: Column[] = [];
  gridOptionsbill: GridOption = {};
  gridObjbill: any;
  angularGridbill: AngularGridInstance;
  
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
  datalocdet: [];
  columnDefinitionslocdet: Column[] = [];
  gridOptionslocdet: GridOption = {};
  gridObjlocdet: any;
  angularGridlocdet: AngularGridInstance;
  
  seq;
  user;
  row_number;
  message = "";
  quoteServer;
  qoServer;
  customer;
  biller;
  datasetPrint = [];
  type: String;
  date: String;
  so_cr_terms: any[] = [];
  price: Number;
  disc: Number;
  taxable: Boolean;
  location: any;
  lddet: any;
  stat: any;
  curr: any;
  
  constructor(
    config: NgbDropdownConfig,
    private soFB: FormBuilder,
    private totFB: FormBuilder,
    
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private quoteService: QuoteService,
    private customersService: CustomerService,
    private userService: UsersService,
    private sequencesService: SequenceService,
    private saleOrderService: SaleOrderService,
    private itemsService: ItemService,
    private codeService: CodeService,
    private addressService: AddressService,
    private mesureService: MesureService,
    private deviseService: DeviseService,
    private siteService: SiteService,
    private locationService: LocationService,
    private locationDetailService: LocationDetailService,
    private inventoryStatusService: InventoryStatusService,
    private taxService: TaxeService,
    private pricelistService: PricelistService,
    private timbreService: TimbreService,
  ) {
    config.autoClose = true;
    this.codeService
      .getBy({ code_fldname: "cm_cr_terms" })
      .subscribe((response: any) => (this.so_cr_terms = response.data));
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
          console.log(args.dataContext.sod_part)
          const controls = this.soForm.controls 
          this.itemsService.getByOne({pt_part: args.dataContext.sod_part }).subscribe((resp:any)=>{

            if (resp.data) {
              console.log(resp.data)
                          
              if (resp.data.pt_phantom) {
                this.type = 'M'
              
              } else {
                this.type = null
              }            

              if (controls.so_taxable.value == false) {this.taxable = false} else { this.taxable = resp.data.pt_taxable}
             
              this.locationDetailService.getByOne({ ld_site: resp.data.pt_site, ld_loc: resp.data.pt_loc, ld_part: args.dataContext.sod_part, ld_lot: null }).subscribe(
                (response: any) => {
                  this.lddet = response.data
                  console.log(this.lddet)
                  if (this.lddet != null) {
            
                  this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-SO" }).subscribe((resstat:any)=>{
                    console.log(resstat)
                    const { data } = resstat;

                    if (data) {
                      this.stat = null
                    } else {
                      this.stat = this.lddet.ld_status
                    }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , sod_site:resp.data.pt_site, sod_loc: resp.data.pt_loc, sod_serial: null,
                      sod_um:resp.data.pt_um, sod_um_conv:1, sod_price: resp.data.pt_price, sod_disc_pct:0, sod_expire:this.lddet.ld_expire,sod_status: this.stat, qty_oh: this.lddet.ld_qty_oh, sod_type: this.type , sod_taxc: resp.data.pt_taxc, sod_taxable: this.taxable})
             
       // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   sod_status: this.stat, qty_oh: this.lddet[0].ld_qty_oh})
                  });     
    
              } else { 
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , sod_site:resp.data.pt_site, sod_loc: resp.data.pt_loc, sod_serial: null,
                  sod_um:resp.data.pt_um, sod_um_conv:1, sod_price: resp.data.pt_price, sod_disc_pct:0,sod_expire: null, sod_status: null, qty_oh: 0, sod_type: this.type , sod_taxc: resp.data.pt_taxc, sod_taxable: this.taxable})
         

              }
             

            });                
               
                              
      
         }  else {
            alert("Article Nexiste pas")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_part: null })
         }
          
          });

           
         
         
        }
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
      {
        id: "sod_site",
        name: "Site",
        field: "sod_site",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {

          this.siteService.getByOne({ si_site: args.dataContext.sod_site,}).subscribe(
            (response: any) => {
              
          

                if (response.data) {
                  
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_site: response.data.si_site})
                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , sod_site: null});
    
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
        id: "sod_loc",
        name: "Emplacement",
        field: "sod_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },


        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.sod_loc)
          
            
            this.locationService.getByOne({ loc_loc: args.dataContext.sod_loc, loc_site: args.dataContext.sod_site }).subscribe(
              (response: any) => {
                this.location = response.data
                if (response.data) {

                    this.locationDetailService.getBy({ ld_site: args.dataContext.sod_site, ld_loc: args.dataContext.sod_loc, ld_part: args.dataContext.sod_part, ld_lot: null }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                        console.log(this.lddet[0].ld_qty_oh)
               
                        this.inventoryStatusService.getAllDetails({isd_status: this.location.loc_status, isd_sod_type: "ISS-SO" }).subscribe((resstat:any)=>{
                          console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat = this.location.loc_status
                          }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   sod_status: this.stat, qty_oh: this.lddet[0].ld_qty_oh})
                        });     
     
                      });     
                    }
                    else {
                      alert("Emplacement Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_loc: null, qty_oh: 0, sod_status: null })
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
        id: "sod_serial",
        name: "Lot/Serie",
        field: "sod_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {

            this.locationDetailService.getBy({ ld_site: args.dataContext.sod_site, ld_loc: args.dataContext.sod_loc, ld_part: args.dataContext.sod_part, ld_lot: args.dataContext.sod_serial }).subscribe(
              (response: any) => {
                this.lddet = response.data
                
        console.log(response.data.length)
                  if (response.data.length != 0) {
                    
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddet[0].ld_qty_oh, sod_status: this.lddet[0].ld_status, sod_expire: this.lddet[0].sod_expire})
                  }
                  else {
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , sod_serial: null, qty_0h: 0});
      
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
          console.log(args.dataContext.sod_part)
          this.itemsService.getByOne({pt_part: args.dataContext.sod_part }).subscribe((resp:any)=>{
            console.log(args.dataContext.sod_part, resp.data.pt_um )
          if   (args.dataContext.sod_um == resp.data.pt_um )  {
            
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: 1 })
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: args.dataContext.sod_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.sod_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
    
            if (data) {
              //alert ("Mouvement Interdit Pour ce Status")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: res.data.um_conv })
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.sod_um, um_part: args.dataContext.sod_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  //alert ("Mouvement Interdit Pour ce Status")
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: res.data.um_conv })
                  
                } else {
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_um_conv: "1" , sod_um: null});
           
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
        id: "mvid",
        field: "cmvid",
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
          params: { decimalPlaces: 2 }
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.soForm.controls
          console.log(args.dataContext.sod_part)
          console.log(controls.so_cust.value)
          console.log(args.dataContext.sod_qty_ord)
          let pricebefore = args.dataContext.sod_price
          console.log(pricebefore)
          this.price = null;
          this.disc = null;
          if (args.dataContext.sod_type != "M"){
            if (args.dataContext.sod_qty_ord * args.dataContext.sod_um_conv   > args.dataContext.qty_oh) {
             
            alert ("Qte Manquante")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_qty_ord: null })
         //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
        
          
            }   
          }

          this.itemsService.getByOne({pt_part: args.dataContext.sod_part }).subscribe((resp:any)=>{

            if (resp.data) {
              console.log(resp.data)
                          
              const date1 = new Date
             let obj: { }
              const part = resp.data.pt_part
              const promo = resp.data.pt_promo
              const cust = this.customer.cm_addr
              const classe = this.customer.cm_class
              const qty = args.dataContext.sod_qty_ord
              const um = args.dataContext.sod_um
              const curr = controls.so_curr.value
              const type = "PT"
              const date =  `${controls.so_ord_date.value.year}-${controls.so_ord_date.value.month}-${controls.so_ord_date.value.day}`
        
        obj = {part, promo, cust, classe, date,qty,um,curr,type}
          this.pricelistService.getPrice(obj).subscribe((res:any)=>{
            console.log(res)
            this.price = res.data
            console.log(res.data)
            if (this.price != null) { 
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_price: this.price })
            } else {
              console.log("here")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , sod_price: pricebefore })
            }
        //    this.dataset[this.row_number].sod_price = this.price
            //console.log(this.row_number,this.dataset[this.row_number].sod_price)
            // this.calculatetot();
          });
          
          let objr: { }
            const typer = "PR"
            
      objr = {part, promo, cust, classe, date,qty,um,curr,typer}
                            
        console.log(obj)
        
       
        this.pricelistService.getDiscPct(objr).subscribe((resdisc:any)=>{
          console.log(resdisc)
          this.disc = resdisc.data
          console.log(resdisc.data)
          if (this.disc != null) {
          //this.dataset[this.row_number].sod_disc_pct = this.disc
         this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  ,sod_disc_pct: this.disc })
         // console.log(this.row_number,this.dataset[this.row_number].sod_price)
          }  else {
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  ,sod_disc_pct: 0 })
          }
        
        
        });



        }
        
        });

        //console.log(this.row_number,this.dataset[this.row_number].sod_price)
          this.calculatetot();
      }
      
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
          params: { decimalPlaces: 2 }
        },
        formatter: Formatters.decimal,
        onCellChange: (e: Event, args: OnEventArgs) => {

          console.log(args.dataContext.sod_price)
          this.calculatetot();
        }
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
            params: { decimalPlaces: 2 }
          },
          formatter: Formatters.decimal,
          onCellChange: (e: Event, args: OnEventArgs) => {

            console.log(args.dataContext.sod_disc_pct)
            this.calculatetot();
          }   
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
            alert("Type doit etre M ou NULL")
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , sod_type: null});
            
          }
        }
      },
      {
        id: "sod_status",
        name: "Status",
        field: "sod_status",
        sortable: true,
        width: 80,
        filterable: false,
        
      },
      {
        id: "sod_expire",
        name: "Expire",
        field: "sod_expire",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.dateIso,
        formatter: Formatters.dateIso,
        
      },
      {
        id: "sod_taxable",
        name: "Taxable",
        field: "sod_taxable",
        sortable: true,
        width: 30,
        filterable: false,
        editor: {
          model: Editors.checkbox
        },
        formatter: Formatters.checkmark,
        cannotTriggerInsert: true,
      },
      {
        id: "sod_tax_code",
        name: "code de taxe",
        field: "sod_tax_code",
        sortable: true,
        width: 50,
        filterable: false,
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
      }
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
        thousandSeparator: ' ', // can be any of ',' | '_' | ' ' | ''
      },
      
    };

    this.dataset = [];
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.createForm();
    this.createtotForm();
    
    this.activatedRoute.params.subscribe((params) => {
      const id = params.id;
      if (id) {
        const controls = this.soForm.controls;

        this.quoteService.findByOne({ id }).subscribe(
          (res: any) => {
            console.log("aa", res.data);
            const { quote, details } = res.data;
            this.qoServer = quote;

            controls.so_cust.setValue(this.qoServer.qo_cust);
            controls.so_po.setValue(this.qoServer.qo_nbr);
            controls.so_curr.setValue(this.qoServer.qo_curr);
            this.customersService
                  .getBy({ cm_addr: this.qoServer.qo_cust })
                  .subscribe((res: any) => (this.customer = res.data));
            for (const object in details) {
              const detail = details[object];
              this.gridService.addItem(
                {
                  id: this.dataset.length + 1,
                  sod_line: this.dataset.length + 1,
                 
                  sod_part: detail.qod_part,
                  cmvid: "",
                  desc: detail.item.pt_desc1,
                  sod_qty_ord: detail.qod_qty_ord,
                  sod_um: detail.qod_um,
                  sod_price: detail.qod_price,
                  sod_disc_pct: detail.qod_disc_pct,
                  sod_site: detail.item.pt_site,
                  sod_loc: detail.item.pt_loc,
                  sod_type: detail.item.pt_type,
                  sod_cc: "",
                  sod_taxable: detail.item.pt_taxable,
                  sod_tax_code: detail.item.taxe.tx2_tax_code,
                  sod_taxc: detail.item.taxe.tx2_tax_pct,
                },
                { position: "bottom" }
              );
              this.datasetPrint.push({
                id: this.dataset.length + 1,
                sod_line: this.dataset.length + 1,
               
                sod_part: detail.qod_part,
                cmvid: "",
                desc: detail.item.pt_desc1,
                sod_qty_ord: detail.qod_qty_ord,
                sod_um: detail.qod_um,
                sod_price: detail.qod_price,
                sod_disc_pct: detail.qod_disc_pct,
                sod_site: detail.item.pt_site,
                sod_loc: detail.item.pt_loc,
                sod_type: detail.item.pt_type,
                sod_cc: "",
                sod_taxable: detail.item.pt_taxable,
                sod_tax_code: detail.item.taxe.tx2_tax_code,
                sod_taxc: detail.item.taxe.tx2_tax_pct,
                taxe: detail.item.taxe.tx2_tax_pct,
              });
            }
          },
          (error) => {
            this.message = ` ce numero ${id} n'existe pas`;
            this.hasFormErrors = true;
          },
          () => {}
        );
      }
    });
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.saleOrder = new SaleOrder();
    const date = new Date;
    
    this.soForm = this.soFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      so_category: [this.saleOrder.so_category , Validators.required],
      so_cust: [this.saleOrder.so_cust, Validators.required],
      name: [{value:"", disabled: true}],
        
      so_bill: [this.saleOrder.so_bill , Validators.required],
      namebill: [{value:"", disabled: true}],

      so_ord_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      so_due_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      
      so_taxable: [this.saleOrder.so_taxable],
     
      so_po: [this.saleOrder.so_po],
      so_rmks: [this.saleOrder.so_rmks],
      so_curr: [this.saleOrder.so_curr],
      so_ex_rate: [this.saleOrder.so_ex_rate],
      so_ex_rate2: [this.saleOrder.so_ex_rate2],
      so_cr_terms: [this.saleOrder.so_cr_terms],
      print:[true]
    });

    
    

  }
  createtotForm() {
    this.loadingSubject.next(false);
    //this.saleOrder = new SaleOrder();
   // const date = new Date;
    
    this.totForm = this.totFB.group({
  //    so__chr01: [this.saleOrder.so__chr01],
      tht: [{value: 0.00 , disabled: true}],
      tva: [{value: 0.00 , disabled: true}],
      timbre: [{value: 0.00 , disabled: true}],
      ttc: [{value: 0.00 , disabled: true}],
    });

    
    

  }
  onChangeSeq() {
      const controls = this.soForm.controls
      console.log(this.user.usrd_profile)
      this.sequencesService
          .getBy({seq_seq: controls.so_category.value, seq_type: 'SO', seq_profile: this.user.usrd_profile})
          .subscribe((response: any) => {
              console.log(response)
              if (response.data.length == 0) {
                  alert("Sequence nexiste pas")
                  controls.so_category.setValue("")
                  console.log(response.data.length)
                  document.getElementById("SEQUENCE").focus();
              } 
          })
  }
  //reste form
  reset() {
    this.saleOrder = new SaleOrder();
    this.createForm();
    this.createtotForm();
    this.hasFormErrors = false;
    this.dataset = [];
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.soForm.controls;
    /** check form */
    if (this.soForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
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
      console.log(this.dataset[i]  )
      this.dataset[i].sod_qty_inv = this.dataset[i].sod_qty_ord;
      this.dataset[i].sod_qty_ship = this.dataset[i].sod_qty_ord;
     if (this.dataset[i].sod_part == "" || this.dataset[i].sod_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].sod_site == "" || this.dataset[i].sod_site == null  ) {
      this.message = "Le Site ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].sod_loc == "" || this.dataset[i].sod_loc == null  ) {
      this.message = "L' Emplacement ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].sod_um == "" || this.dataset[i].sod_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     
     if (this.dataset[i].sod_qty_loc == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }
    // tslint:disable-next-line:prefer-const
    let so = this.prepareSo();
    
    this.addSo(so, this.dataset);
  }

  /**
   *
   * Returns object for saving
   */
  prepareSo(): any {
    const controls = this.soForm.controls;
    const controls1 = this.totForm.controls;
    const _so = new SaleOrder();
    _so.so_category =  controls.so_category.value
    _so.so_cust = controls.so_cust.value;
    _so.so_bill = controls.so_bill.value;
    _so.so_ord_date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : null;
    _so.so_due_date = controls.so_due_date.value
      ? `${controls.so_due_date.value.year}/${controls.so_due_date.value.month}/${controls.so_due_date.value.day}`
      : null;
      if (controls.so_taxable.value == null || controls.so_taxable.value == "" ) { _so.so_taxable = false} else { _so.so_taxable = controls.so_taxable.value}
    
    
    _so.so_po = controls.so_po.value;
    
    _so.so_rmks = controls.so_rmks.value;
    _so.so_curr = controls.so_curr.value;
    _so.so_ex_rate = controls.so_ex_rate.value;
    _so.so_ex_rate2 = controls.so_ex_rate2.value;
    _so.so_cr_terms = controls.so_cr_terms.value;
    _so.so_to_inv = true;
   
    _so.so_amt = controls1.tht.value
    _so.so_tax_amt = controls1.tva.value
    _so.so_trl1_amt = controls1.timbre.value
    
       
    return _so;
  
  }
  /**
   * Add po
   *
   * @param _so: so
   */
  addSo(_so: any, detail: any) {
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    let so = null;
    const controls = this.soForm.controls;

    this.saleOrderService
      .adddirect({ saleOrder: _so, saleOrderDetail: detail })
      .subscribe(
        (reponse: any) => (so = reponse.data),
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
          console.log(this.dataset);
          if(controls.print.value == true)  this.printpdf(so.so_nbr) // printSO(this.customer, this.dataset, so);
          this.reset();
          this.loadingSubject.next(true);
          this.router.navigateByUrl("/sales/create-direct-invoice");
          
   //       this.dataset = [];
        }
      );
  }
  onChangeBill() {
    const controls = this.soForm.controls;
    const cm_addr = controls.so_bill.value;
    const date = new Date()
    this.date = controls.so_ord_date.value
    ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    //this.dataset = [];
    this.customersService.getBy({ cm_addr }).subscribe(
      (res: any) => {
        console.log(res);
        const { data } = res;

        if (!data) {
          this.layoutUtilsService.showActionNotification(
            "ce client n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.error = true;
          document.getElementById("bill").focus();
        } else {
          this.error = false;
          this.biller = res.data; 
          controls.so_bill.setValue(data.cm_addr || "");
          controls.so_cr_terms.setValue(data.cm_cr_terms || "");
          controls.so_curr.setValue(data.cm_curr || "");
          controls.so_taxable.setValue(data.address.ad_taxable || "");
          controls.namebill.setValue(data.address.ad_name || "");
              
            
            this.deviseService.getBy({ cu_curr: data.cm_curr }).subscribe(
              (res: any) => {
                console.log(res);
                const { data } = res;
          if(data) {

            this.curr = data;
          }

              })

              if (data.cm_curr == 'DA'){
                controls.so_ex_rate.setValue(1)
                controls.so_ex_rate2.setValue(1)
  
              } else {
  
              this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 controls.so_ex_rate.setValue(res.data.exr_rate)
                 controls.so_ex_rate2.setValue(res.data.exr_rate2)
                })
  
                }
  

        }
       
      });    
    
  //  (error) => console.log(error)
  

    
    
  }
  onChangeOC() {
    const controls = this.soForm.controls;
    const qo_nbr = controls.so_po.value;
   
    this.quoteService.findByOne({ qo_nbr: qo_nbr }).subscribe(
      (res: any) => {
        const { quoteOrder, details } = res.data;
        console.log(quoteOrder)
        controls.so_cust.setValue(quoteOrder.qo_cust)
        controls.so_curr.setValue(quoteOrder.qo_curr)
        controls.so_cr_terms.setValue(quoteOrder.qo_cr_terms)
        controls.so_taxable.setValue(quoteOrder.qo_taxable)
        this.customersService.getBy({ cm_addr: quoteOrder.qo_cust }).subscribe(
          (res: any) => {
            //console.log(res);
            const { data } = res;
            this.customer = res.data;
            

          })
                for (const object in details) {
                  const detail = details[object];
                  console.log(detail.item);
                  this.gridService.addItem(
                    {
                      id: this.dataset.length + 1,
                      sod_line: this.dataset.length + 1,
                      
                      sod_part: detail.qod_part,
                      cmvid: "",
                      desc: detail.item.pt_desc1,
                      sod_qty_ord: detail.qod_qty_ord,
                      sod_um: detail.qod_um,
                      sod_price: detail.qod_price,
                      sod_disc_pct: detail.qod_disc_pct,
                      sod_site: detail.item.pt_site,
                      sod_loc: detail.item.pt_loc,
                      sod_type: detail.item.pt_type,
                      sod_cc: "",
                      sod_taxable: detail.item.pt_taxable,
                      sod_tax_code: detail.item.pt_taxc,
                      sod_taxc: detail.item.taxe.tx2_tax_pct,
                    },
                    { position: "bottom" }
                  );
                  this.datasetPrint.push({
                    id: this.dataset.length + 1,
                    sod_line: this.dataset.length + 1,
                   
                    sod_part: detail.qod_part,
                    cmvid: "",
                    desc: detail.item.pt_desc1,
                    sod_qty_ord: detail.qod_qty_ord,
                    sod_um: detail.qod_um,
                    sod_price: detail.qod_price,
                    sod_disc_pct: detail.qod_disc_pct,
                    sod_site: detail.item.pt_site,
                    sod_loc: detail.item.pt_loc,
                    sod_type: detail.item.pt_type,
                    sod_cc: "",
                    sod_taxable: detail.item.pt_taxable,
                    sod_tax_code: detail.item.pt_taxc,
                    sod_taxc: detail.item.taxe.tx2_tax_pct,
                    
                  });
                }
              
             // }
          //);
      }),
      (error) => {
        this.message = `Demande avec ce numero ${qo_nbr} n'existe pas`;
        this.hasFormErrors = true;
      },
      () => {}        
}
  changeCurr(){
    const controls = this.soForm.controls // chof le champs hada wesh men form rah
    const cu_curr  = controls.so_curr.value

    const date = new Date()

    this.date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

     
    this.deviseService.getBy({cu_curr}).subscribe((res:any)=>{
        const {data} = res
        console.log(res)
        if (!data){ this.layoutUtilsService.showActionNotification(
            "cette devise n'existe pas!",
            MessageType.Create,
            10000,
            true,
            true
        )
    this.error = true}
        else {
            this.error = false;
     
            if (cu_curr == 'DA'){
              controls.so_ex_rate.setValue(1)
              controls.so_ex_rate2.setValue(1)

            } else {

              console.log(this.date)
            this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
              controls.so_ex_rate.setValue(res.data.exr_rate)
               controls.so_ex_rate2.setValue(res.data.exr_rate2)
              })
     
              }
             
     
        }


    },error=>console.log(error))
}
changeRateCurr(){
  const controls = this.soForm.controls // chof le champs hada wesh men form rah
  const cu_curr  = controls.so_curr.value

  const date = new Date()

  this.date = controls.so_ord_date.value
    ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
    : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

    if (cu_curr == 'DA'){
      controls.so_ex_rate.setValue(1)
      controls.so_ex_rate2.setValue(1)

    } else {
          this.deviseService.getExRate({exr_curr1:cu_curr, exr_curr2:'DA', date: this.date /* `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`*/ }).subscribe((res:any)=>{
            

             controls.so_ex_rate.setValue(res.data.exr_rate)
             controls.so_ex_rate2.setValue(res.data.exr_rate2)
            })
   
    }
           
          
  
}
changeTax(){
  const controls = this.soForm.controls // chof le champs hada wesh men form rah
  const tx2_tax_code  = controls.so_taxc.value
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
      }


  },error=>console.log(error))
}


  onChangeCust() {
      const controls = this.soForm.controls; // chof le champs hada wesh men form rah
      const cm_addr = controls.so_cust.value;
      const date = new Date()

      this.date = controls.so_ord_date.value
      ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
      : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;


      this.customersService.getBy({ cm_addr }).subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;
  
          if (!data) {
            this.layoutUtilsService.showActionNotification(
              "ce client n'existe pas!",
              MessageType.Create,
              10000,
              true,
              true
            );
            this.error = true;
            document.getElementById("cust").focus();
          } else {
            this.error = false;
            this.customer = res.data; 
            controls.so_cust.setValue(data.cm_addr || "");
            controls.name.setValue(data.address.ad_name || "");
            controls.so_bill.setValue(data.cm_bill || "");
            controls.so_curr.setValue(data.cm_curr || "");
            controls.so_taxable.setValue(data.address.ad_taxable || "");
            controls.so_cr_terms.setValue(data.cm_cr_terms || "");
          
            this.addressService.getBy({ ad_addr:data.cm_bill  }).subscribe(
              (resadr: any) => {
                controls.namebill.setValue(resadr.data.ad_name || "");
                
              
              })
              this.deviseService.getBy({ cu_curr: data.cm_curr }).subscribe(
                (res: any) => {
                  console.log(res);
                  const { data } = res;
            if(data) {
  
              this.curr = data;
            }
  
                })
  
            if (data.cm_curr == 'DA'){
              controls.so_ex_rate.setValue(1)
              controls.so_ex_rate2.setValue(1)

            } else {

            this.deviseService.getExRate({exr_curr1:data.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
              
               controls.so_ex_rate.setValue(res.data.exr_rate)
               controls.so_ex_rate2.setValue(res.data.exr_rate2)
              })

              }

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
        console.log(item)
        const date = new Date()

        this.date = controls.so_ord_date.value
        ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
        : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  

        this.customer = item;
        controls.so_cust.setValue(item.cm_addr || "");
        controls.so_bill.setValue(item.cm_bill || "");
        controls.name.setValue(item.address.ad_name || "");
        controls.so_curr.setValue(item.cm_curr || "");
        controls.so_cr_terms.setValue(item.cm_cr_terms || "");
        controls.so_taxable.setValue(item.address.ad_taxable || "");
      
        
       
        const cm_addr = item.cm_addr;
     //   this.dataset = [];
      this.customersService.getBy({ cm_addr: item.cm_bill }).subscribe(
        (ressa: any) => {
          console.log(ressa);
          
            this.error = false;
            this.biller = ressa.data; 
            //controls.ih_bill.setValue(dataa.cm_addr || "");
            controls.namebill.setValue(ressa.data.address.ad_name || "");
            
            controls.so_curr.setValue(ressa.data.cm_curr || "");
            controls.so_taxable.setValue(ressa.data.address.ad_taxable || "");
            controls.so_cr_terms.setValue(ressa.data.cm_cr_terms || "");
            
        
  
  
        this.deviseService.getBy({ cu_curr: ressa.data.cm_curr }).subscribe(
          (res: any) => {
            console.log(res);
            const { data } = res;
              if(data) {
  
                this.curr = data;
              }
              if (item.cm_curr == 'DA'){
                controls.so_ex_rate.setValue(1)
                controls.so_ex_rate2.setValue(1)
  
              } else {
  
              this.deviseService.getExRate({exr_curr1:item.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
                
                 controls.so_ex_rate.setValue(res.data.exr_rate)
                 controls.so_ex_rate2.setValue(res.data.exr_rate2)
                })
  
                }
  
  
          })
  
  
        })  
  

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
        id: "cm_addr",
        name: "code",
        field: "cm_addr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "ad_name",
        name: "Client",
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
    this.customersService
      .getAll()
      .subscribe((response: any) => (this.customers = response.data));
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
        controls.so_buyer.setValue(item.usrd_code || "");
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
        id: "usrd_code",
        name: "code user",
        field: "usrd_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "usrd_name",
        name: "nom",
        field: "usrd_name",
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
    this.userService
      .getAllUsers()
      .subscribe((response: any) => (this.users = response.data));
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
          this.type = 'M'
         
        } else {
          this.type = null
        }         
        
        if (controls.so_taxable.value == false) {this.taxable = false} else { this.taxable = item.pt_taxable}
             
             
        this.locationDetailService.getByOne({ ld_site: item.pt_site, ld_loc: item.pt_loc, ld_part: item.pt_part, ld_lot: null }).subscribe(
          (response: any) => {
            this.lddet = response.data
            //console.log(this.lddet.ld_qty_oh)
           if (this.lddet != null) { 
            this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-SO" }).subscribe((resstat:any)=>{
              console.log(resstat)
              const { data } = resstat;

              if (data) {
                this.stat = null
              } else {
                this.stat = this.lddet.ld_status
              }
              updateItem.sod_part = item.pt_part;
              updateItem.desc = item.pt_desc1;
              updateItem.sod_um = item.pt_um;
              updateItem.sod_um_conv = 1;
              
              updateItem.sod_site = item.pt_site;
              updateItem.sod_loc = item.pt_loc
              updateItem.sod_serial = null
              updateItem.sod_taxable = this.taxable
              updateItem.sod_tax_code = item.pt_taxc
              updateItem.sod_taxc = item.taxe.tx2_tax_pct
              updateItem.sod_type = this.type
              updateItem.sod_price = item.pt_price
              updateItem.sod_disc_pct = 0
              updateItem.qty_oh = this.lddet.ld_qty_oh
              updateItem.sod_status = this.stat
              updateItem.sod_expire = this.lddet.ld_expire
              
              
              this.gridService.updateItem(updateItem);
            })  
          }else {
            updateItem.sod_part = item.pt_part;
            updateItem.desc = item.pt_desc1;
            updateItem.sod_um = item.pt_um;
            updateItem.sod_um_conv = 1;
            
            updateItem.sod_site = item.pt_site;
            updateItem.sod_loc = item.pt_loc
            updateItem.sod_serial = null
            updateItem.sod_taxable = this.taxable
            updateItem.sod_taxc = item.taxe.tx2_tax_pct
            updateItem.sod_tax_code = item.taxe.tx2_tax_code
            updateItem.sod_type = this.type
            updateItem.sod_price = item.pt_price
            updateItem.sod_disc_pct = 0
            updateItem.qty_oh = 0
            updateItem.sod_status = null
            updateItem.sod_expire = null
            
            
            this.gridService.updateItem(updateItem);
         

          }
          })
      }) 
      
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
        name: "UM",
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
    const controls = this.soForm.controls;

    const qo_nbr = controls.so_po.value;
    const qo_cust = controls.so_cust.value;

    if (Array.isArray(args.rows) && this.gridObj5) {
      args.rows.map((idx) => {
        const item = this.gridObj5.getDataItem(idx);
        controls.so_po.setValue(item.qo_nbr || "");
        controls.so_cust.setValue(item.qo_cust)
        controls.so_curr.setValue(item.qo_curr)
        controls.so_cr_terms.setValue(item.qo_cr_terms)
        controls.so_taxable.setValue(item.qo_taxable)
    

        this.quoteService.findByOne({ qo_nbr: item.qo_nbr }).subscribe(
          (res: any) => {
            const { quoteOrder, details } = res.data;
            console.log(details)

            

            this.customersService.getBy({ cm_addr: item.qo_cust }).subscribe(
              (res: any) => {
                //console.log(res);
                ;
                this.customer = res.data;
  
              })
            
                    for (const object in details) {
                      const detail = details[object];
                      console.log(detail.item);
                      this.gridService.addItem(
                        {
                          id: this.dataset.length + 1,
                          sod_line: this.dataset.length + 1,
                          
                          sod_part: detail.qod_part,
                          cmvid: "",
                          desc: detail.item.pt_desc1,
                          sod_qty_ord: detail.qod_qty_ord,
                          sod_um: detail.qod_um,
                          sod_price: detail.qod_price,
                          sod_disc_pct: detail.qod_disc_pct,
                          sod_site: detail.item.pt_site,
                          sod_loc: detail.item.pt_loc,
                          sod_type: detail.item.pt_type,
                          sod_cc: "",
                          sod_taxable: detail.item.pt_taxable,
                          sod_tax_code: detail.item.pt_taxc,
                          sod_taxc: detail.item.taxe.tx2_tax_pct,
                        },
                        { position: "bottom" }
                      );
                      this.datasetPrint.push({
                        id: this.dataset.length + 1,
                        sod_line: this.dataset.length + 1,
                       
                        sod_part: detail.qod_part,
                        cmvid: "",
                        desc: detail.item.pt_desc1,
                        sod_qty_ord: detail.qod_qty_ord,
                        sod_um: detail.qod_um,
                        sod_price: detail.qod_price,
                        sod_disc_pct: detail.qod_disc_pct,
                        sod_site: detail.item.pt_site,
                        sod_loc: detail.item.pt_loc,
                        sod_type: detail.item.pt_type,
                        sod_cc: "",
                        sod_taxable: detail.item.pt_taxable,
                        sod_tax_code: detail.item.pt_taxc,
                        sod_taxc: detail.item.taxe.tx2_tax_pct,
                       // taxe: detail.item.taxe.tx2_tax_pct,
                      });
                    }
                  
                 // }
              //);
          },
          (error) => {
            this.message = `Demande avec ce numero ${qo_nbr} n'existe pas`;
            this.hasFormErrors = true;
          },
          () => {}
        );
    
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
        id: "qo_nbr",
        name: "N° Offre",
        field: "qo_nbr",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "qo_ord_date",
        name: "Date",
        field: "qo_ord_date",
        sortable: true,
        filterable: true,
        type: FieldType.string,
      },
      {
        id: "qo_cust",
        name: "Client",
        field: "qo_cust",
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
    };

    // fill the dataset with your data
    this.quoteService
      .getAll()
      .subscribe((response: any) => (this.quotes = response.data));
  }
  open5(content) {
    this.prepareGrid5();
    this.modalService.open(content, { size: "lg" });
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
    this.taxService
      .getAll()
      .subscribe((response: any) => (this.datatax = response.data));
  }
  opentax(contenttax) {
    this.prepareGridtax();
    this.modalService.open(contenttax, { size: "lg" });
  }


  handleSelectedRowsChangedcurr(e, args) {
    const controls = this.soForm.controls;
    if (Array.isArray(args.rows) && this.gridObjcurr) {
      args.rows.map((idx) => {
        const item = this.gridObjcurr.getDataItem(idx);
        controls.so_curr.setValue(item.cu_curr || "");
          const date = new Date()
          this.date = controls.so_ord_date.value
          ? `${controls.so_ord_date.value.year}/${controls.so_ord_date.value.month}/${controls.so_ord_date.value.day}`
          : `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
          if (item.cu_curr == 'DA'){
            controls.so_ex_rate.setValue(1)
            controls.so_ex_rate2.setValue(1)

          } else {
          this.deviseService.getExRate({exr_curr1:item.cu_curr,exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
            
             controls.so_ex_rate.setValue(res.data.exr_rate)
             controls.so_ex_rate2.setValue(res.data.exr_rate2)
            
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




  handleSelectedRowsChangedum(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObjum) {
      args.rows.map((idx) => {
        const item = this.gridObjum.getDataItem(idx);
        updateItem.sod_um = item.code_value;
     
        this.gridService.updateItem(updateItem);

/*********/
console.log(updateItem.sod_part)

      this.itemsService.getBy({pt_part: updateItem.sod_part }).subscribe((resp:any)=>{
                      
        if   (updateItem.sod_um == resp.data.pt_um )  {
          
          updateItem.sod_um_conv = 1
        } else { 
          //console.log(resp.data.pt_um)



            this.mesureService.getBy({um_um: updateItem.sod_um, um_alt_um: resp.data.pt_um, um_part: updateItem.sod_part  }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;

          if (data) {
            //alert ("Mouvement Interdit Pour ce Status")
            updateItem.sod_um_conv = res.data.um_conv 
            this.angularGrid.gridService.highlightRow(1, 1500);
          } else {
            this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.sod_um, um_part: updateItem.sod_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;
              if (data) {
                //alert ("Mouvement Interdit Pour ce Status")
                updateItem.sod_um_conv = res.data.um_conv
                
              } else {
                updateItem.sod_um_conv = 1
                updateItem.sod_um = null
        
                alert("UM conversion manquante")
                
              }  
            })

          }
            })

          }
          })



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
handleSelectedRowsChangedsite(e, args) {
  let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
  if (Array.isArray(args.rows) && this.gridObjsite) {
    args.rows.map((idx) => {
      const item = this.gridObjsite.getDataItem(idx);
      console.log(item);

          
      updateItem.sod_site = item.si_site;
      
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
          
      updateItem.sod_loc = item.loc_loc;
      
      this.gridService.updateItem(updateItem);
   
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
  this.locationService
    .getBy({ loc_site:  updateItem.sod_site })
    .subscribe((response: any) => (this.dataloc = response.data));
}
openloc(contentloc) {
  this.prepareGridloc();
  this.modalService.open(contentloc, { size: "lg" });
}

handleSelectedRowsChanged(e, args) {
  const controls = this.soForm.controls
  if (Array.isArray(args.rows) && this.gridObj1) {
      args.rows.map((idx) => {
          const item = this.gridObj1.getDataItem(idx)
          controls.so_category.setValue(item.seq_seq || "")
      })
  }
}

angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid1 = angularGrid
  this.gridObj1 = (angularGrid && angularGrid.slickGrid) || {}
}

prepareGrid1() {
  this.columnDefinitions1 = [
      {
          id: "id",
          name: "id",
          field: "id",
          sortable: true,
          minWidth: 80,
          maxWidth: 80,
      },
      {
          id: "seq_seq",
          name: "code sequence",
          field: "seq_seq",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_desc",
          name: "description",
          field: "seq_desc",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_appr1",
          name: "approbateur 1",
          field: "seq_appr1",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_appr2",
          name: "approbateur 2",
          field: "seq_appr2",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
      {
          id: "seq_appr3",
          name: "approbateur 3",
          field: "seq_appr3",
          sortable: true,
          filterable: true,
          type: FieldType.string,
      },
  ]

  this.gridOptions1 = {
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
  }

  // fill the dataset with your data
 
  this.sequencesService
      .getBy({seq_type: 'SO', seq_profile: this.user.usrd_profile})
      .subscribe((response: any) => (this.sequences = response.data))
     
}
open(content) {
  this.prepareGrid1()
  this.modalService.open(content, { size: "lg" })
}
onChangeTAX() {
const controls = this.soForm.controls;
const tax = controls.so_taxable.value;

  for (var i = 0; i < this.dataset.length; i++) {
    let updateItem = this.gridService.getDataItemByRowIndex(i);
  //  console.log(this.dataset[i].qty_oh)
        updateItem.sod_taxable = tax ;
    
        this.gridService.updateItem(updateItem);
     
  };



this.calculatetot();
}

calculatetot(){
         const controls = this.totForm.controls 
          const controlsso = this.soForm.controls 
          let tht = 0
          let tva = 0
          let timbre = 0
          let ttc = 0
          for (var i = 0; i < this.dataset.length; i++) {
            console.log("here here " ,this.dataset[i]  )
            tht += round((this.dataset[i].sod_price * ((100 - this.dataset[i].sod_disc_pct) / 100 ) *  this.dataset[i].sod_qty_ord),2)
            if(controlsso.so_taxable.value == true) tva += round((this.dataset[i].sod_price * ((100 - this.dataset[i].sod_disc_pct) / 100 ) *  this.dataset[i].sod_qty_ord) * (this.dataset[i].sod_taxc ? this.dataset[i].sod_taxc / 100 : 0),2)
           
         
            
       
        
         
         
          }
          console.log(tht, tva)
          this.timbreService.getTimbreValue({ code: controlsso.so_cr_terms.value, amt: round(tht + tva )}).subscribe(
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
        updateItem.sod_serial = null;
        updateItem.qty_oh = 0;
        updateItem.sod_status = null;
        updateItem.sod_expire = null;
        

      }else {
        updateItem.sod_serial = item.ld_lot;
        updateItem.qty_oh = item.ld_qty_oh;
        updateItem.sod_status = item.ld_status;
        updateItem.sod_expire = item.ld_expire;
        
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
    .getBy({ ld_site:  updateItem.sod_site , ld_loc:  updateItem.sod_loc, ld_part:  updateItem.sod_part })
    .subscribe((response: any) => (this.datalocdet = response.data));
}
openlocdet(contentlocdet) {
  this.prepareGridlocdet();
  this.modalService.open(contentlocdet, { size: "lg" });
}
handleSelectedRowsChangedbill(e, args) {
  const controls = this.soForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbill) {
    args.rows.map((idx) => {
      const item = this.gridObjbill.getDataItem(idx);
      console.log(item)
      
      this.biller = item;
      controls.so_bill.setValue(item.cm_addr || "");
      controls.namebill.setValue(item.address.ad_name || "");
      controls.so_curr.setValue(item.cm_curr || "");
      controls.so_cr_terms.setValue(item.cm_cr_terms || "");
      controls.so_taxable.setValue(item.address.ad_taxable || "");
      

      this.deviseService.getBy({ cu_curr: item.cm_curr }).subscribe(
        (res: any) => {
          console.log(res);
          const { data } = res;
            if(data) {

              this.curr = data;
            }
           
            if (item.cm_curr == 'DA'){
              controls.so_ex_rate.setValue(1)
              controls.so_ex_rate2.setValue(1)

            } else {

            this.deviseService.getExRate({exr_curr1:item.cm_curr, exr_curr2:'DA', date: this.date}).subscribe((res:any)=>{
              
               controls.so_ex_rate.setValue(res.data.exr_rate)
               controls.so_ex_rate2.setValue(res.data.exr_rate2)
              })

              }
        })


    });
  }
}

angularGridReadybill(angularGrid: AngularGridInstance) {
  this.angularGridbill = angularGrid;
  this.gridObjbill = (angularGrid && angularGrid.slickGrid) || {};
}

prepareGridbill() {
  this.columnDefinitionsbill = [
    {
      id: "id",
      name: "id",
      field: "id",
      sortable: true,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      id: "cm_addr",
      name: "code",
      field: "cm_addr",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "ad_name",
      name: "Client",
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

  this.gridOptionsbill = {
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
  this.customersService
    .getAll()
    .subscribe((response: any) => (this.bills = response.data));
}
openbill(content) {
  this.prepareGridbill();
  this.modalService.open(content, { size: "lg" });
}



printpdf(nbr) {
  const controls = this.totForm.controls 
  const controlss = this.soForm.controls 
  console.log("pdf")
  var doc = new jsPDF();
 
 // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image()
  img.src = "./assets/media/logos/company.png";
  doc.addImage(img, 'png', 5, 5, 210, 30)
  doc.setFontSize(12);
  doc.text( 'Commande N° : ' + nbr  , 70, 40);
  doc.setFontSize(8);
  console.log(this.customer.address.ad_misc2_id)
  doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
  doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
  doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
  if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
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
    
    if ((j % 30 == 0) && (j != 0) ) {
doc.addPage();
      doc.addImage(img, 'png', 5, 5, 210, 30)
      doc.setFontSize(12);
      doc.text( 'Commande N° : ' + nbr  , 70, 40);
      doc.setFontSize(8);
      console.log(this.customer.address.ad_misc2_id)
      doc.text('Code Client : ' + this.customer.cm_addr, 20 , 50 )
      doc.text('Nom             : ' + this.customer.address.ad_name, 20 , 55)
      doc.text('Adresse       : ' + this.customer.address.ad_line1, 20 , 60)
      if (this.customer.address.ad_misc2_id != null) {doc.text('MF          : ' + this.customer.address.ad_misc2_id, 20 , 65)}
      if (this.customer.address.ad_gst_id != null) {doc.text('RC          : ' + this.customer.address.ad_gst_id, 20 , 70)}
      if (this.customer.address.ad_pst_id) {doc.text('AI            : ' + this.customer.address.ad_pst_id, 20 , 75)}
      if (this.customer.address.ad_misc1_id != null) {doc.text('NIS         : ' + this.customer.address.ad_misc1_id, 20 , 80)}
    
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
      doc.text(String(("000"+ this.dataset[j].sod_line)).slice(-3), 12.5 , i  - 1);
      doc.line(20, i - 5, 20, i);
      doc.text(this.dataset[j].sod_part, 25 , i  - 1);
      doc.line(45, i - 5 , 45, i );
      doc.text(desc1, 47 , i  - 1);
      doc.line(100, i - 5, 100, i );
      doc.text( String(this.dataset[j].sod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
      doc.line(120, i - 5 , 120, i );
      doc.text(this.dataset[j].sod_um, 123 , i  - 1);
      doc.line(130, i - 5, 130, i );
      doc.text( String(Number(this.dataset[j].sod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
      doc.line(150, i - 5, 150, i );
      doc.text(String(this.dataset[j].sod_taxc) + "%" , 153 , i  - 1);
      doc.line(160, i - 5 , 160, i );
      doc.text(String(this.dataset[j].sod_disc_pct) + "%" , 163 , i  - 1);
      doc.line(170, i - 5 , 170, i );
      doc.text(String((this.dataset[j].sod_price *
              ((100 - this.dataset[j].sod_disc_pct) / 100) *
              this.dataset[j].sod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
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
    doc.text(String(("000"+ this.dataset[j].sod_line)).slice(-3), 12.5 , i  - 1);
    doc.line(20, i - 5, 20, i);
    doc.text(this.dataset[j].sod_part, 25 , i  - 1);
    doc.line(45, i - 5 , 45, i );
    doc.text(this.dataset[j].desc, 47 , i  - 1);
    doc.line(100, i - 5, 100, i );
    doc.text( String(this.dataset[j].sod_qty_ord.toFixed(2)), 118 , i  - 1 , { align: 'right' });
    doc.line(120, i - 5 , 120, i );
    doc.text(this.dataset[j].sod_um, 123 , i  - 1);
    doc.line(130, i - 5, 130, i );
    doc.text( String(Number(this.dataset[j].sod_price).toFixed(2)), 148 , i  - 1 , { align: 'right' });
    doc.line(150, i - 5, 150, i );
    doc.text(String(this.dataset[j].sod_taxc) + "%" , 153 , i  - 1);
    doc.line(160, i - 5 , 160, i );
    doc.text(String(this.dataset[j].sod_disc_pct) + "%" , 163 , i  - 1);
    doc.line(170, i - 5 , 170, i );
    doc.text(String((this.dataset[j].sod_price *
      ((100 - this.dataset[j].sod_disc_pct) / 100) *
      this.dataset[j].sod_qty_ord).toFixed(2)), 198 , i  - 1,{ align: 'right' });
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
}
