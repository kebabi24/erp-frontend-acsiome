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

import { CodeService} from "../../../../core/erp"
import { jsPDF } from "jspdf";
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { HttpClient } from "@angular/common/http"
import { L } from "@angular/cdk/keycodes"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  const API_URL_codes = environment.apiUrl + "/codes"
@Component({
    selector: "kt-list-doc",
    templateUrl: "./list-doc.component.html",
    styleUrls: ["./list-doc.component.scss"],
})
export class ListDocComponent implements OnInit {
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;

  grid: any;
  gridService: GridService;
  dataview: any;
 
  domain    : any;
  user : any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;

  
  constructor(
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
     
      private codeService: CodeService,
  ) {
      this.prepareGrid()
  }
    ngOnInit(): void {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.domain = JSON.parse(localStorage.getItem("domain"));
    }

    angularGridReady(angularGrid: AngularGridInstance) {
        this.angularGrid = angularGrid;
        this.gridObj = angularGrid.slickGrid; // grid object
        this.dataviewObj = angularGrid.dataView;
        this.gridService = angularGrid.gridService;
          this.grid = angularGrid.slickGrid; // grid object
          this.dataview = angularGrid.dataView;
        
      }
  
    prepareGrid() {

      this.columnDefinitions = [
        {
          id: "edit",
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          formatter: (row, cell, value, columnDef, dataContext) => {
              // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
              return `
          <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
          <span class="svg-icon svg-icon-md">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                  height="24px" viewBox="0 0 24 24" version="1.1">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <rect x="0" y="0" width="24" height="24"></rect>
                      <path
                          d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                          fill="#000000" fill-rule="nonzero"
                          transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                      </path>
                      <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                  </g>
              </svg>
          </span>
      </a>
      `
          },
          minWidth: 50,
          maxWidth: 50,
          // use onCellClick OR grid.onClick.subscribe which you can see down below
          onCellClick: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id
              this.router.navigateByUrl(`/code-mstr/edit-doc/${id}`)
          },
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
            name: "Chemin",
            field: "code_fldname",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'code_fldname',
              formatter: (g) => `Chemin: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('dec01')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "code_value",
            name: "Code",
            field: "code_value",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
                getter: 'code_value',
                formatter: (g) => `Valeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('dec01')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
        },
        {
            id: "code_cmmt",
            name: "Titre",
            field: "code_cmmt",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
            grouping: {
                getter: 'code_cmmt',
                formatter: (g) => `Titre: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('dec01')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
        },
        {
            id: "code_desc",
            name: "Service",
            field: "code_desc",
            sortable: true,
            width: 200,
            filterable: true,
            type: FieldType.string,
            grouping: {
                getter: 'code_desc',
                formatter: (g) => `Desc: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [new Aggregators.Sum('dec01')],
                aggregateCollapsed: true,
                
                collapsed:true
              }
        },
        {
            id: "chr01",
            name: "Type",
            field: "chr01",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
        },
        // {
        //     id: "chr02",
        //     name: "chr02",
        //     field: "chr02",
        //     sortable: true,
        //     width: 80,
        //     filterable: true,
        //     type: FieldType.string,
        // },
        {
            id: "dec01",
            name: "Version",
            field: "dec01",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.float,
        },
        // {
        //     id: "dec02",
        //     name: "dec02",
        //     field: "dec02",
        //     sortable: true,
        //     width: 80,
        //     filterable: true,
        //     type: FieldType.float,
        // },
        {
            id: "date01",
            name: "date création",
            field: "date01",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.dateIso,
        },

        {
            id: "date02",
            name: "date modification",
            field: "date02",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.dateIso,
        },

            
           
         
      ]

      this.gridOptions = {
         /* autoResize: {
            containerId: 'demo-container',
            sidePadding: 10
          },*/
          enableDraggableGrouping: true,
          createPreHeaderPanel: true,
          showPreHeaderPanel: true,
          preHeaderPanelHeight: 40,
          enableFiltering: true,
          enableSorting: true,
          enableAutoResize: true,
          exportOptions: {
            sanitizeDataExport: true
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
      this.dataset = []
      this.codeService.getBy({chr02:'ENTETE'}).subscribe(
          (response: any) => {
              this.dataset = response.data
              this.dataviewObj.setItems(this.dataset)
          },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
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
      this.dataviewObj.collapseAllGroups();
    }
  
    expandAllGroups() {
      this.dataviewObj.expandAllGroups();
    }
    clearGrouping() {
      if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
        this.draggableGroupingPlugin.clearDroppedGroups();
      }
      this.gridObj.invalidate(); // invalidate all rows and re-render
    }
}

