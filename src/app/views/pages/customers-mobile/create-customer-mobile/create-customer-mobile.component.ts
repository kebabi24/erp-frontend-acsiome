
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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

  CodeService,
  CustomerMobile,
  CustomerMobileService,
  AddresseMobileService,
  AddresseMobile

} from "../../../../core/erp"
import { config } from 'process';
export type ControlPosition = keyof typeof google.maps.ControlPosition;
@Component({
  selector: 'kt-create-customer-mobile',
  templateUrl: './create-customer-mobile.component.html',
  styleUrls: ['./create-customer-mobile.component.scss']
})
export class CreateCustomerMobileComponent implements OnInit {
  customerMobile: CustomerMobile
  addresseMobile: AddresseMobile
  customerMobileForm: FormGroup
  addresseForm: FormGroup
  hasFormErrors= false
  hasaddresseFormErrors=false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$ : Observable<boolean>
  ad_country: any[] = []
  ad_state: any[] = []
  ad_city: any[] = []
  isExist = false


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
    private customerMobileService: CustomerMobileService,
    // private adresseMobileService: AddresseMobileService,
    private codeService: CodeService,
    private cdr: ChangeDetectorRef,
    config: NgbDropdownConfig
  ) {
    config.autoClose= true
    this.codeService
            .getBy({ code_fldname: "ad_country" })
            .subscribe((response: any) => (this.ad_country = response.data))
   }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.init()
  }

  init(){
    this.createCustomerForm()
    // this.createAddresseMobileForm()
    this.loadingSubject.next(false)
  }



  
  createCustomerForm(){
  //  this.loadingSubject.next(false)
    this.customerMobile = new CustomerMobile()
    this.customerMobileForm = this.formBuilder.group({
      customer_code: [this.customerMobile.customer_code, Validators.required],
      customer_name: [{value : this.customerMobile.customer_name, disabled: !this.isExist}, Validators.required],
      customer_name2: [{value : this.customerMobile.customer_name2, disabled: !this.isExist}], 
      customer_arabic_name: [{value : this.customerMobile.customer_arabic_name, disabled: !this.isExist}], 
      customer_contact: [{value : this.customerMobile.customer_contact, disabled: !this.isExist},Validators.required],
      addresse_one : [{value : this.customerMobile.addresse_one, disabled : !this.isExist}], 
      addresse_two: [{value : this.customerMobile.addresse_two, disabled: !this.isExist}], 
      addresse_extended: [{value : this.customerMobile.addresse_extended, disabled: !this.isExist}], 
      city: [{value : this.customerMobile.city, disabled: !this.isExist}], 
      state: [{value : this.customerMobile.state, disabled: !this.isExist}], 
      postal_code: [{value : this.customerMobile.postal_code, disabled: !this.isExist}], 
      country: [{value : this.customerMobile.country, disabled: !this.isExist}], 
      geoarea_code: [{value : this.customerMobile.geoarea_code, disabled: !this.isExist}], 
      longitude: [{value : this.customerMobile.longitude, disabled: !this.isExist}], 
      latitude: [{value : this.customerMobile.latitude, disabled: !this.isExist}], 
      customer_phone_one: [{value : this.customerMobile.customer_phone_one, disabled: !this.isExist}],
      customer_phone_two: [{value : this.customerMobile.customer_phone_two, disabled: !this.isExist}],
      customer_email: [{value : this.customerMobile.customer_email, disabled: !this.isExist}],
      customer_fax: [{value : this.customerMobile.customer_fax, disabled: !this.isExist}],
      customer_web_adr: [{value : this.customerMobile.customer_web_adr, disabled: !this.isExist}],
      customer_barcode : [{value : this.customerMobile.customer_barcode, disabled : !this.isExist}],
    })

  }

  // createAddresseMobileForm(){
  //   // this.loadingSubject.next(false)
  //    this.addresseMobile = new AddresseMobile()
  //    this.addresseForm = this.formBuilder.group({
  //      //customer_id : [{value : this.addresseMobile.customer_id }], 
      //  addresse_one : [{value : this.addresseMobile.addresse_one, disabled : !this.isExist}], 
      //  addresse_two: [{value : this.addresseMobile.addresse_two, disabled: !this.isExist}], 
      //  addresse_extended: [{value : this.addresseMobile.addresse_extended, disabled: !this.isExist}], 
      //  city: [{value : this.addresseMobile.city, disabled: !this.isExist}], 
      //  state: [{value : this.addresseMobile.state, disabled: !this.isExist}], 
      //  postal_code: [{value : this.addresseMobile.postal_code, disabled: !this.isExist}], 
      //  country: [{value : this.addresseMobile.country, disabled: !this.isExist}], 
      //  geoarea_code: [{value : this.addresseMobile.geoarea_code, disabled: !this.isExist}], 
      //  longitude: [{value : this.addresseMobile.longitude, disabled: !this.isExist}], 
      //  latitude: [{value : this.addresseMobile.latitude, disabled: !this.isExist}], 
  //    })
  //  }
  
  onChangeCode() {
    const controls = this.customerMobileForm.controls
    // const controls1 = this.addresseForm.controls
    this.customerMobileService.getByOne({customer_code: controls.customer_code.value }).subscribe(
        (res: any) => {
          //console.log("aa", res.data);
       
          if (res.data) {
            alert("Ce client exist déja")
            controls.customer_code.setValue(null) 
            document.getElementById("code").focus(); 

          } else { 
            controls.customer_name.enable()
            controls.customer_name2.enable()
            controls.customer_contact.enable()
            controls.customer_arabic_name.enable()
            controls.customer_contact.enable()
            controls.customer_phone_one.enable()
            controls.customer_phone_two.enable()
            controls.customer_email.enable()
            controls.customer_fax.enable()
            controls.customer_web_adr.enable()
            controls.customer_barcode.enable()
            //addresse
            controls.addresse_one.enable()
            controls.addresse_two.enable()
            controls.addresse_extended.enable()
            controls.city.enable()
            controls.state.enable()
            controls.postal_code.enable()
            controls.country.enable()
            controls.geoarea_code.enable()
            controls.longitude.enable()
            controls.latitude.enable()


            
        }
               
    })

  }

  onChangeCustomer() {
    const controls = this.customerMobileForm.controls
    
    this.customerMobileService.getByOne({customer_code: controls.customer_code.value }).subscribe(
        (res: any) => {
          //console.log("aa", res.data);
       
          if (res.data) {
            this.router.navigateByUrl(`/customers-mobile/edit-customer-mobile/${res.data.id}`)
            //console.log(res.data.id)
          }
               
    })

  }
  goBack() {
    //this.loadingSubject.next(false)
    const url = `/customers-mobile`
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }
  reset() {
    this.customerMobile = new CustomerMobile()
    // this.addresseMobile = new AddresseMobile()
    this.createCustomerForm()
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
    const controls = this.customerMobileForm.controls
    // const controls_ = this.addresseForm.controls

    /** check form */
    if (this.customerMobileForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      //this.selectedTab = 0
      return
    }

    let customer = this.prepareCustomerMobile()
        //console.log(this.selectedMenus)
    // let addresse = this.prepareAddresseCustomerMobile()
    this.addCustomerMobile(customer)
  }

  // prepareAddresseCustomerMobile(){
  //   const _controls = this.addresseForm.controls
  //   const _addresseMobile = new AddresseMobile()
  //   const controls = this.customerMobileForm.controls

  //   _addresseMobile.addresse_one = _controls.addresse_one.value
  //   _addresseMobile.addresse_two = _controls.addresse_two.value
  //   _addresseMobile.addresse_extended = _controls.addresse_extended.value
  //   _addresseMobile.city = _controls.city.value
  //   _addresseMobile.state = _controls.state.value
  //   _addresseMobile.postal_code = _controls.postal_code.value
  //   _addresseMobile.country = _controls.country.value
  //   _addresseMobile.geoarea_code = _controls.geoarea_code.value

  //   return _addresseMobile
  // }

  // addAddresseCustomerMobile(_addresseMobile: AddresseMobile) {
  //   //  console.log(_addresseMobile)
  //   this.loadingSubject.next(true)
  //   this.adresseMobileService.addAddress(_addresseMobile).subscribe(
  //       (reponse) => console.log("response", Response),
  //       (error) => {
  //           this.layoutUtilsService.showActionNotification(
  //               "Erreur verifier les informations",
  //               MessageType.Create,
  //               10000,
  //               true,
  //               true
  //           )
  //           //this.loadingSubject.next(false)
  //       },
  //       () =>  {
  //         this.layoutUtilsService.showActionNotification(
  //             "Ajout avec succès",
  //             MessageType.Create,
  //             10000,
  //             true,
  //             true
  //         )
  //         this.loadingSubject.next(false)
  //         this.router.navigateByUrl("/customers-mobile/list-customer-mobile")
  //     }
        
       
  //   )
  //   }

  prepareCustomerMobile(){
    const controls = this.customerMobileForm.controls
    const _customerMobile = new CustomerMobile()
    _customerMobile.customer_code = controls.customer_code.value
    _customerMobile.customer_name = controls.customer_name.value
    _customerMobile.customer_name2 = controls.customer_name2.value
    _customerMobile.customer_arabic_name= controls.customer_arabic_name.value
    _customerMobile.customer_contact = controls.customer_contact.value
    _customerMobile.customer_email = controls.customer_email.value
    _customerMobile.customer_phone_one = controls.customer_phone_one.value
    _customerMobile.customer_phone_two = controls.customer_phone_two.value
    _customerMobile.customer_fax = controls.customer_fax.value
    _customerMobile.customer_web_adr = controls.customer_web_adr.value
    _customerMobile.customer_barcode = controls.customer_barcode.value
    _customerMobile.addresse_one = controls.addresse_one.value
    _customerMobile.addresse_two = controls.addresse_two.value
    _customerMobile.addresse_extended = controls.addresse_extended.value
    _customerMobile.city = controls.city.value
    _customerMobile.state = controls.state.value
    _customerMobile.postal_code = controls.postal_code.value
    _customerMobile.country = controls.country.value
    _customerMobile.geoarea_code = controls.geoarea_code.value


    return _customerMobile
  }


  addCustomerMobile(_customerMobile: CustomerMobile) {
    console.log(_customerMobile)
  }
  onAlertClose($event) {
    this.hasFormErrors = false
}

}
