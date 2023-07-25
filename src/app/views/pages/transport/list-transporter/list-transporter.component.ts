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

import { AddressService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-transporter',
  templateUrl: './list-transporter.component.html',
  styleUrls: ['./list-transporter.component.scss']
})
export class ListTransporterComponent implements OnInit {

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private addressService: AddressService
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
          field: "id",
          excludeFromColumnPicker: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
  
          minWidth: 50,
          maxWidth: 50,
        },
        {
          id: "ad_addr",
          name: "code",
          field: "ad_addr",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },

        {
          id: "ad_name",
          name: "Fournisseur",
          field: "ad_name",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: " ad_po_mthd",
          name: "Fournisseur",
          field: " ad_po_mthd",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ad_line1",
          name: "Adresse",
          field: "ad_line1",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
       
        {
          id: "ad_country",
          name: "pays",
          field: "ad_country",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ad_state",
          name: "Wilaya",
          field: "ad_state",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "ad_city",
          name: "comumne",
          field: "ad_city",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: " ad_attn",
          name: "Contact",
          field: "ad_attn",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: " ad_phone",
          name: "Telephone",
          field: "ad_phone",
          sortable: true,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: " ad_fax",
          name: "Fax",
          field: "ad_fax",
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
      this.addressService.getAllBy({ad_type:"Transporter"}).subscribe(
          (response: any) => {this.dataset = response.data
console.log(response.data)
          },
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
