import { Component, OnInit } from "@angular/core"
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
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
  GridService,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  OperatorType,
  OperatorString,
  SearchTerm,
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

import { LocationDetailService} from "../../../../core/erp"

import { HttpUtilsService } from "../../../../core/_base/crud"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../../../../environments/environment"
const API_URL = environment.apiUrl + "/inventory-status"
const API_URL_codes = environment.apiUrl + "/codes"
const API_URL_RSN = environment.apiUrl + "/reasons"
 
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';

@Component({
  selector: 'kt-edit-ld-status',
  templateUrl: './edit-ld-status.component.html',
  styleUrls: ['./edit-ld-status.component.scss']
})
export class EditLdStatusComponent implements OnInit {

  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  grid: any;
  gridService: GridService;
  dataview: any;
 

  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;
  httpOptions = this.httpUtils.getHTTPHeaders()
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
     
      private locationDetailService: LocationDetailService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.grid = angularGrid.slickGrid; // grid object
    this.dataview = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  
  
  prepareGrid() {
    const httpHeaders = this.httpUtils.getHTTPHeaders()
      this.columnDefinitions = [
          
          // {
          //   id: "id",
          //   field: "id",
          //   excludeFromColumnPicker: true,
          //   excludeFromGridMenu: true,
          //   excludeFromHeaderMenu: true,
    
          //   minWidth: 50,
          //   maxWidth: 50,
          // },
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
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            
          }, 
          {
            id: "item.pt_desc1",
            name: "Description",
            field: "item.pt_desc1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          {
            id: "item.pt_break_cat",
            name: "COULEUR",
            field: "item.pt_break_cat",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive },
            
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
            name: "Quantite",
            field: "ld_qty_oh",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: { model: Filters.compoundInput,operator: OperatorType.rangeInclusive}
            
            
          }, 
         
          {
            id: "ld_ref",
            name: "Reference",
            field: "ld_ref",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            
          }, 
          // {
          //   id: "ld_grade",
          //   name: "Taille",
          //   field: "ld_grade",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          //   grouping: {
          //     getter: 'ld_grade',
          //     formatter: (g) => `Taille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //   }
          // }, 
          // {
          //   id: "chr01",
          //   name: "Couleur",
          //   field: "chr01",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.string,
          //   grouping: {
          //     getter: 'chr01',
          //     formatter: (g) => `Couleur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregateCollapsed: true,
          //     collapsed: true,
          //   }
          // }, 
          // {
          //   id: "ld_date",
          //   name: "Date",
          //   field: "ld_date",
          //   sortable: true,
          //   filterable: true,
          //   type: FieldType.date,
          //   formatter: Formatters.dateIso ,
          //   filter: { model: Filters.compoundDate },
          //   grouping: {
          //     getter: 'ld_date',
          //     formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          //     aggregateCollapsed: false,
          //     collapsed: false,
          //   }
          // },
          
          {
            id: "ld_expire",
            name: "Expire Le",
            field: "ld_expire",
            sortable: true,
            filterable: true,
            type: FieldType.dateTimeIso,
            
          }, 
          {
            id: "ld_status",
            name: "Status",
            field: "ld_status",
           
            type: FieldType.string,
            editor: {
              model: Editors.singleSelect,
    
              enableRenderHtml: true,
              collectionAsync:  this.http.get(`${API_URL}/instancestatus`), //this.http.get<[]>( 'http://localhost:3000/api/v1/codes/check/') /*'api/data/pre-requisites')*/ ,
          
             
            },
          }, 
          {
            id: "ld_user2",
            name: "Raison",
            field: "ld_user2",
           
            type: FieldType.string,
            editor: {
              model: Editors.singleSelect,
    
              enableRenderHtml: true,
              collectionAsync:  this.http.get(`${API_URL_RSN}/rsn`) /*'api/data/pre-requisites')*/ ,
          
             
            },
          }, 
          {
            id: "ld_user1",
            name: "Décision",
            field: "ld_user1",
           
            type: FieldType.string,
            editor: {
              model: Editors.singleSelect,
    
              enableRenderHtml: true,
              collectionAsync:  this.http.get(`${API_URL_codes}/act`) /*'api/data/pre-requisites')*/ ,
          
             
            },
          }, 
      ]

      this.gridOptions = {
         /* autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },*/
          editable:true,
          enableCellNavigation:true,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize: true,
          exportOptions: {
            sanitizeDataExport: true
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
      this.dataset = []
      this.locationDetailService.getByStatusInst({}).subscribe(
        
          (response: any) => {this.dataset = response.data
            console.log(this.dataset)
            this.dataview.setItems(this.dataset)},
          
          (error) => {
              this.dataset = []
          },
          () => {}
          
      )
      console.log(this.dataset)
  }


  onSubmit() {
   
    // tslint:disable-next-line:prefer-const
    
    
    this.addStatus(this.dataset)
  }
  /**
  * Returns object for saving
  */
  
  /**
  * Add code
  *
  * @param _status: InventoryStatusModel
  */
  addStatus(details: any) {
    this.loadingSubject.next(true)
    this.locationDetailService.updateS({details}).subscribe(
        (reponse) => console.log("response", Response),
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
            this.router.navigateByUrl("inventory-settings/list-status")
        }
    )
  }
  
}
