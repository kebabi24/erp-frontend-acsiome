import { Component, OnInit } from "@angular/core"
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

import { ForcastService } from "../../../../core/erp"

@Component({
  selector: 'kt-list-forcast',
  templateUrl: './list-forcast.component.html',
  styleUrls: ['./list-forcast.component.scss']
})
export class ListForcastComponent implements OnInit {

  
  // slick grid
  angularGrid: AngularGridInstance;
  grid: any;
  gridService: GridService;
  dataView: any;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  draggableGroupingPlugin: any;
  selectedGroupingFields: Array<string | GroupingGetterFunction> = ['','','','','','','','','',''];
  
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private forcastService: ForcastService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  mvGridReady(angularGrid: AngularGridInstance) {
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
              minWidth: 80,
              maxWidth: 80,
          },
         
          {
              id: "frc_year",
              name: "Année",
              field: "frc_year",
              sortable: true,
              filterable: true,
              type: FieldType.number,
              grouping: {
                getter: 'frc_year',
                formatter: (g) => `Année: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  new Aggregators.Sum('frc_qty'),
                  new Aggregators.Sum('frc_amt'),
                  ],
                aggregateCollapsed: false,
                collapsed: false,
              }
          },
          {
              id: "frc_month",
              name: "Mois",
              field: "frc_month",
              sortable: true,
              filterable: true,
              type: FieldType.number,
              grouping: {
                getter: 'frc_month',
                formatter: (g) => `Mois: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
                aggregators: [
                  new Aggregators.Sum('frc_qty'),
                  new Aggregators.Sum('frc_amt'),
                  ],
                aggregateCollapsed: false,
                collapsed: false,
              }
          },
          {
            id: "frc_dayname",
            name: "Jour",
            field: "frc_dayname",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "frc_date",
            name: "Date",
            field: "frc_date",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
            grouping: {
              getter: 'frc_date',
              formatter: (g) => `Date: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          
          {
            id: "frc_site",
            name: "Site",
            field: "frc_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_site',
              formatter: (g) => `Site: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "frc_type",
            name: "Type",
            field: "frc_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_type',
              formatter: (g) => `Type: ${g.value}  <span style="color:green">(${g.count}  ${new Aggregators.Sum('frc_qty')} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "frc_cust",
            name: "Client",
            field: "frc_cust",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_cust',
              formatter: (g) => `Client: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "frc_part",
            name: "Produit",
            field: "frc_part",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_part',
              formatter: (g) => `Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "frc_promo",
            name: "Promo",
            field: "frc_promo",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_promo',
              formatter: (g) => `Promo: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "frc_part_type",
            name: "Type Produit",
            field: "frc_part_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_part_type',
              formatter: (g) => `Type Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          {
            id: "frc_dsgn_grp",
            name: "Groupe Etude Produit",
            field: "frc_dsgn_grp",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_dsgn_grp',
              formatter: (g) => `Groupe Etude Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          
          {
            id: "frc_part_group",
            name: "Groupe Produit",
            field: "frc_part_group",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            grouping: {
              getter: 'frc_part_group',
              formatter: (g) => `Groupe Produit: ${g.value}  <span style="color:green">(${g.count} items)</span>`,
              aggregators: [
                new Aggregators.Sum('frc_qty'),
                new Aggregators.Sum('frc_amt'),
                ],
              aggregateCollapsed: false,
              collapsed: false,
            }
          },
          
          {
            id: "frc_qty",
            name: "QTE",
            field: "frc_qty",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },
          {
            id: "frc_amt",
            name: "Montant",
            field: "frc_amt",
            sortable: true,
            filterable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotalsColored ,
            type: FieldType.float,
            filter: {model: Filters.compoundInput , operator: OperatorType.rangeInclusive }, 
          },
      ]

      this.gridOptions = {
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        autoHeight: false,
        enableSorting: true,
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

      }

      // fill the dataset with your data
      this.dataset = []
      this.forcastService.getAll().subscribe(
          (response: any) => {this.dataset = response.data,
          this.dataView.setItems(this.dataset) }
          ,
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
    this.dataView.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataView.expandAllGroups();
  }
  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
    this.grid.invalidate(); // invalidate all rows and re-render
  }

  groupByFieldName(fieldName: string, index: number) {
    this.clearGrouping();
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      // get the field names from Group By select(s) dropdown, but filter out any empty fields
      const groupedFields = this.selectedGroupingFields.filter((g) => g !== '');

      this.showPreHeader();
      this.draggableGroupingPlugin.setDroppedGroups(groupedFields);
      this.grid.invalidate(); // invalidate all rows and re-render
    }
  }
  showPreHeader() {
    this.grid.setPreHeaderPanelVisibility(true);
  }
}
