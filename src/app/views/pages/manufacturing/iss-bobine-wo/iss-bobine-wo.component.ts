import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { jsPDF } from "jspdf";
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
  WorkOrderService,
  WorkOrderDetailService,
  BomService, BomPartService, WorkOrder, ProviderService, WorkRoutingService, RequisitionService, printBc, LabelService, SaleOrderService,Label, EmployeService, PrintersService
 
} from "../../../../core/erp";
import {
   Ps, PsService,

} from "../../../../core/erp";
import { Console } from 'console';
declare var Edelweiss: any;

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
  selector: 'kt-iss-bobine-wo', 
  templateUrl: './iss-bobine-wo.component.html',
  styleUrls: ['./iss-bobine-wo.component.scss']
})
export class IssBobineWoComponent implements OnInit {
  currentPrinter: string;
  PathPrinter: string;
  inventoryTransaction: InventoryTransaction;
  workOrder: WorkOrder;
  trForm: FormGroup;
  woForm: FormGroup;
  hasFormErrors = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  error = false;
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  pourcentage_squelette:any;
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
  gamme: any;
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
  adresses: [];
  columnDefinitions2: Column[] = [];
  gridOptions2: GridOption = {};
  gridObj2: any;
  angularGrid2: AngularGridInstance;

  

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
  globalState: boolean = false;
  product_colors: any[] = [];
  product_types: any[] = [];
  product_qualitys: any[] = [];
  product_Cyls: any[] = [];
  color:any;
  type:any;
  quality:any;
  cyl:any;
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

  provider: any;
  
  prhServer;
  
  detail;
  
  serial;
  qty;
  status;
  docs: any[] = [];
  exist:any;
  constructor(
    config: NgbDropdownConfig,
    private trFB: FormBuilder,
    private woFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private inventoryTransactionService: InventoryTransactionService,
    private sctService: CostSimulationService,  
    private itemsService: ItemService,
    
    private siteService: SiteService,
    private sequenceService: SequenceService,
    private workOrderService: WorkOrderService,
    private workOrderDetailService: WorkOrderDetailService,
    private providersService: ProviderService,
    private workRoutingService: WorkRoutingService,  private bomPartService: BomPartService, private locationService: LocationService, private inventoryStatusService: InventoryStatusService, private mesureService: MesureService, private codeService: CodeService, private requisitionService: RequisitionService, private locationDetailService: LocationDetailService, private labelService: LabelService, private saleOrderService: SaleOrderService,private employeService: EmployeService, private addressService: AddressService,private printerService: PrintersService, private bomService: BomService,  
    private psService: PsService, 
    
  ) {
    config.autoClose = true;
    this.workRoutingService.getBy({ ro_rollup: true }).subscribe((response: any) => {
      console.log(response.date);
      this.ro_rollup = response.data;
    });
    this.codeService.getBy({ code_fldname: "emp_shift" }).subscribe((response: any) => (this.emp_shift = response.data));
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
            const controls = this.woForm.controls
            const paiqty = controls.PAI_ISS.value
            const prfqty = controls.PRF_ISS.value
            const sqlqty = controls.SQL_ISS.value
            const orgqty = controls.ORG_ISS.value
            let idpal;
            let total = paiqty + prfqty + sqlqty + orgqty
            this.labelService.getBy({lb_cab: args.dataContext.tr_ref}).subscribe((res:any) =>{if (res.data != null) {idpal = res.data.id}})
            this.labelService.update({lb_actif : true},{id: idpal}).subscribe((res:any) =>{})
            this.itemsService.getByOne({pt_part: args.dataContext.tr_part  }).subscribe(
              (respopart: any) => {
                console.log(respopart.data)
                         total = total -  Number(this.lddet.ld_qty_oh)              
                if(respopart.data.pt_draw == 'ORIGINAL'){let Orgqty = Number(Number(orgqty) - Number(this.lddet.ld_qty_oh));controls.ORG_ISS.setValue(Number(Orgqty))}
                else{if(respopart.data.pt_draw == 'SQUELETTE'){let Sqlqty = Number(Number(sqlqty) - Number(this.lddet.ld_qty_oh));controls.SQL_ISS.setValue(Number(Sqlqty))}
                else{if(respopart.data.pt_draw == 'PREFORME'){let Prfqty = Number(Number(prfqty) - Number(this.lddet.ld_qty_oh));controls.PRF_ISS.setValue(Number(Prfqty))}
                else{if(respopart.data.pt_draw == 'PAYETTE'){let Paiqty = Number(Number(paiqty) - Number(this.lddet.ld_qty_oh));controls.PAI_ISS.setValue(Number(Paiqty))}}}}
              controls.total_iss.setValue(total)
             
            }); 
            this.angularGrid.gridService.deleteItem(args.dataContext);
          }
        },
      },

      // {
      //   id: "add",
      //   field: "add",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.icon, params: { formatterIcon: 'fa fa-plus' },
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     //if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
      //     //  this.angularGrid.gridService.deleteItem(args.dataContext);
      //    // }
      //    this.addsameItem(args.dataContext.id)
        
      //   },
      // },

      {
        id: "tr_line",
        name: "Ligne",
        field: "tr_line",
        minWidth: 50,
        maxWidth: 50,
        selectable: true,
      },
      // {
      //   id: "wodid",
      //   name: "Wod Ligne",
      //   field: "wodid",
      //   minWidth: 50,
      //   maxWidth: 50,
      //   selectable: true,
      // },
          
      // {
      //   id: "tr_part",
      //   name: "Article",
      //   field: "tr_part",
      //   sortable: true,
      //   width: 50,
      //   filterable: false,
      //   editor: {
      //     model: Editors.text,
      //     required: true,
      //     validator: statusValidator,

      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {
      //     console.log(args.dataContext.tr_part)
      //     this.itemsService.getByOne({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{

      //       if (resp.data) {
      //         console.log(resp.data)

             
      //           this.sctService.getByOne({ sct_site: resp.data.pt_site, sct_part: resp.data.pt_part, sct_sim: 'STD-CG' }).subscribe(
      //             (response: any) => {
      //               this.sct = response.data
           
      //               this.locationDetailService.getByOne({ ld_site: resp.data.pt_site, ld_loc: resp.data.pt_loc, ld_part: resp.data.pt_part, ld_lot: null }).subscribe(
      //                 (response: any) => {
      //                   this.lddet = response.data
      //                   console.log(this.lddet.ld_qty_oh)
      //                   if (this.lddet != null) {
      //                   this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
      //                  //   console.log(resstat)
      //                     const { data } = resstat;
  
      //                     if (data) {
      //                       this.stat = null
      //                     } else {
      //                       this.stat = this.lddet.ld_status
      //                     }
      //               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:resp.data.pt_site, tr_loc:resp.data.pt_loc,
      //                 tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: this.stat, tr_price: this.sct.sct_mtl_tl, qty_oh: this.lddet.ld_qty_oh, tr_expire: this.lddet.ld_expire})
      //                   });
      //                 }
      //                 else {
      //                   this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , tr_site:resp.data.pt_site, tr_loc:resp.data.pt_loc,
      //                     tr_um:resp.data.pt_um, tr_um_conv: 1,  tr_status: null, tr_price: this.sct.sct_mtl_tl, qty_oh: 0, tr_expire: null})
                      

      //                 }     
     
      //                 });     
      //           });  
            
      //     }



    


      //     else {

        
      //       this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
      //     }
          
      //     });

           
         
         
      //   }
      // },
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
        id: "tr_site",
        name: "Site",
        field: "tr_site",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {

          this.siteService.getByOne({ si_site: args.dataContext.tr_site,}).subscribe(
            (response: any) => {
              
          console.log(response.data)

                if (response.data) {
                  
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_site: response.data.si_site})
                }
                else {
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_site: null});
    
                 
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
        id: "tr_loc",
        name: "Emplacement",
        field: "tr_loc",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },


        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_site)
          console.log(args.dataView.tr_site)
            
            this.locationService.getByOne({ loc_loc: args.dataContext.tr_loc, loc_site: args.dataContext.tr_site }).subscribe(
              (response: any) => {
                this.location = response.data
                if (response.data) {

                    this.locationDetailService.getByOne({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot:  args.dataContext.tr_serial }).subscribe(
                      (response: any) => {
                        this.lddet = response.data
                      //  console.log(this.lddet[0].ld_qty_oh)
               if (this.lddet){
                        this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
                    //      console.log(resstat)
                          const { data } = resstat;
  
                          if (data) {
                            this.stat = null
                          } else {
                            this.stat = this.lddet.ld_status
                          }
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   tr_status: this.stat, qty_oh: this.lddet.ld_qty_oh, tr_expire: this.lddet.ld_expire})
                        });     
                      }
                      else {
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   tr_status: null, qty_oh: 0, tr_expire: null})
                     
                      }
                      });     
                    }
                    else {
                   
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_loc: null, qty_oh: 0, tr_status: null })
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
        id: "tr_serial",
        name: "Lot/Serie",
        field: "tr_serial",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.text,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {

            this.locationDetailService.getByOne({ ld_site: args.dataContext.tr_site, ld_loc: args.dataContext.tr_loc, ld_part: args.dataContext.tr_part, ld_lot: args.dataContext.tr_serial }).subscribe(
              (response: any) => {
                this.lddet = response.data
                
       // console.log(response.data.length)
                  if (this.lddet != null) {
                    
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,   qty_oh: this.lddet.ld_qty_oh, tr_status: this.lddet.ld_status, tr_expire: this.lddet.tr_expire})
                  }
                  else {
                        this.gridService.updateItemById(args.dataContext.id,{...args.dataContext  , tr_serial: null, qty_0h: 0, tr_expire: null});
      
                        this.message = "le N° de lot que vous avez saisi n'existe pas";
                        this.hasFormErrors = true;
                        return;
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
        id: "tr_ref",
        name: "N° PALETTE",
        field: "tr_ref",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
       
        
       
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
              console.log(args.dataContext.tr_qty_loc)
              console.log(args.dataContext.tr_um_conv)
              
              if (args.dataContext.tr_qty_loc * args.dataContext.tr_um_conv   > args.dataContext.qty_oh) {
                  console.log('here')
               
               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
            //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
           
             
          }
      
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
          editor: {
              model: Editors.text,
              required: true,
              validator: statusValidator,

          },
          onCellChange: (e: Event, args: OnEventArgs) => {
            console.log(args.dataContext.tr_um)
            this.itemsService.getBy({pt_part: args.dataContext.tr_part }).subscribe((resp:any)=>{
              
            if   (args.dataContext.tr_um == resp.data.pt_um )  {
              
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: 1 })
            } else { 
              //console.log(resp.data.pt_um)



                this.mesureService.getBy({um_um: args.dataContext.tr_um, um_alt_um: resp.data.pt_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                console.log(res)
                const { data } = res;
      
              if (data) {
                
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: res.data.um_conv })
                this.angularGrid.gridService.highlightRow(1, 1500);

                if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                  console.log('here')
                  
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                  
              
                } else {
              
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })

                }




              } else {
                this.mesureService.getBy({um_um: resp.data.pt_um, um_alt_um: args.dataContext.tr_um, um_part: args.dataContext.tr_part  }).subscribe((res:any)=>{
                  console.log(res)
                  const { data } = res;
                  if (data) {
                    if (args.dataContext.tr_qty_loc * Number(res.data.um_conv) >  args.dataContext.qty_oh) {
                      console.log('here')
                 
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
                      
                  
                    } else {
                  
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um: null })
    
                    }
          
                  } else {
                    this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_um_conv: "1" , tr_um: null});
              
                    
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
        id: "tr_status",
        name: "Status",
        field: "tr_status",
        sortable: true,
        width: 80,
        filterable: false,
       /* editor: {
          model: Editors.text,
          required: true,
          validator: statusValidator,

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          console.log(args.dataContext.tr_status)
          
          this.inventoryStatusService.getAllDetails({isd_status: args.dataContext.tr_status, isd_tr_type: "ISS-UNP" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
        
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_status: null })
          
        }
          })

  
          //if (args.dataContext.tr_qty_loc > args.dataContext.qty_oh) {
          //    console.log('here')
    
          // this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_qty_loc: null })
        //  this.alertWarning = `Updated Title: ${args.dataView.tr_qty_loc}`;
       
         
      },
      */




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
            "openStatussGrid"
            ) as HTMLElement;
            element.click();
        },
      },
      {
        id: "tr_expire",
        name: "Expire",
        field: "tr_expire",
        sortable: true,
        width: 80,
        filterable: false,
        formatter: Formatters.dateIso,
        
        type: FieldType.dateIso,
        
      },
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      autoHeight:true,
      enableAutoResize:true,
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
    this.currentPrinter = this.user.usrd_dft_printer;
    this.printerService.getByPrinter({ printer_code: this.currentPrinter }).subscribe(
      (reponse: any) => ((this.PathPrinter = reponse.data.printer_path), console.log(this.PathPrinter)),
      (error) => {
        this.message = "veuillez verifier votre connexion";
        this.hasFormErrors = true;
        return;
      }
    );
    this.getProductColors();
    this.getProductTypes();
    this.getProductquality();
    this.getProductcyl();
    
    this.domain = JSON.parse(localStorage.getItem("domain"));
    console.log(this.domain);
    this.codeService
    .getBy({ code_fldname: "manufacturing/iss-bobine-wo" })
    .subscribe((response: any) => {
      const { data } = response;
     this.docs = data; 
     if(response.data.length != 0){this.exist = true} 
    });
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

    this.createForm();
   
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.workOrder = new WorkOrder();
    this.inventoryTransaction = new InventoryTransaction();
    const date = new Date;
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
      wo_part: [{ value: this.workOrder.wo_part, disabled: true }, Validators.required],
      desc: [{ value: null, disabled: true }],

      wo_routing: [this.workOrder.wo_routing, Validators.required],
      wo_bom_code: [this.workOrder.wo_bom_code, Validators.required],
      wo_qty_ord: [{ value: 0 },this.workOrder.wo_qty_ord],
      total_bobine:  [{disabled: true}],
      wo_qty_rjct:  [{ value: 0 },this.workOrder.wo_qty_rjct],
      ORG_PREV:  [0,{disabled: true}],
      SQL_PREV:  [0,{disabled: true}],
      PRF_PREV:  [0,{disabled: true}],
      PAI_PREV:  [0,{disabled: true}],
      ORG_ISS:  [0,{disabled: true}],
      SQL_ISS:  [0,{disabled: true}],
      PRF_ISS:  [0,{ value: 0 },{disabled: true}],
      PAI_ISS:  [0,{disabled: true}],
      total_prev:  [0,{disabled: true}],
      total_iss:  [0,{disabled: true}],
      wo_qty_comp: [{ value: 0 },this.workOrder.wo_qty_comp],
      
      emp_shift: [this.shift],
      wo_serial: [this.workOrder.wo_serial],
      printer: [{ value: this.user.usrd_dft_printer, disabled: true }],
      product_type: ["", Validators.required],
      product_color: ["", Validators.required],
      product_quality: ["", Validators.required],
      product_Cyl: ["", Validators.required],
      tr_so_job: [this.inventoryTransaction.tr_so_job],
      tr_rmks: [this.inventoryTransaction.tr_rmks],
      ref: [null],
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
    this.trForm = this.trFB.group({
      tr_so_job: [this.inventoryTransaction.tr_so_job],
      tr_rmks: [this.inventoryTransaction.tr_rmks],
      ref: [null],
      });
  }
  onChangeBomCode() {
    const controls = this.woForm.controls
    console.log(controls.wo_bom_code.value,)
    this.bomService
        .getBy({
              bom_parent: controls.wo_bom_code.value,
        })
        .subscribe((response: any) => {
            console.log(response.data)
            if (!response.data) {
              alert("Code n'existe pas")
              controls.ps_parent.setValue("")
              document.getElementById("code").focus();
            } else {
              // controls.desc.setValue(response.data.bom_desc);
            let formule:any;
            this.psService.getBy({ps_parent:controls.wo_bom_code.value}).subscribe((ps: any) => {
              
              formule = ps.data
              console.log(formule)
              let total = 0
              for (var object = 0; object < formule.length; object++) {
                let calc = 0
                
                calc = Number(formule[object].ps_qty_per) * Number(controls.wo_qty_ord.value) * Number(Number(1) + Number(formule[object].ps_scrp_pct)) / Number(response.data.bom_batch)
                console.log(calc)
                if (formule[object].ps_ref == 'SQUELETTE'){ controls.SQL_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PREFORME'){ controls.PRF_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PAYETTE'){ controls.PAI_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'ORIGINAL'){ controls.ORG_PREV.setValue(calc )}
              }
              total = Number(controls.SQL_PREV.value) + Number(controls.PRF_PREV.value) + Number(controls.PAI_PREV.value) + Number(controls.ORG_PREV.value)
                
              controls.total_prev.setValue(total)
              })
              
              
              
            }
     })
  }
  onChangeqty() {
    const controls = this.woForm.controls
    
    this.bomService
        .getBy({
              bom_parent: controls.wo_bom_code.value,
        })
        .subscribe((response: any) => {
            console.log(response.data)
            if (!response.data) {
              alert("Code n'existe pas")
              controls.ps_parent.setValue("")
              document.getElementById("code").focus();
            } else {
              // controls.desc.setValue(response.data.bom_desc);
            let formule:any;
            this.psService.getBy({ps_parent:controls.wo_bom_code.value}).subscribe((ps: any) => {
              
              formule = ps.data
              console.log(formule)
              let total = 0
              for (var object = 0; object < formule.length; object++) {
                let calc = 0
                
                calc = Number(formule[object].ps_qty_per) * Number(controls.wo_qty_ord.value) * Number(Number(1) + Number(formule[object].ps_scrp_pct))  / Number(response.data.bom_batch)
                if (formule[object].ps_ref == 'SQUELETTE'){ controls.SQL_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PREFORME'){ controls.PRF_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PAYETTE'){ controls.PAI_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'ORIGINAL'){ controls.ORG_PREV.setValue(calc )}
              }
              total = Number(controls.SQL_PREV.value) + Number(controls.PRF_PREV.value) + Number(controls.PAI_PREV.value) + Number(controls.ORG_PREV.value)
                
              controls.total_prev.setValue(total)
              })
              
              
              
            }
     })
  }
  onChangeOA() {
    // this.dataset = [];
  
    const controls = this.woForm.controls;
    const id = controls.wo_lot.value;
    // const paiqty = controls.PAI_ISS.value
    // const prfqty = controls.PRF_ISS.value
    // const sqlqty = controls.SQL_ISS.value
    // const orgqty = controls.ORG_ISS.value
    
    this.workOrderService.getByOne({ id }).subscribe((res: any) => {
      if (res.data.wo_status == "R" && res.data.wo_routing == controls.wo_routing.value) {
        this.woServer = res.data;
        
        controls.wo_lot.setValue(this.woServer.id);
        controls.wo_nbr.setValue(this.woServer.wo_nbr);
        controls.wo_part.setValue(this.woServer.wo_part);
        controls.wo_qty_ord.setValue(this.woServer.wo_qty_ord);
        controls.total_bobine.setValue(this.woServer.wo_qty_comp);
        controls.wo_qty_rjct.setValue(this.woServer.wo_qty_rjct);
        controls.desc.setValue(this.woServer.item.pt_desc1);
        controls.product_type.setValue(this.woServer.item.pt_article);
        controls.product_color.setValue(this.woServer.item.pt_break_cat);
        controls.product_quality.setValue(this.woServer.item.pt_rev);
        controls.product_Cyl.setValue(this.woServer.item.pt_group)
        controls.wo_bom_code.setValue(this.woServer.wo_bom_code);
        

        this.bomService
        .getBy({
              bom_parent: controls.wo_bom_code.value,
        })
        .subscribe((response: any) => {
            console.log(response.data)
            if (!response.data) {
              alert("Code n'existe pas")
              controls.ps_parent.setValue("")
              document.getElementById("code").focus();
            } else {
              // controls.desc.setValue(response.data.bom_desc);
            let formule:any;
            this.psService.getBy({ps_parent:controls.wo_bom_code.value}).subscribe((ps: any) => {
              
              formule = ps.data
              console.log(formule)
              let total = 0
              for (var object = 0; object < formule.length; object++) {
                let calc = 0
                
                calc = Number(formule[object].ps_qty_per) * Number(controls.wo_qty_ord.value) * Number(Number(1) + Number(formule[object].ps_scrp_pct)) / Number(response.data.bom_batch)
                if (formule[object].ps_ref == 'SQUELETTE'){ controls.SQL_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PREFORME'){ controls.PRF_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PAYETTE'){ controls.PAI_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'ORIGINAL'){ controls.ORG_PREV.setValue(calc )}
              }
              total = Number(controls.SQL_PREV.value) + Number(controls.PRF_PREV.value) + Number(controls.PAI_PREV.value) + Number(controls.ORG_PREV.value)
             
              controls.total_prev.setValue(total)
              })
              
              
              
            }
     })


        controls.product_Cyl.setValue(this.woServer.item.pt_group)
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
        let total = 0
        let Orgqty = 0
        let Sqlqty = 0
        let Prfqty = 0
        let Paiqty = 0
        controls.ORG_ISS.setValue(0)
        controls.SQL_ISS.setValue(0)
        controls.PAI_ISS.setValue(0)
        controls.PRF_ISS.setValue(0)
        controls.total_iss.setValue(0)
        this.inventoryTransactionService.getByRef({tr_type:'ISS-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
          (res: any) => {        
          
          for (let item of res.data){
            this.itemsService.getByOne({pt_part: item.tr_part  }).subscribe(
              (respopart: any) => {
                total = total + Number(item.tr_qty_loc)
                console.log(total, respopart.data.pt_draw, this.domain)
            if(respopart.data.pt_draw == 'ORIGINAL'){ Orgqty = Number(Number(Orgqty) + Number(item.tr_qty_loc));controls.ORG_ISS.setValue(Number(Orgqty))}
            else{if(respopart.data.pt_draw == 'SQUELETTE'){ Sqlqty = Number(Number(Sqlqty) + Number(item.tr_qty_loc));controls.SQL_ISS.setValue(Number(Sqlqty))}
                 else{if(respopart.data.pt_draw == 'PREFORME'){ Prfqty = Number(Number(Prfqty) + Number(item.tr_qty_loc));controls.PRF_ISS.setValue(Number(Prfqty))}
                      else{if(respopart.data.pt_draw == 'PAYETTE'){ Paiqty = Number(Number(Paiqty) + Number(item.tr_qty_loc));controls.PAI_ISS.setValue(Number(Paiqty))}}}}
              })
        
          
        }},)
       
      } else {
       
        controls.wo_lot.setValue(null);
        document.getElementById("id").focus();
        this.message = "l'OF n'existe pas ou n'est pas lancé";
  this.hasFormErrors = true;
  return;
      }
    });
 
  }

  //reste form
  reset() {
    this.workOrder = new WorkOrder();
    this.inventoryTransaction = new InventoryTransaction();
    this.createForm();
    this.dataset = [];
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
        code_fldname: "pt_article", code_desc: 'DIMENSION'
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
    this.color = controls.product_color.value;
    this.type = controls.product_type.value;
    this.quality = controls.product_quality.value;
    this.cyl = controls.product_Cyl.value;
    if(controls.wo_user1.value == null || controls.wo_user1.value == ''){
      this.message = "veuillez sélectionner les employés";
    this.hasFormErrors = true;
    return;}
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
            this.message = "aucune bobine avec cette configuration,veuillez verifier votre configuration";
  this.hasFormErrors = true;
  return;
          } else {
            console.log(data[0])
            controls.wo_part.setValue(data[0].pt_part);
            controls.desc.setValue(response.data[0].pt_desc1);
            controls.wo_bom_code.setValue(data[0].pt_bom_code)
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
                  
                  this.rctwostat = resp.data.loc_status;
                });
            }
          }
        }
      });
  }
  // save data
  onSubmit() {
    this.hasFormErrors = false;
    const controls = this.woForm.controls;
    /** check form */
    if (this.woForm.invalid) {
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
      
     if (this.dataset[i].tr_part == "" || this.dataset[i].tr_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_site == "" || this.dataset[i].tr_site == null  ) {
      this.message = "Le Site ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_loc == "" || this.dataset[i].tr_loc == null  ) {
      this.message = "L' Emplacement ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_um == "" || this.dataset[i].tr_um == null  ) {
      this.message = "L' UM ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_status == "" || this.dataset[i].tr_status == null  ) {
      this.message = "Le Status ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
     if (this.dataset[i].tr_qty_loc == 0 ) {
      this.message = "La Quantite ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }

    }
    this.printpdf(this.trlot)
    

        let tr = this.prepare()
        this.addIt( this.dataset,tr);

      console.log(this.trlot)
   
    // tslint:disable-next-line:prefer-const
    
  }
  preparewo() {
    const controls = this.woForm.controls;
    console.log("alllllllllllllllo");
    const _wo = new WorkOrder();

    _wo.wo_site = controls.wo_site.value;
    _wo.wo_user1 = this.user1;
    _wo.wo_user2 = this.user2;
    _wo.wo_part = controls.wo_part.value;
    _wo.wo_routing = controls.wo_routing.value;
    _wo.wo_bom_code = controls.wo_bom_code.value;
    _wo.wo_qty_ord = controls.wo_qty_ord.value;
    _wo.wo_ord_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_rel_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo_due_date = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    _wo.wo__chr01 = controls.emp_shift.value;
    return _wo;
  }
  prepareWOD() {
    const controls = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = this.nof;
    _tr.tr_lot = this.wolot;
    _tr.tr_addr = controls.wo_routing.value;
    _tr.tr_user1 = this.user1;
    _tr.tr_user2 = this.user2;
    _tr.tr_effdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null;
    //_tr.tr_site = controls.wo_site.value
    // _tr.tr_so_job = controls.tr_so_job.value

    // _tr.tr_rmks = controls.tr_rmks.value
    return _tr;
  }
  prepare(){
    // const controls = this.woForm.controls; 
    const wocontrols = this.woForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_nbr = wocontrols.wo_nbr.value
    _tr.tr_lot = wocontrols.wo_lot.value
    _tr.tr_user1 = this.user1;
    _tr.tr_user2 = this.user2;
    _tr.tr_addr = wocontrols.wo_routing.value;
    _tr.tr_effdate = wocontrols.wo_ord_date.value
    ? `${wocontrols.wo_ord_date.value.year}/${wocontrols.wo_ord_date.value.month}/${wocontrols.wo_ord_date.value.day}`
    : null
    _tr.tr_so_job = wocontrols.tr_so_job.value
    
    _tr.tr_rmks = wocontrols.tr_rmks.value
  
    return _tr
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

      }
    );
  }

  addWo() {
    const controls = this.woForm.controls;
    this.hasFormErrors = false;
    /** check form */
    if (controls.wo_user1.value == null || controls.wo_user1.value == '') {this.message = "veuillez remplir la liste des employés";
      this.hasFormErrors = true;

      return;
      }
      else {if (controls.product_color.value == null || controls.product_color.value == '') {this.message = "veuillez choisir la couleur souhaité";
      this.hasFormErrors = true;

      return;
      }
            else {if (controls.product_type.value == null || controls.product_type.value == '') {this.message = "veuillez choisir le type de produit souhaité";
            this.hasFormErrors = true;

            return;
            }
            else {if (this.color != controls.product_color.value || this.type != controls.product_type.value || this.cyl != controls.product_Cyl.value || this.quality != controls.product_quality.value){
              this.hasFormErrors = true;
              this.message = "veuillez relancer la recherche du produit";
           
              this.globalState = false;
              return;
            }}
                 }
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
        let wo = this.preparewo();
        this.workOrderService.addDirect({ it: wo, nof: this.nof }).subscribe(
          (reponse: any) => (this.wolot = reponse.data),
          (error) => {
            this.message = "Erreur création OF, verifier votre connexion";
            this.hasFormErrors = true;
            return;
           
            this.loadingSubject.next(false);
          },
          () => {
            this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 1000, false, false);
            // controls.ref.enable();
            controls.wo_nbr.setValue(this.nof),
            document.getElementById("ref").focus();
            this.loadingSubject.next(false);

           
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
   *
   * Returns object for saving
   */
  /**
   * Add po
   *
   * @param _it: it
   */
  addIt( detail: any, it) {
   
    for (let data of detail) {
      delete data.id;
      delete data.cmvid;
      
     
    }
    
    this.loadingSubject.next(true);
    const controls = this.woForm.controls;

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
      
     
        this.router.navigateByUrl("/");
        }
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
    const controls = this.woForm.controls;
    this.gridService.addItem(
      {
        tr_nbr:controls.wo_nbr.value,
                        tr_lot:controls.wo_lot.value,
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
        tr_ref:null,
        tr_serial: null,
        tr_status: null,
        tr_expire: null,
        tr_program:new Date().toLocaleTimeString(),
        old:false,
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
  
    this.itemsService.getProd({}).subscribe((response: any) => (this.items = response.data));
  }
  open4(content) {
    this.prepareGrid4();
    this.modalService.open(content, { size: "lg" });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
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

                this.locationDetailService.getByOne({ ld_site: updateItem.tr_site, ld_loc: item.tr_loc, ld_part: updateItem.tr_part, ld_lot: updateItem.tr_serial,ld_ref:null }).subscribe(
                  (response: any) => {
                    this.lddet = response.data
                  //  console.log(this.lddet[0].ld_qty_oh)
           if (this.lddet){
             
                      this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
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
                    this.gridService.updateItem(updateItem);
                    
                      });     
   
           }
           else {
            updateItem.tr_loc = item.loc_loc
            updateItem.tr_status = null
            updateItem.qty_oh = 0
            updateItem.tr_expire = null
            this.gridService.updateItem(updateItem);
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
  
              

          this.inventoryStatusService.getAllDetails({isd_status: item.ld_status, isd_tr_type: "ISS-WO" }).subscribe((res:any)=>{
            console.log(res)
            const { data } = res;
  
          if (data) {
            
            updateItem.tr_serial = null;
            updateItem.tr_expire = null;
            updateItem.qty_oh = 0;

          }else {
            updateItem.tr_serial = item.ld_lot;
            updateItem.tr_status = item.ld_status;
            updateItem.tr_expire = item.ld_expire;
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

        this.inventoryStatusService.getAllDetails({isd_status: item.is_status, isd_tr_type: "ISS-WO" }).subscribe((res:any)=>{
          console.log(res)
          const { data } = res;

        if (data) {
      
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
  const controls = this.woForm.controls;
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
  this.prepareGrid2();
  this.modalService.open(content, { size: "lg" });
}



addsameItem(i ) {
  console.log(i)
  
  this.gridService.addItem(
    {
      id: this.dataset.length + 1,
      tr_line: this.dataset.length + 1,
      tr_part: this.dataset[i - 1].tr_part,
      cmvid: "",
      desc: this.dataset[i - 1].desc,
      qty_oh: 0,
      tr_um_conv: 1,      
      tr_um: this.dataset[i - 1].tr_um,
      tr_price: this.dataset[i - 1].tr_price,
      tr_site: this.dataset[i - 1].tr_site,
      tr_loc: this.dataset[i - 1].tr_loc,
      tr_serial: null,
      tr_status: null,
      
      tr_expire: null,
      old:false,
    },
    { position: "bottom" }
  );
}

onChangePal() {
  /*kamel palette*/
  const controls = this.woForm.controls
  const ref = controls.ref.value
  const paiqty = controls.PAI_ISS.value
  const prfqty = controls.PRF_ISS.value
  const sqlqty = controls.SQL_ISS.value
  const orgqty = controls.ORG_ISS.value
  let total = controls.total_iss.value
var bol = false
let idpal;
if(controls.wo_user1.value == null || controls.wo_user1.value == ''){
  this.message = "veuillez sélectionner les employés";
this.hasFormErrors = true;
return;}
 this.workOrderService.getBy({wo_nbr: controls.wo_nbr.value,wo_status:'R'}).subscribe((res:any) =>{
  if (res.data.length == 0) {
    console.log(res.data,'CLOTURE OF')
    controls.ref.setValue(null)
    this.message = 'la production pour cette OF est Atteinte, vous ne pouvez pas consommer plus'
    this.hasFormErrors = true;
    return;
  }
  else {console.log('calcul réalisation')
    console.log(res.data[0].wo_qty_comp)
        controls.total_bobine.setValue(Number(res.data[0].wo_qty_comp))
        controls.wo_qty_rjct.setValue(Number(res.data[0].wo_qty_rjct))
        this.pourcentage_squelette = Number(controls.wo_qty_rjct.value) * 100 / (Number(controls.wo_qty_rjct.value) + Number(controls.total_bobine.value))
  }
})
this.labelService.getBy({lb_cab: ref,lb_actif: false}).subscribe((res:any) =>{if (res.data != null) {bol = true}})
  
  for(let ob of this.dataset) {

    if(ob.tr_ref == ref) {
      console.log(ob.tr_ref)
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
   
    
   this.labelService.getBy({lb_cab: ref,lb__log01: true}).subscribe((res:any) =>{
    
        this.inventoryStatusService.getAllDetails({isd_status: this.lddet.ld_status, isd_tr_type: "ISS-WO" }).subscribe((resstat:any)=>{
          console.log(resstat)
          const { data } = resstat;

          if (data) {
            this.stat = null
          } 
          else 
          {
            this.stat = this.lddet.ld_status
            this.itemsService.getByOne({pt_part: this.lddet.ld_part  }).subscribe(
            (respopart: any) => {
              if((respopart.data.pt_draw == 'COLORANT' && respopart.data.pt_break_cat == controls.product_color.value) || (respopart.data.pt_draw == 'SILICONE' && controls.product_Cyl.value != 'SANS CYlICONE') || (respopart.data.pt_draw == 'ANTI-YELLOW' && controls.product_color.value == 'TRANSAPARENT'))
              { this.gridService.addItem(
                      {
                        id: this.dataset.length + 1,
                        tr_nbr:controls.wo_nbr.value,
                        tr_lot:controls.wo_lot.value,
                        tr_line: this.dataset.length + 1,
                        tr_part: this.lddet.ld_part,
                        cmvid: "",
                        desc: this.lddet.item.pt_desc1,
                        qty_oh: this.lddet.ld_qty_oh,
                        tr_qty_loc: this.lddet.ld_qty_oh,
                        tr_site: this.lddet.ld_site,
                        tr_loc: this.lddet.ld_loc,
                        tr_um: respopart.data.pt_um,
                        tr_um_conv:1,
                        tr_price: this.sct.sct_mtl_tl,
                        cmvids: "",
                        tr_ref: ref,
                        tr_serial: this.lddet.ld_lot,
                        tr_status: this.stat,
                        tr_expire: this.lddet.ld_expire,
                        tr_program:new Date().toLocaleTimeString(),
                        old:false,
                      },
                      { position: "bottom" }
                );
                controls.ref.setValue(null)
              }
              else
              {
                if(respopart.data.pt_break_cat != controls.product_color.value && respopart.data.pt_break_cat != 'ORIGINAL' )
                  { console.log(respopart.data.pt_break_cat)
                    this.codeService.getBy({code_fldname:controls.product_color.value,code_value:respopart.data.pt_break_cat})
                                  .subscribe(
                                    (respocode: any) => {console.log(respocode.data.length,'respocode')
                                                          if(respocode.data.length == 0){
                                                              controls.ref.setValue(null)
                                                              this.message = "la couleur du bigbag ne correspond pas à la bobine";
                                                              this.hasFormErrors = true;
                                                              return;
                                                          }
                                                          if(respopart.data.pt_dsgn_grp == 'N/BROY')
                                                            {controls.ref.setValue(null)
                                                              this.message = "Le bigbag séléctionné n'est pas broyé";
                                                              this.hasFormErrors = true;
                                                              return;
                                                          }
                                                          if(respopart.data.pt_draw == 'ORIGINAL'){if(controls.ORG_ISS.value > controls.ORG_PREV.value) {controls.ref.setValue(null)
                                                            this.layoutUtilsService.showActionNotification("quantité Originale dépasse consommation prévue", MessageType.Create, 10000, true, false,3000,'top');}
                                                          }
                                                          if(respopart.data.pt_draw == 'SQUELETTE'){if(controls.SQL_ISS.value > controls.SQL_PREV.value) {controls.ref.setValue(null)
                                                            this.layoutUtilsService.showActionNotification("quantité Squelette dépasse consommation prévue", MessageType.Create, 10000, true, false,3000,'top');}
                                                          }
                                                          
                                                          if(respopart.data.pt_draw == 'PREFORME'){if(controls.PRF_ISS.value > controls.PRF_PREV.value) {controls.ref.setValue(null)
                                                            this.layoutUtilsService.showActionNotification("quantité Préforme dépasse consommation prévue", MessageType.Create, 10000, true, false,3000,'top');}
                                                          
                                                          }
                                                          if(respopart.data.pt_draw == 'PAYETTE'){if(controls.PAI_ISS.value > controls.PAI_PREV.value) {controls.ref.setValue(null)
                                                            this.layoutUtilsService.showActionNotification("quantité Payette dépasse consommation prévue", MessageType.Create, 10000, true, false,3000,'top');}
                                                          }
                    
                                                          total = total + Number(this.lddet.ld_qty_oh)  
                                                          controls.total_iss.setValue(total)     
                                                          if(respopart.data.pt_draw == 'ORIGINAL'){let Orgqty = Number(Number(orgqty) + Number(this.lddet.ld_qty_oh));controls.ORG_ISS.setValue(Number(Orgqty))}
                                                          else{if(respopart.data.pt_draw == 'SQUELETTE'){let Sqlqty = Number(Number(sqlqty) + Number(this.lddet.ld_qty_oh));controls.SQL_ISS.setValue(Number(Sqlqty))}
                                                             else{if(respopart.data.pt_draw == 'PREFORME'){let Prfqty = Number(Number(prfqty) + Number(this.lddet.ld_qty_oh));controls.PRF_ISS.setValue(Number(Prfqty))}
                                                                  else{if(respopart.data.pt_draw == 'PAYETTE'){let Paiqty = Number(Number(paiqty) + Number(this.lddet.ld_qty_oh));controls.PAI_ISS.setValue(Number(Paiqty))}}}}
                                              
                                                          this.sctService.getByOne({ sct_site: this.lddet.ld_site, sct_part: this.lddet.ld_part, sct_sim: 'STD-CG' }).subscribe(
                                                          (respo: any) => {
                                                            this.sct = respo.data
                                                            console.log(this.sct)
                                                            this.labelService.getBy({lb_cab: ref}).subscribe((res:any) =>{
                                                              if (res.data != null) {idpal = res.data.id
                                                              console.log(idpal)
                                                              this.labelService.update({lb_actif : false},{id: idpal}).subscribe((res:any) =>{})
                                                              }
                                                            })
                                                            this.gridService.addItem(
                                                            {
                                                              id: this.dataset.length + 1,
                                                              tr_nbr:controls.wo_nbr.value,
                        tr_lot:controls.wo_lot.value,
                                                              tr_line: this.dataset.length + 1,
                                                              tr_part: this.lddet.ld_part,
                                                              cmvid: "",
                                                              desc: this.lddet.item.pt_desc1,
                                                              qty_oh: this.lddet.ld_qty_oh,
                                                              tr_qty_loc: this.lddet.ld_qty_oh,
                                                              tr_site: this.lddet.ld_site,
                                                              tr_loc: this.lddet.ld_loc,
                                                              tr_um: respopart.data.pt_um,
                                                              tr_um_conv:1,
                                                              tr_price: this.sct.sct_mtl_tl,
                                                              cmvids: "",
                                                              tr_ref: ref,
                                                              tr_serial: this.lddet.ld_lot,
                                                              tr_status: this.stat,
                                                              tr_expire: this.lddet.ld_expire,
                                                              tr_program:new Date().toLocaleTimeString(),
                                                              old:false,
                                                            },
                                                            { position: "bottom" }
                                                                        );
                                                                        controls.ref.setValue(null)
                                                          }); 
                                                        })
                                                        
                  }
                else
                  {
                    if(respopart.data.pt_dsgn_grp == 'N/BROY')
                      {controls.ref.setValue(null)
                        this.message = "Le bigbag séléctionné n'est pas broyé";
                        this.hasFormErrors = true;
                        return;
                    }
                    if(respopart.data.pt_draw == 'ORIGINAL'){if(controls.ORG_ISS.value > controls.ORG_PREV.value) {controls.ref.setValue(null)
                      this.layoutUtilsService.showActionNotification("quantité Originale dépasse consommation prévue", MessageType.Create, 5000, false, false);}
                    }
                    if(respopart.data.pt_draw == 'SQUELETTE'){if(controls.SQL_ISS.value > controls.SQL_PREV.value) {controls.ref.setValue(null)
                      this.layoutUtilsService.showActionNotification("quantité Squelette dépasse consommation prévue", MessageType.Create, 5000, false, false);}
                    }
                    
                    if(respopart.data.pt_draw == 'PREFORME'){if(controls.PRF_ISS.value > controls.PRF_PREV.value) {controls.ref.setValue(null)
                      this.layoutUtilsService.showActionNotification("quantité Préforme dépasse consommation prévue", MessageType.Create, 5000, false, false);}
                    
                    }
                    if(respopart.data.pt_draw == 'PAYETTE'){if(controls.PAI_ISS.value > controls.PAI_PREV.value) {controls.ref.setValue(null)
                      this.layoutUtilsService.showActionNotification("quantité Payette dépasse consommation prévue", MessageType.Create, 5000, false, false);}
                    }
                    total = total + Number(this.lddet.ld_qty_oh)  
                    controls.total_iss.setValue(total)     
                    if(respopart.data.pt_draw == 'ORIGINAL'){let Orgqty = Number(Number(orgqty) + Number(this.lddet.ld_qty_oh));controls.ORG_ISS.setValue(Number(Orgqty))}
                    else{if(respopart.data.pt_draw == 'SQUELETTE'){let Sqlqty = Number(Number(sqlqty) + Number(this.lddet.ld_qty_oh));controls.SQL_ISS.setValue(Number(Sqlqty))}
                       else{if(respopart.data.pt_draw == 'PREFORME'){let Prfqty = Number(Number(prfqty) + Number(this.lddet.ld_qty_oh));controls.PRF_ISS.setValue(Number(Prfqty))}
                            else{if(respopart.data.pt_draw == 'PAYETTE'){let Paiqty = Number(Number(paiqty) + Number(this.lddet.ld_qty_oh));controls.PAI_ISS.setValue(Number(Paiqty))}}}}
        
                    this.sctService.getByOne({ sct_site: this.lddet.ld_site, sct_part: this.lddet.ld_part, sct_sim: 'STD-CG' }).subscribe(
                    (respo: any) => {
                      this.sct = respo.data
                      
                      this.labelService.getBy({lb_cab: ref}).subscribe((res:any) =>{
                        if (res.data != null) {idpal = res.data.id
                        console.log(idpal)
                        this.labelService.update({lb_actif : false},{id: idpal}).subscribe((res:any) =>{})
                        }
                      })
                      this.gridService.addItem(
                      {
                        id: this.dataset.length + 1,
                        tr_line: this.dataset.length + 1,
                        tr_nbr:controls.wo_nbr.value,
                        tr_lot:controls.wo_lot.value,
                        tr_part: this.lddet.ld_part,
                        cmvid: "",
                        desc: this.lddet.item.pt_desc1,
                        qty_oh: this.lddet.ld_qty_oh,
                        tr_qty_loc: this.lddet.ld_qty_oh,
                        tr_site: this.lddet.ld_site,
                        tr_loc: this.lddet.ld_loc,
                        tr_um: respopart.data.pt_um,
                        tr_um_conv:1,
                        tr_price: this.sct.sct_mtl_tl,
                        cmvids: "",
                        tr_ref: ref,
                        tr_serial: this.lddet.ld_lot,
                        tr_status: this.stat,
                        tr_expire: this.lddet.ld_expire,
                        tr_program:new Date().toLocaleTimeString(),
                        old:false,
                      },
                      { position: "bottom" }
                      );
                      controls.ref.setValue(null)
                    });
                  }    
                  
              }
              
            }); 
          }
        });
   
  })
  }
  
  else {
  controls.ref.setValue(null)
  this.message = "le bigbag n'existe pas ou quantité egale à 0";
  this.hasFormErrors = true;
  return;
  
//  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , tr_part: null })
  }

});

}
else {
  
  controls.ref.setValue(null)
  this.message = "le bigbag a déjà été scané";
  this.hasFormErrors = true;
  return;
}

document.getElementById("ref").focus();
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
  const controls = this.woForm.controls;
  if (Array.isArray(args.rows) && this.gridObjbom) {
    args.rows.map((idx) => {
      const item = this.gridObjbom.getDataItem(idx);
      controls.wo_bom_code.setValue(item.bom_parent || "");
      this.bomService
        .getBy({
              bom_parent: controls.wo_bom_code.value,
        })
        .subscribe((response: any) => {
            console.log(response.data)
            
      let formule:any;
      this.psService.getBy({ps_parent:controls.wo_bom_code.value}).subscribe((ps: any) => {
       
        formule = ps.data
        console.log(formule)
        for (var object = 0; object < formule.length; object++) {
          let calc = 0
          calc = Number(formule[object].ps_qty_per) * Number(controls.wo_qty_ord.value) * Number(Number(1) + Number(formule[object].ps_scrp_pct)) / Number(response.data.bom_batch)
          if (formule[object].ps_ref == 'SQUELETTE'){ controls.SQL_PREV.setValue(calc )}
          if (formule[object].ps_ref == 'PREFORME'){ controls.PRF_PREV.setValue(calc )}
          if (formule[object].ps_ref == 'PAYETTE'){ controls.PAI_PREV.setValue(calc )}
          if (formule[object].ps_ref == 'ORIGINAL'){ controls.ORG_PREV.setValue(calc )}
        }
        })
      })
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
      id: "bom_parent",
      name: "code",
      field: "bom_parent",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bom_desc",
      name: "Designation",
      field: "bom_desc",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bom_batch",
      name: "Taille du Lot",
      field: "bom_batch",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "bom_batch_um",
      name: "UM",
      field: "bom_batch_um",
      sortable: true,
      filterable: true,
      type: FieldType.boolean,
    },
    {
      id: "bom_formula",
      name: "Formule",
      field: "bom_formula",
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
  };

  // fill the dataset with your data
  this.bomService
    .getAll()
    .subscribe((response: any) => (this.boms = response.data));
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
      id: "wo_queue_eff",
      name: "Ordre",
      field: "wo_queue_eff",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 100,

    },
    // {
    //   id: "wo_nbr",
    //   name: "N° OF",
    //   field: "wo_nbr",
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   minWidth: 100,

    // },
    {
      id: "wo_so_job",
      name: "N° Programme",
      field: "wo_so_job",
      sortable: true,
      filterable: true,
      type: FieldType.string,
      minWidth: 100,

    },
    // {
    //   id: "wo_ord_date",
    //   name: "Date",
    //   field: "wo_ord_date",
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
      minWidth: 150,
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
      id: "wo_status",
      name: "status",
      field: "wo_status",
      sortable: true,
      filterable: true,
      type: FieldType.string,
    },
    {
      id: "wo_routing",
      name: "status",
      field: "wo_routing",
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

      controls.wo_nbr.setValue(item.wo_nbr);
      controls.wo_part.setValue(item.wo_part);
      // controls.tr_so_job.setValue(item.wo_so_job);
      controls.desc.setValue(item.item.pt_desc1);
      controls.product_type.setValue(item.item.pt_article);
      controls.product_color.setValue(item.item.pt_break_cat);
      controls.product_quality.setValue(item.item.pt_rev);
      controls.total_bobine.setValue(item.wo_qty_comp);
      controls.wo_qty_rjct.setValue(item.wo_qty_rjct);
      controls.wo_qty_ord.setValue(item.wo_qty_ord)
      controls.product_Cyl.setValue(item.item.pt_group)
      controls.wo_bom_code.setValue(item.wo_bom_code);

      const paiqty = controls.PAI_ISS.value
      const prfqty = controls.PRF_ISS.value
      const sqlqty = controls.SQL_ISS.value
      const orgqty = controls.ORG_ISS.value
      let total = 0
      this.bomService
        .getBy({
              bom_parent: controls.wo_bom_code.value,
        })
        .subscribe((response: any) => {
            console.log(response.data)
            if (!response.data) {
              alert("Code n'existe pas")
              controls.ps_parent.setValue("")
              document.getElementById("code").focus();
            } else {
              // controls.desc.setValue(response.data.bom_desc);
            let formule:any;
          
            this.psService.getBy({ps_parent:controls.wo_bom_code.value}).subscribe((ps: any) => {
              
              formule = ps.data
              
              let calc_prev = 0
              for (var object = 0; object < formule.length; object++) {
                let calc = 0
                
                calc = Number(formule[object].ps_qty_per) * Number(controls.wo_qty_ord.value) * Number(Number(1) + Number(formule[object].ps_scrp_pct))/ Number(response.data.bom_batch)
                console.log(calc)
                if (formule[object].ps_ref == 'SQUELETTE'){ controls.SQL_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PREFORME'){ controls.PRF_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'PAYETTE'){ controls.PAI_PREV.setValue(calc )}
                if (formule[object].ps_ref == 'ORIGINAL'){ controls.ORG_PREV.setValue(calc )}
                
              }
              calc_prev = Number(controls.SQL_PREV.value) + Number(controls.PRF_PREV.value) + Number(controls.PAI_PREV.value) + Number(controls.ORG_PREV.value)
              
              
              })
             
            
            
              
              
            }
     })
     controls.ORG_ISS.setValue(0)
     controls.SQL_ISS.setValue(0)
     controls.PAI_ISS.setValue(0)
     controls.PRF_ISS.setValue(0)
     controls.total_iss.setValue(0)
     this.inventoryTransactionService.getByRef({tr_type:'ISS-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
      (res: any) => {        
      
      let calc_iss = 0   
      let Orgqty = 0
      let Sqlqty = 0
      let Prfqty = 0
      let Paiqty = 0
      for (let item of res.data){
                    
            if(item.tr__chr01 == 'ORIGINAL'){ Orgqty = Number(Number(Orgqty) - Number(item.tr_qty_loc));controls.ORG_ISS.setValue(Number(Orgqty))}
            else{if(item.tr__chr01 == 'SQUELETTE'){ Sqlqty = Number(Number(Sqlqty) - Number(item.tr_qty_loc));controls.SQL_ISS.setValue(Number(Sqlqty))}
                 else{if(item.tr__chr01 == 'PREFORME'){ Prfqty = Number(Number(Prfqty) - Number(item.tr_qty_loc));controls.PRF_ISS.setValue(Number(Prfqty))}
                      else{if(item.tr__chr01 == 'PAYETTE'){ Paiqty = Number(Number(Paiqty) - Number(item.tr_qty_loc));controls.PAI_ISS.setValue(Number(Paiqty))}}}}
         
            calc_iss = Number(Orgqty) + Number(Sqlqty) + Number(Prfqty) + Number(Paiqty)   
            controls.total_iss.setValue(calc_iss)  
      }},)
      //remplir les grids
      controls.wo_nbr.value
      
      console.log('remplir grid' ,controls.wo_nbr.value)
    //   this.inventoryTransactionService.getBy({tr_domain: this.domain,tr_type:'ISS-WO',tr_nbr:controls.wo_nbr.value}).subscribe(
    //     (res: any) => {        
    //     this.dataset  = res.data;
    //     for (let item of this.dataset){
    //   this.gridService.addItem(
    //       {
    //         id: this.dataset.length + 1,
    //         tr_line: this.dataset.length + 1,
    //         tr_part: item.tr_part,
    //         cmvid: "",
    //         tr_desc: item.tr_desc,
    //         tr__chr02:item.tr__chr02,
    //         tr_qty_loc: item.tr_qty_loc,
    //         tr_loc: item.tr_loc,
    //         tr_effdate: item.tr_effdate,
    //         tr_um:item.tr_um,
    //         tr_um_conv: 1,
    //         tr_price: item.tr_price,
    //         cmvids: "",
    //         tr_ref: item.tr_ref,
    //         tr_serial: item.tr_serial,
    //         tr_status: item.tr_status,
    //         tr_expire: item.tr_expire,
    //         tr_program: item.tr_program,
    //         old:true,
    //       },
    //       { position: "bottom" }
          
    //   )
    //   }
    // })
       
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

  printpdf(nbr) {
    // const controls = this.totForm.controls
    const controls = this.woForm.controls;
    console.log("pdf");
    var doc = new jsPDF();
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
    doc.text("Rapport de Consommation extrusion N° : " + nbr, 70, 45);
    doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 45);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      if(this.user1 != null){  doc.text("Fait par: " + this.user1, 20, 83)};
      if(this.user2 != null){doc.text("Et: " + this.user2, 90, 83);}
      
    doc.setFontSize(8);
    //console.log(this.provider.ad_misc2_id)
    // doc.text("Machine           : " + this.provider.ad_addr, 20, 50);
    // doc.text(" " + this.provider.ad_name, 60, 50);
    // doc.text("Equipe            : " + this.shift, 120, 50);
    // doc.text("Type produit      : " + controls.product_type.value, 20, 55);
    // doc.text("Employés          : " + this.user1, 120, 55);
    // doc.text("Couleur Produit   : " + controls.product_color.value, 20, 60);
    // doc.text("Quantité sortie   : " + controls.total_bobine.value, 20, 65);
    
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
    doc.text("Lot/Série", 152, 88.5);
    doc.line(170, 85, 170, 90);
    doc.text("N PAL", 172, 88.5);
    doc.line(185, 85, 185, 90);
    doc.text("Heure", 192, 88.5);
    doc.line(200, 85, 200, 90);
    var i = 95;
    doc.setFontSize(6);
  //   let total = 0
  console.log(this.dataset)
    for (let j = 0; j < this.dataset.length  ; j++) {
      // total = total + Number(this.dataset[j].tr_price) * Number(this.dataset[j].tr_qty_loc)
      
      if ((j % 20 == 0) && (j != 0) ) {
  doc.addPage();
  //img.src = "./assets/media/logos/create-direct-wo.png";
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
    doc.text("Rapport de Consommation extrusion N° : " + nbr, 70, 45);
    doc.text("imprimé Le: " + date.toLocaleDateString() , 160, 45);
      doc.text("A: " + new Date().toLocaleTimeString(), 160, 50);
      doc.text("Edité par: " + this.user.usrd_code, 160, 55);
      if(this.user1 != null){  doc.text("Fait par: " + this.user1, 20, 83)};
      if(this.user2 != null){doc.text("Et: " + this.user2, 90, 83);}
      
    doc.setFontSize(8);
    //console.log(this.provider.ad_misc2_id)
    // doc.text("Machine           : " + this.provider.ad_addr, 20, 50);
    // doc.text(" " + this.provider.ad_name, 60, 50);
    // doc.text("Equipe            : " + this.shift, 120, 50);
    // doc.text("Type produit      : " + controls.product_type.value, 20, 55);
    // doc.text("Employés          : " + this.user1, 120, 55);
    // doc.text("Couleur Produit   : " + controls.product_color.value, 20, 60);
    // doc.text("Quantité sortie   : " + controls.total_bobine.value, 20, 65);
    
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
        doc.line(150, 85, 150, 90);
        doc.text("Lot/Série", 152, 88.5);
        doc.line(170, 85, 170, 90);
        doc.text("N° pal", 172, 88.5);
        doc.line(185, 85, 185, 90);
        doc.text("Heure", 192, 88.5);
        doc.line(200, 85, 200, 90);
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
        doc.text(String(Number(this.dataset[j].tr_qty_loc)), 118, i - 1, { align: "right" });
        doc.line(120, i - 5, 120, i);
        doc.text(this.dataset[j].tr_um, 123, i - 1);
        doc.line(130, i - 5, 130, i);
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, );
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, );
        doc.line(185, i - 5, 185, i);
        doc.text(String(this.dataset[j].tr_program), 203, i - 1, );
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
        doc.text(String(this.dataset[j].tr_serial), 168, i - 1, { align: "right" });
        doc.line(170, i - 5, 170, i);
        doc.text(String(this.dataset[j].tr_ref), 183, i - 1, { align: "right" });
        doc.line(185, i - 5, 185, i);
        doc.text(String(this.dataset[j].tr_program), 203, i - 1, { align: "right" });
        doc.line(205, i - 5, 205, i);
        doc.line(10, i, 205, i);
        i = i + 5;
      }
    }
  
    
  
    doc.line(130, i + 7, 205, i + 7);
    doc.line(130, i + 14, 205, i + 14);
    doc.line(130, i + 7, 130, i + 14);
    doc.line(160, i + 7, 160, i + 14);
    doc.line(205, i + 7, 205, i + 14);
    doc.setFontSize(10);
    doc.text("Validé par: " , 20, i + 22);
    doc.text("Note: " , 20, i + 32);
   
    doc.setFontSize(8);
    doc.save('RX-' + nbr + '.pdf')
    var blob = doc.output("blob");
    window.open(URL.createObjectURL(blob));
  } 
}
