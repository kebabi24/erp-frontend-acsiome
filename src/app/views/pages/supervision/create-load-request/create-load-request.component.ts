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
  selector: 'kt-create-load-request',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './create-load-request.component.html',
  styleUrls: ['./create-load-request.component.scss']
})
export class CreateLoadRequestComponent implements OnInit {
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
        this.getLoadRequestCreationData()
        this.createForm()
        
  }

  onSubmit() {
    let lines = [] , i = 1;

    let loadRequest = {
      role_code : this.role_code, 
      date_creation : new Date(),
      status : 10 
    }
    
    for(const page of this.loadRequestData ){
      for(const product of page.products){
        if(product.qt_request > 0 && product.qt_request  > 0 ){
          lines.push({
            date_creation : new Date(),
            line : i , 
            product_code : product.product_code , 
            qt_request : product.qt_request,
            qt_validated :product.qt_validated,
            qt_effected : 0,
            pt_price : product.pt_price
          })
          i++;
        }

      }
    }

     this.loadRequestService.createLoadRequestAndLines(loadRequest, lines).subscribe(

       (response: any) => {
         console.log(response)
        this.resetData()
         this.role_code = ""
         this.createForm()
       },
       (error) => {
         console.log(error)
       },
       () => {
         this.layoutUtilsService.showActionNotification(
             "Load Request created",
             MessageType.Create,
             10000,
             true,
             true
         )
         this.loadingSubject.next(false)
         this.router.navigateByUrl("/supervision/create-load-request")
     }
     )

  }

  goBack() {
    this.loadingSubject.next(false)
    const url = `/service`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
}

resetData(){
  for(const page of this.loadRequestData ){
    for(const product of page.products){
       product.qt_request= 0 
      product.qt_validated = 0
    }
  }
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
// prepareLoadRequets(role_code){
//   this.loadRequestService.getLoadRequests(role_code).subscribe(
      
//       (response: any) => {
//         this.loadRequests = response.data
       
//       },
//       (error) => {
//           this.loadRequests = []
//       },
//       () => {}
//   )
// }

// GET DATA OF THE SELECTED LOADREQUEST
getLoadRequestCreationData(){
  this.loadRequestService.getLoadRequestCreationData().subscribe(

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
  this.role_code = role_code
  // this.prepareLoadRequets(role_code)
}

// onSelectLoadRequest(load_request_code){
//   this.prepareLoadRequestData(load_request_code)
//   this.load_request_code = load_request_code
// }

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
  this.loadRequestData[indexPage].products[indexProduct].qt_request = this.loadRequestData[indexPage].products[indexProduct].qt_validated
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
