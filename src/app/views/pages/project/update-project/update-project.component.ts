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
  selector: 'kt-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {

  hasFormErrors = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  // slick grid
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  dataset: any[] = []
  pmForm: FormGroup;
  columnDefinitions2: Column[] = []
  gridOptions2: GridOption = {}
  dataset2: any[] = []
  pmedit: any
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private pmFB: FormBuilder,
      private layoutUtilsService: LayoutUtilsService,
      private projectService: ProjectService,
      private modalService: NgbModal,
  ) {
      this.prepareGrid()
    
  }

  ngOnInit(): void {
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
            id: "gm",
            name: "GM %",
            field: "gm",
            sortable: true,
            width: 80,
            filterable: false,
            type: FieldType.float,
            formatter: Formatters.percent,
            params: { minDecimal: 1, maxDecimal: 2 },
           
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
                   <svg class="svg-iconkamel" svg-icon-md viewBox="0 0 20 20">
                  <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
                </svg>
               </a>
               `;
            },
            minWidth: 50,
            maxWidth: 50,
            // use onCellClick OR grid.onClick.subscribe which you can see down below
            onCellClick: (e: Event, args: OnEventArgs) => {
               const id = args.dataContext.id
            
               this.projectService.getOne(id).subscribe(
                (respo: any) => {this.pmedit = respo.data.project
                 
                      console.log(this.pmedit)
              // if( args.dataContext.po.po_stat == "V" ||  args.dataContext.po.po_stat == "P" || args.dataContext.po.po_stat == null) {
              // this.router.navigateByUrl(`/purchasing/edit-po/${id}`)
              let element: HTMLElement = document.getElementById(
                "openVendsGrid"
              ) as HTMLElement;
              element.click();
              // }
              // else {
              //   alert("Modification Impossible pour ce Status")
              // }
                })
             
            },
          },

          
          
      ]

      this.gridOptions = {
          enableSorting: true,
          enableCellNavigation: true,
          enableExcelCopyBuffer: true,
          enableFiltering: false,
          autoEdit: false,
          enableAutoResize:true,
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
 
   createForm() {
     
  
    this.pmForm = this.pmFB.group({

    pm_status: [this.pmedit.pm_status ],

    pm_reason: [this.pmedit.pm_reason],
       
    pm_win_addr: [this.pmedit.pm_win_addr],
        
    pm_win_amt:  [this.pmedit.pm_win_amt],
       
    pm_win_cmmt: [this.pmedit.pm_win_cmmt],
        
    })
}


onSubmit() {
  this.hasFormErrors = false
  const controls = this.pmForm.controls
  /** check form */
 
  this.projectService
      .updateM({ pm_status: controls.pm_status.value, pm_reason: controls.pm_reason.value, pm_win_addr: controls.pm_win_addr.value,pm_win_amt: controls.pm_win_amt.value, pm_win_cmmt:controls.pm_win_cmmt.value }, this.pmedit.id)
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