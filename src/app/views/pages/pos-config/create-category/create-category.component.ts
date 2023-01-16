
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Column, GridOption, AngularGridInstance, FieldType} from "angular-slickgrid"
import { ActivatedRoute, Router } from "@angular/router"
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"

import { Category } from "../../../../core/erp/_models/pos-categories.model";
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

  CodeService,
  CustomerMobile,
  PosCategoryService,
  CustomerMobileService,
  AddresseMobile

} from "../../../../core/erp"
import { config } from 'process';
export type ControlPosition = keyof typeof google.maps.ControlPosition;
@Component({
  selector: 'kt-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {
  posCategory : Category
  categoryForm: FormGroup
  hasFormErrors= false
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>
  isExist = false


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private customerMobileService: CustomerMobileService,
    private posCategoryService: PosCategoryService,
    private cdr: ChangeDetectorRef,
    config: NgbDropdownConfig
  ) {
    config.autoClose= true
   }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.init()
  }

  init(){
    this.createCategoryForm()
    // this.createAddresseMobileForm()
    this.loadingSubject.next(false)
  }



  
  createCategoryForm(){
  
    this.categoryForm = this.formBuilder.group({
      category_code: ['', Validators.required],
      category_name: [{value : '', disabled: !this.isExist}, Validators.required],
      image_path: [{value : '', disabled: !this.isExist}], 
      order: [{value : '', disabled: !this.isExist},Validators.required],
      direct: [{value : '', disabled: !this.isExist}],
      
    })

  }

  
  
  onChangeCode() {
    const controls = this.categoryForm.controls
    const category_code = controls.category_code.value
    this.posCategoryService.getOnByCode(category_code).subscribe(
        (res: any) => {
          if (res.data) {
            alert("Ce code catégorie  exist déja")
            document.getElementById("code").focus(); 
          } else { 
            console.log('code do not exist ')
            controls.category_name.enable()
            controls.image_path.enable()
            controls.order.enable()
            controls.direct.enable()
          
        }
               
    })
  }

  
  goBack() {
    //this.loadingSubject.next(false)
    const url = `/customers-mobile`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  reset() {
    // this.customerMobile = new CustomerMobile()
    // this.addresseMobile = new AddresseMobile()
    this.createCategoryForm()
    // this.createAddresseMobileForm()
    this.hasFormErrors = false
  }

  /**
      * Save data
      *
      * @param withBack: boolean
      */
   onSubmit() {
    this.hasFormErrors = false
    const controls = this.categoryForm.controls
    // const controls_ = this.addresseForm.controls

    /** check form */
    if (this.categoryForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      //this.selectedTab = 0
      return
    }

    const categoryData = {
      category_code : controls.category_code.value,
      category_name : controls.category_name.value,
      category_img  : controls.image_path.value,
      rang : controls.order.value,
      direct : controls.direct.value 

    }

    // let customer = this.prepareCustomerMobile()
        //console.log(this.selectedMenus)
    // let addresse = this.prepareAddresseCustomerMobile()
    // this.addCustomerMobile(customer)
    this.posCategoryService
      .add(categoryData)

      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (err) =>
          this.layoutUtilsService.showActionNotification(
            "Erreur lors de l'ajout de la catégorie",
            MessageType.Create,
            10000,
            true,
            true
          ),
        () => {
          this.layoutUtilsService.showActionNotification(
            "Catégorie ajoutée avec succès",
            MessageType.Create,
            10000,
            true,
            true
          );
          this.router.navigateByUrl("/pos-config/list-category");
        }
      );
  }



  prepareCustomerMobile(){
    const controls = this.categoryForm.controls
     const _customerMobile = new CustomerMobile()
    // _customerMobile.customer_code = controls.customer_code.value
    // _customerMobile.customer_name = controls.customer_name.value
    // _customerMobile.customer_name2 = controls.customer_name2.value
    // _customerMobile.customer_contact = controls.customer_contact.value
    // _customerMobile.customer_phone_one = controls.customer_phone_one.value
    
    return _customerMobile
  }


  addCustomerMobile(customer_mobile: CustomerMobile) {
    this.loadingSubject.next(true)
        this.customerMobileService.addCustomerMobile(customer_mobile).subscribe(
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
                this.router.navigateByUrl("/customers-mobile/list-customer-mobile")
            }
        )
  }
  onAlertClose($event) {
    this.hasFormErrors = false
  }

}
