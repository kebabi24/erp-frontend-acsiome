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
  GridService,
  Formatters,
  GridOption,
  Grouping,
  GroupingGetterFunction,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
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

import { EmployeService} from "../../../../core/erp"

@Component({
  selector: 'kt-list-employe',
  templateUrl: './list-employe.component.html',
  styleUrls: ['./list-employe.component.scss']
})
export class ListEmployeComponent implements OnInit {
  grid: any;
  gridService: GridService;
  dataview: any;
  angularGrid: AngularGridInstance;
  draggableGroupingPlugin: any;    
  columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    dataset: any[] = []
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private employeService: EmployeService
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
                       <a class="btn btn-sm btn-clean btn-icon mr-2" title="Modifier Employe">
                       <i class="flaticon2-pen"></i>
                   </a>
                   `;
                },
                minWidth: 50,
                maxWidth: 50,
                // use onCellClick OR grid.onClick.subscribe which you can see down below
                onCellClick: (e: Event, args: OnEventArgs) => {
                    const id = args.dataContext.id
                    this.router.navigateByUrl(`/accounting-setting/edit-employe/${id}`)
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
                id: "emp_addr",
                name: "Code Employe",
                field: "emp_addr",
                sortable: true,
                filterable: true,
                type: FieldType.string,
            },
            {
                id: "emp_fname",
                name: "Nom",
                field: "emp_fname",
                sortable: true,
                filterable: true,
                width: 50,
                type: FieldType.string,
            },
            {
                id: "emp_lname",
                name: "Prénom",
                field: "emp_lname",
                sortable: true,
                filterable: true,
                width: 50,
                type: FieldType.string,
            },
            {
              id: "emp_line1",
              name: "Adresse",
              field: "emp_line1",
              sortable: true,
              width: 120,
              filterable: true,
              type: FieldType.string,
            },
            {
              id: "emp_birth_date",
              name: "Date Naissance",
              field: "emp_birth_date",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.dateIso,
            },
            
            {
              id: "emp_job",
              name: "Métier",
              field: "emp_job",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.string,
            },
            
            {
              id: "emp_level",
              name: "Niveau",
              field: "emp_level",
              sortable: true,
              filterable: true,
              width: 50,
              type: FieldType.string,
            },
            {
              id: "emp_site",
              name: "Site",
              field: "emp_site",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
            
            {
              id: "emp_shift",
              name: "Equipe",
              field: "emp_shift",
              sortable: true,
              filterable: true,
              type: FieldType.string,
            },
         
            {
              id: "emp_rate",
              name: "Taux",
              field: "emp_rate",
              sortable: true,
              filterable: true,
              type: FieldType.float,
            },
            {
              id: "emp_mrate",
              name: "Taux Multiple",
              field: "emp_mrate",
              sortable: true,
              filterable: true,
              type: FieldType.float,
            },
            {
              id: "emp_arate",
              name: "Taux",
              field: "emp_arate",
              sortable: true,
              filterable: true,
              type: FieldType.float,
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
            frozenColumn: 0,
            frozenBottom: true,
            rowHeight:40,
        }

        // fill the dataset with your data
        this.dataset = []
        this.employeService.getAll().subscribe(
            (response: any) => {this.dataset = response.data
              this.dataview.setItems(this.dataset)},
            (error) => {
                this.dataset = []
            },
            () => {}
        )
    }
}
