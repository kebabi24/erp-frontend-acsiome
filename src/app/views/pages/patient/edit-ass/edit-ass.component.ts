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
  selector: 'kt-edit-ass',
  templateUrl: './edit-ass.component.html',
  styleUrls: ['./edit-ass.component.scss']
})
export class EditAssComponent implements OnInit {

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

  associationEdit:any
    title: String = 'Modifier Association - '

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
    this.loadingSubject.next(true)
    this.activatedRoute.params.subscribe((params) => {
        const id = params.id
        this.associationService.getOne(id).subscribe((response: any)=>{
          this.associationEdit = response.data
          this.initCode()
          this.loadingSubject.next(false)
          this.title = this.title + this.associationEdit.ass_code
        })
    })
  }
  initCode() {
    this.createForm()
   
    this.loadingSubject.next(false)
  }
//create form
createForm() {
  this.loadingSubject.next(false)

 
  this.assForm = this.assFB.group({
      ass_code: [this.associationEdit.ass_code],
      ass_name: [
          this.associationEdit.ass_name,
          Validators.required,
      ],
      ass_line1:  [this.associationEdit.ass_line1, Validators.required,],
      ass_country: [this.associationEdit.ass_country],
      ass_city: [this.associationEdit.ass_city],
      
      ass_state: [this.associationEdit.ass_state],

      ass_zip: [this.associationEdit.ass_zip],
      ass_phone: [this.associationEdit.ass_phone],
      ass_fax: [this.associationEdit.ass_fax],
      ass_mail: [this.associationEdit.ass_mail],
    
      ass_contact_fname:  [this.associationEdit.ass_contact_fname],
      ass_contact_lname:  [this.associationEdit.ass_contact_lname],
      ass_contact_adress: [this.associationEdit.ass_contact_adress],
      ass_contact_tel: [this.associationEdit.ass_contact_tel],
     

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
      
      this.associationService.update(this.associationEdit.id, _association ).subscribe(
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
            
              this.router.navigateByUrl("/patient/update-ass")
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
