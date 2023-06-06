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
  GridService,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
} from "angular-slickgrid";
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

import { RepertoryService} from "../../../../core/erp"
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  
@Component({
  selector: 'kt-list-rep',
  templateUrl: './list-rep.component.html',
  styleUrls: ['./list-rep.component.scss']
})
export class ListRepComponent implements OnInit {

  
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  draggableGroupingPlugin: any;
  angularGrid: AngularGridInstance;
  grid: any
  gridService: GridService
  dataview: any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private repertoryService: RepertoryService,
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid
    this.dataview = angularGrid.dataView
    this.grid = angularGrid.slickGrid
    this.gridService = angularGrid.gridService
  }
  
  prepareGrid() {

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
            id: "rep_code",
            name: "code",
            field: "rep_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "name",
            name: "Fournisseur",
            field: "chr01",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "rep_contact",
            name: "Contact",
            field: "rep_contact",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "rep_post",
            name: "Poste",
            field: "rep_post",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },

          {
            id: "rep_tel",
            name: "TEL Mobile",
            field: "rep_tel",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "rep_tel2",
            name: "TEL Fix",
            field: "rep_tel2",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "rep_email",
            name: "Email",
            field: "rep_email",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          

      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          enableAutoResize:true,
         

          multiSelect: false,
          rowSelectionOptions: {
            // True (Single Selection), False (Multiple Selections)
            selectActiveRow: true,
          },
         
      }

      // fill the dataset with your data
      this.dataset = []
      this.repertoryService.getByAddress({rep_type:"Provider"}).subscribe(
          (response: any) => {this.dataset = response.data
            this.dataview.setItems(this.dataset);
          },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }

}