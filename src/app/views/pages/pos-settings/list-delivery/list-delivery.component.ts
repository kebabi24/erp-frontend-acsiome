import { Component, OnInit } from "@angular/core"
// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Formatters,
    Editor,
    Editors,
    AngularGridInstance,
    GridService,
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

import { DeliveryService } from "../../../../core/erp"
interface DataItem {
  id: number;
  title: string;
  duration: string;
  percentComplete: number;
  percentComplete2: number;
  start: Date;
  finish: Date;
  effortDriven: boolean;
  phone: string;
  del_cndt: number;
}
const myCustomCheckboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) =>
  value ? `<div class="text"  aria-hidden="true">Oui</div>` : '<div class="text"  aria-hidden="true">Non</div>';
  
@Component({
  selector: 'kt-list-delivery',
  templateUrl: './list-delivery.component.html',
  styleUrls: ['./list-delivery.component.scss']
})
export class ListDeliveryComponent implements OnInit {
 // slick grid
 gridObj: any;
 gridService: GridService;
 dataviewObj: any;
 angularGrid: AngularGridInstance;
 columnDefinitions: Column[] = []
 gridOptions: GridOption = {}
 dataset: any[] = []
 constructor(
     private activatedRoute: ActivatedRoute,
     private router: Router,
     public dialog: MatDialog,
     private layoutUtilsService: LayoutUtilsService,
     private deliveryService: DeliveryService
 ) {
     this.prepareGrid()
 }

 ngOnInit(): void {
 }

 angularGridReady(angularGrid: AngularGridInstance) {
     this.angularGrid = angularGrid;
     this.gridObj = angularGrid.slickGrid; // grid object
     this.dataviewObj = angularGrid.dataView;
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
                 this.router.navigateByUrl(`/pos-settings/edit-delivery/${id}`)
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
             id: "del_code",
             name: "Code Plateforme",
             field: "del_code",
             sortable: true,
             filterable: true,
             type: FieldType.string,
         },
         
         {
             id: "del_desc",
             name: "Description",
             field: "del_desc",
             sortable: true,
             width: 200,
             filterable: true,
             type: FieldType.string,
         },
         {
             id: "del_pct_disc",
             name: "Remise",
             field: "del_pct_disc",
             sortable: true,
             width: 80,
             filterable: true,
             type: FieldType.float,
         },
         {
             id: "del_valid",
             name: "Date Début",
             field: "del_valid",
             sortable: true,
             width: 80,
             filterable: true,
             type: FieldType.date,
         },
         {
             id: "del_exp",
             name: "Date Fin",
             field: "del_exp",
             sortable: true,
             width: 80,
             filterable: true,
             type: FieldType.date,
         },
         {
             id: "del_start_offer",
             name: "Heure Début",
             field: "del_start_offer",
             sortable: true,
             width: 80,
             filterable: true,
             type: FieldType.string,
         },
         {
          id: "del_end_offer",
          name: "Heure Fin",
          field: "del_end_offer",
          sortable: true,
          width: 80,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "del_cndt_actif",
        name: "Condition",
        field: "del_cndt_actif",
        sortable: true,
        filterable: true,
        type: FieldType.boolean,
        formatter: Formatters.checkmark
      },
    
      {
          id: "del_cndt",
          name: "Famille",
          field: "del_cndt",
          sortable: true,
          width: 200,
          filterable: true,
          type: FieldType.string,
      },
      {
        id: "del_cndt_qty",
        name: "Quantité",
        field: "del_cndt_qty",
        sortable: true,
        width: 200,
        filterable: true,
        type: FieldType.float,
      },

      {
        id: "actif",
        name: "Active",
        field: "actif",
        sortable: true,
        width: 80,
        filterable: true,
        type: FieldType.boolean,
        formatter: Formatters.checkmark
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
     }

     // fill the dataset with your data
     this.dataset = []
     this.deliveryService.getAll().subscribe(
         (response: any) => {
             this.dataset = response.data
             this.dataviewObj.setItems(this.dataset)
         },
         (error) => {
             this.dataset = []
         },
         () => {}
     )
 }
}
