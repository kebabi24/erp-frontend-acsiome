import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import { AngularGridInstance, Column, FieldType, GridOption, OnEventArgs, GridService, Editors, thousandSeparatorFormatted, Formatters } from 'angular-slickgrid';

import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { MobileServiceService, MobileService, RoleService, ItineraryService,LoadRequestService } from "../../../../core/erp"
import {   MobileSettingsService} from "../../../../core/erp"
@Component({
  selector: 'kt-validate-charge-demande',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './validate-charge-demande.component.html',
  styleUrls: ['./validate-charge-demande.component.scss']
})
export class ValidateChargeDemandeComponent implements OnInit {
  service: MobileService
  validationForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>
  
  role_code : any
  load_request_code : any
  roles: any[] = []
  loadRequests: any[] = []
  loadRequestData: any[] = []

  constructor(
    config: NgbDropdownConfig,
        private profileFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private loadRequestService : LoadRequestService,
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

    this.loadRequestService.updateLoadRequestStatus10(this.load_request_code, this.loadRequestData).subscribe(

      (response: any) => {
        console.log(response)
        this.loadRequestData = []
        this.load_request_code = ""
        this.role_code = ""
        this.createForm()
      },
      (error) => {
        // this.loadRequestData = []
        console.log(error)
      },
      () => {
        this.layoutUtilsService.showActionNotification(
            "Load Request updated",
            MessageType.Create,
            10000,
            true,
            true
        )
        this.loadingSubject.next(false)
        this.router.navigateByUrl("/supervision/validate-charge-demande")
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
  this.loadRequestService.getRoles('administrateur').subscribe(
      
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
prepareLoadRequets(role_code){
  this.loadRequestService.getLoadRequests(role_code).subscribe(
      
      (response: any) => {
        this.loadRequests = response.data
       
      },
      (error) => {
          this.loadRequests = []
      },
      () => {}
  )
}

// GET DATA OF THE SELECTED LOADREQUEST
prepareLoadRequestData(load_request_data){
  this.loadRequestService.getLoadRequestData(load_request_data).subscribe(

      (response: any) => {
        this.loadRequestData = response.loadRequestData
        console.log(response.loadRequestData)
      },
      (error) => {
        this.loadRequestData = []
      },
      () => {}
  )
}



onSelectRole(role_code){
  this.prepareLoadRequets(role_code)
}

onSelectLoadRequest(load_request_code){
  this.prepareLoadRequestData(load_request_code)
  this.load_request_code = load_request_code
}

onInputChanged(pageCode,prodCode,value){
  console.log('value:' + value)
  const indexPage = this.loadRequestData.findIndex(loadRequest=>{
    return loadRequest.page_code  === pageCode
  })
  console.log('pageCodeIndex:' + indexPage)
  const indexProduct = this.loadRequestData[indexPage].products.findIndex(product=>{
    return product.product_code === prodCode
  })
  console.log('prodCodeIndex:' + indexProduct)
  this.loadRequestData[indexPage].products[indexProduct].qt_validated = +value
  console.log(this.loadRequestData[indexPage].products[indexProduct])
  
 
}

createForm() {
  this.loadingSubject.next(false)
  this.validationForm = this.profileFB.group({
    role_code :[this.role_code],
    load_request_code:[this.load_request_code]
  })
}
}
