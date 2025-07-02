import { Component, OnInit } from "@angular/core";
// Angular slickgrid
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

import { ItemModelService } from "../../../../core/erp";


@Component({
  selector: 'kt-list-mod',
  templateUrl: './list-mod.component.html',
  styleUrls: ['./list-mod.component.scss']
})
export class ListModComponent implements OnInit {
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  draggableGroupingPlugin: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['', '', ''];
  gridObj: any;
  dataviewObj: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private itemModelService: ItemModelService
  ) {
    this.prepareGrid();
  }

  ngOnInit(): void {}

  gridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;
    this.gridService = angularGrid.gridService;
  }

  prepareGrid() {
    this.columnDefinitions = [
     
      {
        id: "id",
        name: "id",
        field: "id",
        sortable: true,
        minWidth: 30,
      },
      {
        id: "mod_code",
        name: "Code Model",
        field: "mod_code",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
     
      {
        id: "mod_desc",
        name: "Description",
        field: "mod_desc",
        sortable: true,
        filterable: true,
        minWidth: 250,
        type: FieldType.string,
      },
      {
        id: "mod_um",
        name: "UM",
        field: "mod_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      {
        id: "mod_prod_line",
        name: "Catégorie",
        field: "mod_prod_line",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'mod_prod_line',
          formatter: (g) => `famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      {
        id: "mod_part_type",
        name: "Type ",
        field: "mod_part_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'mod_part_type',
          formatter: (g) => `type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      {
        id: "mod_draw",
        name: "Plan",
        field: "mod_draw",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'mod_draw',
          formatter: (g) => `Categorie: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },

      {
        id: "mod_group",
        name: "Configuration",
        field: "mod_group",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'mod_group',
          formatter: (g) => `groupe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      
      {
        id: "mod_dsgn_grp",
        name: "Forme",
        field: "mod_dsgn_grp",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
        grouping: {
          getter: 'mod_dsgn_grp',
          formatter: (g) => `forme: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      {
        id: "mod_origin",
        name: "Origin",
        field: "mod_origin",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
        grouping: {
          getter: 'mod_origin',
          formatter: (g) => `origine: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
     
      {
        id: "mod_status",
        name: "Statut",
        field: "mod_status",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
        grouping: {
          getter: 'mod_status',
          formatter: (g) => `statut: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      
      
      {
        id: "created_by",
        name: "par",
        field: "created_by",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
        grouping: {
          getter: 'created_by',
          formatter: (g) => `crée par: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      
      {
        id: "createdAt",
        name: "Crée le",
        field: "createdAt",
        sortable: true,
        filterable: true,
        
        minWidth: 80,
        grouping: {
          getter: 'createdAt',
          formatter: (g) => `crée le: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },

    ];

    this.gridOptions = {
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

      
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      autoEdit: false,
      autoFitColumnsOnFirstLoad: true,
      // autosizeColumnsByCellContentOnFirstLoad: true,
      enableAutoSizeColumns: true,
      syncColumnCellResize: true,
      presets: {
        sorters: [{ columnId: "id", direction: "ASC" }],
      },
    };

    // fill the dataset with your data
    this.dataset = [];
    this.itemModelService.getAll().subscribe(
      (response: any) => {
        this.dataset = response.data;
        this.dataView.setItems(this.dataset);
      },

      (error) => {
        this.dataset = [];
      },
      () => {}
    );
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
