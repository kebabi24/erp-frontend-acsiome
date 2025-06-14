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
  ItemService,
  AddressService,
  TaxeService,
  VendorProposal,
  InventoryTransaction,
  InventoryTransactionService,
  LocationService,
  SiteService,
  CostSimulationService,
  LocationDetailService,
  CodeService,
  InventoryStatusService,
  MesureService,
  SequenceService,
  printBc,
  printISSUNP,
  Label,
  LabelService,
  PrintersService, EmployeService
} from "../../../../core/erp";
import { Reason, ReasonService} from "../../../../core/erp"
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
declare var ElectronPrinter3: any;
declare var Edelweiss: any;
@Component({
  selector: 'kt-return-cab', 
  templateUrl: './return-cab.component.html',
  styleUrls: ['./return-cab.component.scss']
})



export class ReturnCabComponent implements OnInit {
  inventoryTransaction: InventoryTransaction;
  employeGrp: string;
  currentPrinter: string;
  PathPrinter: string;
  datasetPrint = [];

  dataprinter: [];
  columnDefinitionsprinter: Column[] = [];
  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;
  angularGridprinter: AngularGridInstance;
  data: any[];
  printable:any;
  trForm: FormGroup;
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
  user
  
  alertWarning: any;
 
  adresses: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

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

  datalocdet: [];
  columnDefinitionslocdet: Column[] = [];
  gridOptionslocdet: GridOption = {};
  gridObjlocdet: any;
  angularGridlocdet: AngularGridInstance;

  causes: []
  columnDefinitions6: Column[] = []
  gridOptions6: GridOption = {}
  gridObj6: any
  angularGrid6: AngularGridInstance

  ums: [];
  columnDefinitionsum: Column[] = [];
  gridOptionsum: GridOption = {};
  gridObjum: any;
  angularGridum: AngularGridInstance;
  globalState: boolean = false;
  statuss: [];
  columnDefinitionsstatus: Column[] = [];
  gridOptionsstatus: GridOption = {};
  gridObjstatus: any;
  angularGridstatus: AngularGridInstance;

  provider: any;
  row_number;
  message = "";
  prhServer;
  location: any;
  sct: any;
  seq: any;
  lddet: any;
  trlot: string;
  index:any;
  stat: String;
  trtype:string;
  domconfig : any;
  prodligne : any;
  dsgn_grp  : any;
  domain    : any;  
  docs: any[] = [];
  exist:any;
  constructor(
    config: NgbDropdownConfig,
    private trFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private inventoryTransactionService: InventoryTransactionService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    private locationService: LocationService,
    private codeService: CodeService,
    private inventoryStatusService: InventoryStatusService,
    private siteService: SiteService,
    private mesureService: MesureService,
    private addressService: AddressService,
    private sequenceService: SequenceService,
    private locationDetailService: LocationDetailService,
    private labelService: LabelService,
    private printerService: PrintersService,
    private employeService: EmployeService,
    private reasonService: ReasonService,
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
            let idpal;
            let vendor:any;
          this.labelService.getBy({lb_cab: args.dataContext.tr_ref}).subscribe((res:any) =>{if (res.data != null) {idpal = res.data.id
            this.addressService.getBy({ad_name:args.dataContext.tr_addr}).subscribe((ad:any) => {if(ad.data != null){vendor = ad.ad_name}})
            let obj = {}
            obj = {lb_part: args.dataContext.tr_part,
              lb_addr: vendor,
              lb_qty:args.dataContext.tr_qty_loc,
              lb_serial:args.dataContext.tr_serial
            }
            // this.labelService.update(idpal,obj).subscribe((res:any) =>{})
          }})
          
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
      {
        id: "tr_part",
        name: "Article",
        field: "tr_part",
        sortable: true,
        width: 50,
        filterable: false,
        // editor: {
        //   model: Editors.text,
        //   required: true,
        //   validator: statusValidator,

        // },
        // onCellChange: (e: Event, args: OnEventArgs) => {
        //   console.log(args.dataContext.tr_part)
        //   this.itemsService.getByOne({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{

        //     if (resp.data) {
        //       console.log(resp.data)

             
        //         this.sctService.getByOne({ sct_site: resp.data.pt_site, sct_part: resp.data.pt_part, sct_sim: 'STD-CG' }).subscribe(
        //           (response: any) => {
        //             this.sct = response.data
           
        //             this.locationDetailService.getByOne({ ld_site: resp.data.pt_site, ld_loc: resp.data.pt_loc, ld_part: resp.data.pt_part, ld_lot: null }).subscribe(
        //               (response: any) => {
        //                 this.lddet = response.data
        //                 console.log(this.lddet.ld_qty_oh)
        //                 if (this.lddet != null) {
        //                 this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-UNP" }).subscribe((resstat:any)=>{
        //                //   console.log(resstat)
        //                   const { data } = resstat;
  
        //                   if (data) {
        //                     this.stat = null
        //                   } else {
        //                     this.stat = this.lddet.ld_status
        //                   }
        //             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:resp.data.pt_site, tr_loc:resp.data.pt_loc,
        //               tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_mtl_tl, qty_oh: this.lddet.ld_qty_oh, tr_expire: this.lddet.ld_expire})
        //                 });
        //               }
        //               else {
        //                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:resp.data.pt_site, tr_loc:resp.data.pt_loc,
        //                   tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: null, tr_price: this.sct.sct_mtl_tl, qty_oh: 0, tr_expire: null})
                      

        //               }     
     
        //               });     
        //         });  
            
        //   }



    


        //   else {
        //     this.message = "article n'existe pas";
        //     this.hasFormErrors = true;
        //     return;
        //     this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
        //   }
          
        //   });

           
         
         
        // }
      },
      // {
      //   id: "mvid",
      //   field: "cmvid",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.row_number = args.row;
      //     let element: HTMLElement = document.getElementById(
      //       "openItemsGrid"
      //     ) as HTMLElement;
      //     element.click();
      //   },
      // },
      {
        id: "desc",
        name: "Description",
        field: "desc",
        sortable: true,
        width: 180,
        filterable: false,
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
      //     required: true,
      //     validator: statusValidator,

      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {

      //     this.siteService.getByOne({ si_site: args.dataContext.tr_site,}).subscribe(
      //       (response: any) => {
              
      //     console.log(response.data)

      //           if (response.data) {
                  
      //               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_site: response.data.si_site})
      //           }
      //           else {
      //                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_site: null});
    
      //                // this.gridService.onItemUpdated;
      //              
      //           }
      //     });     
      // }

      // },
      // {
      //     id: "mvids",
      //     field: "cmvids",
      //     excludeFromHeaderMenu: true,
      //     formatter: Formatters.infoIcon,
      //     minWidth: 30,
      //     maxWidth: 30,
      //     onCellClick: (e: Event, args: OnEventArgs) => {
      //         this.row_number = args.row;
      //         let element: HTMLElement = document.getElementById(
      //         "openSitesGrid"
      //         ) as HTMLElement;
      //         element.click();
      //     },
      // },
      // {
      //   id: "tr_loc",
      //   name: "Emplacement",
      //   field: "tr_loc",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //     required: true,
      //     validator: statusValidator,

      //   },


      //   onCellChange: (e: Event, args: OnEventArgs) => {
      //     console.log(args.dataContext.tr_site)
      //     console.log(args.dataView.tr_site)
            
      //       this.locationService.getByOne({ loc_loc: args.dataContext.tr_loc, loc_site: args.dataContext.tr_site }).subscribe(
      //         (response: any) => {
      //           this.location = response.data
      //           if (response.data) {

      //               this.locationDetailService.getByOne({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: null }).subscribe(
      //                 (response: any) => {
      //                   this.lddet = response.data
      //                 //  console.log(this.lddet[0].ld_qty_oh)
      //          if (this.lddet){
      //                   this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-UNP" }).subscribe((resstat:any)=>{
      //               //      console.log(resstat)
      //                     const { data } = resstat;
  
      //                     if (data) {
      //                       this.stat = null
      //                     } else {
      //                       this.stat = this.lddet.ld_status
      //                     }
      //               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   tr_status: this.stat, qty_oh: this.lddet.ld_qty_oh, tr_expire: this.lddet.ld_expire})
      //                   });     
      //                 }
      //                 else {
      //                   this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   tr_status: null, qty_oh: 0, tr_expire: null})
                     
      //                 }
      //                 });     
      //               }
      //               else {
      //                 
      //                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_loc: null, qty_oh: 0, tr_status: null })
      //               }
                     
      //   });

      // }



      // },
      // {
      //     id: "mvidl",
      //     field: "cmvidl",
      //     excludeFromHeaderMenu: true,
      //     formatter: Formatters.infoIcon,
      //     minWidth: 30,
      //     maxWidth: 30,
      //     onCellClick: (e: Event, args: OnEventArgs) => {
      //         this.row_number = args.row;
      //         let element: HTMLElement = document.getElementById(
      //         "openLocsGrid"
      //         ) as HTMLElement;
      //         element.click();
      //     },
      // },       
      {
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
        // editor: {
        //   model: Editors.text,
        // },
      //   onCellChange: (e: Event, args: OnEventArgs) => {

      //       this.locationDetailService.getByOne({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe(
      //         (response: any) => {
      //           this.lddet = response.data
                
      //  // console.log(response.data.length)
      //             if (this.lddet != null) {
                    
      //                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddet.ld_qty_oh, tr_status: this.lddet.ld_status, tr_expire: this.lddet.tr_expire})
      //             }
      //             else {
      //                   this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0, tr_expire: null});
      
      //                   this.message = "lot n'existe pas";
      //                   this.hasFormErrors = true;
      //                   return;
      //             }
      //       });     
      //   }

      },
      // {
      //     id: "mvidlot",
      //     field: "cmvidlot",
      //     excludeFromHeaderMenu: true,
      //     formatter: Formatters.infoIcon,
      //     minWidth: 30,
      //     maxWidth: 30,
      //     onCellClick: (e: Event, args: OnEventArgs) => {
      //         this.row_number = args.row;
      //         let element: HTMLElement = document.getElementById(
      //         "openLocdetsGrid"
      //         ) as HTMLElement;
      //         element.click();
      //     },
      // },
      // {
      //     id: "qty_oh",
      //     name: "QTE Stock",
      //     field: "qty_oh",
      //     sortable: true,
      //     width: 80,
      //     filterable: false,
      //     type: FieldType.float,
          
      // },
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
              required: true,
              
              
          },
      
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.trForm.controls;
          if (controls.tr_rmks.value == null){
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: args.dataContext.qty_oh })
        
            this.message = "veuillez choisir la cause";
              this.hasFormErrors = true;
              return;
          }
              if (args.dataContext.tr_qty_loc <0){
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: args.dataContext.qty_oh })
            
                this.message = "Quantité n peut pas être négative";
                  this.hasFormErrors = true;
                  return;
              }
              if (args.dataContext.tr_qty_loc * args.dataContext.tr_um_conv   > args.dataContext.qty_oh) {
                  console.log('here')
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: args.dataContext.qty_oh })
            
                  this.message = "Quantité manquante";
                  this.hasFormErrors = true;
                  
                  return;
               
           
             
          }
          else{this.printable = true}
      
           // meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
          }
          
      },
      
        {
          id: "tr_um",
          name: "UM",
          field: "tr_um",
          sortable: true,
          width: 80,
          filterable: false,
          // editor: {
          //     model: Editors.text,
          //     required: true,
          //     validator: statusValidator,

          // },
          // onCellChange: (e: Event, args: OnEventArgs) => {
          //   console.log(args.dataContext.tr_um)
          //   this.itemsService.getBy({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
              
          //   if   (args.dataContext.tr_um == resp.data.pt_um )  {
              
          //     this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: 1 })
          //   } else { 
          //     //console.log(resp.data.pt_um)



          //       this.mesureService.getBy({um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
          //       console.log(res)
          //       const { data } = res;
      
          //     if (data) {
                
          //       this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
          //       this.angularGrid.gridService.highlightRow(1, 1500);

          //       if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
          //         this.message = "Quantité manquante";
          //         this.hasFormErrors = true;
          //         return;
          //         this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                  
              
          //       } else {
              
          //         this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })

          //       }




          //     } else {
          //       this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
          //         console.log(res)
          //         const { data } = res;
          //         if (data) {
          //           if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
          //             console.log('here')
          //             this.message = "Quantité manquante";
          //             this.hasFormErrors = true;
          //             return;
          //             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                      
                  
          //           } else {
                  
          //             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })
    
          //           }
          
          //         } else {
          //           this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
              
                    
                    
          //         }  
          //       })

          //     }
          //       })

          //     }
          //     })
    
          //   }

          
      },
    
     
      // {
      //   id: "mvidlot",
      //   field: "cmvidlot",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //       this.row_number = args.row;
      //       let element: HTMLElement = document.getElementById(
      //       "openUmsGrid"
      //       ) as HTMLElement;
      //       element.click();
      //   },
      // },
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
      {
        id: "tr_ref",
        name: "Palette",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
       // editor: {
       //     model: Editors.float,
        //},
        
      },
      
      // {
      //     id: "tr_price",
      //     name: "Prix unitaire",
      //     field: "tr_price",
      //     sortable: true,
      //     width: 80,
      //     filterable: false,
      //     //type: FieldType.float,
      //     editor: {
      //         model: Editors.float,
      //         params: { decimalPlaces: 2 }
      //     },
      //     formatter: Formatters.decimal,
          
      // },
              
      // {
      //   id: "tr_status",
      //   name: "Status",
      //   field: "tr_status",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //  /* editor: {
      //     model: Editors.text,
      //     required: true,
      //     validator: statusValidator,

      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {
      //     console.log(args.dataContext.tr_status)
          
      //     this.inventoryStatusService.getAllDetails({isd_status: args.dataContext.tr_status, isd_tr_type: "ISS-UNP" }).subscribe((res:any)=>{
      //     console.log(res)
      //     const { data } = res;

      //   if (data) {
      //     
      //     this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
          
      //   }
      //     })

  
      //     //if (args.dataContext.tr_qty_loc > args.dataContext.qty_oh) {
      //    
      //     // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
      //   
       
         
      // },
      // */




      // },
      // {
      //   id: "mvidlot",
      //   field: "cmvidlot",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //       this.row_number = args.row;
      //       let element: HTMLElement = document.getElementById(
      //       "openStatussGrid"
      //       ) as HTMLElement;
      //       element.click();
      //   },
      // },
      // {
      //   id: "tr_expire",
      //   name: "Expire",
      //   field: "tr_expire",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   formatter: Formatters.dateIso,
        
      //   type: FieldType.dateIso,
        
      // },
      {
        id: "idprint",
        field: "idprint",
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
          const controls = this.trForm.controls;
           
          let barcode = ''
          if (controls.tr_rmks.value == null){
           // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: args.dataContext.qty_oh })
        
            this.message = "veuillez choisir la cause";
              this.hasFormErrors = true;
              return;
          }
          if (this.printable == true){
          if (args.dataContext.tr_part != null && args.dataContext.tr_qty_loc != null ) {
            // this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: '-', qty: args.dataContext.tr_qty_loc });
             
            this.printable = false
            const _lb = new Label();
            (_lb.lb__dec01 = args.dataContext.tr_line), (_lb.lb_site = args.dataContext.tr_site);
            _lb.lb_rmks = controls.tr_rmks.value;
            _lb.lb_loc = args.dataContext.tr_loc;
            _lb.lb_part = args.dataContext.tr_part;
            // _lb.lb_nbr = args.dataContext.tr_so_job; //this.trnbr
            _lb.lb_lot = args.dataContext.tr_serial;
            _lb.lb_date = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
            _lb.lb_qty = args.dataContext.tr_qty_loc;
            _lb.lb_um = args.dataContext.tr_um;
            _lb.lb_ld_status = args.dataContext.tr_status;
            _lb.lb_desc = args.dataContext.desc;
            _lb.lb_printer = this.PathPrinter;
            _lb.lb_cust = controls.tr_addr.value;
            _lb.lb_grp = this.employeGrp;
            _lb.lb_addr = 'DKAKNA';
            _lb.lb_tel = '';
            _lb.lb__chr01 = String(new Date().toLocaleTimeString())
            let lab = null;
            
           
            this.labelService.add(_lb).subscribe(
              (reponse: any) => {
                lab = reponse.data;
                barcode = lab.lb_ref;
                 this.index = this.dataset.findIndex((el) => {
                  return el.tr_line == args.dataContext.id;
                });
                this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_ref: barcode, qty: args.dataContext.tr_qty_loc });              
                this.onSubmit();
                this.labelService.addblob(_lb).subscribe((blob) => {                 
                  Edelweiss.print3(lab,this.currentPrinter);
                  
                });
                
                
              },
              (error) => {
                this.message = "l'impression n'a pas été enregistrée";
                this.hasFormErrors = true;
                return;
              },
              
            );
          } else {
            this.message = "veuillez choisir article et remplir le poids ";
            this.hasFormErrors = true;
            return;
          }
         
        }
        else {
          this.message = "Etiquette déjà imprimée ";
          this.hasFormErrors = true;
          return;
        }
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
  //ISS-UNP qrt * -1 w ttna7a men ld_det 
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable();
    this.loadingSubject.next(false);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.domain = JSON.parse(localStorage.getItem("domain"));
    this.codeService
    .getBy({ code_fldname: "manufacturing/return-cab" })
    .subscribe((response: any) => {
      const { data } = response;
     this.docs = data; 
     if(response.data.length != 0){this.exist = true} 
    });
    this.currentPrinter = this.user.usrd_dft_printer;
      this.printerService.getByPrinter({ printer_code: this.currentPrinter }).subscribe(
        (reponse: any) => ((this.PathPrinter = reponse.data.printer_path)),
        (error) => {
          this.message = "veuillez verifier l'imprimante";
          this.hasFormErrors = true;
          return;
        }
      );
      this.employeService.getByOne({ emp_userid: this.user.usrd_code }).subscribe(
        (reponse: any) => ((this.employeGrp = reponse.data.emp_shift)),
        (error) => {
          this.message = "veuillez verifier la connexion";
          this.hasFormErrors = true;
          return;
        }
      );

  this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
    (reponse: any) => {
      if(reponse.data != null ) {   
        
        this.domconfig = true
        this.prodligne = reponse.data.code_cmmt
        this.dsgn_grp  = reponse.data.code_desc
      } else  {
        this.domconfig = false
      }
    },  
        
    (error) => {
     this.domconfig = false      },
   
  );
  
    this.createForm();
    this.user =  JSON.parse(localStorage.getItem('user'))
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.inventoryTransaction = new InventoryTransaction();
    const date = new Date;
    this.trForm = this.trFB.group({
      tr_nbr: [this.inventoryTransaction.tr_nbr],
      tr_effdate: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      // tr_nbr: [this.inventoryTransaction.tr_so_job],
      
      tr_rmks: [this.inventoryTransaction.tr_rmks],
      tr_addr: [this.inventoryTransaction.tr_addr],
      tr_qty_loc:[this.inventoryTransaction.tr_qty_loc],
      print:[false],
      tr_ref: [null],
      printer: [this.user.usrd_dft_printer],
   
    });
    const controls = this.trForm.controls;
    
    // if(this.domconfig) {
      this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
        (reponse: any) => { 
          if(reponse.data != null && reponse.data.code_value != ' ') {
          controls.tr_addr.setValue(reponse.data.code_value),
          controls.tr_addr.disable() 

          // this.addressService.getBy({ ad_addr: reponse.data.code_value }).subscribe((response: any) => {
          //   //   const { data } = response;
               
          //      if (response.data != null) {
          //        this.provider = response.data;
          //      }
          //    });
          
          }
        },
        (error) => {
       
        },
       
      );
    
  
      

  }
  //reste form
  reset() {
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.dataset=[];
    this.hasFormErrors = false;
  }
  // save data
  onSubmit() {
    
    this.hasFormErrors = false;
    const controls = this.trForm.controls;
    const ref = controls.tr_ref.value
    this.data = [];
    let obj:any;
    if (this.trtype =='ISS-WO'){obj = {
      tr_lot:this.trlot,
      tr_so_job: controls.tr_ref.value,
      tr_line: this.dataset[this.index].tr_line,
      tr_part: this.dataset[this.index].tr_part,
      desc: this.dataset[this.index].desc,
      tr_qty_loc: this.dataset[this.index].tr_qty_loc * -1,
      tr_um: this.dataset[this.index].tr_um,
      tr_um_conv: this.dataset[this.index].tr_um_conv,
      tr_price: this.dataset[this.index].tr_price,
      tr_site: this.dataset[this.index].tr_site,
      tr_loc: this.dataset[this.index].tr_loc,
      tr_serial: this.dataset[this.index].tr_serial,
      tr_ref: this.dataset[this.index].tr_ref,
      tr_status: this.dataset[this.index].tr_status,
      tr_expire: this.dataset[this.index].tr_expire,
    };}
    else{obj = {
      tr_lot:this.trlot,
      tr_so_job: controls.tr_ref.value,
      tr_line: this.dataset[this.index].tr_line,
      tr_part: this.dataset[this.index].tr_part,
      desc: this.dataset[this.index].desc,
      tr_qty_loc: this.dataset[this.index].tr_qty_loc ,
      tr_um: this.dataset[this.index].tr_um,
      tr_um_conv: this.dataset[this.index].tr_um_conv,
      tr_price: this.dataset[this.index].tr_price,
      tr_site: this.dataset[this.index].tr_site,
      tr_loc: this.dataset[this.index].tr_loc,
      tr_serial: this.dataset[this.index].tr_serial,
      tr_ref: this.dataset[this.index].tr_ref,
      tr_status: this.dataset[this.index].tr_status,
      tr_expire: this.dataset[this.index].tr_expire,
    };}
    // this.data.push(this.dataset[this.index])
    this.data.push(obj);

     
    
    /** check form */

    if (this.trForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
      this.message = "Modifiez quelques éléments et réessayez de soumettre.";
      this.hasFormErrors = true;

      return;
    }

        let tr = this.prepare();
        this.sequenceService.getByOne({ seq_type: "RT", seq_profile: this.user.usrd_profile }).subscribe((response: any) => {
          this.seq = response.data;
    console.log(this.seq)
          if (this.seq) {
            console.log(this.trlot)
            if(this.trlot == null)
            { this.trlot = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val) + 1}`;
            console.log(this.trlot)
              this.addIt(this.data, tr, this.trlot);
              this.sequenceService.update(this.seq.id, { seq_curr_val: Number(this.seq.seq_curr_val) + 1 }).subscribe(
              (reponse) => console.log("seq"),
              (error) => {
                this.message = "Erreur modification Sequence";
                this.hasFormErrors = true;
                return;
              });
              
            }
            else
            {this.addIt(this.data, tr, this.trlot);}
          } else {
            this.message = "Parametrage Manquant pour la sequence";
            this.hasFormErrors = true;
            return;
          }
        });
    

    controls.tr_ref.setValue(null)
    // tslint:disable-next-line:prefer-const
  }

  prepare() {
    const controls = this.trForm.controls;
    const ref = controls.tr_ref.value
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = controls.tr_nbr.value;
    _tr.tr_lot = this.trlot
    _tr.tr_effdate = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
    _tr.tr_so_job = controls.tr_ref.value;

    _tr.tr_rmks = controls.tr_rmks.value;
    _tr.tr_addr = controls.tr_addr.value;

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
    console.log("here data", detail);
    // for (let data of detail) {
    //   delete data.id;
    //   delete data.cmvid;
    // }
    this.loadingSubject.next(true);
    const controls = this.trForm.controls;
    console.log(this.trtype)
    if (this.trtype == 'ISS-UNP'){this.inventoryTransactionService.addRCTUNPCab({ detail, it, nlot }).subscribe(
      (reponse: any) => {
        console.log(reponse);
        
      },
      (error) => {
        this.message = "La transaction n'a pas été enregistrée ";
        this.hasFormErrors = true;
        return;
        
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);

       
      }
    );
  }
  else {
    if (this.trtype == 'ISS-WO'){this.inventoryTransactionService.addRetIssWo({ detail, it}).subscribe(
      (reponse: any) => {
        console.log(reponse);
        
      },
      (error) => {
        
        this.message = "La transaction n'a pas été enregistrée ";
        this.hasFormErrors = true;
        return;
        
        
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);

        
      }
    );
  }
  }
    
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
    const controls = this.trForm.controls;
    if(controls.tr_addr.value == null){  this.message = "veuillez remplir l'adresse";
    this.hasFormErrors = true;
    return;}
    else{
    this.gridService.addItem(
      {
        id: this.dataset.length + 1,
        tr_line: this.dataset.length + 1,
        tr_part: "",
        cmvid: "",
        desc: "",
        tr_qty_loc: 0,
        tr_um: "",
        tr_um_conv: 1,
        tr_price: 0,
        tr_site: "",
        cmvids: "",
        tr_loc: "",
        tr_serial: null,
        tr_status: null,
        tr_expire: null,
      },
      { position: "bottom" }
    );
  }
  }
  
  
  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

       
        
            this.sctService.getByOne({ sct_site: item.pt_site, sct_part: item.pt_part, sct_sim: 'STD-CG' }).subscribe(
              (response: any) => {
                this.sct = response.data
            
                this.locationDetailService.getByOne({ ld_site: item.pt_site, ld_loc: item.pt_loc, ld_part: item.pt_part, ld_lot: null }).subscribe(
                  (response: any) => {
                    this.lddet = response.data
                    //console.log(this.lddet.ld_qty_oh)
           if (this.lddet != null)
               {     this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-UNP" }).subscribe((resstat:any)=>{
                      console.log(resstat)
                      const { data } = resstat;

                      if (data) {
                        this.stat = null
                      } else {
                        this.stat = this.lddet.ld_status
                      }
            
              updateItem.tr_part = item.pt_part;
              updateItem.desc = item.pt_desc1;
              updateItem.tr_um = item.pt_um;
              updateItem.tr_conv_um = 1;
              
              updateItem.tr_site = item.pt_site;
              updateItem.tr_loc = item.pt_loc;
              updateItem.tr_price = this.sct.sct_mtl_tl;
              
              updateItem.qty_oh =  this.lddet.ld_qty_oh;
              
              updateItem.tr_status =  this.stat;
              updateItem.tr_expire =  this.lddet.ld_expire;
              this.gridService.updateItem(updateItem);
           });
          }
          else {
            updateItem.tr_part = item.pt_part;
            updateItem.desc = item.pt_desc1;
            updateItem.tr_um = item.pt_um;
            updateItem.tr_conv_um = 1;
            
            updateItem.tr_site = item.pt_site;
            updateItem.tr_loc = item.pt_loc;
            updateItem.tr_price = this.sct.sct_mtl_tl;
            
            updateItem.qty_oh =  0;
            
            updateItem.tr_status =  null;
            updateItem.tr_expire =  null;
            this.gridService.updateItem(updateItem);


          }
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
      autoCommitEdit:true,
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
    this.globalState=false
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
  console.log(updateItem.tr_site )
              

          this.locationService.getByOne({ loc_loc: item.tr_loc, loc_site: updateItem.tr_site }).subscribe(
            (response: any) => {
              this.location = response.data
              if (response.data) {

                this.locationDetailService.getByOne({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: null }).subscribe(
                  (response: any) => {
                    this.lddet = response.data
                  //  console.log(this.lddet[0].ld_qty_oh)
           if (this.lddet){
             
                      this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-UNP" }).subscribe((resstat:any)=>{
                        console.log(resstat)
                        const { data } = resstat;

                        if (data) {
                          this.stat = null
                        } else {
                          this.stat = this.lddet.ld_status
                        }
                    updateItem.tr_loc = item.loc_loc
                    updateItem.tr_status = this.stat
                    updateItem.qty_oh = this.lddet.ld_qty_oh
                    updateItem.tr_expire = this.lddet.tr_expire
                    
                      });     
   
           }
           else {
            updateItem.tr_loc = item.loc_loc
            updateItem.tr_status = null
            updateItem.qty_oh = 0
            updateItem.tr_expire = null
            
           }
          })
                  }
                  else {
                  
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_loc: null, tr_status: null })
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
        .getBy({ loc_site:  updateItem.tr_site })
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
  
              

          this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-UNP" }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;
  
          if (data) {
            updateItem.tr_serial = null;
            updateItem.tr_expire = null;
            updateItem.qty_oh = 0;
            this.message = "mouvement interdit dans cet emplacement";
            this.hasFormErrors = true;
            return;
            

          }else {
            updateItem.tr_serial = item.ld_lot;
            updateItem.tr_status = item.ld_status;
            updateItem.tr_expire = item.ld_expire;
            updateItem.tr_ref = item.ld_ref;
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
          id: "ld_ref",
          name: "Palette",
          field: "ld_ref",
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
        .getBy({ ld_site:  updateItem.tr_site , ld_loc:  updateItem.tr_loc, ld_part:  updateItem.tr_part })
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
          updateItem.tr_um = item.code_value;
       
          this.gridService.updateItem(updateItem);

/*********/
console.log(updateItem.tr_part)

        this.itemsService.getBy({pt_part: updateItem.tr_part }).subscribe((resp:any)=>{
                        
          if   (updateItem.tr_um == resp.data.pt_um )  {
            
            updateItem.tr_um_conv = 1
          } else { 
            //console.log(resp.data.pt_um)



              this.mesureService.getBy({um_um: updateItem.tr_um, um_alt_um: resp.data.pt_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
              console.log(res)
              const { data } = res;

            if (data) {
              
              updateItem.tr_um_conv = res.data.um_conv 
              this.angularGrid.gridService.highlightRow(1, 1500);
            } else {
              this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: updateItem.tr_um, um_part: updateItem.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
                if (data) {
                  
                  updateItem.tr_um_conv = res.data.um_conv
                  
                } else {
                  updateItem.tr_um_conv = 1
                  updateItem.tr_um = null
          
               
                  
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

        this.inventoryStatusService.getAllDetails({isd_status: item.is_status, isd_tr_type: "ISS-UNP" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
          this.message = "mouvement interdit dans cet emplacement";
          this.hasFormErrors = true;
          return;
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

handleSelectedRowsChanged2(e, args) {
  const controls = this.trForm.controls;
  if (Array.isArray(args.rows) && this.gridObj2) {
    args.rows.map((idx) => {
      const item = this.gridObj2.getDataItem(idx);
     
      this.provider = item
      controls.tr_addr.setValue(item.ad_addr || "");
     


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
  this.addressService
    .getAll()
    .subscribe((response: any) => (this.adresses = response.data));
}
open2(content) {
  this.codeService.getByOne({code_fldname: this.user.usrd_code}).subscribe(
    (reponse: any) => { 
     if (reponse.data == null || reponse.data.code_value != ' ') {
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


onChangeVend() {
  const controls = this.trForm.controls;
  this.addressService.getBy({ ad_name: controls.tr_addr.value }).subscribe((response: any) => {
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

onChangePal() {
  
  /*kamel palette*/
  const controls = this.trForm.controls
  const ref = controls.tr_ref.value
var bol = false
let idpal;
this.dataset =[];
this.trtype = null;
// this.labelService.getBy({lb_cab: controls.tr_ref.value,lb_actif: false}).subscribe((res:any) =>{if (res.data != null) {bol = true}})

  this.inventoryTransactionService.getBy({tr_so_job:ref}).subscribe((trres:any) =>{
    if (trres.data.length != 0) {
    bol = true
    this.dataset =[]
    console.log(trres.data)
    // this.createForm();
    this.message = "le bigbaga a dèjà été retourné";
    this.hasFormErrors = true;
    return;
  }
})
    
  if (!bol) {
    this.inventoryTransactionService.getByIss({ tr_ref: ref,tr_so_job:null  }).subscribe(
      (trresponse: any) => {
        if (trresponse.data.length != 0)
        {this.lddet = trresponse.data[0]
        console.log(this.lddet)
        this.trlot=this.lddet.tr_lot
        this.trtype=this.lddet.tr_type
        if (this.lddet != null ) 
        {
            // this.addressService.getBy({ ad_addr: this.lddet.tr_addr }).subscribe((adresponse: any) => {
            // //   const { data } = response;
            //    console.log("aaaaaaaaaaa",adresponse.data);
            //    if (adresponse.data != null) {
            //      this.provider = adresponse.data;
            //    }
            //  });
     
             this.inventoryStatusService.getAllDetails({isd_status: this.lddet.tr_status, isd_tr_type: this.lddet.tr_type }).subscribe((resstat:any)=>{
          
                const { data } = resstat;
  
                if (data) {
                    this.stat = null
                    this.message = "mouvement interdit dans cet emplacement";
                    this.hasFormErrors = true;
                    return;
                  } 
                else {
                      this.stat = this.lddet.tr_status
                      this.itemsService.getByOne({pt_part: this.lddet.tr_part  }).subscribe(
                      (respopart: any) => {   this.sctService.getByOne({ sct_site: this.lddet.tr_site, sct_part: this.lddet.tr_part, sct_sim: 'STD-CG' }).subscribe(
                                      (respo: any) => {
                                        let qty = controls.tr_qty_loc.value
                                            this.sct = respo.data        
                                            controls.tr_addr.setValue(this.lddet.tr_addr);
                                            controls.tr_nbr.setValue(this.lddet.tr_nbr);
                                            controls.tr_qty_loc.setValue(qty - this.lddet.tr_qty_loc);
                                            if (this.dataset.length == 0)
                                            {
                                              this.gridService.addItem(
                                                { 
                                                  id: this.dataset.length + 1,
                                                  tr_line: this.dataset.length + 1,
                                                  tr_part: this.lddet.tr_part,
                                                  cmvid: "",
                                                  desc: respopart.data.pt_desc1,
                                                  tr_qty_loc: this.lddet.tr_qty_loc * -1,
                                                  qty_oh: this.lddet.tr_loc_begin,
                                                  tr_site:  this.lddet.tr_site,
                                                  tr_loc: this.lddet.tr_loc,
                                                  tr_ref: this.lddet.tr_ref,
                                                  tr_um: respopart.data.pt_um,
                                                  tr_um_conv:1,
                                                  tr_price: this.sct.sct_mtl_tl,
                                                  cmvids: "",
                                                  tr_serial: this.lddet.tr_serial,
                                                  tr_status: this.stat,
                                                  tr_expire: this.lddet.tr_expire,
                                                  tr_lot:this.lddet.tr_lot,
                                                },
                                                { position: "bottom" }
                                              );
                                            }  
                                            else{this.dataset[0].tr_qty_loc = this.dataset[0].tr_qty_loc - this.lddet.tr_qty_loc 
                                              this.dataset[0].qtyoh_ = this.dataset[0].qty_oh + this.lddet.tr_loc_egin 
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
      }
      else {
        this.message = "ce bigbaga n'est pas consommé";
    this.hasFormErrors = true;
    return;
      }
    });
  }
  else {
    this.message = "bigbag déjà retourné";
    this.hasFormErrors = true;
    return;
  }

  



// controls.tr_ref.setValue(null)
document.getElementById("tr_ref").focus();

}

printpdf(nbr) {
// const controls = this.totForm.controls
const controlss = this.trForm.controls;
console.log("pdf");
var doc = new jsPDF();
let date = new Date()
// doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
var img = new Image()
// img.src = "./assets/media/logos/return-cab.png";
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
doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 40);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      
      
doc.setFontSize(8);
//console.log(this.provider.ad_misc2_id)
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
// img.src = "./assets/media/logos/return-cab.png";
img.src = "./assets/media/logos/companyentete.png";
doc.addImage(img, 'png', 5, 5, 275, 30)
      doc.setFontSize(11);
if(this.exist == true){
  doc.text(this.docs[0].code_value, 240, 17); 
doc.text(this.docs[0].code_cmmt, 70, 22);
doc.text(this.docs[0].code_desc, 240, 12);
doc.text(this.docs[0].chr01, 40, 27);
doc.text(this.docs[0].dec01, 240, 32);
doc.text(this.docs[0].date01, 240, 22);
doc.text(this.docs[0].date02, 240, 27);
}

    // if (this.domain.dom_name != null) {
    //   doc.text(this.domain.dom_name, 10, 10);
    // }
    // if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
    // if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
    // if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
    doc.setFontSize(14);
    doc.line(10, 35, 200, 35);

    doc.setFontSize(12);
    doc.text("Bon Sortie N° : " + nbr, 70, 40);
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
    doc.text(String(Number(this.dataset[j].tr_qty_loc.toFixed(2))), 118, i - 1, { align: "right" });
    doc.line(120, i - 5, 120, i);
    doc.text(this.dataset[j].tr_um, 123, i - 1);
    doc.line(130, i - 5, 130, i);
    doc.text(String(Number(this.dataset[j].tr_price).toFixed(2)), 148, i - 1, { align: "right" });
    doc.line(150, i - 5, 150, i);
    doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
    doc.line(170, i - 5, 170, i);
    doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
    doc.line(185, i - 5, 185, i);
    doc.text(String(Number((Number(this.dataset[j].tr_price) * Number((this.dataset[j].tr_qty_loc).toFixed(2))))), 203, i - 1, { align: "right" });
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
    doc.text(String(Number(this.dataset[j].tr_qty_loc)), 118, i - 1, { align: "right" });
    doc.line(120, i - 5, 120, i);
    doc.text(this.dataset[j].tr_um, 123, i - 1);
    doc.line(130, i - 5, 130, i);
    doc.text(String(Number(this.dataset[j].tr_price)), 148, i - 1, { align: "right" });
    doc.line(150, i - 5, 150, i);
    doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
    doc.line(170, i - 5, 170, i);
    doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
    doc.line(185, i - 5, 185, i);
    doc.text(String(Number(Number((this.dataset[j].tr_price)) * Number((this.dataset[j].tr_qty_loc)))), 203, i - 1, { align: "right" });
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
doc.text("Validé par: " , 20, i + 22);
    doc.text("Note: " , 20, i + 32);
//  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
//  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
//  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

doc.text(String(Number(total).toFixed(2)), 198, i + 12, { align: "right" });
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
doc.save('RETOUR-' + nbr + '.pdf')
var blob = doc.output("blob");
window.open(URL.createObjectURL(blob));
}
handleSelectedRowsChangedprinter(e, args) {
  const controls = this.trForm.controls;

  if (Array.isArray(args.rows) && this.gridObjprinter) {
    args.rows.map((idx) => {
      const item = this.gridObjprinter.getDataItem(idx);
      console.log(item);
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
addRCTUNP(detail: any, it, nlot) {
   
  this.loadingSubject.next(true);
  const controls = this.trForm.controls;

  this.inventoryTransactionService.addRCTUNPCab({ detail, it, nlot }).subscribe(
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

      
    }
  );
}
addISSUNP( detail: any, it, nlot) {
  
  this.loadingSubject.next(true);
  const controls = this.trForm.controls;

  this.inventoryTransactionService
    .addIssUnp({detail, it,nlot})
    .subscribe(
     (reponse: any) => {
      console.log(reponse)
   
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
        
        // this.goBack()
    //    console.log(this.provider, po, this.dataset);
    //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
   

      // this.router.navigateByUrl("/");
      
      }
    );
}
addRCTWO(detail: any, it) {
  
  this.loadingSubject.next(true);

  this.inventoryTransactionService.addRCTWO({ detail, it }).subscribe(
    (reponse: any) => console.log(reponse),
    (error) => {
      alert("Erreur, vérifier les informations avec l'administrateur système");
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
addRJCTWO(detail: any, it) {
  
  this.loadingSubject.next(true);

  this.inventoryTransactionService.addRJCTWO({ detail, it }).subscribe(
    (reponse: any) => console.log(reponse),
    (error) => {
      alert("Erreur, vérifier les informations avec l'administrateur système");
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
addISSWO( detail: any, it) {
  
  this.loadingSubject.next(true);
  const controls = this.trForm.controls;

  this.inventoryTransactionService
    .addIssWo({detail, it})
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
    //    console.log(this.provider, po, this.dataset);
    //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
   
      // this.router.navigateByUrl("/");
      }
    );
}
handleSelectedRowsChanged6(e, args) {
  const controls = this.trForm.controls
  if (Array.isArray(args.rows) && this.gridObj6) {
      args.rows.map((idx) => {
          const cause = this.gridObj6.getDataItem(idx)
          console.log(cause)
          controls.tr_rmks.setValue(cause.rsn_ref || "")

      })
  }
}
angularGridReady6(angularGrid: AngularGridInstance) {
  this.angularGrid6 = angularGrid
  this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {}
}
prepareGrid6() {
  const controls = this.trForm.controls
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
        id: "rsn_ref",
        name: "Code",
        field: "rsn_ref",
        sortable: true,
        filterable: true,
        type: FieldType.string,
    },
    
      {
          id: "rsn_desc",
          name: "Designation",
          field: "rsn_desc",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
      },
  ]

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
  }

  // fill the dataset with your data
  
  this.reasonService
      .getBy ({rsn_type: 'RETURN' })
      .subscribe((response: any) => (this.causes = response.data))
   
}
open6(content) {
  this.prepareGrid6()
  this.modalService.open(content, { size: "lg" })
}

}
  





  