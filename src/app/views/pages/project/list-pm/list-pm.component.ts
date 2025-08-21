import { Component, OnInit } from "@angular/core";
// Angular slickgrid
import {
  Column,
  GridOption,
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


import { ProjectService } from "../../../../core/erp";
@Component({
  selector: 'kt-list-pm',
  templateUrl: './list-pm.component.html',
  styleUrls: ['./list-pm.component.scss']
})
export class ListPmComponent implements OnInit {

 
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []

  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}
  dataset2: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private projectService: ProjectService
  ) {
      this.prepareGrid()
    
  }

  ngOnInit(): void {
  }

 
  prepareGrid() {
      this.columnDefinitions = [
          
      //   {
      //     id: "edit",
      //     field: "id",
      //     excludeFromColumnPicker: true,
      //     excludeFromGridMenu: true,
      //     excludeFromHeaderMenu: true,
      //     formatter: (row, cell, value, columnDef, dataContext) => {
      //       // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
      //       return `
      //       <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit Projet">
      //            <i class="flaticon-edit"></i>
                 
      //        </a>
      //        `;
      //     },
      //     minWidth: 50,
      //     maxWidth: 50,
      //     // use onCellClick OR grid.onClick.subscribe which you can see down below
      //     onCellClick: (e: Event, args: OnEventArgs) => {
      //         const id = args.dataContext.id
      //         this.router.navigateByUrl(`/project/edit-project/${id}`)
      //     },
      // },
        
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 30,
              maxWidth: 30,
          },
          {
              id: "pm_code",
              name: "BT",
              field: "pm_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "pm_desc",
            name: "Designation",
            field: "pm_desc",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
         {
            id: "pm_status",
            name: "Statut",
            field: "pm_status",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
         {
            id: "pm_site",
            name: "Site",
            field: "pm_site",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
         {
            id: "pm_ord_date",
            name: "Date ",
            field: "pm_ord_date",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.dateIso,
        },
         {
            id: "pm_win_addr",
            name: "Equipement",
            field: "pm_win_addr",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
{
            id: "pm_type",
            name: "Type Travaux",
            field: "pm_type",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pm_doc_list",
            name: "Famille de travaux",
            field: "pm_doc_list",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "pm_reason",
            name: "Nature de travaux",
            field: "pm_reason",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
        },

          
          
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          enableAutoResize: true,
          autoEdit: false,
          autoHeight: false,
          frozenColumn: 0,
          frozenBottom: true,
      }    
      // fill the dataset with your data
      this.dataset = []
      this.projectService.getByAll({}).subscribe(
        
          (response: any) => {
          //  console.log(response.data),
            (this.dataset = response.data),
         
          (error) => {
              this.dataset = []
          },
          () => {}
         } )
        
  }
}