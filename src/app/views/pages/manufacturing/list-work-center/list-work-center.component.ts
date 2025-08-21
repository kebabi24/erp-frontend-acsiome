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

import {  WorkCenterService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-work-center',
  templateUrl: './list-work-center.component.html',
  styleUrls: ['./list-work-center.component.scss']
})
export class ListWorkCenterComponent implements OnInit {

 
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
      private workCenterService: WorkCenterService
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
                  this.router.navigateByUrl(`/manufacturing/edit-work-center/${id}`)
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
              id: "wc_wkctr",
              name: "Centre Charge",
              field: "wc_wkctr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
               grouping: {
              getter: 'wc_wkctr',
              formatter: (g) => `Centre de charge: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc_mch",
            name: "Code Machine",
            field: "wc_mch",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc_mch',
              formatter: (g) => `Machine: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
        },
        
          {
              id: "wc_desc",
              name: "Designation",
              field: "wc_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
                grouping: {
              getter: 'wc_desc',
              formatter: (g) => `Machine: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc_dept",
            name: "Departement",
            field: "wc_dept",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc_dept',
              formatter: (g) => `Département: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc_user1",
            name: "Parent",
            field: "wc_user1",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc_user1',
              formatter: (g) => `Parent: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          }, 
          {
            id: "wc_user2",
            name: "Fonction",
            field: "wc_user2",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc_user2',
              formatter: (g) => `Fonction: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc_fsm_type",
            name: "Categorie",
            field: "wc_fsm_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc_fsm_type',
              formatter: (g) => `Catégorie: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc__qadc01",
            name: "Famille",
            field: "wc__qadc01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc__qadc01',
              formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc__qadc02",
            name: "Sous-famille",
            field: "wc__qadc02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc__qadc02',
              formatter: (g) => `Sous-famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc__chr01",
            name: "site",
            field: "wc__chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc__chr01',
              formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc_wk_loc",
            name: "Emplacement",
            field: "wc_wk_loc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc_wk_loc',
              formatter: (g) => `Emplacement: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },

          {
            id: "wc__chr02",
            name: "Fournisseur",
            field: "wc__chr02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc__chr02',
              formatter: (g) => `Fournisseur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc__chr03",
            name: "Constructeur",
            field: "wc__chr03",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'wc__chr03',
              formatter: (g) => `Constructeur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
          {
            id: "wc__qac03",
            name: "N° Serie",
            field: "wc__qadc03",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "chr02",
            name: "Responsable",
            field: "chr02",
            sortable: true,
            filterable: true,
            type: FieldType.string,
              grouping: {
              getter: 'chr02',
              formatter: (g) => `Responsable: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                // (required), what aggregators (accumulator) to use and on which field to do so
               // new Aggregators.Avg('ld_qty_oh'),
                new Aggregators.Sum('int01'),
                new Aggregators.Sum('int02'),
                new Aggregators.Sum('int03'),
                new Aggregators.Sum('int04'),
                // new Aggregators.Sum('ar_amt')
              ],
              aggregateCollapsed: true,
              collapsed: true,
            }
          },
{
            id: "wc_mod_date",
            name: "date installation",
            field: "wc_mod_date",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
          },
          {
            id: "int01",
            name: "Nombre d'incidents",
            field: "int01",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        
          },
          {
            id: "int02",
            name: "durée Incident",
            field: "int02",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        
          },
          {
            id: "int03",
            name: "Moyenne Incident",
            field: "int03",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        
          },
          {
            id: "int04",
            name: "Durée entre incident",
            field: "int04",
            sortable: true,
            filterable: true,
            type: FieldType.float,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
        
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
      this.workCenterService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
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
