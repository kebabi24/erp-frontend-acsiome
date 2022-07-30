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
     const id =  this.customerMobileEdit.id

    //  let customer = this.prepareCustomer()
    //  this.addCustomer(id, customer)

  }

  goBack() {
    this.loadingSubject.next(false);
    const url = `/`;
    this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  }

  // prepareCustomer(): CustomerMobile {
  //   // console.log('aaa')

  //   const controls = this.customerMobileForm.controls;
  //   const _customer = new CustomerMobile();
  //   _customer.profile_code = controls.profile_code.value;
  //   _customer.profile_name = controls.profile_name.value;
  //   _customer.profile_valid_date = controls.profile_valid_date.value
  //     ? `${controls.profile_valid_date.value.year}/${controls.profile_valid_date.value.month}/${controls.profile_valid_date.value.day}`
  //     : null;
  //   _customer.profile_exp_date = controls.profile_exp_date.value
  //     ? `${controls.profile_exp_date.value.year}/${controls.profile_exp_date.value.month}/${controls.profile_exp_date.value.day}`
  //     : null;
    

  //   return _profile;
  // }
}
