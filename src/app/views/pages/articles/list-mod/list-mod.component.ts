import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Column,
  GridOption,
  AngularGridInstance,
  GridService,
  Formatter,
  Formatters,
  Editor,
  Editors,
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
        name: "Famille",
        field: "mod_prod_line",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
      {
        id: "mod_part_type",
        name: "Type ",
        field: "mod_part_type",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
      {
        id: "mod_draw",
        name: "Catégorie",
        field: "mod_draw",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },

      {
        id: "mod_group",
        name: "Groupe",
        field: "mod_group",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 100,
      },
      
      {
        id: "mod_dsgn_grp",
        name: "Forme Géometrique",
        field: "mod_dsgn_grp",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      {
        id: "mod_origin",
        name: "Origin",
        field: "mod_origin",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
      },
      
           {
        id: "mod_drwg_loc",
        name: "Source",
        field: "mod_drwg_loc",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
      },

      {
        id: "mod_status",
        name: "Statut",
        field: "mod_status",
        sortable: true,
        filterable: true,
        // type: FieldType.text,
        minWidth: 80,
      },
      {
        id: "mod_abc",
        name: "Classe ABC",
        field: "mod_abc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
     
      {
        id: "mod_site",
        name: "Site",
        field: "mod_site",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      {
        id: "mod_loc",
        name: "Emplacement",
        field: "mod_loc",
        sortable: true,
        filterable: true,
        type: FieldType.string,
        minWidth: 80,
      },
      
      {
        id: "mod_iss_pol",
        name: "Scan",
        field: "mod_iss_pol",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
        formatter: Formatters.checkmark,
        minWidth: 80,
      },

    ];

    this.gridOptions = {
      enableSorting: true,
      enableCellNavigation: false,
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      autoEdit: false,
      enableAutoResize: true,
      autoHeight:false,

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
}
