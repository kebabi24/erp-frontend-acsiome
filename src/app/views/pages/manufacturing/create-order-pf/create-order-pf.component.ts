import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../../../../environments/environment"
import { jsPDF } from "jspdf";
const API_URL = environment.apiUrl + "/codes"
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
  ItemService, SiteService, BomService,BomPartService, WorkOrder, WorkOrderService, SequenceService, ProviderService, WorkRoutingService,
  InventoryTransaction,LocationDetailService,
  InventoryTransactionService,

} from "../../../../core/erp";
import { Reason, ReasonService} from "../../../../core/erp"
import { addDays,addMs } from "@fullcalendar/angular";
import { data } from "jquery";
import date from "src/assets/plugins/formvalidation/src/js/validators/date";
import { TIMEOUT } from "dns";

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
  if (value=="C"){
    return `<div class="text"  aria-hidden="C">Cloturé</div>`
  }
  if (value=="R"){
    return `<div class="text"  aria-hidden="R">Lancé</div>`
  }
  if (value=="F"){
    return `<div class="text"  aria-hidden="F">Valide</div>`
  }
  if (value=="D"){
    return `<div class="text"  aria-hidden="D">Reporté</div>`
  }
  if (value=="A"){
    return `<div class="text"  aria-hidden="A">Annulé</div>`
  }


  } 
@Component({
  selector: 'kt-create-order-pf',
  templateUrl: './create-order-pf.component.html',
  styleUrls: ['./create-order-pf.component.scss']
})
export class CreateOrderPfComponent implements OnInit {


  workOrder: WorkOrder
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
  creation : boolean ;
  user: any;
  alertWarning: any;
  deletedid : number;
  updateid:number;
  sites: [];
  columnDefinitionssite: Column[] = [];
  gridOptionssite: GridOption = {};
  gridObjsite: any;
  angularGridsite: AngularGridInstance;

  part: any;
  color:any;
  oldcolor:any;
  micronage:any;
  vitesse:any;
  
  gammes: [];
  rowkctr:any;
  columnDefinitionsgamme: Column[] = [];
  gridOptionsgamme: GridOption = {};
  gridObjgamme: any;
  angularGridgamme: AngularGridInstance;

  items: [];
  columnDefinitions4: Column[] = [];
  gridOptions4: GridOption = {};
  gridObj4: any;
  angularGrid4: AngularGridInstance;

  causes: []
  columnDefinitions6: Column[] = []
  gridOptions6: GridOption = {}
  gridObj6: any
  angularGrid6: AngularGridInstance

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
  gamme: any;
  echeance: any;
  lancement:any;
  debut:any;
  fin:any;
  qty:any;
  op:any;
  jours:any;
  transfert:any;
  seq : any;
  nof : any;  
  njob:any;
  row_number;
  message = "";
  domain;
  httpOptions = this.httpUtils.getHTTPHeaders()
  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
    config: NgbDropdownConfig,
    private woFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private layoutUtilsService: LayoutUtilsService,
    private siteService: SiteService,  
    private providersService: ProviderService,  
    private itemsService: ItemService,
    private sequenceService: SequenceService,
    private workOrderService: WorkOrderService,
    private workRoutingService: WorkRoutingService,
    private bomService: BomService,
    private bomPartService: BomPartService,
    private locationDetailService: LocationDetailService,
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
            
            this.lancement = new Date(args.dataContext.wo_rel_date)
            this.debut = args.dataContext.chr01
            this.oldcolor = args.dataContext.color
            
            if(args.dataContext.woid != null) {this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,wo_status:'A',wo_due_date:this.lancement,chr02:this.debut,chr03:'0' });this.deletedid = Number(args.dataContext.line) + 1;}
            else{this.deletedid = args.dataContext.line;this.angularGrid.gridService.deleteItem(args.dataContext);}
            let i = 0;
            let iteration = this.dataset.length
            for(i = this.deletedid ; i<= iteration ; ){
              let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
              let oldItem:any;
              if(i>1){oldItem = this.gridService.getDataItemByRowIndex(i - 2);}
              this.transfert = 0;
              if(i>1){if(updateItem.color == oldItem.color || oldItem.color == 'TRANSPARENT'){this.transfert = 15 * 60000} else {this.transfert = 60 * 60000}}
              this.lancement = addMs(this.lancement,this.transfert)  
              
              console.log(this.deletedid,i)
              i = Number(i) + 1
              
              if(updateItem.wo_status == 'A'){this.jours = 0} else {
                
                this.jours =  Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60}
                this.echeance = addMs(new Date(this.lancement),this.jours)
                this.fin = new Date(this.echeance).toLocaleTimeString()
                
                this.gridService.updateItemById(args.dataContext.id = updateItem.id,{id:updateItem.id, line: Number(i) - 1,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_bo_chg:updateItem.wo_bo_chg,um:updateItem.um,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:updateItem.wo_lead_time})
                this.lancement = new Date(this.echeance)
                this.debut = new Date(this.lancement).toLocaleTimeString()    
              
            }
            
           
           
           
          }
        },
      },

      {
        id: "line",
        name: "Passage",
        field: "line",
        width: 80,
        selectable: true,
        editor: {
          model: Editors.float,
        },
         onCellChange: (e: Event, args: OnEventArgs) => {
          this.deletedid = args.dataContext.line;
          let nwid = args.dataContext.id
          let oldItem = this.gridService.getDataItemByRowIndex(args.dataContext.line - 1);
          this.updateid = oldItem.id
          this.lancement = new Date(oldItem.wo_rel_date)
          this.debut = new Date(oldItem.wo_rel_date).toLocaleTimeString
          if(args.dataContext.wo_status == 'A'){this.jours = 0}else{this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60}
          this.echeance = addMs(new Date(this.lancement),this.jours)
          this.fin = new Date(this.echeance).toLocaleTimeString(),
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,wo_rel_date:this.lancement,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0) })
          if(oldItem.color == args.dataContext.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.echeance),15*60000)}else{this.lancement = addMs(new Date(this.echeance),60*60000)}
                this.debut = new Date(this.lancement).toLocaleTimeString()
          if(oldItem.wo_status == 'A'){this.jours = 0}else{this.jours = Number(Number(oldItem.wo_qty_ord) / (Number(oldItem.wo_lead_time))) *1000 * 60 * 60}
          this.echeance = addMs(new Date(this.lancement),this.jours)
          this.fin = new Date(this.echeance).toLocaleTimeString(),
          this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: Number(oldItem.line) + 1 ,woid:oldItem.woid,wo_nbr:oldItem.wo_nbr,wo_part: oldItem.wo_part,desc:oldItem.desc, wo_qty_ord:oldItem.wo_qty_ord,wo_bo_chg:oldItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: oldItem.wo_status,wo_bom_code: oldItem.wo_bom_code,  wo_vend: oldItem.wo_vend, wo_prod_pct: oldItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:oldItem.wo_lead_time})
          if(oldItem.color == args.dataContext.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.echeance),15*60000)}else{this.lancement = addMs(new Date(this.echeance),60*60000)}
          this.debut = new Date(this.lancement).toLocaleTimeString()  
          this.oldcolor = args.dataContext.color
          let i = 0;
           for(i = Number(this.deletedid) + 1; i<=this.dataset.length; i++ ){
            
            let ofstatus ='F'
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            let oldItem:any;
              if(i>1){oldItem = this.gridService.getDataItemByRowIndex(i - 2);}
              this.transfert = 0;
              if(i>1){if(updateItem.color == oldItem.color || oldItem.color == 'TRANSPARENT'){this.transfert = 15 * 60000} else {this.transfert = 60 * 60000}}
              this.lancement = addMs(this.lancement,this.transfert)
            this.updateid = updateItem.id
            
              this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
              if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
              
              this.fin = new Date(this.echeance).toLocaleTimeString()
              console.log(updateItem.wo_status,nwid,this.jours,i,this.updateid,updateItem.line)
              if(Number(this.updateid) < Number(nwid)){
              this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: Number(updateItem.line) + 1 ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_bo_chg:updateItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:updateItem.wo_lead_time})
              this.lancement = new Date(this.echeance)
                this.debut = new Date(this.lancement).toLocaleTimeString()
            }
            if(Number(this.updateid) > Number(nwid)){
              this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line  ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_bo_chg:updateItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:updateItem.wo_lead_time})
            
              this.lancement = new Date(this.echeance)
            this.debut = new Date(this.lancement).toLocaleTimeString()
            }
              setTimeout(() => {
                console.log('delay');
              }, 20000);
         
          
          }
         
          
          
          
           
      }
    },
    // {
    //   id: "wo_nbr",
    //   name: "N° OF",
    //   field: "wo_nbr",
    //   sortable: true,
    //   width: 80,
    //   filterable: false,
      
     
    // },
      {
        id: "wo_part",
        name: "Article",
        field: "wo_part",
        sortable: true,
        width: 80,
        filterable: false,
        
       
      },
      {
        id: "partvid",
        field: "partvid",
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
        minWidth: 400,
        maxWidth: 400,
        filterable: false,
      },
      {
        id: "um",
        name: "UM",
        field: "um",
        sortable: true,
        width: 30,
        filterable: false,
      },
      {
        id: "qty_oh",
        name: "Stock Bobine",
        field: "qty_oh",
        sortable: true,
        width: 100,
        filterable: false,
      },
      {
        id: "dec01",
        name: "Qté demandée",
        field: "dec01",
        sortable: true,
        width: 100,
        filterable: false,
        editor: {
          model: Editors.float,
          required: true,
          

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.woForm.controls
          
          if (args.dataContext.dec01 < 0){
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, dec01:this.qty })
            this.message = "quantité négative interdite";
            this.hasFormErrors = true;
            return;
          }
          else{
            let qty_lance = Number(args.dataContext.dec01) - Number(args.dataContext.qty_oh)
            console.log(qty_lance,args.dataContext.line)
            if( args.dataContext.qty == 0 ){
              let ofdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null
              let oldItem:any;
              if(args.dataContext.id>1){oldItem = this.gridService.getDataItemByRowIndex(args.dataContext.id - 2);}
              this.transfert = 0;
              if(args.dataContext.id>1){if(args.dataContext.color == oldItem.color || oldItem.color == 'TRANSPARENT'){this.transfert = 15 * 60000} else {this.transfert = 60 * 60000}}
                 
              if(this.lancement == null)  {this.lancement = new Date(ofdate)
          
                this.debut = new Date().toLocaleTimeString()}
              else{this.lancement = addMs(this.lancement,this.transfert)
                this.debut = new Date(this.lancement).toLocaleTimeString}
              this.jours = Number(Number(qty_lance) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
              this.echeance = addMs(new Date(this.lancement),this.jours)
                  this.fin = new Date(this.echeance).toLocaleTimeString(),
                  this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,wo_qty_ord:qty_lance, wo_rel_date:this.lancement,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),qty:args.dataContext.wo_qty_ord })
                  this.lancement = new Date(this.echeance)
                  this.debut = new Date(this.lancement).toLocaleTimeString()
                
            } 
            else { 
              
               
                this.jours = Number(Number(qty_lance) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
                this.lancement = new Date(args.dataContext.wo_rel_date)
                this.debut     = args.dataContext.chr01
                this.echeance = addMs(new Date(args.dataContext.wo_rel_date),this.jours)
                this.fin = new Date(this.echeance).toLocaleTimeString(),
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, wo_qty_ord:qty_lance,wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0) })
                this.lancement = new Date(this.echeance)
                  this.debut = new Date(this.lancement).toLocaleTimeString()
            }
            this.deletedid = args.dataContext.line
            let i = 0;
            for(i = Number(this.deletedid) +1 ; i<=this.dataset.length; i++ ){
              let ofstatus ='F'
              let oldItem
              if (i>=2){oldItem = this.gridService.getDataItemByRowIndex(i - 2);}
              let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
              this.updateid = updateItem.id
              if(i>=2){if(oldItem.color == updateItem.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.lancement),15*60000)}else{this.lancement = addMs(new Date(this.lancement),60*60000)}}
              this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
              if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
              
              this.fin = new Date(this.echeance).toLocaleTimeString()
              console.log(i,this.updateid,updateItem.line)
              this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord, wo_bo_chg:updateItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:updateItem.wo_lead_time})
              this.lancement = new Date(this.echeance)
              this.debut = new Date(this.lancement).toLocaleTimeString()
              setTimeout(() => {
                console.log('delay');
              }, 20000);
         
            
            }
          }
        }
      },
      
      {
        id: "wo_qty_ord",
        name: "Quantité",
        field: "wo_qty_ord",
        sortable: true,
        width: 80,
        filterable: false,
        editor: {
          model: Editors.float,
          required: true,
          

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          const controls = this.woForm.controls
          this.oldcolor = args.dataContext.color
          if (args.dataContext.wo_qty_ord < 0){
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, wo_qty_ord:this.qty })
            this.message = "quantité négative interdite";
            this.hasFormErrors = true;
            return;
          }
          if( args.dataContext.qty == 0 ){
            let ofdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null
   
            if(this.lancement == null)  {this.lancement = new Date(ofdate), this.debut = new Date().toLocaleTimeString()}
            else{if(args.dataContext.id>=1){
              let oldItem: any;
              oldItem = this.gridService.getDataItemByRowIndex(args.dataContext.id-1)
              if(oldItem.color == args.dataContext.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.lancement),15*60000)}else{this.lancement = addMs(new Date(this.lancement),60*60000)}}
              this.lancement = new Date(this.lancement),this.debut = new Date(this.lancement).toLocaleTimeString}
            this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
            this.echeance = addMs(new Date(this.lancement),this.jours)
                this.fin = new Date(this.echeance).toLocaleTimeString(),
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_rel_date:this.lancement,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),qty:args.dataContext.wo_qty_ord })
                this.lancement = new Date(this.echeance)
                this.debut = new Date(this.lancement).toLocaleTimeString()
              
          } 
          else { 
            
             
              this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
              this.lancement = new Date(args.dataContext.wo_rel_date)
              this.debut     = args.dataContext.chr01
              this.echeance = addMs(new Date(args.dataContext.wo_rel_date),this.jours)
              this.fin = new Date(this.echeance).toLocaleTimeString(),
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0) })
              this.lancement = new Date(this.echeance)
                this.debut = new Date(this.lancement).toLocaleTimeString()
          }
          this.deletedid = args.dataContext.line
          let i = 0;
          for(i = Number(this.deletedid) +1 ; i<=this.dataset.length; i++ ){
            let ofstatus ='F'
            let oldItem:any;
            if(i >= 2){ oldItem = this.gridService.getDataItemByRowIndex(i - 2);}
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            this.updateid = updateItem.id
            this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
            if(i>=2){if(oldItem.color == updateItem.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.lancement),15*60000)}else{this.lancement = addMs(new Date(this.lancement),60*60000)}}
              
            if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
            
            this.fin = new Date(this.echeance).toLocaleTimeString()
            console.log(i,this.updateid,updateItem.line)
            this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord, wo_bo_chg:updateItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:updateItem.wo_lead_time})
            this.lancement = new Date(this.echeance)
            this.debut = new Date(this.lancement).toLocaleTimeString()
            setTimeout(() => {
              console.log('delay');
            }, 20000);
       
          
          }
        },
      
      },
      
      {
        id: "wo_rel_date",
        name: "Date Lancement",
        field: "wo_rel_date",
        sortable: true,
        width: 150,
        filterable: false,
        formatter: Formatters.dateTimeShortIso ,
        type: FieldType.dateTimeShortIso,
        editor: {
          model: Editors.date,
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          if (new Date(args.dataContext.wo_rel_date) < new Date()){
             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, wo_rel_date:args.dataContext.olddate})
            
            this.message = "veuillez verifier la date";
            this.hasFormErrors = true;
            return;
          }
          if(Number(args.dataContext.line) > 1 )
            {let oldItem = this.gridService.getDataItemByRowIndex(args.dataContext.line -2)
              if (new Date(args.dataContext.wo_rel_date) < new Date(oldItem.wo_due_date)){
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, wo_rel_date:oldItem.olddate})
               
               this.message = "veuillez saisir une date superieure à la date de l'OF précedent";
               this.hasFormErrors = true;
               return;
             }
            }; 
          this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
          this.lancement = new Date(args.dataContext.wo_rel_date)
          this.debut     = new Date(args.dataContext.wo_rel_date).toLocaleTimeString()
          this.echeance = addMs(new Date(args.dataContext.wo_rel_date),this.jours)
          this.fin = new Date(this.echeance).toLocaleTimeString(),
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0) })
          this.lancement = new Date(this.echeance)
                this.debut = new Date(this.lancement).toLocaleTimeString()
          this.deletedid = args.dataContext.line
          let i = 0;
          for(i = Number(this.deletedid) ; i<=this.dataset.length; ){
            i = i + 1
            let oldItem : any;
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            if(i>1){oldItem = this.gridService.getDataItemByRowIndex(i - 2);}
            let ofstatus = 'F'
            this.updateid = updateItem.id
            if(i>=2){if(oldItem.color == updateItem.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.lancement),15*60000)}else{this.lancement = addMs(new Date(this.lancement),60*60000)}}
            
            this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
            if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
            
            this.fin = new Date(this.echeance).toLocaleTimeString()
            console.log(i,this.updateid,updateItem.line)
            this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_bo_chg:updateItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:updateItem.wo_lead_time})
            this.lancement = new Date(this.echeance)
                this.debut = new Date(this.lancement).toLocaleTimeString()
            setTimeout(() => {
              console.log('delay');
            }, 20000);
       
          
          }
        } 
       
      },
      
      {
        id: "wo_due_date",
        name: "Date Echéance",
        field: "wo_due_date",
        sortable: true,
        width: 150,
        filterable: false,
        formatter: Formatters.dateTimeShortEuro ,
        type: FieldType.dateTimeShortIso,
        // editor: {
        //   model: Editors.date,
        // },
       
      },
      {
        id: "chr03",
        name: "Temps Production",
        field: "chr03",
        sortable: true,
        width: 80,
        filterable: false,
        
        
      },
      // {
      //   id: "wo_bom_code",
      //   name: "Code Formule",
      //   field: "wo_bom_code",
      //   sortable: true,
      //   width: 60,
      //   filterable: false,
      //   type: FieldType.string,
      //   // editor: {
      //   //     model: Editors.text,
      //   //     required: true,
          
      //   // },
      //   // onCellChange: (e: Event, args: OnEventArgs) => {
          
      //   //   this.bomService.getBy({bom_parent: args.dataContext.wo_bom_code }).subscribe((resp:any)=>{

          
      //   //     if (resp.data) {
             
               
      //   //          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,  wo_bom_code: resp.data.bom_parent })
               
      //   //     } else {

                      
      //   //               this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_bom_code: null })
              
      //   //     } 
      //   //   })
      //   // }  
        
      // },
      // {
      //   id: "bomvid",
      //   field: "bomvid",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.row_number = args.row;
      //     let element: HTMLElement = document.getElementById(
      //       "openBomsGrid"
      //     ) as HTMLElement;
      //     element.click();
      //   },
      // },
      // {
      //   id: "wo_lot_next",
      //   name: "Lot/Serie",
      //   field: "wo_lot_next",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.string,
      //   // editor: {
      //   //     model: Editors.text,
          
      //   // },
    
        
      // },
      {
        id: "wo_status",
        name: "Status",
        field: "wo_status",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        formatter: myCustomCheckboxFormatter,
        editor: {
          model: Editors.singleSelect,

          enableRenderHtml: true,
          collectionAsync:  this.http.get(`${API_URL}/wostatus`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
      
         
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          if(args.dataContext.wo_status == 'A'){
          this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
          this.lancement = new Date(args.dataContext.wo_rel_date)
          this.debut     = new Date(args.dataContext.wo_rel_date).toLocaleTimeString()
          this.echeance = new Date(args.dataContext.wo_rel_date)
          this.fin = new Date(this.echeance).toLocaleTimeString(),
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0) })
          this.lancement = this.echeance
          this.debut = new Date(this.echeance).toLocaleTimeString()
          
          this.deletedid = args.dataContext.line
          let i = 0;
          for(i = Number(this.deletedid) ; i<=this.dataset.length; ){
            i = i + 1
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            let oldItem:any;
            if(i>1){oldItem = this.gridService.getDataItemByRowIndex(i - 2)}
            if(i>=2){if(oldItem.color == updateItem.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.lancement),15*60000)}else{this.lancement = addMs(new Date(this.lancement),60*60000)}}
            
            this.updateid = updateItem.id
            this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
            this.echeance = addMs(this.lancement,this.jours)
            this.fin = new Date(this.echeance).toLocaleTimeString()
            console.log(i,this.updateid,updateItem.line)
            this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_bo_chg:updateItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,wo_lead_time:updateItem.wo_lead_time,chr03:Number((this.jours)/(1000*60*60)).toFixed(0)})
            this.lancement = this.echeance,
            this.debut = this.fin;
            setTimeout(() => {
              console.log('delay');
            }, 20000);
       
          
          }
          }
//           else{
//             if(args.dataContext.wo_status == 'R'){
//             this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
//             this.lancement = new Date(args.dataContext.wo_rel_date)
//             this.debut     = new Date(this.lancement).toLocaleTimeString()
//             this.echeance = addMs(this.lancement,this.jours)
//             this.fin = new Date(this.echeance).toLocaleTimeString(),
//             this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0) })
//             this.lancement = this.echeance
//             this.debut = new Date(this.echeance).toLocaleTimeString()
            
//             this.deletedid = args.dataContext.line
//             let i = 0;
            
//             for(i = Number(this.deletedid) ; i<=this.dataset.length; ){
//               i = i + 1
//               let ofstatus = 'F'
//               let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
// let oldItem:any;
// if(i>1){oldItem = this.gridService.getDataItemByRowIndex(i - 2);}
//               if(i>=2){if(oldItem.color == updateItem.color || oldItem.color == 'TRANSPARENT'){this.lancement = addMs(new Date(this.lancement),15*60000)}else{this.lancement = addMs(new Date(this.lancement),60*60000)}}
            
//               this.updateid = updateItem.id
//               this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
//               if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours); if(updateItem.wo_status == 'C'){ofstatus='C'}else{ofstatus = 'F'}}
//               this.fin = new Date(this.echeance).toLocaleTimeString()
//               console.log(i,this.updateid,updateItem.line)
//               // if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){ofstatus = updateItem.wo_status} else{ofstatus = 'F'}
//               this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_bo_chg:updateItem.wo_bo_chg,wo_rel_date: this.lancement, chr01:this.debut,wo_status: ofstatus,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number((this.jours)/(1000*60*60)).toFixed(0),wo_lead_time:updateItem.wo_lead_time})
//               this.lancement = this.echeance,
//               this.debut = this.fin;
//               setTimeout(() => {
//                 console.log('delay');
//               }, 20000);
        
            
//             }
//             }
//           }
        }  
      },
      
      // {
      //   id: "wo_vend",
      //   name: "Fournisseur",
      //   field: "wo_vend",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.string,
      //   editor: {
      //     model: Editors.text,
      //     required: true,
         

      //   },
      //   onCellChange: (e: Event, args: OnEventArgs) => {
          
      //     this.providersService.getBy({vd_addr: args.dataContext.wo_vend }).subscribe((resp:any)=>{

      //       if (resp.data) {
             
      //         this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_vend: resp.data.vd_addr })
       
      //       }else {

             
      //         this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_vend: null })


      //       } 
      //     })
      //   }  
        
      // },
      // {
      //   id: "vendvid",
      //   field: "vendvid",
      //   excludeFromHeaderMenu: true,
      //   formatter: Formatters.infoIcon,
      //   minWidth: 30,
      //   maxWidth: 30,
      //   onCellClick: (e: Event, args: OnEventArgs) => {
      //     this.row_number = args.row;
      //     let element: HTMLElement = document.getElementById(
      //       "openVendsGrid"
      //     ) as HTMLElement;
      //     element.click();
      //   },
      // },
      
      // {
      //   id: "wo_so_job",
      //   name: "Liaison",
      //   field: "wo_so_job",
      //   sortable: true,
      //   width: 80,
      //   filterable: false,
      //   type: FieldType.string,
      //   editor: {
      //     model: Editors.longText,
        
      //   },
      
      // },
     
      {
        id: "wo_lead_time",
        name: "Vitesse",
        field: "wo_lead_time",
        sortable: true,
        width: 60,
        filterable: false,
        type: FieldType.float,
        // formatter: Formatters.Number,
        // editor: {
        //     model: Editors.float,
        //     params: { decimalPlaces: 2 },
            
            
        // },
    
        
      },
      

      
      

    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true,
      // enableRowMoveManager:true,
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
    this.createForm();
    this.user =  JSON.parse(localStorage.getItem('user'))
    this.domain = JSON.parse(localStorage.getItem('domain'))
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.workOrder = new WorkOrder();
    const date = new Date;
    this.creation = true;
    this.woForm = this.woFB.group({
      wo_ord_date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: date.getDate()
      }],
      wo_site: [this.workOrder.wo_site , Validators.required],
      wo_routing: [this.workOrder.wo_routing , Validators.required],
      wo_rmks: [this.workOrder.wo_rmks ],
      wo_so_job: [this.workOrder.wo_so_job ],
      wo_rev: [this.workOrder.wo_rev ],

      
    });
    const controls = this.woForm.controls;
    
    controls.wo_rev.setValue('01');
    
    
    this.rowkctr='THERMOFORMAGE';
    let ofdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null
        
    
    let nbr = 0
    this.workOrderService.getByDistinct({wo_routing:controls.wo_routing.value}).subscribe(
      (res: any) => {if (res.data.length != 0) {nbr = res.data.length + 2}
      else{nbr = 1} 
       controls.wo_so_job.setValue('P-'+ controls.wo_routing.value +  '-' + String('0000'+ String(nbr)).slice(-4))})
        
        this.workOrderService.getBythermo({wo_so_job:'P-'+ controls.wo_routing.value +  '-' + String('0000'+ String(nbr)).slice(-4)}).subscribe(
          (res: any) => {        
          this.dataset  = res.data;
          // let version = 1;
          // if(res.data != null){version = Number(res.data.wo_rev) + 1}
          // controls.wo_rev.setValue(version)
         if(res.data.length != 0){this.creation = false;}
          for (let item of this.dataset){
            var maxObj = null;
            var iddd = 0;
            if (this.dataset.length > 0) {
            maxObj = this.dataset.reduce((accumulator, current) => {
            return accumulator.id > current.id ? accumulator : current;
          });
          console.log(maxObj.id + 1);
          iddd = maxObj.id + 1;
        
          } else { iddd = 1}
          console.log(iddd,item.id)
          this.gridService.addItem(
            {
              id: item.id,
             line: item.wo_queue_eff,
             oldline: item.wo_queue_eff,
      
        wo_part: item.wo_part,
        oldpart: item.wo_part,
        
        wo_nbr:item.wo_nbr,
        woid:item.id,
        cmvid: "",
        desc: "",
        wo_qty_ord: item.wo_qty_ord,
        wo_bo_chg:item.wo_bo_chg,
        qty:item.wo_qty_ord,
        um:"CT",
        olddate:new Date(item.wo_rel_date),
        wo_rel_date: new Date(item.wo_rel_date),
        wo_due_date:new Date(item.wo_due_date),
        chr01:item.chr01,
        chr02:item.chr02,
        chr03:String(Number(item.chr03).toFixed(0)),
        wo_status: item.wo_status,
        wo_bom_code: item.wo_bom_code,
        wo_lead_time:item.wo_lead_time,
       
        wo_vend: item.wo_vend,
        
        wo_prod_pct: item.wo_prod_pct,
        color:item.wo_batch,
        micronage:item.item.int01,
        
                      int01:item.item.int01,
                      int02:item.item.int02,
                      wo_batch:item.wo_batch,
                      wo_grade:item.wo_grade,
            },
            { position: "bottom" }
            
          )
        this.lancement = new Date(item.wo_due_date),
      this.debut = item.chr02}},)
      }
  //reste form
  reset() {
    this.workOrder = new WorkOrder();
    this.createForm();
    this.hasFormErrors = false;
    this.creation = true;
    this.dataset =[]
    this.lancement = new Date()
  }


  onChangeCode() {
    const controls = this.woForm.controls
    this.siteService
        .getByOne({
              si_site: controls.wo_site.value,
        })
        .subscribe((response: any) => {
            
            const { data } = response;
            if (!data) {
             
              controls.wo_site.setValue("")
              document.getElementById("site").focus();
            } 
     })
  }
  onChangegamme() {
    const controls = this.woForm.controls
    this.workRoutingService
        .getByOne({
              ro_routing: controls.wo_routing.value,
        })
        .subscribe((response: any) => {
            
            const { data } = response;
            if (!data) {
              
              controls.wo_routing.setValue("")
              document.getElementById("routing").focus();
            } 
     })
     let nbr = 0;
     this.workOrderService.getByDistinct({wo_routing:controls.wo_routing.value}).subscribe(
      (res: any) => {if (res.data.length != 0) {nbr = res.data.length + 1}
      else{nbr = 1} 
       controls.wo_so_job.setValue('P-'+ controls.wo_routing.value +  '-' + String('0000'+ String(nbr)).slice(-4))})
  }
  onChangeprogram() {
    const controls = this.woForm.controls
    this.dataset = [];
    let version = 1;
    let ofdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null
    if (controls.wo_so_job.value == ''|| controls.wo_so_job.value == null ){
              console.log(ofdate)
              this.workOrderService.getBy({wo_routing:controls.wo_routing.value,wo_ord_date:ofdate}).subscribe(
                (res: any) => {        
                  this.dataset  = res.data;
                  this.creation = false;
                   
                  
                  let j = 0;
                  for (let item of this.dataset){j = j + 1;
                    var maxObj = null;
                    var iddd = 0;
                    var qtyoh = 0;
                    
                  if (this.dataset.length > 0) {
                    maxObj = this.dataset.reduce((accumulator, current) => {
                      return accumulator.id > current.id ? accumulator : current;
                    });
          
                    iddd = maxObj.id + 1;
          
                  } else {
                    iddd = 1;
          
                  }
                  this.locationDetailService.getqtyoh({ld_part:item.wo_part,ld_site:controls.wo_site.value}).subscribe((response: any) => (
                    this.gridService.addItem(
                      {
                        id: item.id,
                        oldline: item.wo_queue_eff,
                        line: item.wo_queue_eff,
                        woid:item.id,
                        wo_nbr:item.wo_nbr, 
                        oldpart: item.wo_part,
                        wo_part: item.wo_part,
                        cmvid: "",
                        desc: item.item.pt_desc1,
                        qty_oh:response.data[0].ld_qty_oh,
                        wo_qty_ord: item.wo_qty_ord,
                        wo_bo_chg:item.wo_bo_chg,
                        um:"CT",
                        qty:item.wo_qty_ord,
                        olddate: new Date(item.wo_rel_date),
                        wo_rel_date: new Date(item.wo_rel_date),
                        wo_due_date:new Date(item.wo_due_date),
                        chr01:item.chr01,
                        chr02:item.chr02,
                        chr03:String(Number(item.chr03).toFixed(0)),
                        wo_status: item.wo_status,
                        wo_bom_code: item.wo_bom_code,
                        wo_vend: item.wo_vend,
                        wo_lead_time:item.wo_lead_time,
                        
                        wo_prod_pct: item.wo_prod_pct,
                        color:item.wo_batch,
                        micronage:item.item.int01,
                        int01:item.item.int01,
                        int02:item.item.int02,
                        wo_batch:item.wo_batch,
                        wo_grade:item.wo_grade,
                        dec01:item.dec01,
                      },
                      { position: "bottom" }
                      
                    ),
                    this.lancement=new Date(item.wo_due_date),
                    this.debut=item.chr02,
                    controls.wo_rev.setValue(item.wo_rev)
                  ));
      
                  
                }
              })
                
    } 
    else{
      this.workOrderService
        .getByOne({
              wo_so_job: controls.wo_so_job.value,wo_routing: controls.wo_routing.value
        })
        .subscribe((response: any) => {
            
            const { data } = response;
            if (!data) {
              controls.wo_so_job.setValue("")
              document.getElementById("job").focus();
              this.message = "programme n'existe pas pour cette gamme"
              this.hasFormErrors = true;
              return;
              
            }
            else{
              this.workOrderService.getBy({wo_so_job:controls.wo_so_job.value}).subscribe(
                (res: any) => {        
                  this.dataset  = res.data;
                  
                  if(res.data != null){version = Number(res.data.wo_rev) + 1, controls.wo_rev.setValue(version)}
                  this.creation = false;
                  let j = 0;
                  for (let item of this.dataset){j = j + 1;
                    var maxObj = null;
                    var iddd = 0;
      
                    if (this.dataset.length > 0) {
                      maxObj = this.dataset.reduce((accumulator, current) => {
                        return accumulator.id > current.id ? accumulator : current;
                      });
                      
                      iddd = maxObj.id + 1;
                      
                    } else {
                      iddd = 1;
                      
                    }
      
                    this.locationDetailService.getqtyoh({ld_part:item.wo_part,ld_site:controls.wo_site.value}).subscribe((response: any) => (
                      this.gridService.addItem(
                        {
                          id: item.id,
                          oldline: item.wo_queue_eff,
                          line: item.wo_queue_eff,
                          woid:item.id,
                          wo_nbr:item.wo_nbr, 
                          oldpart: item.wo_part,
                          wo_part: item.wo_part,
                          cmvid: "",
                          desc: item.item.pt_desc1,
                          qty_oh:response.data[0].ld_qty_oh,
                          wo_qty_ord: item.wo_qty_ord,
                          wo_bo_chg:item.wo_bo_chg,
                          um:"CT",
                          qty:item.wo_qty_ord,
                          olddate: new Date(item.wo_rel_date),
                          wo_rel_date: new Date(item.wo_rel_date),
                          wo_due_date:new Date(item.wo_due_date),
                          chr01:item.chr01,
                          chr02:item.chr02,
                          chr03:String(Number(item.chr03).toFixed(0)),
                          wo_status: item.wo_status,
                          wo_bom_code: item.wo_bom_code,
                          wo_vend: item.wo_vend,
                          wo_lead_time:item.wo_lead_time,
                          
                          wo_prod_pct: item.wo_prod_pct,
                          color:item.wo_batch,
                          micronage:item.item.int01,
                          int01:item.item.int01,
                          int02:item.item.int02,
                          wo_batch:item.wo_batch,
                          wo_grade:item.wo_grade,
                          dec01:item.dec01,
                        },
                        { position: "bottom" }
                        
                      ),
                      this.lancement=new Date(item.wo_due_date),
                      this.debut=item.chr02,
                      controls.wo_rev.setValue(item.wo_rev)
                    ));
                  }
                },
              )
                
            } 
        })
    }
    
  }
  onChangeDate() {
    const controls = this.woForm.controls
    this.dataset = [];
    let version = 1;
    let ofdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null
    if (controls.wo_so_job.value == ''|| controls.wo_so_job.value == null ){
              console.log(ofdate)
              this.workOrderService.getBy({wo_routing:controls.wo_routing.value,wo_ord_date:ofdate}).subscribe(
                (res: any) => {        
                  this.dataset  = res.data;
                  this.creation = false;
                   
                  
                  let j = 0;
                  for (let item of this.dataset){j = j + 1;
                    var maxObj = null;
                    var iddd = 0;
      
                  if (this.dataset.length > 0) {
                    maxObj = this.dataset.reduce((accumulator, current) => {
                      return accumulator.id > current.id ? accumulator : current;
                    });
          
                    iddd = maxObj.id + 1;
          
                  } else {
                    iddd = 1;
          
                  }
      
                  this.gridService.addItem(
                    {
                      id: item.id,
                      oldline: item.wo_queue_eff,
                      line: item.wo_queue_eff,
                      woid:item.id,
                      wo_nbr:item.wo_nbr, 
                      oldpart: item.wo_part,
                      wo_part: item.wo_part,
                      cmvid: "",
                      desc: item.item.pt_desc1,
                      wo_qty_ord: item.wo_qty_ord,
                      wo_bo_chg:item.wo_bo_chg,
                      um:"CT",
                      qty:item.wo_qty_ord,
                      olddate: new Date(item.wo_rel_date),
                      wo_rel_date: new Date(item.wo_rel_date),
                      wo_due_date:new Date(item.wo_due_date),
                      chr01:item.chr01,
                      chr02:item.chr02,
                      chr03:String(Number(item.chr03).toFixed(0)),
                      wo_status: item.wo_status,
                      wo_bom_code: item.wo_bom_code,
                      wo_vend: item.wo_vend,
                      wo_lead_time:item.wo_lead_time,
                     
                      wo_prod_pct: item.wo_prod_pct,
                      color:item.wo_batch,
                      micronage:item.item.int01,
                      int01:item.item.int01,
                      int02:item.item.int02,
                      wo_batch:item.wo_batch,
                      wo_grade:item.wo_grade,
                      dec01:item.dec01,
                    },
                    { position: "bottom" }
                    
                  )
                  this.lancement=new Date(item.wo_due_date),
                  this.debut=item.chr02
                  controls.wo_rev.setValue(item.wo_rev)
                }
              })
                
    } 
    else{
      this.workOrderService
        .getByOne({
              wo_so_job: controls.wo_so_job.value,wo_routing: controls.wo_routing.value
        })
        .subscribe((response: any) => {
            
            const { data } = response;
            if (!data) {
              controls.wo_so_job.setValue("")
              document.getElementById("job").focus();
              this.message = "programme n'existe pas pour cette gamme à cette date"
              this.hasFormErrors = true;
              return;
            }
            else{
              this.workOrderService.getBy({wo_so_job:controls.wo_so_job.value}).subscribe(
                (res: any) => {        
                  this.dataset  = res.data;
                  this.creation = false;
                  if(res.data != null){version = Number(res.data.wo_rev) + 1, controls.wo_rev.setValue(version)}
                  
                  let j = 0;
                  for (let item of this.dataset){j = j + 1;
                    var maxObj = null;
                    var iddd = 0;
      
                    if (this.dataset.length > 0) {
                      maxObj = this.dataset.reduce((accumulator, current) => {
                        return accumulator.id > current.id ? accumulator : current;
                      });
                      
                      iddd = maxObj.id + 1;
                      
                    } else {
                      iddd = 1;
                      
                    }
      
                    this.gridService.addItem(
                      {
                        id: item.id,
                        oldline: item.wo_queue_eff,
                        line: item.wo_queue_eff,
                      woid:item.id,
                      wo_nbr:item.wo_nbr, 
                      wo_part: item.wo_part,
                      oldpart: item.wo_part,
                      cmvid: "",
                      desc: item.item.pt_desc1,
                      wo_qty_ord: item.wo_qty_ord,
                      wo_bo_chg:item.wo_bo_chg,
                      qty:item.wo_qty_ord,
                      um:"CT",
                      olddate:new Date(item.wo_rel_date),
                      wo_rel_date: new Date(item.wo_rel_date),
                      wo_due_date:new Date(item.wo_due_date),
                      chr01:item.chr01,
                      chr02:item.chr02,
                      chr03:String(Number(item.chr03).toFixed(0)),
                      wo_status: item.wo_status,
                      wo_bom_code: item.wo_bom_code,
                      wo_vend: item.wo_vend,
                      wo_lead_time:item.wo_lead_time,
                    
                        wo_prod_pct: item.wo_prod_pct,
                        color:item.wo_batch,
                      micronage:item.item.int01,
                      int01:item.item.int01,
                      int02:item.item.int02,
                      wo_batch:item.wo_batch,
                      wo_grade:item.wo_grade,
                      dec01:item.dec01,
                      },
                      { position: "bottom" }
                      
                    )
                    this.lancement=new Date(item.wo_due_date),
                    this.debut=item.chr02
                  }
                },
              )
                
            } 
        })
    }
    
  }

  // save data
  onSubmit() {
    this.hasFormErrors = false;
    this.creation = true;
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
      
     if (this.dataset[i].wo_part == "" || this.dataset[i].wo_part == null  ) {
      this.message = "L' article ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
    }
     for (var i = 0; i < this.dataset.length; i++) {
      
     if (this.dataset[i].wo_qty_ord == 0 || this.dataset[i].wo_qty_ord == null  ) {
      this.message = "Quantité ne peut pas etre 0";
      this.hasFormErrors = true;
      return;
 
     }
    }
     for (var i = 0; i < this.dataset.length; i++) {
      
     if (this.dataset[i].wo_rel_date == "" || this.dataset[i].wo_rel_date == null  ) {
      this.message = "Date de lancement ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
     }
     }

     for (var i = 0; i < this.dataset.length; i++) {
      
     if (this.dataset[i].wo_due_date == "" || this.dataset[i].wo_due_date == null  ) {
      this.message = "Date Echeance ne peut pas etre vide";
      this.hasFormErrors = true;
      return;
 
     }
    }
    for (var i = 0; i < this.dataset.length; i++) {
      
      // if (this.dataset[i].wo_bom_code == "" || this.dataset[i].wo_bom_code == null  ) {
      //  this.message = "Code formule ne peut pas etre vide";
      //  this.hasFormErrors = true;
      //  return;
      // }
      
    }
    let wo = this.prepare()
    this.addIt( this.dataset,wo);

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
    
    
//   }else {
//     this.message = "Parametrage Manquant pour la sequence";
//     this.hasFormErrors = true;
//     return;

//    }


// })




    

    
    // tslint:disable-next-line:prefer-const
    
  }

  prepare(){
    const controls = this.woForm.controls;
    const _wo = new WorkOrder();
    _wo.wo_site = controls.wo_site.value
    _wo.wo_routing = controls.wo_routing.value
    _wo.wo_rmks = controls.wo_rmks.value
    _wo.wo_so_job = controls.wo_so_job.value
    _wo.wo_rev = controls.wo_rev.value
    _wo.wo_line = this.op
    _wo.wo_type = 'TR'
    _wo.wo_ord_date = controls.wo_ord_date.value
    ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}`
    : null
    return _wo
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
   addIt( detail: any, it) {
    for (let data of detail) {
      delete data.id;
      delete data.desc;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    const controls = this.woForm.controls;
    
    this.workOrderService
      .add({detail, it})
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
          this.printpdf(it.wo_so_job)
      //    console.log(this.provider, po, this.dataset);
      //    if(controls.print.value == true) printBc(this.provider, this.datasetPrint, po);
      this.router.navigateByUrl("/manufacturing/list-wo")
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
    if(controls.wo_rmks.value == null && this.creation == false){
      this.message = "veuillez remplir le champs cause";
       this.hasFormErrors = true;
       return;
    }
    if(controls.wo_routing.value == null || controls.wo_routing.value == ''){
      this.message = "veuillez sélectionner la lign de production";
       this.hasFormErrors = true;
       return;
    }
    for (var i = 0; i < this.dataset.length; i++) {
      
      if (this.dataset[i].wo_part == "" || this.dataset[i].wo_part == null  ) {
       this.message = "L' article ne peut pas etre vide";
       this.hasFormErrors = true;
       return;
  
      }
      // if (this.dataset[i].wo_qty_ord == 0  ) {
      //   this.message = "La quantité ne peut pas etre nulle";
      //   this.hasFormErrors = true;
      //   return;
   
      //  }
       if (new Date(this.dataset[i].wo_rel_date) < new Date(this.dataset[i].olddate)  ) {
        this.message = "La date ne peut pas etre inferieure à celle de la ligne précedente";
        this.hasFormErrors = true;
        return;
   
       }
     }
    this.part = null;
    var maxObj = null;
    var iddd = 0;
    var ligne = 0;
      if (this.dataset.length > 0) {
        maxObj = this.dataset.reduce((accumulator, current) => {
          return accumulator.id > current.id ? accumulator : current;
        });
        console.log(maxObj.id + 1);
        iddd = maxObj.id + 1;
        ligne = Number(maxObj.line) + 1;
      } else {
        iddd = 1;
        ligne = 1;
      }
      
      if (this.lancement == null){this.lancement = new Date()}
      
      console.log(iddd)
    this.gridService.addItem(
     
      {
        id: iddd,
        line: ligne,
        oldline: ligne,
        woid:null,
        wo_nbr:"",
        wo_part: "",
        cmvid: "",
        desc: "",
        wo_qty_ord: 0,
        wo_bo_chg:0,
        um:"CT",
        qty:0,
        olddate:this.lancement,
        wo_rel_date: this.lancement,
        chr01:new Date(this.lancement).toLocaleTimeString(),
        wo_status: "F",
        wo_bom_code: null,
        wo_vend: null,
        wo_lead_time:0,
        wo_prod_pct: 0,
              },
      { position: "bottom" }
    );
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
    this.siteService
      .getAll()
      .subscribe((response: any) => (this.sites = response.data));
  }
  opensite(content) {
    this.prepareGridsite();
    this.modalService.open(content, { size: "lg" });
  }




  handleSelectedRowsChanged4(e, args) {
    
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    
    const controls = this.woForm.controls;
    
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {

        
        const item = this.gridObj4.getDataItem(idx);
      this.locationDetailService.getqtyoh({ld_part:item.pt_part,ld_site:controls.wo_site.value}).subscribe((response: any) => (updateItem.qty_oh = response.data[0].ld_qty_oh));
        updateItem.wo_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        updateItem.um = item.pt_um;
        updateItem.wo_status = "F";
        updateItem.wo_bom_code = item.pt_bom_code;
        updateItem.wo_bo_chg = item.dec01
        updateItem.color = item.pt_break_cat
        updateItem.micronage = item.int01
        this.color = item.pt_break_cat
        this.vitesse = item.int03
        updateItem.int01=item.int01,
        updateItem.int02=item.int02,
        updateItem.wo_batch=item.pt_break_cat,
        updateItem.wo_grade=item.pt_group
       
        if (this.vitesse == 0 || this.vitesse == null){this.vitesse = 530}
      
        updateItem.wo_lead_time = this.vitesse
        
        this.gridService.updateItem(updateItem);
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
   console.log(this.rowkctr)
    this.itemsService

      .getProd({pt_origin:this.rowkctr})
      .subscribe((response: any) => (this.items = response.data
        
      ));
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
    this.providersService
      .getAll()
      .subscribe((response: any) => (this.vends = response.data));
  }
  openvend(content) {
    this.prepareGridvend();
    this.modalService.open(content, { size: "lg" });
  }


  handleSelectedRowsChangedgamme(e, args) {
    const controls = this.woForm.controls;
    let so_job:any;
    
    if (Array.isArray(args.rows) && this.gridObjgamme) {
      args.rows.map((idx) => {
        const item = this.gridObjgamme.getDataItem(idx);
    console.log(item)
        controls.wo_routing.setValue(item.ro_routing || "");
        this.gamme = item.ro_routing;
        this.rowkctr=item.ro_wkctr;
        let ofdate = controls.wo_ord_date.value ? `${controls.wo_ord_date.value.year}/${controls.wo_ord_date.value.month}/${controls.wo_ord_date.value.day}` : null
        
    
    let nbr = 0
    this.workOrderService.getByDistinct({wo_routing:controls.wo_routing.value}).subscribe(
      (res: any) => {if (res.data.length != 0) {nbr = res.data.length + 1}
      else{nbr = 1} 
       controls.wo_so_job.setValue('P-'+ controls.wo_routing.value +  '-' + String('0000'+ String(nbr)).slice(-4))})
        
        this.workOrderService.getBy({wo_so_job:'P-'+ controls.wo_routing.value +  '-' + String('0000'+ String(nbr)).slice(-4)}).subscribe(
          (res: any) => {        
          this.dataset  = res.data;
          // let version = 1;
          // if(res.data != null){version = Number(res.data.wo_rev) + 1}
          // controls.wo_rev.setValue(version)
         if(res.data.length != 0){this.creation = false;}
          for (let item of this.dataset){
            var maxObj = null;
            var iddd = 0;
            if (this.dataset.length > 0) {
            maxObj = this.dataset.reduce((accumulator, current) => {
            return accumulator.id > current.id ? accumulator : current;
          });
          console.log(maxObj.id + 1);
          iddd = maxObj.id + 1;
        
          } else { iddd = 1}
          console.log(iddd,item.id)
          this.gridService.addItem(
            {
              id: item.id,
             line: item.wo_queue_eff,
             oldline: item.wo_queue_eff,
      
        wo_part: item.wo_part,
        oldpart: item.wo_part,
        
        wo_nbr:item.wo_nbr,
        woid:item.id,
        cmvid: "",
        desc: "",
        wo_qty_ord: item.wo_qty_ord,
        wo_bo_chg:item.wo_bo_chg,
        qty:item.wo_qty_ord,
        um:"CT",
        olddate:new Date(item.wo_rel_date),
        wo_rel_date: new Date(item.wo_rel_date),
        wo_due_date:new Date(item.wo_due_date),
        chr01:item.chr01,
        chr02:item.chr02,
        chr03:String(Number(item.chr03).toFixed(0)),
        wo_status: item.wo_status,
        wo_bom_code: item.wo_bom_code,
        wo_lead_time:item.wo_lead_time,
       
        wo_vend: item.wo_vend,
        
        wo_prod_pct: item.wo_prod_pct,
        color:item.wo_batch,
        micronage:item.item.int01,
        
                      int01:item.item.int01,
                      int02:item.item.int02,
                      wo_batch:item.wo_batch,
                      wo_grade:item.wo_grade,
                      dec01:item.dec01,
            },
            { position: "bottom" }
            
          )
        this.lancement = new Date(item.wo_due_date),
      this.debut = item.chr02}},)
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
      {
        id: "ro_wkctr",
        name: "Centre de charge",
        field: "ro_wkctr",
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
    this.workRoutingService
      .getAllDistinct()
      .subscribe((response: any) => (this.gammes = response.data));
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
        
     
        updateItem.wo_bom_code = item.ptb_bom;
      
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
        name: "code formule",
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
    
    this.bomPartService
      .getBy({ptb_part : this.part})
      .subscribe((response: any) => { console.log(response.data);
        (this.boms = response.data)});
  }
  openbom(content) {
    this.prepareGridbom();
    this.modalService.open(content, { size: "lg" });
  }
  onAlertClose($event) {
    this.hasFormErrors = false;
  }
  handleSelectedRowsChanged6(e, args) {
    const controls = this.woForm.controls
    if (Array.isArray(args.rows) && this.gridObj6) {
        args.rows.map((idx) => {
            const cause = this.gridObj6.getDataItem(idx)
            console.log(cause)
            controls.wo_rmks.setValue(cause.rsn_desc || "")

        })
    }
}
angularGridReady6(angularGrid: AngularGridInstance) {
    this.angularGrid6 = angularGrid
    this.gridObj6 = (angularGrid && angularGrid.slickGrid) || {}
}
prepareGrid6() {
    const controls = this.woForm.controls
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
        .getBy ({rsn_type: 'WORKORDERCHANGE' })
        .subscribe((response: any) => (this.causes = response.data))
     
}
open6(content) {
    this.prepareGrid6()
    this.modalService.open(content, { size: "lg" })
}
printpdf(nbr) {
  // const controls = this.totForm.controls
  const controlss = this.woForm.controls;
  console.log("pdf");
  var doc = new jsPDF('l');
let date = new Date()
  // doc.text('This is client-side Javascript, pumping out a PDF.', 20, 30);
  var img = new Image();
  img.src = "./assets/media/logos/companyentete.png";
  doc.addImage(img, "png", 200, 5, 50, 30);
  doc.setFontSize(9);
  if (this.domain.dom_name != null) {
    doc.text(this.domain.dom_name, 10, 10);
  }
  if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
  if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
  if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
  doc.setFontSize(14);

  doc.line(10, 35, 200, 35);
  doc.setFontSize(12);
  doc.text("Programme Thermoformage N° : " + nbr, 70, 45);
  doc.text("Date: " + date.toLocaleDateString() , 200, 40);
  doc.text("Heure: " + new Date().toLocaleTimeString(), 200, 50);
  // doc.text("Edité par: " + this.user.usrd_code, 160, 55);
  // if(this.user1 != null){  doc.text("Fait par: " + this.user1, 20, 83)};
  // if(this.user2 != null){doc.text("Et: " + this.user2, 90, 83);}
  
  // doc.setFontSize(8);
  // //console.log(this.provider.ad_misc2_id)
  // doc.text("Fournisseur : " + this.provider.ad_addr, 20, 50);
  // doc.text("Nom             : " + this.provider.ad_name, 20, 55);
  // doc.text("Adresse       : " + this.provider.ad_line1, 20, 60);
  // if (this.provider.ad_misc2_id != null) {
  //   doc.text("MF          : " + this.provider.ad_misc2_id, 20, 65);
  // }
  // if (this.provider.ad_gst_id != null) {
  //   doc.text("RC          : " + this.provider.ad_gst_id, 20, 70);
  // }
  // if (this.provider.ad_pst_id) {
  //   doc.text("AI            : " + this.provider.ad_pst_id, 20, 75);
  // }
  // if (this.provider.ad_misc1_id != null) {
  //   doc.text("NIS         : " + this.provider.ad_misc1_id, 20, 80);
  // }

  doc.line(10, 85, 250, 85);
  doc.line(10, 90, 250, 90);
  doc.line(10, 85, 10, 90);
  doc.text("Ordre", 11, 88.5);
  doc.line(25, 85, 25, 90);
  doc.text("Article", 26, 88.5);
  doc.line(65, 85, 65, 90);
  doc.text("Qualite", 67, 88.5);
  doc.line(80, 85, 80, 90);
  doc.text("Couleur", 82, 88.5);
  doc.line(120, 85, 120, 90);
  doc.text("Micron", 123, 88.5);
  doc.line(140, 85, 140, 90);
  doc.text("Laize", 143, 88.5);
  doc.line(160, 85, 160, 90);
  doc.text("tonage", 162, 88.5);
  doc.line(180, 85, 180, 90);
  doc.text("Stock", 182, 88.5);
  doc.line(200, 85, 200, 90);
  doc.text("Qté Prod", 202, 88.5);
  doc.line(220, 85, 220, 90);
  doc.text("SAAT", 223, 88.5);
  doc.line(250, 85, 250, 90);
  var i = 95;
  doc.setFontSize(6);
  let total = 0;
  let ttc = 0;
  for (let j = 0; j < this.dataset.length; j++) {
    total = total +  Number(this.dataset[j].tr_qty_loc);
    ttc = ttc +  Number(this.dataset[j].tr_qty_loc) * Number(this.dataset[j].tr_price);
    if (j % 20 == 0 && j != 0) {
      doc.addPage();
      img.src = "./assets/media/logos/companyentete.png";
      doc.addImage(img, "png", 200, 5, 50, 30);
      doc.setFontSize(9);
      if (this.domain.dom_name != null) {
        doc.text(this.domain.dom_name, 10, 10);
      }
      if (this.domain.dom_addr != null) doc.text(this.domain.dom_addr, 10, 15);
      if (this.domain.dom_city != null) doc.text(this.domain.dom_city + " " + this.domain.dom_country, 10, 20);
      if (this.domain.dom_tel != null) doc.text("Tel : " + this.domain.dom_tel, 10, 30);
      doc.setFontSize(14);
      doc.line(10, 35, 200, 35);

      doc.setFontSize(12);
      doc.text("Programme Thermoformage N° : " + nbr, 70, 40);
      doc.text("Date: " + date.toLocaleDateString() , 200, 40);
      doc.text("Heure: " + new Date().toLocaleTimeString(), 200, 50);
      doc.text("Edité par: " + this.user.usrd_code, 200, 55);
      // if(this.user1 != null){  doc.text("Fait par: " + this.user1, 20, 83)};
      // if(this.user2 != null){doc.text("Et: " + this.user2, 90, 83);}
      
      // doc.setFontSize(8);
      // console.log(this.provider.ad_misc2_id);
      // doc.text("Fournisseur : " + this.provider.ad_addr, 20, 50);
      // doc.text("Nom             : " + this.provider.ad_name, 20, 55);
      // doc.text("Adresse       : " + this.provider.ad_line1, 20, 60);
      // if (this.provider.ad_misc2_id != null) {
      //   doc.text("MF          : " + this.provider.ad_misc2_id, 20, 65);
      // }
      // if (this.provider.ad_gst_id != null) {
      //   doc.text("RC          : " + this.provider.ad_gst_id, 20, 70);
      // }
      // if (this.provider.ad_pst_id) {
      //   doc.text("AI            : " + this.provider.ad_pst_id, 20, 75);
      // }
      // if (this.provider.ad_misc1_id != null) {
      //   doc.text("NIS         : " + this.provider.ad_misc1_id, 20, 80);
      // }

      doc.line(10, 85, 250, 85);
      doc.line(10, 90, 250, 90);
      doc.line(10, 85, 10, 90);
      doc.text("Ordre", 11, 88.5);
      doc.line(25, 85, 25, 90);
      doc.text("Article", 26, 88.5);
      doc.line(65, 85, 65, 90);
      doc.text("Qualite", 67, 88.5);
      doc.line(80, 85, 80, 90);
      doc.text("Couleur", 82, 88.5);
      doc.line(120, 85, 120, 90);
      doc.text("Micron", 123, 88.5);
      doc.line(140, 85, 140, 90);
      doc.text("Laize", 143, 88.5);
      doc.line(160, 85, 160, 90);
      doc.text("tonage", 162, 88.5);
      doc.line(180, 85, 180, 90);
      doc.text("Stock", 182, 88.5);
      doc.line(200, 85, 200, 90);
      doc.text("Qté Prod", 202, 88.5);
      doc.line(220, 85, 220, 90);
      doc.text("SAAT", 223, 88.5);
      doc.line(250, 85, 250, 90);
    i = 95;
      doc.setFontSize(6);
    }

    
      doc.line(10, i - 5, 10, i);
      doc.text(String(this.dataset[j].line), 15, i - 1);
      doc.line(25, i - 5, 25, i);
      doc.text(this.dataset[j].wo_part, 26, i - 1);
      doc.line(65, i - 5, 65, i);
      doc.text(this.dataset[j].wo_bom_code, 67, i - 1);
      doc.line(80, i - 5, 80, i);
      doc.text(String(this.dataset[j].wo_batch), 82, i - 1);
      doc.line(120, i - 5, 120, i);
      doc.text(String(this.dataset[j].int01), 123, i - 1);
      doc.line(140, i - 5, 140, i);
      doc.text(String(this.dataset[j].int02), 143, i - 1);
      doc.line(160, i - 5, 160, i);
      doc.text(String(this.dataset[j].dec01), 162, i - 1);
      doc.line(180, i - 5, 180, i);
      doc.text(String(this.dataset[j].qty_oh), 182, i - 1);
      doc.line(200, i - 5, 200, i);
      doc.text(String((this.dataset[j].wo_qty_ord)), 202, i - 1);
      doc.line(220, i - 5, 220, i);
      doc.text(String((this.dataset[j].chr03)), 223, i - 1);
      doc.line(250, i - 5, 250, i);
      doc.line(10, i, 250, i);
      i = i + 5;
    
  }

  // doc.line(10, i - 5, 200, i - 5);

  // doc.line(130, i + 7, 205, i + 7);
  // doc.line(130, i + 14, 205, i + 14);
  // //  doc.line(130, i + 21, 200, i + 21 );
  // //  doc.line(130, i + 28, 200, i + 28 );
  // //  doc.line(130, i + 35, 200, i + 35 );
  // doc.line(130, i + 7, 130, i + 14);
  // doc.line(160, i + 7, 160, i + 14);
  // doc.line(205, i + 7, 205, i + 14);
  doc.setFontSize(10);

  // doc.text("NOMBRE DE BIG BAG     " + String(this.dataset.length) + "    ,Total POIDS:   " + String(Number(total)), 40, i + 12, { align: "left" });
  // doc.text("Validé par: " , 20, i + 22);
  // doc.text("Note: " , 20, i + 32);
  //  doc.text('TVA', 140 ,  i + 19 , { align: 'left' });
  //  doc.text('Timbre', 140 ,  i + 26 , { align: 'left' });
  //  doc.text('Total TC', 140 ,  i + 33 , { align: 'left' });

  // doc.text(String(Number(total)), 198, i + 12, { align: "right" });
  //  doc.text(String(Number(controls.tva.value)), 198 ,  i + 19 , { align: 'right' });
  //  doc.text(String(Number(controls.timbre.value)), 198 ,  i + 26 , { align: 'right' });
  //  doc.text(String(Number(controls.ttc.value))), 198 ,  i + 33 , { align: 'right' });

  // doc.setFontSize(8);
  // let mt = NumberToLetters(Number(ttc), "Dinars Algerien");

  // if (mt.length > 95) {
  //   let mt1 = mt.substring(90);
  //   let ind = mt1.indexOf(" ");

  //   mt1 = mt.substring(0, 90 + ind);
  //   let mt2 = mt.substring(90 + ind);

  //   doc.text("Arretée la présente Commande a la somme de :" + mt1, 20, i + 53);
  //   doc.text(mt2, 20, i + 60);
  // } else {
  //   doc.text("Arretée la présente Commande a la somme de :" + mt, 20, i + 53);
  // }
  // window.open(doc.output('bloburl'), '_blank');
  //window.open(doc.output('blobUrl'));  // will open a new tab
  doc.save('PE-' + nbr + '.pdf')
  var blob = doc.output("blob");
  window.open(URL.createObjectURL(blob));
}
  }







