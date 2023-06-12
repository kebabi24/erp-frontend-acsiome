import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { UnloadRequestService, MobileService, RoleService, ItineraryService,LoadRequestService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
@Component({
  selector: 'kt-validate-charge-demande',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './validate-decharge-demande.component.html',
  styleUrls: ['./validate-decharge-demande.component.scss']
})
export class ValidateDeChargeDemandeComponent implements OnInit {
  service: MobileService
  validationForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  
  role_code : any
  load_request_code : any
  unload_request_code : any

  roles: any[] = []
  loadRequests: any[] = []
  unloadRequests: any[] = []
  loadRequestData: any[] = []
  unloadRequestData: any[] = []
  displayData : any = false

  constructor(
    config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private loadRequestService : LoadRequestService,
        private unloadRequestService : UnloadRequestService,
        private layoutUtilsService: LayoutUtilsService,
  ) { 
        config.autoClose = true   
  }
 

  ngOnInit(): void {
        this.loading$ = this.loadingSubject.asObservable()
        this.loadingSubject.next(false)
        this.prepareRoles()
        this.createForm()
        
  }

  onSubmit() {

    this.unloadRequestService.updateUnloadRequestStatus10(this.unload_request_code, this.unloadRequestData).subscribe(

      (response: any) => {
        console.log(response)
        this.unloadRequestData = []
        this.unload_request_code = ""
        this.role_code = ""
        this.createForm()
        this.displayData = false
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "unload Request updated",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        this.router.navigateByUrl("/supervision/validate-decharge-demande")
    }
    )

  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

// GET ROLES OF THE SUPERVISOR
prepareRoles(){
  this.unloadRequestService.getRoles('administrateur').subscribe(
      
      (response: any) => {
        this.roles = response.data
      },
      (error) => {
        this.roles = []
      },
      () => {}
  )
}

// GET LOAD REQUESTS STATUS 0 OF THE SELECTED ROLE
prepareunLoadRequets(role_code){
  this.unloadRequestService.getUnloadRequests(role_code).subscribe(
      
      (response: any) => {
        this.unloadRequests = response.data
       
      },
      (error) => {
          this.unloadRequests = []
      },
      () => {}
  )
}

// GET DATA OF THE SELECTED LOADREQUEST
prepareLoadRequestData(unload_request_data){
  this.unloadRequestService.getUnloadRequestData(unload_request_data).subscribe(

      (response: any) => {
        this.unloadRequestData = response.unloadRequestData
        this.displayData = true
      },
      (error) => {
        this.unloadRequestData = []
      },
      () => {}
  )
}



onSelectRole(role_code){
  this.prepareunLoadRequets(role_code)
}

onSelectLoadRequest(unload_request_code){
  this.prepareLoadRequestData(unload_request_code)
  this.unload_request_code = unload_request_code
}

onInputChanged(p_code, lot,value){
  console.log('value:' + value)
  const indexProduct = this.unloadRequestData.findIndex(detail=>{
    return detail.product_code  === p_code && detail.lot === lot
  })
  this.unloadRequestData[indexProduct].qt_effected = value
  console.log(this.unloadRequestData[indexProduct])
}

createForm() {
  this.loadingSubject.next(false)
  this.validationForm = this.profileFB.group({
    role_code :[this.role_code],
    unload_request_code:[this.unload_request_code]
  })
}
}
