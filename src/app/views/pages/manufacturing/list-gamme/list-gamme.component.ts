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

import {  WorkRoutingService } from "../../../../core/erp"
@Component({
  selector: 'kt-list-gamme',
  templateUrl: './list-gamme.component.html',
  styleUrls: ['./list-gamme.component.scss']
})
export class ListGammeComponent implements OnInit {

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private workRoutingService: WorkRoutingService
  ) {
      this.prepareGrid()
  }

  ngOnInit(): void {
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
                <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit Gamme">
                <i class="flaticon2-edit"></i>
            </a>
                 `;
              },
              minWidth: 50,
              maxWidth: 50,
              // use onCellClick OR grid.onClick.subscribe which you can see down below
              onCellClick: (e: Event, args: OnEventArgs) => {
                  const id = args.dataContext.id
                  this.router.navigateByUrl(`/manufacturing/edit-gamme/${id}`)
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
            id: "ro_routing",
            name: "Code Gamme",
            field: "ro_routing",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ro_op",
            name: "Opération",
            field: "ro_op",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },

          {
              id: "ro_wkctr",
              name: "Centre Charge",
              field: "ro_wkctr",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "ro_mch",
            name: "Code Machine",
            field: "ro_mch",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        
          {
              id: "ro_desc",
              name: "Designation",
              field: "ro_desc",
              sortable: true,
              width: 200,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "ro_mch_op",
            name: "Machine par Opération",
            field: "ro_mch_op",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_batch",
            name: "AUnité Chevaugement",
            field: "ro_batch",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          }, 
          {
            id: "ro_tran_qty",
            name: "Délai ST",
            field: "ro_tran_qty",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_queue",
            name: "Attente Amont",
            field: "ro_queue",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_setup_men",
            name: "Exécution Réglage",
            field: "ro_setup_men",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_milestone",
            name: "Opération Jalon",
            field: "ro_milestone",
            sortable: true,
            filterable: true,
            type: FieldType.boolean,
            formatter: Formatters.checkmark
          },
          {
            id: "ro_wait",
            name: "Attente Aval",
            field: "ro_wait",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_men_mch",
            name: "Exécution Equipe",
            field: "ro_men_mch",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },

          {
            id: "ro_setup",
            name: "Temps Réglage",
            field: "ro_setup",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_tool",
            name: "Code Outil",
            field: "ro_tool",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ro_run",
            name: "Temps Production/Unité",
            field: "ro_run",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_vend",
            name: "Fournisseur:",
            field: "ro_vend",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ro_move",
            name: "Transfert",
            field: "ro_move",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },
          {
            id: "ro_inv_value",
            name: "Valeur Stock",
            field: "ro_inv_value",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },          
          {
            id: "ro_sub_cost",
            name: "Coût sous-traitance",
            field: "ro_sub_cost",
            sortable: true,
            filterable: true,
            type: FieldType.number,
          },      
          {
            id: "ro_start",
            name: "Date de Démarage",
            field: "ro_start",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
            formatter: Formatters.dateIso
          },         
          {
            id: "ro_end",
            name: "Date de Fin",
            field: "ro_end",
            sortable: true,
            filterable: true,
            type: FieldType.dateIso,
            formatter: Formatters.dateIso
          },
          {
            id: "ro_yield_pct",
            name: "Pourcentage de Rendement",
            field: "ro_yield_pct",
            sortable: true,
            filterable: true,
            type: FieldType.number,
            formatter: Formatters.percent,
          },
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          // enableAutoResize : true,
          enableAutoResizeColumnsByCellContent: true,

          autoEdit: false,
          autoHeight: true,
          frozenColumn: 0,
          frozenBottom: true,
      }

      // fill the dataset with your data
      this.dataset = []
      this.workRoutingService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
