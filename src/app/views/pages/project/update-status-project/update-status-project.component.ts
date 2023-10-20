import { Component, OnInit } from "@angular/core";
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
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, BehaviorSubject, Subscription, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
// Layout
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout";
// CRUD
import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud";
import { MatDialog } from "@angular/material/dialog";

import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { ProjectService } from "../../../../core/erp";

@Component({
  selector: 'kt-update-status-project',
  templateUrl: './update-status-project.component.html',
  styleUrls: ['./update-status-project.component.scss']
})
export class UpdateStatusProjectComponent implements OnInit {
  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

 
  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []

  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}
  dataset2: any[] = []
  projectForm: FormGroup;
  pmEdit:any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private projectFB: FormBuilder,
      private layoutUtilsService: LayoutUtilsService,
      private projectService: ProjectService,
      private modalService: NgbModal,
  ) {
      this.prepareGrid()
    
  }

  ngOnInit(): void {
  }

  createForm() {
    
    this.projectForm = this.projectFB.group({
        
        pm_status: [this.pmEdit.pm_status],
        
    })
}
 
  prepareGrid() {
      this.columnDefinitions = [
          
          {
              id: "id",
              name: "id",
              field: "id",
              sortable: true,
              minWidth: 30,
              maxWidth: 30,
          },
          {
            id: "pm_cust",
            name: "Code Client",
            field: "pm_cust",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "ad_name",
            name: "Client",
            field: "ad_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
              id: "pm_code",
              name: "Code Projet",
              field: "pm_code",
              sortable: true,
              filterable: true,
              type: FieldType.string,
          },
          {
            id: "pm_desc",
            name: "Designation",
            field: "pm_desc",
            sortable: true,
            width: 120,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "pm_site",
            name: "Site",
            field: "pm_site",
            sortable: true,
            filterable: true,
            type: FieldType.string,
          },
          {
            id: "pm_amt",
            name: "Selling Price",
            field: "pm_amt",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
          },
          {
            id: "pm_cost",
            name: "Budget",
            field: "pm_cost",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
           
          },
          {
            id: "pm_status",
            name: "Status",
            field: "pm_status",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.string,
           
          },
          {
            id: "change",
            name: "Changer Status",
            field: "id",
            excludeFromColumnPicker: true,
            excludeFromGridMenu: true,
            excludeFromHeaderMenu: true,
           // formatter: Formatters.editIcon,
            formatter: (row, cell, value, columnDef, dataContext) => {
              // you can return a string of a object (of type FormatterResultObject), the 2 types are shown below
              return `
                   <a class="btn btn-sm btn-clean btn-icon mr-2" title="Changer Status">
                   <i class="flaticon2-pen"></i>
               </a>
               `;
            },
            minWidth: 50,
            maxWidth: 50,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
              const id = args.dataContext.id
              //console.log(args.dataContext.po.po_stat)
              this.projectService.getOne(id).subscribe(
               (respo: any) => {this.pmEdit = respo.data.project
                console.log(this.pmEdit)
             // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
             // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
             let element: HTMLElement = document.getElementById(
               "openProjectsGrid"
             ) as HTMLElement;
             element.click();
             // }
             // else {
             //   alert("Modification Impossible pour ce Status")
             // }
      
             })
           },
          }
          
          
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: true,
          enableAutoResize: true,
          autoEdit: false,
          autoHeight: false,
          frozenColumn: 0,
          frozenBottom: true,
      }    
      // fill the dataset with your data
      this.dataset = []
      this.projectService.getAllPmdetail().subscribe(
        
          (response: any) => {
          //  console.log(response.data),
            (this.dataset = response.data),
         
          (error) => {
              this.dataset = []
          },
          () => {}
         } )
        
  }
 
  openchange(contentvend) {
    // this.prepareGridvend();
    this.createForm();
     this.modalService.open(contentvend, { size: "lg" });
   }
   onSubmit() {
    this.hasFormErrors = false
    const controls = this.projectForm.controls
    /** check form */
   
    this.projectService
        .updateM({ pm_status: controls.pm_status.value }, this.pmEdit.id)
        .subscribe( //(res) => {

          (reponse) => console.log("response", Response),
          (error) => {
              this.layoutUtilsService.showActionNotification(
                  "Erreur verifier les informations",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
          },
          () => {
              this.layoutUtilsService.showActionNotification(
                  "Modification Status avec succès",
                  MessageType.Create,
                  10000,
                  true,
                  true
              )
              this.loadingSubject.next(false)
              // this.router.navigateByUrl("/purchasing/edit-status-po")
            
          }
      )


          //  const url = `/`
            //this.router.navigateByUrl(url, {
              //  relativeTo: this.activatedRoute,
            //})
       // })
}

}