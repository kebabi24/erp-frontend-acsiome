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

import { AssociationService } from "../../../../core/erp"


@Component({
  selector: 'kt-update-ass',
  templateUrl: './update-ass.component.html',
  styleUrls: ['./update-ass.component.scss']
})
export class UpdateAssComponent implements OnInit {

 // slick grid
 columnDefinitions: Column[] = []
 gridOptions: GridOption = {}
 dataset: any[] = []
 constructor(
     private activatedRoute: ActivatedRoute,
     private router: Router,
     public dialog: MatDialog,
     private layoutUtilsService: LayoutUtilsService,
     private associationService: AssociationService
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
          <a class="btn btn-sm btn-clean btn-icon mr-2" title="Edit">
          <i class="flaticon-edit"></i>
      </a>
           `;
        },
      
        minWidth: 50,
        maxWidth: 50,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
            const id = args.dataContext.id
            this.router.navigateByUrl(`/patient/edit-ass/${id}`)
        },
    },
       {
         id: "id",
         field: "id",
         name:"id",
         minWidth: 50,
         maxWidth: 50,
       },
       
       {
           id: "ass_code",
           name: "Code Association",
           field: "ass_code",
           sortable: true,
           filterable: true,
           type: FieldType.string,
       },
       {
         id: "ass_name",
         name: "Nom",
         field: "ass_name",
         sortable: true,
         filterable: true,
         type: FieldType.string,
     },
     {
       id: "ass_line1",
       name: "Adresse",
       field: "ass_line1",
       sortable: true,
       filterable: true,
       type: FieldType.string,
   },
     {
       id: "ass_phone",
       name: "Tel",
       field: "ass_phone",
       sortable: true,
       filterable: true,
       type: FieldType.string,
     },
     {
       id: "ass_fax",
       name: "Fax",
       field: "ass_fax",
       sortable: true,
       filterable: true,
       type: FieldType.string,
     },
     {
       id: "ass_email",
       name: "Email",
       field: "ass_email",
       sortable: true,
       filterable: true,
       type: FieldType.string,
     },
     {
       id: "ass_city",
       name: "commune",
       field: "ass_city",
       sortable: true,
       filterable: true,
       type: FieldType.string,
     },
     {
       id: "ass_state",
       name: "Wilaya",
       field: "ass_state",
       sortable: true,
       filterable: true,
       type: FieldType.string,
     },
     
     {
         id: "ass_contact_fname",
         name: "Contact Nom",
         field: "ass_contact_fname",
         sortable: true,
         filterable: true,
         type: FieldType.string,
     },
     {
       id: "ass_contact_lname",
       name: "Contact Prenom",
       field: "ass_contact_lname",
       sortable: true,
       filterable: true,
       type: FieldType.string,
     },
     {
       id: "ass_contact_adress",
       name: "Adresse Contact",
       field: "ass_contact_adress",
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
         // frozenColumn: 0,
         // frozenBottom: true,
     }

     // fill the dataset with your data
     this.dataset = []
     this.associationService.getAll().subscribe(
         (response: any) => (this.dataset = response.data),
         (error) => {
             this.dataset = []
         },
         () => {}
     )
 }
}
