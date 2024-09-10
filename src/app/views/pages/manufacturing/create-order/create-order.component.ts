import { Component, OnInit } from "@angular/core";
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../../../../environments/environment"
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
  InventoryTransaction,
  InventoryTransactionService,

} from "../../../../core/erp";
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
  selector: 'kt-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {


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
  seq : any;
  nof : any;  
  row_number;
  message = "";
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
    private inventoryTransactionService: InventoryTransactionService,
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
            
            
            if(args.dataContext.woid != null) {this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,wo_status:'A',wo_due_date:this.lancement,chr02:this.debut,chr03:'0' });this.deletedid = Number(args.dataContext.line) + 1;}
            else{this.deletedid = args.dataContext.line;this.angularGrid.gridService.deleteItem(args.dataContext);}
            let i = 0;
            let iteration = this.dataset.length
            for(i = this.deletedid ; i<= iteration ; ){
              
              let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
              console.log(this.deletedid,i)
              i = Number(i) + 1
              if(updateItem.wo_status == 'A'){this.jours = 0} else {this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60}
                this.echeance = addMs(new Date(this.lancement),this.jours)
                this.fin = new Date(this.echeance).toLocaleTimeString()
                
                this.gridService.updateItemById(args.dataContext.id = updateItem.id,{id:updateItem.id, line: Number(i) - 1,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,um:updateItem.um,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),wo_lead_time:updateItem.wo_lead_time})
                this.lancement = this.echeance,
                this.debut = this.fin    
              
            }
            
           
           
           
          }
        },
      },

      {
        id: "line",
        name: "Ligne",
        field: "line",
        minWidth: 30,
        maxWidth: 30,
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
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,wo_rel_date:this.lancement,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60) })
          this.lancement = this.echeance
          this.debut = new Date(this.echeance).toLocaleTimeString()
          if(oldItem.wo_status == 'A'){this.jours = 0}else{this.jours = Number(Number(oldItem.wo_qty_ord) / (Number(oldItem.wo_lead_time))) *1000 * 60 * 60}
          this.echeance = addMs(new Date(this.lancement),this.jours)
          this.fin = new Date(this.echeance).toLocaleTimeString(),
          this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: Number(oldItem.line) + 1 ,woid:oldItem.woid,wo_nbr:oldItem.wo_nbr,wo_part: oldItem.wo_part,desc:oldItem.desc, wo_qty_ord:oldItem.wo_qty_ord,wo_rel_date: this.lancement, chr01:this.debut,wo_status: oldItem.wo_status,wo_bom_code: oldItem.wo_bom_code,  wo_vend: oldItem.wo_vend, wo_prod_pct: oldItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),wo_lead_time:oldItem.wo_lead_time})
          this.lancement = this.echeance
          this.debut = new Date(this.echeance).toLocaleTimeString()  
           let i = 0;
           for(i = Number(this.deletedid) + 1; i<=this.dataset.length; i++ ){
            
            let ofstatus ='F'
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            this.updateid = updateItem.id
            
              this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
              if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
              
              this.fin = new Date(this.echeance).toLocaleTimeString()
              console.log(updateItem.wo_status,nwid,this.jours,i,this.updateid,updateItem.line)
              if(Number(this.updateid) < Number(nwid)){
              this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: Number(updateItem.line) + 1 ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),wo_lead_time:updateItem.wo_lead_time})
            
              this.lancement = this.echeance,
              this.debut = this.fin;
            }
            if(Number(this.updateid) > Number(nwid)){
              this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line  ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),wo_lead_time:updateItem.wo_lead_time})
            
              this.lancement = this.echeance,
              this.debut = this.fin;
            }
              setTimeout(() => {
                console.log('delay');
              }, 20000);
         
          
          }
         
          
          
          
           
      }
    },
    {
      id: "wo_nbr",
      name: "N° OF",
      field: "wo_nbr",
      sortable: true,
      width: 80,
      filterable: false,
      
     
    },
      {
        id: "wo_part",
        name: "Article",
        field: "wo_part",
        sortable: true,
        width: 80,
        filterable: false,
        // editor: {
        //   model: Editors.text,
        //   required: true,
         

        // },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          this.itemsService.getByOne({pt_part: args.dataContext.wo_part }).subscribe((resp:any)=>{

            if (resp.data) {
             this.part = resp.data.pt_part
              if (resp.data.pt_pm_code == "M") {
                 this.color = resp.data.pt_break_cat
                 this.micronage = resp.data.int01
                 this.vitesse = resp.data.int03
                 if (this.vitesse == 0 || this.vitesse == null){this.vitesse = 530}
                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , desc: resp.data.pt_desc1 , um: resp.data.pt_um,wo_status : "F", wo_bom_code: resp.data.pt_bom_code,wo_lead_time: Number(this.vitesse) })
              } else {
                alert("Article N' est pas Production")
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_part: null })
              } 
            } else {

                      alert("Article Nexiste pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_part: null })
              
            } 
          })
        }  
       
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
        width: 150,
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
          if (args.dataContext.wo_qty_ord < 0){
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, wo_qty_ord:this.qty })
            this.message = "quantité négative interdite";
            this.hasFormErrors = true;
            return;
          }
          if( args.dataContext.qty == 0 ){
            if(this.lancement == null)  {this.lancement = new Date(), this.debut = new Date().toLocaleTimeString()}
            else{this.lancement = new Date(args.dataContext.wo_rel_date),this.debut = args.dataContext.chr01}
            this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
            this.echeance = addMs(new Date(args.dataContext.wo_rel_date),this.jours)
                this.fin = new Date(this.echeance).toLocaleTimeString(),
                this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_rel_date:this.lancement,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),qty:args.dataContext.wo_qty_ord })
                this.lancement = this.echeance
                this.debut = new Date(this.echeance).toLocaleTimeString()    
            
              
          } 
          else { 
            
             
              this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
              this.lancement = new Date(args.dataContext.wo_rel_date)
              this.debut     = args.dataContext.chr01
              this.echeance = addMs(new Date(args.dataContext.wo_rel_date),this.jours)
              this.fin = new Date(this.echeance).toLocaleTimeString(),
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext, wo_due_date: this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60) })
              this.lancement = this.echeance
              this.debut = new Date(this.echeance).toLocaleTimeString()
          }
          this.deletedid = args.dataContext.line
          let i = 0;
          for(i = Number(this.deletedid) +1 ; i<=this.dataset.length; i++ ){
            let ofstatus ='F'
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            this.updateid = updateItem.id
            this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
            if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
            
            this.fin = new Date(this.echeance).toLocaleTimeString()
            console.log(i,this.updateid,updateItem.line)
            this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),wo_lead_time:updateItem.wo_lead_time})
            this.lancement = this.echeance,
            this.debut = this.fin;
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
        width: 100,
        filterable: false,
        formatter: Formatters.dateTimeIso ,
        type: FieldType.dateTime,
        editor: {
          model: Editors.text,
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
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60) })
          this.lancement = this.echeance
          this.debut = new Date(this.echeance).toLocaleTimeString()
          
          this.deletedid = args.dataContext.line
          let i = 0;
          for(i = Number(this.deletedid) ; i<=this.dataset.length; ){
            i = i + 1
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            let ofstatus = 'F'
            this.updateid = updateItem.id
            this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
            if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
            
            this.fin = new Date(this.echeance).toLocaleTimeString()
            console.log(i,this.updateid,updateItem.line)
            this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),wo_lead_time:updateItem.wo_lead_time})
            this.lancement = this.echeance,
            this.debut = this.fin;
            setTimeout(() => {
              console.log('delay');
            }, 20000);
       
          
          }
        } 
       
      },
      // {
      //   id: "chr01",
      //   name: "Heure lancement",
      //   field: "chr01",
      //   sortable: true,
      //   width: 100,
      //   filterable: false,
       
           
      // },
      {
        id: "wo_due_date",
        name: "Date Echéance",
        field: "wo_due_date",
        sortable: true,
        width: 100,
        filterable: false,
        formatter: Formatters.dateTimeIso ,
        type: FieldType.dateTime,
        // editor: {
        //   model: Editors.date,
        // },
       
      },
      {
        id: "chr03",
        name: "Temps Production",
        field: "chr03",
        sortable: true,
        width: 100,
        filterable: false,
        
      },
      {
        id: "wo_bom_code",
        name: "Code Formule",
        field: "wo_bom_code",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        // editor: {
        //     model: Editors.text,
        //     required: true,
          
        // },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          this.bomService.getBy({bom_parent: args.dataContext.wo_bom_code }).subscribe((resp:any)=>{

          
            if (resp.data) {
             
               
                 this.gridService.updateItemById(args.dataContext.id,{...args.dataContext ,  wo_bom_code: resp.data.bom_parent })
               
            } else {

                      alert("Code Formule N' existe pas")
                      this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_bom_code: null })
              
            } 
          })
        }  
        
      },
      {
        id: "bomvid",
        field: "bomvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openBomsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      {
        id: "wo_lot_next",
        name: "Lot/Serie",
        field: "wo_lot_next",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
            model: Editors.text,
          
        },
    
        
      },
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
          this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60) })
          this.lancement = this.echeance
          this.debut = new Date(this.echeance).toLocaleTimeString()
          
          this.deletedid = args.dataContext.line
          let i = 0;
          for(i = Number(this.deletedid) ; i<=this.dataset.length; ){
            i = i + 1
            let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
            this.updateid = updateItem.id
            this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
            this.echeance = addMs(this.lancement,this.jours)
            this.fin = new Date(this.echeance).toLocaleTimeString()
            console.log(i,this.updateid,updateItem.line)
            this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_rel_date: this.lancement, chr01:this.debut,wo_status: updateItem.wo_status,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,wo_lead_time:updateItem.wo_lead_time,chr03:Number(this.jours)/(1000*60*60)})
            this.lancement = this.echeance,
            this.debut = this.fin;
            setTimeout(() => {
              console.log('delay');
            }, 20000);
       
          
          }
          }
          else{
            if(args.dataContext.wo_status == 'R'){
            this.jours = Number(Number(args.dataContext.wo_qty_ord) / (Number(args.dataContext.wo_lead_time))) *1000 * 60 * 60
            this.lancement = new Date()
            this.debut     = new Date().toLocaleTimeString()
            this.echeance = addMs(this.lancement,this.jours)
            this.fin = new Date(this.echeance).toLocaleTimeString(),
            this.gridService.updateItemById(args.dataContext.id,{...args.dataContext,chr01:this.debut, wo_due_date: this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60) })
            this.lancement = this.echeance
            this.debut = new Date(this.echeance).toLocaleTimeString()
            
            this.deletedid = args.dataContext.line
            let i = 0;
            
            for(i = Number(this.deletedid) ; i<=this.dataset.length; ){
              i = i + 1
              let ofstatus = 'F'
              let updateItem = this.gridService.getDataItemByRowIndex(i - 1);
              this.updateid = updateItem.id
              this.jours = Number(Number(updateItem.wo_qty_ord) / (Number(updateItem.wo_lead_time))) *1000 * 60 * 60
              if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){this.echeance = this.lancement,ofstatus = updateItem.wo_status}else{this.echeance = addMs(this.lancement,this.jours),ofstatus='F'}
              this.fin = new Date(this.echeance).toLocaleTimeString()
              console.log(i,this.updateid,updateItem.line)
              // if (updateItem.wo_status == 'A' || updateItem.wo_status == 'D'){ofstatus = updateItem.wo_status} else{ofstatus = 'F'}
              this.gridService.updateItemById(args.dataContext.id = this.updateid,{id:this.updateid, line: updateItem.line ,woid:updateItem.woid,wo_nbr:updateItem.wo_nbr,wo_part: updateItem.wo_part,desc:updateItem.desc, wo_qty_ord:updateItem.wo_qty_ord,wo_rel_date: this.lancement, chr01:this.debut,wo_status: ofstatus,wo_bom_code: updateItem.wo_bom_code,  wo_vend: updateItem.wo_vend, wo_prod_pct: updateItem.wo_prod_pct,wo_due_date:this.echeance,chr02:this.fin,chr03:Number(this.jours)/(1000*60*60),wo_lead_time:updateItem.wo_lead_time})
              this.lancement = this.echeance,
              this.debut = this.fin;
              setTimeout(() => {
                console.log('delay');
              }, 20000);
        
            
            }
            }
          }
        }  
      },
      
      {
        id: "wo_vend",
        name: "Fournisseur",
        field: "wo_vend",
        sortable: true,
        width: 80,
        filterable: false,
        type: FieldType.string,
        editor: {
          model: Editors.text,
          required: true,
         

        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          
          this.providersService.getBy({vd_addr: args.dataContext.wo_vend }).subscribe((resp:any)=>{

            if (resp.data) {
             
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_vend: resp.data.vd_addr })
       
            }else {

              alert("Fournisseur N'existe pas")
              this.gridService.updateItemById(args.dataContext.id,{...args.dataContext , wo_vend: null })


            } 
          })
        }  
        
      },
      {
        id: "vendvid",
        field: "vendvid",
        excludeFromHeaderMenu: true,
        formatter: Formatters.infoIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.row_number = args.row;
          let element: HTMLElement = document.getElementById(
            "openVendsGrid"
          ) as HTMLElement;
          element.click();
        },
      },
      
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
        width: 80,
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
    
  }

  //create form
  createForm() {
    this.loadingSubject.next(false);
    this.workOrder = new WorkOrder();
    const date = new Date;
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
      }
  //reste form
  reset() {
    this.workOrder = new WorkOrder();
    this.createForm();
    this.hasFormErrors = false;
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
              alert("Site n'existe pas")
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
              alert("gamme n'existe pas")
              controls.wo_routing.setValue("")
              document.getElementById("routing").focus();
            } 
     })
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
                      line: item.wo_queue_eff,
                      woid:item.id,
                      wo_nbr:item.wo_nbr, 
                      wo_part: item.wo_part,
                      cmvid: "",
                      desc: "",
                      wo_qty_ord: item.wo_qty_ord,
                      qty:item.wo_qty_ord,
                      olddate: new Date(item.wo_rel_date),
                      wo_rel_date: new Date(item.wo_rel_date),
                      wo_due_date:new Date(item.wo_due_date),
                      chr01:item.chr01,
                      chr02:item.chr02,
                      chr03:item.chr03,
                      wo_status: item.wo_status,
                      wo_bom_code: item.wo_bom_code,
                      wo_vend: item.wo_vend,
                      wo_lead_time:item.wo_lead_time,
                      wo_prod_pct: item.wo_prod_pct,
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
              alert("programme n'existe pas pour cette gamme")
              controls.wo_so_job.setValue("")
              document.getElementById("job").focus();
            }
            else{
              this.workOrderService.getBy({wo_so_job:controls.wo_so_job.value}).subscribe(
                (res: any) => {        
                  this.dataset  = res.data;
                  
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
                      line: item.wo_queue_eff,
                      woid:item.id,
                      wo_nbr:item.wo_nbr, 
                      wo_part: item.wo_part,
                      cmvid: "",
                      desc: "",
                      wo_qty_ord: item.wo_qty_ord,
                      qty:item.wo_qty_ord,
                      olddate:new Date(item.wo_rel_date),
                      wo_rel_date: new Date(item.wo_rel_date),
                      wo_due_date:new Date(item.wo_due_date),
                      chr01:item.chr01,
                      chr02:item.chr02,
                      chr03:item.chr03,
                      wo_status: item.wo_status,
                      wo_bom_code: item.wo_bom_code,
                      wo_vend: item.wo_vend,
                      wo_lead_time:item.wo_lead_time,
                        wo_prod_pct: item.wo_prod_pct,
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
      
      if (this.dataset[i].wo_bom_code == "" || this.dataset[i].wo_bom_code == null  ) {
       this.message = "Code formule ne peut pas etre vide";
       this.hasFormErrors = true;
       return;
      }
      }

    this.sequenceService.getByOne({ seq_type: "OF", seq_profile: this.user.usrd_profile }).subscribe(
      (response: any) => {
    this.seq = response.data 
        
        if (this.seq) {
         this.nof = `${this.seq.seq_prefix}-${Number(this.seq.seq_curr_val)+1}`

         this.sequenceService.update(this.seq.id,{ seq_curr_val: Number(this.seq.seq_curr_val )+1 }).subscribe(
          (reponse) => console.log("response", Response),
          (error) => {
            this.message = "Erreur modification Sequence";
            this.hasFormErrors = true;
            return;
       
          
          },
          )
    
    let wo = this.prepare()
    this.addIt( this.dataset,wo, this.nof);

  }else {
    this.message = "Parametrage Manquant pour la sequence";
    this.hasFormErrors = true;
    return;

   }


})



    

    
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
   addIt( detail: any, it, nof) {
    for (let data of detail) {
      delete data.id;
      delete data.desc;
      delete data.cmvid;
     
    }
    this.loadingSubject.next(true);
    const controls = this.woForm.controls;
    
    this.workOrderService
      .add({detail, it,nof})
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
      this.router.navigateByUrl("/manufacturing/list-wo")
        }
      );
      this.inventoryTransactionService.ORDWO(it).subscribe(
        (reponse) => console.log("response", reponse),
        (error) => {
            this.layoutUtilsService.showActionNotification(
                "Erreur verifier les informations",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
        },
        () => {
            this.layoutUtilsService.showActionNotification(
                "imprimé avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            controls.ref.setValue(null)
            // this.router.navigateByUrl("/")
        }
    )
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
    for (var i = 0; i < this.dataset.length; i++) {
      
      if (this.dataset[i].wo_part == "" || this.dataset[i].wo_part == null  ) {
       this.message = "L' article ne peut pas etre vide";
       this.hasFormErrors = true;
       return;
  
      }
      if (this.dataset[i].wo_qty_ord == 0  ) {
        this.message = "La quantité ne peut pas etre nulle";
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
        woid:null,
        wo_nbr:"",
        wo_part: "",
        cmvid: "",
        desc: "",
        wo_qty_ord: 0,
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
      
        updateItem.wo_part = item.pt_part;
        updateItem.desc = item.pt_desc1;
        updateItem.um = item.pt_um;
        updateItem.wo_status = "F";
        updateItem.wo_bom_code = item.pt_bom_code;
        
        this.part = item.pt_part
        this.color = item.pt_break_cat
        this.micronage = item.int01
        this.vitesse = item.int03
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
        so_job = item.ro_routing + '-' + String(new Date().getFullYear()) + String(new Date().getMonth() + 1) + String(new Date().getDate()),
        controls.wo_so_job.setValue(so_job)
        this.workOrderService.getBy({wo_so_job:so_job}).subscribe(
          (res: any) => {        
          this.dataset  = res.data;
          // let version = 1;
          // if(res.data != null){version = Number(res.data.wo_rev) + 1}
          // controls.wo_rev.setValue(version)
         
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
      
        wo_part: item.wo_part,
        wo_nbr:item.wo_nbr,
        woid:item.id,
        cmvid: "",
        desc: "",
        wo_qty_ord: item.wo_qty_ord,
        qty:item.wo_qty_ord,
        olddate:new Date(item.wo_rel_date),
        wo_rel_date: new Date(item.wo_rel_date),
        wo_due_date:new Date(item.wo_due_date),
        chr01:item.chr01,
        chr02:item.chr02,
        chr03:item.chr03,
        wo_status: item.wo_status,
        wo_bom_code: item.wo_bom_code,
        wo_lead_time:item.wo_lead_time,
        wo_vend: item.wo_vend,
        
        wo_prod_pct: item.wo_prod_pct,
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

  }






