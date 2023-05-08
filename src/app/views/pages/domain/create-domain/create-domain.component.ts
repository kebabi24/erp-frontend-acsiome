import { Component, OnInit } from "@angular/core"
import { NgbDropdownConfig, NgbTabsetConfig } from "@ng-bootstrap/ng-bootstrap"

// Angular slickgrid
import {
    Column,
    GridOption,
    Formatter,
    Editor,
    Editors,
} from "angular-slickgrid"
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

import { Domain, DomainService } from "../../../../core/erp"
@Component({
  selector: 'kt-create-domain',
  templateUrl: './create-domain.component.html',
  styleUrls: ['./create-domain.component.scss']
})
export class CreateDomainComponent implements OnInit {
  domain: Domain
  domForm: FormGroup
  hasFormErrors = false
  isExist = false
  loadingSubject = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean>

  constructor(
      config: NgbDropdownConfig,
      private domFB: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialog: MatDialog,
      private layoutUtilsService: LayoutUtilsService,
      private domainService: DomainService
  ) {
      config.autoClose = true
  }
  ngOnInit(): void {
    this.loading$ = this.loadingSubject.asObservable()
    this.loadingSubject.next(false)
    this.createForm()
}
//create form
createForm() {
  this.loadingSubject.next(false)

  this.domain = new Domain()
  this.domForm = this.domFB.group({
      dom_domain: [this.domain.dom_domain, Validators.required],
      dom_name: [
          { value: this.domain.dom_name, disabled: !this.isExist },
          Validators.required,
      ],
      dom_sname: [
        { value: this.domain.dom_sname, disabled: !this.isExist },
        Validators.required,
    ],
    

    dom_addr: [{ value: this.domain.dom_addr, disabled: !this.isExist }],
    dom_city: [{ value: this.domain.dom_city, disabled: !this.isExist }],

    dom_rc: [{ value: this.domain.dom_rc, disabled: !this.isExist }],
    dom_nif: [{ value: this.domain.dom_nif, disabled: !this.isExist }],
    dom_nis: [{ value: this.domain.dom_nis, disabled: !this.isExist }],
    dom_ai: [{ value: this.domain.dom_ai, disabled: !this.isExist }],

    dom_email: [{ value: this.domain.dom_email, disabled: !this.isExist }],
    dom_web: [{ value: this.domain.dom_web, disabled: !this.isExist }],
    
    dom_bank1: [{ value: this.domain.dom_bank1, disabled: !this.isExist }],
    dom_rib1: [{ value: this.domain.dom_rib1, disabled: !this.isExist }],
    dom_bank2: [{ value: this.domain.dom_bank2, disabled: !this.isExist }],
    dom_rib2: [{ value: this.domain.dom_rib2, disabled: !this.isExist }],

    dom_tel1: [{ value: this.domain.dom_tel1, disabled: !this.isExist }],
    dom_tel2: [{ value: this.domain.dom_tel2, disabled: !this.isExist }],
    
    dom_fax: [{ value: this.domain.dom_fax, disabled: !this.isExist }],
    dom_active: [{ value: this.domain.dom_active, disabled: !this.isExist }],
      
  })
}

onChangeCode() {
  const controls = this.domForm.controls
  this.domainService
      .getBy({
            dom_domain: controls.dom_domain.value,
      })
      .subscribe((response: any) => {
          console.log(response.data)
          if (response.data) {
              this.isExist = true
              console.log(response.data.length)
          } else {
              controls.dom_name.enable()
              controls.dom_sname.enable()
              controls.dom_addr.enable()

              controls.dom_city.enable()
              controls.dom_rc.enable()
              controls.dom_nif.enable()
              controls.dom_nis.enable()
              controls.dom_ai.enable()
              
              controls.dom_bank1.enable()
              controls.dom_rib1.enable()
              controls.dom_bank2.enable()
              controls.dom_rib2.enable()
          
              controls.dom_tel1.enable()
              controls.dom_tel2.enable()
              
              controls.dom_email.enable()
              controls.dom_web.enable()

              controls.dom_fax.enable()
              controls.dom_active.enable()
          }
   })
}
//reste form
reset() {
  this.domain = new Domain()
  this.createForm()
  this.hasFormErrors = false
}
// save data
onSubmit() {
  this.hasFormErrors = false
  const controls = this.domForm.controls
  /** check form */
  if (this.domForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
      )

      this.hasFormErrors = true
      return
  }

  // tslint:disable-next-line:prefer-const
  let domain = this.prepareDomain()
  this.addDomain(domain)
}
/**
     * Returns object for saving
     */
    prepareDomain(): Domain {
      const controls = this.domForm.controls
      const _domain = new Domain()
      _domain.dom_domain = controls.dom_domain.value
      _domain.dom_name = controls.dom_name.value
      _domain.dom_sname = controls.dom_sname.value
      _domain.dom_addr = controls.dom_addr.value
      _domain.dom_city = controls.dom_city.value
      _domain.dom_rc = controls.dom_rc.value
      _domain.dom_nif = controls.dom_nif.value
      _domain.dom_nis = controls.dom_nis.value
      _domain.dom_ai = controls.dom_ai.value


      _domain.dom_bank1 = controls.dom_bank1.value
      _domain.dom_rib1 = controls.dom_rib1.value
      _domain.dom_bank2 = controls.dom_bank2.value
      _domain.dom_rib2 = controls.dom_rib2.value
  
      _domain.dom_tel1 = controls.dom_tel1.value
      _domain.dom_tel2 = controls.dom_tel2.value
      
      _domain.dom_email = controls.dom_email.value
      _domain.dom_web = controls.dom_web.value
      
      _domain.dom_fax =  controls.dom_fax.value
      _domain.dom_active = controls.dom_active.value
      return _domain
  }
/**
     * Add code
     *
     * @param _domain: DeviseModel
     */
    addDomain(_domain: Domain) {
      this.loadingSubject.next(true)
      this.domainService.add(_domain).subscribe(
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
              this.router.navigateByUrl("/domain/create-domain")
          }
      )
  }


 /**
     * Go back to the list
     *
     */
    goBack() {
      this.loadingSubject.next(false)
      const url = `/domain/create-domain`
      this.router.navigateByUrl(url, { relativeTo: this.activatedRoute })
  }



}
