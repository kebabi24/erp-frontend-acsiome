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

import { Item, ItemService } from "../../../../core/erp";

@Component({
  selector: "kt-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class ListComponent implements OnInit {
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
    private itemService: ItemService
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
        minWidth: 50,
      },
      {
        id: "pt_part",
        name: "Code Produit",
        field: "pt_part",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
     
      {
        id: "pt_desc1",
        name: "Description Externe",
        field: "pt_desc1",
        sortable: true,
        filterable: true,
        minWidth: 250,
        type: FieldType.string,
      },
      {
        id: "pt_desc2",
        name: "Description Interne",
        field: "pt_desc2",
        sortable: true,
        filterable: true,
        minWidth: 150,
        type: FieldType.string,
      },
      {
        id: "pt_um",
        name: "UM",
        field: "pt_um",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      {
        id: "pt_prod_line",
        name: "Famille",
        field: "pt_prod_line",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_prod_line',
          formatter: (g) => `Famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },
      {
        id: "pt_part_type",
        name: "Type",
        field: "pt_part_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_part_type',
          formatter: (g) => `type: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },
      {
        id: "pt_draw",
        name: "Sous Famille",
        field: "pt_draw",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_draw',
          formatter: (g) => `Sous famille: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },

      {
        id: "pt_group",
        name: "Groupe",
        field: "pt_group",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
        grouping: {
          getter: 'pt_group',
          formatter: (g) => `groupe: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: true,
          collapsed: true,
        }
      },
      {
        id: "pt_origin",
        name: "Origin",
        field: "pt_origin",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
        grouping: {
          getter: 'pt_origin',
          formatter: (g) => `Origine: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      {
        id: "pt_break_cat",
        name: "Couleur",
        field: "pt_break_cat",
        sortable: true,
        filterable: true,
        minWidth: 80,
        grouping: {
          getter: 'pt_break_cat',
          formatter: (g) => `Couelur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
        // type: FieldType.text,
        // resizeAlwaysRecalculateWidth:true
      },
      // {
      //   id: "pt_promo",
      //   name: "Logo",
      //   field: "pt_promo",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      //   minWidth: 100,
      // },
      // {
      //   id: "pt_dsgn_grp",
      //   name: "Forme Géometrique",
      //   field: "pt_dsgn_grp",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_site",
      //   name: "Site",
      //   field: "pt_site",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_loc",
      //   name: "Emplacement",
      //   field: "pt_loc",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.string,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_insp_lead",
      //   name: "Delai Achat",
      //   field: "pt_insp_lead",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_pur_lead",
      //   name: "Delai Production",
      //   field: "pt_pur_lead",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_sfty_stk",
      //   name: "Stock Securite",
      //   field: "pt_sfty_stk",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_rop",
      //   name: "Stock Securite",
      //   field: "pt_rop",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 150,
      // },
      // {
      //   id: "pt_iss_pol",
      //   name: "Scan",
      //   field: "pt_iss_pol",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.boolean,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_length",
      //   name: "Longuer",
      //   field: "pt_length",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_height",
      //   name: "Hauteur",
      //   field: "pt_height",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_width",
      //   name: "Largeur",
      //   field: "pt_width",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },

      
      // {
      //   id: "pt_drwg_loc",
      //   name: "Source",
      //   field: "pt_drwg_loc",
      //   sortable: true,
      //   filterable: true,
      //   // type: FieldType.text,
      //   minWidth: 80,
      // },
      {
        id: "pt_status",
        name: "Statut",
        field: "pt_status",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
      },
      // {
      //   id: "pt_plan_ord",
      //   name: "Demande Obligatoire",
      //   field: "pt_plan_ord",
      //   sortable: true,
      //   filterable: true,
      //   // type: FieldType.text,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_drwg_size",
      //   name: "Unité/Sachet",
      //   field: "pt_drwg_size",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_net_wt",
      //   name: "Poids Net",
      //   field: "pt_net_wt",
      //   sortable: true,
      //   filterable: true,
      //   type: FieldType.number,
      //   minWidth: 80,
      // },
      // {
      //   id: "pt_model",
      //   name: "Format",
      //   field: "pt_model",
      //   sortable: true,
      //   filterable: true,
      //   // type: FieldType.text,
      //   minWidth: 80,
      // },

     
      {
        id: "int01",
        name: "Micronage",
        field: "int01",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
      },
      {
        id: "int02",
        name: "Laise",
        field: "int02",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
      },
      {
        id: "int03",
        name: "Vitesse",
        field: "int03",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
      },
      {
        id: "created_by",
        name: "Utilisateur",
        field: "created_by",
        sortable: true,
        filterable: true,
        type: FieldType.number,
        minWidth: 80,
        grouping: {
          getter: 'created_by',
          formatter: (g) => `utilisateur: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
          aggregateCollapsed: false,
          collapsed: false,
        }
      },
      {
        id: "createdAt",
        name: "crée le",
        field: "createdAt",
        sortable: true,
        filterable: true,
        type: FieldType.number,
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
    this.itemService.getAll().subscribe(
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
