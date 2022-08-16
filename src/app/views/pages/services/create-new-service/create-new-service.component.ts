import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService } from "../../../../core/erp"
@Component({
  selector: 'kt-create-new-service',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './create-new-service.component.html',
  styleUrls: ['./create-new-service.component.scss']
})
export class CreateNewServiceComponent implements OnInit {
  service: MobileService
  serviceForm: FormGroup
  createServiceForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  services: []
  roles : string[] = []
  itinerary: string[] = []
  dataset: any[] = []
  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  gridService: GridService
  message: any
  column : Column
  grid: any
  dataView: any
  selectedRow: any
  isSelected = false
  constructor(
    config: NgbDropdownConfig,
        private serviceF : FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private mobileService: MobileServiceService,
        private roleService: RoleService,
        private itineraryService: ItineraryService,
        // private gridService: GridService,
        private modalService: NgbModal
  ) { 
        config.autoClose = true
        this.prepareGrid()
        // this.gridService.highlightRow("")
  }

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        // this.createForm()
        
  }



  


  open(content) {
    this.modalService.open(content, { size: "lg" })
  }

  open2(content) {
    this.modalService.open(content, { size: "lg" })
  }
  prepareGrid() {
    
    this.columnDefinitions = [
        {
            id: "role_code",
            name: "Code role",
            field: "role_code",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "role_name",
            name: "Nom role",
            field: "role_name",
            sortable: true,
            width: 100,
            filterable: true,
            type: FieldType.string,
        },
       
        
        {
          id: "user_mobile_code",
          name: "Code utilisateur",
          field: "user_mobile_code",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "username",
          name: "Nom utilisateur",
          field: "username",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "profile_code",
          name: "Code profile",
          field: "profile_code",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "service",
          name: "Code service",
          field: "service",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "etat_service",
          name: "Etat service",
          field: "etat_service",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "service_period_activate_date",
          name: "Période service",
          field: "service_period_activate_date",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "itinerary_code",
          name: "Code itinéraire ",
          field: "itinerary_code",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
        {
          id: "itinerary_name",
          name: "Nom itinéraire",
          field: "itinerary_name",
          sortable: true,
          width: 100,
          filterable: true,
          type: FieldType.string,
        },
    

        
    ]

    this.gridOptions = {
        enableSorting: true,
        enableCellNavigation: true,
        enableExcelCopyBuffer: true,
        enableFiltering: true,
        enableRowSelection: true,
        enableCheckboxSelector: true,
        autoEdit: false,
        autoHeight: false,
        frozenColumn: 0,
        frozenBottom: true,
        checkboxSelector: {
          // optionally change the column index position of the icon (defaults to 0)
          // columnIndexPosition: 1,

          // remove the unnecessary "Select All" checkbox in header when in single selection mode
          hideSelectAllCheckbox: true,

          // you can override the logic for showing (or not) the expand icon
          // for example, display the expand icon only on every 2nd row
          // selectableOverride: (row: number, dataContext: any, grid: any) => (dataContext.id % 2 === 1)
      },
        multiSelect: false,
        rowSelectionOptions: {
            // True (Single Selection), False (Multiple Selections)
            selectActiveRow: true,
      },
    }

    // fill the dataset with your data
    this.dataset = [
      {
        id:"1",
        role_code:"RV-001", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-000",
        service: "SER-001", 
        etat_service: "false", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      }, 
      {
        id:"2",
        role_code:"RV-002", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-001",
        service: "SER-001", 
        etat_service: "false", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      }, 
      {
        id:"3",
        role_code:"RV-003", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-002",
        service: "SER-001", 
        etat_service: "true", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      },
      {
        id:"4",
        role_code:"RV-004", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-003",
        service: "SER-001", 
        etat_service: "true", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      },
      {
        id:"5",
        role_code:"RV-001", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-004",
        service: "SER-001", 
        etat_service: "true", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      }, 
      {
        id:"6",
        role_code:"RV-002", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-005",
        service: "SER-001", 
        etat_service: "true", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      }, 
      {
        id:"7",
        role_code:"RV-003", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-006",
        service: "SER-001", 
        etat_service: "false", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      },
      {
        id:"8",
        role_code:"RV-004", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-007",
        service: "SER-001", 
        etat_service: "false", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      },
      {
        id:"9",
        role_code:"RV-004", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-008",
        service: "SER-001", 
        etat_service: "false", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      },
      {
        id:"10",
        role_code:"RV-004", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-009",
        service: "SER-001", 
        etat_service: "false", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      },
      {
        id:"11",
        role_code:"RV-004", 
        role_name: "vendeur", 
        user_mobile_code: "UM-001", 
        username: "Nouaaim", 
        profile_code:"PR-0010",
        service: "SER-001", 
        etat_service: "true", 
        service_period_activate_date: "01/01/1993", 
        itinerary_code: "ITN-001", 
        itinerary_name:"ZONE01"
      },
      

    ]

    // this.mobileService.getAllService().subscribe(
    //     (response: any) => 
    //     {
    //       this.dataset = response.data,
    //       console.log(this.dataset)
    //     },
    //     (error) => {
    //         this.dataset = []

    //     },
    //     () => {}
    // )
  }

  // onChangeCode() {
  //   const controls = this.serviceForm.controls
  //   const _service = new MobileService()
  //   const role_code = controls.role_code.value
  //   this.itineraryService.getItineraryByRole({role_code: role_code}).subscribe(
            
  //     (response: any) => {
  //     this.itinerary = response.data
  //     console.log(response.data)
  //     }
  // )

  // }

  // reset() {
  //   this.service = new MobileService()
  //   this.createForm()
  //   this.hasFormErrors = false
  // }

  onSubmit() {
    console.log(this.selectedRow.role_code)

    // tslint:disable-next-line:prefer-const
    // let service = this.prepareService()
    // this.addItinerary(service)
    }

  // prepareService() : MobileService{

  //   const controls = this.serviceForm.controls
  //   const _service = new MobileService()

  //   _service.service_code = controls.service_code.value
  //   _service.service_creation_date = controls.service_creation_date.value
  //   _service.service_closing_date = controls.service_closing_date.value
  //   _service.role_code = controls.role_code.value
  //   _service.itinerary_code = controls.itinerary_code.value
  //   // _service.service_open = controls.service_open.value
  //   return _service

  // }

  // addItinerary(_service: MobileService){
  //   console.log(_service)
  //   this.loadingSubject.next(true)
  //       this.mobileService.addService(_service).subscribe(
  //           (reponse) => console.log("response", Response),
  //           (error) => {
  //               this.layoutUtilsService.showActionNotification(
  //                   "Erreur verifier les informations",
  //                   MessageType.Create,
  //                   10000,
  //                   true,
  //                   true
  //               )
  //               this.loadingSubject.next(false)
  //           },
  //           () => {
  //             this.layoutUtilsService.showActionNotification(
  //               "Ajout avec succès",
  //               MessageType.Create,
  //               10000,
  //               true,
  //               true
  //           )
  //           this.loadingSubject.next(false)
  //           this.router.navigateByUrl("/service")

        
  //       }
  //       )
  // }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

handleSelectedRowsChanged(e, args) {
  if (Array.isArray(args.rows) && this.grid) {
      args.rows.map((idx) => {
          const item = this.grid.getDataItem(idx)
          item.etat_service = false
          this.selectedRow = item
          console.log(item)
      })
  }
  this.isSelected = true
  this.createForm(this.selectedRow)
}

createForm(row) {
  console.log(row)
  this.loadingSubject.next(false)
  this.service = new MobileService()
  this.createServiceForm = this.serviceF.group({
      service_code: [row.service, Validators.required],
      service_creation_date: [{value: this.service.service_closing_date}, Validators.required],
      service_closing_date: [{value: this.service.service_closing_date}, Validators.required],
      role_code: [row.role_code, Validators.required],
      itinerary_code: [row.itinerary_code, Validators.required],
      // service_open: [{value: this.service.service_open}, Validators.required],
      
  })
}



angularGridReady(angularGrid: AngularGridInstance) {
  this.angularGrid = angularGrid;
    this.dataView = angularGrid.dataView;
    this.grid = angularGrid.slickGrid;

    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
    this.dataView.getItemMetadata = this.updateItemMetadata(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
}

updateItemMetadata(previousItemMetadata: any) {
  const newCssClass = 'highlight-bg';
  return (rowNumber: number) => {
    const item = this.dataView.getItem(rowNumber);
    let meta = {
      cssClasses: ''
    };
    if (typeof previousItemMetadata === 'object') {
      meta = previousItemMetadata(rowNumber);
    }

    if (meta && item && item.etat_service) {
      const state = item.etat_service;
      if (state === "true") {
        meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
      }
    }

    return meta;
  };
}





 

}
