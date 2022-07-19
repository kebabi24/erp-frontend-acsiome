import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { Column, AngularGridInstance, FieldType, GridOption } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService } from "../../../../core/erp"
@Component({
  selector: 'kt-create-new-service',
  templateUrl: './create-new-service.component.html',
  styleUrls: ['./create-new-service.component.scss']
})
export class CreateNewServiceComponent implements OnInit {
  service: MobileService
  serviceForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  services: []
  roles : string[] = []
  itinerary: string[] = []

  columnDefinitions: Column[] = []
  gridOptions: GridOption = {}
  gridObj: any
  angularGrid: AngularGridInstance
  message: any
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
        private modalService: NgbModal
  ) { 
        config.autoClose = true
        this.roleService
          .getAllRoles()
          .subscribe((response: any) => this.roles = response.data)
        this.itineraryService
          .getAllItinerary()
          .subscribe((response: any) => this.itinerary = response.data)

  }

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.createForm()
  }

  createForm() {
    this.loadingSubject.next(false)

    this.service = new MobileService()
    this.serviceForm = this.serviceF.group({
        service_period_activate_date: [this.service.service_period_activate_date, Validators.required],
        service_creation_date: [{value: this.service.service_creation_date}, Validators.required],
        service_closing_date: [{value: this.service.service_closing_date}, Validators.required],
        service_roleId: [{value: this.service.service_roleId}, Validators.required],
        service_itineraryId: [{value: this.service.service_itineraryId}, Validators.required],
        service_open: [{value: this.service.service_open}, Validators.required],
        
    })
  }

  reset() {
    this.service = new MobileService()
    this.createForm()
    this.hasFormErrors = false
  }

  onSubmit() {
    this.hasFormErrors = false
    const controls = this.serviceForm.controls
    /** check form */
    if (this.serviceForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.hasFormErrors = true
        return
    }
    

    // tslint:disable-next-line:prefer-const
    let service = this.prepareService()
    this.addItinerary(service)
    }

  prepareService() : MobileService{

    const controls = this.serviceForm.controls
    const _service = new MobileService()

    _service.service_period_activate_date = controls.service_period_activate_date.value
    _service.service_creation_date = controls.service_creation_date.value
    _service.service_closing_date = controls.service_closing_date.value
    _service.service_roleId = controls.service_roleId.value
    _service.service_itineraryId = controls.service_itineraryId.value
    _service.service_open = controls.service_open.value
    return _service

  }

  addItinerary(_service: MobileService){
    this.loadingSubject.next(true)
        this.mobileService.addService(_service).subscribe(
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
            this.router.navigateByUrl("/service")

        
        }
        )
  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

 

}
