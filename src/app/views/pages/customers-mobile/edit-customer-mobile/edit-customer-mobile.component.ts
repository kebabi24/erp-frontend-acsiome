import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerMobile, CustomerMobileService, MobileMenuService, UsersMobileService } from 'src/app/core/erp';
import { LayoutUtilsService } from 'src/app/core/_base/crud';

@Component({
  selector: 'kt-edit-customer-mobile',
  templateUrl: './edit-customer-mobile.component.html',
  styleUrls: ['./edit-customer-mobile.component.scss']
})
export class EditCustomerMobileComponent implements OnInit {
  customer: CustomerMobile;
  customerMobileForm: FormGroup;
  hasFormErrors = false;
  isExist = false;
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$: Observable<boolean>;
  prf: any;
  message: string;
  customerMobileEdit: any
  constructor(
    config: NgbDropdownConfig,
    private customerFB: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private customerMobileService: CustomerMobileService,
  ) { 
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
    const customer_code = params.customer_code
    this.customerMobileService.getOne(customer_code).subscribe((response: any)=>{
    this.customerMobileEdit = response.data
    this.initCode()
    this.loadingSubject.next(false)
    //this.title = this.title + this.userMobileEdit.username
      })
  })
  }

  initCode() {
    //this.createForm()
    this.loadingSubject.next(false)
  }

  createForm() {
    this.loadingSubject.next(false);
    this.customerMobileForm = this.customerFB.group({
      customer_code: [this.customerMobileEdit.customer_code, Validators.required],
      customer_name: [{value : this.customerMobileEdit.customer_name, disabled: !this.isExist}, Validators.required],
      customer_name2: [{value : this.customerMobileEdit.customer_name2, disabled: !this.isExist}], 
      customer_arabic_name: [{value : this.customerMobileEdit.customer_arabic_name, disabled: !this.isExist}], 
      customer_contact: [{value : this.customerMobileEdit.customer_contact, disabled: !this.isExist},Validators.required],
      addresse_one : [{value : this.customerMobileEdit.addresse_one, disabled : !this.isExist}], 
      addresse_two: [{value : this.customerMobileEdit.addresse_two, disabled: !this.isExist}], 
      addresse_extended: [{value : this.customerMobileEdit.addresse_extended, disabled: !this.isExist}], 
      city: [{value : this.customerMobileEdit.city, disabled: !this.isExist}], 
      state: [{value : this.customerMobileEdit.state, disabled: !this.isExist}], 
      postal_code: [{value : this.customerMobileEdit.postal_code, disabled: !this.isExist}], 
      country: [{value : this.customerMobileEdit.country, disabled: !this.isExist}], 
      geoarea_code: [{value : this.customerMobileEdit.geoarea_code, disabled: !this.isExist}], 
      longitude: [{value : this.customerMobileEdit.longitude, disabled: !this.isExist}], 
      latitude: [{value : this.customerMobileEdit.latitude, disabled: !this.isExist}], 
      customer_phone_one: [{value : this.customerMobileEdit.customer_phone_one, disabled: !this.isExist}],
      customer_phone_two: [{value : this.customerMobileEdit.customer_phone_two, disabled: !this.isExist}],
      customer_email: [{value : this.customerMobileEdit.customer_email, disabled: !this.isExist}],
      customer_fax: [{value : this.customerMobileEdit.customer_fax, disabled: !this.isExist}],
      customer_web_adr: [{value : this.customerMobileEdit.customer_web_adr, disabled: !this.isExist}],
      customer_barcode : [{value : this.customerMobileEdit.customer_barcode, disabled : !this.isExist}],
    });
  }

  reset() {
    this.customer = new CustomerMobile();
    this.createForm();
    this.hasFormErrors = false;
  }

  onSubmit() {
    this.hasFormErrors = false
    const controls = this.customerMobileForm.controls
    /** check form */
    if (this.customerMobileForm.invalid) {
        Object.keys(controls).forEach((controlName) =>
            controls[controlName].markAsTouched()
        )

        this.message = "Modifiez quelques éléments et réessayez de soumettre.";
        this.hasFormErrors = true;
  
        return
    }

     // tslint:disable-next-line:prefer-const
     const customer_code =  this.customerMobileEdit.customer_code

     let customer = this.prepareCustomerMobile()
    //  this.addCustomerMobile(customer_code, customer)

  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  prepareCustomerMobile(): CustomerMobile {
    // console.log('aaa')

    const controls = this.customerMobileForm.controls;
    const _customerMobile = new CustomerMobile();
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
  /** 
  * Add profile
  *
  * @param _customerMobile: CustomerMobileModel
  */
  //  addCustomerMobile(customer_code, _customerMobile: CustomerMobile) {
  //  this.loadingSubject.next(true);
  //  this.customerMobileService.update(id, _profile).subscribe(
  //    (reponse) => console.log("response", Response),
  //    (error) => {
  //      this.layoutUtilsService.showActionNotification(
  //        "Erreur verifier les informations",
  //        MessageType.Create,
  //        10000,
  //        true,
  //        true
  //      );
  //      this.loadingSubject.next(false);
  //    },
  //    () => {
  //      this.layoutUtilsService.showActionNotification(
  //        "modifié avec succès",
  //        MessageType.Create,
  //        10000,
  //        true,
  //        true
  //      );
  //      this.loadingSubject.next(false);
  //      this.router.navigateByUrl("/");
  //    }
  //  );
  // }
}
