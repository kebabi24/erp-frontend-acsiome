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

import { DealService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-deal',
  templateUrl: './list-deal.component.html',
  styleUrls: ['./list-deal.component.scss']
})
export class ListDealComponent implements OnInit {

  
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private dealService: DealService
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
              id: "edit",
              field: "id",
              excludeFromColumnPicker: true,
              excludeFromGridMenu: true,
              excludeFromHeaderMenu: true,
              formatter: (row, cell, value, columnDef, dataContext) => {
                  // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
                  return `
              <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
              <span class="svg-icon svg-icon-md">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                      height="24px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <rect x="0" y="0" width="24" height="24"></rect>
                          <path
                              d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z"
                              fill="#000000" fill-rule="nonzero"
                              transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) ">
                          </path>
                          <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                      </g>
                  </svg>
              </span>
          </a>
          `
              },
              minWidth: 50,
              maxWidth: 50,
              // use onCellClick OR grid.onClick.subscribe which you can see down below
              onCellClick: (e: Event, args: OnEventArgs) => {
                  const id = args.dataContext.id
                  this.router.navigateByUrl(`/deal/edit-deal/${id}`)
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
              id: "deal_code",
              name: "Code",
              field: "deal_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
              id: "deal_desc",
              name: "Designation",
              field: "deal_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "deal_cust",
            name: "Client",
            field: "deal_cust",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
          {
            id: "deal_start_date",
            name: "Date Début",
            field: "deal_start_date",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
           },
           {
            id: "deal_end_date",
            name: "Date Fin",
            field: "deal_end_date",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
           },
           {
            id: "deal_amt",
            name: "Montant",
            field: "deal_amt",
            sortable: true,
            filterable: true,
            type: FieldType.float,
           },
           {
            id: "deal_inv_meth",
            name: "Méthode de Facturaion",
            field: "deal_inv_meth",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           },
           {
            id: "deal_pay_meth",
            name: "Méthode de Paiement",
            field: "deal_pay_meth",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           },
           {
            id: "deal_pen_cust",
            name: "Pénalité Client",
            field: "deal_pen_cust",
            sortable: true,
            filterable: true,
            type: FieldType.float,
           },
           {
            id: "deal_pen_prov",
            name: "Pénalité Fournisseur",
            field: "deal_pen_prov",
            sortable: true,
            filterable: true,
            type: FieldType.float,
           },
           {
            id: "deal_delai_cust",
            name: "Délai Pénalité Client",
            field: "deal_delai_cust",
            sortable: true,
            filterable: true,
            type: FieldType.float,
           },
           {
            id: "deal_delai_prov",
            name: "Délai Pénalité Fournisseur",
            field: "deal_delai_prov",
            sortable: true,
            filterable: true,
            type: FieldType.float,
           },
           {
            id: "deal_status",
            name: "Status",
            field: "deal_status",
            sortable: true,
            filterable: true,
            type: FieldType.string,
           },
           {
            id: "deal_open",
            name: "Ouvert/Ferme",
            field: "deal_open",
            sortable: true,
            filterable: true,
            formatter:Formatters.checkmark,
            type: FieldType.boolean,
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
      }

      // fill the dataset with your data
      this.dataset = []
      this.dealService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
