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
    Filters,
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

import {  WorkOrderService } from "../../../../core/erp"

const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>{
if (value=="C"){
  return `<div class="text"  aria-hidden="C">Cloturé</div>`
}
if (value=="R"){
  return `<div class="text"  aria-hidden="R">Lancé</div>`
}
if (value=="F"){
  return `<div class="text"  aria-hidden="F">Valide</div>`
}
if (value=="D"){
  return `<div class="text"  aria-hidden="D">Reporté</div>`
}
}
  // return  value  ? `<div class="text"  aria-hidden="C">Clos</div>` : '<div class="text"  aria-hidden="R">Lancé</div>';}
@Component({
  selector: 'kt-list-wo',
  templateUrl: './list-wo.component.html',
  styleUrls: ['./list-wo.component.scss']
})
export class ListWoComponent implements OnInit {

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private workOrderService: WorkOrderService
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
                  console.log(id)
                  this.router.navigateByUrl(`/manufacturing/edit-wo/${id}`)
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
            id: "wo_nbr",
            name: "N°OF",
            field: "wo_nbr",
            sortable: true,
            filterable: true,
           
           
          },
        
          {
            id: "wo_queue_eff",
            name: "Ordre",
            field: "wo_queue_eff",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          {
            id: "wo_part",
            name: "Article",
            field: "wo_part",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          {
            id: "wo_ref",
            name: "dimension",
            field: "wo_ref",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          {
            id: "wo_batch",
            name: "couleur",
            field: "wo_batch",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          {
            id: "wo_rev",
            name: "Qualité",
            field: "wo_rev",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          {
            id: "wo_grade",
            name: "cilicone",
            field: "wo_grade",
            sortable: true,
            width: 50,
            filterable: true,
           
           
          },
          
          {
            id: "wo_qty_ord",
            name: "Quantité",
            field: "wo_qty_ord",
            sortable: true,
            width: 80,
            filterable: true,
           
          },
        
          {
            id: "wo_qty_comp",
            name: "Quantité Complété",
            field: "wo_qty_comp",
            sortable: true,
            width: 80,
            filterable: true,
           
          },
          {
            id: "wo_qty_rjct",
            name: "Quantité Squelette",
            field: "wo_qty_rjct",
            sortable: true,
            width: 80,
            filterable: true,
           
          },
          {
            id: "wo_qty_chg",
            name: "diff",
            field: "wo_qty_chg",
            sortable: true,
            width: 80,
            filterable: true,
           
          },
          {
            id: "wo_yield_pct",
            name: "Squelette/Total",
            field: "wo_yield_pct",
            sortable: true,
            width: 80,
            filterable: true,
           
          },
          {
            id: "wo_ord_date",
            name: "Date Création",
            field: "wo_ord_date",
            sortable: true,
            width: 80,
            filterable: true,
            formatter: Formatters.dateIso ,
            type: FieldType.dateIso,
           
          },
         
    
          {
            id: "wo_rel_date",
            name: "Date Lancement",
            field: "wo_rel_date",
            sortable: true,
            width: 80,
            filterable: true,
            formatter: Formatters.dateIso ,
            type: FieldType.dateIso,
           
          },
          {
            id: "wo_due_date",
            name: "Date Echéance",
            field: "wo_due_date",
            sortable: true,
            width: 80,
            filterable: true,
            formatter: Formatters.dateIso ,
            type: FieldType.dateIso,
           
          },
    
          {
            id: "wo_bom_code",
            name: "Code Nomenc",
            field: "wo_bom_code",
            sortable: true,
           
            filterable: true,
            type: FieldType.string,
          
            
          },
          {
            id: "wo_routing",
            name: "Gamme",
            field: "wo_routing",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          
            
          },
          
                  
          {
            id: "wo_lot_next",
            name: "Lot/Serie",
            field: "wo_lot_next",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          
            
          },
          {
            id: "wo_status",
            name: "Status",
            field: "wo_status",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.text,
             formatter: myCustomCheckboxFormatter,
            filter:{
              collection:[{value:"C",label:"Cloturé"},{value:"R",label:"Lancé"},{value:"F",label:"Valide"}, {value:"D",label:"Reporté"}],
              model: Filters.multipleSelect,
            }
          },
          
          {
            id: "wo_rmks",
            name: "Remarque",
            field: "wo_rmks",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.string,
          
          },
         
          {
            id: "wo_prod_pct",
            name: "% Rendement",
            field: "wo_prod_pct",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.percentComplete,
                     
          },
          
          {
            id: "wo__dec01",
            name: "Coût Matiére",
            field: "wo__dec01",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.percentComplete,
                     
          },
          
          {
            id: "wo__dec02",
            name: "Coût Main d'Oeuvre",
            field: "wo__dec02",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.percentComplete,
                     
          },
          
          {
            id: "wo__dec03",
            name: "Coût FG Variable",
            field: "wo__dec03",
            sortable: true,
            width: 80,
            filterable: true,
            type: FieldType.float,
            formatter: Formatters.percentComplete,
                     
          },
          
          
          
    
        ];

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          autoEdit: false,
          autoHeight: false,
          frozenColumn: 0,
          frozenBottom: true,
      }

      // fill the dataset with your data
      this.dataset = []
      this.workOrderService.getAll().subscribe(
          (response: any) => (this.dataset = response.data),
          (error) => {
              this.dataset = []
          },
          () => {}
      )
  }
}
