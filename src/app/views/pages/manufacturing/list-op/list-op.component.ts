import { Component, OnInit } from "@angular/core"
// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Formatters,
    AngularGridInstance,
    GridService,
    Editor, 
    Editors,
    FieldType,
    OnEventArgs,
    Aggregators,
     Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
   OperatorType,
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

import { OperationHistory,
  OperationHistoryService, } from "../../../../core/erp"
@Component({
  selector: 'kt-list-op',
  templateUrl: './list-op.component.html',
  styleUrls: ['./list-op.component.scss']
})
export class ListOpComponent implements OnInit {

  
  // slick grid
gridObj: any;
gridService: GridService;
dataviewObj: any;
angularGrid: AngularGridInstance;
columnDefinitions: Column[] = [];
gridOptions: GridOption = {};
dataset: any[] = [];
draggableGroupingPlugin: any;    
selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
// quantitytypesList = [
//   { value: 0, label: 'UM' },
//   { value: 1, label: '%' },

// ];
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private operationHistoryService: OperationHistoryService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    this.gridService = angularGrid.gridService;
  }
  prepareGrid() {
      this.columnDefinitions = [
          // {
          //     id: "edit",
          //     field: "id",
          //     excludeFromColumnPicker: true,
          //     excludeFromGridMenu: true,
          //     excludeFromHeaderMenu: true,
          //     formatter: (row, cell, value, columnDef, dataContext) => {
          //         // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
          //         return `
          //     <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
          //     <span class="svg-icon svg-icon-md">
          //         <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
          //             height="24px" viewBox="0 0 24 24" version="1.1">
          //             <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          //                 <rect x="0" y="0" width="24" height="24"></rect>
          //                 <path
          //                     d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
          //                     fill="#000000" fill-rule="nonzero"
          //                     transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
          //                 </path>
          //                 <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
          //             </g>
          //         </svg>
          //     </span>
          // </a>
          // `
          //     },
          //     minWidth: 50,
          //     maxWidth: 50,
          //     // use onCellClick OR grid.onClick.subscribe which you can see down below
          //     onCellClick: (e: Event, args: OnEventArgs) => {
          //         const ps_parent = args.dataContext.ps_parent
          //         this.router.navigateByUrl(`/manufacturing/edit-ps/${ps_parent}`)
          //     },
          // },
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 80,
              maxWidth: 80,
          },
         {
              id: "op_wo_nbr",
              name: "N° demande",
              field: "op_wo_nbr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
              getter: 'op_wo_nbr',
              formatter: (g) => `Demande: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
              id: "op_wkctr",
              name: "Ligne",
              field: "op_wkctr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
              grouping: {
              getter: 'op_wkctr',
              formatter: (g) => `Ligne: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
          },
        
        {
          id: "op_mch",
          name: "Machine",
          field: "op_mch",
          sortable: true,
          filterable: true,
          type: FieldType.string,
          grouping: {
              getter: 'op_mch',
              formatter: (g) => `Machine: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        },
        
        
        {
          id: "op_shift",
          name: "Equipe",
          field: "op_shift",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          grouping: {
              getter: 'op_shift',
              formatter: (g) => `Equipe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        },     
        {
          id: "op_date",
          name: "Date ",
          field: "op_date",
          sortable: true,
          width: 100,
          filterable: true,
          type:FieldType.date,
          grouping: {
              getter: 'op_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        },
        {
          id: "op_program",
          name: "Priorité",
          field: "op_program",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          grouping: {
              getter: 'op_program',
              formatter: (g) => `Priorité: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        }, 
        {
          id: "op_act_run",
          name: "Temps",
          field: "op_act_run",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.float,
          groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        }, 
        {
          id: "chr01",
          name: "Heure Debut",
          field: "chr01",
          sortable: true,
          width: 60,
          filterable: true,
          type: FieldType.dateIso,
        },
        {
          id: "op_tran_date",
          name: "Date Fin",
          field: "op_tran_date",
          sortable: true,
          width: 60,
          filterable: true,
          type: FieldType.dateIso,
        },
        
        {
          id: "chr02",
          name: "Heure Fin",
          field: "chr02",
          sortable: true,
          width: 60,
          filterable: true,
          type: FieldType.dateIso,
        },
        {
          id: "op_rsn_down",
          name: "Cause",
          field: "op_rsn_down",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          grouping: {
              getter: 'op_rsn_down',
              formatter: (g) => `Cause: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        },
        
        {
          id: "op_Comment",
          name: "Remarque",
          field: "op_comment",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
          grouping: {
              getter: 'op_comment',
              formatter: (g) => `Remarque: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        },
        {
          id: "chr03",
          name: "Impact",
          field: "chr03",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          grouping: {
              getter: 'chr03',
              formatter: (g) => `Impact: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        }, 
        {
          id: "op_rsn",
          name: "Statut",
          field: "op_rsn",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
          grouping: {
              getter: 'op_rsn',
              formatter: (g) => `Statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
        },            
         {
          id: "int01",
          name: "Relevé",
          field: "int01",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.integer,
           grouping: {
              getter: 'int01',
              formatter: (g) => `Relevé: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('op_act_run'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,}
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
      this.operationHistoryService.getAll().subscribe(
          (response: any) => {this.dataset = response.data
           // console.log(this.dataset)
            this.dataviewObj.setItems(this.dataset)},
   
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
