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

import { TransportcostService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-cost',
  templateUrl: './list-cost.component.html',
  styleUrls: ['./list-cost.component.scss']
})
export class ListCostComponent implements OnInit {

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private transportcostService: TransportcostService
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
              id: "trc_code",
              name: "Code",
              field: "trc_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "trc_desc",
              name: "Designation",
              field: "trc_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "trc_acct",
            name: "Compte ",
            field: "trc_acct",
            sortable: true,
            filterable: true,
            type: FieldType.float,
          },
          
          {
            id: "trc_project",
            name: "Projet",
            field: "trc_project",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          
          {
            id: "trc_taxable",
            name: "A Taxer",
            field: "trc_taxable",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            formatter: Formatters.checkmark
          },

          {
            id: "trc_taxc",
            name: "Taxe",
            field: "trc_taxc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "trc_disc",
            name: "Remise au paiement",
            field: "trc_disc",
            sortable: true,
            filterable: true,
            type: FieldType.string,
            formatter: Formatters.checkmark
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
      this.transportcostService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
