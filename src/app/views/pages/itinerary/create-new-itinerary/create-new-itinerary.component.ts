import { Component, OnInit } from '@angular/core';

import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { ActivatedRoute, Router } from "@angular/router"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import {
  SubheaderService,
  LayoutConfigService,
} from "../../../../core/_base/layout"

import {
  LayoutUtilsService,
  TypesUtilsService,
  MessageType,
} from "../../../../core/_base/crud"

import {

  Itinerary,
  ItineraryService,
  CustomerMobileService,
  CodeMobileService, 
  RoleService,
  RoleItinerary

} from "../../../../core/erp"

import { config } from 'process';

@Component({
  selector: 'kt-create-new-itinerary',
  templateUrl: './create-new-itinerary.component.html',
  styleUrls: ['./create-new-itinerary.component.scss']
})
export class CreateNewItineraryComponent implements OnInit {
    lat = 36.748205868214235;
    lng = 3.083509081242227;
    zoom: number = 10;
    itinerary: Itinerary
    itineraryForm: FormGroup
    hasFormErrors= false
    loadingSubject = new BehaviorSubject<boolean>(true)
    loading$ : Observable<boolean>
    isExist = false
    customers: number[] = []
    columnDefinitions: Column[] = []
    gridOptions: GridOption = {}
    gridObj: any
    angularGrid: AngularGridInstance
    //selectedRows: any[] = []
    dataset: any[] = []
    itinerary_type : any[] = []
    week_days : any[] = []
    // roles : any[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private typesUtilsService: TypesUtilsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private layoutConfigService: LayoutConfigService,
    private modalService: NgbModal,
    private itineraryService: ItineraryService,
    private customerMobileService: CustomerMobileService,
    private codeMobileService: CodeMobileService,
    private roleService: RoleService,
    config: NgbDropdownConfig
  ) { 
    config.autoClose = true
    this.codeMobileService
            .getBy({ code_name: "week_days" })
            .subscribe((response: any) => this.week_days = response.data)
    this.codeMobileService
            .getBy({ code_name: "itinerary_type" })
            .subscribe((response: any) => this.itinerary_type = response.data)
    this.prepareGrid()
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
  }

  createForm(){
    this.loadingSubject.next(false)
    this.itinerary = new Itinerary()
    this.itineraryForm = this.formBuilder.group({
      itinerary_name : [this.itinerary.itinerary_name, Validators.required],
      itinerary_type : [{value : this.itinerary.itinerary_type}, Validators.required],
      itinerary_day : [{value : this.itinerary.itinerary_day}, Validators.required],
      customers : [{value : this.itinerary.customers_name}, Validators.required],
      // roles : [{value : this.itinerary.roles}, Validators.required]
    })
  }

  prepareGrid() {
    this.columnDefinitions = [
        {
            id: "id",
            name: "id",
            field: "id",
            sortable: true,
            minWidth: 80,
            maxWidth: 80,
        },
       
        {
            id: "customer_name",
            name: "Client",
            field: "customer_name",
            sortable: true,
            filterable: true,
            type: FieldType.string,
        },
        {
            id: "customer_name2",
            name: "Nom Complet",
            field: "customer_name2",
            sortable: true,
            width: 100,
            filterable: true,
            type: FieldType.string,
        },
     
        
        {
          id: "customer_contact",
          name: "Contact",
          field: "customer_contact",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
        },
        {
          id: "customer_barcode",
          name: "Barcode",
          field: "customer_barcode",
          sortable: true,
          filterable: true,
          type: FieldType.boolean,
        },
        
    ]

    this.gridOptions = {
        enableAutoResize: true,
        enableCellNavigation: true,
        enableFiltering: true,
        enableCheckboxSelector: true,
        enableRowSelection: true,
        rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
        },
        frozenColumn: 0,
        frozenBottom: true,
        //multiSelect: false,
    }

    // fill the dataset with your data
    this.dataset = []
    this.customerMobileService.getAllCustomers().subscribe(
        (response: any) => (this.dataset = response.data),
        (error) => {
            this.dataset = []
        },
        () => {}
    )
  }


    reset() {
      this.itinerary = new Itinerary()
      this.createForm()
      this.hasFormErrors = false
    }

    onSubmit() {
      this.hasFormErrors = false
      const controls = this.itineraryForm.controls
      /** check form */
      if (this.itineraryForm.invalid) {
          Object.keys(controls).forEach((controlName) =>
              controls[controlName].markAsTouched()
          )

          this.hasFormErrors = true
          return
      }
      

      // tslint:disable-next-line:prefer-const
      let itn = this.prepareItinerary()
      this.addItinerary(itn, this.customers)
      }

  prepareItinerary() : Itinerary{

    const controls = this.itineraryForm.controls
    const _itinerary = new Itinerary()

    _itinerary.itinerary_name = controls.itinerary_name.value
    _itinerary.itinerary_day = controls.itinerary_day.value
    _itinerary.itinerary_type = controls.itinerary_type.value
    return _itinerary

  }

 

  addItinerary(_itinerary: Itinerary, _customers: any){
    this.loadingSubject.next(true)
        this.itineraryService.addItinerary({itinerary: _itinerary, customers: _customers }).subscribe(
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
                "Ajout avec succès",
                MessageType.Create,
                10000,
                true,
                true
            )
            this.loadingSubject.next(false)
            this.router.navigateByUrl("/itinerary/list-itinerary")

        
        }
        )
  }

  // prepareRoleItinerary(){
  //   const _controls = this.itineraryForm.controls
  //   const _role_itinerary = new RoleItinerary()

  //     _role_itinerary.role_name = _controls.roles.value
  //     _role_itinerary.itinerary_name = _controls.itinerary_name.value
      
  //     return _role_itinerary
  // }

  // addRoleItinerary(_role_itinerary: RoleItinerary){
  //   this.loadingSubject.next(true)
  //   this.itineraryService.addRoleItinerary(_role_itinerary).subscribe(
  //       (reponse) => console.log("response", Response),
  //       (error) => {
  //           this.layoutUtilsService.showActionNotification(
  //               "Erreur verifier les informations",
  //               MessageType.Create,
  //               10000,
  //               true,
  //               true
  //           )
  //           this.loadingSubject.next(false)
  //       },
  //       () => {
  //             this.layoutUtilsService.showActionNotification(
  //               "Ajout avec succès",
  //               MessageType.Create,
  //               10000,
  //               true,
  //               true
  //           )
  //           this.loadingSubject.next(false)
  //           this.router.navigateByUrl("/itinerary/list-itinerary")

        
  //       }
  //   )
  // }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/itinerary/list-itinerary`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}


  handleSelectedRowsChanged(e, args) {
      
    if (Array.isArray(args.rows) && this.gridObj) {
        // console.log("log")
        this.customers = args.rows.map((idx: number) => {
          const item = this.gridObj.getDataItem(idx);
          return item.id;
        });
    }
  }
    angularGridReady(angularGrid: AngularGridInstance) {
      this.angularGrid = angularGrid
      this.gridObj = (angularGrid && angularGrid.slickGrid) || {}
    }   
}
