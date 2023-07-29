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

import { CostlistService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-costlist',
  templateUrl: './list-costlist.component.html',
  styleUrls: ['./list-costlist.component.scss']
})
export class ListCostlistComponent implements OnInit {

  
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private costlistService: CostlistService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
  }

  createCode() {
      this.router.navigateByUrl("devise/create-devise")
  }
  prepareGrid() {
      this.columnDefinitions = [
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 50,
              maxWidth: 50,
          },
         
          {
              id: "ltrc_code",
              name: "Code",
              field: "ltrc_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "ltrc_desc",
              name: "Designation",
              field: "ltrc_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "ltrc_site",
            name: "Site ",
            field: "ltrc_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "ltrc_curr",
            name: "Devise",
            field: "ltrc_curr",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "ltrc_um",
            name: "UM",
            field: "ltrc_um",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           
          },

          {
            id: "ltrc_trc_code",
            name: "Code Frais",
            field: "ltrc_trc_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ltrc_type",
            name: "Type",
            field: "ltrc_type",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          }, 
          {
            id: "ltrc_trmode",
            name: "Mode Transport",
            field: "ltrc_trmode",
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
          autoHeight: true,
          enableAutoResize:true,
          frozenColumn: 0,
          frozenBottom: true,
      }

      // fill the dataset with your data
      this.dataset = []
      this.costlistService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
