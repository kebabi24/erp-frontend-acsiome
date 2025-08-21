import { Component, OnInit } from "@angular/core"
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

import { ProfileServiceService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-profile-service',
  templateUrl: './list-profile-service.component.html',
  styleUrls: ['./list-profile-service.component.scss']
})
export class ListProfileServiceComponent implements OnInit {

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private profileServiceService: ProfileServiceService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  createCode() {
      this.router.navigateByUrl("profiles/profile-service")
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
              id: "usgs_code",
              name: "Code Profile",
              field: "usgs_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "usgs_service",
              name: "Code Service",
              field: "usgs_service",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "chr01",
            name: "Désignation",
            field: "chr01",
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
          frozenColumn: 0,
          frozenBottom: true,
          presets: {
            sorters: [
              { columnId: 'id', direction: 'ASC' }
            ],
          },
      }

      // fill the dataset with your data
      this.dataset = []
      this.profileServiceService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
