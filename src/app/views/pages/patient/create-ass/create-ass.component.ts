import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
// Angular slickgrid
import { HttpClient } from "@angular/common/http"
import {
  Column,
  GridOption,
  Formatter,
  Editor,
  Editors,
  AngularGridInstance,
  GridService,
  Formatters,
  FieldType,
  OnEventArgs,
} from "angular-slickgrid";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { Observable, BehaviorSubject, Subscription, of } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
// Layout
import {
    SubheaderService,
    LayoutConfigService,
} from "../../../../core/_base/layout"
// CRUD
import {
    LayoutUtilsService,
    TypesUtilsService,
    MessageType,
} from "../../../../core/_base/crud"
import { MatDialog } from "@angular/material/dialog"

import { Association, AssociationService, CodeService,UsersService} from "../../../../core/erp"
import { HttpUtilsService } from "../../../../core/_base/crud"
import { environment } from "../../../../../environments/environment"
import { array } from "@amcharts/amcharts4/core";
const API_URL = environment.apiUrl + "/codes"

@Component({
  selector: 'kt-create-ass',
  templateUrl: './create-ass.component.html',
  styleUrls: ['./create-ass.component.scss']
})
export class CreateAssComponent implements OnInit {

  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>


  association: Association;
  assForm: FormGroup
  hasFormErrors = false
  hasEmployeErrors = false
  isExist = false
  
  error = false
  field = ""
  selectedTab = 0
  
  
   
    hasEmployeFormErrors = false

  // grid options
  

    ass_city: any[] = []
    ass_state: any[] = []
    ass_county: any[] = []
    ass_country: any[] = []
    row_number;
    httpOptions = this.httpUtils.getHTTPHeaders()
    leveljbd = [];
  leveljob = []
  constructor(
      config: NgbDropdownConfig,
      private assFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public  dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private modalService: NgbModal,
      private associationService: AssociationService,
      private codeService: CodeService,
      private http: HttpClient,
      private httpUtils: HttpUtilsService,
      private userService: UsersService,
    
      
  ) {
      config.autoClose = true
      this.codeService
      .getBy({ code_fldname: "ad_state" })
      .subscribe((response: any) => (this.ass_state = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_country" })
      .subscribe((response: any) => (this.ass_country = response.data))
  this.codeService
      .getBy({ code_fldname: "ad_county" })
      .subscribe((response: any) => (this.ass_county = response.data))
      this.codeService
      .getBy({ code_fldname: "ad_city" })
      .subscribe((response: any) => (this.ass_city = response.data))
  

  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.association = new Association()
  
  this.assForm = this.assFB.group({
      ass_code: [this.association.ass_code, Validators.required],
      ass_name: [
          { value: this.association.ass_name, disabled: !this.isExist },
          Validators.required,
      ],
      ass_line1:  [{ value: this.association.ass_line1, disabled: !this.isExist }, Validators.required,],
      ass_country: [{ value: this.association.ass_country, disabled: !this.isExist }],
      ass_city: [{ value: this.association.ass_city, disabled: !this.isExist }],
      
      ass_state: [{ value: this.association.ass_state, disabled: !this.isExist }],

      ass_zip: [{ value: this.association.ass_zip, disabled: !this.isExist }],
      ass_phone: [{ value: this.association.ass_phone, disabled: !this.isExist }],
      ass_fax: [{ value: this.association.ass_fax, disabled: !this.isExist }],
      ass_mail: [{ value: this.association.ass_mail, disabled: !this.isExist }],
    
      ass_contact_fname:  [{ value: this.association.ass_contact_fname, disabled: !this.isExist }],
      ass_contact_lname:  [{ value: this.association.ass_contact_lname, disabled: !this.isExist }],
      ass_contact_adress: [{ value: this.association.ass_contact_adress, disabled: !this.isExist }],
      ass_contact_tel: [{ value: this.association.ass_contact_tel, disabled: !this.isExist }],
     

  })
}

onChangeCode() {
  const controls = this.assForm.controls
  this.associationService
      .getBy({
            ass_code: controls.ass_code.value,
      })
      .subscribe((response: any) => {
          if (response.data.length) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.ass_name.enable()
             
              controls.ass_line1.enable()  
              controls.ass_country.enable()
              controls.ass_city.enable()
              controls.ass_state.enable()
              controls.ass_zip.enable()
              controls.ass_phone.enable()
              controls.ass_fax.enable()
              controls.ass_mail.enable()
              // controls.ass_site.enable()
              controls.ass_contact_fname.enable()
              controls.ass_contact_lname.enable()
              controls.ass_contact_adress.enable()
              controls.ass_contact_tel.enable()
             
          }
   })
}

//reste form
reset() {
  this.association = new Association()
  this.createForm()
  this.hasFormErrors = false
  
}
// save data
onSubmit() {
  this.hasFormErrors = false
  
  const controls = this.assForm.controls
  /** check form */
  if (this.assForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      
      this.selectedTab = 0
      
      return
  }
  

  // tslint:disable-next-line:prefer-const
  let ass = this.prepareCode()

  
  this.addAssociation(ass)
  
}
/**
     * Returns object for saving
     */
    prepareCode(): Association {
      const controls = this.assForm.controls
      const _association = new Association()
      _association.ass_code = controls.ass_code.value
      _association.ass_name = controls.ass_name.value
      
      _association.ass_line1 = controls.ass_line1.value
      
      _association.ass_country = controls.ass_country.value
      _association.ass_city = controls.ass_city.value
      
      _association.ass_state = controls.ass_state.value
      _association.ass_zip =  controls.ass_zip.value

      _association.ass_phone = controls.ass_phone.value
      _association.ass_fax = controls.ass_fax.value
      _association.ass_mail = controls.ass_mail.value




      _association.ass_contact_fname = controls.ass_contact_fname.value
      _association.ass_contact_lname = controls.ass_contact_lname.value
      _association.ass_contact_adress = controls.ass_contact_adress.value
      _association.ass_contact_tel = controls.ass_contact_tel.value
      

      return _association
  }
  onChangeState() {
    const controls  = this.assForm.controls
  
    this.codeService
        .getBy({ code_fldname: "ad_city", chr01: controls.ass_state.value.substring(0, 2) })
        .subscribe((response: any) => {(this.ass_city = response.data)
        })    
}
/**
     * Add code
     *
     
     */
    addAssociation(_association: Association) {
      const controls = this.assForm.controls
      this.loadingSubject.next(true)
      
      this.associationService.add( _association ).subscribe(
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
              this.reset()
              this.router.navigateByUrl("/patient/create-ass")
          }
      )
  }


 

 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/patient/list-ass`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }






/**
     * Close alert
     *
     * @param $event
     */
 onAlertClose($event) {
  this.hasFormErrors = false
}



}
