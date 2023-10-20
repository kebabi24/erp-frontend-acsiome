import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
import { HttpClient } from "@angular/common/http"
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
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

import { Patient, PatientService, CodeService, SiteService,UsersService, AssociationService} from "../../../../core/erp"

@Component({
  selector: 'kt-update-patient',
  templateUrl: './update-patient.component.html',
  styleUrls: ['./update-patient.component.scss']
})
export class UpdatePatientComponent implements OnInit {

   // slick grid
   columnDefinitions: Column[] = []
   gridOptions: GridOption = {}
   dataset: any[] = []
 
   row_number
     columnDefinitionsdet: Column[] = []
     gridOptionsdet: GridOption = {}
     gridObjdet: any
     angularGriddet: AngularGridInstance
   datasetdet: any[] = []
   datadet: any[] = []
   iid: Number
   constructor(
       private activatedRoute: ActivatedRoute,
       private router: Router,
       public dialog: MatDialog,
       private layoutUtilsService: LayoutUtilsService,
       private patientService: PatientService,
       private modalService: NgbModal,
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
              this.router.navigateByUrl(`/patient/edit-patient/${id}`)
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
             id: "pat_code",
             name: "Code Association",
             field: "pat_code",
             sortable: true,
             filterable: true,
             type: FieldType.string,
         },
         {
           id: "pat_fname",
           name: "Nom",
           field: "pat_fname",
           sortable: true,
           filterable: true,
           type: FieldType.string,
       },
       {
         id: "pat_lname",
         name: "Prénom",
         field: "pat_lname",
         sortable: true,
         filterable: true,
         type: FieldType.string,
     },
     {
       id: "pat_birth_date",
       name: "Date Naissance",
       field: "pat_birth_date",
       sortable: true,
       filterable: true,
       type: FieldType.dateIso,
   },
   {
     id: "int01",
     name: "Age",
     field: "int01",
     sortable: true,
     filterable: true,
     type: FieldType.integer,
 },
 
       {
         id: "pat_sex",
         name: "Sexe",
         field: "pat_sex",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "pat_blood",
         name: "Groupe Sangun",
         field: "pat_blood",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "pat_phone",
         name: "Tel",
         field: "pat_phone",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "pat_fax",
         name: "Fax",
         field: "pat_fax",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "pat_email",
         name: "Email",
         field: "pat_email",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "pat_city",
         name: "commune",
         field: "pat_city",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       {
         id: "pat_state",
         name: "Wilaya",
         field: "pat_state",
         sortable: true,
         filterable: true,
         type: FieldType.string,
       },
       
         {
             id: "pat_contact_fname",
             name: "Contact Nom",
             field: "pat_contact_fname",
             sortable: true,
             filterable: true,
             type: FieldType.string,
         },
         {
           id: "pat_contact_lname",
           name: "Contact Prenom",
           field: "pat_contact_lname",
           sortable: true,
           filterable: true,
           type: FieldType.string,
       },
       {
         id: "pat_contact_tel",
         name: "Contact Tél",
         field: "pat_contact_tel",
         sortable: true,
         filterable: true,
         type: FieldType.string,
     },
     {
       id: "pat_parent_liaison",
       name: "Lien",
       field: "pat_parent_liaison",
       sortable: true,
       filterable: true,
       type: FieldType.string,
   },
       {
         id: "det",
         name: "Détail Patientt",
         field: "id",
         excludeFromColumnPicker: true,
         excludeFromGridMenu: true,
         excludeFromHeaderMenu: true,
         
           //formatter: Formatters.editIcon,
           formatter: (row, cell, value, columnDef, dataContext) => {
             // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
             return `
             <a class="btn btn-sm btn-clean btn-icon mr-2" title="Détail">
             <i class="flaticon2-list-1"></i>
         </a>
              `;
           },
         
         minWidth: 50,
         maxWidth: 80,
         // use onCellClick OR grid.onClick.subscribe which you can see down below
         onCellClick: (e: Event, args: OnEventArgs) => {
            const id = args.dataContext.id
            this.iid = id
           // this.getData(id)
            this.row_number = args.row;
            let element: HTMLElement = document.getElementById(
              "openItemsGrid"
            ) as HTMLElement;
            element.click();
           //  console.log(args.dataContext.po.po_stat)
           //  this.router.navigateByUrl(`/inventory-transaction/po-receip-id/${id}`)
         },
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
       this.patientService.getAll().subscribe(
           (response: any) => (this.dataset = response.data),
           (error) => {
               this.dataset = []
           },
           () => {}
       )
   }
   
 
 
   angularGridReadydet(angularGrid: AngularGridInstance) {
     this.angularGriddet = angularGrid
     this.gridObjdet = (angularGrid && angularGrid.slickGrid) || {}
 }
 
 prepareGriddet() {
   
   this.columnDefinitionsdet= [
     {
       id: "id",
       field: "id",
     
       minWidth: 30,
       maxWidth: 30,
    
     
     },
     {
       id: "patd_type",
       name: "Tytpe",
       field: "patd_type",
       sortable: true,
       width: 50,
       filterable: false,
       type: FieldType.string,
     
       
     
     },
 
    
     {
       id: "patd_disease",
       name: "Maladie",
       field: "patd_disease",
       sortable: true,
       width: 50,
       filterable: false,
       type: FieldType.string,
      
     
     },
     {
       id: "patd_year",
       name: "Année",
       field: "patd_year",
       sortable: true,
       width: 50,
       filterable: false,
       type: FieldType.string,
       
     
 
     },
     {
       id: "patd_cmmt",
       name: "Commentaire",
       field: "patd_cmmt",
       sortable: true,
       width: 50,
       filterable: false,
       type: FieldType.text,
       
     
 
     },
         
     ]
 
     this.gridOptionsdet = {
       enableSorting: true,
       enableCellNavigation: true,
       enableExcelCopyBuffer: true,
       enableFiltering: true,
       autoEdit: false,
       autoHeight: false,
      
      
     }  
     this.patientService
     .getOne(this.iid)
     .subscribe((response: any) => {this.datasetdet = response.data.patientDetail
     console.log(response.data.patientDetail)
     })
     // fill the dataset with your data
     // this.patientService
     //     .getOne(id)
     //     .subscribe((response: any) => {this.datasetdet = response.data.patientDetail
     //     console.log(response.data.patientDetail)})
 }
 opendet(content) {
    
     this.prepareGriddet()
     this.modalService.open(content, { size: "xl" })
 }
 // getData(i){
 //   this.patientService
 //   .getOne(i)
 //   .subscribe((response: any) => {this.datadet = response.data.patientDetail
 //   console.log(response.data.patientDetail)
 //   this.prepareGriddet()
 //   this.modalService.open(content, { size: "xl" })
 // })
 
 // }
 }
 