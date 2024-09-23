import { Component, OnInit } from '@angular/core';



import {
  Formatter,
  Editor,
  Editors,
  OnEventArgs,
  AngularGridInstance,
  Aggregators,
  Column,
  DelimiterType,
  FieldType,
  FileType,
  Filters,
  Formatters,
  FlatpickrOption,
  GridService,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  MultipleSelectOption,
  OperatorType,
  OperatorString,
  SearchTerm,
  GridStateChange,
  Metrics,
} from "angular-slickgrid"

import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import {  InventoryTransaction, InventoryTransactionService, ItemService,AddressService,CodeService, LabelService, Label,PrintersService,} from "../../../../core/erp"
import { Reason, ReasonService} from "../../../../core/erp"
import {
  NgbDropdownConfig,
  NgbTabChangeEvent,
  NgbTabsetConfig,
  
} from "@ng-bootstrap/ng-bootstrap";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { findLastKey } from "lodash"
import { PAUSE } from '@angular/cdk/keycodes';
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const defaultPageSize = 100;
  const API_URL_codes = environment.apiUrl + "/codes"
  
const myCustomTimeFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
value.substring(11,19)  ;
const myyearFormatter: Formatter = (row: number, cell: number, valueYEAR: any, columnDef: Column, dataContext: any, grid?: any) =>
valueYEAR.substring(0,4)  ;
const mymonthFormatter: Formatter = (row: number, cell: number, valueMONTH: any, columnDef: Column, dataContext: any, grid?: any) =>
valueMONTH.substring(5,7)  ;


declare var ElectronPrinter3: any;
declare var Edelweiss: any;
@Component({
  selector: 'kt-edit-transaction-list',
  templateUrl: './edit-transaction-list.component.html',
  styleUrls: ['./edit-transaction-list.component.scss']
})

export class EditTransactionListComponent implements OnInit {
  currentPrinter: string;
  PathPrinter: string;
  datasetPrint = [];
 nom :any;
  dataprinter: [];
  columnDefinitionsprinter: Column[] = [];
  gridOptionsprinter: GridOption = {};
  gridObjprinter: any;

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

  provider: any;
  row_number: any;
  angularGridprinter: AngularGridInstance;
  loadingSubject = new BehaviorSubject<boolean>(true);
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  copydataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  metrics!: Metrics;
  WithPagination = true;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  grid: any;
  gridService: GridService;
  dataview: any;
  trLines : any [] = []
  tr_type: any[] = [];
  trForm: FormGroup;
  elem: any[] = [];
  tab: any[] = [] ;
  datefilter: any;
  index: any;
  hasFormErrors = false;
  isExist = false;
  user : any;
  data: any[];
  oldata: any[];
  message = "";
  trlot: string;
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private trFB: FormBuilder,
      config: NgbDropdownConfig,
      private modalService: NgbModal,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private codeService: CodeService,
      private inventoryTransactionService: InventoryTransactionService,
      private labelService: LabelService,
      private addressService: AddressService,
      private itemsService: ItemService,
      private printerService: PrintersService,
 
  ) {
   
    
    
   //this.elem = [{value: '', label: ''},];
    
   //this.elem = [{value: '', label: ''},{value: 'ISS-SO', label: 'ISS-SO'}];
    
  
  //  this.prepareGrid() 

  }

  ngOnInit(): void {
    
    this.user = JSON.parse(localStorage.getItem("user"));
    this.currentPrinter = this.user.usrd_dft_printer;
      this.printerService.getByPrinter({ printer_code: this.currentPrinter }).subscribe(
        (reponse: any) => ((this.PathPrinter = reponse.data.printer_path), console.log(this.PathPrinter)),
        (error) => {
          this.message = "veuillez verifier l'imprimante";
          this.isExist = true;
          return;
        }
      );
    this.createForm();
    this.prepareGrid();
    this.trlist();
   
  }

  createForm() {
    const date = new Date ;
    date.setDate(date.getDate() - 2);
    const date1 = new Date;
    this.trForm = this.trFB.group({
    
      date: [{
        year:date.getFullYear(),
        month: date.getMonth()+1,
        day: 1
      }],
      date1: [{
        year:date1.getFullYear(),
        month: date1.getMonth()+1,
        day: date1.getDate()
      }],
      printer: [this.user.usrd_dft_printer],
      
    
    });
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  prepareGrid() {


    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
 this.datefilter =  String(currentYear) + '-' + String(currentMonth) + '-' + '01'
     
      this.columnDefinitions = [
          
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
            id: "supp",
            field: "supp",
            excludeFromHeaderMenu: true,
            formatter: Formatters.deleteIcon,
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
              if (confirm("Êtes-vous sûr de supprimer cette ligne?")) {
                
                /*ajouter ligne tr_hist de suppression*/
                
                  this.index = this.dataset.findIndex((el) => {
                    return el.tr_line == args.dataContext.tr_line;
                  });
                  // args.dataContext.tr_qty_loc = args.dataContext.tr_qty_loc * -1;
                  
                  this.data = [];
                  
                  
                  let obj = {
                    tr_lot:args.dataContext.tr_lot,
                    tr_nbr:args.dataContext.tr_nbr,
                    tr_addr:args.dataContext.tr_addr,
                    tr_rmks:'CORRECTION ADMINISTRATION',
                    tr_gl_date: new Date(),
                    tr_effdate: args.dataContext.tr_effdate,
                    dec01:args.dataContext.dec01,
                    dec02:args.dataContext.dec02,
                    tr_line: args.dataContext.tr_line,
                    tr_part: args.dataContext.tr_part,
                    desc: args.dataContext.desc,
                    tr_qty_loc: args.dataContext.tr_qty_loc * - 1,
                    tr_um: args.dataContext.tr_um,
                    tr_um_conv: args.dataContext.tr_um_conv,
                    tr_price: args.dataContext.tr_price,
                    tr_site: args.dataContext.tr_site,
                    tr_loc: args.dataContext.tr_loc,
                    tr_serial: args.dataContext.tr_serial,
                    tr_ref: args.dataContext.tr_ref,
                    tr_status: args.dataContext.tr_status,
                    tr_expire: args.dataContext.tr_expire,
                  };
                  
                  this.data.push(obj);
                  let tr = obj;
                  this.trlot = args.dataContext.tr_lot;
                  // this.updatetrans(args.dataContext.id)
                  if(args.dataContext.tr_type == 'RCT-UNP') {this.addRCTUNP(this.data, tr, this.trlot)}
                  else{
                   if(args.dataContext.tr_type == 'ISS-UNP') {this.addISSUNP(this.data, tr, this.trlot)}
                   else{
                    if(args.dataContext.tr_type == 'RCT-WO') {this.addRCTWO(this.data, tr)}
                    else{
                     if(args.dataContext.tr_type == 'ISS-WO') {this.addISSWO(this.data,tr)}
                     else{ 
                      if(args.dataContext.tr_type == 'RJCT-WO') {this.addRJCTWO(this.data,tr)}
                     }
                    }
                   }
                  }
                  // }
                
                this.angularGrid.gridService.deleteItem(args.dataContext);
              }
            
            },
          },
          {
            id: "advid",
            name: "adresse",
            field: "advid",
            excludeFromHeaderMenu: true,
            formatter: Formatters.infoIcon,
            minWidth: 30,
            maxWidth: 30,
            onCellClick: (e: Event, args: OnEventArgs) => {
             
                this.row_number = args.row;
                let element: HTMLElement = document.getElementById("openvdGrid") as HTMLElement;
                element.click();
              
            },
          },
          
          {
            id: "tr_addr",
            name: "Adresse",
            field: "tr_addr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            editor: {
              model: Editors.text,
            },
            filter: {

             model: Filters.compoundInput , operator: OperatorType.rangeInclusive,
              
             },
            grouping: {
              getter: 'tr_addr',
              formatter: (g) => `Adresse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
             
              collapsed:true
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
          
           
            },
          }, 
          {
            id: "tr_oldaddr",
            name: "Adresse",
            field: "tr_oldaddr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            editor: {
              model: Editors.text,
            },
            filter: {

             model: Filters.compoundInput , operator: OperatorType.rangeInclusive,
              
             },
            grouping: {
              getter: 'tr_oldaddr',
              formatter: (g) => `Adresse: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
             
              collapsed:true
            },
            onCellChange: (e: Event, args: OnEventArgs) => {
          
           
            },
          }, 
          {
            id: "tr_part",
            name: "Article",
            field: "tr_part",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_part',
             
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
            
              collapsed:true
            }
          }, 
          {
            id: "tr_oldpart",
            name: "Article",
            field: "tr_oldpart",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_oldpart',
             
              formatter: (g) => `Article: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
            
              collapsed:true
            }
          },
          {
            id: "mvid",
            name: "Article",
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
            id: "tr_desc",
            name: "Description",
            field: "tr_desc",
            sortable: true,
            filterable: true,
            filter: { model: Filters.compoundInput , operator: OperatorType.rangeInclusive },

            type: FieldType.string,
            grouping: {
              getter: 'tr_desc',
              formatter: (g) => `Description: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
             
              collapsed:true
            }
          }, 
          {
            id: "tr__chr01",
            name: "FAMILLE",
            field: "tr__chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/types`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'tr__chr01',
              formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "tr__chr02",
            name: "COULEUR",
            field: "tr__chr02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/colors`),model: Filters.multipleSelect , operator: OperatorType.inContains },
            grouping: {
              getter: 'tr__chr02',
              formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "tr__chr03",
            name: "Etat",
            field: "tr__chr03",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {collectionAsync:  this.http.get(`${API_URL_codes}/etats`),model: Filters.multipleSelect , operator: OperatorType.inContains},
            grouping: {
              getter: 'tr__chr03',
              formatter: (g) => `Etat: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              lazyTotalsCalculation:true,
              collapsed:true
            }
            
          }, 
          {
            id: "tr_serial",
            name: "Lot",
            field: "tr_serial",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            editor: {
              model: Editors.text,
            },
            grouping: {
              getter: 'tr_serial',
              formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "tr_oldserial",
            name: "Lot",
            field: "tr_oldserial",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            editor: {
              model: Editors.text,
            },
            grouping: {
              getter: 'tr_oldserial',
              formatter: (g) => `Lot: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "tr_um",
            name: "UM",
            field: "tr_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          }, 
          {
            id: "tr_qty_chg",
            name: "Quantité trans",
            field: "tr_qty_chg",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          }, 
          {
            id: "tr_qty_loc",
            name: "Quantite",
            field: "tr_qty_loc",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            editor: {
              model: Editors.float,
              params: { decimalPlaces: 2 },
            },
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
            onCellChange: (e: Event, args: OnEventArgs) => {
              this.codeService.getByOne({code_fldname:'LIMIT',code_value:args.dataContext.tr__chr01}).subscribe((coderesp:any)=>{
                if(coderesp.data != null)
                {if(args.dataContext.tr_qty_loc > Number(coderesp.data.code_cmmt) || args.dataContext.tr_qty_loc < 0){
                this.gridService.updateItemById(args.dataContext.id, { ...args.dataContext, tr_qty_loc: args.dataContext.tr_qty_chg })
                this.message = "quantité ne peut pas dépasser limite";
                this.hasFormErrors = true;
                return;
              }}
            })
 
          
                
                
              
               
                
              
              
            },
          },
            {
            id: "tr_status",
            name: "Status",
            field: "tr_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            grouping: {
              getter: 'tr_status',
              formatter: (g) => `Status: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              aggregateCollapsed: true,
             
              collapsed:true
            }
          }, 


          {
            id: "tr_ref",
            name: "Reference",
            field: "tr_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'tr_ref',
              formatter: (g) => `Reference: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
               
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: true,
           
              collapsed:true
            }
          }, 
          
          {
            id: "tr_effdate",
            name: "Date Effet",
            field: "tr_effdate",
            nameKey: 'DATE EFFET',
            sortable: true,
          

            formatter: Formatters.dateIso, 
            minWidth: 75,
            width: 120,
            exportWithFormatter: true,

            type: FieldType.date,
            filterable: true,
            filter: {
              model: Filters.dateRange,
              operator: 'RangeInclusive',
              // override any of the Flatpickr options through "filterOptions"
              //editorOptions: { minDate: 'today' } as FlatpickrOption
            },
              
            grouping: {
              getter: 'tr_effdate',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },

          {
            id: "tr_program",
            name: "Heure",
            field: "tr_program",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.contains },
           

          },
          
          {
            id: "tr_type",
            name: "Type Transaction",
            field: "tr_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          
            filter: {

              
              // collectionAsync: this.elem,
              collectionAsync:  this.http.get(`${API_URL_codes}/trans`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
           
              model: Filters.multipleSelect , operator: OperatorType.inContains
             
              
              
             },
            //filter: {model: Filters.multipleSelect , operator: OperatorType.contains },
            grouping: {
              getter: 'tr_type',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "tr_nbr",
            name: "N° Bon",
            field: "tr_nbr",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_nbr',
              formatter: (g) => `N° Bon: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: true,
              
              collapsed:true
            }
          },
          {
            id: "tr_lot",
            name: "N° Doc ",
            field: "tr_lot",
            sortable: true,
            filterable: true,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            type: FieldType.string,
            grouping: {
              getter: 'tr_lot',
              formatter: (g) => `N° : ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('tr_qty_loc'),
                new Aggregators.Sum('tr_qty_loc')
              ],
              
              aggregateCollapsed: true,
              
              collapsed:true
            }
          }, 
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
              
              if(args.dataContext.tr_part!=args.dataContext.tr_oldpart || args.dataContext.tr_addr!=args.dataContext.tr_oldaddr || args.dataContext.tr_serial!=args.dataContext.tr_oldserial || args.dataContext.tr_qty_loc!= args.dataContext.tr_qty_chg)   /*ajouter ligne tr_hist de suppression*/
                { console.log('changement', args.dataContext.tr_oldpart,args.dataContext.tr_oldaddr,args.dataContext.tr_oldserial) 
                  
                this.index = this.dataset.findIndex((el) => {
                  return el.tr_line == args.dataContext.tr_line;
                });
                // args.dataContext.tr_qty_loc = args.dataContext.tr_qty_loc * -1;
                
                this.oldata = [];
                let oldobj = {
                  tr_lot:args.dataContext.tr_lot,
                  tr_nbr:args.dataContext.tr_nbr,
                  tr_addr:args.dataContext.tr_oldaddr,
                  tr_rmks:'CORRECTION ADMINISTRATION',
                  tr_gl_date: new Date(),
                  tr_effdate: args.dataContext.tr_effdate,
                  dec01:args.dataContext.dec01,
                  dec02:args.dataContext.dec02,
                  tr_line: args.dataContext.tr_line,
                  tr_part: args.dataContext.tr_oldpart,
                  desc: args.dataContext.desc,
                  tr_qty_loc: args.dataContext.tr_qty_chg * -1,
                  tr_um: args.dataContext.tr_um,
                  tr_um_conv: args.dataContext.tr_um_conv,
                  tr_price: args.dataContext.tr_price,
                  tr_site: args.dataContext.tr_site,
                  tr_loc: args.dataContext.tr_loc,
                  tr_serial: args.dataContext.tr_oldserial,
                  tr_ref: args.dataContext.tr_ref,
                  tr_status: args.dataContext.tr_status,
                  tr_expire: args.dataContext.tr_expire,
                  tr_rev:'CHANGED',
                };
                // args.dataContext.tr_qty_loc = args.dataContext.tr_qty_loc * -1;
                args.dataContext.tr_qty_chg = 0;
                this.oldata.push(oldobj);
                let oldtr = oldobj;
                this.trlot = args.dataContext.tr_lot;
                // this.updatetrans(args.dataContext.id)
                console.log(args.dataContext.tr_oldpart,args.dataContext.tr_oldaddr,'old')
                if(args.dataContext.tr_type == 'RCT-UNP') {this.addRCTUNP(this.oldata, oldtr, this.trlot)}
                else{
                if(args.dataContext.tr_type == 'ISS-UNP') {this.addISSUNP(this.oldata, oldtr, this.trlot)}
                else{
                  if(args.dataContext.tr_type == 'RCT-WO') {this.addRCTWO(this.oldata, oldtr)}
                  else{
                  if(args.dataContext.tr_type == 'ISS-WO') {this.addISSWO(this.oldata,oldtr)}
                  else{ 
                    if(args.dataContext.tr_type == 'RJCT-WO') {this.addRJCTWO(this.oldata,oldtr)}
                  }
                  }
                }
                }
                      
                
              }
              this.data = [];
              let obj = {
                    tr_lot:args.dataContext.tr_lot,
                    tr_nbr:args.dataContext.tr_nbr,
                    tr_addr:args.dataContext.tr_addr,
                    tr_rmks:'CORRECTION ADMINISTRATION',
                    tr_gl_date: new Date(),
                    tr_effdate: args.dataContext.tr_effdate,
                    dec01:args.dataContext.dec01,
                    dec02:args.dataContext.dec02,
                    tr_line: args.dataContext.tr_line,
                    tr_part: args.dataContext.tr_part,
                    desc: args.dataContext.desc,
                    tr_loc_begin: args.dataContext.tr_qty_chg,
                    tr_qty_loc: args.dataContext.tr_qty_loc  ,
                    tr_gl_amt: (args.dataContext.tr_qty_loc ) * args.dataContext.tr_price * args.dataContext.tr_um_conv,
                    tr_um: args.dataContext.tr_um,
                    tr_um_conv: args.dataContext.tr_um_conv,
                    tr_price: args.dataContext.tr_price,
                    tr_site: args.dataContext.tr_site,
                    tr_loc: args.dataContext.tr_loc,
                    tr_serial: args.dataContext.tr_serial,
                    tr_ref: args.dataContext.tr_ref,
                    tr_status: args.dataContext.tr_status,
                    tr_expire: args.dataContext.tr_expire,
              };
              // this.data.push(this.dataset[this.index])
              this.data.push(obj);
              let tr = obj;
              this.trlot = args.dataContext.tr_lot;
                  
              if(args.dataContext.tr_type == 'RCT-UNP') {this.addRCTUNP(this.data, tr, this.trlot)}
              else{
                  if(args.dataContext.tr_type == 'ISS-UNP') {this.addISSUNP(this.data, tr, this.trlot)}
                  else{
                    if(args.dataContext.tr_type == 'RCT-WO') {this.addRCTWO(this.data, tr)}
                    else{
                    if(args.dataContext.tr_type == 'ISS-WO') {this.addISSWO(this.data,tr)}
                    else{ 
                      if(args.dataContext.tr_type == 'RJCT-WO') {this.addRJCTWO(this.data,tr)}
                    }
                    }
                  }
              }
              const controls = this.trForm.controls;
              let cabs : any;
              const _lb = new Label();
              this.labelService.getBy({ lb_ref: args.dataContext.tr_ref }).subscribe(
                (reponse: any) => (
                  cabs = reponse.data.label, console.log(args.dataContext.tr_ref,cabs),
                
                _lb.lb__dec01 = cabs.lb__dec01,
                
                _lb.lb_site = cabs.lb_site,
                _lb.lb_rmks = cabs.lb_rmks,
                _lb.lb_loc = cabs.lb_loc,
                _lb.lb_part = args.dataContext.tr_part,
                _lb.lb_nbr = cabs.lb_nbr, //this.trnbr
                _lb.lb_lot = args.dataContext.tr_serial,
                _lb.lb_date = cabs.lb_date, 
                _lb.lb_qty = cabs.lb_qty,
                _lb.lb_um = cabs.lb_um,
                _lb.lb_ld_status = cabs.lb_ld_status,
                _lb.lb_desc = args.dataContext.desc,
                _lb.lb_printer = this.PathPrinter,
                _lb.lb_cust = args.dataContext.tr_addr,
                _lb.lb_grp = cabs.lb_Grp,
                _lb.lb_addr = cabs.lb_addr,
                _lb.lb_tel = cabs.lb_tel,
                _lb.lb_ref = cabs.lb_ref,

                this.labelService.addblob(_lb).subscribe((blob) => {                 
                  Edelweiss.print3(_lb,this.currentPrinter);
                })
                
              ),
                (error) => {
                  this.message = "veuillez verifier le code barre";
                  this.isExist = true;
                  return;
                }
              )
            }
          },
          

      ]

      this.gridOptions = {
        editable:true,
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableSorting: true,
        enableCellNavigation:true,
        checkboxSelector: {
          hideInFilterHeaderRow: false,
          hideInColumnTitleRow: true,
         
        },
        rowSelectionOptions: {
         
          selectActiveRow: false
        },
        enableCheckboxSelector:true,
        autoHeight:false,
        
        enableAutoResize: true,
        showCustomFooter: true, // display some metrics in the bottom custom footer
        exportOptions: {
          sanitizeDataExport: true
        },
        enablePagination: true,
        pagination: {
          pageSizes: [5, 10, 50,100,1000,50000,999999999],
          pageSize: 100
        },
        presets: {
          filters: [
           
          ],
          sorters: [
           
          ],
          columns:[{columnId:"line",width:50},{columnId:"supp",width:50},{columnId:"tr_effdate",width:50},{columnId:"tr_addr",width:50},{columnId:"advid",width:20},{columnId:"mvid",width:20},{columnId:"tr_desc",width:150},{columnId:"tr__chr01",width:100},{columnId:"tr__chr02",width:100},{columnId:"tr__chr03",width:100},{columnId:"tr_serial",width:20},{columnId:"tr_ref",width:20}, {columnId:"tr_qty_loc",width:20}, {columnId:"tr_status",width:80}, {columnId:"tr_type",width:50}, {columnId:"tr_lot",width:20}, {columnId:"tr_nbr",width:20},{columnId:"idprint",width:20}]
          
        },
       
     
        gridMenu: {
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => this.onGroupChanged(args),
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
      
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


    }

    // fill the dataset with your data
    const controls = this.trForm.controls
    
    this.dataset = []
    this.copydataset = []
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    
    let obj= {date,date1}
    this.inventoryTransactionService.getByDate(obj).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data)
      
      this.dataset  = res.data;
      this.copydataset  = res.data;
      this.dataview.setItems(this.dataset)
      
    //this.dataset = res.data
    this.loadingSubject.next(false) 
  })
    
}
onGroupChanged(change: { caller?: string; groupColumns: Grouping[] }) {
    // the "caller" property might not be in the SlickGrid core lib yet, reference PR https://github.com/6pac/SlickGrid/pull/303
    const caller = change && change.caller || [];
    const groups = change && change.groupColumns || [];

    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    } else if (groups.length === 0 && caller === 'remove-group') {
      this.clearGroupingSelects();
    }
  }
  clearGroupingSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
  }
  
  collapseAllGroups() {
    this.dataview.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataview.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.grid.invalidate(); // invalidate all rows and re-render
  }


  refreshMetrics(e: Event, args: any) {
    if (args && args.current >= 0) {
      setTimeout(() => {
        this.metrics = {
          startTime: new Date(),
          endTime: new Date(),
          itemCount: args && args.current || 0,
          totalItemCount: this.dataset.length || 0
        };
      });
    }
  }
  scrollGridBottom() {
    this.angularGrid.slickGrid.navigateBottom();
  }
  scrollGridDown() {
    this.angularGrid.slickGrid.navigateDown();
  }
  scrollGridLeft() {
    this.angularGrid.slickGrid.navigateLeft();
  }
  scrollGridRight() {
    this.angularGrid.slickGrid.navigateRight();
  }

  scrollGridUp() {
    this.angularGrid.slickGrid.navigateUp();
  }
  scrollGridTop() {
    this.angularGrid.slickGrid.navigateTop();
  }
  togglePaginationGrid2() {
    this.WithPagination = !this.WithPagination;
    this.angularGrid.paginationService!.togglePaginationVisibility(this.WithPagination);
  }

  trlist(){
    const controls = this.trForm.controls
    
    this.dataset = []
    this.copydataset = []
    const date = controls.date.value
    ? `${controls.date.value.year}/${controls.date.value.month}/${controls.date.value.day}`
    : null;
  
    const date1 = controls.date1.value
    ? `${controls.date1.value.year}/${controls.date1.value.month}/${controls.date1.value.day}`
    : null;
    
    let obj= {date,date1}
    this.inventoryTransactionService.getByDate(obj).subscribe(
      (res: any) => {
    
      //(response: any) => (this.dataset = response.data),
      console.log(res.data)
      
      this.dataset  = res.data;
      this.copydataset  = res.data;
      this.dataview.setItems(this.dataset)
      
    //this.dataset = res.data
    this.loadingSubject.next(false) 
  })
  
  }
  onSelectedRowsChanged(e, args) {
    // console.log('indexs', args.rows);
    const indexes = args.rows;
    this.trLines = []
    indexes.forEach(index => {
      const tr_line = this.gridService.getDataItemByRowIndex(index).tr_part
      this.trLines.push(tr_line)
    });
   
  }
  prepare() {
    const controls = this.trForm.controls;
    const _tr = new InventoryTransaction();
    _tr.tr_lot = controls.tr_lot.value;
    _tr.tr_nbr = controls.tr_nbr.value;

    _tr.tr_effdate = controls.tr_effdate.value ? `${controls.tr_effdate.value.year}/${controls.tr_effdate.value.month}/${controls.tr_effdate.value.day}` : null;
    _tr.tr_so_job = controls.tr_so_job.value;

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
  onSubmit() {
    this.hasFormErrors = false;
    
    this.data = [];
    let obj = {
      tr_lot:this.dataset[this.index].tr_lot,
      tr_nbr:this.dataset[this.index].tr_nbr,
      tr_addr:this.dataset[this.index].tr_addr,
      tr_rmks:'CORRECTION ADMINISTRATION',
      tr_gl_date: new Date(),
      tr_effdate: this.dataset[this.index].tr_effdate,
      dec01:this.dataset[this.index].dec01,
      dec02:this.dataset[this.index].dec02,
      tr_line: this.dataset[this.index].tr_line,
      tr_part: this.dataset[this.index].tr_part,
      desc: this.dataset[this.index].desc,
      tr_qty_loc: this.dataset[this.index].tr_qty_loc,
      tr_um: this.dataset[this.index].tr_um,
      tr_um_conv: this.dataset[this.index].tr_um_conv,
      tr_price: this.dataset[this.index].tr_price,
      tr_site: this.dataset[this.index].tr_site,
      tr_loc: this.dataset[this.index].tr_loc,
      tr_serial: this.dataset[this.index].tr_serial,
      tr_ref: this.dataset[this.index].tr_ref,
      tr_status: this.dataset[this.index].tr_status,
      tr_expire: this.dataset[this.index].tr_expire,
    };
    // this.data.push(this.dataset[this.index])
    this.data.push(obj);

    
   
    this.trlot = this.dataset[this.index].tr_lot;

    let tr = obj;
    this.addRCTUNP(this.data, tr, this.trlot);

    
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
        this.message = "RCT-UNP";
        this.isExist = true
        return
        this.loadingSubject.next(false);
      },
      () => {
        this.layoutUtilsService.showActionNotification("Ajout avec succès", MessageType.Create, 10000, true, true);
        this.loadingSubject.next(false);

        //    console.log(this.provider, po, this.dataset);
        // if(controls.print.value == true) printReceiveUNP(this.provider, this.dataset, nlot)
        // if (controls.print.value == true) this.printpdf(nlot); //printBc(this.provider, this.dataset, po, this.curr);

        // this.router.navigateByUrl("/");
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
      // this.printpdf(this.trlot); //printBc(this.provider, this.dataset, po, this.curr);
        // const arrayOctet = new Uint8Array(reponse.pdf.data)
        // const file = new Blob([arrayOctet as BlobPart], {type : 'application/pdf'})
        // const fileUrl = URL.createObjectURL(file);
        // window.open(fileUrl)},
       },
        (error) => {
          this.layoutUtilsService.showActionNotification(
            "Erreur iss-unp",
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
            "Erreur iss-wo",
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
  handleSelectedRowsChanged2(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj2) {
      args.rows.map((idx) => {
        const item = this.gridObj2.getDataItem(idx);
        console.log(item);

        
            updateItem.tr_addr = item.ad_addr;
            
            this.gridService.updateItem(updateItem);
          });
          //});
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
    this.addressService.getAll().subscribe((response: any) => (this.adresses = response.data));
  }
  open2(content) {
    this.codeService.getByOne({ code_fldname: this.user.usrd_code }).subscribe(
      (reponse: any) => {
        if (reponse.data == null) {
          this.prepareGrid2();
          this.modalService.open(content, { size: "lg" });
        }
        console.log(reponse.data);
      },
      (error) => {
        this.prepareGrid2();
        this.modalService.open(content, { size: "lg" });
      }
    );
  }
  handleSelectedRowsChanged4(e, args) {
    let updateItem = this.gridService.getDataItemByRowIndex(this.row_number);
    if (Array.isArray(args.rows) && this.gridObj4) {
      args.rows.map((idx) => {
        const item = this.gridObj4.getDataItem(idx);
        console.log(item);

        
            updateItem.tr_part = item.pt_part;
            updateItem.desc = item.pt_desc1;
            updateItem.tr_um = item.pt_um;
            updateItem.tr_um_conv = 1;
            updateItem.tr_site = item.pt_site;
            updateItem.tr_loc = item.pt_loc;
            updateItem.tr_price = 0; //this.sct.sct_mtl_tl;
            updateItem.tr_desc = item.pt_desc1
            updateItem.tr__chr01 = item.pt_draw
            updateItem.tr__chr02 = item.pt_break_cat
            updateItem.tr__chr03 = item.pt_group
            this.gridService.updateItem(updateItem);
          });
          //});
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
  updatetrans(details: any) {
    this.loadingSubject.next(true)
    this.inventoryTransactionService.updatetr(details).subscribe(
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
                "Modification avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            // this.router.navigateByUrl("inventory-settings/list-status")
        }
    )
  }
}

